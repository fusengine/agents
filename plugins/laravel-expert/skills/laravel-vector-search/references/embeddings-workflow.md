---
name: embeddings-workflow
description: Generate and persist embeddings end-to-end
---

# Embedding Workflow

## 1. Generate

Single string:

```php
use Illuminate\Support\Str;

$embedding = Str::of('Napa Valley has great wine.')->toEmbeddings();
```

Batch (recommended for ingestion):

```php
use Laravel\Ai\Embeddings;
use Laravel\Ai\Enums\Lab;

$response = Embeddings::for([
    'Doc 1 content...',
    'Doc 2 content...',
])->dimensions(1536)->generate(Lab::OpenAI, 'text-embedding-3-small');
```

## 2. Persist

```php
use App\Models\Document;

Document::create([
    'content' => $text,
    'embedding' => $response->embeddings[0],
    'embedding_model' => 'text-embedding-3-small',
]);
```

Model setup - see [Document-model.php.md](templates/Document-model.php.md).

## 3. Query

```php
$queryEmbedding = Str::of('best wines')->toEmbeddings();

$results = Document::query()
    ->whereVectorSimilarTo('embedding', $queryEmbedding, minSimilarity: 0.4)
    ->limit(10)
    ->get();
```

Or let Laravel generate the query embedding inline:

```php
$results = Document::query()
    ->whereVectorSimilarTo('embedding', 'best wines', minSimilarity: 0.4)
    ->limit(10)
    ->get();
```

## 4. Re-embed on model change

When upgrading the embedding model:

```php
Document::where('embedding_model', '!=', 'text-embedding-3-large')
    ->chunkById(100, function ($docs) {
        $vectors = Embeddings::for($docs->pluck('content')->all())
            ->dimensions(3072)
            ->generate(Lab::OpenAI, 'text-embedding-3-large');

        foreach ($docs as $i => $doc) {
            $doc->update([
                'embedding' => $vectors->embeddings[$i],
                'embedding_model' => 'text-embedding-3-large',
            ]);
        }
    });
```

Don't forget to migrate the column type if dimensions change:

```php
Schema::table('documents', function (Blueprint $table) {
    $table->vector('embedding', 3072)->change();
});
```

## Notes

- Always batch ingestion - per-row API calls are 50-100x slower
- Cache query embeddings for repeated queries (Redis with a short TTL)
- Embedding generation is asynchronous-friendly - dispatch a queue job for bulk re-embeds
