# Structure: Atelier Homes Argentina

**Date:** 2026-07-22
**Focus:** Directory layout, file organization, naming

## Top-Level Layout

```
atelier-arg/
├── .claude/                   # Claude Code agent configuration
│   └── skills/
├── .gitignore
├── index.html                 # Vite entry HTML
├── package.json
├── vite.config.js             # Vite config (base: './', SWC plugin, React aliases)
├── tailwind.config.js
├── postcss.config.js
├── eslint.config.js           # ESLint flat config
├── netlify.toml               # Netlify deploy config
├── vercel.json                # Vercel SPA rewrite config
├── apphosting.yaml            # Firebase App Hosting config
├── firestore.indexes.json     # Firestore indexes (empty)
├── firestore.rules            # Firestore security rules (wide open)
├── public/
│   ├── _redirects             # Netlify SPA fallback
│   └── vite.svg
├── scripts/                   # (not explored — likely empty/build scripts)
└── src/
```

## Source Tree

```
src/
├── main.jsx                   # App entry: createRoot + StrictMode
├── App.jsx                    # Router, Shell layout, all route definitions
├── App.css                    # Minimal global styles
├── index.css                  # Tailwind directives + smooth-scroll
├── Firebase.js                # Firebase init + db export
│
├── Componentes/               # Public site components
│   ├── Header.jsx             # Navbar (desktop nav + mobile hamburger)
│   ├── Body.jsx               # Hero section with carousel + CTA
│   ├── Equipo.jsx             # Team section (Firestore Fetch)
│   ├── Pasos.jsx              # 8-step sales process carousel
│   ├── propiedadesCards.jsx   # Featured properties cards (homepage)
│   ├── Contacto.jsx           # Contact form (FormSpree)
│   ├── Noticias.jsx           # News section (Firestore Fetch)
│   ├── Modal.jsx              # Online valuation (4-step wizard + map)
│   ├── Footer.jsx             # Site footer
│   ├── Social.jsx             # Social icon links (styled-components)
│   └── Nosotros.jsx           # About us component
│
├── Propiedades/               # Property pages
│   ├── Todaspropiedades.jsx   # All properties grid + province filter
│   └── PropiedadesInfo.jsx    # Property detail (hero, gallery, lightbox)
│
├── Admin/                     # Admin panel
│   ├── AdminLayout.jsx        # Admin shell (header, nav, Outlet)
│   ├── AdminHub.jsx           # Admin dashboard with 3 cards
│   ├── AdminList.jsx          # Generic CRUD list (schema-driven)
│   ├── AdminForm.jsx          # Generic CRUD form (schema-driven)
│   ├── schemas.js             # Schema definitions for 3 collections
│   ├── firestoreApi.js        # Firestore CRUD helpers
│   └── fields/                # Form field components
│       ├── TextField.jsx
│       ├── TextAreaField.jsx
│       └── ArrayUrlField.jsx
│
├── hooks/
│   └── usePropiedades.js      # Custom hook with module-level cache
│
├── utils/
│   ├── formatPrice.js         # Price formatting (USD/ARS detection)
│   └── imgFallback.js         # Image error handling utilities
│
├── assets/                    # Static assets
├── Imagenes/                  # Image assets
└── index.css                  # (duplicate? same as root index.css)
```

## Naming Conventions

| Pattern | Example | Notes |
|---------|---------|-------|
| PascalCase components | `Header.jsx`, `PropiedadesInfo.jsx` | Consistent |
| camelCase utilities | `formatPrice.js`, `imgFallback.js` | Consistent |
| JSX extension | `.jsx` for all React files | Consistent |
| Spanish variable names | `Nombre`, `codigo`, `descripcion` | Data fields match Spanish UI |

## File Count

- **Total JS/JSX files:** ~30
- **Total lines:** ~3,200
- **Components:** 11 public + 6 admin + 2 property pages
