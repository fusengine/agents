---
name: model-with-attributes-template
description: Complete Eloquent model using only Laravel 13 attributes
---

# Template: Eloquent model with attributes

```php
<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\{
    Appends,
    Connection,
    Fillable,
    Hidden,
    Table,
    Touches,
};
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Table('users')]
#[Connection('mysql')]
#[Fillable(['name', 'email', 'team_id'])]
#[Hidden(['password', 'remember_token'])]
#[Appends(['is_admin'])]
#[Touches(['team'])]
final class User extends Model
{
    use HasFactory;

    /**
     * Team this user belongs to.
     */
    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    /**
     * Computed accessor exposed via #[Appends].
     */
    protected function isAdmin(): Attribute
    {
        return Attribute::get(fn (): string => $this->role === 'admin' ? 'yes' : 'no');
    }
}
```

## Before / After

### Before (Laravel <=12)

```php
class User extends Model
{
    protected $table = 'users';
    protected $connection = 'mysql';
    protected $fillable = ['name', 'email', 'team_id'];
    protected $hidden = ['password', 'remember_token'];
    protected $appends = ['is_admin'];
    protected $touches = ['team'];
}
```

### After (Laravel 13)

See template above.
