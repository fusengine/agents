---
name: controller-templates
description: Controller, Action, and FormRequest templates
file-type: template
---

# Controller & Action Templates

## Controller Template (< 50 lines)

```php
<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * User controller - HTTP layer only.
 */
final class UserController extends Controller
{
    public function __construct(
        private readonly UserService $userService,
    ) {}

    public function index(): AnonymousResourceCollection
    {
        return UserResource::collection($this->userService->getAll());
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        $user = $this->userService->create($request->toDTO());

        return UserResource::make($user)
            ->response()
            ->setStatusCode(201);
    }

    public function show(int $id): UserResource
    {
        return UserResource::make($this->userService->findOrFail($id));
    }

    public function update(UpdateUserRequest $request, int $id): UserResource
    {
        return UserResource::make($this->userService->update($id, $request->toDTO()));
    }

    public function destroy(int $id): JsonResponse
    {
        $this->userService->delete($id);

        return response()->json(null, 204);
    }
}
```

---

## Action Template (< 50 lines)

```php
<?php

declare(strict_types=1);

namespace App\Actions\User;

use App\Contracts\UserRepositoryInterface;
use App\DTOs\CreateUserDTO;
use App\Events\UserCreated;
use App\Models\User;

/**
 * Create a new user action.
 */
final readonly class CreateUserAction
{
    public function __construct(
        private UserRepositoryInterface $repository,
    ) {}

    /**
     * Execute the action.
     */
    public function execute(CreateUserDTO $dto): User
    {
        $user = $this->repository->create($dto);

        event(new UserCreated($user));

        return $user;
    }
}
```

---

## FormRequest Template (< 50 lines)

```php
<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\DTOs\CreateUserDTO;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Store user request validation.
 */
final class StoreUserRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ];
    }

    public function toDTO(): CreateUserDTO
    {
        return new CreateUserDTO(
            name: $this->validated('name'),
            email: $this->validated('email'),
            password: $this->validated('password'),
        );
    }
}
```

---

## API Resource Template

```php
<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * User API resource.
 *
 * @mixin \App\Models\User
 */
final class UserResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'created_at' => $this->created_at->toISOString(),
        ];
    }
}
```

---

## Policy Template

```php
<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Post;
use App\Models\User;

/**
 * Post authorization policy.
 */
final class PostPolicy
{
    public function view(User $user, Post $post): bool
    {
        return true;
    }

    public function update(User $user, Post $post): bool
    {
        return $user->id === $post->user_id;
    }

    public function delete(User $user, Post $post): bool
    {
        return $user->id === $post->user_id;
    }
}
```
