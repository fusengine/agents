---
name: Alternating Sections
source: https://boxsi-wbs.framer.website
sector: SaaS
---

## Alternating Sections

### What it is
A SaaS landing page with strict dark/light alternating full-width sections. Hard color cuts (no gradients between). Each section has headline + body + visual. SVG dot-grid watermarks at ultra-low opacity. Single warm red-orange accent for CTAs. The hero highlights "AI" with an inline pill.

### When to use
- SaaS/AI product pages with 6+ feature sections needing strong visual rhythm
- Content-heavy pages requiring immediate section separation without dividers
- Products wanting bold, high-contrast editorial feel

### Full Visual Walkthrough (top to bottom)
1. **Nav** (light bg): logo "boxsi" left in `oklch(0.13 0 0)` weight 700 0.9375rem. Links center: 0.8125rem weight 450 `oklch(0.40 0 0)` tracking 0.01em. CTA right: pill `oklch(0.62 0.22 25)` bg, white text, 8px radius, padding 10px 20px. Nav height ~56px, `padding: 14px 48px`
2. **Hero** (light `oklch(0.98 0 0)`): centered. Headline "Create better content with AI in minutes" at `clamp(2.5rem, 5vw, 4rem)` weight 700 tracking -0.035em line-height 1.08 `oklch(0.13 0 0)`. "AI" wrapped in inline pill: `padding: 4px 16px; border-radius: 999px; background: oklch(0.62 0.22 25); color: oklch(0.98 0 0)`. Subtitle below: 1.0625rem `oklch(0.42 0 0)` line-height 1.65 max-width 520px centered. CTA row: primary red-orange + ghost button. Padding: 120px 72px 96px
3. **Features grid** (dark `oklch(0.11 0 0)`): "Powerful features" heading `clamp(1.75rem, 3.5vw, 2.75rem)` weight 700 tracking -0.03em `oklch(0.95 0 0)`. Subhead: 1rem `oklch(0.52 0 0)`. Below: 3-column grid `repeat(3, 1fr)` gap 32px. Each cell: icon 40x40 rounded-full `oklch(0.20 0 0)` bg, title 1rem weight 600, desc 0.875rem `oklch(0.52 0 0)` line-height 1.5. SVG dot-grid watermark at 2.5% opacity `background: radial-gradient(circle, oklch(0.50 0 0) 1px, transparent 1px); background-size: 24px 24px`
4. **Feature detail 1** (light): 2-col grid `1fr 1fr` gap 56px align-items center. Left: section heading + body text + small feature list (checkmark + text). Right: UI screenshot mockup `border-radius: 12px; box-shadow: 0 4px 24px oklch(0 0 0 / 0.10); overflow: hidden`
5. **Feature detail 2** (dark): same 2-col but reversed — screenshot left, text right. Text colors switch: heading `oklch(0.95 0 0)`, body `oklch(0.52 0 0)`
6. **Feature detail 3** (light): same as 4, text left, image right
7. **Social proof** (dark): centered heading, logo row `display: flex; gap: 40px; justify-content: center; align-items: center; opacity: 0.5; filter: brightness(2)` — partner logos in white
8. **Integrations** (light): heading + 4x2 grid of integration cards: `padding: 20px; border-radius: 10px; border: 1px solid oklch(0.90 0 0); bg: oklch(0.99 0 0)`. Icon 32px + name 0.875rem weight 500
9. **Pricing** (dark): "Plans that fit" heading. 2-3 pricing cards side by side: `padding: 40px; border-radius: 16px; border: 1px solid oklch(0.22 0 0); bg: oklch(0.14 0 0)`. Price `clamp(2rem, 3vw, 2.5rem)` weight 700. Featured card: border `oklch(0.62 0.22 25)`, badge "Popular" pill top-right
10. **FAQ** (light): accordion — question 1rem weight 600 `oklch(0.13 0 0)`, chevron right, answer 0.9375rem `oklch(0.42 0 0)`. Border-bottom 1px `oklch(0.90 0 0)` between items
11. **Footer** (dark `oklch(0.09 0 0)`): 4-column grid `repeat(4, 1fr)` gap 32px. Logo + tagline left. Link columns: title 0.8125rem weight 600 `oklch(0.95 0 0)`, links 0.8125rem weight 400 `oklch(0.45 0 0)`. Bottom bar: copyright + social icons. Padding: 64px 72px

### CSS Specifications Summary
- **Dark sections**: `bg: oklch(0.11 0 0); color: oklch(0.95 0 0)` — **Light sections**: `bg: oklch(0.98 0 0); color: oklch(0.13 0 0)`
- **Section padding**: `96px 72px` desktop, `56px 20px` mobile — **Container**: `max-width: 1180px; margin: 0 auto`
- **Accent**: `oklch(0.62 0.22 25)` — buttons, pills, featured card borders
- **CTA button**: `padding: 14px 32px; border-radius: 10px; font-size: 0.9375rem; weight: 600; transition: background 0.2s ease; hover: oklch(0.56 0.22 25)`
- **Ghost button**: same sizing, `border: 1.5px solid oklch(0.30 0 0); bg: transparent`
- **All headings**: weight 700, tracking -0.03em, line-height 1.08-1.12
- **Body text**: 1.0625rem, line-height 1.65, max-width 480px
- **Responsive**: 768px breakpoint — grids stack to 1fr, padding 56px 20px

### Gemini Context Prompt
SaaS landing page with strict alternating dark oklch(0.11 0 0) and light oklch(0.98 0 0) full-width sections — hard cuts, no gradients.
Nav: 56px, logo left, links center 0.8125rem, red-orange CTA pill right oklch(0.62 0.22 25).
Hero (light): centered headline clamp(2.5rem, 5vw, 4rem) weight 700 tracking -0.035em, "AI" in inline pill (999px radius, red-orange bg). Subtitle 1.0625rem oklch(0.42 0 0). Two CTAs.
Features (dark): 3-col icon grid, 32px gap, icons 40px round. Dot-grid SVG watermark 2.5% opacity 24px spacing.
Feature details: alternating 2-col grids (1fr 1fr, 56px gap), text one side, screenshot other side (12px radius, box-shadow 0 4px 24px 10% black). Text/image sides flip each section.
Social proof (dark): centered partner logos at 50% opacity.
Integrations (light): 4x2 card grid, 10px radius, 1px border oklch(0.90 0 0).
Pricing (dark): cards 16px radius, featured card has oklch(0.62 0.22 25) border + "Popular" pill.
FAQ (light): accordion, 1px separators.
Footer (dark oklch(0.09 0 0)): 4-col grid, 64px padding.
All body text 1.0625rem. All CTAs oklch(0.62 0.22 25) 10px radius. Max-width 1180px.

### Anti-patterns (what NOT to do)
- Do not gradient between sections — hard color cuts only
- Do not place two same-bg sections consecutively — strict alternation
- Do not raise SVG watermark above 5% opacity
- Do not use multiple accent colors — single oklch(0.62 0.22 25)
- Do not add section dividers — bg contrast IS the separator
