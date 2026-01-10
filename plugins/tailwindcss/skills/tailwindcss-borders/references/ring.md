# Ring & Divide Utilities

## Ring (Advanced)

Box-shadow based rings for focus indicators and visual effects.

### Ring Combinations

```html
<!-- Ring with all variants -->
<div class="ring-2 ring-blue-500 ring-offset-4 ring-offset-white">
  Complete ring styling
</div>

<!-- Inset ring (inside element) -->
<div class="ring-2 ring-inset ring-blue-500">
  Inset ring
</div>

<!-- Ring without offset -->
<div class="ring-2 ring-blue-500 ring-offset-0">
  Ring touching border
</div>
```

### Multiple Ring Effects

```html
<!-- Layered rings with focus -->
<button class="
  relative
  px-4 py-2
  border-2 border-blue-500
  focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
">
  Multi-layer ring
</button>

<!-- Ring for depth -->
<div class="
  rounded-lg
  bg-white
  ring-1 ring-gray-200
  shadow-lg
">
  Depth with ring
</div>
```

## Divide Utilities

Separate child elements with borders.

### Divide Width

Add borders between child elements without adding borders to the container.

```html
<!-- Horizontal divide (divide-y) -->
<div class="divide-y divide-gray-300">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

<!-- Vertical divide (divide-x) -->
<div class="flex divide-x divide-gray-300">
  <div class="flex-1">Column 1</div>
  <div class="flex-1">Column 2</div>
  <div class="flex-1">Column 3</div>
</div>

<!-- Specific divide widths -->
<div class="divide-y-2 divide-gray-300">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<div class="divide-y-4 divide-gray-300">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

### Divide Color

```html
<!-- Basic colors -->
<div class="divide-y-2 divide-indigo-500">
  <div>Section 1</div>
  <div>Section 2</div>
  <div>Section 3</div>
</div>

<!-- Gray variations -->
<div class="divide-y divide-gray-200">
  <div>Light divider</div>
  <div>Light divider</div>
</div>

<div class="divide-y divide-gray-700">
  <div>Dark divider</div>
  <div>Dark divider</div>
</div>

<!-- Colored dividers -->
<div class="divide-y-2 divide-green-500">
  <div>Success section</div>
  <div>Success section</div>
</div>

<!-- Opacity variants -->
<div class="divide-y divide-gray-400/50">
  <div>Faded dividers</div>
  <div>Faded dividers</div>
</div>
```

### Divide Style

Control the style of divide lines.

```html
<!-- Solid (default) -->
<div class="divide-y-2 divide-solid divide-gray-300">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- Dashed -->
<div class="divide-y-2 divide-dashed divide-gray-300">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- Dotted -->
<div class="divide-y-2 divide-dotted divide-gray-300">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- Grid with divide style -->
<div class="grid grid-cols-3 divide-x-2 divide-dashed divide-indigo-500">
  <div class="p-4">01</div>
  <div class="p-4">02</div>
  <div class="p-4">03</div>
</div>
```

## Common Patterns

### List with Dividers

```html
<ul class="divide-y divide-gray-200 border border-gray-200 rounded-lg">
  <li class="p-4">List item 1</li>
  <li class="p-4">List item 2</li>
  <li class="p-4">List item 3</li>
  <li class="p-4">List item 4</li>
</ul>
```

### Table-like Structure

```html
<div class="divide-y divide-gray-300 border-b border-gray-300">
  <div class="grid grid-cols-3 divide-x divide-gray-300">
    <div class="p-4 font-bold">Header 1</div>
    <div class="p-4 font-bold">Header 2</div>
    <div class="p-4 font-bold">Header 3</div>
  </div>
  <div class="grid grid-cols-3 divide-x divide-gray-300">
    <div class="p-4">Data 1</div>
    <div class="p-4">Data 2</div>
    <div class="p-4">Data 3</div>
  </div>
</div>
```

### Card Grid

```html
<div class="grid grid-cols-3 divide-x divide-y divide-gray-200 border border-gray-200">
  <div class="p-6">Card 1</div>
  <div class="p-6">Card 2</div>
  <div class="p-6">Card 3</div>
  <div class="p-6">Card 4</div>
  <div class="p-6">Card 5</div>
  <div class="p-6">Card 6</div>
</div>
```

### Menu Structure

```html
<div class="divide-y divide-gray-200 rounded-lg border border-gray-200 shadow-md">
  <button class="w-full px-4 py-3 text-left hover:bg-gray-50">
    Option 1
  </button>
  <button class="w-full px-4 py-3 text-left hover:bg-gray-50">
    Option 2
  </button>
  <button class="w-full px-4 py-3 text-left hover:bg-gray-50">
    Option 3
  </button>
</div>
```

### Timeline

```html
<div class="divide-y-2 divide-indigo-300 border-l-2 border-indigo-300 pl-6">
  <div class="pb-6">
    <h3 class="font-bold text-indigo-600">Event 1</h3>
    <p class="text-gray-600">Description</p>
  </div>
  <div class="pb-6 pt-6">
    <h3 class="font-bold text-indigo-600">Event 2</h3>
    <p class="text-gray-600">Description</p>
  </div>
  <div class="pb-6 pt-6">
    <h3 class="font-bold text-indigo-600">Event 3</h3>
    <p class="text-gray-600">Description</p>
  </div>
</div>
```

## Responsive Variants

```html
<!-- Responsive divide width -->
<div class="divide-y md:divide-y-2 lg:divide-y-4 divide-gray-300">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- Responsive divide direction -->
<div class="divide-y md:divide-x md:divide-y-0 divide-gray-300">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

<!-- Responsive divide color -->
<div class="divide-y divide-gray-300 md:divide-gray-400 lg:divide-gray-500">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- Responsive ring -->
<input class="ring-1 md:ring-2 lg:ring-4 ring-blue-500 ring-offset-1 md:ring-offset-2" />
```

## State Variants

```html
<!-- Focus ring -->
<input class="focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" />

<!-- Hover divide color -->
<div class="divide-y divide-gray-300 hover:divide-gray-400">
  <div class="p-4 hover:bg-gray-50">Hoverable item 1</div>
  <div class="p-4 hover:bg-gray-50">Hoverable item 2</div>
</div>

<!-- Group hover -->
<div class="group divide-y divide-gray-300">
  <div class="p-4 group-hover:bg-blue-50">Item 1</div>
  <div class="p-4 group-hover:bg-blue-50">Item 2</div>
</div>
```

## Configuration

### Custom Divide Widths

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      divideWidth: {
        3: '3px',
        5: '5px',
      }
    }
  }
}
```

### Custom Ring Offset Width

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      ringOffsetWidth: {
        3: '3px',
        5: '5px',
      }
    }
  }
}
```

## Accessibility Considerations

- Use divide utilities to create visual hierarchy
- Ensure sufficient contrast between divided sections
- Don't rely solely on dividers to separate content
- Combine with spacing for better visual separation
- Test divide colors against different backgrounds
- Use color + visual spacing for accessibility

## Performance Tips

- Divide utilities generate minimal CSS
- Use CSS variables for custom divide colors
- Combine divide with border utilities cautiously
- Ring shadows are performant for focus states
- Arbitrary values work well for custom styling
