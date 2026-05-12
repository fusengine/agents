---
name: streaming-controller-template
description: Controller streaming AI responses via SSE
---

# Template: Streaming Controller

```php
<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Ai\Agents\SalesCoach;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

final class CoachController extends Controller
{
    public function __invoke(Request $request): StreamedResponse
    {
        $validated = $request->validate([
            'transcript' => 'required|string|max:32000',
        ]);

        return (new SalesCoach)
            ->stream($validated['transcript'])
            ->usingVercelDataProtocol();
    }
}
```

## Route

```php
use App\Http\Controllers\CoachController;

Route::post('/api/coach', CoachController::class)
    ->middleware(['auth:sanctum', 'throttle:ai']);
```

## Frontend (Next.js / `useChat`)

```ts
import { useChat } from 'ai/react';

const { messages, input, handleInputChange, handleSubmit } = useChat({
  api: '/api/coach',
});
```

## Notes

- Add a `throttle:ai` named rate limiter in `App\Providers\RouteServiceProvider`
- Disable proxy buffering at the nginx / Cloudflare layer
- For non-SSE clients, drop `usingVercelDataProtocol()` and consume raw chunks
