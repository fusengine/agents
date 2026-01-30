# DevTools MCP (AI Debugging)

## Configuration
```json
// .mcp.json (project root)
{
  "mcpServers": {
    "next-devtools": {
      "command": "npx",
      "args": ["-y", "next-devtools-mcp@latest"]
    }
  }
}
```

## Features
- **Runtime errors**: Access errors in real-time
- **Build errors**: AI-assisted error resolution
- **Knowledge base**: Next.js docs integrated
- **Automated codemods**: AI-driven migrations
- **Playwright integration**: Visual testing

## MCP Endpoint
```
http://localhost:3000/_next/mcp
```

## AI Debugging Workflow
1. Error occurs in dev server
2. MCP captures error context
3. AI assistant receives full stack trace
4. Suggested fix with code changes

## Available Commands
```typescript
// In AI assistant context
mcp.getErrors()           // Get current errors
mcp.getBuildStatus()      // Check build status
mcp.runCodemod(name)      // Run specific codemod
mcp.searchDocs(query)     // Search Next.js docs
```

## Automated Upgrades
```bash
# AI-assisted upgrade
bunx @next/codemod@canary upgrade latest
```

MCP provides context for:
- Breaking changes detection
- Deprecated API warnings
- Migration suggestions

## Browser DevTools
```typescript
// Enable in next.config.ts
const nextConfig = {
  experimental: {
    devIndicators: {
      buildActivity: true,
      buildActivityPosition: 'bottom-right',
    },
  },
}
```

## Logs Access
- Server logs: Terminal
- Client logs: Browser console
- Unified logs: MCP endpoint
