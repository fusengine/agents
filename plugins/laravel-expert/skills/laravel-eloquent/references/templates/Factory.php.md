---
name: Factory.php
description: Complete model factory with states, sequences, relationships
file-type: php
---

# Factory Template

## Complete Factory

```php
<?php

namespace Database\Factories;

use App\Enums\PostStatus;
use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Post>
 */
class PostFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     */
    protected $model = Post::class;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        $title = fake()->sentence();

        return [
            'title' => $title,
            'slug' => Str::slug($title),
            'excerpt' => fake()->paragraph(),
            'content' => fake()->paragraphs(5, true),
            'status' => PostStatus::Draft,
            'views' => fake()->numberBetween(0, 1000),
            'is_featured' => false,
            'published_at' => null,
            'author_id' => User::factory(),
            'category_id' => Category::factory(),
            'metadata' => [
                'reading_time' => fake()->numberBetween(1, 15),
                'seo_title' => $title,
            ],
        ];
    }

    // ========================================
    // STATES
    // ========================================

    /**
     * Indicate the post is published.
     */
    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => PostStatus::Published,
            'published_at' => fake()->dateTimeBetween('-1 year', 'now'),
        ]);
    }

    /**
     * Indicate the post is scheduled.
     */
    public function scheduled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => PostStatus::Scheduled,
            'published_at' => fake()->dateTimeBetween('+1 day', '+1 month'),
        ]);
    }

    /**
     * Indicate the post is a draft.
     */
    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => PostStatus::Draft,
            'published_at' => null,
        ]);
    }

    /**
     * Indicate the post is featured.
     */
    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
        ]);
    }

    /**
     * Indicate the post is popular.
     */
    public function popular(): static
    {
        return $this->state(fn (array $attributes) => [
            'views' => fake()->numberBetween(10000, 100000),
        ]);
    }

    /**
     * Indicate the post has long content.
     */
    public function longForm(): static
    {
        return $this->state(fn (array $attributes) => [
            'content' => fake()->paragraphs(20, true),
            'metadata' => [
                ...$attributes['metadata'] ?? [],
                'reading_time' => fake()->numberBetween(15, 30),
            ],
        ]);
    }

    // ========================================
    // SEQUENCES
    // ========================================

    /**
     * Cycle through statuses.
     */
    public function withRotatingStatus(): static
    {
        return $this->sequence(
            ['status' => PostStatus::Draft],
            ['status' => PostStatus::Published, 'published_at' => now()],
            ['status' => PostStatus::Scheduled, 'published_at' => now()->addWeek()],
        );
    }

    /**
     * Sequential titles.
     */
    public function withSequentialTitles(): static
    {
        return $this->sequence(fn ($sequence) => [
            'title' => "Post Number {$sequence->index}",
            'slug' => "post-number-{$sequence->index}",
        ]);
    }

    // ========================================
    // RELATIONSHIPS
    // ========================================

    /**
     * Add comments to the post.
     */
    public function withComments(int $count = 3): static
    {
        return $this->has(
            Comment::factory()->count($count),
            'comments'
        );
    }

    /**
     * Add tags to the post.
     */
    public function withTags(int $count = 3): static
    {
        return $this->hasAttached(
            Tag::factory()->count($count),
            [],
            'tags'
        );
    }

    /**
     * Add specific tags.
     */
    public function withSpecificTags(array $tags): static
    {
        return $this->afterCreating(function (Post $post) use ($tags) {
            $tagModels = collect($tags)->map(fn ($name) =>
                Tag::firstOrCreate(['name' => $name])
            );
            $post->tags()->attach($tagModels->pluck('id'));
        });
    }

    // ========================================
    // CALLBACKS
    // ========================================

    /**
     * Configure the factory.
     */
    public function configure(): static
    {
        return $this->afterMaking(function (Post $post) {
            // Called after make() - model not persisted
        })->afterCreating(function (Post $post) {
            // Called after create() - model persisted
        });
    }
}
```

---

## User Factory

```php
<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected static ?string $password;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate email is unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn () => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * Indicate user is admin.
     */
    public function admin(): static
    {
        return $this->state(fn () => [
            'is_admin' => true,
        ])->afterCreating(function (User $user) {
            $user->assignRole('admin');
        });
    }

    /**
     * With subscription.
     */
    public function subscribed(): static
    {
        return $this->has(
            Subscription::factory()->active(),
            'subscription'
        );
    }

    /**
     * With posts.
     */
    public function withPosts(int $count = 3): static
    {
        return $this->has(
            Post::factory()->count($count)->published(),
            'posts'
        );
    }
}
```

---

## Factory Usage Examples

```php
<?php

// Basic creation
$user = User::factory()->create();
$users = User::factory()->count(10)->create();

// Without persisting
$user = User::factory()->make();

// With attribute override
$user = User::factory()->create([
    'name' => 'John Doe',
    'email' => 'john@example.com',
]);

// With states
$user = User::factory()
    ->admin()
    ->unverified()
    ->create();

// With relationships
$user = User::factory()
    ->has(Post::factory()->count(3)->published())
    ->has(Comment::factory()->count(5))
    ->create();

// Magic relationship methods
$user = User::factory()
    ->hasPosts(3)
    ->hasComments(5)
    ->create();

// BelongsTo relationship
$post = Post::factory()
    ->for(User::factory()->admin())
    ->create();

// With existing model
$user = User::factory()->create();
$posts = Post::factory()
    ->count(5)
    ->for($user)
    ->create();

// Recycle models (reuse same related model)
$user = User::factory()->create();
$posts = Post::factory()
    ->count(5)
    ->recycle($user)
    ->create();

// Many-to-many with pivot data
$user = User::factory()
    ->hasAttached(
        Role::factory()->count(3),
        ['active' => true]
    )
    ->create();

// Sequences
$users = User::factory()
    ->count(10)
    ->sequence(
        ['is_admin' => true],
        ['is_admin' => false],
    )
    ->create();

// Sequence with index
$posts = Post::factory()
    ->count(5)
    ->sequence(fn ($sequence) => [
        'title' => "Post #{$sequence->index}",
    ])
    ->create();
```

---

## Database Seeder

```php
<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        $admin = User::factory()->admin()->create([
            'email' => 'admin@example.com',
        ]);

        // Create regular users with posts
        User::factory()
            ->count(10)
            ->has(
                Post::factory()
                    ->count(5)
                    ->published()
                    ->withComments(3)
                    ->withTags(2)
            )
            ->create();

        // Create featured posts for admin
        Post::factory()
            ->count(3)
            ->featured()
            ->published()
            ->popular()
            ->for($admin)
            ->create();
    }
}
```
