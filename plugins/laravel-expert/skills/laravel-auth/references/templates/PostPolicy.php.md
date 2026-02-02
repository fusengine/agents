---
name: PostPolicy.php
description: Complete policy class with all authorization methods and before filter
keywords: policy, authorization, gate, can, before, viewAny, create, update, delete
source: https://laravel.com/docs/12.x/authorization
---

# Post Policy Template

## Generate Policy

```bash
php artisan make:policy PostPolicy --model=Post
```

---

## File: app/Policies/PostPolicy.php

```php
<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Post;
use App\Models\User;
use Illuminate\Auth\Access\Response;

/**
 * Post authorization policy.
 *
 * Policies are automatically discovered by Laravel when following
 * naming convention: Post model -> PostPolicy class.
 */
final class PostPolicy
{
    /**
     * Perform pre-authorization checks.
     *
     * Returning true authorizes all actions.
     * Returning false denies all actions.
     * Returning null continues to specific method.
     */
    public function before(User $user, string $ability): bool|null
    {
        if ($user->isAdmin()) {
            return true; // Admins can do anything
        }

        return null; // Continue to specific check
    }

    /**
     * Determine whether the user can view any posts.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the post.
     *
     * @param User|null $user Nullable for guest access
     */
    public function view(?User $user, Post $post): bool
    {
        // Anyone can view published posts
        if ($post->published_at !== null) {
            return true;
        }

        // Only owner can view drafts
        return $user?->id === $post->user_id;
    }

    /**
     * Determine whether the user can create posts.
     */
    public function create(User $user): bool
    {
        return $user->hasVerifiedEmail();
    }

    /**
     * Determine whether the user can update the post.
     */
    public function update(User $user, Post $post): Response
    {
        return $user->id === $post->user_id
            ? Response::allow()
            : Response::deny('You do not own this post.');
    }

    /**
     * Determine whether the user can delete the post.
     */
    public function delete(User $user, Post $post): bool
    {
        return $user->id === $post->user_id;
    }

    /**
     * Determine whether the user can restore the post.
     */
    public function restore(User $user, Post $post): bool
    {
        return $user->id === $post->user_id;
    }

    /**
     * Determine whether the user can permanently delete the post.
     */
    public function forceDelete(User $user, Post $post): bool
    {
        // Only admins (handled by before method)
        return false;
    }
}
```

---

## Manual Registration (Optional)

Laravel auto-discovers policies, but you can register manually:

```php
// app/Providers/AppServiceProvider.php
use App\Models\Post;
use App\Policies\PostPolicy;
use Illuminate\Support\Facades\Gate;

public function boot(): void
{
    Gate::policy(Post::class, PostPolicy::class);
}
```

---

## Usage in Controllers

```php
<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', Post::class);

        return Post::all();
    }

    public function show(Post $post)
    {
        $this->authorize('view', $post);

        return $post;
    }

    public function update(Request $request, Post $post)
    {
        $this->authorize('update', $post);

        $post->update($request->validated());

        return $post;
    }

    public function destroy(Post $post)
    {
        $this->authorize('delete', $post);

        $post->delete();

        return response()->noContent();
    }
}
```

---

## Usage in Blade

```blade
@can('update', $post)
    <a href="{{ route('posts.edit', $post) }}">Edit</a>
@endcan

@cannot('delete', $post)
    <p>You cannot delete this post.</p>
@endcannot

@canany(['update', 'delete'], $post)
    <div class="actions">...</div>
@endcanany
```

---

## Usage via Gate

```php
use Illuminate\Support\Facades\Gate;

// Check
if (Gate::allows('update', $post)) {
    // ...
}

// Authorize (throws exception)
Gate::authorize('update', $post);

// For specific user
Gate::forUser($user)->allows('update', $post);
```

---

## Route Middleware

```php
Route::put('/posts/{post}', [PostController::class, 'update'])
    ->middleware('can:update,post');

// Or fluent
Route::put('/posts/{post}', [PostController::class, 'update'])
    ->can('update', 'post');
```

---

## Testing Policies

```php
<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PostPolicyTest extends TestCase
{
    use RefreshDatabase;

    public function test_owner_can_update_post(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->for($user)->create();

        $this->assertTrue($user->can('update', $post));
    }

    public function test_non_owner_cannot_update_post(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create(); // Different owner

        $this->assertFalse($user->can('update', $post));
    }

    public function test_admin_can_do_anything(): void
    {
        $admin = User::factory()->admin()->create();
        $post = Post::factory()->create();

        $this->assertTrue($admin->can('forceDelete', $post));
    }
}
```
