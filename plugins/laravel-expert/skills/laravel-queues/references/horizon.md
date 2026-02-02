---
name: horizon
description: Laravel Horizon for Redis queue monitoring
file-type: markdown
---

# Laravel Horizon

## Overview

| Feature | Purpose |
|---------|---------|
| **Dashboard** | Web monitoring UI |
| **Metrics** | Throughput, wait times |
| **Supervisors** | Process management |
| **Tags** | Job filtering |
| **Notifications** | Long wait alerts |

---

## Installation

```bash
composer require laravel/horizon
php artisan horizon:install
php artisan migrate
```

---

## Configuration

```php
// config/horizon.php
'environments' => [
    'production' => [
        'supervisor-1' => ['maxProcesses' => 10],
    ],
    'local' => [
        'supervisor-1' => ['maxProcesses' => 3],
    ],
],
```

---

## Commands

| Command | Purpose |
|---------|---------|
| `horizon` | Start |
| `horizon:pause` | Pause |
| `horizon:continue` | Resume |
| `horizon:terminate` | Stop gracefully |
| `horizon:status` | Check status |

---

## Supervisor Setup

```ini
[program:horizon]
command=php /var/www/app/artisan horizon
autostart=true
autorestart=true
user=www-data
stdout_logfile=/var/www/app/storage/logs/horizon.log
```

---

## Dashboard Auth

```php
// HorizonServiceProvider
protected function gate(): void
{
    Gate::define('viewHorizon', fn($user) =>
        in_array($user->email, ['admin@example.com'])
    );
}
```

---

## Job Tagging

```php
public function tags(): array
{
    return ['order:' . $this->order->id];
}
```

---

## Notifications

```php
// config/horizon.php
'waits' => ['redis:default' => 60], // Alert if > 60s

// HorizonServiceProvider
Horizon::routeSlackNotificationsTo('webhook-url', '#alerts');
```

---

## Decision Tree

```
Horizon config?
├── Environment → environments array
├── Load balance → balance: 'auto'
├── Alerts → waits + notifications
├── Access → gate() method
└── Debug → tags() in jobs
```

---

## Best Practices

### DO
- Use Supervisor in production
- Set up wait notifications
- Tag jobs for filtering

### DON'T
- Use with non-Redis drivers
- Expose dashboard publicly
