---
name: configuration
description: CSS-first configuration and custom directives for Tailwind CSS v4
---

# Tailwind CSS v4 — CSS-first Configuration & Directives

## Configuration CSS-first

### Before (v3)
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: { brand: '#3B82F6' }
    }
  }
}
```

### After (v4)
```css
@import "tailwindcss";

@theme {
  --color-brand: #3B82F6;
}
```

## Directives v4

### @utility - Create a utility
```css
@utility tab-4 {
  tab-size: 4;
}
/* Usage: class="tab-4" */
```

### @variant - Conditional style
```css
.card {
  @variant dark {
    background: #1a1a2e;
  }
}
```

### @custom-variant - New variant
```css
@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));
/* Usage: dark:bg-gray-900 */
```
