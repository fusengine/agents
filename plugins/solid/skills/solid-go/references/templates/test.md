---
name: test
description: Testing template - Table-driven tests, mocks, contract testing
when-to-use: writing Go tests, mocking dependencies, table-driven test patterns, contract validation
keywords: test, testing, table-driven tests, mocks, contract tests, fixtures
---

# Testing Template

## Location

**File**: `internal/modules/[feature]/[layer]/[layer]_test.go`

Test files in same package as code being tested.

---

## Table-Driven Test (Service)

```go
package services

import (
	"context"
	"testing"

	"myapp/internal/modules/users/models"
)

// TestCreateUser tests the CreateUser service method.
func TestCreateUser(t *testing.T) {
	tests := []struct {
		name      string
		email     string
		wantError bool
		wantEmail string
	}{
		{
			name:      "valid email",
			email:     "test@example.com",
			wantError: false,
			wantEmail: "test@example.com",
		},
		{
			name:      "empty email",
			email:     "",
			wantError: true,
		},
		{
			name:      "invalid email format",
			email:     "not-an-email",
			wantError: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := NewMockUserRepository()
			service := NewUserService(repo)

			user, err := service.CreateUser(context.Background(), tt.email)

			if tt.wantError && err == nil {
				t.Errorf("expected error, got nil")
			}
			if !tt.wantError && err != nil {
				t.Errorf("unexpected error: %v", err)
			}
			if !tt.wantError && user.Email != tt.wantEmail {
				t.Errorf("expected email %s, got %s", tt.wantEmail, user.Email)
			}
		})
	}
}
```

---

## Simple Mock

```go
package services

import (
	"context"

	"myapp/internal/modules/users/models"
)

// MockUserRepository is a mock implementation of UserRepository.
type MockUserRepository struct {
	SaveFunc func(ctx context.Context, u *models.User) error
	GetFunc  func(ctx context.Context, id string) (*models.User, error)
}

// Save implements UserRepository.Save.
func (m *MockUserRepository) Save(ctx context.Context, u *models.User) error {
	if m.SaveFunc != nil {
		return m.SaveFunc(ctx, u)
	}
	return nil
}

// Get implements UserRepository.Get.
func (m *MockUserRepository) Get(ctx context.Context, id string) (*models.User, error) {
	if m.GetFunc != nil {
		return m.GetFunc(ctx, id)
	}
	return &models.User{}, nil
}

// Usage in tests:
func TestGetUser(t *testing.T) {
	repo := &MockUserRepository{
		GetFunc: func(ctx context.Context, id string) (*models.User, error) {
			return &models.User{ID: id, Email: "test@example.com"}, nil
		},
	}
	service := NewUserService(repo)
	user, _ := service.GetUser(context.Background(), "123")
	if user.ID != "123" {
		t.Errorf("expected ID 123, got %s", user.ID)
	}
}
```

---

## Contract Test (Validates All Implementations)

```go
package repositories

import (
	"context"
	"testing"
	"time"

	"myapp/internal/modules/users/models"
)

// RepositoryContract validates any Repository implementation.
type RepositoryContract func(*testing.T) Repository

// TestRepositoryContract tests all implementations.
func TestRepositoryContract(t *testing.T) {
	tests := []struct {
		name string
		repo RepositoryContract
	}{
		{"Postgres", NewPostgresRepositoryForTest},
		{"Memory", NewMemoryRepository},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := tt.repo(t)
			testSaveAndGet(t, repo)
			testNotFound(t, repo)
			testDelete(t, repo)
		})
	}
}

// Contract test: Save and Get
func testSaveAndGet(t *testing.T, repo Repository) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	user := &models.User{ID: "123", Email: "test@example.com"}
	if err := repo.Save(ctx, user); err != nil {
		t.Fatalf("Save failed: %v", err)
	}

	got, err := repo.Get(ctx, "123")
	if err != nil {
		t.Fatalf("Get failed: %v", err)
	}
	if got.Email != "test@example.com" {
		t.Errorf("expected email test@example.com, got %s", got.Email)
	}
}

// Contract test: Not Found
func testNotFound(t *testing.T, repo Repository) {
	ctx := context.Background()
	_, err := repo.Get(ctx, "nonexistent")
	if err != models.ErrNotFound {
		t.Errorf("expected ErrNotFound, got %v", err)
	}
}

// Contract test: Delete
func testDelete(t *testing.T, repo Repository) {
	ctx := context.Background()

	user := &models.User{ID: "456", Email: "delete@example.com"}
	repo.Save(ctx, user)

	if err := repo.Delete(ctx, "456"); err != nil {
		t.Fatalf("Delete failed: %v", err)
	}

	_, err := repo.Get(ctx, "456")
	if err != models.ErrNotFound {
		t.Errorf("expected ErrNotFound after delete, got %v", err)
	}
}
```

---

## Repository Test with Fixtures

```go
package repositories

import (
	"context"
	"testing"

	"myapp/internal/modules/users/models"
)

// TestPostgresRepository tests PostgreSQL repository.
func TestPostgresRepository(t *testing.T) {
	db := setupTestDB(t)
	defer db.Close()

	repo := NewPostgresRepository(db)

	t.Run("Save and Get", func(t *testing.T) {
		user := &models.User{ID: "1", Email: "test@example.com"}
		err := repo.Save(context.Background(), user)
		if err != nil {
			t.Fatalf("Save failed: %v", err)
		}

		got, err := repo.Get(context.Background(), "1")
		if err != nil {
			t.Fatalf("Get failed: %v", err)
		}
		if got.Email != "test@example.com" {
			t.Errorf("expected email test@example.com, got %s", got.Email)
		}
	})

	t.Run("Delete", func(t *testing.T) {
		user := &models.User{ID: "2", Email: "delete@example.com"}
		repo.Save(context.Background(), user)

		err := repo.Delete(context.Background(), "2")
		if err != nil {
			t.Fatalf("Delete failed: %v", err)
		}

		_, err = repo.Get(context.Background(), "2")
		if err != models.ErrNotFound {
			t.Errorf("expected ErrNotFound, got %v", err)
		}
	})
}

// setupTestDB creates a test database.
func setupTestDB(t *testing.T) *sql.DB {
	db, err := sql.Open("postgres", "postgres://localhost/test")
	if err != nil {
		t.Fatalf("Failed to connect to test DB: %v", err)
	}
	// Create test tables
	db.Exec(`
		DROP TABLE IF EXISTS users;
		CREATE TABLE users (
			id TEXT PRIMARY KEY,
			email TEXT NOT NULL
		);
	`)
	return db
}
```

---

## Handler Test with Mock Service

```go
package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"myapp/internal/modules/users/models"
	"myapp/internal/modules/users/services"
)

// MockUserService is a mock for testing handlers.
type MockUserService struct {
	CreateFunc func(ctx context.Context, email string) (*models.User, error)
}

func (m *MockUserService) CreateUser(ctx context.Context, email string) (*models.User, error) {
	return m.CreateFunc(ctx, email)
}

// TestCreateUserHandler tests the create handler.
func TestCreateUserHandler(t *testing.T) {
	tests := []struct {
		name           string
		request        CreateUserRequest
		wantStatusCode int
		wantEmail      string
	}{
		{
			name:           "valid request",
			request:        CreateUserRequest{Email: "test@example.com"},
			wantStatusCode: http.StatusCreated,
			wantEmail:      "test@example.com",
		},
		{
			name:           "empty request body",
			request:        CreateUserRequest{},
			wantStatusCode: http.StatusBadRequest,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockService := &MockUserService{
				CreateFunc: func(ctx context.Context, email string) (*models.User, error) {
					return &models.User{Email: email}, nil
				},
			}

			handler := NewCreateUserHandler(mockService)

			body, _ := json.Marshal(tt.request)
			req := httptest.NewRequest("POST", "/users", bytes.NewReader(body))
			rec := httptest.NewRecorder()

			handler.ServeHTTP(rec, req)

			if rec.Code != tt.wantStatusCode {
				t.Errorf("expected status %d, got %d", tt.wantStatusCode, rec.Code)
			}
		})
	}
}
```

---

## Error Testing

```go
package services

import (
	"context"
	"errors"
	"testing"

	"myapp/internal/modules/users/models"
)

// TestCreateUserErrors tests error cases.
func TestCreateUserErrors(t *testing.T) {
	tests := []struct {
		name    string
		email   string
		wantErr error
	}{
		{
			name:    "empty email",
			email:   "",
			wantErr: models.ErrInvalid,
		},
		{
			name:    "invalid email",
			email:   "not-an-email",
			wantErr: models.ErrInvalid,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := NewMockUserRepository()
			service := NewUserService(repo)

			_, err := service.CreateUser(context.Background(), tt.email)

			if !errors.Is(err, tt.wantErr) {
				t.Errorf("expected %v, got %v", tt.wantErr, err)
			}
		})
	}
}
```

---

## Concurrency Test

```go
package repositories

import (
	"context"
	"sync"
	"testing"

	"myapp/internal/modules/users/models"
)

// TestConcurrentSaves tests concurrent saves.
func TestConcurrentSaves(t *testing.T) {
	repo := NewMemoryRepository()
	var wg sync.WaitGroup

	for i := 0; i < 100; i++ {
		wg.Add(1)
		go func(id int) {
			defer wg.Done()
			user := &models.User{ID: fmt.Sprintf("%d", id), Email: "test@example.com"}
			repo.Save(context.Background(), user)
		}(i)
	}

	wg.Wait()

	// Verify all saves completed
	user, err := repo.Get(context.Background(), "50")
	if err != nil {
		t.Errorf("Get failed: %v", err)
	}
	if user == nil {
		t.Error("expected user, got nil")
	}
}
```

---

## Best Practices

### Use subtests (t.Run)
```go
func TestService(t *testing.T) {
	t.Run("create", func(t *testing.T) {
		// Test create
	})
	t.Run("get", func(t *testing.T) {
		// Test get
	})
}
```

### Table-driven tests
```go
tests := []struct {
	name      string
	input     string
	wantError bool
}{
	{"valid", "test", false},
	{"invalid", "", true},
}
```

### Use context.Background() or testing timeout
```go
ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
defer cancel()
```

### Mock simple interfaces
```go
type MockRepo struct {
	GetFunc func(ctx context.Context, id string) (*User, error)
}
```

### Use test helpers
```go
func setupTestDB(t *testing.T) *sql.DB {
	// Setup logic
}
```

---

## Checklist

- [ ] Test file ends with `_test.go`
- [ ] Test functions start with `Test`
- [ ] Use subtests (t.Run) for test cases
- [ ] Table-driven tests for multiple scenarios
- [ ] Mock complex dependencies
- [ ] Use errors.Is for error comparison
- [ ] Test error cases
- [ ] Test concurrency if applicable
- [ ] Use context with timeout
- [ ] Cleanup resources (defer)
- [ ] Descriptive test names
- [ ] Contract tests for implementations
