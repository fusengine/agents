---
name: devtools
description: TanStack Form Devtools - debugging form state and field validation in development
when-to-use: debugging form state, inspecting field values, checking validation errors, development environment
keywords: devtools, debugging, form-state, field-values, validation, development
priority: low
related: templates/devtools-form.md
---

# TanStack Form Devtools

## FormDevtools Component

**Visual debugging tool for form state and validation.**

### Purpose
- Inspect form state in real-time during development
- Monitor field values and errors
- Track form submission state
- Debug validation logic

### When to Use
- Developing complex forms with multiple fields
- Debugging validation issues
- Understanding form state changes
- Tracking field-level errors

### Key Points
- Provided by `@tanstack/react-form-devtools` package
- Renders debug panel in development only
- Shows all field values at once
- Displays validation errors per field
- Shows form submission state

---

## Integration with TanStack Devtools

**Part of TanStack ecosystem debugging tools.**

### Integration Steps
- Import `FormDevtools` from devtools package
- Add as child component in form
- Works alongside other TanStack devtools (Query, Router)

### Development vs Production
- Only renders in development environment
- Zero bundle impact in production builds
- Automatically stripped by tree-shaking
- Safe to leave in component code

### Key Points
- Requires `@tanstack/react-form-devtools` installation
- Works with React 18+
- Compatible with Server Components when placed in Client Component
- Displays state updates in real-time

---

## Debugging Form State

**Inspecting what's happening inside your form.**

### What You Can See
- Current values of all fields
- Touched state for each field
- Dirty state tracking
- Validation status per field
- Error messages displayed

### Common Debugging Scenarios
- Form not submitting (check validation state)
- Values not updating (inspect field tracking)
- Errors showing incorrectly (check validation rules)
- State out of sync (compare displayed vs actual)

---

## Inspecting Field Values and Errors

**Real-time visibility into field state.**

### Field State Inspection
- View current value for each field
- Check if field has been touched
- Verify dirty flag status
- See validation error messages

### Error Tracking
- See validation errors as they occur
- Track error lifecycle (appear/disappear)
- Verify error messages match validation rules
- Check async validation results

---

## Development Best Practices

**Using devtools effectively in development.**

### Best Practices
- Leave devtools in development environment
- Remove devtools import from production builds
- Use alongside React DevTools browser extension
- Check devtools when debugging form issues
- Pair with console logs for additional debugging

### Performance Consideration
- Devtools updates when form state changes
- Minimal performance impact in development
- No effect on production performance

---

→ See `templates/devtools-form.md` for code examples
