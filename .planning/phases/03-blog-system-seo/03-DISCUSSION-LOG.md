# Phase 3: Blog System + SEO - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-29
**Phase:** 03-blog-system-seo
**Areas discussed:** Rich text editor & new admin fields, Build-time HTML generation, Slug strategy & data migration, Homepage Noticias transition

---

## Rich Text Editor & New Admin Fields

| Option | Description | Selected |
|--------|-------------|----------|
| react-quill | Battle-tested, good defaults, produces clean HTML. Most tutorials, biggest community. | ✓ |
| @tiptap/react | Modern, modular, extensible. More flexible but more setup. | |
| Markdown (textarea + preview) | Simplest — no rich text dependency. Less visual WYSIWYG. | |

| Option | Description | Selected |
|--------|-------------|----------|
| Extend existing if/else chain | Add RichTextField.jsx, DateField.jsx, BooleanField.jsx. Extend if/else in AdminForm render loop. | ✓ |
| Field registry object | Map field types to components. Cleaner but changes existing code pattern. | |
| Inline in AdminForm | Handle new field types inline. Fewer files but bloats AdminForm. | |

| Option | Description | Selected |
|--------|-------------|----------|
| Toggle switch | Visual on/off switch with 'Publicado' / 'Borrador' labels. | ✓ |
| Checkbox | Simple checkbox labeled 'Publicado'. | |
| Dropdown select | Estado: select with 'Borrador' and 'Publicado'. | |

| Option | Description | Selected |
|--------|-------------|----------|
| HTML date input | Native <input type='date'>, simple, works everywhere. Defaults to today. | ✓ |
| Auto-set on publish only | fecha auto-set when Fran clicks Publish. Can't backdate. | |
| react-datepicker | Custom calendar widget. Adds dependency. | |

**User's choice:** react-quill with existing if/else pattern, toggle switch for published, native date input.
**Notes:** Admin routes are lazy-loaded so react-quill bundle weight is acceptable.

---

## Build-Time HTML Generation

| Option | Description | Selected |
|--------|-------------|----------|
| Netlify build: Firebase Admin SDK script | Run Node script at build time, reads Firestore, writes static HTML to dist/blog/. | ✓ |
| Netlify prerendering | Built-in SPA prerendering. Free tier limited. Only meta tags, not full content. | |
| Skip build-time generation | Blog stays fully client-rendered. Google renders JS but slower/less reliable. | |

| Option | Description | Selected |
|--------|-------------|----------|
| Base64 env var in Netlify | Encode service account JSON as base64, store as env var, decode in build. | ✓ |
| Committed JSON (gitignored) | Keep on disk, gitignored, deploy to Netlify. Simpler but manual sync. | |
| Netlify serverless function | Move generation to on-demand function. Adds cold start latency. | |

| Option | Description | Selected |
|--------|-------------|----------|
| Blog articles only | Generate static HTML only for blog articles. | ✓ |
| Blog articles + property details | Pre-render both. Better SEO but bigger scope. | |

| Option | Description | Selected |
|--------|-------------|----------|
| Static files + SPA fallback | Netlify serves static files for direct visits. SPA navigation stays client-side. | ✓ |
| SPA-only with SSR meta | react-helmet-async for meta tags only. No static content for crawlers. | |

**User's choice:** Firebase Admin SDK at build time, base64 service account in Netlify env, blog articles only, static files + SPA fallback.

---

## Slug Strategy & Data Migration

| Option | Description | Selected |
|--------|-------------|----------|
| Auto-generate from title with manual override | Slug from titulo, editable field. Title edits don't auto-update slug. | ✓ |
| Manual slug entry only | Fran types slug manually. Risk of typos. | |
| Auto-generate, non-editable | Slug always from title, no override. | |

| Option | Description | Selected |
|--------|-------------|----------|
| Append numeric suffix | If slug exists, append '-2', '-3', etc. | ✓ |
| Block and show error | Block save with duplicate slug error. | |
| Use document ID as slug | Always unique but ugly URLs or custom IDs needed. | |

| Option | Description | Selected |
|--------|-------------|----------|
| Add new fields to existing docs, keep url as-is | Extend Noticias schema. Existing docs get defaults. url links stay functional. | ✓ |
| New blog collection, leave Noticias alone | Separate collections. Two types of news. | |
| Migrate all to blog, drop url field | Force-migrate all to blog articles. Drops external links. | |

| Option | Description | Selected |
|--------|-------------|----------|
| Título, slug, fecha, published | listColumns: ['titulo', 'slug', 'fecha', 'publicado'] | ✓ |
| Título, published | listColumns: ['titulo', 'publicado'] | |
| Título only (unchanged) | Keep existing listColumns. | |

**User's choice:** Auto-generate slug with manual override, numeric suffix on conflict, extend existing docs, full list columns.

---

## Homepage Noticias Transition

| Option | Description | Selected |
|--------|-------------|----------|
| Rewrite Noticias.jsx for blog articles only | Published articles, sorted by fecha desc, limit 3, link to /blog/:slug. | ✓ |
| Show both blog articles and external-link news | Complex query logic, needs type detection. | |
| Keep as-is, add new blog section | Two sections on page — confusing. | |

| Option | Description | Selected |
|--------|-------------|----------|
| Keep existing button, change action to navigate | Same animated 'Ver más' button, onClick navigates to /blog/:slug. | ✓ |
| Make entire card clickable | Whole card becomes link. Changes existing UX. | |
| Replace button with 'Leer artículo' link | Text link instead of button. Visually different. | |

| Option | Description | Selected |
|--------|-------------|----------|
| Hide entire Noticias section | If no published articles, section doesn't render. | ✓ |
| Show empty state message | 'No hay novedades todavía' placeholder. | |

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, add link below the 3 cards | 'Ver todas las novedades →' at bottom. | ✓ |
| No, no link to /blog | The 3 cards are enough. | |

**User's choice:** Rewrite Noticias.jsx, keep button design with navigate action, hide when empty, add "Ver todas" link.

---

## the agent's Discretion

- BlogList.jsx and BlogArticle.jsx layout design
- HelmetProvider placement in App.jsx
- Meta tag formulas per page type
- Sitemap generation approach
- Semantic HTML audit scope
