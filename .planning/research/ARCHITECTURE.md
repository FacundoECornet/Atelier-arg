# Architecture Research

**Domain:** Real estate SPA + blog + auth integration into existing React 18 / Firebase / HashRouter codebase
**Researched:** 2026-07-22
**Confidence:** HIGH (source code audited, patterns verified against existing codebase)

## System Overview — Target State

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          App.jsx (HashRouter)                                │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │              HelmetProvider (react-helmet-async)                       │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐  │  │
│  │  │            AuthProvider (React Context — Firebase Auth)          │  │  │
│  │  │  ┌───────────────────┐  ┌──────────────────────────────────┐   │  │  │
│  │  │  │   PUBLIC ROUTES   │  │     ADMIN ROUTES (React.lazy)    │   │  │  │
│  │  │  │   (eager loaded)  │  │     ┌──────────────────────┐     │   │  │  │
│  │  │  │                   │  │     │   AuthGuard wrapper  │     │   │  │  │
│  │  │  │  / → Landing      │  │     │   /admin/login       │     │   │  │  │
│  │  │  │  /propiedades     │  │     │   /admin/*  (gated)  │     │   │  │  │
│  │  │  │  /propiedades/:id │  │     │     ├─ AdminList     │     │   │  │  │
│  │  │  │  /blog            │  │     │     ├─ AdminForm     │     │   │  │  │
│  │  │  │  /blog/:slug      │  │     │     └─ AdminHub      │     │   │  │  │
│  │  │  └───────────────────┘  │     └──────────────────────┘     │   │  │  │
│  │  └─────────────────────────┴──────────────────────────────────┘   │  │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Layer stack:**
```
HashRouter → HelmetProvider → AuthProvider → Shell → Routes
```

**No change to HashRouter.** Existing HashRouter preserved — no SPA fallback config needed on Netlify. All new routes appended to existing route table.

## Component Boundaries

### New Components

| Component | Responsibility | Communicates With | Location |
|-----------|---------------|-------------------|----------|
| `AuthProvider` | Wraps app, provides `user` / `loading` / `login` / `logout` via Context | Firebase Auth SDK, all `useAuth()` consumers | `src/context/AuthContext.jsx` |
| `AuthGuard` | Wraps admin `<Outlet>`, redirects unauthenticated users to `/admin/login` | AuthProvider (via `useAuth`), react-router navigate | `src/Admin/AuthGuard.jsx` |
| `LoginPage` | Email/password login form, calls `signInWithEmailAndPassword` | AuthProvider, Firebase Auth | `src/Admin/LoginPage.jsx` |
| `BlogList` | Public blog listing grid (paginated or all), ordered by `fecha` desc | Firestore (`Noticias` collection) | `src/Blog/BlogList.jsx` |
| `BlogArticle` | Individual blog article with full content rendering | Firestore (`Noticias/:slug`), SEOHead | `src/Blog/BlogArticle.jsx` |
| `SEOHead` | Per-page dynamic `<title>` and `<meta>` tags via react-helmet-async | HelmetProvider (parent context) | `src/utils/SEOHead.jsx` |
| `RichTextField` | Rich text editor for blog content in admin form | AdminForm (via schema `type: 'richtext'`) | `src/Admin/fields/RichTextField.jsx` |
| `DateField` | Date picker for blog publish date | AdminForm (via schema `type: 'date'`) | `src/Admin/fields/DateField.jsx` |
| `BooleanField` | Toggle/checkbox for `publicado` flag | AdminForm (via schema `type: 'boolean'`) | `src/Admin/fields/BooleanField.jsx` |
| `TeamMemberModal` | Modal/overlay showing full team member description on click | Equipo component (triggered by card click) | `src/Componentes/TeamMemberModal.jsx` |

### Modified Components

| Component | Change | Why |
|-----------|--------|-----|
| `App.jsx` | Wrap with HelmetProvider + AuthProvider; add blog routes; add `/admin/login` route; wrap admin routes in AuthGuard | Central routing + context provisioning |
| `schemas.js` | Extend `noticias` schema: add `slug`, `contenido`, `fecha`, `publicado` fields | Blog needs structured content beyond current `titulo/descripcion/img/url` |
| `schemas.js` | Extend `nosotros` schema: add `email` field (for "Hablemos" button) | Team contact requires email per member |
| `schemas.js` | Extend `propiedades` schema: add `fechaIngreso` field | Sort by date requires a date field to sort on |
| `AdminForm.jsx` | Add rendering for `richtext`, `date`, `boolean` field types | Schema-driven form needs new field type handlers |
| `AdminList.jsx` | Update to show `fecha` column for noticias | Blog management needs date visibility |
| `firestoreApi.js` | Add `listAllOrdered` by date (not just `orden`); remove unused `bulkUpdateOrden` | Blog needs date ordering; dead code cleanup |
| `Equipo.jsx` | Add click handler opening `TeamMemberModal`; remove `<style jsx>` block; add "Hablemos" email button per member | Expandable descriptions + contact + cleanup |
| `Noticias.jsx` | Link cards to `/blog/:slug` instead of external URLs; limit to 3 latest | Blog integration on homepage |
| `usePropiedades.js` | Add sort mode parameter (by `orden` or by `fechaIngreso`) | Properties sorted by date of entry |
| `Todaspropiedades.jsx` | Add sort toggle UI; use new sort mode from hook | User-facing sort control |
| `Firebase.js` | Read Firebase config from `import.meta.env.VITE_FIREBASE_*` | Environment variable separation (SEG-04) |
| `Contacto.jsx` | Add CAPTCHA or honeypot field | Anti-spam (SEG-03) |
| `Modal.jsx` | Add CAPTCHA or honeypot field | Anti-spam (SEG-03) |

## Route Structure — Target State

```
/                              → Landing page (existing, unchanged)
/propiedades                   → All properties grid + filter (existing)
/propiedades/:id               → Property detail + gallery (existing)
/blog                          → BlogList (NEW — public blog listing)
/blog/:slug                    → BlogArticle (NEW — individual article)
/admin/login                   → LoginPage (NEW — unauthenticated only)
/admin                         → AdminHub (existing, now behind AuthGuard)
/admin/propiedades             → AdminList (existing, behind AuthGuard)
/admin/propiedades/nuevo       → AdminForm (existing, behind AuthGuard)
/admin/propiedades/:id/editar  → AdminForm (existing, behind AuthGuard)
/admin/noticias                → AdminList (existing, behind AuthGuard)
/admin/noticias/nuevo          → AdminForm (existing, behind AuthGuard)
/admin/noticias/:id/editar     → AdminForm (existing, behind AuthGuard)
/admin/nosotros                → AdminList (existing, behind AuthGuard)
/admin/nosotros/nuevo          → AdminForm (existing, behind AuthGuard)
/admin/nosotros/:id/editar     → AdminForm (existing, behind AuthGuard)
```

**Routing implementation in App.jsx:**
```jsx
<HelmetProvider>
  <AuthProvider>
    <Router>
      <Shell />
    </Router>
  </AuthProvider>
</HelmetProvider>
```

Inside `Shell()`:
```jsx
{/* NEW: Auth gate wraps admin parent route */}
<Route path="/admin" element={
  <Suspense fallback={AdminFallback}>
    <AuthGuard>
      <AdminLayout />
    </AuthGuard>
  </Suspense>
}>
  {/* existing admin sub-routes unchanged */}
</Route>
{/* NEW: standalone login route (no AuthGuard — this is the gate's escape hatch) */}
<Route path="/admin/login" element={
  <Suspense fallback={AdminFallback}>
    <LoginPage />
  </Suspense>
} />

{/* NEW: public blog routes */}
<Route path="/blog" element={<BlogList />} />
<Route path="/blog/:slug" element={<BlogArticle />} />
```

**Why login route is NOT inside AuthGuard:** AuthGuard redirects unauthenticated users to `/admin/login`. If `/admin/login` were itself inside AuthGuard, it would redirect to itself infinitely. Login must be a sibling route outside the guard.

## Data Flow

### Auth Flow

```
User visits /admin/*
  → AuthGuard reads useAuth().user
    ├── user === null && loading === true  → show spinner
    ├── user === null && loading === false → navigate('/admin/login')
    └── user !== null → render <Outlet /> (admin content)

Login:
  LoginPage (email + password form)
    → signInWithEmailAndPassword(auth, email, password)
    → Firebase Auth SDK updates onAuthStateChanged listener
    → AuthContext updates user state
    → AuthGuard re-renders, sees user, renders admin
    → navigate('/admin') (or return to originally requested URL)

Logout:
  AdminLayout "Cerrar sesión" button
    → AuthContext.logout() → signOut(auth)
    → AuthContext clears user
    → AuthGuard redirects to /admin/login

Session persistence:
  Firebase Auth persists session in IndexedDB (default)
  Survives page refresh — no re-login needed
```

**Firestore security rules (post-auth):**
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public reads: anyone can read published blog posts, properties, team
    match /propiedades/{doc} { allow read: if true; }
    match /Noticias/{doc}    { allow read: if true; }
    match /Nosotros/{doc}    { allow read: if true; }
    
    // Admin writes: only authenticated users
    match /propiedades/{doc} { allow create, update, delete: if request.auth != null; }
    match /Noticias/{doc}    { allow create, update, delete: if request.auth != null; }
    match /Nosotros/{doc}    { allow create, update, delete: if request.auth != null; }
    
    // Deny everything else
    match /{document=**} { allow read, write: if false; }
  }
}
```

**Private content strategy:** If blog posts need draft/published states, use a `publicado` boolean field. Public reads filter `where('publicado', '==', true)`. Admin sees all regardless. No need for separate read rules — filter at query level. This keeps rules simple (public read = everything, admin write = auth gated) while supporting drafts.

### Blog Data Flow

```
┌─────────────────────────────────────────────────────────┐
│  CREATE/EDIT                                             │
│                                                          │
│  AdminForm (schema: noticias, mode: create|edit)         │
│    ├── TextField      → titulo                           │
│    ├── TextField      → slug (auto-derive from titulo?)  │
│    ├── TextAreaField  → descripcion (SEO description)    │
│    ├── RichTextField  → contenido (HTML body)            │
│    ├── UrlField       → img (hero image)                 │
│    ├── DateField      → fecha (publish date)             │
│    └── BooleanField   → publicado (draft vs published)   │
│         │                                                 │
│         ▼                                                 │
│  firestoreApi.create/update('Noticias', payload)         │
│         │                                                 │
│         ▼                                                 │
│  Firestore: Noticias/{auto-id}                           │
│    { titulo, slug, descripcion, contenido,               │
│      img, fecha, publicado, ... }                        │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  READ (PUBLIC)                                           │
│                                                          │
│  BlogList                                                │
│    → query(Noticias, orderBy('fecha','desc'))            │
│    → filter client-side: solo publicado === true         │
│    → render card grid (titulo, descripcion, img, fecha)  │
│    → each card links to /blog/{slug}                     │
│                                                          │
│  BlogArticle                                             │
│    → getDocs(query(Noticias, where('slug','==',slug)))   │
│    → get first match                                     │
│    → SEOHead: title="{titulo} | Atelier Homes"           │
│    → render: hero image + title + fecha + contenido HTML │
│                                                          │
│  Homepage Noticias section (updated)                     │
│    → query(Noticias, orderBy('fecha','desc'), limit(3))  │
│    → filter: publicado === true                          │
│    → link to /blog/{slug} instead of external URL        │
└─────────────────────────────────────────────────────────┘
```

**Slug strategy:** Admin enters slug manually in a text field. This avoids auto-generation complexity and gives editor control over URLs. Schema field `slug` with type `'text'` and `required: true`. Auto-generate from titulo as placeholder suggestion (UX enhancement, not architectural requirement).

### SEO Data Flow

```
Page renders
  → SEOHead component sets tags via react-helmet-async
    ├── <title> dynamically set per page
    ├── <meta name="description"> per page
    ├── <meta property="og:title"> / og:description / og:image
    └── <link rel="canonical">

HelmetProvider (at Router level)
  → Collects all <Helmet> tags from rendered tree
  → Updates <head> in real DOM (SPA-safe, works with HashRouter)

Sitemap: static /sitemap.xml in public/
  → Manually updated or generated at build time
  → Lists: /, /propiedades, /blog, /blog/{slug} for each published article
  → robots.txt points to sitemap
```

**react-helmet-async chosen because:**
- Works with client-side rendering (no SSR needed)
- HashRouter compatible — no server-side requirements
- Lightweight (~3KB gzipped), no dependencies beyond react
- Per-page tags update on navigation (react-router triggers re-render, Helmet picks up new tags)
- Industry standard for SPAs (Next.js uses similar pattern internally)

**SEOHead component interface:**
```jsx
<SEOHead
  title="Título de página"
  description="Descripción para meta tags y OG"
  image="https://example.com/og-image.jpg"  // optional
  url="https://atelierhomes.com.ar/blog/mi-articulo"  // optional, for canonical
/>
```

### Team Data Flow (Enhanced)

```
Equipo component (existing card grid)
  → Click on card
    → Open TeamMemberModal(member)
      → Shows: large photo, nombre, cargo, full descripcion
      → "Hablemos" button → mailto:member.email (or default if no email)
    → Close: click overlay, press Escape, click X button

TeamMemberModal: new component, rendered once per Equipo mount
  → State: selectedMember (null | member object)
  → Portal-rendered (avoids z-index issues)
```

### Property Sorting Flow

```
usePropiedades hook (modified)
  → Accepts sortMode parameter: 'orden' | 'fechaIngreso'
  → When 'orden': query(orderBy('orden','desc')) — existing behavior
  → When 'fechaIngreso': query(orderBy('fechaIngreso','desc'))
  → Cache still module-level, but keyed by sortMode
    → cachedData becomes Map: { 'orden': [...], 'fechaIngreso': [...] }

Todaspropiedades (modified)
  → Adds sort toggle: "Destacados" (orden) | "Más recientes" (fechaIngreso)
  → Passes sortMode to usePropiedades
```

## Schema Extensions (schemas.js)

### Noticias/Blog Schema (Updated)

```js
noticias: {
  collection: 'Noticias',
  label: 'Noticias / Blog',
  basePath: '/admin/noticias',
  listColumns: ['titulo', 'fecha', 'publicado'],
  sortable: true,
  autoOrder: false,          // blog uses fecha for ordering, not orden
  fields: [
    { key: 'titulo',       label: 'Título',             type: 'text',      required: true },
    { key: 'slug',         label: 'Slug (ej: mi-post)',  type: 'text',      required: true },
    { key: 'descripcion',  label: 'Descripción (SEO)',   type: 'textarea',  required: true },
    { key: 'img',          label: 'Imagen principal',    type: 'url',       required: false },
    { key: 'contenido',    label: 'Contenido del blog',  type: 'richtext',  required: false },
    { key: 'fecha',        label: 'Fecha de publicación',type: 'date',      required: true },
    { key: 'publicado',    label: 'Publicado',           type: 'boolean',   required: false },
  ],
}
```

### New Field Types (AdminForm extension)

AdminForm field rendering currently handles `text`, `textarea`, `url`, `arrayUrl` via `if/else`. Extend to:

| type | Component | Stores | Notes |
|------|-----------|--------|-------|
| `richtext` | `RichTextField` | HTML string | Use react-quill or @tiptap/react. Tiny (~40KB gzipped). Read-only renderer in BlogArticle uses `dangerouslySetInnerHTML`. |
| `date` | `DateField` | ISO date string `"2026-07-22"` | Native `<input type="date">` — no library needed. |
| `boolean` | `BooleanField` | `true` / `false` | Toggle switch or checkbox. |

**Rich text editor selection: react-quill**
- Most popular React rich text editor (~14k GitHub stars)
- Pre-built toolbar (bold, italic, links, headings, lists, images)
- Outputs HTML — easy to render in BlogArticle with `dangerouslySetInnerHTML`
- No markdown parsing needed
- Size: ~40KB gzipped (acceptable for admin-only lazy loaded route)
- Alternative rejected: @tiptap/react (more modular but heavier setup, overkill for single-editor use case)

### Propiedades Schema (Updated for sorting)

```js
propiedades: {
  // ... existing fields unchanged ...
  // ADD:
  { key: 'fechaIngreso',  label: 'Fecha de ingreso',  type: 'date', required: false },
}
```

### Nosotros Schema (Updated for contact)

```js
nosotros: {
  // ... existing fields unchanged ...
  // ADD:
  { key: 'email',  label: 'Email de contacto',  type: 'text', required: false },
}
```

## Project Structure — Target State

```
src/
├── main.jsx                       # + HelmetProvider wrap
├── App.jsx                        # + AuthProvider, blog routes, AuthGuard, login route
├── Firebase.js                    # + env vars, + auth initialization
│
├── context/
│   └── AuthContext.jsx            # NEW: Firebase Auth provider + useAuth hook
│
├── Componentes/
│   ├── Header.jsx                 # (unchanged)
│   ├── Body.jsx                   # (unchanged)
│   ├── Equipo.jsx                 # MODIFIED: click handler, modal trigger, email button
│   ├── TeamMemberModal.jsx        # NEW: modal overlay for team member detail
│   ├── Pasos.jsx                  # (unchanged)
│   ├── propiedadesCards.jsx       # (unchanged)
│   ├── Contacto.jsx               # MODIFIED: anti-spam
│   ├── Noticias.jsx               # MODIFIED: link to /blog/:slug, limit 3
│   ├── Modal.jsx                  # MODIFIED: anti-spam
│   ├── Footer.jsx                 # (unchanged)
│   ├── Social.jsx                 # (unchanged, to be standardized to Tailwind later)
│   └── Nosotros.jsx               # (unchanged — not used on homepage currently)
│
├── Propiedades/
│   ├── Todaspropiedades.jsx       # MODIFIED: sort toggle
│   └── PropiedadesInfo.jsx        # MODIFIED: SEOHead for per-property meta
│
├── Blog/                          # NEW: public blog section
│   ├── BlogList.jsx               # Blog listing grid
│   └── BlogArticle.jsx            # Individual blog post
│
├── Admin/
│   ├── AdminLayout.jsx            # MODIFIED: logout button, links updated
│   ├── AdminHub.jsx               # (unchanged)
│   ├── AdminList.jsx              # MODIFIED: handle new listColumns (fecha, publicado)
│   ├── AdminForm.jsx              # MODIFIED: render richtext/date/boolean fields
│   ├── AuthGuard.jsx              # NEW: auth gate wrapper
│   ├── LoginPage.jsx              # NEW: login form
│   ├── schemas.js                 # MODIFIED: extended noticias/nosotros/propiedades schemas
│   ├── firestoreApi.js            # MODIFIED: remove bulkUpdateOrden, add date query helpers
│   └── fields/
│       ├── TextField.jsx          # (unchanged)
│       ├── TextAreaField.jsx      # (unchanged)
│       ├── ArrayUrlField.jsx      # (unchanged)
│       ├── RichTextField.jsx      # NEW: react-quill editor
│       ├── DateField.jsx          # NEW: native date input
│       └── BooleanField.jsx       # NEW: toggle switch
│
├── hooks/
│   └── usePropiedades.js          # MODIFIED: sortMode parameter
│
├── utils/
│   ├── formatPrice.js             # (unchanged)
│   ├── imgFallback.js             # (unchanged)
│   └── SEOHead.jsx                # NEW: react-helmet-async wrapper
│
├── assets/                        # (unchanged)
└── Imagenes/                      # (unchanged)
```

## Architectural Patterns

### Pattern 1: Auth Guard (Higher-Order Route Wrapper)

**What:** Component that wraps admin routes, checks auth state, redirects if unauthenticated.
**When:** Any route that requires authentication. Single guard wraps all admin routes via parent `<Route>`.
**Why this pattern:** Minimal change to existing route structure. One component protects all admin sub-routes. Login page lives outside the guard.

```jsx
// AuthGuard.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthGuard() {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="text-center py-20">Verificando sesión…</div>;
  if (!user) return <Navigate to="/admin/login" replace />;
  return <Outlet />;
}
```

**Trade-offs:**
- Pro: One place to add/remove protection. All admin routes protected by default.
- Pro: Works with existing nested route structure (AdminLayout + Outlet pattern).
- Con: Can't selectively protect sub-routes (all admin routes protected). Not a real con for this project — all admin routes need auth.

### Pattern 2: Schema-Driven Form Field Extension

**What:** Adding new `type` values to schema fields that AdminForm dispatches to field components.
**When:** Extending admin CRUD without duplicating form logic.
**Why this pattern:** Existing pattern works — just add cases. No architectural change needed.

```jsx
// Inside AdminForm.jsx render loop — current:
{schema.fields.map((field) => {
  if (field.type === 'textarea') return <TextAreaField key={field.key} {...props} />;
  if (field.type === 'arrayUrl') return <ArrayUrlField key={field.key} {...props} />;
  return <TextField key={field.key} {...props} />;
})}

// Extended:
{schema.fields.map((field) => {
  switch (field.type) {
    case 'textarea':  return <TextAreaField key={field.key} {...props} />;
    case 'arrayUrl':  return <ArrayUrlField key={field.key} {...props} />;
    case 'richtext':  return <RichTextField key={field.key} {...props} />;
    case 'date':      return <DateField key={field.key} {...props} />;
    case 'boolean':   return <BooleanField key={field.key} {...props} />;
    default:          return <TextField key={field.key} {...props} />;
  }
})}
```

### Pattern 3: Context-Based Auth State

**What:** `AuthProvider` wraps entire app. Any component calls `useAuth()` to get `{ user, loading, login, logout }`.
**When:** Auth state needed in multiple places (AuthGuard, AdminLayout, LoginPage).
**Why:** Avoids prop drilling. Firebase `onAuthStateChanged` listener is set up once in provider.

```jsx
// AuthContext.jsx — key structure
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined = loading
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsub;
  }, []);
  
  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);
  
  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}
```

**User creation strategy:** Create admin user manually in Firebase Console (Authentication → Add user). No self-registration flow needed — single admin user or small team. Manual creation avoids building user management UI.

### Pattern 4: HTML Content Rendering (Blog Articles)

**What:** Blog content stored as HTML string in Firestore, rendered with `dangerouslySetInnerHTML`.
**When:** Rich text content needs formatting (headings, bold, links, lists).
**Security:** Content only created by authenticated admins via admin panel. No user-generated content. Trusted source — `dangerouslySetInnerHTML` is appropriate.

```jsx
// BlogArticle.jsx — content rendering
<div 
  className="prose prose-lg max-w-none"
  dangerouslySetInnerHTML={{ __html: article.contenido }}
/>
```

**Trade-offs:**
- Pro: Simple — no markdown parser, no SSR needed.
- Con: `dangerouslySetInnerHTML` is a code smell in user-content apps. Not an issue here (admin-only content).
- Con: No rich text preview in AdminList. Mitigation: list shows titulo + descripcion only.

## Anti-Patterns to Avoid

### Anti-Pattern 1: Mixing Auth Logic into Every Admin Component

**What not to do:** Adding `if (!user) return <Navigate to="/admin/login" />` in AdminHub, AdminList, AdminForm individually.
**Why wrong:** Duplicated logic. Miss one component, create security hole. Hard to change redirect target.
**Do this instead:** Single `AuthGuard` wrapping the parent `/admin` route in App.jsx. All children protected automatically.

### Anti-Pattern 2: Server-Side Rendering Attempts with HashRouter

**What not to do:** Trying to implement SSR or static generation for SEO with HashRouter.
**Why wrong:** HashRouter is inherently client-side. Hashes (#) are not sent to server. No framework (Next.js, Gatsby) supports HashRouter SSR.
**Do this instead:** Client-side meta tags via react-helmet-async. Accept that crawlers execute JavaScript (Google does, Bing does, most modern crawlers do). For maximum compatibility, add static sitemap.xml and use descriptive anchor text.

### Anti-Pattern 3: Importing Firebase Auth SDK in Components Directly

**What not to do:** `import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'` in LoginPage without going through AuthContext.
**Why wrong:** Auth state not centralized. `onAuthStateChanged` must be set up once at app root. Multiple listeners cause race conditions.
**Do this instead:** All auth operations through `useAuth()` hook. Single `onAuthStateChanged` in AuthProvider. Components call `login()` and `logout()` from context.

### Anti-Pattern 4: New Firestore Collection for Blog

**What not to do:** Creating a `blog` collection and migrating away from `Noticias`.
**Why wrong:** Existing `Noticias` collection already has content. Migration is unnecessary work. Schema extension achieves same result.
**Do this instead:** Extend existing `Noticias` collection with new fields. Existing documents get new fields as they're edited.

## Scaling Considerations

| Concern | Current (~100 visitors/day) | Growth (~1K visitors/day) | Notes |
|---------|------------------------------|---------------------------|-------|
| Firestore reads | Direct `getDocs` — fine | Add `limit()` to queries. Cache blog list with stale-while-revalidate pattern | Firestore free tier: 50K reads/day. 1K visitors × 3 reads each = 3K reads. Plenty of headroom. |
| Blog rendering | Client-side HTML via `dangerouslySetInnerHTML` — fine | No change needed. HTML parsing is browser-native, fast. | Only bottleneck if articles are 100KB+ of HTML. Unlikely for blog content. |
| Auth concurrency | Single admin user — no contention | Multi-admin: Firebase Auth handles concurrent sessions natively. No change. | Firebase Auth free tier: unlimited auth users. |
| Image loading | External URLs (existing) — CDN of image host | Add `loading="lazy"` to blog images. Already done for properties. | No Firebase Storage = no bandwidth costs from Firebase. |
| SEO crawling | Googlebot executes JS — fine for meta tags | Ensure sitemap.xml stays updated. Add structured data (JSON-LD) for rich snippets later. | Google renders SPAs. Test with Google Search Console URL Inspection. |

**First bottleneck:** Firestore read quota if blog becomes high-traffic. Mitigation: add `limit()` to public queries, implement simple client-side cache (like `usePropiedades` module-level pattern) for blog list.

## Build Order (Dependency Graph)

```
Phase 1: FOUNDATION (zero user-facing changes)
├── SEG-04: Environment variables (VITE_FIREBASE_*)
├── CLN-04: Error Boundaries
├── CLN-01: Uninstall @dnd-kit
├── CLN-02: Remove <style jsx> from Nosotros.jsx
└── CLN-03: Standardize Social.jsx to Tailwind
    ↓
Phase 2: AUTHENTICATION (unlocks secure admin)
├── SEG-01: Firebase Auth setup + AuthContext + AuthGuard + LoginPage
└── SEG-02: Firestore security rules
    ↓
Phase 3: BLOG SYSTEM (needs auth for admin editing)
├── SEO-01: Extend noticias schema (slub, contenido, fecha, publicado)
├── SEO-01: Add RichTextField, DateField, BooleanField
├── SEO-01: BlogList + BlogArticle components + routes
└── SEO-01: Update homepage Noticias section
    ↓
Phase 4: SEO (needs blog routes to exist)
├── SEO-02: react-helmet-async + SEOHead component
├── SEO-02: Per-page meta tags (home, blog, properties)
├── SEO-02: Sitemap.xml + robots.txt
└── SEG-03: Anti-spam on Contacto + Modal (parallel — no dependency on SEO)
    ↓
Phase 5: ENHANCEMENTS (independent — can run earlier if needed)
├── PAG-01: Property sorting by fechaIngreso
├── PAG-02: TeamMemberModal (expandable descriptions)
├── PAG-03: "Hablemos" email button on team cards
└── CLN-05: Code splitting for Modal.jsx
```

**Phase ordering rationale:**
- Phase 1 (Foundation) has zero user-facing changes. Environment variables are a prerequisite for Phase 2 (auth needs clean Firebase config). Error Boundaries add safety before any new code is introduced.
- Phase 2 (Auth) must precede Phase 3. Blog admin editing requires authentication. Without auth, blog content creation is unprotected — same as current state.
- Phase 3 (Blog) must precede Phase 4. SEO meta tags target blog routes. Can't add SEO for routes that don't exist yet.
- Phase 5 (Enhancements) is dependency-free. Can be done in parallel with Phase 3/4 or deferred. Only depends on Phase 1 for cleanup context.

**Parallel work opportunities:**
- SEG-03 (anti-spam) can run alongside Phases 3-4 — no dependency on blog or SEO
- CLN-05 (code splitting) can happen anytime after Phase 1
- PAG-01/02/03 can happen anytime after Phase 1 — purely additive, no architectural coupling

## Integration Points

### Firebase Auth ↔ Existing Firebase Firestore

```
Firebase.js before:
  initializeApp(config) → getFirestore(app) → export db

Firebase.js after:
  initializeApp(config) → getFirestore(app) → export db
                        → getAuth(app)       → export auth
```

**No conflict.** Firestore and Auth are separate Firebase services. Initialize both from same `app` instance. Existing Firestore queries in all components continue working unchanged.

### AuthContext ↔ Existing Admin Components

```
AdminLayout: add "Cerrar sesión" button using useAuth().logout
AdminHub: no change (already stateless card grid)
AdminList/AdminForm: no change (auth handled by AuthGuard, not components)
LoginPage: NEW (uses useAuth().login)
```

**Minimal intrusion.** Auth is a routing concern, not a component concern. Components don't need to know about auth — AuthGuard handles it at the route level.

### New Blog Routes ↔ Existing Noticias Collection

```
Existing: Noticias collection with documents { titulo, descripcion, img, url }
New docs: { titulo, slug, descripcion, contenido, img, fecha, publicado }

Old documents: missing slug, contenido, fecha, publicado fields
→ BlogList: filter by "publicado exists and is true". Old docs (no publicado field) are excluded.
→ BlogArticle: lookup by slug. Old docs (no slug) won't appear.
→ Admin: editing old doc adds new fields on save. No migration needed.
```

**Backward compatible.** No migration script needed. Old documents simply don't appear in blog (they were external-link cards before). Admin can edit any old doc to add blog fields.

### HelmetProvider ↔ Existing Routes

```
App.jsx: wrap entire app in <HelmetProvider>
Existing routes: no change (SEOHead is additive, not required)
New routes: use <SEOHead> for meta tags
```

**Zero impact on existing routes.** HelmetProvider is passive — it collects Helmet tags from any descendant. Routes without SEOHead render without meta tags (existing behavior unchanged).

## Sources

- **Existing codebase audit:** All `.jsx` files read, all patterns verified from source (HIGH confidence)
- **Firebase Auth documentation:** Context7 — `signInWithEmailAndPassword`, `onAuthStateChanged`, Firestore security rules with `request.auth` (HIGH confidence)
- **react-helmet-async:** Official docs at github.com/staylor/react-helmet-async — SPA-compatible, HashRouter-safe (HIGH confidence — widely used pattern)
- **react-quill:** GitHub — most popular React rich text editor, HTML output, 40KB gzipped (MEDIUM confidence — verified via npm trends and GitHub stars, not Context7)
- **Firestore security rules pattern:** Official Firebase docs — public read + auth-gated write is standard for content sites (HIGH confidence)

---

*Architecture research for: Atelier Homes Argentina — Mejoras v1*
*Researched: 2026-07-22*
