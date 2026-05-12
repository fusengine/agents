---
name: agent-template
description: Complete AI agent with tools and attributes
---

# Template: Agent

```php
<?php

declare(strict_types=1);

namespace App\Ai\Agents;

use App\Ai\Tools\SearchProducts;
use Laravel\Ai\Attributes\{MaxSteps, MaxTokens, Model, Provider, Temperature, Timeout};
use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Enums\Lab;
use Laravel\Ai\Promptable;
use Laravel\Ai\Providers\Tools\FileSearch;

#[Provider(Lab::Anthropic)]
#[Model('claude-haiku-4-5-20251001')]
#[MaxSteps(10)]
#[MaxTokens(4096)]
#[Temperature(0.7)]
#[Timeout(120)]
final class SalesCoach implements Agent
{
    use Promptable;

    public function instructions(): string
    {
        return <<<'PROMPT'
You are a sales coach. Analyze sales transcripts for tone, objection handling,
and next-step recommendations. Cite the product catalog when relevant.
PROMPT;
    }

    /**
     * @return iterable<object>
     */
    public function tools(): iterable
    {
        return [
            new SearchProducts(),
            new FileSearch(stores: [config('ai.stores.sales_playbook')]),
        ];
    }
}
```

## Usage

```php
$response = (new SalesCoach)->prompt('Analyze this transcript: ...');
echo $response->text;

// Streaming
return (new SalesCoach)->stream('Analyze this transcript: ...')
    ->usingVercelDataProtocol();
```
