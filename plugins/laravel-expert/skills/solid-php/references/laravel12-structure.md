# Laravel 12 Recommended Structure

```
app/
├── Http/
│   ├── Controllers/      # < 50 lines each
│   ├── Requests/         # Form validation
│   └── Resources/        # API transformations
├── Models/               # < 80 lines (excluding relations)
├── Services/             # < 100 lines
├── Contracts/            # Interfaces ONLY
├── Repositories/         # Data access
├── Actions/              # Single-purpose (< 50 lines)
├── DTOs/                 # Data transfer objects
├── Enums/                # PHP 8.1+ enums
├── Events/               # Domain events
├── Listeners/            # Event handlers
└── Policies/             # Authorization
```

## Directory Guidelines

### Controllers
- Maximum 50 lines per file
- Only handle HTTP concerns
- Delegate business logic to Services
- Use dependency injection

### Services
- Maximum 100 lines per file
- Contain business logic
- Depend on interfaces (Contracts)
- No direct model queries

### Models
- Maximum 80 lines (excluding relations)
- Relations only, no business logic
- Use casts for type safety
- Use scopes for reusable queries

### Contracts (Interfaces)
- Define repository interfaces
- Define service interfaces
- Single responsibility
- Located in `app/Contracts/`

### DTOs (Data Transfer Objects)
- Immutable value objects
- Hold data for transfer between layers
- Type-safe alternative to arrays
- Static factory methods

### Actions
- Single, focused business action
- Invocable class `__invoke()`
- Maximum 50 lines
- Reusable across controllers

### Repositories
- Implement Contracts
- Encapsulate data access
- Use Eloquent queries
- No business logic
