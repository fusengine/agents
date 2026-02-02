---
name: FeatureTest
description: Complete feature test template with authentication and database
file-type: template
---

# Feature Test Template

## Basic Feature Test

```php
<?php

declare(strict_types=1);

use App\Models\User;
use App\Models\Post;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

describe('Posts Feature', function () {
    beforeEach(function () {
        $this->user = User::factory()->create();
    });

    describe('Index', function () {
        it('lists all posts for authenticated user', function () {
            $posts = Post::factory()->count(3)->for($this->user)->create();

            $this->actingAs($this->user)
                ->get('/posts')
                ->assertOk()
                ->assertSee($posts->first()->title);
        });

        it('redirects guests to login', function () {
            $this->get('/posts')
                ->assertRedirect('/login');
        });
    });

    describe('Create', function () {
        it('shows create form', function () {
            $this->actingAs($this->user)
                ->get('/posts/create')
                ->assertOk()
                ->assertSee('Create Post');
        });

        it('creates post with valid data', function () {
            $data = [
                'title' => 'My New Post',
                'content' => 'Post content here',
            ];

            $this->actingAs($this->user)
                ->post('/posts', $data)
                ->assertRedirect('/posts');

            $this->assertDatabaseHas('posts', [
                'user_id' => $this->user->id,
                'title' => 'My New Post',
            ]);
        });

        it('validates required fields', function () {
            $this->actingAs($this->user)
                ->post('/posts', [])
                ->assertSessionHasErrors(['title', 'content']);
        });
    });

    describe('Update', function () {
        it('updates own post', function () {
            $post = Post::factory()->for($this->user)->create();

            $this->actingAs($this->user)
                ->put("/posts/{$post->id}", ['title' => 'Updated Title'])
                ->assertRedirect();

            expect($post->fresh()->title)->toBe('Updated Title');
        });

        it('cannot update others post', function () {
            $otherUser = User::factory()->create();
            $post = Post::factory()->for($otherUser)->create();

            $this->actingAs($this->user)
                ->put("/posts/{$post->id}", ['title' => 'Hacked'])
                ->assertForbidden();
        });
    });

    describe('Delete', function () {
        it('deletes own post', function () {
            $post = Post::factory()->for($this->user)->create();

            $this->actingAs($this->user)
                ->delete("/posts/{$post->id}")
                ->assertRedirect('/posts');

            $this->assertDatabaseMissing('posts', ['id' => $post->id]);
        });

        it('soft deletes when trait used', function () {
            $post = Post::factory()->for($this->user)->create();

            $this->actingAs($this->user)
                ->delete("/posts/{$post->id}");

            $this->assertSoftDeleted($post);
        });
    });
});
```

## With Events and Jobs

```php
<?php

use App\Events\PostCreated;
use App\Jobs\NotifySubscribers;
use App\Mail\PostPublished;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Queue;

describe('Post Publishing', function () {
    beforeEach(function () {
        Event::fake();
        Mail::fake();
        Queue::fake();

        $this->user = User::factory()->create();
    });

    it('dispatches event when post created', function () {
        $this->actingAs($this->user)
            ->post('/posts', [
                'title' => 'New Post',
                'content' => 'Content',
            ]);

        Event::assertDispatched(PostCreated::class, fn ($event) =>
            $event->post->title === 'New Post'
        );
    });

    it('queues notification job', function () {
        $post = Post::factory()->for($this->user)->create();

        $this->actingAs($this->user)
            ->post("/posts/{$post->id}/publish");

        Queue::assertPushed(NotifySubscribers::class, fn ($job) =>
            $job->post->id === $post->id
        );
    });

    it('sends email to subscribers', function () {
        $post = Post::factory()->for($this->user)->published()->create();

        $this->actingAs($this->user)
            ->post("/posts/{$post->id}/notify");

        Mail::assertSent(PostPublished::class);
    });
});
```

## With File Uploads

```php
<?php

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

describe('Post Images', function () {
    beforeEach(function () {
        Storage::fake('public');
        $this->user = User::factory()->create();
    });

    it('uploads featured image', function () {
        $file = UploadedFile::fake()->image('featured.jpg', 800, 600);

        $this->actingAs($this->user)
            ->post('/posts', [
                'title' => 'Post with Image',
                'content' => 'Content',
                'image' => $file,
            ])
            ->assertRedirect();

        Storage::disk('public')->assertExists('posts/' . $file->hashName());
    });

    it('validates image type', function () {
        $file = UploadedFile::fake()->create('document.pdf', 100);

        $this->actingAs($this->user)
            ->post('/posts', [
                'title' => 'Post',
                'content' => 'Content',
                'image' => $file,
            ])
            ->assertSessionHasErrors('image');
    });
});
```
