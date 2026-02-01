---
name: valet
description: Laravel Valet for macOS development
when-to-use: macOS development, lightweight environment
keywords: laravel, php, valet, macos, nginx
priority: medium
related: sail.md, homestead.md, installation.md
---

# Laravel Valet

## Overview

Valet is a blazing-fast macOS development environment using Nginx and DnsMasq. Sites are served at `*.test` domains with ~7MB RAM. Consider [Laravel Herd](https://herd.laravel.com) for an easier GUI experience.

## Installation

```shell
brew update && brew install php
composer global require laravel/valet
valet install
```

## Serving Sites

### Park (Multiple Sites)

```shell
cd ~/Sites
valet park
# ~/Sites/laravel → http://laravel.test
```

### Link (Single Site)

```shell
cd ~/Sites/my-project
valet link
# → http://my-project.test
```

## PHP Versions

```shell
valet use php@8.2        # Global
valet isolate php@8.1    # Per-site
valet unisolate          # Revert
```

Or create `.valetrc` in project: `php=php@8.1`

## HTTPS

```shell
valet secure laravel     # Enable
valet unsecure laravel   # Disable
```

## Sharing Sites

```shell
valet share-tool ngrok   # Configure tool
valet share              # Share current site
```

## Proxying Services

```shell
valet proxy elasticsearch http://127.0.0.1:9200
valet unproxy elasticsearch
```

## Common Commands

| Command | Description |
|---------|-------------|
| `valet park` | Serve directory |
| `valet link` | Serve current |
| `valet links` | List links |
| `valet secure` | Enable HTTPS |
| `valet restart` | Restart services |
| `valet diagnose` | Debug issues |

## Configuration

| Location | Purpose |
|----------|---------|
| `~/.config/valet/config.json` | Main config |
| `~/.config/valet/Drivers/` | Custom drivers |

## Best Practices

1. **Use Herd** - Easier GUI management
2. **Park directories** - Simpler than linking each
3. **Isolate PHP** - For legacy projects
4. **Use DBngin** - For database management

## Related References

- [sail.md](sail.md) - Docker alternative
