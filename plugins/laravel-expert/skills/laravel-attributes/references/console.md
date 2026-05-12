---
name: console-attributes
description: Artisan command attributes shipped in Laravel 13
---

# Console Attributes (Laravel 13)

Namespace: `Illuminate\Console\Attributes\*`

```php
use Illuminate\Console\Attributes\{Signature, Description};
use Illuminate\Console\Command;

#[Signature('mail:send {user} {--queue}')]
#[Description('Send a marketing email to a user')]
class SendEmails extends Command
{
    public function handle(): int
    {
        $userId = $this->argument('user');
        $queue = $this->option('queue');

        // ...

        return self::SUCCESS;
    }
}
```

| Attribute | Replaces |
|-----------|----------|
| `#[Signature('...')]` | `protected $signature` |
| `#[Description('...')]` | `protected $description` |

## Signature syntax (unchanged)

```
command:name {arg} {arg?} {arg=default} {--option} {--option=} {--O|option=}
```

## Notes

- Auto-discovered by `app/Console/Kernel.php::commands()`
- `#[AsCommand]` from Symfony is not used - Laravel ships its own attributes
- Use `php artisan list` to verify the command is registered after migration
