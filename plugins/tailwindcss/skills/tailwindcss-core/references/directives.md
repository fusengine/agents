---
name: directives
description: Directives for Tailwind CSS v4.1
---

# Tailwind CSS v4.1 Directives

## @import "tailwindcss"

**Purpose**: Load Tailwind CSS and all its utilities.

```css
/* input.css */
@import "tailwindcss";
```

Place at the **beginning** of your main CSS file.

**Result**: Automatically generates:
- Layers (theme, base, components, utilities)
- Base utilities
- Responsive variants (sm, md, lg, etc.)
- State variants (hover, focus, active, etc.)

---

## @theme

**Purpose**: Define or customize theme values.

### Basic Syntax

```css
@theme {
  --color-primary: #3b82f6;
  --spacing-large: 3rem;
  --radius-md: 0.5rem;
}
```

### With Existing CSS Variables

```css
@layer base {
  :root {
    --hue: 220;
    --saturation: 90%;
  }
}

@theme {
  --color-primary: hsl(var(--hue), var(--saturation), 50%);
}
```

### Theme Reset

```css
@theme {
  --*: initial;  /* Reset everything */
  --color-*: initial;  /* Reset all colors */

  /* Then redefine custom values */
  --color-primary: #3b82f6;
}
```

### Multiple Values with CSS Variables

```css
@theme {
  --shadow-custom:
    0 4px 6px rgba(0, 0, 0, 0.1),
    0 2px 4px rgba(0, 0, 0, 0.06);

  --font-stack: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

---

## @source

**Purpose**: Include additional source files for utility generation.

### Basic Syntax

```css
@source "./components/**/*.{tsx,jsx}";
@source "./pages/**/*.{ts,tsx}";
```

### With Relative Paths

```css
/* File: src/styles/input.css */
@source "../components/**/*.tsx";
@source "../pages/**/*.tsx";
@source "../hooks/**/*.ts";
```

### With Absolute Paths

```css
@source "./src/components/**/*.{ts,tsx}";
@source "./node_modules/@company/ui/**/*.{js,jsx}";
```

### Advanced Glob Patterns

```css
/* Multiple extensions */
@source "./**/*.{html,js,ts,jsx,tsx,svelte,vue}";

/* Exclusions */
@source "./components/**/*.{tsx,!spec.tsx}";

/* Variable depth */
@source "./src/**/*.tsx";  /* Any depth */
@source "./src/*.tsx";     /* Root level only */
@source "./src/*/index.tsx"; /* Direct subfolders */
```

### With Plugins

```css
@source "./node_modules/flowbite";
@source "./node_modules/@headlessui";
@source "./node_modules/@radix-ui";
```

---

## @utility

**Purpose**: Create custom utility classes.

### Simple Syntax

```css
@utility truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

Usage:
```html
<p class="truncate">Very long text that will be truncated</p>
```

### With Variants

```css
@utility card {
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}
```

### Multiple Utilities

```css
@utility flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@utility text-shadow-lg {
  text-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}
```

---

## @variant

**Purpose**: Create custom variants (generalized selectors).

### Class Variant

```css
@variant group-hover {
  .group:hover &
}

@variant group-focus {
  .group:focus-within &
}
```

Usage:
```html
<div class="group">
  <p class="text-gray-900 group-hover:text-blue-500">Text</p>
</div>
```

### Attribute Variant

```css
@variant data-active {
  &[data-active="true"]
}

@variant aria-disabled {
  &[aria-disabled="true"]
}
```

Usage:
```html
<button data-active="true" class="bg-white data-active:bg-blue-500">
  Button
</button>
```

### Pseudo-class Variant

```css
@variant open {
  &[open]
}

@variant valid {
  &:valid
}

@variant required {
  &:required
}
```

### Dark Mode

```css
@variant dark {
  @media (prefers-color-scheme: dark) {
    &
  }
}

/* Or with manual class */
@variant dark {
  .dark &
}
```

---

## @apply

**Purpose**: Apply Tailwind classes within custom CSS rules.

### Simple Syntax

```css
.btn {
  @apply px-4 py-2 rounded-lg font-semibold;
}
```

### With Variants

```css
.btn-primary {
  @apply bg-blue-500 text-white;

  /* Applied variants */
  &:hover {
    @apply bg-blue-600;
  }

  &:disabled {
    @apply opacity-50 cursor-not-allowed;
  }
}
```

### Combined with Custom CSS

```css
.btn {
  @apply px-4 py-2 rounded-lg;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-primary {
  @apply bg-blue-500 text-white;

  &:hover {
    @apply bg-blue-600;
  }
}
```

### With Media Queries

```css
.responsive-grid {
  @apply grid gap-4;

  @media (min-width: 768px) {
    @apply grid-cols-2;
  }

  @media (min-width: 1024px) {
    @apply grid-cols-3;
  }
}
```

### Usage in @layer

```css
@layer components {
  .card {
    @apply bg-white rounded-lg shadow-md p-6;
  }

  .card-header {
    @apply pb-4 border-b border-gray-200;
  }

  .card-body {
    @apply pt-4;
  }
}
```

---

## @layer

**Purpose**: Organize styles by layers (cascade and specificity).

### Standard Layers

```css
@layer theme, base, components, utilities;

@import "tailwindcss";

@layer base {
  body {
    @apply font-sans antialiased;
  }

  h1 {
    @apply text-4xl font-bold;
  }
}

@layer components {
  .btn {
    @apply px-4 py-2 rounded-lg font-semibold;
  }
}

@layer utilities {
  .text-shadow-lg {
    text-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  }
}
```

### Layer Order

1. **theme** - Theme values (CSS variables)
2. **base** - Reset and base styles
3. **components** - Reusable components
4. **utilities** - Utilities (highest specificity)

---

## @config

**Purpose**: Load a JavaScript configuration (v3 compatibility).

```css
@config "./tailwind.config.js";
```

**Note**: In Tailwind CSS v4.1, this is generally optional if you use `@theme`.

---

## @custom-variant (Deprecated)

Replaced by `@variant` in v4.1:

```css
/* Old syntax (v3) */
@custom-variant dark (&:is(.dark *));

/* New syntax (v4.1) */
@variant dark {
  &:is(.dark *)
}
```

---

## Loading Order

```css
/* 1. Main import */
@import "tailwindcss";

/* 2. Define theme */
@theme {
  --color-primary: #3b82f6;
}

/* 3. Declare layers */
@layer base { /* ... */ }
@layer components { /* ... */ }
@layer utilities { /* ... */ }

/* 4. Include sources */
@source "./components/**/*.tsx";
```

---

## Complete Examples

### React Application

```css
/* src/index.css */
@import "tailwindcss";

@theme {
  --color-primary: #3b82f6;
  --color-secondary: #ef4444;
  --spacing-custom: 2.5rem;
}

@source "./src/**/*.{ts,tsx}";

@layer components {
  .btn {
    @apply px-4 py-2 rounded-lg font-semibold transition-colors;
  }

  .btn-primary {
    @apply bg-primary text-white hover:bg-primary/90;
  }
}

@variant dark {
  @media (prefers-color-scheme: dark) {
    &
  }
}
```

### With Tailwind Plugins

```css
@import "tailwindcss";
@plugin "flowbite/plugin";

@source "./src/**/*.{ts,tsx}";
@source "./node_modules/flowbite";

@theme {
  --color-primary: oklch(0.65 0.2 240);
}

@layer components {
  .flowbite-card {
    @apply bg-white rounded-lg shadow-lg;
  }
}
```

---

## References

- [Tailwind CSS v4.1 Functions & Directives](https://tailwindcss.com/docs/functions-and-directives)
- [Custom Properties Documentation](https://tailwindcss.com/docs/theme)
