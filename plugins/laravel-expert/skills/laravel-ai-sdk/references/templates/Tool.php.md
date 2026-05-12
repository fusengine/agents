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
use Laravel\Ai\Attributes\{Description, Parameter};
use Laravel\Ai\Contracts\Tool;

final class SearchProducts implements Tool
{
    #[Description('Search the product catalog by keyword and optional category')]
    public function __invoke(
        #[Parameter('Search keyword to match against product name and description')]
        string $query,
        #[Parameter('Optional category slug filter')]
        ?string $category = null,
        #[Parameter('Max number of results to return')]
        int $limit = 5,
    ): array {
        return Product::query()
            ->where('name', 'like', "%{$query}%")
            ->orWhere('description', 'like', "%{$query}%")
            ->when($category, fn ($q) => $q->where('category_slug', $category))
            ->limit($limit)
            ->get(['id', 'name', 'price', 'category_slug'])
            ->toArray();
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

- Parameter PHP types drive the JSON Schema sent to the model
- Use nullable types + defaults for optional parameters
- Return arrays / scalars / JsonSerializable - the SDK encodes them
