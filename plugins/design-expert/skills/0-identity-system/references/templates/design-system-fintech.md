---
name: design-system-fintech
description: Ready-to-use fintech design system — trust/B2B blue-green OKLCH palette, professional typography, subtle motion
keywords: fintech, banking, B2B, trust, OKLCH, design-system, example
sector: fintech
---

# Design System — Fintech (Trust/B2B)

## Identity

| Property | Value |
|----------|-------|
| Sector | Fintech / Banking |
| Personality | Professional, trustworthy, precise |
| Audience | B2B, financial professionals |
| Density | standard (8px grid) |
| Motion | corporate (subtle, functional) |

## Colors (OKLCH)

### Brand

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| --primary | oklch(48% 0.16 255) | oklch(63% 0.16 255) | CTA buttons, links |
| --primary-foreground | oklch(98% 0.004 255) | oklch(98% 0.004 255) | Text on primary |
| --secondary | oklch(68% 0.13 158) | oklch(58% 0.13 158) | Success, positive |
| --secondary-foreground | oklch(15% 0.01 158) | oklch(98% 0.004 158) | Text on secondary |
| --accent | oklch(55% 0.10 220) | oklch(70% 0.10 220) | Info badges, links |
| --accent-foreground | oklch(98% 0.004 220) | oklch(15% 0.01 220) | Text on accent |

### Surfaces

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| --background | oklch(98% 0.005 250) | oklch(13% 0.012 250) | Page background |
| --foreground | oklch(16% 0.018 250) | oklch(94% 0.005 250) | Default text |
| --card | oklch(100% 0 0) | oklch(19% 0.01 250) | Card background |
| --card-foreground | oklch(16% 0.018 250) | oklch(94% 0.005 250) | Card text |
| --muted | oklch(95% 0.007 250) | oklch(24% 0.01 250) | Secondary bg |
| --muted-foreground | oklch(52% 0.02 250) | oklch(64% 0.02 250) | Muted text |
| --border | oklch(89% 0.007 250) | oklch(29% 0.01 250) | Borders |
| --input | oklch(89% 0.007 250) | oklch(29% 0.01 250) | Input borders |
| --ring | oklch(48% 0.16 255) | oklch(63% 0.16 255) | Focus rings |

### Semantic

| Token | Value | Usage |
|-------|-------|-------|
| --success | oklch(58% 0.16 145) | Positive, gains |
| --warning | oklch(72% 0.15 78) | Alerts, caution |
| --error | oklch(53% 0.20 25) | Errors, losses |
| --info | oklch(56% 0.14 240) | Informational |

## Typography

| Property | Value |
|----------|-------|
| Display font | Cabinet Grotesk |
| Body font | Geist |
| Mono font | JetBrains Mono |
| Base size | 1rem / 16px |
| Scale | standard |

### Font Loading

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;600;700;800&family=Geist:wght@400;500;600&display=swap" rel="stylesheet" />
```

### CSS Variables

```css
:root {
  --font-display: "Cabinet Grotesk", sans-serif;
  --font-body: "Geist", sans-serif;
  --font-mono: "JetBrains Mono", monospace;
}
```

## Spacing (8px grid)

| Property | Value |
|----------|-------|
| Base unit | 8px |
| Border radius | balanced — sharp for inputs, soft for cards |
| --radius | 6px |
| --radius-lg | 12px |
| --radius-full | 9999px |

## Motion (Corporate)

| Property | Value |
|----------|-------|
| Profile | corporate |
| Quick | 120ms |
| Standard | 200ms |
| Emphasis | 300ms |
| Easing | ease-out |
| Reduced motion | Always respected |

```css
:root {
  --motion-quick: 120ms ease-out;
  --motion-standard: 200ms ease-out;
  --motion-emphasis: 300ms cubic-bezier(0.16, 1, 0.3, 1);
}
```
