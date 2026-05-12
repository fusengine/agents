---
name: jsonapi-relationships
description: Relationships, inclusion, and links
---

# Relationships & Inclusion

## Declaring relationships

```php
public function relationships(): array
{
    return [
        'author' => fn () => UserResource::make($this->whenLoaded('author')),
        'comments' => fn () => CommentResource::collection($this->whenLoaded('comments')),
    ];
}
```

Each closure is invoked only when the relationship is loaded AND included.

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

## Links

```php
public function toLinks($request): array
{
    return [
        'self' => route('posts.show', $this->id),
    ];
}
```

For collections, pagination links (`first`, `last`, `prev`, `next`) are auto-generated when using `paginate()`.
