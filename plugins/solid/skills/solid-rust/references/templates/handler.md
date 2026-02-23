---
name: HTTP Handler Template
description: Axum HTTP handler template with validation, error handling, and response formatting
when-to-use: Creating HTTP endpoints, structuring request/response handling
keywords: [handler, HTTP, Axum, request, response, validation, status codes]
---

# HTTP Handler Template (Axum)

## Basic Handler Structure

```rust
//! User HTTP handlers
//!
//! Handlers coordinate between HTTP layer and business logic.
//! Responsibility: request validation, response formatting.
//! NOT responsible for business logic or data access.

use axum::{
    extract::{Path, Query, Extension, Json},
    http::StatusCode,
    response::{IntoResponse, Response},
};
use serde::Deserialize;
use std::sync::Arc;

use crate::modules::user::{
    UserService,
    model::{CreateUserInput, UpdateUserInput, User},
    error::UserError,
};

/// Create new user
///
/// `POST /users`
///
/// # Request Body
/// ```json
/// {
///   "email": "user@example.com",
///   "name": "John Doe"
/// }
/// ```
///
/// # Responses
/// - 201 Created: User created successfully
/// - 400 Bad Request: Invalid input
/// - 500 Internal Server Error: Server error
pub async fn create_user(
    Extension(service): Extension<Arc<UserService>>,
    Json(input): Json<CreateUserInput>,
) -> Result<(StatusCode, Json<User>), UserError> {
    let user = service.create(input).await?;
    Ok((StatusCode::CREATED, Json(user)))
}

/// Get user by ID
///
/// `GET /users/:id`
///
/// # Parameters
/// - `id` - User ID
///
/// # Responses
/// - 200 OK: User found
/// - 404 Not Found: User doesn't exist
pub async fn get_user(
    Path(id): Path<u64>,
    Extension(service): Extension<Arc<UserService>>,
) -> Result<Json<User>, UserError> {
    let user = service.get(id).await?;
    Ok(Json(user))
}

/// Update user
///
/// `PUT /users/:id`
///
/// # Request Body (all fields optional)
/// ```json
/// {
///   "name": "Jane Doe",
///   "email": "jane@example.com"
/// }
/// ```
pub async fn update_user(
    Path(id): Path<u64>,
    Extension(service): Extension<Arc<UserService>>,
    Json(input): Json<UpdateUserInput>,
) -> Result<Json<User>, UserError> {
    let user = service.update(id, input).await?;
    Ok(Json(user))
}

/// Delete user
///
/// `DELETE /users/:id`
///
/// # Responses
/// - 204 No Content: Deleted successfully
/// - 404 Not Found: User doesn't exist
pub async fn delete_user(
    Path(id): Path<u64>,
    Extension(service): Extension<Arc<UserService>>,
) -> Result<StatusCode, UserError> {
    service.delete(id).await?;
    Ok(StatusCode::NO_CONTENT)
}
```

---

## Handler with Query Parameters

```rust
use serde::Deserialize;

/// List users with pagination
///
/// `GET /users?limit=10&offset=0`
#[derive(Deserialize)]
pub struct ListQuery {
    /// Maximum results (default: 10, max: 100)
    #[serde(default = "default_limit")]
    pub limit: u32,

    /// Number to skip (default: 0)
    #[serde(default)]
    pub offset: u32,
}

fn default_limit() -> u32 {
    10
}

pub async fn list_users(
    Query(query): Query<ListQuery>,
    Extension(service): Extension<Arc<UserService>>,
) -> Result<Json<Vec<User>>, UserError> {
    let users = service.list(query.limit, query.offset).await?;
    Ok(Json(users))
}
```

---

## Handler with Custom Response

```rust
use serde::Serialize;

/// List response with metadata
#[derive(Serialize)]
pub struct ListResponse<T> {
    pub data: Vec<T>,
    pub total: u64,
    pub limit: u32,
    pub offset: u32,
}

pub async fn list_users_with_meta(
    Query(query): Query<ListQuery>,
    Extension(service): Extension<Arc<UserService>>,
) -> Result<Json<ListResponse<User>>, UserError> {
    let users = service.list(query.limit, query.offset).await?;
    let total = service.count().await?;

    Ok(Json(ListResponse {
        data: users,
        total,
        limit: query.limit,
        offset: query.offset,
    }))
}
```

---

## Error Response Formatting

```rust
use axum::response::{IntoResponse, Response};

/// Format error responses
impl IntoResponse for UserError {
    fn into_response(self) -> Response {
        let (status, error_message) = match self {
            UserError::NotFound => {
                (StatusCode::NOT_FOUND, "User not found")
            }
            UserError::InvalidEmail(_) => {
                (StatusCode::BAD_REQUEST, "Invalid email format")
            }
            UserError::DuplicateEmail(_) => {
                (StatusCode::CONFLICT, "Email already in use")
            }
            UserError::ValidationError(msg) => {
                (StatusCode::BAD_REQUEST, &msg)
            }
            UserError::RepositoryError(_) => {
                (StatusCode::INTERNAL_SERVER_ERROR, "Database error")
            }
        };

        let body = Json(serde_json::json!({
            "error": error_message,
            "status": status.as_u16(),
        }));

        (status, body).into_response()
    }
}
```

---

## Router Setup

```rust
use axum::{Router, routing::{get, post, put, delete}};

/// Create user routes
pub fn user_routes() -> Router {
    Router::new()
        .route("/", get(list_users).post(create_user))
        .route("/:id", get(get_user).put(update_user).delete(delete_user))
}

/// Include in main router
pub fn create_app_router() -> Router {
    Router::new()
        .nest("/api/users", user_routes())
        .layer(Extension(Arc::new(user_service)))
}
```

---

## Handler with Request Body Validation

```rust
use axum::Json;
use validator::Validate;

/// Request with validation
#[derive(Deserialize, Validate)]
pub struct CreateUserValidated {
    #[validate(email)]
    pub email: String,

    #[validate(length(min = 3, max = 100))]
    pub name: String,
}

pub async fn create_user_validated(
    Extension(service): Extension<Arc<UserService>>,
    Json(input): Json<CreateUserValidated>,
) -> Result<(StatusCode, Json<User>), UserError> {
    // Validate before calling service
    input.validate()?;

    let user = service.create(CreateUserInput {
        email: input.email,
        name: input.name,
    }).await?;

    Ok((StatusCode::CREATED, Json(user)))
}
```

---

## Handler with Authentication

```rust
use axum::extract::FromRequestParts;

/// Extract authenticated user from request
pub struct AuthUser {
    pub id: u64,
}

#[async_trait::async_trait]
impl<S> FromRequestParts<S> for AuthUser
where
    S: Send + Sync,
{
    type Rejection = UserError;

    async fn from_request_parts(parts: &mut axum::http::request::Parts, _: &S) -> Result<Self, Self::Rejection> {
        let header = parts
            .headers
            .get("Authorization")
            .and_then(|h| h.to_str().ok())
            .and_then(|h| h.strip_prefix("Bearer "))
            .ok_or(UserError::ValidationError("Missing auth".into()))?;

        // Parse JWT or session token
        let id = parse_token(header)?;
        Ok(AuthUser { id })
    }
}

fn parse_token(token: &str) -> Result<u64, UserError> {
    // JWT decoding logic
    todo!()
}

/// Protected handler - only authenticated users
pub async fn get_current_user(
    auth: AuthUser,
    Extension(service): Extension<Arc<UserService>>,
) -> Result<Json<User>, UserError> {
    let user = service.get(auth.id).await?;
    Ok(Json(user))
}
```

---

## Composite Handler (Multiple Concerns)

```rust
use axum::extract::{Path, Extension};

/// Fetch user and related data
pub async fn get_user_with_orders(
    Path(id): Path<u64>,
    Extension(user_service): Extension<Arc<UserService>>,
    Extension(order_service): Extension<Arc<OrderService>>,
) -> Result<Json<UserWithOrders>, UserError> {
    let user = user_service.get(id).await?;
    let orders = order_service.list_by_user(id).await?;

    Ok(Json(UserWithOrders { user, orders }))
}

#[derive(Serialize)]
pub struct UserWithOrders {
    pub user: User,
    pub orders: Vec<Order>,
}
```

---

## Testing Handlers

```rust
#[cfg(test)]
mod tests {
    use super::*;
    use axum::http::StatusCode;

    #[tokio::test]
    async fn test_create_user_handler() {
        let service = Arc::new(UserService::new(
            Box::new(MockUserRepository::new())
        ));

        let input = CreateUserInput {
            email: "test@example.com".into(),
            name: "Test".into(),
        };

        let result = create_user(
            Extension(service),
            Json(input),
        ).await;

        assert!(result.is_ok());
        let (status, _) = result.unwrap();
        assert_eq!(status, StatusCode::CREATED);
    }

    #[tokio::test]
    async fn test_get_user_not_found() {
        let service = Arc::new(UserService::new(
            Box::new(MockUserRepository::new())
        ));

        let result = get_user(
            Path(999),
            Extension(service),
        ).await;

        assert!(matches!(result, Err(UserError::NotFound)));
    }
}
```

---

## Best Practices

1. **Keep handlers thin** - Delegate business logic to service
2. **Validate inputs** - Use `validator` crate or manual checks
3. **Clear response codes** - 201 for creation, 204 for delete, 400 for validation
4. **Error formatting** - Consistent error response structure
5. **Use Tower middleware** - Add logging, metrics, auth at middleware level
6. **Extract common patterns** - Use helper functions for repeated patterns
7. **Documentation** - Include OpenAPI/rustdoc with examples
