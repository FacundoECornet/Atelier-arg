<!-- GSD:project-start source:PROJECT.md -->
## Project

**Atelier Homes Argentina — Mejoras v1**

Sitio web de propiedades (real estate) para Atelier Homes Argentina. Landing page pública con listado de propiedades, equipo, proceso de venta, formulario de contacto, tasación online y panel de administración para gestionar propiedades, noticias y equipo. El sitio existe y funciona — este proyecto agrega funcionalidad, mejora seguridad y limpia deuda técnica sin modificar el diseño visual ni la funcionalidad existente.

**Core Value:** El visitante puede explorar propiedades y contactar al equipo de Atelier de forma fluida, mientras que el equipo de Atelier puede gestionar el contenido del sitio de manera segura.

### Constraints

- **Stack:** React 18 + Vite 5 + Tailwind 3 + Firebase Firestore — no migrar
- **Estilo:** No modificar diseño visual existente ni funcionalidad actual
- **Idioma:** UI en español, datos en español
- **Hosting:** Netlify (sin cambios en deploy)
- **Seguridad:** Implementar auth sin afectar experiencia pública existente
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Languages & Runtime
| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| Frontend | JavaScript (JSX) | ES2022 | All `.jsx` files, no TypeScript |
| Runtime | Node.js | 22.x (engines) | Netlify builds use 18 |
| Package Manager | npm | ^10.x | `package-lock.json` present |
## Framework & Build
| Tool | Version | Purpose |
|------|---------|---------|
| React | ^18.2.0 | UI framework |
| Vite | ^5.2.10 | Build tool & dev server |
| @vitejs/plugin-react-swc | ^3.4.0 | SWC-based fast refresh (not Babel) |
## UI / Styling
| Library | Version | Usage |
|---------|---------|-------|
| Tailwind CSS | ^3.4.17 | Utility-first CSS (primary styling approach) |
| @headlessui/react | ^2.2.7 | Disclosure component for mobile nav |
| @heroicons/react | ^2.2.0 | Nav icon SVGs |
| styled-components | ^6.4.1 | Social icon hover effects only (`src/Componentes/Social.jsx`) |
| PostCSS + Autoprefixer | ^8.5.21 | CSS processing pipeline |
## Routing
| Library | Version | Usage |
|---------|---------|-------|
| react-router-dom | ^6.23.1 | HashRouter (hash-based SPA routing) |
## Data & Backend
| Service | Library | Purpose |
|---------|---------|---------|
| Firebase Firestore | firebase ^10.7.1 | Database (3 collections: `propiedades`, `Noticias`, `Nosotros`) |
| FormSpree | REST API | Contact form (`xdkdwpae`) + valuation form (`xrblyoez`) email delivery |
| OpenStreetMap/Nominatim | REST API | Geocoding search + reverse geocoding in valuation modal |
## Maps
| Library | Version | Usage |
|---------|---------|-------|
| pigeon-maps | ^0.22.1 | Interactive map component (OpenStreetMap tiles) |
## Notifications
| Library | Version | Usage |
|---------|---------|-------|
| sweetalert2 | ^11.10.0 | Modal dialogs, confirmations, toasts |
| sweetalert2-react-content | ^5.1.0 | React wrapper for SweetAlert2 |
## Unused Dependencies
| Package | Reason Not Used |
|---------|-----------------|
| @dnd-kit/core ^6.3.1 | Drag-and-drop removed; `bulkUpdateOrden` orphaned |
| @dnd-kit/sortable ^10.0.0 | Same — removed feature |
| @dnd-kit/utilities ^3.2.2 | Same — removed feature |
## Dev Tooling
| Tool | Purpose |
|------|---------|
| ESLint | Basic Vite template config (`eslint.config.js`) |
| SWC | Fast refresh compiler (replaces Babel) |
## Deployment
| Platform | Config File | Notes |
|----------|------------|-------|
| Netlify | `netlify.toml` | Build `npm run build`, publish `dist/`, Node 18 |
| Vercel | `vercel.json` | SPA rewrites all routes to `/` |
| Firebase App Hosting | `apphosting.yaml` | Present, likely experimental |
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## Code Style
- **No TypeScript** — all files are plain `.jsx`
- **JSDoc comments** — minimal, found in some utility files
- **ES Modules** — `import`/`export` syntax throughout
- **Arrow functions** — `const Component = () => { ... }` pattern
- **Explicit React import** — `import React from 'react'` in every JSX file (pre-React 17 pattern)
## Component Patterns
### Public Components
- Fetch data in `useEffect`, store in `useState`
- Render loading states (skeleton/spinner) based on boolean flags
- Error handling: set error state, optionally show SweetAlert2
### Admin Components
- Schema-driven: receive `schema` prop defining collection structure
- `AdminList.jsx` — generic table renderer from schema.listColumns
- `AdminForm.jsx` — generic form renderer from schema.fields
- Field components receive value/onChange as props
## Error Handling
### Pattern: SweetAlert2
### Pattern: try/catch with silent fail
### Pattern: Error state variable
## Loading States
### Pattern: Boolean loading flag
## Image Handling
### Fallback on error
### Lazy loading
## Form Handling
- **No form library** — raw `useState` with manual `handleChange`
- Each form field is a controlled component
- Validation: manual checks before submit
- Admin form auto-generates `orden` field for sortable collections
## State Management
- **No global state library** (no Redux, Zustand, Context API)
- **Module-level cache** for properties data
- Admin uses local `useState` per page
- No prop drilling beyond 1-2 levels
## CSS Conventions
- **Tailwind utility classes** for 90% of styling
- **Tailwind config**: minimal customization (no custom theme extensions)
- **styled-components**: used only in Social.jsx for hover animations
- **CSS files**: minimal global rules in `App.css` and `index.css`
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## Architectural Pattern
## Component Layers
```
```
## Data Flow
### Read Path
```
```
### Write Path (Admin)
```
```
### Properties Caching
```
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
```
## Schema-Driven Admin Pattern
```js
```
- `AdminList.jsx` — renders table with columns from `listColumns`
- `AdminForm.jsx` — renders form fields by `fields` array
- Field types: `text`, `textarea`, `url`, `arrayUrl`
## Code Splitting
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
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

| Skill | Description | Path |
|-------|-------------|------|
| senior-frontend | Comprehensive frontend development skill for building modern, performant web applications using ReactJS, NextJS, TypeScript, Tailwind CSS. Includes component scaffolding, performance optimization, bundle analysis, and UI best practices. Use when developing frontend features, optimizing performance, implementing UI/UX designs, managing state, or reviewing frontend code. | `.claude/skills/senior-frontend/SKILL.md` |
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
