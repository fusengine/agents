---
name: pgvector-setup
description: Install pgvector and create vector-aware tables
---

# pgvector Setup

## Requirements

- PostgreSQL 16+
- `pgvector` extension 0.7+ (ships with most managed Postgres providers; on Docker add `pgvector/pgvector:pg16` image)

## Enable extension via migration

```php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::ensureVectorExtensionExists();

        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->text('content');
            $table->json('metadata')->nullable();
            $table->vector('embedding', 1536);    // OpenAI text-embedding-3-small
            $table->string('embedding_model')->default('text-embedding-3-small');
            $table->timestamps();

            $table->vectorIndex('embedding', algorithm: 'hnsw');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
```

`Schema::ensureVectorExtensionExists()` runs `CREATE EXTENSION IF NOT EXISTS vector;` - idempotent.

## Index algorithms

| Algorithm | Build time | Query time | Recall | Use when |
|-----------|------------|------------|--------|----------|
| **HNSW** | Slow | Fast | High | Default; > 10k rows |
| **IVFFlat** | Fast | Medium | Medium | Very large datasets where build time matters |
| **None** | None | Slow (full scan) | Exact | < 1k rows or dev |

```php
$table->vectorIndex('embedding', algorithm: 'hnsw');
$table->vectorIndex('embedding', algorithm: 'ivfflat');
```

## Dimension sizing

| Model | Dimensions |
|-------|------------|
| `text-embedding-3-small` | 1536 (default) or 512 |
| `text-embedding-3-large` | 3072 |
| `embed-multilingual-v3.0` (Cohere) | 1024 |
| `voyage-3` | 1024 |
| `jina-embeddings-v3` | 1024 |

Mismatch between column dimensions and embedding model = INSERT error.

## Notes

- `vectorIndex` creates the index with sensible defaults; tune `m` / `ef_construction` in production only after profiling
- Build the index AFTER bulk inserts during initial ingestion to avoid per-row index update overhead
