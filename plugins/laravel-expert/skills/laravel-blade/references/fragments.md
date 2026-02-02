---
name: fragments
description: Blade fragments for partial page updates (HTMX, Turbo, Livewire)
when-to-use: Building SPA-like interactions without full page reloads
keywords: fragment, htmx, turbo, partial, ajax, spa
---

# Fragments (Laravel 12+)

## Decision Tree

```
Need partial page update?
├── YES → Using HTMX/Turbo?
│   ├── YES → @fragment + ->fragment()
│   └── NO → Using Livewire?
│       ├── YES → Livewire components
│       └── NO → Consider @fragment for AJAX
└── NO → Standard full-page render
```

## Overview

| Feature | Purpose |
|---------|---------|
| `@fragment('name')` | Define reusable section |
| `->fragment('name')` | Return only that section |
| `->fragmentIf($cond, 'name')` | Conditional fragment |
| `->fragments(['a', 'b'])` | Return multiple fragments |

## @fragment Directive

| Syntax | Purpose |
|--------|---------|
| `@fragment('name')` | Start fragment |
| `@endfragment` | End fragment |

## Controller Methods

| Method | Use When |
|--------|----------|
| `->fragment('name')` | Always return fragment |
| `->fragmentIf($bool, 'name')` | Conditional (HTMX request) |
| `->fragments(['a', 'b'])` | Multiple fragments |

## HTMX Integration

| Header | Purpose |
|--------|---------|
| `HX-Request` | Detect HTMX request |
| `HX-Target` | Target element ID |
| `HX-Trigger` | Trigger element |

## Common Patterns

| Pattern | Use Case |
|---------|----------|
| List refresh | Update table without reload |
| Form feedback | Show success/error message |
| Infinite scroll | Load more items |
| Live search | Update results on type |
| Tab content | Load tab on click |

## Best Practices

| DO | DON'T |
|----|-------|
| Name fragments descriptively | Use generic names |
| Check for HTMX header | Always return fragment |
| Keep fragments focused | Make fragments too large |
| Test full-page fallback | Break non-JS users |

## vs Livewire

| Feature | Fragments | Livewire |
|---------|-----------|----------|
| Complexity | Low | Medium |
| Real-time | HTMX polling | WebSockets |
| State | Stateless | Stateful |
| Dependencies | None | Livewire package |

→ **Code examples**: See [Fragments.blade.md](templates/Fragments.blade.md)
