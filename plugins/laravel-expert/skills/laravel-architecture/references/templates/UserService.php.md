---
name: UserService
description: Complete service class with dependency injection
keywords: service, di, business logic, repository
---

# User Service

## File: app/Services/UserService.php

```php
<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\UserRepositoryInterface;
use App\DTOs\CreateUserDTO;
use App\DTOs\UpdateUserDTO;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * User business logic service.
 */
final readonly class UserService
{
    public function __construct(
        private UserRepositoryInterface $repository,
    ) {}

    /**
     * Get paginated users.
     */
    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return $this->repository->paginate($perPage);
    }

    /**
     * Find user by ID.
     */
    public function findById(int $id): ?User
    {
        return $this->repository->findById($id);
    }

    /**
     * Create a new user.
     */
    public function create(CreateUserDTO $dto): User
    {
        return $this->repository->create($dto);
    }

    /**
     * Update existing user.
     */
    public function update(User $user, UpdateUserDTO $dto): User
    {
        return $this->repository->update($user, $dto);
    }

    /**
     * Delete user.
     */
    public function delete(User $user): bool
    {
        return $this->repository->delete($user);
    }
}
```

## File: app/Contracts/UserRepositoryInterface.php

```php
<?php

declare(strict_types=1);

namespace App\Contracts;

use App\DTOs\CreateUserDTO;
use App\DTOs\UpdateUserDTO;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * User repository contract.
 */
interface UserRepositoryInterface
{
    public function paginate(int $perPage): LengthAwarePaginator;
    public function findById(int $id): ?User;
    public function create(CreateUserDTO $dto): User;
    public function update(User $user, UpdateUserDTO $dto): User;
    public function delete(User $user): bool;
}
```

## File: app/Repositories/EloquentUserRepository.php

```php
<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Contracts\UserRepositoryInterface;
use App\DTOs\CreateUserDTO;
use App\DTOs\UpdateUserDTO;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * Eloquent user repository implementation.
 */
final class EloquentUserRepository implements UserRepositoryInterface
{
    public function paginate(int $perPage): LengthAwarePaginator
    {
        return User::latest()->paginate($perPage);
    }

    public function findById(int $id): ?User
    {
        return User::find($id);
    }

    public function create(CreateUserDTO $dto): User
    {
        return User::create([
            'name' => $dto->name,
            'email' => $dto->email,
            'password' => $dto->password,
        ]);
    }

    public function update(User $user, UpdateUserDTO $dto): User
    {
        $user->update(array_filter([
            'name' => $dto->name,
            'email' => $dto->email,
        ]));

        return $user->fresh();
    }

    public function delete(User $user): bool
    {
        return $user->delete();
    }
}
```
