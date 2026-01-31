---
name: linked-fields
description: TanStack Form linked fields - cross-field validation and dependencies
when-to-use: forms with dependent fields, cross-field validation, dynamic field relationships
keywords: linked fields, cross-field validation, dependent fields, fieldApi, field dependencies
priority: high
related: templates/linked-fields-form.md
---

# TanStack Form Linked Fields

## Cross-Field Validation Concept

**Validation that depends on multiple field values.**

### Purpose
- Validate one field based on another field's value
- Create dependent field relationships
- Implement complex validation rules
- Build dynamic forms where fields affect each other

### When to Use
- Password and confirm password matching
- Date ranges (start before end)
- Country and province/state selection
- Conditional field requirements
- Price and discount validation

### Key Points
- Access other field values using `fieldApi.form.getFieldValue()`
- Validate at the field level or form level
- Re-validate when dependencies change
- Field dependencies must be explicit

---

## Common Patterns

### Password/Confirm Password

Uses `fieldApi.form.getFieldValue()` to access the password field value and validate the confirm password field matches it.

### Country/Province Dependencies

When a user selects a country, the province dropdown becomes dependent. The province field validates that the selected province belongs to the chosen country. Uses `getFieldValue()` to fetch the country field's current value during validation.

### Start Date/End Date Validation

The end date field must be after the start date. During validation, the end date field reads the start date value using `fieldApi.form.getFieldValue('startDate')` and compares them. Similarly, the start date validates it's before the end date by reading the end date field.

### Dynamic Field Dependencies

When one field changes, dependent fields may need re-validation. Use form-level validation or subscribe to field changes to trigger updates on related fields. Access field values on demand with `getFieldValue()` to determine which fields should appear or be required.

---

## Implementation Approach

Field validation functions receive the field value as their argument. To validate against another field, call `fieldApi.form.getFieldValue('fieldName')` inside the validator function to read other field values. This creates a dependency without explicitly listing it, allowing flexible multi-field validation logic.

---

→ See `templates/linked-fields-form.md` for code examples
