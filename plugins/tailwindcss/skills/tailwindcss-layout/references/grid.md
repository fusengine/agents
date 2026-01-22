---
name: grid
description: Grid utilities for Tailwind CSS v4.1
---

# Grid Utilities - Tailwind CSS v4.1

## Display & Setup

### grid
Creates a grid container with `display: grid`.

```html
<div class="grid gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

### inline-grid
Creates an inline grid container with `display: inline-grid`.

```html
<span class="inline-grid grid-cols-2 gap-2">
  <span>A</span>
  <span>B</span>
  <span>C</span>
  <span>D</span>
</span>
```

## Grid Columns

### grid-cols-{n}
Defines number of columns (1-12).

```html
<!-- 3 columns -->
<div class="grid grid-cols-3 gap-4">
  <div class="bg-blue-500">1</div>
  <div class="bg-red-500">2</div>
  <div class="bg-green-500">3</div>
  <div class="bg-blue-500">4</div>
  <div class="bg-red-500">5</div>
  <div class="bg-green-500">6</div>
</div>

<!-- Responsive columns -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
  <div>Item 5</div>
  <div>Item 6</div>
</div>

<!-- Auto-fit columns (responsive) -->
<div class="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
  <div class="bg-blue-500">Auto fit 1</div>
  <div class="bg-red-500">Auto fit 2</div>
  <div class="bg-green-500">Auto fit 3</div>
</div>
```

### grid-cols-none / grid-cols-subgrid
Resets or inherits from parent.

```html
<div class="grid grid-cols-3 gap-4">
  <!-- Inherits parent's 3-column grid -->
  <div class="grid grid-cols-subgrid col-span-2 gap-4">
    <div>Inherited 1</div>
    <div>Inherited 2</div>
  </div>
</div>
```

## Grid Rows

### grid-rows-{n}
Defines number of rows.

```html
<div class="grid grid-cols-2 grid-rows-3 gap-4 h-96">
  <div class="bg-blue-500">1</div>
  <div class="bg-red-500">2</div>
  <div class="bg-green-500">3</div>
  <div class="bg-yellow-500">4</div>
  <div class="bg-blue-500">5</div>
  <div class="bg-red-500">6</div>
</div>
```

## Column & Row Span

### col-span-{n}
Spans columns (1-12).

```html
<div class="grid grid-cols-4 gap-4">
  <div class="col-span-2 bg-blue-500">Span 2</div>
  <div class="col-span-1 bg-red-500">Span 1</div>
  <div class="col-span-1 bg-green-500">Span 1</div>
  <div class="col-span-4 bg-yellow-500">Span full</div>
</div>
```

### col-start-{n} / col-end-{n}
Explicitly sets column position.

```html
<div class="grid grid-cols-6 gap-4">
  <div class="col-start-1 col-end-3 bg-blue-500">Start 1, End 3</div>
  <div class="col-start-3 col-end-7 bg-red-500">Start 3, End 7</div>
  <div class="col-start-2 col-end-5 bg-green-500">Start 2, End 5</div>
</div>
```

### row-span-{n}
Spans rows.

```html
<div class="grid grid-cols-3 grid-rows-3 gap-4 h-96">
  <div class="row-span-3 bg-blue-500">Span 3 rows</div>
  <div class="col-span-2 bg-red-500">Item 2</div>
  <div class="col-span-2 bg-green-500">Item 3</div>
  <div class="col-span-2 bg-yellow-500">Item 4</div>
</div>
```

### row-start-{n} / row-end-{n}
Explicitly sets row position.

```html
<div class="grid grid-cols-3 grid-rows-4 gap-4 h-96">
  <div class="row-start-1 row-end-3 bg-blue-500">Start 1, End 3</div>
  <div class="row-start-2 row-end-4 bg-red-500">Start 2, End 4</div>
</div>
```

## Gap & Spacing

### gap
Sets space between grid items.

```html
<div class="grid grid-cols-3 gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
  <div>Item 5</div>
  <div>Item 6</div>
</div>
```

### gap-x / gap-y
Sets space in specific directions.

```html
<!-- Large horizontal gap, small vertical gap -->
<div class="grid grid-cols-3 gap-x-8 gap-y-2">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
  <div>Item 5</div>
  <div>Item 6</div>
</div>
```

## Auto Flow

### grid-flow-row / grid-flow-col
Controls how items flow into the grid.

```html
<!-- Row flow (default) -->
<div class="grid grid-cols-3 grid-flow-row gap-4">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>

<!-- Column flow -->
<div class="grid grid-rows-3 grid-flow-col gap-4 h-48">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
  <div>5</div>
  <div>6</div>
</div>
```

### grid-flow-dense
Fills grid gaps by allowing items to be reordered.

```html
<div class="grid grid-cols-4 grid-flow-dense gap-4 h-96">
  <div class="col-span-2 row-span-2 bg-blue-500">Large</div>
  <div class="bg-red-500">1</div>
  <div class="bg-green-500">2</div>
  <div class="bg-yellow-500">3</div>
</div>
```

## Place Items / Place Content

### place-items-center
Centers items both horizontally and vertically.

```html
<!-- Center all items in their grid cells -->
<div class="grid grid-cols-3 gap-4 h-96 place-items-center bg-gray-100">
  <div class="bg-blue-500 w-20 h-20">1</div>
  <div class="bg-red-500 w-20 h-20">2</div>
  <div class="bg-green-500 w-20 h-20">3</div>
  <div class="bg-yellow-500 w-20 h-20">4</div>
</div>
```

### place-items-start / place-items-end
Aligns items.

```html
<div class="grid grid-cols-2 gap-4 h-48 place-items-start bg-gray-100 p-4">
  <div class="bg-blue-500 w-20 h-20">1</div>
  <div class="bg-red-500 w-20 h-20">2</div>
</div>
```

### place-content-center
Centers the entire grid content within the container.

```html
<div class="grid grid-cols-2 gap-4 w-full h-screen place-content-center bg-gray-100">
  <div class="bg-blue-500 h-40">1</div>
  <div class="bg-red-500 h-40">2</div>
</div>
```

### place-content-start / place-content-end / place-content-between
Aligns the entire grid.

```html
<!-- Space between -->
<div class="grid grid-cols-2 gap-4 h-screen place-content-between bg-gray-100 p-4">
  <div class="col-span-2 bg-blue-500">Header</div>
  <div class="col-span-2 bg-red-500">Footer</div>
</div>
```

## Justify & Align (Individual Items)

### justify-self-{value}
Aligns item horizontally within grid cell.

```html
<div class="grid grid-cols-3 gap-4 bg-gray-100 p-4">
  <div class="bg-blue-500 justify-self-start">Start</div>
  <div class="bg-red-500 justify-self-center">Center</div>
  <div class="bg-green-500 justify-self-end">End</div>
</div>
```

### align-self-{value}
Aligns item vertically within grid cell.

```html
<div class="grid grid-cols-3 gap-4 h-32 bg-gray-100 p-4">
  <div class="bg-blue-500 align-self-start">Start</div>
  <div class="bg-red-500 align-self-center">Center</div>
  <div class="bg-green-500 align-self-end">End</div>
</div>
```

## Common Patterns

### Responsive Card Grid
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  <div class="bg-white rounded-lg shadow-md overflow-hidden">
    <img class="h-48 w-full object-cover" src="..." />
    <div class="p-4">
      <h3 class="font-bold">Card Title</h3>
      <p class="text-gray-600 text-sm">Description</p>
    </div>
  </div>
</div>
```

### Dashboard Layout
```html
<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
  <div class="lg:col-span-2 bg-white rounded-lg p-6">Main content</div>
  <aside class="bg-white rounded-lg p-6">Sidebar</aside>
</div>
```

### Masonry Layout
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-max">
  <div class="bg-blue-500 h-40">Item 1</div>
  <div class="bg-red-500 h-64">Item 2</div>
  <div class="bg-green-500 h-48">Item 3</div>
  <div class="bg-yellow-500 h-40">Item 4</div>
</div>
```

### Header + Content + Footer
```html
<div class="grid grid-rows-[auto_1fr_auto] h-screen gap-4 p-4">
  <header class="bg-gray-900 text-white p-4 rounded">Header</header>
  <main class="bg-white rounded overflow-auto">Main content</main>
  <footer class="bg-gray-900 text-white p-4 rounded">Footer</footer>
</div>
```

### Two-Column Layout with Sidebar
```html
<div class="grid grid-cols-[300px_1fr] gap-6 h-screen">
  <aside class="bg-gray-100 p-6 overflow-auto">Sidebar navigation</aside>
  <main class="bg-white overflow-auto">Main content</main>
</div>
```
