---
phase: 04-feature-polish
plan: 01
subsystem: data
tags: [firestore, sorting, schema, backfill, admin]

# Dependency graph
requires:
  - phase: 02-security-hardening
    provides: Firestore security rules (request.auth != null for writes)
provides:
  - fechaIngreso field on all propiedades documents (backfilled)
  - Admin schema fields: fechaIngreso (date) on propiedades, email (text) on nosotros
  - Client-side sort toggle (newest/oldest) on propiedad listing
affects: [04-02 (team email field reads from schema), 04-03 (listing render order)]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Client-side reverse() for sort direction toggle (no re-fetch on order change)
    - Standalone Node ESM Firebase script pattern (direct process.env, no import.meta.env)
    - Firestore admin backfill: signInWithEmailAndPassword before writes

key-files:
  created:
    - scripts/backfill-fechaIngreso.mjs
  modified:
    - src/Admin/schemas.js
    - src/hooks/usePropiedades.js
    - src/Propiedades/Todaspropiedades.jsx

key-decisions:
  - "orderBy('fechaIngreso', 'desc') — single-field orderBy, no composite index required"
  - "Sort toggle inverts client-side via .reverse() — avoids re-fetch on direction change"
  - "Backfill script uses standalone Firebase init (not src/Firebase.js) to avoid import.meta.env in Node ESM"
  - "Fallback date 2024-01-01 for docs where createTime unavailable"

patterns-established:
  - "Backfill scripts: standalone Firebase init + auth signIn + getDocs/updateDoc loop + summary logging"

requirements-completed: [SORT-01, SORT-02, ADMIN-01]

# Metrics
duration: 7min (code) + user creds + backfill run
completed: 2026-08-03
---

# Phase 4 Plan 1: Property Sorting + Schema Fields Summary

**Properties sorted by fechaIngreso (newest/oldest toggle), admin schema extended with fechaIngreso (propiedades) + email (nosotros), and Firestore backfill ensuring all docs have the sort field — 33 properties backfilled.**

## Performance

- **Duration:** code 7min + backfill ~5s
- **Started:** 2026-08-03T17:35Z
- **Completed:** 2026-08-03T17:45Z
- **Tasks:** 2
- **Files modified:** 4 (1 created, 3 modified)

## Accomplishments
- `schemas.js`: added `fechaIngreso` field (`type: 'date'`) + listColumn on `propiedades` schema; added `email` field (`type: 'text'`) + listColumn on `nosotros` schema
- `usePropiedades.js`: changed `orderBy` from `'provincia'` to `orderBy('fechaIngreso', 'desc')` — no composite index needed (single-field orderBy, provincia filter is client-side)
- `Todaspropiedades.jsx`: added `<select>` sort toggle with aria-label "Ordenar por fecha de ingreso", options "Más recientes"/"Más antiguos"; `sortOrder` state defaults to `'newest'`; oldest = `[...filtered].reverse()` client-side
- `propiedadesCards.jsx` homepage audited: `slice(0, visibleCount)` works with new ordering
- `scripts/backfill-fechaIngreso.mjs`: standalone Node ESM script — independent Firebase init from `process.env`, signs in before writes, assigns `fechaIngreso` from `createTime` (fallback `2024-01-01`)
- Backfill executed: 33 docs checked, 33 backfilled (all missing fechaIngreso)

## Task Commits

1. **Task 1: Admin schema + backfill script** - `ac1eaed` (feat)
2. **Task 2: sort orderBy + toggle UI** - `65807bd` (feat)

## Files Created/Modified
- `src/Admin/schemas.js` — `fechaIngreso` field on propiedades, `email` field on nosotros, both with listColumns
- `scripts/backfill-fechaIngreso.mjs` — One-time migration script (Firebase init + auth + getDocs/updateDoc loop)
- `src/hooks/usePropiedades.js` — `orderBy('fechaIngreso', 'desc')` replaces orderBy('provincia')
- `src/Propiedades/Todaspropiedades.jsx` — `<select>` sort dropdown with newest/oldest toggle

## Decisions Made
- Sort direction uses `Array.reverse()` client-side — no Firestore re-query on toggle, works because filtered array is already sorted by date
- Backfill script does NOT import `src/Firebase.js` — that file uses `import.meta.env` (Vite-specific, undefined in Node ESM)
- Fallback date `2024-01-01` — safe default; `createTime` may not be available for all docs

## Deviations from Plan

One checkpoint: backfill execution blocked on admin credentials. User provided `gestion@atelierhomes.es` credentials in `.env`, backfill then ran successfully.

## Issues Encountered

- **auth/invalid-credential** on first backfill attempt — credentials in `.env` were not valid Firebase Auth users. User corrected to actual admin panel credentials.

## User Setup Required

- Admin credentials (`VITE_ADMIN_EMAIL`, `VITE_ADMIN_PASSWORD`) must be present in `.env` for backfill script to run. One-time requirement.

## Next Phase Readiness

- SORT-01 (sort by fechaIngreso), SORT-02 (toggle UI), ADMIN-01 (schema fields) delivered
- All 33 properties have `fechaIngreso` — no properties excluded from listing
- `npm run build` passes

---
*Phase: 04-feature-polish*
*Completed: 2026-08-03*

## Self-Check: PASSED

- `src/Admin/schemas.js` has `fechaIngreso` and `email` fields
- `src/hooks/usePropiedades.js` uses `orderBy('fechaIngreso', 'desc')`
- `src/Propiedades/Todaspropiedades.jsx` has `<select>` sort toggle
- `scripts/backfill-fechaIngreso.mjs` exists on disk
- Backfill summary: 33/33 docs backfilled
- `npm run build` succeeds
