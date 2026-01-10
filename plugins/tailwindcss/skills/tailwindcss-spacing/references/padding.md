# Padding Utilities Reference

## Padding Classes (All Sides)

Apply padding to all four sides of an element.

```html
<!-- p-0 to p-96 -->
<div class="p-4">All sides: 1rem</div>
<div class="p-6">All sides: 1.5rem</div>
<div class="p-8">All sides: 2rem</div>
<div class="p-12">All sides: 3rem</div>
```

## Horizontal Padding (px)

Apply padding to left and right sides.

```html
<div class="px-4">Left + Right: 1rem</div>
<div class="px-6">Left + Right: 1.5rem</div>
<div class="px-8">Left + Right: 2rem</div>
<div class="px-auto">Automatic horizontal padding</div>
```

## Vertical Padding (py)

Apply padding to top and bottom sides.

```html
<div class="py-4">Top + Bottom: 1rem</div>
<div class="py-6">Top + Bottom: 1.5rem</div>
<div class="py-8">Top + Bottom: 2rem</div>
<div class="py-12">Top + Bottom: 3rem</div>
```

## Individual Sides

### Top Padding (pt)
```html
<div class="pt-4">Top: 1rem</div>
<div class="pt-8">Top: 2rem</div>
<div class="pt-12">Top: 3rem</div>
```

### Right Padding (pr)
```html
<div class="pr-4">Right: 1rem</div>
<div class="pr-6">Right: 1.5rem</div>
<div class="pr-8">Right: 2rem</div>
```

### Bottom Padding (pb)
```html
<div class="pb-4">Bottom: 1rem</div>
<div class="pb-8">Bottom: 2rem</div>
<div class="pb-12">Bottom: 3rem</div>
```

### Left Padding (pl)
```html
<div class="pl-4">Left: 1rem</div>
<div class="pl-8">Left: 2rem</div>
<div class="pl-12">Left: 3rem</div>
```

## Responsive Padding

Use responsive prefixes for different breakpoints.

```html
<div class="p-4 md:p-6 lg:p-8">
  Responsive padding on all sides
</div>

<div class="px-4 md:px-6 lg:px-12">
  Responsive horizontal padding
</div>

<div class="py-4 md:py-8 lg:py-12">
  Responsive vertical padding
</div>

<div class="pt-4 md:pt-8">Top padding responsive</div>
```

## Hover and State Variants

```html
<div class="p-4 hover:p-6">
  Padding increases on hover
</div>

<button class="p-2 focus:p-4">
  Padding increases on focus
</button>

<div class="p-4 group-hover:p-6">
  Padding in group hover state
</div>
```

## Common Use Cases

### Card with Padding
```html
<div class="p-6 bg-white rounded-lg shadow-md">
  <h2 class="font-bold">Card Title</h2>
  <p class="mt-2 text-gray-600">Card content goes here.</p>
</div>
```

### Balanced Content
```html
<div class="px-6 py-8">
  More horizontal padding, more vertical padding
</div>
```

### Button with Padding
```html
<button class="px-6 py-3 bg-blue-500 text-white rounded">
  Click me
</button>
```

### Section Container
```html
<section class="p-8 md:p-12 lg:p-16">
  <h1>Section Title</h1>
  <p>Section content with responsive padding.</p>
</section>
```

### Text Content
```html
<article class="prose p-6">
  <h1>Article Title</h1>
  <p>Article content with comfortable padding.</p>
</article>
```

## Space Between Children

The `space-x-*` and `space-y-*` utilities add spacing between child elements.

### Horizontal Space (space-x)
```html
<div class="flex space-x-4">
  <button>Button 1</button>
  <button>Button 2</button>
  <button>Button 3</button>
</div>
```

### Vertical Space (space-y)
```html
<div class="space-y-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

### Combined Spacing
```html
<div class="grid grid-cols-3 gap-4">
  <div class="p-4">Cell 1</div>
  <div class="p-4">Cell 2</div>
  <div class="p-4">Cell 3</div>
</div>
```

## Configuration

Customize padding values in `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    padding: {
      0: '0',
      px: '1px',
      0.5: '0.125rem',
      1: '0.25rem',
      1.5: '0.375rem',
      2: '0.5rem',
      2.5: '0.625rem',
      3: '0.75rem',
      3.5: '0.875rem',
      4: '1rem',
      5: '1.25rem',
      6: '1.5rem',
      7: '1.75rem',
      8: '2rem',
      9: '2.25rem',
      10: '2.5rem',
      12: '3rem',
      16: '4rem',
      20: '5rem',
      24: '6rem',
      28: '7rem',
      32: '8rem',
      36: '9rem',
      40: '10rem',
      44: '11rem',
      48: '12rem',
      52: '13rem',
      56: '14rem',
      60: '15rem',
      64: '16rem',
      72: '18rem',
      80: '20rem',
      96: '24rem',
    }
  }
}
```

## CSS Generation

Tailwind generates padding utilities as follows:

```css
@layer utilities {
  .p-4 {
    padding: calc(var(--spacing) * 16);
  }

  .px-4 {
    padding-left: calc(var(--spacing) * 16);
    padding-right: calc(var(--spacing) * 16);
  }

  .py-4 {
    padding-top: calc(var(--spacing) * 16);
    padding-bottom: calc(var(--spacing) * 16);
  }

  .pt-4 {
    padding-top: calc(var(--spacing) * 16);
  }

  .pr-4 {
    padding-right: calc(var(--spacing) * 16);
  }

  .pb-4 {
    padding-bottom: calc(var(--spacing) * 16);
  }

  .pl-4 {
    padding-left: calc(var(--spacing) * 16);
  }
}
```

## Padding with Aspect Ratio

Combine padding with responsive design:

```html
<div class="aspect-video p-4 md:p-8 lg:p-12 bg-gray-100">
  <div class="w-full h-full bg-white rounded">
    Responsive video container with padding
  </div>
</div>
```

## Default Padding Scale

All padding values from `p-0` to `p-96` follow the spacing scale:

| Size | Value |
|------|-------|
| p-0 | 0 |
| p-px | 1px |
| p-1 | 0.25rem |
| p-2 | 0.5rem |
| p-3 | 0.75rem |
| p-4 | 1rem |
| p-5 | 1.25rem |
| p-6 | 1.5rem |
| p-8 | 2rem |
| p-10 | 2.5rem |
| p-12 | 3rem |
| p-16 | 4rem |
| p-20 | 5rem |
| p-24 | 6rem |
| p-32 | 8rem |
