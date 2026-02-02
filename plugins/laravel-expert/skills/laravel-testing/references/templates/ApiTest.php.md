---
name: ApiTest
description: REST API test template with JSON assertions and Sanctum auth
file-type: template
---

# API Test Template

## Complete REST API Test

```php
<?php

declare(strict_types=1);

use App\Models\User;
use App\Models\Post;
use Laravel\Sanctum\Sanctum;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\Fluent\AssertableJson;

uses(RefreshDatabase::class);

describe('Posts API', function () {
    beforeEach(function () {
        $this->user = User::factory()->create();
    });

    describe('GET /api/posts', function () {
        it('returns paginated posts', function () {
            Post::factory()->count(15)->create();

            Sanctum::actingAs($this->user);

            $this->getJson('/api/posts')
                ->assertOk()
                ->assertJsonStructure([
                    'data' => [
                        '*' => ['id', 'title', 'content', 'created_at'],
                    ],
                    'meta' => ['current_page', 'total', 'per_page'],
                    'links' => ['first', 'last', 'prev', 'next'],
                ])
                ->assertJsonCount(10, 'data')
                ->assertJsonPath('meta.total', 15);
        });

        it('filters posts by status', function () {
            Post::factory()->published()->count(5)->create();
            Post::factory()->draft()->count(3)->create();

            Sanctum::actingAs($this->user);

            $this->getJson('/api/posts?status=published')
                ->assertOk()
                ->assertJsonCount(5, 'data');
        });

        it('requires authentication', function () {
            $this->getJson('/api/posts')
                ->assertUnauthorized();
        });
    });

    describe('GET /api/posts/{id}', function () {
        it('returns single post with relations', function () {
            $post = Post::factory()
                ->for($this->user)
                ->has(Comment::factory()->count(3))
                ->create();

            Sanctum::actingAs($this->user);

            $this->getJson("/api/posts/{$post->id}")
                ->assertOk()
                ->assertJson(fn (AssertableJson $json) =>
                    $json->has('data', fn ($json) =>
                        $json->where('id', $post->id)
                            ->where('title', $post->title)
                            ->has('author', fn ($json) =>
                                $json->where('id', $this->user->id)
                                    ->where('name', $this->user->name)
                                    ->etc()
                            )
                            ->has('comments', 3)
                            ->etc()
                    )
                );
        });

        it('returns 404 for missing post', function () {
            Sanctum::actingAs($this->user);

            $this->getJson('/api/posts/999')
                ->assertNotFound()
                ->assertJson([
                    'message' => 'Post not found',
                ]);
        });
    });

    describe('POST /api/posts', function () {
        it('creates post with valid data', function () {
            Sanctum::actingAs($this->user);

            $data = [
                'title' => 'New API Post',
                'content' => 'Content from API',
                'tags' => ['laravel', 'api'],
            ];

            $this->postJson('/api/posts', $data)
                ->assertCreated()
                ->assertJson(fn (AssertableJson $json) =>
                    $json->has('data', fn ($json) =>
                        $json->where('title', 'New API Post')
                            ->where('content', 'Content from API')
                            ->whereType('id', 'integer')
                            ->etc()
                    )
                );

            $this->assertDatabaseHas('posts', [
                'user_id' => $this->user->id,
                'title' => 'New API Post',
            ]);
        });

        it('validates required fields', function () {
            Sanctum::actingAs($this->user);

            $this->postJson('/api/posts', [])
                ->assertUnprocessable()
                ->assertJsonValidationErrors(['title', 'content']);
        });

        it('validates field types', function () {
            Sanctum::actingAs($this->user);

            $this->postJson('/api/posts', [
                'title' => str_repeat('a', 256), // Too long
                'content' => '',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'title' => 'must not be greater than 255',
                'content' => 'required',
            ]);
        });
    });

    describe('PUT /api/posts/{id}', function () {
        it('updates own post', function () {
            $post = Post::factory()->for($this->user)->create();

            Sanctum::actingAs($this->user);

            $this->putJson("/api/posts/{$post->id}", [
                'title' => 'Updated Title',
            ])
            ->assertOk()
            ->assertJsonPath('data.title', 'Updated Title');

            $this->assertDatabaseHas('posts', [
                'id' => $post->id,
                'title' => 'Updated Title',
            ]);
        });

        it('forbids updating others posts', function () {
            $otherUser = User::factory()->create();
            $post = Post::factory()->for($otherUser)->create();

            Sanctum::actingAs($this->user);

            $this->putJson("/api/posts/{$post->id}", [
                'title' => 'Hacked',
            ])
            ->assertForbidden();
        });
    });

    describe('DELETE /api/posts/{id}', function () {
        it('deletes own post', function () {
            $post = Post::factory()->for($this->user)->create();

            Sanctum::actingAs($this->user);

            $this->deleteJson("/api/posts/{$post->id}")
                ->assertNoContent();

            $this->assertDatabaseMissing('posts', ['id' => $post->id]);
        });

        it('returns 404 for already deleted', function () {
            $post = Post::factory()->for($this->user)->create();
            $postId = $post->id;
            $post->delete();

            Sanctum::actingAs($this->user);

            $this->deleteJson("/api/posts/{$postId}")
                ->assertNotFound();
        });
    });
});
```

## API with Token Abilities

```php
<?php

describe('API Token Abilities', function () {
    it('allows read with read token', function () {
        $user = User::factory()->create();

        Sanctum::actingAs($user, ['posts:read']);

        $this->getJson('/api/posts')->assertOk();
    });

    it('forbids write with read-only token', function () {
        $user = User::factory()->create();

        Sanctum::actingAs($user, ['posts:read']);

        $this->postJson('/api/posts', ['title' => 'Test'])
            ->assertForbidden();
    });

    it('allows all with wildcard token', function () {
        $user = User::factory()->create();

        Sanctum::actingAs($user, ['*']);

        $this->postJson('/api/posts', [
            'title' => 'Test',
            'content' => 'Content',
        ])->assertCreated();
    });
});
```

## API Error Responses

```php
<?php

describe('API Error Handling', function () {
    it('returns consistent error format', function () {
        Sanctum::actingAs(User::factory()->create());

        $this->getJson('/api/posts/invalid')
            ->assertNotFound()
            ->assertJsonStructure([
                'message',
                'errors' => [],
            ]);
    });

    it('handles rate limiting', function () {
        Sanctum::actingAs(User::factory()->create());

        // Make many requests
        for ($i = 0; $i < 61; $i++) {
            $this->getJson('/api/posts');
        }

        $this->getJson('/api/posts')
            ->assertTooManyRequests()
            ->assertHeader('Retry-After');
    });
});
```
