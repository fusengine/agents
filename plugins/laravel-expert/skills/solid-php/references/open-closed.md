---
name: open-closed
description: OCP Guide - Extend via interfaces and new implementations for Laravel
when-to-use: adding payment methods, notification channels, export formats
keywords: open closed, OCP, interface, implementation, strategy, laravel
priority: high
related: solid-principles.md, dependency-inversion.md, templates/code-templates.md
---

# Open/Closed Principle (OCP) for Laravel

**Open for extension, closed for modification**

Add new features by creating new classes, not modifying existing ones.

---

## When to Apply OCP?

### Symptoms of Violation

1. **Switch/case on types growing** -> Each new type = modify existing code
2. **Adding payment method requires modifying PaymentService** -> Tight coupling
3. **New notification channel = modify NotificationService** -> Not extensible

---

## How to Apply OCP?

### 1. Interface + Implementations

Instead of switch/case for payment methods:

```php
// FuseCore/Payment/App/Contracts/PaymentGatewayInterface.php
interface PaymentGatewayInterface
{
    public function charge(Money $amount, PaymentDetails $details): PaymentResult;
    public function refund(string $transactionId): RefundResult;
}

// FuseCore/Payment/App/Services/StripeGateway.php
final readonly class StripeGateway implements PaymentGatewayInterface { /* ... */ }

// New method? Just add a new class:
// FuseCore/Payment/App/Services/PayPalGateway.php
final readonly class PayPalGateway implements PaymentGatewayInterface { /* ... */ }
```

### 2. ModuleServiceProvider Binding

Register implementations in ModuleServiceProvider:

```php
// FuseCore/Payment/ModuleServiceProvider.php
public array $bindings = [
    Contracts\PaymentGatewayInterface::class => Services\StripeGateway::class,
];
```

New gateway = new class + update bindings. No modification to consumers.

### 3. Event/Listener Pattern

Instead of hardcoding side effects:

```php
// Service dispatches event
event(new OrderPlaced($order));

// Listeners handle side effects (add new without modifying)
// app/Listeners/SendOrderConfirmation.php
// app/Listeners/UpdateInventory.php
// app/Listeners/NotifyWarehouse.php   <-- new, no modification
```

### 4. Pipeline Pattern (Middleware)

```php
// Each step is independent, add without modifying
$result = Pipeline::send($order)
    ->through([
        ValidateStock::class,
        CalculateTax::class,
        ApplyDiscount::class,    // new, no modification
    ])
    ->thenReturn();
```

---

## Extension Patterns Summary

| Pattern | Use Case | Laravel Feature |
|---------|----------|-----------------|
| Interface + Impl | Swappable providers | ServiceProvider binding |
| Event/Listener | Side effects | Event system |
| Pipeline | Sequential processing | Pipeline facade |
| Strategy | Runtime behavior swap | Config + binding |

---

## Decision Criteria

1. **Will there be more variants?** -> Interface + implementations
2. **Are side effects growing?** -> Event/Listener pattern
3. **Is processing sequential?** -> Pipeline pattern
4. **Does behavior depend on config?** -> Strategy via ServiceProvider

---

## OCP Checklist

- [ ] No switch/case on type strings
- [ ] New feature = new class, not modified class
- [ ] Interfaces in `FuseCore/[Module]/App/Contracts/`
- [ ] ModuleServiceProvider handles binding
- [ ] Events decouple side effects
