---
name: chart
description: Recharts integration wrapper for responsive data visualization
when-to-use: Use when displaying data visualizations like bar charts, line charts, area charts, or pie charts. Provides Recharts integration with shadcn/ui theming and responsive containers.
keywords: chart, recharts, bar chart, line chart, data visualization, responsive chart, tooltip, legend
priority: medium
requires: null
related: null
---

# Chart Component

The Chart component wraps Recharts library with shadcn/ui styling. It provides ChartContainer, ChartTooltip, ChartLegend and other utilities for building responsive data visualizations.

## Installation

Install the Chart component using the shadcn/ui CLI:

```bash
bunx --bun shadcn@latest add chart
```

You'll also need to install Recharts:

```bash
bun add recharts
```

## Components

### ChartContainer

Main wrapper component that applies responsive sizing and theming.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `config` | `ChartConfig` | - | Chart color configuration |
| `children` | `ReactNode` | - | Recharts components |
| `className` | `string` | - | Container CSS classes |
| `style` | `CSSProperties` | - | Inline styles |

### ChartTooltip

Displays formatted data on chart hover.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `ReactNode` | - | Tooltip content component |
| `cursor` | `boolean \| object` | `true` | Cursor behavior |

### ChartLegend

Displays legend for chart data series.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `ReactNode` | - | Legend content component |
| `verticalAlign` | `"top" \| "bottom"` | `"bottom"` | Legend position |

### ChartTooltipContent & ChartLegendContent

Styled content components for tooltip and legend display.

## Basic Bar Chart

### Simple Bar Chart

Create a basic bar chart with grid:

```tsx
"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { ChartContainer, type ChartConfig } from "@/modules/cores/shadcn/components/ui/chart"

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function BarChartExample() {
  return (
    <ChartContainer config={chartConfig} className="h-80 w-full">
      <BarChart data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickFormatter={(value) => value.slice(0, 3)} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" />
        <Bar dataKey="mobile" fill="var(--color-mobile)" />
      </BarChart>
    </ChartContainer>
  )
}
```

### Bar Chart with Tooltip

Add interactive tooltip to bar chart:

```tsx
"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/modules/cores/shadcn/components/ui/chart"

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function BarChartWithTooltipExample() {
  return (
    <ChartContainer config={chartConfig} className="h-80 w-full">
      <BarChart data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickFormatter={(value) => value.slice(0, 3)} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" />
        <Bar dataKey="mobile" fill="var(--color-mobile)" />
      </BarChart>
    </ChartContainer>
  )
}
```

### Bar Chart with Legend

Add legend to bar chart:

```tsx
"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/modules/cores/shadcn/components/ui/chart"

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function BarChartWithLegendExample() {
  return (
    <ChartContainer config={chartConfig} className="h-80 w-full">
      <BarChart data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickFormatter={(value) => value.slice(0, 3)} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" />
        <Bar dataKey="mobile" fill="var(--color-mobile)" />
      </BarChart>
    </ChartContainer>
  )
}
```

## Line Chart

### Basic Line Chart

Create a line chart for trend visualization:

```tsx
"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/modules/cores/shadcn/components/ui/chart"

const chartData = [
  { month: "January", value: 186 },
  { month: "February", value: 305 },
  { month: "March", value: 237 },
  { month: "April", value: 73 },
  { month: "May", value: 209 },
]

const chartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function LineChartExample() {
  return (
    <ChartContainer config={chartConfig} className="h-80 w-full">
      <LineChart data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line
          dataKey="value"
          stroke="var(--color-value)"
          dot={false}
          isAnimationActive={true}
        />
      </LineChart>
    </ChartContainer>
  )
}
```

## Area Chart

### Basic Area Chart

Create an area chart:

```tsx
"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/modules/cores/shadcn/components/ui/chart"

const chartData = [
  { month: "January", value: 186 },
  { month: "February", value: 305 },
  { month: "March", value: 237 },
  { month: "April", value: 73 },
  { month: "May", value: 209 },
]

const chartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function AreaChartExample() {
  return (
    <ChartContainer config={chartConfig} className="h-80 w-full">
      <AreaChart data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          dataKey="value"
          fill="var(--color-value)"
          stroke="var(--color-value)"
          fillOpacity={0.4}
          isAnimationActive={true}
        />
      </AreaChart>
    </ChartContainer>
  )
}
```

## Pie Chart

### Basic Pie Chart

Create a pie chart for distribution visualization:

```tsx
"use client"

import { Pie, PieChart, Cell, Legend } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/modules/cores/shadcn/components/ui/chart"

const chartData = [
  { name: "Desktop", value: 400 },
  { name: "Mobile", value: 300 },
  { name: "Tablet", value: 200 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
  tablet: {
    label: "Tablet",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export function PieChartExample() {
  return (
    <ChartContainer config={chartConfig} className="h-80 w-full">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent />} />
        <Pie
          data={chartData}
          dataKey="value"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                index === 0
                  ? "var(--color-desktop)"
                  : index === 1
                  ? "var(--color-mobile)"
                  : "var(--color-tablet)"
              }
            />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </ChartContainer>
  )
}
```

## Responsive Charts

### Mobile-Responsive Bar Chart

Create a responsive chart that adapts to screen size:

```tsx
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/modules/cores/shadcn/components/ui/chart"

const chartData = [
  { month: "January", value: 186 },
  { month: "February", value: 305 },
  { month: "March", value: 237 },
  { month: "April", value: 73 },
  { month: "May", value: 209 },
]

const chartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function ResponsiveBarChartExample() {
  return (
    <ChartContainer config={chartConfig} className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="value" fill="var(--color-value)" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
```

## Chart Configuration

### ChartConfig Type

```tsx
interface ChartConfig {
  [key: string]: {
    label: string
    color?: string
    icon?: ComponentType
  }
}

// Example
const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
  expenses: {
    label: "Expenses",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig
```

## Best Practices

1. **Set min-height on ChartContainer** - Required for responsive charts
2. **Use theme colors** - Reference CSS variables for consistency
3. **Include tooltips** - Always add ChartTooltip for better UX
4. **Responsive sizing** - Use percentage widths and fixed heights
5. **Animate appropriately** - Disable animations for large datasets
6. **Format data labels** - Use formatters for readable numbers
7. **Legend positioning** - Place legends where they don't obscure data

## Recharts Documentation

For comprehensive Recharts documentation and advanced patterns, refer to [Recharts official docs](https://recharts.org/).

## Styling

### Custom Colors

```tsx
const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "#3b82f6", // Tailwind blue-500
  },
  expenses: {
    label: "Expenses",
    color: "#ef4444", // Tailwind red-500
  },
} satisfies ChartConfig
```

### Theme-Based Colors

```tsx
// Light mode
const lightConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--chart-1))",
  },
}

// Dark mode
const darkConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--chart-2))",
  },
}
```

## Accessibility

- Proper ARIA labels on chart elements
- Keyboard navigation supported
- Color not the only visual indicator
- Responsive text sizing
- High contrast colors recommended
