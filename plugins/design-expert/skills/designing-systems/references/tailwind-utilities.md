---
name: tailwind-utilities
description: Tailwind CSS utilities, class organization, and common patterns
when-to-use: Writing Tailwind CSS, organizing utility classes, implementing component styles
keywords: tailwind, utilities, classes, organization, responsive, dark mode
priority: high
related: tailwind-config.md, tailwind-performance.md
---

# Tailwind CSS Utilities

## Class Organization (Recommended Order)

```
1. Layout (display, position, grid, flex)
2. Sizing (width, height)
3. Spacing (margin, padding, gap)
4. Typography (font, text)
5. Visual (bg, border, shadow)
6. States (hover, focus, active)
7. Responsive (sm:, md:, lg:)
```

### Example

```tsx
// Good - organized
<div className="flex items-center justify-between w-full p-4 gap-3 text-sm font-medium bg-card border rounded-lg shadow-sm hover:shadow-md sm:p-6">

// Bad - random order
<div className="hover:shadow-md text-sm p-4 border flex gap-3 bg-card sm:p-6 w-full font-medium rounded-lg shadow-sm items-center justify-between">
```

---

## Component Composition with cn()

```tsx
import { cn } from "@/lib/utils";

interface ButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  className?: string;
}

function Button({ variant = "default", size = "default", className }: ButtonProps) {
  return (
    <button
      className={cn(
        // Base styles
        "inline-flex items-center justify-center rounded-md font-medium transition-colors",
        // Focus styles
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        // Disabled styles
        "disabled:pointer-events-none disabled:opacity-50",
        // Variants
        variant === "default" && "bg-primary text-primary-foreground hover:bg-primary/90",
        variant === "outline" && "border border-input bg-background hover:bg-accent",
        variant === "ghost" && "hover:bg-accent hover:text-accent-foreground",
        // Sizes
        size === "sm" && "h-8 px-3 text-sm",
        size === "default" && "h-10 px-4",
        size === "lg" && "h-12 px-6 text-lg",
        // Custom classes
        className
      )}
    />
  );
}
```

---

## Avoiding Inline Conditional Classes

```tsx
// Good - using cn()
<div className={cn("p-4", isActive && "bg-primary")}>

// Bad - template literals
<div className={`p-4 ${isActive ? "bg-primary" : ""}`}>
```

---

## Responsive Design

### Mobile-First Approach

```tsx
// Good - mobile first
<div className="text-sm md:text-base lg:text-lg">
<div className="grid sm:grid-cols-2 lg:grid-cols-3">
<div className="p-4 md:p-6 lg:p-8">

// Bad - desktop first (avoid)
<div className="text-lg md:text-base sm:text-sm">
```

---

## Common Responsive Patterns

```tsx
// Typography
<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">

// Grid layouts
<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

// Flex direction
<div className="flex flex-col md:flex-row">

// Spacing
<section className="py-12 md:py-20 lg:py-28">

// Visibility
<div className="hidden md:block">
<div className="md:hidden">
```

---

## Dark Mode

### Semantic Tokens (Better)

```tsx
// Better - semantic tokens (auto-switch)
<div className="bg-background text-foreground border-border">
```

---

## Opacity for Dark Mode

```tsx
// Good - works in both modes
<div className="bg-primary/10">
<div className="border-border/50">

// Background overlays
<div className="bg-background/80 backdrop-blur-sm">
```

---

## Animations

### Transitions

```tsx
// Smooth hover
<div className="transition-colors hover:bg-accent">

// Transform animations
<div className="transition-transform hover:scale-105">

// Multiple properties
<div className="transition-all duration-200 ease-out">
```

---

## Common Animations

```tsx
// Spin (loading)
<div className="animate-spin">

// Pulse (skeleton)
<div className="animate-pulse">

// Bounce (attention)
<div className="animate-bounce">
```

---

## CHECKLIST: Utilities

- [ ] Classes organized logically
- [ ] Using cn() for conditionals
- [ ] Mobile-first responsive approach
- [ ] Semantic color tokens
- [ ] Opacity values for dark mode
- [ ] Proper transition/animation classes
