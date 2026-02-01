---
name: TeamSeeder
description: Seeder for team-scoped roles and permissions
keywords: team, seeder, multi-tenant, role
---

# Team Seeder

Seeder for creating team-scoped roles.

## File: database/seeders/TeamSeeder.php

```php
<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

/**
 * Seed teams with roles and users.
 */
final class TeamSeeder extends Seeder
{
    /**
     * Default team roles and their permissions.
     *
     * @var array<string, list<string>>
     */
    private array $teamRoles = [
        'team-admin' => [
            'manage team',
            'invite members',
            'remove members',
            'edit team settings',
        ],
        'team-member' => [
            'view team',
            'create content',
            'edit own content',
        ],
        'team-viewer' => [
            'view team',
        ],
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        // Create team permissions (these are global, not team-scoped)
        $this->createPermissions();

        // Create sample teams
        $teams = $this->createTeams();

        // Create roles for each team
        foreach ($teams as $team) {
            $this->createTeamRoles($team);
        }

        // Create users and assign to teams
        $this->createTeamUsers($teams);

        $this->command->info('Teams seeded successfully!');
    }

    /**
     * Create all permissions.
     */
    private function createPermissions(): void
    {
        $allPermissions = collect($this->teamRoles)->flatten()->unique();

        foreach ($allPermissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web',
            ]);
        }
    }

    /**
     * Create sample teams.
     *
     * @return \Illuminate\Support\Collection<int, Team>
     */
    private function createTeams()
    {
        return collect([
            ['name' => 'Acme Corporation', 'slug' => 'acme'],
            ['name' => 'Globex Industries', 'slug' => 'globex'],
        ])->map(fn (array $data) => Team::firstOrCreate(
            ['slug' => $data['slug']],
            $data
        ));
    }

    /**
     * Create roles for a specific team.
     */
    private function createTeamRoles(Team $team): void
    {
        // Set team context
        setPermissionsTeamId($team->id);

        foreach ($this->teamRoles as $roleName => $permissions) {
            $role = Role::firstOrCreate([
                'name' => $roleName,
                'team_id' => $team->id,
                'guard_name' => 'web',
            ]);

            $role->syncPermissions($permissions);
        }
    }

    /**
     * Create users and assign to teams.
     *
     * @param \Illuminate\Support\Collection<int, Team> $teams
     */
    private function createTeamUsers($teams): void
    {
        $acme = $teams->first();

        // Set team context for Acme
        setPermissionsTeamId($acme->id);

        // Create team admin
        $admin = User::firstOrCreate(
            ['email' => 'admin@acme.com'],
            [
                'name' => 'Acme Admin',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );
        $admin->assignRole('team-admin');

        // Create team member
        $member = User::firstOrCreate(
            ['email' => 'member@acme.com'],
            [
                'name' => 'Acme Member',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );
        $member->assignRole('team-member');
    }
}
```

## Usage

```bash
php artisan db:seed --class=TeamSeeder
```
