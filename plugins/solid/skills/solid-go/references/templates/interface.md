---
name: interface
description: Interface template - Port definition (Go interfaces), 1-3 methods, copy-paste ready
when-to-use: defining port interfaces, creating contracts, interface design, segregated interfaces
keywords: interface, ports, template, contract, 1-3 methods, Go idiom
---

# Interface Template (Ports)

## Location

**File**: `internal/modules/[feature]/ports/[name].go`

Interfaces (ports) must be in `ports/` directory only, never in implementation files.

---

## Single Method Interface

```go
package ports

import "context"

// Reader defines the contract for reading data.
type Reader interface {
	Read(ctx context.Context, id string) ([]byte, error)
}
```

---

## Two Method Interface

```go
package ports

import "context"

// Repository defines the contract for data persistence.
type Repository interface {
	Save(ctx context.Context, data []byte) error
	Get(ctx context.Context, id string) ([]byte, error)
}
```

---

## Three Method Interface (Maximum)

```go
package ports

import "context"

// Repository defines the contract for full CRUD operations.
type Repository interface {
	Get(ctx context.Context, id string) ([]byte, error)
	Save(ctx context.Context, data []byte) error
	Delete(ctx context.Context, id string) error
}
```

---

## Repository Interface

```go
package ports

import (
	"context"
	"myapp/internal/modules/users/models"
)

// UserRepository defines the contract for user persistence.
type UserRepository interface {
	// Get retrieves a user by ID.
	Get(ctx context.Context, id string) (*models.User, error)

	// Save persists a user (create or update).
	Save(ctx context.Context, u *models.User) error

	// Delete removes a user.
	Delete(ctx context.Context, id string) error
}
```

---

## External Service Interface

```go
package ports

import "context"

// EmailSender defines the contract for sending emails.
type EmailSender interface {
	// Send delivers an email to the recipient.
	Send(ctx context.Context, to, subject, body string) error
}
```

---

## Payment Provider Interface

```go
package ports

import "context"

// PaymentProvider defines the contract for payment processing.
type PaymentProvider interface {
	// Charge processes a payment charge.
	Charge(ctx context.Context, amount int, token string) (*Transaction, error)
}

// Transaction represents a payment transaction.
type Transaction struct {
	ID        string
	Amount    int
	Status    string
	CreatedAt int64
}
```

---

## Cache Interface

```go
package ports

import "context"

// Cache defines the contract for caching operations.
type Cache interface {
	// Set stores a value in the cache.
	Set(ctx context.Context, key string, value interface{}) error

	// Get retrieves a value from the cache.
	Get(ctx context.Context, key string) (interface{}, error)

	// Delete removes a key from the cache.
	Delete(ctx context.Context, key string) error
}
```

---

## Logger Interface

```go
package ports

// Logger defines the contract for logging.
type Logger interface {
	// Error logs an error message.
	Error(msg string) error
}
```

---

## Query Builder Interface (Segregated)

```go
package ports

import "context"

// QueryBuilder defines the contract for building database queries.
type QueryBuilder interface {
	// Query executes a SELECT query.
	Query(ctx context.Context, sql string, args ...interface{}) (interface{}, error)
}

// Executor defines the contract for executing mutations.
type Executor interface {
	// Exec executes an INSERT, UPDATE, or DELETE query.
	Exec(ctx context.Context, sql string, args ...interface{}) error
}
```

---

## Database Transaction Interface

```go
package ports

import "context"

// Transactor defines the contract for database transactions.
type Transactor interface {
	// Begin starts a transaction.
	Begin(ctx context.Context) (Transaction, error)
}

// Transaction represents a database transaction.
type Transaction interface {
	// Commit persists the transaction.
	Commit(ctx context.Context) error

	// Rollback reverts the transaction.
	Rollback(ctx context.Context) error
}
```

---

## Composition: Multiple Small Interfaces

```go
package ports

import "context"

// Reader defines the read contract.
type Reader interface {
	Get(ctx context.Context, id string) (interface{}, error)
}

// Writer defines the write contract.
type Writer interface {
	Save(ctx context.Context, data interface{}) error
}

// Repository composes Read and Write.
type Repository interface {
	Reader
	Writer
}

// Usage:
type UserService struct {
	repo Repository  // Automatically satisfies Reader and Writer
}

func (s *UserService) GetUser(ctx context.Context, id string) {
	s.repo.Get(ctx, id)  // From Reader
}

func (s *UserService) SaveUser(ctx context.Context, data interface{}) {
	s.repo.Save(ctx, data)  // From Writer
}
```

---

## Interface with Custom Types

```go
package ports

import (
	"context"
	"myapp/internal/modules/orders/models"
)

// OrderService defines the contract for order operations.
type OrderService interface {
	// CreateOrder creates a new order.
	CreateOrder(ctx context.Context, order *models.Order) (*models.Order, error)

	// GetOrder retrieves an order by ID.
	GetOrder(ctx context.Context, id string) (*models.Order, error)
}
```

---

## Rule: Accept Interface, Return Struct

When designing function signatures:

```go
// ✅ GOOD: Accept interface, return concrete struct
func ProcessPayment(provider PaymentProvider, amount int) (*Transaction, error) {
	return provider.Charge(context.Background(), amount, "token")
}

// ❌ BAD: Accept concrete type
func ProcessPayment(provider *StripeProvider, amount int) error {
	// Locked to Stripe - not extensible
}

// ❌ BAD: Return interface
func CreateUser() UserInterface {
	return &User{}  // Forces clients to work with interface
}
```

---

## Checklist

- [ ] Located in `internal/modules/[feature]/ports/` only
- [ ] Maximum 3 methods per interface
- [ ] Godoc comment on interface and each method
- [ ] Context as first parameter (when applicable)
- [ ] Error as last return value
- [ ] Method names descriptive and short
- [ ] No unexported (private) interfaces
- [ ] Never implements in the same file
- [ ] One interface per file (or closely related composition)
- [ ] < 30 lines maximum
