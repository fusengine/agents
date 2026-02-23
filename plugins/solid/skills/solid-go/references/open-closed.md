---
name: open-closed
description: Open/Closed Principle for Go - Interface-based extensibility, adding providers without modification
when-to-use: adding new payment methods, new storage backends, new notification channels, extending functionality
keywords: OCP, open-closed, extensibility, interfaces, abstraction, plugins, providers
priority: high
related: interface-segregation.md, dependency-inversion.md, templates/interface.md
---

# Open/Closed Principle (OCP)

## Core Concept

**Open for extension, closed for modification**: Add new behavior via interfaces WITHOUT changing existing code.

In Go, use **interface-based design** to achieve this:

```go
// ✅ GOOD: Interface allows extension
type PaymentProvider interface {
    Charge(ctx context.Context, amount int, token string) (*Transaction, error)
}

// Add Stripe without modifying existing code
type StripeProvider struct { /* ... */ }
func (s *StripeProvider) Charge(ctx context.Context, amount int, token string) (*Transaction, error) {
    // Stripe implementation
}

// Add PayPal without modifying existing code
type PayPalProvider struct { /* ... */ }
func (p *PayPalProvider) Charge(ctx context.Context, amount int, token string) (*Transaction, error) {
    // PayPal implementation
}
```

---

## Adding New Providers

### Step 1: Define Port Interface

Location: `internal/modules/[feature]/ports/`

```go
package ports

import "context"

type PaymentProvider interface {
    Charge(ctx context.Context, amount int, token string) (*Transaction, error)
}
```

### Step 2: Implement for New Provider

Location: `internal/modules/payments/providers/stripe.go`

```go
package providers

import "context"

type StripeProvider struct {
    apiKey string
}

func NewStripeProvider(apiKey string) *StripeProvider {
    return &StripeProvider{apiKey: apiKey}
}

func (s *StripeProvider) Charge(ctx context.Context, amount int, token string) (*Transaction, error) {
    // Stripe-specific logic
    return &Transaction{ID: "txn_123", Amount: amount}, nil
}
```

### Step 3: Inject via Constructor

Location: `internal/modules/payments/services/payment_service.go`

```go
package services

import "myapp/internal/modules/payments/ports"

type PaymentService struct {
    provider ports.PaymentProvider  // Interface - allows any provider
}

func NewPaymentService(provider ports.PaymentProvider) *PaymentService {
    return &PaymentService{provider: provider}
}

func (p *PaymentService) ProcessPayment(ctx context.Context, amount int, token string) error {
    _, err := p.provider.Charge(ctx, amount, token)
    return err
}
```

### Step 4: Wire at Main

Location: `cmd/main.go`

```go
func main() {
    // Switch providers WITHOUT changing PaymentService
    var provider ports.PaymentProvider

    if os.Getenv("PAYMENT_PROVIDER") == "paypal" {
        provider = providers.NewPayPalProvider(os.Getenv("PAYPAL_KEY"))
    } else {
        provider = providers.NewStripeProvider(os.Getenv("STRIPE_KEY"))
    }

    paymentService := services.NewPaymentService(provider)
    // paymentService works with ANY provider
}
```

---

## Real-World Examples

### Storage Backend Extension

```go
// Port: independent of implementation
type StorageBackend interface {
    Store(ctx context.Context, key string, data []byte) error
    Retrieve(ctx context.Context, key string) ([]byte, error)
}

// Add S3 without modifying existing code
type S3Backend struct { /* ... */ }

// Add LocalFS without modifying existing code
type LocalFSBackend struct { /* ... */ }

// Add Redis without modifying existing code
type RedisBackend struct { /* ... */ }

// Service works with ALL backends
type FileService struct {
    storage StorageBackend
}
```

### Notification Channel Extension

```go
type NotificationSender interface {
    Send(ctx context.Context, recipient string, message string) error
}

// Add Email, SMS, Slack, Discord - all without modifying NotificationService
type EmailSender struct { /* ... */ }
type SMSSender struct { /* ... */ }
type SlackSender struct { /* ... */ }
```

---

## Anti-Patterns & Fixes

### ❌ Closed for Extension (Type Switch Hell)
```go
// BAD: Adding new provider requires modifying this code
func ProcessPayment(ctx context.Context, provider string, amount int) error {
    switch provider {
    case "stripe":
        return chargeStripe(amount)
    case "paypal":
        return chargePayPal(amount)
    case "square":
        return chargeSquare(amount)  // Modify main code!
    default:
        return errors.New("unknown provider")
    }
}

// Adding Braintree = modify this function
```

### ✅ Open for Extension (Interface-Based)
```go
type PaymentProvider interface {
    Charge(ctx context.Context, amount int, token string) error
}

// PaymentService never needs to change when adding new providers
func (p *PaymentService) ProcessPayment(ctx context.Context, provider PaymentProvider, amount int) error {
    return provider.Charge(ctx, amount, "token")
}

// Adding Braintree = new file, zero changes to existing code
```

---

## Go Idiom: Accept Interfaces, Return Structs

**Interface in handler parameter** = Open for extension:

```go
// ✅ GOOD: Accepts ANY implementation
func (h *OrderHandler) CreateOrder(provider ports.PaymentProvider, amount int) error {
    // Works with Stripe, PayPal, Square, etc.
    return provider.Charge(context.Background(), amount, "token")
}

// ❌ BAD: Locked to concrete type
func (h *OrderHandler) CreateOrder(provider *StripeProvider, amount int) error {
    // Only works with Stripe - not extensible
}
```

---

## Modular File Organization

```
internal/modules/payments/
├── ports/
│   └── provider.go          # PaymentProvider interface
├── providers/
│   ├── stripe.go            # StripeProvider impl
│   ├── paypal.go            # PayPalProvider impl
│   └── square.go            # SquareProvider impl
├── services/
│   └── payment_service.go   # Uses PaymentProvider interface
└── handlers/
    └── orders.go            # Handler delegates to service
```

**Key**: Port (interface) is separate from implementations.

---

## Configuration-Based Wiring

```go
// Load providers dynamically from config
type Config struct {
    PaymentProvider string
    StripeKey       string
    PayPalKey       string
}

func Wire(cfg Config) *PaymentService {
    var provider ports.PaymentProvider

    switch cfg.PaymentProvider {
    case "stripe":
        provider = providers.NewStripeProvider(cfg.StripeKey)
    case "paypal":
        provider = providers.NewPayPalProvider(cfg.PayPalKey)
    }

    return services.NewPaymentService(provider)
}
```

---

## Checklist

- [ ] No type switches for provider selection (use interfaces)
- [ ] New providers can be added without modifying existing code
- [ ] Interfaces define contracts clearly (1-3 methods)
- [ ] Dependency injection via constructors
- [ ] Service accepts interfaces, never concrete types
- [ ] Each provider in separate file
- [ ] Wire at main, not scattered across codebase
