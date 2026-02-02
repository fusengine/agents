---
name: mocking-services
description: Mocking services with mock(), spy(), partialMock()
file-type: markdown
---

# Mocking Services

## Overview

| Method | Behavior |
|--------|----------|
| `mock()` | All methods return null unless specified |
| `spy()` | All methods work normally, records calls |
| `partialMock()` | Specified methods mocked, others work |

---

## mock()

```php
$this->mock(PaymentService::class, function ($mock) {
    $mock->shouldReceive('charge')->once()->with(100)->andReturn(true);
});

// Controller will receive the mock
$this->postJson('/checkout', ['amount' => 100])->assertOk();
```

---

## spy()

```php
$spy = $this->spy(PaymentService::class);

$this->postJson('/checkout', ['amount' => 100]); // Real methods execute

$spy->shouldHaveReceived('charge')->once()->with(100); // Verify after
```

---

## partialMock()

```php
$mock = $this->partialMock(OrderService::class, function ($mock) {
    $mock->shouldReceive('sendNotification')->andReturn(true);
});

$order = $mock->createOrder($data); // Real method
expect($mock->sendNotification($order))->toBeTrue(); // Mocked
```

---

## Mockery Expectations

```php
$mock->shouldReceive('method')
    ->once()                          // Exactly once
    ->times(3)                        // Exactly 3 times
    ->atLeast()->once()              // At least once
    ->never()                         // Never called
    ->with('arg1', 'arg2')           // With arguments
    ->withAnyArgs()                   // Any arguments
    ->andReturn('value')             // Return value
    ->andReturnUsing(fn() => 'val')  // Callback
    ->andThrow(new Exception())      // Throw
    ->ordered();                      // Call order matters
```

---

## Argument Matching

```php
use Mockery;

$mock->shouldReceive('save')->with(Mockery::type(User::class))->andReturn(true);
$mock->shouldReceive('find')->with(Mockery::any())->andReturn(null);
$mock->shouldReceive('update')->with(Mockery::on(fn($arg) => $arg > 0))->andReturn(true);
```

---

## instance() for DI

```php
$this->instance(
    PaymentService::class,
    Mockery::mock(PaymentService::class, fn ($m) => $m->shouldReceive('charge')->andReturn(true))
);
$this->post('/pay')->assertOk();
```

---

## Decision Tree

```
Mocking strategy?
├── Replace entirely → mock()
├── Record calls only → spy()
├── Mock specific methods → partialMock()
├── External API → mock() + andReturn()
├── Verify calls after → spy() + shouldHaveReceived()
└── Inject in container → instance()
```

---

## Best Practices

| DO | DON'T |
|----|-------|
| Mock external dependencies | Over-mock (test real behavior) |
| Use spy() when verifying calls | Mock value objects |
| Be specific with expectations | Forget to verify spy calls |
