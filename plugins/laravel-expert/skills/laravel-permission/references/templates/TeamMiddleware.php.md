---
name: TeamMiddleware
description: Complete middleware for setting team permission context
keywords: middleware, team, multi-tenant, context
---

# Team Permission Middleware

Complete middleware to set team context for multi-tenant permissions.

## File: app/Http/Middleware/SetTeamPermissions.php

```php
<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Set team context for permission checks.
 */
final class SetTeamPermissions
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user === null) {
            return $next($request);
        }

        // Priority: route param > session > user default
        $teamId = $this->resolveTeamId($request, $user);

        if ($teamId !== null) {
            setPermissionsTeamId($teamId);
        }

        return $next($request);
    }

    /**
     * Resolve team ID from request context.
     */
    private function resolveTeamId(Request $request, $user): ?int
    {
        // From route parameter
        if ($team = $request->route('team')) {
            return is_object($team) ? $team->id : (int) $team;
        }

        // From session
        if ($sessionTeamId = session('current_team_id')) {
            return (int) $sessionTeamId;
        }

        // From user's default team
        if (method_exists($user, 'currentTeam') && $user->currentTeam) {
            return $user->currentTeam->id;
        }

        return $user->current_team_id ?? null;
    }
}
```

## Registration: bootstrap/app.php

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->web(append: [
        \App\Http\Middleware\SetTeamPermissions::class,
    ]);

    // Or as alias for specific routes
    $middleware->alias([
        'team.permissions' => \App\Http\Middleware\SetTeamPermissions::class,
    ]);
})
```

## Routes Usage

```php
// Apply to all team routes
Route::prefix('teams/{team}')
    ->middleware(['auth', 'team.permissions'])
    ->group(function () {
        Route::get('/dashboard', [TeamDashboardController::class, 'index']);
        Route::get('/settings', [TeamSettingsController::class, 'index'])
            ->middleware('permission:manage team settings');
    });
```
