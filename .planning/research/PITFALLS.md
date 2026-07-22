# Pitfalls Research

**Domain:** Real estate React SPA — SEO, blog, auth migration, Firestore hardening, code cleanup
**Researched:** 2026-07-22
**Confidence:** HIGH (Context7 + official docs + codebase analysis)

## Executive Assessment

This project has a dangerous combination that causes cascading failures when done wrong: **public Firebase reads + no auth + plans to add auth + plans for SEO on HashRouter**. The single most common outcome for projects in this state is: implement auth first, deploy Firestore rules second, discover public site is blank, roll back everything. The phase ordering matters more than any individual implementation detail.

---

## Critical Pitfalls

Mistakes that cause site-wide breakage, data loss, or security breaches. Order matters.

---

### Pitfall 1: Firestore Rule Lockout — Deploy Auth-Gated Rules Before Auth Exists

**What goes wrong:**
Deploying Firestore security rules that require `request.auth != null` before the app actually signs users in. Every public page that reads from Firestore (`Todaspropiedades`, `PropiedadesInfo`, `Noticias`, `Body` → `PropertyList`, `Equipo`/`Nosotros`) returns zero documents. The entire public site shows empty lists and "no properties found" messages. Users see a broken site.

**Why it happens:**
- Developer writes rules first (SEG-02), tests in emulator with mock auth, deploys
- Admin auth (SEG-01) hasn't been implemented yet, or is still in progress
- The three Firestore collections (`propiedades`, `Noticias`, `Nosotros`) are read by both public pages AND admin — there's no distinction in the current `allow read, write: if true` rule
- Firestore rules deploy globally and instantly — no gradual rollout

**How to avoid:**
- **Must deploy both changes together in same phase.** SEG-01 (auth implementation) and SEG-02 (Firestore rules) are a single atomic deployment unit, not sequential tasks.
- The correct rule pattern for this project:
  ```
  match /propiedades/{doc} {
    allow read: if true;                         // public can still read
    allow write: if request.auth != null;         // only auth'd users can write
  }
  match /Noticias/{doc} {
    allow read: if true;
    allow write: if request.auth != null;
  }
  match /Nosotros/{doc} {
    allow read: if true;
    allow write: if request.auth != null;
  }
  ```
- Test with Firestore emulator + `@firebase/rules-unit-testing` to verify unauthenticated reads still work
- Verify in staging/Netlify deploy preview before production push

**Warning signs:**
- Public pages loading with zero content after deploy
- Console errors: "Missing or insufficient permissions" for `getDocs()` calls
- Firestore Emulator logs showing denied reads for unauthenticated context

**Phase to address:**
Phase 2 (Security Hardening) — SEG-01 + SEG-02 must be delivered and deployed together. Do not split across phases.

**Recovery cost:** LOW (revert rules via `firebase deploy --only firestore` with previous rules). But downtime visible to users. Prevention is cheap — test with emulator.

---

### Pitfall 2: HashRouter SEO Dead End — All Dynamic Routes Invisible to Search Engines

**What goes wrong:**
HashRouter stores the path after `#` (e.g., `/#/propiedades/123`, `/#/admin`, `/#/blog/post-1`). Everything after `#` is a "fragment identifier" — it is **never sent to the server**. When Googlebot crawls `https://atelierhomes.com.ar/#/propiedades/123`, the server only sees `https://atelierhomes.com.ar/` and serves the root `index.html`. Googlebot cannot distinguish between the homepage, a property detail page, and a blog post. All 50+ properties effectively have the same URL as far as search engines are concerned. No individual property page gets indexed. No blog post gets indexed. All SEO effort (meta tags, sitemap, schema.org markup) is wasted because crawlers can't reach the pages those tags live on.

**Why it happens:**
- Current `netlify.toml` has no SPA fallback rule (no `/* /index.html 200` redirect)
- HashRouter was chosen because "hosting estático sin configuración SPA fallback" (PROJECT.md line 73) — but Netlify supports SPA fallback natively via `_redirects` or `netlify.toml` rewrite rules
- Team assumes HashRouter is a permanent constraint rather than a configurable one

**How to avoid:**
- **Migrate to BrowserRouter BEFORE implementing any SEO features.** If SEO is done on HashRouter, it must be redone after migration.
- Add SPA fallback to `netlify.toml`:
  ```toml
  [[redirects]]
    from = "/*"
    to = "/index.html"
    status = 200
  ```
- Or create `public/_redirects` with `/* /index.html 200`
- React Router v6 `BrowserRouter` is a drop-in replacement for `HashRouter` — routes and components don't change
- Verify Netlify deploy preview: navigate directly to `/propiedades/123` — must not return 404

**Warning signs:**
- `site:atelierhomes.com.ar` on Google shows only one indexed page (the root)
- Google Search Console reports "Duplicate without user-selected canonical" for all pages
- Googlebot crawls in Search Console show all URLs as `/` with no distinct paths
- `curl https://atelierhomes.com.ar/propiedades/123` returns 404 or homepage content without property data

**Phase to address:**
Phase 1 (Foundation/Code Cleanup) or early Phase 2 — MUST be done before SEO-01 (blog) and SEO-02 (meta tags, sitemap). Moving BrowserRouter after blog implementation means redoing SEO work.

**Recovery cost:** MEDIUM. Migration itself is small (change one import, add one Netlify rule). Re-indexing takes weeks after Google recrawls. Blog/SEO work done on HashRouter is wasted if not migrated first.

---

### Pitfall 3: Auth Guard Leaks to Public Routes — Homepage Shows Login Wall

**What goes wrong:**
After implementing Firebase Auth, the entire app shows a login screen or redirect to `/admin/login` because the auth guard check is too broad. The public site (`/`, `/propiedades/*`, all components) becomes gated behind authentication. Visitors see a Firebase login prompt instead of property listings.

**Why it happens:**
- `onAuthStateChanged` listener added at `App.jsx` level checks `if (!user) redirect to login` — but this fires on public routes too
- Auth guard component wraps `<Routes>` instead of wrapping only `<Route path="/admin/*">`
- The `isAdmin` check in `Shell()` (line 28 of App.jsx) only controls showing the Navbar/Footer — it doesn't guard access to admin routes themselves
- Developer tests admin auth while logged in, never tests the public site as an unauthenticated visitor

**How to avoid:**
- **Route-level guards, not App-level redirects.** Create an `<AdminGuard>` component that wraps `<Routes>` under `/admin/*` — NOT the entire app.
- Pattern:
  ```jsx
  // In App.jsx Shell(), under /admin route:
  <Route path="/admin" element={<AdminGuard><AdminLayout /></AdminGuard>}>
  ```
- `AdminGuard` checks auth state. If authenticated, renders children. If not, renders login form. **Public routes remain completely unaffected.**
- The public site MUST work with `auth.currentUser === null` — test this explicitly by opening an incognito window to `/`
- Keep `onAuthStateChanged` in `AdminGuard` scope, not at top-level `App`

**Warning signs:**
- `onAuthStateChanged` or `auth.currentUser` check in `App.jsx`, `Shell()`, or any component outside `/admin/*`
- Auth redirect logic that doesn't check `pathname.startsWith('/admin')`
- Unit test: "visit `/` as unauthenticated user" — if it redirects or shows login, the guard leaked

**Phase to address:**
Phase 2 (Security Hardening) — during SEG-01 auth implementation.

**Recovery cost:** LOW (move auth check to admin-only scope). But user-facing if deployed broken — every visitor sees a login wall until fixed.

---

### Pitfall 4: Client-Rendered Blog Content = Zero SEO Value

**What goes wrong:**
Blog posts added as React components that fetch content from Firestore via `onSnapshot` or `getDoc` on mount. Googlebot requests the page, receives an empty `<div id="root">` with a JS bundle reference, executes minimal JS (Googlebot does execute some JS, but inconsistently and with delays), and sees a loading state or empty container. Blog content never appears in the indexed page. Real estate blog posts ("Guía para comprar tu primera propiedad en Argentina", "Zonas con mayor plusvalía en CABA") get zero organic traffic.

**Why it happens:**
- Vite builds a client-side SPA — all content renders in the browser, not at build time
- Blog posts stored in Firestore `Noticias` collection — fetched client-side
- No prerendering or SSR step in the Vite build
- Netlify serves static files only — no server to run React before sending HTML

**How to avoid:**
- **Option A (recommended for this project): Pre-build blog pages at deploy time.** Write a Vite plugin or build script that reads the `Noticias` collection (with a Firebase Admin SDK service account on Netlify), generates static HTML files for each blog post URL, and injects them into the `dist/` folder. Each post gets its own HTML file with full content + meta tags. Netlify serves them as static pages. This requires zero runtime SSR — just a build-time script.
- **Option B:** Use Netlify serverless functions to render blog posts on the fly. A function at `/blog/:slug` fetches from Firestore and returns HTML. Adds latency but simpler than full SSR.
- **Option C:** Accept that blog has zero SEO and is only for returning visitors who already know the site. (Not recommended — SEO-01 explicitly requires blog for SEO.)
- Keep the `Noticias` component on the homepage as a preview/card list — that's fine client-rendered. But individual blog post pages need server-delivered HTML.

**Warning signs:**
- Blog post URL returns HTML containing only `<div id="root">` and script tags
- `curl https://atelierhomes.com.ar/blog/mi-post` shows no article content in HTML source
- Google Search Console: "Discovered - currently not indexed" or "Crawled - currently not indexed" for all blog URLs

**Phase to address:**
Phase 3 (SEO/Blog) — SEO-01. Must plan for the build-time generation approach. Blog Post UI + Firestore fetch is only half the feature; static HTML generation is the other half.

**Recovery cost:** HIGH. Blog posts already written and published but not indexed — need to rebuild with proper HTML generation, resubmit sitemap, wait for recrawl.

---

### Pitfall 5: Environment Variable Migration Breaking Firebase on Deploy

**What goes wrong:**
Migrating `Firebase.js` from hardcoded config to `import.meta.env.VITE_FIREBASE_*` environment variables. One variable is misspelled, missing, or undefined in Netlify's environment settings. Firebase `initializeApp()` receives `undefined` for `apiKey` or `projectId`. The entire app fails to initialize — blank white screen on every page, admin AND public. No graceful degradation.

**Why it happens:**
- Vite only exposes env vars prefixed with `VITE_` — a missing prefix means `undefined` at runtime
- Netlify env vars can be set in the UI but not synced to deploy previews by default
- Current `Firebase.js` has the config in source code — devs might keep the old file cached
- No validation of Firebase config before `initializeApp()`

**How to avoid:**
- **Validate config at import time.** Add explicit check:
  ```js
  const required = ['VITE_FIREBASE_API_KEY', 'VITE_FIREBASE_PROJECT_ID', 'VITE_FIREBASE_AUTH_DOMAIN'];
  for (const key of required) {
    if (!import.meta.env[key]) throw new Error(`Missing env var: ${key}`);
  }
  ```
- Keep a fallback config (the current hardcoded values) that only activates if env vars are missing — this prevents catastrophic failure but should log a warning
- Set env vars in Netlify before merging the PR that migrates config
- Verify in deploy preview: open the preview URL in incognito, check console for Firebase init errors

**Warning signs:**
- Console: `Firebase: No Firebase App '[DEFAULT]' has been created`
- White screen on all routes after deploy
- Netlify build log shows no errors (env vars are runtime, not build time)

**Phase to address:**
Phase 2 (Security Hardening) — SEG-04.

**Recovery cost:** LOW (fix env var, redeploy). But until fixed, entire site is down.

---

### Pitfall 6: CAPTCHA Breaking FormSpree Integration

**What goes wrong:**
Adding Google reCAPTCHA or hCaptcha to `Contacto.jsx` and `Modal.jsx` forms. After implementation, forms submit successfully from the user's perspective (client-side validation passes, CAPTCHA token is attached), but FormSpree rejects or silently fails because the CAPTCHA token isn't being validated on the server side, or because the form submission payload changed in a way FormSpree doesn't expect.

**Why it happens:**
- FormSpree has its own spam filtering — adding client-side CAPTCHA without also configuring it in FormSpree's dashboard creates a mismatch
- reCAPTCHA v3 works invisibly — if the token isn't sent as a form field, FormSpree can't validate it
- FormSpree's free tier may not support custom CAPTCHA integration — the project uses FormSpree's native endpoint

**How to avoid:**
- **Check FormSpree's built-in spam protection first.** FormSpree already provides Honeypot fields and Akismet integration on paid plans. A hidden form field with a `_gotcha` name is a zero-friction anti-spam measure.
- If adding explicit CAPTCHA, use FormSpree's reCAPTCHA integration (adds `g-recaptcha-response` field) — don't implement custom validation that conflicts
- For rate limiting: implement at the Netlify level (Netlify Forms has built-in spam filtering) or with a serverless function, not client-side alone
- Test the full flow: submit form → check FormSpree dashboard → verify email delivered

**Warning signs:**
- FormSpree dashboard shows submissions with "Spam" flag unchanged
- Email never arrives despite successful form submission
- Console shows FormSpree endpoint returning 200 but email not sent

**Phase to address:**
Phase 2 (Security Hardening) — SEG-03. Implement simplest solution first (FormSpree Honeypot + Netlify rate limiting). Only add CAPTCHA if spam actually occurs.

**Recovery cost:** LOW — remove CAPTCHA, revert to simpler solution.

---

### Pitfall 7: HashRouter to BrowserRouter Migration Breaking Existing Links

**What goes wrong:**
After migrating to BrowserRouter, internal links using `<a href="/#/admin">` or external bookmarks to `https://site.com/#/propiedades/123` break — they navigate to the root page instead of the target route. Also, the `basename` isn't set, so if the site is deployed to a subdirectory, all routes are off by one level.

**Why it happens:**
- HashRouter removes the `#` from URLs. Links built with `#` in mind don't work after migration.
- React Router `<Link to="...">` works transparently across both routers, but any `<a href="...">` with `#` paths or `window.location.hash` reads break
- Existing Google-indexed URLs (if any) with `#` paths return different content after migration

**How to avoid:**
- **Audit all `<a href>` and `window.location` usage** before migration. Replace `<a href="/#/propiedades/...">` with `<Link to="/propiedades/...">` or `<a href="/propiedades/...">`
- Add redirect rule in `netlify.toml` for old hash URLs if any exist externally:
  ```toml
  [[redirects]]
    from = "/#/*"
    to = "/:splat"
    status = 301
  ```
- This specific pattern is complex because `#` is client-side — but Netlify's `_redirects` with `force = true` can help for client-side redirects
- Test all `Link` components in admin (AdminLayout, AdminHub) — these already use `<Link to="/admin/...">` correctly, so they should work

**Warning signs:**
- `window.location.hash` used anywhere in code (check for this explicitly)
- Hardcoded `<a href="/#/...">` links in HTML or JSX
- WhatsApp share links or social media links containing `/#/` paths

**Phase to address:**
Phase 1 (Foundation) — must happen before any SEO work.

**Recovery cost:** MEDIUM. Migration itself is mechanical, but finding all broken links and getting Google to re-index takes time.

---

### Pitfall 8: Firestore Rules Block Admin Writes After Migration

**What goes wrong:**
Firestore rules deployed that allow public `read` but require `request.auth != null` for `write`. Auth is working — admin users can log in. But admin CRUD operations fail silently with "Missing or insufficient permissions" because the rules are stricter than expected. For example, rules require `request.auth.uid == resource.data.author_uid` but this project's collections have no `author_uid` field — they were created when anyone could write anything.

**Why it happens:**
- The project's collections (`propiedades`, `Noticias`, `Nosotros`) have no ownership fields — they were built with open rules
- Admin operations (create, update, delete) all use the same schema-driven CRUD (`AdminForm`, `AdminList`)
- A rule like `allow write: if request.auth != null && request.auth.uid == resource.data.author_uid` will fail because `resource.data.author_uid` doesn't exist
- Admin creates a new property → rules check `request.resource.data.author_uid == request.auth.uid` → field doesn't exist → denied

**How to avoid:**
- **Start with the simplest working rule:** `allow write: if request.auth != null;` for all three collections. This is the direct replacement for `allow write: if true` — just add auth requirement.
- Only add ownership checks if the data model is updated to include an `author_uid` or `createdBy` field
- For this project, all admin users share equal access to all three collections — there's no per-user data separation needed. `request.auth != null` is sufficient.
- Test with Firestore Emulator: authenticate as a test user, attempt create/update/delete on each collection

**Warning signs:**
- AdminForm `handleSubmit` successfully calls `addDoc`/`setDoc` but document doesn't appear
- `sweetalert2` shows success toast but Firestore document unchanged
- Console: "FirebaseError: Missing or insufficient permissions" on admin operations

**Phase to address:**
Phase 2 (Security Hardening) — SEG-02. Test with emulator before deploy.

**Recovery cost:** LOW (update rules, redeploy). Admin functionality down until fixed.

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems in this domain.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Keep HashRouter "because it works" | Zero migration effort | All SEO work wasted; blog and property pages never indexed | Never — SEO is an explicit requirement |
| Add admin-only `request.auth != null` without public read guard | Simple rule, works | Public site still reads from Firestore, so public read must remain open anyway — this shortcut doesn't actually simplify anything | Already the correct approach |
| Skip Firestore emulator testing, deploy rules directly | Save 30 min setup | Broken rules = broken public site or broken admin. Rollback takes minutes but user impact is immediate | Never for production |
| Add blog as pure client-side React component | Fast to implement; reuse existing patterns | Zero SEO value for blog content. Blog exists but defeats its own purpose (SEO-01) | Only if blog is internal-only (not the case here) |
| Keep hardcoded Firebase config "for now" | Avoid env var setup | API key in source, no environment separation, harder to rotate | Only if no env var system exists yet (but Vite already supports `VITE_` vars) |
| Use `NODE_ENV` for env detection | Familiar pattern | Doesn't exist in Vite's import.meta.env; must use `import.meta.env.MODE` instead | Never — will be `undefined` at runtime |

---

## Integration Gotchas

Common mistakes when connecting to external services in this stack.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Firebase Auth + Firestore Rules | Deploying rules before auth implementation | Same phase atomic deploy. Rules allow public read, auth-gated write. Test with emulator. |
| HashRouter → BrowserRouter + Netlify | Forgetting SPA fallback rule, getting 404s on refresh | Add `netlify.toml` `[[redirects]] from = "/*" to = "/index.html" status = 200` |
| FormSpree + CAPTCHA | Implementing client-side CAPTCHA that FormSpree doesn't recognize | Use FormSpree's native spam protection first (Honeypot, Akismet on paid plans). Add CAPTCHA only if spam actually occurs and via FormSpree's supported integration. |
| Vite env vars + Firebase config | Using `process.env` or non-`VITE_` prefixed vars — they don't exist at runtime | Always `import.meta.env.VITE_*`. Validate all required vars at init. |
| styled-components + Tailwind migration | Removing `styled-components` import while component still uses `styled.div` — silent breakage | Audit all styled-components usage (`Social.jsx` only). Convert to Tailwind before uninstalling. |
| @dnd-kit uninstall | Removing packages without checking for transitive imports or type references | Check `import` statements across the entire codebase (`rg "@dnd-kit" src/`). If zero references, safe to uninstall. |
| `<style jsx>` removal in Nosotros.jsx | Removing the style block without replacing the styles — component loses its visual styling | Convert each `<style jsx>` rule to equivalent Tailwind classes before removing the block. |

---

## Performance Traps

Patterns that work at this project's scale but create issues after growth.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| `getDocs()` without pagination for property list | Slow load when 100+ properties added | Firestore `limit()` + cursor-based pagination via `startAfter()` | ~50-100 properties (already approaching) |
| No code splitting on Modal.jsx (715 lines) | Slow initial load on valuation page | `React.lazy()` for the valuation modal | Already impacting Lighthouse score (715 lines in one file) |
| Admin reads full collections on every navigation | Admin panel slow when many documents | Firestore queries with `limit()` + pagination in `AdminList` | 100+ documents per collection |
| Firestore `onSnapshot` for blog content on homepage | Unnecessary real-time updates for static content | Use `getDocs()` (one-time fetch) for blog preview on homepage. Use `onSnapshot` only for admin. | Operationally fine, but wasteful for read-only public content |

---

## Security Mistakes

Domain-specific security issues beyond general web security, given this project's Firebase/Firestore architecture.

| Mistake | Risk | Prevention |
|---------|------|------------|
| Deploying rules that require auth for reads on public collections | Public site goes blank. Googlebot can't index. | Public read must remain `allow read: if true` for `propiedades`, `Noticias`, `Nosotros`. Only restrict write. |
| No content validation in Firestore rules | Malicious admin could inject XSS payloads in property descriptions, blog posts, team member bios — rendered directly in JSX | Add `request.resource.data` field-type checks in rules (e.g., `fieldName is string`) and validate length. But primary defense is JSX escaping (React does this by default for text). For `dangerouslySetInnerHTML`, disallow in rules or sanitize on write. |
| Firebase Auth persistence set to `LOCAL` without sign-out button in admin | Admin user stays logged in on shared/public computers indefinitely | Add explicit sign-out button in AdminLayout header. Consider `SESSION` persistence if admin access is on shared devices. |
| Admin guard only checks `auth.currentUser` once | If token expires mid-session, admin operations silently fail while UI still shows admin panel | Use `onAuthStateChanged` listener in guard component, not a one-time check. Firebase tokens refresh automatically but the listener catches sign-out. |
| Exposing admin routes via source maps in production | Anyone can discover admin structure from `main.js.map` in browser DevTools | Disable source maps in Vite production build: `build: { sourcemap: false }` in `vite.config.js`. Admin URL discovery is the primary risk (CRITICAL-01). |

---

## UX Pitfalls

Common user experience mistakes when adding these features to an existing public site.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Auth login page styled differently from admin panel | Admin users (Atelier team) see inconsistent UI — reduces trust | Login page uses same Tailwind + black/white color scheme as AdminLayout header |
| Blog posts with no publish date or author | Content looks untrustworthy or abandoned | Include `fecha`, `autor` fields in `Noticias` collection. Display on blog cards and detail pages. |
| Property sorting breaks existing user expectations | Users who memorized property order lose their place | Add sort control (date, price) to `Todaspropiedades` UI, keep current order as default initially |
| Admin CRUD success toasts cover form fields | SweetAlert2 modal blocks interaction during data entry | Use inline success indicators or toast positioned top-right, not center-modal |
| HashRouter URLs visible after BrowserRouter migration | Users with bookmarks to old `/#/propiedades/123` URLs get homepage instead of property detail | Add JavaScript redirect in `index.html` or a `useEffect` in App to detect hash URLs and redirect |

---

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces for production.

- [ ] **Auth implemented:** Login form works, but sign-out button not added to AdminLayout. → Verify: sign-out in AdminLayout header
- [ ] **Firestore rules deployed:** Rules are in `firestore.rules` file, but `firebase deploy --only firestore` was never run. → Verify: rules visible in Firebase Console > Firestore > Rules
- [ ] **SEO meta tags added:** Tags in JSX via a meta component, but Googlebot sees empty HTML because HashRouter is still active. → Verify: `curl` any property URL, confirm `<title>` and `<meta>` tags in HTML source (not just after JS execution)
- [ ] **Blog posts working:** Posts display on the site when logged in, but unauthenticated users get "permission denied" because Firestore rules are too strict. → Verify: visit blog page in incognito window
- [ ] **Environment variables set:** Vite build uses env vars, but Netlify deploy preview doesn't have them configured — works locally, fails on deploy. → Verify: check Netlify deploy preview for any Firebase errors
- [ ] **Error boundaries added:** Component imported and wrapped, but no fallback UI shown on error — just silently swallows the error. → Verify: intentionally throw in a wrapped component, confirm fallback renders
- [ ] **Dependencies cleaned:** `@dnd-kit` uninstalled from `package.json`, but `node_modules` still has the package and `import` still works due to hoisting. → Verify: `npm ls @dnd-kit/core` returns empty; build succeeds without errors
- [ ] **SPA fallback configured:** BrowserRouter migration done, but `netlify.toml` redirect rule not added — refreshing on `/propiedades/123` returns Netlify 404. → Verify: hard-refresh on a property detail page, confirm it loads correctly

---

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Firestore Rule Lockout (P1) | LOW | `firebase deploy --only firestore` with previous `allow read, write: if true` rules. Verify public site loads. Fix rules locally with emulator. Re-deploy. |
| HashRouter SEO Dead End (P2) | MEDIUM | Migrate to BrowserRouter + add Netlify SPA fallback. Request recrawl in Google Search Console. Submit new sitemap via Search Console. Wait 1-4 weeks for re-indexing. |
| Auth Guard Leaks (P3) | LOW | Scope auth check to `/admin/*` only. Hotfix deploy. Verify public site loads in incognito. |
| Client-Rendered Blog (P4) | HIGH | Build static HTML generation script. Regenerate blog pages. Resubmit sitemap. Wait for recrawl. Blog content may take weeks to appear in search results. |
| Env Var Break (P5) | LOW | Fix env var in Netlify dashboard. Trigger redeploy. Verify Firebase init in console. |
| CAPTCHA Forms (P6) | LOW | Remove CAPTCHA integration. Revert to FormSpree Honeypot. Verify emails delivered via FormSpree dashboard. |
| Hash→Browser Migration (P7) | MEDIUM | Audit `window.location.hash` usage. Fix broken links. Add client-side hash redirect for old URLs. |
| Rules Block Admin (P8) | LOW | Simplify rules to `allow write: if request.auth != null`. Test with emulator. Deploy. |

---

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| P1: Firestore Rule Lockout | Phase 2 (Security) | Firestore emulator test: unauthenticated reads succeed, authenticated writes succeed |
| P2: HashRouter SEO Dead End | Phase 1 (Foundation) — BEFORE any SEO work | `curl` property URL returns 200 with content, not 404 or redirect to `/` |
| P3: Auth Guard Leaks | Phase 2 (Security) | Incognito window: visit `/`, `/propiedades/123` — show content, not login |
| P4: Client-Rendered Blog | Phase 3 (SEO/Blog) | `curl` blog post URL, confirm article content in HTML source |
| P5: Env Var Break | Phase 2 (Security) | Deploy preview: Firebase initializes without errors, public site loads |
| P6: CAPTCHA Forms | Phase 2 (Security) | Submit contact form → check FormSpree dashboard → email received |
| P7: Hash→Browser Migration | Phase 1 (Foundation) | All internal links work. Hard-refresh on any route loads correctly. |
| P8: Rules Block Admin | Phase 2 (Security) | Admin CRUD: create/edit/delete property, verify in Firestore and on public site |

---

## Phase Ordering Recommendation

Based on pitfall analysis, the recommended phase order:

1. **Phase 1: Foundation & Code Cleanup**
   - CLN-01 through CLN-05 (dependencies, dead code, style standardization, error boundaries, code splitting)
   - **HashRouter → BrowserRouter migration** (P2 + P7 prevention)
   - Why first: BrowserRouter must be in place before any SEO work. Code cleanup reduces surface area for later phases.

2. **Phase 2: Security Hardening** (SEG-01 through SEG-04 together)
   - Firebase Auth implementation + Firestore rules (atomic deploy: P1 + P3 + P8 prevention)
   - CAPTCHA/spam protection (P6 prevention)
   - Environment variables (P5 prevention)
   - Why second: Auth must exist before admin features can be secure. But auth+security is a single deploy, not serial.

3. **Phase 3: SEO & Blog**
   - Blog/Noticias section with build-time HTML generation (P4 prevention)
   - Meta tags, sitemap, schema.org markup
   - Why third: Depends on BrowserRouter (Phase 1) and public Firestore reads continue working (Phase 2). Blog content can be authored via admin panel authenticated in Phase 2.

4. **Phase 4: Feature Polish**
   - PAG-01 through PAG-03 (sorting, team descriptions, "Hablemos" button)
   - Why last: User-facing features. No dependencies on security or infrastructure. Safe to add after everything is stable.

---

## Sources

- React Router v6 docs: `/remix-run/react-router` — HashRouter vs BrowserRouter guidance, SPA fallback configuration (Context7, HIGH confidence)
- Firebase docs: `/websites/firebase_google` — Firestore security rules patterns, `onAuthStateChanged` usage, auth persistence (Context7, HIGH confidence)
- Firebase Auth docs: `/firebase/firebase-js-sdk` — `getAuth()`, `onAuthStateChanged`, `signInWithEmailAndPassword` patterns (Context7, HIGH confidence)
- Netlify redirects/rewrites docs: SPA fallback via `[[redirects]] from = "/*" to = "/index.html" status = 200` (official docs pattern, HIGH confidence)
- Project codebase analysis: `App.jsx`, `Firebase.js`, `firestore.rules`, `netlify.toml`, `package.json`, `AdminLayout.jsx` (direct inspection, HIGH confidence)
- CONCERNS.md: 16 documented issues including CRITICAL-01 (no auth), CRITICAL-02 (open Firestore rules), HIGH-02 (no spam protection) — all confirmed via code inspection

---

*Pitfalls research for: Atelier Homes Argentina — React SPA SEO + blog + auth + security hardening*
*Researched: 2026-07-22*
*Confidence: HIGH — all critical pitfalls verified via official docs + codebase analysis*
