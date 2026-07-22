---
phase: 02-security-hardening
plan: 01
subsystem: auth
tags: firebase-auth, react-context, env-vars, route-protection
requires:
  - phase: 01-foundation-infrastructure
    provides: BrowserRouter migration (clean /admin/* paths), ErrorBoundary pattern
provides:
  - Firebase env var migration with startup validation (INFR-03)
  - AuthContext/AuthGuard/LoginPage auth vertical slice (SEG-01)
  - Admin route protection with AuthGuard (SEG-02)
  - Logout button in AdminLayout
affects: phase 02-02 (Firestore rules + admin user creation), phase 02-03 (spam protection)
tech-stack:
  added: firebase/auth (already bundled in firebase@^10.14.1)
  patterns: React Context for auth state, AuthGuard route wrapper, env var validation loop
key-files:
  created:
    - src/Auth/AuthContext.jsx
    - src/Auth/AuthGuard.jsx
    - src/Auth/LoginPage.jsx
    - .env
  modified:
    - src/Firebase.js
    - .gitignore
    - src/App.jsx
    - src/Admin/AdminLayout.jsx
key-decisions:
  - "AuthGuard wraps admin route element in App.jsx — protects all nested routes via React Router layout routing"
  - "isAdmin condition extended to include /login — hides Navbar/Footer on login page without restructuring Shell"
  - "AuthGuard placed inside ErrorBoundary, outside Suspense — ensures loading/redirect work before lazy chunk triggers"
  - "LoginPage extracts to standalone route outside Shell's admin/navbar layout — no Navbar/Footer rendering"
requirements-completed:
  - INFR-03
  - SEG-01
  - SEG-02
duration: 6 min
completed: 2026-07-22
---

# Phase 2: Security Hardening — Plan 01 Summary

**Firebase env var migration with startup validation, AuthContext/AuthGuard/LoginPage auth vertical slice, admin route protection, and logout in AdminLayout**

## Performance

- **Duration:** 6 min
- **Started:** 2026-07-22T21:37:13Z
- **Completed:** 2026-07-22T21:43:32Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments

- Firebase.js now reads 7 config values from VITE_FIREBASE_* env vars with startup validation (INFR-03)
- AuthContext provides `{ user, loading }` via `onAuthStateChanged` from Firebase SDK
- AuthGuard redirects unauthenticated users to `/login` with loading spinner during session check
- LoginPage: email/password form with SweetAlert2 error handling, "Ingresar"/"Ingresando…" submit state
- App.jsx: AuthProvider wraps Router, /login route added before admin routes, AuthGuard wraps AdminLayout
- AdminLayout: "Cerrar sesión" button calls `signOut()` + `navigate('/login')`
- isAdmin condition extended to skip Navbar/Footer on /login page
- .env created with local dev Firebase config values (gitignored)
- Build passes cleanly

## Task Commits

Each task was committed atomically:

1. **Task 1: Migrate Firebase.js to env vars + create Auth components** — `15ba4d4` (feat, pre-committed with 02-03 scope)
2. **Task 2: Wire auth into App.jsx + add logout to AdminLayout** — `73290f4` (feat)

**Plan metadata:** Pending

## Files Created/Modified

- `src/Firebase.js` — Env var migration, startup validation, getAuth export
- `src/Auth/AuthContext.jsx` — React Context with onAuthStateChanged listener
- `src/Auth/AuthGuard.jsx` — Route protection, redirects to /login if unauthenticated
- `src/Auth/LoginPage.jsx` — Email/password login with SweetAlert2
- `.env` — Local dev Firebase config (gitignored)
- `.gitignore` — Added `.env` entry
- `src/App.jsx` — AuthProvider, /login route, AuthGuard wrapping admin
- `src/Admin/AdminLayout.jsx` — Logout button with signOut

## Decisions Made

- **AuthGuard placement:** Inside ErrorBoundary (catches render errors) but outside Suspense (loading/redirect must not be caught by lazy loading fallback)
- **login route:** Placed at root level of Routes, NOT inside admin Route — enables standalone rendering without Shell's admin layout
- **isAdmin condition:** Extended to include `/login` rather than restructuring Shell to have a separate "no chrome" layout — minimal diff, preserves existing structure
- **Firebase env var validation:** Loop-based check before `initializeApp` — fails fast with clear error listing missing vars instead of cryptic Firebase SDK error

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- Task 1 infrastructure files (Firebase.js, Auth/, .gitignore) were already committed to HEAD in a prior combined execution with plan 02-03. Writes verified identical. Task 1 commit was already present — no duplicate commit needed.

## User Setup Required

None - .env created locally. Admin user creation (SEG-05) deferred to plan 02-02.

## Next Phase Readiness

- Auth system complete: env vars validated, auth context/guard/login wired, admin routes protected
- Ready for plan 02-02 — Firestore security rules deployment + admin user creation in Firebase Console
- Public pages continue to work without authentication

## Self-Check: PASSED

All 7 key files verified on disk. Commit 73290f4 verified in git log. AuthGuard loading text ("Verificando acceso…") correct. LoginPage SweetAlert2 error text present. Firebase.js validation loop present. App.jsx isAdmin condition includes /login.
