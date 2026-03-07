---
name: motion-system
description: Use when establishing motion language for an app. Covers systematic entrance animations, micro-interactions, page transitions, and reduced-motion support.
versions:
  framer-motion: "11"
user-invocable: true
allowed-tools: Read, Write, Edit, Glob, Grep, Task
references: references/motion-principles.md, references/entrance-patterns.md, references/micro-interactions.md, references/page-transitions.md
related-skills: adding-animations, identity-system, page-layouts
---

# Motion System

## Agent Workflow (MANDATORY)

Before ANY motion system work, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** - Find existing Framer Motion usage and timing
2. **fuse-ai-pilot:research-expert** - Verify latest Framer Motion v11 patterns
3. **design-expert:identity-system** - Load motion personality from design-system.md

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

| Feature | Description |
|---------|-------------|
| **Motion Principles** | Hierarchy, duration scale, easing system |
| **Entrance Patterns** | Stagger, fade+slide, scale animations |
| **Micro-interactions** | Button press, toggle, copy, skeleton |
| **Page Transitions** | Route change, drill-down, modal transitions |

---

## Critical Rules

1. **Read design-system.md motion profile first** - Never use arbitrary durations
2. **Respect prefers-reduced-motion** - ALWAYS provide reduced motion fallback
3. **Motion hierarchy** - Primary actions > secondary > ambient
4. **Consistent easing** - Use the profile's easing throughout the app
5. **No infinite loops** - Avoid perpetual animations except loading indicators

---

## Reference Guide

### Concepts

| Topic | Reference | When to Consult |
|-------|-----------|-----------------|
| **Principles** | [motion-principles.md](references/motion-principles.md) | MANDATORY - Start here |
| **Entrances** | [entrance-patterns.md](references/entrance-patterns.md) | Component/page reveal |
| **Micro-interactions** | [micro-interactions.md](references/micro-interactions.md) | Button, toggle, copy |
| **Page Transitions** | [page-transitions.md](references/page-transitions.md) | Route changes |

---

## Quick Reference

### Duration Scale

| Level | Duration | Usage |
|-------|----------|-------|
| Quick | 150ms | Hover, press, toggle |
| Standard | 250ms | Entrances, modals |
| Emphasis | 400ms | Hero, page transitions |
| Dramatic | 600ms | Luxury reveals |

### Easing Presets

```typescript
const easing = {
  standard: "easeOut",
  entrance: [0.0, 0.0, 0.2, 1],
  exit: [0.4, 0.0, 1, 1],
  spring: { type: "spring", stiffness: 500, damping: 30 },
  luxury: [0.16, 1, 0.3, 1],
};
```

### Reduced Motion

```typescript
import { useReducedMotion } from "framer-motion";
const shouldReduce = useReducedMotion();
const duration = shouldReduce ? 0 : 0.25;
```

---

## Validation Checklist

- [ ] Motion profile matches design-system.md
- [ ] All durations use consistent scale
- [ ] prefers-reduced-motion is respected everywhere
- [ ] No infinite animations (except loaders)
- [ ] Primary actions have stronger motion than secondary
- [ ] Entrances use stagger for groups
- [ ] Page transitions are consistent across routes

---

## Best Practices

### DO
- Load motion profile from design-system.md
- Use container + stagger for list reveals
- Respect prefers-reduced-motion hook
- Keep interactions under 400ms
- Use spring easing for interactive elements

### DON'T
- Use arbitrary durations (always reference scale)
- Create infinite bouncing/pulsing animations
- Make animations slower than 600ms (except luxury)
- Forget reduced motion support
- Mix different easing styles within one app
