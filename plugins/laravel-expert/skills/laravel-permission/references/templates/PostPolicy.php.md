---
name: PostPolicy
description: Complete policy example with Spatie Permission integration
keywords: policy, gate, authorize, ownership, resource
---

# Post Policy

Complete policy integrating Spatie Permission with resource ownership.

## File: app/Policies/PostPolicy.php

```php
<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Post;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

/**
 * Authorization policy for Post model.
 */
final class PostPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any posts.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('view posts');
    }

    /**
     * Determine whether the user can view the post.
     */
    public function view(?User $user, Post $post): bool
    {
        // Published posts are public
        if ($post->isPublished()) {
            return true;
        }

        // Guests cannot view unpublished
        if ($user === null) {
            return false;
        }

        // Admin can view all
        if ($user->can('view unpublished posts')) {
            return true;
        }

        // Authors can view their own drafts
        return $user->id === $post->user_id;
    }

    /**
     * Determine whether the user can create posts.
     */
    public function create(User $user): bool
    {
        return $user->can('create posts');
    }

    /**
     * Determine whether the user can update the post.
     */
    public function update(User $user, Post $post): bool
    {
        // Can edit any post
        if ($user->can('edit all posts')) {
            return true;
        }

        // Can edit own posts only
        if ($user->can('edit own posts')) {
            return $user->id === $post->user_id;
        }

        return false;
    }

    /**
     * Determine whether the user can delete the post.
     */
    public function delete(User $user, Post $post): bool
    {
        // Can delete any post
        if ($user->can('delete any post')) {
            return true;
        }

        // Can delete own posts only
        if ($user->can('delete own posts')) {
            return $user->id === $post->user_id;
        }

        return false;
    }

    /**
     * Determine whether the user can publish the post.
     */
    public function publish(User $user, Post $post): bool
    {
        // Must have publish permission
        if (!$user->can('publish posts')) {
            return false;
        }

        // Cannot publish already published
        if ($post->isPublished()) {
            return false;
        }

        return true;
    }

    /**
     * Determine whether the user can unpublish the post.
     */
    public function unpublish(User $user, Post $post): bool
    {
        // Must have unpublish permission
        if (!$user->can('unpublish posts')) {
            return false;
        }

        // Can only unpublish published posts
        return $post->isPublished();
    }

    /**
     * Determine whether the user can restore the post.
     */
    public function restore(User $user, Post $post): bool
    {
        return $user->can('restore posts');
    }

    /**
     * Determine whether the user can permanently delete the post.
     */
    public function forceDelete(User $user, Post $post): bool
    {
        return $user->can('force delete posts');
    }
}
```

## File: app/Providers/AppServiceProvider.php (Policy Registration)

```php
<?php

declare(strict_types=1);

namespace App\Providers;

use App\Models\Post;
use App\Policies\PostPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

/**
 * Application service provider.
 */
final class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Super Admin bypass (runs before policies)
        Gate::before(function ($user, $ability) {
            return $user->hasRole('Super-Admin') ? true : null;
        });

        // Register policies
        Gate::policy(Post::class, PostPolicy::class);
    }
}
```

## Controller Usage

```php
<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

final class PostController extends Controller
{
    public function edit(Post $post)
    {
        // Throws 403 if unauthorized
        $this->authorize('update', $post);

        return view('posts.edit', compact('post'));
    }

    public function update(Request $request, Post $post)
    {
        $this->authorize('update', $post);

        $post->update($request->validated());

        return redirect()->route('posts.show', $post);
    }

    public function publish(Post $post)
    {
        $this->authorize('publish', $post);

        $post->publish();

        return back()->with('success', 'Post published!');
    }
}
```

## Permission Seeder

```php
<?php

// Permissions needed for this policy
$permissions = [
    'view posts',
    'view unpublished posts',
    'create posts',
    'edit all posts',
    'edit own posts',
    'delete any post',
    'delete own posts',
    'publish posts',
    'unpublish posts',
    'restore posts',
    'force delete posts',
];
```
