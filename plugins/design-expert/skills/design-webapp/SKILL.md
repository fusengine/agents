---
name: design-webapp
description: "Logged-in web apps — dashboards, auth flows, settings, onboarding, data tables, command palettes, modals, toasts. Register `product`: density and glance-speed over marketing polish, no hero/CTA-tricks, every data surface covers empty/loading/error explicitly, tables and dataviz follow preattentive-processing rules."
when-to-use: "Building or extending a dashboard, SaaS product screen, or any authenticated app surface (not a marketing site — see design-web for that)."
keywords: webapp, dashboard, density, states, data-table, dataviz, auth, settings, onboarding
priority: critical
related: design-method, design-system, design-web, design-motion, design-review
---

## Design Webapp — Dashboards, Density, States

### When
After `design-system` tokens exist and `design-method`'s Gate 0 has locked register
`product` (dense, predictable, motion stays discreet). Read `design-method`'s routing
table first — if the surface is a marketing/landing page instead, use `design-web`.

### Input
- `design-system.md` — OKLCH palette, typography, spacing density, the 3 dials.
- `design-method/references/register/product.md` — the Domain-Specificity Floor and the
  Product Furniture table (generic KPI ribbon, marketing triad reused in-app, cookie-cutter
  empty state, undifferentiated settings list, generic nav vocabulary).
- The specific page/pattern being built (dashboard, auth, settings, data table, etc.).

### Steps

1. **Register `product` ≠ marketing register.** No hero, no scroll-reveal, no CTA-tricks —
   this register optimizes for glance-speed, not first impression. Density is a feature:
   Enterprise Dense / Standard spacing profile (`design-system/references/spacing-density.md`),
   `MOTION_INTENSITY ≤ 4` by default (`design-motion/references/motion-performance.md`).
   The Focal-Block Floor and Signature Dominance from `design-web` do not apply here
   (`register/product.md` §4) — several equal-weight blocks in one viewport is correct, not
   a defect.

2. **Pick the page pattern** from `references/layouts/pages/` — dashboard, auth-login,
   auth-register, onboarding, profile, settings, error-pages. Each is a starting structure,
   not a template to copy verbatim — adapt density from `design-system.md`, and run the
   Domain-Specificity Floor test on it: would this page's copy/icons/grouping look native
   dropped unedited into an unrelated product in the same category? If yes, it's furniture
   — name the product's real entities instead (`register/product.md` §2-3).

3. **Pick the interaction pattern(s)** from `references/layouts/patterns/` — data-table,
   command-palette, modal-dialog, toast-notifications, empty-state. Apps lean on these far
   more than marketing sites do.

4. **Cover every state explicitly — empty, loading, error, populated.** Never a blank or
   silent default:
   - **Loading** — skeleton rows/cards, never spinner-only (`layouts/patterns/data-table.md`
     — NNG: skeletons perceived 9-12% faster than spinners).
   - **Empty** — name the actual object type and the actual first action ("No invoices yet
     — create one from a quote" beats "No data yet", `register/product.md` §3 Cookie-cutter
     empty state).
   - **Error** — actionable message + retry affordance, never a raw stack trace or generic
     "Something went wrong."
   - For data tables specifically, this extends to sorting/filtering/pagination states.

5. **Tables (hard rules, `layouts/patterns/data-table.md`):** first column is a readable
   identifier (not a raw ID/UUID), numeric columns right-aligned, header sticky on scroll,
   wrap content rather than truncate where legibility matters, density is a first-class
   mode (standard 48dp row / dense 36dp row — Material 3 baseline), mobile falls back to
   horizontal scroll with a sticky first column.

6. **Dataviz:** prefer bar/line charts over pie — preattentive processing reads
   magnitude/trend faster than angle/area. Color encodes data, never decorates; keep
   category → color mapping consistent across every chart on the same surface
   (`layouts/pages/dashboard.md` — F-pattern placement for the North Star metric still
   applies).

7. **Forms: one column, label above the field, inline validation** — reuse
   `../design-web/references/forms-guide.md` rather than duplicating form rules here; this
   skill only adds the product-register defaults (single column over multi-column, no
   marketing-style floating labels).

8. **Command palette (if present):** keyboard shortcuts are optional and revealed only
   after the user has triggered the action manually at least once — never taught upfront
   as a required interaction (`layouts/patterns/command-palette.md`).

9. **Apply the responsive shell** from `references/responsive-dashboard.md` — sidebar
   behavior across breakpoints (full at desktop, icon-rail at tablet, hamburger at mobile).

10. **Reuse general component guides from `design-web`** (buttons, cards, grids, icons)
    rather than duplicating them — this skill only adds what's specific to apps: density,
    data-heavy states, and persistent navigation.

11. **No inspiration browsing here** — apps are function-first; skip the fuse-browser step
    entirely. If visual inspiration is needed for a marketing-adjacent app surface (e.g. a
    pricing page inside the app), route that specific page through `design-web` instead.

12. **Generate directly as HTML/CSS** (default), or optionally via Gemini Design MCP
    (`../design-web/references/gemini/`) — same brief content either way.

### Failure Handling
- Gemini Design MCP (if chosen) unavailable → fall back to direct generation.
- A referenced page pattern doesn't fit the request → adapt the closest one rather than
  inventing an unstructured layout; note the deviation in the output report.
- A data surface has no obvious empty/error copy yet → block on that, don't ship a silent
  blank state; ask the owner for the real object name/action if it isn't in the brief.

### Output
- HTML/CSS for the app surface, with every interaction state covered (step 4) and table/
  dataviz hard rules applied (steps 5-6).
- Responsive shell verified across the size classes in `responsive-dashboard.md`.
- Ready for `design-motion`.

### Next → `design-motion`, then `design-review`.

### References
| File | Purpose |
|------|---------|
| `references/responsive-dashboard.md` | Sidebar + content responsive pattern |
| `references/layouts/pages/dashboard.md` | Dashboard page structure, F-pattern KPI placement |
| `references/layouts/pages/auth-login.md` | Login page structure |
| `references/layouts/pages/auth-register.md` | Registration page structure |
| `references/layouts/pages/onboarding.md` | Onboarding flow structure |
| `references/layouts/pages/profile.md` | Profile page structure |
| `references/layouts/pages/settings.md` | Settings page structure |
| `references/layouts/pages/error-pages.md` | 404/500/error page structure |
| `references/layouts/patterns/data-table.md` | Sortable/filterable table pattern, density tokens |
| `references/layouts/patterns/command-palette.md` | Cmd-K palette pattern |
| `references/layouts/patterns/modal-dialog.md` | Modal/dialog pattern |
| `references/layouts/patterns/toast-notifications.md` | Toast/notification pattern |
| `references/layouts/patterns/empty-state.md` | Empty-state pattern |
| `../design-method/references/register/product.md` | Domain-Specificity Floor, Product Furniture table |

### Shared with design-web (load from there, don't duplicate)
| File | Purpose |
|------|---------|
| `../design-web/references/buttons-guide.md` | Button states, sizing |
| `../design-web/references/forms-guide.md` | Validation, layout |
| `../design-web/references/cards-guide.md` | Card patterns |
| `../design-web/references/grids-layout.md` | Layout/grid system |
| `../design-web/references/icons-guide.md` | Icon usage |
| `../design-web/references/gemini/` | Optional Gemini Design MCP path |
