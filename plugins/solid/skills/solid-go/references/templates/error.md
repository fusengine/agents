---
name: error
description: Custom error types template - Sentinel errors, error types, error wrapping
when-to-use: defining domain errors, error handling strategy, sentinel error patterns, error type assertions
keywords: error, sentinel errors, error types, error wrapping, error handling, Go idiom
---

# Error Template

## Location

**File**: `internal/modules/[feature]/models/errors.go`

---

## Sentinel Errors (Simple)

```go
package models

import "errors"

var (
	// ErrNotFound indicates the resource was not found.
	ErrNotFound = errors.New("resource not found")

	// ErrAlreadyExists indicates the resource already exists.
	ErrAlreadyExists = errors.New("resource already exists")

	// ErrInvalid indicates invalid input.
	ErrInvalid = errors.New("invalid input")

	// ErrUnauthorized indicates missing authorization.
	ErrUnauthorized = errors.New("unauthorized")
)
```

### Usage

```go
func (r *Repository) Get(ctx context.Context, id string) (*User, error) {
	user, err := r.db.Query(id)
	if err == sql.ErrNoRows {
		return nil, ErrNotFound
	}
	return user, err
}

// Client code
user, err := repo.Get(ctx, "123")
if err != nil {
	if errors.Is(err, models.ErrNotFound) {
		// Handle not found
	}
}
```

---

## Custom Error Types

```go
package models

import "fmt"

// ValidationError represents a validation failure.
type ValidationError struct {
	Field   string
	Message string
}

// Error implements error interface.
func (e *ValidationError) Error() string {
	return fmt.Sprintf("validation error on field %s: %s", e.Field, e.Message)
}

// Usage
func ValidateEmail(email string) error {
	if email == "" {
		return &ValidationError{
			Field:   "email",
			Message: "email is required",
		}
	}
	return nil
}

// Client code
err := ValidateEmail("")
if err != nil {
	var valErr *ValidationError
	if errors.As(err, &valErr) {
		fmt.Printf("Validation failed on %s: %s\n", valErr.Field, valErr.Message)
	}
}
```

---

## Error with Context

```go
package models

import "fmt"

// OperationError represents an operation failure with context.
type OperationError struct {
	Op  string // Operation that failed (e.g., "Save", "Delete")
	Err error  // Underlying error
}

// Error implements error interface.
func (e *OperationError) Error() string {
	return fmt.Sprintf("operation %s failed: %v", e.Op, e.Err)
}

// Unwrap allows errors.Is and errors.As to work.
func (e *OperationError) Unwrap() error {
	return e.Err
}

// Usage
func (r *Repository) Save(ctx context.Context, u *User) error {
	err := r.db.Insert(u)
	if err != nil {
		return &OperationError{
			Op:  "Save",
			Err: err,
		}
	}
	return nil
}

// Client code
err := repo.Save(ctx, user)
if err != nil {
	var opErr *OperationError
	if errors.As(err, &opErr) {
		fmt.Printf("Operation %s failed: %v\n", opErr.Op, opErr.Err)
	}
}
```

---

## Domain Errors with Codes

```go
package models

import "fmt"

// ErrorCode represents an error classification.
type ErrorCode string

const (
	ErrorCodeNotFound   ErrorCode = "NOT_FOUND"
	ErrorCodeInvalid    ErrorCode = "INVALID"
	ErrorCodeConflict   ErrorCode = "CONFLICT"
	ErrorCodeInternal   ErrorCode = "INTERNAL"
)

// DomainError represents a domain-specific error.
type DomainError struct {
	Code    ErrorCode
	Message string
	Details map[string]interface{}
}

// Error implements error interface.
func (e *DomainError) Error() string {
	return fmt.Sprintf("[%s] %s", e.Code, e.Message)
}

// Usage
func (s *UserService) CreateUser(ctx context.Context, email string) (*User, error) {
	if email == "" {
		return nil, &DomainError{
			Code:    ErrorCodeInvalid,
			Message: "email is required",
		}
	}

	existing, _ := s.repo.GetByEmail(ctx, email)
	if existing != nil {
		return nil, &DomainError{
			Code:    ErrorCodeConflict,
			Message: "user already exists",
			Details: map[string]interface{}{
				"email": email,
			},
		}
	}

	return &User{Email: email}, nil
}

// Client code
_, err := service.CreateUser(ctx, "test@example.com")
if err != nil {
	var domErr *DomainError
	if errors.As(err, &domErr) {
		switch domErr.Code {
		case models.ErrorCodeNotFound:
			// Handle not found
		case models.ErrorCodeConflict:
			// Handle conflict
		}
	}
}
```

---

## Sentinel Errors with Factory Functions

```go
package models

import (
	"errors"
	"fmt"
)

var (
	ErrNotFound  = errors.New("not found")
	ErrConflict  = errors.New("conflict")
	ErrInvalid   = errors.New("invalid")
)

// NotFoundError creates a not found error with message.
func NotFoundError(resource string) error {
	return fmt.Errorf("%w: %s", ErrNotFound, resource)
}

// ConflictError creates a conflict error with message.
func ConflictError(resource string) error {
	return fmt.Errorf("%w: %s", ErrConflict, resource)
}

// Usage
func (r *Repository) Get(ctx context.Context, id string) (*User, error) {
	user, err := r.db.Query(id)
	if err == sql.ErrNoRows {
		return nil, NotFoundError("user")
	}
	return user, err
}

// Client code
user, err := repo.Get(ctx, "123")
if err != nil {
	if errors.Is(err, models.ErrNotFound) {
		// Handle not found
	}
}
```

---

## Structured Logging Error

```go
package models

import "fmt"

// LoggableError wraps an error with logging fields.
type LoggableError struct {
	Err    error
	Fields map[string]interface{}
}

// Error implements error interface.
func (e *LoggableError) Error() string {
	return e.Err.Error()
}

// Unwrap allows error chain traversal.
func (e *LoggableError) Unwrap() error {
	return e.Err
}

// Usage
func (s *UserService) CreateUser(ctx context.Context, email string) (*User, error) {
	user := &User{Email: email}
	if err := s.repo.Save(ctx, user); err != nil {
		return nil, &LoggableError{
			Err: err,
			Fields: map[string]interface{}{
				"operation": "CreateUser",
				"email":     email,
				"user_id":   user.ID,
			},
		}
	}
	return user, nil
}
```

---

## Error Wrapping Best Practices

```go
package repositories

import (
	"fmt"
	"myapp/internal/modules/users/models"
)

// Wrap errors with context
func (r *Repository) Save(ctx context.Context, u *models.User) error {
	err := r.db.Insert(u)
	if err != nil {
		// ✅ GOOD: Wrap with context using %w
		return fmt.Errorf("save user %s: %w", u.ID, err)
	}
	return nil
}

// ❌ BAD: Loss of error context
func (r *Repository) Save(ctx context.Context, u *models.User) error {
	err := r.db.Insert(u)
	if err != nil {
		return err  // No context
	}
	return nil
}

// ❌ BAD: Error string concatenation (loses error chain)
func (r *Repository) Save(ctx context.Context, u *models.User) error {
	err := r.db.Insert(u)
	if err != nil {
		return errors.New(fmt.Sprintf("save failed: %v", err))
	}
	return nil
}
```

---

## Complete Error Module

```go
package models

import (
	"errors"
	"fmt"
)

// Sentinel Errors
var (
	ErrNotFound    = errors.New("not found")
	ErrInvalid     = errors.New("invalid")
	ErrUnauthorized = errors.New("unauthorized")
)

// ValidationError represents validation failure.
type ValidationError struct {
	Field   string
	Message string
}

func (e *ValidationError) Error() string {
	return fmt.Sprintf("validation error on field %s: %s", e.Field, e.Message)
}

// DomainError represents domain-specific failure.
type DomainError struct {
	Code    string                 // e.g., "NOT_FOUND", "CONFLICT"
	Message string
	Details map[string]interface{}
}

func (e *DomainError) Error() string {
	return fmt.Sprintf("[%s] %s", e.Code, e.Message)
}

// Factory functions
func ValidationFailed(field, message string) error {
	return &ValidationError{Field: field, Message: message}
}

func NotFoundError(resource string) error {
	return fmt.Errorf("%w: %s", ErrNotFound, resource)
}

func DomainErrorWithCode(code, message string) error {
	return &DomainError{Code: code, Message: message, Details: make(map[string]interface{})}
}
```

---

## Checklist

- [ ] Sentinel errors defined in models package
- [ ] Custom error types implement error interface
- [ ] Error unwrapping supported (Unwrap method)
- [ ] Wrapped errors use `fmt.Errorf(...%w...)`
- [ ] Domain errors have codes/classifications
- [ ] Validation errors have field information
- [ ] No error string concatenation (use %w)
- [ ] Errors include context (operation, resource)
- [ ] Godoc on error types and factory functions
- [ ] Client code uses errors.Is() or errors.As()
