# SOLID Principles - PHP Implementation

## S - Single Responsibility

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

## O - Open/Closed

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

## L - Liskov Substitution

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

## I - Interface Segregation

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

## D - Dependency Inversion

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
