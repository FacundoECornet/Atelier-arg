# Conventions: Atelier Homes Argentina

**Date:** 2026-07-22
**Focus:** Code style, naming, patterns, error handling

## Code Style

- **No TypeScript** — all files are plain `.jsx`
- **JSDoc comments** — minimal, found in some utility files
- **ES Modules** — `import`/`export` syntax throughout
- **Arrow functions** — `const Component = () => { ... }` pattern
- **Explicit React import** — `import React from 'react'` in every JSX file (pre-React 17 pattern)

## Component Patterns

### Public Components
- Fetch data in `useEffect`, store in `useState`
- Render loading states (skeleton/spinner) based on boolean flags
- Error handling: set error state, optionally show SweetAlert2

### Admin Components
- Schema-driven: receive `schema` prop defining collection structure
- `AdminList.jsx` — generic table renderer from schema.listColumns
- `AdminForm.jsx` — generic form renderer from schema.fields
- Field components receive value/onChange as props

## Error Handling

### Pattern: SweetAlert2
```js
import Swal from 'sweetalert2';

// Success
Swal.fire({ icon: 'success', title: '¡Solicitud enviada!' });

// Error
Swal.fire({ icon: 'error', title: 'Error', text: 'Ocurrió un problema...' });

// Confirmation
Swal.fire({ icon: 'warning', title: '¿Estás seguro?', showCancelButton: true });
```

### Pattern: try/catch with silent fail
```js
try {
  // operation
} catch {
  // fail silently or show Swal
}
```

### Pattern: Error state variable
```js
const [error, setError] = useState(null);
// ...
if (error) return <div>Error: {error}</div>;
```

## Loading States

### Pattern: Boolean loading flag
```js
const [loading, setLoading] = useState(true);
// ...
if (loading) return <Skeleton />;
```

## Image Handling

### Fallback on error
```js
// src/utils/imgFallback.js
export const handleImgFallback = (fallbackSrc) => (e) => {
  e.target.src = fallbackSrc;
};

export const hideImgOnError = (e) => {
  e.target.style.display = 'none';
};
```

### Lazy loading
```jsx
<img loading="lazy" decoding="async" onError={handleImgFallback(fallbackSrc)} />
```

## Form Handling

- **No form library** — raw `useState` with manual `handleChange`
- Each form field is a controlled component
- Validation: manual checks before submit
- Admin form auto-generates `orden` field for sortable collections

## State Management

- **No global state library** (no Redux, Zustand, Context API)
- **Module-level cache** for properties data
- Admin uses local `useState` per page
- No prop drilling beyond 1-2 levels

## CSS Conventions

- **Tailwind utility classes** for 90% of styling
- **Tailwind config**: minimal customization (no custom theme extensions)
- **styled-components**: used only in Social.jsx for hover animations
- **CSS files**: minimal global rules in `App.css` and `index.css`
