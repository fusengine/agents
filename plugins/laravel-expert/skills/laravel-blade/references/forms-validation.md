---
name: forms-validation
description: Form handling and validation error display
when-to-use: Building forms with validation feedback
keywords: error, form, validation, checked, selected, disabled, required
---

# Forms & Validation

## Decision Tree - Error Display

```
Need to show validation error?
├── YES → @error('field')
│   │
│   Need custom error bag?
│   ├── YES → @error('field', 'bagName')
│   └── NO → @error('field')
└── NO → Direct output
```

## @error Directive

| Syntax | Use When |
|--------|----------|
| `@error('field')` | Default error bag |
| `@error('field', 'login')` | Named error bag |
| `$message` | Error message variable |

| Pattern | Purpose |
|---------|---------|
| Add class on error | `class="@error('email') is-invalid @enderror"` |
| Show error message | `@error('email') {{ $message }} @enderror` |
| With else | `@error('email') invalid @else valid @enderror` |

## Form Attribute Directives

| Directive | HTML Output | Use When |
|-----------|-------------|----------|
| `@checked($bool)` | `checked` | Checkbox/radio state |
| `@selected($bool)` | `selected` | Select option state |
| `@disabled($bool)` | `disabled` | Disable input |
| `@readonly($bool)` | `readonly` | Read-only input |
| `@required($bool)` | `required` | Required field |

## Common Patterns

| Pattern | Directive Combo |
|---------|-----------------|
| Preserve old input | `@checked(old('remember'))` |
| Selected option | `@selected(old('role') === $value)` |
| Admin-only edit | `@readonly(!$user->isAdmin())` |
| Conditional required | `@required($field->isRequired)` |
| Disable on processing | `@disabled($processing)` |

## Error Display Patterns

| Pattern | Use When |
|---------|----------|
| Inline error | Below input field |
| Error summary | Top of form |
| Field highlighting | Border/background color |
| Icon indicator | Visual error marker |

## old() Helper

| Syntax | Purpose |
|--------|---------|
| `old('name')` | Previous input value |
| `old('name', $default)` | With fallback |
| `old('items.0.name')` | Array input |

## Best Practices

| DO | DON'T |
|----|-------|
| Use @error for each field | Forget error feedback |
| Combine with old() | Lose user input on error |
| Style invalid fields | Only show text errors |
| Use named bags for forms | Mix error bags |

→ **Code examples**: See [FormComponent.blade.md](templates/FormComponent.blade.md)
