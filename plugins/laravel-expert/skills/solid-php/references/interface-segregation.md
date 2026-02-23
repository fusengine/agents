---
name: interface-segregation
description: ISP Guide - Small focused interfaces for Laravel
when-to-use: fat interfaces, unused methods, segregating contracts
keywords: interface segregation, ISP, focused, small, laravel, contracts
priority: high
related: liskov-substitution.md, dependency-inversion.md, templates/code-templates.md
---

# Interface Segregation Principle (ISP) for Laravel

**Many focused interfaces beat one fat interface**

No class should depend on methods it does not use.

---

## When to Apply ISP?

### Symptoms of Violation

1. **Interface has 6+ methods** -> Too broad for Laravel
2. **Repository implements methods it never uses** -> Forced dependency
3. **Service only needs `find()` but gets full CRUD** -> Over-coupled
4. **Adding method to interface breaks unrelated services** -> Coupled contracts

---

## How to Apply ISP?

### 1. Split by Role

Before (fat interface):
```php
// FuseCore/User/App/Contracts/UserRepositoryInterface.php
interface UserRepositoryInterface
{
    public function findById(int $id): ?User;
    public function findAll(): Collection;
    public function create(CreateUserDTO $dto): User;
    public function update(int $id, UpdateUserDTO $dto): User;
    public function delete(int $id): void;
    public function sendNotification(int $id, string $message): void;
    public function exportToCsv(): string;
}
```

After (role-based):
```php
// FuseCore/User/App/Contracts/UserReaderInterface.php
interface UserReaderInterface
{
    public function findById(int $id): ?User;
    public function findAll(): Collection;
}

// FuseCore/User/App/Contracts/UserWriterInterface.php
interface UserWriterInterface
{
    public function create(CreateUserDTO $dto): User;
    public function update(int $id, UpdateUserDTO $dto): User;
    public function delete(int $id): void;
}

// FuseCore/User/App/Contracts/UserNotifierInterface.php
interface UserNotifierInterface
{
    public function sendNotification(int $id, string $message): void;
}

// FuseCore/User/App/Contracts/UserExporterInterface.php
interface UserExporterInterface
{
    public function exportToCsv(): string;
}
```

### 2. Compose When Needed

```php
// Full repository implements multiple interfaces
final readonly class EloquentUserRepository implements
    UserReaderInterface,
    UserWriterInterface
{
    // Only CRUD methods, no notification/export
}

// Read-only consumer uses only what it needs
final readonly class UserReportService
{
    public function __construct(private UserReaderInterface $reader) {}
}
```

### 3. Laravel-Specific Segregation

```php
// Separate query from command (CQRS-lite)
interface QueryableInterface
{
    public function findById(int $id): ?Model;
    public function findAll(array $filters = []): Collection;
}

interface CommandableInterface
{
    public function create(array $data): Model;
    public function update(int $id, array $data): Model;
    public function delete(int $id): void;
}
```

---

## Splitting Rules

| Criteria | Action |
|----------|--------|
| Read vs Write operations | Split into Reader/Writer |
| Different consumers | Interface per consumer role |
| Optional capabilities | Separate interface for optional |
| Notification/Export | Separate from core CRUD |

---

## ModuleServiceProvider Binding

```php
// FuseCore/User/ModuleServiceProvider.php
public array $bindings = [
    Contracts\UserReaderInterface::class => Repositories\EloquentUserRepository::class,
    Contracts\UserWriterInterface::class => Repositories\EloquentUserRepository::class,
];
// Same class can satisfy multiple interfaces
```

---

## Decision Criteria

1. **Do all consumers use all methods?** -> No -> Split
2. **Would adding a method break unrelated code?** -> Yes -> Split
3. **Can you name the interface in 3 words?** -> No -> Too broad
4. **Does implementation leave methods as no-ops?** -> Yes -> Split

---

## ISP Checklist

- [ ] Interfaces have < 5 methods each
- [ ] No implementations with no-op methods
- [ ] Consumers only depend on methods they use
- [ ] Interfaces in `FuseCore/[Module]/App/Contracts/` only
- [ ] Each interface has a clear, single role
- [ ] ModuleServiceProvider binds specific interfaces
