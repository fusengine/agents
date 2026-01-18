# FAQ Schema

**JSON-LD structured data for Frequently Asked Questions (critical for GEO 2026).**

## Why FAQ Schema Matters

- **Rich Snippets**: Dropdown FAQ in Google SERP
- **AI Citations**: LLMs extract Q&A pairs
- **Voice Search**: Optimized for voice assistants
- **Zero-Click**: Answers displayed directly in SERP

---

## Basic FAQ Schema

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is SEO?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "SEO (Search Engine Optimization) is the practice of optimizing websites to rank higher in search results. It includes technical optimization, content creation, and link building."
      }
    },
    {
      "@type": "Question",
      "name": "How long does SEO take to show results?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "SEO typically takes 3-6 months to show significant results. Timeline depends on competition, current authority, and optimization quality."
      }
    }
  ]
}
```

---

## FAQ Best Practices 2026

### Answer Guidelines

- **Length**: 50-300 words per answer
- **Format**: Plain text (HTML allowed but optional)
- **Style**: Direct, concise, complete
- **Keywords**: Include naturally

### Question Guidelines

- **Format**: Natural language questions
- **Source**: Google "People Also Ask" (PAA)
- **Length**: 5-15 words

---

## Complete FAQ with HTML Answers

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is E-E-A-T in SEO?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "<p>E-E-A-T stands for <strong>Experience, Expertise, Authoritativeness, and Trust</strong>. It's Google's framework for evaluating content quality.</p><ul><li><strong>Experience</strong>: First-hand, practical knowledge</li><li><strong>Expertise</strong>: Subject matter authority</li><li><strong>Authoritativeness</strong>: Industry recognition</li><li><strong>Trust</strong>: Transparency and accuracy</li></ul><p>E-E-A-T is critical for YMYL (Your Money Your Life) content in 2026.</p>"
      }
    }
  ]
}
```

---

## Testing

```bash
https://search.google.com/test/rich-results
# Check FAQ rich results eligibility
```
