---
name: Resource
description: API Resource for FuseCore module
keywords: resource, json, api, transform
---

# API Resource Template

API Resource for FuseCore module.

## File: FuseCore/{Module}/App/Http/Resources/PostResource.php

```php
<?php

declare(strict_types=1);

namespace FuseCore\Blog\App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Post API resource.
 *
 * @mixin \FuseCore\Blog\App\Models\Post
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
            'content' => $this->content,
            'excerpt' => $this->excerpt,
            'status' => $this->status,
            'is_published' => $this->isPublished(),
            'published_at' => $this->published_at?->toIso8601String(),
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),

            // Relationships
            'author' => new UserResource($this->whenLoaded('author')),
            'tags' => TagResource::collection($this->whenLoaded('tags')),
            'comments_count' => $this->whenCounted('comments'),

            // Conditional fields
            'can_edit' => $this->when(
                $request->user()?->id === $this->user_id,
                true
            ),

            // Links
            'links' => [
                'self' => route('blog.posts.show', $this->id),
            ],
        ];
    }
}
```

## Minimal Resource

```php
<?php

declare(strict_types=1);

namespace FuseCore\Blog\App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Category API resource.
 *
 * @mixin \FuseCore\Blog\App\Models\Category
 */
final class CategoryResource extends JsonResource
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
            'slug' => $this->slug,
        ];
    }
}
```

## Resource Collection

```php
<?php

declare(strict_types=1);

namespace FuseCore\Blog\App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

/**
 * Post collection resource.
 */
final class PostCollection extends ResourceCollection
{
    /**
     * The resource that this resource collects.
     *
     * @var string
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
                'total' => $this->total(),
                'per_page' => $this->perPage(),
                'current_page' => $this->currentPage(),
                'last_page' => $this->lastPage(),
            ],
        ];
    }
}
```

## Cross-Module Resource Reference

```php
<?php

declare(strict_types=1);

namespace FuseCore\Blog\App\Http\Resources;

use FuseCore\User\App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Comment API resource.
 */
final class CommentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'body' => $this->body,
            'created_at' => $this->created_at->toIso8601String(),
            // Reference User module's resource
            'user' => new UserResource($this->whenLoaded('user')),
        ];
    }
}
```
