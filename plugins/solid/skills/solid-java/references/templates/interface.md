---
name: interface-template
description: Interface definition with Javadoc and contracts
when-to-use: defining contracts, role-based interfaces
keywords: interface, contract, Javadoc, dependency
---

# Interface Template

## Repository Interface

```java
public interface [Feature]Repository extends JpaRepository<[Feature], Long> {
    /**
     * Find [feature] by name.
     * @param name The name to search
     * @return Optional containing [feature] if found
     */
    Optional<[Feature]> findByName(String name);

    /**
     * Find [features] in category.
     * @param category The category filter
     * @return List of [features], empty if none
     */
    @Query("SELECT e FROM [Feature] e WHERE e.category = :cat")
    List<[Feature]> findByCategory(@Param("cat") String category);

    /**
     * Check if exists.
     */
    boolean existsByName(String name);
}
```

## Service Interface

```java
public interface [Feature]Service {
    /**
     * Find by ID.
     * @param id Entity ID
     * @return [Feature] DTO
     * @throws [Feature]NotFoundException if not found
     */
    [Feature]DTO findById(Long id);

    /**
     * Create new [feature].
     * @param dto Creation request
     * @return Created DTO
     * @throws IllegalArgumentException if invalid
     */
    [Feature]DTO create(Create[Feature]DTO dto);

    /**
     * Update existing [feature].
     * @param id Entity ID
     * @param dto Update request
     * @return Updated DTO
     */
    [Feature]DTO update(Long id, Update[Feature]DTO dto);

    /**
     * Delete [feature].
     * @param id Entity ID
     */
    void delete(Long id);
}
```

## Validator Interface

```java
public interface [Feature]Validator {
    /**
     * Validate creation request.
     * @throws IllegalArgumentException if invalid
     */
    void validate(Create[Feature]DTO dto);

    /**
     * Validate update request.
     * @throws IllegalArgumentException if invalid
     */
    void validate(Update[Feature]DTO dto);

    /**
     * Validate single field.
     */
    void validateField(String fieldName, Object value);
}
```

## Strategy Interface

```java
public interface PaymentGateway {
    /**
     * Process payment for order.
     * @param order Order to charge
     * @param amount Amount to charge
     * @return Transaction ID
     * @throws PaymentException if fails
     */
    String charge(Order order, BigDecimal amount) throws PaymentException;

    /**
     * Refund transaction.
     * @param transactionId Transaction to refund
     * @param amount Refund amount
     * @return Refund ID
     */
    String refund(String transactionId, BigDecimal amount) throws PaymentException;

    /**
     * Check if supports payment method.
     */
    boolean supports(PaymentMethod method);

    /**
     * Get gateway name.
     */
    String getName();
}
```

## Checklist

- [ ] Interface in `modules/[feature]/interfaces/`
- [ ] One interface per file
- [ ] Max 30 lines per interface
- [ ] Full Javadoc on methods
- [ ] Exceptions documented
- [ ] No implementation code
- [ ] No default methods (unless utility)
