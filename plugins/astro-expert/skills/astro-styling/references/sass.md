# Sass/SCSS in Astro

## Overview

Astro uses Vite under the hood, which supports Sass/SCSS natively. Just install the `sass` package — no additional configuration needed.

## Installation

```bash
npm install -D sass
```

## Usage in Astro Components

```astro
<div class="card">
  <slot />
</div>

<style lang="scss">
  $primary: #6366f1;
  $radius: 0.5rem;

  .card {
    padding: 1rem;
    border-radius: $radius;
    border: 1px solid darken($primary, 20%);

    &:hover {
      background: lighten($primary, 45%);
    }

    &__title {
      font-size: 1.25rem;
      color: $primary;
    }
  }
</style>
```

## Global SCSS File

```scss
// src/styles/global.scss
@use 'variables' as *;
@use 'mixins';

*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: $font-sans;
  color: $color-text;
}
```

## SCSS Partials Structure

```text
src/styles/
├── global.scss          # Main entry, imports all partials
├── _variables.scss      # Design tokens (colors, fonts, spacing)
├── _mixins.scss         # Reusable mixins
└── _typography.scss     # Type scale
```

## SCSS vs CSS Custom Properties

| Use | When |
|-----|------|
| SCSS variables | Compile-time values, functions |
| CSS custom properties | Runtime theming, dark mode |
| Both | Complex design systems |

## Best Practices

- Use `lang="scss"` on `<style>` tag in `.astro` files
- Prefix partial files with `_` (e.g., `_variables.scss`)
- Use `@use` instead of deprecated `@import`
- Combine SCSS variables with CSS custom properties for theming
