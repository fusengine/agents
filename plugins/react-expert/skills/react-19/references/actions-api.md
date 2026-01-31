---
name: actions-api
description: React 19 Form Actions - native form handling without Server Components
when-to-use: form handling, form submissions, client-side forms
keywords: actions, forms, useActionState, useFormStatus, form action
priority: high
related: new-hooks.md, templates/action-form.md
---

# React 19 Form Actions

## What Are Actions?

Functions passed to `<form action={}>` that handle form submission.

**Note:** This is React's client-side form handling, NOT Next.js Server Actions.

---

## Why Use Actions?

### Benefits Over onSubmit

| Feature | `onSubmit` | `action` |
|---------|-----------|----------|
| FormData access | Manual | Automatic |
| Pending state | Manual state | `useFormStatus` |
| Progressive enhancement | No | Yes |
| Integration with Suspense | No | Yes |

---

## Action Patterns

### 1. Simple Action
Direct function on form - good for simple submissions.

### 2. Action with State (useActionState)
When you need error handling or return values.

→ See `templates/action-form.md` for full example

### 3. Action with Optimistic UI
Combine with `useOptimistic` for instant feedback.

→ See `templates/optimistic-update.md` for full example

---

## Form Status in Children

Use `useFormStatus` in child components to access pending state.

**Limitation:** Must be a child component of `<form>`, not the form itself.

→ See `templates/action-form.md` for SubmitButton pattern

---

## Button-Specific Actions

Use `formAction` attribute on buttons for different actions on same form.

---

## Error Handling

Actions should **return** errors, not throw them.

The returned value becomes the new state in `useActionState`.

---

## Where to Find Code Templates?

→ `templates/action-form.md` - Complete form with useActionState
→ `templates/optimistic-update.md` - Form with optimistic UI
