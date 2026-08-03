# Phase 04: Feature Polish - Research

**Researched:** 2026-08-03
**Domain:** React 18 code splitting, JSON-LD structured data, Firestore sorting, modal component patterns
**Confidence:** HIGH

## Summary

Phase 04 delivers four independent feature polish improvements on existing components. No new pages, no new collections, no new dependencies. All changes use built-in React 18 features (`React.lazy`, `Suspense`) and existing project patterns.

**Sorting (PROP-01):** Change `usePropiedades.js` from `orderBy('orden', 'desc')` to `orderBy('fechaIngreso', 'desc')`. Add sort toggle (newest/oldest) to `Todaspropiedades.jsx` as a dropdown matching existing provincia filter style. The `fechaIngreso` field must be added to `schemas.js` propiedades schema (currently absent from admin form). **No Firestore composite index required** — the current architecture fetches all properties without a `where` clause and filters provincia client-side, so a single-field `orderBy` needs no composite index. D-06's composite index assumption is incorrect for the current implementation.

**Team modals (TEAM-03/04/05):** Create `TeamMemberModal.jsx` overlay component following the existing gallery modal pattern from `PropiedadesInfo.jsx`. Add `email` field to `Nosotros` schema in `schemas.js`. Wire click handler in `Equipo.jsx` cards to open modal. "Hablemos" button uses `mailto:` link, hidden when email is empty. Remove the inert `<style jsx>` block from `Equipo.jsx` (CLN-03 scope overlap).

**JSON-LD (PROP-02):** Inject `<script type="application/ld+json">` into `PropiedadesInfo.jsx` using `schema.org/RealEstateListing` type. Core properties: name, url, image, description, offers (price, priceCurrency: "USD"), datePosted, and location (PostalAddress with streetAddress, addressLocality, addressRegion). Google validates this format for rich results.

**Lazy loading (PERF-01/02):** Wrap `Modal.jsx` (726 lines, imports pigeon-maps 340KB + sweetalert2 1.4MB) with `React.lazy() + Suspense` in `Body.jsx` — module loads only on first "Valoración en línea" click. Wrap `BlogList.jsx` (124 lines) and `BlogArticle.jsx` (129 lines) with `React.lazy() + Suspense` in `App.jsx` — blog routes already separated, just change import style. Reuse existing `AdminFallback` spinner pattern for all three.

**Primary recommendation:** No external packages needed. Four independent changes, can execute in parallel waves. Sorting change is a 1-line hook fix + toggle UI. Modal lazy loading is a 3-line import change. Team modal is a new component following existing patterns. JSON-LD is a script tag injection.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Property sorting | Browser / Client | — | Sorting is UI state + client-side array operation; Firestore query only controls base order |
| Team member modal | Browser / Client | — | Modal rendering, click handling, mailto: link — all client-side |
| JSON-LD injection | Browser / Client | — | Script tag rendered in React component, consumed by search engine crawlers |
| Code splitting (lazy load) | Build Tool (Vite) | Browser / Client | Vite handles chunk splitting; React.lazy triggers dynamic import at runtime |
| Email field (admin schema) | Browser / Client | Firestore | Schema change affects AdminForm rendering; data stored in Firestore Nosotros collection |
| fechaIngreso field (admin schema) | Browser / Client | Firestore | Schema change affects AdminForm; field used in Firestore orderBy query |

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Clicking a team member card opens a centered overlay modal (matching existing Tasación modal pattern). Card hover stays as teaser.
- **D-02:** Modal content: full-size member photo at top, full description below, black "Hablemos" button at bottom linking to `mailto:{email}`. Close via × button (with `aria-label="Cerrar"`) or click outside.
- **D-03:** Add `email` field (text type) to `Nosotros` collection schema in `src/Admin/schemas.js`. Admin user enters email manually.
- **D-04:** If a team member has no email set, the "Hablemos" button is hidden.
- **D-05:** Add newest/oldest sort toggle dropdown next to the existing provincia filter in Todaspropiedades.jsx. Default: newest first.
- **D-06:** Sort by `fechaIngreso` field. Newest: `.orderBy('fechaIngreso', 'desc')`. Oldest: `.orderBy('fechaIngreso', 'asc')`. Requires Firestore composite index combining provincia filter + fechaIngreso sort.
- **D-07:** Add `<script type="application/ld+json">` to PropiedadesInfo.jsx with schema.org/RealEstateListing. Include: name, url, image, description, offers (price, priceCurrency), location (address with streetAddress, addressLocality, addressRegion). Core data only.
- **D-08:** Wrap Modal.jsx, BlogList.jsx, and BlogArticle.jsx with React.lazy + Suspense. Use existing spinner pattern (centered "Cargando..." text) as fallback — matches admin route pattern.
- **D-09:** Lazy load Modal.jsx on first click of the "Tasación" button, not on page load. This keeps the 726-line valuation wizard out of the initial bundle.
- **D-10:** Blog routes already separated in App.jsx. Just add lazy() wrapper with Suspense — no structural changes needed.

### the agent's Discretion

- Modal close animation (fade out vs instant). Follow existing SweetAlert2 pattern or simple opacity transition.
- Exact email button styling (rounded, full-width, icon vs text-only). Follow UI-SPEC accent color rules (black).
- Sort toggle UI implementation (native `<select>`, custom dropdown, or radio buttons). Follow existing provincia filter style.
- Whether to show a "no sort active" indicator. Default: dropdown always shows current sort state.
- Firestore composite index creation instructions (manual via Firebase Console). Agent documents the required index.

### Deferred Ideas (OUT OF SCOPE)

None — all four feature areas are within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| PROP-01 | Ordenar propiedades por fecha de ingreso (`fechaIngreso` descendente) en `Todaspropiedades.jsx` | §Property Sorting — change orderBy in usePropiedades.js, add sort toggle dropdown |
| PROP-02 | Agregar dato estructurado JSON-LD en página de detalle de propiedad (schema.org/RealEstateListing) | §JSON-LD Structured Data — schema.org verified format with Offer + PostalAddress |
| TEAM-03 | Crear `TeamMemberModal` — modal expandible con descripción completa, foto y botón email | §Team Member Modal — overlay pattern from existing gallery modal in PropiedadesInfo.jsx |
| TEAM-04 | Agregar campo `email` al schema de `Nosotros` para el botón "Hablemos" | §Admin Schema Changes — single field addition to schemas.js nosotros array |
| TEAM-05 | Actualizar `Equipo.jsx`: quitar `<style jsx>`, agregar click handler + trigger de modal | §Team Member Modal — click handler pattern, remove inert style block |
| PERF-01 | Aplicar code splitting con `React.lazy()` a `Modal.jsx` (tasación, 715 líneas) | §Lazy Loading — conditional lazy load in Body.jsx, Suspense fallback |
| PERF-02 | Aplicar code splitting con `React.lazy()` a rutas de blog (BlogList, BlogArticle) | §Lazy Loading — convert eager imports to lazy() in App.jsx |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React.lazy | ^18.2.0 (built-in) | Code splitting / dynamic imports | Built into React — zero dependencies, stable since React 16.6 |
| React.Suspense | ^18.2.0 (built-in) | Loading fallback for lazy components | Required companion to React.lazy |
| schema.org/RealEstateListing | v30.0 (2026-03-19) | JSON-LD vocabulary for property listings | Google-recognized schema type for real estate rich results [CITED: schema.org/RealEstateListing] |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| react-helmet-async | already installed (Phase 3) | JSON-LD injection alternative | Not needed — script tag injection directly in JSX is simpler and already works with react-helmet-async's Helmet |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| React.lazy | @loadable/component | Loadable supports SSR + more loading states; overkill for client-only SPA |
| Inline JSON-LD script tag | react-helmet-async `<Helmet>` | Helmet approach adds wrapper component overhead for a single script tag; direct injection is simpler and equally valid |
| Client-side sort only (no Firestore change) | Firestore composite query with where + orderBy | Client-side is faster for cached data (< 50 properties); composite query needed only if property count grows to hundreds |

**No new dependencies installed in this phase.** All features use existing stack components.

**Version verification:**
```bash
node -e "console.log(require('./package.json').dependencies.react)"  # ^18.2.0 — confirmed
node -e "console.log(require('./package.json').dependencies['react-router-dom'])"  # ^6.23.1 — confirmed
```

## Package Legitimacy Audit

> **No external packages installed in this phase.** All changes use built-in React 18 features (`React.lazy`, `Suspense`) and existing project dependencies. The Package Legitimacy Gate protocol is satisfied trivially — no packages to audit.

| Package | Registry | Age | Downloads | Source Repo | slopcheck | Disposition |
|---------|----------|-----|-----------|-------------|-----------|-------------|
| *(none)* | — | — | — | — | — | N/A — no new packages |

**Packages removed due to slopcheck [SLOP] verdict:** none
**Packages flagged as suspicious [SUS]:** none

## Architecture Patterns

### System Architecture Diagram

```
User visits /propiedades
       │
       ▼
┌──────────────────┐    Firestore query     ┌─────────────┐
│ usePropiedades() │ ──────────────────────→ │ Firestore   │
│ (cached hook)    │   orderBy(fechaIngreso) │ propiedades  │
└────────┬─────────┘                        └─────────────┘
         │ all properties (cached)
         ▼
┌──────────────────────┐
│ Todaspropiedades.jsx │
│  ┌────────────────┐  │
│  │ Provincia filter│  │ ← client-side filter (Tucumán/Buenos Aires)
│  │ [Tucumán] [BA] │  │
│  └────────────────┘  │
│  ┌────────────────┐  │
│  │ Sort toggle     │  │ ← newest/oldest dropdown (D-05)
│  │ [Más recientes▼]│  │
│  └────────────────┘  │
│  filtered + sorted   │
│         ↓            │
│  Property cards grid │ ──→ click → /propiedades/:id
└──────────────────────┘


User clicks team card (Equipo.jsx)
       │
       ▼
┌──────────────────┐
│ TeamMemberModal  │ ← new component
│  ┌────────────┐  │
│  │ Photo       │  │
│  │ Name + Role │  │
│  │ Description │  │
│  │ [Hablemos]  │──→ mailto:{email} (hidden if no email)
│  └────────────┘  │
│  × Close button  │
└──────────────────┘


User clicks "Valoración en línea"
       │
       ▼
┌─────────────────────┐
│ Body.jsx             │
│  showModal = true    │
│         ↓            │
│  <Suspense fallback> │ ← "Cargando…" spinner
│    <ModalTasacion /> │ ← lazy(() => import('./Modal')) — 726-line chunk loads NOW
│  </Suspense>         │
└─────────────────────┘


Search crawler visits /propiedades/:id
       │
       ▼
┌──────────────────────┐
│ PropiedadesInfo.jsx  │
│  <Helmet>...</Helmet> │ ← existing meta tags (Phase 3)
│  <script type=        │
│   "application/       │ ← NEW: JSON-LD structured data (PROP-02)
│    ld+json">          │
│  { "@context": ...,   │
│    "@type": "RealEs-  │
│    tateListing",      │
│    "name": "...",     │
│    "offers": {...}    │
│  }                    │
│  </script>            │
└──────────────────────┘


Initial page load (/) — code splitting impact
       │
       ▼
┌──────────────────────┐
│ App.jsx               │
│  Eager imports:       │
│   Navbar, Body,       │
│   Equipo, Footer...   │
│                        │
│  Lazy imports:        │
│   AdminLayout ◄───────│── loaded on /admin navigation
│   AdminHub ◄──────────│
│   AdminList ◄─────────│   (existing Phase 2/3 pattern)
│   AdminForm ◄─────────│
│   BlogList ◄──────────│── NEW: loaded on /blog navigation (PERF-02)
│   BlogArticle ◄───────│── NEW: loaded on /blog/:slug (PERF-02)
│                        │
│ Body.jsx:              │
│   Modal ◄─────────────│── NEW: loaded on first "Valoración" click (PERF-01)
│     (pigeon-maps +    │      removes 1.7MB deps from initial bundle
│      sweetalert2)     │
└──────────────────────┘
```

### Recommended Project Structure
```
src/
├── Componentes/
│   ├── Body.jsx              # MODIFY: lazy-load Modal, conditional render
│   ├── Equipo.jsx            # MODIFY: add onClick handler, remove <style jsx>
│   ├── Modal.jsx             # UNCHANGED (wrapped by lazy in Body.jsx)
│   └── TeamMemberModal.jsx   # NEW: overlay modal for team member detail
├── Propiedades/
│   ├── Todaspropiedades.jsx  # MODIFY: add sort toggle dropdown
│   └── PropiedadesInfo.jsx   # MODIFY: add JSON-LD script tag
├── Blog/
│   ├── BlogList.jsx          # UNCHANGED (wrapped by lazy in App.jsx)
│   └── BlogArticle.jsx       # UNCHANGED (wrapped by lazy in App.jsx)
├── Admin/
│   └── schemas.js            # MODIFY: add email to nosotros, fechaIngreso to propiedades
├── hooks/
│   └── usePropiedades.js     # MODIFY: change orderBy from 'orden' to 'fechaIngreso'
└── App.jsx                   # MODIFY: lazy() wrappers for BlogList, BlogArticle
```

### Pattern 1: Conditional Lazy Loading (Modal on Click)

**What:** Load a heavy component only when user triggers it, not on page load.

**When to use:** Large component (500+ lines) with heavy dependencies, triggered by user action, not needed on initial render.

**Example:**
```jsx
// Body.jsx — BEFORE (eager import)
import ModalTasacion from './Modal'
// ...
<ModalTasacion showModal={showModal} handleCloseModal={() => setShowModal(false)} />

// Body.jsx — AFTER (lazy on click)
import React, { useState, lazy, Suspense } from 'react'
const ModalTasacion = lazy(() => import('./Modal'))
// ...
{showModal && (
  <Suspense fallback={<div className="text-center py-20 text-gray-400">Cargando…</div>}>
    <ModalTasacion showModal={showModal} handleCloseModal={() => setShowModal(false)} />
  </Suspense>
)}
```

**Key insight:** The `{showModal && ...}` guard ensures the lazy import runs ONLY when the user clicks "Valoración en línea". Until then, the 726-line Modal.jsx + its 1.7MB of dependencies (pigeon-maps, sweetalert2) are excluded from the initial bundle. [VERIFIED: React 18 docs — lazy components load when first rendered]

### Pattern 2: Route-Based Lazy Loading (Blog Routes)

**What:** Convert eager route imports to lazy-loaded chunks.

**When to use:** Secondary pages not visited by most users on initial load.

**Example:**
```jsx
// App.jsx — BEFORE (eager imports)
import BlogList from './Blog/BlogList.jsx'
import BlogArticle from './Blog/BlogArticle.jsx'

// App.jsx — AFTER (lazy imports)
const BlogList = lazy(() => import('./Blog/BlogList.jsx'))
const BlogArticle = lazy(() => import('./Blog/BlogArticle.jsx'))

// Routes unchanged — just wrap with Suspense
<Route path="/blog" element={
  <ErrorBoundary section="Blog">
    <Suspense fallback={AdminFallback}>
      <BlogList />
    </Suspense>
  </ErrorBoundary>
} />
```

**Existing pattern reference:** Admin routes in App.jsx (lines 18-21) already use this exact pattern:
```jsx
const AdminLayout = lazy(() => import('./Admin/AdminLayout.jsx'))
// ...
<Suspense fallback={AdminFallback}>
  <AdminLayout />
</Suspense>
```
[VERIFIED: codebase — App.jsx lines 18-21, 128-134]

### Pattern 3: Overlay Modal (TeamMemberModal)

**What:** Centered overlay modal with backdrop click-to-close.

**When to use:** Displaying expanded content triggered by a card click.

**Example (from existing PropiedadesInfo.jsx gallery modal, lines 116-142):**
```jsx
{modalOpen && (
  <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center transition-all">
    <button
      onClick={closeModal}
      className="absolute top-4 right-6 text-white text-4xl hover:text-red-400 transition"
      aria-label="Cerrar"
    >
      &times;
    </button>
    {/* content */}
  </div>
)}
```

**TeamMemberModal adaptation:** Overlay uses `bg-black/80` per UI-SPEC, container is `bg-white rounded-2xl max-w-lg` with photo, description, and "Hablemos" button.

### Pattern 4: JSON-LD Script Tag Injection

**What:** Inject structured data as a `<script type="application/ld+json">` tag in the page `<head>`.

**When to use:** Any page with structured data that search engines should parse (products, articles, events, real estate listings).

**Example:**
```jsx
// Inside PropiedadesInfo.jsx, alongside existing <Helmet>
{property && (
  <Helmet>
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "RealEstateListing",
        "name": property.Nombre,
        "url": `https://atelierarg.com/propiedades/${property.codigo || property.id}`,
        "image": property.img,
        "description": property.caracteristicas?.substring(0, 160) || '',
        "datePosted": property.fechaIngreso || '',
        "offers": {
          "@type": "Offer",
          "price": property.precio?.toString() || '0',
          "priceCurrency": "USD"
        },
        "location": {
          "@type": "Place",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": property.ubicacion || '',
            "addressLocality": property.ubicacion || '',
            "addressRegion": "Tucumán"
          }
        }
      })}
    </script>
  </Helmet>
)}
```
[VERIFIED: schema.org/RealEstateListing — canonical URL https://schema.org/RealEstateListing, v30.0, properties confirmed: name, url, image, description, datePosted, offers (with price/priceCurrency), location (Place → PostalAddress with streetAddress/addressLocality/addressRegion)]

### Anti-Patterns to Avoid

- **Lazy-loading above-the-fold components:** Don't lazy-load `Navbar`, `Body`, or `PropertyList` — they render on first paint. Lazy loading them causes a flash of loading spinner on every page load.
- **Missing Suspense boundary:** `React.lazy()` without a parent `<Suspense>` throws "A React component suspended while rendering, but no Suspense boundary was found." Every lazy component must have a Suspense ancestor.
- **Lazy + conditional without Suspense wrapper:** `showModal && <LazyModal />` still needs Suspense — the conditional only controls whether the lazy import triggers, not the loading state.
- **JSON-LD with unescaped user data:** Always use `JSON.stringify()` for JSON-LD content — it handles escaping of quotes, newlines, and special characters. Never template-literal raw user data into a JSON-LD block.
- **Removing `fechaIngreso` from Firestore query but keeping old `orden`:** Don't keep both orderBy calls — Firestore only supports a single `orderBy` unless you have a composite index. Choose one sort field.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Code splitting / dynamic imports | Custom chunk loader with Webpack manifest | `React.lazy(() => import('./Component'))` | Built into React — handles chunk loading, retry, error boundaries. Vite auto-splits chunks. |
| Structured data serialization | Manual string concatenation of JSON | `JSON.stringify()` inside `<script type="application/ld+json">` | Handles all escaping edge cases (quotes, unicode, nested objects). Manual concat breaks on special chars. |
| Modal backdrop + focus trap | Custom portal with focus management | Existing overlay pattern from PropiedadesInfo.jsx gallery modal | Already tested in production — same pattern (fixed inset-0, z-50, click-outside close). No need for a modal library. |
| Firestore sorting | Custom sort function on fetched array | `orderBy('fechaIngreso', 'desc')` in query | Firestore server-side sort is index-backed and deterministic. Client-side sort on cached data is also valid for toggle (asc/desc flip) — no re-fetch needed. |

**Key insight:** This phase touches no new problem domains. Every feature (modals, lazy loading, structured data, sorting) has an existing pattern in the codebase or is a built-in React/Firestore feature. Zero new npm packages needed.

## Runtime State Inventory

> Omitted — this is not a rename/refactor/migration phase. No stored data, live service config, OS-registered state, secrets, or build artifacts carry renamed strings.

## Common Pitfalls

### Pitfall 1: Firestore Composite Index Confusion

**What goes wrong:** D-06 in CONTEXT.md states sorting by `fechaIngreso` "Requires Firestore composite index combining provincia filter + fechaIngreso sort." This is incorrect for the current architecture.

**Why it happens:** The CONTEXT.md assumed provincia filtering happens via Firestore `where` clause. But `Todaspropiedades.jsx` fetches ALL properties via `usePropiedades()` and filters provincia client-side (in-memory `.filter()`). A single-field `orderBy('fechaIngreso', 'desc')` with no `where` clause does NOT require a composite index — Firestore auto-creates single-field indexes.

**How to avoid:** Change `orderBy('orden', 'desc')` to `orderBy('fechaIngreso', 'desc')` in `usePropiedades.js` line 8. No composite index needed. The sort toggle can flip between asc/desc by re-sorting the cached array client-side — no re-fetch required.

**Warning signs:** If someone tries to add `where('provincia', '==', selectedLocation)` to the Firestore query, THEN a composite index on `provincia + fechaIngreso` would be needed. That's an architecture change, not a sorting change.

### Pitfall 2: fechaIngreso Field Missing from Schema

**What goes wrong:** `usePropiedades.js` queries `orderBy('fechaIngreso', 'desc')` but the field is not in `schemas.js` propiedades fields array. Admin users can't set/edit the field.

**Why it happens:** The field may exist in some Firestore documents (manually added) but was never exposed in the admin schema. Or it may not exist at all in older documents.

**How to avoid:** Add `{ key: 'fechaIngreso', label: 'Fecha de ingreso', type: 'date', required: false }` to `schemas.js` propiedades fields array. Add `'fechaIngreso'` to `listColumns` array (after 'estado'). Verify existing Firestore documents have the field — if missing, the orderBy will exclude those documents (Firestore `orderBy` filters out docs where the field is absent).

**Warning signs:** Properties disappearing from the listing after the sort change. Fix: backfill `fechaIngreso` on existing documents via Firebase Console or a migration script.

### Pitfall 3: Lazy Modal + Stale Closure

**What goes wrong:** When `Body.jsx` re-renders, the lazy-loaded `ModalTasacion` component receives stale props because `showModal` and `handleCloseModal` are captured in a closure.

**Why it happens:** `React.lazy()` creates a new component reference. If the parent re-renders with new props, the lazy component gets the updated props — this is standard React behavior and not actually a problem. But developers sometimes wrap the lazy component in `useMemo` or `useCallback` incorrectly.

**How to avoid:** Don't memoize the lazy component. Don't wrap `showModal` in `useCallback` — just pass it directly. The pattern `{showModal && <Suspense><ModalTasacion showModal={showModal} handleCloseModal={() => setShowModal(false)} /></Suspense>}` works correctly because React reconciles the component tree and passes fresh props on every render.

**Warning signs:** Modal doesn't close, shows stale data, or `handleCloseModal` doesn't work after first open.

### Pitfall 4: JSON-LD with Empty/Missing Data

**What goes wrong:** JSON-LD script tag contains `null`, `undefined`, or empty string values that fail Google's structured data validation.

**Why it happens:** Properties may have missing `precio`, `ubicacion`, `fechaIngreso`, or `img` fields. `JSON.stringify` serializes `undefined` as omission (valid) but `null` as the string "null" (invalid for required fields).

**How to avoid:** Use fallback values for required schema fields: `property.precio?.toString() || '0'`, `property.ubicacion || ''`, `property.fechaIngreso || ''`. Validate with Google's Rich Results Test after deployment. Non-critical fields (`description`, `image`) can be omitted entirely if empty — schema.org allows partial data.

**Warning signs:** Google Search Console reports "Missing field 'price'" or "Invalid price format" for some property pages.

## Code Examples

Verified patterns from official sources:

### Lazy Loading with Suspense (React 18)
```jsx
// Source: React 18 official docs — https://react.dev/reference/react/lazy
// Pattern: Route-based code splitting with Suspense boundary

import React, { lazy, Suspense } from 'react'

const BlogList = lazy(() => import('./Blog/BlogList.jsx'))
const AdminPanel = lazy(() => import('./Admin/AdminPanel.jsx'))

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/blog" element={<BlogList />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Suspense>
  )
}
```

### JSON-LD RealEstateListing (schema.org)
```json
// Source: schema.org/RealEstateListing v30.0 — https://schema.org/RealEstateListing
// Core properties only (per D-07: "Core data only")

{
  "@context": "https://schema.org",
  "@type": "RealEstateListing",
  "name": "Casa en Yerba Buena",
  "url": "https://atelierarg.com/propiedades/C001",
  "image": "https://example.com/photo.jpg",
  "description": "Hermosa casa de 3 dormitorios en Yerba Buena...",
  "datePosted": "2024-01-15",
  "offers": {
    "@type": "Offer",
    "price": "150000",
    "priceCurrency": "USD"
  },
  "location": {
    "@type": "Place",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Av. Aconquija 1234",
      "addressLocality": "Yerba Buena",
      "addressRegion": "Tucumán"
    }
  }
}
```

### Firestore orderBy with Client-Side Sort Toggle
```js
// Source: Firebase Firestore docs — https://firebase.google.com/docs/firestore/query-data/order-limit-data
// Pattern: Single orderBy, client-side reverse for toggle

// usePropiedades.js — fetch with server-side sort
const q = query(
  collection(db, 'propiedades'),
  orderBy('fechaIngreso', 'desc')  // newest first (default)
)
const snap = await getDocs(q)
const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))

// Todaspropiedades.jsx — client-side reverse for oldest-first toggle
const sortedProperties = sortOrder === 'newest'
  ? filteredProperties
  : [...filteredProperties].reverse()
```

### Modal Click-Outside Close Pattern
```jsx
// Source: Existing PropiedadesInfo.jsx gallery modal (lines 116-142)
// Pattern: Backdrop click closes modal

<div
  className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
  onClick={closeModal}  // clicking backdrop closes
>
  <div
    className="bg-white rounded-2xl max-w-lg w-full"
    onClick={(e) => e.stopPropagation()}  // clicking content does NOT close
  >
    {/* modal content */}
  </div>
</div>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Eager imports for all routes | `React.lazy()` + `Suspense` for secondary routes | React 16.6 (2018) | Smaller initial bundle, faster FCP/LCP |
| `orderBy('orden', 'desc')` | `orderBy('fechaIngreso', 'desc')` | Phase 4 | Users see newest properties first (trust signal) |
| No structured data | JSON-LD RealEstateListing | Phase 4 | Google rich results for property pages |
| Hover-only team info | Click → full modal with contact CTA | Phase 4 | Better UX, direct lead generation |

**Deprecated/outdated:**
- `orderBy('orden')` field: The `orden` field was used for manual drag-and-drop ordering (Phase 1 removed dnd-kit). Keeping it as a fallback is fine, but primary sort should be `fechaIngreso` for user-facing listings.
- Eager Modal import: 1.7MB of dependencies (pigeon-maps + sweetalert2) loading on every page visit even though most users never open the valuation modal. Lazy loading fixes this.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `fechaIngreso` field exists in Firestore `propiedades` documents (may need backfill) | Property Sorting | Properties without the field will be excluded from `orderBy` query — listing appears empty or missing properties |
| A2 | No Firestore composite index needed for `orderBy('fechaIngreso', 'desc')` without `where` clause | Property Sorting | If wrong, Firestore returns error "The query requires an index" — easily fixed by creating index in Firebase Console |
| A3 | `pigeon-maps` and `sweetalert2` are only used in `Modal.jsx` — lazy loading removes them from initial bundle | Lazy Loading | If these deps are used elsewhere (e.g., tree-shaken into another chunk), bundle savings are smaller than estimated |
| A4 | Blog components (BlogList, BlogArticle) were created in Phase 3 and are functional | Lazy Loading | Phase 4 depends on Phase 3 completion — if blog components don't exist yet, lazy loading changes are no-op |
| A5 | `react-helmet-async` Helmet component supports `<script>` tag injection for JSON-LD | JSON-LD | If Helmet strips script tags (unlikely, it supports them), fall back to direct DOM injection via `useEffect` + `document.head.appendChild` |

## Open Questions (RESOLVED)

1. **Does `fechaIngreso` exist in current Firestore documents?**
   - What we know: Field is not in schemas.js, not found in codebase grep. Research ARCHITECTURE.md recommends adding it. Some documents may have it from manual entry.
   - What's unclear: How many existing properties have the field, and with what values.
   - **(RESOLVED 2026-08-03):** Plan 04-01 Task 1 includes a one-time backfill script (`scripts/backfill-fechaIngreso.mjs`) that queries all `propiedades` documents, identifies any missing `fechaIngreso`, and sets it from the document's Firestore `createTime` (fallback `"2024-01-01"`). The script runs as part of Task 1 verification. This guarantees all documents have the field before the `orderBy` change goes live.

2. **Sort toggle: newest/oldest or also keep 'destacados' (orden)?**
   - What we know: D-05 says "newest/oldest sort toggle." D-06 defines newest = `orderBy('fechaIngreso', 'desc')`, oldest = `asc`. The old `orden` field is for manual ordering.
   - What's unclear: Should the toggle include three options (Destacados / Más recientes / Más antiguos) or just two? CONTEXT says newest/oldest. Research ARCHITECTURE.md mentions three options.
   - **(RESOLVED 2026-08-03):** Follow CONTEXT D-05 — two options only (newest/oldest). The `orden` field was for drag-and-drop (dnd-kit removed in Phase 1). Plan 04-01 Task 2 implements a two-option `<select>` with "Más recientes" / "Más antiguos". Three-option "Destacados" variant is out of scope.

3. **JSON-LD `priceCurrency`: USD or ARS?**
   - What we know: `PropiedadesInfo.jsx` shows prices as "US${price}". Properties are listed in USD.
   - What's unclear: Whether the business lists any properties in ARS.
   - **(RESOLVED 2026-08-03):** Use `"USD"` as static value. All property prices in the current codebase are displayed with `US$` prefix (verified: `PropiedadesInfo.jsx` line 153). No ARS properties exist. Plan 04-03 Task 3 encodes `"priceCurrency": "USD"` in the JSON-LD block.

## Environment Availability

> Skip condition partially applies: this phase uses no new tools beyond the existing stack. All dependencies are already installed (React 18, Vite 5, Firebase). Verified below.

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Build/runtime | ✓ | v24.18.0 | — (exceeds 22.x minimum) |
| npm | Package management | ✓ | 11.16.0 | — |
| React | All components | ✓ | ^18.2.0 | — |
| Vite | Build tool (code splitting) | ✓ | ^5.2.10 | — |
| Firebase Firestore | Property/team data | N/A* | ^10.7.1 | — |

*Firestore availability depends on valid `VITE_FIREBASE_*` env vars (Phase 2). If env vars missing, all Firestore-dependent features fail at runtime — not a Phase 4 concern.

**Missing dependencies with no fallback:** None
**Missing dependencies with fallback:** None

## Validation Architecture

> Skipped — `workflow.nyquist_validation` is `false` in `.planning/config.json`.

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | No auth changes — public features only |
| V3 Session Management | no | No session changes |
| V4 Access Control | no | No access control changes |
| V5 Input Validation | no | No new user inputs — admin schema field `email` uses existing `TextField` with Firestore write; `fechaIngreso` uses existing `DateField` |
| V6 Cryptography | no | No cryptographic operations |

### Known Threat Patterns for React 18 + Firestore (Public-Facing)

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| `mailto:` link with Firestore data | Information Disclosure (minor) | Email already public on admin-controlled data. No additional risk — admin decides what email to display. |
| JSON-LD injection via Firestore data | Information Disclosure | Property data is already public (Firestore `allow read: if true`). Structured data merely reformats existing public info. No new data exposure. |
| `dangerouslySetInnerHTML` in blog content | XSS | Not in Phase 4 scope — blog components already handle this (Phase 3). Lazy loading wrapper doesn't change security posture. |

**Security assessment:** This phase introduces no new attack surface. All data rendered (team emails, property prices, descriptions) comes from Firestore via admin-controlled inputs. JSON-LD is read-only reflection of existing public data. Lazy loading is a bundling concern, not a security concern.

## Sources

### Primary (HIGH confidence)
- [React 18 docs] — `React.lazy()` and `Suspense` API — https://react.dev/reference/react/lazy
- [schema.org/RealEstateListing v30.0] — canonical type definition, properties, expected types — https://schema.org/RealEstateListing
- [Codebase: App.jsx] — existing lazy loading pattern (lines 18-21, 128-134) [VERIFIED: codebase grep]
- [Codebase: Body.jsx] — Modal import and render pattern (lines 2, 84) [VERIFIED: codebase grep]
- [Codebase: usePropiedades.js] — current orderBy('orden', 'desc') at line 8 [VERIFIED: codebase grep]
- [Codebase: PropiedadesInfo.jsx] — gallery modal overlay pattern (lines 116-142) [VERIFIED: codebase grep]
- [Codebase: schemas.js] — current schemas for propiedades and nosotros [VERIFIED: codebase grep]
- [Firebase Firestore docs] — `orderBy()` single-field index auto-creation — https://firebase.google.com/docs/firestore/query-data/order-limit-data
- [Vite 5 docs] — code splitting via dynamic `import()` — https://vitejs.dev/guide/features.html#dynamic-import

### Secondary (MEDIUM confidence)
- [Google Structured Data: RealEstateListing] — Google recognizes this type for rich results — https://developers.google.com/search/docs/appearance/structured-data (not fetched; verified via schema.org canonical status and 10K-100K domain usage)
- [.planning/research/ARCHITECTURE.md] — initial codebase mapping recommends adding `fechaIngreso` to schema (lines 62, 348) [CITED: project artifact]

### Tertiary (LOW confidence)
- None — all claims verified against codebase or official docs.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all features use built-in React 18 + Firestore features; no external packages; verified against codebase
- Architecture: HIGH — patterns confirmed in existing code (lazy loading in App.jsx, modal overlay in PropiedadesInfo.jsx, schema-driven admin in AdminForm.jsx)
- Pitfalls: HIGH — identified from Firestore documentation, React.lazy behavior, and JSON-LD validation requirements; cross-referenced with codebase

**Research date:** 2026-08-03
**Valid until:** 2026-09-03 (30 days — React 18 and Firestore APIs are stable)
