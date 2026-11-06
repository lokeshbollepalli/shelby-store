export async function onRequestGet({ env }) {
  if (!env.DB) return Response.json({ error: 'Store database is not connected.' }, { status: 503 });
  const { results = [] } = await env.DB.prepare(
    'SELECT id,name,category,price,old_price AS oldPrice,color,badge,image,description,sizes,featured FROM products WHERE active = 1 ORDER BY featured DESC, created_at DESC'
  ).all();
  return Response.json(results.map(p => ({ ...p, sizes: safeJson(p.sizes), featured: Boolean(p.featured) })), {
    headers: { 'Cache-Control': 'public, max-age=60, s-maxage=60' }
  });
}
function safeJson(value) { try { return JSON.parse(value || '[]'); } catch { return []; } }
