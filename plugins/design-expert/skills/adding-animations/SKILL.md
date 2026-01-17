---
name: adding-animations
description: Add micro-interactions and animations using Framer Motion and CSS. Use when user asks about animations, transitions, hover effects, loading states, or motion design.
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Adding Animations

Create delightful micro-interactions and animations with Framer Motion and CSS.

## Workflow

```
Animation Implementation:
- [ ] Step 1: Identify interaction point
- [ ] Step 2: Choose animation type
- [ ] Step 3: Set timing (<100ms for feedback)
- [ ] Step 4: Implement with Framer Motion or CSS
- [ ] Step 5: Add reduced motion support
- [ ] Step 6: Test performance
```

## Animation Principles

### Timing Guidelines

| Interaction | Duration | Easing |
|-------------|----------|--------|
| Hover feedback | 50-100ms | ease-out |
| Button press | 100-150ms | ease-out |
| Modal open | 200-300ms | ease-out |
| Modal close | 150-200ms | ease-in |
| Page transition | 300-400ms | ease-in-out |
| Loading skeleton | 1500-2000ms | linear |

### Golden Rule

**Feedback must be < 100ms** for perceived instantaneous response.

## Framer Motion Patterns

### Basic Animation

```tsx
import { motion } from "framer-motion";

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
>
  Content
</motion.div>
```

### Hover Effects

```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
>
  Click me
</motion.button>
```

### Staggered Children

```tsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

<motion.ul variants={container} initial="hidden" animate="show">
  {items.map((item) => (
    <motion.li key={item.id} variants={item}>
      {item.content}
    </motion.li>
  ))}
</motion.ul>
```

### Exit Animations

```tsx
import { AnimatePresence } from "framer-motion";

<AnimatePresence mode="wait">
  {isVisible && (
    <motion.div
      key="modal"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      Modal content
    </motion.div>
  )}
</AnimatePresence>
```

### Scroll Animations

```tsx
import { useScroll, useTransform } from "framer-motion";

function ParallaxSection() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <motion.div style={{ y }}>
      Parallax content
    </motion.div>
  );
}
```

## CSS Animations

### Transitions

```css
/* Smooth hover */
.button {
  transition: all 150ms ease-out;
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px oklch(0% 0 0 / 0.15);
}
```

### Keyframe Animations

```css
/* Skeleton loading */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    oklch(90% 0 0) 25%,
    oklch(95% 0 0) 50%,
    oklch(90% 0 0) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite linear;
}

/* Pulse */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.pulse {
  animation: pulse 2s ease-in-out infinite;
}

/* Spin */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.spinner {
  animation: spin 1s linear infinite;
}
```

## Micro-Interactions

### Button Feedback

```tsx
<motion.button
  className="relative overflow-hidden"
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
>
  <motion.span
    className="absolute inset-0 bg-white/20"
    initial={{ scale: 0, opacity: 0 }}
    whileTap={{ scale: 2, opacity: 1 }}
    transition={{ duration: 0.3 }}
  />
  Button Text
</motion.button>
```

### Toggle Switch

```tsx
<motion.div
  className="w-14 h-8 rounded-full p-1 cursor-pointer"
  animate={{ backgroundColor: isOn ? "#22c55e" : "#e5e7eb" }}
  onClick={() => setIsOn(!isOn)}
>
  <motion.div
    className="w-6 h-6 rounded-full bg-white shadow-md"
    animate={{ x: isOn ? 24 : 0 }}
    transition={{ type: "spring", stiffness: 500, damping: 30 }}
  />
</motion.div>
```

### Success Checkmark

```tsx
const checkVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

<motion.svg viewBox="0 0 24 24" className="w-6 h-6">
  <motion.path
    d="M5 13l4 4L19 7"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    variants={checkVariants}
    initial="hidden"
    animate="visible"
  />
</motion.svg>
```

## Accessibility

### Reduced Motion Support

```tsx
import { useReducedMotion } from "framer-motion";

function AnimatedComponent() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      animate={shouldReduceMotion ? {} : { y: [0, -10, 0] }}
      transition={shouldReduceMotion ? {} : { repeat: Infinity, duration: 2 }}
    >
      Content
    </motion.div>
  );
}
```

### CSS Fallback

```css
@media (prefers-reduced-motion: reduce) {
  .animated {
    animation: none;
    transition: none;
  }
}
```

## References

For detailed animation patterns:
- Framer Motion docs: [references/framer-motion.md](references/framer-motion.md)
