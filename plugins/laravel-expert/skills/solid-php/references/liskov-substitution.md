---
name: liskov-substitution
description: LSP Guide - Interface contracts and behavioral consistency for Laravel
when-to-use: implementing interfaces, swapping providers, testing compliance
keywords: liskov, substitution, LSP, contract, interface, laravel
priority: high
related: interface-segregation.md, templates/code-templates.md
---

# Liskov Substitution Principle (LSP) for Laravel

**Any implementation can replace another without breaking behavior**

If code depends on an interface, every implementation must honor the contract.

---

## When to Apply LSP?

### Symptoms of Violation

1. **Implementation throws unexpected exceptions** -> Contract mismatch
2. **Switching provider breaks tests** -> Behavior inconsistency
3. **Subclass ignores parent methods** -> Bad inheritance
4. **Mock works but real implementation fails** -> Contract unclear

---

## Contract Rules

### Return Type Contracts

```php
interface CacheInterface
{
    /** @return string|null Never throws for missing keys */
    public function get(string $key): ?string;

    /** @throws CacheException Only on connection failure */
    public function set(string $key, string $value, int $ttl = 3600): void;
}
```

**ALL implementations MUST:**
- Return `null` from `get()` for missing keys (never throw)
- Only throw `CacheException` from `set()` (not generic Exception)

### PHPDoc Contracts

```php
interface UserRepositoryInterface
{
    /**
     * Find user by ID.
     *
     * @return User|null Null if user not found, never throws
     */
    public function findById(int $id): ?User;

    /**
     * Create user from DTO.
     *
     * @throws UniqueConstraintException If email already exists
     */
    public function create(CreateUserDTO $dto): User;
}
```

---

## How to Verify LSP?

### Contract Tests

```php
// tests/Contracts/UserRepositoryContractTest.php
abstract class UserRepositoryContractTest extends TestCase
{
    abstract protected function createRepository(): UserRepositoryInterface;

    public function test_find_by_id_returns_null_for_missing(): void
    {
        $repo = $this->createRepository();
        $this->assertNull($repo->findById(999));
    }

    public function test_create_returns_user(): void
    {
        $repo = $this->createRepository();
        $user = $repo->create(new CreateUserDTO('Test', 'test@mail.com'));
        $this->assertInstanceOf(User::class, $user);
    }
}

// tests/Repositories/EloquentUserRepositoryTest.php
class EloquentUserRepositoryTest extends UserRepositoryContractTest
{
    protected function createRepository(): UserRepositoryInterface
    {
        return new EloquentUserRepository();
    }
}
```

---

## Common LSP Violations in Laravel

| Violation | Fix |
|-----------|-----|
| Repository throws `ModelNotFoundException` | Return `null` as contract says |
| Cache implementation returns `false` | Return `null` to match `?string` |
| Notification silently skips sending | Throw `NotificationFailedException` |
| Service returns different response shape | Match interface return type exactly |

---

## Laravel-Specific Rules

### Eloquent Relations

```php
// Interface defines what model exposes
interface HasProfileInterface
{
    public function profile(): HasOne;
}

// All implementations must return HasOne relation
```

### ModuleServiceProvider Swapping

```php
// If you can swap this in ModuleServiceProvider:
public array $bindings = [
    Contracts\CacheInterface::class => Services\RedisCacheService::class,
];
// Then ALL cache consumers must work unchanged
```

---

## LSP Checklist

- [ ] Contracts documented in PHPDoc
- [ ] Return types match across implementations
- [ ] Exceptions are consistent
- [ ] Contract tests exist per interface
- [ ] All implementations pass same tests
- [ ] Swapping in ModuleServiceProvider breaks nothing
