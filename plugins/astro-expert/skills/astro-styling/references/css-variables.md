# CSS Custom Properties in Astro

## Overview

CSS custom properties (variables) are the recommended way to manage design tokens in Astro. They enable runtime theming, dark mode, and component customization without JavaScript.

## Defining Design Tokens

```css
/* src/styles/global.css */
:root {
  /* Color palette */
  --color-primary: #6366f1;
  --color-primary-hover: #4f46e5;
  --color-bg: #ffffff;
  --color-text: #1a1a1a;
  --color-text-muted: #6b7280;
  --color-border: #e5e7eb;
  --color-surface: #f9fafb;

  /* Typography */
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'Fira Code', 'Cascadia Code', monospace;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;

  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;

  /* Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
}
```

## Dark Mode

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #0f0f0f;
    --color-text: #f5f5f5;
    --color-text-muted: #9ca3af;
    --color-border: #2a2a2a;
    --color-surface: #1a1a1a;
  }
}
```

## Using in Components

```astro
<style>
  .button {
    background: var(--color-primary);
    color: white;
    padding: var(--space-2) var(--space-4);
    border-radius: var(--radius-md);
    font-family: var(--font-sans);
    transition: background 0.2s;
  }

  .button:hover {
    background: var(--color-primary-hover);
  }
</style>
```

## Component-Level Overrides

```astro
<style>
  /* Override global token for this component */
  :host, .component-root {
    --color-primary: #f59e0b;
  }
</style>
```

## Best Practices

- Define all design tokens as CSS custom properties in `:root`
- Use semantic names (`--color-primary`) not literal names (`--indigo-500`)
- Pair with `prefers-color-scheme` for system dark mode
- Avoid duplicating token values — reference variables in variables
