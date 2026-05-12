---
name: post-resource-template
description: Full JSON:API resource with relationships and links
---

# Template: PostResource

```php
<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonApiResource;

final class PostResource extends JsonApiResource
{
    public string $type = 'posts';

    /**
     * @return array<string, mixed>
     */
    public function toAttributes(Request $request): array
    {
        return [
            'title' => $this->title,
            'slug' => $this->slug,
            'body' => $this->body,
            'published_at' => $this->published_at?->toIso8601String(),
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
        ];
    }

    /**
     * @return array<string, callable>
     */
    public function relationships(): array
    {
        return [
            'author' => fn () => UserResource::make($this->whenLoaded('author')),
            'comments' => fn () => CommentResource::collection($this->whenLoaded('comments')),
            'tags' => fn () => TagResource::collection($this->whenLoaded('tags')),
        ];
    }

    /**
     * @return array<string, string>
     */
    public function toLinks(Request $request): array
    {
        return [
            'self' => route('api.posts.show', $this->id),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function toMeta(Request $request): array
    {
        return [
            'comments_count' => $this->comments_count ?? $this->comments()->count(),
        ];
    }
}
```

## Controller usage

```php
public function index(Request $request)
{
    $posts = Post::query()
        ->with(['author', 'comments', 'tags'])
        ->withCount('comments')
        ->paginate();

    return PostResource::collection($posts);
}

public function show(Request $request, Post $post)
{
    $post->load(['author', 'comments.author', 'tags']);
    return PostResource::make($post);
}
```

## Example request

```http
GET /api/posts/1?include=author,comments&fields[posts]=title,published_at&fields[users]=name
Accept: application/vnd.api+json
```
