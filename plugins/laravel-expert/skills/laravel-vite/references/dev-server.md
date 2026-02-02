---
name: dev-server
description: Development server, HMR, Docker, HTTPS configuration
when-to-use: Configuring local development environment
keywords: hmr, server, docker, sail, https, hot reload
---

# Dev Server

## Decision Tree

```
Running in Docker/Sail?
├── YES → Set server.host: '0.0.0.0'
└── NO → Using Valet with TLS?
    ├── YES → Set valetTls option
    └── NO → Default config works
```

## Server Options

| Option | Purpose | Default |
|--------|---------|---------|
| `host` | Bind address | `localhost` |
| `port` | Server port | `5173` |
| `https` | Enable HTTPS | `false` |
| `open` | Auto-open browser | `false` |
| `cors` | CORS config | `true` |

## HMR Options

| Option | Purpose |
|--------|---------|
| `hmr.host` | WebSocket host |
| `hmr.port` | WebSocket port |
| `hmr.protocol` | ws or wss |
| `hmr.clientPort` | Client port (proxy) |

## Docker/Sail Config

| Setting | Value | Reason |
|---------|-------|--------|
| `server.host` | `'0.0.0.0'` | Expose to host |
| `watch.usePolling` | `true` | Shared filesystem |
| `.env VITE_HOST` | `0.0.0.0` | HMR access |

## Valet TLS

| Setup | Config |
|-------|--------|
| Domain | `valetTls: 'myapp.test'` |
| Result | HTTPS + valid cert |

## Custom Hot File

| Option | Purpose |
|--------|---------|
| `hotFile` | Change hot file location |
| Default | `public/hot` |

## Refresh Paths

| Path | Purpose |
|------|---------|
| `resources/views/**` | Blade templates |
| `app/Livewire/**` | Livewire components |
| `app/View/Components/**` | View components |
| `routes/**` | Route changes |

## Troubleshooting

| Issue | Solution |
|-------|----------|
| HMR not working | Check host/port config |
| Docker no refresh | Enable usePolling |
| CORS errors | Configure server.cors |
| SSL errors | Use valetTls |

→ **Code examples**: See [ViteConfigAdvanced.js.md](templates/ViteConfigAdvanced.js.md)
