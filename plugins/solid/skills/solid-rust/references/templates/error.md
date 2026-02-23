---
name: Custom Error Type Template
description: Error types with thiserror, conversion implementations, and HTTP responses
when-to-use: Defining custom error types for modules, error handling patterns
keywords: [error, thiserror, Error trait, custom errors, error conversion]
---

# Custom Error Type Template (thiserror)

## Basic Error Enum

```rust
//! User module errors
//!
//! Errors are part of the public API and module contract.
//! Use `thiserror` for ergonomic Display + Error implementations.

use thiserror::Error;

/// User operation errors
///
/// This enum encompasses all error cases that can occur during
/// user operations. Each variant includes relevant context.
#[derive(Error, Debug)]
pub enum UserError {
    /// User not found by ID
    #[error("User not found")]
    NotFound,

    /// Email format is invalid
    #[error("Invalid email format: {0}")]
    InvalidEmail(String),

    /// Email already registered
    #[error("Email already in use: {0}")]
    DuplicateEmail(String),

    /// Name validation failed
    #[error("Invalid name: {0}")]
    InvalidName(String),

    /// Database operation failed
    #[error("Repository error: {0}")]
    RepositoryError(String),

    /// Generic validation error
    #[error("Validation failed: {0}")]
    ValidationError(String),

    /// Conflict with existing data
    #[error("Conflict: {0}")]
    Conflict(String),

    /// Unexpected error
    #[error("Internal error: {0}")]
    InternalError(String),
}
```

---

## Conversion from External Errors

```rust
use sqlx::Error as SqlxError;

/// Convert SQLx errors to UserError
impl From<SqlxError> for UserError {
    fn from(err: SqlxError) -> Self {
        match err {
            SqlxError::RowNotFound => UserError::NotFound,
            SqlxError::ColumnNotFound(col) => {
                UserError::InternalError(format!("Column not found: {}", col))
            }
            SqlxError::Configuration(msg) => {
                UserError::InternalError(format!("Config error: {}", msg))
            }
            e => UserError::RepositoryError(e.to_string()),
        }
    }
}

/// Convert validation errors
impl From<validator::ValidationError> for UserError {
    fn from(err: validator::ValidationError) -> Self {
        UserError::ValidationError(err.to_string())
    }
}

/// Convert from parse errors
impl From<std::num::ParseIntError> for UserError {
    fn from(err: std::num::ParseIntError) -> Self {
        UserError::ValidationError(format!("Parse error: {}", err))
    }
}
```

---

## HTTP Response Conversion

```rust
use axum::{
    response::{IntoResponse, Response},
    http::StatusCode,
    Json,
};
use serde_json::json;

/// Convert UserError to HTTP response
impl IntoResponse for UserError {
    fn into_response(self) -> Response {
        let (status, error_message) = match self {
            UserError::NotFound => {
                (StatusCode::NOT_FOUND, "User not found")
            }
            UserError::InvalidEmail(ref e) => {
                (StatusCode::BAD_REQUEST, e.as_str())
            }
            UserError::DuplicateEmail(ref e) => {
                (StatusCode::CONFLICT, e.as_str())
            }
            UserError::InvalidName(ref e) => {
                (StatusCode::BAD_REQUEST, e.as_str())
            }
            UserError::ValidationError(ref e) => {
                (StatusCode::BAD_REQUEST, e.as_str())
            }
            UserError::Conflict(ref e) => {
                (StatusCode::CONFLICT, e.as_str())
            }
            UserError::RepositoryError(_) | UserError::InternalError(_) => {
                (StatusCode::INTERNAL_SERVER_ERROR, "Internal server error")
            }
        };

        let body = Json(json!({
            "error": error_message,
            "code": status.as_u16(),
        }));

        (status, body).into_response()
    }
}
```

---

## Error with Context

```rust
use std::fmt;

/// User operation error with context
#[derive(Error, Debug)]
pub enum UserErrorWithContext {
    #[error("Validation error in field '{field}': {reason}")]
    Validation { field: String, reason: String },

    #[error("Database error during {operation}: {details}")]
    Database { operation: String, details: String },

    #[error("Email '{email}' failed {reason}")]
    EmailError { email: String, reason: String },
}

impl UserErrorWithContext {
    /// Create validation error with field context
    pub fn validation(field: &str, reason: &str) -> Self {
        Self::Validation {
            field: field.to_string(),
            reason: reason.to_string(),
        }
    }

    /// Create database error with operation context
    pub fn database(operation: &str, details: &str) -> Self {
        Self::Database {
            operation: operation.to_string(),
            details: details.to_string(),
        }
    }
}

impl IntoResponse for UserErrorWithContext {
    fn into_response(self) -> Response {
        let (status, error) = match self {
            UserErrorWithContext::Validation { ref field, ref reason } => {
                (StatusCode::BAD_REQUEST, json!({
                    "error": "Validation failed",
                    "field": field,
                    "reason": reason,
                }))
            }
            UserErrorWithContext::Database { ref operation, ref details } => {
                (StatusCode::INTERNAL_SERVER_ERROR, json!({
                    "error": "Database error",
                    "operation": operation,
                    "details": details,
                }))
            }
            UserErrorWithContext::EmailError { ref email, ref reason } => {
                (StatusCode::BAD_REQUEST, json!({
                    "error": "Email error",
                    "email": email,
                    "reason": reason,
                }))
            }
        };

        (status, Json(error)).into_response()
    }
}
```

---

## Error with Backtrace

```rust
use std::backtrace::Backtrace;

/// Error with backtrace for debugging
#[derive(Error, Debug)]
pub enum UserErrorWithBacktrace {
    #[error("User not found")]
    NotFound,

    #[error("Invalid input: {0}")]
    InvalidInput(String),
}

impl UserErrorWithBacktrace {
    /// Get backtrace if available
    pub fn backtrace(&self) -> Option<&Backtrace> {
        // In Rust 1.75+, errors can capture backtraces
        None
    }
}
```

---

## Result Type Alias

```rust
/// Convenience type alias for User operation results
pub type UserResult<T> = Result<T, UserError>;

// Usage:
pub async fn get_user(id: u64) -> UserResult<User> {
    todo!()
}

pub async fn create_user(input: CreateUserInput) -> UserResult<User> {
    todo!()
}
```

---

## Nested Error Context

```rust
/// Higher-level error that wraps user errors
#[derive(Error, Debug)]
pub enum RegistrationError {
    #[error("User creation failed: {0}")]
    UserError(#[from] UserError),

    #[error("Email verification failed: {0}")]
    EmailError(String),

    #[error("Rate limited, try again later")]
    RateLimited,
}

impl IntoResponse for RegistrationError {
    fn into_response(self) -> Response {
        match self {
            Self::UserError(e) => e.into_response(),
            Self::EmailError(msg) => (
                StatusCode::BAD_REQUEST,
                Json(json!({ "error": msg })),
            ).into_response(),
            Self::RateLimited => (
                StatusCode::TOO_MANY_REQUESTS,
                Json(json!({ "error": "Rate limited" })),
            ).into_response(),
        }
    }
}
```

---

## Error Testing

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_error_display() {
        let err = UserError::NotFound;
        assert_eq!(err.to_string(), "User not found");

        let err = UserError::InvalidEmail("bad".into());
        assert_eq!(err.to_string(), "Invalid email format: bad");
    }

    #[test]
    fn test_error_conversion_from_sqlx() {
        let err: UserError = sqlx::Error::RowNotFound.into();
        assert!(matches!(err, UserError::NotFound));
    }

    #[tokio::test]
    async fn test_error_response() {
        let err = UserError::NotFound;
        let response = err.into_response();
        assert_eq!(response.status(), StatusCode::NOT_FOUND);
    }

    #[test]
    fn test_result_alias() {
        let result: UserResult<i32> = Ok(42);
        assert_eq!(result.unwrap(), 42);

        let result: UserResult<i32> = Err(UserError::NotFound);
        assert!(result.is_err());
    }
}
```

---

## Module Error Aggregator

```rust
/// All module-specific errors in one place
#[derive(Error, Debug)]
pub enum ModuleError {
    #[error(transparent)]
    User(#[from] UserError),

    #[error(transparent)]
    Email(#[from] EmailError),

    #[error(transparent)]
    Validation(#[from] ValidationError),
}

pub enum EmailError {
    #[error("Email send failed")]
    SendFailed,
}

pub enum ValidationError {
    #[error("Validation failed")]
    Failed,
}

impl IntoResponse for ModuleError {
    fn into_response(self) -> Response {
        match self {
            Self::User(e) => e.into_response(),
            Self::Email(_) => (StatusCode::INTERNAL_SERVER_ERROR, "Email error").into_response(),
            Self::Validation(e) => (StatusCode::BAD_REQUEST, e.to_string()).into_response(),
        }
    }
}
```

---

## Best Practices

1. **Use `#[from]` for automatic conversions** - Less boilerplate
2. **Include context in variants** - Don't just use strings
3. **Implement `IntoResponse`** - For Axum handlers
4. **Separate user-facing from internal** - Don't expose DB errors
5. **Use `#[error]` for Display** - Keeps messages close to types
6. **Create `Result<T>` alias** - Convention: `UserResult<T>`
7. **Document error cases** - Rustdoc on trait/function methods
8. **Test error paths** - As important as happy paths
9. **Consider error chain** - Use `anyhow` for internal errors only
10. **Don't panic** - Return Err instead (especially in async)
