# Phase 3: Blog System + SEO - Context

**Gathered:** 2026-07-29
**Status:** Ready for planning

## Phase Boundary

Phase 3 delivers a functional blog system with SEO foundation. Admin creates, edits, publishes, and unpublishes blog articles via a rich-text editor. Public pages: blog list (`/blog`) and article detail (`/blog/:slug`). Homepage Noticias section rewired to show the 3 most recent published articles linking to blog detail. SEO: per-page meta tags (react-helmet-async), automatic sitemap generation, robots.txt, semantic HTML audit, and build-time static HTML generation for blog articles so crawlers get full content in page source.

**In scope:** Extend Noticias Firestore collection with blog fields, rich-text editor in admin, new field types for schema-driven AdminForm (RichTextField, DateField, BooleanField), public BlogList and BlogArticle components, update homepage Noticias.jsx, react-helmet-async integration, per-page meta tags (title, description, OG), sitemap.xml generation, robots.txt, semantic HTML audit, build-time static HTML for blog articles.

**Out of scope:** Properties pre-rendering (Phase 4), team modals (Phase 4), code splitting (Phase 4), image uploads, categories/tags for blog, newsletters, multi-admin roles, commenting.

## Implementation Decisions

### Rich Text Editor & Admin Fields
- **D-01:** Use `react-quill` as the rich text editor. Heavier bundle acceptable since admin routes are lazy-loaded.
- **D-02:** Add new field components (`RichTextField.jsx`, `DateField.jsx`, `BooleanField.jsx`) to `src/Admin/fields/`. Extend the existing if/else chain in AdminForm.jsx's render loop to handle new field types — follow the exact same pattern as TextField/TextAreaField/ArrayUrlField.
- **D-03:** Boolean field for `publicado` renders as a toggle switch with labels "Publicado" / "Borrador".
- **D-04:** Date field for `fecha` uses native HTML `<input type="date">`. Defaults to today on create. Fran can override for backdated articles.

### Build-Time HTML Generation
- **D-05:** Generate static HTML for blog articles at build time via a Firebase Admin SDK Node script. Run as a `postbuild` hook in package.json (after `vite build`). Script reads all published articles from Firestore, generates `dist/blog/:slug/index.html` files with full article content, meta tags, and OG tags.
- **D-06:** Firebase service account credentials provided as base64-encoded env var (`FIREBASE_SERVICE_ACCOUNT_B64`) in Netlify. Build script decodes to a temp file.
- **D-07:** Static HTML generated for blog articles only. Properties stay client-rendered (out of scope for Phase 3).
- **D-08:** Netlify serves static files first (`dist/blog/:slug/index.html` for direct/crawler visits). React Router handles `/blog/:slug` for SPA navigation. Static files get `<link rel="canonical">` pointing to themselves.

### Slug Strategy & Data Migration
- **D-09:** Slug auto-generated from `titulo` on create (lowercase, spaces→hyphens, strip Spanish accents). Editable field in admin form — Fran can override before publish. On title edit, slug does NOT auto-update (prevents broken links).
- **D-10:** Slug conflicts resolved by auto-appending numeric suffix (e.g., `novedades-enero-2`). Fran sees the suffix and can refine the slug.
- **D-11:** Extend existing `Noticias` collection schema with new fields: `slug`, `contenido`, `fecha`, `publicado`. Existing docs keep their current fields (`url` included). New fields default: `slug=''`, `contenido=''`, `fecha`=created-at, `publicado=false`. Fran manually converts old docs to blog articles by adding content + slug and publishing.
- **D-12:** Admin list view for Noticias shows: `titulo`, `slug`, `fecha`, `publicado` columns. Updated in `schemas.js` `listColumns`.

### Homepage Noticias Transition
- **D-13:** Rewrite `Noticias.jsx`: query `${collection('Noticias').where('publicado', '==', true).orderBy('fecha', 'desc').limit(3)}`. Each card links to `/blog/:slug` via React Router's `useNavigate()`.
- **D-14:** Keep the existing animated "Ver más" button design. Change `onClick` from `window.open(noticia.url, '_blank')` to `navigate('/blog/' + noticia.slug)`.
- **D-15:** Hide the entire Noticias section when zero published blog articles exist (don't render at all).
- **D-16:** Add "Ver todas las novedades →" link below the 3 cards, linking to `/blog`.

### the agent's Discretion
- Blog list page (`BlogList.jsx`) layout: follow existing card pattern from `propiedadesCards.jsx` — grid of cards with image, title, date, excerpt.
- Blog article page (`BlogArticle.jsx`) layout: centered single-column with hero image, title, date, rich content rendered via `dangerouslySetInnerHTML`.
- `react-helmet-async` provider placed at App.jsx root, wrapping Shell.
- Meta tags per page: `<title>` = page-specific title + " | Atelier Homes Argentina", `<meta description>` = first 160 chars of content or summary.
- SEO meta tag formulas, sitemap generation approach (manual script using Firestore data), semantic HTML audit scope — follow standard best practices. Researcher details these in planning.

## Canonical References

### Project Context
- `.planning/PROJECT.md` — Project scope, constraints, validated requirements
- `.planning/REQUIREMENTS.md` — Phase 3 requirements: BLOG-01 through BLOG-07, SEO-01 through SEO-05
- `.planning/ROADMAP.md` — Phase 3 goal and success criteria

### Architecture & Codebase
- `.planning/codebase/ARCHITECTURE.md` — Route structure, schema-driven admin pattern, component layers
- `.planning/codebase/STRUCTURE.md` — File locations, source tree, naming conventions
- `.planning/codebase/CONVENTIONS.md` — Arrow functions, Tailwind patterns, error handling, form handling

### Source Files (primary modification targets)
- `src/Admin/schemas.js` — Noticias schema: add `slug`, `contenido`, `fecha`, `publicado` fields; update `listColumns`
- `src/Admin/AdminForm.jsx` — Extend field type if/else chain for `richText`, `date`, `bool`
- `src/Admin/fields/` — New field components: `RichTextField.jsx`, `DateField.jsx`, `BooleanField.jsx`
- `src/Componentes/Noticias.jsx` — Rewrite for blog article display
- `src/App.jsx` — Add `/blog` and `/blog/:slug` routes, wrap with HelmetProvider

### Existing Phase Context
- `.planning/phases/01-foundation-infrastructure/01-CONTEXT.md` — BrowserRouter migration, Tailwind-only styling, ErrorBoundaries in place

## Existing Code Insights

### Reusable Assets
- `src/Admin/schemas.js` — Noticias schema definition. Extend with new fields. Current: `titulo`, `descripcion`, `img`, `url`. Add: `slug`, `contenido`, `fecha`, `publicado`.
- `src/Admin/AdminForm.jsx` — Generic form renderer. Extend if/else chain for `richText`, `date`, `bool` field types.
- `src/Admin/fields/TextField.jsx` — Template for new field components (value/onChange prop pattern).
- `src/Componentes/Noticias.jsx` — Existing card grid component. Rewrite query and click handlers.
- `src/Propiedades/Todaspropiedades.jsx` — Reference for grid + filter pattern (use for BlogList layout ideas).
- `src/Propiedades/PropiedadesInfo.jsx` — Reference for detail page with hero image (use for BlogArticle layout ideas).
- `src/Componentes/propiedadesCards.jsx` — Card grid pattern with image, title, description.

### Established Patterns
- Arrow function components: `const Component = () => { ... }` — use for all new blog components.
- Data fetching: `useEffect` + Firestore `getDocs` + `useState` — follow existing pattern.
- Schema-driven admin: field components receive `{ field, value, onChange }` as props.
- Tailwind utility classes for 90% of styling — all new blog components use Tailwind.
- Loading state: boolean `loading` flag with skeleton/spinner.
- Error handling: try/catch with SweetAlert2 in admin, silent fail in public.
- Spanish UI labels throughout.
- Route setup in App.jsx: `<Route path="..." element={...} />`.
- Image lazy loading: `<img loading="lazy" decoding="async" />`.

### Integration Points
- `src/App.jsx` router — Add public blog routes: `/blog` (BlogList) and `/blog/:slug` (BlogArticle). Add HelmetProvider wrapping.
- `src/Admin/schemas.js` — Extend `noticias` schema. AdminForm and AdminList auto-pick up new fields via schema.
- `src/Componentes/Noticias.jsx` — Change data query (only published, ordered, limited) and click behavior (navigate instead of window.open).
- `package.json` scripts — Add `postbuild` script for static HTML generation.
- `netlify.toml` / `public/_redirects` — Verify SPA fallback doesn't interfere with static blog HTML files.
- `firebase-admin` dependency — Add for build-time script (used in postbuild only, not in client bundle).

## Specific Ideas

No specific design references provided. Blog list and article pages follow existing Tailwind card/hero patterns from the codebase. The animated "Ver más" button in Noticias.jsx is preserved as-is with only the navigation action changed.

## Deferred Ideas

None — discussion stayed within phase scope.

---

*Phase: 3-Blog System + SEO*
*Context gathered: 2026-07-29*
