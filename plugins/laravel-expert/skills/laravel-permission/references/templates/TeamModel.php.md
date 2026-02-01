---
name: TeamModel
description: Team model with boot method for automatic role assignment
keywords: team, model, boot, created, role
---

# Team Model

Team model with automatic role assignment on creation.

## File: app/Models/Team.php

```php
<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * Team model with permission integration.
 *
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property int $owner_id
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
final class Team extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'slug',
        'owner_id',
    ];

    /**
     * Bootstrap the model and its traits.
     */
    protected static function boot(): void
    {
        parent::boot();

        static::created(function (Team $team): void {
            // Store current team context
            $previousTeamId = getPermissionsTeamId();

            // Set context to new team
            setPermissionsTeamId($team->id);

            // Assign team-admin role to creator
            if (auth()->check()) {
                auth()->user()->assignRole('team-admin');
            }

            // Restore previous context
            if ($previousTeamId !== null) {
                setPermissionsTeamId($previousTeamId);
            }
        });
    }

    /**
     * Team owner relationship.
     */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    /**
     * Team members relationship.
     */
    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'team_user')
            ->withTimestamps();
    }

    /**
     * Check if user is member of this team.
     */
    public function hasMember(User $user): bool
    {
        return $this->members()->where('user_id', $user->id)->exists();
    }

    /**
     * Add a member to the team.
     */
    public function addMember(User $user, string $role = 'team-member'): void
    {
        // Add to pivot table
        $this->members()->attach($user->id);

        // Set team context and assign role
        $previousTeamId = getPermissionsTeamId();
        setPermissionsTeamId($this->id);

        $user->assignRole($role);

        if ($previousTeamId !== null) {
            setPermissionsTeamId($previousTeamId);
        }
    }

    /**
     * Remove a member from the team.
     */
    public function removeMember(User $user): void
    {
        // Set team context and remove roles
        $previousTeamId = getPermissionsTeamId();
        setPermissionsTeamId($this->id);

        $user->roles()->wherePivot('team_id', $this->id)->detach();

        if ($previousTeamId !== null) {
            setPermissionsTeamId($previousTeamId);
        }

        // Remove from pivot table
        $this->members()->detach($user->id);
    }
}
```

## Migration

```php
// database/migrations/xxxx_create_teams_table.php
public function up(): void
{
    Schema::create('teams', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->string('slug')->unique();
        $table->foreignId('owner_id')->constrained('users');
        $table->timestamps();
    });

    Schema::create('team_user', function (Blueprint $table) {
        $table->foreignId('team_id')->constrained()->cascadeOnDelete();
        $table->foreignId('user_id')->constrained()->cascadeOnDelete();
        $table->timestamps();

        $table->primary(['team_id', 'user_id']);
    });
}
```
