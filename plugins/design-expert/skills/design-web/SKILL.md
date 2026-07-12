---
name: design-web
description: "Marketing sites and landing pages — inspiration browsing, component generation, premium layout patterns, and hard layout-discipline rules. The browsing step only runs in FULL/PAGE scope, never for a single component."
when-to-use: "Building or extending a marketing site, landing page, or standalone web component (not a logged-in app — see design-webapp for that)."
keywords: web, landing, marketing, components, browsing, layout, premium-patterns
priority: critical
related: design-method, design-system, design-motion, design-review
---

## Design Web — Marketing Sites and Landing Pages

### When
After `design-system` tokens exist (or are being built alongside, in FULL scope). Read
`design-method`'s routing table first to confirm this is the right target skill.

### Input
- `design-system.md` — OKLCH palette, typography, motion personality, the 3 dials.
- The scope from `design-method`: FULL (4 sites), PAGE (2 sites), or COMPONENT (0 sites).

### Steps

1. **Browse inspiration** (FULL/PAGE scope only — skip entirely for COMPONENT):
   Read `references/design-inspiration.md` + `references/design-inspiration-urls.md`,
   pick sector-matched URLs from `KNOWN_DOMAINS`. One `browser_open` session, reused for
   all sites: `browser_navigate` → `browser_scroll(to:"end")` → wait 5s →
   `browser_scroll(deltaY:-100000)` → wait 2s → `browser_screenshot(fullPage:true)`.
   Write 5 CSS-precise observations per screenshot (exact `oklch()` values, `clamp()`
   font sizes, grid ratios, border-radius/shadow/blur values, section padding in px —
   never vague descriptions). Declare: "Site choisi: {URL}. Je reproduis: {el1}, {el2},
   {el3}."
2. **Apply the Phase-0 dials while observing**: vary composition (≥ 3 distinct anchors,
   scaled by `DESIGN_VARIANCE`), one corner-radius scale for the whole page, one theme
   with no accidental mid-scroll flips.
3. **Pick 2-3 premium patterns** from `references/premium-patterns/PATTERNS.md` matching
   the sector; read their `description.md` and copy the "AI Generation Prompt" section.
4. **Read the hard constraints** in `references/layout-discipline.md` — hero numbers,
   eyebrow restraint, zigzag cap, bento cell count, section-repetition ban, CTA/density
   limits. These are non-negotiable numeric limits, not style hints — verify them
   mechanically in the output, not by eye.
5. **Generate directly as HTML/CSS** (default) following `design-method`'s two-pass
   process, using `references/component-composition-ref.md` and `references/layouts/`
   (navigation, page-architecture) for structure. Optional: route through Gemini Design
   MCP (`references/gemini/`) instead — same brief content, different tool.
6. **Add variants** per `references/component-variants-ref.md` (size, state, color).
7. **Search inspiration tools if useful**: `references/21st-dev.md` (Magic MCP) or
   `references/shadcn.md` (shadcn MCP) — optional, never a requirement.

### Failure Handling
- Inspiration site unreachable or blocked → pick an alternate URL from the same sector in
  `design-inspiration-urls.md`; continue if ≥ 2 sites succeeded, otherwise report and stop.
- Gemini Design MCP (if chosen) unavailable or degraded → fall back to direct generation;
  never block on it.

### Output
- HTML/CSS generated matching `design-system.md` identity and the layout-discipline rules.
- Variants defined, page/section layouts composed.
- Ready for `design-motion`.

### Next → `design-motion`, then `design-review`.

### References
| File | Purpose |
|------|---------|
| `references/layout-discipline.md` | **Hard numeric layout rules — load before every generation call** |
| `references/design-inspiration.md` | Browsing methodology (FULL/PAGE scope only) |
| `references/design-inspiration-urls.md` | Sector-matched URL catalog |
| `references/premium-patterns/PATTERNS.md` | 10 premium patterns with CSS specs + AI generation prompts |
| `references/component-composition-ref.md` | Composition patterns |
| `references/component-variants-ref.md` | Variant patterns (size/state/color) |
| `references/layouts/page-architecture.md` | Page-level structure |
| `references/layouts/navigation/` | Navbar, footer, sidebar, mobile-nav |
| `references/templates/` | Hero, pricing, feature-grid, FAQ, contact-form, stats, testimonial |
| `references/reference-index.md` | Full index of every reference in this skill |
| `references/gemini/` | Optional Gemini Design MCP path (never required) |

### Detailed References
| File | Load when … |
|------|------|
| `references/ui-visual-design.md` | Establishing visual design principles (contrast, depth, hierarchy) before generating. |
| `references/design-patterns.md` | Selecting proven UI patterns beyond the premium-patterns set. |
| `references/buttons-guide.md` | Generating button components and variants. |
| `references/forms-guide.md` | Generating form components (inputs, validation, multi-step). |
| `references/cards-guide.md` | Generating card components. |
| `references/grids-layout.md` | Composing grid layouts beyond the `layouts/` templates. |
| `references/icons-guide.md` | Choosing icon sets consistent with the design system. |
| `references/photos-images.md` | Photography/imagery treatment (cropping, overlays, aspect ratio). |
| `references/component-examples.md` | Before/after examples to calibrate output quality. |
| `references/21st-dev.md` | Optional Magic MCP component inspiration search. |
| `references/shadcn.md` | Optional shadcn MCP component library search. |
