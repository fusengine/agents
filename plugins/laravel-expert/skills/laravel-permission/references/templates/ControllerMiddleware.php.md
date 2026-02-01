---
name: ControllerMiddleware
description: Controller with permission middleware in constructor
keywords: controller, middleware, constructor, permission
---

# Controller Middleware

Apply permission middleware in controller constructor.

## File: app/Http/Controllers/ArticleController.php

```php
<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\View\View;

/**
 * Article management controller.
 */
final class ArticleController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        // Apply to all methods
        $this->middleware('permission:view articles')->only(['index', 'show']);
        $this->middleware('permission:create articles')->only(['create', 'store']);
        $this->middleware('permission:edit articles')->only(['edit', 'update']);
        $this->middleware('permission:delete articles')->only('destroy');
    }

    /**
     * Display a listing of articles.
     */
    public function index(): View
    {
        return view('articles.index', [
            'articles' => Article::paginate(15),
        ]);
    }

    /**
     * Show the form for creating a new article.
     */
    public function create(): View
    {
        return view('articles.create');
    }

    /**
     * Store a newly created article.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $article = Article::create($validated);

        return redirect()->route('articles.show', $article)
            ->with('success', 'Article created.');
    }

    /**
     * Display the specified article.
     */
    public function show(Article $article): View
    {
        return view('articles.show', compact('article'));
    }

    /**
     * Show the form for editing the article.
     */
    public function edit(Article $article): View
    {
        return view('articles.edit', compact('article'));
    }

    /**
     * Update the specified article.
     */
    public function update(Request $request, Article $article)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $article->update($validated);

        return redirect()->route('articles.show', $article)
            ->with('success', 'Article updated.');
    }

    /**
     * Remove the specified article.
     */
    public function destroy(Article $article)
    {
        $article->delete();

        return redirect()->route('articles.index')
            ->with('success', 'Article deleted.');
    }
}
```

## Alternative: Role-Based Middleware

```php
public function __construct()
{
    // All methods require admin role
    $this->middleware('role:admin');
}
```

## Alternative: Mixed Approach

```php
public function __construct()
{
    // View for anyone with role OR permission
    $this->middleware('role_or_permission:admin|view articles')
        ->only(['index', 'show']);

    // Write operations need specific permission
    $this->middleware('permission:manage articles')
        ->except(['index', 'show']);
}
```
