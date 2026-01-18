---
name: generating-components
description: Generate production-ready React components using shadcn/ui, 21st.dev, and Tailwind CSS. Use when user asks for UI components, buttons, forms, cards, hero sections, or mentions design inspiration, component library, or UI generation.
allowed-tools: Read, Write, Edit, Glob, Grep, mcp__magic__21st_magic_component_builder, mcp__magic__21st_magic_component_inspiration, mcp__magic__21st_magic_component_refiner, mcp__shadcn__search_items_in_registries, mcp__shadcn__view_items_in_registries, mcp__shadcn__get_item_examples_from_registries, mcp__shadcn__get_add_command_for_items
---

# Generating Components

Generate production-ready React components with shadcn/ui, 21st.dev, and Tailwind CSS.

## MANDATORY WORKFLOW (ZERO TOLERANCE)

```
BEFORE ANY CODE:
[x] Step 0: READ references/typography.md + references/color-system.md (ANTI-AI SLOP)
[x] Step 1: Search 21st.dev with mcp__magic__21st_magic_component_inspiration
[x] Step 2: Search shadcn/ui registry
[x] Step 3: Present 2-3 options to user with previews
[x] Step 4: User selects option
[x] Step 5: READ references/theme-presets.md - Choose theme, declare fonts/colors
[x] Step 6: Generate with Framer Motion animations (see references/motion-patterns.md)
[x] Step 7: Validate accessibility + anti-AI slop checklist
```

**NEVER skip Step 0. ALWAYS read typography + color references BEFORE any design decision.**

## Quick Commands

### Search 21st.dev (MANDATORY FIRST)

```typescript
mcp__magic__21st_magic_component_inspiration({
  message: "Create a hero section for hosting company",
  searchQuery: "hero section saas"
})
```

### Search shadcn/ui

```typescript
mcp__shadcn__search_items_in_registries({
  registries: ["@shadcn"],
  query: "button"
})
```

## FORBIDDEN PATTERNS

| Forbidden | Required Instead |
|-----------|------------------|
| Empty hero (text only) | Hero with orbs, gradients, mockups |
| Flat cards | Cards with shadow, hover, glow |
| No animations | Framer Motion on everything |
| Static buttons | whileHover, whileTap effects |
| Plain backgrounds | Gradient mesh, grid patterns |

## Component Template

```tsx
"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ComponentProps {
  className?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function Component({ className }: ComponentProps) {
  return (
    <motion.div
      className={cn("relative", className)}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      </div>

      {/* Content with animations */}
      <motion.div variants={itemVariants}>
        {/* Content here */}
      </motion.div>
    </motion.div>
  );
}
```

## References

### Anti-AI Slop (MANDATORY)

- **Typography system**: [references/typography.md](references/typography.md) - Fonts FORBIDDEN/APPROVED
- **Color system**: [references/color-system.md](references/color-system.md) - CSS variables, palettes
- **Motion patterns**: [references/motion-patterns.md](references/motion-patterns.md) - Animations, hover states
- **Theme presets**: [references/theme-presets.md](references/theme-presets.md) - Brutalist, Solarpunk, etc.

### Component Resources

- **Design patterns**: [references/design-patterns.md](references/design-patterns.md)
- **Component examples**: [references/component-examples.md](references/component-examples.md)
- **Tailwind best practices**: [references/tailwind-best-practices.md](references/tailwind-best-practices.md)
- **shadcn/ui patterns**: [references/shadcn.md](references/shadcn.md)
- **21st.dev usage**: [references/21st-dev.md](references/21st-dev.md)
