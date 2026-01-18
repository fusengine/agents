# Video & Image Schema

**JSON-LD for video and image content.**

## VideoObject Schema

```json
{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "SEO Tutorial 2026: Complete Beginner's Guide",
  "description": "Learn SEO from scratch. 45-minute comprehensive tutorial covering keywords, on-page, and technical SEO.",
  "thumbnailUrl": "https://example.com/images/video-thumbnail.jpg",
  "uploadDate": "2026-01-15T09:00:00+00:00",
  "duration": "PT45M",
  "contentUrl": "https://example.com/videos/seo-tutorial-2026.mp4",
  "embedUrl": "https://example.com/video-player?id=123"
}
```

## ImageObject Schema

```json
{
  "@context": "https://schema.org",
  "@type": "ImageObject",
  "contentUrl": "https://example.com/images/infographic.jpg",
  "license": "https://creativecommons.org/licenses/by/4.0/",
  "acquireLicensePage": "https://example.com/license",
  "creditText": "AgencySEO",
  "creator": {
    "@type": "Person",
    "name": "Jean Dupont"
  }
}
```
