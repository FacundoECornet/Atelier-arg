---
phase: 02-security-hardening
plan: 02
subsystem: deploy-security
tags: firestore-rules, env-vars, netlify, admin-user, firebase-console
requires:
  - phase: 02-01
    provides: Firebase Auth context, env var migration, admin auth vertical slice
provides:
  - Firestore security rules — read open, write auth-gated (SEG-03)
  - .env.example template for future developers
  - Netlify build env var documentation in netlify.toml (INFR-04)
  - Admin user creation + Email/Password provider enablement (SEG-05)
affects: production deployment, future developers onboarding
tech-stack:
  added: firestore.rules, .env.example template
  platforms: Firebase Console (auth provider + admin user), Netlify (env vars)
key-files:
  created:
    - firestore.rules
    - .env.example
  modified:
    - netlify.toml
key-decisions:
  - "Firestore rules: allow read for everyone (public site must load), allow write only if request.auth != null"
  - ".env.example committed to repo — devs copy to .env (gitignored), fill in real values"
  - "Netlify env vars documented as comments in netlify.toml — actual values set in Netlify UI"
  - "Email/Password provider + admin user created manually in Firebase Console — no automation needed"
  - "Firestore rules deployed via Firebase Console or CLI after build succeeds"
requirements-completed:
  - SEG-03
  - INFR-04
  - SEG-05
duration: 3 min (automated) + manual deployment steps
completed: 2026-07-22
---

## Tasks Completed

### Task 1 — Create security config files (automated)

**Commit:** `52082fc`

Created three configuration files:
- `firestore.rules` — Firestore security rules: `allow read: if true`, `allow write: if request.auth != null`
- `.env.example` — Template with 7 placeholder `VITE_FIREBASE_*` variables
- `netlify.toml` — Added commented env var documentation in `[build.environment]`, existing SPA redirect preserved

### Task 2 — Manual deployment steps (checkpoint:human-action)

Steps completed by user:

1. **Firebase Console — Enable Email/Password provider:** Toggle enabled in Authentication → Sign-in providers
2. **Firebase Console — Create admin user:** Added user in Authentication → Users with email + password
3. **Netlify — Configure env vars:** Added all 7 `VITE_FIREBASE_*` vars in Site settings → Environment variables (Production + Deploy Preview)
4. **Firebase Console — Deploy Firestore rules:** Published `firestore.rules` content via Console or CLI

**Verification checklist:**
- [ ] Incognito → `/admin` → redirects to `/login`
- [ ] Login with admin credentials → admin panel loads, CRUD works
- [ ] Unauthenticated Firestore write → `PERMISSION_DENIED`
- [ ] Public pages (/, /propiedades) → all content loads without auth
