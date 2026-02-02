---
name: AdvancedComponents.blade
description: Complete examples of advanced component patterns
file-type: blade
---

# Advanced Components - Complete Examples

## @aware - Parent Data Inheritance

### Parent Component - Menu

```blade
{{-- resources/views/components/menu.blade.php --}}
@props([
    'color' => 'gray',
    'size' => 'md'
])

<nav {{ $attributes->merge(['class' => "menu menu-{$size}"]) }}>
    <ul class="menu-list">
        {{ $slot }}
    </ul>
</nav>
```

### Child Component - MenuItem

```blade
{{-- resources/views/components/menu-item.blade.php --}}
@aware([
    'color' => 'gray',
    'size' => 'md'
])

@props([
    'href' => '#',
    'active' => false
])

<li>
    <a
        href="{{ $href }}"
        {{ $attributes->class([
            "menu-item text-{$color}-600 hover:text-{$color}-800",
            "text-sm" => $size === 'sm',
            "text-base" => $size === 'md',
            "text-lg" => $size === 'lg',
            "font-bold border-b-2 border-{$color}-500" => $active,
        ]) }}
    >
        {{ $slot }}
    </a>
</li>
```

### Usage

```blade
{{-- All menu items inherit color="blue" and size="lg" --}}
<x-menu color="blue" size="lg">
    <x-menu-item href="/" active>Home</x-menu-item>
    <x-menu-item href="/about">About</x-menu-item>
    <x-menu-item href="/contact">Contact</x-menu-item>
</x-menu>
```

## @aware - Accordion Pattern

### Accordion Parent

```blade
{{-- resources/views/components/accordion.blade.php --}}
@props([
    'multiple' => false,
    'defaultOpen' => null
])

<div
    x-data="{
        active: {{ $defaultOpen ? "'{$defaultOpen}'" : 'null' }},
        multiple: {{ $multiple ? 'true' : 'false' }},
        toggle(id) {
            if (this.multiple) {
                this.active = this.active === id ? null : id;
            } else {
                this.active = this.active === id ? null : id;
            }
        }
    }"
    {{ $attributes->merge(['class' => 'accordion divide-y']) }}
>
    {{ $slot }}
</div>
```

### Accordion Item (uses @aware)

```blade
{{-- resources/views/components/accordion-item.blade.php --}}
@aware(['multiple' => false])

@props([
    'id',
    'title'
])

<div class="accordion-item">
    <button
        @click="toggle('{{ $id }}')"
        class="w-full py-4 text-left font-medium flex justify-between"
        :class="{ 'text-blue-600': active === '{{ $id }}' }"
    >
        {{ $title }}
        <span x-text="active === '{{ $id }}' ? '−' : '+'"></span>
    </button>

    <div
        x-show="active === '{{ $id }}'"
        x-collapse
        class="pb-4"
    >
        {{ $slot }}
    </div>
</div>
```

### Usage

```blade
<x-accordion default-open="faq-1">
    <x-accordion-item id="faq-1" title="What is your return policy?">
        We offer 30-day returns on all items.
    </x-accordion-item>

    <x-accordion-item id="faq-2" title="How long does shipping take?">
        Standard shipping takes 5-7 business days.
    </x-accordion-item>
</x-accordion>
```

## shouldRender() - Conditional Rendering

### Alert Component

```php
<?php
// app/View/Components/Alert.php

namespace App\View\Components;

use Illuminate\View\Component;
use Illuminate\Contracts\View\View;

class Alert extends Component
{
    public function __construct(
        public ?string $message = null,
        public string $type = 'info'
    ) {}

    /**
     * Component only renders if message exists
     */
    public function shouldRender(): bool
    {
        return $this->message !== null && $this->message !== '';
    }

    public function render(): View
    {
        return view('components.alert');
    }

    public function typeClasses(): string
    {
        return match($this->type) {
            'success' => 'bg-green-100 text-green-800 border-green-300',
            'error' => 'bg-red-100 text-red-800 border-red-300',
            'warning' => 'bg-yellow-100 text-yellow-800 border-yellow-300',
            default => 'bg-blue-100 text-blue-800 border-blue-300',
        };
    }
}
```

```blade
{{-- resources/views/components/alert.blade.php --}}
<div {{ $attributes->merge(['class' => "p-4 rounded border {$typeClasses()}"]) }}>
    {{ $message }}
</div>
```

### Usage

```blade
{{-- Renders alert --}}
<x-alert message="Operation successful!" type="success" />

{{-- Does NOT render (no HTML output at all) --}}
<x-alert :message="null" />
<x-alert message="" />
```

### Feature Flag Component

```php
<?php
// app/View/Components/Feature.php

namespace App\View\Components;

use Illuminate\View\Component;
use Illuminate\Contracts\View\View;

class Feature extends Component
{
    public function __construct(
        public string $flag
    ) {}

    public function shouldRender(): bool
    {
        return config("features.{$this->flag}", false);
    }

    public function render(): View
    {
        return view('components.feature');
    }
}
```

```blade
{{-- resources/views/components/feature.blade.php --}}
{{ $slot }}
```

### Usage

```blade
{{-- Only renders if features.ai-chat is true in config --}}
<x-feature flag="ai-chat">
    <x-ai-chat-widget />
</x-feature>
```

## Index Components

### Directory Structure

```
resources/views/components/
├── card/
│   ├── index.blade.php      → <x-card>
│   ├── header.blade.php     → <x-card.header>
│   ├── body.blade.php       → <x-card.body>
│   └── footer.blade.php     → <x-card.footer>
├── form/
│   ├── index.blade.php      → <x-form>
│   ├── input.blade.php      → <x-form.input>
│   ├── select.blade.php     → <x-form.select>
│   └── button.blade.php     → <x-form.button>
```

### Card Index Component

```blade
{{-- resources/views/components/card/index.blade.php --}}
@props([
    'padding' => true
])

<div {{ $attributes->merge(['class' => 'bg-white rounded-lg shadow']) }}>
    @if(isset($header))
        <x-card.header>{{ $header }}</x-card.header>
    @endif

    <x-card.body :padding="$padding">
        {{ $slot }}
    </x-card.body>

    @if(isset($footer))
        <x-card.footer>{{ $footer }}</x-card.footer>
    @endif
</div>
```

```blade
{{-- resources/views/components/card/header.blade.php --}}
<div {{ $attributes->merge(['class' => 'px-6 py-4 border-b']) }}>
    {{ $slot }}
</div>
```

```blade
{{-- resources/views/components/card/body.blade.php --}}
@props(['padding' => true])

<div {{ $attributes->merge(['class' => $padding ? 'p-6' : '']) }}>
    {{ $slot }}
</div>
```

```blade
{{-- resources/views/components/card/footer.blade.php --}}
<div {{ $attributes->merge(['class' => 'px-6 py-4 border-t bg-gray-50']) }}>
    {{ $slot }}
</div>
```

### Usage

```blade
{{-- Simple card --}}
<x-card>
    Content here
</x-card>

{{-- Card with header and footer --}}
<x-card>
    <x-slot:header>
        <h3 class="text-lg font-semibold">Card Title</h3>
    </x-slot>

    <p>Card content goes here.</p>

    <x-slot:footer>
        <x-button>Save</x-button>
    </x-slot>
</x-card>

{{-- Using sub-components directly --}}
<div class="custom-card">
    <x-card.header>Custom Header</x-card.header>
    <x-card.body :padding="false">
        <img src="/image.jpg" class="w-full">
    </x-card.body>
</div>
```

## Component Namespacing (Packages)

### Register in Service Provider

```php
<?php
// packages/my-ui/src/MyUiServiceProvider.php

namespace MyVendor\MyUi;

use Illuminate\Support\Facades\Blade;
use Illuminate\Support\ServiceProvider;

class MyUiServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // Register anonymous components
        Blade::anonymousComponentPath(
            __DIR__ . '/../resources/views/components',
            'myui'
        );

        // Or register class-based components
        Blade::componentNamespace(
            'MyVendor\\MyUi\\View\\Components',
            'myui'
        );
    }
}
```

### Package Component

```blade
{{-- packages/my-ui/resources/views/components/button.blade.php --}}
@props([
    'variant' => 'primary',
    'size' => 'md'
])

<button {{ $attributes->merge([
    'class' => "myui-btn myui-btn-{$variant} myui-btn-{$size}"
]) }}>
    {{ $slot }}
</button>
```

### Usage in App

```blade
{{-- Using package component with namespace --}}
<x-myui::button variant="secondary">
    Click Me
</x-myui::button>

<x-myui::card>
    <x-myui::badge>New</x-myui::badge>
    Package UI content
</x-myui::card>
```

## Scoped Slots - Passing Data Back

```blade
{{-- resources/views/components/data-list.blade.php --}}
@props(['items'])

<ul {{ $attributes->merge(['class' => 'divide-y']) }}>
    @foreach($items as $index => $item)
        <li class="py-2">
            {{-- Pass data back to parent through scoped slot --}}
            {{ $slot($item, $index, $loop) }}
        </li>
    @endforeach
</ul>
```

### Usage with Scoped Data

```blade
<x-data-list :items="$users">
    @scope($user, $index, $loop)
        <div class="flex justify-between">
            <span>{{ $index + 1 }}. {{ $user->name }}</span>
            <span class="text-gray-500">{{ $user->email }}</span>
            @if($loop->first)
                <x-badge>First</x-badge>
            @endif
        </div>
    @endscope
</x-data-list>
```
