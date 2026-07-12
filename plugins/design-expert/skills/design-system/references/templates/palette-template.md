---
name: palette-template
description: Complete palette output format with CSS custom properties and Tailwind config
keywords: palette, template, css-variables, tailwind, theme, dark-mode, oklch
---

# Palette Template

Copy-paste ready output format for generated color palettes.

---

## CSS Custom Properties

```css
@layer base {
  :root {
    /* Brand Colors */
    --primary: oklch(55% 0.18 245);
    --primary-foreground: oklch(98% 0.005 245);
    --secondary: oklch(65% 0.12 160);
    --secondary-foreground: oklch(98% 0.005 160);
    --accent: oklch(70% 0.15 200);
    --accent-foreground: oklch(15% 0.01 200);

    /* Surfaces */
    --background: oklch(99% 0.003 250);
    --foreground: oklch(15% 0.01 250);
    --card: oklch(100% 0 0);
    --card-foreground: oklch(15% 0.01 250);
    --popover: oklch(100% 0 0);
    --popover-foreground: oklch(15% 0.01 250);
    --muted: oklch(95% 0.01 250);
    --muted-foreground: oklch(45% 0.02 250);

    /* Borders & Inputs */
    --border: oklch(90% 0.01 250);
    --input: oklch(90% 0.01 250);
    --ring: oklch(55% 0.18 245);

    /* Semantic */
    --success: oklch(60% 0.18 145);
    --success-foreground: oklch(98% 0.005 145);
    --warning: oklch(75% 0.16 80);
    --warning-foreground: oklch(20% 0.02 80);
    --error: oklch(55% 0.22 25);
    --error-foreground: oklch(98% 0.005 25);
    --info: oklch(60% 0.14 240);
    --info-foreground: oklch(98% 0.005 240);

    /* Component Tokens */
    --radius: 8px;
    --radius-sm: 6px;
    --radius-lg: 12px;
    --radius-xl: 16px;
  }

  .dark {
    /* Brand Colors (inverted L, boosted C) */
    --primary: oklch(70% 0.20 245);
    --primary-foreground: oklch(15% 0.01 245);
    --secondary: oklch(55% 0.14 160);
    --secondary-foreground: oklch(15% 0.01 160);
    --accent: oklch(60% 0.17 200);
    --accent-foreground: oklch(95% 0.005 200);

    /* Surfaces */
    --background: oklch(12% 0.01 250);
    --foreground: oklch(95% 0.005 250);
    --card: oklch(17% 0.01 250);
    --card-foreground: oklch(95% 0.005 250);
    --popover: oklch(17% 0.01 250);
    --popover-foreground: oklch(95% 0.005 250);
    --muted: oklch(22% 0.01 250);
    --muted-foreground: oklch(65% 0.02 250);

    /* Borders & Inputs */
    --border: oklch(28% 0.01 250);
    --input: oklch(28% 0.01 250);
    --ring: oklch(70% 0.20 245);

    /* Semantic (adjusted for dark bg) */
    --success: oklch(65% 0.20 145);
    --success-foreground: oklch(15% 0.01 145);
    --warning: oklch(70% 0.18 80);
    --warning-foreground: oklch(15% 0.01 80);
    --error: oklch(60% 0.24 25);
    --error-foreground: oklch(15% 0.01 25);
    --info: oklch(65% 0.16 240);
    --info-foreground: oklch(15% 0.01 240);
  }
}
```

## Tailwind CSS v4 @theme

```css
@theme {
  --color-primary: oklch(55% 0.18 245);
  --color-primary-foreground: oklch(98% 0.005 245);
  --color-secondary: oklch(65% 0.12 160);
  --color-secondary-foreground: oklch(98% 0.005 160);
  --color-accent: oklch(70% 0.15 200);
  --color-accent-foreground: oklch(15% 0.01 200);
  --color-background: oklch(99% 0.003 250);
  --color-foreground: oklch(15% 0.01 250);
  --color-card: oklch(100% 0 0);
  --color-card-foreground: oklch(15% 0.01 250);
  --color-muted: oklch(95% 0.01 250);
  --color-muted-foreground: oklch(45% 0.02 250);
  --color-border: oklch(90% 0.01 250);
  --color-input: oklch(90% 0.01 250);
  --color-ring: oklch(55% 0.18 245);
  --color-success: oklch(60% 0.18 145);
  --color-warning: oklch(75% 0.16 80);
  --color-error: oklch(55% 0.22 25);
  --color-info: oklch(60% 0.14 240);
}
```

## Primary Color Scale

```css
@theme {
  --color-primary-50:  oklch(97% 0.01 [HUE]);
  --color-primary-100: oklch(93% 0.03 [HUE]);
  --color-primary-200: oklch(85% 0.06 [HUE]);
  --color-primary-300: oklch(75% 0.10 [HUE]);
  --color-primary-400: oklch(65% 0.14 [HUE]);
  --color-primary-500: oklch(55% 0.18 [HUE]);
  --color-primary-600: oklch(47% 0.16 [HUE]);
  --color-primary-700: oklch(38% 0.14 [HUE]);
  --color-primary-800: oklch(28% 0.10 [HUE]);
  --color-primary-900: oklch(20% 0.08 [HUE]);
  --color-primary-950: oklch(15% 0.05 [HUE]);
}
```

Replace `[HUE]` with the brand hue value (e.g., 245 for blue).

-> See [oklch-system.md](../oklch-system.md) for scale generation details
-> See [contrast-ratios.md](../contrast-ratios.md) for accessibility validation
