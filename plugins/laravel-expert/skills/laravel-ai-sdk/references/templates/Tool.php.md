---
name: tool-template
description: Custom AI SDK tool implementation
---

# Template: Custom Tool

```php
<?php

declare(strict_types=1);

namespace App\Ai\Tools;

use App\Models\Product;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Tools\Request;
use Stringable;

final class SearchProducts implements Tool
{
    public function description(): Stringable|string
    {
        return 'Search the product catalog by keyword and optional category';
    }

    public function handle(Request $request): Stringable|string
    {
        $query = $request['query'];
        $category = $request['category'] ?? null;

        return Product::query()
            ->where(fn ($q) => $q->where('name', 'like', "%{$query}%")
                ->orWhere('description', 'like', "%{$query}%"))
            ->when($category, fn ($q) => $q->where('category_slug', $category))
            ->limit($request['limit'] ?? 5)
            ->get(['id', 'name', 'price', 'category_slug'])
            ->toJson();
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'query' => $schema->string()->required(),
            'category' => $schema->string(),
            'limit' => $schema->integer()->min(1),
        ];
    }
}
```

## Register on an agent

```php
public function tools(): iterable
{
    return [new SearchProducts()];
}
```

## Notes

- `schema()` defines the JSON Schema sent to the model (`->required()` for mandatory args)
- Omit `->required()` for optional args and default them in `handle()`
- `handle()` returns `Stringable|string` - encode structured results yourself
