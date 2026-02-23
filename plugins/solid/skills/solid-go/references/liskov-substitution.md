---
name: liskov-substitution
description: Liskov Substitution Principle for Go - Implicit interface compliance, contract tests, behavioral compatibility
when-to-use: validating interface implementations, ensuring contract compliance, testing implementations
keywords: LSP, Liskov substitution, interface compliance, contract tests, behavioral compatibility, implicit interfaces
priority: high
related: interface-segregation.md, open-closed.md, templates/test.md, templates/interface.md
---

# Liskov Substitution Principle (LSP)

## Core Concept

**Any implementation of an interface must be substitutable for another** - clients should work with ANY implementation without behavior changes.

In Go, interfaces are **implicit** (no `implements` keyword). Ensure all implementations honor the contract:

```go
// ✅ GOOD: Stripe and PayPal are drop-in replacements
type PaymentProvider interface {
    Charge(ctx context.Context, amount int, token string) (*Transaction, error)
}

// Both honor the contract identically
provider := getPaymentProvider()  // Could be Stripe or PayPal
result, err := provider.Charge(ctx, 1000, token)  // Works the same way
```

---

## Contract Definition

**The interface IS the contract.** Define what clients can expect:

### ❌ Broken Contract Example
```go
type Repository interface {
    GetUser(ctx context.Context, id string) (*User, error)
}

// ✅ PostgresRepository honors contract
func (r *PostgresRepository) GetUser(ctx context.Context, id string) (*User, error) {
    // Respects timeout via context
    // Returns nil + error on not found
    // Returns user on success
}

// ❌ MockRepository violates contract
func (r *MockRepository) GetUser(ctx context.Context, id string) (*User, error) {
    // IGNORES context - hangs!
    time.Sleep(10 * time.Second)  // VIOLATES contract
    return &User{}, nil
}
```

### ✅ Contract Honored
```go
type Repository interface {
    GetUser(ctx context.Context, id string) (*User, error)
}

// PostgresRepository: respects contract
func (r *PostgresRepository) GetUser(ctx context.Context, id string) (*User, error) {
    // Uses context for cancellation
    result := r.db.WithContext(ctx).First(&User{}, "id = ?", id)
    if result.Error == gorm.ErrRecordNotFound {
        return nil, ErrUserNotFound
    }
    return &User{}, result.Error
}

// MemoryRepository: also respects contract
func (r *MemoryRepository) GetUser(ctx context.Context, id string) (*User, error) {
    select {
    case <-ctx.Done():
        return nil, ctx.Err()  // Respects cancellation
    default:
    }
    if user, exists := r.users[id]; exists {
        return user, nil
    }
    return nil, ErrUserNotFound
}
```

---

## Contract Testing (CRITICAL)

Use **table-driven contract tests** to validate all implementations:

### Location
`internal/modules/users/repositories/contract_test.go`

### Pattern
```go
package repositories

import (
    "context"
    "testing"
)

// RepositoryContract validates any Repository implementation
func TestRepositoryContract(t *testing.T) {
    tests := []struct {
        name string
        repo Repository
    }{
        {"PostgreSQL", NewPostgresRepository(postgresDB)},
        {"Memory", NewMemoryRepository()},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            testGetUserNotFound(t, tt.repo)
            testGetUserSuccess(t, tt.repo)
            testGetUserContextCancellation(t, tt.repo)
        })
    }
}

// Shared contract tests
func testGetUserNotFound(t *testing.T, repo Repository) {
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()

    _, err := repo.GetUser(ctx, "nonexistent")
    if err != ErrUserNotFound {
        t.Fatalf("Expected ErrUserNotFound, got %v", err)
    }
}

func testGetUserSuccess(t *testing.T, repo Repository) {
    ctx := context.Background()

    // Setup
    user := &User{ID: "123", Email: "test@example.com"}
    repo.Save(ctx, user)

    // Test
    result, err := repo.GetUser(ctx, "123")
    if err != nil {
        t.Fatalf("Unexpected error: %v", err)
    }
    if result.Email != "test@example.com" {
        t.Fatalf("Expected email test@example.com, got %s", result.Email)
    }
}

func testGetUserContextCancellation(t *testing.T, repo Repository) {
    ctx, cancel := context.WithCancel(context.Background())
    cancel()  // Cancel immediately

    _, err := repo.GetUser(ctx, "123")
    if err != context.Canceled {
        t.Fatalf("Expected context.Canceled, got %v", err)
    }
}
```

---

## Common LSP Violations in Go

### ❌ Ignoring Context Deadline
```go
// BAD: Ignores context timeout
func (r *BadRepository) GetUser(ctx context.Context, id string) (*User, error) {
    time.Sleep(30 * time.Second)  // VIOLATES contract!
    return &User{}, nil
}

// ✅ GOOD: Respects context
func (r *GoodRepository) GetUser(ctx context.Context, id string) (*User, error) {
    select {
    case <-ctx.Done():
        return nil, ctx.Err()
    default:
    }
    // Proceed with timeout awareness
}
```

### ❌ Changing Error Semantics
```go
type Logger interface {
    Log(msg string) error
}

// BAD: Returns error on success
func (l *BadLogger) Log(msg string) error {
    fmt.Println(msg)
    return errors.New("logged")  // Violates contract!
}

// ✅ GOOD: Returns error only on failure
func (l *GoodLogger) Log(msg string) error {
    _, err := fmt.Println(msg)
    return err
}
```

### ❌ Silent Failures
```go
type Cache interface {
    Set(ctx context.Context, key string, val []byte) error
}

// BAD: Silently fails
func (c *BadCache) Set(ctx context.Context, key string, val []byte) error {
    go func() {
        c.data[key] = val  // Goroutine might not complete
    }()
    return nil  // Always returns success!
}

// ✅ GOOD: Reports actual status
func (c *GoodCache) Set(ctx context.Context, key string, val []byte) error {
    select {
    case <-ctx.Done():
        return ctx.Err()
    case c.queue <- Item{key, val}:
        return nil
    default:
        return errors.New("queue full")
    }
}
```

---

## Validation Checklist

When implementing an interface:

- [ ] **Respect context**: Honor context.Done() and timeouts
- [ ] **Error semantics**: Return errors only on actual failure
- [ ] **Nil handling**: Treat nil same way as reference implementation
- [ ] **Concurrency**: Thread-safe like interface implies
- [ ] **Side effects**: No unexpected global state changes
- [ ] **Performance**: No 10x slower than expected (document if slower)
- [ ] **Recovery**: Don't panic - return error instead

---

## Implicit Interface Compliance

Go has **implicit interface compliance** - if your struct implements all methods, it satisfies the interface:

```go
// No "implements" keyword needed
type PaymentProvider interface {
    Charge(ctx context.Context, amount int, token string) error
}

// ✅ Automatically satisfies PaymentProvider
type StripeProvider struct {
    apiKey string
}

func (s *StripeProvider) Charge(ctx context.Context, amount int, token string) error {
    // Implementation
}

// Proof: Can be assigned to interface variable
var provider PaymentProvider = &StripeProvider{}
```

**This means**: Check method signatures carefully - small signature differences break LSP:

```go
// ❌ BREAKS LSP: Different signature
func (s *BadStripe) Charge(amount int) error {  // Missing ctx!
    return nil
}

// ✅ Matches interface
func (s *GoodStripe) Charge(ctx context.Context, amount int, token string) error {
    return nil
}
```

---

## Checklist

- [ ] All implementations honor interface contract exactly
- [ ] Context timeouts/cancellation respected
- [ ] Error handling consistent across implementations
- [ ] No nil reference surprises
- [ ] Contract tests validate all implementations
- [ ] Performance documented if slower than expected
- [ ] Implicit interface compliance verified (compile-check with `-vet=interface`)
