---
name: Resource.php
description: Complete API Resource with conditionals and collections
file-type: php
---

# API Resource Template

## Complete Resource

```php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    /**
     * The "data" wrapper that should be applied.
     */
    public static $wrap = 'data';

    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            // Basic attributes
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'excerpt' => $this->excerpt,
            'content' => $this->content,

            // Dates
            'published_at' => $this->published_at?->toISOString(),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),

            // Computed attributes
            'reading_time' => $this->reading_time,
            'is_published' => $this->is_published,

            // Conditional attributes
            'views' => $this->when($request->user()?->isAdmin(), $this->views),
            'internal_notes' => $this->when($this->shouldShowNotes($request), $this->internal_notes),

            // Conditional on attribute existence
            'seo_title' => $this->whenHas('seo_title'),
            'featured_image' => $this->whenNotNull($this->featured_image),

            // Merge conditional attributes
            $this->mergeWhen($request->user()?->isAdmin(), [
                'admin_notes' => $this->admin_notes,
                'moderation_status' => $this->moderation_status,
            ]),

            // Relationships (only if loaded)
            'author' => new UserResource($this->whenLoaded('author')),
            'category' => new CategoryResource($this->whenLoaded('category')),
            'comments' => CommentResource::collection($this->whenLoaded('comments')),
            'tags' => TagResource::collection($this->whenLoaded('tags')),

            // Counts (only if loaded)
            'comments_count' => $this->whenCounted('comments'),
            'likes_count' => $this->whenCounted('likes'),

            // Aggregates (only if loaded)
            'average_rating' => $this->whenAggregated('ratings', 'avg', 'score'),

            // Pivot data (if loaded via many-to-many)
            'pivot' => $this->whenPivotLoaded('post_tag', function () {
                return [
                    'order' => $this->pivot->order,
                    'featured' => $this->pivot->featured,
                ];
            }),

            // Links
            'links' => [
                'self' => route('posts.show', $this->slug),
                'edit' => $this->when(
                    $request->user()?->can('update', $this->resource),
                    route('posts.edit', $this->slug)
                ),
            ],
        ];
    }

    /**
     * Get additional data that should be returned with the resource array.
     */
    public function with(Request $request): array
    {
        return [
            'meta' => [
                'version' => '1.0',
                'api_documentation' => url('/docs/posts'),
            ],
        ];
    }

    /**
     * Customize the outgoing response for the resource.
     */
    public function withResponse(Request $request, $response): void
    {
        $response->header('X-Resource-Type', 'post');
    }

    /**
     * Determine if internal notes should be shown.
     */
    private function shouldShowNotes(Request $request): bool
    {
        return $request->user()?->id === $this->author_id
            || $request->user()?->isAdmin();
    }
}
```

---

## Resource Collection

```php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class PostCollection extends ResourceCollection
{
    /**
     * The resource that this resource collects.
     */
    public $collects = PostResource::class;

    /**
     * Transform the resource collection into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'data' => $this->collection,
            'meta' => [
                'total_posts' => $this->collection->count(),
                'total_views' => $this->collection->sum('views'),
            ],
        ];
    }

    /**
     * Get additional data that should be returned.
     */
    public function with(Request $request): array
    {
        return [
            'links' => [
                'create' => route('posts.create'),
            ],
        ];
    }
}
```

---

## Minimal Resource

```php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->when($request->user()?->id === $this->id, $this->email),
            'avatar' => $this->avatar_url,
            'created_at' => $this->created_at->toISOString(),

            // Relationships
            'posts' => PostResource::collection($this->whenLoaded('posts')),
            'roles' => RoleResource::collection($this->whenLoaded('roles')),

            // Counts
            'posts_count' => $this->whenCounted('posts'),
        ];
    }
}
```

---

## Usage in Controller

```php
<?php

namespace App\Http\Controllers;

use App\Http\Resources\PostCollection;
use App\Http\Resources\PostResource;
use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    /**
     * Display a listing of posts.
     */
    public function index(Request $request)
    {
        $posts = Post::query()
            ->with(['author:id,name,avatar', 'category:id,name,slug'])
            ->withCount('comments')
            ->published()
            ->latest()
            ->paginate(15);

        // Option 1: Anonymous collection (auto pagination)
        return PostResource::collection($posts);

        // Option 2: Custom collection class
        return new PostCollection($posts);

        // Option 3: With additional meta
        return PostResource::collection($posts)
            ->additional(['meta' => ['key' => 'value']]);
    }

    /**
     * Display the specified post.
     */
    public function show(Post $post)
    {
        $post->load(['author', 'category', 'comments.user', 'tags']);
        $post->loadCount(['comments', 'likes']);

        return new PostResource($post);

        // With additional data
        return (new PostResource($post))
            ->additional(['meta' => ['related' => $this->getRelated($post)]]);

        // With custom response
        return (new PostResource($post))
            ->response()
            ->header('X-Custom-Header', 'value');
    }
}
```

---

## Conditional Resource Fields

```php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'number' => $this->order_number,
            'status' => $this->status,
            'total' => $this->total,

            // Only for authenticated users
            'customer' => $this->when(
                $request->user(),
                new UserResource($this->whenLoaded('customer'))
            ),

            // Only for admins
            $this->mergeWhen($request->user()?->isAdmin(), [
                'cost' => $this->cost,
                'margin' => $this->margin,
                'internal_id' => $this->internal_id,
            ]),

            // Only for owner or admin
            'shipping_address' => $this->when(
                $this->isOwnerOrAdmin($request),
                $this->shipping_address
            ),

            // Different data based on role
            'items' => $this->when(
                $request->user(),
                fn () => $request->user()->isAdmin()
                    ? OrderItemDetailResource::collection($this->whenLoaded('items'))
                    : OrderItemResource::collection($this->whenLoaded('items'))
            ),
        ];
    }

    private function isOwnerOrAdmin(Request $request): bool
    {
        return $request->user()?->id === $this->customer_id
            || $request->user()?->isAdmin();
    }
}
```

---

## Disable Wrapping

```php
<?php

namespace App\Providers;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // Globally disable wrapping
        JsonResource::withoutWrapping();
    }
}

// Or per-resource
class UserResource extends JsonResource
{
    public static $wrap = null; // No wrapping
    // or
    public static $wrap = 'user'; // Custom key
}
```
