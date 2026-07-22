# Stack Research — Mejoras v1

**Domain:** Real estate SPA site — SEO, blog, auth, code quality additions
**Researched:** 2026-07-22
**Confidence:** HIGH
**Existing stack:** React 18.2 + Vite 5.2 + Tailwind 3.4 + Firebase 10.7 + react-router-dom 6.23 (HashRouter) + Netlify hosting. No Next.js migration. No TypeScript.

## Recommended Stack

### 1. SEO for SPA

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| react-helmet-async | 3.0.0 | Per-page `<title>`, `<meta>`, Open Graph, structured data injection | Standard for React SPAs. Fork of deprecated `react-helmet` with thread-safe context provider. Works natively with React 18. No server dependency. |
| vite-plugin-sitemap | 0.8.2 | Auto-generate `sitemap.xml` at build time | Vite-native. Reads route config, outputs sitemap. No runtime dependency. Netlify-compatible static output. |
| [No library] | — | Semantic HTML structure | Use `<main>`, `<section>`, `<article>`, `<nav>` — already standard HTML5. No library needed. |

### 2. Blog / Markdown CMS on Firebase

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| react-markdown | 10.1.0 | Render markdown from Firestore as React components | Safe by default (no raw HTML injection). Extensible via remark/rehype plugins. Lightweight (no editor.js or SlateJS bloat). |
| remark-gfm | 4.0.1 | GitHub Flavored Markdown — tables, strikethrough, task lists | Fran may want tables or lists in blog posts. GFM is the standard markdown extension. |
| react-syntax-highlighter | 16.1.1 | Syntax highlighting for code blocks in blog posts | Optional. Only needed if blog posts include code snippets. Lightweight Prism build (~10KB gzipped for common languages). |
| Firestore (existing) | 10.7.1 | Store blog posts as markdown strings | Already in place. `Noticias` collection exists. Add `contenido` field (markdown string) + metadata fields. No new database or CMS. |

### 3. Firebase Authentication

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| firebase/auth | 10.7.1 (bundled in firebase) | Email/password auth for single admin user (Fran) | Already installed via `firebase` package. `getAuth` from `firebase/auth`. Email/password is simplest — no Google OAuth setup, no redirect URIs. Single admin user, no multi-tenant needed. |
| react-router-dom (existing) | 6.23.1 | Route guards via wrapper `<Route>` + redirect | HashRouter already in place. Add `<ProtectedRoute>` component that checks auth state, redirects to `/admin/login` if unauthenticated. |

### 4. Code Quality & Linting

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| eslint | 10.7.0 | Linting: catch errors, enforce patterns | Already partially configured (flat config exists). v10 is current stable with file-based config lookup. Project Node 22.x meets v10 requirement (>=20.19). |
| eslint-plugin-react | 7.37.5 | React-specific rules (JSX, hooks, prop-types) | Adds rules for JSX accessibility, hook dependencies, deprecated APIs. Not yet in current config. |
| prettier | 3.9.6 | Code formatting (no config debates) | Not yet installed. Standard formatter. Pair with `eslint-config-prettier` to avoid rule conflicts. |
| eslint-config-prettier | 11.0.0 | Disables ESLint rules that conflict with Prettier | Must be last in extends array. Prevents formatting wars. |

## Installation

```bash
# SEO
npm install react-helmet-async

# Blog
npm install react-markdown remark-gfm
npm install react-syntax-highlighter  # optional, only if code blocks needed

# Auth — already installed via firebase, just import from firebase/auth
# No new packages needed. firebase@10.7.1 includes getAuth.

# Code quality
npm install -D eslint@latest eslint-plugin-react prettier eslint-config-prettier

# Sitemap
npm install -D vite-plugin-sitemap
```

## Alternatives Considered

| Recommended | Alternative | Why Not |
|-------------|-------------|---------|
| react-helmet-async | @unhead/react | Smaller ecosystem in React. react-helmet-async has 10x more React-specific adoption. |
| react-helmet-async | react-helmet | Deprecated. Not thread-safe. Doesn't work with React 18 concurrent features. |
| Firestore + react-markdown | Headless CMS (Contentful, Strapi, Sanity) | Adds external dependency, API latency, cost tier. Firestore already in place with zero additional cost. |
| Firestore + react-markdown | Next.js SSG/ISR blog | Migration out of scope per PROJECT.md constraints. Vite SPA stays. |
| Firebase Email/Password | Firebase Google OAuth | Overkill for single admin. Requires OAuth consent screen setup, redirect URI config in Firebase console. Email/password is 2 lines of code. |
| Firebase Email/Password | Custom auth backend | Reinventing the wheel. Firebase Auth handles token refresh, session persistence, security. |
| ESLint v10 flat config | ESLint v8 legacy config (.eslintrc) | v8 is in maintenance. Flat config is the standard since v9. File-based lookup in v10 prevents config resolution bugs. |
| Prettier | Biome | Faster but less ecosystem compatibility with existing ESLint ecosystem. Prettier is safer for JSX codebase. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Next.js / Remix / Astro | Out of scope. Full framework migration would break existing Vite + Netlify setup. | Keep Vite 5 SPA. |
| react-helmet (non-async) | Deprecated. Not thread-safe. Breaks with React 18 StrictMode. | react-helmet-async |
| TypeScript | Out of scope. Adding TS to 30 existing JSX files is a separate project. | Keep JSX. Add JSDoc comments for type hints if desired. |
| ESLint v8 legacy config (.eslintrc) | Deprecated in v9, removed in v10. New projects should use flat config. | ESLint v10 flat config (already partially set up). |
| @dnd-kit/* | Already installed but unused per CONCERNS.md CLN-01. Orphaned dependency. | Remove from package.json. |
| styled-components | Used only in Social.jsx. Violates CLN-03 (standardize to Tailwind). | Rewrite Social.jsx to Tailwind, remove styled-components dependency. |
| Any markdown WYSIWYG editor (Editor.js, Slate, TipTap) | Fran writes simple news posts. WYSIWYG adds complexity and bundle size for no benefit. | Textarea with markdown preview toggle in admin panel. |
| Contentful / Sanity / Strapi | External CMS adds latency, cost, and complex integration. | Firestore + react-markdown (zero new services). |

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| react-helmet-async@3.0.0 | react@18.2.0, react-dom@18.2.0 | Full support via HelmetProvider context + manual DOM updates |
| react-markdown@10.1.0 | react@18.2.0 | Requires React 18+ |
| remark-gfm@4.0.1 | react-markdown@10.1.0 | Plug into `remarkPlugins` prop |
| firebase@10.7.1 → auth module | react@18.2.0 | Already in project. `getAuth` from `firebase/auth` is tree-shakeable. |
| eslint@10.7.0 | node@22.x | Meets minimum node@20.19 requirement |
| eslint-plugin-react@7.37.5 | eslint@10.7.0 | Flat config compatible |
| prettier@3.9.6 | eslint-config-prettier@11.0.0 | Must be last config entry |
| vite-plugin-sitemap@0.8.2 | vite@5.2.10, react-router-dom@6.23.1 | Reads routes from config, outputs static sitemap.xml |

## Architecture Notes

### Auth flow for admin panel:

```
App.jsx wrap with <AuthProvider> (context)
  └─ AuthProvider: onAuthStateChanged observer → sets user state
       └─ <ProtectedRoute> wrapper component
            ├─ user == null && loading → spinner
            ├─ user == null && !loading → redirect to /admin/login
            └─ user != null → render children (admin routes)
```

No changes to public routes (Navbar, Footer, property listings). Auth context only gates `/admin/*`.

### Blog data model (Firestore Noticias collection):

```
Noticias: {
  titulo: string,
  contenido: string,       // markdown string
  resumen: string,         // short excerpt for card view
  fecha_publicacion: timestamp,
  imagen_portada: string,  // external URL
  autor: string            // default "Atelier Homes"
}
```

### Sitemap strategy:

- `vite-plugin-sitemap` runs at `vite build`
- Configure with all public routes (home, propiedades, propiedades/:id, equipo, proceso, contacto, noticias, noticias/:slug)
- Static `sitemap.xml` output in `dist/`
- Add to `robots.txt` (create if missing)

## Sources

- Context7 `/staylor/react-helmet-async` — compatibility matrix, HelmetProvider usage, React 18 support
- Context7 `/remarkjs/react-markdown` — components prop, rehype/remark plugins, syntax highlighting integration
- Context7 `/firebase/firebase-js-sdk` — signInWithEmailAndPassword, onAuthStateChanged API signatures
- Context7 `/websites/firebase_google` — Firestore security rules for authenticated users
- Context7 `/eslint/eslint` — v10 migration guide, flat config API, Node.js version requirements, defineConfig/globalIgnores
- npm registry — verified latest versions for all packages (react-helmet-async@3.0.0, react-markdown@10.1.0, eslint@10.7.0, prettier@3.9.6, etc.)
- Project source: `package.json`, `eslint.config.js`, `src/App.jsx`, `src/Firebase.js` — confirmed existing stack versions, admin route structure, Firebase init

---

*Stack research for: Atelier Homes Argentina — Mejoras v1 (SEO + Blog + Auth + Code Quality)*
*Researched: 2026-07-22*
