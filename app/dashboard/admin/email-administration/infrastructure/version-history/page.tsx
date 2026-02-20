"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { ArrowLeft, History, RotateCcw, ChevronDown, ChevronRight, Clock, User, FileText, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  getVersions,
  getVersionStats,
  rollbackToVersion,
  type TemplateVersion,
  type VersionListResult,
} from "@/lib/email/services/template-versions"

const SECTION_LABELS: Record<string, { label: string; color: string }> = {
  all: { label: "All Sections", color: "bg-muted text-muted-foreground" },
  company: { label: "Company", color: "bg-blue-500/20 text-blue-400" },
  brand: { label: "Brand", color: "bg-purple-500/20 text-purple-400" },
  sla: { label: "SLA", color: "bg-amber-500/20 text-amber-400" },
  template: { label: "Template", color: "bg-green-500/20 text-green-400" },
  urgency: { label: "Urgency", color: "bg-red-500/20 text-red-400" },
}

export default function TemplateVersionsPage() {
  const [result, setResult] = useState<VersionListResult | null>(null)
  const [stats, setStats] = useState<{ totalVersions: number; latestVersion: number; lastModified: string; changesBySection: Record<string, number> } | null>(null)
  const [filter, setFilter] = useState("all")
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [rolling, setRolling] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [vResult, vStats] = await Promise.all([
        getVersions(page, 15, filter !== "all" ? filter : undefined),
        getVersionStats(),
      ])
      setResult(vResult)
      setStats(vStats)
    } catch (err) {
      console.error("[email-admin] Failed to load versions:", err)
    } finally {
      setLoading(false)
    }
  }, [page, filter])

  useEffect(() => {
    loadData()
  }, [loadData])

  async function handleRollback(id: string) {
    setRolling(id)
    try {
      const res = await rollbackToVersion(id)
      if (res.success) {
        await loadData()
        setExpandedId(null)
      }
    } catch (err) {
      console.error("[email-admin] Rollback failed:", err)
    } finally {
      setRolling(null)
    }
  }

  function formatTime(iso: string) {
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
      return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    } catch {
      return iso
    }
  }

  function formatFullDate(iso: string) {
    try {
      return new Date(iso).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" })
    } catch {
      return iso
    }
  }

  const totalPages = result ? Math.ceil(result.total / result.pageSize) : 1

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/admin/email-administration/infrastructure"><ArrowLeft className="mr-2 h-4 w-4" /> Infrastructure</Link>
          </Button>
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <History className="h-8 w-8 text-accent" />
            Template Versioning
          </h1>
          <p className="text-muted-foreground mt-1">Track configuration changes, compare diffs, and roll back to any previous version.</p>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Total Versions</p>
              <p className="text-2xl font-bold text-foreground mt-1">{stats.totalVersions}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Current Version</p>
              <p className="text-2xl font-bold text-foreground mt-1">v{stats.latestVersion}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Last Modified</p>
              <p className="text-lg font-semibold text-foreground mt-1">{formatTime(stats.lastModified)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Sections Changed</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {Object.entries(stats.changesBySection).map(([s, count]) => (
                  <Badge key={s} className={`${SECTION_LABELS[s]?.color || "bg-muted text-muted-foreground"} border-0 text-[10px]`}>
                    {SECTION_LABELS[s]?.label || s}: {count}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filter */}
      <div className="flex items-center gap-4">
        <Select value={filter} onValueChange={(v) => { setFilter(v); setPage(1) }}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by section" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sections</SelectItem>
            <SelectItem value="company">Company Details</SelectItem>
            <SelectItem value="brand">Brand Colors</SelectItem>
            <SelectItem value="sla">SLA Times</SelectItem>
            <SelectItem value="template">Template Config</SelectItem>
            <SelectItem value="urgency">Urgency Colors</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          {result?.total || 0} version{result?.total !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Version Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Version History</CardTitle>
          <CardDescription>Each configuration save creates a version snapshot with change tracking.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading versions...</div>
          ) : !result?.versions.length ? (
            <div className="p-8 text-center text-muted-foreground">No versions found for this filter.</div>
          ) : (
            <div className="divide-y divide-border">
              {result.versions.map((v, idx) => {
                const isExpanded = expandedId === v.id
                const isLatest = idx === 0 && page === 1 && filter === "all"
                const isRollback = v.description.startsWith("Rolled back")

                return (
                  <div key={v.id} className="group">
                    {/* Row header */}
                    <button
                      type="button"
                      className="w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-muted/50 transition-colors"
                      onClick={() => setExpandedId(isExpanded ? null : v.id)}
                    >
                      <div className="shrink-0">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>

                      {/* Version badge */}
                      <div className="shrink-0 w-14 text-center">
                        <Badge variant={isLatest ? "default" : "outline"} className={isLatest ? "bg-accent text-accent-foreground" : ""}>
                          v{v.version}
                        </Badge>
                      </div>

                      {/* Timeline dot */}
                      <div className="shrink-0 relative">
                        <div className={`w-3 h-3 rounded-full ${isRollback ? "bg-amber-500" : "bg-accent"}`} />
                        {idx < result.versions.length - 1 && (
                          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-px h-8 bg-border" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-medium text-foreground truncate">{v.description}</p>
                          {isRollback && (
                            <Badge className="bg-amber-500/20 text-amber-400 border-0 text-[10px]">Rollback</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><User className="h-3 w-3" />{v.author}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatTime(v.timestamp)}</span>
                          <Badge className={`${SECTION_LABELS[v.section]?.color || "bg-muted text-muted-foreground"} border-0 text-[10px] px-1.5`}>
                            {SECTION_LABELS[v.section]?.label || v.section}
                          </Badge>
                        </div>
                      </div>

                      {/* Change count */}
                      <div className="shrink-0 text-right">
                        <span className="text-xs text-muted-foreground">
                          {v.changes.length} change{v.changes.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </button>

                    {/* Expanded detail */}
                    {isExpanded && (
                      <div className="px-6 pb-5 pt-0 ml-[4.5rem] space-y-4 bg-muted/30">
                        {/* Timestamp */}
                        <p className="text-xs text-muted-foreground font-mono">{formatFullDate(v.timestamp)}</p>

                        {/* Change diff table */}
                        {v.changes.length > 0 ? (
                          <div className="rounded-lg border border-border overflow-hidden">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="bg-muted/50">
                                  <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground w-1/3">Field</th>
                                  <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground w-1/3">Before</th>
                                  <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground w-1/3">After</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border">
                                {v.changes.map((c, ci) => (
                                  <tr key={ci}>
                                    <td className="px-4 py-2.5 font-mono text-xs text-foreground">{c.field}</td>
                                    <td className="px-4 py-2.5">
                                      <code className="text-xs bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded">{c.oldValue}</code>
                                    </td>
                                    <td className="px-4 py-2.5">
                                      <code className="text-xs bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded">{c.newValue}</code>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground italic">Baseline version -- no prior state to compare against.</p>
                        )}

                        {/* Rollback button */}
                        {!isLatest && v.changes.length > 0 && (
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRollback(v.id)}
                              disabled={rolling === v.id}
                            >
                              <RotateCcw className="mr-2 h-3.5 w-3.5" />
                              {rolling === v.id ? "Rolling back..." : `Roll back to v${v.version}`}
                            </Button>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Creates a new version that reverses these changes
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      )}

      {/* Architecture note */}
      <Card className="border-dashed border-amber-500/30">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Strapi-Ready Architecture</p>
              <p className="text-xs text-muted-foreground mt-1">
                Versions are stored in-memory. When Strapi is connected, each version will be persisted to a
                <code className="mx-1 px-1.5 py-0.5 bg-muted rounded text-[10px]">template-version</code>
                collection type with full audit trail, user authentication tracking, and relational links to the email-configuration single type.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
