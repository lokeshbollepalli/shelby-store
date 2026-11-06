export async function onRequestPost({request}){
 const url=new URL(request.url);if(request.headers.get('Origin')!==url.origin)return Response.json({error:'Request origin rejected.'},{status:403});
 return Response.json({success:true},{headers:{'Set-Cookie':'shelby_admin=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0','Cache-Control':'no-store'}});
}
