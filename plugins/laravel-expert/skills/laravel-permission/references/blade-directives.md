---
name: blade-directives
description: Spatie Permission Blade directives for view authorization
when-to-use: Showing/hiding UI elements based on roles/permissions
keywords: blade, directive, @role, @can, @hasrole
priority: medium
related: spatie-permission.md
---

# Blade Directives

## Role Directives

```blade
@role('admin')
    <a href="/admin">Admin Panel</a>
@endrole

@hasrole('writer')
    <p>Writer access</p>
@endhasrole

{{-- Multiple roles (OR) --}}
@hasrole('writer|admin')
    <p>Editor access</p>
@endhasrole

{{-- Inverse --}}
@unlessrole('admin')
    <p>Not an admin</p>
@endunlessrole
```

## Permission Directives

```blade
@can('edit articles')
    <button>Edit</button>
@endcan

@canany(['edit articles', 'publish articles'])
    <div>Actions available</div>
@endcanany

@cannot('delete articles')
    <p>No delete access</p>
@endcannot
```

## Multiple Roles (AND)

```blade
@hasallroles('writer|admin')
    <p>Has both writer AND admin roles</p>
@endhasallroles
```

## Using with Parameters

```blade
@can('update', $post)
    <button>Edit Post</button>
@endcan
```
