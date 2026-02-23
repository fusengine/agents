---
name: architecture-patterns
description: Architecture patterns for Go - Modular MANDATORY, hexagonal ports/adapters, internal/modules structure, layer responsibilities
when-to-use: project structure planning, organizing features, understanding module layout, hexagonal architecture
keywords: architecture, modular, hexagonal, ports and adapters, clean architecture, internal/modules, layer responsibilities
priority: high
related: single-responsibility.md, dependency-inversion.md, interface-segregation.md
---

# Architecture Patterns for Go

## Modular Architecture (MANDATORY)

**All Go projects MUST use modular architecture**: `internal/modules/[feature]/`

Never use flat `internal/` structure.

### Standard Module Layout

```
internal/modules/[feature]/
├── handlers/              # HTTP handlers (< 50 lines each)
│   ├── create.go         # CreateUser handler
│   ├── get.go            # GetUser handler
│   └── handlers_test.go  # Handler tests
├── services/             # Business logic (< 100 lines each)
│   ├── user_service.go
│   └── user_service_test.go
├── repositories/         # Data access (< 100 lines each)
│   ├── repository.go
│   └── repository_test.go
├── ports/                # Interfaces (< 30 lines each)
│   ├── repository.go     # Repository interface
│   ├── sender.go         # External service interface
│   └── logger.go         # Logger interface
├── models/               # Domain entities (< 50 lines each)
│   ├── user.go
│   └── errors.go
└── module.go             # Optional: Module orchestrator
```

---

## Complete Project Structure

```
myapp/
├── cmd/
│   └── server/
│       └── main.go           # Composition root - Wires all dependencies
│
├── internal/
│   ├── modules/
│   │   ├── users/
│   │   │   ├── handlers/
│   │   │   │   ├── create.go
│   │   │   │   ├── get.go
│   │   │   │   └── handlers_test.go
│   │   │   ├── services/
│   │   │   │   ├── user_service.go
│   │   │   │   └── user_service_test.go
│   │   │   ├── repositories/
│   │   │   │   ├── postgres.go      # Concrete implementation
│   │   │   │   ├── memory.go        # For testing
│   │   │   │   └── repository_test.go
│   │   │   ├── ports/
│   │   │   │   ├── repository.go    # UserRepository interface
│   │   │   │   ├── sender.go        # EmailSender interface
│   │   │   │   └── logger.go        # Logger interface
│   │   │   └── models/
│   │   │       ├── user.go
│   │   │       └── errors.go
│   │   │
│   │   ├── orders/
│   │   │   ├── handlers/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   ├── ports/
│   │   │   └── models/
│   │   │
│   │   └── products/
│   │       ├── handlers/
│   │       ├── services/
│   │       ├── repositories/
│   │       ├── ports/
│   │       └── models/
│   │
│   └── core/                 # Shared across features
│       ├── services/
│       │   ├── email_service.go     # Shared email service
│       │   └── cache_service.go     # Shared cache service
│       ├── ports/
│       │   ├── mailer.go            # Shared Mailer interface
│       │   └── cache.go             # Shared Cache interface
│       └── models/
│           ├── pagination.go        # Shared pagination
│           └── errors.go            # Shared error types
│
├── pkg/
│   ├── httpclient/                  # Public HTTP client
│   └── logger/                      # Public logger utility
│
├── go.mod
├── go.sum
└── README.md
```

---

## Hexagonal Architecture (Ports & Adapters)

**Core principle**: Application logic isolated from external dependencies.

### Layer Diagram

```
┌─────────────────────────────────────────────┐
│        External World (HTTP, DB, 3rd-party) │
├─────────────────────────────────────────────┤
│  Adapters (Implementations)                 │
│  ├─ HTTP Handlers                           │
│  ├─ PostgreSQL Repository                   │
│  ├─ Redis Cache                             │
│  └─ Stripe Payment Provider                 │
├─────────────────────────────────────────────┤
│  Ports (Interfaces) - Boundaries            │
│  ├─ Repository interface                    │
│  ├─ Cache interface                         │
│  └─ PaymentProvider interface               │
├─────────────────────────────────────────────┤
│  Core Application Logic (Services)          │
│  ├─ Business rules                          │
│  ├─ Workflows                               │
│  ├─ Domain models                           │
│  └─ No external dependencies!               │
└─────────────────────────────────────────────┘
```

### Implementation

**Core** (business logic - NO external dependencies):
```go
// internal/modules/orders/services/order_service.go
package services

import "myapp/internal/modules/orders/ports"

type OrderService struct {
    repo   ports.OrderRepository  // Interface only
    payment ports.PaymentProvider // Interface only
}

func (s *OrderService) CreateOrder(ctx context.Context, items []*Item) (*Order, error) {
    total := s.calculateTotal(items)
    // Business logic - no DB, no HTTP
    order := &Order{Items: items, Total: total}
    return s.repo.Save(ctx, order)  // Delegates to adapter
}

func (s *OrderService) calculateTotal(items []*Item) int {
    total := 0
    for _, item := range items {
        total += item.Price * item.Quantity
    }
    return total
}
```

**Ports** (interfaces - define contracts):
```go
// internal/modules/orders/ports/repository.go
package ports

type OrderRepository interface {
    Save(ctx context.Context, order *Order) error
    Get(ctx context.Context, id string) (*Order, error)
}

// internal/modules/orders/ports/payment.go
package ports

type PaymentProvider interface {
    Charge(ctx context.Context, amount int, token string) error
}
```

**Adapters** (implementations - talk to external world):
```go
// internal/modules/orders/repositories/postgres.go
package repositories

type PostgresRepository struct {
    db *sql.DB
}

func (r *PostgresRepository) Save(ctx context.Context, order *Order) error {
    // Actual DB code
    _, err := r.db.ExecContext(ctx,
        "INSERT INTO orders (id, total) VALUES (?, ?)",
        order.ID, order.Total)
    return err
}

// internal/modules/orders/repositories/stripe.go (adapter)
package repositories

type StripePaymentAdapter struct {
    apiKey string
}

func (s *StripePaymentAdapter) Charge(ctx context.Context, amount int, token string) error {
    // Call Stripe API
    return stripe.Charge(token, amount)
}
```

**Handlers** (HTTP adapters - input):
```go
// internal/modules/orders/handlers/create.go
package handlers

type CreateOrderHandler struct {
    service *services.OrderService
}

func (h *CreateOrderHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    var req CreateOrderRequest
    json.NewDecoder(r.Body).Decode(&req)

    order, err := h.service.CreateOrder(r.Context(), req.Items)
    if err != nil {
        http.Error(w, err.Error(), 400)
        return
    }

    json.NewEncoder(w).Encode(order)
}
```

---

## Layer Responsibilities

| Layer | Responsibility | Example | Max Lines |
|-------|-----------------|---------|-----------|
| **Handler** | HTTP I/O, request parsing, response formatting | Parse JSON, call service, return HTTP response | 50 |
| **Service** | Business logic, orchestration, workflows | Calculate order total, update inventory | 100 |
| **Repository** | Data access, queries, persistence | SELECT, INSERT, UPDATE operations | 100 |
| **Port** | Interface contract | UserRepository, EmailSender interfaces | 30 |
| **Model** | Domain entities, value objects | User struct, Order struct | 50 |
| **Core Service** | Shared business logic (cross-feature) | Email sending, caching, pagination | - |

---

## Feature Module Rules

### Rule 1: Feature Independence
Each feature module is **independent**:

```
internal/modules/users/          # Users feature - independent
internal/modules/orders/         # Orders feature - independent
internal/modules/products/       # Products feature - independent
```

Features **can depend on** `internal/core/` but **not on each other**.

### Rule 2: Clear Dependencies
```go
// ✅ GOOD: Orders depends on core services
type OrderService struct {
    orderRepo ports.OrderRepository
    emailSvc  core.EmailService  // From core
}

// ❌ BAD: Circular dependency between features
type OrderService struct {
    userService *users.UserService  // Cross-feature dependency!
}
```

### Rule 3: Interfaces at Boundary
```go
internal/modules/users/
├── ports/                # Interfaces exported
│   └── repository.go
├── models/               # Models exported
│   └── user.go
├── handlers/             # Handlers (internal)
├── services/             # Services (internal)
└── repositories/         # Repositories (internal)

// ✅ GOOD: Export only ports/models
import "myapp/internal/modules/users/ports"
import "myapp/internal/modules/users/models"

// ❌ BAD: Import internal implementation
import "myapp/internal/modules/users/services"  // Implementation detail!
```

---

## Shared Code (internal/core/)

### When to Extract to Core
1. Used by **2+ features**
2. Generic utility (pagination, caching)
3. Cross-cutting concern (logging, error handling)

### Example: Email Service

Feature 1: Users (send welcome email)
Feature 2: Orders (send confirmation email)

```
internal/core/services/
└── email_service.go

internal/core/ports/
└── mailer.go

// Users feature imports core
type UserService struct {
    repo   ports.UserRepository
    mailer core.Mailer  // ✅ From core
}

// Orders feature imports core
type OrderService struct {
    repo   ports.OrderRepository
    mailer core.Mailer  // ✅ From core
}
```

---

## Avoiding Anti-Patterns

### ❌ Anti-Pattern: Flat Structure
```
internal/
├── handlers.go          # Which feature?
├── services.go          # Which feature?
├── repositories.go      # Which feature?
└── models.go            # Which feature?
```

### ✅ Correct: Modular Structure
```
internal/modules/users/
├── handlers/
├── services/
├── repositories/
└── models/
```

### ❌ Anti-Pattern: Circular Dependencies
```
users/ → orders/ → users/  # CYCLE!
```

### ✅ Correct: One-way Dependencies
```
orders/ → core/
users/  → core/
products/ → core/
// No cross-feature dependencies
```

### ❌ Anti-Pattern: Implementation Leaking
```go
import "myapp/internal/modules/users/services"  // WRONG!
```

### ✅ Correct: Interface-Based
```go
import "myapp/internal/modules/users/ports"    // Interfaces only
```

---

## Testing Strategy

### Unit Tests (within module)
```
internal/modules/users/services/user_service_test.go
internal/modules/users/repositories/repository_test.go
```

### Integration Tests (cross-layer)
```
internal/modules/users/handlers/handlers_test.go  # Handler + Service
```

### Acceptance Tests (end-to-end)
```
test/
└── acceptance_test.go  # Full request → response
```

---

## Checklist

- [ ] All code in `internal/modules/[feature]/` (never flat `internal/`)
- [ ] Ports (interfaces) in separate `ports/` directory
- [ ] No cross-feature dependencies (only → core)
- [ ] Handler < 50 lines, delegates to Service
- [ ] Service < 100 lines, uses Repositories/Ports
- [ ] Repository < 100 lines, data access only
- [ ] Shared code in `internal/core/`
- [ ] Handlers import ports, not services
- [ ] Godoc on all exported functions
- [ ] Error handling consistent across layers
