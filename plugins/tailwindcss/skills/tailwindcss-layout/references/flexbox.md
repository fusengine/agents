---
name: flexbox
description: Flexbox utilities for Tailwind CSS v4.1
---

# Flexbox Utilities - Tailwind CSS v4.1

## Display & Direction

### flex
Creates a flex container with `display: flex`.

```html
<div class="flex">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

### inline-flex
Creates an inline flex container with `display: inline-flex`.

```html
<span class="inline-flex gap-2">
  <span>Inline item 1</span>
  <span>Inline item 2</span>
</span>
```

### flex-col
Sets `flex-direction: column` for vertical layout.

```html
<div class="flex flex-col gap-4">
  <div>Top</div>
  <div>Middle</div>
  <div>Bottom</div>
</div>
```

### flex-row
Sets `flex-direction: row` for horizontal layout (default).

```html
<div class="flex flex-row gap-4">
  <div>Left</div>
  <div>Right</div>
</div>
```

### flex-wrap / flex-nowrap
Controls wrapping of flex items.

```html
<!-- Wrapping -->
<div class="flex flex-wrap gap-4">
  <div class="w-48">Item 1</div>
  <div class="w-48">Item 2</div>
  <div class="w-48">Item 3</div>
</div>

<!-- No wrapping -->
<div class="flex flex-nowrap overflow-auto gap-4">
  <div class="flex-shrink-0 w-48">Item 1</div>
  <div class="flex-shrink-0 w-48">Item 2</div>
</div>
```

## Flex Item Properties

### flex-1 / flex-auto / flex-none
Controls flex sizing of items.

```html
<!-- Equal grow -->
<div class="flex gap-4">
  <div class="flex-1 bg-blue-500">Grow equal</div>
  <div class="flex-1 bg-red-500">Grow equal</div>
</div>

<!-- Auto size, then grow remaining space -->
<div class="flex gap-4">
  <div class="w-32 flex-shrink-0 bg-blue-500">Fixed 128px</div>
  <div class="flex-auto bg-red-500">Grows remaining</div>
</div>

<!-- No flex -->
<div class="flex gap-4">
  <div class="flex-none w-32 bg-blue-500">Fixed 128px</div>
  <div class="flex-none w-32 bg-red-500">Fixed 128px</div>
</div>
```

### flex-grow / flex-shrink
Fine-grained flex growth and shrinking.

```html
<!-- Grow -->
<div class="flex gap-4">
  <div class="flex-shrink-0 w-32">No shrink</div>
  <div class="flex-grow bg-blue-500">Grows to fill</div>
</div>

<!-- Shrink -->
<div class="flex gap-4 overflow-auto">
  <div class="flex-shrink-0 w-48">Shrink none</div>
  <div class="flex-shrink w-48">Shrinks first</div>
</div>
```

## Justify Content (Main Axis Alignment)

### justify-start / justify-end / justify-center
Aligns items along the main axis (horizontal for row, vertical for column).

```html
<!-- Start (default) -->
<div class="flex justify-start gap-4 bg-gray-100 p-4">
  <div class="w-20 bg-blue-500">A</div>
  <div class="w-20 bg-red-500">B</div>
</div>

<!-- Center -->
<div class="flex justify-center gap-4 bg-gray-100 p-4">
  <div class="w-20 bg-blue-500">A</div>
  <div class="w-20 bg-red-500">B</div>
</div>

<!-- End -->
<div class="flex justify-end gap-4 bg-gray-100 p-4">
  <div class="w-20 bg-blue-500">A</div>
  <div class="w-20 bg-red-500">B</div>
</div>
```

### justify-between / justify-around / justify-evenly
Distributes space between items.

```html
<!-- Between (space outside edges) -->
<div class="flex justify-between gap-4 bg-gray-100 p-4 w-full">
  <div class="w-20 bg-blue-500">A</div>
  <div class="w-20 bg-red-500">B</div>
</div>

<!-- Around (equal space all sides) -->
<div class="flex justify-around gap-4 bg-gray-100 p-4 w-full">
  <div class="w-20 bg-blue-500">A</div>
  <div class="w-20 bg-red-500">B</div>
</div>

<!-- Evenly (equal space everywhere) -->
<div class="flex justify-evenly gap-4 bg-gray-100 p-4 w-full">
  <div class="w-20 bg-blue-500">A</div>
  <div class="w-20 bg-red-500">B</div>
</div>
```

## Items Alignment (Cross Axis)

### items-start / items-center / items-end
Aligns items on the cross axis (vertical for row, horizontal for column).

```html
<!-- Start -->
<div class="flex items-start gap-4 h-32 bg-gray-100 p-4">
  <div class="bg-blue-500 h-16">A</div>
  <div class="bg-red-500 h-20">B</div>
</div>

<!-- Center -->
<div class="flex items-center gap-4 h-32 bg-gray-100 p-4">
  <div class="bg-blue-500 h-16">A</div>
  <div class="bg-red-500 h-20">B</div>
</div>

<!-- End -->
<div class="flex items-end gap-4 h-32 bg-gray-100 p-4">
  <div class="bg-blue-500 h-16">A</div>
  <div class="bg-red-500 h-20">B</div>
</div>
```

### items-stretch
Stretches items to fill cross axis.

```html
<div class="flex items-stretch gap-4 h-32 bg-gray-100 p-4">
  <div class="flex-1 bg-blue-500">Stretch A</div>
  <div class="flex-1 bg-red-500">Stretch B</div>
</div>
```

### items-baseline
Aligns items based on text baseline.

```html
<div class="flex items-baseline gap-4 bg-gray-100 p-4">
  <div class="text-sm bg-blue-500">Small text</div>
  <div class="text-2xl bg-red-500">Large text</div>
</div>
```

## Gap & Spacing

### gap
Sets space between flex items.

```html
<!-- Uniform gap -->
<div class="flex gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

<!-- Responsive gap -->
<div class="flex gap-2 md:gap-4 lg:gap-6">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

### gap-x / gap-y
Sets space in specific directions.

```html
<div class="flex flex-col gap-x-4 gap-y-2">
  <div>Row 1</div>
  <div>Row 2</div>
</div>
```

## Common Patterns

### Center Content
```html
<div class="flex items-center justify-center h-screen">
  <div class="text-center">Centered content</div>
</div>
```

### Navbar
```html
<nav class="flex items-center justify-between gap-4 px-6 py-4 bg-gray-900 text-white">
  <div class="font-bold">Logo</div>
  <ul class="flex gap-6">
    <li><a href="#">Home</a></li>
    <li><a href="#">About</a></li>
  </ul>
  <button>Sign In</button>
</nav>
```

### Card Layout
```html
<div class="flex flex-col h-full border rounded-lg overflow-hidden">
  <img class="h-48 object-cover" src="..." />
  <div class="flex-1 flex flex-col p-4">
    <h3 class="font-bold">Card Title</h3>
    <p class="flex-1 text-gray-600">Description</p>
    <button class="mt-4 bg-blue-500">Action</button>
  </div>
</div>
```

### Responsive Sidebar
```html
<div class="flex flex-col md:flex-row gap-4">
  <aside class="md:w-48 bg-gray-100">
    <nav class="flex flex-col gap-2 p-4">Navigation</nav>
  </aside>
  <main class="flex-1">
    <div class="p-4">Content</div>
  </main>
</div>
```

### Horizontal Card (Image + Content)
```html
<div class="flex gap-4 border rounded-lg overflow-hidden">
  <img class="w-32 h-32 object-cover flex-shrink-0" src="..." />
  <div class="flex-1 p-4">
    <h3 class="font-bold">Title</h3>
    <p class="text-gray-600">Description</p>
  </div>
</div>
```
