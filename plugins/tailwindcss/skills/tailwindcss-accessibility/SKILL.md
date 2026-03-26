---
name: tailwindcss-accessibility
description: "Tailwind CSS v4.1 accessibility utilities. focus-visible, sr-only, reduced-motion, WCAG enforcement, touch targets, contrast ratios."
user-invocable: true
references: references/focus-patterns.md, references/wcag-utilities.md
related-skills: tailwindcss-core, react-shadcn
---

# Tailwind CSS Accessibility

Accessible-by-default patterns using Tailwind CSS v4.1 utility classes.

## Agent Workflow (MANDATORY)

Before ANY implementation, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** - Analyze existing a11y patterns
2. **fuse-ai-pilot:research-expert** - Verify latest WCAG 2.2 guidelines
3. **mcp__context7__query-docs** - Check Tailwind CSS a11y utilities

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

### When to Use

- Implementing keyboard-accessible interactive elements
- Adding screen reader support to visual-only content
- Respecting user motion preferences
- Ensuring sufficient color contrast ratios
- Meeting WCAG 2.2 AA/AAA compliance requirements
- Creating accessible touch targets for mobile

### Why Tailwind for Accessibility

| Feature | Benefit |
|---------|---------|
| `focus-visible` | Keyboard-only focus rings, no mouse clutter |
| `sr-only` | Screen reader content without visual display |
| `motion-safe/reduce` | Respects `prefers-reduced-motion` |
| Utility composition | Consistent a11y patterns across components |
| CSS-first config | Centralized a11y defaults via `@theme` |

---

## Critical Rules

1. **Always use `focus-visible`** — Not `focus` for interactive elements
2. **Never hide content from screen readers** — Use `sr-only` instead of `hidden`
3. **Respect motion preferences** — Wrap animations in `motion-safe:`
4. **Minimum touch target 44x44px** — Use `min-h-11 min-w-11` (2.75rem)
5. **Contrast ratios** — 4.5:1 for text, 3:1 for large text (WCAG AA)
6. **Semantic HTML first** — Tailwind enhances, never replaces semantics

---

## Quick Reference

### Focus States

```html
<button class="focus-visible:outline-2 focus-visible:outline-offset-2
  focus-visible:outline-primary rounded-md">
  Accessible Button
</button>
```

### Screen Reader Only

```html
<span class="sr-only">Open navigation menu</span>
```

### Reduced Motion

```html
<div class="motion-safe:animate-bounce motion-reduce:animate-none">
  Animated content
</div>
```

---

## Best Practices

1. **Focus rings on all interactive elements** — Buttons, links, inputs
2. **Skip links** — Add skip-to-content for keyboard navigation
3. **ARIA labels** — Supplement with `aria-label` when visual text absent
4. **Color is not the only indicator** — Use icons/text alongside color
5. **Test with keyboard only** — Tab through entire UI flow
6. **Test with screen reader** — VoiceOver (macOS), NVDA (Windows)

## Reference Guide

| Need | Reference |
|------|-----------|
| Focus rings, keyboard nav | [focus-patterns.md](references/focus-patterns.md) |
| sr-only, contrast, touch targets | [wcag-utilities.md](references/wcag-utilities.md) |
