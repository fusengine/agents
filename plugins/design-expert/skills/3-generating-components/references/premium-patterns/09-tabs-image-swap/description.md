---
name: Tabs Image Swap
source: https://mivora-wbs.framer.website
sector: Eco
---

## Tabs Image Swap

### Visual Walkthrough (top to bottom)
**Nav**: White bg, padding 16px 64px, height 56px. Logo left. Links 0.875rem weight 500
oklch(0.3 0 0), gap 32px. Right: green pill CTA, bg oklch(0.55 0.19 145), white text, radius 999px.
**Hero**: bg oklch(0.99 0 0), padding 100px 64px 80px. Heading "Eco-Supply the green pulse
of modern logistics" — clamp(2.5rem, 5.5vw, 3.75rem) weight 700 line-height 1.15 oklch(0.15 0 0).
Word "green" colored oklch(0.55 0.19 145). Green pill CTA below:
padding 14px 28px, radius 999px, shadow 0 4px 16px oklch(0.55 0.19 145 / 0.25).
Hover: oklch(0.48 0.19 145), shadow 0 6px 24px at 0.3 opacity.
**Intro**: Centered paragraph, max-width 640px, 1.0625rem oklch(0.4 0 0) line-height 1.7.
3 small stat counters right side.
**Tabbed section** (KEY PATTERN): Padding 100px 64px.
Tab bar: inline-flex container, bg oklch(0.95 0.01 145), radius 999px, padding 4px, gap 4px.
Tabs inside: radius 999px, padding 10px 22px, 0.875rem weight 500.
Inactive: transparent bg, oklch(0.4 0 0). Active: bg oklch(0.55 0.19 145), white text,
shadow 0 2px 8px oklch(0.55 0.19 145 / 0.3). Transition: all 0.3s ease.
Content below: 2-column grid (1fr 1fr, gap 48px, align-items center).
Left image: 4:3 ratio, radius 16px, object-fit cover, transition opacity 0.5s ease-in-out.
Right: heading 1.75rem weight 700 oklch(0.15 0 0), text 1rem/1.7 oklch(0.4 0 0) max-width 480px.
Text transitions with opacity 0.4s ease. Content crossfades on tab switch.
**Image grid**: 2-column masonry, gap 16px, padding 80px 64px.
Left: grid-row span 2, radius 16px, portrait 3:4. Right: 2 stacked images, 4:3, radius 16px.
Nature/aerial photography.
**Feature section**: "Why Mivora" heading. 2-column layout with text left, image grid right.
**Process flow**: Flex centered, padding 80px 64px.
Nodes: 56px circle, bg oklch(0.55 0.19 145), white text weight 700 font-size 1rem.
Connectors: 2px height, 80px width, bg oklch(0.85 0.05 145).
Labels below: 0.8125rem oklch(0.4 0 0), margin-top 12px, max-width 100px.
**Counter stats**: Flex centered, gap 64px, padding 80px 64px.
Numbers: clamp(2.25rem, 4vw, 3.25rem) weight 800 oklch(0.15 0 0).
Suffix "+"/"%": colored oklch(0.55 0.19 145). Labels: 0.8125rem oklch(0.55 0 0).
JS: IntersectionObserver triggers countUp from 0, duration 2s easeOut.
**Full-bleed CTA**: Nature photo bg, radius 24px, margin 0 64px, padding 120px 64px.
Overlay: oklch(0 0 0 / 0.45). Text z-1: clamp(1.75rem, 4vw, 2.75rem) weight 700
oklch(0.99 0 0) centered, max-width 640px. Green pill button below.
**Logo marquee**: Flex, gap 48px, animation scroll 20s linear infinite.
Logos height 28px, opacity 0.4, filter grayscale(1).
**Blog**: 3-col card grid, white cards radius 16px, shadow 0 2px 12px oklch(0 0 0 / 0.05).
**Footer**: bg oklch(0.99 0 0), padding 48px 64px, border-top 1px oklch(0.9 0 0), 4-col grid.

### CSS Specifications
- Palette: bg `oklch(0.99)` | green `oklch(0.55 0.19 145)` | hover `oklch(0.48 0.19 145)`
- Dark text `oklch(0.15)` | body `oklch(0.4)` | muted `oklch(0.55)` | tint `oklch(0.96 0.02 145)`
- H1: `clamp(2.5rem,5.5vw,3.75rem); 700; 1.15` | Green word: `oklch(0.55 0.19 145)`
- Tab bar: `inline-flex; bg:oklch(0.95 0.01 145); 999px; padding:4px`
- Active tab: `bg:oklch(0.55 0.19 145); shadow:0 2px 8px oklch(0.55 0.19 145/0.3)`
- Tab image: `4:3; 16px radius; transition:opacity 0.5s ease-in-out` | Text: `opacity 0.4s ease`
- Grid: `1fr 1fr; gap:16px` | Large: `span 2; 16px` | Process node: `56px; oklch(0.55 0.19 145)`
- Counter: `clamp(2.25rem,4vw,3.25rem) 800` | CountUp: `IntersectionObserver 2s easeOut`
- CTA: `bg-image cover; 24px radius; overlay oklch(0 0 0/0.45)` | Blog: `3-col; 16px radius`
- Responsive: 768px tabs→overflow-x auto; grids→1-col; counters→2x2; process→scroll-x

### Gemini Context Prompt
Build an eco/green logistics landing page on white background oklch(0.99).
Single accent: natural green oklch(0.55 0.19 145). White navbar with green pill CTA.
Hero: heading 3.75rem weight 700, one word "green" in accent color. Green pill CTA with
colored shadow 0 4px 16px at 25% opacity. Centered intro paragraph max-width 640px.
KEY PATTERN: tabbed section. Pill tab bar (bg oklch 0.95 0.01 145, radius 999px, 4px padding).
Active tab fills green with 2px 8px shadow. Below: 2-col grid — left image (4:3, 16px radius)
crossfades opacity 0.5s on tab switch. Right: heading + text crossfades 0.4s.
Masonry image grid: 2 columns, left spans 2 rows (3:4), right 2 stacked (4:3). All 16px radius.
Process flow: green circle nodes (56px) connected by 2px lines oklch(0.85 0.05 145).
Counter stats: numbers 3.25rem weight 800 with green "+" suffix, count-up on scroll 2s easeOut.
Full-bleed CTA: nature photo, 24px radius, dark overlay oklch(0 0 0/0.45), white text, green button.
Logo marquee: grayscale 40% opacity scrolling infinitely.
Blog: 3-col white cards. Footer: light, 4-col, thin top border. Green is the ONLY accent color.

### Anti-patterns (what NOT to do)
- Do not skip crossfade animation — tabs MUST use opacity transition (0.5s image, 0.4s text)
- Do not make tabs square — pill inside pill is the signature shape
- Do not use neon green — chroma 0.19, hue 145 for natural feel
- Do not show static counter numbers — scroll-triggered count-up is essential
- Do not use sharp images (ALL 16px radius) — green is the ONLY non-neutral accent color
