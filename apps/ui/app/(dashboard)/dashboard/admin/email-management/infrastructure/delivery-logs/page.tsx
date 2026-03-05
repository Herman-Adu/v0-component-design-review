"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock,
  Filter,
  Inbox,
  Mail,
  RefreshCw,
  Search,
  Trash2,
  XCircle,
  AlertTriangle,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Send,
  Building2,
  User,
  FileText,
  BarChart3,
} from "lucide-react"
import {
  getDeliveryLogs,
  getDeliveryStats,
  clearDeliveryLogs,
  type DeliveryLogEntry,
  type DeliveryStats,
  type EmailCategory,
  type EmailRecipientType,
  type DeliveryStatus,
  type DeliveryLogQuery,
} from "@/lib/email/services/delivery-log"

// ---------------------------------------------------------------------------
// Status config
// ---------------------------------------------------------------------------

const STATUS_CONFIG: Record<DeliveryStatus, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  sent: { label: "Sent", color: "bg-green-500/20 text-green-400", icon: CheckCircle2 },
  delivered: { label: "Delivered", color: "bg-blue-500/20 text-blue-400", icon: CheckCircle2 },
  bounced: { label: "Bounced", color: "bg-amber-500/20 text-amber-400", icon: AlertTriangle },
  failed: { label: "Failed", color: "bg-red-500/20 text-red-400", icon: XCircle },
  queued: { label: "Queued", color: "bg-muted text-muted-foreground", icon: Clock },
}

const CATEGORY_CONFIG: Record<EmailCategory, { label: string; color: string }> = {
  service: { label: "Service", color: "bg-accent/20 text-accent" },
  contact: { label: "Contact", color: "bg-blue-500/20 text-blue-400" },
  quotation: { label: "Quotation", color: "bg-purple-500/20 text-purple-400" },
}

const PAGE_SIZE = 15

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DeliveryLogsPage() {
  const [entries, setEntries] = useState<DeliveryLogEntry[]>([])
  const [stats, setStats] = useState<DeliveryStats | null>(null)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState<EmailCategory | "all">("all")
  const [filterRecipient, setFilterRecipient] = useState<EmailRecipientType | "all">("all")
  const [filterStatus, setFilterStatus] = useState<DeliveryStatus | "all">("all")
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [clearing, setClearing] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const query: DeliveryLogQuery = {
        limit: PAGE_SIZE,
        offset: page * PAGE_SIZE,
        search: searchQuery || undefined,
        category: filterCategory === "all" ? undefined : filterCategory,
        recipientType: filterRecipient === "all" ? undefined : filterRecipient,
        status: filterStatus === "all" ? undefined : filterStatus,
      }
      const [logResult, statsResult] = await Promise.all([
        getDeliveryLogs(query),
        getDeliveryStats(),
      ])
      setEntries(logResult.entries)
      setTotal(logResult.total)
      setStats(statsResult)
    } finally {
      setLoading(false)
    }
  }, [page, searchQuery, filterCategory, filterRecipient, filterStatus])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Reset page when filters change
  useEffect(() => {
    setPage(0)
  }, [searchQuery, filterCategory, filterRecipient, filterStatus])

  const handleClear = async () => {
    if (!confirm("Clear all delivery logs? This cannot be undone.")) return
    setClearing(true)
    try {
      await clearDeliveryLogs()
      await fetchData()
    } finally {
      setClearing(false)
    }
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)
  const hasFilters = filterCategory !== "all" || filterRecipient !== "all" || filterStatus !== "all" || searchQuery.length > 0

  const formatTime = useCallback((iso: string) => {
    try {
      const d = new Date(iso)
      const now = Date.now()
      const diffMs = now - d.getTime()
      const diffMin = Math.floor(diffMs / 60000)
      if (diffMin < 1) return "Just now"
      if (diffMin < 60) return `${diffMin}m ago`
      const diffH = Math.floor(diffMin / 60)
      if (diffH < 24) return `${diffH}h ago`
      const diffD = Math.floor(diffH / 24)
      if (diffD < 7) return `${diffD}d ago`
      return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" })
    } catch {
      return iso
    }
  }, [])

  function maskEmail(email: string) {
    if (!email.includes("@")) return email
    const [local, domain] = email.split("@")
    return `${local.slice(0, 2)}****@${domain}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Activity className="h-8 w-8 text-accent" />
            Delivery Logs
          </h1>
          <p className="mt-1 text-muted-foreground">
            Track email delivery status across all {stats?.total ?? 0} sends. Logs are stored in-memory and will migrate to Strapi when connected.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleClear} disabled={clearing || (stats?.total ?? 0) === 0} className="text-red-400 hover:text-red-300 border-red-500/30 hover:border-red-500/50 bg-transparent">
            <Trash2 className="mr-2 h-4 w-4" />
            Clear
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="responsive-grid-5">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10">
                <Send className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Sends</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-500/10">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.sent}</p>
                <p className="text-xs text-muted-foreground">Successful</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-500/10">
                <XCircle className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.failed}</p>
                <p className="text-xs text-muted-foreground">Failed</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/10">
                <BarChart3 className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.successRate}%</p>
                <p className="text-xs text-muted-foreground">Success Rate</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-500/10">
                <Clock className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.last24h}</p>
                <p className="text-xs text-muted-foreground">Last 24h</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Category breakdown */}
      {stats && stats.total > 0 && (
        <div className="responsive-grid-3">
          {(["service", "contact", "quotation"] as const).map((cat) => (
            <Card key={cat}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge className={`${CATEGORY_CONFIG[cat].color} border-0`}>{CATEGORY_CONFIG[cat].label}</Badge>
                  <span className="text-sm text-muted-foreground">{stats.byCategory[cat]} emails</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <User className="h-3.5 w-3.5" />
                  {stats.byRecipientType.customer} customer
                  <Building2 className="h-3.5 w-3.5 ml-2" />
                  {stats.byRecipientType.business} business
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Filters & Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search emails, subjects, request IDs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-9"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />

              {/* Category filter */}
              <div className="flex gap-1">
                {(["all", "service", "contact", "quotation"] as const).map((cat) => (
                  <Button
                    key={cat}
                    variant={filterCategory === cat ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterCategory(cat)}
                    className="text-xs h-7"
                  >
                    {cat === "all" ? "All Types" : CATEGORY_CONFIG[cat].label}
                  </Button>
                ))}
              </div>

              {/* Recipient filter */}
              <div className="flex gap-1 ml-2">
                {(["all", "customer", "business"] as const).map((r) => (
                  <Button
                    key={r}
                    variant={filterRecipient === r ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterRecipient(r)}
                    className="text-xs h-7"
                  >
                    {r === "all" ? "All" : r === "customer" ? "Customer" : "Business"}
                  </Button>
                ))}
              </div>

              {/* Status filter */}
              <div className="flex gap-1 ml-2">
                {(["all", "sent", "failed"] as const).map((s) => (
                  <Button
                    key={s}
                    variant={filterStatus === s ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus(s)}
                    className="text-xs h-7"
                  >
                    {s === "all" ? "All Status" : STATUS_CONFIG[s].label}
                  </Button>
                ))}
              </div>

              {hasFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFilterCategory("all")
                    setFilterRecipient("all")
                    setFilterStatus("all")
                    setSearchQuery("")
                  }}
                  className="text-xs h-7 text-muted-foreground"
                >
                  Clear filters
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Log Entries */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-accent" />
              Delivery History
              <Badge variant="outline" className="ml-2 text-xs">{total} entries</Badge>
            </CardTitle>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ArrowUpDown className="h-3.5 w-3.5" />
              Newest first
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Inbox className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="text-lg font-medium text-foreground">
                {hasFilters ? "No matching entries" : "No delivery logs yet"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {hasFilters
                  ? "Try adjusting your filters or search query."
                  : "Logs will appear here when emails are sent via the service request, contact, or quotation forms."}
              </p>
              {!hasFilters && (
                <Button variant="outline" size="sm" className="mt-4 bg-transparent" asChild>
                  <a href="/dashboard/admin/email-management/infrastructure/send-configuration">
                    Send a Test Email
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-border">
              {entries.map((entry) => {
                const statusCfg = STATUS_CONFIG[entry.status]
                const catCfg = CATEGORY_CONFIG[entry.category]
                const StatusIcon = statusCfg.icon
                const isExpanded = expandedId === entry.id

                return (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                    className="w-full text-left px-6 py-3.5 hover:bg-muted/30 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      {/* Status icon */}
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${entry.status === "sent" || entry.status === "delivered" ? "bg-green-500/10" : entry.status === "failed" ? "bg-red-500/10" : "bg-muted"}`}>
                        <StatusIcon className={`h-4 w-4 ${entry.status === "sent" || entry.status === "delivered" ? "text-green-400" : entry.status === "failed" ? "text-red-400" : "text-muted-foreground"}`} />
                      </div>

                      {/* Main info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground truncate">{entry.templateName}</span>
                          <Badge className={`${catCfg.color} border-0 text-[10px] px-1.5 py-0`}>{catCfg.label}</Badge>
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                            {entry.recipientType === "customer" ? "Customer" : "Business"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                          To: {maskEmail(entry.to)} -- {entry.subject}
                        </p>
                      </div>

                      {/* Status + time */}
                      <div className="text-right shrink-0">
                        <Badge className={`${statusCfg.color} border-0 text-xs`}>{statusCfg.label}</Badge>
                        <p className="text-[10px] text-muted-foreground mt-1">{formatTime(entry.timestamp)}</p>
                      </div>
                    </div>

                    {/* Expanded details */}
                    {isExpanded && (
                      <div className="mt-3 ml-12 p-4 bg-muted/30 rounded-lg border border-border/50 space-y-2 text-xs">
                        <div className="responsive-grid-2">
                          <div>
                            <span className="text-muted-foreground">From:</span>
                            <span className="ml-2 font-mono text-foreground">{maskEmail(entry.from)}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">To:</span>
                            <span className="ml-2 font-mono text-foreground">{maskEmail(entry.to)}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Subject:</span>
                            <span className="ml-2 text-foreground">{entry.subject}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Timestamp:</span>
                            <span className="ml-2 text-foreground font-mono">
                              {entry.timestamp ? new Date(entry.timestamp).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" }) : "--"}
                            </span>
                          </div>
                          {entry.resendId && (
                            <div>
                              <span className="text-muted-foreground">Resend ID:</span>
                              <span className="ml-2 font-mono text-foreground">{entry.resendId}</span>
                            </div>
                          )}
                          {entry.metadata?.requestId && (
                            <div>
                              <span className="text-muted-foreground">Request ID:</span>
                              <span className="ml-2 font-mono text-foreground">{entry.metadata.requestId}</span>
                            </div>
                          )}
                          {entry.metadata?.urgency && (
                            <div>
                              <span className="text-muted-foreground">Urgency:</span>
                              <span className="ml-2 text-foreground capitalize">{entry.metadata.urgency}</span>
                            </div>
                          )}
                          {entry.metadata?.customerName && (
                            <div>
                              <span className="text-muted-foreground">Customer:</span>
                              <span className="ml-2 text-foreground">{entry.metadata.customerName}</span>
                            </div>
                          )}
                        </div>
                        {entry.error && (
                          <div className="mt-2 p-2.5 bg-red-500/10 border border-red-500/20 rounded text-red-400">
                            <span className="font-medium">Error:</span> {entry.error}
                          </div>
                        )}
                        <p className="text-[10px] text-muted-foreground pt-1">Log ID: {entry.id}</p>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-3 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Showing {page * PAGE_SIZE + 1}-{Math.min((page + 1) * PAGE_SIZE, total)} of {total}
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)} className="h-7">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-xs text-muted-foreground">Page {page + 1} of {totalPages}</span>
                <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)} className="h-7">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Strapi Migration Note */}
      <Card className="border-dashed border-border/50">
        <CardContent className="p-4 flex items-start gap-3">
          <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Strapi Integration Planned</p>
            <p className="text-xs text-muted-foreground mt-1">
              Delivery logs currently use an in-memory store that resets on server restart. When Strapi is connected, logs will persist
              to an <code className="text-xs bg-muted px-1 py-0.5 rounded">email-delivery-log</code> collection with full history,
              webhook-based delivery tracking (delivered / bounced / complained), and exportable CSV reports.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
