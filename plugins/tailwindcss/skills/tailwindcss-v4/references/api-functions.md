---
name: api-functions
description: Core CSS API functions introduced in Tailwind CSS v4
---

# Tailwind CSS v4 — Core API Functions

### --alpha()
Adjust color opacity:
```css
color: --alpha(var(--color-lime-300) / 50%);
```

### --spacing()
Generate spacing values:
```css
margin: --spacing(4);
```

### @apply
Inline utility classes:
```css
.btn {
  @apply px-4 py-2 rounded-lg font-bold;
}
```
