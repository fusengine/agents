---
name: generating-components
description: Generate production-ready React components using shadcn/ui, 21st.dev, and Tailwind CSS. Use when user asks for UI components, buttons, forms, cards, hero sections, or mentions design inspiration, component library, or UI generation.
allowed-tools: Read, Write, Edit, Glob, Grep, mcp__magic__21st_magic_component_builder, mcp__magic__21st_magic_component_inspiration, mcp__magic__21st_magic_component_refiner, mcp__shadcn__search_items_in_registries, mcp__shadcn__view_items_in_registries, mcp__shadcn__get_item_examples_from_registries, mcp__shadcn__get_add_command_for_items
---

# Generating Components

Generate production-ready React components with shadcn/ui, 21st.dev, and Tailwind CSS.

## Workflow

Copy this checklist and track progress:

```
Component Generation:
- [ ] Step 1: Understand requirements
- [ ] Step 2: Search examples on 21st.dev
- [ ] Step 3: Check shadcn/ui registry
- [ ] Step 4: Present 2-3 options to user
- [ ] Step 5: Generate component with customizations
- [ ] Step 6: Validate accessibility
- [ ] Step 7: Add responsive styles
```

## Quick Start

### Search Examples (21st.dev)

Use `mcp__magic__21st_magic_component_inspiration` to find design examples:

```
Search: "hero section", "pricing table", "login form"
→ Returns: Component previews with code
```

### Search Registry (shadcn/ui)

Use `mcp__shadcn__search_items_in_registries` for base components:

```
Registries: ["@shadcn"]
Query: "button", "card", "dialog", "form"
```

### Generate Component

Use `mcp__magic__21st_magic_component_builder` for custom generation:

```
Message: User's full request
SearchQuery: 2-4 word description
StandaloneRequestQuery: Detailed component description
```

## Component Structure

ALWAYS use this template structure:

```tsx
"use client";

import { cn } from "@/lib/utils";
// Import shadcn components as needed

interface ComponentNameProps {
  className?: string;
  // Define props with JSDoc
}

/**
 * ComponentName - Brief description
 * @param props - Component properties
 */
export function ComponentName({ className, ...props }: ComponentNameProps) {
  return (
    <div className={cn("base-styles", className)} {...props}>
      {/* Content */}
    </div>
  );
}
```

## Design Quality Standards

### Modern Design Principles (2026)

ALWAYS apply these principles for cohesive, modern UI:

1. **Visual Hierarchy** - Size, weight, color guide attention
2. **Whitespace** - Generous padding (p-6 minimum on cards)
3. **Subtle Shadows** - `shadow-sm` to `shadow-md`, avoid harsh shadows
4. **Rounded Corners** - `rounded-lg` to `rounded-2xl` for modern feel
5. **Micro-interactions** - Hover states, transitions (150-300ms)
6. **Gradient Accents** - Subtle gradients on backgrounds/CTAs

### Style Checklist

Before delivering any component:

```text
[ ] Semantic colors (bg-card, text-muted-foreground)
[ ] Generous spacing (p-6 cards, gap-6 grids)
[ ] Smooth transitions (transition-all duration-200)
[ ] Hover states (hover:shadow-md, hover:scale-[1.02])
[ ] Mobile-first responsive (sm: md: lg: prefixes)
[ ] Dark mode compatible (using semantic tokens)
[ ] Focus visible states (focus-visible:ring-2)
```

### Consistency Rules

- **Spacing Scale**: Only 4, 6, 8, 12, 16, 20, 24 (in Tailwind units)
- **Border Radius**: sm (4px), md (8px), lg (12px), xl (16px), 2xl (24px)
- **Font Sizes**: Follow type scale, never arbitrary
- **Colors**: ONLY semantic tokens, never hardcoded hex/rgb

## Styling Guidelines

### Tailwind CSS v4 Best Practices

- Use semantic class names
- Apply responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`
- Use container queries when needed: `@container`
- Prefer OKLCH colors for wider gamut
- Organize classes: layout → sizing → spacing → typography → visual → states

### Common Patterns

| Pattern  | Classes                                           |
| -------- | ------------------------------------------------- |
| Centered | `flex items-center justify-center`                |
| Card     | `rounded-xl border bg-card p-6 shadow-sm`         |
| Button   | `inline-flex items-center justify-center rounded-md` |
| Input    | `flex h-10 w-full rounded-md border px-3 py-2`   |

## References

For detailed documentation:

- **Design patterns**: [references/design-patterns.md](references/design-patterns.md) - Visual hierarchy, cards, forms, navigation
- **Component examples**: [references/component-examples.md](references/component-examples.md) - Production-ready code
- **Tailwind best practices**: [references/tailwind-best-practices.md](references/tailwind-best-practices.md) - Class organization, anti-patterns
- **shadcn/ui patterns**: [references/shadcn.md](references/shadcn.md)
- **21st.dev usage**: [references/21st-dev.md](references/21st-dev.md)

## Examples

**Input**: "Create a hero section for a SaaS product"

**Output**:
```tsx
export function HeroSection() {
  return (
    <section className="relative py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Build faster with our platform
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Ship products 10x faster with AI-powered tools
          </p>
          <div className="mt-10 flex gap-4 justify-center">
            <Button size="lg">Get Started</Button>
            <Button size="lg" variant="outline">Learn More</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
```
