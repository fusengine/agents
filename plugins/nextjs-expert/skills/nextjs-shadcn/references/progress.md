---
name: progress
description: Progress bar component for displaying file uploads, downloads, and loading states
when-to-use: File uploads, downloads, data loading with percentage, task progress
keywords: progress-bar, loading, percentage, upload, download, indicator
priority: medium
requires: button.md
related: skeleton.md, spinner.md
---

# Progress Component

Import Progress from `@/modules/cores/shadcn/components/ui/progress`:

```typescript
import { Progress } from "@/modules/cores/shadcn/components/ui/progress"
```

## Installation

```bash
bunx --bun shadcn@latest add progress
```

## Basic Progress Bar

Simple progress bar with percentage value:

```tsx
import { Progress } from "@/modules/cores/shadcn/components/ui/progress"

export function ProgressBasic() {
  return (
    <div className="space-y-4">
      <Progress value={33} />
      <Progress value={50} />
      <Progress value={75} />
      <Progress value={100} />
    </div>
  )
}
```

## Progress with Label

Display progress percentage alongside bar:

```tsx
import { Progress } from "@/modules/cores/shadcn/components/ui/progress"

export function ProgressWithLabel() {
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm">
        <span>Loading...</span>
        <span>65%</span>
      </div>
      <Progress value={65} />
    </div>
  )
}
```

## Progress with Animated Value

Dynamic progress with state update:

```tsx
"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/modules/cores/shadcn/components/ui/progress"

export function ProgressAnimated() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          return 100
        }
        return prev + Math.random() * 30
      })
    }, 500)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="w-full space-y-2">
      <div className="text-sm">Uploading... {Math.floor(progress)}%</div>
      <Progress value={progress} />
    </div>
  )
}
```

## Indeterminate Progress

Progress bar without specific value for unknown duration:

```tsx
import { Progress } from "@/modules/cores/shadcn/components/ui/progress"

export function ProgressIndeterminate() {
  return (
    <div className="w-full space-y-2">
      <div className="text-sm">Loading...</div>
      <Progress value={undefined} />
    </div>
  )
}
```

## Upload Progress Indicator

File upload with progress tracking:

```tsx
"use client"

import { useState } from "react"
import { Progress } from "@/modules/cores/shadcn/components/ui/progress"
import { Button } from "@/modules/cores/shadcn/components/ui/button"

export function UploadProgress() {
  const [progress, setProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async () => {
    setIsUploading(true)
    setProgress(0)

    // Simulate file upload
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200))
      setProgress(i)
    }

    setIsUploading(false)
  }

  return (
    <div className="w-full space-y-4">
      <Button onClick={handleUpload} disabled={isUploading}>
        {isUploading ? "Uploading..." : "Upload File"}
      </Button>
      {isUploading && (
        <div className="space-y-2">
          <div className="text-sm">
            {progress}% uploaded
          </div>
          <Progress value={progress} />
        </div>
      )}
    </div>
  )
}
```

## Download Progress

Download indicator with speed information:

```tsx
"use client"

import { useState } from "react"
import { Progress } from "@/modules/cores/shadcn/components/ui/progress"

export function DownloadProgress() {
  const [progress, setProgress] = useState(45)

  return (
    <div className="w-full space-y-3">
      <div className="flex justify-between text-sm">
        <span>Downloading file.zip</span>
        <span>{progress}%</span>
      </div>
      <Progress value={progress} />
      <div className="text-xs text-gray-500">
        45 MB / 100 MB - 2.5 MB/s
      </div>
    </div>
  )
}
```

## Multi-Step Progress

Progress bar for multi-step process:

```tsx
"use client"

import { useState } from "react"
import { Progress } from "@/modules/cores/shadcn/components/ui/progress"
import { Button } from "@/modules/cores/shadcn/components/ui/button"

interface StepProgress {
  currentStep: number
  totalSteps: number
}

export function MultiStepProgress({ currentStep, totalSteps }: StepProgress) {
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className="w-full space-y-3">
      <div className="flex justify-between text-sm">
        <span>Step {currentStep} of {totalSteps}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} />
    </div>
  )
}
```

## Props

```typescript
interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number | null
}
```

- **value**: `number` (0-100) | `null` - Progress percentage or undefined for indeterminate state
- Extends standard HTML div attributes

## Styling

Customize progress bar appearance:

```tsx
{/* Custom color */}
<Progress value={75} className="h-2" />

{/* Large progress bar */}
<Progress value={50} className="h-4" />

{/* With custom indicator color */}
<div className="space-y-2">
  <Progress value={60} />
</div>
```

## Accessibility

- Use `role="progressbar"` (automatic)
- Include `aria-valuenow`, `aria-valuemin`, `aria-valuemax` (automatic)
- Provide text label describing progress
- Update screen reader with status changes

## Common Patterns

### Data Loading Progress

```tsx
export function DataLoadingProgress({ totalItems = 100, loadedItems = 65 }) {
  const progress = (loadedItems / totalItems) * 100
  return (
    <div className="space-y-2">
      <div className="text-sm">Loading items: {loadedItems}/{totalItems}</div>
      <Progress value={progress} />
    </div>
  )
}
```

### Installation Progress

```tsx
export function InstallationProgress({ isInstalling = false, progress = 0 }) {
  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">
        {isInstalling ? "Installing..." : "Installation complete"}
      </div>
      <Progress value={isInstalling ? progress : 100} />
    </div>
  )
}
```

### Sync Progress

```tsx
export function SyncProgress({ isSyncing = false }) {
  return (
    <div className="space-y-2">
      <div className="text-sm">
        {isSyncing ? "Syncing..." : "Sync complete"}
      </div>
      <Progress value={isSyncing ? undefined : 100} />
    </div>
  )
}
```

## Best Practices

- Use for operations with known duration (100% target)
- Provide percentage or time estimate when possible
- Use indeterminate state for unknown durations
- Always include text label describing what's loading
- Avoid progress bars for fast operations (< 200ms)
- Combine with cancel button for long operations
- Show completion state (100%) briefly before clearing

## See Also

- [Skeleton](./skeleton.md) - Placeholder loading component
- [Spinner](./spinner.md) - Indeterminate loading indicator
- [Button](./button.md) - Action buttons
