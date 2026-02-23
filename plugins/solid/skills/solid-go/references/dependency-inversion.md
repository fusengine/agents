---
name: dependency-inversion
description: Dependency Inversion Principle for Go - Constructor injection, wire at main, interfaces in ports directories
when-to-use: circular dependencies, testing with mocks, managing service dependencies, composition root
keywords: DIP, dependency inversion, constructor injection, wire, main, interfaces, composition root, decoupling
priority: high
related: single-responsibility.md, interface-segregation.md, templates/service.md, templates/interface.md
---

# Dependency Inversion Principle (DIP)

## Core Concept

**High-level modules should not depend on low-level modules; both should depend on abstractions.**

In Go: Use **constructor injection** to pass interfaces (abstractions), wire dependencies at `main()`:

```go
// ❌ BAD: Service creates its own dependency (couples to concrete type)
type UserService struct{}

func (s *UserService) CreateUser() {
    db := &PostgresDB{}  // Hard-wired dependency!
    db.Insert(...)
}

// ✅ GOOD: Dependency injected via constructor
type UserService struct {
    repo UserRepository  // Interface (abstraction)
}

func NewUserService(repo UserRepository) *UserService {
    return &UserService{repo: repo}
}

func (s *UserService) CreateUser() {
    s.repo.Save(...)  // Works with ANY implementation
}
```

---

## Constructor Injection Pattern

### Step 1: Define Interface (Abstraction)

Location: `internal/modules/[feature]/ports/`

```go
package ports

import "context"

type UserRepository interface {
    Save(ctx context.Context, u *User) error
    Get(ctx context.Context, id string) (*User, error)
}
```

### Step 2: Implement Concrete Types

Location: `internal/modules/users/repositories/postgres.go`

```go
package repositories

import "context"

type PostgresRepository struct {
    db *sql.DB
}

func NewPostgresRepository(db *sql.DB) *PostgresRepository {
    return &PostgresRepository{db: db}
}

func (r *PostgresRepository) Save(ctx context.Context, u *User) error {
    _, err := r.db.ExecContext(ctx, "INSERT INTO users ...", u.ID, u.Email)
    return err
}

func (r *PostgresRepository) Get(ctx context.Context, id string) (*User, error) {
    row := r.db.QueryRowContext(ctx, "SELECT * FROM users WHERE id = ?", id)
    u := &User{}
    err := row.Scan(&u.ID, &u.Email)
    return u, err
}
```

### Step 3: Service Accepts Interface

Location: `internal/modules/users/services/user_service.go`

```go
package services

import (
    "context"
    "myapp/internal/modules/users/ports"
)

type UserService struct {
    repo ports.UserRepository  // Interface, not concrete type
}

func NewUserService(repo ports.UserRepository) *UserService {
    return &UserService{repo: repo}
}

func (s *UserService) CreateUser(ctx context.Context, email string) (*User, error) {
    user := &User{ID: generateID(), Email: email}
    return user, s.repo.Save(ctx, user)
}
```

### Step 4: Wire at Main (Composition Root)

Location: `cmd/main.go`

```go
package main

import (
    "database/sql"
    "myapp/internal/modules/users/repositories"
    "myapp/internal/modules/users/services"
)

func main() {
    // Open DB
    db, _ := sql.Open("postgres", "...")

    // Compose dependencies (Composition Root)
    userRepo := repositories.NewPostgresRepository(db)
    userService := services.NewUserService(userRepo)

    // Now services are decoupled from concrete implementations
    handleUserRequests(userService)
}
```

---

## Wiring Multiple Dependencies

```go
type UserService struct {
    repo   ports.UserRepository
    email  ports.EmailSender
    logger ports.Logger
}

func NewUserService(
    repo ports.UserRepository,
    email ports.EmailSender,
    logger ports.Logger,
) *UserService {
    return &UserService{
        repo:   repo,
        email:  email,
        logger: logger,
    }
}

// In main()
func main() {
    db, _ := sql.Open("postgres", "...")
    userRepo := repositories.NewPostgresRepository(db)
    emailSender := services.NewSMTPEmailSender("smtp.gmail.com")
    logger := services.NewConsoleLogger()

    // Compose
    userService := services.NewUserService(userRepo, emailSender, logger)
}
```

---

## Dependency Graph Structure

```
internal/modules/users/
├── ports/                       # Abstractions (interfaces)
│   └── repository.go           # UserRepository interface
├── repositories/
│   ├── postgres.go             # Depends on ports.UserRepository
│   └── memory.go               # Depends on ports.UserRepository
└── services/
    └── user_service.go         # Depends on ports.UserRepository

// Both repositories implement ports.UserRepository
// Service only knows ports.UserRepository (abstraction)
// No circular dependencies
```

---

## Anti-Patterns & Fixes

### ❌ Service Creates Its Own Dependencies
```go
// BAD: Service depends on concrete type, tight coupling
type UserService struct{}

func (s *UserService) GetUser(id string) (*User, error) {
    db := &PostgresDB{}  // Hard-wired!
    db.Connect()
    return db.QueryUser(id)
}

// Problems:
// - Can't mock database in tests
// - Can't switch to MySQL without changing UserService
// - Testing creates real database connections
```

### ✅ Service Receives Dependencies
```go
// GOOD: Decoupled via interface
type UserService struct {
    repo UserRepository
}

func NewUserService(repo UserRepository) *UserService {
    return &UserService{repo: repo}
}

func (s *UserService) GetUser(ctx context.Context, id string) (*User, error) {
    return s.repo.Get(ctx, id)
}

// In production
userService := NewUserService(NewPostgresRepository(db))

// In tests
userService := NewUserService(NewMockRepository())
```

### ❌ Global Dependencies (init() function)
```go
// BAD: Global state, hard to test
var db *Database

func init() {
    db = NewDatabase()  // Global!
}

type UserService struct{}

func (s *UserService) GetUser(id string) (*User, error) {
    return db.QueryUser(id)  // Uses global
}
```

### ✅ Constructor Injection
```go
// GOOD: Explicit dependencies
type UserService struct {
    db Database
}

func NewUserService(db Database) *UserService {
    return &UserService{db: db}
}

func (s *UserService) GetUser(id string) (*User, error) {
    return s.db.QueryUser(id)
}
```

---

## Testing with Mocks

DIP enables easy mocking:

```go
// Test with mock repository
type MockUserRepository struct {
    GetFunc func(ctx context.Context, id string) (*User, error)
}

func (m *MockUserRepository) Get(ctx context.Context, id string) (*User, error) {
    return m.GetFunc(ctx, id)
}

func TestUserService(t *testing.T) {
    mock := &MockUserRepository{
        GetFunc: func(ctx context.Context, id string) (*User, error) {
            return &User{ID: id, Email: "test@example.com"}, nil
        },
    }

    service := services.NewUserService(mock)
    user, _ := service.GetUser(context.Background(), "123")

    if user.Email != "test@example.com" {
        t.Fatal("Unexpected email")
    }
}
```

---

## Composition Root Pattern

**Single place where all dependencies are wired** - the `main()` function:

```go
// cmd/main.go - The Composition Root
func main() {
    // Load configuration
    cfg := loadConfig()

    // Create low-level services
    db, _ := sql.Open("postgres", cfg.DatabaseURL)
    defer db.Close()

    // Create repositories (depend on db)
    userRepo := repositories.NewPostgresRepository(db)
    orderRepo := repositories.NewPostgresRepository(db)

    // Create services (depend on repositories)
    userService := services.NewUserService(userRepo)
    orderService := services.NewOrderService(orderRepo)

    // Create handlers (depend on services)
    userHandler := handlers.NewUserHandler(userService)
    orderHandler := handlers.NewOrderHandler(orderService)

    // Setup routes and start server
    mux := http.NewServeMux()
    mux.HandleFunc("/users", userHandler.ListUsers)
    mux.HandleFunc("/orders", orderHandler.ListOrders)

    http.ListenAndServe(":8080", mux)
}
```

---

## Switching Implementations

DIP makes switching implementations trivial:

```go
func main() {
    // Production: PostgreSQL
    if os.Getenv("ENV") == "production" {
        db, _ := sql.Open("postgres", os.Getenv("DATABASE_URL"))
        userRepo := repositories.NewPostgresRepository(db)
        userService := services.NewUserService(userRepo)
        // ...
    }

    // Development: In-memory
    if os.Getenv("ENV") == "development" {
        userRepo := repositories.NewMemoryRepository()
        userService := services.NewUserService(userRepo)
        // Same interface - service doesn't know or care
        // ...
    }
}
```

---

## Parameter Objects

For many dependencies, use a parameter struct:

```go
type Config struct {
    UserRepo  ports.UserRepository
    EmailSvc  ports.EmailSender
    Logger    ports.Logger
    Cache     ports.Cache
}

type UserService struct {
    cfg *Config
}

func NewUserService(cfg *Config) *UserService {
    return &UserService{cfg: cfg}
}

// In main()
cfg := &Config{
    UserRepo: userRepo,
    EmailSvc: emailService,
    Logger:   logger,
    Cache:    cache,
}
service := services.NewUserService(cfg)
```

---

## Checklist

- [ ] All external dependencies are interfaces
- [ ] Services accept dependencies via constructor
- [ ] No global state or `init()` wiring
- [ ] Composition root in `main()`
- [ ] Easy to swap implementations for testing
- [ ] No circular dependencies
- [ ] Interfaces in `ports/` directory
- [ ] Clear dependency flow: Handler → Service → Repository → DB
