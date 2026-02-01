---
name: filesystem
description: Laravel filesystem and cloud storage abstraction
when-to-use: File uploads, storage, cloud integration (S3, etc.)
keywords: laravel, php, filesystem, storage, s3, files
priority: medium
related: configuration.md
---

# Filesystem / Storage

## Overview

Laravel's filesystem provides a unified API for local and cloud storage (S3, GCS). The `Storage` facade works identically regardless of where files are stored.

## Disks

Configured in `config/filesystems.php`:

| Disk | Purpose |
|------|---------|
| `local` | Private files (`storage/app`) |
| `public` | Public files (`storage/app/public`) |
| `s3` | Amazon S3 bucket |

## Basic Operations

### Writing

| Method | Purpose |
|--------|---------|
| `Storage::put('file.txt', $contents)` | Write |
| `Storage::putFile('avatars', $file)` | Store upload |
| `Storage::putFileAs('avatars', $file, 'name.jpg')` | Store with name |

### Reading

| Method | Returns |
|--------|---------|
| `Storage::get('file.txt')` | Contents |
| `Storage::exists('file.txt')` | Boolean |
| `Storage::size('file.txt')` | Bytes |

### Deleting

```php
Storage::delete('file.txt');
Storage::delete(['file1.txt', 'file2.txt']);
```

### Directories

```php
Storage::files('directory');
Storage::allFiles('directory');    // Recursive
Storage::makeDirectory('path');
Storage::deleteDirectory('path');
```

## Disk Selection

```php
Storage::disk('s3')->put('file.txt', $contents);
Storage::disk('public')->put('avatar.jpg', $file);
```

## File Uploads

```php
$path = $request->file('avatar')->store('avatars');
$path = $request->file('avatar')->storeAs('avatars', 'avatar.jpg');
$path = $request->file('avatar')->store('avatars', 's3');
```

## Public Files

1. Store in `public` disk
2. Run `php artisan storage:link`
3. Get URL: `Storage::disk('public')->url('file.jpg')`

## Temporary URLs (S3)

```php
$url = Storage::temporaryUrl('file.pdf', now()->addMinutes(5));
```

## Streaming

```php
return Storage::download('file.pdf', 'report.pdf');
return Storage::response('video.mp4');
```

## S3 Configuration

```shell
composer require league/flysystem-aws-s3-v3
```

```ini
# .env
AWS_ACCESS_KEY_ID=key
AWS_SECRET_ACCESS_KEY=secret
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=bucket
```

## Best Practices

1. **Use public disk** - For user uploads
2. **Validate uploads** - Check types and sizes
3. **Unique names** - Use `store()` for auto names
4. **Temporary URLs** - For private S3 files

## Related References

- [configuration.md](configuration.md) - Environment config
