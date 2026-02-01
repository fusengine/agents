---
name: validation
description: Laravel API validation patterns with Form Requests
when-to-use: Validating API input, creating Form Requests
keywords: laravel, php, validation, form request, api
priority: high
related: controllers.md, requests.md
---

# API Validation

## Overview

Laravel provides powerful validation for incoming request data. For APIs, validation errors return JSON with 422 Unprocessable Entity status. Form Requests are the recommended approach - they separate validation logic from controllers.

## Why Form Requests

| Benefit | Description |
|---------|-------------|
| **Separation** | Validation logic outside controllers |
| **Reusability** | Same request class for multiple endpoints |
| **Authorization** | Built-in `authorize()` method |
| **Testability** | Easy to test validation rules |
| **Auto-response** | 422 JSON response on failure |

## Form Request Structure

Form Requests are classes that extend `FormRequest`. They contain two methods:

**authorize()** returns true if the user can make this request. Return false for 403 Forbidden. For public endpoints, just return true.

**rules()** returns an array of validation rules. Keys are field names, values are rule strings or arrays.

## Creating Form Requests

Use Artisan to generate Form Request classes:

```shell
php artisan make:request StorePostRequest
php artisan make:request UpdatePostRequest
```

Classes are created in `app/Http/Requests/`. Type-hint them in controller methods and Laravel validates automatically before the method runs.

## Rule Syntax

Rules can be written as pipe-delimited strings or arrays:

| Format | Example |
|--------|---------|
| String | `'required|string|max:255'` |
| Array | `['required', 'string', 'max:255']` |
| With parameters | `'exists:users,id'` |
| Rule objects | `[new Uppercase]` |

Array format is clearer for complex rules with parameters.

## Common Validation Rules

| Rule | Purpose |
|------|---------|
| `required` | Field must be present and not empty |
| `nullable` | Field can be null |
| `string` | Must be a string |
| `integer` | Must be an integer |
| `email` | Must be valid email format |
| `max:255` | Maximum length/value |
| `min:1` | Minimum length/value |
| `unique:table,column` | Must not exist in database |
| `exists:table,column` | Must exist in database |
| `in:a,b,c` | Must be one of listed values |
| `array` | Must be an array |
| `date` | Must be a valid date |

## API Error Response

When validation fails on an API request, Laravel returns:

```json
{
    "message": "The given data was invalid.",
    "errors": {
        "title": ["The title field is required."],
        "email": ["The email must be a valid email address."]
    }
}
```

Status code is 422 Unprocessable Entity.

## Custom Error Messages

Override messages in Form Request with `messages()` method. Keys follow `field.rule` pattern.

Override attribute names with `attributes()` method for cleaner messages ("email address" instead of "email").

## Conditional Validation

Use `sometimes()` for conditional rules. Use `Rule::when()` for inline conditionals. Useful when update validation differs from create validation.

## Array Validation

Validate array fields with dot notation: `'items.*.name' => 'required'` validates name field in each array item.

## Custom Rules

Create custom rule classes with `php artisan make:rule`. Implement `validate()` method that returns true/false. Use for complex business logic validation.

## Best Practices

1. **Always use Form Requests** - Never validate in controllers
2. **Separate create/update** - Different rules for store vs update
3. **Use Rule objects** - For complex rules with parameters
4. **Custom messages** - User-friendly error messages
5. **Validate early** - Fail fast before expensive operations

## Related Templates

| Template | Purpose |
|----------|---------|
| [FormRequest.php.md](templates/FormRequest.php.md) | Complete Form Request example |
| [validation-rules.md](templates/validation-rules.md) | All available rules reference |

## Related References

- [controllers.md](controllers.md) - Using Form Requests in controllers
- [requests.md](requests.md) - Request handling
- [responses.md](responses.md) - Error responses
