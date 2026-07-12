---
name: tailwind-performance
description: Tailwind CSS performance optimization and anti-patterns to avoid
when-to-use: Optimizing CSS performance, avoiding performance pitfalls, best practice patterns
keywords: performance, optimization, tailwind, anti-patterns, accessibility, purity
priority: medium
related: tailwind-config.md, tailwind-utilities.md
---

# Tailwind Performance & Best Practices

## Avoid Large Arbitrary Values

```tsx
// Good - use scale
<div className="max-w-3xl">
<div className="max-w-prose">

// Acceptable - when needed
<div className="max-w-[65ch]">

// Bad - too specific
<div className="max-w-[847px]">
```

---

## Performance Tips

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

---

## Spacing Consistency

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

---

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

---

## Accessibility Compliance

### Focus States (WCAG 2.2)

```tsx
// Always include focus-visible
<button className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">

// Interactive elements need visible focus
<a className="underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring">
```

---

## Screen Reader Support

```tsx
// Hide visually but keep for screen readers
<span className="sr-only">Close menu</span>

// Skip links
<a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:p-4">
  Skip to main content
</a>
```

---

## CHECKLIST: Performance

- [ ] Avoid !important declarations
- [ ] Use scale values, not arbitrary
- [ ] Avoid string concatenation
- [ ] Use cn() for conditionals
- [ ] Consistent spacing scale
- [ ] Focus indicators visible
- [ ] Screen reader support
