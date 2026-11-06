export async function onRequestPost({ request, env }) {
  if (!env.PRODUCT_IMAGES) return Response.json({ error: 'Image storage is not configured.' }, { status: 503 });
  const form = await request.formData();
  const file = form.get('image');
  if (!(file instanceof File) || !file.size) return Response.json({ error: 'Choose an image to upload.' }, { status: 400 });
  const allowed = new Map([['image/jpeg','jpg'],['image/png','png'],['image/webp','webp'],['image/avif','avif']]);
  const ext = allowed.get(file.type);
  if (!ext) return Response.json({ error: 'Use JPG, PNG, WebP or AVIF images.' }, { status: 415 });
  if (file.size > 5 * 1024 * 1024) return Response.json({ error: 'Image must be 5 MB or smaller.' }, { status: 413 });
  const bytes = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  const starts = (...values) => values.every((v, i) => bytes[i] === v);
  const valid = ext === 'jpg' ? starts(0xff,0xd8,0xff) : ext === 'png' ? starts(0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a) : ext === 'webp' ? starts(0x52,0x49,0x46,0x46) && starts(0x57,0x45,0x42,0x50) : bytes[4]===0x66 && bytes[5]===0x74 && bytes[6]===0x79 && bytes[7]===0x70;
  if (!valid) return Response.json({ error: 'The selected file does not match its image format.' }, { status: 415 });
  const key = `${crypto.randomUUID()}.${ext}`;
  await env.PRODUCT_IMAGES.put(key, file.stream(), { httpMetadata: { contentType: file.type, cacheControl: 'public, max-age=31536000, immutable' } });
  return Response.json({ url: `/media/${key}` });
}
