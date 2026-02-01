---
name: Service
description: Business logic service for FuseCore module
keywords: service, business, logic, layer
---

# Service Template

Business logic service for FuseCore module.

## File: FuseCore/{Module}/App/Services/PostService.php

```php
<?php

declare(strict_types=1);

namespace FuseCore\Blog\App\Services;

use FuseCore\Blog\App\Models\Post;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

/**
 * Post business logic service.
 */
final class PostService
{
    /**
     * Get paginated posts.
     */
    public function getPaginated(int $perPage = 15): LengthAwarePaginator
    {
        return Post::with('author', 'tags')
            ->published()
            ->orderByDesc('published_at')
            ->paginate($perPage);
    }

    /**
     * Create a new post.
     *
     * @param array<string, mixed> $data
     */
    public function create(array $data): Post
    {
        $data['user_id'] = auth()->id();
        $data['slug'] = $data['slug'] ?? Str::slug($data['title']);

        $post = Post::create($data);

        if (isset($data['tags'])) {
            $post->tags()->sync($data['tags']);
        }

        return $post->load('author', 'tags');
    }

    /**
     * Update an existing post.
     *
     * @param array<string, mixed> $data
     */
    public function update(Post $post, array $data): Post
    {
        if (isset($data['title']) && !isset($data['slug'])) {
            $data['slug'] = Str::slug($data['title']);
        }

        $post->update($data);

        if (isset($data['tags'])) {
            $post->tags()->sync($data['tags']);
        }

        return $post->fresh(['author', 'tags']);
    }

    /**
     * Delete a post.
     */
    public function delete(Post $post): void
    {
        $post->delete();
    }

    /**
     * Publish a post.
     */
    public function publish(Post $post): Post
    {
        $post->publish();

        return $post->fresh();
    }

    /**
     * Unpublish a post.
     */
    public function unpublish(Post $post): Post
    {
        $post->update([
            'status' => 'draft',
            'published_at' => null,
        ]);

        return $post->fresh();
    }
}
```

## Service with Interface

### File: FuseCore/{Module}/App/Contracts/PostServiceInterface.php

```php
<?php

declare(strict_types=1);

namespace FuseCore\Blog\App\Contracts;

use FuseCore\Blog\App\Models\Post;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/**
 * Post service contract.
 */
interface PostServiceInterface
{
    /**
     * Get paginated posts.
     */
    public function getPaginated(int $perPage = 15): LengthAwarePaginator;

    /**
     * Create a new post.
     *
     * @param array<string, mixed> $data
     */
    public function create(array $data): Post;

    /**
     * Update an existing post.
     *
     * @param array<string, mixed> $data
     */
    public function update(Post $post, array $data): Post;

    /**
     * Delete a post.
     */
    public function delete(Post $post): void;
}
```

### File: FuseCore/{Module}/App/Services/PostService.php

```php
<?php

declare(strict_types=1);

namespace FuseCore\Blog\App\Services;

use FuseCore\Blog\App\Contracts\PostServiceInterface;
use FuseCore\Blog\App\Models\Post;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/**
 * Post business logic service.
 */
final class PostService implements PostServiceInterface
{
    public function getPaginated(int $perPage = 15): LengthAwarePaginator
    {
        return Post::with('author')
            ->published()
            ->orderByDesc('published_at')
            ->paginate($perPage);
    }

    public function create(array $data): Post
    {
        $data['user_id'] = auth()->id();

        return Post::create($data);
    }

    public function update(Post $post, array $data): Post
    {
        $post->update($data);

        return $post->fresh();
    }

    public function delete(Post $post): void
    {
        $post->delete();
    }
}
```
