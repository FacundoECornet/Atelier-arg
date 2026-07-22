# Integrations: Atelier Homes Argentina

**Date:** 2026-07-22
**Focus:** External APIs, databases, auth providers, webhooks

## Database

### Firebase Firestore
- **Project:** `atelierhomesarg` (Firebase project ID)
- **SDK:** `firebase/firestore` v10.7.1
- **Config:** Hardcoded in `src/Firebase.js` (apiKey, authDomain, projectId, etc.)
- **Collections:**
  - `propiedades` — Property listings with fields: Nombre, codigo, ubicacion, ubicURL, precio, estado, caracteristicas, img, galeria (URL array), orden
  - `Noticias` — News articles with fields: titulo, descripcion, img, url
  - `Nosotros` — Team members with fields: nombre, cargo, descripcion, img
- **Security:** Wide open — `allow read, write: if true`
- **Indexes:** None defined (`firestore.indexes.json` empty)

## External APIs

### FormSpree
- **Contact form:** `https://formspree.io/f/xdkdwpae` (in `src/Componentes/Contacto.jsx`)
- **Valuation form:** `https://formspree.io/f/xrblyoez` (in `src/Componentes/Modal.jsx`)
- **Method:** POST JSON, Accept JSON
- **No auth tokens stored in code** (FormSpree form IDs are public)

### OpenStreetMap / Nominatim
- **Geocoding:** `https://nominatim.openstreetmap.org/search?format=json&q=...`
- **Reverse geocoding:** `https://nominatim.openstreetmap.org/reverse?format=json&lat=...&lon=...`
- **Usage:** Address autocomplete + map click location lookup in valuation modal
- **Usage pattern:** Debounced at 500ms, no API key required

### WhatsApp
- **Link:** `https://wa.me/5493812105720`
- **Usage:** Floating contact button + property consultation links

### Social Media
- Facebook link (footer)
- Instagram link (footer)

## External Assets

### Image Hosting
- All images are external URLs (no Firebase Storage)
- **Wix static CDN** hosts the logo (`https://static.wixstatic.com/...`)
- Property images hosted on external URLs (likely uploaded manually or via Wix)

## Absent Integrations

| Integration | Status | Notes |
|------------|--------|-------|
| Authentication | Not implemented | Firestore wide open, admin panel unprotected |
| Image upload | Not implemented | All images via external URLs |
| Payment processing | Not implemented | No e-commerce functionality |
| Email service | Via FormSpree only | No dedicated email API (SendGrid, etc.) |
| CMS | None | Admin panel is custom, not headless CMS |
