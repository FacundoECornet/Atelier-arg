# Atelier Homes Argentina — Mejoras v1

## What This Is

Sitio web de propiedades (real estate) para Atelier Homes Argentina. Landing page pública con listado de propiedades, equipo, proceso de venta, formulario de contacto, tasación online y panel de administración para gestionar propiedades, noticias y equipo. El sitio existe y funciona — este proyecto agrega funcionalidad, mejora seguridad y limpia deuda técnica sin modificar el diseño visual ni la funcionalidad existente.

## Core Value

El visitante puede explorar propiedades y contactar al equipo de Atelier de forma fluida, mientras que el equipo de Atelier puede gestionar el contenido del sitio de manera segura.

## Context

- **Stack actual:** React 18 (JSX, sin TypeScript), Vite 5, Tailwind 3, Firebase Firestore (3 colecciones: `propiedades`, `Noticias`, `Nosotros`), react-router-dom HashRouter, FormSpree para formularios, Netlify hosting.
- **Estado del código:** ~3,200 líneas, ~30 archivos JSX. Sin tests. Sin autenticación en admin. Reglas de Firestore abiertas (`allow read, write: if true`).
- **Dominio:** Real estate argentino — propiedades con precios en ARS/USD, ubicaciones con mapa (pigeon-maps/OSM), tasación online con geocoding (Nominatim).
- **Deuda técnica documentada:** Ver `.planning/codebase/CONCERNS.md` (16 issues: 3 críticos, 3 altos, 5 medios, 5 bajos).
- **Objetivo del usuario:** Mejoras funcionales + seguridad + limpieza de código + SEO, sin tocar estilo ni funcionalidad actual.

## Requirements

### Validated

- ✓ Landing page con hero carousel, secciones de equipo, proceso, propiedades — existente
- ✓ Listado de propiedades con filtro por provincia — existente
- ✓ Detalle de propiedad con galería y lightbox — existente
- ✓ Formulario de contacto vía FormSpree — existente
- ✓ Modal de tasación online con wizard de 4 pasos y mapa — existente
- ✓ Panel de administración con CRUD genérico (propiedades, noticias, equipo) — existente
- ✓ Diseño responsive con Tailwind — existente
- ✓ Enlace flotante de WhatsApp — existente

### Active

- [ ] Ordenar propiedades por fecha de ingreso (PAG-01)
- [ ] Descripciones del equipo expandibles (popup/ventana) al hacer click (PAG-02)
- [ ] Botón "Hablemos" en sección equipo con enlace a email (PAG-03)
- [ ] Blog/sección de noticias funcional con editor para Fran (SEO) (SEO-01)
- [ ] Posicionamiento orgánico (SEO) — meta tags, sitemap, estructura semántica (SEO-02)
- [ ] Autenticación en panel de administración (SEG-01)
- [ ] Reglas de Firestore con acceso por autenticación (SEG-02)
- [ ] Protección anti-spam en formularios (CAPTCHA/rate limiting) (SEG-03)
- [ ] Variables de entorno para configuración de Firebase (SEG-04)
- [ ] Limpiar dependencias huérfanas (@dnd-kit) y código muerto (CLN-01)
- [ ] Eliminar `<style jsx>` de Nosotros.jsx (Next.js pattern, no funciona en React) (CLN-02)
- [ ] Estandarizar estilos a Tailwind (remover styled-components de Social.jsx) (CLN-03)
- [ ] Agregar Error Boundaries en secciones principales (CLN-04)
- [ ] Code splitting para componentes públicos grandes (Modal.jsx) (CLN-05)

### Out of Scope

- Cambios de diseño visual o restyling — preservar estilo actual
- Migración a TypeScript — mantener JSX
- Migración a otro framework o CMS — mantener stack actual
- Pasarela de pagos / e-commerce — no es parte del negocio actual
- App mobile — web-first
- Carga de imágenes (upload) — se mantienen URLs externas
- Testing suite completa — fuera del alcance inmediato

## Constraints

- **Stack:** React 18 + Vite 5 + Tailwind 3 + Firebase Firestore — no migrar
- **Estilo:** No modificar diseño visual existente ni funcionalidad actual
- **Idioma:** UI en español, datos en español
- **Hosting:** Netlify (sin cambios en deploy)
- **Seguridad:** Implementar auth sin afectar experiencia pública existente

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Mantener Firebase Firestore | Ya integrado, 3 colecciones activas, sin CMS alternativo | — Pending |
| HashRouter sobre BrowserRouter | Hosting estático sin configuración SPA fallback | ✓ Good |
| Schema-driven admin | Fuente única de verdad para CRUD, menos duplicación | ✓ Good |
| Sin tests previos | MVP rápido, ahora se agrega estabilidad | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-07-22 after initialization*
