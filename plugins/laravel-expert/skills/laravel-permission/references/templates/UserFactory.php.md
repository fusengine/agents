---
name: UserFactory
description: User factory with permission states
keywords: factory, state, permission, role, test
---

# User Factory with Permission States

Factory with states for common permission scenarios.

## File: database/factories/UserFactory.php

```php
<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

/**
 * @extends Factory<User>
 */
final class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password = null;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
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
     * State for unverified email.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * State for Super Admin role.
     */
    public function superAdmin(): static
    {
        return $this->afterCreating(function (User $user) {
            $role = Role::firstOrCreate(['name' => 'Super-Admin']);
            $user->assignRole($role);
        });
    }

    /**
     * State for Admin role.
     */
    public function admin(): static
    {
        return $this->afterCreating(function (User $user) {
            $role = Role::firstOrCreate(['name' => 'admin']);
            $user->assignRole($role);
        });
    }

    /**
     * State for Editor role with permissions.
     */
    public function editor(): static
    {
        return $this->afterCreating(function (User $user) {
            $role = Role::firstOrCreate(['name' => 'editor']);

            // Ensure permissions exist
            $permissions = [
                'view articles',
                'create articles',
                'edit articles',
                'publish articles',
            ];

            foreach ($permissions as $permName) {
                Permission::firstOrCreate(['name' => $permName]);
            }

            $role->syncPermissions($permissions);
            $user->assignRole($role);
        });
    }

    /**
     * State for Writer role.
     */
    public function writer(): static
    {
        return $this->afterCreating(function (User $user) {
            $role = Role::firstOrCreate(['name' => 'writer']);

            $permissions = ['view articles', 'create articles', 'edit articles'];

            foreach ($permissions as $permName) {
                Permission::firstOrCreate(['name' => $permName]);
            }

            $role->syncPermissions($permissions);
            $user->assignRole($role);
        });
    }

    /**
     * State for Viewer role (read-only).
     */
    public function viewer(): static
    {
        return $this->afterCreating(function (User $user) {
            $role = Role::firstOrCreate(['name' => 'viewer']);

            Permission::firstOrCreate(['name' => 'view articles']);
            $role->syncPermissions(['view articles']);

            $user->assignRole($role);
        });
    }

    /**
     * State with specific role.
     */
    public function withRole(string $roleName): static
    {
        return $this->afterCreating(function (User $user) use ($roleName) {
            $role = Role::firstOrCreate(['name' => $roleName]);
            $user->assignRole($role);
        });
    }

    /**
     * State with specific permissions.
     *
     * @param array<string> $permissions
     */
    public function withPermissions(array $permissions): static
    {
        return $this->afterCreating(function (User $user) use ($permissions) {
            foreach ($permissions as $permName) {
                Permission::firstOrCreate(['name' => $permName]);
            }
            $user->givePermissionTo($permissions);
        });
    }

    /**
     * State for API role (Sanctum).
     */
    public function apiUser(): static
    {
        return $this->afterCreating(function (User $user) {
            $role = Role::firstOrCreate([
                'name' => 'api-user',
                'guard_name' => 'api',
            ]);

            $permissions = ['api:read', 'api:write'];

            foreach ($permissions as $permName) {
                Permission::firstOrCreate([
                    'name' => $permName,
                    'guard_name' => 'api',
                ]);
            }

            $role->syncPermissions($permissions);
            $user->assignRole($role);
        });
    }

    /**
     * State for team member.
     */
    public function teamMember(int $teamId): static
    {
        return $this->afterCreating(function (User $user) use ($teamId) {
            setPermissionsTeamId($teamId);

            $role = Role::firstOrCreate([
                'name' => 'team-member',
                'team_id' => $teamId,
            ]);

            $user->assignRole($role);
        });
    }
}
```

## Usage in Tests

```php
<?php

use App\Models\User;

// Create Super Admin
$superAdmin = User::factory()->superAdmin()->create();

// Create Editor
$editor = User::factory()->editor()->create();

// Create with specific role
$moderator = User::factory()->withRole('moderator')->create();

// Create with specific permissions
$user = User::factory()
    ->withPermissions(['view reports', 'export data'])
    ->create();

// Create API user
$apiUser = User::factory()->apiUser()->create();

// Create team member
$teamMember = User::factory()->teamMember(teamId: 1)->create();

// Combine states
$verifiedAdmin = User::factory()
    ->admin()
    ->create(['email_verified_at' => now()]);
```
