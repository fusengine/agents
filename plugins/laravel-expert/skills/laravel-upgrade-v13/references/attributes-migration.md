---
name: attributes-migration
description: Migrate Eloquent + Queue + Console + Form Request properties to PHP Attributes
when-to-use: Phase 4 (optional modernization)
keywords: attributes, migration, eloquent, queue
---

# Attributes Migration (Optional)

This phase is **optional** — properties still work in L13. Migrate gradually for new code, refactor legacy when touching.

## Eloquent

```php
// Before (L12)
class User extends Model
{
    protected $table = 'users';
    protected $connection = 'pgsql';
    protected $fillable = ['name', 'email'];
    protected $hidden = ['password'];
    protected $casts = ['email_verified_at' => 'datetime'];
}

// After (L13)
use Illuminate\Database\Eloquent\Attributes\{
    Table, Connection, Fillable, Hidden, Casts
};

#[Table('users')]
#[Connection('pgsql')]
#[Fillable(['name', 'email'])]
#[Hidden(['password'])]
#[Casts(['email_verified_at' => 'datetime'])]
class User extends Model {}
```

→ See `laravel-eloquent` skill for full attribute list.

## Queue Jobs

```php
// Before (L12)
class ProcessPodcast implements ShouldQueue
{
    public string $connection = 'redis';
    public string $queue = 'podcasts';
    public int $tries = 5;
    public int $timeout = 120;
    public array $backoff = [10, 30, 60];
}

// After (L13)
use Illuminate\Queue\Attributes\{
    Connection, Queue, Tries, Timeout, Backoff
};

#[Connection('redis')]
#[Queue('podcasts')]
#[Tries(5)]
#[Timeout(120)]
#[Backoff([10, 30, 60])]
class ProcessPodcast implements ShouldQueue {}
```

Also applies to Listeners, Notifications, Mailables, Broadcast Events.

→ See `laravel-queues` skill.

## Console Commands

```php
// Before (L12)
class SendMailCommand extends Command
{
    protected $signature = 'mail:send {user} {--queue}';
    protected $description = 'Send email';
}

// After (L13)
use Illuminate\Console\Attributes\{Signature, Description};

#[Signature('mail:send {user} {--queue}')]
#[Description('Send email')]
class SendMailCommand extends Command {}
```

## Controllers

```php
use Illuminate\Routing\Attributes\{Middleware, Authorize};

#[Middleware('auth')]
#[Authorize('update-post')]
class PostController extends Controller {}
```

Method-level also supported.

## Form Requests

```php
use Illuminate\Foundation\Http\Attributes\{RedirectTo, StopOnFirstFailure};

#[RedirectTo('/dashboard')]
#[StopOnFirstFailure]
class UpdateProfileRequest extends FormRequest {}
```

## API Resources

```php
use Illuminate\Http\Resources\Attributes\{Collects, PreserveKeys};

#[Collects(User::class)]
#[PreserveKeys]
class UserCollection extends ResourceCollection {}
```

## Test Seeders

```php
use Illuminate\Database\Seeder\Attributes\{Seed, Seeder};

#[Seed]
#[Seeder(UsersTableSeeder::class)]
class DatabaseSeeder {}
```

## Migration Recipe

1. Pick a class
2. Add `use` statements for attribute classes
3. Replace `protected $X` properties with `#[X(...)]` attributes above class declaration
4. Run tests on that class
5. Commit per-class (atomic diffs)

## DON'T

- ❌ Mix attributes and properties on same class (conflict)
- ❌ Add attributes on private/protected methods (not detected by reflection)
- ❌ Migrate all classes in one PR — incremental is safer
