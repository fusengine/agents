---
name: DynamicComponent
description: Runtime component selection with x-dynamic-component
when-to-use: Rendering different components based on data
keywords: dynamic, runtime, conditional, x-dynamic-component
---

# Dynamic Component

## Basic Usage

```blade
{{-- Render component based on variable --}}
<x-dynamic-component :component="$componentName" />

{{-- With props --}}
<x-dynamic-component
    :component="$alertType . '-alert'"
    :message="$message"
/>
```

## Widget System

```blade
{{-- resources/views/dashboard.blade.php --}}
<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
    @foreach ($widgets as $widget)
        <x-dynamic-component
            :component="'widgets.' . $widget->type"
            :data="$widget->data"
            :title="$widget->title"
        />
    @endforeach
</div>
```

### Widget Components

```blade
{{-- resources/views/components/widgets/chart.blade.php --}}
@props(['title', 'data'])

<x-card>
    <x-slot:header>{{ $title }}</x-slot>

    <div
        x-data="chartWidget(@js($data))"
        x-init="init()"
    >
        <canvas x-ref="canvas"></canvas>
    </div>
</x-card>
```

```blade
{{-- resources/views/components/widgets/stats.blade.php --}}
@props(['title', 'data'])

<x-card>
    <x-slot:header>{{ $title }}</x-slot>

    <div class="grid grid-cols-2 gap-4">
        @foreach ($data['items'] as $stat)
            <div>
                <p class="text-sm text-gray-500">{{ $stat['label'] }}</p>
                <p class="text-2xl font-semibold">{{ $stat['value'] }}</p>
            </div>
        @endforeach
    </div>
</x-card>
```

```blade
{{-- resources/views/components/widgets/recent-activity.blade.php --}}
@props(['title', 'data'])

<x-card>
    <x-slot:header>{{ $title }}</x-slot>

    <ul class="divide-y divide-gray-200">
        @foreach ($data['activities'] as $activity)
            <li class="py-3">
                <div class="flex items-center space-x-3">
                    <x-avatar :user="$activity->user" size="sm" />
                    <div>
                        <p class="text-sm text-gray-900">{{ $activity->description }}</p>
                        <p class="text-xs text-gray-500">{{ $activity->created_at->diffForHumans() }}</p>
                    </div>
                </div>
            </li>
        @endforeach
    </ul>
</x-card>
```

## Form Field Factory

```blade
{{-- resources/views/components/form-field.blade.php --}}
@props([
    'field', // Object with: type, name, label, options, rules
])

@php
    $componentMap = [
        'text' => 'input',
        'email' => 'input',
        'password' => 'input',
        'textarea' => 'textarea',
        'select' => 'select',
        'checkbox' => 'checkbox',
        'radio' => 'radio-group',
        'file' => 'file-input',
        'date' => 'date-picker',
        'rich-text' => 'rich-editor',
    ];

    $component = $componentMap[$field->type] ?? 'input';
@endphp

<div>
    @if ($field->label && !in_array($field->type, ['checkbox']))
        <x-label :for="$field->name" :required="$field->isRequired()">
            {{ $field->label }}
        </x-label>
    @endif

    <x-dynamic-component
        :component="$component"
        :type="$field->type"
        :name="$field->name"
        :value="old($field->name, $field->value)"
        :options="$field->options ?? []"
        :placeholder="$field->placeholder ?? ''"
        {{ $attributes }}
    />

    @if ($field->hint)
        <p class="mt-1 text-sm text-gray-500">{{ $field->hint }}</p>
    @endif

    <x-error :name="$field->name" />
</div>
```

### Form Field Usage

```blade
<x-form action="{{ route('users.store') }}">
    @foreach ($formSchema as $field)
        <x-form-field :field="$field" />
    @endforeach

    <x-button type="submit">Submit</x-button>
</x-form>
```

## Icon Component

```blade
{{-- resources/views/components/icon.blade.php --}}
@props([
    'name',
    'type' => 'outline', // outline, solid, mini
])

@php
    $prefix = match ($type) {
        'solid' => 'heroicon-s',
        'mini' => 'heroicon-m',
        default => 'heroicon-o',
    };
@endphp

<x-dynamic-component
    :component="$prefix . '-' . $name"
    {{ $attributes }}
/>
```

### Icon Usage

```blade
<x-icon name="user" class="h-5 w-5" />
<x-icon name="check" type="solid" class="h-5 w-5 text-green-500" />
<x-icon name="x-mark" type="mini" class="h-4 w-4" />
```

## Polymorphic Content Blocks

```blade
{{-- resources/views/page.blade.php --}}
@foreach ($page->blocks as $block)
    <x-dynamic-component
        :component="'blocks.' . $block->type"
        :content="$block->content"
        :settings="$block->settings"
    />
@endforeach
```

### Block Components

```blade
{{-- resources/views/components/blocks/hero.blade.php --}}
@props(['content', 'settings'])

<section @class([
    'py-20 px-4',
    'bg-gray-900 text-white' => $settings['dark'] ?? false,
    'bg-white' => !($settings['dark'] ?? false),
])>
    <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-4xl font-bold">{{ $content['title'] }}</h1>
        <p class="mt-4 text-xl">{{ $content['subtitle'] }}</p>
        @if ($content['cta'] ?? null)
            <x-button :href="$content['cta']['url']" class="mt-8">
                {{ $content['cta']['text'] }}
            </x-button>
        @endif
    </div>
</section>
```

```blade
{{-- resources/views/components/blocks/features.blade.php --}}
@props(['content', 'settings'])

<section class="py-16 px-4">
    <div class="max-w-6xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-12">{{ $content['title'] }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-{{ $settings['columns'] ?? 3 }} gap-8">
            @foreach ($content['features'] as $feature)
                <div class="text-center">
                    <x-icon :name="$feature['icon']" class="h-12 w-12 mx-auto text-blue-500" />
                    <h3 class="mt-4 text-lg font-semibold">{{ $feature['title'] }}</h3>
                    <p class="mt-2 text-gray-600">{{ $feature['description'] }}</p>
                </div>
            @endforeach
        </div>
    </div>
</section>
```
