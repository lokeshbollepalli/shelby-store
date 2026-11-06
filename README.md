# SHELBY — self-managed shoes & watches store

A responsive SHELBY storefront with a private admin portal. Manage products and basic homepage settings yourself; no code edits are needed for routine catalogue updates.

## What is included

### Public storefront
- Shoes, watches and accessories catalogue, search, category filters and price sorting
- Product detail view, sizes/options, wishlist and INR pricing
- Product enquiries routed to your WhatsApp Business number
- Responsive layout, privacy page, cookie-consent preferences, SEO/social metadata and security headers
- Products and store settings load from Cloudflare D1; uploaded images are served from Cloudflare R2

### Admin portal (`/admin`)
- Add, edit, hide, feature and delete products
- Upload product photos (JPG, PNG, WebP or AVIF, max 5 MB)
- Set category, price, compare-at price, colour, badge, sizes/options and description
- Change announcement, WhatsApp number, homepage headline, hero image upload and accent colour
- Drag to reorder homepage sections and hide/show them
- Changes are stored in the shared database and appear on the public store

## Cost model

The project is designed to start on free Cloudflare and GitHub plans. Free-plan quotas and product limits can change; check the current Cloudflare plan pages before launch. You do not need a paid payment gateway for the WhatsApp-enquiry model. A `pages.dev` address is available without buying a domain. A custom domain is optional and usually costs money.

Cloudflare D1 and R2 are used for product data and photos. The project does not charge customers or collect card details. You and your supplier confirm stock, delivery, payment method, returns and customer support directly. Do not advertise products unless your supplier has confirmed availability and your rights to use the photos.

## Deploy to Cloudflare Pages

### 1. Put the project on GitHub

Create a GitHub repository, for example `shelby-store`, and upload/push the complete contents of this folder. Keep the repository private if you prefer. Do not commit passwords, API tokens or private customer data.

### 2. Create the Cloudflare Pages site

In Cloudflare Dashboard, open **Workers & Pages → Create → Pages → Connect to Git** and select your repository.

- Framework preset: `Vite`
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `/`

### 3. Create the database

In Cloudflare Dashboard, open **Workers & Pages → D1 SQL Database → Create database**. Name it `shelby-store`.

Open the database console and run the complete contents of `schema.sql`. This creates the product table and the shared storefront settings row.

In your Cloudflare Pages project, open **Settings → Functions → D1 database bindings**. Add a binding with variable name `DB` and select the `shelby-store` database. Save and redeploy the project so the Functions receive the binding.

### 4. Create image storage

In Cloudflare Dashboard, open **R2 Object Storage → Create bucket**. Name it `shelby-product-images`.

In your Cloudflare Pages project, open **Settings → Functions → R2 bucket bindings**. Add a binding with variable name `PRODUCT_IMAGES` and select the `shelby-product-images` bucket. Save and redeploy the project so the Functions receive the binding.

### 5. Set your private admin credentials

In your Pages project, open **Settings → Variables and Secrets**. Add these as **Secrets** for the Production environment:

| Secret | Value |
|---|---|
| `ADMIN_PASSWORD` | A unique, strong password you choose for the SHELBY admin portal |
| `SESSION_SECRET` | A random secret with at least 32 characters |

On your Windows laptop, generate a session secret in PowerShell after installing Node.js:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the generated value into the `SESSION_SECRET` secret in Cloudflare. Do not share either secret in chat, put them in GitHub, or add them to React files. If you lose the admin password, replace `ADMIN_PASSWORD` in Cloudflare and redeploy.

The admin portal uses a signed, HttpOnly, Secure, SameSite=Strict session cookie that expires after 12 hours. Admin API requests are verified server-side, mutating requests must come from the same site, and failed logins are rate-limited per IP. You do not need a paid domain or a separate authentication service.

### 6. Redeploy and test

After the D1 schema, D1/R2 bindings and admin secrets are ready, redeploy the Pages project. Open `/admin`, sign in with the password you configured, add a test product and verify it appears on the homepage. Test image upload, edit, hide and delete before sharing the shop link.

The admin address will be `https://YOUR-PAGES-SITE.pages.dev/admin`.

## Adding and managing products

1. Open `/admin` and sign in.
2. Choose **Add product**.
3. Enter a name, category, price and any options (comma-separated).
4. Upload the product image.
5. Choose whether it is featured and visible.
6. Click **Publish product**.

To change an item, choose the pencil icon in **Your catalogue**. To remove it, choose the bin icon. To pause a listing without deleting it, edit it and untick **Visible in store**.

Use the **Store settings** tab to update the WhatsApp number. Enter digits only, including country code. For India, enter `91` followed by your 10-digit mobile number. This number is shown to customers as the order-enquiry destination.

## Important limitations / before launch

- This is a product catalogue and enquiry website, not a full checkout platform. It has no online payment processing, automatic order records, customer accounts, courier integration, tax calculation or stock reservation.
- Customers enquire on WhatsApp. You must manually confirm stock, size/variant, final price, shipping fee, delivery estimate, payment terms and return policy with the supplier and customer.
- Set `ADMIN_PASSWORD` and `SESSION_SECRET` as Cloudflare Pages Secrets before using the admin portal. Without them, the admin API intentionally refuses requests.
- Set the actual business contact, WhatsApp number, privacy notice, shipping/returns terms and social links before public launch. The privacy page is a starter and must be adapted to the actual data and services you use.
- Product images are uploaded to your private R2 bucket and served through the Pages Function. Do not upload photos unless you have permission to use them.
- The homepage hero image upload is optional and uses the same R2 image storage as product photos.
- Free-plan allowances are not unlimited. Monitor D1/R2 usage in Cloudflare and check current plan terms.

## Local development

Requirements: Node.js 18+.

```bash
npm install
npm run dev
```

The storefront requires Cloudflare Pages Functions, D1 and R2 to load/manage the live catalogue. For a complete local Cloudflare-like environment, use Wrangler and configure local D1/R2 bindings. The admin endpoints intentionally cannot be used without the configured signed admin session.

## SEO / domain

The project includes title/description, Open Graph metadata, a robots file and sitemap starter. After choosing your permanent Pages URL, update `public/sitemap.xml` and `public/robots.txt` to use it. Add a canonical URL and connect a custom domain only after you have one. Product listings are client-rendered, so a future SEO upgrade could prerender individual product pages if organic product search becomes important.
