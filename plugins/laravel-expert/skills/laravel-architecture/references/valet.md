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

Valet is a blazing-fast macOS development environment for minimalists. It configures your Mac to always run Nginx in the background and uses DnsMasq to proxy `*.test` domains to local sites. Valet uses roughly 7MB of RAM, making it extremely lightweight compared to virtual machines.

**Note**: For an even easier experience, consider [Laravel Herd](https://herd.laravel.com), which bundles Valet, PHP, and Composer in a native app.

## Installation

```shell
# Install Homebrew PHP
brew update && brew install php

# Install Valet globally
composer global require laravel/valet

# Install and configure Valet
valet install
```

Verify by pinging any `*.test` domain - it should resolve to `127.0.0.1`.

## Serving Sites

### Park Command (Multiple Sites)

Parks a directory so all subdirectories become accessible:

```shell
cd ~/Sites
valet park
```

Now `~/Sites/laravel` is accessible at `http://laravel.test`.

### Link Command (Single Site)

Links a specific directory:

```shell
cd ~/Sites/my-project
valet link
# Accessible at http://my-project.test

# With custom name
valet link my-app
# Accessible at http://my-app.test
```

## PHP Versions

### Global Version

```shell
valet use php@8.2
valet use php  # Latest version
```

### Per-Site Version

```shell
cd ~/Sites/legacy-app
valet isolate php@8.1
```

Or create `.valetrc` in project root:

```shell
php=php@8.1
```

Check isolated sites:

```shell
valet isolated
valet unisolate  # Revert to global
```

## HTTPS Support

```shell
valet secure laravel    # Enable HTTPS
valet unsecure laravel  # Disable HTTPS
```

## Sharing Sites

Configure sharing tool first:

```shell
valet share-tool ngrok  # or expose, cloudflared
```

Then share:

```shell
cd ~/Sites/my-project
valet share
```

For ngrok, set your auth token:

```shell
valet set-ngrok-token YOUR_TOKEN
```

## Proxying Services

Proxy Valet domains to other local services:

```shell
# Proxy to Docker container
valet proxy elasticsearch http://127.0.0.1:9200

# With HTTPS
valet proxy elasticsearch http://127.0.0.1:9200 --secure

# Remove proxy
valet unproxy elasticsearch
```

## Custom Drivers

Create custom drivers for non-Laravel frameworks. Place in `~/.config/valet/Drivers/` with naming convention `FrameworkValetDriver.php`.

A driver implements three methods:
- `serves()` - Returns true if this driver handles the site
- `isStaticFile()` - Returns path if request is for static file
- `frontControllerPath()` - Returns path to front controller

For project-specific drivers, create `LocalValetDriver.php` in project root.

## Environment Variables

Create `.valet-env.php` in project root:

```php
return [
    'my-site' => [
        'APP_ENV' => 'local',
        'DB_HOST' => 'localhost',
    ],
    '*' => [
        'DEFAULT_KEY' => 'value',
    ],
];
```

## Common Commands

| Command | Description |
|---------|-------------|
| `valet park` | Serve all directories |
| `valet link` | Serve current directory |
| `valet links` | List all links |
| `valet unlink` | Remove link |
| `valet secure` | Enable HTTPS |
| `valet unsecure` | Disable HTTPS |
| `valet isolate` | Set per-site PHP |
| `valet restart` | Restart services |
| `valet stop` | Stop services |
| `valet diagnose` | Debug issues |
| `valet trust` | Allow passwordless commands |

## Configuration Files

| Location | Purpose |
|----------|---------|
| `~/.config/valet/` | Main config directory |
| `~/.config/valet/config.json` | Master configuration |
| `~/.config/valet/Drivers/` | Custom drivers |
| `~/.config/valet/Nginx/` | Site configurations |
| `~/.config/valet/Sites/` | Symlinks for linked sites |

## Best Practices

1. **Use Herd** - Provides GUI and easier management
2. **Park, don't link** - Simpler for multiple projects
3. **Isolate PHP per-site** - For legacy project compatibility
4. **Use databases separately** - Install via DBngin or Homebrew
5. **Check Full Disk Access** - Required for protected directories

## Related References

- [sail.md](sail.md) - Docker alternative
- [homestead.md](homestead.md) - Vagrant alternative
