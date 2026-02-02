---
name: McpServer.php
description: Laravel MCP Server, Tools, Resources, Prompts from official Laravel 12 docs
keywords: mcp, model context protocol, ai, tools, resources
source: https://laravel.com/docs/12.x/mcp
---

# Laravel MCP Templates

## Installation

```shell
composer require laravel/mcp
php artisan vendor:publish --tag=ai-routes
```

## Create Components

```shell
php artisan make:mcp-server WeatherServer
php artisan make:mcp-tool CurrentWeatherTool
php artisan make:mcp-resource WeatherGuidelinesResource
php artisan make:mcp-prompt DescribeWeatherPrompt
```

## MCP Server Class

```php
<?php

namespace App\Mcp\Servers;

use Laravel\Mcp\Server;

class WeatherServer extends Server
{
    /**
     * The MCP server's name.
     */
    protected string $name = 'Weather Server';

    /**
     * The MCP server's version.
     */
    protected string $version = '1.0.0';

    /**
     * The MCP server's instructions for the LLM.
     */
    protected string $instructions = 'This server provides weather information and forecasts.';

    /**
     * The tools registered with this MCP server.
     *
     * @var array<int, class-string<\Laravel\Mcp\Server\Tool>>
     */
    protected array $tools = [
        CurrentWeatherTool::class,
    ];

    /**
     * The resources registered with this MCP server.
     *
     * @var array<int, class-string<\Laravel\Mcp\Server\Resource>>
     */
    protected array $resources = [
        WeatherGuidelinesResource::class,
    ];

    /**
     * The prompts registered with this MCP server.
     *
     * @var array<int, class-string<\Laravel\Mcp\Server\Prompt>>
     */
    protected array $prompts = [
        DescribeWeatherPrompt::class,
    ];
}
```

## Register Server (routes/ai.php)

```php
use App\Mcp\Servers\WeatherServer;
use Laravel\Mcp\Facades\Mcp;

// Web server (HTTP/SSE)
Mcp::web('/mcp/weather', WeatherServer::class);

// With Sanctum authentication
Mcp::web('/mcp/weather', WeatherServer::class)
    ->middleware('auth:sanctum');

// Local server (Stdio)
Mcp::local('weather', WeatherServer::class);
```

## MCP Tool Class

```php
<?php

namespace App\Mcp\Tools;

use Laravel\Mcp\Server\Tool;
use Laravel\Mcp\Types\ToolAnnotations;

class CurrentWeatherTool extends Tool
{
    /**
     * The tool's name.
     */
    protected string $name = 'get_current_weather';

    /**
     * The tool's description.
     */
    protected string $description = 'Get current weather for a location';

    /**
     * The tool's input schema.
     */
    protected function inputSchema(): array
    {
        return [
            'type' => 'object',
            'properties' => [
                'location' => [
                    'type' => 'string',
                    'description' => 'City name or coordinates',
                ],
            ],
            'required' => ['location'],
        ];
    }

    /**
     * The tool's annotations.
     */
    protected function annotations(): ToolAnnotations
    {
        return new ToolAnnotations(
            readOnlyHint: true,
            openWorldHint: true,
        );
    }

    /**
     * Execute the tool.
     */
    public function __invoke(string $location): string
    {
        // Fetch weather data...
        return "Current weather in {$location}: 72°F, Sunny";
    }
}
```

## MCP Resource Class

```php
<?php

namespace App\Mcp\Resources;

use Laravel\Mcp\Server\Resource;

class WeatherGuidelinesResource extends Resource
{
    /**
     * The resource's URI.
     */
    protected string $uri = 'weather://guidelines';

    /**
     * The resource's name.
     */
    protected string $name = 'Weather Guidelines';

    /**
     * The resource's description.
     */
    protected string $description = 'Guidelines for interpreting weather data';

    /**
     * The resource's MIME type.
     */
    protected string $mimeType = 'text/plain';

    /**
     * Get the resource contents.
     */
    public function __invoke(): string
    {
        return 'Weather interpretation guidelines...';
    }
}
```

## MCP Prompt Class

```php
<?php

namespace App\Mcp\Prompts;

use Laravel\Mcp\Server\Prompt;
use Laravel\Mcp\Types\PromptMessage;

class DescribeWeatherPrompt extends Prompt
{
    /**
     * The prompt's name.
     */
    protected string $name = 'describe_weather';

    /**
     * The prompt's description.
     */
    protected string $description = 'Generate a weather description';

    /**
     * The prompt's arguments.
     */
    protected function arguments(): array
    {
        return [
            'location' => [
                'description' => 'The location to describe weather for',
                'required' => true,
            ],
        ];
    }

    /**
     * Get the prompt messages.
     */
    public function __invoke(string $location): array
    {
        return [
            new PromptMessage(
                role: 'user',
                content: "Describe the typical weather in {$location}.",
            ),
        ];
    }
}
```

## Testing with Inspector

```shell
# Web server
php artisan mcp:inspector mcp/weather

# Local server
php artisan mcp:inspector weather
```

## Tool Annotations

```php
new ToolAnnotations(
    readOnlyHint: true,      // Only reads data
    destructiveHint: false,   // Modifies/deletes data
    idempotentHint: true,     // Safe to retry
    openWorldHint: true,      // Interacts with external services
);
```
