---
name: open-closed
description: Open/Closed Principle for Java - Extend via interfaces, not modification
when-to-use: adding providers, payment gateways, new strategies
keywords: OCP, Strategy pattern, interface-based, extensibility
priority: high
related: single-responsibility.md, interface-segregation.md
---

# Open/Closed Principle (OCP)

**Open for extension, closed for modification—add via interfaces, not code changes.**

## Strategy Pattern

Avoid `if/else` chains. Use interfaces instead.

### ❌ Bad: Closed (requires modification)
```java
public class OrderService {
    public void processPayment(Order order, String method) {
        if (method.equals("STRIPE")) { /* Stripe */ }
        else if (method.equals("PAYPAL")) { /* PayPal */ }
        else if (method.equals("SQUARE")) { /* Requires modification! */ }
    }
}
```

### ✅ Good: Open for Extension
```java
public interface PaymentGateway {
    String charge(Order order, BigDecimal amount) throws PaymentException;
    boolean supports(PaymentMethod method);
}

@Service
public class OrderService {
    private final List<PaymentGateway> gateways; // All injected
    public Order processPayment(Order order, PaymentMethod method) {
        PaymentGateway gateway = gateways.stream()
            .filter(g -> g.supports(method))
            .findFirst()
            .orElseThrow();
        String txId = gateway.charge(order, order.getTotal());
        // ... save order
        return order;
    }
}

// Add NEW provider—NO OrderService changes!
public class SquarePaymentGateway implements PaymentGateway {
    @Override public String charge(Order o, BigDecimal a) { /* Square API */ }
    @Override public boolean supports(PaymentMethod m) { return m == SQUARE; }
}
```

## Patterns

| Pattern | Use Case |
|---------|----------|
| **Strategy** | Different algorithms (payment methods, shipping) |
| **Factory** | Object creation based on type |
| **Decorator** | Add behavior without modifying original |

## Sealed Classes

```java
// ✅ GOOD: Sealed for restricted set (intentional)
public sealed interface PaymentGateway
    permits StripePaymentGateway, PayPalPaymentGateway { }

// ❌ BAD: Sealed, then add provider = modification
public sealed class PaymentMethod permits Stripe, PayPal { }
// Later: add Square? Must modify sealed list!
```

## Refactoring Checklist

- [ ] No `if/else` chains for behavior variants
- [ ] Use Strategy interface for variants
- [ ] New features via implementation, not modification
- [ ] Spring `@Configuration` wires providers
- [ ] Sealed only for intentionally restricted types
