---
name: workers
description: Running and configuring queue workers
file-type: markdown
---

# Queue Workers

## Commands

| Command | Purpose |
|---------|---------|
| `queue:work` | Start worker (prod) |
| `queue:listen` | Start listener (dev) |
| `queue:restart` | Restart all workers |
| `queue:monitor` | Monitor sizes |

---

## Basic Worker

```bash
php artisan queue:work
php artisan queue:work redis --queue=high,default
php artisan queue:work --once           # Single job
php artisan queue:work --stop-when-empty
```

---

## Worker Options

| Option | Default | Purpose |
|--------|---------|---------|
| `--queue=` | default | Queues to process |
| `--tries=` | 1 | Max attempts |
| `--timeout=` | 60 | Job timeout |
| `--memory=` | 128 | Memory limit MB |
| `--sleep=` | 3 | Sleep when empty |
| `--max-time=` | 0 | Stop after N seconds |

```bash
php artisan queue:work redis --tries=3 --timeout=90 --memory=256
```

---

## Supervisor Config

```ini
[program:laravel-worker]
command=php /var/www/app/artisan queue:work redis --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
user=www-data
numprocs=8
stdout_logfile=/var/www/app/storage/logs/worker.log
```

```bash
sudo supervisorctl reread && sudo supervisorctl update
sudo supervisorctl start laravel-worker:*
```

---

## Deployment

```bash
php artisan queue:restart  # After every deploy
```

---

## Monitoring

```bash
php artisan queue:monitor redis:default --max=100
```

---

## Decision Tree

```
Worker setup?
├── Development → queue:listen
├── Production → queue:work + Supervisor
├── Containerized → --max-time=3600
├── Serverless → --once
└── High volume → Horizon
```

---

## Best Practices

### DO
- Use Supervisor in production
- Set `--max-time` for graceful restarts
- Restart after deploy

### DON'T
- Use `queue:listen` in production
- Run without monitoring
