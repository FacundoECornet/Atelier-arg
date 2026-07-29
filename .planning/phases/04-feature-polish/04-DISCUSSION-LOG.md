# Phase 04 — Discussion Log

**Date:** 2026-07-29
**Mode:** discuss (standard)
**Areas discussed:** 4/4

## Area 1: Team Member Modal Behavior

| Field | Value |
|-------|-------|
| Question 1 | What content should the modal include beyond the card? |
| Options | Full description + photo + Contact button / Full description + photo + WhatsApp button / Minimal: just email button overlaid |
| Selected | Full description + photo + Contact button |
| Decision | D-01: Centered overlay modal. D-02: mailto email CTA. |

| Field | Value |
|-------|-------|
| Question 2 | Modal overlay or inline expansion? |
| Options | Centered overlay modal with CTA button / Inline expansion in the card grid |
| Selected | Centered overlay modal with CTA button |
| Decision | D-01: Match existing Tasación modal pattern (black/40 overlay, centered white container, × close). |

## Area 2: Property Sorting UX

| Field | Value |
|-------|-------|
| Question | Automatic sort or user-controllable toggle? |
| Options | Automatic sort, no controls / Sort control with newest/oldest toggle |
| Selected | Sort control with newest/oldest toggle |
| Decision | D-05: Add dropdown next to provincia filter. D-06: Sort by fechaIngreso. Requires Firestore composite index. |

## Area 3: JSON-LD Structured Data Scope

| Field | Value |
|-------|-------|
| Question | What property data to include in schema.org/RealEstateListing? |
| Options | Core data only / Full property data |
| Selected | Core data only |
| Decision | D-07: Price, currency, location (address/geo), name, URL, main image, description. No floor area, rooms, or bathrooms. |

## Area 4: Lazy Loading Fallback UX

| Field | Value |
|-------|-------|
| Question | What fallback UI while lazy components load? |
| Options | Spinner / Skeleton placeholder / None |
| Selected | Spinner — same as admin |
| Decision | D-08: Centered "Cargando..." text spinner. D-09: Modal.jsx loads on button click. D-10: Blog routes use existing pattern with lazy() + Suspense. |

## Deferred Ideas

None — all discussion stayed within phase scope.

## the agent's Discretion

- Modal close animation style
- Email button exact styling (per UI-SPEC accent rules)
- Sort toggle implementation approach (match existing provincia select)
- Default sort state indicator
- Firestore composite index instructions

---

*Discussion completed: 2026-07-29*
