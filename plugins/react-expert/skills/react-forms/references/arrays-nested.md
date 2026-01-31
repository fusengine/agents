---
name: arrays-nested
description: Managing arrays and nested object fields in React forms - mode, field naming, validation strategies
when-to-use: dynamic fields, nested structures, array operations, complex form validation
keywords: arrays, nested fields, mode, dot notation, field arrays, dynamic forms
priority: high
related: templates/dynamic-fields.md, templates/nested-form.md
---

# Arrays and Nested Fields in Forms

## Array Mode (mode="array")

**Structured way to manage collections of data.**

### Purpose
- Manage repeating field groups (like multiple addresses or items)
- Maintain order with array indices
- Add, remove, and reorder items with array methods

### When to Use
- Forms with lists of identical structures
- Shopping carts or line items
- Contact information (multiple phone numbers, emails)
- Repeating sections (work experience, education)

### Key Points
- Each array item gets a unique index
- Methods: `pushValue()`, `removeValue()`, `swapValues()`
- Preserves array order for form submission
- Pairs with field containers for each item

---

## Dot Notation for Nested Objects

**Access deeply nested fields with string paths.**

### Purpose
- Reference nested object properties without extra prop drilling
- Flatten hierarchical structures into single field paths
- Simplify validation and value access

### When to Use
- Forms with nested objects (e.g., `user.profile.firstName`)
- Address components (street, city, zip in one form)
- Multi-level configuration forms
- API response structures reflected in form

### Key Points
- Path: `"user.profile.firstName"` → accesses `user.profile.firstName`
- Works with arrays too: `"items.0.price"` → first item's price
- Validation errors use same path notation
- Simplifies data collection for submission

---

## Validation on Arrays and Nested Fields

**Ensuring data integrity across complex structures.**

### Purpose
- Validate each array item independently
- Validate nested object properties
- Ensure required fields at any depth level

### When to Use
- Each item in an array needs validation rules
- Nested objects have specific requirements
- Arrays must have minimum/maximum items
- Cross-field validation (e.g., start date before end date)

### Key Points
- Validation runs per field path, not per array
- Error messages keyed by field path
- Min/max array length validation available
- Nested field validation same as flat fields

---

## Array Methods

**Operations for managing collections in forms.**

### pushValue()
Add new item to array. Creates empty object with all required fields.

### removeValue()
Remove item at specific index. Automatically re-indexes remaining items.

### swapValues()
Reorder two items in array by swapping their positions. Maintains other items.

---

## Use Cases

**Shopping Cart**: Each cart item (quantity, price, product ID) as array element with validation per item.

**Address Book**: Multiple address objects with nested street, city, country fields using dot notation.

**Job History**: Array of work experience with nested start/end dates, company name, title requiring cross-field validation.

**Dynamic Questions**: Survey form with variable questions where fields are added/removed via array methods.

---

→ See `templates/dynamic-fields.md` for code examples

→ See `templates/nested-form.md` for nested structures examples
