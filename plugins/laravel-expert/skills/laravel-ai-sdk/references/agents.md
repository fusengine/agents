---
name: ai-sdk-agents
description: Build AI agents with attributes, the Agent contract, and the Promptable trait
---

# Agents

## Generate an agent

```shell
php artisan make:agent SalesCoach
php artisan make:agent SalesCoach --structured   # with JSON schema
```

## Anatomy

```php
<?php

namespace App\Ai\Agents;

use Laravel\Ai\Attributes\{MaxSteps, MaxTokens, Model, Provider, Temperature, Timeout};
use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Enums\Lab;
use Laravel\Ai\Promptable;

#[Provider(Lab::Anthropic)]
#[Model('claude-haiku-4-5-20251001')]
#[MaxSteps(10)]
#[MaxTokens(4096)]
#[Temperature(0.7)]
#[Timeout(120)]
class SalesCoach implements Agent
{
    use Promptable;

    public function instructions(): string
    {
        return 'You are a sales coach analyzing call transcripts.';
    }
}
```

## Available attributes

| Attribute | Purpose |
|-----------|---------|
| `#[Provider(Lab::Anthropic)]` | Which provider to call |
| `#[Model('...')]` | Provider-specific model ID |
| `#[MaxSteps(10)]` | Max agentic reasoning steps |
| `#[MaxTokens(4096)]` | Output token cap |
| `#[Temperature(0.7)]` | Sampling temperature |
| `#[Timeout(120)]` | HTTP timeout seconds |

## Invoking

```php
$response = (new SalesCoach)->prompt('Analyze this transcript: ...');
$response->text;        // string
$response->usage;       // token usage
```

## With tools

Override `tools()` to expose callable functions to the model - see [tools.md](tools.md).

## Anonymous agents

Skip the class for one-off prompts:

```php
use function Laravel\Ai\agent;

$response = agent()->prompt('Summarize this email...');
```

Combine with structured output - see [structured-output.md](structured-output.md).
