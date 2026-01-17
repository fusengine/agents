# Tailwind CSS Best Practices

## Class Organization

### Recommended Order

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

## Semantic Colors

### Always Use Semantic Tokens

```tsx
// Good - semantic
<div className="bg-background text-foreground border-border">
<div className="bg-card text-card-foreground">
<div className="bg-muted text-muted-foreground">
<div className="bg-primary text-primary-foreground">
<div className="bg-destructive text-destructive-foreground">

// Bad - hardcoded colors
<div className="bg-white text-gray-900 border-gray-200">
<div className="bg-blue-600 text-white">
```

### Color Scale Usage

```tsx
// Primary actions
<Button className="bg-primary hover:bg-primary/90">

// Secondary/muted elements
<span className="text-muted-foreground">

// Borders and dividers
<div className="border-border">

// Hover states with opacity
<div className="hover:bg-accent/50">
```

## Spacing Consistency

### Use Tailwind Scale

```tsx
// Good - consistent spacing
<div className="p-4">        // 16px
<div className="p-6">        // 24px
<div className="gap-4">      // 16px
<div className="space-y-4">  // 16px between children

// Bad - arbitrary values
<div className="p-[17px]">
<div className="p-[23px]">
```

### Common Patterns

```tsx
// Card padding
<div className="p-6">

// Section spacing
<section className="py-12 md:py-24">

// Container padding
<div className="container px-4">

// Form field spacing
<div className="space-y-4">

// Button icon gap
<Button>
  <Icon className="mr-2 h-4 w-4" />
  Label
</Button>
```

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

### Common Breakpoint Patterns

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

## Component Composition

### cn() Utility for Conditional Classes

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

### Avoid Inline Conditional Classes

```tsx
// Good - using cn()
<div className={cn("p-4", isActive && "bg-primary")}>

// Bad - template literals
<div className={`p-4 ${isActive ? "bg-primary" : ""}`}>
```

## Performance Tips

### Avoid Large Arbitrary Values

```tsx
// Good - use scale
<div className="max-w-3xl">
<div className="max-w-prose">

// Acceptable - when needed
<div className="max-w-[65ch]">

// Bad - too specific
<div className="max-w-[847px]">
```

### Use CSS Variables for Theming

```css
/* app.css */
@theme {
  --color-brand: oklch(55% 0.2 260);
}
```

```tsx
<div className="bg-brand text-brand-foreground">
```

## Accessibility

### Focus States

```tsx
// Always include focus-visible
<button className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">

// Interactive elements need visible focus
<a className="underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring">
```

### Screen Reader Only

```tsx
// Hide visually but keep for screen readers
<span className="sr-only">Close menu</span>

// Skip links
<a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:p-4">
  Skip to main content
</a>
```

## Dark Mode

### Using dark: Prefix

```tsx
// Explicit dark mode (when needed)
<div className="bg-white dark:bg-slate-900">
<div className="text-slate-900 dark:text-slate-100">
<div className="border-slate-200 dark:border-slate-800">

// Better - semantic tokens (auto-switch)
<div className="bg-background text-foreground border-border">
```

### Opacity for Dark Mode

```tsx
// Good - works in both modes
<div className="bg-primary/10">
<div className="border-border/50">

// Background overlays
<div className="bg-background/80 backdrop-blur-sm">
```

## Animation Classes

### Transitions

```tsx
// Smooth hover
<div className="transition-colors hover:bg-accent">

// Transform animations
<div className="transition-transform hover:scale-105">

// Multiple properties
<div className="transition-all duration-200 ease-out">
```

### Common Animations

```tsx
// Spin (loading)
<div className="animate-spin">

// Pulse (skeleton)
<div className="animate-pulse">

// Bounce (attention)
<div className="animate-bounce">
```

## Anti-Patterns to Avoid

```tsx
// Avoid !important (use specificity instead)
<div className="!p-4">  // Bad

// Avoid mixing arbitrary and scale values
<div className="p-4 pb-[17px]">  // Bad

// Avoid inline styles with Tailwind
<div className="p-4" style={{ marginTop: "8px" }}>  // Bad

// Avoid overriding with negative margins
<div className="-mt-4">  // Use gap/space-y instead

// Avoid string concatenation for classes
<div className={"p-4 " + (active ? "bg-primary" : "")}>  // Use cn()
```
