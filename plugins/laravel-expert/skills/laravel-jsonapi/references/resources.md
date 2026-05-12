---
name: jsonapi-resources
description: JsonApiResource base class structure
---

# JsonApiResource

Namespace: `Illuminate\Http\Resources\Json\JsonApiResource`

Extends `JsonResource` and adds JSON:API v1.1 spec compliance.

## Anatomy

```php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonApiResource;

class PostResource extends JsonApiResource
{
    /**
     * JSON:API resource type (REQUIRED).
     */
    public string $type = 'posts';

    /**
     * Attributes object.
     */
    public function toAttributes($request): array
    {
        return [
            'title' => $this->title,
            'body' => $this->body,
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }

    /**
     * Relationships object - whitelist what clients may include.
     */
    public function relationships(): array
    {
        return [
            'author' => fn () => UserResource::make($this->whenLoaded('author')),
            'comments' => fn () => CommentResource::collection($this->whenLoaded('comments')),
        ];
    }

    /**
     * Top-level links (self, related, pagination).
     */
    public function toLinks($request): array
    {
        return [
            'self' => route('posts.show', $this->id),
        ];
    }

    /**
     * Optional meta object.
     */
    public function toMeta($request): array
    {
        return ['version' => '1.0'];
    }
}
```

## Response shape

```json
{
  "data": {
    "id": "1",
    "type": "posts",
    "attributes": {
      "title": "Hello World",
      "body": "...",
      "created_at": "2026-05-12T10:00:00Z"
    },
    "links": {
      "self": "https://api.example.com/posts/1"
    }
  }
}
```

`Content-Type: application/vnd.api+json` is set automatically.
