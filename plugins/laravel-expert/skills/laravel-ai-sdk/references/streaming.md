---
name: ai-sdk-streaming
description: Server-Sent Events streaming with Laravel AI SDK
---

# Streaming

## Basic SSE

```php
use App\Ai\Agents\SalesCoach;
use Illuminate\Support\Facades\Route;

Route::get('/coach', function () {
    return (new SalesCoach)->stream('Analyze this sales transcript...');
});
```

The returned response is a `StreamedResponse` with `Content-Type: text/event-stream`.

## Vercel AI SDK protocol

For Next.js (`useChat`, `useCompletion`) / SvelteKit frontends:

```php
Route::get('/coach', function () {
    return (new SalesCoach)
        ->stream('Analyze this sales transcript...')
        ->usingVercelDataProtocol();
});
```

Emits Vercel-compatible chunks (`0:"text"`, `e:{...}`, etc.).

## Iterating manually (server-side)

```php
$stream = (new SalesCoach)->stream('Hello');

foreach ($stream as $chunk) {
    // $chunk->text contains incremental tokens
    logger($chunk->text);
}
```

## With tools

When the agent invokes a tool mid-stream:

- Stream pauses
- Tool runs synchronously
- Stream resumes with tool result fed back to the model

Set generous `#[Timeout]` for slow tools.

## Backpressure & cancellation

```php
return response()->stream(function () use ($agent) {
    foreach ($agent->stream('...') as $chunk) {
        if (connection_aborted()) {
            return;
        }
        echo "data: {$chunk->text}\n\n";
        ob_flush();
        flush();
    }
}, 200, ['Content-Type' => 'text/event-stream']);
```

## Notes

- Disable nginx/proxy buffering: `proxy_buffering off`, `X-Accel-Buffering: no`
- Cloudflare buffers SSE under 100 chars - flush more aggressively or pad chunks
- For WebSocket-based UIs, prefer Laravel Reverb (see `laravel-reverb` skill)
