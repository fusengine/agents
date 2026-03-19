---
name: Gradient Steps
source: https://financer-wbs.framer.website
sector: Fintech
---

## Gradient Steps

### Visual Walkthrough (top to bottom)
**Nav**: Floating pill navbar, centered, fixed top 16px. Backdrop blur 12px, bg oklch(1 0 0 / 0.85),
radius 999px, shadow 0 4px 20px oklch(0 0 0 / 0.06), z-index 50, height 48px.
Links 0.875rem weight 500 oklch(0.3 0 0), gap 32px. Dark pill CTA right in oklch(0.13 0 0).
**Hero**: 2-column grid (1fr 1fr, gap 48px, padding 80px 64px 60px).
Left: small label "Fintech Template" 0.75rem uppercase oklch(0.5 0 0).
Large serif heading "Crafting the future of fintech." — Playfair Display, clamp(2.5rem, 6vw, 4.5rem),
weight 700, line-height 1.1, letter-spacing -0.02em, oklch(0.13 0 0).
Below heading: green pill badge + dark pill CTA button (oklch 0.13, radius 999px, padding 12px 24px).
Right: relative container with 4-5 floating white UI cards positioned absolutely.
Cards show stats ("$29k"), avatar row, progress ring, growth chart.
Card style: bg oklch(1 0 0), radius 16px, padding 16px 20px, shadow 0 8px 32px oklch(0 0 0 / 0.08).
One card has lime-yellow bg oklch(0.89 0.17 105) with dark text.
**Stats bar**: Flex row, gap 64px, padding 40px 64px, border-top 1px solid oklch(0.88 0 0).
3-4 metrics: number clamp(1.5rem, 3vw, 2.25rem) weight 700 oklch(0.13 0 0), label 0.8125rem oklch(0.5 0 0).
**Steps section**: Heading "How it works" 1.5rem weight 600 centered.
3-column grid (gap 24px, padding 80px 64px). Each step card:
bg oklch(0.97 0.005 90), radius 20px, padding 36px 28px, no border, no shadow.
Oversized number "01" — 3.5rem weight 800 oklch(0.13 0 0) at opacity 0.1 (background texture).
Heading 1.25rem weight 600 oklch(0.13 0 0), margin-top 20px.
Description 0.9375rem line-height 1.65 oklch(0.45 0 0), margin-top 8px.
**Pages showcase**: "Pages" heading centered 2rem weight 700.
4-column grid (gap 16px, padding 80px 64px).
Cards alternate white bg (shadow 0 2px 12px oklch(0 0 0 / 0.04)) and lime-yellow bg oklch(0.89 0.17 105).
Each card: radius 12px, aspect-ratio 3/4, overflow hidden, contains screenshot thumbnail.
**CTA banner**: Dark rounded container: oklch(0.13 0 0), radius 24px, padding 64px, margin 0 64px.
Heading "Get started with Finflow." clamp(1.75rem, 4vw, 2.5rem) weight 700 oklch(0.98 0 0).
Lime pill button: bg oklch(0.89 0.17 105), color oklch(0.13 0 0), padding 14px 32px, radius 999px.
Small portrait photo floats right inside the banner.
**Footer**: bg oklch(0.13 0 0), padding 48px 64px, 4-column grid. Text 0.875rem oklch(0.6 0 0).

### CSS Specifications
- Page bg: `oklch(0.98 0.005 90)` | Accent: `oklch(0.89 0.17 105)` | Dark: `oklch(0.13 0 0)`
- Body text: `oklch(0.45 0 0)` | Muted: `oklch(0.5 0 0)` | Border: `oklch(0.88 0 0)`
- Nav: `fixed; top:16px; backdrop-filter:blur(12px); bg:oklch(1 0 0/0.85); radius:999px; shadow:0 4px 20px oklch(0 0 0/0.06)`
- H1: `Playfair Display serif; clamp(2.5rem,6vw,4.5rem); 700; line-height:1.1; letter-spacing:-0.02em`
- Float cards: `bg:oklch(1 0 0); radius:16px; shadow:0 8px 32px oklch(0 0 0/0.08); padding:16px 20px`
- Steps grid: `repeat(3,1fr); gap:24px` | Card: `bg:oklch(0.97 0.005 90); radius:20px; padding:36px 28px`
- Step number: `3.5rem; 800; opacity:0.1` | Step heading: `1.25rem; 600` | Step desc: `0.9375rem; line-height:1.65`
- Pages: `repeat(4,1fr); gap:16px` | Card: `radius:12px; 3/4` | CTA: `oklch(0.13); radius:24px; padding:64px`
- Button: `bg:oklch(0.89 0.17 105); radius:999px; padding:14px 32px; 600; transition:opacity 0.3s ease`
- Responsive: 1024px hero→1-col | 768px steps→1-col, pages→2-col, CTA margin→24px

### Gemini Context Prompt
Build a fintech template landing page with warm off-white background oklch(0.98 0.005 90)
and lime-yellow accent oklch(0.89 0.17 105).
Start with a floating pill navbar fixed at top 16px, centered, backdrop-filter blur 12px,
white at 85% opacity, border-radius 999px, subtle shadow. Links 0.875rem weight 500 with dark pill CTA right.
Hero is a 2-column grid: left has a small uppercase label then a Playfair Display serif heading
at 4.5rem weight 700 line-height 1.1. Right has 4-5 floating white UI cards (16px radius,
shadow 0 8px 32px at 8% black) positioned absolutely showing stats, avatars, charts.
One card uses lime-yellow background.
Below hero: stats bar (flex, gap 64px, border-top 1px oklch 0.88) with numbers at 2.25rem bold.
Steps: 3-column grid of cards (20px radius, bg oklch 0.97, padding 36px 28px) each with
a huge faded number (3.5rem, opacity 0.1), bold heading, muted description.
Pages showcase: 4-column grid alternating white and lime-yellow cards, 12px radius, 3:4 ratio.
CTA banner: dark rounded container (oklch 0.13, radius 24px) with white heading and lime pill button.
Footer: dark 4-column grid with muted text.

### Anti-patterns (what NOT to do)
- Do not shift lime-yellow hue — must stay ~105 (true chartreuse), not green/orange
- Do not increase step number opacity past 0.1 — they are texture, not content
- Do not omit floating UI cards in hero — they define the fintech product-feel
- Do not use sharp corners — minimum 12px radius everywhere, 20px on step cards, 999px on pills
- Do not add borders or shadows to step cards — they are flat on the off-white canvas
