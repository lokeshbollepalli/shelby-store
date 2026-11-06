import { validSession } from './lib/auth.js';
export async function onRequest({request,env,next}){
  const url=new URL(request.url);if(!url.pathname.startsWith('/api/admin/'))return next();
  if(!await validSession(request,env.SESSION_SECRET))return Response.json({error:'Admin session expired. Sign in again.'},{status:401});
  if(!['GET','HEAD','OPTIONS'].includes(request.method)){const origin=request.headers.get('Origin');if(origin!==url.origin)return Response.json({error:'Request origin rejected.'},{status:403});}
  const response=await next();
  const headers=new Headers(response.headers);headers.set('Cache-Control','no-store');
  return new Response(response.body,{status:response.status,statusText:response.statusText,headers});
}
