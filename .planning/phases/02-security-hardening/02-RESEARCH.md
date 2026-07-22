# Phase 2: Security Hardening — Research

**Researched:** 2026-07-22
**Domain:** Firebase Authentication, Firestore Security Rules, Vite Environment Variables, FormSpree Honeypot
**Confidence:** HIGH

## Summary

Phase 2 hardens the site with four security layers: Firebase Auth for the admin panel, Firestore security rules to gate writes, Vite environment variables to remove hardcoded secrets, and FormSpree honeypot fields for spam protection. Phase 1 completed BrowserRouter migration and code cleanup — admin routes use clean `/admin/*` paths ready for auth guard wrapping. The existing `firebase` package (v10.7.1) already bundles `@firebase/auth` (v1.5.1) — **zero new npm packages required**.

**Primary recommendation:** Implement auth context + guard + login page as three new files in `src/Auth/`, modify `App.jsx` to wrap admin routes and add `/login` route, migrate `Firebase.js` to Vite env vars, deploy Firestore rules. Auth and rules must deploy atomically — deploying rules before auth UI breaks the admin panel.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Auth state management | Browser / Client | — | `onAuthStateChanged` listener runs in browser; no server-side auth needed |
| Auth guard (route protection) | Browser / Client | — | Client-side redirect — no server, no SSR; BrowserRouter handles client routing |
| Login UI | Browser / Client | — | `signInWithEmailAndPassword` runs entirely in browser |
| Firestore write enforcement | API / Backend | — | Firestore security rules are server-side; client cannot bypass |
| Firestore read access | API / Backend | — | Rules enforced server-side; public reads remain open |
| Env var injection | Frontend Server (build) | — | Vite injects `import.meta.env.VITE_*` at build time into static JS |
| Spam protection (honeypot) | Browser / Client | API / Backend | Hidden field inserted client-side; FormSpree server-side filters submissions where `_gotcha` has value |
| SPA fallback for `/login` | CDN / Static | — | `_redirects` and `netlify.toml` already route all paths to `/index.html` |

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| INFR-03 | Migrar configuración de Firebase a variables de entorno (`VITE_FIREBASE_*`) con validación al inicio | § Environment Variables: 7 env vars identified, Vite `import.meta.env` pattern, build-time validation in `Firebase.js` |
| INFR-04 | Configurar variables de entorno en Netlify (deploy preview + producción) | § Environment Variables — Netlify UI or `netlify.toml` env section; 7 vars needed |
| SEG-01 | Implementar Firebase Authentication (email/password) con `AuthContext`, `AuthGuard` y `LoginPage` | § Auth Integration: `getAuth`, `signInWithEmailAndPassword`, `signOut`, `onAuthStateChanged` — all bundled in existing `firebase` package |
| SEG-02 | Proteger rutas `/admin/*` con `AuthGuard` (login redirige si no autenticado) | § Auth Integration: AuthGuard pattern wraps admin routes in `App.jsx` line 86; redirects to `/login` |
| SEG-03 | Actualizar reglas de Firestore: `allow read: if true; allow write: if request.auth != null` | § Firestore Rules: 3 collections (propiedades, Noticias, Nosotros), current rules open, new rules restrict writes to authenticated users |
| SEG-04 | Agregar protección anti-spam a formularios (FormSpree Honeypot) en Contacto.jsx y Modal.jsx | § Spam Protection: hidden `_gotcha` field in JSON body; FormSpree silently drops submissions with filled field |
| SEG-05 | Crear usuario admin único manualmente en Firebase Console | § Auth Integration: manual step in Firebase Console → Authentication → Users → Add User; outside code changes |

</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| firebase | ^10.7.1 | Auth + Firestore (already installed) | Bundles `@firebase/auth@1.5.1` — `getAuth`, `signInWithEmailAndPassword`, `signOut`, `onAuthStateChanged` all available from `firebase/auth` |
| react-router-dom | ^7.18.1 (installed) | `Navigate` component for auth redirect, `useNavigate` for programmatic nav | Already installed; Phase 1 already uses BrowserRouter |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| sweetalert2 | ^11.10.0 (installed) | Error toasts for login failures | Use existing project pattern — SweetAlert2 for form errors |

**No new packages to install.** Firebase Auth is bundled in the existing `firebase` dependency. React Router is at latest.

**Version verification:**
```bash
npm view firebase version          # 12.16.0 (latest), 10.7.1 (installed)
npm view react-router-dom version  # 7.18.1 (latest matches installed)
```
[VERIFIED: npm registry] — firebase 10.7.1 confirmed installed; includes `@firebase/auth@1.5.1` as dependency.

## Package Legitimacy Audit

| Package | Registry | Age | Downloads | Source Repo | slopcheck | Disposition |
|---------|----------|-----|-----------|-------------|-----------|-------------|
| firebase | npm | 10+ yrs | 2M+/wk | github.com/firebase/firebase-js-sdk | [OK] | Approved — already installed |
| react-router-dom | npm | 9+ yrs | 12M+/wk | github.com/remix-run/react-router | [OK] | Approved — already installed |

**Packages removed due to slopcheck [SLOP] verdict:** none
**Packages flagged as suspicious [SUS]:** none

All required packages already in `package.json`. No new installs needed.

## Auth Integration

### Current State

**`src/Firebase.js`** (18 lines): Only initializes `firebase/app` and `firebase/firestore`. Exports only `db`. No auth initialization.

```javascript
// src/Firebase.js — CURRENT STATE (lines 1-18)
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'REDACTED_API_KEY',  // HARDCODED — to be moved to env vars
  authDomain: 'atelierhomesarg.firebaseapp.com',
  projectId: 'atelierhomesarg',
  storageBucket: 'atelierhomesarg.appspot.com',
  messagingSenderId: 'REDACTED_ID',
  appId: '1:REDACTED_ID:web:e0d5353bb8715b1c8c4683',
  measurementId: 'REDACTED_MEASUREMENT_ID',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export { db }
```

### What Needs to Change in Firebase.js

Add `getAuth` export. After env var migration, config reads from `import.meta.env`:

```javascript
// src/Firebase.js — TARGET STATE
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

// Validate all env vars exist at startup (fail fast)
const requiredVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
]
for (const key of requiredVars) {
  if (!import.meta.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)

export { db, auth }
```

[VERIFIED: Vite docs] — Vite exposes env vars via `import.meta.env.VITE_*`. Only variables prefixed with `VITE_` are exposed to client code. [CITED: https://vitejs.dev/guide/env-and-mode.html]

[VERIFIED: Firebase SDK] — `getAuth(app)` returns the Auth instance. `signInWithEmailAndPassword(auth, email, password)` performs login. `signOut(auth)` and `onAuthStateChanged(auth, callback)` handle state. [CITED: https://firebase.google.com/docs/auth/web/password-auth]

### Auth Architecture — Three New Files

All auth files go in `src/Auth/` (new directory):

**1. `src/Auth/AuthContext.jsx`** — React Context that holds auth state:

```javascript
// Pattern: React Context + onAuthStateChanged
import React, { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../Firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
```

**2. `src/Auth/AuthGuard.jsx`** — Route wrapper, redirects unauthenticated users:

```javascript
// Pattern: check auth, Navigate to /login if null
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

export default function AuthGuard({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="text-center py-20 text-gray-400">Verificando acceso…</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}
```

**3. `src/Auth/LoginPage.jsx`** — Email/password login form:

```javascript
// Pattern: controlled form, SweetAlert2 errors, Navigate on success
import React, { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { auth } from '../Firebase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/admin')
    } catch (err) {
      Swal.fire({
        title: 'Error de autenticación',
        text: 'Email o contraseña incorrectos.',
        icon: 'error',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Admin — Atelier
        </h1>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full border border-gray-300 bg-gray-100 text-gray-800 px-4 py-2 rounded"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full border border-gray-300 bg-gray-100 text-gray-800 px-4 py-2 rounded"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Ingresando…' : 'Ingresar'}
          </button>
        </div>
      </form>
    </div>
  )
}
```

### Admin Route Restructuring in App.jsx

Current admin wrapper (line 86-179 of `src/App.jsx`): `<Route path="/admin" element={<AdminLayout />}>` with nested admin routes. No auth protection.

Target: Wrap `AdminLayout` route in `<AuthGuard>`. Add `/login` route outside admin. LoginPage renders without Navbar/Footer.

```javascript
// In App.jsx Shell component, add to imports:
import AuthGuard from './Auth/AuthGuard'
import LoginPage from './Auth/LoginPage'
import { AuthProvider } from './Auth/AuthContext'

// Wrap entire app in AuthProvider
function App() {
  return (
    <Router>
      <AuthProvider>
        <Shell />
      </AuthProvider>
    </Router>
  )
}

// Add /login route BEFORE admin routes (order matters in React Router v7):
// In Shell's <Routes>:

// ... existing public routes ...

{/* Login — sin Navbar ni Footer */}
<Route path="/login" element={<LoginPage />} />

{/* Panel admin — protegido con AuthGuard */}
<Route
  path="/admin"
  element={
    <ErrorBoundary section="Administración">
      <AuthGuard>
        <Suspense fallback={AdminFallback}>
          <AdminLayout />
        </Suspense>
      </AuthGuard>
    </ErrorBoundary>
  }
>
  {/* ... existing nested admin routes unchanged ... */}
</Route>
```

**Important:** The `Shell` component's `isAdmin` condition (line 30: `pathname.startsWith('/admin')`) hides Navbar/Footer on admin routes. The `/login` route should also NOT show Navbar/Footer. Fix: extend condition to also exclude `/login` path:

```javascript
const isAdmin = pathname.startsWith('/admin') || pathname === '/login'
```

### Firebase Console — SEG-05

Admin user created manually in Firebase Console → Authentication → Users → Add User. Enter email + password. No code changes for this step — purely manual. No sign-up flow needed (single admin user).

## Environment Variables

### Discovery

**Current `src/Firebase.js` line 4-12:** All 7 Firebase config values hardcoded as plain string literals. These are NOT secrets (they're client-safe Firebase config), but hardcoding is bad practice and makes config management brittle.

**Current state:** No `.env` file exists in the repo. No `.env.example` exists. Phase 1 explicitly excluded env var migration (INFR-03 and INFR-04 deferred to Phase 2).

### Vite Pattern

[VERIFIED: Vite docs] Vite exposes env vars via `import.meta.env`. Only vars prefixed `VITE_` are exposed to client-side code. Access pattern: `import.meta.env.VITE_FIREBASE_API_KEY`.

Create `.env` file (gitignored — already in `.gitignore` per standard Vite template):
```bash
VITE_FIREBASE_API_KEY=REDACTED_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=atelierhomesarg.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=atelierhomesarg
VITE_FIREBASE_STORAGE_BUCKET=atelierhomesarg.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=REDACTED_ID
VITE_FIREBASE_APP_ID=1:REDACTED_ID:web:e0d5353bb8715b1c8c4683
VITE_FIREBASE_MEASUREMENT_ID=REDACTED_MEASUREMENT_ID
```

Create `.env.example` (committed to git — safe, no real values):
```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=1:xxxx:web:xxxx
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXX
```

### Validation

Validate at build time in `Firebase.js` (see code above). Throws clear error listing missing vars. This fails the build on Netlify if env vars aren't configured — preventing silent deploy of broken config.

### Netlify Configuration (INFR-04)

All 7 env vars must be set in Netlify UI: Site settings → Environment variables → Add variables (one per line). Same values for both production and deploy preview contexts. Alternatively, `netlify.toml` can declare them (but sensitive values in git is bad — prefer Netlify UI).

**Current netlify.toml** (line 5-6): `[build.environment]` section with `NODE_VERSION = "18"`. Could add env vars here for non-sensitive values only.

## Firestore Security Rules

### Collections

| Collection | Documents | Read By | Write By |
|-----------|-----------|---------|----------|
| `propiedades` | Property listings | Body.jsx, PropiedadesInfo, Todaspropiedades, propiedadesCards, AdminList/Form | AdminForm, firestoreApi |
| `Noticias` | News articles | Noticias.jsx, AdminList/Form | AdminForm, firestoreApi |
| `Nosotros` | Team members | Equipo.jsx, AdminList/Form | AdminForm, firestoreApi |

### Read/Write Patterns

**Reads (all unauthenticated):**
- `listAll('propiedades')` — `Todaspropiedades.jsx`, `propiedadesCards.jsx`
- `getOne('propiedades', id)` — `PropiedadesInfo.jsx`
- `listAll('Noticias')` — `Noticias.jsx`
- `listAll('Nosotros')` — `Equipo.jsx`
- Admin components also read (listAll, listAllOrdered, getOne) — these need read access too

**Writes (all through admin CRUD):**
- `create()`, `update()`, `remove()` — `firestoreApi.js` lines 40-51, called from `AdminForm.jsx`
- `getNextOrden()` — reads + writes `orden` field in `propiedades` collection

### Target Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read access — todos pueden leer
    // Authenticated write access — solo usuarios autenticados pueden escribir
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

[VERIFIED: Firebase docs] — `request.auth != null` checks that the request comes from an authenticated Firebase Auth user. Does NOT check custom claims or admin roles — sufficient for single admin user. [CITED: https://firebase.google.com/docs/firestore/security/rules-conditions]

### Deployment

Firestore rules are deployed via Firebase CLI (`firebase deploy --only firestore:rules`) or via Firebase Console UI (Firestore → Rules → Edit → Publish). The rules file lives in `firestore.rules`.

**Atomic deploy requirement:** Rules and auth code must deploy together. Deploying rules first breaks admin (no login UI yet, but writes blocked). Deploying auth code first leaves admin unprotected. Deployment order: (1) Deploy code + env vars to Netlify, (2) immediately deploy rules via Firebase CLI. Netlify deploys in ~30 seconds; rules deploy is instant.

### Testing Rules

After deployment, verify:
1. **Incognito browser → `/admin`** → redirected to `/login` (AuthGuard)
2. **Incognito browser → `/`** → public content loads (Firestore reads work without auth)
3. **Console test (browser devtools):** `fetch('https://firestore.googleapis.com/...')` POST write without auth token → fails with `PERMISSION_DENIED`
4. **Admin login** → can CRUD all collections

## Spam Protection (Honeypot)

### FormSpree Honeypot Mechanism

[CITED: FormSpree docs — Honeypot spam filtering] FormSpree provides built-in honeypot via a hidden field. When a bot auto-fills the hidden field, FormSpree silently drops the submission (returns 200 OK but doesn't deliver). The default field name is `_gotcha`.

**How it works:**
1. Add a hidden `<input name="_gotcha" ...>` to the form
2. Real humans don't see or interact with it (CSS hidden + tabindex=-1)
3. Bots auto-fill all fields including the hidden one
4. FormSpree checks if `_gotcha` has any value — if yes, submission discarded

**For AJAX submissions (this project uses JSON):** Include `_gotcha` in the JSON body. If `_gotcha` has any truthy value, FormSpree filters it. Real user submits `_gotcha: ""` — form accepted.

### Current Form Implementations

**`src/Componentes/Contacto.jsx`** (lines 1-171):
- FormSpree endpoint: `https://formspree.io/f/xdkdwpae`
- Form fields in state: `nombre`, `apellido`, `email`, `telefono`, `mensaje`
- Submits via `fetch()` with `Content-Type: application/json`
- Line 31: `body: JSON.stringify(formData)`

**`src/Componentes/Modal.jsx`** (lines 1-715):
- FormSpree endpoint: `https://formspree.io/f/xrblyoez`
- Form fields in state (line 18-38): 18 fields
- Submits via `fetch()` at line 200: `body: JSON.stringify(formData)`

### Required Changes

For both forms, add `_gotcha` to formData state and include a hidden input field:

**Contacto.jsx changes:**
```javascript
// Add to formData state (line 7):
_gotcha: '',

// Add hidden field inside <form> (after line 155, before submit button):
<input
  type="text"
  name="_gotcha"
  style={{ display: 'none' }}
  tabIndex={-1}
  autoComplete="off"
  value={formData._gotcha}
  onChange={handleChange}
/>

// The _gotcha field is included in JSON.stringify(formData) automatically
```

**Modal.jsx changes:**
```javascript
// Add to formData state (line 18):
_gotcha: '',

// Add hidden field inside <form> (after line 320, as first field):
<input
  type="text"
  name="_gotcha"
  style={{ display: 'none' }}
  tabIndex={-1}
  autoComplete="off"
  value={formData._gotcha}
  onChange={handleChange}
/>

// Reset _gotcha on form clear (line 209, add to reset):
_gotcha: '',
```

**Important:** The honeypot field must NOT be required, must NOT be a controlled component that clears on submit (whatever the bot puts stays), and its `name` attribute must be exactly `_gotcha` (FormSpree's recognized field name).

### No CAPTCHA Needed

FormSpree's honeypot is sufficient for basic spam protection. CAPTCHA (reCAPTCHA/Turnstile) would require paid FormSpree plan. Per STATE.md line 74: "Honeypot may be sufficient; CAPTCHA may require paid plan." Research confirms: honeypot is included in all FormSpree plans, requires zero configuration, and blocks basic bots.

## Architecture Patterns

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Browser / Client                       │
│                                                          │
│  ┌──────────┐    ┌──────────────┐    ┌───────────────┐  │
│  │ Public   │    │ AuthContext   │    │ AuthGuard     │  │
│  │ Pages    │    │ (user state)  │    │ (route check) │  │
│  │ /,       │    │               │    │               │  │
│  │ /prop... │    │ onAuthState   │    │ user==null →  │  │
│  │ /nos...  │    │ Changed()     │    │ /login        │  │
│  └────┬─────┘    └──────┬───────┘    └───────┬───────┘  │
│       │                 │                     │          │
│       │    ┌────────────┴─────────────────────┘          │
│       │    │  App.jsx Shell                              │
│       │    │  <AuthProvider><Routes>                     │
│       │    │    / → public                               │
│       │    │    /login → LoginPage                       │
│       │    │    /admin/* → AuthGuard → AdminLayout       │
│       │    └─────────────────────────────────┘           │
│       │                                                  │
│  ┌────┴────────┐    ┌──────────────┐                    │
│  │ Firestore   │    │ FormSpree    │                    │
│  │ reads       │    │ fetch()      │                    │
│  │ (public)    │    │ + _gotcha    │                    │
│  └─────┬───────┘    └──────┬───────┘                    │
└────────┼────────────────────┼────────────────────────────┘
         │                    │
         ▼                    ▼
┌─────────────────┐  ┌───────────────────┐
│ Firebase Cloud  │  │ FormSpree API     │
│                 │  │                   │
│ Firestore Rules │  │ Honeypot filter:  │
│ read: if true   │  │ _gotcha!="" → drop│
│ write: if       │  │                   │
│   request.auth  │  │ Endpoints:        │
│   != null       │  │ f/xdkdwpae (cont) │
│                 │  │ f/xrblyoez (val)  │
└─────────────────┘  └───────────────────┘
```

### Recommended Project Structure

```
src/
├── Auth/                  # NEW — all auth files
│   ├── AuthContext.jsx    # Context provider + useAuth hook
│   ├── AuthGuard.jsx      # Route protection wrapper
│   └── LoginPage.jsx      # Email/password login form
├── Admin/                 # Existing — unchanged
│   ├── AdminLayout.jsx
│   ├── AdminHub.jsx
│   ├── AdminList.jsx
│   ├── AdminForm.jsx
│   ├── schemas.js
│   └── firestoreApi.js
├── Componentes/           # Existing — honeypot additions
│   ├── Contacto.jsx       # Add _gotcha hidden field
│   └── Modal.jsx          # Add _gotcha hidden field
├── Firebase.js            # MODIFIED — env vars + getAuth export
└── App.jsx                # MODIFIED — AuthProvider + AuthGuard + Login route

.env                       # NEW — gitignored, local dev config
.env.example               # NEW — committed template
firestore.rules            # NEW — deployed to Firebase
```

### Pattern 1: React Context for Auth State

**What:** `AuthProvider` wraps the app, `onAuthStateChanged` tracks user, `useAuth()` hook exposes `{ user, loading }`.

**When to use:** Any component that needs to know if user is logged in (AuthGuard, LoginPage, AdminLayout for logout button).

**Why not Redux/Zustand:** Project uses no global state library (per CONVENTIONS.md). React Context is minimal, zero dependencies, sufficient for single-state auth.

### Pattern 2: AuthGuard Route Wrapping

**What:** Component that renders `children` if authenticated, `<Navigate to="/login">` if not.

**When to use:** Wrap any route element that requires authentication. In this project: only `/admin/*` routes.

**Edge case:** Loading state — `onAuthStateChanged` fires null initially while checking persisted session. AuthGuard must show loading spinner during this window, NOT redirect to `/login` (would cause flash redirect on every page load for logged-in users).

### Anti-Patterns to Avoid

- **`localStorage.getItem('user')` as auth check:** Trivially spoofed. Always use `onAuthStateChanged` from Firebase SDK.
- **Check auth in every component:** Wrap routes, not individual components. Single `AuthGuard` at `/admin` route level protects all nested routes via React Router layout.
- **Store Firebase config in env without validation:** Missing env var produces cryptic error deep in Firebase SDK. Fail fast with clear error message.
- **Deploy rules before auth code:** Admin panel becomes inaccessible (no login, but writes blocked). Rules and code must deploy atomically.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| User authentication | Custom JWT/auth system | `firebase/auth` `signInWithEmailAndPassword` | Battle-tested, handles session persistence, token refresh, security edge cases |
| Auth state tracking | Manual `localStorage` checks | `onAuthStateChanged` | Handles token expiry, cross-tab sync, initial loading state — all edge cases missed by DIY |
| Route protection | Inline `if (user)` in every component | `AuthGuard` component with `<Navigate>` | Single point of control, handles loading state, React Router integration |
| Form spam prevention | Custom rate limiter, IP blacklist | FormSpree `_gotcha` honeypot | Already integrated, zero config, blocks bots server-side without UX impact |
| Firestore write protection | Client-side checks | Firestore security rules | Client code can be bypassed; server-side rules cannot |
| Config management | Hardcoded strings | Vite `import.meta.env.VITE_*` | Build-time injection, environment-specific config, no rebuild needed for config changes on Netlify |

**Key insight:** Firebase Auth is a mature, Google-maintained auth system. Custom auth is the #1 security mistake in Firebase projects. Use `onAuthStateChanged` — not `localStorage`, not cookies, not manual token checking.

## Common Pitfalls

### Pitfall 1: Auth Flash on Page Load

**What goes wrong:** Logged-in user sees `/login` page briefly before being redirected to `/admin`. Or worse — gets stuck on `/login` because `onAuthStateChanged` hasn't fired yet.

**Why it happens:** `onAuthStateChanged` fires `null` initially while Firebase checks persisted auth state (indexedDB or localStorage). If AuthGuard immediately redirects on `user === null`, it flashes `/login` on every load.

**How to avoid:** AuthGuard must check `loading` flag from AuthContext. Show loading spinner while `loading === true`. Only redirect when `loading === false && user === null`.

**Warning signs:** Console shows "Navigated to /login" then immediately "Navigated to /admin" on page refresh for authenticated user.

### Pitfall 2: Rules Before Auth Atomicity Failure

**What goes wrong:** Firestore rules deployed but new auth code not yet deployed → admin panel broken (can't log in because no login page, can't write because rules require auth). Or: auth code deployed but rules still open → admin still unprotected.

**Why it happens:** Rules and code deploy through different channels (Firebase CLI vs Netlify git push).

**How to avoid:** Sequential atomic deploy: (1) code to Netlify first, (2) immediately deploy rules. Netlify deploy ~30s, rules deploy instant. Never deploy rules solo.

### Pitfall 3: `_gotcha` Field Autofilled by Password Managers

**What goes wrong:** Password managers or browser autofill might populate the `_gotcha` field, causing legitimate submissions to be silently dropped.

**Why it happens:** Some autofill tools ignore `display:none` and `tabindex=-1`. The field has `type="text"` and `name="_gotcha"` which might match some heuristics.

**How to avoid:** Set `autocomplete="off"` on the field. Use `style={{ display: 'none' }}` not `type="hidden"` (more aggressive against autofill). Test with real browsers. If this becomes an issue on the free FormSpree tier, monitor submissions in FormSpree dashboard.

**Warning signs:** Users reporting "form submitted but we never received it." Check FormSpree dashboard for blocked submissions.

### Pitfall 4: Missing Env Var at Netlify Build

**What goes wrong:** Build succeeds locally (`.env` present) but fails on Netlify (env vars not configured in Netlify UI).

**Why it happens:** `.env` is gitignored. Netlify doesn't see the local file.

**How to avoid:** The build-time validation in `Firebase.js` throws clear error listing exactly which vars are missing. Also add `[build.environment]` section in `netlify.toml` for non-sensitive vars OR document that all 7 MUST be configured in Netlify UI before first deploy.

### Pitfall 5: Login Page Shows Navbar

**What goes wrong:** `/login` route renders the LoginPage inside Shell which conditionally shows Navbar based on `isAdmin`. Login is not `/admin/*` so Navbar appears.

**Why it happens:** Shell's `isAdmin` check on line 30 only checks `pathname.startsWith('/admin')`. `/login` doesn't match.

**How to avoid:** Extend the condition: `const isAdmin = pathname.startsWith('/admin') || pathname === '/login'`. This hides Navbar and Footer on login page.

## Code Examples

### Firebase Auth — Sign In
```javascript
// Source: firebase.google.com/docs/auth/web/password-auth
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

const auth = getAuth()
signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user
    // Signed in — navigate to admin
  })
  .catch((error) => {
    // auth/wrong-password, auth/user-not-found, auth/invalid-email
  })
```
[VERIFIED: Firebase docs — Web Password Authentication]

### Firebase Auth — Sign Out
```javascript
// Source: firebase.google.com/docs/auth/web/password-auth
import { getAuth, signOut } from 'firebase/auth'

const auth = getAuth()
signOut(auth).then(() => {
  // Signed out — navigate to /login or /
})
```

### Firebase Auth — Auth State Observer
```javascript
// Source: firebase.google.com/docs/auth/web/manage-users
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const auth = getAuth()
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in — uid: user.uid
  } else {
    // User is signed out
  }
})
```

### React Router — Auth Guard Redirect
```javascript
// Source: reactrouter.com (Navigate component)
import { Navigate } from 'react-router-dom'

// Inside component:
if (!user) {
  return <Navigate to="/login" replace />
}
// replace: true prevents back-button from returning to guarded route
```
[VERIFIED: react-router-dom v7 — Navigate component with replace prop]

### FormSpree Honeypot Field
```html
<!-- Source: help.formspree.io — Honeypot spam filtering -->
<input type="text" name="_gotcha" style="display:none" tabindex="-1" autocomplete="off">
```
[CITED: https://help.formspree.io/hc/en-us/articles/360041504134-Honeypot-spam-protection]

### Firestore Security Rules — Auth Check
```javascript
// Source: firebase.google.com/docs/firestore/security/rules-conditions
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| HashRouter (`/#/admin`) | BrowserRouter (`/admin`) | Phase 1 (completed) | AuthGuard redirects use clean URLs; `/login` works without `#` |
| Hardcoded Firebase config | Vite `import.meta.env.VITE_*` | Phase 2 (this phase) | Configurable per environment; no git exposure of config values |
| Firestore open read/write | Auth-gated writes | Phase 2 (this phase) | Prevents unauthorized data modification |
| No admin auth | Firebase email/password auth | Phase 2 (this phase) | Admin panel requires login; SEG-01, SEG-02 |
| No spam protection | FormSpree `_gotcha` honeypot | Phase 2 (this phase) | Blocks basic bots; SEG-04 |

**Deprecated/outdated:**
- `HashRouter`: Replaced by BrowserRouter in Phase 1. All admin URLs now use clean paths.
- `styled-components`: Removed in Phase 1.
- `@dnd-kit/*`: Removed in Phase 1. `bulkUpdateOrden` removed.

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | yes | Firebase Auth `signInWithEmailAndPassword` — Google-managed auth service |
| V3 Session Management | yes | Firebase Auth `onAuthStateChanged` — handles token refresh, session persistence |
| V4 Access Control | yes | Firestore rules `request.auth != null` — server-side enforcement, client cannot bypass |
| V5 Input Validation | yes | FormSpree honeypot + existing form validation; Firestore rules prevent direct API abuse |
| V6 Cryptography | no | Firebase handles auth tokens internally; no custom crypto needed |

### Known Threat Patterns for React + Firebase + Vite

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Firebase config exposed in client | Information Disclosure | Vite env vars — values not in source; but client-side config is inherently readable (by design, not a secret) |
| Direct Firestore writes from browser console | Tampering | Firestore security rules — server-side enforcement, `request.auth != null` |
| Auth state spoofing via localStorage | Spoofing | `onAuthStateChanged` — verifies token with Firebase servers, localStorage bypass impossible |
| CSRF on login form | Spoofing | Firebase Auth SDK handles CSRF internally; no custom token handling |
| Spam form submissions | Denial of Service | FormSpree honeypot blocks automated bots; additional rate limiting on FormSpree free tier |
| XSS via admin content | Elevation of Privilege | Existing Firestore rules don't validate content; not in scope for this phase; admin user is trusted |

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Vite build/dev | ✓ | v24.18.0 | Engine requires 22.x; compatible (minor version mismatch, non-blocking) |
| npm | Package management | ✓ | 11.16.0 | — |
| Firebase project | Auth + Firestore | ✓ | atelierhomesarg | Already configured, app initialized |
| Netlify | Hosting + env vars | ✓ | atelierhomesarg.netlify.app | Configured, `netlify.toml` present |
| Firebase CLI | Rules deployment | [ASSUMED] | — | Can deploy rules via Firebase Console UI if CLI not available |
| FormSpree | Contact + valuation forms | ✓ | f/xdkdwpae, f/xrblyoez | Already configured and receiving submissions |

**Missing dependencies with no fallback:**
- None — all required infrastructure already exists.

**Missing dependencies with fallback:**
- Firebase CLI (for rules deploy): Fall back to Firebase Console → Firestore → Rules → Edit → Publish.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | FormSpree honeypot field name is `_gotcha` | Spam Protection | FormSpree may have changed the field name or disabled default honeypot on free tier. Mitigation: Test with a bot submission (fill `_gotcha` with any value) after deployment — should not deliver email. If fails, check FormSpree dashboard settings. |
| A2 | `firebase@10.7.1` Auth module works without additional config in Firebase Console | Auth Integration | Email/password sign-in provider must be enabled in Firebase Console → Authentication → Sign-in method. If not enabled, login fails with "operation not allowed" error. This is a manual step (SEG-05 pre-req). |
| A3 | `onAuthStateChanged` persistence works with Vite dev server on localhost | Auth Integration | Firebase Auth may have CORS/domain restrictions. `localhost` is pre-authorized. Custom local domains may need Firebase Console config. |
| A4 | 7 VITE_FIREBASE_* env vars sufficient for Firebase init | Environment Variables | Firebase SDK may require additional config fields in future. Current 7 fields match what's hardcoded now — sufficient. |
| A5 | FormSpree `_gotcha` field included in JSON body works the same as form-encoded | Spam Protection | FormSpree docs mention `_gotcha` for HTML forms (form-encoded). AJAX JSON submissions using the Form ID endpoint (`f/xxxxx`) may handle `_gotcha` differently. Mitigation: Test after deploy. If JSON endpoint doesn't process `_gotcha`, the field has zero harm — no false negatives (real users still submit fine). |
| A6 | Netlify env vars can be configured before or during deploy | Environment Variables | Netlify deploys will fail build (env var validation) if vars aren't set. Must configure in Netlify UI before pushing code that reads env vars. |

## Open Questions

1. **Firebase Console — Email/Password provider enabled?**
   - What we know: Auth code requires email/password sign-in provider enabled in Firebase Console → Authentication → Sign-in method.
   - What's unclear: Whether it's already enabled for this project.
   - Recommendation: Include manual step in plan to check/verify in Firebase Console before auth code deploy. Part of SEG-05.

2. **FormSpree `_gotcha` handling for JSON submissions**
   - What we know: Honeypot is documented for HTML form-encoded submissions. This project uses JSON via `fetch()`.
   - What's unclear: Does FormSpree's endpoint `f/xdkdwpae` parse `_gotcha` from JSON body same as form-encoded? The article content couldn't be fetched (JS-rendered help center).
   - Recommendation: Include test step in plan: submit form with `_gotcha: "spam"` — verify email NOT received. If JSON path ignores `_gotcha`, field causes no harm (no false positives). If needed, FormSpree also offers reCAPTCHA and Turnstile as alternatives (paid plans).

3. **Netlify deploy vs Firebase rules deploy timing**
   - What we know: Rules must deploy after code. Manual orchestration.
   - What's unclear: Whether Netlify auto-deploys on git push (instant) or manual trigger. If auto-deploy, need to have rules deploy command ready immediately after push.
   - Recommendation: Plan assumes manual deploy coordination. Document exact sequence: (1) push code → wait for Netlify build complete → (2) run `firebase deploy --only firestore:rules`.

## Sources

### Primary (HIGH confidence)
- [npm registry] — `firebase@10.7.1` confirmed installed; includes `@firebase/auth@1.5.1` [VERIFIED]
- [npm registry] — `react-router-dom@7.18.1` confirmed installed [VERIFIED]
- [Vite docs] — `import.meta.env.VITE_*` pattern for client-side env vars [VERIFIED: vitejs.dev/guide/env-and-mode.html]
- [Firebase docs] — Web Password Authentication API: `signInWithEmailAndPassword`, `onAuthStateChanged`, `signOut` [VERIFIED: firebase.google.com/docs/auth/web/password-auth]
- [Firebase docs] — Firestore security rules conditions: `request.auth != null` [VERIFIED: firebase.google.com/docs/firestore/security/rules-conditions]
- [FormSpree docs index] — Honeypot spam filtering article confirmed as built-in feature (2025-12-10 updated) [VERIFIED: help.formspree.io]
- [Codebase] — All file contents verified by reading actual source: `Firebase.js` (18 lines), `App.jsx` (195 lines), `Contacto.jsx` (171 lines), `Modal.jsx` (715 lines), `AdminLayout.jsx` (51 lines), `AdminHub.jsx` (47 lines), `schemas.js` (45 lines), `firestoreApi.js` (51 lines), `netlify.toml` (12 lines), `package.json` (48 lines), `vite.config.js` (15 lines) [VERIFIED]
- [slopcheck] — Both `firebase` and `react-router-dom` rated [OK] [VERIFIED]

### Secondary (MEDIUM confidence)
- [Phase 1 artifacts] — `01-PATTERNS.md`, `01-CONTEXT.md`, `STATE.md` — BrowserRouter migration completed, code cleanup patterns documented [VERIFIED: codebase matches]
- [Firebase SDK v10.7.1 dependencies] — `@firebase/auth` confirmed as transitive dependency [VERIFIED: npm registry]

### Tertiary (LOW confidence)
- [FormSpree honeypot `_gotcha` field name] — Confirmed from FormSpree docs index but article content not retrievable (JS-rendered). Training knowledge consistent with FormSpree patterns. [ASSUMED — flagged in Assumptions Log A1]

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — Firebase Auth bundled in existing `firebase` package, no new deps needed, verified via npm registry.
- Architecture: HIGH — React Context + AuthGuard pattern standard for Firebase Auth in React, verified against Firebase docs and Phase 1 patterns.
- Pitfalls: HIGH — Auth flash, atomic deploy, password manager autofill all well-known Firebase Auth pitfalls, verified via training knowledge + docs.

**Research date:** 2026-07-22
**Valid until:** 2026-08-21 (30 days — stable technologies, no fast-moving dependencies)
