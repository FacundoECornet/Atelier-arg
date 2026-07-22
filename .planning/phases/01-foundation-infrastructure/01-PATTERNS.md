# Phase 1: Foundation & Infrastructure - Pattern Map

**Mapped:** 2026-07-22
**Files analyzed:** 10 new/modified
**Analogs found:** 10 / 10

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `src/App.jsx` | config/router | request-response | `src/App.jsx` (self — modify in place) | exact |
| `src/Componentes/Social.jsx` | component | static | `src/Componentes/propiedadesCards.jsx` (Tailwind hover patterns) | partial |
| `src/Componentes/Equipo.jsx` | component | CRUD | `src/Propiedades/PropiedadesInfo.jsx` (loading/error/state patterns) | role-match |
| `src/Admin/firestoreApi.js` | service | CRUD | `src/Admin/firestoreApi.js` (self — remove function) | exact |
| `netlify.toml` | config | static | `vercel.json` (SPA rewrite pattern) | role-match |
| `eslint.config.js` | config | static | `eslint.config.js` (self — add plugins) | exact |
| `package.json` | config | static | `package.json` (self — remove deps) | exact |
| `src/utils/ErrorBoundary.jsx` | utility | component | `src/main.jsx` (entry point wrap pattern) | partial |
| `.prettierrc` | config | static | No analog — new file | none |
| `public/_redirects` | config | static | `public/_redirects` (already exists, verify) | exact |

## Pattern Assignments

### `src/App.jsx` (config/router, request-response)

**Analog:** `src/App.jsx` (current file, modify in place)

**Imports pattern** (lines 1-2):
```javascript
import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
```
→ Change to:
```javascript
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
```

**Router wrap pattern** (lines 84-90):
```javascript
function App() {
  return (
    <Router>
      <Shell />
    </Router>
  );
}
```
→ Keep structure, only change `HashRouter` → `BrowserRouter` import.

**Hash redirect pattern** — add in `Shell()` (before return, after `useLocation()`):
```javascript
// Analog for hash detection pattern: src/Componentes/Header.jsx lines 20-21, 45-56
function Shell() {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();

  // D-03: Client-side hash redirect for old /#/ bookmarks
  useEffect(() => {
    if (hash && hash.startsWith('#/')) {
      const cleanPath = hash.replace('#/', '/');
      navigate(cleanPath, { replace: true });
    }
  }, []);
  // ...
```

**Navbar link pattern** — `src/Componentes/Header.jsx` lines 32-57: uses `useNavigate()` for SPA navigation, `navigate('/')` for home, `navigate('/propiedades')` for route nav. All hash-based nav must use `navigate()` not `window.location`.

---

### `src/Componentes/Social.jsx` (component, static)

**Analog:** `src/Componentes/propiedadesCards.jsx` (Tailwind hover transitions)

**Current styled-components pattern** (lines 81-185):
```javascript
const StyledWrapper = styled.div`
  ul { list-style: none; }
  .example-2 { display: flex; justify-content: center; align-items: center; }
  .example-2 .icon-content { margin: 0 10px; position: relative; }
  .example-2 .icon-content a {
    display: flex; justify-content: center; align-items: center;
    width: 50px; height: 50px; border-radius: 50%;
    color: #4d4d4d; background-color: #fff;
    transition: all 0.3s ease-in-out;
  }
  .example-2 .icon-content a:hover {
    box-shadow: 3px 2px 45px 0px rgb(0 0 0 / 12%);
    color: white;
  }
  // ... per-social-color filled backgrounds
`;
```

**Target Tailwind pattern** — analog from `propiedadesCards.jsx` lines 46-67:
```jsx
// Card hover: shadow transition + scale
className="group bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300"

// Image hover zoom
className="... transition-transform duration-700 group-hover:scale-105"

// Active/filter button toggle
className={`px-4 py-2 rounded-full border ${
  selectedLocation === loc
    ? 'bg-black text-white border-black'
    : 'bg-white text-black border-gray-300'
} transition-all`}
```

**Key conversion mappings for `Social.jsx`:**
- `StyledWrapper` → remove wrapper entirely, apply Tailwind directly to `<ul>` element
- `display: flex; justify-content: center; align-items: center;` → `flex justify-center items-center`
- `border-radius: 50%; width: 50px; height: 50px;` → `w-[50px] h-[50px] rounded-full`
- `transition: all 0.3s ease-in-out;` → `transition-all duration-300 ease-in-out`
- `a:hover { color: white; box-shadow: ... }` → `hover:text-white hover:shadow-lg`
- Social color fills: use `data-social` attribute selectors in Tailwind `group-*` variants or inline `style` per icon
- Tooltip position: `absolute top-[-30px]` → `absolute -top-8` pattern

**Important:** Remove `import styled from "styled-components"` line. If `styled-components` is no longer used anywhere, uninstall: `npm uninstall styled-components`.

---

### `src/Componentes/Equipo.jsx` (component, CRUD)

**Analog:** `src/Propiedades/PropiedadesInfo.jsx` (loading/error/state pattern)

**`<style jsx>` block to remove** (lines 81-88):
```jsx
<style jsx>{`
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`}</style>
```

**Target pattern:** Tailwind already has `line-clamp-3` as a utility class in Tailwind 3.4. Simply replace the inline style reference. Uses existing Tailwind pattern from `propiedadesCards.jsx` line 74:
```jsx
<p className="text-gray-700 text-base leading-relaxed mb-6 line-clamp-3">
```

**Loading state pattern** (Equipo.jsx lines 29-35):
```jsx
if (loading) {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="text-xl font-semibold text-gray-600">Cargando...</div>
    </div>
  );
}
```
Analog from `PropiedadesInfo.jsx` line 60: `<div className="text-center py-20 text-xl">Cargando...</div>`

**Error state pattern** (Equipo.jsx lines 37-43):
```jsx
if (error) {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="text-xl font-semibold text-red-600">{error}</div>
    </div>
  );
}
```
Analog from `PropiedadesInfo.jsx` line 61: `<div className="text-center text-red-500 py-20">{error}</div>`

**Error note:** CONTEXT.md mentions `Nosotros.jsx` for `<style jsx>` — that's incorrect. `Equipo.jsx` is the actual file. `Nosotros.jsx` has zero `<style jsx>` blocks. Do not modify `Nosotros.jsx` for this task.

---

### `src/Admin/firestoreApi.js` (service, CRUD)

**Analog:** `src/Admin/firestoreApi.js` (self — remove function)

**Function to remove** (lines 35-41):
```javascript
export async function bulkUpdateOrden(collectionName, updates) {
  const batch = writeBatch(db);
  updates.forEach(({ id, orden }) => {
    batch.update(doc(db, collectionName, id), { orden });
  });
  await batch.commit();
}
```

**Also remove unused import:** `writeBatch` from firebase/firestore on line 12 (check if used elsewhere — it's only used by `bulkUpdateOrden`).

**Exports to keep** (lines 16-59): `listAll`, `listAllOrdered`, `getNextOrden`, `getOne`, `create`, `update`, `remove`.

---

### `netlify.toml` (config, static)

**Analog:** `vercel.json` (SPA rewrite pattern)

**Vercel SPA rewrite** (lines 1-4):
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

**Current `netlify.toml`** (lines 1-6):
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"
```

**Target pattern — add SPA fallback:**
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```
Alternatively, `public/_redirects` already has `/* /index.html 200` — verify it covers BrowserRouter. If `_redirects` already exists with correct rule, `netlify.toml` redirect is redundant. One or the other (Netlify recommends `_redirects`).

---

### `eslint.config.js` (config, static)

**Analog:** `eslint.config.js` (self — add plugins)

**Current flat config pattern** (lines 1-33):
```javascript
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
]
```

**Target pattern — add:**
```javascript
import react from 'eslint-plugin-react'
import prettier from 'eslint-config-prettier'

// In plugins:
plugins: {
  'react': react,
  'react-hooks': reactHooks,
  'react-refresh': reactRefresh,
},

// In rules (after js.configs.recommended.rules):
...react.configs.recommended.rules,
...react.configs['jsx-runtime'].rules,
// Then at end of rules array:
...prettier.rules,  // must be last to override
```

**Important:** ESLint v10 flat config — `eslint-plugin-react` v7.37+ has flat config support. Do NOT use `.eslintrc` format.

---

### `src/utils/ErrorBoundary.jsx` (utility/component, component lifecycle)

**Analog:** `src/Componentes/Equipo.jsx` (error state pattern) + `src/Propiedades/PropiedadesInfo.jsx` (error UI)

**Component pattern** — class component per React convention for error boundaries (ROADMAP.md line 73 confirms class-based is acceptable):
```javascript
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI — Spanish, minimal, preserva layout
      return (
        <div className="flex flex-col items-center justify-center min-h-[200px] p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Algo salió mal
          </h2>
          <p className="text-gray-600 mb-4">
            {this.props.sectionName
              ? `Error al cargar ${this.props.sectionName}`
              : 'Error al cargar esta sección'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
          >
            Reintentar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

**Error state UI analog** from `PropiedadesInfo.jsx` line 61:
```jsx
<div className="text-center text-red-500 py-20">{error}</div>
```
Boundary fallback is softer — no red, no SweetAlert, matches D-09 constraint.

**Integration pattern** — wrap sections in `App.jsx`:
```jsx
import ErrorBoundary from './utils/ErrorBoundary';

// Usage example — wrap individual route elements:
element={
  <ErrorBoundary sectionName="la página principal">
    <div className="flex flex-col">...</div>
  </ErrorBoundary>
}
```

---

### `package.json` (config, static)

**Analog:** `package.json` (self — modify deps)

**Remove from `dependencies`:**
```json
"@dnd-kit/core": "^6.3.1",
"@dnd-kit/sortable": "^10.0.0",
"@dnd-kit/utilities": "^3.2.2",
```

**Remove from `dependencies`** (after Social.jsx conversion confirmed no more usage):
```json
"styled-components": "^6.4.1",
```

**Add to `devDependencies`:**
```json
"eslint-plugin-react": "^7.37.0",
"prettier": "^3.9.0",
"eslint-config-prettier": "^10.1.0",
```

---

### `.prettierrc` (create, config)

**No analog** — new file. Conventions from CONVENTIONS.md:
- No semicolons (codebase shows no semicolons in modern files)
- Single quotes (as seen across codebase)
- Tab width 2 (standard)
- JSX single quotes (consistent with JS style)

**Suggested config:**
```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 100,
  "jsxSingleQuote": true,
  "bracketSpacing": true
}
```

**Run after install:**
```bash
npx prettier --write src/
```

---

### `public/_redirects` (config, static — verify only)

**Analog:** `public/_redirects` (already exists)

**Current content** (line 1):
```
/*    /index.html   200
```

**Action:** Verify this already handles BrowserRouter SPA fallback. It does — the rule `/* → /index.html 200` is correct. No change needed unless `netlify.toml` redirect is preferred instead.

---

## Shared Patterns

### Tailwind Hover/Transition Pattern
**Source:** `src/Componentes/propiedadesCards.jsx` lines 46-67
**Apply to:** Social.jsx conversion
```jsx
// Standard hover card pattern
className="group ... hover:shadow-2xl transition-all duration-300"

// Image hover zoom
className="transition-transform duration-700 group-hover:scale-105"

// Button hover
className="... hover:bg-black hover:text-white transition-all duration-200"
```
ALL hover effects in codebase follow this `transition-{property} duration-{ms}` pattern.

### Loading State Pattern
**Source:** `src/Componentes/Equipo.jsx` lines 29-35, `src/Propiedades/Todaspropiedades.jsx` lines 101-109
**Apply to:** Any component with async data
```jsx
// Simple text
<div className="text-center py-20 text-xl">Cargando...</div>

// Spinner
<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
```

### Error State Pattern
**Source:** `src/Propiedades/PropiedadesInfo.jsx` line 61, `src/Componentes/Equipo.jsx` lines 37-43
**Apply to:** ErrorBoundary fallback
```jsx
// Red text error (data errors)
<div className="text-center text-red-500 py-20">{error}</div>

// With retry button
<div className="px-4 sm:px-6 lg:px-8 pt-32 pb-12 max-w-7xl mx-auto">
  <div className="text-center">
    <p className="text-red-600 mb-4">{error}</p>
    <button
      onClick={() => window.location.reload()}
      className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
    >
      Reintentar
    </button>
  </div>
</div>
```

### Firestore CRUD Pattern
**Source:** `src/Admin/firestoreApi.js` lines 16-60
```javascript
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../Firebase';
```
All Firestore operations follow this pattern: import from `../Firebase`, use `collection(db, name)`, return serialized data.

### ESLint Flat Config Pattern
**Source:** `eslint.config.js` lines 1-33
**Apply to:** Adding react + prettier plugins
ESLint v10 flat config — array of config objects. Each has `files`, `languageOptions`, `plugins`, `rules`. Prettier config must be LAST in rules array.

### HashRouter Import Pattern
**Source:** `src/App.jsx` line 2 (CURRENT)
**Apply to:** BrowserRouter migration
```javascript
// Current:
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
// Target:
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
```
Keep the `as Router` alias to minimize diff. Add `useNavigate` to import for hash redirect.

### `useNavigate` Pattern (already used across codebase)
**Source:** `src/Componentes/Header.jsx` line 21, `src/Admin/AdminForm.jsx` line 18, `src/Propiedades/propiedadesCards.jsx` line 8
**Apply to:** All navigation after BrowserRouter migration
```javascript
const navigate = useNavigate();
navigate('/');                    // home
navigate(-1);                     // back
navigate(`/propiedades/${id}`);   // dynamic route
navigate('/admin/propiedades');   // admin route
```

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `.prettierrc` | config | static | No Prettier config exists yet. Use RESEARCH.md recommendations + CONVENTIONS.md style cues. |

## Metadata

**Analog search scope:** `src/`, `netlify.toml`, `vercel.json`, `eslint.config.js`, `package.json`, `public/`
**Files scanned:** 30+
**Pattern extraction date:** 2026-07-22
