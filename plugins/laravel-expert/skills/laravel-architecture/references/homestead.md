---
name: homestead
description: Laravel Homestead Vagrant environment (legacy)
when-to-use: Legacy Vagrant-based development
keywords: laravel, php, homestead, vagrant, virtualbox
priority: low
related: sail.md, valet.md, installation.md
---

# Laravel Homestead (Legacy)

## Overview

**Warning**: Homestead is a legacy package no longer actively maintained. [Laravel Sail](sail.md) is the recommended modern alternative for Docker-based development.

Homestead is a pre-packaged Vagrant box providing a complete development environment without installing PHP, web server, or databases locally. It runs on VirtualBox or Parallels and includes everything needed for Laravel development.

## When to Use Homestead

Consider Homestead only if you:
- Have existing Homestead-based workflows
- Need VirtualBox/Parallels instead of Docker
- Require legacy PHP versions (5.6, 7.x)
- Cannot use Docker due to system constraints

For new projects, use **Sail** (Docker) or **Valet/Herd** (macOS native) instead.

## Included Software

Homestead includes Ubuntu 22.04 with:
- PHP 5.6, 7.0-7.4, 8.0-8.3
- Nginx, MySQL 8.0, PostgreSQL 15
- Redis, Memcached, Beanstalkd
- Composer, Node, Docker
- Xdebug, Mailpit, ngrok

Optional software includes MariaDB, MongoDB, Elasticsearch, Meilisearch, RabbitMQ, and more.

## Installation

```shell
# Install Vagrant and VirtualBox first

# Clone Homestead
git clone https://github.com/laravel/homestead.git ~/Homestead
cd ~/Homestead
git checkout release

# Initialize
bash init.sh  # Creates Homestead.yaml
```

## Configuration (Homestead.yaml)

### Provider

```yaml
provider: virtualbox  # or parallels (required for Apple Silicon)
```

### Shared Folders

```yaml
folders:
    - map: ~/code/project1
      to: /home/vagrant/project1
```

### Sites

```yaml
sites:
    - map: project1.test
      to: /home/vagrant/project1/public
      php: "8.2"  # Optional PHP version
```

### Services

```yaml
services:
    - enabled:
        - "postgresql"
    - disabled:
        - "mysql"
```

## Basic Commands

```shell
# Start VM
vagrant up

# SSH into VM
vagrant ssh

# Reload after config changes
vagrant reload --provision

# Stop VM
vagrant halt

# Destroy VM
vagrant destroy
```

## Per-Site PHP Versions

```yaml
sites:
    - map: legacy.test
      to: /home/vagrant/legacy/public
      php: "7.4"
```

Inside VM, use version-specific commands:

```shell
php8.2 artisan migrate
php7.4 artisan migrate
```

## Database Connections

From host machine:
- MySQL: `localhost:33060` (user: homestead, pass: secret)
- PostgreSQL: `localhost:54320` (user: homestead, pass: secret)

From inside VM, use standard ports (3306, 5432).

## Debugging

Xdebug is pre-installed and running. Configure your IDE to listen on port 9003. For CLI debugging:

```shell
xphp /path/to/script
```

## Updating Homestead

```shell
cd ~/Homestead
vagrant destroy
git fetch && git pull origin release
vagrant box update
bash init.sh
vagrant up
```

## Migration to Sail

To migrate from Homestead to Sail:

1. Install Sail in your project: `composer require laravel/sail --dev`
2. Run installer: `php artisan sail:install`
3. Update `.env` database host to `mysql`
4. Start Sail: `./vendor/bin/sail up`
5. Run migrations: `./vendor/bin/sail artisan migrate`

Sail provides similar functionality with better performance and simpler configuration.

## Best Practices

1. **Consider Sail first** - Modern, maintained, better performance
2. **Map individual projects** - Not one large directory
3. **Use per-project PHP** - For legacy compatibility
4. **Back up before destroy** - Enable `backup: true` in config

## Related References

- [sail.md](sail.md) - Recommended Docker alternative
- [valet.md](valet.md) - macOS native alternative
