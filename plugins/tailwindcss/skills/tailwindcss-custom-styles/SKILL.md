---
name: tailwindcss-custom-styles
description: "Use when creating a new named utility class, writing conditional/dark-mode variants, defining a custom variant selector, or using @apply."
user-invocable: false
---

<objective>
Custom CSS authoring in Tailwind CSS v4.3 via the `@utility`, `@variant`, `@custom-variant`, `@apply`, and `@layer` directives: defining a new named utility class, writing conditional styles (including dark mode) inline with `@variant`, declaring a brand-new custom variant selector with `@custom-variant`, applying utility classes inside a custom CSS rule with `@apply`, and organizing custom CSS into `@layer components`/`@layer utilities`.
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

### Functional utility with a default value (since v4.3)
`--default(…)` inside `--value(…)` / `--modifier(…)` makes the bare utility work too.
```css
@utility tab-* {
  tab-size: --value(integer, --default(4));
}
/* class="tab" → tab-size: 4; class="tab-2" → tab-size: 2 */
```

## @variant - Conditional style
```css
.card {
  background: white;
  @variant dark { background: #1a1a2e; }
  @variant hover { transform: scale(1.05); }
}
```

### Stacked and compound @variant (since v4.3)
```css
.button {
  background: var(--color-sky-500);
  /* Stacked: hover AND focus */
  @variant hover:focus { background: var(--color-sky-600); }
  /* Compound: same block for hover OR focus */
  @variant hover, focus { color: white; }
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
