---
name: complications
description: watchOS complications for watch faces with WidgetKit, timelines, and data updates
when-to-use: creating watch face complications, displaying glanceable data, updating complication content
keywords: complication, WidgetKit, TimelineProvider, watch face, CLKComplicationFamily
priority: high
related: workouts.md, watch-connectivity.md
---

# watchOS Complications

## When to Use

- Displaying data on watch face
- Glanceable information
- Quick app launch
- Real-time data updates

## Key Concepts

### WidgetKit Complications (watchOS 9+)
Modern complication system using WidgetKit.

**Key Points:**
- Same API as iOS widgets
- TimelineProvider for updates
- Multiple families supported
- SwiftUI for rendering

### Complication Families

| Family | Description |
|--------|-------------|
| accessoryCircular | Small circular |
| accessoryRectangular | Rectangular area |
| accessoryInline | Single line text |
| accessoryCorner | Corner placement |

### TimelineProvider
Provides content for complications.

**Methods:**
- `placeholder(in:)` - Loading state
- `getTimeline(in:completion:)` - Future entries
- `getSnapshot(in:completion:)` - Quick preview

### Timeline Entries
Data snapshots at specific times.

**Key Points:**
- Date determines when shown
- System schedules updates
- Budget for background updates

---

## Update Strategies

| Strategy | Use Case |
|----------|----------|
| Timeline | Predictable changes (weather) |
| Push | Server-triggered updates |
| Background refresh | Periodic data fetch |
| App update | When app runs |

---

## Complication Placement

```
Watch Face
├── Top slot
├── Corner slots (4)
├── Center slot
└── Bottom slot

Each slot supports specific families
```

---

## Best Practices

- ✅ Support multiple families
- ✅ Provide meaningful placeholder
- ✅ Update efficiently (battery)
- ✅ Use timeline for predictions
- ✅ Test on actual watch face
- ❌ Don't update too frequently
- ❌ Don't show stale data
- ❌ Don't require app launch for info
