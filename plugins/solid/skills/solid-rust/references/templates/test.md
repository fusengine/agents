---
name: Unit and Integration Tests Template
description: Test templates covering unit tests, integration tests, mocks, and fixtures
when-to-use: Writing comprehensive tests for services, repositories, and handlers
keywords: [test, unit test, integration test, mock, fixture, #[tokio::test]]
---

# Unit and Integration Tests Template

## Test Module Organization

```rust
//! User module tests
//!
//! Tests organized by concern:
//! - unit/ - Fast, no I/O, isolated logic
//! - integration/ - With containers, real dependencies

#[cfg(test)]
mod unit;

#[cfg(test)]
mod integration;
```

---

## Unit Tests - Service Logic

```rust
//! Unit tests for UserService
//!
//! These tests are fast and use mocks, no database.

#[cfg(test)]
mod service_tests {
    use super::*;
    use crate::modules::user::{UserService, model::*, traits::UserRepository, error::UserError};
    use async_trait::async_trait;
    use std::sync::{Arc, Mutex};

    /// Mock repository for testing
    pub struct MockUserRepository {
        users: Arc<Mutex<std::collections::HashMap<u64, User>>>,
        call_count: Arc<Mutex<usize>>,
    }

    impl MockUserRepository {
        pub fn new() -> Self {
            Self {
                users: Arc::new(Mutex::new(std::collections::HashMap::new())),
                call_count: Arc::new(Mutex::new(0)),
            }
        }

        pub fn get_call_count(&self) -> usize {
            *self.call_count.lock().unwrap()
        }
    }

    #[async_trait]
    impl UserRepository for MockUserRepository {
        async fn find_by_id(&self, id: u64) -> Result<User, UserError> {
            *self.call_count.lock().unwrap() += 1;
            self.users
                .lock()
                .unwrap()
                .get(&id)
                .cloned()
                .ok_or(UserError::NotFound)
        }

        async fn save(&self, user: &User) -> Result<(), UserError> {
            *self.call_count.lock().unwrap() += 1;
            self.users.lock().unwrap().insert(user.id, user.clone());
            Ok(())
        }

        async fn delete(&self, id: u64) -> Result<(), UserError> {
            *self.call_count.lock().unwrap() += 1;
            self.users.lock().unwrap().remove(&id);
            Ok(())
        }

        async fn list(&self, limit: u32, offset: u32) -> Result<Vec<User>, UserError> {
            *self.call_count.lock().unwrap() += 1;
            let users = self.users.lock().unwrap();
            Ok(users
                .values()
                .skip(offset as usize)
                .take(limit as usize)
                .cloned()
                .collect())
        }
    }

    fn create_test_user(id: u64) -> User {
        User {
            id,
            email: format!("user{}@example.com", id),
            name: format!("User {}", id),
            created_at: chrono::Utc::now(),
            updated_at: chrono::Utc::now(),
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

        let result = service.create(input).await;
        assert!(result.is_ok());

        let user = result.unwrap();
        assert_eq!(user.email, "test@example.com");
        assert_eq!(user.name, "Test User");
    }

    #[tokio::test]
    async fn test_create_user_invalid_email() {
        let repo = Box::new(MockUserRepository::new());
        let service = UserService::new(repo);

        let input = CreateUserInput {
            email: "invalid".into(),
            name: "Test".into(),
        };

        let result = service.create(input).await;
        assert!(matches!(result, Err(UserError::InvalidEmail(_))));
    }

    #[tokio::test]
    async fn test_create_user_invalid_name() {
        let repo = Box::new(MockUserRepository::new());
        let service = UserService::new(repo);

        let input = CreateUserInput {
            email: "valid@example.com".into(),
            name: "X".into(),  // Too short
        };

        let result = service.create(input).await;
        assert!(matches!(result, Err(UserError::ValidationError(_))));
    }

    #[tokio::test]
    async fn test_get_user_found() {
        let repo = Box::new(MockUserRepository::new());
        let user = create_test_user(1);
        repo.save(&user).await.unwrap();

        let service = UserService::new(repo);
        let result = service.get(1).await;

        assert!(result.is_ok());
        assert_eq!(result.unwrap().email, "user1@example.com");
    }

    #[tokio::test]
    async fn test_get_user_not_found() {
        let repo = Box::new(MockUserRepository::new());
        let service = UserService::new(repo);

        let result = service.get(999).await;
        assert!(matches!(result, Err(UserError::NotFound)));
    }

    #[tokio::test]
    async fn test_update_user() {
        let repo = Box::new(MockUserRepository::new());
        let mut user = create_test_user(1);
        user.created_at = chrono::Utc::now();
        user.updated_at = chrono::Utc::now();
        repo.save(&user).await.unwrap();

        let service = UserService::new(repo);
        let input = UpdateUserInput {
            name: Some("Updated Name".into()),
            email: None,
        };

        let result = service.update(1, input).await;
        assert!(result.is_ok());

        let updated = result.unwrap();
        assert_eq!(updated.name, "Updated Name");
        assert_eq!(updated.email, "user1@example.com");
    }

    #[tokio::test]
    async fn test_delete_user() {
        let repo = Box::new(MockUserRepository::new());
        let user = create_test_user(1);
        repo.save(&user).await.unwrap();

        let service = UserService::new(repo);
        let result = service.delete(1).await;

        assert!(result.is_ok());
    }

    #[tokio::test]
    async fn test_list_users() {
        let repo = Box::new(MockUserRepository::new());
        repo.save(&create_test_user(1)).await.unwrap();
        repo.save(&create_test_user(2)).await.unwrap();
        repo.save(&create_test_user(3)).await.unwrap();

        let service = UserService::new(repo);
        let result = service.list(10, 0).await;

        assert!(result.is_ok());
        assert_eq!(result.unwrap().len(), 3);
    }

    #[tokio::test]
    async fn test_repo_called_once() {
        let repo = Box::new(MockUserRepository::new());
        repo.save(&create_test_user(1)).await.unwrap();

        let service = UserService::new(repo.clone());  // If repo is clonable
        let _ = service.get(1).await;

        // Verify repository was called (useful for spy patterns)
    }
}
```

---

## Unit Tests - Validation Functions

```rust
#[cfg(test)]
mod validation_tests {
    use crate::modules::user::error::UserError;

    // Assuming these are public or exposed for testing
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

    #[test]
    fn test_validate_email_valid() {
        assert!(validate_email("user@example.com").is_ok());
        assert!(validate_email("a@b.co").is_ok());
    }

    #[test]
    fn test_validate_email_invalid() {
        assert!(validate_email("invalid").is_err());
        assert!(validate_email("@example.com").is_err());
        assert!(validate_email("user@").is_err());
    }

    #[test]
    fn test_validate_name_valid() {
        assert!(validate_name("Jo").is_ok());  // 3+ chars
        assert!(validate_name("John Doe").is_ok());
    }

    #[test]
    fn test_validate_name_too_short() {
        assert!(validate_name("X").is_err());
    }

    #[test]
    fn test_validate_name_too_long() {
        let long = "a".repeat(101);
        assert!(validate_name(&long).is_err());
    }
}
```

---

## Integration Tests - With Handler

```rust
//! Integration tests with HTTP handlers

#[cfg(test)]
mod handler_tests {
    use axum::{Router, routing::post, Extension};
    use axum_test::TestServer;
    use std::sync::Arc;

    use crate::modules::user::{
        handler::create_user,
        service::UserService,
        model::CreateUserInput,
        repository::MockUserRepository,
    };

    async fn setup() -> TestServer {
        let repo = Box::new(MockUserRepository::new());
        let service = Arc::new(UserService::new(repo));

        let router = Router::new()
            .route("/users", post(create_user))
            .layer(Extension(service));

        TestServer::new(router).unwrap()
    }

    #[tokio::test]
    async fn test_create_user_endpoint() {
        let server = setup().await;

        let response = server
            .post("/users")
            .json(&CreateUserInput {
                email: "test@example.com".into(),
                name: "Test User".into(),
            })
            .await;

        assert_eq!(response.status(), 201);
    }

    #[tokio::test]
    async fn test_create_user_invalid_email() {
        let server = setup().await;

        let response = server
            .post("/users")
            .json(&CreateUserInput {
                email: "invalid".into(),
                name: "Test User".into(),
            })
            .await;

        assert_eq!(response.status(), 400);
    }
}
```

---

## Integration Tests - With Database

```rust
#[cfg(test)]
mod database_tests {
    use sqlx::PgPool;

    // Fixtures
    async fn setup_test_db() -> PgPool {
        let database_url = std::env::var("TEST_DATABASE_URL")
            .unwrap_or_else(|_| "postgres://localhost/test".to_string());

        let pool = PgPool::connect(&database_url).await.unwrap();

        // Run migrations
        sqlx::migrate!()
            .run(&pool)
            .await
            .unwrap();

        pool
    }

    async fn teardown_test_db(pool: &PgPool) {
        // Cleanup (optional, depends on test isolation strategy)
    }

    #[tokio::test]
    async fn test_save_and_retrieve_user() {
        let pool = setup_test_db().await;
        let repo = PgUserRepository::new(pool.clone());

        let user = User {
            id: 1,
            email: "test@example.com".into(),
            name: "Test".into(),
            created_at: chrono::Utc::now(),
            updated_at: chrono::Utc::now(),
        };

        repo.save(&user).await.unwrap();

        let retrieved = repo.find_by_id(1).await.unwrap();
        assert_eq!(retrieved.email, user.email);

        teardown_test_db(&pool).await;
    }
}
```

---

## Parameterized Tests

```rust
#[cfg(test)]
mod parameterized_tests {
    #[test]
    fn test_email_validation() {
        let cases = vec![
            ("valid@example.com", true),
            ("invalid", false),
            ("@example.com", false),
            ("a@b.co", true),
            ("user+tag@example.com", true),
        ];

        for (email, expected_valid) in cases {
            let result = validate_email(email);
            assert_eq!(
                result.is_ok(),
                expected_valid,
                "Failed for email: {}",
                email
            );
        }
    }
}
```

---

## Fixture Pattern

```rust
#[cfg(test)]
mod fixtures {
    use crate::modules::user::model::User;
    use chrono::Utc;

    pub fn user_fixture(id: u64, email: &str) -> User {
        User {
            id,
            email: email.to_string(),
            name: format!("User {}", id),
            created_at: Utc::now(),
            updated_at: Utc::now(),
        }
    }

    pub fn user_admin_fixture(id: u64) -> User {
        user_fixture(id, "admin@example.com")
    }
}

#[cfg(test)]
mod tests {
    use super::fixtures::*;

    #[test]
    fn test_with_fixture() {
        let user = user_fixture(1, "user@example.com");
        assert_eq!(user.email, "user@example.com");
    }
}
```

---

## Best Practices

1. **Mock first** - Unit tests use mocks, integration tests use real deps
2. **One assertion per test** - Easier to debug when failing
3. **Clear names** - `test_create_user_with_invalid_email` > `test_create_user_2`
4. **Setup/teardown** - Use helpers for common initialization
5. **Fixtures** - Reusable test data builders
6. **Test errors** - As many tests for errors as happy paths
7. **Use #[tokio::test]** - For async tests
8. **Table-driven tests** - Parameterize common cases
9. **Integration boundaries** - Test across layer boundaries
10. **Isolation** - Each test independent; no ordering assumptions
