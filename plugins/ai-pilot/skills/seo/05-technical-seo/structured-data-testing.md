# Structured Data Testing

**Validating schema.org JSON-LD markup.**

## Testing Tools

### 1. Google Rich Results Test

```bash
URL: https://search.google.com/test/rich-results

Steps:
1. Enter URL or paste code
2. Click "Test URL"
3. Check eligible rich results
4. Fix errors/warnings
```

### 2. Schema Markup Validator

```bash
URL: https://validator.schema.org/

Steps:
1. Paste JSON-LD code
2. Click "Run Test"
3. Verify schema validity
```

### 3. Google Search Console

```bash
Path: Search Console → Enhancements

Reports:
- Article
- FAQ
- Product
- Breadcrumb
- Local Business

Check:
- Valid items
- Errors
- Warnings
```

---

## Common Errors

```json
// ❌ Missing required property
{
  "@type": "Article",
  "headline": "Title"
  // Missing: image, author, publisher, datePublished
}

// ✅ Complete schema
{
  "@type": "Article",
  "headline": "Title",
  "image": "...",
  "author": {...},
  "publisher": {...},
  "datePublished": "2026-01-18"
}
```
