---
name: FormRequest
description: Complete Form Request examples for API validation
keywords: validation, form request, api, rules
---

# Form Request Examples

## Store Request

```php
<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Validate post creation request.
 */
final class StorePostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Or check permission: $this->user()->can('create', Post::class)
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:posts,slug'],
            'content' => ['required', 'string'],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'category_id' => ['required', 'exists:categories,id'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['exists:tags,id'],
            'published_at' => ['nullable', 'date'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Please provide a title for your post.',
            'category_id.exists' => 'The selected category does not exist.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'category_id' => 'category',
            'published_at' => 'publication date',
        ];
    }
}
```

## Update Request

```php
<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Validate post update request.
 */
final class UpdatePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('post'));
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'string', 'max:255'],
            'slug' => [
                'sometimes',
                'string',
                'max:255',
                Rule::unique('posts', 'slug')->ignore($this->route('post')),
            ],
            'content' => ['sometimes', 'string'],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'category_id' => ['sometimes', 'exists:categories,id'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['exists:tags,id'],
            'published_at' => ['nullable', 'date'],
        ];
    }
}
```

## Usage in Controller

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

final class PostController extends Controller
{
    public function __construct(
        private readonly PostService $postService,
    ) {}

    public function store(StorePostRequest $request): JsonResponse
    {
        // Validation already passed - $request->validated() returns clean data
        $post = $this->postService->create($request->validated());

        return PostResource::make($post)
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdatePostRequest $request, Post $post): PostResource
    {
        $post = $this->postService->update($post, $request->validated());

        return PostResource::make($post);
    }
}
```

## Common Rule Patterns

### Email with uniqueness
```php
'email' => ['required', 'email', 'unique:users,email'],
```

### Password confirmation
```php
'password' => ['required', 'string', 'min:8', 'confirmed'],
// Expects 'password_confirmation' field
```

### File upload
```php
'avatar' => ['nullable', 'image', 'max:2048'], // 2MB max
'document' => ['required', 'file', 'mimes:pdf,doc,docx', 'max:10240'],
```

### Enum values
```php
use App\Enums\PostStatus;

'status' => ['required', Rule::enum(PostStatus::class)],
```

### Conditional rules
```php
'reason' => [
    Rule::requiredIf($this->input('status') === 'rejected'),
    'string',
    'max:500',
],
```

### Array validation
```php
'items' => ['required', 'array', 'min:1'],
'items.*.product_id' => ['required', 'exists:products,id'],
'items.*.quantity' => ['required', 'integer', 'min:1'],
```
