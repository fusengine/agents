---
name: tech-stack-detection
description: Per-language tech stack detection files and commands (JS/TS, Python, Go, PHP, Rust)
---

# Tech Stack Detection

## JavaScript/TypeScript

| File | Technology |
|------|------------|
| `package.json` | Dependencies, scripts |
| `tsconfig.json` | TypeScript config |
| `next.config.*` | Next.js |
| `vite.config.*` | Vite |
| `webpack.config.*` | Webpack |
| `tailwind.config.*` | Tailwind CSS |
| `.eslintrc.*` | ESLint |
| `prisma/schema.prisma` | Prisma ORM |

**Detection commands**:
```bash
# Framework detection
grep -l "next\|react\|vue\|angular\|svelte" package.json 2>/dev/null

# Database/ORM
ls prisma/ drizzle/ migrations/ 2>/dev/null

# State management
grep -E "zustand|redux|@reduxjs|jotai|recoil" package.json 2>/dev/null
```

## Python

| File | Technology |
|------|------------|
| `pyproject.toml` | Modern Python project |
| `requirements.txt` | Dependencies |
| `setup.py` | Package setup |
| `manage.py` | Django |
| `alembic.ini` | Database migrations |

**Detection commands**:
```bash
# Framework detection
grep -E "django|flask|fastapi|starlette" pyproject.toml requirements.txt 2>/dev/null

# ORM
grep -E "sqlalchemy|django|tortoise|peewee" pyproject.toml requirements.txt 2>/dev/null
```

## Go

| File | Technology |
|------|------------|
| `go.mod` | Module definition |
| `go.sum` | Dependencies lock |
| `cmd/` | Entry points |
| `internal/` | Private packages |
| `pkg/` | Public packages |

**Detection commands**:
```bash
# Framework detection
grep -E "gin|echo|fiber|chi|gorilla" go.mod 2>/dev/null

# Database
grep -E "gorm|sqlx|ent|pgx" go.mod 2>/dev/null
```

## PHP

| File | Technology |
|------|------------|
| `composer.json` | Dependencies |
| `artisan` | Laravel |
| `bin/console` | Symfony |

## Rust

| File | Technology |
|------|------------|
| `Cargo.toml` | Dependencies |
| `src/lib.rs` | Library crate |
| `src/main.rs` | Binary crate |
