---
name: laravel-ai-sdk
description: Use when integrating AI agents, tool calling, embeddings, structured output, or streaming in Laravel 13 via the `laravel/ai` package. Covers 14+ providers (OpenAI, Anthropic, Gemini, Azure, Groq, DeepSeek, Ollama, Mistral, xAI, Cohere, ElevenLabs, Jina, VoyageAI, OpenRouter).
versions:
  laravel: "13.0"
  php: "8.3"
  laravel/ai: "^1.0"
user-invocable: true
references: references/installation.md, references/agents.md, references/tools.md, references/embeddings.md, references/streaming.md, references/structured-output.md, references/templates/Agent.php.md, references/templates/Tool.php.md, references/templates/EmbeddingService.php.md, references/templates/StreamingController.php.md
related-skills: laravel-attributes, laravel-vector-search
---

# Laravel AI SDK

## Agent Workflow (MANDATORY)

Before ANY implementation, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** - Map existing AI usage (custom HTTP clients, OpenAI PHP, etc.) to migrate
2. **fuse-ai-pilot:research-expert** - Verify provider model IDs and pricing on the official Laravel AI SDK docs
3. **mcp__context7__query-docs** - Pull latest `laravel.com/docs/13.x/ai-sdk` examples

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

| Feature | Description |
|---------|-------------|
| **Unified API** | Same code surface for 14+ providers via `Lab` enum |
| **Agents** | Class-based with `Agent` contract + `Promptable` trait |
| **Tool calling** | First-party `FileSearch` + custom tools per agent |
| **Embeddings** | `Embeddings::for([...])->generate()` + `Str::toEmbeddings()` |
| **Streaming** | Native SSE + Vercel AI SDK protocol compatibility |
| **Structured output** | `agent(schema: fn ($s) => ...)` with `JsonSchema` |

---

## Critical Rules

1. **Use the `Lab` enum** - Never hard-code provider strings; use `Lab::Anthropic`, `Lab::OpenAI`, etc.
2. **Configure keys in `.env`** - One env var per provider (`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, ...) read by `config/ai.php`
3. **Agents are classes** - Always implement `Laravel\Ai\Contracts\Agent` and use `Promptable` trait
4. **Declare tools explicitly** - Override `tools(): iterable` to expose tool calls; never assume implicit registration
5. **Stream via routes** - Return `$agent->stream(...)` directly from a route; do not buffer in memory

---

## Architecture

```
app/
├── Ai/
│   ├── Agents/
│   │   └── SalesCoach.php       # implements Agent, uses Promptable
│   ├── Tools/
│   │   └── SearchProducts.php   # custom tool class
│   └── Services/
│       └── EmbeddingService.php # Embeddings::for() wrapper
config/
└── ai.php                       # providers, default models
.env                             # *_API_KEY entries
```

→ See [Agent.php.md](references/templates/Agent.php.md) for a full agent

---

## Reference Guide

| Topic | Reference | When to Consult |
|-------|-----------|-----------------|
| **Installation** | [installation.md](references/installation.md) | Setting up `laravel/ai` and providers |
| **Agents** | [agents.md](references/agents.md) | Building agent classes with attributes |
| **Tools** | [tools.md](references/tools.md) | Tool calling, `FileSearch`, custom tools |
| **Embeddings** | [embeddings.md](references/embeddings.md) | Generating vectors for semantic search |
| **Streaming** | [streaming.md](references/streaming.md) | SSE + Vercel AI SDK protocol |
| **Structured output** | [structured-output.md](references/structured-output.md) | `agent()` helper + JSON Schema |

### Templates

| Template | When to Use |
|----------|-------------|
| [Agent.php.md](references/templates/Agent.php.md) | Net new agent class |
| [Tool.php.md](references/templates/Tool.php.md) | Custom tool implementation |
| [EmbeddingService.php.md](references/templates/EmbeddingService.php.md) | Batch embedding generation |
| [StreamingController.php.md](references/templates/StreamingController.php.md) | SSE streaming endpoint |

---

## Quick Reference

### Generate text

```php
use App\Ai\Agents\SalesCoach;

$response = (new SalesCoach)->prompt('Summarize this call');
```

### Generate embeddings

```php
use Illuminate\Support\Str;

$embedding = Str::of('Napa Valley wine')->toEmbeddings();
```

### Stream

```php
Route::get('/coach', fn () => (new SalesCoach)->stream('Analyze this'));
```

→ See [Agent.php.md](references/templates/Agent.php.md) for complete example

---

## Best Practices

### DO
- Use class-level attributes (`#[Provider]`, `#[Model]`, `#[MaxSteps]`) to lock agent configuration
- Cache embeddings in the DB - regenerating is expensive
- Set explicit `#[Timeout]` to avoid runaway long generations
- Use `usingVercelDataProtocol()` for Next.js / SvelteKit frontends

### DON'T
- Don't declare an AI Agent without `#[Tool]` declarations if it needs to call functions - tools must be registered explicitly
- Don't store API keys in `config/ai.php` directly; use `env()` so values aren't committed
- Don't use `Lab::OpenAI` strings - use the enum for type safety
- Don't loop manually over `Embeddings::for()` items; pass the full array - the SDK batches efficiently
