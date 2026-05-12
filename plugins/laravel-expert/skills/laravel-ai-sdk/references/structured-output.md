---
name: ai-sdk-structured-output
description: Structured JSON output with the agent() helper and JsonSchema
---

# Structured Output

## Anonymous agent with schema

```php
use Illuminate\Contracts\JsonSchema\JsonSchema;
use function Laravel\Ai\agent;

$response = agent(
    schema: fn (JsonSchema $schema) => [
        'number' => $schema->integer()->required(),
    ],
)->prompt('Generate a random number less than 100');

$response->data; // ['number' => 42]
```

## Class-based with `--structured`

```shell
php artisan make:agent ExtractInvoice --structured
```

Generates:

```php
class ExtractInvoice implements Agent
{
    use Promptable;

    public function schema(JsonSchema $schema): array
    {
        return [
            'invoice_number' => $schema->string()->required(),
            'total' => $schema->number()->required(),
            'line_items' => $schema->array(
                items: $schema->object([
                    'description' => $schema->string()->required(),
                    'amount' => $schema->number()->required(),
                ]),
            ),
        ];
    }
}
```

## Schema builder

| Method | Maps to |
|--------|---------|
| `$schema->string()` | JSON Schema `string` |
| `$schema->integer()` | `integer` |
| `$schema->number()` | `number` (float) |
| `$schema->boolean()` | `boolean` |
| `$schema->array(items: ...)` | `array` with item schema |
| `$schema->object([...])` | nested `object` |
| `->required()` | Add to `required` |
| `->description('...')` | Field description |
| `->enum([...])` | Restrict to values |

## Notes

- Providers that don't support native structured output (e.g., older models) fall back to JSON mode + post-validation
- The response is already decoded into `$response->data` - no `json_decode` needed
- For very large schemas, prefer Anthropic / OpenAI 4o models which respect schemas more reliably
