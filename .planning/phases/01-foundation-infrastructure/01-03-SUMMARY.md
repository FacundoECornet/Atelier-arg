---
phase: 01-foundation-infrastructure
plan: 03
subsystem: tooling
tags: eslint, prettier, react-plugin, error-boundary, formatting

requires:
  - phase: 01-foundation-infrastructure
    plan: 01
    provides: BrowserRouter migration (base for ErrorBoundary wrapping)
  - phase: 01-foundation-infrastructure
    plan: 02
    provides: Clean package.json (no orphaned deps)

provides:
  - ESLint React plugin rules (recommended + jsx-runtime) for React-specific linting
  - Prettier formatting config matching project style
  - ErrorBoundary component wrapping main sections
  - Explicit eslint-plugin-react-hooks and eslint-plugin-react-refresh dependencies

affects:
  - phase: 03-seo-content
    keyword: linting
  - phase: 04-ui-features
    keyword: component safety

tech-stack:
  added:
    - eslint-plugin-react (React lint rules)
    - prettier (code formatter)
    - eslint-config-prettier (ESLint/Prettier conflict resolution)
    - eslint-plugin-react-hooks (now explicit dep)
    - eslint-plugin-react-refresh (now explicit dep)
  patterns:
    - ErrorBoundary wrapping per section (not route level) for granular crash isolation
    - Prettier config stored in package.json (no separate file)
    - ESLint flat config with plugins as array entries

key-files:
  created:
    - src/Componentes/ErrorBoundary.jsx — class-based error boundary with Spanish fallback UI
  modified:
    - eslint.config.js — added react plugin, jsx-runtime rules, prettier config, react settings
    - package.json — prettier config + 5 new devDependencies + format scripts
    - src/App.jsx — ErrorBoundary wraps Body, Equipo, Propiedades, Admin sections
    - 28 source files — formatted by Prettier (whitespace only, no logic changes)

key-decisions:
  - "ErrorBoundary wraps at section level, not route level — sections render as siblings within the `/` route"
  - "Fallback is a centered card in page flow (no SweetAlert) — avoids popup disruption on critical sections"
  - "Retry button resets error state via setState — allows recovery without full page reload"
  - "Prettier semi: false, singleQuote: true — matches existing codebase conventions"
  - "eslint-plugin-react-hooks/react-refresh added as explicit devDependencies — previously only in transitive deps"

patterns-established:
  - "ErrorBoundary with getDerivedStateFromError + componentDidCatch pattern for React 18"
  - "Prettier format on new files before commit ensures consistent style"
  - "ESLint flat config: separate array entries for baseline rules and prettier overrides"

requirements-completed:
  - CLN-05
  - CLN-06

duration: 3 min
completed: 2026-07-22
---

# Phase 01 Plan 03: Lint/Format Tooling + Error Boundaries

**ESLint React plugin rules, Prettier formatting config with project-consistent style, ErrorBoundary component wrapping 6 section instances across homepage, property routes, and admin panel**

## Performance

- **Duration:** 3 min
- **Started:** 2026-07-22T21:20:29Z
- **Completed:** 2026-07-22T21:23:21Z
- **Tasks:** 2
- **Files modified:** 31 (3 config + 1 new component + 28 formatted)

## Accomplishments

- ESLint configured with react-plugin recommended + jsx-runtime rules, react/prop-types disabled (no TypeScript/PropTypes in codebase)
- Prettier configured: no semicolons, single quotes, 2-space indent, trailing commas, 100-char print width — matches existing codebase style
- All 28 source files formatted consistently by Prettier
- ErrorBoundary class component with Spanish fallback UI and retry button
- Body (Inicio), Equipo, Propiedades (homepage + routes), and Administración sections wrapped — white screens prevented on component crash

## Task Commits

Each task was committed atomically:

1. **Task 1: Install ESLint React plugin + Prettier, configure both** — `1dba23f` (feat)
2. **Task 2: Create ErrorBoundary component and wrap main sections** — `e927275` (feat)

**Plan metadata:** `pending` (docs: complete plan — created after this SUMMARY)

## Files Created/Modified

- `src/Componentes/ErrorBoundary.jsx` — Class-based error boundary with `getDerivedStateFromError`, `componentDidCatch`, Spanish fallback card UI, retry button
- `eslint.config.js` — Added react plugin import/plugins/rules, prettier config entry, React version setting (detect)
- `package.json` — Prettier config (semi:false, singleQuote:true), format scripts, 5 new devDependencies
- `src/App.jsx` — ErrorBoundary import + 6 wrapper instances: Inicio, Equipo, Propiedades (homepage PropertyList, route PropiedadesInfo, route AllProperties), Administración
- `src/**/*.jsx` — 28 files reformatted by Prettier (whitespace only)

## Decisions Made

- **Per-section error boundaries:** Each section gets its own ErrorBoundary instance so a crash in one doesn't affect others — critical for the homepage where all sections render as siblings
- **No SweetAlert for errors:** Fallback is an inline card that preserves layout flow, avoiding popups on potentially crashed sections
- **Retry button:** Resets `hasError` state, re-renders children — user doesn't need full page reload
- **Prettier config in package.json:** Single file approach — no separate `.prettierrc` needed

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Installed missing eslint-plugin-react-hooks and eslint-plugin-react-refresh**
- **Found during:** Task 2 verification (`npx eslint src/`)
- **Issue:** Both packages were imported in `eslint.config.js` but never listed as dependencies — `npm ls` showed (empty). Previous eslint usage never exercised these imports (packages absent from node_modules). When eslint ran with the newly-enabled config, module resolution failed.
- **Fix:** Installed both as explicit `devDependencies` — they're directly imported in eslint.config.js and required for flat config resolution
- **Files modified:** package.json, package-lock.json
- **Verification:** `npx eslint src/` resolves all imports successfully
- **Committed in:** e927275 (Task 2 commit)

**2. [Rule 2 - Missing Config] Added React version setting to ESLint config**
- **Found during:** Task 2 verification
- **Issue:** ESLint emitted warning "React version not specified in eslint-plugin-react settings"
- **Fix:** Added `settings: { react: { version: 'detect' } }` to eslint.config.js
- **Files modified:** eslint.config.js
- **Verification:** Warning no longer appears in eslint output
- **Committed in:** e927275 (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (1 blocking, 1 missing config)
**Impact on plan:** Both fixes essential for ESLint to function correctly. No scope creep.

## Issues Encountered

- **Pre-existing lint errors surfaced by new React rules:** After enabling eslint-plugin-react and properly installing eslint-plugin-react-hooks, 8 pre-existing errors were detected across 6 files (set-state-in-effect, no-unused-vars, immutability violations). These are not regressions — the linter now correctly diagnoses latent issues in the existing codebase. Per scope boundary, pre-existing issues are out of scope for this plan. Should be addressed in a future cleanup plan.
- **Prettier formatting of ErrorBoundary.jsx:** New file created outside Prettier's initial format run — ran `prettier --write` to fix. Normal process for new files in a formatted project.

## Known Stubs

None — ErrorBoundary is fully functional, no placeholder text or empty data paths.

## Threat Flags

None — no new network endpoints, auth paths, or trust boundary changes.

## Next Phase Readiness

- Tooling foundation complete — ESLint + Prettier ready
- Error boundaries deployed on all crash-prone sections
- Pre-existing lint errors (8) deferred — recommend addressing in a follow-up cleanup plan
- Phase 1 complete — ready for Phase 2 (auth + security)

---

*Phase: 01-foundation-infrastructure*
*Completed: 2026-07-22*
