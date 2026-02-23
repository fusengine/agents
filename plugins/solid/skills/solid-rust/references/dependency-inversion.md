---
name: Dependency Inversion Principle (DIP)
description: DIP for Rust - Generic bounds, trait objects, traits in src/modules/[feature]/traits.rs
when-to-use: Decoupling high-level from low-level modules, enabling testability, supporting multiple implementations
keywords: [DIP, dependency inversion, trait objects, generic bounds, abstraction, decoupling]
priority: high
related: [interface-segregation.md, service.md, architecture-patterns.md]
---

# Dependency Inversion Principle (DIP) for Rust

## Core Concept

High-level modules should **not depend on low-level modules**. Both should depend on **abstractions** (traits). This decouples implementation details from business logic.

**High-level:** Service logic, business rules
**Low-level:** Database, external APIs, file I/O
**Abstraction:** Trait

---

## Traditional Approach (Violates DIP)

❌ **High-level depends on low-level:**
```rust
/// Low-level: PostgreSQL implementation
pub struct PgUserRepository {
    pool: PgPool,
}

impl PgUserRepository {
    pub async fn get_user(&self, id: u64) -> Result<User> {
        sqlx::query_as("SELECT * FROM users WHERE id = $1")
            .bind(id)
            .fetch_one(&self.pool)
            .await
            .map_err(|_| UserError::NotFound)
    }
}

/// High-level: Business logic depends directly on PostgreSQL
pub struct UserService {
    // PROBLEM: Directly tied to PostgreSQL
    repo: PgUserRepository,
}

impl UserService {
    pub async fn get_user(&self, id: u64) -> Result<User> {
        self.repo.get_user(id).await
    }
}
```

**Problems:**
- Can't test without database
- Can't switch to MongoDB without rewriting service
- Service tightly coupled to PostgreSQL specifics

---

## DIP Compliant: Trait Abstraction

✓ **Both depend on trait:**

```rust
/// Abstraction: Repository trait (in src/modules/user/traits.rs)
#[async_trait]
pub trait UserRepository: Send + Sync {
    /// Fetch user by ID
    async fn get_user(&self, id: u64) -> Result<User>;

    /// Save user
    async fn save(&self, user: &User) -> Result<()>;
}

/// Low-level: PostgreSQL implementation
pub struct PgUserRepository {
    pool: PgPool,
}

#[async_trait]
impl UserRepository for PgUserRepository {
    async fn get_user(&self, id: u64) -> Result<User> {
        sqlx::query_as("SELECT * FROM users WHERE id = $1")
            .bind(id)
            .fetch_one(&self.pool)
            .await
            .map_err(|_| UserError::NotFound)
    }

    async fn save(&self, user: &User) -> Result<()> {
        sqlx::query("INSERT INTO users (...) VALUES (...)")
            .execute(&self.pool)
            .await?;
        Ok(())
    }
}

/// High-level: Business logic depends on trait, NOT implementation
pub struct UserService {
    repo: Box<dyn UserRepository>,
}

impl UserService {
    pub async fn get_user(&self, id: u64) -> Result<User> {
        // Works with any UserRepository impl
        self.repo.get_user(id).await
    }

    pub async fn update_email(&self, id: u64, email: &str) -> Result<()> {
        let mut user = self.repo.get_user(id).await?;
        user.email = email.to_string();
        self.repo.save(&user).await?;
        Ok(())
    }
}
```

---

## Two Patterns: Runtime vs Compile-Time

### Pattern 1: Runtime Polymorphism (Box<dyn Trait>)

For dynamic dispatch, multiple implementations chosen at runtime:

```rust
pub struct UserService {
    repo: Box<dyn UserRepository>,
}

// Choose implementation at runtime
let pg_repo = Box::new(PgUserRepository::new(pool));
let service = UserService { repo: pg_repo };

// Or swap to mock for testing
let mock_repo = Box::new(MockUserRepository::new());
let service = UserService { repo: mock_repo };
```

**Pros:** Easy to swap, flexible
**Cons:** Dynamic dispatch overhead, less compiler help

---

### Pattern 2: Compile-Time Polymorphism (Generics)

For single known type at compile time, zero-cost abstraction:

```rust
pub struct UserService<R: UserRepository> {
    repo: R,
}

impl<R: UserRepository> UserService<R> {
    pub async fn get_user(&self, id: u64) -> Result<User> {
        self.repo.get_user(id).await
    }
}

// Type known at compile time - no runtime overhead
let repo = PgUserRepository::new(pool);
let service = UserService { repo };

// Different type = different UserService type
let mock = MockUserRepository::new();
let test_service = UserService { repo: mock };
```

**Pros:** Zero-cost, monomorphization, full compiler support
**Cons:** Requires type at compile time, may increase binary size

---

## Dependency Injection Container

```rust
/// Bootstrap module - where concrete types meet abstractions
pub struct Container {
    pub db_pool: PgPool,
}

impl Container {
    /// Create service with appropriate repository
    pub fn user_service(&self) -> Arc<UserService> {
        let repo = Box::new(PgUserRepository::new(self.db_pool.clone()));
        Arc::new(UserService { repo })
    }

    /// Create service with mock for testing
    pub fn user_service_mock() -> Arc<UserService> {
        let repo = Box::new(MockUserRepository::new());
        Arc::new(UserService { repo })
    }
}

// In main
let container = Container::new(pool).await;
let service = container.user_service();
```

---

## Testing Benefit

```rust
#[cfg(test)]
mod tests {
    use super::*;

    /// Mock implementation for testing
    pub struct MockUserRepository {
        users: Arc<Mutex<HashMap<u64, User>>>,
    }

    #[async_trait]
    impl UserRepository for MockUserRepository {
        async fn get_user(&self, id: u64) -> Result<User> {
            self.users
                .lock()
                .await
                .get(&id)
                .cloned()
                .ok_or(UserError::NotFound)
        }

        async fn save(&self, user: &User) -> Result<()> {
            self.users.lock().await.insert(user.id, user.clone());
            Ok(())
        }
    }

    #[tokio::test]
    async fn test_update_email() {
        let repo = Box::new(MockUserRepository::new());
        let service = UserService { repo };

        // Test with mock, no database needed
        let user = User {
            id: 1,
            email: "old@example.com".into(),
        };
        service.repo.save(&user).await.unwrap();

        service.update_email(1, "new@example.com").await.unwrap();

        let updated = service.repo.get_user(1).await.unwrap();
        assert_eq!(updated.email, "new@example.com");
    }
}
```

---

## Trait Placement (`src/modules/[feature]/traits.rs`)

```
src/modules/user/
├── mod.rs             # Re-exports
├── traits.rs          # Trait definitions (DIP abstractions)
│   ├── pub use traits::UserRepository
│   └── pub use traits::UserWriter
├── repository/
│   ├── mod.rs
│   ├── pg.rs          # PostgreSQL impl
│   └── mock.rs        # Mock impl
├── service.rs         # Business logic (uses traits)
└── handler.rs         # HTTP handlers
```

**Why `traits.rs`?**
- Traits are abstractions, not implementations
- Separate from concrete implementations
- Easy to find all abstractions in module
- Prevents circular dependencies

---

## Configuration-Driven DIP

```rust
pub enum DatabaseBackend {
    Postgres,
    Sqlite,
    Mock,
}

pub fn create_user_repository(
    backend: DatabaseBackend,
    config: &Config,
) -> Box<dyn UserRepository> {
    match backend {
        DatabaseBackend::Postgres => {
            let pool = sqlx::postgres::create_pool(config);
            Box::new(PgUserRepository::new(pool))
        }
        DatabaseBackend::Sqlite => {
            let pool = sqlx::sqlite::create_pool(config);
            Box::new(SqliteUserRepository::new(pool))
        }
        DatabaseBackend::Mock => {
            Box::new(MockUserRepository::new())
        }
    }
}

// Usage - environment determines impl, not code
let db = std::env::var("DATABASE").unwrap_or("postgres".into());
let backend = match db.as_str() {
    "sqlite" => DatabaseBackend::Sqlite,
    "mock" => DatabaseBackend::Mock,
    _ => DatabaseBackend::Postgres,
};

let repo = create_user_repository(backend, &config);
let service = UserService {
    repo: Box::new(repo),
};
```

---

## Rust-Specific Advantages

1. **Ownership:** Trait objects clarify who owns the dependency
2. **Result<T,E>:** Error types tied to trait, enforces handling
3. **Async traits:** `#[async_trait]` enables async abstraction
4. **Generic bounds:** `where T: Trait` is explicit dependency
5. **Associated types:** Traits can specify return types without boxing

---

## Anti-Pattern: Concrete Dependencies

❌ **Direct concrete type dependency:**
```rust
pub struct UserService {
    repo: PgUserRepository,  // Tied to PostgreSQL
}

// Hard to test, hard to swap
```

✓ **Trait dependency:**
```rust
pub struct UserService {
    repo: Box<dyn UserRepository>,  // Implementation-independent
}

// Easy to swap, testable
```

---

## Anti-Pattern: God Container

❌ **Everything in one place:**
```rust
pub struct Container {
    db: PgPool,
    cache: Redis,
    config: Config,
    // 50 fields...
}
```

✓ **Scoped containers:**
```rust
pub struct UserContainer {
    repo: Box<dyn UserRepository>,
}

pub struct OrderContainer {
    repo: Box<dyn OrderRepository>,
}
```

Easier to manage, follow SRP.
