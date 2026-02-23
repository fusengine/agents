---
name: dependency-inversion
description: Dependency Inversion Principle for Java - Constructor injection, Spring DI
when-to-use: tight coupling, service dependencies, testability
keywords: DIP, dependency injection, Spring, constructor, interfaces
priority: high
related: interface-segregation.md, single-responsibility.md
---

# Dependency Inversion Principle (DIP)

**Depend on abstractions, not concrete implementations.**

## Constructor Injection

### ❌ Bad: Tight Coupling
```java
@Service
public class OrderService {
    private final OrderRepository repo = new OrderRepository(); // WRONG!
    private final PaymentGateway payment = new StripePaymentGateway(); // WRONG!

    public Order createOrder(OrderDTO dto) {
        Order order = new Order(dto.items(), dto.customerId());
        payment.charge(order.getTotal()); // Tightly coupled to Stripe
        repo.save(order);
        return order;
    }
}
// Cannot test without real database/payment gateway
// Cannot swap Stripe for PayPal without code change
```

### ✅ Good: Constructor Injection
```java
@Service
public class OrderService {
    private final OrderRepository repo;
    private final PaymentGateway payment;

    // Dependencies explicit and injectable
    public OrderService(OrderRepository repo, PaymentGateway payment) {
        this.repo = repo;
        this.payment = payment;
    }

    @Transactional
    public Order createOrder(OrderDTO dto) {
        Order order = new Order(dto.items(), dto.customerId());
        payment.charge(order, order.getTotal());
        return repo.save(order);
    }
}

// Easy to test: mock any dependency
@Test
void createOrder_chargesPayment() throws PaymentException {
    OrderDTO dto = new OrderDTO(/* ... */);
    when(mockPayment.charge(any(), any())).thenReturn("tx-123");
    when(mockRepo.save(any())).thenAnswer(i -> i.getArgument(0));

    OrderService service = new OrderService(mockRepo, mockPayment);
    Order result = service.createOrder(dto);

    verify(mockPayment).charge(any(), any());
}
```

## Spring Dependency Wiring

```java
// Spring injects all PaymentGateway implementations
@Service
public class OrderService {
    private final List<PaymentGateway> gateways;

    public OrderService(List<PaymentGateway> gateways) {
        this.gateways = gateways; // Auto-injected
    }

    public Order createOrder(OrderDTO dto, PaymentMethod method) {
        PaymentGateway gateway = gateways.stream()
            .filter(g -> g.supports(method))
            .findFirst()
            .orElseThrow();
        // Now can use Stripe, PayPal, Square—all injected
    }
}

@Configuration
public class PaymentConfig {
    @Bean PaymentGateway stripe(StripeClient client) {
        return new StripePaymentGateway(client);
    }
    @Bean PaymentGateway paypal(PayPalClient client) {
        return new PayPalPaymentGateway(client);
    }
}
```

## Interfaces Location (CRITICAL)

```
modules/order/
├── interfaces/         # MANDATORY
│   ├── OrderRepository.java   (interface only)
│   └── OrderService.java      (interface if needed)
├── services/
│   └── OrderService.java      (implementation)
├── repositories/
│   └── JpaOrderRepository.java (implementation)
└── models/
    └── OrderDTO.java
```

**FORBIDDEN:**
```
❌ interfaces/ with implementations
❌ services/OrderService.java with both interface + impl
❌ OrderRepository.java without interface elsewhere
```

## Dependency Graph (Acyclic)

```
GOOD:
Controller → Service → Repository
  ↓           ↓        ↓
Interface   Interface  Interface (all depend on abstractions)

BAD (circular):
Controller → Service → Repository
     ↑                    ↓
     └────────────────────┘
```

## Refactoring Checklist

- [ ] All dependencies injected via constructor
- [ ] No `new` keyword for services/repositories
- [ ] Every dependency is an interface
- [ ] Interfaces in `modules/[feature]/interfaces/`
- [ ] No circular dependencies between modules
- [ ] Spring `@Configuration` wires implementations
- [ ] `@Transactional` only on service layer
- [ ] Tests mock all dependencies via constructor
