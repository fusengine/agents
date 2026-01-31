---
name: streaming
description: Server-Sent Events, streaming responses, and real-time updates
when-to-use: real-time updates, AI chat, progressive loading
keywords: SSE, EventSource, streaming, ReadableStream
priority: medium
requires: api-routes.md, data-fetching.md
related: loading-patterns.md
---

# Streaming & SSE

## When to Use

- Server-Sent Events
- AI chat responses
- Real-time updates
- Progressive loading

## Why Streaming

| Feature | Use Case |
|---------|----------|
| SSE | Live updates |
| ReadableStream | Chunked data |
| AI SDK | Chat responses |
| Text | Typewriter effect |

## Server-Sent Events (SSE)
```typescript
// app/api/stream/route.ts
export const dynamic = 'force-dynamic'

export async function GET() {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(encoder.encode('data: {"type":"connected"}\n\n'))

      for (let i = 0; i < 10; i++) {
        await new Promise(r => setTimeout(r, 1000))
        const data = { type: 'update', count: i }
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      }
      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
```

## Client EventSource
```typescript
// modules/ui/components/StreamClient.tsx
'use client'
import { useEffect, useState } from 'react'

export default function StreamClient() {
  const [messages, setMessages] = useState<any[]>([])

  useEffect(() => {
    const es = new EventSource('/api/stream')
    es.onmessage = (e) => setMessages(prev => [...prev, JSON.parse(e.data)])
    es.onerror = () => es.close()
    return () => es.close()
  }, [])

  return <div>{messages.map((m, i) => <p key={i}>{JSON.stringify(m)}</p>)}</div>
}
```

## Streaming with AI
```typescript
// app/api/chat/route.ts
import { streamText } from 'ai'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: openai('gpt-4'),
    messages,
  })

  return result.toDataStreamResponse()
}
```

## Text Streaming Response
```typescript
export async function GET() {
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const text = 'Streaming text character by character...'
      for (const char of text) {
        controller.enqueue(encoder.encode(char))
        await new Promise(r => setTimeout(r, 50))
      }
      controller.close()
    },
  })
  return new Response(stream, { headers: { 'Content-Type': 'text/plain' } })
}
```
