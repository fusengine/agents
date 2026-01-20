# 07 - Add Test (Laravel)

**Write tests for Laravel features using Pest PHP.**

## When to Use

- After implementation complete
- Before creating PR
- When fixing bugs (TDD approach)

---

## Test Types in Laravel

### Feature Tests

```text
Purpose: Test HTTP endpoints and workflows
Location: tests/Feature/
Scope: Full request lifecycle
```

### Unit Tests

```text
Purpose: Test individual classes/methods
Location: tests/Unit/
Scope: Single unit in isolation
```

### Architecture Tests

```text
Purpose: Enforce code structure
Location: tests/Architecture/
Scope: Codebase conventions
```

---

## Pest Feature Test Template

```php
<?php

declare(strict_types=1);

use App\Models\Post;
use App\Models\User;

describe('PostController', function () {
    beforeEach(function () {
        $this->user = User::factory()->create();
    });

    it('lists all posts', function () {
        Post::factory()->count(3)->create();

        $this->getJson('/api/v1/posts')
            ->assertOk()
            ->assertJsonCount(3, 'data');
    });

    it('creates a post when authenticated', function () {
        $data = [
            'title' => 'Test Post',
            'content' => 'Test content',
        ];

        $this->actingAs($this->user)
            ->postJson('/api/v1/posts', $data)
            ->assertCreated()
            ->assertJsonPath('data.title', 'Test Post');

        $this->assertDatabaseHas('posts', ['title' => 'Test Post']);
    });

    it('returns 401 for unauthenticated users', function () {
        $this->postJson('/api/v1/posts', [])
            ->assertUnauthorized();
    });

    it('validates required fields', function () {
        $this->actingAs($this->user)
            ->postJson('/api/v1/posts', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['title', 'content']);
    });
});
```

---

## Pest Unit Test Template

```php
<?php

declare(strict_types=1);

use App\DTOs\CreatePostDTO;
use App\Models\Post;
use App\Services\PostService;
use App\Contracts\PostRepositoryInterface;

describe('PostService', function () {
    it('creates a post with valid data', function () {
        $repository = Mockery::mock(PostRepositoryInterface::class);
        $repository->shouldReceive('create')
            ->once()
            ->andReturn(new Post(['title' => 'Test']));

        $service = new PostService($repository);
        $dto = new CreatePostDTO(title: 'Test', content: 'Content');

        $post = $service->create($dto, userId: 1);

        expect($post->title)->toBe('Test');
    });

    it('generates slug from title', function () {
        $repository = Mockery::mock(PostRepositoryInterface::class);
        $repository->shouldReceive('create')
            ->once()
            ->with(Mockery::on(fn ($data) => $data['slug'] === 'my-post-title'))
            ->andReturn(new Post(['slug' => 'my-post-title']));

        $service = new PostService($repository);
        $dto = new CreatePostDTO(title: 'My Post Title', content: 'Content');

        $service->create($dto, userId: 1);
    });
});
```

---

## Architecture Tests

```php
<?php

declare(strict_types=1);

arch('strict types everywhere')
    ->expect('App')
    ->toUseStrictTypes();

arch('services have suffix')
    ->expect('App\Services')
    ->toHaveSuffix('Service')
    ->toBeClasses()
    ->toBeFinal();

arch('controllers extend base')
    ->expect('App\Http\Controllers')
    ->toHaveSuffix('Controller')
    ->toExtend('App\Http\Controllers\Controller');

arch('models in correct namespace')
    ->expect('App\Models')
    ->toExtend('Illuminate\Database\Eloquent\Model');

arch('interfaces in contracts')
    ->expect('App\Contracts')
    ->toBeInterfaces();

arch('no debugging functions')
    ->expect(['dd', 'dump', 'ray', 'var_dump'])
    ->not->toBeUsed();
```

---

## Factory Usage

```php
<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\PostStatus;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

final class PostFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => fake()->sentence(),
            'slug' => fake()->slug(),
            'content' => fake()->paragraphs(3, true),
            'status' => PostStatus::Draft,
            'published_at' => null,
        ];
    }

    public function published(): static
    {
        return $this->state([
            'status' => PostStatus::Published,
            'published_at' => now(),
        ]);
    }
}
```

---

## Testing Patterns

### Dataset Tests

```php
it('validates email formats', function (string $email, bool $valid) {
    $response = $this->postJson('/api/users', ['email' => $email]);

    if ($valid) {
        $response->assertSuccessful();
    } else {
        $response->assertJsonValidationErrors(['email']);
    }
})->with([
    ['valid@email.com', true],
    ['user.name@domain.org', true],
    ['invalid-email', false],
    ['', false],
]);
```

### Testing Exceptions

```php
it('throws exception for invalid user', function () {
    $service = app(UserService::class);

    expect(fn () => $service->find(9999))
        ->toThrow(ModelNotFoundException::class);
});
```

---

## HTTP Test Assertions

```php
// Status codes
$response->assertOk();           // 200
$response->assertCreated();      // 201
$response->assertNoContent();    // 204
$response->assertUnauthorized(); // 401
$response->assertForbidden();    // 403
$response->assertNotFound();     // 404
$response->assertUnprocessable(); // 422

// JSON assertions
$response->assertJson(['key' => 'value']);
$response->assertJsonPath('data.id', 1);
$response->assertJsonCount(3, 'data');
$response->assertJsonStructure(['data' => ['id', 'title']]);

// Database
$this->assertDatabaseHas('posts', ['title' => 'Test']);
$this->assertDatabaseMissing('posts', ['title' => 'Deleted']);
$this->assertSoftDeleted('posts', ['id' => 1]);
```

---

## Mocking in Laravel

### Mock Facades

```php
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Notification;

Mail::fake();
Notification::fake();

// After action
Mail::assertSent(WelcomeEmail::class);
Notification::assertSentTo($user, OrderShipped::class);
```

### Mock Services

```php
$this->mock(PaymentService::class, function ($mock) {
    $mock->shouldReceive('charge')
        ->once()
        ->andReturn(true);
});
```

---

## Test Commands

```bash
# Run all tests
php artisan test

# Run with Pest directly
./vendor/bin/pest

# Run specific file
./vendor/bin/pest tests/Feature/PostControllerTest.php

# Run by filter
./vendor/bin/pest --filter="creates a post"

# Run with coverage
./vendor/bin/pest --coverage --min=80

# Run in parallel
./vendor/bin/pest --parallel
```

---

## Test Checklist

```text
[ ] Feature tests for API endpoints
[ ] Unit tests for Services
[ ] Architecture tests for structure
[ ] Happy path covered
[ ] Error cases covered
[ ] Edge cases covered
[ ] Factories properly defined
[ ] Tests run successfully
```

---

## Next Phase

Proceed to `08-check-test.md`
