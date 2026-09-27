---
name: directives
description: Directives for Tailwind CSS v4.3
---

# Tailwind CSS v4.3 Directives

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

### Functional Utilities with a Default (since v4.3)

`--value(…)` / `--modifier(…)` accept `--default(…)` so the bare utility resolves too:

```css
@utility tab-* {
  tab-size: --value(integer, --default(4));
}
/* .tab → tab-size: 4;  .tab-2 → tab-size: 2; */
```

---

## @variant

**Purpose**: Apply an existing variant (`hover`, `dark`, `md`, …) to styles written in CSS. To *define* a new variant, use `@custom-variant` (below).

### Basic

```css
.card {
  background: white;

  @variant dark {
    background: black;
  }
}
```

### Stacked and Compound (since v4.3)

```css
.button {
  background: var(--color-sky-500);

  /* Stacked: hover AND focus */
  @variant hover:focus {
    background: var(--color-sky-600);
  }

  /* Compound: same block for hover OR focus */
  @variant hover, focus {
    color: white;
  }
}
```

Note: `group-hover`, `data-*`, `aria-*`, `open`, `valid`, `required`, `dark` etc. are built-in variants — no definition needed:
```html
<div class="group">
  <p class="text-gray-900 group-hover:text-blue-500">Text</p>
</div>
<button data-active class="bg-white data-active:bg-blue-500">Button</button>
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

**Note**: In Tailwind CSS v4, this is generally optional if you use `@theme`.

---

## @custom-variant

**Purpose**: Define a new variant (or override a built-in one such as `dark`). Current, non-deprecated v4 API.

```css
/* Shorthand (no nesting needed) */
@custom-variant theme-midnight (&:where([data-theme="midnight"] *));

/* Block form with @slot */
@custom-variant any-hover {
  @media (any-hover: hover) {
    &:hover {
      @slot;
    }
  }
}

/* Class-based dark mode (overrides the default prefers-color-scheme) */
@custom-variant dark (&:where(.dark, .dark *));
```

Usage: `theme-midnight:bg-black`, `any-hover:underline`, `dark:bg-black`.

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

/* Class-based dark mode (omit to keep prefers-color-scheme default) */
@custom-variant dark (&:where(.dark, .dark *));
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

- [Tailwind CSS v4.3 Functions & Directives](https://tailwindcss.com/docs/functions-and-directives)
- [Custom Properties Documentation](https://tailwindcss.com/docs/theme)
