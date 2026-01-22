---
name: framer-motion
description: Framer Motion reference
---

# Framer Motion Reference

## Installation

```bash
bun add framer-motion
```

## Core Concepts

### motion Component

Wrap any HTML element with `motion.` prefix:

```tsx
import { motion } from "framer-motion";

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
/>
```

### Animatable Properties

| Category | Properties |
|----------|------------|
| Transform | `x`, `y`, `z`, `rotate`, `rotateX`, `rotateY`, `rotateZ`, `scale`, `scaleX`, `scaleY`, `skew`, `skewX`, `skewY` |
| Layout | `width`, `height` |
| Visual | `opacity`, `backgroundColor`, `borderRadius`, `boxShadow` |
| SVG | `pathLength`, `pathOffset`, `fillOpacity`, `strokeWidth` |

## Animation Types

### Spring Animation

```tsx
transition={{
  type: "spring",
  stiffness: 300,  // Higher = faster
  damping: 20,     // Higher = less bounce
  mass: 1          // Higher = slower
}}
```

### Tween Animation

```tsx
transition={{
  type: "tween",
  duration: 0.3,
  ease: "easeOut"  // or "linear", "easeIn", "easeInOut"
}}
```

### Inertia

```tsx
// For drag and scroll
transition={{
  type: "inertia",
  velocity: 50,
  power: 0.8
}}
```

## Variants

### Defining Variants

```tsx
const variants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3
    }
  }
};

<motion.div
  variants={variants}
  initial="hidden"
  animate="visible"
/>
```

### Orchestration

```tsx
const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",  // or "afterChildren"
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};
```

## Gestures

### Hover and Tap

```tsx
<motion.button
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.9 }}
  whileFocus={{ boxShadow: "0 0 0 3px blue" }}
/>
```

### Drag

```tsx
<motion.div
  drag              // Enable drag on both axes
  drag="x"          // or "y" for single axis
  dragConstraints={{ left: -100, right: 100, top: -50, bottom: 50 }}
  dragElastic={0.2} // Resistance at boundaries
  dragMomentum={true}
  onDragStart={() => {}}
  onDragEnd={() => {}}
/>
```

## Layout Animations

### Automatic Layout

```tsx
<motion.div layout>
  {/* Content changes trigger smooth animation */}
</motion.div>
```

### Shared Layout

```tsx
<motion.div layoutId="shared-element">
  {/* Same layoutId animates between states */}
</motion.div>
```

## AnimatePresence

### Exit Animations

```tsx
import { AnimatePresence } from "framer-motion";

<AnimatePresence>
  {items.map((item) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    />
  ))}
</AnimatePresence>
```

### Modes

```tsx
<AnimatePresence mode="wait">    {/* Wait for exit before enter */}
<AnimatePresence mode="sync">    {/* Animate simultaneously */}
<AnimatePresence mode="popLayout"> {/* Layout animation on exit */}
```

## Hooks

### useAnimation

```tsx
import { useAnimation } from "framer-motion";

function Component() {
  const controls = useAnimation();

  async function sequence() {
    await controls.start({ x: 100 });
    await controls.start({ y: 100 });
    return await controls.start({ x: 0, y: 0 });
  }

  return <motion.div animate={controls} />;
}
```

### useScroll

```tsx
import { useScroll, useTransform } from "framer-motion";

function Component() {
  const { scrollY, scrollYProgress } = useScroll();

  // Transform scroll progress to other values
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 1]);

  return <motion.div style={{ opacity, scale }} />;
}
```

### useMotionValue

```tsx
import { useMotionValue, useTransform } from "framer-motion";

function Component() {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-100, 0, 100], [0, 1, 0]);

  return (
    <motion.div
      drag="x"
      style={{ x, opacity }}
    />
  );
}
```

### useReducedMotion

```tsx
import { useReducedMotion } from "framer-motion";

function Component() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      animate={shouldReduceMotion ? {} : { scale: [1, 1.2, 1] }}
    />
  );
}
```

## Performance Tips

### Use transform properties

```tsx
// Good - GPU accelerated
animate={{ x: 100, scale: 1.2, rotate: 45 }}

// Avoid - triggers layout
animate={{ width: 200, left: 100 }}
```

### Use layoutId carefully

```tsx
// Only use layoutId when elements truly share identity
// across different DOM positions
```

### Avoid animating many elements

```tsx
// Use staggerChildren instead of individual delays
const container = {
  visible: {
    transition: { staggerChildren: 0.05 }
  }
};
```
