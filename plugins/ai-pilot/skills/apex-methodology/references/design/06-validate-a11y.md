---
name: 06-validate-a11y
description: Validate WCAG 2.2 AA accessibility compliance
prev_step: references/design/05-add-motion.md
next_step: references/design/07-review-design.md
---

# 06 - Validate Accessibility

**Ensure WCAG 2.2 Level AA compliance.**

## When to Use

- After animations added (05-add-motion)
- Before design review
- For all interactive components

---

## Semantic HTML

### Structure

```tsx
// ✅ GOOD - Semantic
<header>
  <nav aria-label="Main navigation">
    <ul role="list">
      <li><a href="/">Home</a></li>
    </ul>
  </nav>
</header>

<main>
  <section aria-labelledby="hero-title">
    <h1 id="hero-title">Welcome</h1>
  </section>
</main>

<footer>
  <nav aria-label="Footer navigation">
```

### Headings

```tsx
// ✅ GOOD - Logical order
<h1>Page Title</h1>
  <h2>Section</h2>
    <h3>Subsection</h3>

// ❌ BAD - Skipping levels
<h1>Title</h1>
  <h4>Subsection</h4>  // Skipped h2, h3
```

---

## ARIA Labels

### Interactive Elements

```tsx
// Buttons with icons only
<button aria-label="Close dialog">
  <X className="h-4 w-4" />
</button>

// Links that open new tabs
<a href="..." target="_blank" rel="noopener noreferrer">
  External Link
  <span className="sr-only">(opens in new tab)</span>
</a>

// Form inputs
<label htmlFor="email">Email</label>
<input id="email" type="email" aria-describedby="email-hint" />
<p id="email-hint" className="text-sm text-muted-foreground">
  We'll never share your email.
</p>
```

---

## Color Contrast

### Minimum Ratios (WCAG AA)

```text
Normal text: 4.5:1
Large text (18pt+): 3:1
UI components: 3:1
```

### Check Colors

```tsx
// ✅ GOOD - High contrast
className="text-foreground bg-background"  // Check tokens

// ❌ BAD - Low contrast
className="text-gray-400 bg-gray-100"  // May fail
```

---

## Keyboard Navigation

### Focus States

```tsx
// Ensure visible focus
className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"

// Skip link (first in body)
<a href="#main" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
```

### Tab Order

```tsx
// ✅ Natural order
<button>First</button>
<button>Second</button>

// ❌ Avoid tabindex > 0
<button tabIndex={2}>Don't do this</button>
```

---

## Motion Accessibility

### Respect User Preference

```tsx
// CSS
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

// Framer Motion
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches

<motion.div
  animate={prefersReducedMotion ? {} : { y: 0 }}
>
```

---

## Validation Checklist

```text
[ ] Semantic HTML used
[ ] Heading hierarchy correct
[ ] ARIA labels on icons/buttons
[ ] Color contrast 4.5:1+
[ ] Focus states visible
[ ] Keyboard navigable
[ ] prefers-reduced-motion respected
[ ] Alt text on images
[ ] Form labels connected
```

---

## Next Phase

-> Proceed to `07-review-design.md`
