export async function onRequestGet({ env }) {
  if (!env.DB) return Response.json({ error: 'Store database is not connected.' }, { status: 503 });
  const row = await env.DB.prepare('SELECT announcement,whatsapp,hero_title AS heroTitle,hero_subtitle AS heroSubtitle,hero_image AS heroImage,accent,section_order AS sectionOrder,hidden_sections AS hiddenSections FROM site_settings WHERE id=1').first();
  if (!row) return Response.json({});
  return Response.json({ ...row, sectionOrder: parse(row.sectionOrder, ['hero','shop','story']), hiddenSections: parse(row.hiddenSections, []) }, { headers: { 'Cache-Control': 'public, max-age=60, s-maxage=60' } });
}
function parse(value, fallback) { try { return JSON.parse(value || ''); } catch { return fallback; } }
