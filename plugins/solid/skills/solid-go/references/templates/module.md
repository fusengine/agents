---
name: module
description: Complete module structure - Copy-paste ready Go modular architecture with all layers
when-to-use: creating new feature module, setting up feature structure, modular layout template
keywords: module, template, structure, handler, service, repository, ports, models
---

# Module Structure Template

## Directory Creation

```bash
mkdir -p internal/modules/[feature]/{handlers,services,repositories,ports,models}
```

## Complete Module Files

### 1. Port Interface

**File**: `internal/modules/[feature]/ports/repository.go`

```go
package ports

import "context"

// [Feature]Repository defines the data access contract.
type [Feature]Repository interface {
	Get(ctx context.Context, id string) (*[Model], error)
	Save(ctx context.Context, m *[Model]) error
	Delete(ctx context.Context, id string) error
}
```

### 2. Domain Model

**File**: `internal/modules/[feature]/models/model.go`

```go
package models

import "time"

// [Model] represents a domain entity.
type [Model] struct {
	ID        string
	Name      string
	CreatedAt time.Time
	UpdatedAt time.Time
}

// IsValid checks if model has required fields.
func (m *[Model]) IsValid() error {
	if m.ID == "" {
		return ErrMissingID
	}
	return nil
}
```

**File**: `internal/modules/[feature]/models/errors.go`

```go
package models

import "errors"

var (
	ErrMissingID = errors.New("missing required ID")
	ErrNotFound  = errors.New("model not found")
	ErrInvalid   = errors.New("invalid model")
)
```

### 3. Repository Implementation

**File**: `internal/modules/[feature]/repositories/postgres.go`

```go
package repositories

import (
	"context"
	"database/sql"

	"myapp/internal/modules/[feature]/models"
)

// PostgresRepository implements ports.[Feature]Repository using PostgreSQL.
type PostgresRepository struct {
	db *sql.DB
}

// NewPostgresRepository creates a new PostgreSQL repository.
func NewPostgresRepository(db *sql.DB) *PostgresRepository {
	return &PostgresRepository{db: db}
}

// Get retrieves a model by ID.
func (r *PostgresRepository) Get(ctx context.Context, id string) (*models.[Model], error) {
	row := r.db.QueryRowContext(ctx,
		"SELECT id, name, created_at, updated_at FROM [table] WHERE id = $1",
		id)

	m := &models.[Model]{}
	err := row.Scan(&m.ID, &m.Name, &m.CreatedAt, &m.UpdatedAt)
	if err == sql.ErrNoRows {
		return nil, models.ErrNotFound
	}
	return m, err
}

// Save persists a model.
func (r *PostgresRepository) Save(ctx context.Context, m *models.[Model]) error {
	if err := m.IsValid(); err != nil {
		return err
	}

	_, err := r.db.ExecContext(ctx,
		"INSERT INTO [table] (id, name, created_at, updated_at) VALUES ($1, $2, $3, $4) "+
			"ON CONFLICT (id) DO UPDATE SET name = $2, updated_at = $4",
		m.ID, m.Name, m.CreatedAt, m.UpdatedAt)
	return err
}

// Delete removes a model.
func (r *PostgresRepository) Delete(ctx context.Context, id string) error {
	result, err := r.db.ExecContext(ctx, "DELETE FROM [table] WHERE id = $1", id)
	if err != nil {
		return err
	}
	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rows == 0 {
		return models.ErrNotFound
	}
	return nil
}
```

### 4. Business Logic Service

**File**: `internal/modules/[feature]/services/[feature]_service.go`

```go
package services

import (
	"context"
	"fmt"

	"myapp/internal/modules/[feature]/models"
	"myapp/internal/modules/[feature]/ports"
)

// [Feature]Service encapsulates business logic.
type [Feature]Service struct {
	repo ports.[Feature]Repository
}

// New[Feature]Service creates a new service.
func New[Feature]Service(repo ports.[Feature]Repository) *[Feature]Service {
	return &[Feature]Service{repo: repo}
}

// Create creates a new model with business logic.
func (s *[Feature]Service) Create(ctx context.Context, name string) (*models.[Model], error) {
	if name == "" {
		return nil, models.ErrInvalid
	}

	m := &models.[Model]{
		ID:   generateID(),
		Name: name,
	}

	if err := s.repo.Save(ctx, m); err != nil {
		return nil, fmt.Errorf("save failed: %w", err)
	}

	return m, nil
}

// Get retrieves a model.
func (s *[Feature]Service) Get(ctx context.Context, id string) (*models.[Model], error) {
	return s.repo.Get(ctx, id)
}

// generateID creates a unique ID.
func generateID() string {
	// Implement ID generation (UUID, etc.)
	return ""
}
```

### 5. HTTP Handler

**File**: `internal/modules/[feature]/handlers/create.go`

```go
package handlers

import (
	"encoding/json"
	"net/http"

	"myapp/internal/modules/[feature]/services"
)

// CreateRequest is the request payload.
type CreateRequest struct {
	Name string `json:"name"`
}

// CreateHandler handles POST /[features].
type CreateHandler struct {
	service *services.[Feature]Service
}

// NewCreateHandler creates a new handler.
func NewCreateHandler(service *services.[Feature]Service) *CreateHandler {
	return &CreateHandler{service: service}
}

// ServeHTTP handles the HTTP request.
func (h *CreateHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	var req CreateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid JSON", http.StatusBadRequest)
		return
	}

	model, err := h.service.Create(r.Context(), req.Name)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(model)
}
```

**File**: `internal/modules/[feature]/handlers/get.go`

```go
package handlers

import (
	"encoding/json"
	"net/http"

	"myapp/internal/modules/[feature]/services"
)

// GetHandler handles GET /[features]/{id}.
type GetHandler struct {
	service *services.[Feature]Service
}

// NewGetHandler creates a new handler.
func NewGetHandler(service *services.[Feature]Service) *GetHandler {
	return &GetHandler{service: service}
}

// ServeHTTP handles the HTTP request.
func (h *GetHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		http.Error(w, "missing id", http.StatusBadRequest)
		return
	}

	model, err := h.service.Get(r.Context(), id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(model)
}
```

### 6. Wiring at Main

**File**: `cmd/main.go` (excerpt)

```go
package main

import (
	"database/sql"

	"myapp/internal/modules/[feature]/handlers"
	"myapp/internal/modules/[feature]/repositories"
	"myapp/internal/modules/[feature]/services"
)

func main() {
	// Setup database
	db, _ := sql.Open("postgres", "...")

	// Wire [Feature] module
	[feature]Repo := repositories.NewPostgresRepository(db)
	[feature]Service := services.New[Feature]Service([feature]Repo)
	[feature]CreateHandler := handlers.NewCreateHandler([feature]Service)
	[feature]GetHandler := handlers.NewGetHandler([feature]Service)

	// Register routes
	mux := http.NewServeMux()
	mux.Handle("POST /[features]", [feature]CreateHandler)
	mux.Handle("GET /[features]/{id}", [feature]GetHandler)

	http.ListenAndServe(":8080", mux)
}
```

---

## File Checklist

- [ ] `ports/repository.go` - Interface defined
- [ ] `models/model.go` - Domain entity
- [ ] `models/errors.go` - Error constants
- [ ] `repositories/postgres.go` - Concrete implementation
- [ ] `services/[feature]_service.go` - Business logic
- [ ] `handlers/create.go` - Create handler
- [ ] `handlers/get.go` - Get handler
- [ ] `cmd/main.go` - Wiring updated
- [ ] All files < 100 lines
- [ ] All exported functions have Godoc
