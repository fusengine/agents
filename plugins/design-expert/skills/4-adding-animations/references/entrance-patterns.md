---
name: entrance-patterns
description: Systematic entrance animation patterns with stagger, fade, slide, and scale
when-to-use: Animating component entrances, list reveals, page content appearance
keywords: entrance, stagger, fade, slide, scale, reveal, variants, container
priority: high
related: motion-principles.md, page-transitions.md
---

# Entrance Patterns

## Container + Stagger (Lists/Grids)

The most common pattern. Parent container orchestrates child animations.

```typescript
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
};
```

```tsx
<motion.div variants={container} initial="hidden" animate="show">
  {items.map((item) => (
    <motion.div key={item.id} variants={item}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

### Stagger Guidelines

| Item Count | Stagger Delay | Max Total |
|------------|---------------|-----------|
| 3-5 items | 0.08-0.1s | 400ms |
| 6-10 items | 0.05-0.06s | 500ms |
| 10+ items | 0.03-0.04s | 600ms |

## Fade + Slide (Default Entrance)

Most versatile entrance. Works for any element.

```typescript
const fadeSlide = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};
```

### Direction Variants

| Direction | Initial State | Usage |
|-----------|--------------|-------|
| Up (default) | `{ y: 20 }` | Cards, content blocks |
| Down | `{ y: -20 }` | Dropdowns, tooltips |
| Left | `{ x: 30 }` | Sidebar items, slide-in |
| Right | `{ x: -30 }` | Back navigation, reverse |

## Scale (Modals/Cards)

For elements that appear as an overlay or need emphasis.

```typescript
const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
  },
};
```

| Element | Scale From | Duration |
|---------|-----------|----------|
| Modal/Dialog | 0.95 | 200ms |
| Card hover | 1.0 -> 1.02 | 150ms |
| Button press | 1.0 -> 0.98 | 100ms |
| Toast | 0.9 | 200ms |

## Scroll-Triggered (Viewport)

For elements that animate when scrolled into view.

```tsx
<motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.4, ease: "easeOut" }}
/>
```

### Rules

- Use `viewport={{ once: true }}` - animate only on first view
- Set negative margin to trigger before element is fully visible
- Keep distance modest (20-40px) to avoid jarring jumps

## Exit Animations

Always wrap with `AnimatePresence` for exit animations:

```tsx
<AnimatePresence mode="wait">
  {isVisible && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
    />
  )}
</AnimatePresence>
```

Exit duration = entrance duration * 0.7
