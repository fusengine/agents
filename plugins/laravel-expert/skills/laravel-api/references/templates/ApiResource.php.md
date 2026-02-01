---
name: ApiResource
description: Complete API Resource examples with relationships and conditionals
keywords: resource, api, json, transformation
---

# API Resource Examples

## Basic Resource

```php
<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Transform Post model for API output.
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
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'excerpt' => $this->excerpt,
            'content' => $this->content,
            'published_at' => $this->published_at?->toISOString(),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
```

## Resource with Relationships

```php
<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class PostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'content' => $this->content,

            // Only included if relationship was eager loaded
            'author' => UserResource::make($this->whenLoaded('author')),
            'category' => CategoryResource::make($this->whenLoaded('category')),
            'tags' => TagResource::collection($this->whenLoaded('tags')),
            'comments_count' => $this->whenCounted('comments'),

            'created_at' => $this->created_at->toISOString(),
        ];
    }
}
```

## Conditional Fields

```php
<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class PostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,

            // Only on show endpoint (not in list)
            'content' => $this->when(
                $request->routeIs('posts.show'),
                $this->content
            ),

            // Only if user is admin
            'internal_notes' => $this->when(
                $request->user()?->isAdmin(),
                $this->internal_notes
            ),

            // Include if not null
            'published_at' => $this->whenNotNull($this->published_at?->toISOString()),

            // Merge additional fields conditionally
            $this->mergeWhen($this->is_featured, [
                'featured_image' => $this->featured_image,
                'featured_order' => $this->featured_order,
            ]),
        ];
    }
}
```

## Resource Collection with Custom Wrapper

```php
<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

final class PostCollection extends ResourceCollection
{
    /**
     * The resource that this collection collects.
     */
    public $collects = PostResource::class;

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
                'total_count' => $this->collection->count(),
            ],
        ];
    }

    /**
     * Add additional data to the response.
     *
     * @return array<string, mixed>
     */
    public function with(Request $request): array
    {
        return [
            'api_version' => 'v1',
        ];
    }
}
```

## User Resource (Common Pattern)

```php
<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->when(
                $this->isCurrentUser($request),
                $this->email
            ),
            'avatar_url' => $this->avatar_url,

            // Only for admin viewing other users
            'roles' => $this->when(
                $request->user()?->isAdmin(),
                fn () => $this->roles->pluck('name')
            ),

            'created_at' => $this->created_at->toISOString(),
        ];
    }

    private function isCurrentUser(Request $request): bool
    {
        return $request->user()?->id === $this->id;
    }
}
```

## Controller Usage

```php
// Single resource
public function show(Post $post): PostResource
{
    return PostResource::make($post->load(['author', 'category']));
}

// Collection with pagination
public function index(): AnonymousResourceCollection
{
    $posts = Post::with(['author', 'category'])
        ->latest()
        ->paginate(15);

    return PostResource::collection($posts);
}

// Custom collection
public function index(): PostCollection
{
    $posts = Post::with(['author'])->paginate(15);

    return new PostCollection($posts);
}

// With custom status code
public function store(StorePostRequest $request): JsonResponse
{
    $post = Post::create($request->validated());

    return PostResource::make($post)
        ->response()
        ->setStatusCode(201);
}

// No content response
public function destroy(Post $post): JsonResponse
{
    $post->delete();

    return response()->json(null, 204);
}
```
