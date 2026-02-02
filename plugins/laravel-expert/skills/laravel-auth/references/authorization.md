---
name: authorization
description: Laravel Authorization - gates and policies for access control
when-to-use: Consult when implementing permissions, role checks, access control
keywords: laravel, authorization, gates, policies, can, permissions, rbac
priority: high
requires: authentication.md
related: laravel-permission
---

# Authorization

## Gates vs Policies: When to Use Each?

Laravel provides two authorization mechanisms that serve different purposes:

**Gates** are best for:
- Actions not tied to a specific model
- Global permissions (e.g., "can access admin panel")
- Simple yes/no checks

**Policies** are best for:
- Model-specific actions (CRUD operations)
- Complex authorization logic
- Resource ownership checks

Most apps use both - gates for global checks, policies for model actions.

→ See [templates/GatesAndPolicies.php.md](templates/GatesAndPolicies.php.md) for implementation

---

## How Gates Work

Gates are simple closures that return true/false:

1. **Define** a gate in `AppServiceProvider::boot()`
2. **Check** with `Gate::allows()` or `Gate::denies()`
3. **Enforce** with `Gate::authorize()` (throws exception)

The authenticated user is automatically passed to the gate closure.

---

## How Policies Work

Policies are classes that organize authorization around a model:

1. **Convention**: `Post` model → `PostPolicy` class
2. **Methods**: Match typical actions (view, create, update, delete)
3. **Registration**: Automatic via naming convention

Laravel auto-discovers policies in `app/Policies/`.

---

## Standard Policy Methods

| Method | Corresponds To | Model Param |
|--------|---------------|-------------|
| `viewAny` | Listing all | No |
| `view` | Viewing one | Yes |
| `create` | Creating new | No |
| `update` | Updating | Yes |
| `delete` | Soft deleting | Yes |
| `restore` | Restoring | Yes |
| `forceDelete` | Permanent delete | Yes |

---

## The `before` Filter

Bypass all checks for certain users (like admins):

```php
public function before(User $user, string $ability): bool|null
{
    if ($user->isAdmin()) return true;  // Allow everything
    return null;  // Continue to specific check
}
```

Returning `null` continues to the specific policy method.

---

## Using Authorization

### In Controllers
```php
$this->authorize('update', $post);  // Throws if denied
```

### In Blade Templates
```blade
@can('update', $post)
    <button>Edit</button>
@endcan
```

### Via Route Middleware
```php
Route::put('/post/{post}', ...)->can('update', 'post');
```

---

## Authorization Responses

Return detailed responses instead of booleans for better error messages:

```php
return Response::allow();
return Response::deny('You do not own this post.');
return Response::denyAsNotFound();  // Returns 404 instead of 403
```

---

## Guest Users

Allow unauthenticated users by making `$user` nullable:

```php
public function view(?User $user, Post $post): bool
{
    return $post->is_published;  // Anyone can view published posts
}
```

→ Complete examples: [templates/GatesAndPolicies.php.md](templates/GatesAndPolicies.php.md)
→ Policy template: [templates/PostPolicy.php.md](templates/PostPolicy.php.md)
