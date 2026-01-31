---
name: accessibility-testing
description: Accessibility testing with axe-core and keyboard navigation
when-to-use: Validating WCAG compliance
keywords: a11y, accessibility, axe, wcag, keyboard
priority: high
related: queries.md, templates/accessibility-audit.md
---

# Accessibility Testing

## Why Test Accessibility

| Reason | Impact |
|--------|--------|
| 15-20% users | Have disabilities |
| Legal | ADA, WCAG compliance |
| UX | Better for everyone |
| SEO | Semantic HTML benefits |

---

## Semantic Queries = Accessibility

Using `getByRole` enforces accessible markup:

| Query | Forces |
|-------|--------|
| `getByRole('button')` | Proper button element |
| `getByRole('heading')` | Proper heading hierarchy |
| `getByLabelText()` | Form labels |

---

## axe-core Integration

### What It Tests

- Color contrast
- Missing alt text
- Invalid ARIA
- Keyboard traps
- Focus order

### Setup

```bash
npm install -D vitest-axe
```

---

## Keyboard Testing

### Key Interactions

| Key | Expected Behavior |
|-----|-------------------|
| Tab | Move to next focusable |
| Shift+Tab | Move to previous |
| Enter | Activate button/link |
| Escape | Close modal/dropdown |
| Arrow keys | Navigate within widget |

---

## Focus Management

### Modal Requirements

1. Focus moves to modal on open
2. Focus trapped inside modal
3. Focus returns to trigger on close

---

## ARIA Roles to Test

| Role | Element |
|------|---------|
| `alert` | Error messages |
| `status` | Live regions |
| `dialog` | Modals |
| `navigation` | Nav menus |

---

## Where to Find Code?

→ `templates/accessibility-audit.md` - Complete a11y test suite
