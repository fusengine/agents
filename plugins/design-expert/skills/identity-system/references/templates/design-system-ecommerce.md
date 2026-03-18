---
name: design-system-ecommerce
description: Ready-to-use e-commerce design system — warm vibrant OKLCH palette, conversion-focused typography, dynamic motion
keywords: ecommerce, retail, conversion, CTA, OKLCH, design-system, example
sector: ecommerce
---

# Design System — E-commerce (Conversion)

## Identity

| Property | Value |
|----------|-------|
| Sector | E-commerce / Retail |
| Personality | Warm, energetic, conversion-focused |
| Audience | B2C, shoppers |
| Density | standard (8px grid) |
| Motion | modern-saas (fluid, guiding) |

## Colors (OKLCH)

### Brand

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| --primary | oklch(52% 0.15 145) | oklch(68% 0.15 145) | Brand, CTAs |
| --primary-foreground | oklch(98% 0.003 145) | oklch(98% 0.003 145) | Text on primary |
| --secondary | oklch(68% 0.17 52) | oklch(58% 0.17 52) | CTA orange, promotions |
| --secondary-foreground | oklch(15% 0.01 52) | oklch(15% 0.01 52) | Text on secondary |
| --accent | oklch(72% 0.14 80) | oklch(62% 0.14 80) | Badges, sale labels |
| --accent-foreground | oklch(15% 0.01 80) | oklch(15% 0.01 80) | Text on accent |

### Surfaces

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| --background | oklch(98% 0.004 75) | oklch(14% 0.01 250) | Page background |
| --foreground | oklch(17% 0.012 250) | oklch(95% 0.005 250) | Default text |
| --card | oklch(100% 0 0) | oklch(20% 0.008 250) | Card background |
| --card-foreground | oklch(17% 0.012 250) | oklch(95% 0.005 250) | Card text |
| --muted | oklch(95% 0.006 75) | oklch(25% 0.01 250) | Secondary bg |
| --muted-foreground | oklch(54% 0.018 250) | oklch(66% 0.018 250) | Muted text |
| --border | oklch(90% 0.005 75) | oklch(30% 0.01 250) | Borders |
| --input | oklch(90% 0.005 75) | oklch(30% 0.01 250) | Input borders |
| --ring | oklch(52% 0.15 145) | oklch(68% 0.15 145) | Focus rings |

### Semantic

| Token | Value | Usage |
|-------|-------|-------|
| --success | oklch(60% 0.16 145) | In stock, confirmed |
| --warning | oklch(74% 0.16 80) | Low stock, caution |
| --error | oklch(55% 0.20 25) | Out of stock, error |
| --info | oklch(58% 0.13 240) | Shipping info |

## Typography

| Property | Value |
|----------|-------|
| Display font | Syne |
| Body font | General Sans |
| Mono font | JetBrains Mono |
| Base size | 1rem / 16px |
| Scale | standard |

### Font Loading

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=General+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
```

### CSS Variables

```css
:root {
  --font-display: "Syne", sans-serif;
  --font-body: "General Sans", sans-serif;
  --font-mono: "JetBrains Mono", monospace;
}
```

## Spacing (8px grid)

| Property | Value |
|----------|-------|
| Base unit | 8px |
| Border radius | soft — approachable, friendly |
| --radius | 8px |
| --radius-lg | 16px |
| --radius-full | 9999px |

## Motion (Modern SaaS)

| Property | Value |
|----------|-------|
| Profile | modern-saas |
| Quick | 150ms |
| Standard | 250ms |
| Emphasis | 400ms |
| Easing | spring / cubic-bezier |
| Reduced motion | Always respected |

```css
:root {
  --motion-quick: 150ms ease-out;
  --motion-standard: 250ms cubic-bezier(0.34, 1.56, 0.64, 1);
  --motion-emphasis: 400ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
```
