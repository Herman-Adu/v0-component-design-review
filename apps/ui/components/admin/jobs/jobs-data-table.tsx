"use client"

import { useState, useMemo, useCallback } from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  type RowSelectionState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Search,
  MoreHorizontal,
  ArrowUpDown,
  Eye,
  UserPlus,
  RefreshCw,
  Archive,
  Copy,
  Mail,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  SlidersHorizontal,
  X,
  MessageSquare,
  Phone,
  Briefcase,
  FileText,
  Wrench,
} from "lucide-react"
import type {
  Job,
  JobStatus,
  JobPriority,
  FormType,
} from "@/lib/email/services/job-management.types"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const STATUS_CONFIG: Record<
  JobStatus,
  { label: string; className: string }
> = {
  new: { label: "New", className: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  acknowledged: { label: "Acknowledged", className: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30" },
  in_progress: { label: "In Progress", className: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  awaiting_client: { label: "Awaiting Client", className: "bg-purple-500/15 text-purple-400 border-purple-500/30" },
  quoted: { label: "Quoted", className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  resolved: { label: "Resolved", className: "bg-green-500/15 text-green-400 border-green-500/30" },
  closed: { label: "Closed", className: "bg-muted-foreground/15 text-muted-foreground border-muted-foreground/30" },
}

const PRIORITY_CONFIG: Record<
  JobPriority,
  { label: string; className: string; dot: string }
> = {
  urgent: { label: "Urgent", className: "text-red-400", dot: "bg-red-500" },
  high: { label: "High", className: "text-orange-400", dot: "bg-orange-500" },
  normal: { label: "Normal", className: "text-foreground", dot: "bg-muted-foreground" },
  low: { label: "Low", className: "text-muted-foreground", dot: "bg-muted-foreground/50" },
}

const TYPE_CONFIG: Record<FormType, { label: string; icon: typeof MessageSquare; className: string }> = {
  contact: { label: "Contact", icon: MessageSquare, className: "bg-blue-500/15 text-blue-400" },
  quotation: { label: "Quotation", icon: FileText, className: "bg-emerald-500/15 text-emerald-400" },
  service: { label: "Service", icon: Wrench, className: "bg-amber-500/15 text-amber-400" },
}

function formatAge(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diffMs / 60_000)
  if (mins < 60) return `${mins}m`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  return `${days}d`
}

// ---------------------------------------------------------------------------
// Column Definitions
// ---------------------------------------------------------------------------

interface ColumnFactoryProps {
  onViewJob: (job: Job) => void
  onStatusChange: (jobId: string, status: JobStatus) => void
  onAssign: (jobId: string, assignee: string | null) => void
  onCopyId: (id: string) => void
}

function createColumns({
  onViewJob,
  onStatusChange,
  onAssign,
  onCopyId,
}: ColumnFactoryProps): ColumnDef<Job>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    },
    {
      accessorKey: "requestId",
      header: ({ column }) => (
        <Button variant="ghost" className="bg-transparent -ml-3 h-8 px-2 font-semibold" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Request ID
          <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-mono text-xs text-accent">{row.getValue("requestId")}</span>
      ),
      size: 140,
    },
    {
      accessorKey: "formType",
      header: "Type",
      cell: ({ row }) => {
        const t = row.getValue("formType") as FormType
        const cfg = TYPE_CONFIG[t]
        const Icon = cfg.icon
        return (
          <Badge variant="outline" className={`${cfg.className} gap-1 text-[11px] border-0`}>
            <Icon className="h-3 w-3" />
            {cfg.label}
          </Badge>
        )
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
      size: 110,
    },
    {
      accessorKey: "clientName",
      header: ({ column }) => (
        <Button variant="ghost" className="bg-transparent -ml-3 h-8 px-2 font-semibold" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Client
          <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      ),
      cell: ({ row }) => {
        const job = row.original
        return (
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{job.clientName}</p>
            <p className="text-[11px] text-muted-foreground truncate">{job.clientEmail}</p>
          </div>
        )
      },
      size: 180,
    },
    {
      accessorKey: "subject",
      header: "Subject",
      cell: ({ row }) => (
        <p className="text-sm text-foreground truncate max-w-[250px]">{row.getValue("subject")}</p>
      ),
      size: 260,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const s = row.getValue("status") as JobStatus
        const cfg = STATUS_CONFIG[s]
        return (
          <Badge variant="outline" className={`${cfg.className} text-[11px]`}>
            {cfg.label}
          </Badge>
        )
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
      size: 130,
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => {
        const p = row.getValue("priority") as JobPriority
        const cfg = PRIORITY_CONFIG[p]
        return (
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
            <span className={`text-xs ${cfg.className}`}>{cfg.label}</span>
          </div>
        )
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
      size: 90,
    },
    {
      accessorKey: "assignee",
      header: "Assignee",
      cell: ({ row }) => {
        const a = row.getValue("assignee") as string | null
        return a ? (
          <span className="text-xs text-foreground">{a}</span>
        ) : (
          <span className="text-xs text-muted-foreground/50 italic">Unassigned</span>
        )
      },
      size: 100,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button variant="ghost" className="bg-transparent -ml-3 h-8 px-2 font-semibold" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Age
          <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">{formatAge(row.getValue("createdAt"))}</span>
      ),
      size: 70,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const job = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 bg-transparent">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="text-xs">Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onViewJob(job)}>
                <Eye className="mr-2 h-3.5 w-3.5" /> View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onCopyId(job.requestId)}>
                <Copy className="mr-2 h-3.5 w-3.5" /> Copy Request ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onStatusChange(job.id, "acknowledged")}>
                <RefreshCw className="mr-2 h-3.5 w-3.5" /> Acknowledge
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange(job.id, "in_progress")}>
                <Briefcase className="mr-2 h-3.5 w-3.5" /> Start Work
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onViewJob(job)}>
                <Mail className="mr-2 h-3.5 w-3.5" /> Send Reply
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onAssign(job.id, "Sarah M.")}>
                <UserPlus className="mr-2 h-3.5 w-3.5" /> Assign Sarah M.
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAssign(job.id, "James K.")}>
                <UserPlus className="mr-2 h-3.5 w-3.5" /> Assign James K.
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onStatusChange(job.id, "closed")} className="text-muted-foreground">
                <Archive className="mr-2 h-3.5 w-3.5" /> Close
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
      size: 50,
    },
  ]
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

interface JobsDataTableProps {
  data: Job[]
  onViewJob: (job: Job) => void
  onStatusChange: (jobId: string, status: JobStatus) => Promise<void>
  onAssign: (jobId: string, assignee: string | null) => Promise<void>
  onBulkStatusChange: (jobIds: string[], status: JobStatus) => Promise<void>
  onBulkAssign: (jobIds: string[], assignee: string | null) => Promise<void>
  onBulkArchive: (jobIds: string[]) => Promise<void>
}

export default function JobsDataTable({
  data,
  onViewJob,
  onStatusChange,
  onAssign,
  onBulkStatusChange,
  onBulkAssign,
  onBulkArchive,
}: JobsDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [globalFilter, setGlobalFilter] = useState("")
  const [activeTab, setActiveTab] = useState<"all" | FormType>("all")

  // Filter data by active tab
  const filteredData = useMemo(() => {
    if (activeTab === "all") return data
    return data.filter((j) => j.formType === activeTab)
  }, [data, activeTab])

  // Tab counts
  const tabCounts = useMemo(() => ({
    all: data.length,
    contact: data.filter((j) => j.formType === "contact").length,
    quotation: data.filter((j) => j.formType === "quotation").length,
    service: data.filter((j) => j.formType === "service").length,
  }), [data])

  const handleCopyId = useCallback((id: string) => {
    navigator.clipboard.writeText(id)
  }, [])

  const handleStatusChange = useCallback(
    async (jobId: string, status: JobStatus) => {
      await onStatusChange(jobId, status)
    },
    [onStatusChange],
  )

  const handleAssign = useCallback(
    async (jobId: string, assignee: string | null) => {
      await onAssign(jobId, assignee)
    },
    [onAssign],
  )

  const columns = useMemo(
    () =>
      createColumns({
        onViewJob,
        onStatusChange: handleStatusChange,
        onAssign: handleAssign,
        onCopyId: handleCopyId,
      }),
    [onViewJob, handleStatusChange, handleAssign, handleCopyId],
  )

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, columnFilters, columnVisibility, rowSelection, globalFilter },
    enableRowSelection: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })

  const selectedJobIds = table
    .getFilteredSelectedRowModel()
    .rows.map((r) => r.original.id)

  const hasSelection = selectedJobIds.length > 0

  // Active status & priority filters
  const statusFilter = (columnFilters.find((f) => f.id === "status")?.value ?? []) as string[]
  const priorityFilter = (columnFilters.find((f) => f.id === "priority")?.value ?? []) as string[]
  const hasFilters = statusFilter.length > 0 || priorityFilter.length > 0 || globalFilter.length > 0

  return (
    <div className="space-y-3">
      {/* Tab bar */}
      <div className="flex items-center gap-1 border-b border-border pb-2">
        {(
          [
            { key: "all", label: "All Requests" },
            { key: "contact", label: "Contact" },
            { key: "quotation", label: "Quotation" },
            { key: "service", label: "Service" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => {
              setActiveTab(tab.key)
              setRowSelection({})
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            {tab.label}
            <span
              className={`text-[11px] min-w-[20px] text-center rounded-full px-1.5 py-0.5 ${
                activeTab === tab.key ? "bg-accent-foreground/15" : "bg-muted"
              }`}
            >
              {tabCounts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search ID, client, email, subject..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-9 h-9"
            />
          </div>

          {/* Status filter */}
          <Select
            value={statusFilter.length === 1 ? statusFilter[0] : "all"}
            onValueChange={(v) => {
              if (v === "all") {
                table.getColumn("status")?.setFilterValue(undefined)
              } else {
                table.getColumn("status")?.setFilterValue([v])
              }
            }}
          >
            <SelectTrigger className="w-[150px] h-9">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {Object.entries(STATUS_CONFIG).map(([val, cfg]) => (
                <SelectItem key={val} value={val}>
                  {cfg.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Priority filter */}
          <Select
            value={priorityFilter.length === 1 ? priorityFilter[0] : "all"}
            onValueChange={(v) => {
              if (v === "all") {
                table.getColumn("priority")?.setFilterValue(undefined)
              } else {
                table.getColumn("priority")?.setFilterValue([v])
              }
            }}
          >
            <SelectTrigger className="w-[130px] h-9 hidden sm:flex">
              <SelectValue placeholder="All Priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              {Object.entries(PRIORITY_CONFIG).map(([val, cfg]) => (
                <SelectItem key={val} value={val}>
                  {cfg.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasFilters && (
            <Button
              variant="ghost"
              className="h-9 px-2 bg-transparent"
              onClick={() => {
                setGlobalFilter("")
                table.getColumn("status")?.setFilterValue(undefined)
                table.getColumn("priority")?.setFilterValue(undefined)
              }}
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Bulk actions */}
          {hasSelection && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 bg-transparent">
                  {selectedJobIds.length} selected
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="text-xs">Bulk Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onBulkStatusChange(selectedJobIds, "acknowledged")}>
                  Mark Acknowledged
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onBulkStatusChange(selectedJobIds, "in_progress")}>
                  Mark In Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onBulkStatusChange(selectedJobIds, "resolved")}>
                  Mark Resolved
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onBulkAssign(selectedJobIds, "Sarah M.")}>
                  Assign Sarah M.
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onBulkAssign(selectedJobIds, "James K.")}>
                  Assign James K.
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    onBulkArchive(selectedJobIds)
                    setRowSelection({})
                  }}
                  className="text-red-400"
                >
                  Archive Selected
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Column visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-1.5 bg-transparent">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Columns</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {table
                .getAllColumns()
                .filter((c) => c.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    className="capitalize"
                  >
                    {column.id === "clientName" ? "Client" : column.id === "createdAt" ? "Age" : column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/30 hover:bg-muted/30">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} style={{ width: header.getSize() }} className="text-xs font-semibold text-muted-foreground">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={(e) => {
                    // Don't trigger when clicking checkboxes or dropdown
                    const target = e.target as HTMLElement
                    if (target.closest("[role='checkbox']") || target.closest("[data-slot='dropdown-menu-trigger']") || target.closest("button")) return
                    onViewJob(row.original)
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} style={{ width: cell.column.getSize() }} className="py-2.5">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </p>
        <div className="flex items-center gap-2">
          <Select
            value={String(table.getState().pagination.pageSize)}
            onValueChange={(v) => table.setPageSize(Number(v))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 15, 20].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground whitespace-nowrap">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </p>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
              <ChevronsLeft className="h-4 w-4" />
              <span className="sr-only">First page</span>
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
              <ChevronsRight className="h-4 w-4" />
              <span className="sr-only">Last page</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
