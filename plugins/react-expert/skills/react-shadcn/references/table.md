---
name: table
description: Data table component with sorting, pagination, and filtering using tanstack/react-table
when-to-use: Displaying structured data in rows and columns, implementing complex tables with sorting and pagination
keywords: data-table, datatable, grid, spreadsheet, tanstack, react-table
priority: high
requires:
related:
---

# Table Component

Fully-featured data table component built with [@tanstack/react-table](https://tanstack.com/table/latest) and shadcn/ui primitives.

## Installation

```bash
npm install @tanstack/react-table
bunx --bun shadcn-ui@latest add table
```

## Basic Table Structure

```tsx
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/modules/cores/shadcn/components/ui/table"

export function BasicTable() {
  const invoices = [
    {
      id: "INV001",
      status: "Paid",
      method: "Credit Card",
      amount: "$250.00",
    },
    // ... more rows
  ]

  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-medium">{invoice.id}</TableCell>
            <TableCell>{invoice.status}</TableCell>
            <TableCell>{invoice.method}</TableCell>
            <TableCell className="text-right">{invoice.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
```

## Column Definitions

Define columns with tanstack/react-table for reusability:

```tsx
import { ColumnDef } from "@tanstack/react-table"

export type Invoice = {
  id: string
  status: "pending" | "processing" | "success" | "failed"
  email: string
  amount: number
}

export const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </button>
    ),
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
]
```

## Data Table Pattern with Sorting & Pagination

```tsx
"use client"

import { useState } from "react"
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/modules/cores/shadcn/components/ui/table"
import { Button } from "@/modules/cores/shadcn/components/ui/button"

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[]
  data: TData[]
}

export function DataTable<TData>({ columns, data }: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  })

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
```

## Server Component Data Fetching

Fetch data in Server Components and pass to DataTable:

```tsx
// app/invoices/page.tsx (Server Component)
import { DataTable } from "@/modules/cores/shadcn/components/data-table"
import { columns } from "./_components/columns"

async function getInvoices() {
  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/api/invoices",
    {
      headers: {
        Authorization: `Bearer ${process.env.API_SECRET_KEY}`,
      },
    },
  )

  if (!response.ok) {
    throw new Error("Failed to fetch invoices")
  }

  return response.json()
}

export default async function InvoicesPage() {
  const data = await getInvoices()

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-4 text-2xl font-bold">Invoices</h1>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
```

## Advanced Features

### Filtering

```tsx
import { Input } from "@/modules/cores/shadcn/components/ui/input"
import { getFilteredRowModel } from "@tanstack/react-table"

export function DataTableWithFilter<TData>({
  columns,
  data,
}: DataTableProps<TData>) {
  const [globalFilter, setGlobalFilter] = useState("")

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  })

  return (
    <div className="w-full space-y-4">
      <Input
        placeholder="Filter all columns..."
        value={globalFilter}
        onChange={(event) => setGlobalFilter(event.target.value)}
        className="max-w-sm"
      />
      {/* Table UI... */}
    </div>
  )
}
```

### Row Selection

```tsx
import {
  Checkbox,
} from "@/modules/cores/shadcn/components/ui/checkbox"

export const columns: ColumnDef<Invoice>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  // ... rest of columns
]
```

## CSS Classes

- `.rounded-md` - Rounded corners
- `.border` - Light gray border
- `.text-right` - Right-aligned text
- `.font-medium` - Medium weight text
- `.h-24` - 96px height
- `.space-x-2` - Horizontal spacing

## API Reference

- `ColumnDef<TData>` - Column definition type
- `useReactTable()` - Main hook for table logic
- `flexRender()` - Render flexible cell/header content
- `getCoreRowModel()` - Base row processing
- `getSortedRowModel()` - Add sorting support
- `getPaginationRowModel()` - Add pagination support
- `getFilteredRowModel()` - Add filtering support
