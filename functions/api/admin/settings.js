export async function onRequestGet({ env }) {
  const row = await env.DB.prepare('SELECT announcement,whatsapp,hero_title AS heroTitle,hero_subtitle AS heroSubtitle,hero_image AS heroImage,accent,section_order AS sectionOrder,hidden_sections AS hiddenSections FROM site_settings WHERE id=1').first();
  return Response.json(row ? { ...row, sectionOrder: parse(row.sectionOrder, ['hero','shop','story']), hiddenSections: parse(row.hiddenSections, []) } : {});
}
export async function onRequestPut({ request, env }) {
  let s; try { s = await request.json(); } catch { return Response.json({ error: 'Invalid settings.' }, { status: 400 }); }
  const clean = (v, max) => String(v ?? '').trim().slice(0, max);
  const announcement = clean(s.announcement, 180), whatsapp = clean(s.whatsapp, 20).replace(/[^0-9]/g, '');
  const heroTitle = clean(s.heroTitle, 100), heroSubtitle = clean(s.heroSubtitle, 240), heroCandidate = clean(s.heroImage, 100);
  const heroImage = /^\/media\/[a-f0-9-]{36}\.(jpg|png|webp|avif)$/i.test(heroCandidate) ? heroCandidate : '';
  const accent = /^#[0-9a-fA-F]{6}$/.test(s.accent) ? s.accent : '#c6ef56';
  const allowed = ['hero','shop','story'];
  const sectionOrder = Array.isArray(s.sectionOrder) ? [...new Set(s.sectionOrder.filter(x => allowed.includes(x)))].concat(allowed.filter(x => !s.sectionOrder.includes(x))) : allowed;
  const hiddenSections = Array.isArray(s.hiddenSections) ? s.hiddenSections.filter(x => allowed.includes(x)) : [];
  await env.DB.prepare('UPDATE site_settings SET announcement=?,whatsapp=?,hero_title=?,hero_subtitle=?,hero_image=?,accent=?,section_order=?,hidden_sections=?,updated_at=CURRENT_TIMESTAMP WHERE id=1')
    .bind(announcement,whatsapp,heroTitle,heroSubtitle,heroImage,accent,JSON.stringify(sectionOrder),JSON.stringify(hiddenSections)).run();
  return Response.json({ success: true });
}
function parse(v, fallback) { try { return JSON.parse(v || ''); } catch { return fallback; } }
