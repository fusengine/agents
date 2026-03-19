---
name: Hero Badge Inline
source: https://agenza-wbs.framer.website
sector: Agency
---

## Hero Badge Inline

### What it is
An agency landing page where the hero uses massive typography with an inline urgency badge and inline icon embedded within the H1. The badge is a green pill ("2 Spots Available") with a pulsing dot. Below the hero, a portfolio bento grid, pricing cards, team photos, FAQ, and a dark CTA footer complete the page. Light tinted background throughout with generous whitespace.

### When to use
- Agency/freelancer pages needing urgency/scarcity in the hero
- Design-focused brands where typography replaces hero imagery
- Service pages combining value proposition + availability signal
- Portfolios wanting bold, editorial first impression

### Full Visual Walkthrough (top to bottom)
1. **Nav** (light): logo "Agenza" left `oklch(0.13 0 0)` 1rem weight 600. Center links: 0.875rem weight 450 `oklch(0.35 0 0)`. Right: dark CTA button `oklch(0.13 0 0)` bg white text, 10px radius, `padding: 10px 24px`. Nav: `padding: 20px 48px; height: ~60px; position: sticky; top: 0; z-index: 50; backdrop-filter: blur(12px); background: oklch(0.97 0.008 260 / 0.85)`
2. **Hero** (light `oklch(0.97 0.008 260)`): left-aligned. H1 "Upgrade Your Brand with Premium Design" spanning 3+ lines at `clamp(2.75rem, 6.5vw, 5rem)` weight 600 tracking -0.04em line-height 1.08 `oklch(0.13 0 0)` max-width 960px. Inside H1: **inline badge** `display: inline-flex; gap: 6px; padding: 6px 16px; border-radius: 999px; background: oklch(0.72 0.16 150); color: oklch(0.13 0 0); font-size: 0.8125rem; weight: 500; vertical-align: baseline; transform: translateY(-4px)` with pulsing dot `width: 6px; height: 6px; border-radius: 50%; bg: oklch(0.35 0.12 150); animation: pulse 2s ease infinite`. **Inline icon**: diamond SVG `44px; vertical-align: middle; margin: 0 6px`. Subtitle: `1.125rem oklch(0.45 0 0) line-height 1.65 max-width 500px margin-top 28px`. CTA row: `flex; gap: 12px; margin-top: 32px`. Primary: `padding: 14px 32px; radius: 10px; bg: oklch(0.13 0 0); color: oklch(0.97 0 0); weight: 600; transition: bg 0.2s`. Secondary: `same padding; radius: 10px; border: 1.5px solid oklch(0.82 0 0); bg: transparent`. Hero padding: `140px 72px 80px`
3. **Social proof strip**: `display: flex; align-items: center; gap: 12px; margin-top: 40px`. Overlapping avatars: `margin-left: -8px; 32px; radius: 50%; border: 2px solid oklch(0.97 0.008 260)`. Text "Trusted by 200+" at 0.8125rem `oklch(0.45 0 0)`
4. **Tagline section** (light): centered text "Get the website you want, without the stress" at `clamp(1.5rem, 2.5vw, 2rem)` weight 500 `oklch(0.13 0 0)` max-width 600px. Padding 80px 72px
5. **Portfolio bento grid**: heading "Smart solutions for your brand" left-aligned at `clamp(1.5rem, 2.5vw, 2rem)` weight 600. Grid: `repeat(3, 1fr)` gap 16px. Cards: `border-radius: 14px; padding: 24px; overflow: hidden`. Different bg colors: dark blue `oklch(0.25 0.05 270)`, green `oklch(0.55 0.18 150)`, gold `oklch(0.75 0.12 80)`, dark `oklch(0.14 0 0)`. Each card: project screenshot, category tag pill `padding: 4px 10px; radius: 999px; bg: oklch(0 0 0 / 0.2); color: oklch(0.95 0 0); font-size: 0.6875rem`
6. **Stats row**: 3-column. Numbers "22+" etc at `clamp(2rem, 3.5vw, 3rem)` weight 700 `oklch(0.13 0 0)`. Labels 0.8125rem `oklch(0.45 0 0)`
7. **Pricing** (light): "Flexible pricing plans" centered `clamp(1.75rem, 3vw, 2.5rem)` weight 600. Cards side by side: `padding: 36px; radius: 16px; border: 1px solid oklch(0.90 0 0); bg: oklch(0.99 0 0)`. Price `clamp(1.75rem, 2.5vw, 2.25rem)` weight 700. Featured card: `border: 2px solid oklch(0.13 0 0)`. CTA inside: full-width button
8. **Team** (light): heading + 4-col grid. Round headshots 80px, name 0.9375rem weight 600, role 0.8125rem `oklch(0.45 0 0)`
9. **FAQ** (light): "Got questions?" heading. Accordion: `border: 1px solid oklch(0.90 0 0); radius: 12px; padding: 20px 24px; margin-bottom: 8px`. Question 0.9375rem weight 600, chevron right. Open state: answer 0.875rem `oklch(0.45 0 0)` line-height 1.6
10. **Footer** (dark `oklch(0.12 0 0)`): "Ready to build something amazing?" at `clamp(1.5rem, 2.5vw, 2rem)` weight 600 `oklch(0.95 0 0)`. CTA button. Below: 3-col links grid. Copyright bar bottom. Padding 80px 72px

### CSS Specifications Summary
- **Page bg**: `oklch(0.97 0.008 260)` — **Footer bg**: `oklch(0.12 0 0)`
- **Container**: `max-width: 1200px; margin: 0 auto`
- **Section spacing**: 80-140px vertical padding
- **Primary text**: `oklch(0.13 0 0)` — **Secondary**: `oklch(0.45 0 0)` — **Badge**: `oklch(0.72 0.16 150)` green
- **Buttons**: radius 10px, padding 14px 32px, weight 600, transition 0.2s
- **Cards**: radius 14-16px, border 1px `oklch(0.90 0 0)`
- **Responsive**: 768px: grids 1-2col, hero H1 scales via clamp, badge wraps below 640px, nav hamburger

### Gemini Context Prompt
Agency landing page on oklch(0.97 0.008 260) light lavender bg. Max-width 1200px.
Sticky nav 60px: logo left, centered links 0.875rem, dark CTA right, backdrop-filter blur(12px) on scroll.
Hero left-aligned: H1 clamp(2.75rem, 6.5vw, 5rem) weight 600 tracking -0.04em oklch(0.13 0 0). Embed INLINE in H1: green pill badge (oklch(0.72 0.16 150), 999px radius, 6px 16px padding, 0.8125rem, pulsing 6px dot) + 44px diamond icon. Subtitle 1.125rem oklch(0.45 0 0) max-width 500px. Two CTAs: primary dark 10px radius, secondary outlined.
Avatar strip: 32px overlapping circles with "Trusted by 200+".
Tagline section centered.
Portfolio bento grid: 3-col, colored card bgs (dark blue, green, gold, black), 14px radius, project screenshots, category pills.
Stats: 3-col large numbers.
Pricing: 2 cards, 16px radius, featured card 2px dark border.
Team: 4-col, 80px round headshots.
FAQ: accordion cards 12px radius.
Dark footer oklch(0.12 0 0): CTA heading + links grid.

### Anti-patterns (what NOT to do)
- Do not place badge outside H1 — must be inline in text flow
- Do not use more than one badge — scarcity requires singularity
- Do not make inline icon larger than H1 cap-height
- Do not add hero image — typography IS the visual
- Do not center the hero layout — left-aligned only
