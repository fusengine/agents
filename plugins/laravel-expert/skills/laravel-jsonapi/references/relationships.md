---
name: jsonapi-relationships
description: Relationships, inclusion, and links
---

# Relationships & Inclusion

## Declaring relationships

Simple form - the `$relationships` property (resource class auto-discovered, or given explicitly):

```php
public $relationships = [
    'author' => UserResource::class,
    'comments',
];
```

Full control - override `toRelationships()`:

```php
public function toRelationships(Request $request): array
{
    return [
        'author' => UserResource::class,
        'comments' => fn () => CommentResource::collection(
            $this->comments->where('is_public', true),
        ),
    ];
}
```

Relationships are only serialized when the client requests them via `include`; closures are resolved only then. Limit nesting with `JsonApiResource::maxRelationshipDepth(3)` in a service provider.

## Client request

```http
GET /api/posts/1?include=author,comments
```

## Response

```json
{
  "data": {
    "id": "1",
    "type": "posts",
    "attributes": {"title": "Hello World"},
    "relationships": {
      "author": {
        "data": {"id": "1", "type": "users"},
        "links": {"self": "/posts/1/relationships/author", "related": "/posts/1/author"}
      },
      "comments": {
        "data": [{"id": "1", "type": "comments"}]
      }
    }
  },
  "included": [
    {"id": "1", "type": "users", "attributes": {"name": "Taylor"}},
    {"id": "1", "type": "comments", "attributes": {"body": "Great post!"}}
  ]
}
```

## Nested inclusion

```http
GET /api/posts/1?include=comments.author
```

Includes comments AND each comment's author in `included`.

## Eager loading

Match query to includes:

```php
$post = Post::with(['author', 'comments.author'])->findOrFail($id);
return PostResource::make($post);
```

For dynamic loading based on `include`:

```php
$includes = explode(',', $request->query('include', ''));
$post = Post::with(array_filter($includes))->findOrFail($id);
```

## Resource identifier objects

A relationship `data` is always a resource identifier - `{id, type}` - NEVER the full object. Full objects live in `included`. The base class enforces this automatically.

To include every already eager-loaded relation regardless of the query string: `$post->load('author')->toResource()->includePreviouslyLoadedRelationships()`.

## Links

```php
public function toLinks(Request $request): array
{
    return [
        'self' => route('posts.show', $this->resource),
    ];
}
```

For collections, pagination links (`first`, `last`, `prev`, `next`) are auto-generated when using `paginate()`.
