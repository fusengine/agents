---
name: solid-python-principles
description: All 5 SOLID principles applied to Python 3.12+ with Protocol, type hints, and DI
when-to-use: overview of SOLID for Python, quick reference, principle selection
keywords: SOLID, Python, Protocol, ABC, type hints, DI
priority: high
related: patterns.md
---

# SOLID Principles - Python Quick Reference

## Principles Overview

| Principle | Summary | Python Pattern |
|-----------|---------|----------------|
| **SRP** | One responsibility per module | Route, Service, Repository layers |
| **OCP** | Open for extension, closed for modification | `typing.Protocol` |
| **LSP** | Subtypes honor base contracts | Type hints + runtime checks |
| **ISP** | Small, focused interfaces | Protocol segregation (1-3 methods) |
| **DIP** | Depend on abstractions | Constructor injection |

---

## S - Single Responsibility (SRP)

- Modules < 100 lines (split at 90)
- Routes: HTTP I/O only, delegate to services
- Services: Business logic only, use repositories
- Repositories: Data access only

---

## O - Open/Closed (OCP)

```python
from typing import Protocol

class PaymentProcessor(Protocol):
    def process(self, amount: float) -> bool: ...

class StripeProcessor:
    def process(self, amount: float) -> bool:
        return stripe.charge(amount)
```

Extend by adding new implementations, not modifying existing.

---

## L - Liskov Substitution (LSP)

- Subtypes must honor the base type contract
- Use `type hints` to enforce return types
- Never raise unexpected exceptions in subtypes

---

## I - Interface Segregation (ISP)

```python
# GOOD: Small, focused protocols
class Readable(Protocol):
    def read(self, id: str) -> dict: ...

class Writable(Protocol):
    def write(self, data: dict) -> str: ...
```

Split fat interfaces (4+ methods) into focused Protocols.

---

## D - Dependency Inversion (DIP)

```python
class UserService:
    """Depends on abstractions, not concretions."""

    def __init__(self, repo: UserRepository, mailer: Mailer) -> None:
        self._repo = repo
        self._mailer = mailer

    def create_user(self, email: str) -> User:
        user = self._repo.save(User(email=email))
        self._mailer.send_welcome(user.email)
        return user
```

Inject at composition root (`main.py` or DI container).
