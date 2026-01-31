---
name: listeners
description: TanStack Form Listeners - Side Effects for Form State Changes
when-to-use: form validation, auto-save, analytics, logging, field tracking
keywords: listeners, side effects, onMount, onChange, onBlur, onSubmit, debouncing, form state
priority: high
related: templates/listeners-form.md
---

# TanStack Form Listeners

## Overview

Listeners are side effect callbacks triggered at specific points in a form's lifecycle. They enable you to react to form state changes without modifying the form state directly.

---

## onMount Listener

**Triggered when the form mounts.**

### Purpose
- Initialize logging or analytics
- Set up external integrations
- Fetch initial field data
- Trigger side effects that depend on form initialization

### When to Use
- First-time form setup
- Analytics event tracking (form viewed)
- Integrating with external libraries
- Conditional rendering logic based on form mount

### Key Points
- Runs once after form mounts
- Has access to current form state
- Field-level and form-level listeners both supported
- Perfect for one-time initialization

→ See `templates/listeners-form.md` for code examples

---

## onChange Listener

**Triggered when any field value changes.**

### Purpose
- Auto-save functionality
- Real-time validation feedback
- Dependent field updates
- Analytics and tracking

### When to Use
- Auto-save to localStorage or server
- Enabling/disabling dependent fields
- Updating computed fields
- Real-time preview updates

### Key Points
- Fires frequently (every keystroke if no debounce)
- Can be field-level or form-level
- Field-level listeners only fire for that field
- Form-level listeners fire for any field change

→ See `templates/listeners-form.md` for code examples

---

## onBlur Listener

**Triggered when a field loses focus.**

### Purpose
- Trigger validation on blur
- Save field value without waiting for form submission
- Analytics tracking (field interaction)
- Update dependent fields based on field value

### When to Use
- Validation on blur (better UX than onChange)
- Auto-save individual fields
- Analytics events (field touched)
- Complex calculations triggered by blur

### Key Points
- Fires after user leaves a field
- Usually paired with onChange for real-time feedback
- Field-level listeners fire only for that field
- Reduces unnecessary side effects vs onChange

→ See `templates/listeners-form.md` for code examples

---

## onSubmit Listener

**Triggered when the form is submitted.**

### Purpose
- Post-submission analytics
- Logging submit events
- Additional validation before actual submission
- Update external state after successful submission

### When to Use
- Analytics tracking (form submitted)
- Logging user actions
- Updating parent component state
- Triggering follow-up actions

### Key Points
- Runs before form submission handlers
- Has access to final form state
- Can throw errors to prevent submission
- Form-level only (not available at field-level)

→ See `templates/listeners-form.md` for code examples

---

## onChangeDebounceMs

**Debounce onChange listener to prevent excessive calls.**

### Purpose
- Reduce unnecessary side effects
- Prevent API calls on every keystroke
- Improve performance during auto-save
- Better UX for expensive operations

### When to Use
- Auto-saving to server (debounce 500-1000ms)
- Real-time search or validation
- External library integrations
- Any onChange that triggers async operations

### Key Points
- Specified in milliseconds
- Only affects onChange listener (not form state updates)
- Field-level and form-level both support debouncing
- Typically 300-1000ms for user input

→ See `templates/listeners-form.md` for code examples

---

## Field-Level vs Form-Level Listeners

### Field-Level Listeners
- Attached to specific fields
- Only trigger for that field
- More granular control
- Better performance (don't monitor all fields)
- Examples: individual field auto-save, field validation

### Form-Level Listeners
- Attached to entire form
- Trigger for any field change
- Useful for cross-field logic
- Good for form-wide analytics
- Examples: form-wide auto-save, dependency updates

### Key Points
- Both types can coexist
- Field-level listeners run before form-level
- Use field-level for performance
- Use form-level for form-wide logic

→ See `templates/listeners-form.md` for code examples

---

## Common Use Cases

| Use Case | Listener | Type |
|----------|----------|------|
| Auto-save to localStorage | onChange | Field or Form |
| Track form interactions | onMount, onChange, onBlur | All |
| Enable/disable fields | onChange | Form |
| Real-time validation feedback | onChange, onBlur | Field |
| Server sync | onChange (debounced) | Field or Form |
| Form submission logging | onSubmit | Form |
| Field touch tracking | onBlur | Field |

---

## Best Practices

**Performance**: Use field-level listeners to avoid monitoring unnecessary fields

**Debouncing**: Always debounce onChange listeners that trigger async operations

**Error Handling**: Wrap listener code in try-catch to prevent form breakage

**Side Effects**: Keep listeners focused on one responsibility

---

→ See `templates/listeners-form.md` for code examples
