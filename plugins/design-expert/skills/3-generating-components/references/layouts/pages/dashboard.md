---
name: dashboard
description: Dashboard page layout with F-pattern, KPIs, charts, and data tables
when-to-use: Designing analytics dashboards, admin panels, overview pages
keywords: dashboard, kpi, chart, f-pattern, metrics, analytics, recharts
priority: high
related: data-table.md, sidebar.md
---

# Dashboard Spec

## Layout

| Zone | Content | Responsive |
|------|---------|------------|
| Top-left | North Star metric (largest KPI) | Full width on mobile |
| Top row | 3-4 KPI cards | 2-col on tablet, stack on mobile |
| Middle | Charts (line/bar/area) | Full width, reduce height on mobile |
| Bottom | Data table with actions | Horizontal scroll on mobile |

**Research:** F-pattern eye tracking shows users scan top-left first, then across, then down-left. Place the most important metric at top-left.

## Components (shadcn/ui)

- `Card` - KPI containers with title, value, trend indicator
- `Badge` - Status indicators (up/down trends)
- `Table` - Data display with sort/filter
- `Tabs` - Period selector (day/week/month/year)
- `Select` - Filter dropdowns
- `Skeleton` - Loading placeholders

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| --kpi-card-padding | 24px | KPI card inner spacing |
| --chart-height | 300px (desktop) / 200px (mobile) | Chart containers |
| --grid-gap | 16px (dense) / 24px (standard) | Card grid spacing |

## Animation (Framer Motion)

- KPI cards: stagger entrance (0.05s delay each)
- Charts: animate data points on load (draw-in)
- Numbers: count-up animation for KPI values
- Trend indicators: fade-in after number completes

## Gemini Design Prompt

```
Create a dashboard page with 4 KPI cards at top (North Star metric largest, top-left),
2 charts in middle row (line chart + bar chart), and a data table at bottom.
Use design tokens from design-system.md. F-pattern layout. Skeleton loading states.
Framer Motion stagger entrance for cards.
```

## Multi-Stack Adaptation

| Stack | Router | Data Fetching |
|-------|--------|--------------|
| Next.js | App Router, page.tsx | Server Components + TanStack Query |
| React SPA | React Router | TanStack Query |
| Laravel | Inertia.js | Eloquent + props |

## Validation Checklist

- [ ] North Star metric is top-left and visually dominant
- [ ] KPI cards show trend direction (up/down arrow + percentage)
- [ ] Charts have loading skeletons
- [ ] Data table supports sort + filter
- [ ] Responsive: cards stack on mobile
- [ ] Period selector works (day/week/month)
- [ ] Skeleton loading states for all async content
