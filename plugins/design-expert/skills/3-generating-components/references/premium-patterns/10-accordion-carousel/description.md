---
name: Accordion Carousel
source: https://b2bizz-wbs.framer.website
sector: B2B
---

## Accordion Carousel

### Visual Walkthrough (top to bottom)
**Nav**: Dark bg, padding 16px 64px. Logo "B2bizz" left 1rem weight 600 oklch(0.9 0 0).
Links 0.875rem oklch(0.6 0.01 70). Right: gold pill CTA bg oklch(0.75 0.1 70), oklch(0.1) text.
**Hero**: bg oklch(0.1 0.01 70), padding 140px 64px 80px, position relative.
Cinematic gradient glow: absolute, top -100px, 140% width, 600px height.
radial-gradient(ellipse at 50% 0%, oklch(0.35 0.1 70 / 0.45), oklch(0.22 0.06 60 / 0.2) 35%,
transparent 65%). Heading "Built for B2B, focused on results." — clamp(2.5rem, 5.5vw, 4rem)
weight 700 line-height 1.15 oklch(0.93 0 0), letter-spacing -0.02em, max-width 560px.
**Filter bar**: Flex row, gap 8px. Pill buttons: padding 8px 20px, radius 999px,
border 1px oklch(0.25 0.01 70), 0.8125rem weight 500 oklch(0.7 0.01 70).
Active: bg oklch(0.75 0.1 70), color oklch(0.1 0 0), border transparent. Hover: border oklch(0.4).
**Content block**: 2-col layout. Left: heading + body 1.0625rem oklch(0.58 0.01 70).
Right: screenshot card — radius 12px, shadow 0 12px 40px oklch(0 0 0 / 0.4), border 1px oklch(0.2).
**Industry row**: 6 small image cards (radius 12px, 1:1, bg oklch 0.14, border 1px oklch 0.2).
Icon badges: 48px circle border 1px oklch(0.25), icon 20px oklch(0.75 0.1 70), label 0.75rem oklch(0.55).
**Accordion** (KEY): Heading clamp(1.75rem, 3.5vw, 2.5rem) weight 700 oklch(0.93 0 0).
Container max-width 800px. Items: border-bottom 1px oklch(0.2 0.01 70).
Trigger: flex between, padding 24px 0. Title 1.1875rem weight 600 oklch(0.9 0 0).
Icon: 28px circle, 1px border oklch(0.3 0.01 70), "+" in 1.125rem weight 300 oklch(0.7 0 0).
On open: icon rotates 45deg, bg fills oklch(0.75 0.1 70), border matches,
"+" color → oklch(0.1 0 0). All transitions 0.35s ease.
Body: max-height 0→180px, transition 0.45s cubic-bezier(0.4, 0, 0.2, 1).
Text 0.9375rem/1.7 oklch(0.55 0.01 70), max-width 600px. Single-open behavior only.
**Carousel** (KEY): Horizontal snap-scroll container.
Flex, gap 20px, overflow-x auto, scroll-snap-type x mandatory, padding 48px 0 24px.
Scrollbar: thin 4px, thumb oklch(0.3 0.01 70) radius 2px.
Cards: 340px fixed width, radius 16px, bg oklch(0.14 0.01 70), border 1px oklch(0.2 0.01 70),
scroll-snap-align start, hover border oklch(0.35). Image: 16/10 cover.
Body: padding 20px 24px. Tag: 0.75rem weight 500 oklch(0.75 0.1 70) uppercase letter-spacing 0.06em.
Title: 1rem weight 600 oklch(0.9 0 0). Text: 0.875rem/1.6 oklch(0.55 0.01 70).
**Stats**: "Proven performance. Measurable results." 2 large numbers inline.
**Method**: 3-col grid, gap 32px. Number: 2.5rem weight 800 oklch(0.75 0.1 70).
Title: 1.125rem weight 600 oklch(0.9 0 0). Desc: 0.875rem oklch(0.55 0.01 70).
**CTA card**: linear-gradient(135deg, oklch(0.25 0.08 30), oklch(0.18 0.06 50)),
radius 20px, padding 64px, border 1px oklch(0.3 0.04 40). Heading clamp(1.5rem, 3vw, 2rem)
weight 700 oklch(0.93). White pill button: oklch(0.93) bg, oklch(0.1) text, 999px, 14px 32px.
**Footer**: padding 48px 64px, border-top 1px oklch(0.15), flex between, 0.8125rem oklch(0.5).

### CSS Specifications
- Palette: bg `oklch(0.1 0.01 70)` | surface `oklch(0.14 0.01 70)` | border `oklch(0.2 0.01 70)`
- Text `oklch(0.9)` | body `oklch(0.58 0.01 70)` | gold `oklch(0.75 0.1 70)` | bright `oklch(0.82 0.12 65)`
- Glow: `radial-gradient(ellipse 50% 0%, oklch(0.35 0.1 70/0.45), oklch(0.22 0.06 60/0.2) 35%, transparent 65%)`
- Accordion icon: `28px circle; border 1px oklch(0.3); transition 0.35s` | Open: `rotate(45deg); bg oklch(0.75 0.1 70)`
- Accordion body: `max-height 0→180px; 0.45s cubic-bezier(0.4,0,0.2,1)` | Single-open
- Carousel: `flex; gap:20px; snap x mandatory; scrollbar 4px oklch(0.3)`
- Card: `340px; 16px; oklch(0.14); 1px oklch(0.2)` | Tag: `0.75rem oklch(0.75 0.1 70) uppercase`
- Method: `3-col gap 32px` | Number: `2.5rem 800 oklch(0.75 0.1 70)`
- CTA: `gradient 135deg oklch(0.25 0.08 30)→oklch(0.18 0.06 50); 20px; 1px oklch(0.3 0.04 40)`
- Responsive: 768px accordion full-width; carousel→280px; method→1-col; pills wrap

### Gemini Context Prompt
Build a premium dark B2B consultancy page on oklch(0.1 0.01 70) with warm gold accent oklch(0.75 0.1 70).
Dark navbar with gold pill CTA. Hero: 4rem heading weight 700 with cinematic radial gradient glow —
absolute ellipse 140% wide 600px tall, radiating warm amber oklch(0.35 0.1 70) at 45% opacity
from top-center, fading to transparent at 65%.
Pill filter buttons below (999px radius, 1px border oklch 0.25, gold active state).
Content block with embedded screenshot card (12px radius, heavy shadow 0 12px 40px at 40%).
ACCORDION: items with 1px border-bottom oklch(0.2). Trigger: title 1.1875rem weight 600 +
circular "+" icon (28px, 1px border oklch 0.3). On expand: icon rotates 45deg, fills gold,
"+" becomes "x". Body slides via max-height 0.45s cubic-bezier(0.4,0,0.2,1). Single-open only.
CAROUSEL: horizontal snap-scroll cards 340px wide (next card peeks). 16px radius, oklch(0.14) bg,
cover image 16:10, gold tag 0.75rem uppercase, title, description. Thin 4px custom scrollbar.
Method: 3-col grid with gold step numbers 2.5rem weight 800.
CTA: warm gradient card (oklch 0.25→0.18 at 135deg, 20px radius) with white pill button.
Footer: dark, thin top border.

### Anti-patterns (what NOT to do)
- Do not allow multiple accordion items open — single-open only
- Do not hide carousel scrollbar — thin 4px styled scrollbar for discoverability
- Do not exceed 340px card width — next card must peek for scroll affordance
- Do not use pure white text — oklch 0.9-0.93 for softer dark-bg contrast
- Do not use cool accents (warm gold hue 65-70 essential) — do not skip the hero radial glow
