---
name: motion-patterns
description: Motion patterns
---

# Motion Patterns

## PHILOSOPHY

**Orchestrated > Scattered**

- ONE cohesive page load animation with stagger
- Purposeful hover states on ALL interactive elements
- CSS-only when possible, Framer Motion for complex

## FORBIDDEN

- Random animations everywhere
- bounce, pulse without purpose
- Heavy JS when CSS suffices
- Animations that distract from content

## ORCHESTRATED PAGE LOAD (CSS)

```css
@keyframes reveal {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.element-1 { animation: reveal 0.6s ease 0.1s backwards; }
.element-2 { animation: reveal 0.6s ease 0.2s backwards; }
.element-3 { animation: reveal 0.6s ease 0.3s backwards; }
```

## FRAMER MOTION STAGGER

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

<motion.div variants={container} initial="hidden" animate="show">
  {items.map(i => (
    <motion.div key={i} variants={item}>{i}</motion.div>
  ))}
</motion.div>
```

## HOVER STATES (MANDATORY)

```css
/* Card hover */
.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.1);
}

/* Button hover */
.btn {
  transition: background-color 0.2s ease, transform 0.2s ease;
}
.btn:hover {
  transform: scale(1.02);
}
.btn:active {
  transform: scale(0.98);
}
```

## FRAMER MOTION HOVER

```tsx
<motion.div
  whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: "spring", stiffness: 300 }}
>
  {children}
</motion.div>
```

## FOCUS STATES (A11Y)

```css
/* Always visible focus */
.interactive:focus-visible {
  outline: none;
  ring: 2px;
  ring-color: var(--color-primary);
  ring-offset: 2px;
}

/* Tailwind */
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
```
