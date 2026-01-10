# Cursor Utilities

Control the cursor appearance when hovering over elements.

## Reference

| Utility | CSS |
|---------|-----|
| cursor-auto | cursor: auto; |
| cursor-default | cursor: default; |
| cursor-pointer | cursor: pointer; |
| cursor-wait | cursor: wait; |
| cursor-text | cursor: text; |
| cursor-move | cursor: move; |
| cursor-help | cursor: help; |
| cursor-not-allowed | cursor: not-allowed; |
| cursor-none | cursor: none; |
| cursor-context-menu | cursor: context-menu; |
| cursor-progress | cursor: progress; |
| cursor-cell | cursor: cell; |
| cursor-crosshair | cursor: crosshair; |
| cursor-vertical-text | cursor: vertical-text; |
| cursor-alias | cursor: alias; |
| cursor-copy | cursor: copy; |
| cursor-no-drop | cursor: no-drop; |
| cursor-grab | cursor: grab; |
| cursor-grabbing | cursor: grabbing; |
| cursor-all-scroll | cursor: all-scroll; |
| cursor-col-resize | cursor: col-resize; |
| cursor-row-resize | cursor: row-resize; |
| cursor-n-resize | cursor: n-resize; |
| cursor-e-resize | cursor: e-resize; |
| cursor-s-resize | cursor: s-resize; |
| cursor-w-resize | cursor: w-resize; |
| cursor-ne-resize | cursor: ne-resize; |
| cursor-nw-resize | cursor: nw-resize; |
| cursor-se-resize | cursor: se-resize; |
| cursor-sw-resize | cursor: sw-resize; |
| cursor-ew-resize | cursor: ew-resize; |
| cursor-ns-resize | cursor: ns-resize; |
| cursor-nesw-resize | cursor: nesw-resize; |
| cursor-nwse-resize | cursor: nwse-resize; |
| cursor-zoom-in | cursor: zoom-in; |
| cursor-zoom-out | cursor: zoom-out; |

## Examples

### Basic Usage

Indicate that an element is interactive with a pointer cursor:
```html
<button class="cursor-pointer">Click me</button>
```

Disable interaction on an element:
```html
<div class="cursor-not-allowed">Not available</div>
```

### Resize Cursors

Show resize direction indicators:
```html
<!-- Column resize -->
<div class="cursor-col-resize">⟨ ⟩</div>

<!-- Row resize -->
<div class="cursor-row-resize">⟨ ⟩</div>

<!-- Diagonal resize -->
<div class="cursor-se-resize">↘</div>
<div class="cursor-nw-resize">↖</div>
```

### Text and Copy

```html
<!-- Text editing -->
<input type="text" class="cursor-text" />

<!-- Copy action -->
<div class="cursor-copy">Copy this</div>

<!-- Drag and drop -->
<div class="cursor-grab">Drag me</div>
<div class="cursor-grabbing">Dragging...</div>
```

### Custom Cursor

Use arbitrary values for custom cursors:
```html
<div class="cursor-[url(custom-cursor.svg)]">Custom cursor</div>
```

## Responsive Design

Use responsive prefixes to change cursor behavior at different screen sizes:
```html
<button class="cursor-default md:cursor-pointer">
  Responsive cursor
</button>
```

## Dark Mode

Cursor utilities apply in both light and dark modes:
```html
<button class="cursor-pointer dark:cursor-wait">Button</button>
```

## Use Cases

- **Interactive Elements**: `cursor-pointer` on buttons, links, and clickable areas
- **Form Inputs**: `cursor-text` on text inputs and textareas
- **Disabled States**: `cursor-not-allowed` on disabled elements
- **Drag & Drop**: `cursor-grab` and `cursor-grabbing` for draggable items
- **Resizable Elements**: Direction-specific cursors on resizable containers
- **Zoom Actions**: `cursor-zoom-in` and `cursor-zoom-out` for zoom functionality
- **Custom Cursors**: Arbitrary values for branded or unique cursor styles
