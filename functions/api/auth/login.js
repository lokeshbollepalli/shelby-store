import { sign, b64url } from '../../lib/auth.js';
const json=(data,status=200,headers={})=>Response.json(data,{status,headers});
async function digest(value){return new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value)));}
async function sameSecret(candidate,expected,secret){const a=await sign(candidate,secret),b=await sign(expected,secret);if(a.length!==b.length)return false;let diff=0;for(let i=0;i<a.length;i++)diff|=a[i]^b[i];return diff===0;}
export async function onRequestPost({request,env}){
 const url=new URL(request.url);if(request.headers.get('Origin')!==url.origin)return json({error:'Request origin rejected.'},403);
 if(!env.ADMIN_PASSWORD||env.ADMIN_PASSWORD.length<12||!env.SESSION_SECRET||env.SESSION_SECRET.length<32)return json({error:'Set an admin password of at least 12 characters and a session secret of at least 32 characters in Cloudflare.'},503);
 let body;try{body=await request.json();}catch{return json({error:'Enter your admin password.'},400);}const password=String(body.password||'');if(!password||password.length>256)return json({error:'Enter your admin password.'},400);
 const ip=request.headers.get('CF-Connecting-IP')||'unknown';const ipHash=Array.from(await digest(ip)).map(x=>x.toString(16).padStart(2,'0')).join('');
 const count=await env.DB.prepare("SELECT COUNT(*) AS total FROM admin_login_attempts WHERE ip_hash=? AND created_at >= datetime('now','-15 minutes')").bind(ipHash).first();
 if(Number(count?.total||0)>=8)return json({error:'Too many attempts. Wait 15 minutes and try again.'},429);
 const ok=await sameSecret(password,env.ADMIN_PASSWORD,env.SESSION_SECRET);
 if(!ok){await env.DB.prepare('INSERT INTO admin_login_attempts (ip_hash) VALUES (?)').bind(ipHash).run();return json({error:'Incorrect admin password.'},401);}
 await env.DB.prepare('DELETE FROM admin_login_attempts WHERE ip_hash=?').bind(ipHash).run();
 const now=Math.floor(Date.now()/1000);const payload=b64url(new TextEncoder().encode(JSON.stringify({sub:'admin',iat:now,exp:now+43200})));const signature=b64url(await sign(payload,env.SESSION_SECRET));
 return json({success:true},200,{'Set-Cookie':`shelby_admin=${payload}.${signature}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=43200`,'Cache-Control':'no-store'});
}
