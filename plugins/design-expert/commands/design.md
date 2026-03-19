---
name: design
description: "Full design pipeline: Identity → Research → System → Generate → Motion → Audit → Review. Generates production-ready HTML/CSS via Gemini Design MCP with OKLCH tokens, approved typography, and Playwright-driven inspiration."
---

# /design — Full Design Pipeline (Phases 0→6)

Generate a complete design from scratch. Use when no design-system.md exists or for a full redesign.

## Usage

```
/design hero section for fintech startup
/design landing page for physiotherapy clinic
/design pricing page with dark mode
```

## Workflow

1. **Read .design-state.json** to check current phase. If absent, pipeline starts at Phase 0.

2. **Phase 0 — IDENTITY**: Read skills/0-identity-system/SKILL.md. Pick sector template (creative/fintech/ecommerce/devtool). Generate OKLCH palette with chroma > 0.05. Pick approved typography pair (never Inter/Roboto/Arial). Define spacing base unit + motion profile.

3. **Phase 1 — RESEARCH**: Read skills/1-designing-systems/references/design-inspiration.md + design-inspiration-urls.md. Browse 4 sites via Playwright:
   - For each site: browser_navigate → browser_evaluate(scrollTo bottom) → wait 5s → scrollTo top → wait 2s → browser_take_screenshot(fullPage: true)
   - Write 5 observations per screenshot: (1) dominant+accent color (2) typography hierarchy (3) layout density (4) visual effects (5) section structure
   - After 4 sites: declare "Site choisi: {URL}. Je reproduis: {el1}, {el2}, {el3}" — pick 3 visually distinctive elements

4. **Phase 2 — SYSTEM**: Create design-system.md at project root from sector template. Fill: Identity table, OKLCH tokens (hue ±15°), typography pair, spacing, motion profile. Add ## Design Reference section with URL + why + 3 elements.

5. **Phase 3 — GENERATE**: Map design-system.md to 7 Gemini XML blocks:
   - Identity → `<aesthetics>`, Reference → `<style_reference>`, Typography → `<typography>`
   - OKLCH → `<color_system>`, Spacing → `<spacing>`, (always) → `<states>`, Forbidden → `<forbidden>`
   - Call mcp__gemini-design__create_frontend with ALL 7 blocks

6. **Phase 4 — MOTION**: Call mcp__gemini-design__modify_frontend to add Framer Motion scroll reveals (IntersectionObserver), hover scale/opacity transitions, focus ring states, loading skeletons.

7. **Phase 5 — AUDIT**: Verify contrast >= 4.5:1 text / 3:1 UI in both modes. Check no forbidden fonts. Confirm all colors are OKLCH from design-system.md. Validate all states (hover/focus/disabled/loading). Run anti-AI-slop checklist.

8. **Phase 6 — REVIEW**: python3 -m http.server 8899 → screenshot light (fullPage) → toggle .dark → screenshot dark. Compare 3 declared elements [expected vs present]. Fix gaps with modify_frontend (max 2 cycles). Report to team-lead.

## FORBIDDEN

Skipping phases · Manual HTML/CSS · Gemini without 7 XML blocks · Inter/Roboto/Arial · No light+dark · Hex/RGB colors · Purple gradients · Emojis
