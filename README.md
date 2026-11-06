# SHELBY — Self-managed shoes & watches store

A responsive SHELBY storefront with a private admin portal. Manage products and basic homepage settings yourself; no code edits are needed for routine catalogue updates.

## What is included

### Public storefront
- Shoes, watches and accessories catalogue
- Search, category filters and price sorting
- Product details, sizes/options, wishlist and INR pricing
- WhatsApp product enquiries
- Responsive layout and SEO metadata
- Cloudflare D1 for products and R2 for images

### Admin portal (`/admin`)
- Add, edit, hide, feature and delete products
- Upload product photos
- Manage prices, categories, colours, sizes and descriptions
- Change homepage settings and WhatsApp number
- Reorder and hide homepage sections

## Deploy to Cloudflare Pages

- Framework preset: `Vite`
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `/`

Configure Cloudflare D1, R2 and the required admin secrets before using the admin portal. See the deployment instructions in this README's earlier version or ask for the setup steps.

## Local development

Requirements: Node.js 18+.

```bash
npm install
npm run dev 