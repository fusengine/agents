---
name: handler
description: HTTP handler template - net/http or chi/echo, copy-paste ready, < 50 lines
when-to-use: creating HTTP handlers, REST endpoints, request/response handling, HTTP I/O layer
keywords: handler, HTTP, template, handler function, middleware, REST
---

# HTTP Handler Template

## Location

**File**: `internal/modules/[feature]/handlers/[action].go`

Each handler gets its own file (Create.go, Get.go, Delete.go, etc.)

---

## Basic Handler (net/http)

```go
package handlers

import (
	"encoding/json"
	"net/http"

	"myapp/internal/modules/users/services"
)

// GetRequest is the request payload.
type GetRequest struct {
	ID string `json:"id"`
}

// GetUserHandler handles GET /users/{id}.
type GetUserHandler struct {
	service *services.UserService
}

// NewGetUserHandler creates a new handler.
func NewGetUserHandler(service *services.UserService) *GetUserHandler {
	return &GetUserHandler{service: service}
}

// ServeHTTP implements http.Handler.
func (h *GetUserHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		http.Error(w, "missing id", http.StatusBadRequest)
		return
	}

	user, err := h.service.GetUser(r.Context(), id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}
```

---

## Create Handler (POST)

```go
package handlers

import (
	"encoding/json"
	"net/http"

	"myapp/internal/modules/users/services"
)

// CreateUserRequest is the request payload.
type CreateUserRequest struct {
	Email string `json:"email"`
	Name  string `json:"name"`
}

// CreateUserHandler handles POST /users.
type CreateUserHandler struct {
	service *services.UserService
}

// NewCreateUserHandler creates a new handler.
func NewCreateUserHandler(service *services.UserService) *CreateUserHandler {
	return &CreateUserHandler{service: service}
}

// ServeHTTP implements http.Handler.
func (h *CreateUserHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	var req CreateUserRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid JSON", http.StatusBadRequest)
		return
	}

	user, err := h.service.CreateUser(r.Context(), req.Email)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(user)
}
```

---

## Delete Handler

```go
package handlers

import (
	"net/http"

	"myapp/internal/modules/users/services"
)

// DeleteUserHandler handles DELETE /users/{id}.
type DeleteUserHandler struct {
	service *services.UserService
}

// NewDeleteUserHandler creates a new handler.
func NewDeleteUserHandler(service *services.UserService) *DeleteUserHandler {
	return &DeleteUserHandler{service: service}
}

// ServeHTTP implements http.Handler.
func (h *DeleteUserHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		http.Error(w, "missing id", http.StatusBadRequest)
		return
	}

	if err := h.service.DeleteUser(r.Context(), id); err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
```

---

## List Handler with Pagination

```go
package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"myapp/internal/modules/users/services"
)

// ListUsersHandler handles GET /users.
type ListUsersHandler struct {
	service *services.UserService
}

// NewListUsersHandler creates a new handler.
func NewListUsersHandler(service *services.UserService) *ListUsersHandler {
	return &ListUsersHandler{service: service}
}

// ServeHTTP implements http.Handler.
func (h *ListUsersHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	page := 1
	if p := r.URL.Query().Get("page"); p != "" {
		parsed, err := strconv.Atoi(p)
		if err != nil || parsed < 1 {
			http.Error(w, "invalid page", http.StatusBadRequest)
			return
		}
		page = parsed
	}

	users, err := h.service.ListUsers(r.Context(), page)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(users)
}
```

---

## Handler with Middleware

```go
package handlers

import (
	"encoding/json"
	"net/http"

	"myapp/internal/modules/users/services"
)

// CreateUserHandler handles POST /users.
type CreateUserHandler struct {
	service *services.UserService
}

// NewCreateUserHandler creates a new handler.
func NewCreateUserHandler(service *services.UserService) *CreateUserHandler {
	return &CreateUserHandler{service: service}
}

// ServeHTTP implements http.Handler.
func (h *CreateUserHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Email string `json:"email"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid JSON", http.StatusBadRequest)
		return
	}

	user, err := h.service.CreateUser(r.Context(), req.Email)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(user)
}

// WithAuth wraps the handler with authentication.
func WithAuth(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		token := r.Header.Get("Authorization")
		if token == "" {
			http.Error(w, "missing token", http.StatusUnauthorized)
			return
		}
		h.ServeHTTP(w, r)
	})
}

// Usage:
// mux.Handle("POST /users", WithAuth(handler))
```

---

## Handler Function Pattern (Alternative)

```go
package handlers

import (
	"encoding/json"
	"net/http"

	"myapp/internal/modules/users/services"
)

// UserHandlers groups related user handlers.
type UserHandlers struct {
	service *services.UserService
}

// NewUserHandlers creates new user handlers.
func NewUserHandlers(service *services.UserService) *UserHandlers {
	return &UserHandlers{service: service}
}

// CreateUser handles POST /users.
func (h *UserHandlers) CreateUser(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Email string `json:"email"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid JSON", http.StatusBadRequest)
		return
	}

	user, err := h.service.CreateUser(r.Context(), req.Email)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(user)
}

// GetUser handles GET /users/{id}.
func (h *UserHandlers) GetUser(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		http.Error(w, "missing id", http.StatusBadRequest)
		return
	}

	user, err := h.service.GetUser(r.Context(), id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

// Usage in main():
// handlers := NewUserHandlers(userService)
// mux.HandleFunc("POST /users", handlers.CreateUser)
// mux.HandleFunc("GET /users/{id}", handlers.GetUser)
```

---

## Error Response Helper

```go
package handlers

import (
	"encoding/json"
	"net/http"
)

// ErrorResponse formats error responses.
type ErrorResponse struct {
	Error   string `json:"error"`
	Message string `json:"message"`
}

// WriteError writes a JSON error response.
func WriteError(w http.ResponseWriter, statusCode int, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(ErrorResponse{
		Error:   http.StatusText(statusCode),
		Message: message,
	})
}

// Usage:
// WriteError(w, http.StatusBadRequest, "Invalid email")
```

---

## Best Practices

### Constructor Pattern
```go
func NewCreateUserHandler(service *services.UserService) *CreateUserHandler {
	return &CreateUserHandler{service: service}
}
```

### Implement http.Handler
```go
func (h *CreateUserHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// Handler logic
}
```

### Use r.Context()
```go
user, err := h.service.GetUser(r.Context(), id)  // Pass context
```

### One handler per file
```
handlers/
├── create.go    # CreateUserHandler
├── get.go       # GetUserHandler
├── delete.go    # DeleteUserHandler
└── handlers_test.go
```

### Maximum 50 lines
```go
// Keep handlers < 50 lines - delegate to service
```

---

## Checklist

- [ ] Constructor function `New[Action]Handler`
- [ ] Implements `http.Handler` interface
- [ ] Uses `r.Context()` for all service calls
- [ ] JSON decode with error handling
- [ ] JSON encode with Content-Type header
- [ ] Proper HTTP status codes
- [ ] Error responses formatted consistently
- [ ] One file per handler action
- [ ] < 50 lines per handler
- [ ] All exported functions documented
