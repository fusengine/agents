---
name: solid-principles
description: SOLID Principles implementation in Laravel 12 + PHP 8.5
file-type: markdown
---

# SOLID Principles

## Quick Reference

| Principle | Rule | Detection | Fix |
|-----------|------|-----------|-----|
| **S**RP | 1 class = 1 responsibility | Class > 100 lines | Split class |
| **O**CP | Open extension, closed modification | `if/switch` for types | Interface + impl |
| **L**SP | Subtypes substitutable | Child breaks parent | Redesign hierarchy |
| **I**SP | Specific interfaces | Unused interface methods | Segregate interfaces |
| **D**IP | Depend on abstractions | `new Concrete()` | Inject interface |

---

## S - Single Responsibility

```php
// ❌ BAD - Multiple responsibilities
class UserController extends Controller {
    public function store(Request $request) {
        $validated = $request->validate([...]);
        $user = User::create($validated);
        Mail::send(new WelcomeMail($user));
        return response()->json($user);
    }
}

// ✅ GOOD - Single responsibility
final class UserController extends Controller {
    public function __construct(private UserService $service) {}
    public function store(StoreUserRequest $r): JsonResponse {
        return response()->json($this->service->create(CreateUserDTO::from($r)), 201);
    }
}
```

---

## O - Open/Closed

```php
// ✅ Open for extension via interfaces
interface PaymentGatewayInterface {
    public function charge(Money $amount): PaymentResult;
}

final readonly class StripeGateway implements PaymentGatewayInterface { }
final readonly class PayPalGateway implements PaymentGatewayInterface { }
```

---

## L - Liskov Substitution

```php
// ✅ All implementations respect the contract
interface NotificationInterface {
    public function send(User $user, string $message): bool;
}

final readonly class EmailNotification implements NotificationInterface { }
final readonly class SmsNotification implements NotificationInterface { }
```

---

## I - Interface Segregation

```php
// ❌ Fat interface → ✅ Segregated interfaces
interface Creatable { public function create(): Model; }
interface Notifiable { public function notify(): void; }
interface Reportable { public function report(): array; }
```

---

## D - Dependency Inversion

```php
// Bind in ServiceProvider
$this->app->bind(UserRepositoryInterface::class, EloquentUserRepository::class);

// ✅ Inject interface
final readonly class UserService {
    public function __construct(private UserRepositoryInterface $repository) {}
}
```

---

## Decision Tree

```
Code violates SOLID?
├── Class > 100 lines → SRP: Split class
├── Switch on types → OCP: Use interfaces
├── Child changes behavior → LSP: Redesign
├── Unused methods → ISP: Segregate
└── new Concrete() → DIP: Inject interface
```

---

## Best Practices

| DO | DON'T |
|----|-------|
| One reason to change per class | Multiple responsibilities |
| Extend via new classes | Modify existing code |
| Small, focused interfaces | Fat interfaces |
| Inject interfaces | Instantiate concrete classes |
