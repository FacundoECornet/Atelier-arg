# Testing: Atelier Homes Argentina

**Date:** 2026-07-22
**Focus:** Test framework, patterns, coverage

## Test Status

**No testing framework installed or configured.**

- No test scripts in `package.json`
- No test files found anywhere in the codebase
- No CI configuration for testing
- No `vitest`, `jest`, `mocha` in dependencies

## Implications

- No unit tests for utilities (`formatPrice.js`, `imgFallback.js`)
- No component tests for React components
- No integration tests for Firestore operations
- No E2E tests for user flows
- No regression protection for admin CRUD operations

## Risk Assessment

| Risk | Impact |
|------|--------|
| Utility functions may have edge cases | No validation for price formatting logic |
| Admin CRUD may break on schema changes | No tests verify Firestore operations |
| Component renders may regress | No snapshot or render testing |
| Refactoring is high-risk | No test harness to catch breakage |

## Recommended Additions

- **Vitest** (Vite-native, zero-config with Vite) for unit tests
- **React Testing Library** for component tests
- Basic tests for: `formatPrice.js`, `imgFallback.js`, `firestoreApi.js`
