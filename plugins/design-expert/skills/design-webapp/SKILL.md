---
name: design-webapp
description: "Logged-in web apps — dashboards, auth flows, settings, onboarding, data tables, command palettes, modals, toasts. Density and state coverage matter more here than marketing polish."
when-to-use: "Building or extending a dashboard, SaaS product screen, or any authenticated app surface (not a marketing site — see design-web for that)."
keywords: webapp, dashboard, density, states, data-table, auth, settings, onboarding
priority: critical
related: design-method, design-system, design-web, design-motion, design-review
---

## Design Webapp — Dashboards, Density, States

### When
After `design-system` tokens exist. Read `design-method`'s routing table first — if the
surface is a marketing/landing page instead, use `design-web`.

### Input
- `design-system.md` — OKLCH palette, typography, spacing density, the 3 dials.
- The specific page/pattern being built (dashboard, auth, settings, data table, etc.).

### Steps

1. **Pick the page pattern** from `references/layouts/pages/` — dashboard, auth-login,
   auth-register, onboarding, profile, settings, error-pages. Each is a starting
   structure, not a template to copy verbatim — adapt to the density from
   `design-system.md`.
2. **Pick the interaction pattern(s)** from `references/layouts/patterns/` — data-table,
   command-palette, modal-dialog, toast-notifications, empty-state. Apps lean on these far
   more than marketing sites do.
3. **Apply the responsive shell** from `references/responsive-dashboard.md` — sidebar
   behavior across breakpoints (full at desktop, icon-rail at tablet, hamburger at mobile).
4. **Reuse general component guides from `design-web`** (buttons, forms, cards, grids,
   icons) rather than duplicating them — this skill only adds what's specific to apps:
   density, data-heavy states, and persistent navigation.
5. **Cover every state explicitly**: empty, loading (skeleton, not spinner-only — see
   `design-web/references/`), error, populated, and — for data tables specifically —
   sorting/filtering/pagination states.
6. **No inspiration browsing here** — apps are function-first; skip the fuse-browser step
   entirely. If visual inspiration is needed for a marketing-adjacent app surface
   (pricing page inside the app, say), route that specific page through `design-web`.
7. **Generate directly as HTML/CSS** (default), or optionally via Gemini Design MCP
   (`design-web/references/gemini/`) — same brief content either way.

### Failure Handling
- Gemini Design MCP (if chosen) unavailable → fall back to direct generation.
- A referenced page pattern doesn't fit the request → adapt the closest one rather than
  inventing an unstructured layout; note the deviation in the output report.

### Output
- HTML/CSS for the app surface, with every interaction state covered.
- Responsive shell verified across the size classes in `responsive-dashboard.md`.
- Ready for `design-motion`.

### Next → `design-motion`, then `design-review`.

### References
| File | Purpose |
|------|---------|
| `references/responsive-dashboard.md` | Sidebar + content responsive pattern |
| `references/layouts/pages/dashboard.md` | Dashboard page structure |
| `references/layouts/pages/auth-login.md` | Login page structure |
| `references/layouts/pages/auth-register.md` | Registration page structure |
| `references/layouts/pages/onboarding.md` | Onboarding flow structure |
| `references/layouts/pages/profile.md` | Profile page structure |
| `references/layouts/pages/settings.md` | Settings page structure |
| `references/layouts/pages/error-pages.md` | 404/500/error page structure |
| `references/layouts/patterns/data-table.md` | Sortable/filterable table pattern |
| `references/layouts/patterns/command-palette.md` | Cmd-K palette pattern |
| `references/layouts/patterns/modal-dialog.md` | Modal/dialog pattern |
| `references/layouts/patterns/toast-notifications.md` | Toast/notification pattern |
| `references/layouts/patterns/empty-state.md` | Empty-state pattern |

### Shared with design-web (load from there, don't duplicate)
| File | Purpose |
|------|---------|
| `../design-web/references/buttons-guide.md` | Button states, sizing |
| `../design-web/references/forms-guide.md` | Validation, layout |
| `../design-web/references/cards-guide.md` | Card patterns |
| `../design-web/references/grids-layout.md` | Layout/grid system |
| `../design-web/references/icons-guide.md` | Icon usage |
| `../design-web/references/gemini/` | Optional Gemini Design MCP path |
