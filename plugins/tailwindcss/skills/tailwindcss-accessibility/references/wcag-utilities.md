---
name: wcag-utilities
description: sr-only, contrast ratios, touch targets 44x44, motion-safe/motion-reduce utilities
when-to-use: Implementing WCAG 2.2 compliance, screen reader support, motion preferences
keywords: sr-only, contrast, touch-target, motion-safe, motion-reduce, wcag, aria
priority: high
requires: null
related: focus-patterns.md
---

# WCAG Utilities

## Screen Reader Only (sr-only)

Visually hidden but accessible to screen readers:

```html
<!-- Icon-only button with accessible label -->
<button class="p-2 rounded-md" aria-label="Close">
  <XIcon class="h-5 w-5" />
  <span class="sr-only">Close dialog</span>
</button>

<!-- Accessible table caption -->
<table>
  <caption class="sr-only">User accounts and their status</caption>
  <!-- ... -->
</table>
```

### not-sr-only

Reveal content that was sr-only (useful for skip links):

```html
<a class="sr-only focus:not-sr-only focus:absolute focus:top-4">
  Skip to content
</a>
```

## Contrast Ratios (WCAG 2.2)

| Level | Normal Text | Large Text (18px+ bold, 24px+) |
|-------|-------------|-------------------------------|
| AA | 4.5:1 | 3:1 |
| AAA | 7:1 | 4.5:1 |
| UI Components | 3:1 | 3:1 |

### Ensuring Contrast

Define `--color-foreground` and `--color-background` in `@theme` with sufficient contrast. Use `oklch` for perceptual uniformity. Test with browser DevTools contrast checker or axe-core. Avoid light grays on white (e.g., `text-gray-300 bg-white` fails WCAG).

## Touch Targets (44x44px minimum)

WCAG 2.2 Success Criterion 2.5.8 — minimum 44x44 CSS pixels:

```html
<!-- Minimum touch target -->
<button class="min-h-11 min-w-11 flex items-center justify-center">
  <PlusIcon class="h-5 w-5" />
</button>

<!-- Inline link with adequate target -->
<a href="/settings" class="inline-flex items-center min-h-11 px-3">
  Settings
</a>

```

## Motion Preferences

Respect `prefers-reduced-motion`:

```html
<!-- Animation only when user allows -->
<div class="motion-safe:animate-spin motion-reduce:animate-none">
  <Spinner />
</div>

<!-- Transitions only when safe -->
<div class="motion-safe:transition-all motion-safe:duration-300
  motion-reduce:transition-none">
  Content
</div>

<!-- Reduced motion alternative -->
<div class="motion-safe:animate-bounce motion-reduce:opacity-100">
  Notification badge
</div>
```

### Global Reduced Motion Reset

Add a `@layer base` rule with `prefers-reduced-motion: reduce` media query to set `animation-duration`, `transition-duration` to `0.01ms` and `scroll-behavior: auto` on all elements.

## ARIA Patterns

- **Live regions**: `aria-live="polite" aria-atomic="true"` with `sr-only` for dynamic updates
- **Disabled**: `disabled aria-disabled="true"` with `opacity-50 cursor-not-allowed`
- **Loading**: `aria-busy="true"` with `motion-safe:animate-spin` spinner
