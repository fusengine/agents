---
name: jsonapi-resources
description: JsonApiResource base class structure
---

# JsonApiResource

Namespace: `Illuminate\Http\Resources\JsonApi\JsonApiResource`

Extends `JsonResource` and adds JSON:API spec compliance. Generate with:

```shell
php artisan make:resource PostResource --json-api
```

## Anatomy

```php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\JsonApi\JsonApiResource;

class PostResource extends JsonApiResource
{
    /**
     * Simple form: attribute names read from the model.
     * (Override toAttributes() instead for full control.)
     */
    public $attributes = [
        'title',
        'body',
        'created_at',
    ];

    /**
     * Includable relationships - only serialized when requested via ?include=.
     */
    public $relationships = [
        'author' => UserResource::class,
        'comments',
    ];

    /**
     * Optional: override the type derived from the class name (PostResource -> "posts").
     */
    public function toType(Request $request): string
    {
        return 'posts';
    }

    /**
     * Resource-level links.
     */
    public function toLinks(Request $request): array
    {
        return [
            'self' => route('posts.show', $this->resource),
        ];
    }

    /**
     * Optional meta object.
     */
    public function toMeta(Request $request): array
    {
        return ['version' => '1.0'];
    }
}
```

`type` defaults to the kebab-case plural of the class name (`BlogPostResource` → `blog-posts`); `id` defaults to the model key (override `toId()`).

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

`Content-Type: application/vnd.api+json` is set automatically. `$post->toResource()` / `Post::all()->toResourceCollection()` are convenience shortcuts.
