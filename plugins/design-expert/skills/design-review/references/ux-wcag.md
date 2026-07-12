---
name: ux-wcag
description: WCAG 2.2 AA accessibility requirements and implementation
when-to-use: Ensuring accessibility compliance, implementing focus management, validating color contrast
keywords: accessibility, wcag, wcag 2.2, contrast, focus, keyboard navigation
priority: critical
related: ux-nielsen.md, ux-laws.md, ux-patterns.md
---

# Accessibility (WCAG 2.2 AA)

## Color Contrast Requirements

```
Normal text (<18px):        4.5:1 minimum
Large text (≥18px bold):    3:1 minimum
UI components:              3:1 minimum
Focus indicators (NEW):     3:1 minimum
```

---

## Focus Management

```tsx
// WCAG 2.2 REQUIRES visible focus indicators
<Button className="
  focus:outline-none
  focus-visible:ring-2
  focus-visible:ring-ring
  focus-visible:ring-offset-2
">

// Focus trap in modals (REQUIRED)
<Dialog>
  <DialogContent
    onOpenAutoFocus={(e) => firstInput.current?.focus()}
    onCloseAutoFocus={(e) => triggerButton.current?.focus()}
  >
```

---

## Keyboard Navigation

```
Tab           → Move forward through focusable elements
Shift+Tab     → Move backward
Enter/Space   → Activate buttons/links
Escape        → Close modals/dropdowns
Arrow keys    → Navigate within components (tabs, menus)
```

---

## Reduced Motion

```tsx
import { useReducedMotion } from "framer-motion";

function AnimatedComponent() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
    />
  );
}
```

---

## Touch Targets & Mobile UX

### Minimum Touch Target Sizes

| Platform | Minimum Size | Recommended |
|----------|--------------|-------------|
| Material Design | 48×48 dp | 56×56 dp for primary |
| Apple HIG | 44×44 pt | 44×44 pt |
| WCAG 2.2 | 24×24 px | 44×44 px |

```tsx
// CORRECT - 48px touch target
<button className="min-h-12 min-w-12 p-3 touch-manipulation">
  <X className="h-6 w-6" />
  <span className="sr-only">Close</span>
</button>

// WRONG - Too small
<button className="p-1">
  <X className="h-4 w-4" />
</button>
```

---

## Screen Reader Support

```tsx
// Hidden but accessible to screen readers
<span className="sr-only">Close menu</span>

// Skip links
<a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:p-4">
  Skip to main content
</a>

// Aria labels
<button aria-label="Toggle dark mode">
  <Moon className="h-4 w-4" />
</button>

// Error association
<Input
  id="email"
  aria-invalid="true"
  aria-describedby="email-error"
/>
<p id="email-error" className="text-destructive">
  Invalid email format
</p>
```

---

## CHECKLIST: WCAG 2.2 AA

- [ ] 4.5:1 contrast for text
- [ ] 3:1 contrast for UI components
- [ ] Visible focus indicators
- [ ] Keyboard navigable
- [ ] Reduced motion respected
- [ ] Touch targets ≥ 48×48 dp
- [ ] Screen reader support
- [ ] ARIA labels where needed
