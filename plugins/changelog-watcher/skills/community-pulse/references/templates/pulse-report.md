---
name: pulse-report
description: Template for community pulse analysis reports with sentiment and sources
keywords: pulse, community, sentiment, report, template
---

# Community Pulse Report Template

## Header

```markdown
# Community Pulse Report
**Date**: {date}
**Period**: Last {days} days
**Sources Analyzed**: {source_count}
**Overall Sentiment**: {positive/neutral/negative}
```

## Sentiment Summary

```markdown
## Sentiment Overview
| Category | Positive | Neutral | Negative |
|----------|----------|---------|----------|
| Updates | {count} | {count} | {count} |
| Plugins/Hooks | {count} | {count} | {count} |
| Performance | {count} | {count} | {count} |
| DX (Dev Experience) | {count} | {count} | {count} |
```

## Key Findings

```markdown
## Notable Feedback

### Positive
- "{quote}" -- [Source]({url})
- "{quote}" -- [Source]({url})

### Concerns
- "{quote}" -- [Source]({url})
- "{quote}" -- [Source]({url})

### Feature Requests
- {request} -- [Source]({url})
```

## Trends Section

```markdown
## Trends
- **Rising**: {topic_gaining_traction}
- **Declining**: {topic_losing_interest}
- **Stable**: {consistent_topic}
```

## Recommendations

```markdown
## Recommendations for Plugin Development
1. {actionable_recommendation_1}
2. {actionable_recommendation_2}
3. {actionable_recommendation_3}
```
