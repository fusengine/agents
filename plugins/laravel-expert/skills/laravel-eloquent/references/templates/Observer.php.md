---
name: Observer.php
description: Complete model observer with all events
file-type: php
---

# Observer Template

## Complete Observer

```php
<?php

namespace App\Observers;

use App\Models\Post;
use App\Services\SearchService;
use App\Services\CacheService;
use App\Notifications\PostPublished;
use Illuminate\Contracts\Events\ShouldHandleEventsAfterCommit;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class PostObserver implements ShouldHandleEventsAfterCommit
{
    public function __construct(
        protected SearchService $search,
        protected CacheService $cache,
    ) {}

    /**
     * Handle the Post "retrieved" event.
     * Fired when a model is retrieved from the database.
     */
    public function retrieved(Post $post): void
    {
        // Track view count, analytics, etc.
        Log::debug("Post retrieved: {$post->id}");
    }

    /**
     * Handle the Post "creating" event.
     * Fired before a new model is inserted.
     * Return false to cancel the operation.
     */
    public function creating(Post $post): bool
    {
        // Generate slug if not provided
        if (empty($post->slug)) {
            $post->slug = Str::slug($post->title);
        }

        // Ensure unique slug
        $post->slug = $this->ensureUniqueSlug($post);

        // Set defaults
        $post->views = 0;
        $post->reading_time = $this->calculateReadingTime($post->content);

        return true; // Continue with creation
    }

    /**
     * Handle the Post "created" event.
     * Fired after a new model is inserted.
     */
    public function created(Post $post): void
    {
        // Index in search engine
        $this->search->index($post);

        // Clear relevant caches
        $this->cache->tags(['posts', "user:{$post->author_id}"])->flush();

        Log::info("Post created: {$post->id}");
    }

    /**
     * Handle the Post "updating" event.
     * Fired before an existing model is updated.
     * Return false to cancel the operation.
     */
    public function updating(Post $post): bool
    {
        // Regenerate slug if title changed
        if ($post->isDirty('title')) {
            $post->slug = $this->ensureUniqueSlug($post);
        }

        // Recalculate reading time if content changed
        if ($post->isDirty('content')) {
            $post->reading_time = $this->calculateReadingTime($post->content);
        }

        return true;
    }

    /**
     * Handle the Post "updated" event.
     * Fired after an existing model is updated.
     */
    public function updated(Post $post): void
    {
        // Update search index
        $this->search->update($post);

        // Clear caches
        $this->cache->tags(['posts', "post:{$post->id}"])->flush();

        // Check if just published
        if ($post->wasChanged('published_at') && $post->published_at !== null) {
            $this->handlePublished($post);
        }

        Log::info("Post updated: {$post->id}");
    }

    /**
     * Handle the Post "saving" event.
     * Fired before insert or update.
     */
    public function saving(Post $post): void
    {
        // Sanitize content
        $post->content = $this->sanitizeContent($post->content);
    }

    /**
     * Handle the Post "saved" event.
     * Fired after insert or update.
     */
    public function saved(Post $post): void
    {
        // Sync tags if changed
        if ($post->relationLoaded('tags')) {
            $this->syncTags($post);
        }
    }

    /**
     * Handle the Post "deleting" event.
     * Fired before a model is deleted.
     * Return false to cancel the operation.
     */
    public function deleting(Post $post): bool
    {
        // Check if can be deleted
        if ($post->is_protected) {
            return false; // Cancel deletion
        }

        // Clean up related data
        $post->comments()->delete();
        $post->tags()->detach();

        return true;
    }

    /**
     * Handle the Post "deleted" event.
     * Fired after a model is deleted.
     */
    public function deleted(Post $post): void
    {
        // Remove from search index
        $this->search->remove($post);

        // Clear caches
        $this->cache->tags(['posts', "post:{$post->id}"])->flush();

        Log::info("Post deleted: {$post->id}");
    }

    /**
     * Handle the Post "trashed" event.
     * Fired after a model is soft deleted.
     */
    public function trashed(Post $post): void
    {
        // Remove from search (but keep in DB)
        $this->search->remove($post);

        Log::info("Post trashed: {$post->id}");
    }

    /**
     * Handle the Post "restoring" event.
     * Fired before a soft deleted model is restored.
     */
    public function restoring(Post $post): void
    {
        Log::info("Post restoring: {$post->id}");
    }

    /**
     * Handle the Post "restored" event.
     * Fired after a soft deleted model is restored.
     */
    public function restored(Post $post): void
    {
        // Re-index in search
        $this->search->index($post);

        Log::info("Post restored: {$post->id}");
    }

    /**
     * Handle the Post "forceDeleting" event.
     * Fired before a model is permanently deleted.
     */
    public function forceDeleting(Post $post): void
    {
        // Final cleanup before permanent deletion
        Log::warning("Post force deleting: {$post->id}");
    }

    /**
     * Handle the Post "forceDeleted" event.
     * Fired after a model is permanently deleted.
     */
    public function forceDeleted(Post $post): void
    {
        Log::warning("Post force deleted: {$post->id}");
    }

    /**
     * Handle the Post "replicating" event.
     * Fired when a model is being replicated.
     */
    public function replicating(Post $post): void
    {
        // Clear unique fields for the replica
        $post->slug = null;
        $post->published_at = null;
        $post->views = 0;
    }

    // Helper methods

    private function ensureUniqueSlug(Post $post): string
    {
        $slug = $post->slug;
        $count = 0;

        while (Post::where('slug', $slug)
            ->where('id', '!=', $post->id ?? 0)
            ->exists()
        ) {
            $count++;
            $slug = "{$post->slug}-{$count}";
        }

        return $slug;
    }

    private function calculateReadingTime(string $content): int
    {
        $wordCount = str_word_count(strip_tags($content));
        return max(1, (int) ceil($wordCount / 200));
    }

    private function sanitizeContent(string $content): string
    {
        return strip_tags($content, '<p><a><strong><em><ul><ol><li><h2><h3>');
    }

    private function handlePublished(Post $post): void
    {
        // Notify subscribers
        $post->author->notify(new PostPublished($post));
    }

    private function syncTags(Post $post): void
    {
        // Implementation
    }
}
```

---

## Registering Observer

```php
<?php
// Option 1: Model attribute (Laravel 11+)
namespace App\Models;

use App\Observers\PostObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;

#[ObservedBy(PostObserver::class)]
class Post extends Model
{
    // ...
}

// Option 2: Service Provider
namespace App\Providers;

use App\Models\Post;
use App\Observers\PostObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Post::observe(PostObserver::class);
    }
}
```

---

## Inline Events in Model

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected static function booted(): void
    {
        static::creating(function (Post $post) {
            $post->uuid = Str::uuid();
        });

        static::created(function (Post $post) {
            Cache::tags('posts')->flush();
        });

        static::deleting(function (Post $post) {
            // Cascade delete
            $post->comments()->delete();
        });
    }
}
```

---

## Custom Event Classes

```php
<?php

namespace App\Models;

use App\Events\PostCreated;
use App\Events\PostUpdated;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $dispatchesEvents = [
        'created' => PostCreated::class,
        'updated' => PostUpdated::class,
    ];
}

// Event class
namespace App\Events;

use App\Models\Post;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PostCreated
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Post $post
    ) {}
}
```
