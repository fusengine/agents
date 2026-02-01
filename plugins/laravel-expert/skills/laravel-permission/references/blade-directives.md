---
name: blade-directives
description: Spatie Permission Blade directives for view authorization
when-to-use: Showing/hiding UI elements based on roles/permissions
keywords: blade, directive, @role, @can, @hasrole
priority: medium
related: spatie-permission.md
---

# Blade Directives

## Overview

Spatie extends Laravel's Blade with authorization directives. These control what UI elements users can see based on their roles and permissions.

## Role Directives

| Directive | Logic | Use Case |
|-----------|-------|----------|
| `@role('admin')` | Has specific role | Admin-only sections |
| `@hasrole('admin')` | Alias for @role | Same functionality |
| `@hasanyrole('admin\|writer')` | Has ANY role (OR) | Multiple role access |
| `@hasallroles('writer\|reviewer')` | Has ALL roles (AND) | Combined role requirement |
| `@unlessrole('guest')` | Does NOT have role | Guest-excluded content |

## Permission Directives

| Directive | Logic | Use Case |
|-----------|-------|----------|
| `@can('edit articles')` | Has permission | Action buttons |
| `@canany(['edit', 'delete'])` | Has ANY permission | Conditional UI |
| `@cannot('delete')` | Does NOT have permission | Hide dangerous actions |

## Directive Pairs

All directives have closing tags:

| Open | Close |
|------|-------|
| `@role('admin')` | `@endrole` |
| `@hasrole('admin')` | `@endhasrole` |
| `@hasanyrole(...)` | `@endhasanyrole` |
| `@hasallroles(...)` | `@endhasallroles` |
| `@unlessrole(...)` | `@endunlessrole` |
| `@can(...)` | `@endcan` |
| `@canany(...)` | `@endcanany` |
| `@cannot(...)` | `@endcannot` |

## Policy Integration

Blade directives work with Laravel policies:

| Directive | Usage |
|-----------|-------|
| `@can('update', $post)` | Check policy method with model |
| `@can('create', Post::class)` | Check policy method with class |

This integrates Spatie permissions with model-specific policies.

## UI Patterns

### Navigation Menus

Use role directives to show/hide menu items based on user access level.

### Action Buttons

Use permission directives for CRUD buttons (edit, delete) to prevent confusion.

### Dashboard Widgets

Combine directives to show relevant dashboard content per role.

### Form Sections

Hide sensitive form fields from unauthorized users.

## Best Practices

1. **Use permissions for actions** - `@can('edit')` not `@role('admin')`
2. **Server-side validation** - Blade hides UI only, validate on server
3. **Don't over-nest** - Keep directive nesting shallow
4. **Consistent naming** - Match middleware and Blade checks

## Security Note

Blade directives are for **UI convenience only**. They hide elements but don't prevent access. Always:

| Layer | Purpose |
|-------|---------|
| Middleware | Protect routes |
| Policies | Protect models |
| Blade | Hide UI elements |

All three layers should be used together for complete security.

## Related Templates

| Template | Purpose |
|----------|---------|
| [BladeExamples.blade.md](templates/BladeExamples.blade.md) | Complete Blade directive examples |

## Related References

- [spatie-permission.md](spatie-permission.md) - Core concepts
- [middleware.md](middleware.md) - Route protection
