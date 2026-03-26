---
name: searchable
description: Searchable trait, toSearchableArray, custom index, search conditions and filtering
file-type: markdown
---

# Searchable Trait & Indexing

## Adding Search to Models

```php
use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

final class Article extends Model
{
    use Searchable;

    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'body' => $this->body,
            'author_name' => $this->author->name,
        ];
    }

    public function searchableAs(): string
    {
        return 'articles_index';
    }
}
```

---

## Search Operations

```php
$articles = Article::search('laravel')->get();
$articles = Article::search('laravel')->paginate(15);
$articles = Article::search('laravel')->where('category', 'tutorial')->get();
$articles = Article::search('laravel')->orderBy('created_at', 'desc')->get();
$results  = Article::search('laravel')->raw();
```

---

## Conditional Indexing

```php
final class Article extends Model
{
    use Searchable;

    public function shouldBeSearchable(): bool
    {
        return $this->is_published;
    }
}
```

---

## Bulk Operations

```bash
php artisan scout:import "App\Models\Article"
php artisan scout:flush "App\Models\Article"
```

```php
use Laravel\Scout\Scout;

Scout::withoutSyncing(function () {
    Article::factory()->count(1000)->create();
});
Article::makeAllSearchable();
```

---

## Soft Deletes

```php
// config/scout.php: 'soft_delete' => true
Article::search('laravel')->withTrashed()->get();
Article::search('laravel')->onlyTrashed()->get();
```

---

## Best Practices

- Use `toSearchableArray()` to limit indexed fields
- Use `shouldBeSearchable()` to filter indexed records
- Use `Scout::withoutSyncing()` during bulk operations
- Never index all model attributes (security + performance)
- Run `scout:import` after adding Searchable trait
