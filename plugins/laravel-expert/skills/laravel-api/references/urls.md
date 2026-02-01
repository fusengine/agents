---
name: urls
description: Laravel URL generation for APIs
when-to-use: Generating URLs, signed URLs, route URLs
keywords: laravel, php, urls, routes, signed
priority: low
related: routing.md
---

# URL Generation

## Overview

Laravel provides helpers for generating URLs to routes, assets, and signed URLs for secure temporary access. In APIs, URL generation is useful for hypermedia links and signed resource access.

## Named Route URLs

Generate URLs to named routes using the `route()` helper:

```php
$url = route('posts.index');              // /api/v1/posts
$url = route('posts.show', ['post' => 1]); // /api/v1/posts/1
$url = route('posts.show', $post);         // Uses model ID automatically
```

## URL Helper

Basic URL generation:

```php
$url = url('/posts');              // Full URL to path
$url = url()->current();           // Current request URL
$url = url()->full();              // Current URL with query string
$url = url()->previous();          // Previous URL from referer
```

## Signed URLs

Create URLs with signature that expire or verify authenticity. Useful for email verification, temporary download links, or webhook callbacks.

```php
// Temporary signed URL (expires)
$url = URL::temporarySignedRoute(
    'download.file',
    now()->addMinutes(30),
    ['file' => $fileId]
);

// Permanent signed URL
$url = URL::signedRoute('unsubscribe', ['user' => $userId]);
```

## Validating Signed URLs

Verify signed URL authenticity in controller:

```php
if (! $request->hasValidSignature()) {
    abort(401);
}

// Or use middleware
Route::get('/download/{file}', [DownloadController::class, 'show'])
    ->name('download.file')
    ->middleware('signed');
```

## HATEOAS Links in Resources

Include related resource links in API responses:

```php
public function toArray(Request $request): array
{
    return [
        'id' => $this->id,
        'title' => $this->title,
        'links' => [
            'self' => route('posts.show', $this),
            'comments' => route('posts.comments.index', $this),
            'author' => route('users.show', $this->author_id),
        ],
    ];
}
```

## API URL Prefix

URLs generated for API routes automatically include the `/api` prefix. The version prefix (e.g., `/v1`) depends on how routes are grouped.

## Best Practices

1. **Use named routes** - `route('posts.show')` over `url('/posts/1')`
2. **Sign sensitive URLs** - Temporary downloads, verification links
3. **Set expiration** - Always expire signed URLs when possible
4. **Include links** - HATEOAS style for discoverability
5. **Absolute URLs** - Use full URLs in API responses

## Related References

- [routing.md](routing.md) - Defining named routes
- [responses.md](responses.md) - Including links in resources
