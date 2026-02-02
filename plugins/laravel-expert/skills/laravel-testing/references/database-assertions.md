---
name: database-assertions
description: Database assertions - assertDatabaseHas, assertModelExists
file-type: markdown
---

# Database Assertions

## Overview

| Assertion | Description |
|-----------|-------------|
| `assertDatabaseHas()` | Record exists |
| `assertDatabaseMissing()` | Record doesn't exist |
| `assertDatabaseCount()` | Table has count |
| `assertDatabaseEmpty()` | Table is empty |
| `assertModelExists()` | Model exists in DB |
| `assertModelMissing()` | Model deleted |
| `assertSoftDeleted()` | Soft deleted |
| `assertNotSoftDeleted()` | Not soft deleted |

---

## assertDatabaseHas / Missing

```php
$this->assertDatabaseHas('users', ['email' => 'john@example.com']);
$this->assertDatabaseHas('posts', ['user_id' => $user->id, 'title' => 'My Post']);
$this->assertDatabaseHas('users', ['email' => 'test@example.com'], 'mysql'); // Connection

$this->delete('/users/1');
$this->assertDatabaseMissing('users', ['id' => 1]);
```

---

## assertDatabaseCount / Empty

```php
$this->assertDatabaseCount('users', 5);
$this->assertDatabaseCount('logs', 0);
$this->assertDatabaseEmpty('logs');
```

---

## Model Assertions

```php
$user = User::factory()->create();
$this->assertModelExists($user);

$user->delete();
$this->assertModelMissing($user);
```

---

## Soft Delete Assertions

```php
$post = Post::factory()->create();
$post->delete();

$this->assertSoftDeleted($post);
$this->assertSoftDeleted('posts', ['id' => $post->id]);

$post->restore();
$this->assertNotSoftDeleted($post);
```

---

## Testing CRUD

```php
// Create
$this->post('/users', $data);
$this->assertDatabaseHas('users', ['email' => $data['email']]);

// Update
$this->patch('/profile', ['name' => 'New Name']);
$this->assertDatabaseHas('users', ['id' => $user->id, 'name' => 'New Name']);

// Delete
$this->delete("/posts/{$post->id}");
$this->assertDatabaseMissing('posts', ['id' => $post->id]);
```

---

## Query Count (N+1)

```php
it('avoids N+1 queries', function () {
    Post::factory()->count(10)->create();
    $this->expectsDatabaseQueryCount(2); // 1 posts + 1 users
    Post::with('user')->get()->each->user->name;
});
```

---

## Decision Tree

```
Database check?
├── Record exists → assertDatabaseHas()
├── Record missing → assertDatabaseMissing()
├── Count records → assertDatabaseCount()
├── Model state → assertModelExists()
├── Soft deleted → assertSoftDeleted()
└── Query count → expectsDatabaseQueryCount()
```

---

## Best Practices

| DO | DON'T |
|----|-------|
| Assert on specific columns | Assert on auto-increment IDs |
| Test creation and deletion | Forget to test deletions |
| Check soft delete states | Skip relationship assertions |
