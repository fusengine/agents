---
name: AnonymousComponent
description: Anonymous component without PHP class
when-to-use: Simple reusable UI elements
keywords: anonymous, simple, component, props, attributes
---

# Anonymous Component

## Button Component

```blade
{{-- resources/views/components/button.blade.php --}}
@props([
    'type' => 'button',
    'variant' => 'primary',
    'size' => 'md',
    'disabled' => false,
    'href' => null,
])

@php
    $baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

    $variants = [
        'primary' => 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        'secondary' => 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
        'danger' => 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        'ghost' => 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    ];

    $sizes = [
        'sm' => 'px-3 py-1.5 text-sm',
        'md' => 'px-4 py-2 text-base',
        'lg' => 'px-6 py-3 text-lg',
    ];

    $classes = $baseClasses . ' ' . $variants[$variant] . ' ' . $sizes[$size];
@endphp

@if ($href)
    <a
        href="{{ $href }}"
        {{ $attributes->merge(['class' => $classes]) }}
    >
        {{ $slot }}
    </a>
@else
    <button
        type="{{ $type }}"
        {{ $attributes->merge(['class' => $classes])->class([
            'opacity-50 cursor-not-allowed' => $disabled
        ]) }}
        @disabled($disabled)
    >
        {{ $slot }}
    </button>
@endif
```

## Input Component

```blade
{{-- resources/views/components/input.blade.php --}}
@props([
    'type' => 'text',
    'name' => '',
    'label' => null,
    'error' => null,
    'hint' => null,
])

@php
    $hasError = $error || $errors->has($name);
    $errorMessage = $error ?? $errors->first($name);
@endphp

<div {{ $attributes->only(['class'])->merge(['class' => 'space-y-1']) }}>
    @if ($label)
        <label for="{{ $name }}" class="block text-sm font-medium text-gray-700">
            {{ $label }}
        </label>
    @endif

    <input
        type="{{ $type }}"
        name="{{ $name }}"
        id="{{ $name }}"
        value="{{ old($name, $slot) }}"
        {{ $attributes->except(['class'])->merge([
            'class' => 'block w-full rounded-md shadow-sm sm:text-sm ' .
                ($hasError
                    ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500')
        ]) }}
    >

    @if ($hasError)
        <p class="text-sm text-red-600">{{ $errorMessage }}</p>
    @elseif ($hint)
        <p class="text-sm text-gray-500">{{ $hint }}</p>
    @endif
</div>
```

## Badge Component

```blade
{{-- resources/views/components/badge.blade.php --}}
@props([
    'color' => 'gray',
    'size' => 'md',
])

@php
    $colors = [
        'gray' => 'bg-gray-100 text-gray-800',
        'red' => 'bg-red-100 text-red-800',
        'green' => 'bg-green-100 text-green-800',
        'blue' => 'bg-blue-100 text-blue-800',
        'yellow' => 'bg-yellow-100 text-yellow-800',
    ];

    $sizes = [
        'sm' => 'px-2 py-0.5 text-xs',
        'md' => 'px-2.5 py-0.5 text-sm',
        'lg' => 'px-3 py-1 text-base',
    ];
@endphp

<span {{ $attributes->merge([
    'class' => 'inline-flex items-center font-medium rounded-full ' . $colors[$color] . ' ' . $sizes[$size]
]) }}>
    {{ $slot }}
</span>
```

## Usage Examples

```blade
{{-- Buttons --}}
<x-button>Default</x-button>
<x-button variant="secondary">Secondary</x-button>
<x-button variant="danger" size="lg">Delete</x-button>
<x-button href="/dashboard">Go to Dashboard</x-button>
<x-button :disabled="$isProcessing">
    @if ($isProcessing)
        Processing...
    @else
        Submit
    @endif
</x-button>

{{-- Inputs --}}
<x-input name="email" type="email" label="Email Address" hint="We'll never share your email" />
<x-input name="password" type="password" label="Password" :error="$passwordError" />

{{-- Badges --}}
<x-badge color="green">Active</x-badge>
<x-badge color="red" size="sm">Urgent</x-badge>
```

## Artisan Command

```bash
# Create anonymous component (view only)
php artisan make:component button --view
```
