---
name: resources
description: API Resources for model transformation
when-to-use: API responses, data transformation
keywords: resource, collection, JsonResource, conditional, whenLoaded
---

# API Resources

## Decision Tree

```
Transforming for API?
├── Single model → JsonResource
├── Collection → ResourceCollection
├── Conditional fields → when(), whenLoaded()
├── Pagination → paginate() + Resource
└── Nested → Resource in Resource
```

## Resource Types

| Type | Use For |
|------|---------|
| `JsonResource` | Single model |
| `ResourceCollection` | Collection of models |
| Anonymous collection | `UserResource::collection()` |

## Creating Resources

| Command | Creates |
|---------|---------|
| `php artisan make:resource UserResource` | Single resource |
| `php artisan make:resource UserCollection` | Collection resource |

## Resource Method

| Method | Returns |
|--------|---------|
| `toArray($request)` | Array for JSON |
| `with($request)` | Additional meta |
| `withResponse($request, $response)` | Modify response |

## Conditional Attributes

| Method | Include When |
|--------|--------------|
| `when($condition, $value)` | Condition true |
| `unless($condition, $value)` | Condition false |
| `whenHas('attribute')` | Attribute exists |
| `whenNotNull('attribute')` | Not null |
| `mergeWhen($condition, [...])` | Merge attributes |

## Relationship Conditionals

| Method | Include When |
|--------|--------------|
| `whenLoaded('posts')` | Relation loaded |
| `whenCounted('posts')` | Count loaded |
| `whenAggregated('posts', 'avg', 'rating')` | Aggregate loaded |
| `whenPivotLoaded('table', fn)` | Pivot loaded |

## Nested Resources

| Pattern | Usage |
|---------|-------|
| `new UserResource($this->user)` | Single |
| `UserResource::collection($this->users)` | Collection |
| `PostResource::collection($this->whenLoaded('posts'))` | Conditional |

## Data Wrapping

| Setting | Result |
|---------|--------|
| Default | `{"data": [...]}` |
| `JsonResource::withoutWrapping()` | No wrapper |
| `$wrap = 'users'` | Custom key |

## Pagination

| Usage | Includes |
|-------|----------|
| `UserResource::collection($paginator)` | Auto meta/links |
| Response | `data`, `links`, `meta` |

## Additional Meta

| Method | Level |
|--------|-------|
| `additional(['key' => 'value'])` | Instance |
| `with($request)` | Resource class |

## Resource Response

| Method | Purpose |
|--------|---------|
| `response()->header(...)` | Add headers |
| `withResponse($request, $response)` | Full control |

## Collection Methods

| Method | Purpose |
|--------|---------|
| `$this->collection` | Access models |
| `$this->count()` | Collection count |
| `preserveKeys` | Keep array keys |

## Performance

| Pattern | Benefit |
|---------|---------|
| `whenLoaded()` | No extra queries |
| Eager load before | Single query for relations |
| Select columns | Less data transfer |

## Best Practices

| DO | DON'T |
|----|-------|
| Use `whenLoaded()` | Query in resource |
| Eager load relations | Rely on lazy loading |
| Use for public APIs | For internal data |
| Keep resources slim | Business logic in resources |
| Version API resources | Break backwards compat |

→ **Complete examples**: See [Resource.php.md](templates/Resource.php.md)
