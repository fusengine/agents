---
name: laravel-eloquent-legacy-properties
description: Legacy Eloquent property style ($fillable, $hidden, $casts, ...) - retained for backward compatibility in Laravel 13. Use the Attribute style for new code.
---

# Eloquent Legacy Properties (L12 → L13 migration)

In Laravel 13, **PHP Attributes are the recommended style**. The legacy property style is still fully supported, but should be considered LEGACY. This reference helps teams migrating from L12 or maintaining mixed codebases.

> ⚠ **Never mix** an attribute and its equivalent property on the same model. Pick one. The Attribute wins if both are present, and silent conflicts are a common source of bugs.

---

## Mapping Table

| Concern | Legacy (L12-style) | L13 Attribute (preferred) |
|---------|-------------------|---------------------------|
| Table | `protected $table = 'users';` | `#[Table('users')]` |
| Connection | `protected $connection = 'mysql';` | `#[Connection('mysql')]` |
| Primary key | `protected $primaryKey = 'uuid';` | `#[PrimaryKey('uuid')]` |
| Fillable | `protected $fillable = ['name'];` | `#[Fillable(['name'])]` |
| Guarded | `protected $guarded = ['id'];` | `#[Guarded(['id'])]` |
| Unguarded | `protected $guarded = [];` | `#[Unguarded]` |
| Hidden | `protected $hidden = ['password'];` | `#[Hidden(['password'])]` |
| Visible | `protected $visible = ['name'];` | `#[Visible(['name'])]` |
| Appends | `protected $appends = ['full_name'];` | `#[Appends(['full_name'])]` |
| Touches | `protected $touches = ['author'];` | `#[Touches(['author'])]` |
| Casts | `casts(): array { return [...]; }` | `#[Casts([...])]` |
| Dates | `protected $dates = ['archived_at'];` | `#[Casts(['archived_at' => 'datetime'])]` |
| Timestamps OFF | `public $timestamps = false;` | `#[NoTimestamps]` |

---

## Full legacy example

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class Post extends Model
{
    protected $table = 'posts';
    protected $connection = 'mysql';
    protected $primaryKey = 'id';

    protected $fillable = ['title', 'content', 'author_id', 'published_at'];
    protected $hidden = ['internal_notes'];
    protected $appends = ['excerpt'];
    protected $touches = ['author'];

    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
            'metadata'     => 'array',
            'is_draft'     => 'boolean',
        ];
    }

    public function author(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }
}
```

---

## Migration recipe (per model)

1. Add `use Illuminate\Database\Eloquent\Attributes\{Table, Fillable, Hidden, Casts, Appends, Touches};`
2. Convert each property to its attribute counterpart on the class.
3. **Delete** the legacy property — keeping both is forbidden.
4. Run the test suite + `php artisan model:show <Model>` to verify resolved metadata.
5. Run `fuse-ai-pilot:sniper` for static validation.

---

## When the legacy style is still acceptable

- Quick prototypes or scratch code never shipped to production.
- Generated code from third-party packages you cannot patch.
- Phased migration of large legacy codebases — temporarily, with a tracking ticket.

For everything else, prefer the attribute style — see [SKILL.md](../SKILL.md).
