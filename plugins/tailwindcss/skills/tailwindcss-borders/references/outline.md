# Outline & Ring Utilities

## Outline

Outlines are drawn outside the border edge, commonly used for focus states and accessibility.

### Outline Width

```html
<!-- Default outline (1px) -->
<div class="outline">outline: 1px solid</div>

<!-- Specific widths -->
<div class="outline-1">outline-width: 1px</div>
<div class="outline-2">outline-width: 2px</div>
<div class="outline-4">outline-width: 4px</div>
<div class="outline-8">outline-width: 8px</div>

<!-- Remove outline -->
<div class="outline-0">outline: none</div>
```

### Outline Color

```html
<button class="outline-2 outline-blue-500">Blue outline</button>
<button class="outline-2 outline-indigo-500">Indigo outline</button>
<button class="outline-2 outline-cyan-500">Cyan outline</button>
<button class="outline-2 outline-pink-500">Pink outline</button>
```

### Combined Width & Color

```html
<!-- Standard usage -->
<button class="outline-2 outline-offset-2 outline-blue-500">
  Styled button
</button>

<!-- Different widths with colors -->
<button class="outline-1 outline-blue-400">Thin outline</button>
<button class="outline-4 outline-blue-600">Thick outline</button>

<!-- Opacity variants -->
<button class="outline-2 outline-blue-500/50">50% opacity</button>
<button class="outline-2 outline-blue-500/75">75% opacity</button>
```

### Outline Offset

Space between the outline and the border edge.

```html
<!-- Positive offset (outside) -->
<button class="outline-2 outline-offset-1 outline-blue-500">1px offset</button>
<button class="outline-2 outline-offset-2 outline-blue-500">2px offset</button>
<button class="outline-2 outline-offset-4 outline-blue-500">4px offset</button>
<button class="outline-2 outline-offset-8 outline-blue-500">8px offset</button>

<!-- Negative offset (inside) -->
<button class="outline-2 outline-offset-[-2px] outline-blue-500">Inside outline</button>

<!-- No offset -->
<button class="outline-2 outline-offset-0 outline-blue-500">No offset</button>
```

## Ring

Rings are inset shadows using box-shadow, useful for accessible focus indicators.

### Basic Ring

```html
<!-- Default ring (1px in v4) -->
<input class="ring ring-blue-500" />

<!-- v3 compatibility (3px) -->
<input class="ring-3 ring-blue-500" />

<!-- Specific widths -->
<input class="ring-1 ring-blue-500" />
<input class="ring-2 ring-blue-500" />
<input class="ring-4 ring-blue-500" />
<input class="ring-8 ring-blue-500" />
```

### Ring Color

```html
<input class="ring-2 ring-blue-500" />
<input class="ring-2 ring-purple-500" />
<input class="ring-2 ring-indigo-500" />
<input class="ring-2 ring-pink-500" />

<!-- With opacity -->
<input class="ring-2 ring-blue-500/50" />
<input class="ring-2 ring-blue-500/75" />
```

### Ring Offset

Add space between the ring and border.

```html
<!-- Basic ring with offset -->
<input class="ring-2 ring-blue-500 ring-offset-2" />
<input class="ring-2 ring-blue-500 ring-offset-4" />
<input class="ring-2 ring-blue-500 ring-offset-8" />

<!-- Custom offset values -->
<input class="ring-2 ring-blue-500 ring-offset-[3px]" />
```

### Ring Offset Color

Change the color of the space between ring and border.

```html
<input class="ring-2 ring-blue-500 ring-offset-2 ring-offset-white" />
<input class="ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-50" />
<input class="ring-2 ring-blue-500 ring-offset-2 ring-offset-indigo-100" />

<!-- Useful for dark mode -->
<input class="ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900" />
```

## Common Patterns

### Focus Indicator

```html
<!-- Modern accessible focus state -->
<button class="px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
  Accessible button
</button>

<!-- Alternative with outline -->
<button class="px-4 py-2 rounded-lg focus:outline-none focus:outline-2 focus:outline-offset-2 focus:outline-blue-500">
  Outline focus
</button>
```

### Form Input Focus

```html
<input
  class="px-4 py-2 border-2 border-gray-300 rounded-lg
         focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
  type="text"
/>
```

### Interactive Button

```html
<button class="
  px-6 py-3
  bg-indigo-600 text-white
  rounded-lg
  border-2 border-indigo-600
  hover:bg-indigo-700 hover:border-indigo-700
  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
">
  Interactive
</button>
```

## Responsive Variants

```html
<!-- Responsive outline -->
<button class="outline md:outline-2 lg:outline-4 outline-blue-500">
  Responsive outline
</button>

<!-- Responsive ring -->
<input class="ring-1 md:ring-2 lg:ring-4 ring-blue-500" />

<!-- Responsive ring offset -->
<input class="ring-2 ring-offset-1 md:ring-offset-2 lg:ring-offset-4 ring-blue-500" />
```

## State Variants

```html
<!-- Focus states -->
<input class="focus:outline-2 focus:outline-blue-500" />
<input class="focus:ring-2 focus:ring-blue-500" />

<!-- Hover states -->
<button class="outline hover:outline-2 outline-gray-400 hover:outline-gray-600">
  Hover outline
</button>

<!-- Active states -->
<button class="ring-1 active:ring-2 ring-blue-500">
  Active ring
</button>
```

## Configuration

### Custom Ring Sizes

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      ringWidth: {
        3: '3px',
        5: '5px',
        6: '6px',
      }
    }
  }
}
```

### Custom Ring Offset Sizes

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

### Custom Outline Offsets

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      outlineOffset: {
        3: '3px',
        5: '5px',
        6: '6px',
      }
    }
  }
}
```

## Accessibility Best Practices

- Always provide visible focus indicators
- Use sufficient contrast between focus ring and background
- Ring or outline width should be at least 2px for visibility
- Ring offset should be at least 2px to prevent visual overlap
- Test focus indicators in both light and dark modes
- Ensure keyboard navigation shows clear focus states

## v4 to v4.1 Migration

### Ring Width Changes

```html
<!-- v3 code - 3px ring -->
<input class="ring ring-blue-500" />

<!-- v4+ code - use ring-3 for same 3px width -->
<input class="ring-3 ring-blue-500" />

<!-- v4 default - 1px ring -->
<input class="ring ring-blue-500" />
```
