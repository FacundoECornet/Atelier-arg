# Feature Research

**Domain:** Real estate website — boutique agency (Argentina)
**Researched:** 2026-07-22
**Confidence:** HIGH
**Source basis:** Ahrefs real estate SEO guide (Jan 2025), project codebase analysis, industry best practices, competitor patterns

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete or untrustworthy.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Property sorting (newest first) | Users expect to see latest listings; "why show old houses first?" is a trust killer | LOW | Sort by `fechaIngreso` descending in Firestore query. Already have data field — just change `.orderBy()`. |
| SEO meta tags (title, description, OG) | Without them, Google shows random page text. Argentine boutique agencies live and die by local search. Property detail pages rank for "departamento [barrio] [ciudad]" if tagged. | MEDIUM | Must be dynamic per route (home, property detail, blog post). Use `react-helmet-async`. Vite SPA needs prerendering or SSR for crawlers. |
| XML sitemap | Google can't discover SPA pages without explicit sitemap. Property detail URLs, blog posts must be listed. | LOW | Generate at build time with `vite-plugin-sitemap` or post-build script. Submit to Google Search Console. |
| Semantic HTML structure | Screen readers and search crawlers need `<main>`, `<article>`, `<nav>`, heading hierarchy. Without it: accessibility violations AND ranking penalties. | LOW | Audit existing JSX for `div` soup. Replace with semantic elements. Already have some structure — mostly cleanup. |
| Contact form spam protection | Without it, email inbox fills with spam, delivery quotas exhausted, real leads lost. FormSpree free tier has monthly limits. | MEDIUM | hCaptcha (free, privacy-first) + honeypot field. Cannot do pure CAPTCHA without backend — need client-side challenge or netlify edge function. |
| Admin authentication | Anyone who discovers `/admin` has full CRUD. Firestore rules are `allow read, write: if true`. Data tampering risk is real. | MEDIUM | Simple password gate minimum. Firebase Auth (Anonymous or Email/Password) preferred for security rules integration. |
| Firestore security rules | Open database = data theft, billing fraud, content injection. SEC-02 is critical. | MEDIUM | Rules must enforce: public read on all collections, write only when `request.auth != null`. Enables Firebase Auth requirement. |
| HTTPS / TLS | Netlify provides it. Non-negotiable trust signal. Already deployed. | N/A | Already handled by Netlify. Verify HSTS header. |
| Mobile-responsive property browsing | 65%+ of real estate search traffic is mobile (Ahrefs data). Existing site is responsive with Tailwind — preserve this. | LOW | Existing responsive layout with Tailwind. Verify mobile breakpoints on new features. |
| CTA buttons (contact/email) | Users who browse team page want to reach out. Missing CTA = lost leads. Every team member needs contact path. | LOW | "Hablemos" button with `mailto:` or scroll to contact form. Already planned as PAG-03. |

### Differentiators (Competitive Advantage)

Features that set the product apart. Not required, but valuable for boutique agencies.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Blog/sección de noticias with rich editor | Content marketing drives 80%+ of organic traffic for boutique agencies (Ahrefs analysis). Neighborhood guides, market reports, "vender vs alquilar" articles rank for long-tail queries big portals ignore. | MEDIUM | Firestore collection `Noticias` already exists. Needs: rich text editor in admin, public blog list + detail pages, SEO metadata per post. Fran (team member) writes content — editor must be non-technical friendly. |
| Expandable team member bios (modal/popup) | Boutique agencies sell on personal trust. Buyers choose agent, not portal. Detailed bios with experience, specializations, past sales build EEAT signals. Portals (Zonaprop, Mercado Libre) have no "team" — this is unique to agency sites. | LOW | Modal on click showing full description, photo, contact CTA. Data already in `Nosotros` Firestore collection. |
| Property detail SEO (structured data) | Google shows rich results for real estate: price, photos, location, beds/baths. `Product` or `RealEstateListing` schema mark-up. Zillow and Zonaprop do this — not doing it means invisible in rich results. | MEDIUM | Add JSON-LD structured data to property detail pages. Dynamic: price, location, images, property type. |
| Online property valuation tool | Existing feature (Modal.jsx, 4-step wizard with map). Major differentiator — big portals offer this but users trust local agent valuations more. Keep and maintain. | EXISTING | Already built. Protect from spam (SEG-03). Ensure mobile-friendly wizard steps. |
| WhatsApp floating button | Existing feature. Critical for Argentine market where WhatsApp is primary business communication channel. 90%+ of real estate inquiries in Argentina happen via WhatsApp. | EXISTING | Already implemented. Preserve. |
| Google Business Profile integration | Local map pack outranks organic results for "[city] inmobiliaria" queries. GBP with reviews, photos, services listed = free top-of-page placement. | LOW (not code) | Non-code task: optimize GBP listing. Include in launch checklist. |
| Sold/archived properties showcase | Showing past sales builds trust (EEAT signal). Most agencies hide sold properties — showing them demonstrates track record. | LOW | Add `vendido: true` field to Firestore. Toggle in admin. Display "Propiedades Vendidas" section on landing page. |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems for this project.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Full SSR/Next.js migration | "Better SEO with SSR" | Complete rewrite of 30+ JSX files. Breaks existing HashRouter, Firebase client patterns, Netlify deploy. ~3-4 weeks work. Out of scope per constraints. | Use `react-helmet-async` for meta tags + `vite-plugin-sitemap` for sitemap. Prerender key pages (home, properties) at build time with `vite-plugin-prerender` if needed. |
| Property image upload | "Fran wants to upload photos directly" | Requires Firebase Storage, image resizing pipeline, CDN config, admin UI for upload. ~2 weeks work. Current external URLs work fine. | Keep external image URLs (current pattern). Add URL validation in admin. If upload becomes critical, add Firebase Storage in future phase. |
| Real-time property alerts / notifications | "Notify users when new property matches their criteria" | Requires user accounts, email service, Firestore listeners at scale. Entire auth+notification infrastructure. Premature for current traffic. | Collect emails via FormSpree newsletter form. Manual or Zapier-triggered emails when new properties added. |
| Property comparison tool | "Users want to compare 3 properties side by side" | Complex UI (comparison table, diff highlighting), state management between routes, mobile-unfriendly. High build cost, low conversion impact for boutique agency. | Good property detail pages with consistent information architecture make mental comparison easy. Add "propiedades similares" section on detail page instead. |
| Mortgage calculator / financial tools | "Help buyers understand costs" | Requires Argentine mortgage rate data (non-trivial, rates change frequently). Legal liability if calculations wrong. Maintenance burden. | Link to external calculator or bank mortgage simulator. Focus site on agent value-add (local knowledge, negotiation), not financial advice. |
| Multi-language support (EN/ES) | "Reach international buyers" | Doubles content management burden. Blog posts need translation. Admin UI needs i18n. SEO needs hreflang tags. 2-3x content maintenance. | Spanish-only is correct for Argentine market. International buyers investing in Argentina expect Spanish content. Add `lang="es"` attribute for SEO. |
| Real-time chat / chatbot | "Answer questions 24/7" | Requires third-party service (Intercom, Crisp) with monthly cost. Chatbots give generic answers that hurt boutique trust proposition. | WhatsApp button already handles real-time chat. Team is small — human WhatsApp responses build more trust than bot. |

## Feature Dependencies

```
Property sorting (PAG-01)
    └── no dependencies — pure Firestore query change

Team member modals (PAG-02)
    └── no dependencies — data already in Firestore

Team contact CTA (PAG-03)
    └── no dependencies — static mailto link

Blog section (SEO-01)
    └── requires ──> Admin auth (SEG-01): Fran needs authenticated access to write posts
    └── requires ──> Firestore rules (SEG-02): protect write access
    └── requires ──> Rich text editor in admin panel

SEO metadata (SEO-02)
    └── enhances ──> Blog section (SEO-01): each post needs meta tags
    └── enhances ──> Property detail pages: rich results via structured data
    └── requires ──> react-helmet-async installed
    └── requires ──> sitemap generation at build time

Admin auth (SEG-01)
    └── required by ──> Firestore rules (SEG-02): rules check auth state
    └── required by ──> Blog (SEO-01): authenticated writes

Firestore rules (SEG-02)
    └── depends on ──> Admin auth (SEG-01): rules reference request.auth
    └── conflicts with ──> nothing — strictly additive security layer

Spam protection (SEG-03)
    └── enhances ──> Contact form (existing)
    └── enhances ──> Valuation modal (existing)
    └── no hard dependencies — can add independently

Environment variables (SEG-04)
    └── required by ──> Admin auth (SEG-01): Firebase config should come from env
    └── no code dependencies — pure configuration

Code cleanup (CLN-01 through CLN-05)
    └── independent tasks — can be done in any order
    └── CLN-05 (code splitting) conflicts ──> with nothing, but test carefully after
```

### Dependency Notes

- **Blog (SEO-01) requires Admin auth (SEG-01):** Fran must log in to write blog posts. Without authentication, blog editor is publicly accessible — same CRITICAL-01 vulnerability.
- **Firestore rules (SEG-02) depends on Admin auth (SEG-01):** Rules use `request.auth != null` to gate writes. Without auth mechanism, rules can't work.
- **SEO metadata (SEO-02) enhances Blog (SEO-01) and Property pages:** Each dynamically generated page needs its own title, description, and OG tags. Implement once, apply everywhere.
- **Spam protection (SEG-03) is independent:** Can add hCaptcha to forms without touching any other feature. No risk of breaking existing functionality.
- **Code cleanup (CLN-01 through CLN-05) is independent:** Each cleanup task touches different files. Can be parallelized or batched.

## MVP Definition

### Launch With (v1 — This Milestone)

Minimum set of active requirements that deliver security + functionality + SEO foundation.

- [ ] **Admin auth (SEG-01):** Firebase Email/Password auth with simple login page. Non-negotiable security baseline.
- [ ] **Firestore rules (SEG-02):** `allow read: if true; allow write: if request.auth != null`. Simple, effective, deployable immediately after auth.
- [ ] **Environment variables (SEG-04):** Move Firebase config to `.env`. Required for auth to work across environments.
- [ ] **Spam protection (SEG-03):** hCaptcha + honeypot on contact form and valuation modal. Protects FormSpree quota.
- [ ] **Property sorting (PAG-01):** Order by `fechaIngreso` descending. One Firestore query change.
- [ ] **Team member modals (PAG-02) + Contact CTA (PAG-03):** Expandable bios with "Hablemos" button. Uses existing Firestore data.
- [ ] **Blog section (SEO-01):** Public blog listing + detail pages. Admin editor for Fran (authenticated). Foundation for SEO content.
- [ ] **SEO metadata foundation (SEO-02):** `react-helmet-async`, dynamic `<title>` + `<meta description>` + OG tags on all routes. Sitemap generation at build.
- [ ] **Code cleanup critical items (CLN-01, CLN-02, CLN-03):** Remove `@dnd-kit`, remove `<style jsx>`, standardize to Tailwind. Low effort, high hygiene value.

### Defer to v1.1 (After Validation)

Features that add value but aren't launch-critical.

- [ ] **Error Boundaries (CLN-04):** Wrap main sections. Important but non-blocking for feature launch.
- [ ] **Code splitting (CLN-05):** Lazy-load Modal.jsx. Performance win but requires testing.
- [ ] **Structured data (JSON-LD) on property pages:** Rich results in Google. Depends on SEO-02 foundation being in place.
- [ ] **Sold properties showcase:** Builds trust. Needs `vendido` field + UI work.

### Future Consideration (v2+)

- [ ] Property image upload (Firebase Storage)
- [ ] Email newsletter integration
- [ ] Automated sitemap submission to Google Search Console
- [ ] Performance monitoring (Lighthouse CI)
- [ ] A/B testing on CTA placements

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Admin auth (SEG-01) | HIGH — protects business data | MEDIUM — Firebase Auth setup | P1 |
| Firestore rules (SEG-02) | HIGH — prevents data theft | LOW — 5-10 lines of rules | P1 |
| Property sorting (PAG-01) | MEDIUM — better browsing | LOW — one query change | P1 |
| Team modals + CTA (PAG-02/03) | MEDIUM — trust + leads | LOW — modal component | P1 |
| Spam protection (SEG-03) | MEDIUM — inbox quality | MEDIUM — hCaptcha integration | P1 |
| Env variables (SEG-04) | MEDIUM — security hygiene | LOW — .env + import changes | P1 |
| SEO metadata (SEO-02) | HIGH — organic traffic | MEDIUM — helmet + sitemap | P1 |
| Blog section (SEO-01) | HIGH — long-tail SEO traffic | MEDIUM — editor + pages | P1 |
| Code cleanup (CLN-01/02/03) | LOW — invisible to users | LOW — remove/refactor | P2 |
| Error Boundaries (CLN-04) | MEDIUM — prevents full crash | LOW — wrapper components | P2 |
| Code splitting (CLN-05) | MEDIUM — load time | LOW — React.lazy | P2 |
| Structured data (JSON-LD) | HIGH — rich results | MEDIUM — dynamic per page | P2 |
| Sold properties showcase | MEDIUM — trust signal | LOW — toggle + display | P2 |

**Priority key:**
- P1: Must have for this milestone
- P2: Should have, add if time permits or in next milestone

## Competitor Feature Analysis

Argentine real estate competitive landscape: Zonaprop, Argenprop, Mercado Libre Inmuebles (portals) vs boutique agency sites.

| Feature | Portals (Zonaprop/Argenprop) | Other Boutique Agencies | Atelier (Our Approach) |
|---------|------------------------------|------------------------|------------------------|
| Property sorting | Advanced: price, date, size, relevance, map view | Basic: newest first, sometimes manual order | Sort by entry date (PAG-01). Sufficient for current inventory size (~20-50 properties). |
| Agent/team bios | None — no personal connection. Listings are anonymous. | Varies: some have full bios with photos, many have just names | Expandable team modals with full descriptions, photos, direct contact (PAG-02/03). Personal trust is competitive advantage. |
| Blog / content marketing | None — pure listing platform | Rare. Most agencies neglect content. Those who blog rank well locally. | Blog with non-technical editor (SEO-01). Key differentiator: neighborhood guides + market reports target long-tail searches portals ignore. |
| SEO (meta tags) | Excellent — dedicated SEO teams, SSR, rich results | Poor to none. Most use generic titles. | Dynamic meta tags per route (SEO-02). Sitemap. Structured data on property pages. |
| Contact / lead capture | Form-based, sometimes phone. No WhatsApp integration. | Mixed: contact forms, some have WhatsApp | WhatsApp floating button + contact form + valuation tool (existing). Adding spam protection (SEG-03). |
| Admin panel | N/A (platform-managed) | Rare. Most agencies pay developers per change. | Self-service admin with auth (SEG-01). Fran can manage properties, blog, team independently. |
| Sold properties | Some show "vendido" overlay | Almost none — agencies hide past inventory | Planned: showcase sold properties as social proof. |
| Security | Enterprise-grade | Often none — open admin panels common | Auth + Firestore rules + env vars + spam protection. Systematic security layer. |

## Sources

- **Ahrefs Real Estate SEO Guide (Jan 2025):** Authoritative source on real estate SEO strategy. Keywords, GBP optimization, content marketing, link building. https://ahrefs.com/blog/real-estate-seo/ [HIGH confidence — industry-leading SEO tool]
- **Project codebase analysis (.planning/codebase/CONCERNS.md):** 16 documented issues (3 critical, 3 high, 5 medium, 5 low). Direct evidence of current state. [HIGH confidence — primary source]
- **Project requirements (.planning/PROJECT.md):** Validated feature list, constraints, key decisions. [HIGH confidence — primary source]
- **MDN Web Docs — `<meta name>` attribute:** Official documentation on HTML metadata. https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name [HIGH confidence — official reference]
- **Argentine real estate market patterns:** WhatsApp-dominant communication, Zonaprop/Argenprop portal dominance, boutique agency differentiation through personal relationships. [MEDIUM confidence — domain knowledge, not formally cited]
- **Firebase Auth + Firestore Rules documentation:** Standard patterns for SPA authentication and security rules. [HIGH confidence — well-established technology]

---

*Feature research for: Atelier Homes Argentina — Mejoras v1*
*Researched: 2026-07-22 by GSD project researcher*
