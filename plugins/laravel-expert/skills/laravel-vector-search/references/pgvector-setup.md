---
name: pgvector-setup
description: Install pgvector and create vector-aware tables
---

# pgvector Setup

## Requirements

- PostgreSQL 16+
- `pgvector` extension 0.7+ (ships with most managed Postgres providers; on Docker add `pgvector/pgvector:pg16` image)
- Alternative: **MariaDB 11.7+** also supports `vector` columns, vector indexes (13.13+) and vector distance queries (13.27+) — no extension needed

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
            $table->vector('embedding', dimensions: 1536)->index(); // OpenAI text-embedding-3-small, HNSW cosine index
            $table->string('embedding_model')->default('text-embedding-3-small');
            $table->timestamps();
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
// HNSW + vector_cosine_ops on PostgreSQL (M=6, cosine on MariaDB) — no algorithm argument
$table->vectorIndex('embedding');
// or: $table->vector('embedding', dimensions: 1536)->index();
// drop (13.30+): $table->dropVectorIndex('documents_embedding_vectorindex');

// IVFFlat is not exposed by the Schema builder — use raw SQL
DB::statement('CREATE INDEX documents_embedding_ivfflat ON documents USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100)');
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

- `vectorIndex` creates an HNSW cosine index with defaults; to tune `m` / `ef_construction`, create the index with raw SQL after profiling
- Build the index AFTER bulk inserts during initial ingestion to avoid per-row index update overhead
