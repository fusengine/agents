---
name: vector-search-service-template
description: Reusable service combining ingestion and search
---

# Template: VectorSearchService

```php
<?php

declare(strict_types=1);

namespace App\Ai\Services;

use App\Models\Document;
use Illuminate\Support\Collection;
use Laravel\Ai\Embeddings;
use Laravel\Ai\Enums\Lab;

final class VectorSearchService
{
    public function __construct(
        private readonly Lab $provider = Lab::OpenAI,
        private readonly string $model = 'text-embedding-3-small',
        private readonly int $dimensions = 1536,
    ) {
    }

    /**
     * Ingest a batch of documents (generates embeddings).
     *
     * @param array<int, array{user_id: int, content: string, metadata?: array}> $items
     * @return Collection<int, Document>
     */
    public function ingest(array $items): Collection
    {
        $texts = array_map(fn ($item) => $item['content'], $items);

        $response = Embeddings::for($texts)
            ->dimensions($this->dimensions)
            ->generate($this->provider, $this->model);

        return collect($items)->map(fn ($item, $i) => Document::create([
            'user_id' => $item['user_id'],
            'content' => $item['content'],
            'metadata' => $item['metadata'] ?? [],
            'embedding' => $response->embeddings[$i],
            'embedding_model' => $this->model,
            'embedded_at' => now(),
        ]));
    }

    /**
     * Semantic search with hybrid filtering.
     *
     * @return Collection<int, Document>
     */
    public function search(
        string $query,
        int $userId,
        float $minSimilarity = 0.4,
        int $limit = 10,
    ): Collection {
        return Document::query()
            ->whereVectorSimilarTo('embedding', $query, minSimilarity: $minSimilarity)
            ->where('user_id', $userId)
            ->where('embedding_model', $this->model)
            ->limit($limit)
            ->get();
    }

    /**
     * Re-embed a document after its content changed.
     */
    public function reembed(Document $document): Document
    {
        $response = Embeddings::for([$document->content])
            ->dimensions($this->dimensions)
            ->generate($this->provider, $this->model);

        $document->update([
            'embedding' => $response->embeddings[0],
            'embedding_model' => $this->model,
            'embedded_at' => now(),
        ]);

        return $document;
    }
}
```

## Usage

```php
$service = app(VectorSearchService::class);

$service->ingest([
    ['user_id' => 1, 'content' => 'Napa Valley produces excellent wines.'],
    ['user_id' => 1, 'content' => 'Laravel is a PHP framework.'],
]);

$results = $service->search('best wine regions', userId: 1, minSimilarity: 0.5);
```
