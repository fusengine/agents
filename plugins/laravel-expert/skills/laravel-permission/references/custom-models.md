---
name: custom-models
description: Extending Spatie Role and Permission models with custom functionality
when-to-use: Adding UUID support, custom attributes, or extending model behavior
keywords: custom, model, uuid, extend, override
priority: low
related: spatie-permission.md
---

# Custom Models

## Overview

Extend Spatie's Role and Permission models for custom behavior like UUIDs or additional attributes.

## UUID Support (Laravel 9+)

### Custom Role Model

```php
<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Permission\Models\Role as SpatieRole;

final class Role extends SpatieRole
{
    use HasFactory;
    use HasUuids;

    protected $primaryKey = 'uuid';
    public $incrementing = false;
    protected $keyType = 'string';
}
```

### Custom Permission Model

```php
<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Permission\Models\Permission as SpatiePermission;

final class Permission extends SpatiePermission
{
    use HasFactory;
    use HasUuids;

    protected $primaryKey = 'uuid';
    public $incrementing = false;
    protected $keyType = 'string';
}
```

### Register Custom Models

```php
// config/permission.php
'models' => [
    'permission' => App\Models\Permission::class,
    'role' => App\Models\Role::class,
],
```

### UUID Migrations

```php
// Update migration for UUIDs
public function up(): void
{
    Schema::create('roles', function (Blueprint $table) {
        $table->uuid('uuid')->primary();
        $table->string('name');
        $table->string('guard_name');
        $table->timestamps();

        $table->unique(['name', 'guard_name']);
    });

    Schema::create('permissions', function (Blueprint $table) {
        $table->uuid('uuid')->primary();
        $table->string('name');
        $table->string('guard_name');
        $table->timestamps();

        $table->unique(['name', 'guard_name']);
    });

    // Update pivot tables
    Schema::create('role_has_permissions', function (Blueprint $table) {
        $table->uuid('permission_uuid');
        $table->uuid('role_uuid');

        $table->foreign('permission_uuid')
            ->references('uuid')->on('permissions')->cascadeOnDelete();
        $table->foreign('role_uuid')
            ->references('uuid')->on('roles')->cascadeOnDelete();

        $table->primary(['permission_uuid', 'role_uuid']);
    });
}
```

## Adding Custom Attributes

```php
<?php

declare(strict_types=1);

namespace App\Models;

use Spatie\Permission\Models\Role as SpatieRole;

final class Role extends SpatieRole
{
    protected $fillable = [
        'name',
        'guard_name',
        'description',    // Custom
        'is_default',     // Custom
        'priority',       // Custom
    ];

    protected function casts(): array
    {
        return [
            'is_default' => 'boolean',
            'priority' => 'integer',
        ];
    }

    /**
     * Get default role for new users.
     */
    public static function getDefault(): ?self
    {
        return static::where('is_default', true)->first();
    }

    /**
     * Scope to order by priority.
     */
    public function scopeByPriority($query)
    {
        return $query->orderBy('priority', 'desc');
    }
}
```

### Migration for Custom Attributes

```php
public function up(): void
{
    Schema::table('roles', function (Blueprint $table) {
        $table->string('description')->nullable()->after('guard_name');
        $table->boolean('is_default')->default(false)->after('description');
        $table->integer('priority')->default(0)->after('is_default');
    });
}
```

## Adding Relationships

```php
<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Permission\Models\Role as SpatieRole;

final class Role extends SpatieRole
{
    /**
     * Role belongs to a department.
     */
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    /**
     * Get roles for a specific department.
     */
    public function scopeForDepartment($query, int $departmentId)
    {
        return $query->where('department_id', $departmentId);
    }
}
```

## Permission Categories

```php
<?php

declare(strict_types=1);

namespace App\Models;

use Spatie\Permission\Models\Permission as SpatiePermission;

final class Permission extends SpatiePermission
{
    protected $fillable = [
        'name',
        'guard_name',
        'category',     // Group permissions by category
        'description',
    ];

    /**
     * Group permissions by category.
     */
    public static function grouped(): array
    {
        return static::all()
            ->groupBy('category')
            ->toArray();
    }

    /**
     * Scope by category.
     */
    public function scopeCategory($query, string $category)
    {
        return $query->where('category', $category);
    }
}
```

## Best Practices

1. **Extend, don't replace** - Always extend Spatie models
2. **Update config** - Register custom models in `config/permission.php`
3. **Test thoroughly** - Custom models may affect caching
4. **Document changes** - Team should know about customizations
