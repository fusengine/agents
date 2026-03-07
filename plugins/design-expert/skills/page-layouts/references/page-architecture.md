---
name: page-architecture
description: Core page layout architecture with shell, regions, and responsive patterns
when-to-use: Starting any page layout, understanding the shell structure
keywords: architecture, shell, layout, grid, responsive, regions, container
priority: high
related: sidebar.md, navbar.md
---

# Page Architecture

## Shell Pattern

Every app page lives inside a shell that provides consistent navigation.

```
+--------------------------------------------------+
| Navbar (sticky, h-16)                            |
+----------+---------------------------------------+
| Sidebar  | Page Container                        |
| (w-60)   |   Page Header (title + breadcrumb)    |
|          |   Page Content (main area)            |
|          |   Page Footer (optional)              |
+----------+---------------------------------------+
```

## Layout Regions

| Region | Role | Height | Width |
|--------|------|--------|-------|
| Navbar | Global nav, search, user menu | 64px fixed | 100% |
| Sidebar | Section nav, links, user | 100vh - 64px | 240px / 60px / 0px |
| Page Container | Content wrapper | auto (scrollable) | remaining width |
| Page Header | Title, breadcrumb, actions | auto | 100% |
| Page Content | Main content area | flex-1 | 100% |

## Responsive Strategy

### Desktop (> 1024px)
- Sidebar expanded (240px)
- Content fills remaining width
- Multi-column grids available

### Tablet (640-1024px)
- Sidebar collapsed (60px) or hidden
- Content adapts to narrower width
- 2-column max for grids

### Mobile (< 640px)
- Sidebar hidden (overlay on hamburger)
- Bottom tab navigation
- Single column layout
- Full-width cards

## Content Width Patterns

| Pattern | Max Width | When to Use |
|---------|-----------|-------------|
| Narrow | 640px | Forms, auth pages, reading |
| Standard | 1024px | General content pages |
| Wide | 1280px | Dashboards, data tables |
| Full | 100% | Complex dashboards |

## Page Header Pattern

```
+--------------------------------------------------+
| Breadcrumb (optional)                            |
| Page Title                      [Action Buttons] |
| Description (optional)                           |
+--------------------------------------------------+
```

## Grid Patterns

### Card Grid (Dashboard)
```
| KPI | KPI | KPI | KPI |   <- 4-col on desktop
|    Chart     |   Chart  |   <- 2-col
|        Data Table       |   <- full width
```

### Content + Sidebar
```
| Main Content (2/3)  | Side Panel (1/3) |
```

### Settings Layout
```
| Nav (w-48) | Content Area (flex-1)     |
```

## Z-Index Scale

| Layer | Z-Index | Elements |
|-------|---------|----------|
| Base | 0 | Page content |
| Sticky | 10 | Navbar, sidebar |
| Dropdown | 20 | Menus, popovers |
| Modal | 30 | Dialogs, sheets |
| Toast | 40 | Notifications |
| Tooltip | 50 | Tooltips |

## Scroll Behavior

- Page container scrolls, not the body
- Sidebar is sticky (does not scroll with content)
- Navbar is sticky with backdrop-blur
- Infinite scroll: use intersection observer
- Scroll restoration on route change
