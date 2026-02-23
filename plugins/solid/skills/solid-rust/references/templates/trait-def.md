---
name: Trait Definition Template
description: Trait definition with rustdoc, contract documentation, and async support
when-to-use: Defining abstractions for repositories, services, or domain operations
keywords: [trait, abstraction, rustdoc, async_trait, contract]
---

# Trait Definition Template

## Repository Trait with Documentation

```rust
//! User repository trait - data access abstraction
//!
//! This trait defines the contract for all user data operations.
//! Implementations can use PostgreSQL, SQLite, or mocks for testing.

use async_trait::async_trait;
use crate::modules::user::model::User;
use crate::modules::user::error::UserError;

/// Repository trait for user data access
///
/// # Contract
///
/// Implementations MUST:
/// - Return `Err(UserError::NotFound)` if entity doesn't exist
/// - Support concurrent calls (implement `Send + Sync`)
/// - Be idempotent: saving same entity twice is safe
/// - Never lose data on error (fail atomically)
///
/// # Example
///
/// ```no_run
/// # use my_app::modules::user::*;
/// # let repo: Box<dyn UserRepository> = todo!();
/// let user = repo.find_by_id(1).await?;
/// println!("Found: {}", user.email);
/// # Ok::<(), Box<dyn std::error::Error>>(())
/// ```
#[async_trait]
pub trait UserRepository: Send + Sync {
    /// Fetch user by primary key
    ///
    /// # Arguments
    /// * `id` - User ID
    ///
    /// # Errors
    /// Returns `UserError::NotFound` if no user with this ID exists.
    ///
    /// # Panics
    /// Never panics; always returns `Result`
    async fn find_by_id(&self, id: u64) -> Result<User, UserError>;

    /// Save user (create or update)
    ///
    /// Upsert semantics: if ID exists, update; otherwise create.
    ///
    /// # Arguments
    /// * `user` - User entity to save
    ///
    /// # Errors
    /// Returns error if database operation fails
    ///
    /// # Idempotence
    /// Calling `save()` twice with same user is safe and idempotent
    async fn save(&self, user: &User) -> Result<(), UserError>;

    /// Delete user by ID
    ///
    /// # Arguments
    /// * `id` - User ID to delete
    ///
    /// # Errors
    /// Returns `UserError::NotFound` if user doesn't exist
    async fn delete(&self, id: u64) -> Result<(), UserError>;

    /// List users with pagination
    ///
    /// # Arguments
    /// * `limit` - Maximum number of results (recommend cap at 100)
    /// * `offset` - Number of results to skip
    ///
    /// # Returns
    /// Vector of users; empty if none match
    ///
    /// # Errors
    /// Returns error only on database failure, never on empty result
    async fn list(&self, limit: u32, offset: u32) -> Result<Vec<User>, UserError>;

    /// Count total users (optional, may return approximate for large datasets)
    ///
    /// # Errors
    /// Returns error if count operation fails
    async fn count(&self) -> Result<u64, UserError> {
        // Provide default implementation if not needed
        Ok(0)
    }
}
```

---

## Service Trait (Business Operations)

```rust
//! User service trait - business logic abstraction

use async_trait::async_trait;
use crate::modules::user::model::{CreateUserInput, User};
use crate::modules::user::error::UserError;

/// User service trait - business operations
///
/// High-level operations that apply business rules.
/// Implementations delegate to repositories for data access.
#[async_trait]
pub trait UserServiceTrait: Send + Sync {
    /// Register new user with validation
    ///
    /// # Business Rules
    /// - Email must be unique and valid
    /// - Name must be 3-99 characters
    /// - New users start with default role
    ///
    /// # Errors
    /// * `UserError::InvalidEmail` - Invalid format
    /// * `UserError::DuplicateEmail` - Already registered
    /// * `UserError::ValidationError` - Name invalid
    async fn register(&self, input: CreateUserInput) -> Result<User, UserError>;

    /// Get user profile
    async fn get_profile(&self, id: u64) -> Result<User, UserError>;
}
```

---

## Writer Trait (Mutation Operations)

```rust
//! User writer trait - mutation operations

use async_trait::async_trait;
use crate::modules::user::model::{UpdateUserInput, User};
use crate::modules::user::error::UserError;

/// User writer trait - handles mutations
///
/// Separated from reader for interface segregation.
/// Clients can depend on `UserWriter` without `UserRepository`.
#[async_trait]
pub trait UserWriter: Send + Sync {
    /// Update user profile
    ///
    /// # Arguments
    /// * `id` - User to update
    /// * `input` - Fields to update (None = no change)
    ///
    /// # Errors
    /// * `UserError::NotFound` - User doesn't exist
    /// * `UserError::ValidationError` - Input invalid
    async fn update(&self, id: u64, input: UpdateUserInput) -> Result<User, UserError>;

    /// Delete user account
    ///
    /// # Errors
    /// * `UserError::NotFound` - User doesn't exist
    async fn delete(&self, id: u64) -> Result<(), UserError>;
}
```

---

## Notification Trait (Cross-Module)

```rust
//! Notification trait for sending user notifications

use async_trait::async_trait;
use crate::modules::user::error::UserError;

/// Notification service trait
///
/// Used by multiple modules (user, order, etc.)
/// Place in `src/core/traits.rs` if cross-module.
#[async_trait]
pub trait NotificationService: Send + Sync {
    /// Send email notification
    ///
    /// # Arguments
    /// * `email` - Recipient email
    /// * `subject` - Email subject
    /// * `body` - Email body
    ///
    /// # Errors
    /// * `NotificationError::InvalidEmail` - Bad format
    /// * `NotificationError::RateLimited` - Too many requests
    /// * `NotificationError::Failed` - Send failed
    ///
    /// # Idempotence
    /// Implementations MAY support idempotent key for deduplication
    async fn send_email(
        &self,
        email: &str,
        subject: &str,
        body: &str,
    ) -> Result<String, crate::core::error::NotificationError>;

    /// Send SMS notification
    async fn send_sms(&self, phone: &str, message: &str) -> Result<String, crate::core::error::NotificationError>;
}
```

---

## Validator Trait (Single Responsibility)

```rust
//! Validator trait - isolated validation concerns

use async_trait::async_trait;
use crate::modules::user::error::UserError;

/// Email validator trait
///
/// Example of ISP: single concern, single method
/// Can have multiple implementations:
/// - Simple regex validator
/// - SMTP check validator
/// - DNS verification validator
#[async_trait]
pub trait EmailValidator: Send + Sync {
    /// Validate email address
    ///
    /// # Errors
    /// Returns error with reason if invalid
    async fn validate(&self, email: &str) -> Result<(), UserError>;
}

/// Example: SMTP validator implementation
pub struct SmtpEmailValidator {
    smtp_server: String,
}

#[async_trait]
impl EmailValidator for SmtpEmailValidator {
    async fn validate(&self, email: &str) -> Result<(), UserError> {
        // Actually verify email exists on SMTP server
        // This is async and might fail
        Ok(())
    }
}

/// Example: Simple regex validator
pub struct RegexEmailValidator;

#[async_trait]
impl EmailValidator for RegexEmailValidator {
    async fn validate(&self, email: &str) -> Result<(), UserError> {
        // Quick format check, no I/O
        if email.contains('@') && email.len() > 5 {
            Ok(())
        } else {
            Err(UserError::InvalidEmail(email.into()))
        }
    }
}
```

---

## Generic Trait (Higher-Order Abstraction)

```rust
//! Generic repository trait for multiple entity types

use async_trait::async_trait;

/// Generic repository trait for any entity type
///
/// Use `associated types` to keep Error type consistent
#[async_trait]
pub trait Repository<T>: Send + Sync
where
    T: Send + Sync,
{
    /// Error type specific to this repository
    type Error: std::error::Error;

    /// Fetch entity by ID
    async fn get(&self, id: u64) -> Result<T, Self::Error>;

    /// Save entity
    async fn save(&self, entity: &T) -> Result<(), Self::Error>;

    /// Delete entity
    async fn delete(&self, id: u64) -> Result<(), Self::Error>;
}

/// Example: Generic user repository
pub struct GenericUserRepository<T>
where
    T: Clone + Send + Sync,
{
    // Implementation
    _phantom: std::marker::PhantomData<T>,
}

impl<T> Repository<T> for GenericUserRepository<T>
where
    T: Clone + Send + Sync,
{
    type Error = crate::modules::user::error::UserError;

    async fn get(&self, id: u64) -> Result<T, Self::Error> {
        todo!()
    }

    async fn save(&self, entity: &T) -> Result<(), Self::Error> {
        todo!()
    }

    async fn delete(&self, id: u64) -> Result<(), Self::Error> {
        todo!()
    }
}
```

---

## Key Documentation Elements

1. **Top-level rustdoc** - What the trait does
2. **Contract section** - Rules implementations must follow
3. **Per-method docs** - What each method does
4. **Arguments section** - Parameter meanings
5. **Returns section** - Success case
6. **Errors section** - All possible errors
7. **Examples** - Usage code (marked `no_run` if can't verify)
8. **Idempotence** - If applicable, document behavior
9. **Panics** - Promise never to panic (async code)
10. **Safety** - If trait has unsafe impl, document

---

## Placement Convention

```
src/modules/user/
├── traits.rs                  # UserRepository, UserWriter, UserValidator
└── src/core/
    └── traits.rs              # Cross-module traits (NotificationService, Auditable)
```

Traits in `traits.rs` become the "public API" of the module. Implementations stay separate in `repository.rs`, `service.rs`, etc.
