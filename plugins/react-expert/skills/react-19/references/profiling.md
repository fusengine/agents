---
name: profiling
description: Measure React performance - DevTools Profiler, flamegraph, render timing, optimization
when-to-use: performance debugging, render analysis, optimization, bottleneck detection
keywords: profiler, devtools, flamegraph, render, timing, performance
priority: medium
related: templates/profiling-devtools.md, react-compiler.md
---

# Profiling

## Purpose

**Measure and analyze React render performance.**

### Why Profile
- Identify slow renders
- Find unnecessary re-renders
- Measure optimization impact
- Data-driven decisions

### When to Use
- Performance issues reported
- Before optimization
- After optimization (verify)
- Regular performance audits

### Key Points
- Use React DevTools Profiler
- Profile in production mode
- Record specific interactions
- Analyze flamegraph

---

## React DevTools Profiler

**Built-in profiling tool.**

### Purpose
- Record render sessions
- Visualize component tree
- Measure render times
- Track re-renders

### Key Features
- Flamegraph view
- Ranked chart
- Component timeline
- Commit information

---

## Profiling Modes

| Mode | Purpose |
|------|---------|
| Flamegraph | Visual hierarchy of renders |
| Ranked | Components sorted by render time |
| Timeline | Render sequence over time |

---

## What to Look For

| Issue | Indicator |
|-------|-----------|
| Unnecessary re-render | Component renders without prop change |
| Slow render | Long bar in flamegraph |
| Cascading updates | Many components in single commit |
| Frequent commits | High commit count for interaction |

---

## Highlight Updates

**Visual feedback for re-renders.**

### Purpose
- See renders in real-time
- Identify frequent updaters
- Debug render cascades

### Key Points
- Enable in DevTools settings
- Colored borders on render
- Blue = infrequent
- Red = frequent

---

## Profiler Component

**Programmatic profiling in code.**

### Purpose
- Measure specific sections
- Custom metrics collection
- CI/CD integration
- Automated monitoring

### When to Use
- Specific component measurement
- Production monitoring
- Custom dashboards

### Key Points
- Wrap components to measure
- onRender callback
- Phase, duration, timestamps
- Minimal overhead

---

## Browser DevTools

| Tool | Use For |
|------|---------|
| Performance tab | JavaScript execution |
| Memory tab | Memory leaks |
| Network tab | Bundle sizes |
| Lighthouse | Overall metrics |

---

## Performance Metrics

| Metric | Description |
|--------|-------------|
| Actual duration | Time spent rendering |
| Base duration | Estimated without memoization |
| Start time | When render began |
| Commit time | When committed to DOM |

---

## React Compiler Note

With React Compiler (19.1+), many manual optimizations (memo, useMemo, useCallback) are automatic. Profile to verify compiler effectiveness rather than add manual memoization.

---

→ See `templates/profiling-devtools.md` for code examples
