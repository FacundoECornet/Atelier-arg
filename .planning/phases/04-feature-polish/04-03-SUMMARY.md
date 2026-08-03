---
phase: 04-feature-polish
plan: 03
subsystem: ui
tags: react-lazy, code-splitting, json-ld, seo, perf, vite

# Dependency graph
requires:
  - phase: 04-feature-polish
    provides: Research/patterns for lazy loading (React.lazy + Suspense) and JSON-LD injection (04-RESEARCH.md, 04-PATTERNS.md)
provides:
  - Valuation Modal (726-line Modal.jsx) split into own chunk, loaded only on first "Valoración en línea" click
  - BlogList/BlogArticle split into own chunks, loaded only on /blog navigation
  - RealEstateListing JSON-LD structured data on property detail pages
affects: [04-feature-polish remaining plans, SEO verification, perf verification]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Conditional lazy loading: {showModal && <Suspense fallback>} guard around lazy(() => import(...))"
    - "Route-based lazy loading: lazy() + <Suspense fallback={AdminFallback}> inside ErrorBoundary"
    - "JSON-LD injection via JSON.stringify() inside react-helmet-async Helmet block"

key-files:
  created: []
  modified:
    - src/Componentes/Body.jsx
    - src/App.jsx
    - src/Propiedades/PropiedadesInfo.jsx

key-decisions:
  - "pigeon-maps and sweetalert2 remain in main bundle — Contacto.jsx imports them eagerly (pre-existing, out of scope)"
  - "JSON-LD domain atelierhomes.com.ar matches existing canonical URL (not atelierarg.com from RESEARCH example)"
  - "priceCurrency USD per business convention (properties displayed as US$ in PropiedadesInfo.jsx)"
  - "addressRegion Tucumán — primary business region per PROJECT.md"

patterns-established:
  - "Lazy component = module-level const with lazy(() => import(...)), always wrapped in Suspense fallback"
  - "Fallback styling: text-center py-20 text-gray-400 'Cargando…' (AdminFallback pattern)"
  - "JSON-LD field fallbacks (|| '', ?.toString() || '0') prevent null values per RESEARCH Pitfall 4"

requirements-completed: [PERF-01, PERF-02, PROP-02]

# Metrics
duration: 3min
completed: 2026-08-03
---

# Phase 04: Plan 03 — Code Splitting + JSON-LD Summary

**React.lazy code splitting for valuation Modal (726 lines) and blog routes (BlogList, BlogArticle) into separate Vite chunks excluded from initial bundle, plus RealEstateListing JSON-LD structured data in property detail pages**

## Performance

- **Duration:** 3 min
- **Started:** 2026-08-03T17:41:18Z
- **Completed:** 2026-08-03T17:43:50Z
- **Tasks:** 3
- **Files modified:** 3

## Accomplishments
- Valuation modal now loads only on first "Valoración en línea" click — `{showModal && <Suspense>}` guard triggers `lazy(() => import('./Modal'))`, excluding the 726-line component from initial bundle (PERF-01)
- Blog routes lazy-loaded — BlogList and BlogArticle split into separate chunks (2.72 kB, 3.52 kB gzip 1.24/1.34 kB), loaded only on /blog or /blog/:slug navigation (PERF-02)
- Property detail pages include schema.org/RealEstateListing JSON-LD with Offer (price, USD) and PostalAddress — validated serialized output has no null/undefined values (PROP-02)
- All three lazy components have Suspense fallback boundaries (T-04-08 mitigated) — build produces separate Modal/BlogList/BlogArticle chunks

## Task Commits

Each task was committed atomically:

1. **Task 1: Lazy load Modal.jsx in Body.jsx** - `f01c710` (feat)
2. **Task 2: Lazy load blog routes in App.jsx** - `97c60af` (feat)
3. **Task 3: Add JSON-LD structured data to PropiedadesInfo.jsx** - `5d2243d` (feat)

**Plan metadata:** `docs(04-03): complete plan` (pending final commit)

## Files Created/Modified
- `src/Componentes/Body.jsx` - React import adds `lazy, Suspense`; eager `import ModalTasacion from './Modal'` replaced with module-level `const ModalTasacion = lazy(() => import('./Modal'))`; render wrapped in `{showModal && <Suspense fallback="Cargando…">}` guard
- `src/App.jsx` - eager `import BlogList`/`import BlogArticle` replaced with `lazy(() => import(...))` consts; both /blog and /blog/:slug routes wrapped with `<Suspense fallback={AdminFallback}>` inside existing ErrorBoundary
- `src/Propiedades/PropiedadesInfo.jsx` - `<script type="application/ld+json">` added inside existing Helmet block after canonical link, using JSON.stringify() with RealEstateListing schema

## Decisions Made
- Used existing AdminFallback pattern (`Cargando…`, `text-center py-20 text-gray-400`) for blog lazy fallbacks — consistent with admin routes
- ErrorBoundary kept as outermost wrapper on blog routes — catches errors in both lazy chunk load and render
- JSON-LD uses `https://atelierhomes.com.ar/propiedades/${codigo || id}` matching existing canonical (corrected from RESEARCH example's atelierarg.com per PATTERNS.md)
- `priceCurrency: "USD"` per business convention; `addressRegion: "Tucumán"` static per PROJECT.md

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- **pigeon-maps + sweetalert2 still in main bundle:** Plan verification expected these excluded from initial load, but `src/Componentes/Contacto.jsx` (eagerly imported, renders on home page) imports both. This is a pre-existing condition outside this plan's scope (plan modifies only Body.jsx, App.jsx, PropiedadesInfo.jsx). The Modal.jsx *component code* is properly split out; the shared libraries remain because an unrelated eager component uses them. Documented as deferred — a future plan would need to lazy-load Contacto.jsx or extract the map usage.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Code splitting patterns established (conditional lazy + route lazy) — reusable for future large components
- JSON-LD ready for Google Rich Results Test validation post-deploy
- Remaining phase plans continue: sorting (PERF), blog polish, admin improvements
- Deferred: Contacto.jsx eager imports of pigeon-maps/sweetalert2 prevent full vendor-library exclusion

---
*Phase: 04-feature-polish*
*Completed: 2026-08-03*

## Self-Check: PASSED

- FOUND: src/Componentes/Body.jsx, src/App.jsx, src/Propiedades/PropiedadesInfo.jsx, 04-03-SUMMARY.md
- Commits verified: f01c710 (Task 1), 97c60af (Task 2), 5d2243d (Task 3), ad843bc (metadata)
- `npm run build` succeeds; separate chunks for Modal, BlogList, BlogArticle
- JSON-LD serialized output: no null/undefined values
- No stubs introduced (PLACEHOLDER constant pre-existing)
