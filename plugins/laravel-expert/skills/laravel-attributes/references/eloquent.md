---
name: eloquent-attributes
description: All Eloquent model attributes shipped in Laravel 13
---

# Eloquent Attributes (Laravel 13)

Namespace: `Illuminate\Database\Eloquent\Attributes\*`

## Table & Connection

```php
use Illuminate\Database\Eloquent\Attributes\{Table, Connection};

#[Table('my_flights')]
#[Connection('mysql_read')]
class Flight extends Model {}
```

| Attribute | Replaces | Argument |
|-----------|----------|----------|
| `#[Table('name')]` | `protected $table` | Table name string |
| `#[Connection('mysql')]` | `protected $connection` | Connection name from `config/database.php` |

## Mass Assignment

```php
use Illuminate\Database\Eloquent\Attributes\{Fillable, Guarded, Unguarded};

#[Fillable(['name', 'email'])]
class User extends Model {}

#[Guarded(['id', 'created_at'])]
class Post extends Model {}

#[Unguarded]
class InternalLog extends Model {}
```

`#[Unguarded]` is a marker attribute (no arguments) - equivalent to `protected $guarded = [];`.

## Serialization

```php
use Illuminate\Database\Eloquent\Attributes\{Hidden, Visible, Appends};

#[Hidden(['password', 'remember_token'])]
class User extends Model {}

#[Visible(['first_name', 'last_name'])]
class UserProfile extends Model {}

#[Appends(['is_admin'])]
class User extends Model
{
    protected function isAdmin(): Attribute
    {
        return new Attribute(get: fn () => $this->role === 'admin' ? 'yes' : 'no');
    }
}
```

`#[Hidden]` and `#[Visible]` accept method names too, to control relationship serialization:

```php
#[Hidden(['password', 'posts'])]  // hide the `posts()` relation
class User extends Model {}
```

## Touching Parents

```php
use Illuminate\Database\Eloquent\Attributes\Touches;

#[Touches(['post'])]
class Comment extends Model
{
    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }
}
```

When a `Comment` is created/updated/deleted, the parent `Post`'s `updated_at` is bumped.

## Notes

- All attributes are read by Laravel's model boot logic - no need to call anything manually
- Attributes are cached after the first reflection pass
- Combining `#[Fillable]` AND `protected $fillable` causes undefined behavior - pick one
