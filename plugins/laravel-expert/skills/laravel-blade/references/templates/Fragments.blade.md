---
name: Fragments.blade
description: Complete examples of Blade fragments with HTMX
file-type: blade
---

# Fragments - Complete Examples

## Basic Fragment Definition

```blade
{{-- resources/views/pages/users.blade.php --}}
<x-layouts.app title="Users">
    <div class="users-page">
        <header class="flex justify-between mb-6">
            <h1>User Management</h1>
            <x-button hx-get="{{ route('users.create-form') }}" hx-target="#modal">
                Add User
            </x-button>
        </header>

        @fragment('user-list')
            <div id="user-list" class="space-y-4">
                @forelse($users as $user)
                    <x-card class="user-card">
                        <div class="flex justify-between items-center">
                            <div>
                                <h3 class="font-semibold">{{ $user->name }}</h3>
                                <p class="text-gray-500">{{ $user->email }}</p>
                            </div>
                            <div class="flex gap-2">
                                <x-button
                                    size="sm"
                                    hx-get="{{ route('users.edit', $user) }}"
                                    hx-target="#modal"
                                >
                                    Edit
                                </x-button>
                                <x-button
                                    size="sm"
                                    variant="danger"
                                    hx-delete="{{ route('users.destroy', $user) }}"
                                    hx-target="#user-list"
                                    hx-swap="outerHTML"
                                    hx-confirm="Delete {{ $user->name }}?"
                                >
                                    Delete
                                </x-button>
                            </div>
                        </div>
                    </x-card>
                @empty
                    <x-empty-state message="No users found" />
                @endforelse

                {{ $users->links() }}
            </div>
        @endfragment

        @fragment('user-stats')
            <div id="user-stats" class="grid grid-cols-3 gap-4 mt-6">
                <x-stat label="Total Users" :value="$totalUsers" />
                <x-stat label="Active" :value="$activeUsers" />
                <x-stat label="New This Month" :value="$newUsers" />
            </div>
        @endfragment

        <div id="modal"></div>
    </div>
</x-layouts.app>
```

## Controller with Fragments

```php
<?php
// app/Http/Controllers/UserController.php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\View\View;

class UserController extends Controller
{
    public function index(Request $request): View
    {
        $users = User::latest()->paginate(10);

        $viewData = [
            'users' => $users,
            'totalUsers' => User::count(),
            'activeUsers' => User::where('active', true)->count(),
            'newUsers' => User::where('created_at', '>=', now()->subMonth())->count(),
        ];

        return view('pages.users', $viewData)
            ->fragmentIf($request->hasHeader('HX-Request'), 'user-list');
    }

    public function destroy(Request $request, User $user): View
    {
        $user->delete();

        // Return updated list fragment
        return $this->index($request);
    }

    public function store(Request $request): View
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
        ]);

        User::create($validated);

        // Return both list and stats fragments
        $viewData = [
            'users' => User::latest()->paginate(10),
            'totalUsers' => User::count(),
            'activeUsers' => User::where('active', true)->count(),
            'newUsers' => User::where('created_at', '>=', now()->subMonth())->count(),
        ];

        return view('pages.users', $viewData)
            ->fragmentIf(
                $request->hasHeader('HX-Request'),
                ['user-list', 'user-stats']
            );
    }
}
```

## Live Search with Fragments

```blade
{{-- resources/views/pages/products.blade.php --}}
<x-layouts.app title="Products">
    <div class="products-page">
        {{-- Search input triggers fragment update --}}
        <input
            type="search"
            name="search"
            placeholder="Search products..."
            hx-get="{{ route('products.index') }}"
            hx-trigger="input changed delay:300ms"
            hx-target="#product-list"
            hx-swap="outerHTML"
            class="w-full px-4 py-2 border rounded"
        />

        @fragment('product-list')
            <div id="product-list" class="grid grid-cols-3 gap-4 mt-6">
                @forelse($products as $product)
                    <x-product-card :product="$product" />
                @empty
                    <div class="col-span-3">
                        <x-empty-state message="No products match your search" />
                    </div>
                @endforelse
            </div>
        @endfragment
    </div>
</x-layouts.app>
```

```php
<?php
// Controller
public function index(Request $request): View
{
    $products = Product::query()
        ->when($request->search, fn($q, $search) =>
            $q->where('name', 'like', "%{$search}%")
        )
        ->latest()
        ->paginate(12);

    return view('pages.products', compact('products'))
        ->fragmentIf($request->hasHeader('HX-Request'), 'product-list');
}
```

## Infinite Scroll

```blade
{{-- resources/views/pages/feed.blade.php --}}
<x-layouts.app title="Feed">
    @fragment('feed-items')
        <div id="feed-items">
            @foreach($posts as $post)
                <x-post-card :post="$post" />
            @endforeach

            @if($posts->hasMorePages())
                <div
                    hx-get="{{ $posts->nextPageUrl() }}"
                    hx-trigger="revealed"
                    hx-swap="afterend"
                    hx-select="#feed-items > *"
                    class="loading-indicator"
                >
                    <x-spinner />
                </div>
            @endif
        </div>
    @endfragment
</x-layouts.app>
```

## Tab Content Loading

```blade
{{-- resources/views/pages/dashboard.blade.php --}}
<x-layouts.app title="Dashboard">
    <div class="tabs">
        <nav class="tab-nav">
            <button
                hx-get="{{ route('dashboard.overview') }}"
                hx-target="#tab-content"
                class="tab-btn active"
            >
                Overview
            </button>
            <button
                hx-get="{{ route('dashboard.analytics') }}"
                hx-target="#tab-content"
                class="tab-btn"
            >
                Analytics
            </button>
            <button
                hx-get="{{ route('dashboard.reports') }}"
                hx-target="#tab-content"
                class="tab-btn"
            >
                Reports
            </button>
        </nav>

        <div id="tab-content">
            @fragment('tab-content')
                {{-- Initial content or loaded via HTMX --}}
                @include('dashboard.partials.overview')
            @endfragment
        </div>
    </div>
</x-layouts.app>
```

```php
<?php
// DashboardController.php
public function overview(Request $request): View
{
    return view('dashboard.overview', ['stats' => $this->getStats()])
        ->fragmentIf($request->hasHeader('HX-Request'), 'tab-content');
}

public function analytics(Request $request): View
{
    return view('dashboard.analytics', ['data' => $this->getAnalytics()])
        ->fragmentIf($request->hasHeader('HX-Request'), 'tab-content');
}
```

## Form with Fragment Response

```blade
{{-- resources/views/components/contact-form.blade.php --}}
@fragment('contact-form')
    <form
        id="contact-form"
        hx-post="{{ route('contact.store') }}"
        hx-target="#contact-form"
        hx-swap="outerHTML"
        class="space-y-4"
    >
        @csrf

        @if(session('success'))
            <x-alert type="success">{{ session('success') }}</x-alert>
        @endif

        <x-form.input
            name="name"
            label="Name"
            :value="old('name')"
            required
        />

        <x-form.input
            name="email"
            type="email"
            label="Email"
            :value="old('email')"
            required
        />

        <x-form.textarea
            name="message"
            label="Message"
            :value="old('message')"
            required
        />

        <x-button type="submit">Send Message</x-button>
    </form>
@endfragment
```

```php
<?php
// ContactController.php
public function store(Request $request): View
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email',
        'message' => 'required|string|max:1000',
    ]);

    // Process contact form...

    return view('components.contact-form')
        ->fragment('contact-form')
        ->with('success', 'Message sent successfully!');
}
```

## Layout with HTMX Setup

```blade
{{-- resources/views/components/layouts/app.blade.php --}}
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ $title ?? config('app.name') }}</title>

    @vite(['resources/css/app.css', 'resources/js/app.js'])

    {{-- HTMX --}}
    <script src="https://unpkg.com/htmx.org@2.0.0"></script>

    {{-- HTMX CSRF Token --}}
    <script>
        document.body.addEventListener('htmx:configRequest', (event) => {
            event.detail.headers['X-CSRF-TOKEN'] = '{{ csrf_token() }}';
        });
    </script>
</head>
<body hx-boost="true">
    <x-navigation />

    <main class="container mx-auto px-4 py-8">
        {{ $slot }}
    </main>

    <x-footer />

    {{-- Toast notifications for HTMX --}}
    <div id="toast-container" class="fixed bottom-4 right-4 space-y-2"></div>
</body>
</html>
```
