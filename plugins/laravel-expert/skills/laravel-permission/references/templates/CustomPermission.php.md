---
name: CustomPermission
description: Extended Permission model with categories and custom attributes
keywords: permission, custom, extend, category, group
---

# Custom Permission Model

Extended Permission model with categories and grouping support.

## File: app/Models/Permission.php

```php
<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Collection;
use Spatie\Permission\Models\Permission as SpatiePermission;

/**
 * Custom Permission model with categories.
 *
 * @property int $id
 * @property string $name
 * @property string $guard_name
 * @property string|null $category
 * @property string|null $description
 */
final class Permission extends SpatiePermission
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'guard_name',
        'category',
        'description',
    ];

    /**
     * Get permissions grouped by category.
     *
     * @return Collection<string, Collection<int, self>>
     */
    public static function grouped(): Collection
    {
        return static::all()->groupBy('category');
    }

    /**
     * Get permissions as array grouped by category.
     *
     * @return array<string, list<array<string, mixed>>>
     */
    public static function groupedArray(): array
    {
        return static::grouped()
            ->map(fn (Collection $permissions) => $permissions->map(fn (self $p) => [
                'id' => $p->id,
                'name' => $p->name,
                'description' => $p->description,
            ])->values()->toArray())
            ->toArray();
    }

    /**
     * Get unique categories.
     *
     * @return Collection<int, string>
     */
    public static function categories(): Collection
    {
        return static::query()
            ->distinct()
            ->whereNotNull('category')
            ->pluck('category');
    }

    /**
     * Scope by category.
     */
    public function scopeCategory(Builder $query, string $category): Builder
    {
        return $query->where('category', $category);
    }

    /**
     * Scope to filter uncategorized.
     */
    public function scopeUncategorized(Builder $query): Builder
    {
        return $query->whereNull('category');
    }

    /**
     * Scope to search by name or description.
     */
    public function scopeSearch(Builder $query, string $search): Builder
    {
        return $query->where(function (Builder $q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('description', 'like', "%{$search}%");
        });
    }
}
```

## File: app/Models/Permission.php (With UUID Support)

```php
<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Permission\Models\Permission as SpatiePermission;

/**
 * Custom Permission model with UUID primary key.
 *
 * @property string $uuid
 * @property string $name
 * @property string $guard_name
 */
final class Permission extends SpatiePermission
{
    use HasFactory;
    use HasUuids;

    /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey = 'uuid';

    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * The data type of the primary key.
     *
     * @var string
     */
    protected $keyType = 'string';
}
```

## Configuration Registration

```php
<?php

// config/permission.php
return [
    'models' => [
        'permission' => App\Models\Permission::class,
        'role' => App\Models\Role::class,
    ],

    // ... rest of config
];
```

## Migration for Custom Attributes

```php
<?php

// database/migrations/xxxx_add_custom_fields_to_permissions_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('permissions', function (Blueprint $table) {
            $table->string('category')->nullable()->after('guard_name');
            $table->string('description')->nullable()->after('category');

            $table->index('category');
        });
    }

    public function down(): void
    {
        Schema::table('permissions', function (Blueprint $table) {
            $table->dropIndex(['category']);
            $table->dropColumn(['category', 'description']);
        });
    }
};
```

## Seeder with Categories

```php
<?php

// database/seeders/CategorizedPermissionSeeder.php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;
use Spatie\Permission\PermissionRegistrar;

final class CategorizedPermissionSeeder extends Seeder
{
    private array $permissions = [
        'Articles' => [
            'view articles' => 'View published and draft articles',
            'create articles' => 'Create new articles',
            'edit articles' => 'Edit existing articles',
            'delete articles' => 'Delete articles permanently',
            'publish articles' => 'Publish articles to public',
        ],
        'Users' => [
            'view users' => 'View user list and profiles',
            'create users' => 'Create new user accounts',
            'edit users' => 'Edit user information',
            'delete users' => 'Delete user accounts',
        ],
        'Settings' => [
            'view settings' => 'View application settings',
            'edit settings' => 'Modify application settings',
        ],
    ];

    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        foreach ($this->permissions as $category => $permissions) {
            foreach ($permissions as $name => $description) {
                Permission::firstOrCreate(
                    ['name' => $name, 'guard_name' => 'web'],
                    ['category' => $category, 'description' => $description]
                );
            }
        }
    }
}
```

## Usage in Admin UI

```php
// In controller
$groupedPermissions = Permission::groupedArray();

// Returns:
// [
//     'Articles' => [
//         ['id' => 1, 'name' => 'view articles', 'description' => '...'],
//         ['id' => 2, 'name' => 'create articles', 'description' => '...'],
//     ],
//     'Users' => [...],
// ]
```
