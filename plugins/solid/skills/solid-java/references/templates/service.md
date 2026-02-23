---
name: service-template
description: Business logic service with interface dependency injection
when-to-use: implementing business logic, creating service layer
keywords: service, business logic, dependency injection, Spring, Transactional
---

# Service Template

## Basic Service

```java
@Service @Transactional
public class [Feature]Service {
    private final [Feature]Repository repository;
    private final [Feature]Validator validator;

    public [Feature]Service([Feature]Repository repo, [Feature]Validator validator) {
        this.repository = repo;
        this.validator = validator;
    }

    @Transactional(readOnly = true)
    public [Feature]DTO findById(Long id) {
        return repository.findById(id)
            .map([Feature]DTO::from)
            .orElseThrow(() -> new [Feature]NotFoundException(id));
    }

    public [Feature]DTO create(Create[Feature]DTO dto) {
        validator.validate(dto);
        [Feature] entity = new [Feature](dto.field1(), dto.field2());
        [Feature] saved = repository.save(entity);
        return [Feature]DTO.from(saved);
    }

    public [Feature]DTO update(Long id, Update[Feature]DTO dto) {
        [Feature] entity = repository.findById(id)
            .orElseThrow(() -> new [Feature]NotFoundException(id));
        validator.validate(dto);
        entity.update(dto);
        return [Feature]DTO.from(repository.save(entity));
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new [Feature]NotFoundException(id);
        }
        repository.deleteById(id);
    }
}
```

## Service with Multiple Dependencies

```java
@Service @Transactional
public class OrderService {
    private final OrderRepository orderRepo;
    private final OrderValidator validator;
    private final PaymentGateway paymentGateway;
    private final InventoryService inventoryService;
    private final NotificationSender notificationSender;

    public OrderService(OrderRepository repo, OrderValidator v,
                       PaymentGateway payment, InventoryService inventory,
                       NotificationSender sender) {
        this.orderRepo = repo;
        this.validator = v;
        this.paymentGateway = payment;
        this.inventoryService = inventory;
        this.notificationSender = sender;
    }

    public OrderDTO createOrder(CreateOrderDTO dto) {
        validator.validate(dto);
        inventoryService.reserveItems(dto.items());

        Order entity = new Order(dto.customerId(), dto.items());
        Order saved = orderRepo.save(entity);

        try {
            String txId = paymentGateway.charge(entity, entity.getTotal());
            saved.setTransactionId(txId);
            orderRepo.save(saved);
            notificationSender.notify(dto.customerId(), "Order placed");
            return OrderDTO.from(saved);
        } catch (Exception e) {
            inventoryService.releaseItems(dto.items());
            throw new OrderException("Payment failed", e);
        }
    }

    @Transactional(readOnly = true)
    public OrderDTO findWithItems(Long id) {
        Order order = orderRepo.findById(id)
            .orElseThrow(() -> new OrderNotFoundException(id));
        return OrderDTO.from(order);
    }

    public void cancelOrder(Long id) {
        Order order = orderRepo.findById(id)
            .orElseThrow(() -> new OrderNotFoundException(id));
        if (!order.isCancellable()) throw new OrderException("Not cancellable");
        order.cancel();
        orderRepo.save(order);
        inventoryService.releaseItems(order.getItems());
    }
}
```

## Checklist

- [ ] Service is max 100 lines (split if exceeding)
- [ ] All dependencies injected via constructor
- [ ] No `new` keyword for repos/services
- [ ] `@Transactional` on class level
- [ ] `readOnly=true` for query methods
- [ ] Business logic separated from HTTP/data
- [ ] Every method documented
- [ ] Exceptions raised for business violations
- [ ] No null returns—use Optional or exceptions
