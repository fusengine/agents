---
name: TeamBillable
description: Team model with billing and seat management
when-to-use: Implementing team/organization billing
keywords: team, seats, organization, billable, members
---

# Team Billing Implementation

## Team Model

```php
<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Cashier\Billable;

class Team extends Model
{
    use Billable;

    protected $fillable = [
        'name',
        'owner_id',
    ];

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function seatCount(): int
    {
        return $this->users()->count();
    }

    public function seatLimit(): int
    {
        $subscription = $this->subscription('team-plan');

        if (!$subscription) {
            return 0;
        }

        return $subscription->quantity ?? 1;
    }

    public function hasAvailableSeats(): bool
    {
        return $this->seatCount() < $this->seatLimit();
    }

    public function canAddMember(): bool
    {
        return $this->subscribed('team-plan') && $this->hasAvailableSeats();
    }
}
```

## Seat Management Service

```php
<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Team;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class TeamSeatService
{
    public function addMember(Team $team, User $user): void
    {
        DB::transaction(function () use ($team, $user) {
            // Add user to team
            $user->team_id = $team->id;
            $user->save();

            // Update subscription quantity
            $subscription = $team->subscription('team-plan');
            $newSeats = $team->users()->count();

            $subscription->updateQuantity($newSeats);
        });
    }

    public function removeMember(Team $team, User $user): void
    {
        if ($user->id === $team->owner_id) {
            throw new \Exception('Cannot remove team owner');
        }

        DB::transaction(function () use ($team, $user) {
            $user->team_id = null;
            $user->save();

            $subscription = $team->subscription('team-plan');
            $newSeats = max(1, $team->users()->count());

            // No proration on removal (keep until end of period)
            $subscription->noProrate()->updateQuantity($newSeats);
        });
    }

    public function transferOwnership(Team $team, User $newOwner): void
    {
        if ($newOwner->team_id !== $team->id) {
            throw new \Exception('New owner must be team member');
        }

        $team->owner_id = $newOwner->id;
        $team->save();
    }

    public function previewSeatChange(Team $team, int $newQuantity): array
    {
        $subscription = $team->subscription('team-plan');
        $current = $subscription->quantity;

        if ($newQuantity === $current) {
            return ['change' => 0, 'amount' => 0];
        }

        $invoice = \Stripe\Invoice::upcoming([
            'customer' => $team->stripe_id,
            'subscription' => $subscription->stripe_id,
            'subscription_items' => [[
                'id' => $subscription->items->first()->stripe_id,
                'quantity' => $newQuantity,
            ]],
        ]);

        return [
            'change' => $newQuantity - $current,
            'amount' => $invoice->total / 100,
            'description' => $newQuantity > $current
                ? "Adding {$newQuantity - $current} seat(s)"
                : "Removing {$current - $newQuantity} seat(s)",
        ];
    }
}
```

## Team Controller

```php
<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Team;
use App\Services\TeamSeatService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    public function __construct(
        private TeamSeatService $seatService
    ) {}

    public function subscribe(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'payment_method' => ['required', 'string'],
            'seats' => ['required', 'integer', 'min:1', 'max:100'],
        ]);

        $team = $request->user()->team;

        $subscription = $team->newSubscription('team-plan')
            ->price(config('billing.prices.team_seat'))
            ->quantity($validated['seats'])
            ->create($validated['payment_method']);

        return response()->json([
            'subscription' => $subscription->only(['id', 'stripe_status']),
            'seats' => $validated['seats'],
        ], 201);
    }

    public function addMember(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email', 'exists:users,email'],
        ]);

        $team = $request->user()->team;
        $user = User::where('email', $validated['email'])->first();

        if (!$team->canAddMember()) {
            return response()->json([
                'error' => 'No available seats',
                'seats' => $team->seatCount(),
                'limit' => $team->seatLimit(),
            ], 422);
        }

        $this->seatService->addMember($team, $user);

        return response()->json([
            'message' => 'Member added',
            'seats' => $team->seatCount(),
        ]);
    }

    public function removeMember(Request $request, User $user): JsonResponse
    {
        $team = $request->user()->team;

        $this->seatService->removeMember($team, $user);

        return response()->json([
            'message' => 'Member removed',
            'seats' => $team->seatCount(),
        ]);
    }

    public function previewSeats(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'seats' => ['required', 'integer', 'min:1'],
        ]);

        $team = $request->user()->team;
        $preview = $this->seatService->previewSeatChange($team, $validated['seats']);

        return response()->json($preview);
    }
}
```

## Access Check Middleware

```php
<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureTeamSubscribed
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();
        $team = $user?->team;

        if (!$team?->subscribed('team-plan')) {
            return response()->json([
                'error' => 'Team subscription required',
            ], 403);
        }

        return $next($request);
    }
}
```

## Migration

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('teams', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('owner_id')->constrained('users');
            $table->string('stripe_id')->nullable()->index();
            $table->string('pm_type')->nullable();
            $table->string('pm_last_four', 4)->nullable();
            $table->timestamp('trial_ends_at')->nullable();
            $table->timestamps();
        });

        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('team_id')->nullable()->constrained();
        });
    }
};
```
