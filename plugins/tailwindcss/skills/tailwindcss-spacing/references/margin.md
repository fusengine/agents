---
name: margin
description: Margin utilities reference for Tailwind CSS
---

# Margin Utilities Reference

## Margin Classes (All Sides)

Apply margin to all four sides of an element.

```html
<!-- m-0 to m-96 -->
<div class="m-4">All sides: 1rem</div>
<div class="m-8">All sides: 2rem</div>
<div class="m-16">All sides: 4rem</div>
```

## Horizontal Margin (mx)

Apply margin to left and right sides.

```html
<div class="mx-4">Left + Right: 1rem</div>
<div class="mx-auto">Center horizontally</div>
<div class="mx-8">Left + Right: 2rem</div>
```

## Vertical Margin (my)

Apply margin to top and bottom sides.

```html
<div class="my-4">Top + Bottom: 1rem</div>
<div class="my-8">Top + Bottom: 2rem</div>
<div class="my-12">Top + Bottom: 3rem</div>
```

## Individual Sides

### Top Margin (mt)
```html
<div class="mt-4">Top: 1rem</div>
<div class="mt-8">Top: 2rem</div>
```

### Right Margin (mr)
```html
<div class="mr-4">Right: 1rem</div>
<div class="mr-8">Right: 2rem</div>
```

### Bottom Margin (mb)
```html
<div class="mb-4">Bottom: 1rem</div>
<div class="mb-8">Bottom: 2rem</div>
```

### Left Margin (ml)
```html
<div class="ml-4">Left: 1rem</div>
<div class="ml-8">Left: 2rem</div>
```

## Negative Margins

Create negative margins using the `-m` prefix.

```html
<!-- -m-0 to -m-96 -->
<div class="-m-4">All sides: -1rem</div>
<div class="-mx-8">Left + Right: -2rem</div>
<div class="-my-4">Top + Bottom: -1rem</div>
<div class="-mt-2">Top: -0.5rem</div>
<div class="-mb-6">Bottom: -1.5rem</div>
```

## Responsive Margins

Use responsive prefixes for different breakpoints.

```html
<div class="m-4 md:m-6 lg:m-8">
  Responsive margin
</div>

<div class="mx-auto md:mx-8 lg:mx-12">
  Responsive horizontal margin
</div>
```

## Hover and State Variants

```html
<div class="m-4 hover:m-6">
  Margin changes on hover
</div>

<button class="m-2 focus:m-4">
  Margin on focus
</button>
```

## Common Use Cases

### Centered Block Element
```html
<div class="mx-auto w-max">
  Centered content
</div>
```

### Remove Margins
```html
<div class="m-0">No margins</div>
```

### Spacing Between Elements
```html
<div class="space-y-4">
  <p class="m-0">Paragraph 1</p>
  <p class="m-0">Paragraph 2</p>
</div>
```

### Negative Margin for Overlapping
```html
<div class="relative">
  <div class="absolute -top-2 -left-2 bg-red-500 p-1">
    Badge
  </div>
</div>
```

## Configuration

Customize spacing scale in `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    spacing: {
      0: '0',
      px: '1px',
      0.5: '0.125rem',
      1: '0.25rem',
      2: '0.5rem',
      3: '0.75rem',
      4: '1rem',
      6: '1.5rem',
      8: '2rem',
      12: '3rem',
      16: '4rem',
      20: '5rem',
      24: '6rem',
      32: '8rem',
    }
  }
}
```

## CSS Generation

Tailwind generates margin utilities using CSS custom properties:

```css
@layer utilities {
  .m-4 {
    margin: calc(var(--spacing) * 16);
  }

  .mx-4 {
    margin-left: calc(var(--spacing) * 16);
    margin-right: calc(var(--spacing) * 16);
  }

  .my-4 {
    margin-top: calc(var(--spacing) * 16);
    margin-bottom: calc(var(--spacing) * 16);
  }

  .mt-4 {
    margin-top: calc(var(--spacing) * 16);
  }

  .mr-4 {
    margin-right: calc(var(--spacing) * 16);
  }

  .mb-4 {
    margin-bottom: calc(var(--spacing) * 16);
  }

  .ml-4 {
    margin-left: calc(var(--spacing) * 16);
  }
}
```

## Default Spacing Scale

| Size | Default Value |
|------|---------------|
| 0 | 0 |
| px | 1px |
| 0.5 | 0.125rem |
| 1 | 0.25rem |
| 1.5 | 0.375rem |
| 2 | 0.5rem |
| 2.5 | 0.625rem |
| 3 | 0.75rem |
| 3.5 | 0.875rem |
| 4 | 1rem |
| 5 | 1.25rem |
| 6 | 1.5rem |
| 7 | 1.75rem |
| 8 | 2rem |
| 9 | 2.25rem |
| 10 | 2.5rem |
| 11 | 2.75rem |
| 12 | 3rem |
| 14 | 3.5rem |
| 16 | 4rem |
| 20 | 5rem |
| 24 | 6rem |
| 28 | 7rem |
| 32 | 8rem |
| 36 | 9rem |
| 40 | 10rem |
| 44 | 11rem |
| 48 | 12rem |
| 52 | 13rem |
| 56 | 14rem |
| 60 | 15rem |
| 64 | 16rem |
| 72 | 18rem |
| 80 | 20rem |
| 96 | 24rem |
