---
name: CardWithSlots
description: Card component with named slots pattern
when-to-use: Complex layouts with multiple content areas
keywords: card, slots, named-slots, x-slot, composition
---

# Card with Named Slots

## Card Component

```blade
{{-- resources/views/components/card.blade.php --}}
@props([
    'padding' => true,
    'shadow' => 'md',
    'rounded' => 'lg',
])

@php
    $shadows = [
        'none' => '',
        'sm' => 'shadow-sm',
        'md' => 'shadow-md',
        'lg' => 'shadow-lg',
        'xl' => 'shadow-xl',
    ];

    $roundings = [
        'none' => '',
        'sm' => 'rounded-sm',
        'md' => 'rounded-md',
        'lg' => 'rounded-lg',
        'xl' => 'rounded-xl',
        'full' => 'rounded-2xl',
    ];
@endphp

<div {{ $attributes->merge([
    'class' => 'bg-white overflow-hidden ' . $shadows[$shadow] . ' ' . $roundings[$rounded]
]) }}>
    {{-- Header --}}
    @if (isset($header))
        <div {{ $header->attributes->class(['px-4 py-5 sm:px-6 border-b border-gray-200']) }}>
            {{ $header }}
        </div>
    @endif

    {{-- Image --}}
    @if (isset($image))
        <div {{ $image->attributes->class(['relative']) }}>
            {{ $image }}
        </div>
    @endif

    {{-- Body --}}
    <div @class([
        'px-4 py-5 sm:p-6' => $padding,
    ])>
        {{ $slot }}
    </div>

    {{-- Footer --}}
    @if (isset($footer))
        <div {{ $footer->attributes->class(['px-4 py-4 sm:px-6 border-t border-gray-200 bg-gray-50']) }}>
            {{ $footer }}
        </div>
    @endif
</div>
```

## Basic Usage

```blade
<x-card>
    <p>Simple card with just content.</p>
</x-card>
```

## With Header and Footer

```blade
<x-card>
    <x-slot:header class="flex justify-between items-center">
        <h3 class="text-lg font-medium text-gray-900">Card Title</h3>
        <x-badge color="green">Active</x-badge>
    </x-slot>

    <p class="text-gray-600">
        This is the main content of the card.
    </p>

    <x-slot:footer class="flex justify-end space-x-3">
        <x-button variant="ghost" size="sm">Cancel</x-button>
        <x-button size="sm">Save</x-button>
    </x-slot>
</x-card>
```

## With Image

```blade
<x-card :padding="false" class="max-w-sm">
    <x-slot:image>
        <img
            src="{{ $product->image_url }}"
            alt="{{ $product->name }}"
            class="w-full h-48 object-cover"
        >
        @if ($product->is_featured)
            <span class="absolute top-2 right-2">
                <x-badge color="yellow">Featured</x-badge>
            </span>
        @endif
    </x-slot>

    <div class="p-4">
        <h3 class="font-semibold text-gray-900">{{ $product->name }}</h3>
        <p class="text-gray-600 text-sm mt-1">{{ $product->description }}</p>
        <p class="text-lg font-bold text-blue-600 mt-2">${{ $product->price }}</p>
    </div>

    <x-slot:footer class="p-4 pt-0">
        <x-button class="w-full">Add to Cart</x-button>
    </x-slot>
</x-card>
```

## Stats Card

```blade
{{-- resources/views/components/stats-card.blade.php --}}
@props([
    'title',
    'value',
    'change' => null,
    'changeType' => 'neutral', // positive, negative, neutral
])

<x-card>
    <x-slot:header class="pb-2">
        <h3 class="text-sm font-medium text-gray-500">{{ $title }}</h3>
    </x-slot>

    <div class="flex items-baseline">
        <p class="text-3xl font-semibold text-gray-900">{{ $value }}</p>

        @if ($change)
            <p @class([
                'ml-2 flex items-baseline text-sm font-semibold',
                'text-green-600' => $changeType === 'positive',
                'text-red-600' => $changeType === 'negative',
                'text-gray-500' => $changeType === 'neutral',
            ])>
                @if ($changeType === 'positive')
                    <x-heroicon-s-arrow-up class="h-4 w-4 flex-shrink-0 self-center" />
                @elseif ($changeType === 'negative')
                    <x-heroicon-s-arrow-down class="h-4 w-4 flex-shrink-0 self-center" />
                @endif
                {{ $change }}
            </p>
        @endif
    </div>

    @if ($slot->isNotEmpty())
        <div class="mt-4">
            {{ $slot }}
        </div>
    @endif
</x-card>
```

## Stats Card Usage

```blade
<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
    <x-stats-card
        title="Total Revenue"
        value="$45,231.89"
        change="+20.1%"
        change-type="positive"
    />

    <x-stats-card
        title="Active Users"
        value="2,350"
        change="-4.5%"
        change-type="negative"
    >
        <a href="{{ route('users.index') }}" class="text-sm text-blue-600 hover:underline">
            View all users →
        </a>
    </x-stats-card>

    <x-stats-card
        title="Pending Orders"
        value="12"
    />
</div>
```

## Modal Card

```blade
{{-- resources/views/components/modal.blade.php --}}
@props([
    'name',
    'maxWidth' => 'md',
])

@php
    $maxWidths = [
        'sm' => 'sm:max-w-sm',
        'md' => 'sm:max-w-md',
        'lg' => 'sm:max-w-lg',
        'xl' => 'sm:max-w-xl',
        '2xl' => 'sm:max-w-2xl',
    ];
@endphp

<div
    x-data="{ show: false }"
    x-on:open-modal.window="if ($event.detail === '{{ $name }}') show = true"
    x-on:close-modal.window="if ($event.detail === '{{ $name }}') show = false"
    x-on:keydown.escape.window="show = false"
    x-show="show"
    x-cloak
    class="fixed inset-0 z-50 overflow-y-auto"
>
    {{-- Backdrop --}}
    <div
        x-show="show"
        x-transition:enter="ease-out duration-300"
        x-transition:enter-start="opacity-0"
        x-transition:enter-end="opacity-100"
        x-transition:leave="ease-in duration-200"
        x-transition:leave-start="opacity-100"
        x-transition:leave-end="opacity-0"
        class="fixed inset-0 bg-gray-500 bg-opacity-75"
        @click="show = false"
    ></div>

    {{-- Modal --}}
    <div class="flex min-h-full items-center justify-center p-4">
        <div
            x-show="show"
            x-transition:enter="ease-out duration-300"
            x-transition:enter-start="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            x-transition:enter-end="opacity-100 translate-y-0 sm:scale-100"
            x-transition:leave="ease-in duration-200"
            x-transition:leave-start="opacity-100 translate-y-0 sm:scale-100"
            x-transition:leave-end="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            {{ $attributes->merge(['class' => 'relative w-full ' . $maxWidths[$maxWidth]]) }}
        >
            <x-card>
                @if (isset($header))
                    <x-slot:header class="flex justify-between items-center">
                        {{ $header }}
                        <button @click="show = false" class="text-gray-400 hover:text-gray-500">
                            <x-heroicon-o-x-mark class="h-5 w-5" />
                        </button>
                    </x-slot>
                @endif

                {{ $slot }}

                @if (isset($footer))
                    <x-slot:footer>
                        {{ $footer }}
                    </x-slot>
                @endif
            </x-card>
        </div>
    </div>
</div>
```
