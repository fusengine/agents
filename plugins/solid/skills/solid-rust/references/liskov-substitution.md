---
name: Liskov Substitution Principle (LSP)
description: LSP for Rust - Trait contract consistency, contract tests to ensure substitutability
when-to-use: Ensuring trait implementations are truly interchangeable, preventing subtle bugs with trait objects
keywords: [LSP, Liskov substitution, trait contract, substitutability, contract tests, behavioral subtyping]
priority: medium
related: [open-closed.md, trait-def.md, test.md]
---

# Liskov Substitution Principle (LSP) for Rust

## Core Concept

Derived types (trait implementations) must be **substitutable for their base type** without breaking the contract. If code accepts `dyn EmailService`, **any** `EmailService` implementation must work identically.

**Contract** = Trait definition (method signatures + documented behavior)
**Violation** = Implementation that breaks the contract's expectations

---

## Contract Definition

```rust
/// Contract: Must deliver email reliably
#[async_trait]
pub trait EmailService: Send + Sync {
    /// Send email to recipient.
    ///
    /// # Contract
    /// - Returns Ok if email is accepted by provider
    /// - Returns Err(EmailError::Invalid) if email format invalid
    /// - Returns Err(EmailError::RateLimit) if rate limited
    /// - Never discards valid emails silently
    /// - Idempotent: sending twice with same ID is safe
    async fn send(
        &self,
        to: &str,
        subject: &str,
        body: &str,
    ) -> Result<String, EmailError>;
}
```

---

## LSP Violations in Rust

### Violation 1: Changing Return Type Semantics

❌ **SendGrid impl (breaks contract):**
```rust
pub struct SendGridEmailService { /* ... */ }

#[async_trait]
impl EmailService for SendGridEmailService {
    async fn send(&self, to: &str, subject: &str, body: &str) -> Result<String, EmailError> {
        // Contract says: Return Err(EmailError::Invalid) for bad email
        // This impl: Silently ignores invalid emails
        if !is_valid_email(to) {
            return Ok(String::from("ignored"));  // VIOLATES CONTRACT
        }
        // ...
    }
}
```

❌ **Usage breaks with substitution:**
```rust
async fn notify_user(service: Box<dyn EmailService>) -> Result<()> {
    let result = service.send("invalid@@example.com", "Hi", "msg").await?;
    // Expected Err, got Ok("ignored") - code may silently fail
    println!("Sent: {}", result);
    Ok(())
}
```

✓ **Correct implementation:**
```rust
#[async_trait]
impl EmailService for SendGridEmailService {
    async fn send(&self, to: &str, subject: &str, body: &str) -> Result<String, EmailError> {
        if !is_valid_email(to) {
            return Err(EmailError::Invalid(format!("Invalid email: {}", to)));
        }
        self.client.send_email(to, subject, body).await
    }
}
```

---

### Violation 2: Adding Unexpected Side Effects

❌ **Implementation adds undocumented behavior:**
```rust
#[async_trait]
impl EmailService for LoggingEmailService {
    async fn send(&self, to: &str, subject: &str, body: &str) -> Result<String, EmailError> {
        // Contract doesn't mention deletion, but we do it
        DELETE_INBOX(to).await;  // VIOLATES CONTRACT: unexpected side effect
        self.inner.send(to, subject, body).await
    }
}

// Substitution breaks user's assumptions
async fn cleanup() -> Result<()> {
    let email: Box<dyn EmailService> = Box::new(LoggingEmailService { /* ... */ });
    email.send("user@example.com", "test", "test").await?;
    // User now has deleted inbox - not expected from send()
}
```

✓ **Separate concerns:**
```rust
#[async_trait]
impl EmailService for SendGridEmailService {
    async fn send(&self, to: &str, subject: &str, body: &str) -> Result<String, EmailError> {
        // Only sends, as contract promises
        self.client.send_email(to, subject, body).await
    }
}

// Cleanup is separate
async fn cleanup_and_send() -> Result<()> {
    let email = Box::new(SendGridEmailService { /* ... */ });
    email.send("user@example.com", "test", "test").await?;
    DELETE_INBOX("user@example.com").await?;
}
```

---

### Violation 3: Weakening Preconditions (Too Permissive)

❌ **Accepts invalid input the trait doesn't:**
```rust
#[async_trait]
pub trait PaymentProcessor {
    /// Process payment with valid amount > 0
    async fn process(&self, amount: u64) -> Result<TransactionId>;
}

#[async_trait]
impl PaymentProcessor for MockPaymentService {
    async fn process(&self, amount: u64) -> Result<TransactionId> {
        // Accepts zero or negative - violates contract
        if amount == 0 {
            return Ok(TransactionId::new("mock-0".into()));  // Should reject!
        }
        Ok(TransactionId::new(format!("mock-{}", amount)))
    }
}
```

✓ **Contract-respecting implementation:**
```rust
#[async_trait]
impl PaymentProcessor for MockPaymentService {
    async fn process(&self, amount: u64) -> Result<TransactionId> {
        if amount == 0 {
            return Err(PaymentError::InvalidAmount("Must be > 0".into()));
        }
        Ok(TransactionId::new(format!("mock-{}", amount)))
    }
}
```

---

## Contract Testing (Verify Substitutability)

```rust
#[cfg(test)]
mod contract_tests {
    use super::*;

    /// Every impl must handle invalid email
    async fn contract_rejects_invalid_email(service: Box<dyn EmailService>) {
        let result = service.send("invalid@@test.com", "subj", "body").await;
        match result {
            Err(EmailError::Invalid(_)) => {}, // OK
            Ok(_) => panic!("Violates contract: invalid email should error"),
            Err(e) => panic!("Wrong error: {:?}", e),
        }
    }

    /// Every impl must accept valid email
    async fn contract_accepts_valid_email(service: Box<dyn EmailService>) {
        let result = service.send("test@example.com", "subj", "body").await;
        assert!(result.is_ok(), "Must accept valid email");
    }

    /// Every impl must be idempotent
    async fn contract_is_idempotent(service: Box<dyn EmailService>) {
        let id1 = service.send("test@example.com", "s", "b").await.unwrap();
        let id2 = service.send("test@example.com", "s", "b").await.unwrap();
        assert_eq!(id1, id2, "Idempotent sends must return same ID");
    }

    #[tokio::test]
    async fn test_sendgrid_satisfies_contract() {
        let service = Box::new(SendGridEmailService::new("key".into()));
        contract_rejects_invalid_email(service).await;
        contract_accepts_valid_email(service).await;
        contract_is_idempotent(service).await;
    }

    #[tokio::test]
    async fn test_mock_satisfies_contract() {
        let service = Box::new(MockEmailService::new());
        contract_rejects_invalid_email(service).await;
        contract_accepts_valid_email(service).await;
        contract_is_idempotent(service).await;
    }
}
```

---

## Documentation Requirements (Rust Rustdoc)

```rust
/// Email service provider abstraction.
///
/// # Contract
///
/// Implementations MUST satisfy:
/// - Valid emails (RFC 5322) always return `Ok(id)`
/// - Invalid emails always return `Err(EmailError::Invalid(_))`
/// - Same email sent twice with same ID is idempotent
/// - No side effects beyond sending email
///
/// # Example
///
/// ```no_run
/// # use my_crate::*;
/// # let service = Box::new(SendGridEmailService::new("key".into()));
/// let result = service.send("user@example.com", "Hello", "Body").await?;
/// println!("Sent: {}", result);
/// # Ok::<(), Box<dyn std::error::Error>>(())
/// ```
#[async_trait]
pub trait EmailService: Send + Sync {
    async fn send(
        &self,
        to: &str,
        subject: &str,
        body: &str,
    ) -> Result<String, EmailError>;
}
```

---

## Detecting LSP Violations

| Violation | Signal | Fix |
|-----------|--------|-----|
| Silent failures | Implementation hides errors | Document all error cases, use Result |
| Unexpected side effects | Method does more than documented | Separate concerns, create new traits |
| Type coercion | Changing error types in Result | Keep Result<T, E> consistent |
| Precondition weakening | Accepts invalid inputs trait rejects | Validate input per contract |
| Postcondition strengthening | Returns more than trait promises | Don't add extra guarantees |

---

## Rust-Specific Tips

1. **Trait docs first** - Document contract in rustdoc BEFORE implementing
2. **Contract tests** - Test each impl against contract, not just happy path
3. **Sealed traits** - Use `pub use self::sealed::Sealed` to prevent external impls if stricter control needed
4. **Associated types** - Use `type Err: Error` in traits to enforce error handling
5. **Async traits** - With `#[async_trait]`, ensure all impls have same cancellation/timeout behavior
