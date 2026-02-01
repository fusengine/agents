---
name: installation
description: Laravel installation and initial setup
when-to-use: Creating new Laravel applications, initial setup
keywords: laravel, php, installation, setup, composer
priority: high
related: configuration.md, structure.md
---

# Installation

## Overview

Laravel provides multiple ways to create new applications, from the Laravel installer to Composer. Understanding the installation process helps set up projects correctly from the start.

## Requirements

Laravel 12 requires PHP 8.2+ with these extensions: Ctype, cURL, DOM, Fileinfo, Filter, Hash, Mbstring, OpenSSL, PCRE, PDO, Session, Tokenizer, XML. You'll also need Composer for dependency management.

## Installation Methods

### Laravel Installer (Recommended)

The Laravel installer provides an interactive setup experience with starter kit selection, testing framework choice, and database configuration.

```shell
# Install installer globally
composer global require laravel/installer

# Create new application
laravel new my-app
```

The installer prompts you for preferences and configures everything automatically, including running initial migrations with SQLite.

### Via Composer

For environments without the installer, use Composer directly:

```shell
composer create-project laravel/laravel my-app
```

### php.new (Quick Start)

Laravel provides one-liner installations that set up PHP, Composer, and the installer together for each operating system (macOS, Windows, Linux).

## Development Environments

### Laravel Herd (Recommended for macOS/Windows)

Herd is a native development environment that includes PHP, Nginx, and the Laravel installer. Sites in `~/Herd` are automatically served at `*.test` domains.

### Laravel Sail (Docker)

Sail provides a Docker-based environment for consistent development across all platforms. Ideal for teams needing identical environments.

### Valet (macOS)

Lightweight environment using Nginx and DnsMasq. Uses ~7MB RAM and serves applications at `*.test` domains.

## Initial Configuration

### Environment Setup

After installation, Laravel creates a `.env` file from `.env.example`. Key settings include:

| Variable | Purpose |
|----------|---------|
| `APP_ENV` | Environment (local, production) |
| `APP_DEBUG` | Debug mode |
| `APP_KEY` | Encryption key (auto-generated) |
| `APP_URL` | Application URL |
| `DB_*` | Database connection |

### Database Configuration

Laravel defaults to SQLite with a pre-created `database/database.sqlite` file. For MySQL/PostgreSQL, update the `DB_*` variables and run migrations:

```shell
php artisan migrate
```

### Starting Development

```shell
cd my-app
npm install && npm run build
composer run dev
```

This starts the development server, queue worker, and Vite dev server simultaneously.

## Laravel Boost (AI Integration)

Laravel Boost bridges AI agents with Laravel applications, providing context, tools, and documentation access for AI-assisted development.

```shell
composer require laravel/boost --dev
php artisan boost:install
```

## IDE Support

- **VS Code/Cursor**: Use the official Laravel extension for syntax highlighting, snippets, and autocompletion
- **PhpStorm**: Use Laravel Idea plugin for comprehensive framework support
- **Firebase Studio**: Cloud-based development with zero setup

## Best Practices

1. **Use the installer** - Provides the most complete setup experience
2. **Configure .env first** - Set environment before running migrations
3. **Never commit .env** - Contains sensitive credentials
4. **Use starter kits** - For projects needing authentication scaffolding
5. **Match environments** - Use Sail or Herd for team consistency

## Related References

- [configuration.md](configuration.md) - Environment configuration
- [structure.md](structure.md) - Directory organization
