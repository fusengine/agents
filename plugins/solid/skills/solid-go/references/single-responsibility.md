---
name: single-responsibility
description: Single Responsibility Principle for Go - Handler/Service/Repository separation with layer responsibilities and modular architecture
when-to-use: fat structs, unclear responsibilities, services doing too much, handler logic mixing concerns
keywords: SRP, single responsibility, handlers, services, repositories, separation of concerns, layers
priority: high
related: architecture-patterns.md, open-closed.md, templates/service.md, templates/handler.md
---

# Single Responsibility Principle (SRP)

## Core Concept

Each struct should have ONE reason to change. In Go, use **layered architecture** to separate concerns:

| Layer | Responsibility | Location |
|-------|-----------------|----------|
| **Handler** | HTTP I/O, request validation, response formatting | `internal/modules/[feature]/handlers/` |
| **Service** | Business logic, orchestration, domain rules | `internal/modules/[feature]/services/` |
| **Repository** | Data access, persistence, queries | `internal/modules/[feature]/repositories/` |
| **Model** | Domain entities, value objects | `internal/modules/[feature]/models/` |

---

## Decision Tree

**Where does this logic belong?**

```
Is it HTTP-related? (parsing, response codes)
├─ YES → Handler (delegates to Service)
└─ NO ↓

Is it business/domain logic? (calculations, rules, workflows)
├─ YES → Service (uses Repositories & Ports)
└─ NO ↓

Is it data access? (queries, persistence, mapping)
├─ YES → Repository (implements Port interfaces)
└─ NO ↓

Is it domain entity/struct? (data holder)
└─ YES → Model
```

---

## Modular Structure (MANDATORY)

```
internal/modules/users/
├── handlers/
│   ├── create.go         # CreateUser handler only
│   ├── get.go            # GetUser handler only
│   └── handlers_test.go  # Shared tests
├── services/
│   ├── user_service.go   # CreateUser, GetUser business logic
│   └── user_service_test.go
├── repositories/
│   ├── repository.go     # DB queries
│   └── repository_test.go
├── ports/
│   └── repository.go     # Repository interface
└── models/
    └── user.go           # User struct
```

**NEVER use flat `internal/` - always nest under `internal/modules/[feature]/`**

---

## Anti-Patterns & Fixes

### ❌ Fat Handler (HTTP + Business Logic)
```go
// BAD: Handler doing business logic
func CreateUser(w http.ResponseWriter, r *http.Request) {
    var req CreateUserRequest
    json.NewDecoder(r.Body).Decode(&req)

    // Business logic here - WRONG!
    if len(req.Email) == 0 {
        http.Error(w, "Email required", 400)
        return
    }
    user := &User{Email: req.Email, CreatedAt: time.Now()}

    // Data persistence here - WRONG!
    db.Exec("INSERT INTO users ...")

    json.NewEncoder(w).Encode(user)
}
```

### ✅ Separated Concerns
```go
// Handler: HTTP I/O only
func (h *UserHandler) CreateUser(w http.ResponseWriter, r *http.Request) {
    var req CreateUserRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, "Invalid JSON", 400)
        return
    }

    user, err := h.service.CreateUser(r.Context(), req.Email)
    if err != nil {
        http.Error(w, err.Error(), 400)
        return
    }

    json.NewEncoder(w).Encode(user)
}

// Service: Business logic only
func (s *UserService) CreateUser(ctx context.Context, email string) (*User, error) {
    if err := s.validateEmail(email); err != nil {
        return nil, err
    }
    user := &User{Email: email, CreatedAt: time.Now()}
    return s.repo.Save(ctx, user)
}

// Repository: Data access only
func (r *UserRepository) Save(ctx context.Context, u *User) (*User, error) {
    err := r.db.WithContext(ctx).Create(u).Error
    return u, err
}
```

---

## Layer Responsibilities

### Handler Layer
- Parse HTTP requests
- Validate input format (JSON, query params)
- Call service methods
- Format HTTP responses
- Set HTTP headers/status codes
- **Max 50 lines**

### Service Layer
- Business logic & domain rules
- Data validation (business rules, not HTTP)
- Orchestrate repositories & external services
- Handle errors meaningfully
- **Max 100 lines**

### Repository Layer
- Database queries
- Data persistence
- ORM/query building
- Transform DB models to domain models
- **Max 100 lines**

### Model Layer
- Domain structs (User, Product, Order)
- Value objects
- Domain methods (User.IsActive())
- **Max 50 lines**

---

## Shared Code (DRY)

If 2+ features need shared logic:

```
internal/core/
├── services/
│   └── email_service.go    # Used by multiple features
├── ports/
│   └── mailer.go           # Mailer interface
└── models/
    └── pagination.go       # Shared pagination logic
```

Import from `internal/core` in features:
```go
package services

import "myapp/internal/core/services"

type UserService struct {
    repo   Repository
    mailer services.Mailer  // Shared
}
```

---

## Godoc Guidelines

Every exported function must have a comment:

```go
// CreateUser creates a new user and sends welcome email.
// Returns error if email already exists or validation fails.
func (s *UserService) CreateUser(ctx context.Context, email string) (*User, error) {
    // ...
}
```

---

## Checklist

- [ ] Handler delegates all business logic to Service
- [ ] Service uses only Repositories and Ports (no HTTP)
- [ ] Repository handles only data access (no domain logic)
- [ ] Models are data holders only
- [ ] Each file has ONE responsibility (max 100 lines)
- [ ] Shared code lives in `internal/core/`
- [ ] Every exported function has Godoc
- [ ] No circular dependencies between layers
