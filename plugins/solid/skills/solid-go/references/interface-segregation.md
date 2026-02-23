---
name: interface-segregation
description: Interface Segregation Principle for Go - Small focused interfaces (1-3 methods), Go idiom, accept interfaces return structs
when-to-use: fat interfaces, unused methods, interface sprawl, extracting dependencies
keywords: ISP, interface segregation, small interfaces, focused contracts, Go idiom, 1-3 methods
priority: high
related: single-responsibility.md, dependency-inversion.md, templates/interface.md, liskov-substitution.md
---

# Interface Segregation Principle (ISP)

## Core Concept

**Clients should not depend on interfaces they don't use.** Go's idiom: **1-3 methods per interface maximum**.

In Go, favor many small, focused interfaces over few fat ones:

```go
// ❌ BAD: Fat interface with 10 methods
type Database interface {
    Query(sql string, args ...interface{}) error
    Exec(sql string, args ...interface{}) error
    Insert(table string, data map[string]interface{}) error
    Update(table string, data map[string]interface{}) error
    Delete(table string, id string) error
    CreateTable(schema string) error
    DropTable(table string) error
    Migrate() error
    Close() error
    Transaction(fn func() error) error
}

// ✅ GOOD: Many small, focused interfaces
type Querier interface {
    Query(sql string, args ...interface{}) error
}

type Executor interface {
    Exec(sql string, args ...interface{}) error
}

type Transactor interface {
    Transaction(fn func() error) error
}
```

---

## Go Idiom: 1-3 Methods

**Maximum 3 methods per interface** (Go convention):

```go
// ✅ GOOD: 1 method
type Reader interface {
    Read(p []byte) (n int, err error)
}

// ✅ GOOD: 2 methods
type ReadCloser interface {
    Read(p []byte) (n int, err error)
    Close() error
}

// ✅ GOOD: 3 methods (limit)
type Database interface {
    Query(sql string, args ...interface{}) error
    Exec(sql string, args ...interface{}) error
    Close() error
}

// ❌ BAD: 4+ methods (violates Go idiom)
type FullService interface {
    Query() error
    Exec() error
    Close() error
    Migrate() error  // Too many!
}
```

---

## Segregation Pattern

### Start with Fat Interface
```go
// Initial design - too many methods
type UserService interface {
    GetUser(id string) (*User, error)
    CreateUser(email string) (*User, error)
    UpdateUser(u *User) error
    DeleteUser(id string) error
    SendEmail(to, subject, body string) error
    LogActivity(action string) error
}
```

### Segregate into Focused Interfaces
```go
package ports

// User repository - just data access
type UserRepository interface {
    Get(ctx context.Context, id string) (*User, error)
    Save(ctx context.Context, u *User) error
    Delete(ctx context.Context, id string) error
}

// Email service - just notifications
type EmailSender interface {
    Send(ctx context.Context, to, subject, body string) error
}

// Activity logger - just logging
type ActivityLogger interface {
    Log(ctx context.Context, action string) error
}

// Business logic coordinates them
type UserService struct {
    repo   UserRepository
    email  EmailSender
    logger ActivityLogger
}

func (s *UserService) CreateUser(ctx context.Context, email string) (*User, error) {
    user := &User{Email: email}
    if err := s.repo.Save(ctx, user); err != nil {
        return nil, err
    }
    s.email.Send(ctx, email, "Welcome", "...")  // Use EmailSender
    s.logger.Log(ctx, "user_created")           // Use ActivityLogger
    return user, nil
}
```

---

## Accept Interfaces, Return Structs

**Key Go idiom for extensibility:**

```go
// ✅ GOOD: Accepts narrow interfaces, returns concrete struct
func ProcessPayment(provider PaymentProvider) (*Transaction, error) {
    // Only needs provider.Charge()
    return provider.Charge(context.Background(), 100, "token")
}

type PaymentService struct {
    provider PaymentProvider  // Accept interface
}

// ❌ BAD: Accepts fat interface with methods you don't use
func ProcessPayment(db FullDatabase) (*Transaction, error) {
    // Only uses db.Query(), but depends on Migrate(), Close(), etc.
    // If someone passes broken Migrate() → your code breaks!
}
```

---

## Real-World Examples

### Logger Segregation
```go
// ❌ FAT: Clients don't need all methods
type Logger interface {
    Debug(msg string) error
    Info(msg string) error
    Warn(msg string) error
    Error(msg string) error
    Fatal(msg string) error
    Close() error
    SetLevel(level string) error
    AddWriter(w io.Writer) error
}

// ✅ SEGREGATED: Each client takes what it needs
type Logger interface {
    Error(msg string) error
}

type ErrorLogger interface {
    Error(msg string) error
    Warn(msg string) error
}

type DetailedLogger interface {
    Debug(msg string) error
    Info(msg string) error
    Warn(msg string) error
    Error(msg string) error
}
```

### Repository Segregation
```go
// ❌ FAT: Service doesn't need all methods
type Repository interface {
    Get(id string) (*User, error)
    Save(u *User) error
    Delete(id string) error
    GetAll() ([]*User, error)
    GetByEmail(email string) (*User, error)
    Count() (int, error)
}

// ✅ SEGREGATED: Only what service needs
type UserGetter interface {
    Get(ctx context.Context, id string) (*User, error)
}

type UserSaver interface {
    Save(ctx context.Context, u *User) error
}

type UserRepository interface {
    UserGetter
    UserSaver
}

// Handler only needs read
func (h *Handler) GetUser(id string) {
    user, _ := h.getter.Get(context.Background(), id)  // Only getter
}
```

---

## Anti-Patterns & Fixes

### ❌ Interface with Unused Methods
```go
// BAD: Service depends on methods it never uses
type OrderService struct {
    storage Storage  // Depends on all 8 methods
}

type Storage interface {
    Save(o *Order) error      // Used
    Get(id string) (*Order, error)  // Used
    Delete(id string) error   // NOT used
    Query(sql string) error   // NOT used
    Migrate() error           // NOT used
    Close() error             // NOT used
    BeginTx() error           // NOT used
    Commit() error            // NOT used
}
```

### ✅ Only What You Need
```go
// GOOD: Service depends only on what it uses
type OrderService struct {
    saver OrderSaver
    getter OrderGetter
}

type OrderSaver interface {
    Save(o *Order) error
}

type OrderGetter interface {
    Get(id string) (*Order, error)
}

// Other layers can use their own interfaces
type Migrator interface {
    Migrate() error
}
```

---

## Interface Location

```
internal/modules/[feature]/ports/
├── repository.go      # Data access interfaces
├── sender.go          # External service interfaces
└── logger.go          # Logging interface
```

Each interface in separate file (small and focused):

```go
// ports/repository.go
package ports

type UserRepository interface {
    Get(ctx context.Context, id string) (*User, error)
    Save(ctx context.Context, u *User) error
}

// ports/sender.go
package ports

type EmailSender interface {
    Send(ctx context.Context, to, subject, body string) error
}

// ports/logger.go
package ports

type Logger interface {
    Error(msg string) error
}
```

---

## Composition Over Inheritance

Go idiom: Combine small interfaces:

```go
// ✅ GOOD: Compose focused interfaces
type ReadWriter interface {
    Reader
    Writer
}

type Reader interface {
    Read(p []byte) (n int, err error)
}

type Writer interface {
    Write(p []byte) (n int, err error)
}

// ✅ Service uses composition
type FileService struct {
    rw ReadWriter
}

func (s *FileService) Copy() {
    s.rw.Read(buf)    // From Reader
    s.rw.Write(buf)   // From Writer
}
```

---

## Checklist

- [ ] All interfaces have 1-3 methods maximum (Go idiom)
- [ ] Clients use all methods they depend on (no unused dependencies)
- [ ] Fat interfaces segregated into focused ones
- [ ] Each interface in separate file in `ports/`
- [ ] Service accepts only interfaces it uses
- [ ] Composition used for multi-interface needs
- [ ] No interfaces with query/command/notification mixed
