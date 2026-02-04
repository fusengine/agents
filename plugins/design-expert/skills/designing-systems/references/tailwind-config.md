---
name: tailwind-config
description: Tailwind CSS v4 configuration and theme setup
when-to-use: Configuring Tailwind, setting up theme variables, customizing design tokens
keywords: tailwind, configuration, theme, variables, custom, setup, v4
priority: high
related: tailwind-utilities.md, tailwind-performance.md, color-system.md
---

# Tailwind CSS Configuration

## Theme Setup

### CSS Variables for Theming

```css
/* app.css */
@theme {
  --color-brand: oklch(55% 0.2 260);
  --color-brand-foreground: oklch(98% 0.01 260);
}
```

```tsx
<div className="bg-brand text-brand-foreground">
```

---

## Semantic Color Tokens

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

---

## Color Scale Usage

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

---

## Spacing Configuration

```tsx
// Good - use scale
<div className="p-4">        // 16px
<div className="p-6">        // 24px
<div className="gap-4">      // 16px
<div className="space-y-4">  // 16px between children

// Bad - arbitrary values
<div className="p-[17px]">
<div className="p-[23px]">
```

---

## Max Width Configuration

```tsx
// Good - use predefined values
<div className="max-w-3xl">
<div className="max-w-prose">

// Acceptable - when needed
<div className="max-w-[65ch]">

// Bad - too specific
<div className="max-w-[847px]">
```

---

## CHECKLIST: Configuration

- [ ] Theme variables defined
- [ ] Semantic color tokens set up
- [ ] Spacing scale configured
- [ ] Responsive breakpoints defined
- [ ] CSS variables for dark mode
