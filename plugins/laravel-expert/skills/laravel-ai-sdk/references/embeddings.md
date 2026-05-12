---
name: ai-sdk-embeddings
description: Generate vector embeddings via Laravel AI SDK
---

# Embeddings

## Single string (Stringable)

```php
use Illuminate\Support\Str;

$embedding = Str::of('Napa Valley has great wine.')->toEmbeddings();
// returns array<float>
```

## Batch (recommended)

```php
use Laravel\Ai\Embeddings;

$response = Embeddings::for([
    'Napa Valley has great wine.',
    'Laravel is a PHP framework.',
])->generate();

$response->embeddings;
// [[0.123, 0.456, ...], [0.789, 0.012, ...]]
```

## Specify provider and dimensions

```php
use Laravel\Ai\Embeddings;
use Laravel\Ai\Enums\Lab;

$response = Embeddings::for(['Napa Valley has great wine.'])
    ->dimensions(1536)
    ->generate(Lab::OpenAI, 'text-embedding-3-small');
```

## Common models

| Provider | Model | Dimensions |
|----------|-------|------------|
| OpenAI | `text-embedding-3-small` | 1536 (default) or 512 |
| OpenAI | `text-embedding-3-large` | 3072 |
| Cohere | `embed-multilingual-v3.0` | 1024 |
| VoyageAI | `voyage-3` | 1024 |
| Jina | `jina-embeddings-v3` | 1024 |

## Persist to pgvector

See companion skill `laravel-vector-search` for storage and similarity queries.

```php
$document = Document::create([
    'content' => $text,
    'embedding' => Str::of($text)->toEmbeddings(),
]);
```

## Notes

- Batch many strings in one call - the SDK respects provider batch limits
- Cache embeddings; regenerating is the dominant cost in RAG pipelines
- Match the embedding model between insert-time and query-time, otherwise distances are meaningless
