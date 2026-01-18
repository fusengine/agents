# HowTo Schema

**JSON-LD for step-by-step tutorials (featured snippet eligible).**

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Optimize Core Web Vitals",
  "description": "Step-by-step guide to improve LCP, INP, and CLS for better SEO.",
  "image": "https://example.com/images/cwv-tutorial.jpg",
  "totalTime": "PT30M",
  "estimatedCost": {
    "@type": "MonetaryAmount",
    "currency": "EUR",
    "value": "0"
  },
  "tool": [
    {
      "@type": "HowToTool",
      "name": "PageSpeed Insights"
    },
    {
      "@type": "HowToTool",
      "name": "Chrome DevTools"
    }
  ],
  "step": [
    {
      "@type": "HowToStep",
      "name": "Test Current Performance",
      "text": "Run PageSpeed Insights to establish baseline LCP, INP, CLS scores.",
      "url": "https://example.com/blog/cwv-tutorial#step1"
    },
    {
      "@type": "HowToStep",
      "name": "Optimize Images",
      "text": "Convert images to WebP format, implement lazy loading, and use responsive images.",
      "url": "https://example.com/blog/cwv-tutorial#step2"
    }
  ]
}
```
