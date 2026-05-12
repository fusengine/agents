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

```php
<?php

namespace App\Ai\Tools;

use App\Models\Product;
use Laravel\Ai\Attributes\{Description, Parameter};
use Laravel\Ai\Contracts\Tool;

class SearchProducts implements Tool
{
    #[Description('Search the product catalog by keyword')]
    public function __invoke(
        #[Parameter('Search keyword')] string $query,
        #[Parameter('Max results')] int $limit = 5,
    ): array {
        return Product::query()
            ->where('name', 'like', "%{$query}%")
            ->limit($limit)
            ->get()
            ->toArray();
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
2. SDK invokes `__invoke()` and feeds the JSON result back to the model
3. Model continues reasoning - up to `#[MaxSteps]` iterations

## Notes

- Tool parameters MUST be typed - the SDK builds the JSON schema from PHP types
- Return arrays, scalars, or `JsonSerializable` - the SDK json-encodes the result
- For long-running tools, set `#[Timeout]` on the agent generously
