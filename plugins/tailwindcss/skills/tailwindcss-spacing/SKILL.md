---
name: tailwindcss-spacing
description: "Use when setting margin or padding on any side, centering with m-auto, applying negative margins, or spacing children with space-x-*/space-y-*."
user-invocable: false
---

<objective>
Complete reference for Tailwind CSS v4.3 spacing utilities: margin (`m-*` and per-side variants, negative margins, `m-auto` centering), padding (`p-*` and per-side variants), logical block-axis margin/padding (`mbs-*`/`mbe-*`/`pbs-*`/`pbe-*`, since v4.2), and space-between (`space-x-*`/`space-y-*` for flex/grid children).

Documents the configurable spacing scale (`--spacing` base unit, default 0.25rem) and common composition patterns (centered containers, padded cards, stacked children).
</objective>

# Tailwind CSS Spacing Utilities

Complete reference for Tailwind CSS v4.3 spacing utilities: margin, padding, and space-between.

## Quick Reference

### Margin Classes
- **m-{size}**: All sides margin
- **mx-{size}**: Horizontal (left + right)
- **my-{size}**: Vertical (top + bottom)
- **mt-{size}**: Top margin
- **mr-{size}**: Right margin
- **mb-{size}**: Bottom margin
- **ml-{size}**: Left margin
- **-m-{size}**: Negative margin
- **m-auto**: Auto margin (centering)

### Padding Classes
- **p-{size}**: All sides padding
- **px-{size}**: Horizontal (left + right)
- **py-{size}**: Vertical (top + bottom)
- **pt-{size}**: Top padding
- **pr-{size}**: Right padding
- **pb-{size}**: Bottom padding
- **pl-{size}**: Left padding

### Logical Block-Axis Classes (since v4.2)
- **mbs-{size}** / **mbe-{size}**: `margin-block-start` / `margin-block-end`
- **pbs-{size}** / **pbe-{size}**: `padding-block-start` / `padding-block-end`
- Inline-axis counterparts: `ms-*`/`me-*`, `ps-*`/`pe-*`

### Space Between Children
- **space-x-{size}**: Horizontal spacing between flex/grid children
- **space-y-{size}**: Vertical spacing between flex/grid children

## Spacing Scale

Tailwind CSS v4.3 uses a configurable spacing scale where `--spacing` is the base unit (default: 0.25rem/4px). Since v4.3.1, `*-0` emits `0` and `*-1` emits `var(--spacing)` instead of a `calc()`.

| Class | Value |
|-------|-------|
| 0 | 0 |
| px | 1px |
| 0.5 | calc(var(--spacing) * 0.5) = 0.125rem |
| 1 | var(--spacing) = 0.25rem |
| 2 | calc(var(--spacing) * 2) = 0.5rem |
| 3 | calc(var(--spacing) * 3) = 0.75rem |
| 4 | calc(var(--spacing) * 4) = 1rem |
| 6 | calc(var(--spacing) * 6) = 1.5rem |
| 8 | calc(var(--spacing) * 8) = 2rem |
| 12 | calc(var(--spacing) * 12) = 3rem |
| 16 | calc(var(--spacing) * 16) = 4rem |

## Common Patterns

### Centered Container
```html
<div class="mx-auto">Centered content</div>
```

### Card with Padding
```html
<div class="p-6 bg-white rounded-lg shadow">Card content</div>
```

### Flex Items with Spacing
```html
<div class="flex space-x-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

### Stack with Vertical Spacing
```html
<div class="space-y-4">
  <p>Paragraph 1</p>
  <p>Paragraph 2</p>
  <p>Paragraph 3</p>
</div>
```

See detailed references:
- [Margin utilities →](./references/margin.md)
- [Padding utilities →](./references/padding.md)
