---
name: seo-video
description: Use when optimizing video SEO. Covers VideoObject schema, YouTube metadata, transcripts, chapters, SeekToAction, Clip schema for key moments, BroadcastEvent for live streams.
user-invocable: false
related-skills: seo, seo-schema, seo-content
---

# Video SEO

## VideoObject Schema (required)

```json
{
  "@type": "VideoObject",
  "name": "<title>",
  "description": "<description>",
  "thumbnailUrl": ["<url-16x9>", "<url-4x3>", "<url-1x1>"],
  "uploadDate": "2026-05-01T08:00:00+00:00",
  "duration": "PT2M30S",
  "contentUrl": "<url>",
  "embedUrl": "<url>"
}
```

## YouTube Optimization

- Title: 60 chars max, keyword first
- Description: 250 words minimum, timestamps, links
- Tags: 5-10 specific, no keyword stuffing
- Thumbnail: 1280x720, high contrast, faces convert well
- Chapters: required for videos > 5 min
- Closed captions: always (accessibility + indexability)
- End screens + cards: for retention

## Transcripts

- Embed full transcript below video (indexable text)
- Use `<details><summary>Transcript</summary>...</details>` for collapsible
- Timestamp links: `<a href="#t=120">2:00</a>`

## Chapters / Clip Schema

```json
{
  "@type": "Clip",
  "name": "Introduction",
  "startOffset": 0,
  "endOffset": 90,
  "url": "https://example.com/video#t=0"
}
```

## SeekToAction (enable seek in rich results)

```json
"potentialAction": {
  "@type": "SeekToAction",
  "target": "https://example.com/video?t={seek_to_second_number}",
  "startOffset-input": "required name=seek_to_second_number"
}
```

## Live Streaming

- `BroadcastEvent` schema for LIVE badge
- Requires `isLiveBroadcast: true`, `startDate`, `endDate`
