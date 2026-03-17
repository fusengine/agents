# Global Styles in Astro

## Overview

Global styles apply across all pages. Always place them in layout components, not individual pages or components.

## Method 1: Import CSS File in Layout

```astro
---
// src/layouts/BaseLayout.astro
import '../styles/global.css';
---
<html>
  <head><slot name="head" /></head>
  <body><slot /></body>
</html>
```

## Method 2: is:global in Layout

```astro
<!-- src/layouts/BaseLayout.astro -->
<style is:global>
  *, *::before, *::after { box-sizing: border-box; }

  body {
    margin: 0;
    font-family: var(--font-sans);
    color: var(--color-text);
    background: var(--color-bg);
  }

  a { color: var(--color-link); }
</style>
```

## CSS Custom Properties (Design Tokens)

Define design tokens at the `:root` level in global styles:

```css
/* src/styles/global.css */
:root {
  /* Colors */
  --color-bg: #ffffff;
  --color-text: #1a1a1a;
  --color-primary: #6366f1;
  --color-border: #e5e7eb;

  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'Fira Code', monospace;

  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-4: 1rem;
  --space-8: 2rem;
}

/* Dark mode overrides */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #0f0f0f;
    --color-text: #f5f5f5;
    --color-border: #2a2a2a;
  }
}
```

## Recommended Global Styles Structure

```text
src/styles/
├── global.css          # Reset + base styles + CSS variables
├── typography.css      # Font imports + type scale
└── utilities.css       # Shared utility classes (optional)
```

## Best Practices

- Import global CSS only once — in the root layout
- Use CSS custom properties for all design tokens
- Prefer `prefers-color-scheme` over JS-based theme switching
- Keep `is:global` in layout files only
