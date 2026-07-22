# Phase 1: Foundation & Infrastructure - Context

**Gathered:** 2026-07-22
**Status:** Ready for planning

## Phase Boundary

Phase 1 migrates the site from HashRouter to BrowserRouter (required before any SEO work in Phase 3) and cleans all documented technical debt: orphaned dependencies, stale code, mixed styling approaches, missing error boundaries, and code formatting. Zero user-facing changes. All existing functionality preserved.

**In scope:** BrowserRouter migration, link audit, Netlify SPA fallback, remove `@dnd-kit/*`, remove `bulkUpdateOrden`, convert `<style jsx>` to Tailwind, remove `styled-components`, add ESLint React plugin + Prettier, add Error Boundaries.

**Out of scope:** SEO meta tags (Phase 3), auth/security (Phase 2), blog creation (Phase 3), property/team feature changes (Phase 4), environment variables (Phase 2).

## Implementation Decisions

### BrowserRouter Migration
- **D-01:** Replace `HashRouter` with `BrowserRouter` import in `App.jsx`. Add Netlify SPA fallback: `/* /index.html 200` in `netlify.toml` or `public/_redirects`.
- **D-02:** Audit links at moderate depth: grep all `.jsx` files for `/#/` patterns, plus manual review of `Header.jsx`, `Footer.jsx`, `Body.jsx` for all href patterns. Replace hash paths with React Router `<Link to="/...">` and `useNavigate()`. WhatsApp links, mailto, and external URLs are not in scope for this audit — they don't use hash fragments.
- **D-03:** Add client-side hash redirect component: `useEffect` in Shell or App detecting `location.hash` with old `/#/` fragments and redirecting to the clean path via `navigate()`. Keep permanently — handles old bookmarks, shared links, and external references.
- **D-03b:** Change `vite.config.js` base path from `"./"` to `"/"` for BrowserRouter compatibility. Required for nested route assets to resolve correctly.

### Code Cleanup — Dependencies
- **D-04:** Remove orphaned deps via `npm uninstall @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`.
- **D-05:** Remove `bulkUpdateOrden` from `src/Admin/firestoreApi.js` (line ~35, orphaned function from removed drag-and-drop feature).

### Code Cleanup — Styling Standardization
- **D-06:** Convert `<style jsx>` block in `src/Componentes/Equipo.jsx` (lines ~81-88) to Tailwind utility classes.
- **D-07:** Remove `styled-components` from `src/Componentes/Social.jsx`. Convert icon hover effects to Tailwind `hover:text-*` and `hover:scale-*` classes.

### Code Cleanup — Linting & Formatting
- **D-08:** Add `eslint-plugin-react`, `globals`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh` to `eslint.config.js` (packages already imported but missing from node_modules). Add `prettier` and `eslint-config-prettier`. Prettier config matches existing code style: single quotes, no semicolons, 2-space indent, trailing commas. Run `npx prettier --write src/` for initial formatting.

### Error Boundaries
- **D-09:** Create reusable `ErrorBoundary` class component. Wrap only `Propiedades` (data-heavy, most likely to fail) and `Admin` sections. Fallback UI: minimal Spanish error text, preserve surrounding layout, no SweetAlert. Body and Equipo sections excluded — they are static content, low failure risk.

### Agent's Discretion
- Error Boundary fallback design — keep minimal, preserve surrounding layout, no SweetAlert (avoid popup on critical sections). Wrap only Propiedades and Admin.

## Canonical References

### Project Context
- `.planning/PROJECT.md` — Project scope, constraints, validated requirements
- `.planning/REQUIREMENTS.md` — Phase 1 requirements: INFR-01, INFR-02, CLN-01 through CLN-06
- `.planning/ROADMAP.md` — Phase 1 goal and success criteria

### Architecture & Codebase
- `.planning/codebase/ARCHITECTURE.md` — Route structure, component layers, entry points
- `.planning/codebase/STACK.md` — React 18.2 + Vite 5.2 + Tailwind 3.4 versions
- `.planning/codebase/CONCERNS.md` — Documented issues MEDIUM-01/02/03, LOW-01, LOW-04
- `.planning/codebase/STRUCTURE.md` — File locations, routing in `App.jsx`
- `.planning/codebase/CONVENTIONS.md` — Arrow functions, Tailwind patterns, Spanish variable names

### Research
- `.planning/research/SUMMARY.md` — Phase 1 rationale: BrowserRouter migration blocks all SEO work
- `.planning/research/PITFALLS.md` — Pitfall P2 (HashRouter SEO dead end), Pitfall P7 (link breakage after migration)
- `.planning/research/STACK.md` — ESLint v10 + Prettier v3.9 recommendations, BrowserRouter SPA fallback approach

### External
- `netlify.toml` — Existing deploy config, add SPA rewrite rule
- `public/_redirects` — Existing Netlify redirect, verify compatibility

## Existing Code Insights

### Reusable Assets
- `src/App.jsx` — Router setup, Shell layout, all route definitions. Primary file to modify.
- `src/Admin/firestoreApi.js` — Contains orphaned `bulkUpdateOrden` to remove (line ~35).
- `src/Componentes/Social.jsx` — Only file using `styled-components`. Convert to Tailwind.
- `src/Componentes/Equipo.jsx` — Contains inert `<style jsx>` block (lines ~81-88). Convert to Tailwind.

### Established Patterns
- Arrow functions: `const Component = () => { ... }` — keep for ErrorBoundary (class-based still acceptable for error boundaries).
- Tailwind utility classes for 90% of styling — convert `<style jsx>` and styled-components to this.
- Spanish UI labels — Error Boundary fallback text in Spanish.
- React 17-style `import React from 'react'` — keep existing pattern.

### Integration Points
- `App.jsx` router configuration — abstracted under Shell, routes defined at top level.
- `netlify.toml` — SPA rewrite rule addition, no changes to build command or publish dir.
- `eslint.config.js` — ESLint v10 flat config; add plugins to existing config.
- `package.json` — Remove `dnd-kit/*` deps, `styled-components` (if not used after Social.jsx conversion).

## Specific Ideas

No specific design requirements — phase is purely mechanical/infrastructure. All conversions follow existing Tailwind patterns from the codebase.

## Deferred Ideas

None — discussion stayed within phase scope.

---

*Phase: 1-Foundation & Infrastructure*
*Context gathered: 2026-07-22*
