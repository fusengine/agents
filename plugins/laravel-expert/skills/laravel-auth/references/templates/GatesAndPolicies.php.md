---
name: GatesAndPolicies.php
description: Authorization gates and policies from official Laravel 12 docs
keywords: gates, policies, authorization, can, cannot
source: https://laravel.com/docs/12.x/authorization
---

# Gates and Policies Templates

## Defining Gates

```php
use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Facades\Gate;

// In AppServiceProvider boot()
public function boot(): void
{
    Gate::define('update-post', function (User $user, Post $post) {
        return $user->id === $post->user_id;
    });

    // Using class callback
    Gate::define('update-post', [PostPolicy::class, 'update']);
}
```

## Using Gates

```php
use Illuminate\Support\Facades\Gate;

// Check authorization
if (Gate::allows('update-post', $post)) {
    // The user can update the post...
}

if (Gate::denies('update-post', $post)) {
    // The user can't update the post...
}

// For specific user
if (Gate::forUser($user)->allows('update-post', $post)) {
    // ...
}

// Multiple abilities
if (Gate::any(['update-post', 'delete-post'], $post)) {
    // The user can update or delete...
}

if (Gate::none(['update-post', 'delete-post'], $post)) {
    // The user can't update or delete...
}

// Throw exception if denied
Gate::authorize('update-post', $post);
```

## Gate Responses

```php
use Illuminate\Auth\Access\Response;
use Illuminate\Support\Facades\Gate;

Gate::define('edit-settings', function (User $user) {
    return $user->isAdmin
        ? Response::allow()
        : Response::deny('You must be an administrator.');
});

// Custom HTTP status
Gate::define('edit-settings', function (User $user) {
    return $user->isAdmin
        ? Response::allow()
        : Response::denyWithStatus(404);
});

// Or use convenience method
Response::denyAsNotFound();

// Inspect response
$response = Gate::inspect('edit-settings');
if ($response->allowed()) {
    // ...
} else {
    echo $response->message();
}
```

## Gate Interceptors

```php
use Illuminate\Support\Facades\Gate;

// Before all checks
Gate::before(function (User $user, string $ability) {
    if ($user->isAdministrator()) {
        return true;
    }
});

// After all checks
Gate::after(function (User $user, string $ability, bool|null $result, mixed $arguments) {
    if ($user->isAdministrator()) {
        return true;
    }
});
```

## Inline Authorization

```php
use Illuminate\Support\Facades\Gate;

Gate::allowIf(fn (User $user) => $user->isAdministrator());
Gate::denyIf(fn (User $user) => $user->banned());
```

## Policy Class

```php
<?php

namespace App\Policies;

use App\Models\Post;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PostPolicy
{
    /**
     * Pre-authorization checks.
     */
    public function before(User $user, string $ability): bool|null
    {
        if ($user->isAdministrator()) {
            return true;
        }

        return null;
    }

    /**
     * Determine if any posts can be viewed.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine if the given post can be viewed.
     */
    public function view(User $user, Post $post): bool
    {
        return true;
    }

    /**
     * Determine if posts can be created.
     */
    public function create(User $user): bool
    {
        return $user->role == 'writer';
    }

    /**
     * Determine if the given post can be updated.
     */
    public function update(User $user, Post $post): Response
    {
        return $user->id === $post->user_id
            ? Response::allow()
            : Response::deny('You do not own this post.');
    }

    /**
     * Determine if the given post can be deleted.
     */
    public function delete(User $user, Post $post): bool
    {
        return $user->id === $post->user_id;
    }

    /**
     * Guest user support (optional type hint).
     */
    public function viewPublic(?User $user, Post $post): bool
    {
        return $post->is_public;
    }
}
```

## Registering Policies

```php
use App\Models\Order;
use App\Policies\OrderPolicy;
use Illuminate\Support\Facades\Gate;

// Manual registration in AppServiceProvider
public function boot(): void
{
    Gate::policy(Order::class, OrderPolicy::class);
}
```

## Model Attribute for Policy

```php
<?php

namespace App\Models;

use App\Policies\OrderPolicy;
use Illuminate\Database\Eloquent\Attributes\UsePolicy;
use Illuminate\Database\Eloquent\Model;

#[UsePolicy(OrderPolicy::class)]
class Order extends Model
{
    //
}
```

## Using Policies in Controllers

```php
<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class PostController extends Controller
{
    public function update(Request $request, Post $post)
    {
        // Via user model
        if ($request->user()->cannot('update', $post)) {
            abort(403);
        }

        // Via Gate facade (throws exception)
        Gate::authorize('update', $post);

        // For actions without models
        if ($request->user()->cannot('create', Post::class)) {
            abort(403);
        }
    }
}
```

## Middleware Authorization

```php
use App\Models\Post;

// String syntax
Route::put('/post/{post}', function (Post $post) {
    // ...
})->middleware('can:update,post');

// Fluent syntax
Route::put('/post/{post}', function (Post $post) {
    // ...
})->can('update', 'post');

// Without model
Route::post('/post', function () {
    // ...
})->can('create', Post::class);
```

## Blade Directives

```blade
@can('update', $post)
    <!-- The current user can update the post... -->
@elsecan('create', App\Models\Post::class)
    <!-- The current user can create new posts... -->
@else
    <!-- ... -->
@endcan

@cannot('update', $post)
    <!-- The current user cannot update the post... -->
@elsecannot('create', App\Models\Post::class)
    <!-- The current user cannot create new posts... -->
@endcannot

@canany(['update', 'view', 'delete'], $post)
    <!-- The current user can update, view, or delete the post... -->
@endcanany
```

## Inertia Authorization

```php
<?php

namespace App\Http\Middleware;

use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    public function share(Request $request)
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
                'permissions' => [
                    'post' => [
                        'create' => $request->user()?->can('create', Post::class),
                    ],
                ],
            ],
        ];
    }
}
```
