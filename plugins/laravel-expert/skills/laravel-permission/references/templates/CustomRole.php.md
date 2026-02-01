---
name: CustomRole
description: Extended Role model with custom attributes and relationships
keywords: role, custom, extend, uuid, priority
---

# Custom Role Model

Extended Role model with custom attributes, scopes, and relationships.

## File: app/Models/Role.php (Standard with Custom Attributes)

```php
<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Permission\Models\Role as SpatieRole;

/**
 * Custom Role model with additional functionality.
 *
 * @property int $id
 * @property string $name
 * @property string $guard_name
 * @property string|null $description
 * @property bool $is_default
 * @property int $priority
 * @property int|null $department_id
 */
final class Role extends SpatieRole
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
        'description',
        'is_default',
        'priority',
        'department_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_default' => 'boolean',
            'priority' => 'integer',
        ];
    }

    /**
     * Get the default role for new users.
     */
    public static function getDefault(): ?self
    {
        return static::where('is_default', true)->first();
    }

    /**
     * Scope to order by priority descending.
     */
    public function scopeByPriority(Builder $query): Builder
    {
        return $query->orderByDesc('priority');
    }

    /**
     * Scope to filter by department.
     */
    public function scopeForDepartment(Builder $query, int $departmentId): Builder
    {
        return $query->where('department_id', $departmentId);
    }

    /**
     * Role belongs to a department.
     */
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }
}
```

## File: app/Models/Role.php (With UUID Support)

```php
<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Permission\Models\Role as SpatieRole;

/**
 * Custom Role model with UUID primary key.
 *
 * @property string $uuid
 * @property string $name
 * @property string $guard_name
 */
final class Role extends SpatieRole
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

// database/migrations/xxxx_add_custom_fields_to_roles_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('roles', function (Blueprint $table) {
            $table->string('description')->nullable()->after('guard_name');
            $table->boolean('is_default')->default(false)->after('description');
            $table->integer('priority')->default(0)->after('is_default');
            $table->foreignId('department_id')
                ->nullable()
                ->after('priority')
                ->constrained()
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('roles', function (Blueprint $table) {
            $table->dropForeign(['department_id']);
            $table->dropColumn(['description', 'is_default', 'priority', 'department_id']);
        });
    }
};
```

## Factory

```php
<?php

// database/factories/RoleFactory.php

namespace Database\Factories;

use App\Models\Role;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Role>
 */
final class RoleFactory extends Factory
{
    protected $model = Role::class;

    public function definition(): array
    {
        return [
            'name' => fake()->unique()->word(),
            'guard_name' => 'web',
            'description' => fake()->sentence(),
            'is_default' => false,
            'priority' => fake()->numberBetween(0, 100),
        ];
    }

    /**
     * Mark as default role.
     */
    public function default(): static
    {
        return $this->state(fn () => [
            'is_default' => true,
        ]);
    }

    /**
     * High priority role.
     */
    public function highPriority(): static
    {
        return $this->state(fn () => [
            'priority' => 100,
        ]);
    }
}
```
