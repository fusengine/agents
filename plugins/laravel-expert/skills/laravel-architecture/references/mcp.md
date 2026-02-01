---
name: mcp
description: Laravel MCP (Model Context Protocol) for AI integration
when-to-use: Building AI-powered features, exposing Laravel to AI clients
keywords: laravel, php, mcp, ai, model context protocol
priority: medium
related: artisan.md, container.md
---

# Laravel MCP

## Overview

Laravel MCP integrates with the Model Context Protocol, allowing AI clients (Claude, ChatGPT) to interact with your application via servers, tools, resources, and prompts.

## Core Components

| Component | Purpose | Example |
|-----------|---------|---------|
| **Server** | Communication point | `WeatherServer` |
| **Tool** | Callable function | `GetWeather` |
| **Resource** | Data access | Database records |
| **Prompt** | Template | `SummarizeArticle` |

## Installation

```shell
composer require laravel/mcp
php artisan vendor:publish --tag=ai-routes
```

## Creating Components

```shell
php artisan make:mcp-server WeatherServer
php artisan make:mcp-tool GetWeather
php artisan make:mcp-prompt SummarizeArticle
php artisan make:mcp-resource UserProfile
```

## Server Types

| Type | Use Case | Transport |
|------|----------|-----------|
| **Web** | Remote AI | HTTP/SSE |
| **Local** | CLI tools | Stdio |

## Tool Annotations

| Annotation | Meaning |
|------------|---------|
| `readOnlyHint` | Only reads data |
| `destructiveHint` | Modifies/deletes |
| `idempotentHint` | Safe to retry |
| `openWorldHint` | External services |

## Resources

| Property | Purpose |
|----------|---------|
| **URI** | Unique identifier |
| **MIME Type** | Content type |
| **Name** | Human-readable |
| **Description** | What it contains |

## Authentication

- **OAuth 2.1** for web servers
- **Sanctum** for simpler setups

Use Laravel Gate/policies for tool/resource authorization.

## Testing

```shell
npx @anthropic/mcp-inspector
```

## Best Practices

1. **Annotate tools** - Help AI understand behavior
2. **Validate input** - Always validate arguments
3. **Authorize access** - Use policies
4. **Type resources** - Correct MIME types

## Related References

- [artisan.md](artisan.md) - Creating MCP commands
