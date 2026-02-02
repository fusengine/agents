---
name: http-json
description: JSON API testing and fluent assertions
file-type: markdown
---

# JSON API Testing

## Basic JSON Assertions

```php
$this->getJson('/api/users')
    ->assertOk()
    ->assertJson(['data' => [['name' => 'John']]]); // Partial match

$this->getJson('/api/user/1')
    ->assertExactJson(['id' => 1, 'name' => 'John']); // Exact match
```

---

## assertJsonPath & Structure

```php
$this->getJson('/api/users')
    ->assertJsonPath('data.0.name', 'John')
    ->assertJsonPath('meta.total', 10)
    ->assertJsonStructure([
        'data' => ['*' => ['id', 'name', 'email']],
        'meta' => ['total', 'per_page'],
    ]);
```

---

## Fluent JSON Testing

```php
use Illuminate\Testing\Fluent\AssertableJson;

$this->getJson('/api/users')
    ->assertJson(fn (AssertableJson $json) =>
        $json->has('data', 3)
            ->has('data.0', fn ($j) =>
                $j->where('id', 1)->where('name', 'John')->whereType('email', 'string')->etc()
            )
            ->has('meta.total')
    );
```

---

## Fluent Methods

| Method | Description |
|--------|-------------|
| `has($key)` | Key exists |
| `has($key, $count)` | Array has count |
| `missing($key)` | Key doesn't exist |
| `where($key, $val)` | Exact value |
| `whereType($key, $type)` | Type check |
| `whereNot($key, $val)` | Not equal |
| `etc()` | Allow other keys |
| `first(fn)` / `each(fn)` | Assert items |

---

## Type Assertions

```php
$json
    ->whereType('id', 'integer')
    ->whereType('active', 'boolean')
    ->whereType('price', 'double')
    ->whereType('name', 'string')
    ->whereType('tags', 'array')
    ->whereType('id', ['integer', 'string']); // Multiple
```

---

## Collection Assertions

```php
$this->getJson('/api/posts')
    ->assertJsonCount(5, 'data')
    ->assertJson(fn ($json) =>
        $json->each(fn ($post) => $post->has('id')->has('title')->whereType('id', 'integer'))
    );
```

---

## Validation Errors

```php
$this->postJson('/api/users', [])
    ->assertUnprocessable()
    ->assertJsonValidationErrors(['email', 'name'])
    ->assertJsonValidationErrorFor('email');
```

---

## Decision Tree

```
JSON assertion?
├── Partial match → assertJson()
├── Exact match → assertExactJson()
├── Single value → assertJsonPath()
├── Structure only → assertJsonStructure()
├── Complex logic → Fluent assertions
└── Validation → assertJsonValidationErrors()
```

---

## Best Practices

| DO | DON'T |
|----|-------|
| Use `etc()` in fluent tests | Over-specify with assertExactJson |
| Test structure before values | Forget to test error responses |
| Use `assertJsonPath` for deep values | Skip validation error tests |
