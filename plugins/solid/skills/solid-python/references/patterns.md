---
name: solid-python-patterns
description: Python 3.12+ patterns - directory structure, typing.Protocol, dataclasses, pytest, docstrings
when-to-use: project structure, testing, typing, Python-specific SOLID
keywords: Python, Protocol, dataclasses, pytest, directory, docstrings
priority: high
related: principles.md
---

# Python Patterns & Structure

## Directory Structure (Modules MANDATORY)

```
src/modules/
├── users/
│   ├── routes/            # HTTP handlers (< 50 lines)
│   ├── services/          # Business logic (< 100 lines)
│   ├── repositories/      # Data access (< 100 lines)
│   ├── interfaces/        # Protocols (< 30 lines)
│   └── models/            # Domain models (< 50 lines)
└── core/                  # Shared across features
    ├── services/
    ├── interfaces/
    └── models/
```

## typing.Protocol (Interfaces)

```python
from typing import Protocol, runtime_checkable

@runtime_checkable
class UserRepository(Protocol):
    """Repository contract for user persistence."""
    def save(self, user: User) -> User: ...
    def find_by_id(self, user_id: str) -> User | None: ...
```

- `Protocol` over ABC (structural subtyping)
- `@runtime_checkable` only when `isinstance()` needed
- Keep in `interfaces/`, 1-3 methods max

## Dataclasses (Models)

```python
from dataclasses import dataclass, field

@dataclass(frozen=True)
class User:
    """Domain entity for user data."""
    email: str
    name: str
    id: str = field(default_factory=lambda: str(uuid4()))
```

- `frozen=True` for immutable value objects
- `field(default_factory=...)` for mutable defaults

## Pytest Patterns

```python
@pytest.fixture
def mock_repo() -> MagicMock:
    return MagicMock(spec=UserRepository)

def test_create_user(service: UserService, mock_repo: MagicMock) -> None:
    mock_repo.save.return_value = User(email="a@b.com", name="Test")
    result = service.create_user("a@b.com", "Test")
    assert result.email == "a@b.com"
    mock_repo.save.assert_called_once()
```

## Docstrings (Google Style)

```python
def create_user(self, email: str, name: str) -> User:
    """Create a new user and persist to repository.

    Args:
        email: User email address.
        name: User display name.

    Returns:
        The created User instance.
    """
```

Every public function must have a docstring.
Export only public API via `__all__` in `__init__.py`.
