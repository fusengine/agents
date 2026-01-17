# Design Tokens Reference

## Token Architecture

### Three-Tier System

```
1. Primitive Tokens (raw values)
   └── color-blue-500: oklch(55% 0.20 260)

2. Semantic Tokens (meaning)
   └── color-primary: var(--color-blue-500)

3. Component Tokens (context)
   └── button-bg: var(--color-primary)
```

## Color Tokens

### Neutral Palette

```css
--color-neutral-50: oklch(98% 0 0);
--color-neutral-100: oklch(96% 0 0);
--color-neutral-200: oklch(92% 0 0);
--color-neutral-300: oklch(87% 0 0);
--color-neutral-400: oklch(70% 0 0);
--color-neutral-500: oklch(55% 0 0);
--color-neutral-600: oklch(45% 0 0);
--color-neutral-700: oklch(35% 0 0);
--color-neutral-800: oklch(25% 0 0);
--color-neutral-900: oklch(15% 0 0);
--color-neutral-950: oklch(10% 0 0);
```

### Status Colors

```css
/* Success */
--color-success-500: oklch(65% 0.20 145);

/* Warning */
--color-warning-500: oklch(75% 0.18 85);

/* Error */
--color-error-500: oklch(55% 0.22 25);

/* Info */
--color-info-500: oklch(60% 0.18 240);
```

### Contrast Requirements

| Use Case | Minimum Ratio |
|----------|---------------|
| Normal text | 4.5:1 |
| Large text (18px+) | 3:1 |
| UI components | 3:1 |
| Decorative | None |

## Typography Tokens

### Font Stack

```css
--font-sans: 'Inter Variable', ui-sans-serif, system-ui, sans-serif;
--font-serif: 'Merriweather', ui-serif, Georgia, serif;
--font-mono: 'JetBrains Mono', ui-monospace, monospace;
```

### Line Heights

```css
--leading-none: 1;
--leading-tight: 1.25;
--leading-snug: 1.375;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
--leading-loose: 2;
```

### Letter Spacing

```css
--tracking-tighter: -0.05em;
--tracking-tight: -0.025em;
--tracking-normal: 0;
--tracking-wide: 0.025em;
--tracking-wider: 0.05em;
--tracking-widest: 0.1em;
```

## Shadow Tokens

### Elevation Scale

```css
--shadow-xs: 0 1px 2px oklch(0% 0 0 / 0.05);
--shadow-sm: 0 1px 3px oklch(0% 0 0 / 0.1), 0 1px 2px oklch(0% 0 0 / 0.06);
--shadow-md: 0 4px 6px oklch(0% 0 0 / 0.1), 0 2px 4px oklch(0% 0 0 / 0.06);
--shadow-lg: 0 10px 15px oklch(0% 0 0 / 0.1), 0 4px 6px oklch(0% 0 0 / 0.05);
--shadow-xl: 0 20px 25px oklch(0% 0 0 / 0.1), 0 10px 10px oklch(0% 0 0 / 0.04);
--shadow-2xl: 0 25px 50px oklch(0% 0 0 / 0.25);
```

## Animation Tokens

### Duration

```css
--duration-75: 75ms;
--duration-100: 100ms;
--duration-150: 150ms;
--duration-200: 200ms;
--duration-300: 300ms;
--duration-500: 500ms;
--duration-700: 700ms;
--duration-1000: 1000ms;
```

### Easing Functions

```css
--ease-linear: linear;
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
```

## Z-Index Scale

```css
--z-0: 0;
--z-10: 10;
--z-20: 20;
--z-30: 30;
--z-40: 40;
--z-50: 50;
--z-dropdown: 1000;
--z-sticky: 1020;
--z-fixed: 1030;
--z-modal-backdrop: 1040;
--z-modal: 1050;
--z-popover: 1060;
--z-tooltip: 1070;
```

## Breakpoints

```css
--screen-sm: 640px;
--screen-md: 768px;
--screen-lg: 1024px;
--screen-xl: 1280px;
--screen-2xl: 1536px;
```

## Container Queries

```css
@container (min-width: 20rem) { /* xs */ }
@container (min-width: 24rem) { /* sm */ }
@container (min-width: 28rem) { /* md */ }
@container (min-width: 32rem) { /* lg */ }
@container (min-width: 36rem) { /* xl */ }
```
