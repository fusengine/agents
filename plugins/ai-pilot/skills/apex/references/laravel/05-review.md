# 05 - Review (Laravel)

**Self-review checklist before PR submission.**

## When to Use

- After validation phase passed
- Before creating pull request
- As final quality gate

---

## Code Quality Checklist

### PHP Standards

```text
[ ] declare(strict_types=1) in ALL files
[ ] Full type hints on all parameters
[ ] Return types on all methods
[ ] PHPDoc for complex methods
[ ] No mixed types (unless necessary)
```

### Laravel Conventions

```text
[ ] Models in app/Models/
[ ] Controllers in app/Http/Controllers/
[ ] Requests in app/Http/Requests/
[ ] Resources in app/Http/Resources/
[ ] Services in app/Services/
[ ] Contracts in app/Contracts/
```

---

## SOLID Principles Review

### Single Responsibility

```text
[ ] Controllers only handle HTTP
[ ] Services contain business logic
[ ] Models handle data/relationships
[ ] Requests handle validation
[ ] Resources handle transformation
```

### Open/Closed

```text
[ ] New features extend, not modify
[ ] Interfaces allow extension
[ ] Strategy patterns where needed
```

### Liskov Substitution

```text
[ ] Subtypes respect parent contracts
[ ] Repository implementations interchangeable
```

### Interface Segregation

```text
[ ] Small, focused interfaces
[ ] No "fat" interfaces
[ ] Clients use what they need
```

### Dependency Inversion

```text
[ ] Depend on interfaces, not implementations
[ ] Bindings in ServiceProvider
[ ] Constructor injection used
```

---

## Security Review

### Input Validation

```text
[ ] All input validated via FormRequest
[ ] No raw user input in queries
[ ] Mass assignment protected ($fillable)
```

### Authentication

```text
[ ] Routes protected with middleware
[ ] Policies check authorization
[ ] Sanctum/Passport configured correctly
```

### Data Protection

```text
[ ] Sensitive data encrypted
[ ] Passwords hashed (never plain)
[ ] API keys in .env (not committed)
```

---

## Performance Review

### Eloquent Optimization

```text
[ ] Eager loading used (no N+1)
[ ] Select only needed columns
[ ] Chunking for large datasets
[ ] Indexes on queried columns
```

### Query Examples

```php
// Eager load
$posts = Post::with(['user', 'comments'])->get();

// Select specific columns
$users = User::select(['id', 'name', 'email'])->get();

// Chunking
User::chunk(100, function ($users) {
    foreach ($users as $user) {
        // Process
    }
});
```

### Caching

```text
[ ] Frequently accessed data cached
[ ] Cache invalidation implemented
[ ] Config/routes cached in production
```

---

## File Size Review

### Check All Files

```text
[ ] Controllers < 50 lines
[ ] Models < 80 lines
[ ] Services < 100 lines
[ ] ALL files < 100 lines
```

### Split If Needed

```text
Large Controller -> Multiple Resource Controllers
Large Service -> Specialized Sub-services
Large Model -> Traits for scopes/accessors
```

---

## Documentation Review

### Code Documentation

```text
[ ] Complex logic explained
[ ] Public APIs documented
[ ] Non-obvious decisions commented
```

### PHPDoc Standards

```php
/**
 * Create a new post.
 *
 * @param CreatePostDTO $dto Post data
 * @param int $userId Author ID
 * @return Post Created post
 * @throws ValidationException If title exists
 */
public function create(CreatePostDTO $dto, int $userId): Post
```

---

## Test Coverage Review

### Coverage Targets

```text
[ ] Feature tests for API endpoints
[ ] Unit tests for Services
[ ] Edge cases covered
[ ] Error paths tested
```

### Commands

```bash
# Run with coverage
./vendor/bin/pest --coverage

# Minimum coverage
./vendor/bin/pest --coverage --min=80
```

---

## Database Review

### Migrations

```text
[ ] Proper data types used
[ ] Foreign keys defined
[ ] Indexes on searched columns
[ ] down() method reverses up()
```

### Seeders

```text
[ ] Test data realistic
[ ] Factories use Faker
[ ] Relations seeded correctly
```

---

## Final Checklist

```text
[ ] All quality tools pass (Larastan, Pint, Pest)
[ ] SOLID principles followed
[ ] Security considerations addressed
[ ] Performance optimized
[ ] Files properly sized
[ ] Documentation complete
[ ] Tests comprehensive
```

---

## Review Report Template

```markdown
## Self-Review Completed

### Code Quality: PASS
- All files have strict_types
- Type hints complete
- PHPDoc present

### SOLID: PASS
- SRP followed
- Interfaces in Contracts/
- DI used throughout

### Security: PASS
- Input validated
- Authorization checked
- No sensitive data exposed

### Performance: PASS
- No N+1 queries
- Eager loading used
- Indexes present

### Tests: PASS
- Coverage: 85%
- All tests passing
```

---

## Next Phase

Proceed to `09-create-pr.md`
