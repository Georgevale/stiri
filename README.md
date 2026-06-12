# ȘtiriAcum

Site de știri minimal construit cu Next.js — publicare rapidă a articolelor folosind un API local.

Cum rulezi local:

1. Instalează dependențe:

```bash
npm install
```

2. Rulează în modul dezvoltare:

```bash
npm run dev
```

API local pentru postări: `GET/POST/PUT/DELETE /api/posts` (datele sunt stocate în `data/posts.json`).

Următorii pași recomandati: integrare cu un headless CMS (Sanity/Strapi), autentificare `NextAuth`, și deploy pe Vercel.

Deploy & production checklist

1. Create a GitHub repo and push the project.
2. Create a Vercel project from the repo and set these environment variables:
	- `ADMIN_PASSWORD` (required)
	- `SITE_URL` (optional; used for sitemap)
	- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` (optional, recommended)
3. Configure a custom domain in Vercel and update DNS records at your registrar.
4. Replace the placeholder Donate link with your BuyMeACoffee or Stripe Checkout.

I can complete steps 1–3 for you if you provide a GitHub token and Cloudinary/Vercel access, or I can give step-by-step commands so you run them yourself.
