---
name: patterns-buttons
description: Button component patterns and sizing variants
when-to-use: Creating button components, implementing button states, designing button hierarchies
keywords: buttons, components, sizes, variants, patterns, icons
priority: high
related: patterns-cards.md, patterns-navigation.md, design-patterns.md
---

# Button Patterns

## Size Variants

```tsx
// Sizes
<Button size="sm">Small</Button>   // h-8 px-3 text-sm
<Button size="default">Default</Button>  // h-10 px-4
<Button size="lg">Large</Button>   // h-12 px-6 text-lg
```

---

## Icon Buttons

### Icon with Text

```tsx
<Button>
  <Icon className="mr-2 h-4 w-4" />
  Label
</Button>
```

---

## Icon Only

```tsx
<Button size="icon" variant="ghost">
  <Icon className="h-4 w-4" />
  <span className="sr-only">Action</span>
</Button>
```

---

## Visual Hierarchy

```tsx
// PRIMARY - Most important
<Button variant="default" className="bg-primary">
  Get Started
</Button>

// SECONDARY - Supporting actions
<Button variant="outline">
  Learn More
</Button>

// TERTIARY - De-emphasized
<Button variant="ghost">
  Skip
</Button>

// DESTRUCTIVE - Dangerous actions
<Button variant="destructive">
  Delete
</Button>
```

---

## Disabled States

```tsx
<Button disabled={!isFormValid}>Submit</Button>

// With loading
<Button disabled={isLoading}>
  {isLoading ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Loading...
    </>
  ) : (
    "Submit"
  )}
</Button>
```

---

## Button Groups

```tsx
<div className="flex gap-2">
  <Button variant="outline">Cancel</Button>
  <Button variant="default">Confirm</Button>
</div>
```

---

## Full-Width Buttons (Mobile)

```tsx
<Button className="w-full">Submit</Button>
```

---

## CHECKLIST: Button Patterns

- [ ] Size variants (sm, default, lg)
- [ ] Variant options (default, outline, ghost, destructive)
- [ ] Disabled states handled
- [ ] Loading states with spinners
- [ ] Icon buttons accessible (sr-only)
- [ ] Proper focus-visible styling
- [ ] Touch targets >= 48x48dp
