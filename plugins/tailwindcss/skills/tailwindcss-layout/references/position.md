---
name: position
description: Position utilities for Tailwind CSS v4.1
---

# Position Utilities - Tailwind CSS v4.1

## Position Types

### static
Default positioning (normal document flow).

```html
<div class="static">
  <p>Default positioning, not positioned.</p>
</div>
```

### relative
Positioned relative to its normal position. Other elements are not affected.

```html
<div class="relative top-2 left-4 bg-blue-500 h-20">
  Moved 2 units down, 4 units right from normal position
</div>
<div class="bg-red-500 h-20">
  This stays in normal flow
</div>
```

### absolute
Positioned relative to nearest positioned parent. Removed from document flow.

```html
<div class="relative h-32 bg-gray-200">
  <!-- This absolute element is positioned relative to the relative parent -->
  <div class="absolute top-2 right-2 bg-blue-500 w-20 h-20">
    Positioned absolutely
  </div>
  <p>Relative content</p>
</div>
```

### fixed
Positioned relative to viewport. Stays in place when scrolling.

```html
<div class="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-lg">
  Fixed chat widget (bottom-right)
</div>
```

### sticky
Toggles between relative and fixed. Stays in place when scrolling until parent is out of view.

```html
<div class="h-96 overflow-auto">
  <div class="sticky top-0 bg-white border-b z-10">
    Sticky header - stays at top of scroll container
  </div>
  <div class="p-4">Long scrollable content...</div>
</div>
```

## Inset Properties

### inset
Sets all four sides (top, right, bottom, left) simultaneously.

```html
<div class="relative h-48 bg-gray-200">
  <!-- Full coverage (stretch to all sides) -->
  <div class="absolute inset-0 bg-blue-500 opacity-50">
    Covers entire parent
  </div>
</div>
```

### inset-x / inset-y
Sets horizontal or vertical sides.

```html
<!-- Horizontal (left + right) -->
<div class="relative h-32 bg-gray-200">
  <div class="absolute inset-x-0 bottom-0 bg-blue-500 h-8">
    Stretches horizontally, sticks to bottom
  </div>
</div>

<!-- Vertical (top + bottom) -->
<div class="relative w-48 h-48 bg-gray-200">
  <div class="absolute inset-y-0 right-0 bg-red-500 w-8">
    Stretches vertically, sticks to right
  </div>
</div>
```

### top / right / bottom / left
Individual side positioning.

```html
<div class="relative h-48 bg-gray-200">
  <div class="absolute top-4 right-4 bg-blue-500 w-20 h-20">
    Top-right corner
  </div>
  <div class="absolute bottom-4 left-4 bg-red-500 w-20 h-20">
    Bottom-left corner
  </div>
</div>
```

## Z-Index (Stacking)

### z-{n}
Controls stacking order. Higher values appear on top.

```html
<div class="relative h-48">
  <div class="absolute inset-0 bg-blue-500 z-10">
    Blue box (on top)
  </div>
  <div class="absolute inset-2 bg-red-500 z-20">
    Red box (on top of blue)
  </div>
  <div class="absolute inset-4 bg-green-500 z-30">
    Green box (on top)
  </div>
</div>
```

### z-auto / z-0
Default stacking.

```html
<div class="relative">
  <div class="absolute inset-0 bg-gray-300 z-0">Background</div>
  <div class="absolute inset-4 bg-white z-auto">Content</div>
</div>
```

## Common Patterns

### Floating Action Button (FAB)
```html
<body>
  <!-- Page content -->
  <main class="h-screen overflow-auto">Content here</main>

  <!-- Fixed FAB -->
  <button class="fixed bottom-6 right-6 w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 flex items-center justify-center">
    +
  </button>
</body>
```

### Sticky Header
```html
<div class="relative">
  <!-- Sticky navigation -->
  <nav class="sticky top-0 bg-white border-b z-40">
    <div class="px-6 py-4 flex items-center justify-between">
      <div>Logo</div>
      <ul class="flex gap-6">
        <li><a href="#">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
    </div>
  </nav>

  <!-- Main content -->
  <main class="p-6">
    Content scrolls beneath sticky header
  </main>
</div>
```

### Modal Overlay
```html
<!-- Modal backdrop (fixed, covers entire viewport) -->
<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <!-- Modal dialog (centered) -->
  <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
    <h2 class="font-bold text-lg mb-4">Confirm Action</h2>
    <p class="text-gray-600 mb-6">Are you sure?</p>
    <div class="flex gap-2 justify-end">
      <button class="px-4 py-2 bg-gray-200 rounded">Cancel</button>
      <button class="px-4 py-2 bg-blue-500 text-white rounded">Confirm</button>
    </div>
  </div>
</div>
```

### Dropdown Menu
```html
<div class="relative">
  <button class="px-4 py-2 bg-blue-500 text-white rounded">
    Menu
  </button>

  <!-- Dropdown (positioned absolutely relative to button's parent) -->
  <div class="absolute top-full left-0 mt-2 bg-white border rounded shadow-lg z-10 min-w-48">
    <a href="#" class="block px-4 py-2 hover:bg-gray-100">Option 1</a>
    <a href="#" class="block px-4 py-2 hover:bg-gray-100">Option 2</a>
    <a href="#" class="block px-4 py-2 hover:bg-gray-100">Option 3</a>
  </div>
</div>
```

### Badge (Positioned on Image)
```html
<div class="relative inline-block w-48">
  <img class="w-full" src="..." alt="Product" />
  <!-- Badge positioned absolutely in corner -->
  <div class="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
    Sale
  </div>
</div>
```

### Tooltip
```html
<div class="relative inline-block">
  <button class="px-4 py-2 bg-gray-500 text-white rounded">
    Hover me
  </button>

  <!-- Tooltip (positioned absolutely above) -->
  <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white px-2 py-1 rounded whitespace-nowrap opacity-0 hover:opacity-100">
    This is helpful text
  </div>
</div>
```

### Sticky Sidebar in Scrollable Container
```html
<div class="flex gap-6 h-screen">
  <!-- Sticky sidebar -->
  <aside class="w-64 bg-gray-100 overflow-auto">
    <nav class="sticky top-0 p-4 bg-gray-100">
      <h3 class="font-bold mb-4">Navigation</h3>
      <ul class="flex flex-col gap-2">
        <li><a href="#">Section 1</a></li>
        <li><a href="#">Section 2</a></li>
        <li><a href="#">Section 3</a></li>
      </ul>
    </nav>
    <div class="p-4">Additional content</div>
  </aside>

  <!-- Main content -->
  <main class="flex-1 overflow-auto p-6">
    Long scrollable content
  </main>
</div>
```

### Breadcrumb with Sticky Top
```html
<div class="h-screen overflow-auto">
  <!-- Sticky breadcrumb -->
  <nav class="sticky top-0 bg-white border-b z-30 px-6 py-3">
    <a href="#" class="text-blue-500">Home</a>
    <span class="mx-2">/</span>
    <a href="#" class="text-blue-500">Products</a>
    <span class="mx-2">/</span>
    <span class="text-gray-600">Details</span>
  </nav>

  <!-- Main content -->
  <main class="p-6">Long content here</main>
</div>
```

### Floating Search Bar (Sticky)
```html
<div class="h-screen overflow-auto">
  <div class="sticky top-0 bg-white border-b shadow-sm z-40 p-4">
    <input class="w-full px-4 py-2 border rounded-lg" placeholder="Search..." />
  </div>

  <main class="p-6">Scrollable content here</main>
</div>
```

### Centered Loading Spinner (Fixed)
```html
<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
  <div class="bg-white rounded-lg p-8">
    <div class="w-12 h-12 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
    <p class="mt-4 text-gray-600">Loading...</p>
  </div>
</div>
```
