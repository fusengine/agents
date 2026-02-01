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

Laravel MCP provides integration with the Model Context Protocol, allowing AI clients (like Claude, ChatGPT) to interact with your Laravel application. It exposes servers, tools, resources, and prompts for AI-powered features.

## Why Use MCP

| Benefit | Description |
|---------|-------------|
| **AI Integration** | Let AI clients interact with your app |
| **Tool Exposure** | Define callable functions for AI |
| **Resource Sharing** | Share data and files with AI |
| **Prompts** | Pre-defined prompt templates |

## Core Components

| Component | Purpose | Example |
|-----------|---------|---------|
| **Server** | Central communication point | `WeatherServer` |
| **Tool** | Callable function | `GetWeather`, `CreateUser` |
| **Resource** | Data/file access | Database records, files |
| **Prompt** | Reusable prompt template | `SummarizeArticle` |

## Installation

```shell
composer require laravel/mcp
php artisan vendor:publish --tag=ai-routes
```

Creates `routes/ai.php` for server registration.

## Creating Servers

```shell
php artisan make:mcp-server WeatherServer
```

Servers are registered in `routes/ai.php` and define which tools, resources, and prompts are available.

### Server Types

| Type | Use Case | Transport |
|------|----------|-----------|
| **Web Server** | Remote AI clients | HTTP/SSE |
| **Local Server** | CLI tools, local AI | Stdio |

## Tools

Tools are callable functions that AI can execute.

```shell
php artisan make:mcp-tool GetWeather
```

### Tool Features

| Feature | Description |
|---------|-------------|
| **Input Schema** | Define parameters with types |
| **Validation** | Laravel validation rules |
| **DI** | Constructor dependency injection |
| **Annotations** | Metadata for AI (read-only, destructive) |
| **Conditional** | Register based on conditions |

### Tool Annotations

| Annotation | Meaning |
|------------|---------|
| `readOnlyHint` | Tool only reads data |
| `destructiveHint` | Tool modifies/deletes data |
| `idempotentHint` | Safe to retry |
| `openWorldHint` | Interacts with external services |

## Prompts

Reusable prompt templates for AI interactions.

```shell
php artisan make:mcp-prompt SummarizeArticle
```

Prompts accept arguments and return formatted messages for AI consumption.

## Resources

Resources expose data to AI clients.

```shell
php artisan make:mcp-resource UserProfile
```

### Resource Properties

| Property | Purpose |
|----------|---------|
| **URI** | Unique identifier |
| **MIME Type** | Content type |
| **Name** | Human-readable name |
| **Description** | What the resource contains |

## Authentication

### OAuth 2.1

For web servers, use OAuth 2.1 for secure authentication with AI clients.

### Sanctum

For simpler setups, Sanctum tokens work with MCP servers.

## Authorization

Use Laravel's Gate and policies to authorize tool/resource access based on the authenticated user or AI client.

## Testing

### MCP Inspector

Use the official MCP Inspector to test servers interactively:

```shell
npx @anthropic/mcp-inspector
```

### Unit Tests

Test tools, prompts, and resources with Laravel's testing tools.

## Best Practices

1. **Annotate tools** - Use hints to help AI understand tool behavior
2. **Validate input** - Always validate tool arguments
3. **Authorize access** - Use policies for sensitive operations
4. **Type resources** - Set correct MIME types
5. **Document prompts** - Clear descriptions help AI use them correctly

## Related References

- [artisan.md](artisan.md) - Creating MCP commands
- [container.md](container.md) - Dependency injection in tools
- [Laravel MCP Docs](https://laravel.com/docs/12.x/mcp) - Full documentation
