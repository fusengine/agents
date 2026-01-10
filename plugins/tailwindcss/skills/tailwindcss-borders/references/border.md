# Border Utilities

## Border Width

Apply border width to all sides or individual sides.

### All Sides

```html
<div class="border">border: 1px</div>
<div class="border-0">border-width: 0</div>
<div class="border-2">border: 2px</div>
<div class="border-4">border: 4px</div>
<div class="border-8">border: 8px</div>
```

Default sizes: `0`, `1px`, `2px`, `4px`, `8px`

### Individual Sides

```html
<!-- Top border -->
<div class="border-t-4 border-indigo-500">border-top: 4px</div>

<!-- Right border -->
<div class="border-r-4 border-indigo-500">border-right: 4px</div>

<!-- Bottom border -->
<div class="border-b-4 border-indigo-500">border-bottom: 4px</div>

<!-- Left border -->
<div class="border-l-4 border-indigo-500">border-left: 4px</div>

<!-- Horizontal borders -->
<div class="border-x-4 border-indigo-500">border-left & border-right: 4px</div>

<!-- Vertical borders -->
<div class="border-y-4 border-indigo-500">border-top & border-bottom: 4px</div>
```

## Border Color

### Basic Colors

```html
<div class="border-4 border-indigo-500">Indigo border</div>
<div class="border-4 border-purple-500">Purple border</div>
<div class="border-4 border-sky-500">Sky border</div>
<div class="border-4 border-slate-900">Slate border</div>
<div class="border-4 border-gray-500">Gray border</div>
```

### Per-Side Border Colors

```html
<!-- Different colors per side -->
<div class="border-2 border-t-blue-500 border-r-pink-500 border-b-green-500 border-l-yellow-500">
  Multi-color borders
</div>

<!-- Grouped sides -->
<div class="border-x-2 border-x-indigo-500">
  Horizontal sides
</div>

<div class="border-y-2 border-y-purple-500">
  Vertical sides
</div>
```

### Opacity Modifiers

```html
<div class="border-4 border-red-500/50">50% opacity</div>
<div class="border-4 border-blue-500/75">75% opacity</div>
<div class="border-4 border-green-500/25">25% opacity</div>
```

### Arbitrary Colors

```html
<div class="border-4 border-[#e5e7eb]">Custom hex color</div>
<div class="border-4 border-[rgb(99,102,241)]">RGB color</div>
<div class="border-4 border-[hsl(217,91%,60%)]">HSL color</div>
```

## Border Style

Control the line style of borders.

```html
<!-- Solid (default) -->
<div class="border-4 border-solid border-indigo-500">
  Solid border
</div>

<!-- Dashed -->
<div class="border-4 border-dashed border-indigo-500">
  Dashed border
</div>

<!-- Dotted -->
<div class="border-4 border-dotted border-indigo-500">
  Dotted border
</div>

<!-- Double -->
<div class="border-4 border-double border-indigo-500">
  Double border
</div>

<!-- None -->
<div class="border-4 border-none border-indigo-500">
  No border
</div>
```

## Border Radius

Round corners of elements.

### All Corners

```html
<!-- Relative size keywords -->
<div class="rounded-none">Sharp corners</div>
<div class="rounded-sm">Small radius</div>
<div class="rounded">Default radius (0.25rem)</div>
<div class="rounded-md">Medium radius (0.375rem)</div>
<div class="rounded-lg">Large radius (0.5rem)</div>
<div class="rounded-xl">Extra large radius (0.75rem)</div>
<div class="rounded-2xl">2XL radius (1rem)</div>
<div class="rounded-3xl">3XL radius (1.5rem)</div>
<div class="rounded-full">Fully rounded (9999px)</div>
```

### Individual Corners

```html
<!-- Top corners -->
<div class="rounded-t-lg">Top-left & top-right</div>

<!-- Right corners -->
<div class="rounded-r-lg">Top-right & bottom-right</div>

<!-- Bottom corners -->
<div class="rounded-b-lg">Bottom-left & bottom-right</div>

<!-- Left corners -->
<div class="rounded-l-lg">Top-left & bottom-left</div>

<!-- Specific corners -->
<div class="rounded-tl-lg">Top-left only</div>
<div class="rounded-tr-lg">Top-right only</div>
<div class="rounded-bl-lg">Bottom-left only</div>
<div class="rounded-br-lg">Bottom-right only</div>
```

### Arbitrary Values

```html
<div class="rounded-[4px]">4px radius</div>
<div class="rounded-[20%]">20% radius</div>
<div class="rounded-t-[10px] rounded-b-[20px]">Different sides</div>
```

## Responsive Variants

```html
<!-- Responsive border width -->
<div class="border md:border-2 lg:border-4">
  Responsive borders
</div>

<!-- Responsive border colors -->
<div class="border-2 border-blue-500 md:border-purple-500 lg:border-indigo-500">
  Responsive colors
</div>

<!-- Responsive border radius -->
<div class="rounded md:rounded-lg lg:rounded-2xl">
  Responsive radius
</div>
```

## State Variants

```html
<!-- Hover states -->
<button class="border-2 border-gray-400 hover:border-gray-600">
  Hover border
</button>

<!-- Focus states -->
<input class="border-2 border-gray-300 focus:border-blue-500" />

<!-- Disabled states -->
<input class="border-2 border-gray-300 disabled:border-gray-200" />
```

## Common Patterns

### Card with Border

```html
<div class="rounded-lg border-2 border-gray-200 p-6">
  Card content
</div>
```

### Button with Border

```html
<button class="px-4 py-2 border-2 border-indigo-500 rounded-lg hover:border-indigo-600">
  Bordered Button
</button>
```

### Input with Bottom Border

```html
<input class="pb-2 border-b-2 border-gray-300 focus:border-blue-500" />
```

### Colored Divider

```html
<div class="border-t-4 border-indigo-500 my-4"></div>
```

## Configuration

### Custom Border Widths

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      borderWidth: {
        3: '3px',
        5: '5px',
        6: '6px',
      }
    }
  }
}
```

### Custom Border Radius

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      }
    }
  }
}
```

## Accessibility Notes

- Use sufficient border contrast for visibility
- Don't rely solely on borders to convey meaning
- Border colors should meet WCAG contrast requirements
- Combine with other visual indicators for clarity
