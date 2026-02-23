---
name: Open/Closed Principle (OCP)
description: OCP for Rust - Trait-based extensibility, adding implementations without modifying existing code
when-to-use: Adding new behavior without editing core code, supporting multiple backends, plugin architecture
keywords: [OCP, open/closed, traits, extensibility, impl, interface, abstraction]
priority: high
related: [dependency-inversion.md, trait-def.md, service.md]
---

# Open/Closed Principle (OCP) for Rust

## Core Concept

Software should be **open for extension** (add new implementations) but **closed for modification** (don't change existing code). In Rust, this is achieved through **traits** and **generics**.

---

## Trait-Based Extensibility

**Closed for modification:** Define the trait interface once
**Open for extension:** Add new implementations without touching trait or existing code

```rust
/// Trait defines behavior (closed for modification)
#[async_trait]
pub trait EmailService: Send + Sync {
    /// Send email to recipient
    async fn send(&self, to: &str, subject: &str, body: &str) -> Result<(), EmailError>;
}

/// Implementation 1: SendGrid
pub struct SendGridEmailService {
    client: SendGridClient,
}

#[async_trait]
impl EmailService for SendGridEmailService {
    async fn send(&self, to: &str, subject: &str, body: &str) -> Result<(), EmailError> {
        // SendGrid-specific logic
        self.client.send_email(to, subject, body).await
    }
}

/// Implementation 2: AWS SES (new feature, NO changes to trait)
pub struct AwsSesEmailService {
    client: SesClient,
}

#[async_trait]
impl EmailService for AwsSesEmailService {
    async fn send(&self, to: &str, subject: &str, body: &str) -> Result<(), EmailError> {
        // AWS-specific logic
        self.client.send_email(to, subject, body).await
    }
}
```

**Result:** Add SendGrid → trait stays closed. Add AWS SES → NO modifications to SendGrid code.

---

## Consumer Code (Generic Over Trait)

```rust
/// Service accepts ANY EmailService implementation
pub struct NotificationService {
    email: Box<dyn EmailService>,
}

impl NotificationService {
    pub async fn notify_user(&self, user_id: u64, message: &str) -> Result<(), NotificationError> {
        // Works with SendGrid, AWS, or future implementations
        self.email.send(&user.email, "Notification", message).await?;
        Ok(())
    }
}

// Usage - swap implementations without code changes
let email = Box::new(SendGridEmailService::new(client));
let notifier = NotificationService { email };
notifier.notify_user(user_id, "Hello").await?;

// Switch to AWS SES
let email = Box::new(AwsSesEmailService::new(ses_client));
let notifier = NotificationService { email };
notifier.notify_user(user_id, "Hello").await?;  // Works identically
```

---

## Generic Trait Bounds (Compile-Time Extension)

Use generics when you know the concrete type at compile time:

```rust
/// Generic service - statically dispatch, zero runtime cost
pub struct NotificationService<E: EmailService> {
    email: E,
}

impl<E: EmailService> NotificationService<E> {
    pub async fn notify_user(&self, user_id: u64, msg: &str) -> Result<(), NotificationError> {
        // E can be SendGrid, AWS, or any impl EmailService
        self.email.send(&user.email, "Notification", msg).await?;
        Ok(())
    }
}

// Monomorphization - compiler generates specialized code per type
let email = SendGridEmailService::new(client);
let notifier = NotificationService { email };
```

---

## Strategy Pattern (Multiple Behaviors)

Add new strategies without modifying existing code:

```rust
/// Notification strategy trait
pub trait NotificationStrategy: Send + Sync {
    async fn notify(&self, user: &User, message: &str) -> Result<(), Error>;
}

/// Email strategy
pub struct EmailNotification {
    email_svc: Box<dyn EmailService>,
}

impl NotificationStrategy for EmailNotification {
    async fn notify(&self, user: &User, message: &str) -> Result<(), Error> {
        self.email_svc.send(&user.email, "Message", message).await?;
        Ok(())
    }
}

/// SMS strategy (NEW - no trait changes)
pub struct SmsNotification {
    sms_svc: Box<dyn SmsService>,
}

impl NotificationStrategy for SmsNotification {
    async fn notify(&self, user: &User, message: &str) -> Result<(), Error> {
        self.sms_svc.send(&user.phone, message).await?;
        Ok(())
    }
}

/// Use any strategy
pub struct Notifier {
    strategies: Vec<Box<dyn NotificationStrategy>>,
}

impl Notifier {
    pub async fn notify_all(&self, user: &User, msg: &str) -> Result<(), Error> {
        for strategy in &self.strategies {
            strategy.notify(user, msg).await?;
        }
        Ok(())
    }
}
```

---

## Adding Features Without Modification

### Before (Violates OCP):
```rust
pub enum StorageType {
    Local,
    S3,
    // Every new backend requires modification
}

impl StorageType {
    pub async fn upload(&self, data: &[u8]) -> Result<String> {
        match self {
            Self::Local => { /* local logic */ },
            Self::S3 => { /* S3 logic */ },
            // CLOSED: must modify enum
        }
    }
}
```

### After (OCP compliant):
```rust
/// Trait is closed; new implementations extend it
#[async_trait]
pub trait StorageBackend: Send + Sync {
    async fn upload(&self, data: &[u8]) -> Result<String>;
}

pub struct FileStorage { /* ... */ }
#[async_trait]
impl StorageBackend for FileStorage { /* ... */ }

pub struct S3Storage { /* ... */ }
#[async_trait]
impl StorageBackend for S3Storage { /* ... */ }

// NEW: Add MinIO support without touching existing code
pub struct MinIoStorage { /* ... */ }
#[async_trait]
impl StorageBackend for MinIoStorage { /* ... */ }
```

---

## Rust-Specific Patterns

1. **Traits in `traits.rs`** - Keep abstraction in dedicated file (see architecture-patterns.md)
2. **Box<dyn T>** - Runtime polymorphism, slight performance cost
3. **Generic bounds** - Zero-cost compile-time polymorphism
4. **#[async_trait]** - Workaround for async in traits (as of Rust 1.75, native impl traits improving)
5. **Builder pattern** - Compose behaviors without modifying constructors

---

## Anti-Pattern: Modifying Closed Code

❌ **Adding fields to closed struct:**
```rust
// CLOSED - don't modify
pub struct SendGridEmailService {
    client: SendGridClient,
}

// NEW REQUIREMENT: add retry logic
pub struct SendGridEmailService {
    client: SendGridClient,
    retries: u32,  // Breaking change!
}
```

✓ **Wrapper trait (extends without modification):**
```rust
pub struct RetryableEmailService {
    inner: Box<dyn EmailService>,
    retries: u32,
}

#[async_trait]
impl EmailService for RetryableEmailService {
    async fn send(&self, to: &str, subject: &str, body: &str) -> Result<(), EmailError> {
        for attempt in 0..self.retries {
            match self.inner.send(to, subject, body).await {
                Ok(()) => return Ok(()),
                Err(e) if attempt < self.retries - 1 => continue,
                Err(e) => return Err(e),
            }
        }
        Ok(())
    }
}
```

---

## Configuration-Driven Extensibility

```rust
pub fn create_email_service(config: &Config) -> Box<dyn EmailService> {
    match config.email_provider.as_str() {
        "sendgrid" => Box::new(SendGridEmailService::new(&config.sendgrid_key)),
        "aws-ses" => Box::new(AwsSesEmailService::new(&config.aws_region)),
        "mock" => Box::new(MockEmailService::new()),
        _ => panic!("Unknown email provider"),
    }
}

// New provider = add case, no trait/service changes
```

This keeps your code open for extension through configuration, closed for modification in business logic.
