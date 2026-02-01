---
name: Controller
description: API Controller for FuseCore module
keywords: controller, api, crud, resource
---

# Controller Template

API Controller for FuseCore module.

## File: FuseCore/{Module}/App/Http/Controllers/PostController.php

```php
<?php

declare(strict_types=1);

namespace FuseCore\Blog\App\Http\Controllers;

use FuseCore\Blog\App\Http\Requests\StorePostRequest;
use FuseCore\Blog\App\Http\Requests\UpdatePostRequest;
use FuseCore\Blog\App\Http\Resources\PostResource;
use FuseCore\Blog\App\Models\Post;
use FuseCore\Blog\App\Services\PostService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * Post API controller.
 */
final class PostController
{
    /**
     * Create a new controller instance.
     */
    public function __construct(
        private readonly PostService $postService
    ) {}

    /**
     * Display a listing of posts.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $posts = $this->postService->getPaginated(
            perPage: $request->integer('per_page', 15)
        );

        return PostResource::collection($posts);
    }

    /**
     * Store a newly created post.
     */
    public function store(StorePostRequest $request): JsonResponse
    {
        $post = $this->postService->create($request->validated());

        return (new PostResource($post))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified post.
     */
    public function show(Post $post): PostResource
    {
        return new PostResource($post->load('author', 'tags'));
    }

    /**
     * Update the specified post.
     */
    public function update(UpdatePostRequest $request, Post $post): PostResource
    {
        $post = $this->postService->update($post, $request->validated());

        return new PostResource($post);
    }

    /**
     * Remove the specified post.
     */
    public function destroy(Post $post): JsonResponse
    {
        $this->postService->delete($post);

        return response()->json(null, 204);
    }
}
```

## Minimal Controller (Without Service)

```php
<?php

declare(strict_types=1);

namespace FuseCore\Blog\App\Http\Controllers;

use FuseCore\Blog\App\Http\Requests\StorePostRequest;
use FuseCore\Blog\App\Http\Resources\PostResource;
use FuseCore\Blog\App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * Post API controller.
 */
final class PostController
{
    /**
     * Display a listing of posts.
     */
    public function index(): AnonymousResourceCollection
    {
        return PostResource::collection(
            Post::with('author')->paginate(15)
        );
    }

    /**
     * Store a newly created post.
     */
    public function store(StorePostRequest $request): JsonResponse
    {
        $post = Post::create([
            ...$request->validated(),
            'user_id' => auth()->id(),
        ]);

        return (new PostResource($post))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified post.
     */
    public function show(Post $post): PostResource
    {
        return new PostResource($post);
    }

    /**
     * Update the specified post.
     */
    public function update(StorePostRequest $request, Post $post): PostResource
    {
        $post->update($request->validated());

        return new PostResource($post);
    }

    /**
     * Remove the specified post.
     */
    public function destroy(Post $post): JsonResponse
    {
        $post->delete();

        return response()->json(null, 204);
    }
}
```

## Invokable Controller

```php
<?php

declare(strict_types=1);

namespace FuseCore\Blog\App\Http\Controllers;

use FuseCore\Blog\App\Services\StatisticsService;
use Illuminate\Http\JsonResponse;

/**
 * Blog statistics controller.
 */
final class StatisticsController
{
    /**
     * Create a new controller instance.
     */
    public function __construct(
        private readonly StatisticsService $statisticsService
    ) {}

    /**
     * Handle the incoming request.
     */
    public function __invoke(): JsonResponse
    {
        return response()->json([
            'data' => $this->statisticsService->getOverview(),
        ]);
    }
}
```
