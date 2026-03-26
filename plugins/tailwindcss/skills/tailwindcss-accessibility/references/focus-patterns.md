---
name: focus-patterns
description: focus-visible, ring utilities, outline utilities, keyboard navigation patterns
when-to-use: Implementing keyboard-accessible focus indicators on interactive elements
keywords: focus-visible, ring, outline, keyboard, navigation, skip-link
priority: high
requires: null
related: wcag-utilities.md
---

# Focus Patterns

## focus-visible vs focus

```html
<!-- CORRECT: Only shows on keyboard focus -->
<button class="focus-visible:ring-2 focus-visible:ring-primary
  focus-visible:ring-offset-2 rounded-md">
  Button
</button>

<!-- WRONG: Shows on mouse click too -->
<button class="focus:ring-2 focus:ring-primary">Button</button>
```

`focus-visible` activates only on keyboard navigation, avoiding unwanted rings on mouse clicks.

## Ring Utilities

| Class | Effect |
|-------|--------|
| `ring-0` | No ring |
| `ring-1` / `ring-2` | 1px / 2px ring |
| `ring-primary` | Ring color from theme |
| `ring-offset-2` | 2px gap between element and ring |
| `ring-offset-background` | Offset color matches background |

### Standard Focus Pattern

```html
<button class="rounded-md transition-colors
  focus-visible:outline-none
  focus-visible:ring-2
  focus-visible:ring-ring
  focus-visible:ring-offset-2">
  Interactive Element
</button>
```

## Outline Utilities

```html
<!-- Outline approach (alternative to ring) -->
<a href="/about" class="rounded-sm
  focus-visible:outline-2
  focus-visible:outline-offset-2
  focus-visible:outline-primary">
  About
</a>
```

## Skip Navigation Link

```html
<a href="#main-content"
  class="sr-only focus:not-sr-only
    focus:fixed focus:top-4 focus:left-4 focus:z-50
    focus:rounded-md focus:bg-primary focus:px-4 focus:py-2
    focus:text-primary-foreground">
  Skip to main content
</a>

<main id="main-content" tabindex="-1">
  <!-- Page content -->
</main>
```

## Focus Within

```html
<!-- Parent reacts when any child receives focus -->
<div class="rounded-lg border p-4
  focus-within:ring-2 focus-within:ring-primary">
  <label for="email">Email</label>
  <input id="email" type="email" class="border rounded-md px-3 py-2" />
</div>
```

## Focus Trap

For modals/dialogs, use Radix UI or headless UI for focus trapping. Tailwind handles visual styling; the library manages keyboard trap logic.

## Keyboard Navigation Checklist

1. All interactive elements reachable via Tab
2. Focus order follows visual layout
3. Focus visible on every interactive element
4. Escape closes modals/dropdowns
5. Arrow keys navigate within composite widgets
6. Enter/Space activates buttons and links
