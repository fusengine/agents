---
name: FormComponent
description: Form with validation, CSRF, and error handling
when-to-use: Building forms with proper security and UX
keywords: form, csrf, validation, errors, input
---

# Form Component

## Form Wrapper

```blade
{{-- resources/views/components/form.blade.php --}}
@props([
    'action' => '',
    'method' => 'POST',
    'hasFiles' => false,
])

@php
    $realMethod = strtoupper($method);
    $formMethod = in_array($realMethod, ['GET', 'POST']) ? $realMethod : 'POST';
@endphp

<form
    action="{{ $action }}"
    method="{{ $formMethod }}"
    {{ $attributes->merge(['class' => 'space-y-6']) }}
    @if ($hasFiles) enctype="multipart/form-data" @endif
>
    @csrf

    @if (!in_array($realMethod, ['GET', 'POST']))
        @method($realMethod)
    @endif

    {{ $slot }}
</form>
```

## Complete Contact Form

```blade
{{-- resources/views/contact.blade.php --}}
<x-layouts.app title="Contact Us">
    <div class="max-w-2xl mx-auto">
        <h1 class="text-2xl font-bold mb-6">Contact Us</h1>

        <x-form action="{{ route('contact.store') }}">
            {{-- Name --}}
            <div>
                <x-label for="name" required>Name</x-label>
                <x-input
                    name="name"
                    :value="old('name')"
                    placeholder="Your full name"
                    required
                    autofocus
                />
                <x-error name="name" />
            </div>

            {{-- Email --}}
            <div>
                <x-label for="email" required>Email</x-label>
                <x-input
                    type="email"
                    name="email"
                    :value="old('email')"
                    placeholder="your@email.com"
                    required
                />
                <x-error name="email" />
            </div>

            {{-- Subject --}}
            <div>
                <x-label for="subject">Subject</x-label>
                <x-select name="subject">
                    <option value="">Select a topic</option>
                    <option value="general" @selected(old('subject') === 'general')>General Inquiry</option>
                    <option value="support" @selected(old('subject') === 'support')>Support</option>
                    <option value="feedback" @selected(old('subject') === 'feedback')>Feedback</option>
                </x-select>
                <x-error name="subject" />
            </div>

            {{-- Message --}}
            <div>
                <x-label for="message" required>Message</x-label>
                <x-textarea
                    name="message"
                    rows="5"
                    placeholder="How can we help you?"
                    required
                >{{ old('message') }}</x-textarea>
                <x-error name="message" />
            </div>

            {{-- File Upload --}}
            <div>
                <x-label for="attachment">Attachment (optional)</x-label>
                <x-file-input name="attachment" accept=".pdf,.doc,.docx,.png,.jpg" />
                <x-error name="attachment" />
                <p class="text-sm text-gray-500 mt-1">Max 10MB. PDF, Word, or images.</p>
            </div>

            {{-- Terms --}}
            <div class="flex items-start">
                <x-checkbox name="terms" id="terms" required />
                <x-label for="terms" class="ml-2">
                    I agree to the <a href="/terms" class="text-blue-600 hover:underline">Terms of Service</a>
                </x-label>
            </div>
            <x-error name="terms" />

            {{-- Submit --}}
            <div class="flex items-center justify-end space-x-4">
                <x-button type="button" variant="ghost" onclick="history.back()">
                    Cancel
                </x-button>
                <x-button type="submit">
                    Send Message
                </x-button>
            </div>
        </x-form>
    </div>
</x-layouts.app>
```

## Supporting Components

### Label

```blade
{{-- resources/views/components/label.blade.php --}}
@props(['required' => false])

<label {{ $attributes->merge(['class' => 'block text-sm font-medium text-gray-700']) }}>
    {{ $slot }}
    @if ($required)
        <span class="text-red-500">*</span>
    @endif
</label>
```

### Error

```blade
{{-- resources/views/components/error.blade.php --}}
@props(['name'])

@error($name)
    <p {{ $attributes->merge(['class' => 'mt-1 text-sm text-red-600']) }}>
        {{ $message }}
    </p>
@enderror
```

### Textarea

```blade
{{-- resources/views/components/textarea.blade.php --}}
@props(['name', 'disabled' => false])

<textarea
    name="{{ $name }}"
    id="{{ $name }}"
    {{ $attributes->merge([
        'class' => 'block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
    ])->class([
        'border-red-300 text-red-900' => $errors->has($name)
    ]) }}
    @disabled($disabled)
>{{ $slot }}</textarea>
```

### Select

```blade
{{-- resources/views/components/select.blade.php --}}
@props(['name', 'disabled' => false])

<select
    name="{{ $name }}"
    id="{{ $name }}"
    {{ $attributes->merge([
        'class' => 'block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
    ])->class([
        'border-red-300' => $errors->has($name)
    ]) }}
    @disabled($disabled)
>
    {{ $slot }}
</select>
```

### Checkbox

```blade
{{-- resources/views/components/checkbox.blade.php --}}
@props(['name' => '', 'value' => '1', 'checked' => false])

<input
    type="checkbox"
    name="{{ $name }}"
    value="{{ $value }}"
    {{ $attributes->merge(['class' => 'h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500']) }}
    @checked($checked || old($name) === $value)
>
```

### File Input

```blade
{{-- resources/views/components/file-input.blade.php --}}
@props(['name'])

<input
    type="file"
    name="{{ $name }}"
    id="{{ $name }}"
    {{ $attributes->merge([
        'class' => 'block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
    ]) }}
>
```
