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

Laravel's filesystem abstraction provides a unified API for local and cloud storage (S3, GCS, etc.). The `Storage` facade makes it easy to work with files regardless of where they're stored.

## Configuration

Disks are configured in `config/filesystems.php`:

| Disk | Purpose |
|------|---------|
| `local` | Private files in `storage/app` |
| `public` | Public files in `storage/app/public` |
| `s3` | Amazon S3 bucket |

## Basic Operations

### Writing Files

| Method | Purpose |
|--------|---------|
| `Storage::put('file.txt', $contents)` | Write contents |
| `Storage::putFile('avatars', $file)` | Store uploaded file |
| `Storage::putFileAs('avatars', $file, 'avatar.jpg')` | Store with name |
| `Storage::prepend('file.txt', 'Prepended')` | Prepend to file |
| `Storage::append('file.txt', 'Appended')` | Append to file |

### Reading Files

| Method | Returns |
|--------|---------|
| `Storage::get('file.txt')` | File contents |
| `Storage::exists('file.txt')` | Boolean |
| `Storage::missing('file.txt')` | Boolean |
| `Storage::size('file.txt')` | Size in bytes |
| `Storage::lastModified('file.txt')` | Timestamp |
| `Storage::mimeType('file.txt')` | MIME type |

### Deleting Files

| Method | Purpose |
|--------|---------|
| `Storage::delete('file.txt')` | Delete single file |
| `Storage::delete(['file1.txt', 'file2.txt'])` | Delete multiple |

### Directories

| Method | Purpose |
|--------|---------|
| `Storage::files('directory')` | List files |
| `Storage::allFiles('directory')` | List files recursively |
| `Storage::directories('directory')` | List subdirectories |
| `Storage::makeDirectory('path')` | Create directory |
| `Storage::deleteDirectory('path')` | Delete directory |

## Disk Selection

```php
// Use specific disk
Storage::disk('s3')->put('file.txt', $contents);

// Use public disk
Storage::disk('public')->put('avatars/avatar.jpg', $file);
```

## File Uploads

```php
// In controller
public function store(Request $request)
{
    $path = $request->file('avatar')->store('avatars');
    // Returns: avatars/randomname.jpg

    $path = $request->file('avatar')->storeAs('avatars', 'avatar.jpg');
    // Returns: avatars/avatar.jpg

    // To specific disk
    $path = $request->file('avatar')->store('avatars', 's3');
}
```

## Public Files

For publicly accessible files:

1. Store in `public` disk
2. Create symlink: `php artisan storage:link`
3. Access via `Storage::url('file.txt')`

```php
$url = Storage::disk('public')->url('avatars/avatar.jpg');
// Returns: /storage/avatars/avatar.jpg
```

## Temporary URLs (S3)

```php
$url = Storage::temporaryUrl('file.pdf', now()->addMinutes(5));
```

## Streaming

```php
// Download response
return Storage::download('file.pdf', 'report.pdf');

// Stream large files
return Storage::response('video.mp4');
```

## Cloud Storage (S3)

```shell
composer require league/flysystem-aws-s3-v3
```

Configure in `.env`:
```
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=your-bucket
```

## Custom Disks

Define in `config/filesystems.php`:

```php
'disks' => [
    'backups' => [
        'driver' => 's3',
        'bucket' => env('BACKUP_BUCKET'),
        // ...
    ],
],
```

## Best Practices

1. **Use public disk** - For user-uploaded public files
2. **Validate uploads** - Check file types and sizes
3. **Unique names** - Use `store()` for auto-generated names
4. **Temporary URLs** - For private S3 files
5. **Queue large uploads** - Don't block requests

## Related References

- [configuration.md](configuration.md) - Environment configuration
- [Laravel Filesystem Docs](https://laravel.com/docs/12.x/filesystem) - Full documentation
