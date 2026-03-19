---
name: design-component
description: "Generate a single component. Skips browsing. Uses existing design-system.md tokens + Gemini snippet_frontend. Fast path for isolated UI elements."
---

# /design:component — Single Component (Phases 3→6)

Generate a single UI component using existing design tokens.

## Usage

```
/design:component pricing card with 3 tiers
/design:component testimonial carousel
/design:component newsletter signup form
/design:component stats counter section
```

## Prerequisites

- design-system.md must exist at project root
- If missing, use /design instead

## Workflow

1. **Read design-system.md** completely. Extract OKLCH tokens, typography pair, spacing scale, and forbidden patterns. This is your single source of truth.

2. **Search inspiration**: Use `mcp__magic__21st_magic_component_inspiration` to find similar components. Or `mcp__shadcn__search_items_in_registries` for shadcn patterns. Do NOT use Playwright browsing — this is a fast path.

3. **Phase 3 — GENERATE**: Build 7 Gemini XML blocks from design-system.md:
   - Identity → aesthetics
   - Reference → style_reference
   - Typography → typography
   - OKLCH → color_system
   - Spacing → spacing
   - (always) → states
   - Forbidden → forbidden

   Call `mcp__gemini-design__snippet_frontend` (not `create_frontend` — this is a component, not a page). Include component variants if applicable (e.g. default, hover, disabled).

4. **Phase 4 — MOTION**: Add micro-interactions via `modify_frontend`:
   - Hover states with scale/opacity transitions
   - Focus rings for interactive elements
   - Entry animations (fade-in, slide-up)
   - Keep motion subtle — components should feel polished, not distracting.

5. **Phase 5 — AUDIT**: Validate the component against design-system.md:
   - Contrast ratios: >= 4.5:1 text, >= 3:1 UI elements
   - Fonts match design-system.md (no Inter, Roboto, Arial, Open Sans, Lato, Poppins)
   - All colors use oklch() — no hex, rgb, hsl
   - States covered: hover, focus, disabled, dark mode
   - No anti-AI-slop patterns (border indicators, purple gradients, emojis)

6. **Phase 6 — REVIEW**: Serve via `python3 -m http.server 8899`. Screenshot the component in isolation (light + dark). Verify visual quality matches design-system.md intent. Report findings.

## FORBIDDEN

- Skipping phases or reordering them
- Writing HTML/CSS manually (use Gemini MCP only)
- Calling Gemini without all 7 XML blocks
- Inter, Roboto, Arial, Open Sans, Lato, Poppins
- Hex, RGB, or HSL color values (OKLCH only)
- Purple-pink gradients
- Emojis in UI (use SVG/Lucide icons)
- Playwright browsing (use 21st.dev/shadcn search instead)
- Creating a new design-system.md (must already exist)
- Skipping light+dark mode validation
