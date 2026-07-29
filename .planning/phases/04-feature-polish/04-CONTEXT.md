# Phase 04: Feature Polish - Context

**Gathered:** 2026-07-29
**Status:** Ready for planning

## Phase Boundary

Phase 4 delivers four independent improvements to the existing site: team member contact modals (click card → full bio + email button), property sorting by date with user-visible toggle, JSON-LD structured data on property detail pages, and lazy loading for the valuation modal and blog routes. No new pages or collections. All changes are enhancements to existing components.

**In scope:** TeamMemberModal component, email field in Nosotros schema, click handler on Equipo.jsx cards, sort toggle in Todaspropiedades.jsx (newest/oldest), JSON-LD script tag in PropiedadesInfo.jsx, React.lazy wrapping for Modal.jsx, BlogList.jsx, BlogArticle.jsx with Suspense spinner fallbacks.

**Out of scope:** Team member photo uploads, team social media links, property filtering improvements beyond sort, pagination, new property fields, admin enhancements beyond email field.

## Implementation Decisions

### Team Member Modals
- **D-01:** Clicking a team member card opens a centered overlay modal (matching existing Tasación modal pattern). Card hover stays as teaser.
- **D-02:** Modal content: full-size member photo at top, full description below, black "Hablemos" button at bottom linking to `mailto:{email}`. Close via × button (with `aria-label="Cerrar"`) or click outside.
- **D-03:** Add `email` field (text type) to `Nosotros` collection schema in `src/Admin/schemas.js`. Admin user enters email manually.
- **D-04:** If a team member has no email set, the "Hablemos" button is hidden.

### Property Sorting
- **D-05:** Add newest/oldest sort toggle dropdown next to the existing provincia filter in Todaspropiedades.jsx. Default: newest first.
- **D-06:** Sort by `fechaIngreso` field. Newest: `.orderBy('fechaIngreso', 'desc')`. Oldest: `.orderBy('fechaIngreso', 'asc')`. Requires Firestore composite index combining provincia filter + fechaIngreso sort.

### JSON-LD Structured Data
- **D-07:** Add `<script type="application/ld+json">` to PropiedadesInfo.jsx with schema.org/RealEstateListing. Include: name, url, image, description, offers (price, priceCurrency), location (address with streetAddress, addressLocality, addressRegion). Core data only.

### Lazy Loading
- **D-08:** Wrap Modal.jsx, BlogList.jsx, and BlogArticle.jsx with React.lazy + Suspense. Use existing spinner pattern (centered "Cargando..." text) as fallback — matches admin route pattern.
- **D-09:** Lazy load Modal.jsx on first click of the "Tasación" button, not on page load. This keeps the 726-line valuation wizard out of the initial bundle.
- **D-10:** Blog routes already separated in App.jsx. Just add lazy() wrapper with Suspense — no structural changes needed.

### the agent's Discretion
- Modal close animation (fade out vs instant). Follow existing SweetAlert2 pattern or simple opacity transition.
- Exact email button styling (rounded, full-width, icon vs text-only). Follow UI-SPEC accent color rules (black).
- Sort toggle UI implementation (native `<select>`, custom dropdown, or radio buttons). Follow existing provincia filter style.
- Whether to show a "no sort active" indicator. Default: dropdown always shows current sort state.
- Firestore composite index creation instructions (manual via Firebase Console). Agent documents the required index.

## Canonical References

### Project Context
- `.planning/ROADMAP.md` — Phase 4 goal and success criteria
- `.planning/REQUIREMENTS.md` — PROP-01, PROP-02, TEAM-03, TEAM-04, TEAM-05, PERF-01, PERF-02
- `.planning/PROJECT.md` — Project scope, constraints, core value

### Architecture & Codebase
- `.planning/codebase/ARCHITECTURE.md` — Component layers, route structure
- `.planning/codebase/CONVENTIONS.md` — Code patterns (arrow functions, Tailwind, error handling)
- `.planning/codebase/STRUCTURE.md` — File locations

### Source Files (primary modification targets)
- `src/Componentes/Equipo.jsx` — Add click handler + modal trigger (86 lines)
- `src/Componentes/Modal.jsx` — Wrap with lazy loading (726 lines)
- `src/Propiedades/Todaspropiedades.jsx` — Add sort toggle (206 lines)
- `src/Propiedades/PropiedadesInfo.jsx` — Add JSON-LD script tag
- `src/Admin/schemas.js` — Add email field to Nosotros schema (49 lines)
- `src/App.jsx` — Add lazy loading for blog routes + Modal

### Design Contract
- `.planning/phases/04-feature-polish/04-UI-SPEC.md` — Visual contract: spacing, typography, color, component specs

### New Components to Create
- `src/Componentes/TeamMemberModal.jsx` — Overlay modal for team member detail

### Existing Phase Context
- `.planning/phases/03-blog-system-seo/03-CONTEXT.md` — Phase 3 already established lazy loading pattern + Tailwind-only convention

## Existing Code Insights

### Reusable Assets
- `src/Componentes/Modal.jsx` — Reference for overlay modal pattern (black/40 overlay, centered white container)
- `src/App.jsx` — Existing lazy loading pattern: `const X = lazy(() => import('...'))` + `<Suspense fallback={Spinner}>`
- `src/Propiedades/Todaspropiedades.jsx` — Existing provincia filter dropdown pattern (match sort toggle style)
- `src/Propiedades/PropiedadesInfo.jsx` — Property detail page where JSON-LD script tag goes

### Established Patterns
- Arrow function components: `const Component = () => { ... }`
- Tailwind only — no styled-components
- Spanish UI labels throughout
- Loading states: spinner "Cargando..." text centered
- Error handling: try/catch with user-facing error text
- Explicit `import React from 'react'` in all JSX files

### Integration Points
- `src/App.jsx` — Change Modal import to lazy; wrap BlogList/BlogArticle with lazy
- `src/Componentes/Equipo.jsx` — Import and use TeamMemberModal, add onClick to cards
- `src/Admin/schemas.js` — Add email to Nosotros fields and listColumns
- `src/Propiedades/PropiedadesInfo.jsx` — Add JSON-LD script before closing tag

## Specific Ideas

Team member modal follows existing overlay pattern from the valuation modal. Email button uses black accent color per UI-SPEC. Sort toggle dropdown uses the same `<select>` style as the existing provincia filter for visual consistency.

## Deferred Ideas

None — all four feature areas are within phase scope.

---

*Phase: 04-Feature Polish*
*Context gathered: 2026-07-29*
