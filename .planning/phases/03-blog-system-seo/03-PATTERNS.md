# Phase 3: Blog System + SEO — Pattern Map

**Mapped:** 2026-07-29
**Files analyzed:** 11 (6 new, 5 modified)
**Analogs found:** 11/11

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `src/Blog/BlogList.jsx` (NEW) | component | CRUD | `src/Propiedades/Todaspropiedades.jsx` | exact |
| `src/Blog/BlogArticle.jsx` (NEW) | component | CRUD | `src/Propiedades/PropiedadesInfo.jsx` | exact |
| `src/Admin/fields/RichTextField.jsx` (NEW) | component | CRUD | `src/Admin/fields/TextField.jsx` | exact |
| `src/Admin/fields/DateField.jsx` (NEW) | component | CRUD | `src/Admin/fields/TextField.jsx` | exact |
| `src/Admin/fields/BooleanField.jsx` (NEW) | component | CRUD | `src/Admin/fields/TextField.jsx` | exact |
| `scripts/postbuild.mjs` (NEW) | utility | batch/transform | `scripts/backfill-orden.mjs` | role-match |
| `src/Admin/schemas.js` (MODIFY) | config | CRUD | extends itself | same-file |
| `src/Admin/AdminForm.jsx` (MODIFY) | component | CRUD | extends itself | same-file |
| `src/Componentes/Noticias.jsx` (MODIFY) | component | CRUD | rewrites itself / `Todaspropiedades.jsx` | same-file |
| `src/App.jsx` (MODIFY) | config | request-response | extends itself | same-file |
| `package.json` (MODIFY) | config | — | extends itself | same-file |

---

## Pattern Assignments

### `src/Blog/BlogList.jsx` (component, CRUD)

**Analog:** `src/Propiedades/Todaspropiedades.jsx` (lines 1-206)

**Imports pattern** (Todaspropiedades lines 1-5):
```jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { db } from '../Firebase'
import { handleImgFallback } from '../utils/imgFallback'
```

**Core card grid pattern** (Todaspropiedades lines 9-13, 126-200):
```jsx
const BlogList = () => {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetch = async () => {
      try {
        const q = query(
          collection(db, 'Noticias'),
          where('publicado', '==', true),
          orderBy('fecha', 'desc')
        )
        const snap = await getDocs(q)
        setArticles(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      } catch {
        // silent — empty list if fetch fails
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])
```

**Loading skeleton pattern** (Todaspropiedades lines 99-108 and propiedadesCards lines 36-43):
```jsx
if (loading) {
  return (
    <div className="px-4 sm:px-6 lg:px-8 pt-32 pb-12 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1,2,3].map(i => (
          <div key={i} className="animate-pulse bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <div className="h-64 bg-gray-200" />
            <div className="p-6 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

**Empty state pattern** (Todaspropiedades lines 149-155 + UI-SPEC copy):
```jsx
if (!loading && articles.length === 0) {
  return (
    <div className="px-4 sm:px-6 lg:px-8 pt-32 pb-12 max-w-7xl mx-auto text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">No hay artículos publicados todavía</h2>
      <p className="text-gray-600">Vuelve pronto para conocer las últimas novedades de Atelier Homes Argentina</p>
    </div>
  )
}
```

**Card item pattern — follow propiedadesCards.jsx (lines 44-97) for the grid card visual:**
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
  {articles.map(article => (
    <div
      key={article.id}
      onClick={() => navigate(`/blog/${article.slug}`)}
      className="cursor-pointer group bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300"
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={article.img}
          alt={article.titulo}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          decoding="async"
          onError={handleImgFallback('/placeholder-property.jpg')}
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-black mb-2 line-clamp-2">{article.titulo}</h3>
        {article.fecha && <p className="text-gray-500 text-sm mb-2">{article.fecha}</p>}
        <p className="text-gray-700 text-sm line-clamp-3">{article.descripcion}</p>
      </div>
    </div>
  ))}
</div>
```

**Helmet meta tags pattern** (from RESEARCH.md lines 448-460 — per the agent's discretion):
```jsx
import { Helmet } from 'react-helmet-async'

// Inside component return:
<Helmet>
  <title>Novedades | Atelier Homes Argentina</title>
  <meta name="description" content="Descubre las últimas novedades del mercado inmobiliario" />
  <meta property="og:title" content="Novedades | Atelier Homes Argentina" />
  <meta property="og:description" content="Descubre las últimas novedades del mercado inmobiliario" />
  <meta property="og:type" content="website" />
  <link rel="canonical" href="https://atelierhomes.com.ar/blog" />
</Helmet>
```

---

### `src/Blog/BlogArticle.jsx` (component, CRUD)

**Analog:** `src/Propiedades/PropiedadesInfo.jsx` (lines 1-206)

**Imports pattern** (PropiedadesInfo lines 1-6 + Helmet):
```jsx
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../Firebase'
import { handleImgFallback } from '../utils/imgFallback'
import { Helmet } from 'react-helmet-async'
```

**Core detail pattern — fetch by slug** (PropiedadesInfo lines 9-45 adapted):
```jsx
const BlogArticle = () => {
  const { slug } = useParams()
  const navigate = useNavigate()

  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        const cleanSlug = slug.replace(/\/$/, '')        // strip trailing slash
        const q = query(collection(db, 'Noticias'), where('slug', '==', cleanSlug))
        const snap = await getDocs(q)
        if (!snap.empty) {
          const d = snap.docs[0]
          setArticle({ id: d.id, ...d.data() })
        } else {
          setError('Artículo no encontrado')
        }
      } catch {
        setError('Error al cargar el artículo')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [slug])
```

**Loading + error states** (PropiedadesInfo lines 60-61):
```jsx
if (loading) return <div className="text-center py-20 text-xl">Cargando...</div>
if (error) return <div className="text-center text-red-500 py-20">{error}</div>
```

**Hero + content layout** (PropiedadesInfo lines 63-78 adapted — centered single-column per UI-SPEC):
```jsx
return (
  <div className="w-full min-h-screen bg-gray-50">
    <Helmet>
      <title>{article.titulo} | Atelier Homes Argentina</title>
      <meta name="description" content={article.descripcion?.substring(0, 160)} />
      <meta property="og:title" content={article.titulo} />
      <meta property="og:description" content={article.descripcion?.substring(0, 160)} />
      <meta property="og:image" content={article.img} />
      <meta property="og:type" content="article" />
      <link rel="canonical" href={`https://atelierhomes.com.ar/blog/${article.slug}`} />
    </Helmet>

    {/* Hero */}
    <div className="relative w-full h-80 md:h-[450px] overflow-hidden shadow-xl">
      <img
        src={article.img}
        alt={article.titulo}
        className="w-full h-full object-cover brightness-75"
        onError={handleImgFallback('/placeholder-property.jpg')}
      />
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white text-center drop-shadow-lg px-4">
          {article.titulo}
        </h1>
      </div>
    </div>

    {/* Content */}
    <main className="max-w-2xl mx-auto px-4 py-12">
      {article.fecha && (
        <time datetime={article.fecha} className="text-gray-500 text-sm block mb-6">
          {new Date(article.fecha).toLocaleDateString('es-AR', {
            year: 'numeric', month: 'long', day: 'numeric'
          })}
        </time>
      )}
      <article
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: article.contenido || '' }}
      />
      <div className="mt-12">
        <button
          onClick={() => navigate('/blog')}
          className="bg-gray-900 text-white px-5 py-2 rounded-lg hover:scale-[1.02] transition duration-200 text-sm"
        >
          ← Volver al blog
        </button>
      </div>
    </main>
  </div>
)
```

---

### `src/Admin/fields/RichTextField.jsx` (component, CRUD)

**Analog:** `src/Admin/fields/TextField.jsx` (lines 1-20)

**Imports + core pattern** (TextField lines 1-19 adapted — follow exact same container/label pattern):
```jsx
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

---

### `src/Admin/fields/DateField.jsx` (component, CRUD)

**Analog:** `src/Admin/fields/TextField.jsx` (lines 1-20)

**Core pattern** (TextField lines 1-19 adapted — `<input type="date">`):
```jsx
import React from 'react'

export default function DateField({ field, value, onChange }) {
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-gray-700">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type="date"
        value={value || today}
        onChange={(e) => onChange(field.key, e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black text-sm"
      />
    </div>
  )
}
```

---

### `src/Admin/fields/BooleanField.jsx` (component, CRUD)

**Analog:** `src/Admin/fields/TextField.jsx` (lines 1-20)

**Core pattern** (TextField container adapted — toggle switch per D-03):
```jsx
import React from 'react'

export default function BooleanField({ field, value, onChange }) {
  const isPublished = value === true

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-gray-700">{field.label}</label>
      <button
        type="button"
        onClick={() => onChange(field.key, !isPublished)}
        className={`relative w-28 h-9 rounded-full transition-colors duration-200 ${
          isPublished ? 'bg-black' : 'bg-gray-300'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-8 h-8 bg-white rounded-full shadow transition-transform duration-200 flex items-center justify-center text-xs font-bold ${
            isPublished ? 'translate-x-[72px]' : 'translate-x-0'
          }`}
        >
          {isPublished ? '✓' : '✗'}
        </span>
        <span className={`absolute top-1/2 -translate-y-1/2 text-xs font-semibold ${
          isPublished ? 'left-3 text-white' : 'right-3 text-gray-600'
        }`}>
          {isPublished ? 'Publicado' : 'Borrador'}
        </span>
      </button>
    </div>
  )
}
```

---

### `scripts/postbuild.mjs` (utility, batch/transform)

**Analog:** `scripts/backfill-orden.mjs` (lines 1-51)

**Import pattern** (backfill-orden lines 1-6 adapted — use firebase-admin instead of client SDK):
```js
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'
```

**Script structure** (backfill-orden lines 20-51 — async main + error handling at bottom):
```js
const DIST = join(process.cwd(), 'dist')

async function main() {
  // 1. Decode service account from env var
  if (!process.env.FIREBASE_SERVICE_ACCOUNT_B64) {
    console.error('Missing FIREBASE_SERVICE_ACCOUNT_B64 env var')
    process.exit(1)
  }
  const serviceAccount = JSON.parse(
    Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_B64, 'base64').toString('utf8')
  )
  initializeApp({ credential: cert(serviceAccount) })
  const db = getFirestore()

  // 2. Fetch published articles
  const noticiasSnap = await db.collection('Noticias')
    .where('publicado', '==', true)
    .get()

  // 3. Generate static HTML (separate function)
  for (const doc of noticiasSnap.docs) {
    const data = doc.data()
    if (!data.slug) continue
    const dir = join(DIST, 'blog', data.slug)
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
    writeFileSync(join(dir, 'index.html'), renderArticleHTML(data))
  }

  // 4. Generate sitemap.xml
  const propsSnap = await db.collection('propiedades').get()
  const siteUrl = process.env.SITE_URL || 'https://atelierhomes.com.ar'
  writeFileSync(join(DIST, 'sitemap.xml'), generateSitemap(noticiasSnap.docs, propsSnap.docs, siteUrl))

  // 5. Generate robots.txt
  writeFileSync(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`)

  console.log('✓ Static blog HTML, sitemap, and robots.txt generated.')
}

main().catch((err) => {
  console.error('Postbuild failed:', err)
  process.exit(1)
})
```

**HTML template pattern** (from RESEARCH.md lines 477-510):
```js
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

**Sitemap template:**
```js
function generateSitemap(blogDocs, propertyDocs, siteUrl) {
  const urls = []

  // Static pages
  urls.push({ loc: siteUrl + '/', priority: '1.0', changefreq: 'weekly' })
  urls.push({ loc: siteUrl + '/blog', priority: '0.9', changefreq: 'weekly' })
  urls.push({ loc: siteUrl + '/propiedades', priority: '0.9', changefreq: 'weekly' })

  // Blog articles
  for (const doc of blogDocs) {
    const data = doc.data()
    if (!data.slug) continue
    urls.push({
      loc: `${siteUrl}/blog/${data.slug}`,
      priority: '0.8',
      changefreq: 'monthly',
      lastmod: data.fecha || undefined,
    })
  }

  // Properties
  for (const doc of propertyDocs) {
    urls.push({
      loc: `${siteUrl}/propiedades/${doc.id}`,
      priority: '0.7',
      changefreq: 'monthly',
    })
  }

  const entries = urls
    .map(
      (u) => `  <url>
    <loc>${u.loc}</loc>
    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`
}
```

---

### `src/Admin/schemas.js` (MODIFY — config, CRUD)

**Analog:** itself (lines 21-32 — existing `noticias` schema)

**Extension pattern** (current noticias schema lines 21-32 + new fields from D-11/D-12):
```js
noticias: {
  collection: 'Noticias',
  label: 'Noticias',
  basePath: '/admin/noticias',
  listColumns: ['titulo', 'slug', 'fecha', 'publicado'],    // ← was: ['titulo']
  fields: [
    { key: 'titulo', label: 'Título', type: 'text', required: true },
    { key: 'slug', label: 'Slug', type: 'text', required: false },      // NEW
    { key: 'descripcion', label: 'Descripción', type: 'textarea', required: false },
    { key: 'contenido', label: 'Contenido', type: 'richText', required: false },  // NEW
    { key: 'fecha', label: 'Fecha', type: 'date', required: false },              // NEW
    { key: 'publicado', label: 'Publicado', type: 'bool', required: false },      // NEW
    { key: 'img', label: 'Imagen (URL)', type: 'url', required: false },
    { key: 'url', label: 'Link externo', type: 'url', required: false },
  ],
},
```

---

### `src/Admin/AdminForm.jsx` (MODIFY — component, CRUD)

**Analog:** itself (lines 107-112 — existing field type chain)

**Extension pattern** (AdminForm lines 5-7, 107-112):
```jsx
// Add imports (after line 7):
import RichTextField from './fields/RichTextField'
import DateField from './fields/DateField'
import BooleanField from './fields/BooleanField'

// Add in render loop (after line 110 — after arrayUrl check):
if (field.type === 'richText') return <RichTextField key={field.key} {...props} />
if (field.type === 'date') return <DateField key={field.key} {...props} />
if (field.type === 'bool') return <BooleanField key={field.key} {...props} />
```

**Slug auto-generation on create** (buildEmpty function pattern — AdminForm lines 9-14 + slugify):
```js
// In buildEmpty — leave slug empty; auto-generate before save
function buildEmpty(fields) {
  return fields.reduce((acc, f) => {
    acc[f.key] = f.type === 'arrayUrl' ? [] : f.type === 'bool' ? false : ''
    return acc
  }, {})
}
```

Slug generation logic goes in create flow (around AdminForm line 63-68):
```js
// In handleSubmit, before create:
if (!isEdit && schema.collection === 'Noticias') {
  const slugify = (await import('slugify')).default
  let base = slugify(payload.titulo, { lower: true, strict: true })
  if (!payload.slug) payload.slug = base
  // Conflict detection with firestoreApi query
}
```

---

### `src/Componentes/Noticias.jsx` (MODIFY — component, CRUD)

**Analog:** itself (lines 1-77) + `Todaspropiedades.jsx` (lines 1-206)

**New data fetch pattern** (replace lines 9-19):
```jsx
useEffect(() => {
  const fetchNoticias = async () => {
    try {
      const q = query(
        collection(db, 'Noticias'),
        where('publicado', '==', true),
        orderBy('fecha', 'desc'),
        limit(3)
      )
      const snap = await getDocs(q)
      setNoticias(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    } catch {
      // silent — section hides if no data
    }
  }
  fetchNoticias()
}, [])
```

**Hide section when empty** (wrap entire return in conditional per D-15):
```jsx
if (noticias.length === 0) return null
```

**Navigation change per D-14** (replace `window.open(noticia.url, '_blank')` on line 54):
```jsx
const navigate = useNavigate()
// ... in button onClick:
onClick={() => navigate('/blog/' + noticia.slug)}
```

**"Ver todas las novedades" link per D-16** (add below the card grid, before closing `</div>`):
```jsx
<div className="mt-10 text-center">
  <Link
    to="/blog"
    className="inline-flex items-center gap-2 text-black font-semibold hover:underline text-lg"
  >
    Ver todas las novedades →
  </Link>
</div>
```

---

### `src/App.jsx` (MODIFY — config, request-response)

**Analog:** itself (lines 1-205)

**HelmetProvider import** (add after line 2, before components):
```jsx
import { HelmetProvider } from 'react-helmet-async'
```

**Wrap Shell with HelmetProvider** (replace lines 195-200):
```jsx
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

**Blog route imports** (add after line 16, before lazy admin imports):
```jsx
import BlogList from './Blog/BlogList.jsx'
import BlogArticle from './Blog/BlogArticle.jsx'
```

**Blog routes** (add after propiedades routes, around line 86):
```jsx
<Route
  path="/blog"
  element={
    <ErrorBoundary section="Blog">
      <BlogList />
    </ErrorBoundary>
  }
/>
<Route
  path="/blog/:slug"
  element={
    <ErrorBoundary section="Blog">
      <BlogArticle />
    </ErrorBoundary>
  }
/>
```

---

### `package.json` (MODIFY — config)

**Postbuild script** (add to scripts block):
```json
"postbuild": "node scripts/postbuild.mjs"
```

**Note:** `react-quill`, `react-helmet-async`, `firebase-admin`, and `slugify` already present in package.json (lines 21-24). No further npm install needed for those. But verify `firebase-admin` is pinned to v12 for Netlify Node 18 compatibility (currently `^14.2.0`).

---

## Shared Patterns

### Authentication
**Source:** `src/Auth/AuthGuard.jsx` + `src/Auth/AuthContext.jsx`
**Apply to:** Blog pages are PUBLIC — no auth needed. Admin blog routes already protected by existing `<AuthGuard>` wrapper in App.jsx (line 96). No change.

### Error Handling
**Source:** `src/Componentes/ErrorBoundary.jsx` (lines 1-43)
**Apply to:** BlogList and BlogArticle wrapped with `<ErrorBoundary section="Blog">` in App.jsx
```jsx
// Pattern from App.jsx lines 53-68:
<ErrorBoundary section="Blog">
  <BlogList />
</ErrorBoundary>
```

**Public component error handling pattern** (from Noticias.jsx lines 14-17, Todaspropiedades.jsx lines 99-124):
- Public pages: silent catch on fetch failure, show empty state or retry button
- Error state: `<div className="text-center text-red-500 py-20">{error}</div>`
- Loading state: skeleton cards or `Cargando...` text

### SweetAlert2 for Admin
**Source:** `src/Admin/AdminForm.jsx` (lines 3, 69-77) and `src/Admin/AdminList.jsx` (lines 3, 104-121)
**Apply to:** Unpublish/delete confirmation dialogs
```jsx
import Swal from 'sweetalert2'

// Unpublish confirmation
const result = await Swal.fire({
  title: '¿Despublicar artículo?',
  text: 'El artículo dejará de ser visible en el sitio público',
  icon: 'warning',
  showCancelButton: true,
  confirmButtonText: 'Despublicar',
  cancelButtonText: 'Cancelar',
})
```

### Field Component Props Contract
**Source:** `src/Admin/fields/TextField.jsx` (line 3), `TextAreaField.jsx` (line 3), `ArrayUrlField.jsx` (line 4)
**Apply to:** All 3 new field components (RichTextField, DateField, BooleanField)
```jsx
export default function FieldName({ field, value, onChange }) {
  // field.key — schema key
  // field.label — display label
  // field.required — whether field is required
  // value — current value from formData
  // onChange(fieldKey, newValue) — update formData
}
```

### Firestore Read Pattern
**Source:** `src/Admin/firestoreApi.js` (lines 1-18) + `src/Propiedades/PropiedadesInfo.jsx` (lines 20-45)
**Apply to:** BlogList, BlogArticle, Noticias
```jsx
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '../Firebase'

const q = query(
  collection(db, 'Noticias'),
  where('publicado', '==', true),
  orderBy('fecha', 'desc'),
  limit(3)
)
const snap = await getDocs(q)
const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
```

### Lazy Image Loading
**Source:** `src/Componentes/Noticias.jsx` (line 39-40), `propiedadesCards.jsx` (lines 54-56)
**Apply to:** All blog images
```jsx
<img
  src={item.img}
  alt={item.titulo}
  loading="lazy"
  decoding="async"
  onError={handleImgFallback('/placeholder-property.jpg')}
/>
```

### Semantic HTML (SEO-05)
**Source:** `src/Propiedades/PropiedadesInfo.jsx` (uses `<section>` on line 82, 131) + UI-SPEC
**Apply to:** BlogList and BlogArticle
```jsx
<main>       // root wrapper for blog pages
<article>    // BlogArticle content wrapper
<section>    // BlogList grid section, Noticias homepage section
<time>       // article date display
<nav>        // any navigation/pagination if added
```

---

## No Analog Found

| File | Role | Data Flow | Reason |
|---|---|---|---|
| — | — | — | All files have close analogs in codebase |

Every file in Phase 3 has a direct analog or extends an existing file. No research-only patterns needed.

---

## Metadata

**Analog search scope:** `src/Propiedades/`, `src/Admin/`, `src/Admin/fields/`, `src/Componentes/`, `src/App.jsx`, `scripts/`, `src/Firebase.js`
**Files scanned:** 14 files
**Pattern extraction date:** 2026-07-29
