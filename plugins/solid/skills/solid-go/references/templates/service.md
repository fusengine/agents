---
name: service
description: Service template - Business logic service with interface dependencies, copy-paste ready
when-to-use: creating business logic layer, implementing service with multiple dependencies, orchestration logic
keywords: service, business logic, template, constructor injection, dependencies
---

# Service Template

## Basic Service (Single Dependency)

```go
package services

import (
	"context"
	"fmt"

	"myapp/internal/modules/users/models"
	"myapp/internal/modules/users/ports"
)

// UserService handles user business logic.
type UserService struct {
	repo ports.UserRepository
}

// NewUserService creates a new user service.
func NewUserService(repo ports.UserRepository) *UserService {
	return &UserService{repo: repo}
}

// CreateUser creates a new user with validation.
func (s *UserService) CreateUser(ctx context.Context, email string) (*models.User, error) {
	if err := validateEmail(email); err != nil {
		return nil, fmt.Errorf("invalid email: %w", err)
	}

	user := &models.User{Email: email}
	if err := s.repo.Save(ctx, user); err != nil {
		return nil, fmt.Errorf("save failed: %w", err)
	}

	return user, nil
}

// GetUser retrieves a user by ID.
func (s *UserService) GetUser(ctx context.Context, id string) (*models.User, error) {
	return s.repo.Get(ctx, id)
}

// validateEmail checks email format.
func validateEmail(email string) error {
	if email == "" {
		return models.ErrInvalidEmail
	}
	// Add email validation logic
	return nil
}
```

---

## Service with Multiple Dependencies

```go
package services

import (
	"context"
	"fmt"

	"myapp/internal/core/ports"
	"myapp/internal/modules/users/models"
	userports "myapp/internal/modules/users/ports"
)

// UserService handles user business logic with multiple dependencies.
type UserService struct {
	repo   userports.UserRepository
	email  ports.EmailSender
	logger ports.Logger
}

// NewUserService creates a new user service.
func NewUserService(
	repo userports.UserRepository,
	email ports.EmailSender,
	logger ports.Logger,
) *UserService {
	return &UserService{
		repo:   repo,
		email:  email,
		logger: logger,
	}
}

// CreateUser creates a new user and sends welcome email.
func (s *UserService) CreateUser(ctx context.Context, email string) (*models.User, error) {
	if err := validateEmail(email); err != nil {
		s.logger.Error(fmt.Sprintf("invalid email: %s", email))
		return nil, fmt.Errorf("invalid email: %w", err)
	}

	user := &models.User{Email: email}
	if err := s.repo.Save(ctx, user); err != nil {
		s.logger.Error(fmt.Sprintf("save failed: %v", err))
		return nil, fmt.Errorf("save failed: %w", err)
	}

	// Send welcome email asynchronously
	go func() {
		err := s.email.Send(ctx, email, "Welcome", "Thanks for signing up!")
		if err != nil {
			s.logger.Error(fmt.Sprintf("email send failed: %v", err))
		}
	}()

	return user, nil
}

// validateEmail checks email format.
func validateEmail(email string) error {
	if email == "" {
		return models.ErrInvalidEmail
	}
	return nil
}
```

---

## Service with Config Struct (Many Dependencies)

```go
package services

import (
	"context"
	"fmt"

	"myapp/internal/core/ports"
	"myapp/internal/modules/orders/models"
	orderports "myapp/internal/modules/orders/ports"
)

// OrderServiceConfig groups dependencies.
type OrderServiceConfig struct {
	Repository      orderports.OrderRepository
	PaymentProvider orderports.PaymentProvider
	EmailSender     ports.EmailSender
	Logger          ports.Logger
	Cache           ports.Cache
}

// OrderService handles order business logic.
type OrderService struct {
	cfg *OrderServiceConfig
}

// NewOrderService creates a new order service.
func NewOrderService(cfg *OrderServiceConfig) *OrderService {
	return &OrderService{cfg: cfg}
}

// CreateOrder creates and processes an order.
func (s *OrderService) CreateOrder(
	ctx context.Context,
	userID string,
	items []*models.Item,
) (*models.Order, error) {
	// Validate items
	if len(items) == 0 {
		s.cfg.Logger.Error("empty order items")
		return nil, models.ErrEmptyOrder
	}

	// Calculate total
	total := 0
	for _, item := range items {
		total += item.Price * item.Quantity
	}

	// Create order
	order := &models.Order{
		UserID: userID,
		Items:  items,
		Total:  total,
	}

	// Save to database
	if err := s.cfg.Repository.Save(ctx, order); err != nil {
		s.cfg.Logger.Error(fmt.Sprintf("save order failed: %v", err))
		return nil, fmt.Errorf("save failed: %w", err)
	}

	// Cache order
	_ = s.cfg.Cache.Set(ctx, fmt.Sprintf("order:%s", order.ID), order)

	// Send confirmation email
	_ = s.cfg.EmailSender.Send(
		ctx,
		userID,
		"Order Confirmation",
		fmt.Sprintf("Your order total: $%d", total))

	return order, nil
}
```

---

## Service with Domain Methods

```go
package services

import (
	"context"
	"fmt"

	"myapp/internal/modules/users/models"
	"myapp/internal/modules/users/ports"
)

// UserService with advanced features.
type UserService struct {
	repo ports.UserRepository
}

// NewUserService creates a new user service.
func NewUserService(repo ports.UserRepository) *UserService {
	return &UserService{repo: repo}
}

// ActivateUser activates a user account.
func (s *UserService) ActivateUser(ctx context.Context, id string) (*models.User, error) {
	user, err := s.repo.Get(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("get failed: %w", err)
	}

	// Use domain method
	if err := user.Activate(); err != nil {
		return nil, fmt.Errorf("activate failed: %w", err)
	}

	if err := s.repo.Save(ctx, user); err != nil {
		return nil, fmt.Errorf("save failed: %w", err)
	}

	return user, nil
}

// SuspendUser suspends a user account.
func (s *UserService) SuspendUser(ctx context.Context, id, reason string) (*models.User, error) {
	user, err := s.repo.Get(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("get failed: %w", err)
	}

	// Use domain method
	if err := user.Suspend(reason); err != nil {
		return nil, fmt.Errorf("suspend failed: %w", err)
	}

	if err := s.repo.Save(ctx, user); err != nil {
		return nil, fmt.Errorf("save failed: %w", err)
	}

	return user, nil
}
```

---

## Best Practices

### Constructor Returns Pointer
```go
func NewUserService(repo UserRepository) *UserService {
	return &UserService{repo: repo}
}
```

### Receiver is Pointer
```go
func (s *UserService) CreateUser(ctx context.Context, email string) error {
	// Receiver is pointer
}
```

### Context as First Parameter
```go
func (s *UserService) CreateUser(ctx context.Context, email string) error {
	// ctx is first parameter after receiver
}
```

### Error Wrapping with %w
```go
if err := s.repo.Save(ctx, user); err != nil {
	return nil, fmt.Errorf("save failed: %w", err)  // Use %w
}
```

### Dependency Injection via Constructor
```go
// Inject in constructor
func NewUserService(repo UserRepository) *UserService {
	return &UserService{repo: repo}
}

// Never:
// var globalRepo UserRepository  // ❌ Global state
// func init() { globalRepo = NewRepo() }  // ❌ init() for wiring
```

---

## Checklist

- [ ] Constructor function `New[Service]`
- [ ] All dependencies as interface parameters
- [ ] Service struct fields are interfaces
- [ ] Receiver is pointer `(s *UserService)`
- [ ] Context as first parameter (after receiver)
- [ ] Error wrapping with `fmt.Errorf(...%w...)`
- [ ] No global state or `init()` functions
- [ ] Business logic only (no HTTP, no DB)
- [ ] All exported functions documented
- [ ] File < 100 lines
