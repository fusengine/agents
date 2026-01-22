---
name: states
description: Interactivity states and control utilities for Tailwind CSS
---

# Interactivity States & Control Utilities

Control user interaction behavior, text selection, pointer events, touch actions, and form element styling.

## User Select

Control text selection behavior.

| Utility | CSS |
|---------|-----|
| select-none | user-select: none; |
| select-text | user-select: text; |
| select-all | user-select: all; |
| select-auto | user-select: auto; |

### User Select Examples

Prevent text selection on UI elements:
```html
<button class="select-none">Don't select this</button>
```

Allow selection on content areas:
```html
<p class="select-text">Select this content</p>
```

Select all text when clicked:
```html
<code class="select-all">const message = "Hello";</code>
```

## Pointer Events

Control whether an element can be interacted with.

| Utility | CSS |
|---------|-----|
| pointer-events-none | pointer-events: none; |
| pointer-events-auto | pointer-events: auto; |

### Pointer Events Examples

Disable interaction on overlay or disabled content:
```html
<div class="pointer-events-none opacity-50">
  Disabled content - cannot click
</div>
```

Re-enable specific interactive elements:
```html
<div class="pointer-events-none">
  <button class="pointer-events-auto">Click me</button>
</div>
```

Make links non-interactive:
```html
<a href="#" class="pointer-events-none text-gray-400">
  Inactive link
</a>
```

## Touch Action

Define how touch gestures are handled on the element.

| Utility | CSS |
|---------|-----|
| touch-auto | touch-action: auto; |
| touch-none | touch-action: none; |
| touch-pan-x | touch-action: pan-x; |
| touch-pan-y | touch-action: pan-y; |
| touch-pan-up | touch-action: pan-up; |
| touch-pan-down | touch-action: pan-down; |
| touch-pan-left | touch-action: pan-left; |
| touch-pan-right | touch-action: pan-right; |
| touch-pinch-zoom | touch-action: pinch-zoom; |
| touch-manipulation | touch-action: manipulation; |

### Touch Action Examples

Horizontal scrolling with snap (carousel):
```html
<div class="touch-pan-x snap-x overflow-x-auto">
  <!-- Allow horizontal pan, prevent vertical scroll -->
</div>
```

Vertical scrolling only:
```html
<div class="touch-pan-y overflow-y-auto">
  <!-- Allow vertical pan only -->
</div>
```

Prevent all touch gestures (custom canvas):
```html
<canvas class="touch-none"></canvas>
```

Allow zoom with pinch but prevent double-tap:
```html
<div class="touch-manipulation">
  <!-- Allow pan and zoom, prevent double-tap -->
</div>
```

## Resize

Control whether an element can be resized.

| Utility | CSS |
|---------|-----|
| resize | resize: both; |
| resize-none | resize: none; |
| resize-y | resize: vertical; |
| resize-x | resize: horizontal; |

### Resize Examples

Allow textarea resizing:
```html
<textarea class="resize p-2 border rounded">
  Resizable textarea
</textarea>
```

Prevent resizing on specific inputs:
```html
<textarea class="resize-none p-2 border rounded">
  Non-resizable textarea
</textarea>
```

Vertical resize only:
```html
<div class="resize-y overflow-hidden border">
  Vertically resizable box
</div>
```

## Caret Color

Set the color of the text cursor in form inputs.

| Utility | CSS |
|---------|-----|
| caret-{color} | caret-color: {color}; |

Supports all Tailwind colors (red-500, blue-600, etc.) and opacity modifiers.

### Caret Color Examples

Colored input cursor:
```html
<input
  type="text"
  class="caret-pink-500 border rounded px-3 py-2"
  placeholder="Type here..."
/>
```

Caret with dark mode:
```html
<textarea class="caret-blue-500 dark:caret-yellow-400">
  Colored cursor
</textarea>
```

Custom opacity:
```html
<input type="email" class="caret-red-500/75" />
```

## Accent Color

Define the accent color for form controls (checkboxes, radios, range inputs).

| Utility | CSS |
|---------|-----|
| accent-{color} | accent-color: {color}; |

Supports all Tailwind colors and opacity modifiers.

### Accent Color Examples

Colored checkbox:
```html
<input
  type="checkbox"
  class="accent-blue-600"
/>
```

Colored radio button:
```html
<input
  type="radio"
  class="accent-green-500"
  name="option"
/>
```

Colored range slider:
```html
<input
  type="range"
  class="accent-purple-600"
/>
```

Combined with dark mode:
```html
<input
  type="checkbox"
  class="accent-blue-500 dark:accent-blue-400"
/>
```

## Advanced Patterns

### Disabled Form Group

Combine multiple utilities for disabled state:
```html
<fieldset class="select-none pointer-events-none opacity-50">
  <input type="text" class="caret-gray-300" />
  <input type="checkbox" class="accent-gray-300" />
  <button>Disabled</button>
</fieldset>
```

### Custom Drag Handle

Control interaction on drag handlers:
```html
<div class="cursor-grab active:cursor-grabbing touch-none select-none">
  ⋮⋮ Drag handle
</div>
```

### Interactive Canvas

Prevent scrolling while interacting with canvas:
```html
<canvas class="touch-none" width="800" height="600"></canvas>
```

### Form Group with Custom Accents

Create visually consistent form styling:
```html
<form class="space-y-4">
  <input
    type="text"
    class="caret-brand-500 border-brand-300 rounded"
  />
  <input
    type="checkbox"
    class="accent-brand-600"
  />
  <textarea class="caret-brand-500 resize-y"></textarea>
</form>
```

## Responsive & Dark Mode

All state utilities support responsive prefixes and dark mode:
```html
<input
  class="
    caret-blue-500 dark:caret-blue-400
    md:accent-blue-600 dark:md:accent-blue-500
    lg:pointer-events-auto
  "
/>
```

## Use Cases

| Utility | Use Case |
|---------|----------|
| `select-none` | UI elements, buttons, labels |
| `select-all` | Code blocks, inline commands |
| `pointer-events-none` | Disabled states, overlays, tooltips |
| `touch-none` | Custom controls, canvas elements |
| `touch-pan-x` | Horizontal carousels, galleries |
| `touch-pan-y` | Vertical scrolling areas |
| `touch-manipulation` | General touch-enabled content |
| `resize-none` | Text inputs, search bars |
| `resize-y` | Expandable textareas |
| `caret-{color}` | Branded form inputs |
| `accent-{color}` | Branded checkboxes and toggles |
