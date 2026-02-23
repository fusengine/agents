---
name: Complete Module Structure
description: Template for a complete Rust module with mod.rs, traits, handlers, services, and repository
when-to-use: Creating new feature module, organizing code in src/modules/[feature]/
keywords: [module, mod.rs, structure, feature, organization]
---

# Complete Module Template

## Directory Structure

```
src/modules/user/
├── mod.rs
├── handler.rs
├── service.rs
├── repository.rs
├── model.rs
├── error.rs
├── traits.rs
└── tests/
    ├── mod.rs
    ├── unit.rs
    └── integration.rs
```

---

## mod.rs - Module Re-exports

```rust
/// User module - handles user creation, retrieval, and management
///
/// # Example
///
/// ```no_run
/// use my_app::modules::user::{UserService, User};
/// ```

// Public API
pub use self::handler::{create_user, get_user, update_user, delete_user};
pub use self::service::UserService;
pub use self::model::User;
pub use self::error::UserError;
pub use self::traits::UserRepository;

// Private modules
mod handler;
mod service;
mod repository;
mod model;
mod error;
mod traits;

#[cfg(test)]
mod tests;
```

---

## traits.rs - Trait Definitions

```rust
//! User module trait abstractions
//!
//! These traits define contracts for user operations,
//! enabling dependency inversion and testability.

use crate::modules::user::model::User;
use async_trait::async_trait;

/// Repository trait for user data access
#[async_trait]
pub trait UserRepository: Send + Sync {
    /// Fetch user by ID
    ///
    /// # Errors
    /// Returns `UserError::NotFound` if user doesn't exist
    async fn find_by_id(&self, id: u64) -> Result<User, crate::modules::user::error::UserError>;

    /// Save user to repository
    async fn save(&self, user: &User) -> Result<(), crate::modules::user::error::UserError>;

    /// Delete user by ID
    async fn delete(&self, id: u64) -> Result<(), crate::modules::user::error::UserError>;

    /// List all users with pagination
    async fn list(&self, limit: u32, offset: u32) -> Result<Vec<User>, crate::modules::user::error::UserError>;
}
```

---

## model.rs - Domain Entities

```rust
//! User domain models

use serde::{Deserialize, Serialize};

/// User entity
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct User {
    /// Unique identifier
    pub id: u64,
    /// Email address
    pub email: String,
    /// Display name
    pub name: String,
    /// Account creation timestamp
    pub created_at: chrono::DateTime<chrono::Utc>,
    /// Last update timestamp
    pub updated_at: chrono::DateTime<chrono::Utc>,
}

/// Request payload for creating a user
#[derive(Debug, Deserialize)]
pub struct CreateUserInput {
    pub email: String,
    pub name: String,
}

/// Request payload for updating a user
#[derive(Debug, Deserialize)]
pub struct UpdateUserInput {
    pub name: Option<String>,
    pub email: Option<String>,
}
```

---

## error.rs - Error Types

```rust
//! User module errors

use thiserror::Error;

/// User operation errors
#[derive(Error, Debug)]
pub enum UserError {
    #[error("User not found")]
    NotFound,

    #[error("Invalid email: {0}")]
    InvalidEmail(String),

    #[error("Email already in use: {0}")]
    DuplicateEmail(String),

    #[error("Repository error: {0}")]
    RepositoryError(String),

    #[error("Validation error: {0}")]
    ValidationError(String),
}

impl From<sqlx::Error> for UserError {
    fn from(err: sqlx::Error) -> Self {
        match err {
            sqlx::Error::RowNotFound => UserError::NotFound,
            e => UserError::RepositoryError(e.to_string()),
        }
    }
}
```

---

## service.rs - Business Logic

```rust
//! User service - business logic layer

use crate::modules::user::{
    model::{CreateUserInput, UpdateUserInput, User},
    error::UserError,
    traits::UserRepository,
};
use chrono::Utc;

/// User service - orchestrates user operations
pub struct UserService {
    repo: Box<dyn UserRepository>,
}

impl UserService {
    /// Create new UserService with repository
    pub fn new(repo: Box<dyn UserRepository>) -> Self {
        Self { repo }
    }

    /// Create new user with validation
    pub async fn create(&self, input: CreateUserInput) -> Result<User, UserError> {
        validate_email(&input.email)?;
        validate_name(&input.name)?;

        let user = User {
            id: generate_id(),
            email: input.email,
            name: input.name,
            created_at: Utc::now(),
            updated_at: Utc::now(),
        };

        self.repo.save(&user).await?;
        Ok(user)
    }

    /// Fetch user by ID
    pub async fn get(&self, id: u64) -> Result<User, UserError> {
        self.repo.find_by_id(id).await
    }

    /// Update user
    pub async fn update(&self, id: u64, input: UpdateUserInput) -> Result<User, UserError> {
        let mut user = self.repo.find_by_id(id).await?;

        if let Some(name) = input.name {
            validate_name(&name)?;
            user.name = name;
        }

        if let Some(email) = input.email {
            validate_email(&email)?;
            user.email = email;
        }

        user.updated_at = Utc::now();
        self.repo.save(&user).await?;
        Ok(user)
    }
}

fn generate_id() -> u64 {
    // Implementation detail - could use nanoid, uuid, etc
    rand::random()
}

fn validate_email(email: &str) -> Result<(), UserError> {
    if email.contains('@') && email.len() > 5 {
        Ok(())
    } else {
        Err(UserError::InvalidEmail(email.into()))
    }
}

fn validate_name(name: &str) -> Result<(), UserError> {
    if name.len() > 2 && name.len() < 100 {
        Ok(())
    } else {
        Err(UserError::ValidationError("Name too short or long".into()))
    }
}
```

---

## handler.rs - HTTP Handlers

```rust
//! User HTTP handlers

use axum::{
    extract::{Path, Extension, Json},
    http::StatusCode,
};
use std::sync::Arc;
use crate::modules::user::{
    UserService,
    model::{CreateUserInput, UpdateUserInput, User},
    error::UserError,
};

/// Create new user
///
/// POST /users
pub async fn create_user(
    Extension(service): Extension<Arc<UserService>>,
    Json(input): Json<CreateUserInput>,
) -> Result<(StatusCode, Json<User>), UserError> {
    let user = service.create(input).await?;
    Ok((StatusCode::CREATED, Json(user)))
}

/// Get user by ID
///
/// GET /users/:id
pub async fn get_user(
    Path(id): Path<u64>,
    Extension(service): Extension<Arc<UserService>>,
) -> Result<Json<User>, UserError> {
    let user = service.get(id).await?;
    Ok(Json(user))
}

/// Update user by ID
///
/// PUT /users/:id
pub async fn update_user(
    Path(id): Path<u64>,
    Extension(service): Extension<Arc<UserService>>,
    Json(input): Json<UpdateUserInput>,
) -> Result<Json<User>, UserError> {
    let user = service.update(id, input).await?;
    Ok(Json(user))
}

/// Delete user by ID
///
/// DELETE /users/:id
pub async fn delete_user(
    Path(id): Path<u64>,
    Extension(service): Extension<Arc<UserService>>,
) -> Result<StatusCode, UserError> {
    // Delegate to service
    Ok(StatusCode::NO_CONTENT)
}
```

---

## tests/mod.rs

```rust
//! User module tests

#[cfg(test)]
mod unit;

#[cfg(test)]
mod integration;
```

---

## tests/unit.rs - Unit Tests

```rust
//! User service unit tests

#[cfg(test)]
mod tests {
    use crate::modules::user::*;

    #[test]
    fn validate_email_accepts_valid() {
        assert!(validate_email("test@example.com").is_ok());
    }

    #[test]
    fn validate_email_rejects_invalid() {
        assert!(validate_email("invalid").is_err());
    }

    #[tokio::test]
    async fn test_create_user_with_mock() {
        let repo = Box::new(MockUserRepository::new());
        let service = UserService::new(repo);

        let input = CreateUserInput {
            email: "test@example.com".into(),
            name: "Test User".into(),
        };

        let user = service.create(input).await.unwrap();
        assert_eq!(user.email, "test@example.com");
    }
}

/// Mock repository for testing
pub struct MockUserRepository {
    users: std::sync::Arc<tokio::sync::Mutex<std::collections::HashMap<u64, User>>>,
}

impl MockUserRepository {
    pub fn new() -> Self {
        Self {
            users: std::sync::Arc::new(tokio::sync::Mutex::new(std::collections::HashMap::new())),
        }
    }
}

#[async_trait::async_trait]
impl traits::UserRepository for MockUserRepository {
    async fn find_by_id(&self, id: u64) -> Result<User, error::UserError> {
        self.users
            .lock()
            .await
            .get(&id)
            .cloned()
            .ok_or(error::UserError::NotFound)
    }

    async fn save(&self, user: &User) -> Result<(), error::UserError> {
        self.users.lock().await.insert(user.id, user.clone());
        Ok(())
    }

    async fn delete(&self, id: u64) -> Result<(), error::UserError> {
        self.users.lock().await.remove(&id);
        Ok(())
    }

    async fn list(&self, limit: u32, offset: u32) -> Result<Vec<User>, error::UserError> {
        let users = self.users.lock().await;
        Ok(users.values().skip(offset as usize).take(limit as usize).cloned().collect())
    }
}
```

---

## repository.rs - Repository Implementation

```rust
//! PostgreSQL user repository implementation

use sqlx::PgPool;
use async_trait::async_trait;
use crate::modules::user::{model::User, traits::UserRepository, error::UserError};

/// PostgreSQL user repository
pub struct PgUserRepository {
    pool: PgPool,
}

impl PgUserRepository {
    /// Create new repository
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

#[async_trait]
impl UserRepository for PgUserRepository {
    async fn find_by_id(&self, id: u64) -> Result<User, UserError> {
        sqlx::query_as::<_, User>(
            "SELECT id, email, name, created_at, updated_at FROM users WHERE id = $1"
        )
        .bind(id)
        .fetch_one(&self.pool)
        .await
        .map_err(|e| e.into())
    }

    async fn save(&self, user: &User) -> Result<(), UserError> {
        sqlx::query(
            "INSERT INTO users (id, email, name, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (id) DO UPDATE SET
             email=$2, name=$3, updated_at=$5"
        )
        .bind(user.id)
        .bind(&user.email)
        .bind(&user.name)
        .bind(user.created_at)
        .bind(user.updated_at)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    async fn delete(&self, id: u64) -> Result<(), UserError> {
        sqlx::query("DELETE FROM users WHERE id = $1")
            .bind(id)
            .execute(&self.pool)
            .await?;
        Ok(())
    }

    async fn list(&self, limit: u32, offset: u32) -> Result<Vec<User>, UserError> {
        sqlx::query_as::<_, User>(
            "SELECT id, email, name, created_at, updated_at FROM users LIMIT $1 OFFSET $2"
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(&self.pool)
        .await
        .map_err(|e| e.into())
    }
}
```
