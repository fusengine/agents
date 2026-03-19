---
name: design-system-creative
description: Ready-to-use creative/luxury design system — bold OKLCH palette, expressive display typography, dramatic motion
keywords: creative, luxury, editorial, agency, bold, OKLCH, design-system, example
sector: creative
---

# Design System — Creative / Luxury (Editorial)

## Identity

| Property | Value |
|----------|-------|
| Sector | Creative Agency / Luxury |
| Personality | Bold, expressive, premium |
| Audience | B2C, high-end, culturally aware |
| Density | editorial (12px grid, generous whitespace) |
| Motion | luxury (slow, dramatic, intentional) |

## Colors (OKLCH)

### Brand

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| --primary | oklch(38% 0.19 292) | oklch(68% 0.20 292) | Hero text, key actions |
| --primary-foreground | oklch(97% 0.004 292) | oklch(97% 0.004 292) | Text on primary |
| --secondary | oklch(56% 0.17 28) | oklch(46% 0.17 28) | Warm red, contrast CTA |
| --secondary-foreground | oklch(97% 0.004 28) | oklch(97% 0.004 28) | Text on secondary |
| --accent | oklch(82% 0.11 85) | oklch(72% 0.11 85) | Gold highlight, premium |
| --accent-foreground | oklch(15% 0.01 85) | oklch(15% 0.01 85) | Text on accent |

### Surfaces

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| --background | oklch(97% 0.004 280) | oklch(12% 0.01 280) | Page background |
| --foreground | oklch(13% 0.01 280) | oklch(95% 0.004 280) | Default text |
| --card | oklch(99% 0 0) | oklch(18% 0.009 280) | Card background |
| --card-foreground | oklch(13% 0.01 280) | oklch(95% 0.004 280) | Card text |
| --muted | oklch(94% 0.006 280) | oklch(23% 0.009 280) | Subtle bg sections |
| --muted-foreground | oklch(50% 0.018 280) | oklch(63% 0.018 280) | Secondary text |
| --border | oklch(87% 0.007 280) | oklch(28% 0.009 280) | Borders |
| --input | oklch(87% 0.007 280) | oklch(28% 0.009 280) | Input borders |
| --ring | oklch(38% 0.19 292) | oklch(68% 0.20 292) | Focus rings |

### Semantic

| Token | Value | Usage |
|-------|-------|-------|
| --success | oklch(58% 0.15 145) | Confirmation, availability |
| --warning | oklch(72% 0.14 78) | Limited edition, caution |
| --error | oklch(53% 0.20 25) | Sold out, error |
| --info | oklch(56% 0.13 240) | Info, notes |

## Typography

| Property | Value |
|----------|-------|
| Display font | Fraunces |
| Body font | Literata |
| Mono font | JetBrains Mono |
| Base size | 1.125rem / 18px |
| Scale | editorial |

### Font Loading

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;1,9..144,300&family=Literata:ital,opsz,wght@0,7..72,400;0,7..72,500;1,7..72,400&display=swap" rel="stylesheet" />
```

### CSS Variables

```css
:root {
  --font-display: "Fraunces", serif;
  --font-body: "Literata", serif;
  --font-mono: "JetBrains Mono", monospace;
}
```

## Spacing (12px editorial grid)

| Property | Value |
|----------|-------|
| Base unit | 12px |
| Border radius | pill/soft — organic, editorial |
| --radius | 2px |
| --radius-lg | 4px |
| --radius-full | 9999px |

## Motion (Luxury)

| Property | Value |
|----------|-------|
| Profile | luxury |
| Quick | 200ms |
| Standard | 400ms |
| Emphasis | 700ms |
| Easing | cubic-bezier(slow, cinematic) |
| Reduced motion | Always respected |

```css
:root {
  --motion-quick: 200ms cubic-bezier(0.25, 0.1, 0.25, 1);
  --motion-standard: 400ms cubic-bezier(0.16, 1, 0.3, 1);
  --motion-emphasis: 700ms cubic-bezier(0.76, 0, 0.24, 1);
}
```
