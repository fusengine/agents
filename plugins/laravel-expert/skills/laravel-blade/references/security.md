---
name: security
description: XSS prevention, CSRF protection, safe output
when-to-use: Ensuring secure template rendering
keywords: xss, csrf, escaping, security, sanitize
---

# Blade Security

## Decision Tree - Output

```
Is it user content?
├── YES → Use {{ }} (escaped)
└── NO → Is it trusted HTML?
    ├── YES → Sanitize first, then {!! !!}
    └── NO → Use {{ }} anyway (safe default)
```

## Output Escaping

| Syntax | Behavior | Use When |
|--------|----------|----------|
| `{{ $var }}` | HTML escaped | User content (DEFAULT) |
| `{!! $var !!}` | Raw output | Sanitized HTML only |
| `@json($data)` | JSON encoded | JavaScript data |
| `{{ e($var) }}` | Explicit escape | When needed |

## Security Rules

| Content Type | Required Action |
|--------------|-----------------|
| User input | ALWAYS `{{ }}` |
| Database text | ALWAYS `{{ }}` |
| Request data | ALWAYS `{{ }}` |
| Admin HTML | Sanitize + `{!! !!}` |
| Markdown output | Sanitize + `{!! !!}` |
| Static strings | `{{ }}` or raw |

## CSRF Protection

| Form Type | Required |
|-----------|----------|
| POST | `@csrf` |
| PUT | `@csrf` + `@method('PUT')` |
| PATCH | `@csrf` + `@method('PATCH')` |
| DELETE | `@csrf` + `@method('DELETE')` |
| GET | None |

## JavaScript Data

| Method | Use When |
|--------|----------|
| `@json($data)` | Pass data to JS |
| `@json($data, JSON_PRETTY_PRINT)` | Debug output |
| `data-config='@json($config)'` | In attributes |

## Vulnerability Prevention

| Vulnerability | Prevention |
|---------------|------------|
| XSS | Always `{{ }}` for user content |
| CSRF | Always `@csrf` in forms |
| Open redirect | Validate URL domains |
| HTML injection | HTMLPurifier before `{!! !!}` |
| JS injection | Use `@json()` for data |
| Path traversal | Never use user input in paths |

## Sanitization

| Need | Solution |
|------|----------|
| Rich text (WYSIWYG) | HTMLPurifier |
| Markdown | League\CommonMark with safe mode |
| Plain text with links | Linkify after escaping |

## Checklist

| Check | Requirement |
|-------|-------------|
| User content | `{{ }}` |
| Forms | `@csrf` |
| URLs in href | Validate protocol |
| Raw HTML | Sanitize first |
| JS data | `@json()` |
| File paths | Never from user input |

→ **Code examples**: See [FormComponent.blade.md](templates/FormComponent.blade.md)
