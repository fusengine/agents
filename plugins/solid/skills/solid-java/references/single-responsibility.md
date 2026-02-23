---
name: single-responsibility
description: Single Responsibility Principle for Java - One job per class
when-to-use: fat classes, refactoring existing code, layer confusion
keywords: SRP, responsibility, Java, Controller, Service, Repository
priority: high
related: architecture-patterns.md, dependency-inversion.md
---

# Single Responsibility Principle (SRP)

**One reason to change = one responsibility per class.**

## Decision Tree

```
HTTP handler? → Controller (< 50 lines)
Database? → Repository (< 100 lines)
Business rules? → Service (< 100 lines)
```

## Layer Jobs

| Layer | Job | Max Lines |
|-------|-----|-----------|
| Controller | Parse request → call service → return response | 50 |
| Service | Business logic, orchestration, transactions | 100 |
| Repository | JPA queries only, no business logic | 100 |

## Module Structure

```
modules/[feature]/
├── controllers/    # HTTP handlers
├── services/       # Business logic
├── repositories/   # Data access
├── interfaces/     # Contracts
├── models/         # Entities/DTOs
└── exceptions/     # Domain errors
```

## Quick Example

```java
// ❌ BAD: God Class (3 reasons to change)
public class ProductManager {
    @PostMapping ResponseEntity create(@RequestBody ProductDTO dto) { }
    public void calculatePrice(Product p) { }
    public Product findById(Long id) { }
}

// ✅ GOOD: Separated (1 reason each)
@RestController public class ProductController {
    private final ProductService service;
    @PostMapping public ResponseEntity create(@Valid @RequestBody ProductDTO dto) {
        return ResponseEntity.ok(service.create(dto));
    }
}

@Service public class ProductService {
    private final ProductRepository repo;
    @Transactional public Product create(CreateProductDTO dto) {
        return repo.save(new Product(dto.name(), dto.price()));
    }
}

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory(String category);
}
```

## Refactoring Checklist

- [ ] Each class has ONE reason to change
- [ ] Controllers: NO business logic
- [ ] Services: NO HTTP concerns
- [ ] Repositories: NO business rules
- [ ] All files < 100 lines (split at 90)
- [ ] Dependencies injected via constructor
- [ ] No `new` keyword for services/repositories
