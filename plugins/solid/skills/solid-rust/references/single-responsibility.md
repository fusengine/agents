---
name: Single Responsibility Principle (SRP)
description: SRP for Rust - Handler/Service/Repository separation with layer responsibilities
when-to-use: Designing modular features, splitting concerns across layers, avoiding fat structs
keywords: [SRP, single responsibility, handler, service, repository, layers, separation of concerns]
priority: high
related: [architecture-patterns.md, service.md, handler.md]
---

# Single Responsibility Principle (SRP) for Rust

## Core Concept

Each module, struct, and function should have **one reason to change**. In Rust web services, this means:

- **Handlers** - HTTP request/response handling only
- **Services** - Business logic only
- **Repositories** - Data access only
- **Models** - Domain data structure only
- **Errors** - Error definition and conversion only

---

## Layer Responsibilities Decision Tree

```
┌─ Feature needs implementation
├─ HTTP endpoint? → Handler (route, validation, response formatting)
├─ Business rule? → Service (transformation, calculation, orchestration)
├─ Database operation? → Repository (CRUD, queries)
├─ Domain entity? → Model (struct + impl blocks, no I/O)
├─ Error scenario? → Error type (thiserror enum)
└─ Multiple concerns? → SPLIT! Create separate modules
```

---

## Module Structure (`src/modules/[feature]/`)

```
src/modules/user/
├── mod.rs                 # Public API, re-exports
├── handler.rs             # HTTP endpoints
├── service.rs             # Business logic
├── repository.rs          # Database queries
├── model.rs               # Domain entities
├── error.rs               # Error types
└── traits.rs              # Trait definitions
```

---

## Handler Responsibility (1 concern: HTTP)

```rust
/// Handle GET /users/:id request
pub async fn get_user(
    Path(id): Path<u64>,
    db: Extension<Arc<Db>>,
) -> Result<Json<UserResponse>, ApiError> {
    // Responsibility: Request handling + response formatting ONLY
    let service = UserService::new(db);
    let user = service.find_by_id(id).await?;
    Ok(Json(user.into()))
}
```

**DO**: Validate request, call service, format response
**DON'T**: Business logic, database queries, transformation

---

## Service Responsibility (1 concern: Business logic)

```rust
/// User business operations
pub struct UserService {
    repo: Box<dyn UserRepository>,
}

impl UserService {
    /// Create user with validation and role assignment
    pub async fn create_user(&self, input: CreateUserInput) -> Result<User, UserError> {
        // Responsibility: Business rules ONLY
        validate_email(&input.email)?;

        let user = User {
            id: generate_id(),
            email: input.email,
            role: Role::User,  // Business rule: default role
            created_at: now(),
        };

        self.repo.save(&user).await?;
        Ok(user)
    }
}
```

**DO**: Validation, calculation, orchestration, calling repo
**DON'T**: HTTP handling, database queries, formatting

---

## Repository Responsibility (1 concern: Data access)

```rust
/// Data access abstraction
#[async_trait]
pub trait UserRepository: Send + Sync {
    /// Fetch user by ID from database
    async fn find_by_id(&self, id: u64) -> Result<User, RepositoryError>;

    /// Save user to database
    async fn save(&self, user: &User) -> Result<(), RepositoryError>;
}

/// PostgreSQL implementation
pub struct PgUserRepository {
    pool: PgPool,
}

#[async_trait]
impl UserRepository for PgUserRepository {
    async fn find_by_id(&self, id: u64) -> Result<User, RepositoryError> {
        // Responsibility: Database queries ONLY
        sqlx::query_as::<_, User>("SELECT * FROM users WHERE id = $1")
            .bind(id)
            .fetch_one(&self.pool)
            .await
            .map_err(|e| RepositoryError::NotFound)
    }
}
```

**DO**: SQL queries, connection pooling, result mapping
**DON'T**: Business logic, HTTP, formatting

---

## When SRP is Violated

❌ **Handler doing database queries:**
```rust
pub async fn get_user(Path(id): Path<u64>) -> Json<User> {
    let user = sqlx::query_as("SELECT * FROM users WHERE id = $1")
        .bind(id)
        .fetch_one(&db)
        .await
        .unwrap();
    Json(user)  // Mixed concerns: query + response
}
```

✓ **SRP compliant:**
```rust
pub async fn get_user(Path(id): Path<u64>, db: Extension<Db>) -> Result<Json<User>> {
    let service = UserService::new(db);
    let user = service.find_by_id(id).await?;
    Ok(Json(user))
}
```

❌ **Service doing HTTP validation:**
```rust
impl UserService {
    async fn create(&self, body: String) -> Result<User> {
        // Parse JSON, validate headers, etc.
        let input: CreateUserInput = serde_json::from_str(&body)?;
        // ...
    }
}
```

✓ **SRP compliant:**
```rust
impl UserService {
    async fn create(&self, input: CreateUserInput) -> Result<User> {
        // Business logic only, no HTTP concerns
        validate_email(&input.email)?;
        // ...
    }
}
```

---

## Rust-Specific Tips

1. **Use traits for abstraction** - Repository trait enables testing and swapping implementations
2. **Generic bounds** - Service accepts `trait UserRepository` not concrete type
3. **Result<T,E>** - Error handling is responsibility too; use custom error types
4. **Split early** - Extract to separate files at 90 lines (see architecture-patterns.md)
5. **impl blocks** - Keep related impl blocks together in same module, split methods across files at boundaries
