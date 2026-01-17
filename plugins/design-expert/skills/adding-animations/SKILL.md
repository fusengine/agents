---
name: adding-animations
description: Add micro-interactions and animations using Framer Motion and CSS. Use when user asks about animations, transitions, hover effects, loading states, or motion design. MANDATORY for every component.
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Adding Animations (MANDATORY)

**Every component MUST have Framer Motion animations. NO EXCEPTIONS.**

## MANDATORY Animation Checklist

```
EVERY component must have:
[x] Entrance animation (fade-in, slide-up)
[x] Hover states (scale, glow, shadow)
[x] Staggered children for lists
[x] Reduced motion fallback
```

## Quick Patterns

### Container + Items (REQUIRED PATTERN)

```tsx
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

<motion.div variants={container} initial="hidden" animate="show">
  <motion.div variants={item}>Item 1</motion.div>
  <motion.div variants={item}>Item 2</motion.div>
</motion.div>
```

### Button Feedback (REQUIRED)

```tsx
<motion.button
  whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
>
  Click me
</motion.button>
```

### Card Hover (REQUIRED)

```tsx
<motion.div
  className="p-6 rounded-xl bg-card"
  whileHover={{
    y: -4,
    boxShadow: "0 20px 40px rgba(0,0,0,0.15)"
  }}
  transition={{ duration: 0.2 }}
>
  Card content
</motion.div>
```

## Timing Guidelines

| Interaction | Duration | Easing |
|-------------|----------|--------|
| Hover feedback | 50-100ms | ease-out |
| Button press | 100-150ms | ease-out |
| Modal open | 200-300ms | ease-out |
| Page transition | 300-400ms | ease-in-out |

## Accessibility (MANDATORY)

```tsx
import { useReducedMotion } from "framer-motion";

function Component() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      animate={shouldReduceMotion ? {} : { y: [0, -10, 0] }}
    />
  );
}
```

## References

For detailed patterns: [references/framer-motion.md](references/framer-motion.md)
