---
name: anti-patterns
description: Common SOLID violations and how to fix them
file-type: markdown
---

# Anti-Patterns & Code Smells

## Quick Detection Guide

| Symptom | Violated Principle | Solution |
|---------|-------------------|----------|
| Class > 100 lines | SRP | Split responsibilities |
| Controller with queries | SRP | Extract to Repository |
| `new ConcreteClass()` | DIP | Inject interface |
| Interface > 5 methods | ISP | Segregate interfaces |
| Switch on types | OCP | Use interfaces |

---

## Fat Controller

```php
// ❌ BAD
class UserController {
    public function store(Request $request) {
        $validated = $request->validate([...]);
        $user = User::create($validated);
        Mail::send(new WelcomeMail($user));
        return response()->json($user);
    }
}

// ✅ GOOD
class UserController {
    public function __construct(private UserService $s) {}
    public function store(StoreUserRequest $r): JsonResponse {
        return response()->json($this->s->create(CreateUserDTO::from($r)), 201);
    }
}
```

---

## God Class

```php
// ❌ BAD - Class doing everything
class UserManager {
    public function create() { }
    public function sendEmail() { }
    public function generateReport() { }
    public function exportToCsv() { }
}

// ✅ GOOD - Split
final readonly class UserService { /* CRUD */ }
final readonly class UserNotifier { /* Emails */ }
final readonly class UserReporter { /* Reports */ }
```

---

## Concrete Coupling

```php
// ❌ BAD
class OrderService {
    public function process(): void {
        $payment = new StripeGateway(); // Tight coupling
    }
}

// ✅ GOOD
final readonly class OrderService {
    public function __construct(private PaymentGatewayInterface $gateway) {}
}
```

---

## Primitive Obsession

```php
// ❌ BAD - Primitives
public function createUser(string $email): User

// ✅ GOOD - Value Objects
readonly class Email {
    public function __construct(public string $value) {
        if (!filter_var($value, FILTER_VALIDATE_EMAIL)) throw new InvalidEmailException();
    }
}
public function createUser(Email $email): User
```

---

## Decision Tree

```
Code smell detected?
├── Class > 100 lines → Extract class
├── Method > 20 lines → Extract method
├── > 5 dependencies → Split class
├── new Concrete() → Inject interface
├── Array params → Use DTO
└── Validation in Service → Move to FormRequest
```

---

## Best Practices

| DO | DON'T |
|----|-------|
| Extract early (at 90 lines) | Wait until 100 lines |
| One reason to change per class | Multiple responsibilities |
| Inject interfaces | Instantiate concrete |
| Use DTOs for data | Pass arrays |
