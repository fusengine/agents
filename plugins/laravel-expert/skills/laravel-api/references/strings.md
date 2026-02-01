---
name: strings
description: Laravel string helpers for API development
when-to-use: Manipulating strings, generating slugs, UUIDs
keywords: laravel, php, strings, str, helpers
priority: low
related: validation.md
---

# String Helpers

## Overview

Laravel provides the `Str` class and `str()` helper for common string operations. For APIs, string helpers are useful for generating slugs, UUIDs, formatting data, and string validation.

## Common API Use Cases

| Operation | Method | Example Output |
|-----------|--------|----------------|
| Generate UUID | `Str::uuid()` | `550e8400-e29b-41d4-a716-446655440000` |
| Generate ULID | `Str::ulid()` | `01ARZ3NDEKTSV4RRFFQ69G5FAV` |
| Create slug | `Str::slug('Post Title')` | `post-title` |
| Random string | `Str::random(32)` | Random alphanumeric |
| Truncate | `Str::limit($text, 100)` | First 100 chars with ... |

## Fluent Strings

Chain operations with `str()` helper:

```php
$slug = str('Hello World')->slug()->value();
$title = str($input)->trim()->title()->value();
```

## Validation Helpers

| Method | Purpose |
|--------|---------|
| `Str::isUuid($value)` | Check if valid UUID |
| `Str::isUlid($value)` | Check if valid ULID |
| `Str::isJson($value)` | Check if valid JSON |
| `Str::isUrl($value)` | Check if valid URL |

## Transformation Methods

| Method | Input | Output |
|--------|-------|--------|
| `Str::camel()` | `'hello_world'` | `'helloWorld'` |
| `Str::snake()` | `'helloWorld'` | `'hello_world'` |
| `Str::kebab()` | `'helloWorld'` | `'hello-world'` |
| `Str::studly()` | `'hello_world'` | `'HelloWorld'` |
| `Str::title()` | `'hello world'` | `'Hello World'` |
| `Str::lower()` | `'HELLO'` | `'hello'` |
| `Str::upper()` | `'hello'` | `'HELLO'` |

## Extraction Methods

| Method | Purpose |
|--------|---------|
| `Str::before($str, '@')` | Get part before delimiter |
| `Str::after($str, '@')` | Get part after delimiter |
| `Str::between($str, '[', ']')` | Get part between delimiters |
| `Str::substr($str, 0, 10)` | Extract substring |

## Search Methods

| Method | Returns |
|--------|---------|
| `Str::contains($str, 'needle')` | true/false |
| `Str::startsWith($str, 'prefix')` | true/false |
| `Str::endsWith($str, 'suffix')` | true/false |
| `Str::containsAll($str, ['a', 'b'])` | true if all present |

## Pluralization

Laravel handles English pluralization:

```php
Str::plural('post');     // 'posts'
Str::singular('posts');  // 'post'
Str::plural('child');    // 'children'
```

## Masking

Hide sensitive data:

```php
Str::mask('secret@email.com', '*', 3);  // 'sec***********'
```

## Best Practices

1. **Use Str class** - Over native PHP functions for consistency
2. **UUID for IDs** - When hiding sequential IDs from API
3. **Slugs for URLs** - Human-readable resource identifiers
4. **Mask sensitive** - In logs and error messages
5. **Validate format** - Use `isUuid()`, `isJson()` before processing

## Related References

- [validation.md](validation.md) - String validation rules
- [responses.md](responses.md) - Transforming data for output
