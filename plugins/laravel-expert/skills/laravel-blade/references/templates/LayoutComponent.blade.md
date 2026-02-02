---
name: LayoutComponent
description: Application layout using component approach
when-to-use: Creating page layouts with slots
keywords: layout, slots, header, footer, navigation
---

# Layout Component

## Main Layout

```blade
{{-- resources/views/components/layouts/app.blade.php --}}
@props([
    'title' => null,
    'description' => null,
])

<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ $title ? $title . ' - ' : '' }}{{ config('app.name') }}</title>

    @if ($description)
        <meta name="description" content="{{ $description }}">
    @endif

    {{-- Fonts --}}
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700" rel="stylesheet" />

    {{-- Vite Assets --}}
    @vite(['resources/css/app.css', 'resources/js/app.js'])

    {{-- Additional Head Content --}}
    {{ $head ?? '' }}
</head>
<body class="h-full bg-gray-50 font-sans antialiased">
    {{-- Skip Link --}}
    <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:p-4 focus:bg-white">
        Skip to main content
    </a>

    {{-- Navigation --}}
    @if (isset($navigation))
        {{ $navigation }}
    @else
        <x-layouts.navigation />
    @endif

    {{-- Page Header --}}
    @if (isset($header))
        <header class="bg-white shadow">
            <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                {{ $header }}
            </div>
        </header>
    @endif

    {{-- Main Content --}}
    <main id="main-content" class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {{-- Flash Messages --}}
        @if (session('success'))
            <x-alert type="success" :message="session('success')" class="mb-6" />
        @endif

        @if (session('error'))
            <x-alert type="error" :message="session('error')" class="mb-6" />
        @endif

        {{ $slot }}
    </main>

    {{-- Footer --}}
    @if (isset($footer))
        <footer class="bg-white border-t">
            <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                {{ $footer }}
            </div>
        </footer>
    @else
        <x-layouts.footer />
    @endif

    {{-- Scripts --}}
    {{ $scripts ?? '' }}
</body>
</html>
```

## Navigation Component

```blade
{{-- resources/views/components/layouts/navigation.blade.php --}}
<nav class="bg-white shadow" x-data="{ open: false }">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 justify-between">
            {{-- Logo --}}
            <div class="flex items-center">
                <a href="{{ route('home') }}" class="flex items-center">
                    <x-application-logo class="h-8 w-auto" />
                </a>
            </div>

            {{-- Desktop Navigation --}}
            <div class="hidden sm:flex sm:items-center sm:space-x-8">
                <x-nav-link :href="route('dashboard')" :active="request()->routeIs('dashboard')">
                    Dashboard
                </x-nav-link>
                <x-nav-link :href="route('projects.index')" :active="request()->routeIs('projects.*')">
                    Projects
                </x-nav-link>

                {{-- User Menu --}}
                @auth
                    <x-dropdown>
                        <x-slot:trigger>
                            <button class="flex items-center text-sm">
                                {{ Auth::user()->name }}
                                <x-heroicon-s-chevron-down class="ml-1 h-4 w-4" />
                            </button>
                        </x-slot>

                        <x-dropdown.item :href="route('profile')">Profile</x-dropdown.item>
                        <x-dropdown.item :href="route('settings')">Settings</x-dropdown.item>
                        <x-dropdown.divider />
                        <form method="POST" action="{{ route('logout') }}">
                            @csrf
                            <x-dropdown.item as="button" type="submit">Log Out</x-dropdown.item>
                        </form>
                    </x-dropdown>
                @else
                    <x-nav-link :href="route('login')">Log In</x-nav-link>
                @endauth
            </div>

            {{-- Mobile Menu Button --}}
            <div class="flex items-center sm:hidden">
                <button @click="open = !open" class="p-2">
                    <x-heroicon-o-bars-3 x-show="!open" class="h-6 w-6" />
                    <x-heroicon-o-x-mark x-show="open" class="h-6 w-6" x-cloak />
                </button>
            </div>
        </div>
    </div>

    {{-- Mobile Menu --}}
    <div x-show="open" x-cloak class="sm:hidden">
        <div class="space-y-1 px-4 pb-3 pt-2">
            <x-mobile-nav-link :href="route('dashboard')" :active="request()->routeIs('dashboard')">
                Dashboard
            </x-mobile-nav-link>
        </div>
    </div>
</nav>
```

## Footer Component

```blade
{{-- resources/views/components/layouts/footer.blade.php --}}
<footer class="bg-white border-t mt-auto">
    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row justify-between items-center">
            <p class="text-sm text-gray-500">
                © {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
            </p>
            <nav class="flex space-x-4 mt-4 sm:mt-0">
                <a href="/privacy" class="text-sm text-gray-500 hover:text-gray-700">Privacy</a>
                <a href="/terms" class="text-sm text-gray-500 hover:text-gray-700">Terms</a>
            </nav>
        </div>
    </div>
</footer>
```

## Page Usage

```blade
{{-- resources/views/dashboard.blade.php --}}
<x-layouts.app title="Dashboard" description="Your personal dashboard">
    <x-slot:header>
        <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
    </x-slot>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <x-card>
            <x-slot:header>Statistics</x-slot>
            <p>Content here...</p>
        </x-card>
    </div>

    <x-slot:footer>
        <p class="text-center text-sm text-gray-500">Custom footer for this page</p>
    </x-slot>
</x-layouts.app>
```
