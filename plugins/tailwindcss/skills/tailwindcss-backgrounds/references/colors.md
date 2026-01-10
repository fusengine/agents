# Tailwind CSS Background Colors Reference

## Overview

Background colors use the `bg-{color}` syntax with the modernized OKLCH P3 color palette in Tailwind CSS v4.1. The OKLCH color space provides perceptually uniform colors with a wider gamut than sRGB.

## Color Families

### Neutral Colors

#### Slate
- `bg-slate-50` through `bg-slate-950`
- Cool neutral with slight blue undertone

#### Gray
- `bg-gray-50` through `bg-gray-950`
- True neutral gray

#### Zinc
- `bg-zinc-50` through `bg-zinc-950`
- Nearly pure neutral, minimal hue

#### Neutral
- `bg-neutral-50` through `bg-neutral-950`
- Perfectly neutral without any hue

#### Stone
- `bg-stone-50` through `bg-stone-950`
- Warm neutral with earthy tone

### Warm Colors

#### Red
- `bg-red-50` through `bg-red-950`
- Primary red palette for alerts, errors, accents

#### Orange
- `bg-orange-50` through `bg-orange-950`
- Warm orange for highlights and warnings

#### Amber
- `bg-amber-50` through `bg-amber-950`
- Golden amber for emphasis

#### Yellow
- `bg-yellow-50` through `bg-yellow-950`
- Bright yellow for warnings

### Cool Colors

#### Lime
- `bg-lime-50` through `bg-lime-950`
- Yellow-green accent color

#### Green
- `bg-green-50` through `bg-green-950`
- Primary green for success states

#### Emerald
- `bg-emerald-50` through `bg-emerald-950`
- Rich emerald green

#### Teal
- `bg-teal-50` through `bg-teal-950`
- Blue-green for modern designs

#### Cyan
- `bg-cyan-50` through `bg-cyan-950`
- Bright cyan for tech themes

#### Sky
- `bg-sky-50` through `bg-sky-950`
- Light blue for calm backgrounds

#### Blue
- `bg-blue-50` through `bg-blue-950`
- Primary blue palette

#### Indigo
- `bg-indigo-50` through `bg-indigo-950`
- Deep saturated blue

#### Violet
- `bg-violet-50` through `bg-violet-950`
- Purple-leaning blue

#### Purple
- `bg-purple-50` through `bg-purple-950`
- Primary purple palette

#### Fuchsia
- `bg-fuchsia-50` through `bg-fuchsia-950`
- Vibrant magenta

#### Pink
- `bg-pink-50` through `bg-pink-950`
- Soft to warm pink

#### Rose
- `bg-rose-50` through `bg-rose-950`
- Rose-toned pink

## Shades

Each color family has 11 shades:

| Shade | Lightness | Use Case |
|-------|-----------|----------|
| `50` | Lightest | Light backgrounds, hover states |
| `100` | Very light | Off-white backgrounds |
| `200` | Light | Subtle backgrounds |
| `300` | Light-medium | Borders, muted text |
| `400` | Medium-light | Secondary elements |
| `500` | Medium | Primary elements |
| `600` | Medium-dark | Emphasis, active states |
| `700` | Dark | Text, strong emphasis |
| `800` | Very dark | Dark elements |
| `900` | Darkest | Text on light backgrounds |
| `950` | Nearest black | Maximum contrast, text |

## Opacity Modifiers

Add transparency to any background color using `/` notation:

```html
<!-- Common opacity values -->
<div class="bg-blue-500/5"></div>   <!-- 5% opacity -->
<div class="bg-blue-500/10"></div>  <!-- 10% opacity -->
<div class="bg-blue-500/25"></div>  <!-- 25% opacity -->
<div class="bg-blue-500/50"></div>  <!-- 50% opacity -->
<div class="bg-blue-500/75"></div>  <!-- 75% opacity -->
<div class="bg-blue-500/90"></div>  <!-- 90% opacity -->
<div class="bg-blue-500/95"></div>  <!-- 95% opacity -->
```

## OKLCH Values (Technical Reference)

OKLCH format: `oklch(lightness chroma hue)`

### Example: Blue Palette in OKLCH

```css
--color-blue-50: oklch(0.97 0.014 254.604);
--color-blue-100: oklch(0.932 0.032 255.585);
--color-blue-200: oklch(0.882 0.059 254.128);
--color-blue-300: oklch(0.809 0.105 251.813);
--color-blue-400: oklch(0.707 0.165 254.624);
--color-blue-500: oklch(0.623 0.214 259.815);
--color-blue-600: oklch(0.546 0.245 262.881);
--color-blue-700: oklch(0.488 0.243 264.376);
--color-blue-800: oklch(0.424 0.199 265.638);
--color-blue-900: oklch(0.379 0.146 265.522);
--color-blue-950: oklch(0.282 0.091 267.935);
```

## Color Combinations for Gradients

### Complementary Pairs
- Red + Cyan
- Orange + Blue
- Yellow + Indigo
- Green + Fuchsia

### Analogous Pairs (Adjacent on color wheel)
- Blue + Indigo + Violet
- Green + Emerald + Teal
- Orange + Amber + Yellow
- Rose + Pink + Fuchsia

### Monochromatic Gradients
```html
<!-- Using single color family -->
<div class="bg-linear-to-r from-blue-300 to-blue-800"></div>
<div class="bg-linear-to-b from-slate-100 to-slate-900"></div>
```

## Accessibility

### Color Contrast
- Use shade 900-950 text on 50-100 backgrounds
- Use shade 50-100 text on 900-950 backgrounds
- Avoid shade 400-600 for text on most backgrounds

### Semantic Colors
- **Success**: `bg-green-500`, `bg-emerald-500`
- **Warning**: `bg-amber-500`, `bg-yellow-500`
- **Error**: `bg-red-500`, `bg-rose-500`
- **Info**: `bg-blue-500`, `bg-sky-500`

## Dark Mode

Background colors automatically work with dark mode:

```html
<div class="bg-white dark:bg-slate-950">
  Content adapts to light/dark theme
</div>
```

## Custom Colors

Define custom colors in your Tailwind config:

```javascript
export default {
  theme: {
    extend: {
      colors: {
        brand: {
          light: 'oklch(0.971 0.013 17.38)',
          main: 'oklch(0.637 0.237 25.331)',
          dark: 'oklch(0.258 0.092 26.042)',
        },
      },
    },
  },
}
```

Then use: `bg-brand-light`, `bg-brand-main`, `bg-brand-dark`
