---
name: async-validation
description: Async validation patterns - server-side validation, debouncing, multi-field validation, loading states
when-to-use: server validation, debouncing async checks, cross-field validation, validation loading states
keywords: async-validation, debouncing, server-validation, multi-field, validation-states
priority: high
related: templates/basic-form.md, templates/search-form.md, zod-validation.md
---

# Async Validation Patterns

## Debouncing Async Validation

**Prevent excessive server calls by delaying validation.**

### Purpose
- Reduce server load during user typing
- Improve perceived performance
- Control validation timing with `onChangeAsyncDebounceMs`

### When to Use
- Email existence checks
- Username availability checks
- Search-based validations
- Any expensive async operation

### Key Points
- `onChangeAsyncDebounceMs` delays before triggering async validator
- Prevents multiple simultaneous requests
- Shows loading state while debouncing
- Combines with synchronous validators for immediate feedback

→ See `templates/search-form.md` for code examples

---

## Server-Side Validation

**Validate against backend data sources.**

### Purpose
- Check uniqueness constraints (email, username)
- Validate against business rules
- Confirm data availability
- Query external APIs

### When to Use
- User registration forms
- Account setup flows
- Any validation requiring database access
- Real-time availability checks

### Key Points
- Server action called during field change or submission
- Returns error string or undefined
- Should handle network failures gracefully
- Typically paired with debouncing

→ See `templates/async-validation-form.md` for server action examples

---

## Multi-Field Async Validation

**Validate relationships between multiple fields.**

### Purpose
- Cross-field dependencies (password confirmation)
- Conditional validation rules
- Coordinated field validation
- Form-level async checks

### When to Use
- Password and confirm password validation
- Dependent field rules
- Complex business logic spanning multiple fields
- Final pre-submission validation

### Key Points
- Access entire form value in validator
- Returns field error mapping
- Runs after individual field validation
- Useful for atomic form submission

→ See `templates/async-validation-form.md` for multi-field examples

---

## Loading States During Validation

**Show feedback while async validation is in progress.**

### Purpose
- Indicate ongoing server checks
- Prevent form submission during validation
- Improve user experience with clear feedback
- Distinguish validation state from submission state

### When to Use
- Long-running async validators
- Network-dependent validations
- Any time user needs to know validation is pending
- Multi-second server operations

### Key Points
- `field.state.meta.isValidating` tracks validation state
- Separate from `isPending` submission state
- Enable loading spinner during validation
- Disable form actions if needed

→ See `templates/async-validation-form.md` for loading state examples

---

## Error Handling in Async Validation

**Gracefully handle validation and network errors.**

### Purpose
- Catch and display validation errors
- Handle network failures
- Provide fallback messages
- Prevent silent failures

### When to Use
- Any async operation (network, database)
- Complex validation workflows
- Production-grade forms
- User-facing error communication

### Key Points
- Try-catch in async validators
- Service unavailable fallback messages
- Field-level vs form-level error handling
- Distinguish validation errors from submission errors

→ See `templates/async-validation-form.md` for error handling patterns

---

## Validation Strategy Comparison

| Strategy | Timing | Best For | Trade-offs |
|----------|--------|----------|-----------|
| **onChange** | Immediate | Real-time feedback | Network load, user distraction |
| **onBlur** | Field loses focus | Reduced requests | Delayed feedback, mobile friendly |
| **onSubmit** | Form submission | Final verification | No real-time UX, form rejection |
| **Debounced onChange** | After delay | Balanced approach | Slight feedback delay |

---

## Common Async Patterns

**Email existence** → Debounce 500ms, show spinner
**Username lookup** → Debounce 300ms, server query
**Password confirmation** → Synchronous (no async needed)
**Address validation** → Debounce 800ms, external API
**Form submission** → Final server-side validation
