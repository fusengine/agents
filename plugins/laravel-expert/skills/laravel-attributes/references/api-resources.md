---
name: api-resource-attributes
description: API Resource attributes shipped in Laravel 13
---

# API Resource Attributes (Laravel 13)

Namespace: `Illuminate\Http\Resources\Attributes\*`

## Collection wrapping

```php
use Illuminate\Http\Resources\Attributes\Collects;
use Illuminate\Http\Resources\Json\ResourceCollection;

#[Collects(PostResource::class)]
class PostCollection extends ResourceCollection {}
```

Replaces `public $collects = PostResource::class;` - declares which Resource each item should be wrapped with.

## Preserve keys

```php
use Illuminate\Http\Resources\Attributes\PreserveKeys;
use Illuminate\Http\Resources\Json\JsonResource;

#[PreserveKeys]
class PostResource extends JsonResource {}
```

Marker attribute - replaces `public $preserveKeys = true`. Keeps associative array keys instead of re-indexing numerically.

## Example output

Without `#[PreserveKeys]`:

```json
[{"id":1}, {"id":2}]
```

With `#[PreserveKeys]` on a keyed collection:

```json
{"a": {"id":1}, "b": {"id":2}}
```

## Notes

- For JSON:API compliant responses, prefer the dedicated `JsonApiResource` base class (see `laravel-jsonapi` skill)
- `#[Collects]` only applies to `ResourceCollection`, not standalone `JsonResource`
