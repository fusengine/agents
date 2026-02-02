---
name: refactoring-guide
description: Step-by-step guide for refactoring legacy code to SOLID
keywords: refactoring, migration, legacy, solid, extraction
---

# Refactoring Guide

## Step-by-Step Migration

### Step 1: Extract Validation

```php
// BEFORE - Validation in Controller
public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required',
        'email' => 'required|email',
    ]);
    // ...
}

// AFTER - FormRequest
// 1. Create: php artisan make:request StoreUserRequest
// 2. Move validation rules to FormRequest
// 3. Update controller signature

public function store(StoreUserRequest $request)
{
    $dto = $request->toDTO();
    // ...
}
```

---

### Step 2: Extract Business Logic

```php
// BEFORE - Logic in Controller
public function store(StoreUserRequest $request)
{
    $user = User::create($request->validated());
    Mail::send(new WelcomeMail($user));
    Log::info('User created');
    return response()->json($user);
}

// AFTER - Service Layer
// 1. Create: app/Services/UserService.php
// 2. Inject service in controller
// 3. Move logic to service

public function store(StoreUserRequest $request)
{
    $user = $this->userService->create($request->toDTO());
    return UserResource::make($user)->response()->setStatusCode(201);
}
```

---

### Step 3: Extract Data Access

```php
// BEFORE - Queries in Service
class UserService
{
    public function findActive(): Collection
    {
        return User::where('active', true)
            ->orderBy('name')
            ->get();
    }
}

// AFTER - Repository Pattern
// 1. Create: app/Contracts/UserRepositoryInterface.php
// 2. Create: app/Repositories/UserRepository.php
// 3. Bind in ServiceProvider
// 4. Inject interface in service

class UserService
{
    public function __construct(
        private UserRepositoryInterface $repository,
    ) {}

    public function findActive(): Collection
    {
        return $this->repository->findActive();
    }
}
```

---

### Step 4: Create DTOs

```php
// BEFORE - Arrays
$this->userService->create($request->validated());

// AFTER - DTO
// 1. Create: app/DTOs/CreateUserDTO.php
// 2. Add toDTO() method in FormRequest
// 3. Type-hint DTO in service

readonly class CreateUserDTO
{
    public function __construct(
        public string $name,
        public string $email,
        public string $password,
    ) {}
}

$this->userService->create($request->toDTO());
```

---

### Step 5: Extract Interfaces

```php
// BEFORE - Concrete dependency
class UserService
{
    public function __construct(
        private UserRepository $repository, // Concrete!
    ) {}
}

// AFTER - Interface dependency
// 1. Create: app/Contracts/UserRepositoryInterface.php
// 2. Implement interface in Repository
// 3. Bind in ServiceProvider
// 4. Change type-hint to interface

class UserService
{
    public function __construct(
        private UserRepositoryInterface $repository, // Interface!
    ) {}
}
```

---

## Refactoring Checklist

| Step | Action | Verify |
|------|--------|--------|
| 1 | Extract validation to FormRequest | Controller < 50 lines |
| 2 | Extract logic to Service | No business rules in Controller |
| 3 | Extract queries to Repository | No Eloquent in Service |
| 4 | Create DTOs | No array params |
| 5 | Define interfaces | No concrete dependencies |
| 6 | Add PHPDoc | All methods documented |
| 7 | Add strict_types | All files have declare |

---

## File Size After Refactoring

| Component | Target Lines | If Exceeded |
|-----------|-------------|-------------|
| Controller | < 50 | Extract to Service |
| Service | < 100 | Split into Actions |
| Repository | < 100 | Split by entity |
| Action | < 50 | Single responsibility |
| DTO | < 50 | One per use case |
| FormRequest | < 50 | Complex? Use Rules |

---

## Common Refactoring Patterns

```
Fat Controller (200 lines)
        ↓
Split into:
├── Controller (40 lines) - HTTP only
├── FormRequest (30 lines) - Validation
├── Service (80 lines) - Business logic
├── Repository (60 lines) - Data access
└── DTO (20 lines) - Data structure
```
