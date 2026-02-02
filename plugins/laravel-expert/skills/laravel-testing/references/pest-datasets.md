---
name: pest-datasets
description: Datasets, hooks, and shared setup in Pest
file-type: markdown
---

# Pest Datasets & Hooks

## Inline Datasets

```php
it('validates email', function (string $email, bool $valid) {
    expect(filter_var($email, FILTER_VALIDATE_EMAIL))->toBe($valid ? $email : false);
})->with([
    ['valid@example.com', true],
    ['invalid', false],
    ['test@', false],
]);
```

---

## Named Datasets

```php
// Define reusable
dataset('valid-emails', [
    'standard' => ['user@example.com'],
    'subdomain' => ['user@mail.example.com'],
    'plus-sign' => ['user+tag@example.com'],
]);

// Use in tests
it('accepts valid emails', fn (string $email) =>
    expect(filter_var($email, FILTER_VALIDATE_EMAIL))->toBeTruthy()
)->with('valid-emails');
```

---

## Matrix Testing

```php
it('creates order', function (string $status, string $currency) {
    $order = Order::factory()->create(compact('status', 'currency'));
    expect($order)->toBeInstanceOf(Order::class);
})->with(['pending', 'completed'])->with(['USD', 'EUR']);
// Runs 4 times (2 × 2)
```

---

## Lazy Datasets

```php
dataset('users', function () {
    yield 'admin' => [User::factory()->admin()->create()];
    yield 'guest' => [User::factory()->create()];
});
```

---

## Hooks

| Hook | Scope | Purpose |
|------|-------|---------|
| `beforeEach()` | Per test | Setup |
| `afterEach()` | Per test | Cleanup |
| `beforeAll()` | Per file | One-time setup |
| `afterAll()` | Per file | One-time cleanup |

```php
beforeEach(fn () => $this->user = User::factory()->create());

it('uses the user', fn () => expect($this->user)->toBeInstanceOf(User::class));
```

---

## Scoped Hooks

```php
describe('Orders', function () {
    beforeEach(fn () => $this->order = Order::factory()->create());

    it('can be updated', function () {
        $this->order->update(['status' => 'shipped']);
        expect($this->order->status)->toBe('shipped');
    });
});
```

---

## uses() for Traits

```php
// tests/Pest.php
uses(RefreshDatabase::class)->in('Feature');
uses(WithFaker::class)->in('Feature', 'Unit');

// Per-file
uses(RefreshDatabase::class);
```

---

## Shared Helpers

```php
// tests/Pest.php
function createAdmin(): User {
    return User::factory()->admin()->create();
}

// In tests
it('admin access', fn () => $this->actingAs(createAdmin())->get('/admin')->assertOk());
```

---

## Decision Tree

```
Data source?
├── Few values → Inline with()
├── Reusable → Named dataset()
├── Complex objects → Lazy dataset
├── Matrix testing → Multiple with()
└── Setup per test → beforeEach()
```

---

## Best Practices

| DO | DON'T |
|----|-------|
| Name datasets descriptively | Create dependencies between tests |
| Use lazy datasets for expensive data | Put assertions in hooks |
| Keep hooks focused and minimal | Overuse global beforeEach() |
