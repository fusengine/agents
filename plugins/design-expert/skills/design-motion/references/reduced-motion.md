---
name: reduced-motion
description: Accessibility — prefers-reduced-motion patterns, Framer Motion hooks, WCAG 2.2 compliance
when-to-use: Implementing reduced motion fallbacks, accessibility audit for animations
keywords: prefers-reduced-motion, accessibility, a11y, WCAG, useReducedMotion, vestibular
priority: high
related: motion-patterns.md, motion-principles.md
---

# Reduced Motion Accessibility

## prefers-reduced-motion Media Query

```css
/* Global override */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
/* Per-element: simplify instead of remove */
.card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
@media (prefers-reduced-motion: reduce) {
  .card { transition: none; }
}
```

## Framer Motion useReducedMotion() Hook

```tsx
import { useReducedMotion, motion } from 'framer-motion';

function AnimatedCard({ children }) {
  const shouldReduce = useReducedMotion();
  return (
    <motion.div
      initial={shouldReduce ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={shouldReduce ? {} : { y: -4, scale: 1.01 }}
      transition={shouldReduce ? { duration: 0 } : { duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
```

### Global Reduction

```tsx
import { MotionConfig } from 'framer-motion';
// reducedMotion="user" respects OS setting globally
<MotionConfig reducedMotion="user">{children}</MotionConfig>
```

## Which Animations to Disable vs Simplify

| Animation Type | Action | Reason |
|---------------|--------|--------|
| Parallax scrolling | **Disable** | Vestibular discomfort |
| Auto-playing carousels | **Disable** | Unexpected movement |
| Zoom/scale transitions | **Disable** | Spatial disorientation |
| Page slide transitions | **Simplify** → instant swap | Keep navigation feedback |
| Opacity fade-in | **Keep** | Non-motion, safe |
| Color/background transitions | **Keep** | No spatial movement |
| Loading spinners | **Simplify** → static indicator | Essential feedback |

## WCAG 2.2 Compliance

- **SC 2.3.3 (AAA)**: Animation from interactions can be disabled
- **SC 2.3.1 (A)**: No content flashes more than 3 times/second
- **SC 2.2.2 (A)**: Pause/stop/hide for auto-moving content
- Provide a manual toggle in addition to respecting OS preference

## Testing

| OS | Path |
|----|------|
| macOS | System Settings > Accessibility > Display > Reduce motion |
| iOS | Settings > Accessibility > Motion > Reduce Motion |
| Windows | Settings > Accessibility > Visual Effects > Animation effects OFF |
| Android | Settings > Accessibility > Remove animations |
| DevTools | Rendering tab > Emulate CSS media > prefers-reduced-motion: reduce |
