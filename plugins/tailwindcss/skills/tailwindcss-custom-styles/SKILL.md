---
name: tailwindcss-custom-styles
description: "Use when creating a new named utility class, writing conditional/dark-mode variants, defining a custom variant selector, or using @apply."
user-invocable: false
---

<objective>
Custom CSS authoring in Tailwind CSS v4.1 via the `@utility`, `@variant`, `@custom-variant`, `@apply`, and `@layer` directives: defining a new named utility class, writing conditional styles (including dark mode) inline with `@variant`, declaring a brand-new custom variant selector with `@custom-variant`, applying utility classes inside a custom CSS rule with `@apply`, and organizing custom CSS into `@layer components`/`@layer utilities`.
</objective>

# Custom Styles

## @utility - Create a utility
```css
@utility glass-effect {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.1);
}
/* Usage: class="glass-effect hover:glass-effect" */
```

## @variant - Conditional style
```css
.card {
  background: white;
  @variant dark { background: #1a1a2e; }
  @variant hover { transform: scale(1.05); }
}
```

## @custom-variant - New variant
```css
@custom-variant theme-midnight (&:where([data-theme="midnight"] *));
/* Usage: theme-midnight:bg-black */
```

## @apply - Inline utilities
```css
.btn-primary {
  @apply bg-blue-500 text-white px-4 py-2 rounded-lg;
}
```

## @layer - CSS organization
```css
@layer components {
  .card { @apply bg-white shadow-md rounded-xl p-4; }
}
```
