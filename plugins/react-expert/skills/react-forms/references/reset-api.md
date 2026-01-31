---
name: reset-api
description: TanStack Form Reset API - form.reset(), form.reset({ defaultValue }), field.reset()
when-to-use: clearing forms, resetting single fields, resetting after submission, repopulating with async values
keywords: reset, form, field, TanStack Form, clearing state, touched state
priority: medium
related: templates/reset-form.md
---

# TanStack Form Reset API

## form.reset()

**Clear entire form to default state.**

### Purpose
- Reset all form fields to initial values
- Clear validation errors and touched state
- Return to clean form state

### When to Use
- After successful form submission
- When user clicks reset/cancel button
- Clearing multi-step form data

### Key Points
- Resets ALL fields simultaneously
- Clears touched/error state by default
- Preserves field definitions and structure
- Synchronous operation

→ See `templates/reset-form.md` for code examples

---

## form.reset({ defaultValue })

**Reset form with new default values.**

### Purpose
- Repopulate form with fresh data
- Reset to predefined values (not empty)
- Update initial state after async data loads

### When to Use
- Loading form data from API then resetting
- Switching between different records
- Reinitializing with different defaults
- Pre-filling forms after async fetch

### Key Points
- Merges provided values as new defaults
- Can be called after async operations complete
- Updates form baseline for future comparisons
- Useful with useQuery or async state

→ See `templates/reset-form.md` for code examples

---

## field.reset()

**Clear specific field without affecting others.**

### Purpose
- Reset single field to default
- Clear field validation error
- Clear field touched state

### When to Use
- User clears one specific field
- Conditional field reset based on other field changes
- Dynamic field management in complex forms

### Key Points
- Operates on individual field instance
- Preserves other fields' state
- Clears field-level touched/error
- Can be called from field event handlers

→ See `templates/reset-form.md` for code examples

---

## Touched State Handling

**Control whether reset clears touched/error tracking.**

### Default Behavior
- `form.reset()` clears touched state
- `form.reset()` clears validation errors
- Form returns to pristine state

### When to Preserve Touched State
- User validation feedback should persist
- Show errors without clearing touched flags
- Manual touched state management needed

### Key Points
- Reset is complete (state + touched + errors)
- Granular control via field.reset() for specific states
- Consider UX when choosing reset scope

→ See `templates/reset-form.md` for advanced patterns

---

## Reset After Successful Submission

**Clear form once server confirms success.**

### Purpose
- Prevent duplicate submissions
- Clear form for next entry
- Reset UI to initial state

### When to Use
- After mutation succeeds
- After successful API response
- In form action completion handler

### Key Points
- Call reset() in success callback
- Pair with useActionState for state management
- Clear optimistic state if applicable
- Consider user notification before clearing

→ See `templates/reset-form.md` for submission patterns

---

## Async Value Loading

**Reset form with values loaded from API.**

### Purpose
- Fetch data, then reset form with fetched values
- Handle delayed data loading
- Preserve form structure while updating values

### When to Use
- Edit forms (load data, populate, allow reset)
- Refreshing form data
- Loading dependent form values
- User clicks reload/refresh

### Key Points
- Use `form.reset({ defaultValue: asyncData })`
- Must be called after async operation completes
- Works with useQuery, fetch, or any async source
- Updates form baseline for dirty state tracking

→ See `templates/reset-form.md` for async examples

---

## Migration from useState

| Old Pattern | New Pattern |
|-------------|-------------|
| `useState` + manual clear | `form.reset()` |
| Multiple `setFieldValue()` | `form.reset({ defaultValue: data })` |
| Manual field cleanup | `field.reset()` |
| Manual touched tracking | Built-in with form.reset() |

---

## Where to Find Code Templates?

→ `templates/reset-form.md` - Complete reset patterns and examples
