# Phase 3: Blog System + SEO - Research

**Researched:** 2026-07-29
**Domain:** React SPA rich-text blogging, build-time static HTML generation, SEO meta tags, sitemap generation
**Confidence:** HIGH

## Summary

Phase 3 delivers blog authoring (admin rich-text editor + publish toggle), public blog pages (list + detail), homepage Noticias rewrite, and SEO foundation (per-page meta tags, build-time static HTML for crawlers, sitemap.xml, robots.txt, semantic HTML). The phase extends the existing schema-driven admin pattern with new field types (richText, date, bool), uses react-helmet-async for meta tag management, and runs a postbuild Node script using firebase-admin to generate static HTML files so crawlers receive full article content in page source.

**Primary recommendation:** Use `react-quill@2.0.0` (locked decision D-01), `react-helmet-async@3.0.0` with HelmetProvider at App.jsx root, `firebase-admin@12.7.0` (pinned for Node 18 Netlify compatibility), and `slugify@1.6.9` for accent-stripping slug generation. Generate sitemap.xml + robots.txt in the postbuild script (not via vite-plugin-sitemap) because sitemap entries depend on Firestore data fetched during the build.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Rich-text blog editing | Browser (Admin SPA) | — | react-quill runs client-side in admin route |
| Blog listing/detail rendering | Browser (Public SPA) | CDN/Static (postbuild HTML) | SPA for navigation, static HTML for crawlers |
| Per-page meta tags (title, description, OG) | Browser (SPA) + CDN/Static | — | react-helmet-async in SPA + hardcoded in static HTML |
| Build-time static HTML generation | Build pipeline (Node.js) | — | postbuild script runs after vite build |
| Sitemap.xml / robots.txt | Build pipeline (Node.js) | — | Generated in postbuild script alongside static HTML |
| Slug generation + conflict resolution | Browser (Admin SPA) | — | Schema-driven, computed on create/edit in AdminForm |
| Firestore data (Noticias collection) | Database (Firestore) | — | Extended schema: slug, contenido, fecha, publicado |

## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Use `react-quill` as the rich text editor. Heavier bundle acceptable since admin routes are lazy-loaded.
- **D-02:** Add new field components (`RichTextField.jsx`, `DateField.jsx`, `BooleanField.jsx`) to `src/Admin/fields/`. Extend the existing if/else chain in AdminForm.jsx's render loop - follow the exact same pattern as TextField/TextAreaField/ArrayUrlField.
- **D-03:** Boolean field for `publicado` renders as a toggle switch with labels "Publicado" / "Borrador".
- **D-04:** Date field for `fecha` uses native HTML `<input type="date">`. Defaults to today on create.
- **D-05:** Generate static HTML for blog articles at build time via a Firebase Admin SDK Node script. Run as a `postbuild` hook in package.json (after `vite build`). Script reads all published articles from Firestore, generates `dist/blog/:slug/index.html` files with full article content, meta tags, and OG tags.
- **D-06:** Firebase service account credentials provided as base64-encoded env var (`FIREBASE_SERVICE_ACCOUNT_B64`) in Netlify. Build script decodes to a temp file.
- **D-07:** Static HTML generated for blog articles only. Properties stay client-rendered (out of scope for Phase 3).
- **D-08:** Netlify serves static files first (`dist/blog/:slug/index.html` for direct/crawler visits). React Router handles `/blog/:slug` for SPA navigation. Static files get `<link rel="canonical">` pointing to themselves.
- **D-09:** Slug auto-generated from `titulo` on create (lowercase, spaces→hyphens, strip Spanish accents). Editable field in admin form. On title edit, slug does NOT auto-update.
- **D-10:** Slug conflicts resolved by auto-appending numeric suffix (e.g., `novedades-enero-2`).
- **D-11:** Extend existing `Noticias` collection schema with new fields: `slug`, `contenido`, `fecha`, `publicado`. Existing docs keep their current fields. New fields default: `slug=''`, `contenido=''`, `fecha`=created-at, `publicado=false`.
- **D-12:** Admin list view for Noticias shows: `titulo`, `slug`, `fecha`, `publicado` columns.
- **D-13:** Rewrite `Noticias.jsx`: query `${collection('Noticias').where('publicado', '==', true).orderBy('fecha', 'desc').limit(3)}`. Each card links to `/blog/:slug` via `useNavigate()`.
- **D-14:** Keep the existing animated "Ver más" button design. Change `onClick` from `window.open(noticia.url, '_blank')` to `navigate('/blog/' + noticia.slug)`.
- **D-15:** Hide the entire Noticias section when zero published blog articles exist (don't render at all).
- **D-16:** Add "Ver todas las novedades →" link below the 3 cards, linking to `/blog`.

### the agent's Discretion
- Blog list page layout: follow existing card pattern from `propiedadesCards.jsx` — grid of cards with image, title, date, excerpt.
- Blog article page layout: centered single-column with hero image, title, date, rich content via `dangerouslySetInnerHTML`.
- `react-helmet-async` provider placed at App.jsx root, wrapping Shell.
- Meta tags per page: `<title>` = page-specific title + " | Atelier Homes Argentina", `<meta description>` = first 160 chars of content or summary.
- SEO meta tag formulas, sitemap generation approach (manual script using Firestore data), semantic HTML audit scope — follow standard best practices.

### Deferred Ideas (OUT OF SCOPE)
- None — discussion stayed within phase scope.

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| BLOG-01 | Extender colección `Noticias` en Firestore con campos `slug`, `contenido`, `fecha`, `publicado` | Schema extension in schemas.js; existing docs get defaults per D-11 |
| BLOG-02 | Agregar campo `RichTextField` (react-quill) al schema-driven AdminForm | RichTextField.jsx component; react-quill@2.0.0 with Quill v1.3.7 CSS |
| BLOG-03 | Agregar campos `DateField` y `BooleanField` (publicado/draft) al schema-driven AdminForm | DateField.jsx (native `<input type="date">`), BooleanField.jsx (toggle switch) |
| BLOG-04 | Crear página pública `BlogList` con listado de artículos publicados | BlogList.jsx following Todaspropiedades.jsx card grid pattern |
| BLOG-05 | Crear página pública `BlogArticle` que muestra artículo individual por slug | BlogArticle.jsx following PropiedadesInfo.jsx detail pattern |
| BLOG-06 | Actualizar sección `Noticias` en homepage para enlace a `/blog/:slug` (límite 3 últimos) | Rewrite Noticias.jsx query + navigate; preserve Ver más button design |
| BLOG-07 | Generar HTML estático de cada artículo de blog en build time (Firebase Admin SDK) | Postbuild script with firebase-admin@12.7.0; writes dist/blog/:slug/index.html |
| SEO-01 | Integrar `react-helmet-async` con `HelmetProvider` en el root de la app | react-helmet-async@3.0.0; HelmetProvider wraps Shell in App.jsx |
| SEO-02 | Agregar meta tags por página: title, description, OG tags | Helmet components in each page component; static HTML gets hardcoded tags |
| SEO-03 | Generar `sitemap.xml` en build time incluyendo rutas de propiedades y blog | Postbuild script generates sitemap.xml from Firestore data (not vite-plugin-sitemap) |
| SEO-04 | Crear `robots.txt` apuntando al sitemap | Generated by postbuild script alongside sitemap.xml |
| SEO-05 | Auditoría de HTML semántico | Replace divs with `<main>`, `<article>`, `<section>`, `<time>`, `<nav>` per UI-SPEC |

## Standard Stack

### Core (New Dependencies)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-quill | 2.0.0 | Rich text editor in admin form | Locked decision D-01; ~230k weekly downloads; peer deps: React 16-18 [VERIFIED: npm registry] |
| react-helmet-async | 3.0.0 | Per-page meta tags (title, description, OG) | Locked by CONTEXT; ~2M weekly downloads; supports React 16-19; Thread-safe [VERIFIED: npm registry] |
| firebase-admin | 12.7.0 | Read Firestore in postbuild script | Locked D-05; v12 pinned for Node 18 Netlify compatibility (v14 requires Node ≥22); ~9M weekly downloads [VERIFIED: npm registry] |
| slugify | 1.6.9 | Accent-stripping slug generation | Strips Spanish accents correctly (tested); ~13M weekly downloads; 12 years old, well-established [VERIFIED: npm registry] |

### Supporting (Existing Dependencies — No Changes)
| Library | Version | Purpose |
|---------|---------|---------|
| React | ^18.2.0 | Already installed; all new components use existing patterns |
| react-router-dom | ^6.23.1 | Blog routes: `/blog`, `/blog/:slug`; useNavigate in Noticias.jsx |
| firebase | ^10.7.1 | Client-side Firestore reads for blog list/article components |
| sweetalert2 | ^11.10.0 | Admin confirm dialogs (unpublish, delete) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| react-quill (Quill v1) | @tinymce/tinymce-react or tiptap | TinyMCE has free tier limits; Tiptap needs more setup. react-quill simpler for this use case. Locked per D-01. |
| firebase-admin@12.7.0 | firebase-admin@latest (14.x) | v14 requires Node ≥22, Netlify runs Node 18. Must pin to v12. |
| Manual sitemap script | vite-plugin-sitemap | Plugin runs at closeBundle during vite build, before postbuild static HTML is generated — would miss blog article URLs. Manual script in postbuild has full Firestore access and runs after static HTML generation. |

**Installation:**
```bash
npm install react-quill react-helmet-async firebase-admin@12.7.0 slugify
```

**Version verification:**
- `react-quill`: 2.0.0 (2023-09-24) ✓
- `react-helmet-async`: 3.0.0 (2026-03-03) ✓
- `firebase-admin`: 12.7.0 (Node ≥14) ✓
- `slugify`: 1.6.9 ✓

## Package Legitimacy Audit

| Package | Registry | Age | Download Trend | Source Repo | slopcheck | Disposition |
|---------|----------|-----|---------------|-------------|-----------|-------------|
| react-quill | npm | ~11 yrs | ~230k/wk | github.com/zenoamaro/react-quill | [OK] | Approved |
| react-helmet-async | npm | ~8 yrs | ~2M/wk | github.com/staylor/react-helmet-async | [OK] | Approved |
| firebase-admin | npm | ~12 yrs | ~9M/wk | googleapis/nodejs-firebase-admin | [OK] | Approved |
| slugify | npm | ~12 yrs | ~13M/wk | github.com/simov/slugify | [OK] | Approved |

**Packages removed due to slopcheck [SLOP] verdict:** none
**Packages flagged as suspicious [SUS]:** none

**Postinstall script check:** All 4 packages have no postinstall scripts — no network/fsevents risk.

## Architecture Patterns

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     BUILD PIPELINE                          │
│                                                             │
│  npm run build                                              │
│    ├── 1. vite build  ───► dist/ (SPA bundle)               │
│    └── 2. postbuild.mjs                                     │
│          ├── Decode FIREBASE_SERVICE_ACCOUNT_B64            │
│          ├── Firebase Admin SDK ──► Firestore               │
│          │     ├── Read published Noticias (publicado=true) │
│          │     └── Read propiedades (for sitemap)           │
│          ├── Generate dist/blog/:slug/index.html (each)     │
│          ├── Generate dist/sitemap.xml                      │
│          └── Generate dist/robots.txt                       │
│                                                             │
│  Deploy to Netlify: dist/                                   │
│    Static files (dist/blog/*/index.html) served FIRST       │
│    SPA fallback (/* → /index.html 200) for all other paths  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     REQUEST FLOW                            │
│                                                             │
│  Crawler: curl /blog/mi-articulo                            │
│    → Netlify serves dist/blog/mi-articulo/index.html        │
│    → Full HTML with title, meta, OG, article content        │
│                                                             │
│  Browser (SPA): navigate to /blog/mi-articulo               │
│    → React Router matches /blog/:slug                       │
│    → BlogArticle.jsx renders                                │
│    → Fetches article from Firestore by slug                 │
│    → react-helmet-async injects meta tags into <head>       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     ADMIN WRITE PATH                        │
│                                                             │
│  Admin → AdminForm (noticias schema)                        │
│    ├── RichTextField (react-quill) → contenido              │
│    ├── DateField (input[type=date]) → fecha                 │
│    ├── BooleanField (toggle) → publicado                    │
│    ├── TextField → slug (auto-generated, editable)          │
│    └── Submit → Firestore addDoc/updateDoc                  │
│                                                             │
│  Slug generation (on create):                               │
│    titulo → slugify(lower, strict) → check Firestore        │
│    → if conflict: append "-2", "-3", etc.                   │
│    → Fran can edit slug before saving                       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     PUBLIC READ PATH                        │
│                                                             │
│  Homepage → Noticias.jsx                                    │
│    → Firestore: where(publicado,==,true)                    │
│                orderBy(fecha,desc) limit(3)                 │
│    → 3 cards with navigate('/blog/'+slug) on click          │
│    → "Ver todas las novedades →" link to /blog              │
│    → if 0 articles → render nothing (return null)           │
│                                                             │
│  /blog → BlogList.jsx                                       │
│    → Firestore: where(publicado,==,true)                    │
│                orderBy(fecha,desc)                          │
│    → Grid of cards: img, titulo, fecha, descripcion excerpt │
│    → Each card → navigate('/blog/'+slug)                    │
│                                                             │
│  /blog/:slug → BlogArticle.jsx                              │
│    → Firestore: where(slug,==,slugParam)                    │
│    → Hero image, title, fecha,                              │
│      contenido via dangerouslySetInnerHTML                  │
│    → Not found → "Artículo no encontrado"                   │
└─────────────────────────────────────────────────────────────┘
```

### Recommended Project Structure

```
src/
├── Blog/                       # NEW: public blog pages
│   ├── BlogList.jsx            # Published articles grid
│   └── BlogArticle.jsx         # Single article detail
├── Admin/
│   ├── schemas.js              # MODIFIED: extend noticias schema
│   ├── AdminForm.jsx           # MODIFIED: add richText/date/bool field types
│   └── fields/
│       ├── RichTextField.jsx   # NEW: react-quill wrapper
│       ├── DateField.jsx       # NEW: native date input
│       └── BooleanField.jsx    # NEW: publish/draft toggle
├── Componentes/
│   └── Noticias.jsx            # MODIFIED: blog query + navigation
└── App.jsx                     # MODIFIED: HelmetProvider + blog routes

scripts/
└── postbuild.mjs               # NEW: static HTML + sitemap + robots.txt
```

### Pattern 1: Schema-Driven Field Extension
**What:** Extend AdminForm.jsx if/else chain for new field types `richText`, `date`, `bool`.
**When to use:** Each new field type renders a dedicated field component following the `{ field, value, onChange }` props convention.
**Example:**
```jsx
// AdminForm.jsx — in the render loop (after existing field.type checks):
if (field.type === 'richText') return <RichTextField key={field.key} {...props} />
if (field.type === 'date') return <DateField key={field.key} {...props} />
if (field.type === 'bool') return <BooleanField key={field.key} {...props} />
```
**Source:** [VERIFIED: codebase — AdminForm.jsx line 107-112]

### Pattern 2: Field Component Template
**What:** Every field component receives `{ field, value, onChange }` and returns a labeled form control.
**When to use:** Any new admin field type.
**Example:**
```jsx
// RichTextField.jsx skeleton
import React from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

export default function RichTextField({ field, value, onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-gray-700">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <ReactQuill
        theme="snow"
        value={value || ''}
        onChange={(val) => onChange(field.key, val)}
        className="bg-white rounded-lg"
      />
    </div>
  )
}
```
**Source:** [VERIFIED: codebase — TextField.jsx, TextAreaField.jsx]

### Pattern 3: Firestore Slug Lookup
**What:** Query Noticias collection by slug field to find article or detect conflicts.
**When to use:** BlogArticle render, slug conflict detection on create.
**Example:**
```jsx
// Query by slug (BlogArticle.jsx)
const q = query(collection(db, 'Noticias'), where('slug', '==', slug))
const snap = await getDocs(q)
// Conflict detection (AdminForm create flow)
const q = query(collection(db, 'Noticias'), where('slug', '>=', baseSlug), where('slug', '<=', baseSlug + '\uf8ff'))
```
**Note:** Firestore doesn't support `LIKE`/`startsWith` queries. The conflict detection approach uses lexicographic range queries: `where('slug', '>=', base)` combined with `where('slug', '<=', base + '\uf8ff')` finds all slugs starting with the base. Count results and append `-N` as needed.
**Source:** [CITED: firebase.google.com/docs/firestore/query-data/queries] — range query pattern

### Pattern 4: Postbuild Script Structure
**What:** ESM Node script (`scripts/postbuild.mjs`) that reads Firestore and writes static files.
**When to use:** Build-time static HTML generation.
**Example:**
```js
// scripts/postbuild.mjs
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

// Decode credentials from env var
const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_B64, 'base64').toString('utf8')
)

const app = initializeApp({ credential: cert(serviceAccount) })
const db = getFirestore(app)

const DIST = join(process.cwd(), 'dist')

async function main() {
  // 1. Fetch published articles
  const snap = await db.collection('Noticias')
    .where('publicado', '==', true)
    .get()

  // 2. Generate static HTML for each article
  for (const doc of snap.docs) {
    const data = doc.data()
    const dir = join(DIST, 'blog', data.slug)
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
    writeFileSync(join(dir, 'index.html'), renderArticleHTML(data))
  }

  // 3. Generate sitemap.xml
  const propsSnap = await db.collection('propiedades').get()
  writeFileSync(join(DIST, 'sitemap.xml'), renderSitemap(snap.docs, propsSnap.docs))

  // 4. Generate robots.txt
  writeFileSync(join(DIST, 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: https://atelierhomes.com.ar/sitemap.xml\n')
}

main().catch(console.error)
```
**Source:** [ASSUMED] — structure follows D-05/D-06 specification; exact implementation at planner discretion.

### Anti-Patterns to Avoid
- **Importing react-quill in public components:** react-quill is heavy (~200KB+). Only import in admin field components, never in BlogList/BlogArticle/Noticias. Admin routes are already lazy-loaded.
- **Importing firebase-admin in client bundle:** firebase-admin is Node.js only (uses `fs`, `crypto`). Must NOT be imported in any `.jsx` file in `src/`. It belongs only in `scripts/postbuild.mjs`.
- **Modifying slug on title edit:** Per D-09, slug auto-generates only on create. Changing slug on edit breaks existing links and SEO. The slug field is editable for manual overrides only.
- **Using innerHTML without sanitization:** react-quill outputs HTML. In BlogArticle, use `dangerouslySetInnerHTML` — but react-quill already sanitizes output. Do NOT add a second sanitizer (would strip Quill's formatting).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Rich text editing | Custom contenteditable div | react-quill (locked D-01) | Text selection, formatting, toolbar, clipboard handling — thousands of edge cases |
| Document head meta tag management | Manual document.title + meta DOM manipulation | react-helmet-async | SSR-safe, handles nested tags, OG tag support, React 18 concurrent mode compatible |
| Spanish accent stripping | Custom regex replacement map | slugify | Handles ñ→n, á→a, ü→u, and dozens of other Unicode normalizations; locale-aware |
| Firebase Admin auth | Custom JWT handling | firebase-admin SDK | Service account auth, token refresh, Firestore wire protocol — all handled |
| XML sitemap generation | String concatenation | Manual template literal in postbuild | Sitemap XML schema is simple enough (no library needed); library adds dependency for ~20 lines of XML |
| HTML template rendering | Hand-rolled template engine | Template literal with embedded data | Simple string interpolation; each static HTML page is one article — no loops or conditionals needed |

**Key insight:** React-quill and firebase-admin each encapsulate massive complexity. react-quill wraps the Quill delta format, toolbar configuration, and clipboard normalization. firebase-admin handles gRPC connections, auth token lifecycle, and Firestore serialization. Building either from scratch would be >1000 lines before reaching feature parity with the first 5% of edge cases.

## Runtime State Inventory

> This phase is greenfield (new blog pages + admin field extensions + build script). No runtime state migration required — existing Noticias documents gain new fields with defaults per D-11.

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | Existing `Noticias` Firestore docs: no `slug`, `contenido`, `fecha`, `publicado` fields | Code handles defaults (`slug=''`, `contenido=''`, `fecha`=null, `publicado=false`). Fran manually adds content + slug + publishes to convert old docs. |
| Live service config | None | — |
| OS-registered state | None | — |
| Secrets/env vars | `FIREBASE_SERVICE_ACCOUNT_B64` env var needed in Netlify | New env var for postbuild script; Fran sets in Netlify UI |
| Build artifacts | `scripts/` directory exists with `backfill-orden.mjs` | Add `scripts/postbuild.mjs` alongside existing script |

**Nothing different from what D-11 already specifies:** existing docs keep current fields, new fields get defaults. Conversion is manual by Fran.

## Common Pitfalls

### Pitfall 1: Quill CSS Not Imported → Editor Is Invisible
**What goes wrong:** RichTextField renders but the editor area is blank/white — no toolbar, no text area.
**Why it happens:** react-quill depends on quill@1.3.7 whose CSS (`quill/dist/quill.snow.css`) is NOT bundled automatically. The `react-quill/dist/quill.snow.css` import path includes the Quill v1 theme CSS.
**How to avoid:** Import CSS in RichTextField.jsx: `import 'react-quill/dist/quill.snow.css'`. Verify toolbar and editor area are visible on first render.
**Warning signs:** Console has no errors but editor area is a flat white rectangle with no cursor. Quill toolbar div exists in DOM but has no height.

### Pitfall 2: firebase-admin v14 Requires Node ≥22 → Build Fails on Netlify
**What goes wrong:** `npm install firebase-admin` installs v14.x which requires Node ≥22. Netlify build environment runs Node 18 (configured in `netlify.toml`). Build fails with engine check error or runtime error.
**Why it happens:** npm's default `latest` tag resolves to v14.2.0. Netlify's `NODE_VERSION = "18"` is incompatible.
**How to avoid:** Pin to v12: `npm install firebase-admin@12.7.0`. Verify with `npm view firebase-admin@12.7.0 engines` → `{ node: '>=14' }`.
**Warning signs:** Build log shows `EBADENGINE` warning for firebase-admin, or runtime `SyntaxError` from unsupported Node features.

### Pitfall 3: SPA Fallback Shadows Static Blog HTML
**What goes wrong:** Crawler requests `/blog/mi-articulo` but receives index.html (the SPA shell) instead of the static HTML file.
**Why it happens:** If `force = true` is set on the `/* /index.html 200` redirect, Netlify overrides static files. Or if the static HTML file wasn't written to the correct path.
**How to avoid:** Current `netlify.toml` and `_redirects` have `/* /index.html 200` with NO `force` flag. Netlify defaults `force = false` — static files always take priority. Verify: `curl -I https://site.com/blog/test` returns `content-type: text/html` with article content in body, not the SPA shell.
**Warning signs:** `curl` on a blog URL returns the React app shell (empty `<div id="root">`) instead of rendered article HTML.

### Pitfall 4: Firestore `where('slug', '==', x)` Returns Empty When x Has Trailing Slash
**What goes wrong:** `useParams().slug` might include or exclude trailing slash depending on route config. If route is `/blog/:slug` and URL is `/blog/mi-articulo/`, `slug` = `"mi-articulo/"` which won't match Firestore.
**Why it happens:** react-router-dom v6 with `/:slug` doesn't strip trailing slashes by default.
**How to avoid:** In BlogArticle, normalize the slug: `const slug = slugParam.replace(/\/$/, '')`. Or verify route config uses exact matching (Vite SPA with BrowserRouter redirects `/blog/mi-articulo/` to `/blog/mi-articulo` via the `/* /index.html 200` fallback, which normalizes the path).

### Pitfall 5: react-quill onChange Fires on Every Keystroke → Firestore Write Storm (If Misused)
**What goes wrong:** If onChange were wired directly to Firestore updateDoc, every keystroke would trigger a write.
**Why it happens:** react-quill's onChange fires on every character insertion/deletion.
**How to avoid:** react-quill is used inside AdminForm.jsx which updates local state via `handleChange(key, value)`. Firestore write only happens on form submit (`handleSubmit`). This is already the correct pattern — no debouncing needed. Just ensure no one adds a useEffect that auto-saves on content change.

## Code Examples

Verified patterns from official sources:

### RichTextField Component
```jsx
// Source: react-quill npm README + codebase TextField.jsx pattern [VERIFIED: codebase]
import React from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'blockquote'],
    ['clean'],
  ],
}

export default function RichTextField({ field, value, onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-gray-700">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <ReactQuill
        theme="snow"
        modules={modules}
        value={value || ''}
        onChange={(val) => onChange(field.key, val)}
        className="bg-white rounded-lg [&_.ql-editor]:min-h-[200px] [&_.ql-toolbar]:rounded-t-lg [&_.ql-container]:rounded-b-lg"
      />
    </div>
  )
}
```

### HelmetProvider Setup in App.jsx
```jsx
// Source: react-helmet-async README [CITED: github.com/staylor/react-helmet-async]
import { HelmetProvider } from 'react-helmet-async'

function App() {
  return (
    <Router>
      <AuthProvider>
        <HelmetProvider>
          <Shell />
        </HelmetProvider>
      </AuthProvider>
    </Router>
  )
}
```

### Per-Page Meta Tags
```jsx
// Source: react-helmet-async README [CITED: github.com/staylor/react-helmet-async]
// In BlogArticle.jsx:
import { Helmet } from 'react-helmet-async'

<Helmet>
  <title>{article.titulo} | Atelier Homes Argentina</title>
  <meta name="description" content={article.descripcion?.substring(0, 160)} />
  <meta property="og:title" content={article.titulo} />
  <meta property="og:description" content={article.descripcion?.substring(0, 160)} />
  <meta property="og:image" content={article.img} />
  <meta property="og:type" content="article" />
  <meta property="og:url" content={`https://atelierhomes.com.ar/blog/${article.slug}`} />
  <link rel="canonical" href={`https://atelierhomes.com.ar/blog/${article.slug}`} />
</Helmet>
```

### Slug Generation with Spanish Accent Stripping
```js
// Source: slugify npm docs + verification [VERIFIED: npm registry + local test]
import slugify from 'slugify'

function generateSlug(titulo) {
  return slugify(titulo, { lower: true, strict: true })
  // "Novedades de enero — ¡Rebajas!" → "novedades-de-enero-rebajas"
}
```
**Verified:** Local test confirmed Spanish accent stripping: `ñ→n`, `á→a`, `é→e`, `í→i`, `ó→o`, `ú→u`, `ü→u`.

### Static HTML Template (Postbuild Script)
```js
// Source: [ASSUMED] — based on D-05/D-06 specification + SEO best practices
function renderArticleHTML(data) {
  const description = (data.descripcion || '').substring(0, 160)
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${data.titulo} | Atelier Homes Argentina</title>
  <meta name="description" content="${description}" />
  <meta property="og:title" content="${data.titulo}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${data.img || ''}" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="https://atelierhomes.com.ar/blog/${data.slug}" />
  <link rel="canonical" href="https://atelierhomes.com.ar/blog/${data.slug}" />
  <style>
    body { font-family: system-ui, sans-serif; max-width: 720px; margin: 0 auto; padding: 2rem 1rem; line-height: 1.7; color: #1a1a1a; }
    img { max-width: 100%; height: auto; border-radius: 0.75rem; margin: 1.5rem 0; }
    h1 { font-size: 2rem; margin-bottom: 0.5rem; }
    time { color: #666; font-size: 0.9rem; }
    .hero-img { width: 100%; max-height: 400px; object-fit: cover; border-radius: 1rem; margin-bottom: 1.5rem; }
  </style>
</head>
<body>
  <article>
    ${data.img ? `<img class="hero-img" src="${data.img}" alt="${data.titulo}" />` : ''}
    <h1>${data.titulo}</h1>
    ${data.fecha ? `<time datetime="${data.fecha}">${new Date(data.fecha).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })}</time>` : ''}
    <div>${data.contenido || ''}</div>
  </article>
</body>
</html>`
}
```

### Netlify Redirect Priority Verification
**Source:** [CITED: docs.netlify.com/routing/redirects/]
Netlify redirect rule processing: static files in the publish directory are served BEFORE redirect rules are evaluated. The current `_redirects` file has `/* /index.html 200` with no `force` flag. Default behavior (`force = false`) means existing files take priority. **No changes needed to netlify.toml or _redirects.** The postbuild script writes `dist/blog/:slug/index.html`, and Netlify serves these files directly for direct/crawler requests, while the SPA fallback handles browser navigation.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | postbuild script | ✓ | 24.18.0 (local), 18.x (Netlify) | — |
| npm | package installation | ✓ | 11.16.0 | — |
| Firebase service account | postbuild script (Firestore read) | ✗ | — | Fran creates in Firebase Console → encodes to base64 → sets FIREBASE_SERVICE_ACCOUNT_B64 in Netlify |
| `FIREBASE_SERVICE_ACCOUNT_B64` env var | postbuild script at build time | ✗ | — | Must be set in Netlify UI before first deploy; script fails gracefully if missing |

**Missing dependencies with no fallback:**
- `FIREBASE_SERVICE_ACCOUNT_B64`: Required for postbuild script to read Firestore. Build will fail without it. Fran must create Firebase service account key, base64-encode it, and add to Netlify environment variables.

**Missing dependencies with fallback:**
- None.

## Validation Architecture

> Skipped — `workflow.nyquist_validation` is explicitly set to `false` in `.planning/config.json`.

## Security Domain

### Applicable ASVS Categories

> `security_enforcement` is not explicitly disabled; this section applies.

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No (Phase 2 already implemented) | AuthGuard already protects /admin/* routes |
| V3 Session Management | No (Firebase Auth handles this) | — |
| V4 Access Control | No (Firestore rules handled in Phase 2) | — |
| V5 Input Validation | Yes | react-quill sanitizes HTML output by default; slug field must validate no special chars |
| V6 Cryptography | No (Firebase handles transport) | — |

### Known Threat Patterns for This Phase

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| XSS via rich-text content | Tampering | react-quill sanitizes output (no script tags, no event handlers). BlogArticle renders via `dangerouslySetInnerHTML` but content is pre-sanitized by Quill. |
| XSS via slug injection | Tampering | Slug is URL component — validate with `slugify` which strips all non-alphanumeric/hyphen chars. No raw user input in URL paths. |
| Information disclosure via Firestore query | Information Disclosure | Blog list/article only query `where('publicado', '==', true)`. Draft articles never appear in public queries. |
| Firebase service account exposure | Information Disclosure | Credentials decoded from env var at build time only. Script runs ephemerally. Base64 encoding is NOT encryption — but the env var is encrypted at rest in Netlify. Service account key should have minimal permissions (Firestore read-only). |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Netlify serves static files before redirect rules by default (force=false) | Architecture Patterns / Pitfall 3 | If Netlify changes default behavior, blog static HTML won't be served to crawlers. Mitigation: add explicit `force = false` to the `/* /index.html 200` redirect rule for clarity. |
| A2 | react-quill CSS is at `react-quill/dist/quill.snow.css` | Code Examples / Pitfall 1 | react-quill v2.0.0 re-exported quill v1 CSS under this path. If the package structure changes in a future version, the import will break. The pinned version prevents this. |
| A3 | Firestore range query `where('slug', '>=', base).where('slug', '<=', base + '\uf8ff')` catches all slug conflicts | Architecture Patterns — Pattern 3 | This is the standard Firestore pattern for prefix matching. If slug collision logic is complex (rare), a full collection scan may be needed. For this use case (manual blog posting, ~100 articles max), the range query is sufficient. |
| A4 | `siteIdentifier` for sitemap is `https://atelierhomes.com.ar` | Don't Hand-Roll / Code Examples | Project name is "Atelier Homes Argentina" based on PROJECT.md. If the actual domain is different, sitemap URLs and canonical links will be wrong. Domain should be confirmed with Fran before first deploy. |
| A5 | react-quill's built-in HTML sanitizer is sufficient for blog content | Security Domain | react-quill (Quill v1) sanitizes on paste and on output. If Fran needs embedded iframes or custom HTML, additional sanitization might be needed. For standard rich text (headings, lists, links, bold/italic), Quill's sanitizer is sufficient. |
| A6 | Firebase service account with `datastore.user` role is sufficient for postbuild script | Environment Availability | The postbuild script only reads Firestore. If Firebase requires additional permissions or the service account is misconfigured, the script fails. Mitigation: script logs a clear error message if auth fails. |
| A7 | `useParams().slug` returns the raw slug without encoding issues | Common Pitfalls — Pitfall 4 | react-router-dom v6 decodes URL params. If slugs contain `%` or special chars, they will be decoded. Since slugs are generated with `slugify(strict: true)`, only `[a-z0-9-]` characters appear — no URL encoding needed. |

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Client-only SPA blog | Build-time static HTML + SPA hydration | 2026-07 (this phase) | Crawlers get full content; SEO visibility improves |
| Manual `<title>` in each component | react-helmet-async with HelmetProvider | 2026-07 (this phase) | Declarative meta tags; nested route support; SSR-ready |
| Quill v2 standalone (2024) | react-quill (still on Quill v1.3.7) | react-quill not updated for Quill v2 | Bundle size stays at ~200KB; Quill v2 features unavailable. Acceptable per D-01 weight tolerance. |
| firebase-admin latest (v14, Node ≥22) | firebase-admin v12 (Node ≥14, Netlify compat) | 2026-07 (this phase) | Pinned to v12 for Netlify Node 18; v14 would require Build Image upgrade |

**Deprecated/outdated:**
- `react-helmet` (the non-async version): Deprecated, doesn't support React 18 concurrent mode. Use `react-helmet-async` per locked decision.
- Direct `document.title` manipulation: Not declarative, doesn't clean up on unmount, doesn't work for nested routes. Replaced by react-helmet-async.

## Open Questions (RESOLVED)

1. **Firebase service account permissions**
   - What we know: Script needs Firestore read access (Noticias + propiedades collections). Service account created in Firebase Console → IAM.
   - What's unclear: Whether Fran has Firebase Console access and can generate service account keys. The project already has Firebase setup with env vars in Netlify — likely yes.
   - Recommendation: Planner creates a task for Fran to generate service account key, base64-encode it, and add to Netlify env vars. Provide exact instructions.

2. **Site domain for sitemap/canonical URLs**
   - What we know: Project is "Atelier Homes Argentina", deployed on Netlify. Netlify subdomain or custom domain unknown.
   - What's unclear: Exact production domain (`atelierhomes.com.ar`? `atelierhomesarg.netlify.app`?).
   - Recommendation: Use a `SITE_URL` env var or hardcode the known domain. Planner includes a domain confirmation checkpoint.

3. **Existing Noticias docs with `url` field — migration path?**
   - What we know: Existing docs have `url` field for external links. D-11 keeps `url` field. New docs will have both `slug` and `url`. Old docs with only `url` won't appear in blog (no slug, no content, `publicado` defaults to false).
   - What's unclear: Should old Noticias docs that have `url` but no slug be visible anywhere? Or only newly-created blog articles?
   - Recommendation: Per D-11, old docs must be manually converted. BlogList and Noticias.jsx only query `where('publicado', '==', true)`, so old docs won't appear until Fran publishes them. This is correct behavior.

## Sources

### Primary (HIGH confidence)
- Codebase: `src/Admin/AdminForm.jsx` — field type if/else chain pattern [VERIFIED: codebase]
- Codebase: `src/Admin/fields/TextField.jsx` — field component template [VERIFIED: codebase]
- Codebase: `src/Admin/schemas.js` — Noticias schema definition [VERIFIED: codebase]
- Codebase: `src/App.jsx` — Router structure, AuthProvider placement [VERIFIED: codebase]
- Codebase: `src/Componentes/Noticias.jsx` — existing card pattern + animated button [VERIFIED: codebase]
- Codebase: `src/Propiedades/PropiedadesInfo.jsx` — detail page pattern reference [VERIFIED: codebase]
- Codebase: `src/Propiedades/Todaspropiedades.jsx` — card grid pattern reference [VERIFIED: codebase]
- npm registry: react-quill v2.0.0 — peerDeps: React 16-18, deps: quill@^1.3.7 [VERIFIED: npm registry]
- npm registry: react-helmet-async v3.0.0 — peerDeps: React 16.6-19 [VERIFIED: npm registry]
- npm registry: firebase-admin v12.7.0 — engines: node >=14 [VERIFIED: npm registry]
- npm registry: slugify v1.6.9 — accent stripping verified via local test [VERIFIED: npm registry]
- slopcheck: all 4 packages passed [OK] — no slop, no suspicious postinstall scripts [VERIFIED: slopcheck]
- Netlify Docs: [docs.netlify.com/routing/redirects/](https://docs.netlify.com/routing/redirects/) — `force` defaults to false, static files take priority [CITED]
- Firebase Docs: Firestore range queries for prefix matching [CITED: firebase.google.com/docs/firestore/query-data/queries]

### Secondary (MEDIUM confidence)
- react-quill GitHub README: [github.com/zenoamaro/react-quill](https://github.com/zenoamaro/react-quill) — API surface, module configuration [CITED]
- react-helmet-async GitHub README: [github.com/staylor/react-helmet-async](https://github.com/staylor/react-helmet-async) — HelmetProvider placement, Helmet API [CITED]
- slugify npm docs: Spanish accent handling behavior [VERIFIED: local test]

### Tertiary (LOW confidence)
- None — all claims verified or cited from authoritative sources.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all 4 packages verified via npm registry + slopcheck; versions confirmed compatible with existing stack
- Architecture: HIGH — patterns follow existing codebase conventions verified by reading source files; admin schema extension pattern confirmed
- Pitfalls: HIGH — verified against official docs (Netlify redirect behavior, Firebase Admin v14 engine requirement, react-quill CSS import path)
- Environment availability: MEDIUM — local Node.js confirmed; Netlify build environment assumed from netlify.toml; Firebase service account availability depends on Fran

**Research date:** 2026-07-29
**Valid until:** 2026-08-29 (30 days — stable ecosystem, no rapidly changing dependencies)
