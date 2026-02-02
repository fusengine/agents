---
name: AdvancedDirectives.blade
description: Complete examples of advanced Blade directives
file-type: blade
---

# Advanced Directives - Complete Examples

## @use - Class Imports

```blade
{{-- resources/views/pages/dashboard.blade.php --}}
@use('App\Models\User')
@use('App\Models\Order')
@use('App\Enums\OrderStatus')

<div class="stats">
    <div class="stat">
        <span class="label">Total Users</span>
        <span class="value">{{ User::count() }}</span>
    </div>

    <div class="stat">
        <span class="label">Pending Orders</span>
        <span class="value">{{ Order::where('status', OrderStatus::Pending)->count() }}</span>
    </div>
</div>
```

## @inject - Service Injection

```blade
{{-- resources/views/pages/analytics.blade.php --}}
@inject('metrics', 'App\Services\MetricsService')
@inject('carbon', 'Carbon\Carbon')

<div class="analytics">
    <h2>Monthly Report - {{ $carbon::now()->format('F Y') }}</h2>

    <div class="metrics">
        <div class="metric">
            <span>Revenue</span>
            <span>${{ number_format($metrics->monthlyRevenue(), 2) }}</span>
        </div>

        <div class="metric">
            <span>New Users</span>
            <span>{{ $metrics->newUsersThisMonth() }}</span>
        </div>

        <div class="metric">
            <span>Conversion Rate</span>
            <span>{{ $metrics->conversionRate() }}%</span>
        </div>
    </div>
</div>
```

## @once - Prevent Script Duplication

```blade
{{-- resources/views/components/chart.blade.php --}}
@props(['data', 'type' => 'bar'])

@once
    @push('styles')
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.min.css">
    @endpush

    @push('scripts')
        <script src="https://cdn.jsdelivr.net/npm/chart.js@4"></script>
        <script>
            window.initCharts = function() {
                document.querySelectorAll('[data-chart]').forEach(el => {
                    new Chart(el, JSON.parse(el.dataset.chart));
                });
            };
        </script>
    @endpush
@endonce

<canvas data-chart='@json(['type' => $type, 'data' => $data])'></canvas>

{{-- Usage: Component can be used multiple times, scripts load once --}}
{{--
<x-chart :data="$salesData" type="line" />
<x-chart :data="$usersData" type="bar" />
<x-chart :data="$revenueData" type="pie" />
--}}
```

## @switch - Role-Based UI

```blade
{{-- resources/views/pages/dashboard.blade.php --}}
<x-layouts.app>
    <h1>Dashboard</h1>

    @switch(auth()->user()->role)
        @case('super-admin')
            <x-dashboard.super-admin />
            @break

        @case('admin')
            <x-dashboard.admin />
            @break

        @case('editor')
            <x-dashboard.editor />
            @break

        @case('moderator')
            <x-dashboard.moderator />
            @break

        @default
            <x-dashboard.user />
    @endswitch
</x-layouts.app>
```

## @verbatim - Vue.js Integration

```blade
{{-- resources/views/pages/vue-app.blade.php --}}
<x-layouts.app>
    <div id="vue-app">
        @verbatim
            <div class="user-card">
                <h2>{{ user.name }}</h2>
                <p>{{ user.email }}</p>

                <ul>
                    <li v-for="task in tasks" :key="task.id">
                        {{ task.title }} - {{ task.status }}
                    </li>
                </ul>

                <button @click="addTask">Add Task</button>
            </div>
        @endverbatim
    </div>

    @push('scripts')
        <script type="module">
            import { createApp } from 'vue';

            createApp({
                data() {
                    return {
                        user: @json($user),
                        tasks: @json($tasks)
                    };
                },
                methods: {
                    addTask() {
                        // Add task logic
                    }
                }
            }).mount('#vue-app');
        </script>
    @endpush
</x-layouts.app>
```

## Advanced Stacks

```blade
{{-- resources/views/components/layouts/app.blade.php --}}
<!DOCTYPE html>
<html>
<head>
    <title>{{ $title ?? config('app.name') }}</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])

    {{-- Check if stack has content before rendering wrapper --}}
    @hasStack('styles')
        <style>
            @stack('styles')
        </style>
    @endif
</head>
<body>
    {{ $slot }}

    @hasStack('scripts')
        @stack('scripts')
    @endif

    @hasStack('modals')
        <div class="modals-container">
            @stack('modals')
        </div>
    @endif
</body>
</html>

{{-- resources/views/pages/product.blade.php --}}
<x-layouts.app title="Product Details">
    <h1>{{ $product->name }}</h1>

    {{-- Conditional push based on product type --}}
    @pushIf($product->has_gallery, 'scripts')
        <script src="/js/lightbox.js"></script>
    @endPushIf

    {{-- Prepend critical styles --}}
    @prepend('styles')
        .product-hero { background: var(--primary); }
    @endprepend

    {{-- Push modal to dedicated stack --}}
    @push('modals')
        <x-modal id="quick-view">
            <x-product.quick-view :product="$product" />
        </x-modal>
    @endpush

    <x-product.details :product="$product" />
</x-layouts.app>
```

## Environment Directives

```blade
{{-- resources/views/components/layouts/app.blade.php --}}
<head>
    {{-- Production-only analytics --}}
    @production
        <script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
        <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_ID');
        </script>
    @endproduction

    {{-- Development tools --}}
    @env('local')
        <script src="http://localhost:3000/browser-sync/browser-sync-client.js"></script>
    @endenv

    {{-- Staging/Local debug --}}
    @env(['local', 'staging'])
        <style>
            .debug-bar { display: block; }
        </style>
    @endenv
</head>

<body>
    {{-- Environment banner --}}
    @env('staging')
        <div class="env-banner bg-yellow-500 text-center py-2">
            STAGING ENVIRONMENT - Data may be reset
        </div>
    @endenv

    {{ $slot }}
</body>
```

## @session - Flash Messages

```blade
{{-- resources/views/components/layouts/app.blade.php --}}
<main>
    {{-- Success message --}}
    @session('success')
        <div class="alert alert-success" role="alert">
            {{ session('success') }}
        </div>
    @endsession

    {{-- Error message --}}
    @session('error')
        <div class="alert alert-danger" role="alert">
            {{ session('error') }}
        </div>
    @endsession

    {{-- Status message (generic) --}}
    @session('status')
        <div class="alert alert-info" role="alert">
            {{ session('status') }}
        </div>
    @endsession

    {{ $slot }}
</main>
```

## Combined Example - Complete Page

```blade
{{-- resources/views/pages/admin/users.blade.php --}}
@use('App\Models\User')
@use('App\Enums\UserRole')
@inject('permissions', 'App\Services\PermissionService')

<x-layouts.admin title="User Management">
    @session('user-updated')
        <x-alert type="success">{{ session('user-updated') }}</x-alert>
    @endsession

    <div class="users-page">
        <header class="flex justify-between">
            <h1>Users ({{ User::count() }})</h1>

            @can('create', User::class)
                <x-button href="{{ route('admin.users.create') }}">
                    Add User
                </x-button>
            @endcan
        </header>

        @forelse($users as $user)
            <x-card class="user-card">
                <x-slot:header>
                    {{ $user->name }}

                    @switch($user->role)
                        @case(UserRole::Admin)
                            <x-badge color="red">Admin</x-badge>
                            @break
                        @case(UserRole::Editor)
                            <x-badge color="blue">Editor</x-badge>
                            @break
                        @default
                            <x-badge color="gray">User</x-badge>
                    @endswitch
                </x-slot>

                <p>{{ $user->email }}</p>

                <x-slot:footer>
                    @can('update', $user)
                        <x-button size="sm" href="{{ route('admin.users.edit', $user) }}">
                            Edit
                        </x-button>
                    @endcan
                </x-slot>
            </x-card>

            @once
                @push('scripts')
                    <script src="/js/user-actions.js"></script>
                @endpush
            @endonce
        @empty
            <x-empty-state message="No users found" />
        @endforelse
    </div>

    @env('local')
        <x-debug :data="['users' => $users->count(), 'permissions' => $permissions->all()]" />
    @endenv
</x-layouts.admin>
```
