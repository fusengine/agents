---
name: ai-sdk-tools
description: Tool calling with FileSearch and custom tools
---

# Tool Calling

## FileSearch (built-in RAG)

```php
use Laravel\Ai\Providers\Tools\FileSearch;

class SalesCoach implements Agent
{
    use Promptable;

    public function tools(): iterable
    {
        return [
            new FileSearch(stores: ['store_id_1', 'store_id_2']),
        ];
    }
}
```

Vector stores are managed via the provider's dashboard (OpenAI Files API, Anthropic, etc.).

## Custom tools

Scaffold with `php artisan make:tool SearchProducts`. A tool implements `Laravel\Ai\Contracts\Tool` with `description()`, `handle(Request $request)` and `schema(JsonSchema $schema)`.

```php
<?php

namespace App\Ai\Tools;

use App\Models\Product;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Tools\Request;
use Stringable;

class SearchProducts implements Tool
{
    public function description(): Stringable|string
    {
        return 'Search the product catalog by keyword';
    }

    public function handle(Request $request): Stringable|string
    {
        return Product::query()
            ->where('name', 'like', "%{$request['query']}%")
            ->limit($request['limit'] ?? 5)
            ->get()
            ->toJson();
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'query' => $schema->string()->required(),
            'limit' => $schema->integer()->min(1),
        ];
    }
}
```

Register in the agent:

```php
public function tools(): iterable
{
    return [
        new SearchProducts(),
        new FileSearch(stores: ['catalog_store']),
    ];
}
```

## How tool calls work

1. Model decides to call `SearchProducts(query: "wine", limit: 3)`
2. SDK invokes `handle()` with the arguments and feeds the result back to the model
3. Model continues reasoning - up to `#[MaxSteps]` iterations

## Notes

- Tool arguments are declared in `schema()` with the `JsonSchema` builder - not inferred from PHP types
- `handle()` returns `Stringable|string` - encode structured data yourself (e.g. `->toJson()`)
- For long-running tools, set `#[Timeout]` on the agent generously
