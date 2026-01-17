---
name: designing-systems
description: Create and manage design systems with tokens, color palettes, typography scales, and spacing systems. Use when user asks about design tokens, theming, color schemes, typography, or consistent styling across components.
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Designing Systems

Create consistent, scalable design systems with tokens, colors, typography, and spacing.

## Workflow

```
Design System Creation:
- [ ] Step 1: Audit existing styles
- [ ] Step 2: Define color palette
- [ ] Step 3: Create typography scale
- [ ] Step 4: Establish spacing system
- [ ] Step 5: Document design tokens
- [ ] Step 6: Configure Tailwind theme
```

## Design Tokens

### Token Categories

| Category | Examples | Format |
|----------|----------|--------|
| **Colors** | primary, secondary, accent | OKLCH values |
| **Typography** | font-family, sizes, weights | rem/px |
| **Spacing** | padding, margin, gap | rem scale |
| **Borders** | radius, width | px |
| **Shadows** | elevation levels | CSS shadows |
| **Motion** | duration, easing | ms, functions |

### Token Naming Convention

```
{category}-{property}-{variant}-{state}

Examples:
- color-primary-500
- text-size-lg
- spacing-4
- radius-md
- shadow-lg
```

## Color System

### OKLCH Color Space (2026 Standard)

OKLCH provides perceptually uniform colors and wider P3 gamut:

```css
/* Primary palette */
--color-primary-50: oklch(97% 0.02 260);
--color-primary-100: oklch(94% 0.04 260);
--color-primary-200: oklch(88% 0.08 260);
--color-primary-300: oklch(78% 0.12 260);
--color-primary-400: oklch(68% 0.16 260);
--color-primary-500: oklch(55% 0.20 260);
--color-primary-600: oklch(48% 0.18 260);
--color-primary-700: oklch(40% 0.16 260);
--color-primary-800: oklch(32% 0.12 260);
--color-primary-900: oklch(24% 0.08 260);
```

### Semantic Colors

```css
/* Semantic mapping */
--color-background: var(--color-neutral-50);
--color-foreground: var(--color-neutral-900);
--color-muted: var(--color-neutral-100);
--color-muted-foreground: var(--color-neutral-500);
--color-border: var(--color-neutral-200);
--color-ring: var(--color-primary-500);
```

### Dark Mode

```css
.dark {
  --color-background: var(--color-neutral-900);
  --color-foreground: var(--color-neutral-50);
  --color-muted: var(--color-neutral-800);
  --color-muted-foreground: var(--color-neutral-400);
  --color-border: var(--color-neutral-700);
}
```

## Typography Scale

### Modular Scale (1.25 ratio)

```css
/* Font sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */
--text-6xl: 3.75rem;   /* 60px */
```

### Variable Fonts (2026 Trend)

```css
/* Variable font configuration */
@font-face {
  font-family: 'Inter Variable';
  src: url('/fonts/Inter.var.woff2') format('woff2');
  font-weight: 100 900;
  font-display: swap;
}

/* Fluid typography */
--text-fluid-lg: clamp(1.125rem, 1vw + 0.875rem, 1.5rem);
```

## Spacing System

### 4px Base Grid

```css
/* Spacing scale */
--spacing-0: 0;
--spacing-1: 0.25rem;  /* 4px */
--spacing-2: 0.5rem;   /* 8px */
--spacing-3: 0.75rem;  /* 12px */
--spacing-4: 1rem;     /* 16px */
--spacing-5: 1.25rem;  /* 20px */
--spacing-6: 1.5rem;   /* 24px */
--spacing-8: 2rem;     /* 32px */
--spacing-10: 2.5rem;  /* 40px */
--spacing-12: 3rem;    /* 48px */
--spacing-16: 4rem;    /* 64px */
--spacing-20: 5rem;    /* 80px */
```

## Tailwind Configuration

### CSS-First Config (v4)

```css
/* app.css */
@import "tailwindcss";

@theme {
  /* Colors */
  --color-primary-*: oklch(55% 0.20 260);

  /* Typography */
  --font-sans: 'Inter Variable', sans-serif;

  /* Spacing */
  --spacing-*: 0.25rem;

  /* Border radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
}
```

## References

For detailed token documentation:
- Token patterns: [references/tokens.md](references/tokens.md)
