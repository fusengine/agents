---
name: user-events
description: userEvent API for realistic user interactions
when-to-use: Simulating clicks, typing, keyboard in tests
keywords: userEvent, click, type, keyboard, tab
priority: high
related: queries.md, templates/form-testing.md
---

# User Events

## Why userEvent over fireEvent

| Aspect | fireEvent | userEvent |
|--------|-----------|-----------|
| Realism | Single event | Full sequence |
| Typing | Sets value | Types chars |
| Focus | No management | Handles focus |
| Recommended | Legacy | Always prefer |

---

## Setup Pattern

```typescript
const user = userEvent.setup()
```

Always call `setup()` at test start.

---

## Common Interactions

| Action | Method |
|--------|--------|
| Click | `user.click(element)` |
| Type | `user.type(input, 'text')` |
| Clear | `user.clear(input)` |
| Tab | `user.tab()` |
| Keyboard | `user.keyboard('{Enter}')` |
| Select | `user.selectOptions(select, option)` |
| Upload | `user.upload(input, file)` |
| Hover | `user.hover(element)` |

---

## Key Principle

**Every method is async** - always `await`:

```typescript
await user.click(button)
await user.type(input, 'text')
```

---

## Keyboard Shortcuts

| Key | Syntax |
|-----|--------|
| Enter | `{Enter}` |
| Escape | `{Escape}` |
| Tab | `{Tab}` |
| Ctrl+A | `{Control>}a{/Control}` |

---

## Where to Find Code?

→ `templates/form-testing.md` - Form interaction examples
→ `templates/component-basic.md` - Click examples
