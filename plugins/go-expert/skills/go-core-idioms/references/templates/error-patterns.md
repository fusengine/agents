---
name: error-patterns
description: Complete, copy-paste error-handling package — sentinels, typed errors, wrapping, Join, Is/AsType
keywords: template, error, sentinel, errors.Join, errors.AsType, wrapping
---

# Template: Package Error Strategy

Complete example for Go 1.26. Sentinels for identity, typed errors for data,
`%w` wrapping on the way up, `errors.Join` for aggregation, `errors.AsType` for
type-safe inspection.

```go
package user

import (
	"context"
	"errors"
	"fmt"
)

// Sentinel errors: callers match with errors.Is.
var (
	ErrNotFound = errors.New("user not found")
	ErrConflict = errors.New("user already exists")
)

// ValidationError is a typed error: callers read its fields via errors.AsType.
type ValidationError struct {
	Field  string
	Reason string
}

func (e *ValidationError) Error() string {
	return fmt.Sprintf("validation: %s: %s", e.Field, e.Reason)
}

// Validate aggregates every field failure into a single error via errors.Join.
// The result reports errors.Is/AsType true against any joined member.
func (u *User) Validate() error {
	var errs error
	if u.Name == "" {
		errs = errors.Join(errs, &ValidationError{"name", "required"})
	}
	if u.Age < 0 {
		errs = errors.Join(errs, &ValidationError{"age", "must be >= 0"})
	}
	return errs // nil when all args were nil
}

type Repository interface {
	Insert(ctx context.Context, u *User) error
}

// Create wraps lower-level errors with %w so the chain stays inspectable,
// adding context the caller does not already have.
func Create(ctx context.Context, repo Repository, u *User) error {
	if err := u.Validate(); err != nil {
		return fmt.Errorf("create user %q: %w", u.Name, err)
	}
	if err := repo.Insert(ctx, u); err != nil {
		return fmt.Errorf("create user %q: %w", u.Name, err)
	}
	return nil
}
```

## Caller side

```go
func handle(ctx context.Context, repo user.Repository, u *user.User) {
	err := user.Create(ctx, repo, u)
	switch {
	case err == nil:
		return
	case errors.Is(err, user.ErrConflict):
		respond(409, "already exists")
	default:
		// Go 1.26: type-safe generic replacement for errors.As.
		if ve, ok := errors.AsType[*user.ValidationError](err); ok {
			respond(422, ve.Field+": "+ve.Reason)
			return
		}
		respond(500, "internal error")
	}
}
```
