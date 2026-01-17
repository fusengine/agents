---
name: validating-accessibility
description: Validate UI components for WCAG 2.2 Level AA compliance. Use when checking accessibility, color contrast, keyboard navigation, screen reader support, or ARIA attributes.
allowed-tools: Read, Edit, Glob, Grep
---

# Validating Accessibility

Ensure all UI components meet WCAG 2.2 Level AA accessibility standards.

## Workflow

```
Accessibility Validation:
- [ ] Step 1: Check semantic HTML structure
- [ ] Step 2: Validate color contrast ratios
- [ ] Step 3: Verify keyboard navigation
- [ ] Step 4: Test focus management
- [ ] Step 5: Review ARIA attributes
- [ ] Step 6: Check motion preferences
```

## WCAG 2.2 Requirements

### Perceivable

| Criterion | Requirement | How to Check |
|-----------|-------------|--------------|
| 1.1.1 | Alt text for images | All `<img>` have `alt` |
| 1.3.1 | Semantic structure | Use heading hierarchy |
| 1.4.3 | Contrast (AA) | 4.5:1 text, 3:1 large |
| 1.4.11 | Non-text contrast | 3:1 for UI elements |

### Operable

| Criterion | Requirement | How to Check |
|-----------|-------------|--------------|
| 2.1.1 | Keyboard accessible | Tab through all controls |
| 2.1.2 | No keyboard trap | Can always escape |
| 2.4.3 | Focus order | Logical tab sequence |
| 2.4.7 | Focus visible | Clear focus indicator |

### Understandable

| Criterion | Requirement | How to Check |
|-----------|-------------|--------------|
| 3.1.1 | Language declared | `<html lang="en">` |
| 3.2.1 | No unexpected focus | No auto-focus changes |
| 3.3.1 | Error identification | Clear error messages |
| 3.3.2 | Labels/instructions | All inputs labeled |

### Robust

| Criterion | Requirement | How to Check |
|-----------|-------------|--------------|
| 4.1.1 | Valid HTML | No duplicate IDs |
| 4.1.2 | Name, role, value | ARIA for custom controls |

## Color Contrast

### Minimum Ratios

```
Normal text (<18px, <14px bold): 4.5:1
Large text (≥18px, ≥14px bold): 3:1
UI components and graphics: 3:1
```

### Testing Colors

```typescript
// Calculate contrast ratio
function getContrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// OKLCH lightness to relative luminance (approximation)
// Use proper conversion for accurate results
```

### Safe Color Combinations

```css
/* High contrast pairs */
--text-on-light: oklch(15% 0 0);   /* ~16:1 on white */
--text-on-dark: oklch(95% 0 0);    /* ~14:1 on black */

/* Accent on background */
--accent-accessible: oklch(45% 0.2 260); /* 4.5:1 on white */
```

## Semantic HTML

### Heading Hierarchy

```html
<!-- Correct: Sequential levels -->
<h1>Page Title</h1>
  <h2>Section</h2>
    <h3>Subsection</h3>

<!-- Wrong: Skipped level -->
<h1>Page Title</h1>
  <h3>Subsection</h3>  <!-- Missing h2 -->
```

### Landmark Regions

```html
<header role="banner">...</header>
<nav role="navigation">...</nav>
<main role="main">...</main>
<aside role="complementary">...</aside>
<footer role="contentinfo">...</footer>
```

### Form Labels

```html
<!-- Explicit label -->
<label for="email">Email</label>
<input id="email" type="email" />

<!-- Implicit label -->
<label>
  Email
  <input type="email" />
</label>

<!-- ARIA label -->
<input type="email" aria-label="Email address" />
```

## Keyboard Navigation

### Focus Management

```tsx
// Visible focus indicator
className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"

// Skip link
<a href="#main" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
```

### Interactive Elements

```tsx
// Button (keyboard accessible by default)
<button onClick={handleClick}>Click me</button>

// Custom interactive element
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  Custom button
</div>
```

## ARIA Patterns

### Common Attributes

```tsx
// Expanded/collapsed
<button aria-expanded={isOpen} aria-controls="menu">
  Toggle
</button>
<div id="menu" aria-hidden={!isOpen}>...</div>

// Live regions
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>

// Description
<input aria-describedby="hint" />
<p id="hint">Password must be 8+ characters</p>
```

### Component Patterns

| Component | Role | Key Attributes |
|-----------|------|----------------|
| Modal | `dialog` | `aria-modal`, `aria-labelledby` |
| Tabs | `tablist`, `tab`, `tabpanel` | `aria-selected`, `aria-controls` |
| Menu | `menu`, `menuitem` | `aria-expanded`, `aria-haspopup` |
| Alert | `alert` | `aria-live="assertive"` |

## Motion Sensitivity

### Reduce Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Safe Animations

```tsx
// Check preference
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

// Conditional animation
<motion.div
  animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
  transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }}
/>
```

## Validation Checklist

```
□ All images have alt text
□ Heading levels are sequential
□ Color contrast meets 4.5:1 (text) / 3:1 (UI)
□ All interactive elements are keyboard accessible
□ Focus order is logical
□ Focus indicators are visible
□ Form inputs have labels
□ Error messages are clear and associated
□ ARIA attributes are correct
□ Motion respects user preferences
□ Skip link is provided
□ Language is declared
```
