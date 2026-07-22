# Project Research Summary

**Project:** Atelier Homes Argentina — Mejoras v1
**Domain:** Real estate SPA — SEO, blog, auth, code quality
**Researched:** 2026-07-22
**Confidence:** HIGH

## Executive Summary

Atelier Homes is a boutique Argentine real estate agency running a React 18 + Vite 5 + Firebase 10 SPA on Netlify. The site has 3 critical security issues: no admin authentication (anyone can reach `/admin`), open Firestore rules (`allow read, write: if true`), and hardcoded Firebase config keys in source. It also has zero SEO — HashRouter means every page shares the same URL (`/#/...` fragment), so Google sees only the homepage. A blog collection (`Noticias`) exists in Firestore but is unused.

The research recommends a 4-phase approach. **Phase 1 is non-negotiable: migrate HashRouter → BrowserRouter with Netlify SPA fallback before any SEO work.** Without this, all meta tags, sitemaps, and blog content are invisible to search engines. Phase 2 hardens security: Firebase Auth + Firestore rules must deploy as a single atomic unit (rules allow public read, auth-gated write — deploying rules before auth breaks the public site). Phase 3 delivers the blog with build-time HTML generation (client-rendered blog = zero SEO value) and per-page SEO meta tags. Phase 4 adds polish: property sorting, team member modals, contact CTAs.

The critical risk is phase ordering. HashRouter→BrowserRouter migration must be first. Auth+Firestore rules must deploy together. Blog must have static HTML output, not client-side fetch. Each phase has well-documented patterns — no framework migration (Next.js) needed. The total effort is estimated at 2-4 weeks for a single developer comfortable with React and Firebase.

## Key Findings

### Recommended Stack

**Keep existing infrastructure:** React 18.2 + Vite 5.2 + Tailwind 3.4 + Firebase 10.7 + React Router 6.23 + Netlify. No framework migration, no TypeScript, no new services.

**Core additions:**

| Technology | Purpose | Why |
|---|---|---|
| react-helmet-async 3.0.0 | Per-page meta tags (title, description, OG) | SPA-safe, HashRouter-compatible, React 18 concurrent-mode safe |
| vite-plugin-sitemap 0.8.2 | Build-time sitemap.xml generation | Vite-native, zero runtime, Netlify-compatible |
| react-markdown 10.1 + remark-gfm 4.0 | Blog content rendering | Safe by default (no XSS), extensible via plugins, lightweight |
| Firebase Auth (already installed) | Admin email/password login | Already in project via `firebase` package. No new dependencies |
| ESLint 10.7 + Prettier 3.9.6 | Code quality | ESLint flat config already partially set up. Prettier standardizes formatting |
| react-quill | Rich text editor for blog admin | 40KB gzipped, admin-only lazy-loaded. HTML output. Popular (14K GitHub stars) |

**Remove:** `@dnd-kit/*` (unused), `styled-components` (used only in Social.jsx — migrate to Tailwind). ESLint v10 flat config—no `.eslintrc`.

**What NOT to add:** Next.js/R email/Astro (out of scope), headless CMS (external dependency), WYSIWYG editor beyond react-quill (overkill), Chat bot, multi-language.

### Expected Features

**Must have (table stakes) — P1:**
- Admin authentication (Firebase Email/Password) — non-negotiable security baseline
- Firestore security rules — public read, auth-gated write
- Environment variables — Firebase config from `import.meta.env.VITE_*`
- Spam protection — FormSpree Honeypot first, CAPTCHA if needed
- Property sorting by date — one Firestore query change
- SEO meta tags per route — react-helmet-async on all dynamic pages
- XML sitemap — build-time generation via vite-plugin-sitemap
- Blog section — public listing + detail pages with admin editor

**Should have (differentiators) — P2:**
- Team member expandable modals with full bios + "Hablemos" email button
- Property detail structured data (JSON-LD) for rich Google results
- Sold/archived properties showcase (builds trust, EEAT signal)
- Error boundaries around major component sections
- Code splitting for Modal.jsx (715 lines — lazy load)
- Semantic HTML audit (replace div soup with `<main>`, `<article>`, `<nav>`)

**Defer (v2+):**
- Property image upload (Firebase Storage) — current external URL pattern works
- Email newsletter integration — premature for current traffic
- Performance monitoring (Lighthouse CI)
- A/B testing on CTA placements

### Architecture Approach

**Layer hierarchy:** `HelmetProvider → AuthProvider → HashRouter → Shell → Routes`. HashRouter replaced with BrowserRouter in Phase 1. Minimal intrusion — existing public routes unchanged. Auth handled at the route level via `AuthGuard` wrapper (not component-level checks). Blog extends existing `Noticias` Firestore collection (no new collection, no migration). Admin form schema-driven — add 3 new field types (richtext, date, boolean) to existing renderer.

**Major components:**

1. **AuthContext + AuthGuard + LoginPage** — Firebase Auth wrapped in React Context. AuthGuard gates `/admin/*` routes only. LoginPage lives outside guard to avoid redirect loops.
2. **BlogList + BlogArticle** — Public blog pages fetching from `Noticias` collection. BlogArticle renders HTML content via `dangerouslySetInnerHTML` (safe — admin-only content source). Build-time static HTML generation required for SEO.
3. **SEOHead** — react-helmet-async wrapper component. Per-page `<title>`, `<meta>`, `<og:>` tags. Placed on every dynamic route (home, property detail, blog post).
4. **TeamMemberModal** — Portal-rendered modal on team member card click. Shows full bio + photo + email contact button.
5. **AdminForm extensions (RichTextField, DateField, BooleanField)** — Schema-driven field rendering for blog management in admin panel.

**Key patterns:** Route-level auth guard (not app-level), schema-driven field dispatch, context-based auth state with single `onAuthStateChanged` listener, Firestore `publicado` boolean for draft/published blog control.

### Critical Pitfalls

1. **Firestore Rule Lockout (P1)** — Deploying auth-gated rules before auth exists breaks the entire public site. **Prevention:** Auth + rules deploy as atomic unit. Rules pattern: `allow read: if true; allow write: if request.auth != null`. Test with Firestore emulator before production.

2. **HashRouter SEO Dead End (P2)** — Everything after `#` is a fragment identifier not sent to server. Google cannot distinguish pages. **Prevention:** Migrate to BrowserRouter + `netlify.toml` SPA fallback (`/* /index.html 200`) BEFORE any SEO or blog work.

3. **Auth Guard Leaks to Public Routes (P3)** — Placing auth check at app level blocks public visitors with a login wall. **Prevention:** AuthGuard wraps only `<Route path="/admin/*">`. Test public routes in incognito.

4. **Client-Rendered Blog = Zero SEO (P4)** — Blog content fetched client-side from Firestore is invisible to crawlers. **Prevention:** Build-time static HTML generation step in Vite deploy pipeline. Each blog post gets its own `.html` file with full content + meta tags.

5. **Environment Variable Migration Breaks Firebase (P5)** — Missing/typo'd `VITE_*` env vars on Netlify mean `undefined` config → app fails to initialize → white screen. **Prevention:** Validate all required vars at import time. Set Netlify env vars before merge. Verify in deploy preview.

6. **HashRouter→BrowserRouter Link Breakage (P7)** — Hardcoded `<a href="/#/...">` and `window.location.hash` usage breaks after migration. **Prevention:** Audit all hash references before switch. Use `<Link>` components. Add client-side hash redirect.

## Implications for Roadmap

Based on cross-research synthesis (dependency graph from ARCHITECTURE + pitfall ordering from PITFALLS + feature priorities from FEATURES):

### Phase 1: Foundation & Infrastructure Migration

**Rationale:** BrowserRouter migration MUST precede all SEO/blog work (PITFALLS P2, P7). Code cleanup reduces surface area before adding new features. Zero user-facing changes — safe to roll out independently.

**Delivers:**
- HashRouter → BrowserRouter migration + Netlify SPA fallback config
- `netlify.toml` rewrite rule: `/* /index.html 200`
- Link audit: replace all `/`href` with `#` paths and `window.location.hash`
- Remove orphaned `@dnd-kit/*` dependency
- Remove `styled-components` from Social.jsx → migrate to Tailwind
- Remove `<style jsx>` from Nosotros.jsx → migrate styles to Tailwind
- Error Boundaries around major sections

**Addresses:** CLN-01, CLN-02, CLN-03, CLN-04, SEG-04 (env var migration — do this early)

**Avoids:** Pitfalls P2 (HashRouter SEO dead end), P7 (link breakage after migration)

**Research flag:** This phase is well-documented — standard patterns. No `/gsd-plan-phase --research-phase` needed.

---

### Phase 2: Security Hardening (Atomic Deploy)

**Rationale:** Auth must exist before blog admin editing. Firestore rules must deploy SAME MOMENT as auth (PITFALLS P1). Environment variables needed for auth to work across environments (P5). Spam protection independent but groups naturally.

**Delivers:**
- Firebase Auth implementation: `AuthContext`, `AuthGuard`, `LoginPage` — email/password for admin user
- Firestore security rules: `allow read: if true; allow write: if request.auth != null`
- Environment variable migration: Firebase config → `import.meta.env.VITE_FIREBASE_*` with validation
- Spam protection: FormSpree Honeypot + optional hCaptcha (only if spam occurs)
- SPA URL redirects for old hash bookmarks (if any exist externally)

**Addresses:** SEG-01, SEG-02, SEG-03, SEG-04

**Avoids:** Pitfalls P1 (Firestore lockout — atomic deploy), P3 (auth guard leaks — route-level guard), P5 (env var break — validation + deploy preview), P6 (CAPTCHA conflict — start with Honeypot), P8 (rules block admin — simplest `request.auth != null`)

**Research flag:** Needs deeper research during planning for:
- Exact Firestore emulator setup + `@firebase/rules-unit-testing` integration
- FormSpree paid plan vs free tier spam handling — verify before implementation
- Admin user creation process (Firebase Console, not code)

**Verification:** Deploy preview must pass: (1) incognito `/` loads content, (2) incognito `/admin` redirects to login, (3) logged-in admin can CRUD all collections.

---

### Phase 3: Blog System + SEO Foundation

**Rationale:** Blog needs auth (Phase 2) for admin editing. SEO meta tags target blog + property routes — routes must exist first. Build-time HTML generation prevents zero-SEO pitfall (P4). Sitemap includes blog URLs.

**Delivers:**
- Extended `Noticias` schema: `slug`, `contenido`, `fecha`, `publicado` fields
- Admin form field components: `RichTextField` (react-quill), `DateField`, `BooleanField`
- Public `BlogList` + `BlogArticle` pages with routing
- Build-time static HTML generation for individual blog posts (build script reads Firestore via Admin SDK, outputs static HTML to `dist/`)
- `SEOHead` component for per-page meta tags (title, description, OG, canonical)
- react-helmet-async integration on: homepage, property detail, blog list, blog article
- `vite-plugin-sitemap` for build-time sitemap.xml including all routes
- `robots.txt` pointing to sitemap
- Update homepage `Noticias` section: link to `/blog/:slug` instead of external URLs, limit 3 latest

**Addresses:** SEO-01 (blog), SEO-02 (meta tags + sitemap)

**Avoids:** Pitfalls P4 (client-rendered blog — build-time HTML generation)

**Research flag:** This phase needs `/gsd-plan-phase --research-phase` for:
- **Build-time HTML generation approach:** Needs research on Firebase Admin SDK usage in Netlify build context, or using Netlify Functions for SSR. Two approaches identified (build script vs serverless function) — need specific implementation research during planning.
- **react-quill vs simpler editor:** Fran's technical comfort level unknown. May need markdown-based editor instead of rich text if HTML output is confusing.

**Verification:** `curl https://site.com/blog/mi-articulo` returns HTML with full blog content + `<title>` and `<meta>` tags in source.

---

### Phase 4: Feature Polish

**Rationale:** No dependencies on infrastructure or security. Safe to add after core is stable. P1 features are done — this adds P2 differentiators.

**Delivers:**
- Property sorting toggle (by `fechaIngreso` descending) in `Todaspropiedades.jsx`
- `TeamMemberModal` — expandable team bios with full description + photo + "Hablemos" email button
- `Equipo.jsx` updates: remove `<style jsx>`, add click handler + modal trigger + email per member
- `schemas.js` extension for `nosotros.email` field
- Structured data JSON-LD on property detail pages
- Code splitting: `React.lazy()` for `Modal.jsx` (715-line valuation modal)
- Sold properties showcase (optional — `vendido` boolean field + display section)

**Addresses:** PAG-01, PAG-02, PAG-03, CLN-05, structured data

**Avoids:** No critical pitfalls — these are additive changes with no architectural coupling.

**Research flag:** Standard patterns — no deeper research needed. JSON-LD is well-documented schema.org pattern. Code splitting is React built-in.

---

### Phase Ordering Rationale

- **Phase 1 before Phase 2-4:** BrowserRouter is prerequisite for all SEO work (PITFALLS P2). Code cleanup reduces risk when modifying files in later phases.
- **Phase 2 before Phase 3:** Auth gates admin blog editing. No auth = blog editor is publicly accessible = CRITICAL-01 vulnerability persists. Firestore rules gating write require auth to exist (P1 atomic deploy constraint).
- **Phase 3 before Phase 4:** Blog routes must exist for SEO meta tags to target them. Sitemap includes blog URLs. However, the following CAN run in parallel with Phase 3: property structured data (JSON-LD on existing routes), property sorting (no blog dependency), team modals (no blog dependency).
- **Why not merge Phase 3+4:** Phase 3 has complex build-time HTML generation that needs focused attention. Phase 4 items are straightforward. Separating them prevents the blog build complexity from delaying user-facing polish features.

### Research Flags

Phases needing deeper research during planning:
- **Phase 3 (Blog + SEO):** Two sub-issues — (1) build-time HTML generation approach needs Firebase Admin SDK research for Netlify build context, (2) editor choice (react-quill vs markdown vs alternative) depends on Fran's technical comfort
- **Phase 2 (Security):** FormSpree paid plan feature set needs verification — Honeypot may be sufficient, CAPTCHA may require paid plan

Phases with well-documented patterns (skip research-phase):
- **Phase 1 (Foundation):** BrowserRouter migration is a one-line import change + Netlify config. Code cleanup is mechanical.
- **Phase 4 (Polish):** Sorting, modals, JSON-LD, code splitting are standard React patterns with extensive documentation.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All versions verified via npm registry + Context7. Existing codebase audited. No ambiguous choices. |
| Features | HIGH | Source basis: Ahrefs real estate SEO guide (authoritative), project CONCERNS.md (primary), codebase audit. Competitor analysis supports differentiators. |
| Architecture | HIGH | Every component boundary verified against existing source code. Firebase Auth + Firestore rules patterns are standard. Schema-driven extension is proven pattern. |
| Pitfalls | HIGH | All pitfalls verified via official docs (Firebase, Netlify, React Router) + codebase analysis. Phase ordering explicitly derived from dependency graph. |

**Overall confidence:** HIGH

### Gaps to Address

1. **Build-time blog HTML generation tooling not specified.** ARCHITECTURE recommends build script with Firebase Admin SDK. PITFALLS agrees. But no specific Vite plugin or approach chosen. Needs research during Phase 3 planning. Options: custom build script, Netlify Functions SSR, or `vite-plugin-prerender`.

2. **Fran's technical comfort with rich text editor unknown.** react-quill chosen as default (most popular). But if Fran prefers markdown or a simpler interface, editor choice changes. Needs user interview before Phase 3 implementation.

3. **FormSpree feature set on free vs paid plan.** Honeypot may be sufficient for current traffic. If not, FormSpree's reCAPTCHA integration or paid plan needed. Verify before Phase 2 implementation.

4. **Number of existing blog posts / content migration plan.** `Noticias` collection exists — may have old documents with different schema. Needs audit. `publicado` field filter means old docs (no `publicado`) won't appear until edited.

5. **Structured data JSON-LD implementation deferred.** Not in v1.0 MVP. This means property detail pages won't have rich search results until v1.1. Acceptable trade-off but should be documented in requirements.

## Sources

### Primary (HIGH confidence)
- Context7 `/staylor/react-helmet-async` — compatibility matrix, React 18 support
- Context7 `/remarkjs/react-markdown` — components prop, plugins, syntax highlighting
- Context7 `/firebase/firebase-js-sdk` — `signInWithEmailAndPassword`, `onAuthStateChanged` API signatures
- Context7 `/websites/firebase_google` — Firestore security rules for authenticated users
- Context7 `/eslint/eslint` — v10 migration guide, flat config API, Node.js requirements
- Context7 `/remix-run/react-router` — HashRouter vs BrowserRouter guidance, SPA fallback
- Ahrefs Real Estate SEO Guide (Jan 2025) — industry-leading SEO tool research
- MDN Web Docs — HTML metadata, semantic elements
- Project codebase analysis (CONCERNS.md, App.jsx, Firebase.js, package.json, netlify.toml, firestore.rules)
- npm registry — latest version verification for all packages

### Secondary (MEDIUM confidence)
- react-quill GitHub popularity — most popular React rich text editor, verified via npm trends and GitHub stars
- Argentine real estate market patterns — WhatsApp dominance, portal landscape, boutique agency differentiation

---

*Research completed: 2026-07-22*
*Ready for roadmap: yes*
