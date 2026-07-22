# Roadmap: Atelier Homes Argentina — Mejoras v1

## Overview

Four-phase improvement cycle for the Atelier Homes Argentina real estate site. Phase 1 migrates from HashRouter to BrowserRouter (SEO prerequisite) and cleans technical debt. Phase 2 hardens security with Firebase Auth, Firestore rules, and spam protection in a single atomic deploy. Phase 3 delivers the blog system with SEO foundation — admin editor, public pages, build-time HTML generation, meta tags, and sitemap. Phase 4 adds feature polish: property sorting, team member modals, structured data, and code splitting. Each phase delivers an end-to-end user capability; dependencies flow strictly forward.

## Phases

- [ ] **Phase 1: Foundation & Infrastructure** — BrowserRouter migration + code cleanup (no user-facing changes)
- [ ] **Phase 2: Security Hardening** — Auth + Firestore rules + env vars + spam protection (atomic deploy)
- [ ] **Phase 3: Blog System + SEO** — Blog editor + public pages + build-time HTML + meta tags + sitemap
- [ ] **Phase 4: Feature Polish** — Property sorting, team modals, structured data, code splitting

## Phase Details

### Phase 1: Foundation & Infrastructure
**Goal**: Site uses BrowserRouter with clean URLs, no `#` fragments, no orphaned dependencies, all styles in Tailwind, Error Boundaries on main sections.
**Mode**: mvp
**Depends on**: Nothing (first phase)
**Requirements**: INFR-01, INFR-02, CLN-01, CLN-02, CLN-03, CLN-04, CLN-05, CLN-06
**Success Criteria** (what must be TRUE):
  1. All public URLs use `/propiedades`, `/propiedad/:id`, `/nosotros`, `/contacto` — no `/#/` fragments visible anywhere
  2. Direct access to any deep URL (e.g., `/propiedades/capital-federal`) loads the correct page via Netlify SPA fallback
  3. Clicking any link in navigation, footer, or homepage sections navigates correctly without `#` in the URL
  4. `npm run build` completes without `@dnd-kit/*` packages or `styled-components` in bundle, and zero `<style jsx>` blocks in source
  5. All main sections (Body, Equipo, Propiedades, Admin) render without white screens — Error Boundaries catch and display fallback UI on failure
**Plans**: TBD

### Phase 2: Security Hardening
**Goal**: Admin panel requires authentication, Firestore writes are protected, Firebase config uses env vars, all contact forms have spam protection.
**Mode**: mvp
**Depends on**: Phase 1
**Requirements**: INFR-03, INFR-04, SEG-01, SEG-02, SEG-03, SEG-04, SEG-05
**Success Criteria** (what must be TRUE):
  1. Visiting `/admin` or any `/admin/*` route in incognito redirects to `/login` — public users cannot reach the admin panel
  2. Admin user can log in with email/password, see the admin panel, and CRUD all collections (propiedades, Noticias, Nosotros)
  3. Public pages (`/`, `/propiedades`, `/nosotros`, `/contacto`) load content correctly — Firestore reads work without authentication
  4. Direct Firestore write operations via SDK fail for unauthenticated requests (`allow read: if true; allow write: if request.auth != null`)
  5. Form submissions via Contacto.jsx and Modal.jsx include Honeypot field — spam bots are blocked while real users submit normally
**Plans**: TBD
**UI hint**: yes

### Phase 3: Blog System + SEO
**Goal**: Blog section with admin rich-text editor and public pages delivers SEO-ready content — build-time static HTML, per-page meta tags, sitemap, semantic HTML.
**Mode**: mvp
**Depends on**: Phase 2
**Requirements**: BLOG-01, BLOG-02, BLOG-03, BLOG-04, BLOG-05, BLOG-06, BLOG-07, SEO-01, SEO-02, SEO-03, SEO-04, SEO-05
**Success Criteria** (what must be TRUE):
  1. Admin user can create, edit, publish, and unpublish blog articles using a rich text editor with date picker and publish/draft toggle
  2. Public `/blog` page lists all published articles; `/blog/:slug` displays the full article with title, content, date, and author
  3. Homepage "Noticias" section shows the 3 most recent published articles, each linking to `/blog/:slug`
  4. `curl https://site.com/blog/article-slug` returns full HTML with article content, `<title>`, `<meta description>`, and Open Graph tags in page source
  5. `sitemap.xml` includes all property detail pages and all published blog articles; `robots.txt` points to the sitemap
  6. Homepage, property detail, blog list, and blog article pages use semantic HTML (`<main>`, `<article>`, `<nav>`, `<section>`) and each has unique `<title>` and `<meta description>` tags
**Plans**: TBD
**UI hint**: yes

### Phase 4: Feature Polish
**Goal**: Properties sorted by date, team member bios expandable with contact CTA, property detail pages have JSON-LD structured data, large components lazy-loaded.
**Mode**: mvp
**Depends on**: Phase 3
**Requirements**: PROP-01, PROP-02, TEAM-03, TEAM-04, TEAM-05, PERF-01, PERF-02
**Success Criteria** (what must be TRUE):
  1. Properties on `/propiedades` and filtered views display sorted by `fechaIngreso` (newest first)
  2. Clicking a team member card opens a modal with full description, photo, and "Hablemos" button linking to the member's email
  3. Property detail page source includes JSON-LD structured data (`schema.org/RealEstateListing`) with price, location, and images
  4. `Modal.jsx` (715-line valuation wizard) loads lazily — the initial page bundle excludes it, and it loads only when the user opens the tasación modal
  5. Blog routes (`BlogList`, `BlogArticle`) load lazily — the initial page bundle excludes them, and they load only when the user navigates to blog pages
**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Infrastructure | 0/0 | Not started | - |
| 2. Security Hardening | 0/0 | Not started | - |
| 3. Blog System + SEO | 0/0 | Not started | - |
| 4. Feature Polish | 0/0 | Not started | - |
