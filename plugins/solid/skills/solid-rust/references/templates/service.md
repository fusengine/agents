---
name: Business Logic Service Template
description: Service template with trait dependency, validation, and error handling
when-to-use: Creating business logic layer for a feature, implementing domain rules
keywords: [service, business logic, trait dependency, validation]
---

# Business Logic Service Template

## Service with Trait Dependency

```rust
//! User service - business logic layer
//!
//! Coordinates between handlers and repositories,
//! applying business rules and validation.

use async_trait::async_trait;
use crate::modules::user::{
    model::{CreateUserInput, UpdateUserInput, User},
    error::UserError,
    traits::UserRepository,
};
use chrono::Utc;

/// User service - orchestrates user operations
///
/// Depends on trait abstraction, not concrete repository type.
/// This enables testing with mock and swapping implementations.
pub struct UserService {
    repo: Box<dyn UserRepository>,
}

impl UserService {
    /// Create new UserService with repository dependency
    ///
    /// # Arguments
    /// * `repo` - Repository implementation (e.g., PostgreSQL, Mock)
    ///
    /// # Example
    ///
    /// ```no_run
    /// # use my_app::modules::user::*;
    /// let repo = Box::new(MockUserRepository::new());
    /// let service = UserService::new(repo);
    /// ```
    pub fn new(repo: Box<dyn UserRepository>) -> Self {
        Self { repo }
    }

    /// Create new user with validation
    ///
    /// # Errors
    /// * `UserError::InvalidEmail` - Email doesn't meet format requirements
    /// * `UserError::ValidationError` - Name validation failed
    /// * `UserError::RepositoryError` - Database operation failed
    pub async fn create(&self, input: CreateUserInput) -> Result<User, UserError> {
        // Validation layer
        validate_email(&input.email)?;
        validate_name(&input.name)?;

        // Business rule: check for duplicates
        self.check_email_unique(&input.email).await?;

        // Domain logic: create entity
        let user = User {
            id: generate_id(),
            email: input.email,
            name: input.name,
            created_at: Utc::now(),
            updated_at: Utc::now(),
        };

        // Persistence
        self.repo.save(&user).await?;
        Ok(user)
    }

    /// Fetch user by ID
    ///
    /// # Errors
    /// * `UserError::NotFound` - User doesn't exist
    /// * `UserError::RepositoryError` - Database error
    pub async fn get(&self, id: u64) -> Result<User, UserError> {
        self.repo.find_by_id(id).await
    }

    /// Update user with partial input
    ///
    /// Only updates provided fields. Timestamps automatically updated.
    ///
    /// # Errors
    /// * `UserError::NotFound` - User doesn't exist
    /// * `UserError::ValidationError` - Invalid input
    /// * `UserError::RepositoryError` - Database error
    pub async fn update(&self, id: u64, input: UpdateUserInput) -> Result<User, UserError> {
        // Fetch existing
        let mut user = self.repo.find_by_id(id).await?;

        // Apply partial updates with validation
        if let Some(name) = input.name {
            validate_name(&name)?;
            user.name = name;
        }

        if let Some(email) = input.email {
            validate_email(&email)?;
            self.check_email_unique(&email).await?;
            user.email = email;
        }

        // Update timestamp
        user.updated_at = Utc::now();

        // Persist
        self.repo.save(&user).await?;
        Ok(user)
    }

    /// Delete user by ID
    ///
    /// # Errors
    /// * `UserError::NotFound` - User doesn't exist
    pub async fn delete(&self, id: u64) -> Result<(), UserError> {
        // Optional: check existence first
        self.repo.find_by_id(id).await?;
        self.repo.delete(id).await?;
        Ok(())
    }

    /// List users with pagination
    pub async fn list(&self, limit: u32, offset: u32) -> Result<Vec<User>, UserError> {
        // Business rule: enforce max limit
        let limit = std::cmp::min(limit, 100);
        self.repo.list(limit, offset).await
    }

    // Private helper methods

    /// Check email uniqueness (business rule)
    async fn check_email_unique(&self, email: &str) -> Result<(), UserError> {
        // Implementation would query repository to check for existing email
        Ok(())
    }
}

// Validation functions (pure, testable)

/// Validate email format
///
/// # Errors
/// Returns error if email doesn't meet basic requirements
fn validate_email(email: &str) -> Result<(), UserError> {
    if email.contains('@') && email.len() > 5 && email.len() < 256 {
        Ok(())
    } else {
        Err(UserError::InvalidEmail(email.into()))
    }
}

/// Validate user name
fn validate_name(name: &str) -> Result<(), UserError> {
    let trimmed = name.trim();
    if trimmed.len() > 2 && trimmed.len() < 100 {
        Ok(())
    } else {
        Err(UserError::ValidationError(
            "Name must be 3-99 characters".into(),
        ))
    }
}

/// Generate unique ID
///
/// In production, could use:
/// - `uuid::Uuid::new_v4()`
/// - `nanoid::nanoid!()`
/// - Database sequence
fn generate_id() -> u64 {
    use std::time::{SystemTime, UNIX_EPOCH};
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_millis() as u64
}

#[cfg(test)]
mod tests {
    use super::*;

    /// Mock repository for testing
    pub struct MockUserRepository {
        users: std::sync::Arc<tokio::sync::Mutex<std::collections::HashMap<u64, User>>>,
    }

    impl MockUserRepository {
        pub fn new() -> Self {
            Self {
                users: std::sync::Arc::new(tokio::sync::Mutex::new(
                    std::collections::HashMap::new(),
                )),
            }
        }
    }

    #[async_trait]
    impl UserRepository for MockUserRepository {
        async fn find_by_id(&self, id: u64) -> Result<User, UserError> {
            self.users
                .lock()
                .await
                .get(&id)
                .cloned()
                .ok_or(UserError::NotFound)
        }

        async fn save(&self, user: &User) -> Result<(), UserError> {
            self.users.lock().await.insert(user.id, user.clone());
            Ok(())
        }

        async fn delete(&self, id: u64) -> Result<(), UserError> {
            self.users.lock().await.remove(&id);
            Ok(())
        }

        async fn list(&self, limit: u32, offset: u32) -> Result<Vec<User>, UserError> {
            let users = self.users.lock().await;
            Ok(users
                .values()
                .skip(offset as usize)
                .take(limit as usize)
                .cloned()
                .collect())
        }
    }

    #[tokio::test]
    async fn test_create_user_success() {
        let repo = Box::new(MockUserRepository::new());
        let service = UserService::new(repo);

        let input = CreateUserInput {
            email: "test@example.com".into(),
            name: "Test User".into(),
        };

        let user = service.create(input).await.unwrap();
        assert_eq!(user.email, "test@example.com");
        assert_eq!(user.name, "Test User");
    }

    #[tokio::test]
    async fn test_create_user_invalid_email() {
        let repo = Box::new(MockUserRepository::new());
        let service = UserService::new(repo);

        let input = CreateUserInput {
            email: "invalid".into(),
            name: "Test User".into(),
        };

        assert!(service.create(input).await.is_err());
    }

    #[tokio::test]
    async fn test_create_user_invalid_name() {
        let repo = Box::new(MockUserRepository::new());
        let service = UserService::new(repo);

        let input = CreateUserInput {
            email: "test@example.com".into(),
            name: "A".into(),  // Too short
        };

        assert!(service.create(input).await.is_err());
    }

    #[tokio::test]
    async fn test_update_user() {
        let repo = Box::new(MockUserRepository::new());
        let service = UserService::new(repo);

        // Create user
        let user = service
            .create(CreateUserInput {
                email: "test@example.com".into(),
                name: "Original".into(),
            })
            .await
            .unwrap();

        // Update name only
        let updated = service
            .update(
                user.id,
                UpdateUserInput {
                    name: Some("Updated".into()),
                    email: None,
                },
            )
            .await
            .unwrap();

        assert_eq!(updated.name, "Updated");
        assert_eq!(updated.email, "test@example.com");
    }
}
```

---

## Key Patterns Shown

1. **Trait Dependency** - Constructor accepts `Box<dyn UserRepository>`
2. **Result-based Error Handling** - All methods return `Result<T, UserError>`
3. **Validation Layer** - Pure functions for testability
4. **Business Rules** - `check_email_unique()` encapsulates domain logic
5. **Async/Await** - All I/O operations are async
6. **Mock for Testing** - `MockUserRepository` implements trait
7. **Documentation** - Rustdoc on public items with examples
8. **Partial Updates** - `UpdateUserInput` with `Option<T>` fields
