---
name: embedding-service-template
description: Service to batch generate and persist embeddings
---

# Template: EmbeddingService

```php
<?php

declare(strict_types=1);

namespace App\Ai\Services;

use App\Models\Document;
use Illuminate\Support\Collection;
use Laravel\Ai\Embeddings;
use Laravel\Ai\Enums\Lab;

final class EmbeddingService
{
    public function __construct(
        private readonly Lab $provider = Lab::OpenAI,
        private readonly string $model = 'text-embedding-3-small',
        private readonly int $dimensions = 1536,
    ) {
    }

    /**
     * Generate embeddings for an array of texts and persist as Documents.
     *
     * @param array<int, array{content: string, metadata?: array}> $items
     * @return Collection<int, Document>
     */
    public function ingest(array $items): Collection
    {
        $texts = array_map(fn ($item) => $item['content'], $items);

        $response = Embeddings::for($texts)
            ->dimensions($this->dimensions)
            ->generate($this->provider, $this->model);

        return collect($items)->map(fn ($item, $i) => Document::create([
            'content' => $item['content'],
            'metadata' => $item['metadata'] ?? [],
            'embedding' => $response->embeddings[$i],
        ]));
    }

    /**
     * Generate a single query embedding for similarity search.
     *
     * @return array<int, float>
     */
    public function queryEmbedding(string $query): array
    {
        $response = Embeddings::for([$query])
            ->dimensions($this->dimensions)
            ->generate($this->provider, $this->model);

        return $response->embeddings[0];
    }
}
```

## Usage

```php
$service = app(EmbeddingService::class);

$service->ingest([
    ['content' => 'Napa Valley has great wine.'],
    ['content' => 'Laravel is a PHP framework.'],
]);

$qVec = $service->queryEmbedding('best wines');

$docs = Document::query()
    ->whereVectorSimilarTo('embedding', $qVec, minSimilarity: 0.4)
    ->limit(10)
    ->get();
```
