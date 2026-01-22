---
name: 05-add-motion
description: Add Framer Motion animations matching existing patterns
prev_step: references/design/04-code-component.md
next_step: references/design/06-validate-a11y.md
---

# 05 - Add Motion

**Add animations that match existing motion patterns.**

## When to Use

- After component is coded (04-code-component)
- When adding interactivity
- For page transitions

---

## Framer Motion Setup

### Import

```tsx
import { motion } from 'framer-motion'
```

### Animation Variants (extract if reused)

```tsx
// animations/fade-up.ts
export const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}
```

---

## Common Patterns

### Page Load Animation

```tsx
<motion.div
  initial="hidden"
  animate="visible"
  variants={staggerContainer}
>
  <motion.h1 variants={fadeUpVariants}>Title</motion.h1>
  <motion.p variants={fadeUpVariants}>Description</motion.p>
</motion.div>
```

### Hover Effects

```tsx
// Card hover
<motion.div
  whileHover={{ y: -4 }}
  transition={{ duration: 0.2 }}
>

// Button hover
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
>
```

### Scroll Animations

```tsx
<motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
>
```

---

## Match Existing Patterns

### Check Phase 01 Analysis

```text
From 01-analyze-design:
- Existing stagger delay: 0.1s
- Existing hover lift: y: -4
- Existing duration: 0.2s - 0.3s
- Existing easing: ease-out
```

### Consistency Rules

```tsx
// ✅ Match existing timing
transition={{ duration: 0.2, ease: "easeOut" }}

// ❌ Don't introduce new timing
transition={{ duration: 0.5, ease: "anticipate" }}
```

---

## Anti-Patterns

### NEVER

```tsx
// ❌ Random bouncing
animate={{ y: [0, -10, 0] }}
transition={{ repeat: Infinity }}

// ❌ Excessive effects
whileHover={{ scale: 1.2, rotate: 5, boxShadow: "..." }}

// ❌ Slow animations
transition={{ duration: 1.5 }}
```

### INSTEAD

```tsx
// ✅ Purposeful, subtle
whileHover={{ y: -4 }}
transition={{ duration: 0.2 }}
```

---

## Validation Checklist

```text
[ ] Animations match existing patterns
[ ] Motion variants extracted if reused
[ ] Hover states on interactive elements
[ ] No excessive/random animations
[ ] Respects prefers-reduced-motion
[ ] Performance optimized (will-change)
```

---

## Next Phase

-> Proceed to `06-validate-a11y.md`
