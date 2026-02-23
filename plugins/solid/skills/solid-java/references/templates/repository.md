---
name: repository-template
description: Data access repository layer with JPA
when-to-use: implementing data access
keywords: repository, JPA, data access, Spring Data
---

# Repository Template

Data access layer with JPA. Only queries—no business logic.

## Basic Repository

```java
public interface [Feature]Repository extends JpaRepository<[Feature], Long> {
    /**
     * Find [feature] by name.
     * @param name Search term
     * @return Optional [feature]
     */
    Optional<[Feature]> findByName(String name);

    /**
     * Check if exists.
     */
    boolean existsByName(String name);

    /**
     * Find by category.
     * @param category Filter
     * @return List of [features]
     */
    @Query("SELECT e FROM [Feature] e WHERE e.category = :cat ORDER BY e.name ASC")
    List<[Feature]> findByCategory(@Param("cat") String category);
}
```

## Pagination

```java
public interface ProductRepository extends JpaRepository<Product, Long> {
    /**
     * Find by category with pagination.
     */
    Page<Product> findByCategory(String category, Pageable pageable);

    /**
     * Search products by text.
     */
    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :term, '%'))")
    Page<Product> search(@Param("term") String searchTerm, Pageable pageable);

    /**
     * Find by SKU.
     */
    Optional<Product> findBySku(String sku);

    /**
     * Find in price range.
     */
    @Query("SELECT p FROM Product p WHERE p.price BETWEEN :min AND :max")
    List<Product> findByPriceRange(@Param("min") BigDecimal min,
                                  @Param("max") BigDecimal max);

    /**
     * Count by category.
     */
    long countByCategory(String category);
}
```

## Complex Queries

```java
public interface OrderRepository extends JpaRepository<Order, Long>,
                                        JpaSpecificationExecutor<Order> {
    /**
     * Find by customer with pagination.
     */
    Page<Order> findByCustomerId(Long customerId, Pageable pageable);

    /**
     * Find in date range.
     */
    @Query("SELECT o FROM Order o WHERE DATE(o.createdAt) BETWEEN :from AND :to")
    List<Order> findByDateRange(@Param("from") LocalDate from,
                               @Param("to") LocalDate to);

    /**
     * Find with items (JOIN FETCH avoids N+1).
     */
    @Query("SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.items WHERE o.total >= :amount")
    List<Order> findHighValueOrders(@Param("amount") BigDecimal amount);

    /**
     * Projection to select columns only.
     */
    @Query("SELECT new map(o.id as id, o.total as total) FROM Order o WHERE o.status = 'PENDING'")
    List<Map<String, Object>> findPendingOrderSummary();
}
```

## Performance Tips

```java
// ✅ GOOD: JOIN FETCH avoids N+1
@Query("SELECT DISTINCT p FROM Product p LEFT JOIN FETCH p.reviews")
List<Product> findWithReviews();

// ❌ BAD: Lazy loading in loop = N+1 queries
List<Product> products = repo.findAll();
for (Product p : products) { p.getReviews().size(); } // N queries!

// ✅ GOOD: Projection selects columns only
@Query("SELECT new map(p.id, p.name, p.price) FROM Product p")
List<Map<String, Object>> findProductNames();

// ✅ GOOD: Batch hint for large result sets
@Query("SELECT p FROM Product p WHERE p.active = true")
@BatchSize(size = 50)
List<Product> findAllActive();
```

## Checklist

- [ ] Interface in `modules/[feature]/interfaces/`
- [ ] Extends `JpaRepository<Entity, ID>`
- [ ] No business logic—only queries
- [ ] Max 100 lines
- [ ] All queries documented
- [ ] No `@Transactional`
- [ ] Complex queries use `@Query`
- [ ] Avoids N+1 with JOIN FETCH
- [ ] Pagination via `Pageable`
- [ ] Native SQL only when necessary
