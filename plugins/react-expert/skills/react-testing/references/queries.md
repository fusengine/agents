---
name: queries
description: Testing Library query priority for accessible testing
when-to-use: Selecting elements in tests
keywords: getByRole, getByLabelText, queryBy, findBy, accessibility
priority: high
related: accessibility-testing.md, templates/component-basic.md
---

# Query Priority

## Why Priority Matters

Queries ordered by accessibility:
- Screen readers see `role` and `label` first
- Users see text content
- `data-testid` is invisible → last resort

---

## Priority Order

| Priority | Query | Use For |
|----------|-------|---------|
| 1 | `getByRole` | Buttons, headings, inputs |
| 2 | `getByLabelText` | Form inputs with labels |
| 3 | `getByPlaceholderText` | Inputs without labels |
| 4 | `getByText` | Non-interactive text |
| 5 | `getByTestId` | Last resort only |

---

## Query Variants

### Sync

| Variant | 0 matches | 1 match |
|---------|-----------|---------|
| `getBy` | Throw | Return |
| `queryBy` | null | Return |

### Async

| Variant | 0 matches | 1 match |
|---------|-----------|---------|
| `findBy` | Throw (timeout) | Return |

---

## Common Roles

| Element | Role |
|---------|------|
| `<button>` | button |
| `<a href>` | link |
| `<input type="text">` | textbox |
| `<select>` | combobox |
| `<h1>` | heading |
| `<dialog>` | dialog |

---

## Debugging

```typescript
screen.debug()           // Print DOM
logRoles(container)      // List available roles
```

---

## Where to Find Code?

→ `templates/component-basic.md` - Query examples in tests
