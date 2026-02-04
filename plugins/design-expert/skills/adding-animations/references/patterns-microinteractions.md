---
name: patterns-microinteractions
description: Micro-interactions, transitions, and Framer Motion patterns
when-to-use: Adding smooth animations, implementing hover effects, creating delightful interactions
keywords: micro-interactions, framer-motion, animations, transitions, effects, spring
priority: medium
related: patterns-cards.md, patterns-buttons.md, motion-patterns.md
---

# Micro-Interactions & Animations

## Button Hover Effects (Framer Motion)

```tsx
// Button hover - subtle lift
<motion.button
  whileHover={{ y: -2 }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: "spring", stiffness: 400 }}
>
```

---

## Card Hover - Elevation Change

```tsx
<motion.div
  whileHover={{
    y: -4,
    boxShadow: "0 20px 40px -12px rgb(0 0 0 / 0.15)"
  }}
  transition={{ duration: 0.2 }}
>
```

---

## Success Celebration

```tsx
<motion.div
  initial={{ scale: 0 }}
  animate={{ scale: 1 }}
  transition={{ type: "spring", bounce: 0.5 }}
>
  <CheckCircle className="h-16 w-16 text-success" />
</motion.div>
```

---

## List Stagger Animation

```tsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

<motion.ul variants={container} initial="hidden" animate="show">
  {items.map(i => (
    <motion.li key={i.id} variants={item}>{i.name}</motion.li>
  ))}
</motion.ul>
```

---

## Gradient Orbs (Background Depth)

```tsx
// Page background with depth
<div className="relative min-h-screen">
  {/* Gradient orbs */}
  <div className="absolute inset-0 -z-10 overflow-hidden">
    <div className="
      absolute top-1/4 left-1/4
      w-96 h-96
      bg-primary/20
      rounded-full
      blur-3xl
    " />
    <div className="
      absolute bottom-1/4 right-1/4
      w-64 h-64
      bg-accent/20
      rounded-full
      blur-2xl
    " />
  </div>

  {/* Content */}
  <main className="relative">
    {children}
  </main>
</div>
```

---

## CHECKLIST: Micro-Interactions

- [ ] Subtle hover effects
- [ ] Spring-based animations
- [ ] List item stagger
- [ ] Success/error feedback
- [ ] Loading state transitions
- [ ] Smooth page transitions
