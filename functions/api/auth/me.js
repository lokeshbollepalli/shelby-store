import { validSession } from '../../lib/auth.js';
export async function onRequestGet({request,env}){
 const ok=await validSession(request,env.SESSION_SECRET);
 return Response.json({authenticated:ok},{status:ok?200:401,headers:{'Cache-Control':'no-store'}});
}
