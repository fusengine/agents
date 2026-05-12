---
name: document-model-template
description: Eloquent model with vector embedding column
---

# Template: Document Model

## Migration

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::ensureVectorExtensionExists();

        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->text('content');
            $table->json('metadata')->nullable();
            $table->vector('embedding', 1536);
            $table->string('embedding_model', 64)->default('text-embedding-3-small');
            $table->timestamp('embedded_at')->nullable();
            $table->timestamps();

            $table->vectorIndex('embedding', algorithm: 'hnsw');
            $table->index(['user_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
```

## Model

```php
<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\{Fillable, Table};
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Table('documents')]
#[Fillable(['user_id', 'content', 'metadata', 'embedding', 'embedding_model', 'embedded_at'])]
final class Document extends Model
{
    /**
     * @var array<string, string>
     */
    protected $casts = [
        'metadata' => 'array',
        'embedding' => 'array',
        'embedded_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope: semantic search by string or pre-computed vector.
     *
     * @param array<int, float>|string $query
     */
    public function scopeSimilarTo($builder, array|string $query, float $minSimilarity = 0.4)
    {
        return $builder->whereVectorSimilarTo('embedding', $query, minSimilarity: $minSimilarity);
    }
}
```

## Usage

```php
Document::similarTo('best wines in Napa Valley', minSimilarity: 0.5)
    ->where('user_id', auth()->id())
    ->limit(10)
    ->get();
```
