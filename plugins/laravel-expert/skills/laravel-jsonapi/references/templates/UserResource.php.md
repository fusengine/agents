---
name: user-resource-template
description: Simple JSON:API resource with sparse fields
---

# Template: UserResource

```php
<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonApiResource;

final class UserResource extends JsonApiResource
{
    public string $type = 'users';

    /**
     * @return array<string, mixed>
     */
    public function toAttributes(Request $request): array
    {
        return [
            'name' => $this->name,
            'email' => $this->when(
                $request->user()?->can('view-email', $this->resource),
                $this->email,
            ),
            'avatar_url' => $this->avatar_url,
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }

    /**
     * @return array<string, callable>
     */
    public function relationships(): array
    {
        return [
            'posts' => fn () => PostResource::collection($this->whenLoaded('posts')),
        ];
    }

    /**
     * @return array<string, string>
     */
    public function toLinks(Request $request): array
    {
        return [
            'self' => route('api.users.show', $this->id),
        ];
    }
}
```

## Controller usage

```php
public function show(Request $request, User $user)
{
    return UserResource::make($user->load('posts'));
}
```

## Example request

```http
GET /api/users/1?fields[users]=name,avatar_url
Accept: application/vnd.api+json
```

Returns only `name` and `avatar_url` in attributes, regardless of what the resource declares.
