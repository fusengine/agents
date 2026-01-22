---
name: theme
description: Tailwind CSS v4.1 theme configuration
---

# Tailwind CSS v4.1 Theme Configuration

## @theme Directive

The `@theme` directive defines all your design system values via CSS variables.

```css
@theme {
  --color-primary: #3b82f6;
  --color-secondary: #ef4444;
  --spacing-xs: 0.5rem;
  --font-sans: Inter, sans-serif;
}
```

## Theme Categories

### 1. Colors

```css
@theme {
  /* Named palettes */
  --color-gray-50: #f8fafc;
  --color-gray-100: #f1f5f9;
  --color-gray-900: #0f172a;

  /* Semantic colors */
  --color-primary: #3b82f6;
  --color-secondary: #ef4444;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;

  /* Aliases for compatibility */
  --color-white: #ffffff;
  --color-black: #000000;
}
```

Generates classes:
- `.bg-primary`, `.bg-gray-50`
- `.text-primary`, `.text-gray-900`
- `.border-primary`, `.border-gray-100`

### 2. Spacing

```css
@theme {
  --spacing-0: 0;
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-4: 1rem;
  --spacing-6: 1.5rem;
  --spacing-8: 2rem;
  --spacing-12: 3rem;
  --spacing-16: 4rem;
  --spacing-24: 6rem;
  --spacing-32: 8rem;
  --spacing-full: 100%;

  /* Custom values */
  --spacing-custom: 2.5rem;
  --spacing-large: 5rem;
}
```

Generates classes:
- Padding: `.p-4`, `.px-6`, `.py-8`
- Margin: `.m-4`, `.mx-auto`, `.mb-8`
- Gap: `.gap-4`, `.gap-x-2`, `.gap-y-4`

### 3. Fonts

```css
@theme {
  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-serif: Georgia, Cambria, serif;
  --font-mono: 'Menlo', 'Monaco', 'Courier New', monospace;

  /* Custom fonts */
  --font-display: 'Playfair Display', serif;
  --font-body: 'Inter', sans-serif;
}

--font-size-xs: 0.75rem;
--font-size-sm: 0.875rem;
--font-size-base: 1rem;
--font-size-lg: 1.125rem;
--font-size-xl: 1.25rem;
--font-size-2xl: 1.5rem;
--font-size-3xl: 1.875rem;
--font-size-4xl: 2.25rem;

--line-height-none: 1;
--line-height-tight: 1.25;
--line-height-snug: 1.375;
--line-height-normal: 1.5;
--line-height-relaxed: 1.625;
--line-height-loose: 2;

--letter-spacing-tighter: -0.05em;
--letter-spacing-tight: -0.025em;
--letter-spacing-normal: 0em;
--letter-spacing-wide: 0.025em;
--letter-spacing-wider: 0.05em;
--letter-spacing-widest: 0.1em;
```

### 4. Border Radius

```css
@theme {
  --radius-none: 0;
  --radius-sm: 0.125rem;
  --radius-base: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;
  --radius-3xl: 1.5rem;
  --radius-full: 9999px;

  /* Custom values */
  --radius-card: 1.25rem;
  --radius-button: 0.5rem;
}
```

Generates: `.rounded-lg`, `.rounded-full`, `.rounded-md`

### 5. Shadows

```css
@theme {
  --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1),
                 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
               0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
               0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
               0 10px 10px -5px rgba(0, 0, 0, 0.04);

  --shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);
}
```

### 6. Durations and Timing

```css
@theme {
  --duration-75: 75ms;
  --duration-100: 100ms;
  --duration-150: 150ms;
  --duration-200: 200ms;
  --duration-300: 300ms;
  --duration-500: 500ms;
  --duration-700: 700ms;
  --duration-1000: 1000ms;

  --timing-linear: linear;
  --timing-in: cubic-bezier(0.4, 0, 1, 1);
  --timing-out: cubic-bezier(0, 0, 0.2, 1);
  --timing-in-out: cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 7. Widths and Heights

```css
@theme {
  --width-auto: auto;
  --width-full: 100%;
  --width-screen: 100vw;
  --width-min: min-content;
  --width-max: max-content;
  --width-fit: fit-content;
}
```

### 8. Z-index

```css
@theme {
  --z-index-0: 0;
  --z-index-10: 10;
  --z-index-20: 20;
  --z-index-30: 30;
  --z-index-40: 40;
  --z-index-50: 50;
  --z-index-auto: auto;
}
```

## Complete Example

```css
@import "tailwindcss";

@theme {
  /* Colors */
  --color-primary: oklch(0.65 0.2 240);
  --color-secondary: oklch(0.72 0.15 30);
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-900: #111827;

  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --line-height-normal: 1.5;

  /* Spacing */
  --spacing-2: 0.5rem;
  --spacing-4: 1rem;
  --spacing-6: 1.5rem;
  --spacing-8: 2rem;

  /* Border radius */
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;

  /* Shadows */
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);

  /* Breakpoints */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
}

/* Custom components */
@layer components {
  .btn {
    @apply px-4 py-2 rounded-md font-medium transition-colors;
  }

  .btn-primary {
    @apply bg-primary text-white hover:bg-primary/90;
  }

  .card {
    @apply bg-white rounded-lg shadow-md p-6;
  }
}
```

## Using Variables

```html
<!-- Colors -->
<div class="bg-primary text-gray-900">Content</div>

<!-- Spacing -->
<div class="p-6 m-4 gap-8">Elements</div>

<!-- Sizes -->
<h1 class="text-2xl font-bold leading-tight">Title</h1>

<!-- Border radius -->
<button class="rounded-lg">Button</button>

<!-- Shadows -->
<div class="shadow-lg">Shadowed content</div>
```

## References

- [Tailwind CSS v4.1 Theme Documentation](https://tailwindcss.com/docs/theme)
- [CSS Custom Properties Configuration](https://tailwindcss.com/docs/theme#customizing-with-css-custom-properties)
