---
name: motion-principles
description: Core motion design principles including hierarchy, duration scale, and easing
when-to-use: Establishing motion language for an app, setting up animation tokens
keywords: motion, principles, hierarchy, duration, easing, spring, reduced-motion
priority: high
related: entrance-patterns.md, micro-interactions.md
---

# Motion Principles

## Motion Hierarchy

Motion should communicate importance. Higher-priority elements get more noticeable animation.

| Level | Examples | Characteristics |
|-------|----------|----------------|
| **Primary** | Hero content, main CTAs, page reveals | Longer duration, more distance, spring easing |
| **Secondary** | Cards, list items, form feedback | Standard duration, subtle movement |
| **Ambient** | Background effects, idle states, decorative | Minimal or no motion, pure opacity |

## Duration Scale

Every app should define a consistent duration scale based on its motion personality.

| Level | Duration | Usage |
|-------|----------|-------|
| Instant | 0ms | Reduced motion fallback |
| Quick | 100-150ms | Hover states, button press, toggle |
| Standard | 200-300ms | Modal open, tab switch, entrance |
| Emphasis | 350-500ms | Page transition, hero reveal, drawer |
| Dramatic | 500-800ms | Luxury reveals, onboarding (rare) |

### Rules

- Exits are faster than entrances (exit = entrance * 0.7)
- Stagger delay: 0.03-0.1s per item (never > 0.15s)
- Total stagger sequence should not exceed 600ms

## Easing

| Type | CSS / Framer | When to Use |
|------|-------------|-------------|
| ease-out | `[0, 0, 0.2, 1]` | Entrances (element arriving) |
| ease-in | `[0.4, 0, 1, 1]` | Exits (element leaving) |
| ease-in-out | `[0.4, 0, 0.2, 1]` | Position changes |
| spring | `{ type: "spring" }` | Interactive (drag, press, toggle) |
| luxury | `[0.16, 1, 0.3, 1]` | Slow, cinematic reveals |

### Spring Parameters

| Personality | Stiffness | Damping | Mass |
|-------------|-----------|---------|------|
| Snappy | 500 | 30 | 1 |
| Smooth | 300 | 25 | 1 |
| Bouncy | 200 | 15 | 1 |

## Reduced Motion (MANDATORY)

```typescript
import { useReducedMotion } from "framer-motion";

function AnimatedComponent() {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduce ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={shouldReduce
        ? { duration: 0 }
        : { duration: 0.25, ease: "easeOut" }
      }
    />
  );
}
```

### Reduced Motion Rules

- **Remove**: transforms (scale, translate, rotate)
- **Keep**: opacity changes (can reduce duration)
- **Remove**: spring/bounce effects
- **Remove**: stagger delays
- **Keep**: color transitions (instant)

## CSS Custom Properties

```css
:root {
  --motion-quick: 150ms;
  --motion-standard: 250ms;
  --motion-emphasis: 400ms;
  --motion-ease-out: cubic-bezier(0, 0, 0.2, 1);
  --motion-ease-in: cubic-bezier(0.4, 0, 1, 1);
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --motion-quick: 0ms;
    --motion-standard: 0ms;
    --motion-emphasis: 0ms;
  }
}
```

## Performance Rules

- Use `transform` and `opacity` only (GPU composited)
- Avoid animating `width`, `height`, `top`, `left`
- Use `will-change` sparingly (only during animation)
- Prefer `layoutId` for shared element transitions
- Use `AnimatePresence` for exit animations
