---
name: directives
description: Blade control structures and built-in directives
when-to-use: Conditionals, loops, authorization in templates
keywords: if, foreach, auth, can, loop, directives
---

# Blade Directives

## Decision Tree - Conditionals

```
Check authentication?
├── YES → @auth / @guest
└── NO → Check authorization?
    ├── YES → @can / @cannot / @canany
    └── NO → @if / @unless / @isset / @empty
```

## Decision Tree - Loops

```
Need empty state?
├── YES → @forelse
└── NO → Need index?
    ├── YES → @for or @foreach with $loop
    └── NO → @foreach
```

## Conditional Directives

| Directive | Use When |
|-----------|----------|
| `@if / @elseif / @else` | Standard conditions |
| `@unless` | Negated condition |
| `@isset($var)` | Check defined and not null |
| `@empty($var)` | Check "empty" |

## Authentication Directives

| Directive | Use When |
|-----------|----------|
| `@auth` | User is logged in |
| `@guest` | User is not logged in |
| `@auth('admin')` | Specific guard |

## Authorization Directives

| Directive | Use When |
|-----------|----------|
| `@can('edit', $post)` | Check single ability |
| `@elsecan('create', Model::class)` | Chain abilities |
| `@cannot('delete', $post)` | Check cannot |
| `@elsecannot('view', $post)` | Chain cannot |
| `@canany(['edit', 'delete'], $post)` | Any ability matches |
| `@elsecanany(['create'], Model::class)` | Chain any |

## Loop Directives

| Directive | Use When |
|-----------|----------|
| `@foreach` | Iterate collection |
| `@forelse` | With empty state |
| `@for` | Index-based |
| `@while` | Condition-based |
| `@continue` | Skip iteration |
| `@continue($cond)` | Conditional skip |
| `@break` | Exit loop |
| `@break($cond)` | Conditional exit |

## $loop Variable

| Property | Returns |
|----------|---------|
| `$loop->index` | 0-based index |
| `$loop->iteration` | 1-based index |
| `$loop->first` | Is first? |
| `$loop->last` | Is last? |
| `$loop->even` / `$loop->odd` | Parity |
| `$loop->count` | Total items |
| `$loop->remaining` | Items left |
| `$loop->depth` | Nesting level |
| `$loop->parent` | Parent's $loop |

## Attribute Directives

| Directive | Use When |
|-----------|----------|
| `@class([...])` | Conditional classes |
| `@style([...])` | Conditional styles |
| `@checked($bool)` | Checkbox/radio |
| `@selected($bool)` | Select option |
| `@disabled($bool)` | Disable element |
| `@readonly($bool)` | Read-only input |
| `@required($bool)` | Required field |

## Include Directives

| Directive | Use When |
|-----------|----------|
| `@include('view')` | Always include |
| `@includeIf('view')` | If exists |
| `@includeWhen($cond, 'view')` | Conditional |
| `@includeUnless($cond, 'view')` | Negated |
| `@includeFirst(['a', 'b'])` | First that exists |
| `@each('view', $items, 'item')` | Loop include |
| `@each('view', $items, 'item', 'empty')` | With empty view |

## Other Directives

| Directive | Use When |
|-----------|----------|
| `@php ... @endphp` | Raw PHP |
| `@{{ var }}` | Escape for Vue/Alpine |
| `@verbatim` | Escape block |
| `@env('production')` | Check environment |
| `@production` / `@env('local')` | Shortcuts |

→ **Code examples**: See templates/
