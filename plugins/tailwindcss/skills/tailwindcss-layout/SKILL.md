---
name: tailwindcss-layout
description: "Use when building flex or grid layouts, positioning elements (absolute/relative/fixed/sticky), managing z-index/inset, or @container queries."
user-invocable: false
---

<objective>
Layout utilities for Tailwind CSS v4.1: Flexbox (`flex`, direction, `justify-*`, `items-*`, `gap`), Grid (`grid-cols-*`, `grid-rows-*`, `place-*`), Position (`absolute`/`relative`/`fixed`/`sticky`, `inset-*`, `z-*`), Display (`block`/`inline`/`flex`/`grid`/`hidden`), and Container Queries (`@container`, `@md`/`@lg` container-relative breakpoints).

Also covers multi-directional spacing (`gap`, `space-x`/`space-y`) and multi-axis alignment utilities.
</objective>

# Tailwind CSS Layout Utilities (v4.1)

Layout utilities for building responsive layouts with Flexbox, Grid, Positioning, and Container Queries.

## Core Topics

- **Flexbox**: `flex`, `flex-direction`, `justify-content`, `align-items`, `gap`
- **Grid**: `grid`, `grid-template-columns`, `grid-template-rows`, `place-items`, `place-content`
- **Position**: `absolute`, `relative`, `fixed`, `sticky`, `inset`, `z-index`
- **Display**: `block`, `inline`, `inline-block`, `flex`, `grid`, `hidden`
- **Container Queries**: `@container`, `@md`, `@lg`, responsive container sizing
- **Spacing**: `gap`, `space-x`, `space-y`, multi-directional spacing
- **Alignment**: `justify-start`, `items-center`, `place-content`, multi-axis alignment
- **Inset**: `inset`, `inset-x`, `inset-y`, `top`, `right`, `bottom`, `left`

## Display

```html
<div class="block">Block</div>
<div class="inline">Inline</div>
<div class="inline-block">Inline-block</div>
<div class="flex">Flex</div>
<div class="grid">Grid</div>
<div class="hidden">Hidden</div>
```

## References

- `/flexbox.md` - Flexbox utilities, flex direction, flex grow/shrink
- `/grid.md` - Grid layout, columns, rows, gaps, placement
- `/position.md` - Position utilities, absolute/relative/fixed/sticky, stacking
