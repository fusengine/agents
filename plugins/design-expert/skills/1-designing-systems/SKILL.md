---
name: designing-systems
description: "Phase 1: Browse 4 catalog sites via Playwright, write CSS-precise observations (oklch values, font-size clamp, grid ratios, border-radius, shadows), declare reference site + 3 elements. Feed specs to Gemini context."
phase: 1
---

## Phase 1: RESEARCH — Browse, observe, extract CSS specs

### When
After Phase 0 identity templates are read. Before writing design-system.md.

### Input (from Phase 0)
- Sector identified (creative/fintech/ecommerce/devtool/health)
- Typography pair chosen, OKLCH palette direction known

### Steps
1. **Read inspiration catalog** — `references/design-inspiration.md` + `references/design-inspiration-urls.md`
2. **Pick 4 URLs** from catalog matching the project sector (MUST be from KNOWN_DOMAINS)
3. **Browse each site** via Playwright:
   - `browser_navigate` → URL
   - `browser_evaluate` → `window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'})`
   - Wait 5s → scroll back to top → wait 2s
   - `browser_take_screenshot` fullPage: true
4. **Write 5 CSS-precise observations** per screenshot (NOT vague descriptions):
   - (1) Colors: exact oklch() values for primary, accent, background, text
   - (2) Typography: font-family name, font-size as clamp(min, preferred, max), font-weight
   - (3) Layout: grid/flex structure with column ratios (60/40, 1fr/1fr), gap in px
   - (4) Effects: border-radius in px, box-shadow values, backdrop-blur, opacity
   - (5) Spacing: section padding in px, margin between elements, max-width
5. **Declare reference** — "Site choisi: {URL}. Je reproduis: {el1}, {el2}, {el3}"
   Pick 3 visually distinctive elements with their CSS specs.

### Output
- 4 fullPage screenshots taken (state: screenshots_count >= 4)
- 20 CSS-precise observations (5 per site)
- 1 reference site declared with 3 elements to reproduce
- Ready to write design-system.md (Phase 2)

### Next → Phase 2: UX COPY
`2-ux-copy/SKILL.md` — Define voice, tone, and microcopy patterns.

### References
| File | Purpose |
|------|---------|
| `references/design-inspiration.md` | Browsing methodology and observation format |
| `references/design-inspiration-urls.md` | Catalog of sector-matched inspiration URLs |
| `references/color-system.md` | OKLCH palette generation |
| `references/typography.md` | Font scale and pairings |
| `references/ui-hierarchy.md` | Visual hierarchy patterns |
| `references/ui-spacing.md` | Spacing systems |
