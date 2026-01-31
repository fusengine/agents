---
name: calendar
description: Date picker calendar component with single and range selection modes
when-to-use: Date selection, date range picking, scheduling, event planning, booking systems
keywords: calendar, date picker, date selection, date range, date-fns, react-day-picker
priority: low
requires: installation.md
related: popover.md, input.md
---

# Calendar

Calendar component provides date selection functionality with support for single dates and date ranges.

## Basic Calendar

```tsx
'use client'

import { useState } from 'react'
import { Calendar } from '@/modules/cores/shadcn/components/ui/calendar'

export function BasicCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border"
    />
  )
}
```

## Calendar with Popover (Date Picker)

```tsx
'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Calendar } from '@/modules/cores/shadcn/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/modules/cores/shadcn/components/ui/popover'
import { Button } from '@/modules/cores/shadcn/components/ui/button'
import { cn } from '@/modules/cores/lib/utils'

export function DatePicker() {
  const [date, setDate] = useState<Date | undefined>()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-[240px] justify-start text-left font-normal',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP') : 'Pick a date'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={(date) =>
            date > new Date() || date < new Date('1900-01-01')
          }
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
```

## Date Range Picker

```tsx
'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Calendar } from '@/modules/cores/shadcn/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/modules/cores/shadcn/components/ui/popover'
import { Button } from '@/modules/cores/shadcn/components/ui/button'
import { cn } from '@/modules/cores/lib/utils'

interface DateRange {
  from?: Date
  to?: Date
}

export function DateRangePicker() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-[300px] justify-start text-left font-normal',
            !dateRange && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dateRange?.from ? (
            dateRange.to ? (
              <>
                {format(dateRange.from, 'LLL dd, y')} -{' '}
                {format(dateRange.to, 'LLL dd, y')}
              </>
            ) : (
              format(dateRange.from, 'LLL dd, y')
            )
          ) : (
            'Pick a date range'
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={dateRange?.from}
          selected={dateRange}
          onSelect={setDateRange}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  )
}
```

## Calendar with Disabled Dates

```tsx
'use client'

import { useState } from 'react'
import { format, isBefore, startOfToday } from 'date-fns'
import { Calendar } from '@/modules/cores/shadcn/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/modules/cores/shadcn/components/ui/popover'
import { Button } from '@/modules/cores/shadcn/components/ui/button'

export function CalendarWithDisabledDates() {
  const [date, setDate] = useState<Date | undefined>()

  // Disable past dates
  const disabledDates = (date: Date) => {
    return isBefore(date, startOfToday())
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          {date ? format(date, 'PPP') : 'Select date'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={disabledDates}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
```

## Multiple Date Selection

```tsx
'use client'

import { useState } from 'react'
import { Calendar } from '@/modules/cores/shadcn/components/ui/calendar'

export function MultiDatePicker() {
  const [dates, setDates] = useState<Date[]>([])

  const handleSelect = (date: Date | undefined) => {
    if (!date) return

    const index = dates.findIndex(
      (d) => d.toDateString() === date.toDateString()
    )

    if (index > -1) {
      setDates(dates.filter((_, i) => i !== index))
    } else {
      setDates([...dates, date])
    }
  }

  const selectedDates = dates.map((d) => d.toDateString())

  return (
    <>
      <Calendar
        mode="single"
        selected={undefined}
        onSelect={handleSelect}
        className="rounded-md border"
        modifiers={{
          selected: dates,
        }}
        modifiersClassNames={{
          selected: 'bg-primary text-primary-foreground',
        }}
      />
      <div className="mt-4 space-y-2">
        <h3 className="font-semibold">Selected Dates:</h3>
        <ul className="space-y-1">
          {dates
            .sort((a, b) => a.getTime() - b.getTime())
            .map((date) => (
              <li key={date.toISOString()} className="text-sm">
                {date.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </li>
            ))}
        </ul>
      </div>
    </>
  )
}
```

## Month and Year Picker

```tsx
'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Calendar } from '@/modules/cores/shadcn/components/ui/calendar'

export function MonthYearPicker() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [mode, setMode] = useState<'days' | 'months' | 'years'>('days')

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setMode('days')}
          className={`px-4 py-2 rounded ${mode === 'days' ? 'bg-primary text-white' : 'bg-gray-200'}`}
        >
          Days
        </button>
        <button
          onClick={() => setMode('months')}
          className={`px-4 py-2 rounded ${mode === 'months' ? 'bg-primary text-white' : 'bg-gray-200'}`}
        >
          Months
        </button>
        <button
          onClick={() => setMode('years')}
          className={`px-4 py-2 rounded ${mode === 'years' ? 'bg-primary text-white' : 'bg-gray-200'}`}
        >
          Years
        </button>
      </div>

      {mode === 'days' && (
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
      )}

      {mode === 'months' && date && (
        <div className="p-4">
          <p className="mb-4 text-center font-semibold">
            Select Month for {date.getFullYear()}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 12 }, (_, i) => {
              const monthDate = new Date(date.getFullYear(), i, 1)
              return (
                <button
                  key={i}
                  onClick={() => setDate(monthDate)}
                  className="py-2 px-3 rounded hover:bg-primary hover:text-white"
                >
                  {format(monthDate, 'MMM')}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {mode === 'years' && (
        <div className="p-4">
          <p className="mb-4 text-center font-semibold">
            Select Year
          </p>
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 20 }, (_, i) => {
              const year = new Date().getFullYear() - 10 + i
              return (
                <button
                  key={year}
                  onClick={() => setDate(new Date(year, 0, 1))}
                  className="py-2 px-3 rounded hover:bg-primary hover:text-white"
                >
                  {year}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
```

## Calendar in Form

```tsx
'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Calendar } from '@/modules/cores/shadcn/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/modules/cores/shadcn/components/ui/popover'
import { Button } from '@/modules/cores/shadcn/components/ui/button'
import { Input } from '@/modules/cores/shadcn/components/ui/input'
import { Label } from '@/modules/cores/shadcn/components/ui/label'

interface FormData {
  name: string
  birthDate?: Date
  eventDate?: Date
}

export function CalendarForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          placeholder="Enter your name"
        />
      </div>

      <div className="space-y-2">
        <Label>Birth Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              {formData.birthDate
                ? format(formData.birthDate, 'PPP')
                : 'Pick a date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={formData.birthDate}
              onSelect={(date) =>
                setFormData({ ...formData, birthDate: date })
              }
              disabled={(date) => date > new Date()}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label>Event Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              {formData.eventDate
                ? format(formData.eventDate, 'PPP')
                : 'Pick a date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={formData.eventDate}
              onSelect={(date) =>
                setFormData({ ...formData, eventDate: date })
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <Button type="submit">Submit</Button>
    </form>
  )
}
```

## Key Props

| Prop | Type | Description |
|------|------|-------------|
| `mode` | `'single' \| 'range' \| 'multiple'` | Selection mode |
| `selected` | `Date \| DateRange \| Date[]` | Currently selected date(s) |
| `onSelect` | `(date) => void` | Callback when date is selected |
| `disabled` | `(date: Date) => boolean` | Function to disable specific dates |
| `numberOfMonths` | `number` | Show multiple months (for range) |
| `initialFocus` | `boolean` | Auto focus calendar on mount |
| `defaultMonth` | `Date` | Initial month to display |

## Dependencies

Install required packages:

```bash
npm install date-fns
```

The calendar uses:
- `date-fns` for date manipulation
- `react-day-picker` for the calendar UI (included in shadcn)

## Common Patterns

### Pattern: Date Picker
- Popover with Calendar inside
- Single date selection
- Button shows formatted date

### Pattern: Date Range
- Set `mode="range"`
- Use `numberOfMonths={2}` for dual calendar view
- Handle `from` and `to` dates

### Pattern: Booking System
- Disable past dates
- Disable unavailable dates
- Show selected dates clearly

### Pattern: Form Integration
- Embed calendar in form
- Store selected date in state
- Submit as part of form data

## Accessibility

- Keyboard navigation (arrow keys)
- Tab to navigate months
- Screen reader support
- Focus management
- ARIA labels and descriptions

## Best Practices

1. **Disable Past Dates**: Use for bookings and future events
2. **Multiple Calendars**: Use `numberOfMonths` for date ranges
3. **Format Display**: Use `date-fns` format for consistent formatting
4. **Clear Selection**: Show selected dates prominently
5. **Validation**: Validate date ranges on submission
6. **Performance**: Memoize disabled date function for performance
