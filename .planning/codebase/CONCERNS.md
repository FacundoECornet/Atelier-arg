# Concerns: Atelier Homes Argentina

**Date:** 2026-07-22
**Focus:** Technical debt, security issues, performance, fragile areas

## 🔴 Critical

### CRITICAL-01: No Authentication on Admin Panel
- **Location:** All routes under `/admin/*`
- **Issue:** Anyone who discovers the `/admin` URL has full CRUD access
- **Risk:** Data tampering, deletion, injection of malicious content
- **Mitigation:** At minimum, add a simple password gate or Firebase Auth

### CRITICAL-02: Firestore Rules Wide Open
- **Location:** `firestore.rules`
- **Issue:** `allow read, write: if true` — no access control on any collection
- **Risk:** Anyone with the Firebase project ID can read/write all data via SDK
- **Mitigation:** Implement Firebase Auth + security rules based on auth state

### CRITICAL-03: Firebase API Key Exposed in Client
- **Location:** `src/Firebase.js:5`
- **Issue:** API key visible in client-side source code
- **Risk:** Firestore abuse, unauthorized read/write, billing fraud
- **Mitigation:** Firebase API keys in client apps are standard practice (Firebase requires client-side config), but Firestore rules MUST restrict access — rules are the actual security boundary

## 🔴 High

### HIGH-01: No Testing
- **Issue:** Zero test coverage across the entire codebase
- **Risk:** Regression on any change is undetectable
- **See:** `.planning/codebase/TESTING.md`

### HIGH-02: FormSpree Forms Have No Spam Protection
- **Locations:** `Contacto.jsx`, `Modal.jsx`
- **Issue:** Public POST endpoints with no CAPTCHA or rate limiting
- **Risk:** Form spam, abuse of email delivery quotas

### HIGH-03: Price Formatting Heuristic
- **Location:** `src/utils/formatPrice.js`
- **Issue:** Currency detection based on value threshold (>10M = ARS, < = USD)
- **Risk:** Wrong currency displayed if values cross threshold incorrectly

## 🟡 Medium

### MEDIUM-01: Orphaned Drag-and-Drop Dependencies
- **Files:** `package.json` still lists `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
- **Reason:** Drag-and-drop feature removed, dependencies not cleaned
- **Action:** `npm uninstall @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`

### MEDIUM-02: Orphaned bulkUpdateOrden Function
- **Location:** `src/Admin/firestoreApi.js:35`
- **Issue:** Function exists but is never called (was used by removed drag-and-drop)
- **Action:** Remove unused code

### MEDIUM-03: Stale JSX Style Block
- **Location:** `src/Componentes/Nosotros.jsx`
- **Issue:** Contains `<style jsx>` block — this is a Next.js pattern, does nothing in plain React
- **Action:** Convert to Tailwind classes or remove

### MEDIUM-04: No Form Validation Library
- **Location:** All forms (contact, valuation, admin)
- **Issue:** Manual `useState` + `handleChange` pattern with no validation library
- **Risk:** Inconsistent validation, missing edge cases, verbose code

### MEDIUM-05: Hardcoded Firebase Config
- **Location:** `src/Firebase.js`
- **Issue:** Firebase credentials in source code
- **Action:** Use environment variables (`VITE_FIREBASE_*`) for different environments

## 🟢 Low

### LOW-01: Mixed Styling Approach
- **Issue:** Tailwind (primary) + styled-components (Social.jsx) + inline `<style>` (Nosotros.jsx)
- **Action:** Standardize on Tailwind only

### LOW-02: No Code Splitting for Public Pages
- **Issue:** All public components eagerly imported; only admin is lazy-loaded
- **Opportunity:** Split large components like Modal.jsx (715 lines) for faster initial load

### LOW-03: Module-Level Cache Persists Across Hot Reloads
- **Location:** `src/hooks/usePropiedades.js`
- **Issue:** `cachedData` is module-level — survives component unmount but not hard refresh
- **Note:** This is by design, but may surprise developers during dev with hot reload

### LOW-04: No Error Boundaries
- **Issue:** No React error boundaries wrapping sections
- **Risk:** A crash in one component can take down the entire app

### LOW-05: Netlify Node Version Mismatch
- **Location:** `netlify.toml` specifies Node 18, `package.json` engines requires Node 22
- **Action:** Align versions to avoid build discrepancies

## Summary

| Severity | Count |
|----------|-------|
| 🔴 Critical | 3 |
| 🔴 High | 3 |
| 🟡 Medium | 5 |
| 🟢 Low | 5 |
| **Total** | **16** |
