# LLM Crawlability & Technical SEO for AI

**Making content accessible to AI crawlers and language models.**

## AI Crawlers 2026

| Crawler | User-Agent | Platform |
|---------|------------|----------|
| **GPTBot** | `GPTBot/1.0` | OpenAI (ChatGPT) |
| **Google-Extended** | `Google-Extended` | Google (Bard/Gemini training) |
| **CCBot** | `CCBot/2.0` | Common Crawl (research) |
| **ClaudeBot** | `ClaudeBot/1.0` | Anthropic (Claude) |

---

## Robots.txt for AI

```
# Allow traditional search engines
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

# Control AI training crawlers
User-agent: GPTBot
Allow: /blog/
Disallow: /private/

User-agent: Google-Extended
Allow: /

User-agent: CCBot
Disallow: /
```

**Best Practice 2026**: Allow AI crawlers unless sensitive content.

---

## Technical SEO for LLMs

### 1. Core Web Vitals (Still Critical)

```bash
# AI crawlers respect page speed
- LCP < 2.5s
- INP < 200ms
- CLS < 0.1
```

Fast sites = better crawl budget.

---

### 2. Structured Data (Critical)

```json
# LLMs extract JSON-LD easily
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "...",
  "author": "..."
}
```

---

### 3. Clean HTML Hierarchy

```html
<!-- ✅ Good: Semantic HTML -->
<article>
  <header>
    <h1>Main Title</h1>
  </header>
  <section>
    <h2>Section Title</h2>
    <p>Content...</p>
  </section>
</article>

<!-- ❌ Bad: Div soup -->
<div class="article">
  <div class="title">Main Title</div>
  <div class="section">
    <div class="heading">Section Title</div>
  </div>
</div>
```

---

### 4. Mobile-First (Mandatory)

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

Google's mobile-first index affects AI training data.

---

## Sitemap for AI

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/blog/seo-guide-2026</loc>
    <lastmod>2026-01-18</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>
```

Include `<lastmod>` for content freshness signals.

---

## Content Accessibility

### 1. Text-Based Content

```markdown
✅ Accessible: Plain text, HTML, Markdown
❌ Inaccessible: PDF scans, images with text, Flash
```

### 2. No Login Walls

```
❌ Content behind login: Not crawlable
✅ Public preview + "Read more": Crawlable
```

### 3. No JavaScript-Only Content

```html
<!-- ❌ Bad: Content in JS only -->
<div id="content"></div>
<script>
  document.getElementById('content').innerHTML = 'SEO Guide...'
</script>

<!-- ✅ Good: HTML with JS enhancement -->
<div id="content">
  <p>SEO Guide 2026: Complete tutorial...</p>
</div>
```
