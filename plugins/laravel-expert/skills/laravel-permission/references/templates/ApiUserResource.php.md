---
name: ApiUserResource
description: API Resource with permissions included
keywords: api, resource, json, permission, response
---

# API User Resource

API Resource including user permissions.

## File: app/Http/Resources/UserResource.php

```php
<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * User API resource with permissions.
 *
 * @mixin \App\Models\User
 */
final class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'email_verified_at' => $this->email_verified_at?->toIso8601String(),
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),

            // Roles and permissions
            'roles' => $this->getRoleNames(),
            'permissions' => $this->whenLoaded('permissions', fn () =>
                $this->getAllPermissions()->pluck('name')
            ),

            // Computed abilities for frontend
            'abilities' => $this->when($request->user()?->is($this->resource), fn () => [
                'can_edit_posts' => $this->can('edit posts'),
                'can_delete_posts' => $this->can('delete posts'),
                'can_manage_users' => $this->can('manage users'),
                'is_admin' => $this->hasRole('admin'),
            ]),

            // Links for HATEOAS
            'links' => [
                'self' => route('api.users.show', $this->id),
                'posts' => route('api.users.posts', $this->id),
            ],
        ];
    }
}
```

## File: app/Http/Resources/UserCollection.php

```php
<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

/**
 * User collection resource.
 */
final class UserCollection extends ResourceCollection
{
    /**
     * The resource that this resource collects.
     *
     * @var string
     */
    public $collects = UserResource::class;

    /**
     * Transform the resource collection into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'data' => $this->collection,
            'meta' => [
                'total' => $this->total(),
                'per_page' => $this->perPage(),
                'current_page' => $this->currentPage(),
                'last_page' => $this->lastPage(),
            ],
        ];
    }
}
```

## File: app/Http/Resources/PostResource.php

```php
<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Post API resource with permission-based actions.
 *
 * @mixin \App\Models\Post
 */
final class PostResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $user = $request->user();

        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'content' => $this->content,
            'excerpt' => $this->excerpt,
            'status' => $this->status,
            'published_at' => $this->published_at?->toIso8601String(),
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),

            // Author
            'author' => new UserResource($this->whenLoaded('author')),

            // Permission-based actions (what current user can do)
            'can' => [
                'view' => $user?->can('view', $this->resource) ?? false,
                'update' => $user?->can('update', $this->resource) ?? false,
                'delete' => $user?->can('delete', $this->resource) ?? false,
                'publish' => $user?->can('publish', $this->resource) ?? false,
            ],

            // Conditional links based on permissions
            'links' => [
                'self' => route('api.posts.show', $this->id),
                'edit' => $this->when(
                    $user?->can('update', $this->resource),
                    route('api.posts.update', $this->id)
                ),
                'delete' => $this->when(
                    $user?->can('delete', $this->resource),
                    route('api.posts.destroy', $this->id)
                ),
            ],
        ];
    }
}
```

## Controller Usage

```php
<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PostResource;
use App\Http\Resources\UserCollection;
use App\Http\Resources\UserResource;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;

final class UserController extends Controller
{
    public function index(Request $request)
    {
        $users = User::with('roles')
            ->orderBy('name')
            ->paginate(20);

        return new UserCollection($users);
    }

    public function show(User $user)
    {
        $user->load('roles', 'permissions');

        return new UserResource($user);
    }
}

final class PostController extends Controller
{
    public function index(Request $request)
    {
        $posts = Post::with('author')
            ->published()
            ->paginate(15);

        return PostResource::collection($posts);
    }

    public function show(Post $post)
    {
        $this->authorize('view', $post);

        $post->load('author', 'comments');

        return new PostResource($post);
    }
}
```
