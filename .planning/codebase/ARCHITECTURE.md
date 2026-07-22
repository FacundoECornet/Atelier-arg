# Architecture: Atelier Homes Argentina

**Date:** 2026-07-22
**Focus:** System design, patterns, data flow

## Architectural Pattern

**Single-page application (SPA)** with two logical sections:

1. **Public Site** — Landing page with hero, team, process, properties, contact, news sections
2. **Admin Panel** — CRUD interface for managing properties, news, and team members

No global state management. Components fetch Firestore data directly via `useEffect`. Admin uses schema-driven generic components.

## Component Layers

```
main.jsx → App.jsx (Router)
  └── Shell (layout wrapper)
       ├── Navbar (conditional: public only)
       ├── Routes
       │    ├── Public pages (eager loaded)
       │    └── Admin pages (lazy loaded via React.lazy)
       └── Footer (conditional: public only)
```

## Data Flow

### Read Path
```
Component → useEffect → Firestore SDK (getDocs/getDoc) → Local useState → Render
```

### Write Path (Admin)
```
AdminForm → handleChange (local state) → create()/update() → Firestore → SweetAlert2 feedback
```

### Properties Caching
```
Module-level variable (cachedData)
  - On mount: if cachedData is null → fetch Firestore → set cachedData → render
  - On nav: cachedData persists across page navigations
  - Hard refresh: cachedData resets → re-fetch from Firestore
  - refetch(): invalidates cache → re-fetch
```

## Entry Points

| File | Purpose |
|------|---------|
| `src/main.jsx` | React DOM mount, StrictMode wrapper |
| `src/App.jsx` | Router setup, route definitions, Shell layout |
| `src/index.css` | Tailwind directives + smooth scroll |
| `src/Firebase.js` | Firebase client initialization |

## Route Structure

```
/ → Landing page (Body + Equipo + Pasos + PropertyList + Formulario + Noticias)
/propiedades → All properties grid with province filter
/propiedades/:id → Property detail with gallery, lightbox
/admin → Admin dashboard hub
/admin/propiedades → CRUD list (properties)
/admin/propiedades/nuevo → Create property
/admin/propiedades/:id/editar → Edit property
/admin/noticias → CRUD list (news)
/admin/noticias/nuevo → Create news
/admin/noticias/:id/editar → Edit news
/admin/nosotros → CRUD list (team)
/admin/nosotros/nuevo → Create team member
/admin/nosotros/:id/editar → Edit team member
```

## Schema-Driven Admin Pattern

The admin panel is built around a schema definition in `src/Admin/schemas.js`:

```js
schemas.propiedades = {
  collection: 'propiedades',
  label: 'Propiedades',
  basePath: '/admin/propiedades',
  listColumns: ['Nombre', 'codigo', 'estado'],
  sortable: true,
  autoOrder: true,
  fields: [
    { key: 'Nombre', label: 'Nombre', type: 'text', required: true },
    { key: 'galeria', label: 'Galería (URLs)', type: 'arrayUrl', required: false },
    // ...
  ],
}
```

This drives:
- `AdminList.jsx` — renders table with columns from `listColumns`
- `AdminForm.jsx` — renders form fields by `fields` array
- Field types: `text`, `textarea`, `url`, `arrayUrl`

## Code Splitting

Admin routes use `React.lazy(() => import('./Admin/...'))` with `<Suspense>` fallback. Public routes are eagerly imported — no code splitting on the public section.

## Styling Architecture

- **Primary:** Tailwind utility classes (90% of styling)
- **Secondary:** `styled-components` (only Social.jsx icon hover effects)
- **Legacy/anomaly:** `Nosotros.jsx` has a stray `<style jsx>` block (Next.js pattern, inert in React)

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| HashRouter | Simpler static hosting (no SPA fallback config needed) |
| Module-level property cache | Avoids re-fetching on page navigation |
| Schema-driven admin | Single source of truth for CRUD UI = less code duplication |
| External image URLs | No Firebase Storage complexity; manual URL entry |
