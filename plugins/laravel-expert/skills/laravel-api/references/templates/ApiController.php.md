---
name: ApiController
description: Complete API controller with resources and validation
keywords: controller, api, resource, crud
---

# API Controller

## File: app/Http/Controllers/Api/V1/PostController.php

```php
<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Http\Resources\PostResource;
use App\Models\Post;
use App\Services\PostService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * Post API controller.
 */
final class PostController extends Controller
{
    public function __construct(
        private readonly PostService $postService,
    ) {}

    /**
     * Display a listing of posts.
     */
    public function index(): AnonymousResourceCollection
    {
        return PostResource::collection(
            $this->postService->paginate(15)
        );
    }

    /**
     * Store a newly created post.
     */
    public function store(StorePostRequest $request): JsonResponse
    {
        $post = $this->postService->create($request->validated());

        return PostResource::make($post)
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified post.
     */
    public function show(Post $post): PostResource
    {
        return PostResource::make($post);
    }

    /**
     * Update the specified post.
     */
    public function update(UpdatePostRequest $request, Post $post): PostResource
    {
        $post = $this->postService->update($post, $request->validated());

        return PostResource::make($post);
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

## File: app/Http/Resources/PostResource.php

```php
<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Post API resource.
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
            'content' => $this->when(
                $request->routeIs('posts.show'),
                $this->content
            ),
            'published_at' => $this->published_at?->toISOString(),
            'author' => new UserResource($this->whenLoaded('author')),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
```
