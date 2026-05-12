---
name: controller-attributes
description: Controller class attributes shipped in Laravel 13
---

# Controller Attributes (Laravel 13)

Namespace: `Illuminate\Routing\Attributes\*`

## Middleware

```php
use Illuminate\Routing\Attributes\Middleware;

#[Middleware(['auth', 'verified'])]
class PostController extends Controller
{
    public function index() { /* ... */ }
}
```

Replaces the legacy constructor pattern:

```php
// BEFORE
public function __construct()
{
    $this->middleware(['auth', 'verified']);
}
```

### Method-specific middleware

When middleware applies to a subset of actions, keep using route group syntax in `routes/web.php` or `routes/api.php`. `#[Middleware]` is class-wide only.

## Authorization

```php
use Illuminate\Routing\Attributes\Authorize;

#[Authorize('viewAny', Post::class)]
class PostController extends Controller {}
```

`#[Authorize(ability, model)]` runs the ability against the bound Policy before any action is invoked. Requires the Policy to be registered.

## Combining

```php
#[Middleware(['auth'])]
#[Authorize('manage-posts')]
class PostController extends Controller {}
```

## Notes

- Attributes run BEFORE controller method execution
- For per-action middleware, prefer route-level definitions over attributes
- `#[Authorize]` throws `AuthorizationException` (403) on failure - handle in exception handler if you need custom UX
