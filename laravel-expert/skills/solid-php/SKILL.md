---
name: solid-php
description: SOLID principles for Laravel 12 and PHP 8.5. Files < 100 lines, interfaces separated, PHPDoc mandatory.
---

# SOLID PHP - Laravel 12 + PHP 8.5

## Current Date (CRITICAL)

**Today: January 2026** - ALWAYS use the current year for your searches.
Search with "2025" or "2026", NEVER with past years.

## MANDATORY: Research Before Coding

**CRITICAL: Check today's date first, then search documentation and web BEFORE writing any code.**

1. **Use Context7** to query Laravel/PHP official documentation
2. **Use Exa web search** with current year for latest trends
3. **Check Laravel News** of current year for new features
4. **Verify package versions** for Laravel 12 compatibility

```text
WORKFLOW:
1. Check date → 2. Research docs + web (current year) → 3. Apply latest patterns → 4. Code
```

**Search queries (replace YYYY with current year):**
- `Laravel [feature] YYYY best practices`
- `PHP 8.5 [feature] YYYY`
- `Livewire 3 [component] YYYY`
- `Pest PHP testing YYYY`

Never assume - always verify current APIs and patterns exist for the current year.

---

## Codebase Analysis (MANDATORY)

**Before ANY implementation:**
1. Explore project structure to understand architecture
2. Read existing related files to follow established patterns
3. Identify naming conventions, coding style, and patterns used
4. Understand data flow and dependencies

**Continue implementation by:**
- Following existing patterns and conventions
- Matching the coding style already in place
- Respecting the established architecture
- Integrating with existing services/components

## DRY - Reuse Before Creating (MANDATORY)

**Before writing ANY new code:**
1. Search existing codebase for similar functionality
2. Check shared locations: `app/Services/`, `app/Actions/`, `app/Traits/`
3. If similar code exists → extend/reuse instead of duplicate

**When creating new code:**
- Extract repeated logic (3+ occurrences) into shared helpers
- Place shared utilities in `app/Services/` or `app/Actions/`
- Use Traits for cross-cutting concerns
- Document reusable functions with PHPDoc

---

## Absolute Rules (MANDATORY)

### 1. Files < 100 lines
- **Split at 90 lines** - Never exceed 100
- Controllers < 50 lines
- Models < 80 lines (excluding relations)
- Services < 100 lines

### 2. Interfaces Separated
```
app/
├── Contracts/           # Interfaces ONLY
│   ├── UserRepositoryInterface.php
│   └── PaymentGatewayInterface.php
├── Repositories/        # Implementations
│   └── EloquentUserRepository.php
└── Services/            # Business logic
    └── UserService.php
```

### 3. PHPDoc Mandatory
```php
/**
 * Create a new user from DTO.
 *
 * @param CreateUserDTO $dto User data transfer object
 * @return User Created user model
 * @throws ValidationException If email already exists
 */
public function create(CreateUserDTO $dto): User
```

### 4. Split Strategy
```
UserService.php (main)
├── UserValidator.php (validation)
├── UserDTO.php (types)
└── UserHelper.php (utils)
```

---

## SOLID Principles

### S - Single Responsibility

**1 class = 1 responsibility**

```php
// ❌ BAD - Fat Controller
class UserController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([...]);
        $user = User::create($validated);
        Mail::send(new WelcomeEmail($user));
        return response()->json($user);
    }
}

// ✅ GOOD - Thin Controller
class UserController extends Controller
{
    public function __construct(
        private UserService $userService,
    ) {}

    public function store(StoreUserRequest $request): JsonResponse
    {
        $user = $this->userService->create(
            CreateUserDTO::fromRequest($request)
        );

        return response()->json($user, 201);
    }
}
```

### O - Open/Closed

**Open for extension, closed for modification**

```php
// Extensible interface
interface PaymentGatewayInterface
{
    public function charge(Money $amount): PaymentResult;
}

// New implementations without modifying existing code
class StripeGateway implements PaymentGatewayInterface { }
class PayPalGateway implements PaymentGatewayInterface { }
```

### L - Liskov Substitution

**Subtypes must be substitutable**

```php
interface NotificationInterface
{
    public function send(User $user, string $message): bool;
}

// All implementations respect the contract
class EmailNotification implements NotificationInterface { }
class SmsNotification implements NotificationInterface { }
```

### I - Interface Segregation

**Specific interfaces, not generic ones**

```php
// ❌ BAD - Interface too broad
interface UserInterface
{
    public function create();
    public function sendEmail();
    public function generateReport();
}

// ✅ GOOD - Separated interfaces
interface CrudInterface { }
interface NotifiableInterface { }
interface ReportableInterface { }
```

### D - Dependency Inversion

**Depend on abstractions**

```php
// app/Providers/AppServiceProvider.php
public function register(): void
{
    $this->app->bind(
        UserRepositoryInterface::class,
        EloquentUserRepository::class
    );
}

// Service depends on interface
class UserService
{
    public function __construct(
        private UserRepositoryInterface $repository,
    ) {}
}
```

---

## PHP 8.5 Features

### Pipe Operator
```php
// ❌ Old style
$result = array_sum(array_filter(array_map(fn($x) => $x * 2, $data)));

// ✅ PHP 8.5 - Pipe operator
$result = $data
    |> array_map(fn($x) => $x * 2, ...)
    |> array_filter(...)
    |> array_sum(...);
```

### Clone With (readonly classes)
```php
readonly class UserDTO
{
    public function __construct(
        public string $name,
        public string $email,
    ) {}
}

// PHP 8.5 - clone with
$updated = clone($dto, email: 'new@email.com');
```

### #[\NoDiscard] Attribute
```php
#[\NoDiscard("Result must be used")]
public function calculate(): Result
{
    return new Result();
}

// Warning if result ignored
$this->calculate(); // ⚠️ Warning
$result = $this->calculate(); // ✅ OK
```

---

## Laravel 12 Structure

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

---

## Templates

### Service Template (< 100 lines)
```php
<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\UserRepositoryInterface;
use App\DTOs\CreateUserDTO;
use App\Models\User;

/**
 * User service for business logic.
 */
final readonly class UserService
{
    public function __construct(
        private UserRepositoryInterface $repository,
    ) {}

    /**
     * Create a new user.
     */
    public function create(CreateUserDTO $dto): User
    {
        return $this->repository->create($dto);
    }
}
```

### DTO Template
```php
<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Http\Requests\StoreUserRequest;

/**
 * User creation data transfer object.
 */
readonly class CreateUserDTO
{
    public function __construct(
        public string $name,
        public string $email,
        public ?string $phone = null,
    ) {}

    public static function fromRequest(StoreUserRequest $request): self
    {
        return new self(
            name: $request->validated('name'),
            email: $request->validated('email'),
            phone: $request->validated('phone'),
        );
    }
}
```

### Interface Template
```php
<?php

declare(strict_types=1);

namespace App\Contracts;

use App\DTOs\CreateUserDTO;
use App\Models\User;
use Illuminate\Support\Collection;

/**
 * User repository contract.
 */
interface UserRepositoryInterface
{
    public function create(CreateUserDTO $dto): User;
    public function findById(int $id): ?User;
    public function findAll(): Collection;
}
```

---

## Response Guidelines

1. **Research first** - MANDATORY: Search Context7 + Exa before ANY code
2. **Show complete code** - Working examples, not snippets
3. **Explain decisions** - Why this pattern over alternatives
4. **Include tests** - Always suggest Pest test cases
5. **Handle errors** - Never ignore exceptions
6. **Type everything** - Full type hints, return types
7. **Document code** - PHPDoc for complex methods

---

## Forbidden

- ❌ Coding without researching docs first (ALWAYS research)
- ❌ Using outdated APIs without checking current year docs
- ❌ Files > 100 lines
- ❌ Controllers > 50 lines
- ❌ Interfaces in implementation files
- ❌ Business logic in Models/Controllers
- ❌ Concrete dependencies (always use interfaces)
- ❌ Code without PHPDoc
- ❌ Missing `declare(strict_types=1)`
- ❌ Fat classes (> 5 public methods)
- ❌ N+1 queries (use eager loading)
- ❌ Raw queries without bindings
- ❌ Using `array` instead of DTOs for complex data
