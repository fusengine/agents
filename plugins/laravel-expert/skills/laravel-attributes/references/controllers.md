---
name: controller-attributes
description: Controller class attributes shipped in Laravel 13
---

# Controller Attributes (Laravel 13)

Namespace: `Illuminate\Routing\Attributes\Controllers\*` (`Middleware`, `WithoutMiddleware`, `Authorize`)

## Middleware

```php
use Illuminate\Routing\Attributes\Controllers\Middleware;

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

`#[Middleware]` works at class level (optionally scoped with `only:` / `except:`) and at method level:

```php
#[Middleware('auth')]
#[Middleware('log', only: ['index'])]
#[Middleware('subscribed', except: ['store'])]
class PostController extends Controller
{
    #[Middleware('throttle:60,1')]
    public function store() { /* ... */ }
}
```

Attribute middleware is merged with route/group middleware (13.8+) and inherited by child controllers (13.5+).

### Excluding middleware (13.20+)

```php
use Illuminate\Routing\Attributes\Controllers\WithoutMiddleware;

#[WithoutMiddleware('subscribed', except: ['index'])]
class BillingController extends Controller {}
```

## Authorization

```php
use Illuminate\Routing\Attributes\Controllers\Authorize;

class CommentController extends Controller
{
    #[Authorize('create', [Comment::class, 'post'])]
    public function store(Post $post) { /* ... */ }

    #[Authorize('delete', 'comment')]
    public function destroy(Comment $comment) { /* ... */ }
}
```

`#[Authorize(ability, ...)]` is a shortcut for the `can` middleware: the first argument is the ability, the second the model class, route parameter name, or array of parameters passed to the policy.

## Combining

```php
#[Middleware('auth')]
class PostController extends Controller
{
    #[Authorize('update', 'post')]
    public function update(Post $post) { /* ... */ }
}
```

## Notes

- Attributes run BEFORE controller method execution
- `#[Authorize]` fails with a 403 (`AuthorizationException`) - handle in the exception handler if you need custom UX
