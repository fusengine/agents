---
name: BladeExamples
description: Complete Blade directive examples for permission checks
keywords: blade, directive, role, can, permission, view
---

# Blade Directive Examples

Complete examples of Spatie Permission Blade directives.

## File: resources/views/layouts/navigation.blade.php

```blade
<nav class="bg-white shadow">
    <div class="container mx-auto px-4">
        <ul class="flex space-x-4">
            {{-- Visible to all authenticated users --}}
            <li><a href="{{ route('dashboard') }}">Dashboard</a></li>

            {{-- Role-based navigation --}}
            @role('admin')
                <li><a href="{{ route('admin.dashboard') }}">Admin Panel</a></li>
            @endrole

            @hasrole('writer')
                <li><a href="{{ route('articles.create') }}">Write Article</a></li>
            @endhasrole

            {{-- Multiple roles (OR) --}}
            @hasanyrole('admin|editor')
                <li><a href="{{ route('articles.moderate') }}">Moderate</a></li>
            @endhasanyrole

            {{-- Multiple roles (AND) --}}
            @hasallroles('writer|reviewer')
                <li><a href="{{ route('peer-review') }}">Peer Review</a></li>
            @endhasallroles

            {{-- Permission-based navigation --}}
            @can('view reports')
                <li><a href="{{ route('reports.index') }}">Reports</a></li>
            @endcan

            {{-- Exclude guests --}}
            @unlessrole('guest')
                <li><a href="{{ route('profile') }}">My Profile</a></li>
            @endunlessrole
        </ul>
    </div>
</nav>
```

## File: resources/views/articles/show.blade.php

```blade
<article class="prose">
    <h1>{{ $article->title }}</h1>
    <div class="content">{{ $article->content }}</div>

    {{-- Action buttons based on permissions --}}
    <div class="actions mt-4 space-x-2">
        @can('edit articles')
            <a href="{{ route('articles.edit', $article) }}"
               class="btn btn-primary">
                Edit Article
            </a>
        @endcan

        @can('publish articles')
            @if(!$article->is_published)
                <form action="{{ route('articles.publish', $article) }}" method="POST" class="inline">
                    @csrf
                    <button type="submit" class="btn btn-success">
                        Publish
                    </button>
                </form>
            @endif
        @endcan

        @can('delete articles')
            <form action="{{ route('articles.destroy', $article) }}" method="POST" class="inline">
                @csrf
                @method('DELETE')
                <button type="submit" class="btn btn-danger"
                        onclick="return confirm('Are you sure?')">
                    Delete
                </button>
            </form>
        @endcan
    </div>
</article>
```

## File: resources/views/articles/index.blade.php

```blade
<div class="articles">
    <div class="flex justify-between items-center mb-4">
        <h1>Articles</h1>

        {{-- Create button if permitted --}}
        @can('create articles')
            <a href="{{ route('articles.create') }}" class="btn btn-primary">
                New Article
            </a>
        @endcan
    </div>

    <table class="table">
        <thead>
            <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Status</th>
                @canany(['edit articles', 'delete articles'])
                    <th>Actions</th>
                @endcanany
            </tr>
        </thead>
        <tbody>
            @foreach($articles as $article)
                <tr>
                    <td>{{ $article->title }}</td>
                    <td>{{ $article->author->name }}</td>
                    <td>{{ $article->status }}</td>

                    @canany(['edit articles', 'delete articles'])
                        <td class="space-x-2">
                            @can('edit articles')
                                <a href="{{ route('articles.edit', $article) }}">Edit</a>
                            @endcan

                            @can('delete articles')
                                <form action="{{ route('articles.destroy', $article) }}"
                                      method="POST" class="inline">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit">Delete</button>
                                </form>
                            @endcan
                        </td>
                    @endcanany
                </tr>
            @endforeach
        </tbody>
    </table>
</div>
```

## Policy Integration Example

```blade
{{-- Using with Laravel Policy --}}
@can('update', $article)
    <a href="{{ route('articles.edit', $article) }}">Edit</a>
@endcan

@can('delete', $article)
    <button>Delete</button>
@endcan

{{-- Check policy for model class --}}
@can('create', App\Models\Article::class)
    <a href="{{ route('articles.create') }}">New Article</a>
@endcan
```

## Inverse Checks

```blade
{{-- Show message if user cannot edit --}}
@cannot('edit articles')
    <p class="text-gray-500">You don't have permission to edit articles.</p>
@endcannot

{{-- Content for non-admins --}}
@unlessrole('admin')
    <p>Contact an admin for more access.</p>
@endunlessrole
```
