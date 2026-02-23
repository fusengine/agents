---
name: error-template
description: Custom exception hierarchy
when-to-use: error handling, custom exceptions
keywords: exception, error, hierarchy
---

# Error/Exception Template

## Exception Hierarchy

```java
public class DomainException extends Exception {
    private final String errorCode;
    private final String context;

    public DomainException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
        this.context = null;
    }

    public String getErrorCode() { return errorCode; }
    public String getContext() { return context; }
}

public class EntityNotFoundException extends DomainException {
    private final String entityType;
    private final Object entityId;

    public EntityNotFoundException(String entityType, Object entityId) {
        super(entityType + " not found: " + entityId, "ENTITY_NOT_FOUND");
        this.entityType = entityType;
        this.entityId = entityId;
    }

    public String getEntityType() { return entityType; }
    public Object getEntityId() { return entityId; }
}
```

## Feature-Specific Exceptions

```java
public class ProductNotFoundException extends EntityNotFoundException {
    public ProductNotFoundException(Long id) { super("Product", id); }
}

public class InvalidProductException extends DomainException {
    private final String fieldName;

    public InvalidProductException(String fieldName, String reason) {
        super("Invalid " + fieldName + ": " + reason, "INVALID_PRODUCT_FIELD");
        this.fieldName = fieldName;
    }

    public String getFieldName() { return fieldName; }
}
```

## Payment Exceptions

```java
public class PaymentException extends DomainException {
    private final PaymentErrorCode code;
    private final String transactionId;

    public enum PaymentErrorCode {
        DECLINED, INSUFFICIENT_FUNDS, INVALID_CARD, GATEWAY_ERROR, TIMEOUT
    }

    public PaymentException(String message, PaymentErrorCode code) {
        super(message, "PAYMENT_" + code.name());
        this.code = code;
        this.transactionId = null;
    }

    public PaymentException(String message, PaymentErrorCode code, String txId) {
        super(message, "PAYMENT_" + code.name());
        this.code = code;
        this.transactionId = txId;
    }

    public PaymentErrorCode getCode() { return code; }
    public String getTransactionId() { return transactionId; }
    public boolean isRetryable() {
        return code == PaymentErrorCode.TIMEOUT ||
               code == PaymentErrorCode.GATEWAY_ERROR;
    }
}
```

## Validation Exception

```java
public class ValidationException extends DomainException {
    private final Map<String, List<String>> fieldErrors;

    public ValidationException(Map<String, List<String>> errors) {
        super("Validation failed: " + errors.size() + " field(s)", "VALIDATION_ERROR");
        this.fieldErrors = errors;
    }

    public ValidationException(String field, String message) {
        super("Validation failed: " + field, "VALIDATION_ERROR");
        this.fieldErrors = Map.of(field, List.of(message));
    }

    public Map<String, List<String>> getFieldErrors() { return fieldErrors; }
}
```

## Usage in Services

```java
@Service
public class ProductService {
    private final ProductRepository repo;

    public ProductDTO findById(Long id) {
        return repo.findById(id)
            .map(ProductDTO::from)
            .orElseThrow(() -> new ProductNotFoundException(id));
    }

    @Transactional
    public ProductDTO create(CreateProductDTO dto) {
        if (dto.name() == null || dto.name().isBlank()) {
            throw new InvalidProductException("name", "Cannot be empty");
        }
        if (dto.price() == null || dto.price().signum() <= 0) {
            throw new InvalidProductException("price", "Must be > 0");
        }
        Product entity = new Product(dto.name(), dto.price());
        return ProductDTO.from(repo.save(entity));
    }
}
```

## Checklist

- [ ] Exceptions in `modules/[feature]/exceptions/`
- [ ] Base in `modules/core/exceptions/`
- [ ] Extends checked exceptions
- [ ] Error code included
- [ ] Context preserved
- [ ] Not used for flow control
- [ ] Retryable errors marked
- [ ] REST handler in core module
