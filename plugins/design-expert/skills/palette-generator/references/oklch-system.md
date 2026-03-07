---
name: oklch-system
description: OKLCH color format explanation, why it matters, and how to generate scales
when-to-use: Understanding OKLCH, generating color scales, choosing colors
keywords: oklch, color, perceptual, uniform, p3, gamut, lightness, chroma, hue
priority: high
related: contrast-ratios.md, palette-template.md
---

# OKLCH Color System

## What is OKLCH?

OKLCH is a perceptually uniform color space defined by three components:

```
oklch(L% C H)

L = Lightness (0% black to 100% white)
C = Chroma (0 gray to ~0.37 maximum saturation)
H = Hue (0-360 degrees on the color wheel)
```

## Why OKLCH?

| Feature | OKLCH | HSL | Hex |
|---------|-------|-----|-----|
| Perceptually uniform | Yes | No | No |
| P3 gamut support | Yes | No | No |
| Predictable lightness | Yes | No | No |
| Scale generation | Trivial | Hard | Very hard |
| Dark mode derivation | Trivial | Complex | Manual |

**Perceptually uniform** means that a 10% change in lightness looks the same across all hues. In HSL, blue at 50% looks much darker than yellow at 50%.

## Hue Reference

| Hue Range | Color |
|-----------|-------|
| 0-30 | Red |
| 30-60 | Orange |
| 60-100 | Yellow |
| 100-150 | Green |
| 150-200 | Teal/Cyan |
| 200-260 | Blue |
| 260-310 | Purple |
| 310-360 | Pink/Magenta |

## Generating a Color Scale

To generate a 10-step scale from a base color:

1. Keep **Hue (H) constant** across all steps
2. Keep **Chroma (C) roughly consistent** (reduce slightly at extremes)
3. Vary **Lightness (L)** from 97% (lightest) to 15% (darkest)

### Scale Formula

```
Step 50:  L=97%, C=base_C*0.06
Step 100: L=93%, C=base_C*0.17
Step 200: L=85%, C=base_C*0.33
Step 300: L=75%, C=base_C*0.56
Step 400: L=65%, C=base_C*0.78
Step 500: L=base_L, C=base_C        <- primary
Step 600: L=47%, C=base_C*0.89
Step 700: L=38%, C=base_C*0.78
Step 800: L=28%, C=base_C*0.56
Step 900: L=20%, C=base_C*0.44
Step 950: L=15%, C=base_C*0.28
```

### Example: Blue Primary

```css
--blue-50:  oklch(97% 0.01 245);
--blue-100: oklch(93% 0.03 245);
--blue-200: oklch(85% 0.06 245);
--blue-300: oklch(75% 0.10 245);
--blue-400: oklch(65% 0.14 245);
--blue-500: oklch(55% 0.18 245);  /* primary */
--blue-600: oklch(47% 0.16 245);
--blue-700: oklch(38% 0.14 245);
--blue-800: oklch(28% 0.10 245);
--blue-900: oklch(20% 0.08 245);
--blue-950: oklch(15% 0.05 245);
```

## Dark Mode Derivation

To create dark mode from light mode:

1. **Invert lightness**: swap light/dark ends of the scale
2. **Boost chroma** slightly (+0.02-0.04) for vibrancy on dark backgrounds
3. **Keep hue constant**

```css
/* Light mode */
--primary: oklch(55% 0.18 245);
--primary-foreground: oklch(98% 0.005 245);

/* Dark mode - invert L, boost C */
--primary: oklch(70% 0.20 245);
--primary-foreground: oklch(15% 0.01 245);
```

## P3 Gamut

OKLCH naturally supports the wider P3 color gamut. High chroma values (C > 0.2) may exceed sRGB but display beautifully on P3 screens. Use `@supports (color: oklch(0% 0 0))` for progressive enhancement.

## Browser Support

OKLCH is supported in all modern browsers (Chrome 111+, Firefox 113+, Safari 15.4+). For older browsers, provide hex fallbacks:

```css
color: #0066cc; /* fallback */
color: oklch(55% 0.18 245);
```

-> See [contrast-ratios.md](contrast-ratios.md) for ensuring accessibility
