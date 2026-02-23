---
name: liskov-substitution
description: Liskov Substitution Principle for Java - Honor interface contracts
when-to-use: inheritance issues, contract violations, interface implementations
keywords: LSP, contract, substitutable, invariants, Java
priority: high
related: interface-segregation.md, dependency-inversion.md
---

# Liskov Substitution Principle (LSP)

**Subtypes must be substitutable for supertypes without breaking the contract.**

## The Contract

When implementing an interface:
- Accept same input (or broader)
- Produce same output (or narrower)
- Maintain invariants
- Throw declared exceptions only

## Bad vs Good

### ❌ Bad: Broken Contract
```java
public interface PaymentGateway {
    String charge(BigDecimal amount) throws PaymentException;
}

public class SquarePaymentGateway implements PaymentGateway {
    @Override
    public String charge(BigDecimal amount) {
        // WRONG: throws NullPointerException, not PaymentException!
        if (apiKey == null) throw new NullPointerException("API key");
        return "tx-" + System.nanoTime();
    }
}

// Caller expects PaymentException, gets NPE instead → BROKEN
```

### ✅ Good: Honors Contract
```java
public class SquarePaymentGateway implements PaymentGateway {
    private final SquareClient client;

    public SquarePaymentGateway(SquareClient client) throws PaymentException {
        if (client == null) throw new PaymentException("Client required");
        this.client = client;
    }

    @Override
    public String charge(BigDecimal amount) throws PaymentException {
        if (amount == null || amount.signum() <= 0) {
            throw new PaymentException("Invalid amount");
        }
        try {
            return client.createPayment(amount).getId();
        } catch (SquareException e) {
            throw new PaymentException("Failed", e);
        }
    }
}
```

## Contract Testing

```java
// All implementations must pass same tests
public interface PaymentGatewayContractTest {
    PaymentGateway getGateway();

    @Test default void chargeValid() throws PaymentException {
        String txId = getGateway().charge(BigDecimal.TEN);
        assertNotNull(txId);
    }

    @Test default void chargeZero() {
        assertThrows(PaymentException.class,
            () -> getGateway().charge(BigDecimal.ZERO));
    }

    @Test default void chargeNull() {
        assertThrows(PaymentException.class,
            () -> getGateway().charge(null));
    }
}

public class SquareGatewayTest implements PaymentGatewayContractTest {
    @Override public PaymentGateway getGateway() {
        return new SquarePaymentGateway(mockClient);
    }
}

public class StripeGatewayTest implements PaymentGatewayContractTest {
    @Override public PaymentGateway getGateway() {
        return new StripePaymentGateway(mockClient);
    }
}
```

## Common Violations

| Violation | Fix |
|-----------|-----|
| Unchecked exception instead of declared | Wrap in declared exception |
| Accepts null when contract forbids | Validate in constructor |
| Weakens invariants (e.g., amount < 0) | Enforce in all implementations |
| Return type too narrow | Return interface type, not implementation |
| Different behavior for same input | Document in interface, test all |

## Sealed Interfaces Help

```java
public sealed interface PaymentGateway
    permits StripePaymentGateway, PayPalPaymentGateway, SquarePaymentGateway {
    String charge(BigDecimal amount) throws PaymentException;
}
// Explicit implementations → easier contract testing
```

## Refactoring Checklist

- [ ] All exceptions declared in interface
- [ ] No unchecked exceptions replacing checked ones
- [ ] No null accepted when contract forbids
- [ ] Return types consistent with interface
- [ ] Invariants maintained in all implementations
- [ ] Contract tests pass for every implementation
- [ ] Substitution works: swap implementations, code still works
