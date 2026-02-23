---
name: dependency-inversion
description: DIP Guide - Depend on abstractions via interfaces and ServiceProvider for Laravel
when-to-use: tight coupling, service architecture, testing, mocking, swapping providers
keywords: dependency inversion, DIP, injection, abstraction, service provider, laravel
priority: high
related: open-closed.md, interface-segregation.md, templates/code-templates.md
---

# Dependency Inversion Principle (DIP) for Laravel

**Depend on abstractions, not concrete implementations**

---

## When to Apply DIP?

### Symptoms of Violation

1. **`new ConcreteClass()` in services** -> Tight coupling
2. **Cannot test without real database** -> Missing abstraction
3. **Changing provider modifies 10+ files** -> Cascading changes
4. **Direct Eloquent calls in controllers** -> No abstraction layer

---

## Why It Matters?

### Without DIP
```
Controller -> User::find() -> Eloquent -> Database
Controller -> Mail::send() -> Mailer -> SMTP
```
Problems: Cannot mock, cannot swap, cannot test in isolation.

### With DIP
```
Controller <- UserService <- UserRepositoryInterface <- EloquentUserRepository
                                                     <- InMemoryUserRepository (tests)
```
Advantages: Swap in ServiceProvider, easy testing, no cascading changes.

---

## Interface Location (CRITICAL - FuseCore Modular MANDATORY)

Module interfaces: `FuseCore/[Module]/App/Contracts/`
Shared interfaces: `FuseCore/Core/App/Contracts/`

```
FuseCore/[Module]/
|- App/
|  |- Contracts/                 # Module interfaces ONLY
|  |  \- UserRepositoryInterface.php
|  |- Services/                  # Business logic (depends on interfaces)
|  |  \- UserService.php
|  \- Repositories/              # Implementations
|     \- EloquentUserRepository.php
\- ModuleServiceProvider.php     # Wiring
```

---

## How to Apply DIP?

### Step 1: Define Interface

```php
// FuseCore/User/App/Contracts/UserRepositoryInterface.php
interface UserRepositoryInterface
{
    public function findById(int $id): ?User;
    public function create(CreateUserDTO $dto): User;
}
```

### Step 2: Create Implementation

```php
// FuseCore/User/App/Repositories/EloquentUserRepository.php
final readonly class EloquentUserRepository implements UserRepositoryInterface
{
    public function findById(int $id): ?User
    {
        return User::find($id);
    }

    public function create(CreateUserDTO $dto): User
    {
        return User::create($dto->toArray());
    }
}
```

### Step 3: Create Service with DI

```php
// FuseCore/User/App/Services/UserService.php
final readonly class UserService
{
    public function __construct(
        private UserRepositoryInterface $repository,
    ) {}

    public function create(CreateUserDTO $dto): User
    {
        return $this->repository->create($dto);
    }
}
```

### Step 4: Wire in ModuleServiceProvider

```php
// FuseCore/User/ModuleServiceProvider.php
public array $bindings = [
    Contracts\UserRepositoryInterface::class => Repositories\EloquentUserRepository::class,
];
```

---

## Laravel-Specific DI Patterns

### Constructor Injection (Preferred)

```php
// FuseCore/Order/App/Services/OrderService.php
final readonly class OrderService
{
    public function __construct(
        private PaymentGatewayInterface $payment,
        private UserRepositoryInterface $users,
    ) {}
}
```

### Contextual Binding in ModuleServiceProvider

```php
// FuseCore/Order/ModuleServiceProvider.php
public function register(): void
{
    $this->app->when(Services\OrderService::class)
        ->needs(Contracts\PaymentGatewayInterface::class)
        ->give(Services\StripeGateway::class);
}
```

---

## Anti-Patterns

| Anti-Pattern | Fix |
|--------------|-----|
| `User::find()` in controller | Inject `UserRepositoryInterface` |
| `new StripeGateway()` in service | Bind in ModuleServiceProvider |
| `Mail::send()` in service | Inject `NotificationInterface` |
| Interface in same file as impl | Move to `FuseCore/[Module]/App/Contracts/` |

---

## Decision Criteria

1. **Is it an external dependency?** -> Yes -> Interface + ServiceProvider
2. **Could implementation change?** -> Yes -> Use interface
3. **Do I need to test this?** -> Yes -> Inject for mocking
4. **Is it a Laravel facade?** -> Wrap in interface for testability

---

## DIP Checklist

- [ ] Interfaces in `FuseCore/[Module]/App/Contracts/`
- [ ] Services depend on interfaces, not concrete classes
- [ ] No `new ConcreteClass()` in business logic
- [ ] ModuleServiceProvider wires all bindings
- [ ] Tests use mock/in-memory implementations
- [ ] No direct Eloquent calls in controllers
