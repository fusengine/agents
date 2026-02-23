---
name: module-structure
description: Complete module structure with directory layout and mod definition
when-to-use: creating new feature module, module scaffolding
keywords: module, structure, scaffold, layout, Java
---

# Module Structure Template

## Directory Layout

```
modules/[feature]/
├── controllers/           # HTTP handlers (< 50 lines)
│   └── [Feature]Controller.java
├── services/              # Business logic (< 100 lines)
│   ├── [Feature]Service.java
│   └── [Feature]Validator.java
├── repositories/          # Data access (< 100 lines)
│   └── [Feature]Repository.java (interface)
├── interfaces/            # Contracts (< 30 lines each)
│   ├── [Feature]Repository.java
│   ├── [Feature]Validator.java
│   └── [Feature]Service.java
├── models/                # Entities & DTOs (< 50 lines each)
│   ├── [Feature]Entity.java (JPA)
│   ├── Create[Feature]DTO.java (record)
│   └── [Feature]DTO.java (record)
├── exceptions/            # Domain errors
│   └── [Feature]NotFoundException.java
└── config/
    └── [Feature]Config.java
```

## Java Module Definition

```java
// src/main/java/module-info.java (project root)
module com.yourapp.modules.[feature] {
    requires com.yourapp.modules.core;
    requires spring.core;
    requires spring.data.jpa;
    requires jakarta.persistence;

    exports com.yourapp.modules.[feature].interfaces;
    exports com.yourapp.modules.[feature].models;
}
```

## Minimal Example

```java
// Controller
@RestController @RequestMapping("/api/products")
public class ProductController {
    private final ProductService service;
    public ProductController(ProductService service) { this.service = service; }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }
}

// Service Interface
public interface ProductService {
    ProductDTO findById(Long id);
    ProductDTO create(CreateProductDTO dto);
}

// Service Implementation
@Service @Transactional
public class ProductService implements com.yourapp.modules.product.interfaces.ProductService {
    private final ProductRepository repo;
    private final ProductValidator validator;

    public ProductService(ProductRepository r, ProductValidator v) {
        this.repo = r;
        this.validator = v;
    }

    @Override @Transactional(readOnly = true)
    public ProductDTO findById(Long id) {
        return repo.findById(id)
            .map(ProductDTO::from)
            .orElseThrow(() -> new ProductNotFoundException(id));
    }

    @Override
    public ProductDTO create(CreateProductDTO dto) {
        validator.validate(dto);
        Product entity = new Product(dto.name(), dto.price());
        return ProductDTO.from(repo.save(entity));
    }
}

// Repository (interface in interfaces/)
public interface ProductRepository extends JpaRepository<Product, Long> {
}

// Entity & DTOs
@Entity @Table(name = "products")
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private BigDecimal price;
    // getters
}

public record ProductDTO(Long id, String name, BigDecimal price) {
    static ProductDTO from(Product e) { return new ProductDTO(e.getId(), e.getName(), e.getPrice()); }
}

public record CreateProductDTO(
    @NotBlank String name,
    @NotNull @DecimalMin("0.01") BigDecimal price
) {}
```

## Checklist

- [ ] Directory structure matches `modules/[feature]/`
- [ ] Controllers < 50 lines
- [ ] Services < 100 lines
- [ ] All interfaces in `interfaces/`
- [ ] DTOs as `record`
- [ ] Constructor injection only
- [ ] Javadoc on all public methods
