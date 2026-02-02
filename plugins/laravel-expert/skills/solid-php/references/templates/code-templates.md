---
name: code-templates
description: Complete Service, DTO, Repository, Interface templates
keywords: service, dto, repository, interface, templates
---

# Code Templates

## Service Template (< 100 lines)

```php
<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\UserRepositoryInterface;
use App\DTOs\CreateUserDTO;
use App\Models\User;

/**
 * User service for business logic.
 */
final readonly class UserService
{
    public function __construct(
        private UserRepositoryInterface $repository,
    ) {}

    /**
     * Create a new user.
     */
    public function create(CreateUserDTO $dto): User
    {
        return $this->repository->create($dto);
    }
}
```

## DTO Template

```php
<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Http\Requests\StoreUserRequest;

/**
 * User creation data transfer object.
 */
readonly class CreateUserDTO
{
    public function __construct(
        public string $name,
        public string $email,
        public ?string $phone = null,
    ) {}

    public static function fromRequest(StoreUserRequest $request): self
    {
        return new self(
            name: $request->validated('name'),
            email: $request->validated('email'),
            phone: $request->validated('phone'),
        );
    }
}
```

## Interface Template

```php
<?php

declare(strict_types=1);

namespace App\Contracts;

use App\DTOs\CreateUserDTO;
use App\Models\User;
use Illuminate\Support\Collection;

/**
 * User repository contract.
 */
interface UserRepositoryInterface
{
    public function create(CreateUserDTO $dto): User;
    public function findById(int $id): ?User;
    public function findAll(): Collection;
}
```

## Repository Template

```php
<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Contracts\UserRepositoryInterface;
use App\DTOs\CreateUserDTO;
use App\Models\User;
use Illuminate\Support\Collection;

final class EloquentUserRepository implements UserRepositoryInterface
{
    public function create(CreateUserDTO $dto): User
    {
        return User::create([
            'name' => $dto->name,
            'email' => $dto->email,
            'phone' => $dto->phone,
        ]);
    }

    public function findById(int $id): ?User
    {
        return User::find($id);
    }

    public function findAll(): Collection
    {
        return User::all();
    }
}
```
