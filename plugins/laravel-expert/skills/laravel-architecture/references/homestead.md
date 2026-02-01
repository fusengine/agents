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

**Warning**: Homestead is legacy and no longer actively maintained. Use [Laravel Sail](sail.md) instead.

Homestead is a Vagrant box with PHP, Nginx, MySQL, and other tools. Runs on VirtualBox or Parallels.

## Installation

```shell
git clone https://github.com/laravel/homestead.git ~/Homestead
cd ~/Homestead && git checkout release
bash init.sh  # Creates Homestead.yaml
```

## Configuration

```yaml
# Homestead.yaml
provider: virtualbox  # or parallels (Apple Silicon)

folders:
    - map: ~/code/project1
      to: /home/vagrant/project1

sites:
    - map: project1.test
      to: /home/vagrant/project1/public
      php: "8.2"
```

## Commands

```shell
vagrant up              # Start VM
vagrant ssh             # SSH into VM
vagrant reload --provision  # Reload config
vagrant halt            # Stop VM
vagrant destroy         # Remove VM
```

## Database

From host: `localhost:33060` (MySQL), `localhost:54320` (PostgreSQL)
Credentials: homestead / secret

## Multiple PHP Versions

```yaml
sites:
    - map: legacy.test
      to: /home/vagrant/legacy/public
      php: "7.4"
```

## Migrate to Sail

```shell
composer require laravel/sail --dev
php artisan sail:install
# Update .env: DB_HOST=mysql
sail up
```

## Best Practices

1. **Use Sail instead** - Modern, maintained
2. **Map individual projects** - Not large directories
3. **Enable backup** - `backup: true` in config

## Related References

- [sail.md](sail.md) - Recommended alternative
