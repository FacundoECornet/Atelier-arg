# Requirements: Atelier Homes Argentina — Mejoras v1

**Defined:** 2026-07-22
**Core Value:** El visitante puede explorar propiedades y contactar al equipo de forma fluida, mientras el equipo gestiona el contenido del sitio de manera segura.

## v1 Requirements

Requirements for this improvement cycle. Each maps to roadmap phases.

### Infrastructure (INFR)

- [ ] **INFR-01**: Migrar de HashRouter a BrowserRouter con fallback SPA en Netlify (`/* /index.html 200`)
- [ ] **INFR-02**: Auditar y reemplazar todos los links con `#` (href, window.location.hash) por rutas de React Router
- [ ] **INFR-03**: Migrar configuración de Firebase a variables de entorno (`VITE_FIREBASE_*`) con validación al inicio
- [ ] **INFR-04**: Configurar variables de entorno en Netlify (deploy preview + producción)

### Code Cleanup (CLN)

- [ ] **CLN-01**: Remover dependencias huérfanas `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` de package.json
- [ ] **CLN-02**: Remover función huérfana `bulkUpdateOrden` de `src/Admin/firestoreApi.js`
- [ ] **CLN-03**: Eliminar bloque `<style jsx>` de `src/Componentes/Nosotros.jsx` (pattern de Next.js, no funciona en React)
- [ ] **CLN-04**: Migrar `styled-components` de `src/Componentes/Social.jsx` a clases Tailwind
- [ ] **CLN-05**: Agregar ESLint plugin de React y Prettier, ejecutar formateo inicial
- [ ] **CLN-06**: Agregar Error Boundaries en secciones principales (Body, Equipo, Propiedades, Admin)

### Security (SEG)

- [ ] **SEG-01**: Implementar Firebase Authentication (email/password) con `AuthContext`, `AuthGuard` y `LoginPage`
- [ ] **SEG-02**: Proteger rutas `/admin/*` con `AuthGuard` (login redirige si no autenticado)
- [ ] **SEG-03**: Actualizar reglas de Firestore: `allow read: if true; allow write: if request.auth != null`
- [ ] **SEG-04**: Agregar protección anti-spam a formularios (FormSpree Honeypot) en Contacto.jsx y Modal.jsx
- [ ] **SEG-05**: Crear usuario admin único manualmente en Firebase Console

### Blog & Content (BLOG)

- [ ] **BLOG-01**: Extender colección `Noticias` en Firestore con campos `slug`, `contenido`, `fecha`, `publicado`
- [ ] **BLOG-02**: Agregar campo `RichTextField` (react-quill) al schema-driven AdminForm para editar contenido
- [ ] **BLOG-03**: Agregar campos `DateField` y `BooleanField` (publicado/draft) al schema-driven AdminForm
- [ ] **BLOG-04**: Crear página pública `BlogList` con listado de artículos publicados
- [ ] **BLOG-05**: Crear página pública `BlogArticle` que muestra artículo individual por slug
- [ ] **BLOG-06**: Actualizar sección `Noticias` en homepage para que enlace a `/blog/:slug` (límite 3 últimos)
- [ ] **BLOG-07**: Generar HTML estático de cada artículo de blog en build time (Firebase Admin SDK o script)

### SEO (SEO)

- [ ] **SEO-01**: Integrar `react-helmet-async` con `HelmetProvider` en el root de la app
- [ ] **SEO-02**: Agregar meta tags por página: title, description, OG tags en homepage, detalle de propiedad, blog list, blog article
- [ ] **SEO-03**: Generar `sitemap.xml` en build time incluyendo rutas de propiedades y blog (vite-plugin-sitemap)
- [ ] **SEO-04**: Crear `robots.txt` apuntando al sitemap
- [ ] **SEO-05**: Auditoría de HTML semántico (reemplazar divs con `<main>`, `<article>`, `<nav>`, `<section>`)

### Properties (PROP)

- [ ] **PROP-01**: Ordenar propiedades por fecha de ingreso (`fechaIngreso` descendente) en `Todaspropiedades.jsx`
- [ ] **PROP-02**: Agregar dato estructurado JSON-LD en página de detalle de propiedad (schema.org/RealEstateListing)

### Team (TEAM)

- [ ] **TEAM-03**: Crear `TeamMemberModal` — modal expandible con descripción completa, foto y botón email
- [ ] **TEAM-04**: Agregar campo `email` al schema de `Nosotros` para el botón "Hablemos"
- [ ] **TEAM-05**: Actualizar `Equipo.jsx`: quitar `<style jsx>`, agregar click handler + trigger de modal

### Performance (PERF)

- [ ] **PERF-01**: Aplicar code splitting con `React.lazy()` a `Modal.jsx` (tasación, 715 líneas)
- [ ] **PERF-02**: Aplicar code splitting con `React.lazy()` a rutas de blog (BlogList, BlogArticle)

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Enhanced Features

- **SEO-06**: Google Search Console verification y monitoreo de indexación
- **PROP-03**: Vitrina de propiedades vendidas (`vendido` boolean + sección de showcase)
- **TEAM-06**: Fotos del equipo en alta resolución con lazy loading optimizado
- **PERF-03**: Lighthouse CI para monitoreo de performance en cada deploy

### Future

- **AUTH-01**: Múltiples usuarios admin con roles (owner, editor)
- **BLOG-08**: Editor de imágenes para blog posts (upload a Firebase Storage)
- **BLOG-09**: Categorías y tags para artículos de blog
- **BLOG-10**: Email newsletter integrado con nuevos artículos

## Out of Scope

| Feature | Reason |
|---------|--------|
| Migración a Next.js o SSR | Fuera del alcance — mantener stack React+Vite actual |
| TypeScript | Mantener JSX, el equipo no usa TS |
| CMS headless externo | Complejidad innecesaria — Firestore + admin panel funciona |
| Carga de imágenes (upload) | URLs externas funcionan, agregar Storage es otra fase |
| Chat en vivo / chatbot | No requerido, WhatsApp cumple ese rol |
| Multi-idioma (i18n) | Sitio en español, no hay demanda de otros idiomas |
| Tests automatizados | Fuera del alcance inmediato, agregar si hay regresiones |
| App mobile nativa | Web-first, responsive actual funciona en mobile |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| INFR-01 | Phase 1 | Pending |
| INFR-02 | Phase 1 | Pending |
| INFR-03 | Phase 2 | Pending |
| INFR-04 | Phase 2 | Pending |
| CLN-01 | Phase 1 | Pending |
| CLN-02 | Phase 1 | Pending |
| CLN-03 | Phase 1 | Pending |
| CLN-04 | Phase 1 | Pending |
| CLN-05 | Phase 1 | Pending |
| CLN-06 | Phase 1 | Pending |
| SEG-01 | Phase 2 | Pending |
| SEG-02 | Phase 2 | Pending |
| SEG-03 | Phase 2 | Pending |
| SEG-04 | Phase 2 | Pending |
| SEG-05 | Phase 2 | Pending |
| BLOG-01 | Phase 3 | Pending |
| BLOG-02 | Phase 3 | Pending |
| BLOG-03 | Phase 3 | Pending |
| BLOG-04 | Phase 3 | Pending |
| BLOG-05 | Phase 3 | Pending |
| BLOG-06 | Phase 3 | Pending |
| BLOG-07 | Phase 3 | Pending |
| SEO-01 | Phase 3 | Pending |
| SEO-02 | Phase 3 | Pending |
| SEO-03 | Phase 3 | Pending |
| SEO-04 | Phase 3 | Pending |
| SEO-05 | Phase 3 | Pending |
| PROP-01 | Phase 4 | Pending |
| PROP-02 | Phase 4 | Pending |
| TEAM-03 | Phase 4 | Pending |
| TEAM-04 | Phase 4 | Pending |
| TEAM-05 | Phase 4 | Pending |
| PERF-01 | Phase 4 | Pending |
| PERF-02 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 34 total
- Mapped to phases: 34
- Unmapped: 0 ✓

---
*Requirements defined: 2026-07-22*
*Last updated: 2026-07-22 after initial definition*
