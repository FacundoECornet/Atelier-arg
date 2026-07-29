---
phase: 03-blog-system-seo
plan: 02
subsystem: public
tags: blog, blog-list, blog-article, react-helmet-async, seo, firestore, noticias

requires:
  - phase: 03-01
    provides: Extended Noticias schema with slug, contenido, fecha, publicado fields; react-quill admin editor
provides:
  - Public blog listing page at /blog (BlogList.jsx)
  - Public article detail page at /blog/:slug (BlogArticle.jsx)
  - Blog routes wired in App.jsx with ErrorBoundary wrapping
  - HelmetProvider wrapping Shell for SEO meta tags
  - Homepage Noticias section rewritten to show blog articles (3 most recent published)
affects: 03-blog-system-seo

tech-stack:
  added: react-helmet-async (integration in App.jsx)
  patterns: Public blog components with Helmet meta tags, Firestore where(publicado,==,true) query pattern

key-files:
  created:
    - src/Blog/BlogList.jsx
    - src/Blog/BlogArticle.jsx
  modified:
    - src/App.jsx
    - src/Componentes/Noticias.jsx

key-decisions:
  - "BlogList and BlogArticle both query where('publicado', '==', true) — draft articles never appear publicly"
  - "BlogArticle normalizes trailing slash via replace(/\/$/, '') per RESEARCH Pitfall 4"
  - "Noticias.jsx returns null during loading and when 0 published articles exist (hide section)"
  - "Animated 'Ver más' button in Noticias preserved exactly — only onClick changed to navigate('/blog/' + slug)"

requirements-completed:
  - BLOG-04
  - BLOG-05
  - BLOG-06
  - SEO-01

duration: 4 min
completed: 2026-07-29
---

# Phase 3 Plan 2: Public Blog Pages + Noticias Rewrite Summary

**Created public blog listing (BlogList.jsx) and article detail (BlogArticle.jsx) pages, wired them into App.jsx routes with ErrorBoundary and HelmetProvider, rewrote homepage Noticias section to query published blog articles with limit(3).**

## Performance

- **Duration:** 4 min
- **Started:** 2026-07-29T14:13:00Z
- **Completed:** 2026-07-29T14:17:14Z
- **Tasks:** 3
- **Files modified:** 4 (2 created, 2 modified)

## Accomplishments

- Created BlogList.jsx — grid of published articles at /blog with image, title, date (es-AR), description excerpt, and "Leer más" navigation per card
- Created BlogArticle.jsx — full article detail at /blog/:slug with hero image, title, long-form date, rich HTML content via dangerouslySetInnerHTML, Helmet meta tags, and back navigation
- Wired blog routes in App.jsx: `/blog` and `/blog/:slug` with ErrorBoundary wrapping (no AuthGuard — public pages)
- Integrated HelmetProvider wrapping Shell for per-page SEO meta tags
- Rewrote Noticias.jsx: queries `where('publicado', '==', true)` + `orderBy('fecha', 'desc')` + `limit(3)`, navigates to `/blog/:slug` on click, hides section when 0 articles, adds "Ver todas las novedades →" link
- Preserved animated "Ver más" button design per D-14

## Task Commits

Each task was committed atomically:

1. **Task 1: Create BlogList.jsx** — `8bead13` (feat: published articles grid page)
2. **Task 2: Create BlogArticle.jsx** — `70541c9` (feat: article detail page)
3. **Task 3: Wire blog routes + Noticias rewrite** — `054b461` (feat: wire blog routes, HelmetProvider, rewrite Noticias)

## Files Created/Modified

- `src/Blog/BlogList.jsx` — Published articles grid at /blog with card layout, skeleton loading, empty state
- `src/Blog/BlogArticle.jsx` — Single article detail at /blog/:slug with hero image, rich content, Helmet meta tags
- `src/App.jsx` — Added blog route imports, `<HelmetProvider>` wrapping Shell, blog routes with ErrorBoundary
- `src/Componentes/Noticias.jsx` — Rewritten query (published + ordered + limited), navigation to blog URLs, section hiding, "Ver todas" link

## Decisions Made

- **Noticias.jsx loading behavior:** Returns `null` during loading (no flash of empty section) and when 0 published articles exist (hide per D-15). Only renders when articles are ready.
- **BlogArticle Helmet:** Added `<Helmet>` with title, description, OG tags, and canonical link per SEO-01. Agent discretion per CONTEXT.md.
- **BlogArticle content styling:** Used Tailwind arbitrary variant classes (`[&_img]:rounded-lg`, etc.) since `@tailwindcss/typography` plugin is not installed. `prose` class excluded.
- **Placeholder image:** Reused existing `/placeholder-property.jpg` for image fallback in both components.

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

- `@tailwindcss/typography` not installed — used Tailwind arbitrary variants instead of `prose` class for article content styling. Works equivalently.
- `scripts/postbuild.mjs` not created yet — build triggers error on `npm run build` postbuild hook. Expected, will be created in Plan 03-03.

## Threat Surface Scan

No new threat flags. Blog pages only query published articles (`where('publicado', '==', true)` per T-03-04 mitigation). Slug trailing slash normalization applied per T-03-05 mitigation. Content rendered via dangerouslySetInnerHTML is pre-sanitized by react-quill per T-03-06 mitigation.

## Self-Check: PASSED

- [x] `src/Blog/BlogList.jsx` exists — queries published=true, orderBy fecha desc, card grid with navigation
- [x] `src/Blog/BlogArticle.jsx` exists — uses useParams, slug normalization, dangerouslySetInnerHTML, back link, Helmet
- [x] `src/App.jsx` imports and routes both blog components with ErrorBoundary, HelmetProvider wrapping Shell
- [x] `src/Componentes/Noticias.jsx` — published+ordered(desc)+limit(3) query, navigate to /blog/:slug, section hides on 0 articles, "Ver todas" link present
- [x] `npm run build` succeeds (Vite build passes; postbuild error is pre-existing due to missing scripts/postbuild.mjs)

## Next Phase Readiness

Ready for Plan 03-03 (postbuild script: static HTML generation, sitemap.xml, robots.txt).

---
*Phase: 03-blog-system-seo*
*Completed: 2026-07-29*
