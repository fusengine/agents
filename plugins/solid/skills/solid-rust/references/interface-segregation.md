---
name: Interface Segregation Principle (ISP)
description: ISP for Rust - Small focused traits, trait composition with `+` bounds to prevent fat traits
when-to-use: Designing trait hierarchies, avoiding bloated interfaces, composing behaviors
keywords: [ISP, interface segregation, focused traits, trait composition, trait bounds, small interfaces]
priority: medium
related: [dependency-inversion.md, trait-def.md, service.md]
---

# Interface Segregation Principle (ISP) for Rust

## Core Concept

Clients should not depend on interfaces they don't use. In Rust, this means **small, focused traits** rather than fat traits. Use **trait composition** to build larger capabilities.

---

## Fat Trait Anti-Pattern

❌ **Single bloated trait:**
```rust
/// Too many responsibilities - clients forced to depend on everything
pub trait UserService: Send + Sync {
    async fn create_user(&self, input: CreateUserInput) -> Result<User>;
    async fn update_user(&self, id: u64, input: UpdateUserInput) -> Result<User>;
    async fn delete_user(&self, id: u64) -> Result<()>;
    async fn get_user(&self, id: u64) -> Result<User>;
    async fn list_users(&self, limit: u32) -> Result<Vec<User>>;
    async fn validate_email(&self, email: &str) -> Result<()>;
    async fn send_verification_email(&self, user_id: u64) -> Result<()>;
    async fn export_users_to_csv(&self) -> Result<String>;
    async fn import_users_from_csv(&self, csv: &str) -> Result<()>;
    async fn generate_report(&self) -> Result<Report>;
}

// Implementation forced to implement all 10 methods
pub struct UserServiceImpl { /* ... */ }
impl UserService for UserServiceImpl { /* must implement all 10 */ }

// A simple user retrieval handler depends on report generation, export, etc.
async fn get_user_handler(service: Box<dyn UserService>) {
    // Forced dependency on UserService, even if only using get_user()
    let user = service.get_user(123).await?;
    Ok(user)
}
```

---

## ISP Compliant: Small, Focused Traits

✓ **Segregated interfaces:**
```rust
/// Trait 1: User retrieval
#[async_trait]
pub trait UserRepository: Send + Sync {
    async fn get_user(&self, id: u64) -> Result<User>;
    async fn list_users(&self, limit: u32) -> Result<Vec<User>>;
}

/// Trait 2: User mutation
#[async_trait]
pub trait UserWriter: Send + Sync {
    async fn create_user(&self, input: CreateUserInput) -> Result<User>;
    async fn update_user(&self, id: u64, input: UpdateUserInput) -> Result<User>;
    async fn delete_user(&self, id: u64) -> Result<()>;
}

/// Trait 3: Email operations
#[async_trait]
pub trait EmailService: Send + Sync {
    async fn validate_email(&self, email: &str) -> Result<()>;
    async fn send_verification(&self, user_id: u64) -> Result<()>;
}

/// Trait 4: Export/import
#[async_trait]
pub trait UserDataIO: Send + Sync {
    async fn export_csv(&self) -> Result<String>;
    async fn import_csv(&self, csv: &str) -> Result<()>;
}

/// Trait 5: Reporting
#[async_trait]
pub trait UserReporting: Send + Sync {
    async fn generate_report(&self) -> Result<Report>;
}
```

---

## Trait Composition

Combine small traits only when needed:

```rust
/// Client that only needs reading
async fn get_user_handler(
    repo: &dyn UserRepository,
) -> Result<User> {
    repo.get_user(123).await
}

/// Client that needs reading + writing
async fn update_user_handler(
    writer: &(dyn UserRepository + UserWriter),
) -> Result<User> {
    let user = writer.get_user(123).await?;
    writer.update_user(123, input).await
}

/// Client that needs full user service
async fn register_handler(
    repo: &dyn UserRepository,
    writer: &dyn UserWriter,
    email: &dyn EmailService,
) -> Result<User> {
    email.validate_email(&input.email).await?;
    let user = writer.create_user(input).await?;
    email.send_verification(user.id).await?;
    Ok(user)
}
```

---

## Trait Bounds Composition

```rust
/// Generic function accepting small traits
pub struct UserService<R: UserRepository, W: UserWriter, E: EmailService> {
    repo: R,
    writer: W,
    email: E,
}

impl<R, W, E> UserService<R, W, E>
where
    R: UserRepository,
    W: UserWriter,
    E: EmailService,
{
    pub async fn register(&self, input: CreateUserInput) -> Result<User> {
        self.email.validate_email(&input.email).await?;
        let user = self.writer.create_user(input).await?;
        self.email.send_verification(user.id).await?;
        Ok(user)
    }

    pub async fn get_user_info(&self, id: u64) -> Result<User> {
        // Only uses repo, not email/writer
        self.repo.get_user(id).await
    }
}
```

---

## Dynamic Trait Composition

Use `+` bounds for dynamic dispatch:

```rust
/// Accept multiple traits at once (runtime polymorphism)
async fn full_user_operation(
    service: &(dyn UserRepository + UserWriter + EmailService),
) -> Result<()> {
    let user = service.get_user(1).await?;
    service.send_verification(user.id).await?;
    Ok(())
}

// Struct implementing all three
pub struct FullUserService { /* ... */ }
impl UserRepository for FullUserService { /* ... */ }
impl UserWriter for FullUserService { /* ... */ }
impl EmailService for FullUserService { /* ... */ }

// Can pass as combined trait
let service: Box<dyn UserRepository + UserWriter + EmailService> =
    Box::new(FullUserService::new());
full_user_operation(&*service).await?;
```

---

## Layered Trait Hierarchy (Optional)

For clarity, organize trait dependencies:

```rust
/// Core capabilities
#[async_trait]
pub trait UserRepository: Send + Sync {
    async fn get_user(&self, id: u64) -> Result<User>;
}

#[async_trait]
pub trait UserWriter: Send + Sync {
    async fn create_user(&self, input: CreateUserInput) -> Result<User>;
}

/// Composed trait for specific use cases
#[async_trait]
pub trait FullUserService: UserRepository + UserWriter + EmailService {
    // Marker trait for services needing all three
}

impl<T: UserRepository + UserWriter + EmailService> FullUserService for T {}

// Clean usage
async fn register_with_email(service: &dyn FullUserService) {
    // Compiler ensures all three capabilities present
}
```

---

## When to Segregate

| Signal | Action |
|--------|--------|
| Clients use 1-2 methods from 10-method trait | Split trait |
| Different implementations support different subsets | Split trait |
| Methods have unrelated concerns | Split trait |
| Easy to mock for testing | Possible sign of split needed |

---

## Rust-Specific Patterns

1. **Tuple impl:** `impl Trait for (T1, T2)` to compose multiple types
2. **Trait aliases:** `type FullUserService = dyn UserRepository + UserWriter + EmailService`
3. **Sealed trait pattern** (see open-closed.md) - restrict trait impls
4. **Default impls** - In supertrait, provide common functionality
5. **Associated traits** - Break trait dependencies into associated types

---

## Anti-Pattern: Overly Complex Bounds

❌ **Too complex:**
```rust
pub fn process<T>(service: &T)
where
    T: UserRepository + UserWriter + EmailService + UserReporting + UserDataIO,
{
    // Required ALL traits even if only using UserRepository
}
```

✓ **Cleaner:**
```rust
pub fn process(service: &dyn UserRepository) {
    // Only the trait we actually need
}
```

---

## Module Organization

```
src/modules/user/
├── traits.rs          # Small, segregated traits
│   ├── repository.rs      (UserRepository)
│   ├── writer.rs          (UserWriter)
│   ├── email.rs           (EmailService)
│   └── reporting.rs       (UserReporting)
├── service.rs         # Composes traits
└── handler.rs         # Depends on specific trait combo
```

This keeps dependencies explicit and mockable.
