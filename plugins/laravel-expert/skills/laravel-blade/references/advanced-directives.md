---
name: advanced-directives
description: Advanced Blade directives for complex scenarios
when-to-use: Using @once, @use, @inject, @switch, @verbatim, stacks
keywords: once, use, inject, switch, verbatim, pushIf, hasStack
---

# Advanced Directives

## Decision Tree - Imports

```
Need PHP class in template?
├── YES → @use('App\Models\User')
└── NO → Need service/container?
    ├── YES → @inject('service', 'App\Services\...')
    └── NO → Standard variables
```

## Decision Tree - Control Flow

```
Multiple conditions on same variable?
├── YES → @switch/@case
└── NO → @if/@elseif
```

## @use - Class Imports

| Syntax | Use When |
|--------|----------|
| `@use('App\Models\User')` | Import single class |
| `@use('App\Models\User', 'UserModel')` | With alias |
| `@use('App\Enums\Status')` | Import enums |

## @inject - Service Injection

| Syntax | Use When |
|--------|----------|
| `@inject('service', 'App\Services\MetricsService')` | Need service methods |
| `@inject('carbon', 'Carbon\Carbon')` | Need utility class |

## @once - Prevent Duplication

| Use When | Purpose |
|----------|---------|
| Scripts in loops | Load JS once |
| Styles in components | Load CSS once |
| Init code in partials | Run setup once |

## @switch - Multiple Conditions

| Directive | Purpose |
|-----------|---------|
| `@switch($var)` | Start switch |
| `@case('value')` | Match case |
| `@break` | Exit case |
| `@default` | Fallback |
| `@endswitch` | End switch |

## @verbatim - Escape Blade

| Use When | Framework |
|----------|-----------|
| Vue.js templates | `{{ }}` conflicts |
| Alpine.js | `x-text` with `{{ }}` |
| Any JS framework | Double braces |

## Advanced Stacks

| Directive | Use When |
|-----------|----------|
| `@push('name')` | Add to end of stack |
| `@prepend('name')` | Add to start of stack |
| `@pushIf($cond, 'name')` | Conditional push |
| `@hasStack('name')` | Check stack not empty |

## Environment Directives

| Directive | Use When |
|-----------|----------|
| `@env('local')` | Single environment |
| `@env(['local', 'staging'])` | Multiple environments |
| `@production` | Production only |

## Session Directives

| Directive | Use When |
|-----------|----------|
| `@session('key')` | Display session flash |

## Common Patterns

| Pattern | Directives |
|---------|------------|
| Load chart.js once in loop | `@once` + `@push` |
| Admin-only analytics | `@env('production')` + `@can` |
| Vue app in Blade | `@verbatim` |
| Role-based panels | `@switch` on role |
| Service data display | `@inject` |

→ **Code examples**: See [templates/AdvancedDirectives.blade.md](templates/AdvancedDirectives.blade.md)
