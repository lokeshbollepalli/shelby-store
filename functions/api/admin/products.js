const categories = new Set(['Shoes', 'Watches', 'Accessories']);
const json = (data, status = 200) => Response.json(data, { status });
const clean = (v, max = 500) => String(v ?? '').trim().slice(0, max);
function validate(body) {
  const name = clean(body.name, 100), category = clean(body.category, 30), image = clean(body.image, 500);
  const price = Number(body.price), oldPrice = body.oldPrice === '' || body.oldPrice == null ? null : Number(body.oldPrice);
  if (!name || !categories.has(category) || !Number.isSafeInteger(price) || price < 0 || !image.startsWith('/media/')) return null;
  if (oldPrice !== null && (!Number.isSafeInteger(oldPrice) || oldPrice < 0)) return null;
  const sizes = Array.isArray(body.sizes) ? body.sizes.map(x => clean(x, 30)).filter(Boolean).slice(0, 30) : [];
  return { name, category, price, oldPrice, color: clean(body.color, 80), badge: clean(body.badge, 40), image, description: clean(body.description, 1500), sizes, featured: Boolean(body.featured), active: body.active === false ? 0 : 1 };
}
export async function onRequestGet({ env }) {
  const { results = [] } = await env.DB.prepare('SELECT id,name,category,price,old_price AS oldPrice,color,badge,image,description,sizes,featured,active FROM products ORDER BY created_at DESC').all();
  return json(results.map(p => ({ ...p, sizes: parse(p.sizes), featured: Boolean(p.featured), active: Boolean(p.active) })));
}
export async function onRequestPost({ request, env }) {
  let body; try { body = await request.json(); } catch { return json({ error: 'Invalid product data.' }, 400); }
  const p = validate(body); if (!p) return json({ error: 'Check product name, category, price and upload an image first.' }, 400);
  const id = crypto.randomUUID();
  await env.DB.prepare('INSERT INTO products (id,name,category,price,old_price,color,badge,image,description,sizes,featured,active) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)')
    .bind(id,p.name,p.category,p.price,p.oldPrice,p.color,p.badge,p.image,p.description,JSON.stringify(p.sizes),p.featured?1:0,p.active).run();
  return json({ id, ...p }, 201);
}
export async function onRequestPut({ request, env }) {
  let body; try { body = await request.json(); } catch { return json({ error: 'Invalid product data.' }, 400); }
  const id = clean(body.id, 80), p = validate(body); if (!id || !p) return json({ error: 'Check the product details and image.' }, 400);
  const result = await env.DB.prepare('UPDATE products SET name=?,category=?,price=?,old_price=?,color=?,badge=?,image=?,description=?,sizes=?,featured=?,active=?,updated_at=CURRENT_TIMESTAMP WHERE id=?')
    .bind(p.name,p.category,p.price,p.oldPrice,p.color,p.badge,p.image,p.description,JSON.stringify(p.sizes),p.featured?1:0,p.active,id).run();
  if (!result.meta.changes) return json({ error: 'Product not found.' }, 404);
  return json({ id, ...p });
}
export async function onRequestDelete({ request, env }) {
  const id = new URL(request.url).searchParams.get('id'); if (!id) return json({ error: 'Missing product ID.' }, 400);
  const result = await env.DB.prepare('DELETE FROM products WHERE id=?').bind(id).run();
  if (!result.meta.changes) return json({ error: 'Product not found.' }, 404);
  return json({ success: true });
}
function parse(v) { try { return JSON.parse(v || '[]'); } catch { return []; } }
