# 03-03 — SEO Foundation — Summary

**Completed:** 2026-07-29
**Plan:** 03-03-PLAN.md
**Tasks:** 4/4
**Requirements:** BLOG-07, SEO-02, SEO-03, SEO-04, SEO-05

## What Was Built

1. **Per-page meta tags via react-helmet-async** — BlogList, BlogArticle, PropiedadesInfo, homepage each get unique `<title>`, `<meta description>`, Open Graph tags, and canonical links.

2. **Semantic HTML audit** — Replaced `<div>` wrappers with `<main>`, `<article>`, `<section>`, `<time>`, `<nav>` across Body.jsx, Equipo.jsx, propiedadesCards.jsx, Todaspropiedades.jsx, PropiedadesInfo.jsx, and BlogList.jsx.

3. **Postbuild script (scripts/postbuild.mjs)** — ESM Node script that runs after `vite build`:
   - Decodes `FIREBASE_SERVICE_ACCOUNT_B64` from local `.env`
   - Reads published `Noticias` documents from Firestore via firebase-admin
   - Generates `dist/blog/{slug}/index.html` static HTML with full content, meta, OG, canonical
   - Generates `dist/sitemap.xml` (homepage, blog list, all articles, all properties)
   - Generates `dist/robots.txt` pointing to sitemap
   - Generates `dist/.htaccess` for Apache SPA fallback on Hostinger
   - `SITE_URL` = `https://atelierarg.com`

4. **Checkpoint resolved** — Deployment target is Hostinger (Apache), not Netlify. Build runs locally; `dist/` deployed via FTP. Domain confirmed: `atelierarg.com`.

## Commits

| Task | Commit | Message |
|------|--------|---------|
| 1 | `4381637` | feat(03-03): add Helmet meta tags to BlogList, homepage, PropiedadesInfo |
| 2 | `f636932` | feat(03-03): semantic HTML audit — replace divs with semantic elements |
| 3 | `8ab20a6` | feat(03-03): create postbuild.mjs — static HTML, sitemap, robots.txt, .htaccess |
| 4 | TBD | docs(03-03): complete SEO foundation plan |

## Architecture Decisions

- **Build pipeline is local** — `npm run build` runs Vite, then `postbuild` script reads Firestore and writes to `dist/`. Entire `dist/` folder uploaded to Hostinger via FTP.
- **Apache auto-serves directory index.html** — `/blog/mi-articulo/` → `dist/blog/mi-articulo/index.html` without extra config. `.htaccess` handles SPA fallback for non-file routes.
- **Credentials stored locally** — `FIREBASE_SERVICE_ACCOUNT_B64` in local `.env` (gitignored). Never committed. Decoded in-memory, never written to disk.

## Open Items

- User must create Firebase service account key, base64-encode it, and export `FIREBASE_SERVICE_ACCOUNT_B64` in their shell/`.env`
- `npm install` must be run to install `firebase-admin@12.7.0` (`npm run postbuild` exits 1 without it + valid env var)
- Firestore composite index: `Noticias` (`publicado` Asc, `fecha` Desc) — create in Firebase Console

## Verification

- `npm run build` (vite only) succeeds — SPA compiles
- `node --check scripts/postbuild.mjs` passes — valid ESM syntax
- `node scripts/postbuild.mjs` fails gracefully with "FIREBASE_SERVICE_ACCOUNT_B64 not set" when env var is missing
- Plan 03-03 task 1 (meta tags): BlogList contains `<Helmet>` with title/description/OG
- Plan 03-03 task 2 (semantic HTML): `<main>`, `<article>`, `<section>`, `<time>` used in source
- Plan 03-03 task 3 (postbuild): script exists, generates static HTML + sitemap + robots.txt + .htaccess

## Phase 3 Complete

All 3 plans executed. Blog system + SEO foundation ready:
- Admin: RichText, Date, Boolean fields for blog authoring
- Public: BlogList, BlogArticle, Noticias.jsx rewired
- SEO: Helmet meta tags, static HTML for crawlers, sitemap, robots.txt, .htaccess, semantic HTML

**Next:** Manual steps for deploy:
1. Export `FIREBASE_SERVICE_ACCOUNT_B64` + run `npm install`
2. Run `npm run build` to generate dist/ with static HTML
3. Upload dist/ to Hostinger (atelierarg.com)
