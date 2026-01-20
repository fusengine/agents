# 03 - Execution (Laravel)

**Implement Laravel features following SOLID (APEX Phase E).**

## When to Use

- After planning phase complete
- When implementing the planned feature
- Follow order: Migration -> Model -> Service -> Controller

---

## File Templates

### Migration Template

```php
<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('content');
            $table->string('status')->default('draft');
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'published_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
```

---

### Model Template (< 80 lines)

```php
<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\PostStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

final class Post extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'title',
        'slug',
        'content',
        'status',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'status' => PostStatus::class,
            'published_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', PostStatus::Published);
    }
}
```

---

### DTO Template

```php
<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Http\Requests\StorePostRequest;

readonly class CreatePostDTO
{
    public function __construct(
        public string $title,
        public string $content,
        public ?string $status = null,
    ) {}

    public static function fromRequest(StorePostRequest $request): self
    {
        return new self(
            title: $request->validated('title'),
            content: $request->validated('content'),
            status: $request->validated('status'),
        );
    }
}
```

---

### Service Template (< 100 lines)

```php
<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\PostRepositoryInterface;
use App\DTOs\CreatePostDTO;
use App\Models\Post;
use Illuminate\Support\Str;

final readonly class PostService
{
    public function __construct(
        private PostRepositoryInterface $repository,
    ) {}

    public function create(CreatePostDTO $dto, int $userId): Post
    {
        return $this->repository->create([
            'user_id' => $userId,
            'title' => $dto->title,
            'slug' => Str::slug($dto->title),
            'content' => $dto->content,
            'status' => $dto->status ?? 'draft',
        ]);
    }

    public function publish(Post $post): Post
    {
        return $this->repository->update($post, [
            'status' => 'published',
            'published_at' => now(),
        ]);
    }
}
```

---

### Controller Template (< 50 lines)

```php
<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\DTOs\CreatePostDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\StorePostRequest;
use App\Http\Resources\PostResource;
use App\Services\PostService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

final class PostController extends Controller
{
    public function __construct(
        private readonly PostService $postService,
    ) {}

    public function index(): AnonymousResourceCollection
    {
        $posts = $this->postService->paginate(15);

        return PostResource::collection($posts);
    }

    public function store(StorePostRequest $request): JsonResponse
    {
        $post = $this->postService->create(
            CreatePostDTO::fromRequest($request),
            $request->user()->id
        );

        return PostResource::make($post)
            ->response()
            ->setStatusCode(201);
    }
}
```

---

### FormRequest Template

```php
<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

final class StorePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'status' => ['sometimes', 'string', 'in:draft,published'],
        ];
    }
}
```

---

### Resource Template

```php
<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class PostResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'content' => $this->content,
            'status' => $this->status,
            'author' => new UserResource($this->whenLoaded('user')),
            'published_at' => $this->published_at?->toISOString(),
            'created_at' => $this->created_at->toISOString(),
        ];
    }
}
```

---

## Execution Order

```text
1. Run migration
2. Create Enum (if needed)
3. Create Model
4. Create DTO
5. Create Interface (Contracts/)
6. Create Repository/Service
7. Register bindings
8. Create FormRequest
9. Create Resource
10. Create Controller
11. Add routes
12. Create Policy
```

---

## Validation Checklist

```text
[ ] declare(strict_types=1) in all files
[ ] All files < 100 lines
[ ] PHPDoc on public methods
[ ] Interfaces in Contracts/
[ ] Dependencies injected
[ ] Routes registered
```

---

## Next Phase

Proceed to `04-validation.md`
