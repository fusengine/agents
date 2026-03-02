#!/usr/bin/env python3
"""laravel_patterns.py - Laravel domain-specific detection patterns.

Shared across laravel-expert and other PHP-aware plugins.
Covers Eloquent, API, Auth, Livewire, Queues, Billing, Testing, etc.
"""

# Eloquent ORM patterns
ELOQUENT_PATTERNS = [
    r"(extends Model|HasFactory|belongsTo|hasMany|hasOne|morphTo)\b",
    r"\$this->belongsToMany|->with\(|->whereHas\(",
    r"(Eloquent|Model)::(find|where|create|update|all)\b",
]

# API & HTTP patterns
API_PATTERNS = [
    r"(JsonResource|ResourceCollection|apiResource)\b",
    r"Route::(get|post|put|delete|apiResource)\(",
    r"(response\(\)->json|Request \$request)\b",
]

# Auth & Authorization patterns
AUTH_PATTERNS = [
    r"(Auth::|auth\(\)|Sanctum|Passport|Socialite)\b",
    r"(Gate::|Policy|can\(|authorize)\b",
    r"(middleware\(['\"]auth|LoginController|RegisterController)\b",
]

# Livewire patterns
LIVEWIRE_PATTERNS = [
    r"(extends Component|Livewire|wire:|#\[On)\b",
    r"(mount|render|emit|dispatch)\(\)",
    r"@livewire|<livewire:",
]

# Queue & Job patterns
QUEUE_PATTERNS = [
    r"(implements ShouldQueue|dispatch\(|Bus::)\b",
    r"(Queue::|Job|Batch|Chain)\b",
    r"(onQueue|onConnection|tries|backoff)\b",
]

# Billing patterns (Cashier, Stripe, Paddle)
BILLING_PATTERNS = [
    r"(Billable|subscription|Cashier)\b",
    r"(createSubscription|newSubscription|charge)\(",
]

# Stripe Connect patterns
STRIPE_CONNECT_PATTERNS = [
    r"(StripeConnect|connectAccount|onboardingUrl)\b",
    r"(paymentIntent|transfer|payout|splitPayment)\b",
    r"Stripe\\\\(Account|Transfer|PaymentIntent)\b",
]

# Testing patterns (Pest/PHPUnit)
TESTING_PATTERNS = [
    r"(extends TestCase|RefreshDatabase|WithFaker)\b",
    r"(assertStatus|assertJson|assertSee|assertRedirect)\(",
    r"(factory\(|Pest|it\(|test\(|expect\()\b",
]

# Migration & Schema patterns
MIGRATION_PATTERNS = [
    r"(Schema::|Blueprint|->table|->create)\b",
    r"(->string|->integer|->boolean|->foreignId|->index)\(",
    r"extends Migration\b",
]

# Blade template patterns
BLADE_PATTERNS = [
    r"(@extends|@section|@yield|@component|@slot)\b",
    r"(@if|@foreach|@include|@push|@stack)\b",
    r"(Blade::|x-[a-z])\b",
]

# Permission patterns (Spatie)
PERMISSION_PATTERNS = [
    r"(hasRole|givePermissionTo|assignRole|spatie)\b",
    r"(Permission|Role)::(create|findByName)\b",
    r"@can\b|@role\b|middleware.*role:",
]

# i18n patterns
I18N_PATTERNS = [
    r"(__\(|trans\(|trans_choice\(|@lang)\b",
    r"Lang::|->locale\(|setLocale\b",
]

# Vite patterns
VITE_PATTERNS = [r"(@vite|@viteReactRefresh|Vite::)\b"]
