# Stack: Atelier Homes Argentina

**Date:** 2026-07-22
**Focus:** Technology stack and dependencies

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
