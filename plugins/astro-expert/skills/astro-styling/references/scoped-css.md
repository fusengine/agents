# Scoped CSS in Astro

## Overview

Astro automatically scopes `<style>` tags to the component using a unique data attribute hash. No class name conflicts, no runtime overhead.

## How It Works

```astro
<style>
  h1 { color: red; }
</style>
```

Astro compiles this to:
```html
<style>
  h1[data-astro-cid-abc123] { color: red; }
</style>
```

## class:list Directive

Dynamically combine classes from arrays, objects, and strings:

```astro
---
const { isActive, variant } = Astro.props;
---
<div class:list={[
  'base-class',
  variant,
  { active: isActive, disabled: !isActive }
]}>
  <slot />
</div>
```

Values accepted by `class:list`:
- `string` — added as-is
- `{ [class]: boolean }` — class added when value is truthy
- `string[]` — all strings in array added
- `false | null | undefined` — ignored

## Scoped vs Global Mix

Use `:global()` for targeting child component elements:

```astro
<style>
  /* Scoped to this component */
  .wrapper { padding: 1rem; }

  /* Targets h1 inside child components */
  .wrapper :global(h1) {
    font-size: 2rem;
  }
</style>
```

## is:global for Full Global Scope

```astro
<style is:global>
  /* Applies to all pages — use in layouts only */
  body {
    margin: 0;
    font-family: sans-serif;
  }
</style>
```

## Best Practices

- Keep scoped styles in the same `.astro` file as the component
- Use `:global()` sparingly — only for child component targeting
- Reserve `is:global` for layout files and global style sheets
- Prefer `class:list` over string concatenation for conditional classes
