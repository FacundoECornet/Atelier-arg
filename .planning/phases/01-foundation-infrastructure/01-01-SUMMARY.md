---
phase: 01-foundation-infrastructure
plan: 01
subsystem: router, infra
tags: browserrouter, spa, netlify, hash-redirect, react-router

requires:
  - phase: null
    provides: existing HashRouter-based SPA
provides:
  - BrowserRouter with clean URLs (no # fragments)
  - Hash redirect for old /#/ bookmark compatibility
  - Netlify SPA fallback redirect rule
  - All navigation links updated to avoid hash hrefs
affects:
  - 03-seo (BrowserRouter prerequisite for meta tags)
  - 02-auth (admin routing uses same router)

tech-stack:
  added: []
  patterns:
    - BrowserRouter with SPA fallback for clean URLs
    - Client-side hash redirect for legacy bookmark support
    - Buttons with scrollIntoView instead of hash anchors

key-files:
  created: []
  modified:
    - vite.config.js (base '/' for BrowserRouter compatibility)
    - src/App.jsx (BrowserRouter, hash redirect useEffect)
    - netlify.toml (SPA fallback [[redirects]])
    - src/Componentes/Header.jsx (href cleanup, isActive simplification)
    - src/Componentes/Body.jsx (anchor→button for scroll CTA)

key-decisions:
  - "Migrate HashRouter to BrowserRouter — prerequisite for all Phase 3 SEO work"
  - "Keep hash redirect permanently to handle old bookmarks and shared links"
  - "Replace href anchor with button for same-page scroll CTAs (no navigation intent)"
  - "Simplify isActive check by removing location.hash (never set with BrowserRouter)"

patterns-established:
  - "Clean URL routing via BrowserRouter with SPA fallback"
  - "Old hash fragments redirect to corresponding clean paths"
  - "Scroll actions use buttons with scrollIntoView, not anchor elements"

requirements-completed:
  - INFR-01
  - INFR-02

duration: 5min
completed: 2026-07-22
---

# Phase 01 Plan 01: HashRouter → BrowserRouter Migration Summary

**Migrated HashRouter to BrowserRouter with clean URLs, hash redirect fallback, and SPA redirect rule for Netlify. Zero # fragments remain in navigation or address bar.**

## Performance

- **Duration:** 5 min
- **Started:** 2026-07-22T22:35:00Z
- **Completed:** 2026-07-22T22:40:00Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- BrowserRouter replaces HashRouter in App.jsx — all URLs now clean (no `#` fragments)
- `vite.config.js` base path set to `'/'` for BrowserRouter compatibility
- Netlify `[[redirects]]` SPA fallback rule added to `netlify.toml`
- Client-side hash redirect `useEffect` in Shell component — old `/#/propiedades` → `/propiedades` automatically
- All hash hrefs in Header.jsx (`#contacto`) replaced with clean URL (`/`)
- Contact CTA in Body.jsx converted from anchor to `<button type="button">` (no navigation intent)
- `isActive` check simplified — `location.hash` removed (dead code under BrowserRouter)
- Build passes, dev server serves all routes (/, /propiedades, /propiedades/:id)

## Task Commits

Each task was committed atomically:

1. **Task 1: Switch to BrowserRouter + fix Vite base + SPA fallback** - `cce2468` (feat)
2. **Task 2: Replace all # hrefs with React Router navigation** - `56b569a` (feat)

## Files Created/Modified

- `vite.config.js` — base path changed from `'./'` to `'/'` for BrowserRouter
- `src/App.jsx` — HashRouter→BrowserRouter import, added hash redirect useEffect with useNavigate
- `netlify.toml` — Added SPA fallback `[[redirects]]` block
- `src/Componentes/Header.jsx` — Desktop/mobile Contacto href changed from `#contacto` to `/`; isActive simplified (removed location.hash)
- `src/Componentes/Body.jsx` — Contact CTA anchor replaced with `<button type="button">`; handleScrollToContact simplified (no e.preventDefault)

## Decisions Made

- **BrowserRouter over HashRouter:** Required before any SEO work. All Phase 3 meta tags and sitemaps depend on clean URLs.
- **Keep hash redirect permanently:** The redirect `useEffect` catches old `/#/` bookmarks and shared links indefinitely. Removal would break externally shared URLs.
- **Button for same-page scroll:** Replacing `<a href="#contacto">` with `<button type="button" onClick={...}>` is semantically correct — scroll-to-section is an action, not navigation. Avoids href styling conflicts.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- `node_modules` was missing at build time — `npm install` resolved it. No impact on plan.

## Verification Summary

| Check | Result |
|-------|--------|
| `npm run build` completes | PASS |
| Dev server at http://localhost:5173 | PASS |
| `/propiedades` returns 200 | PASS |
| `/propiedades/test-id` returns 200 | PASS |
| Header: 0 hash hrefs | PASS |
| Body: 0 hash hrefs | PASS |
| Hash redirect code present in App.jsx | PASS |

Manual checks (visual/interactive) post-deployment:
- No `#` in address bar when navigating
- Nav links work without hash fragments
- "Contacto" button scrolls to form
- Old `/#!/propiedades` redirects to `/propiedades`

## Next Phase Readiness

- Phase 1 foundation complete — BrowserRouter enabled for all subsequent work
- Phase 2 (auth + Firestore rules) can proceed. Routes already use BrowserRouter paths.
- Phase 3 (SEO) no longer blocked by HashRouter. Meta tags and sitemaps can use clean URLs directly.

---

*Phase: 01-foundation-infrastructure*
*Completed: 2026-07-22*
