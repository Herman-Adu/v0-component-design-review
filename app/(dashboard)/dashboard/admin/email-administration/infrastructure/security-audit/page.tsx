"use client"

import React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Lock,
  Zap,
  FileWarning,
  Mail,
  Bug,
  Server,
  Eye,
  Clock,
} from "lucide-react"
import { runSecurityAudit } from "@/lib/actions/security-audit"
import type { SecurityAuditResult, SecurityCheck, SecurityStatus, CheckType } from "@/lib/actions/action.types"

// ---------------------------------------------------------------------------
// Category metadata
// ---------------------------------------------------------------------------

const CATEGORY_META: Record<string, { label: string; icon: React.ElementType; description: string }> = {
  "rate-limiting": { label: "Rate Limiting", icon: Clock, description: "Protects against abuse by limiting request frequency per IP" },
  csrf: { label: "CSRF / Origin Protection", icon: Shield, description: "Prevents cross-site request forgery attacks" },
  honeypot: { label: "Bot Detection (Honeypot)", icon: Bug, description: "Hidden fields that trap automated bot submissions" },
  sanitization: { label: "Input Sanitization", icon: FileWarning, description: "Strips dangerous content from user inputs before processing" },
  validation: { label: "Server-Side Validation", icon: CheckCircle2, description: "Zod schemas enforce data integrity on the server" },
  email: { label: "Email Security", icon: Mail, description: "API key protection and sender identity configuration" },
  "error-handling": { label: "Error Handling", icon: AlertTriangle, description: "Safe error messages that never expose internals" },
  "env-security": { label: "Environment Security", icon: Server, description: "Secret management and runtime configuration" },
}

const STATUS_CONFIG: Record<SecurityStatus, { label: string; color: string; bgColor: string; borderColor: string; icon: React.ElementType }> = {
  pass: { label: "Pass", color: "text-green-400", bgColor: "bg-green-500/10", borderColor: "border-green-500/30", icon: CheckCircle2 },
  warn: { label: "Warning", color: "text-amber-400", bgColor: "bg-amber-500/10", borderColor: "border-amber-500/30", icon: AlertTriangle },
  fail: { label: "Fail", color: "text-red-400", bgColor: "bg-red-500/10", borderColor: "border-red-500/30", icon: XCircle },
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function EmailSecurityPage() {
  const [audit, setAudit] = useState<SecurityAuditResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  const handleRunAudit = useCallback(async () => {
    setLoading(true)
    try {
      const result = await runSecurityAudit()
      setAudit(result)
      // Auto-expand categories with warnings or failures
      const toExpand = new Set<string>()
      for (const check of result.checks) {
        if (check.status !== "pass") toExpand.add(check.category)
      }
      setExpandedCategories(toExpand)
    } finally {
      setLoading(false)
    }
  }, [])

  const toggleCategory = useCallback((cat: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }, [])

  const expandAll = useCallback(() => {
    if (!audit) return
    const all = new Set(audit.checks.map((c) => c.category))
    setExpandedCategories(all)
  }, [audit])

  const collapseAll = useCallback(() => {
    setExpandedCategories(new Set())
  }, [])

  // Group checks by category preserving order
  const grouped = audit
    ? Object.entries(
        audit.checks.reduce<Record<string, SecurityCheck[]>>((acc, check) => {
          if (!acc[check.category]) acc[check.category] = []
          acc[check.category].push(check)
          return acc
        }, {}),
      )
    : []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10">
            <ShieldCheck className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Security Audit</h1>
            <p className="text-sm text-muted-foreground">
              Real-time inspection of all security layers protecting forms and email delivery
            </p>
          </div>
        </div>
      </div>

      {/* Run Audit CTA */}
      {!audit && (
        <Card className="border-accent/30">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Shield className="h-16 w-16 text-muted-foreground/30 mb-6" />
            <h2 className="text-lg font-semibold text-foreground mb-2">Run a Security Audit</h2>
            <p className="text-sm text-muted-foreground max-w-md mb-6">
              Inspects rate limiting, CSRF protection, input sanitization, honeypot fields, Zod validation, email security, error handling, and environment configuration across all 3 form actions and email services.
            </p>
            <Button onClick={handleRunAudit} disabled={loading} size="lg">
              {loading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Running audit...
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Run Security Audit
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Audit Results */}
      {audit && (
        <>
          {/* Score Overview */}
          <div className="responsive-grid-4">
            <Card className={`${audit.overallStatus === "pass" ? "border-green-500/30" : audit.overallStatus === "warn" ? "border-amber-500/30" : "border-red-500/30"}`}>
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`flex items-center justify-center w-14 h-14 rounded-full ${STATUS_CONFIG[audit.overallStatus].bgColor}`}>
                  {audit.overallStatus === "pass" ? (
                    <ShieldCheck className="h-7 w-7 text-green-400" />
                  ) : audit.overallStatus === "warn" ? (
                    <ShieldAlert className="h-7 w-7 text-amber-400" />
                  ) : (
                    <ShieldAlert className="h-7 w-7 text-red-400" />
                  )}
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">{audit.score}%</p>
                  <p className={`text-sm font-medium ${STATUS_CONFIG[audit.overallStatus].color}`}>
                    {audit.overallStatus === "pass" ? "All checks passed" : audit.overallStatus === "warn" ? "Warnings found" : "Failures detected"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-500/10">
                  <CheckCircle2 className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{audit.passCount}</p>
                  <p className="text-sm text-muted-foreground">Passed</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-amber-500/10">
                  <AlertTriangle className="h-6 w-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{audit.warnCount}</p>
                  <p className="text-sm text-muted-foreground">Warnings</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-red-500/10">
                  <XCircle className="h-6 w-6 text-red-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{audit.failCount}</p>
                  <p className="text-sm text-muted-foreground">Failures</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={expandAll}>
                <Eye className="mr-1.5 h-3.5 w-3.5" />
                Expand All
              </Button>
              <Button variant="outline" size="sm" onClick={collapseAll}>
                Collapse All
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-xs text-muted-foreground">
                Last run: {new Date(audit.timestamp).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
              </p>
              <Button variant="outline" size="sm" onClick={handleRunAudit} disabled={loading}>
                <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
                Re-run
              </Button>
            </div>
          </div>

          {/* Category Sections */}
          <div className="space-y-3">
            {grouped.map(([category, checks]) => {
              const meta = CATEGORY_META[category] || { label: category, icon: Shield, description: "" }
              const isExpanded = expandedCategories.has(category)
              const catPassCount = checks.filter((c) => c.status === "pass").length
              const catWarnCount = checks.filter((c) => c.status === "warn").length
              const catFailCount = checks.filter((c) => c.status === "fail").length
              const worstStatus: SecurityStatus = catFailCount > 0 ? "fail" : catWarnCount > 0 ? "warn" : "pass"
              const Icon = meta.icon

              return (
                <Card key={category} className={`${STATUS_CONFIG[worstStatus].borderColor} transition-colors`}>
                  <button
                    type="button"
                    onClick={() => toggleCategory(category)}
                    className="w-full text-left cursor-pointer"
                    aria-expanded={isExpanded}
                    aria-label={`${meta.label} - ${checks.length} checks`}
                  >
                    <CardHeader className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`flex items-center justify-center w-9 h-9 rounded-lg ${STATUS_CONFIG[worstStatus].bgColor}`}>
                            <Icon className={`h-4.5 w-4.5 ${STATUS_CONFIG[worstStatus].color}`} />
                          </div>
                          <div>
                            <CardTitle className="text-sm font-semibold text-foreground">{meta.label}</CardTitle>
                            <CardDescription className="text-xs">{meta.description}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5">
                            {catPassCount > 0 && (
                              <Badge className="bg-green-500/15 text-green-400 border-0 text-xs px-1.5">
                                {catPassCount} pass
                              </Badge>
                            )}
                            {catWarnCount > 0 && (
                              <Badge className="bg-amber-500/15 text-amber-400 border-0 text-xs px-1.5">
                                {catWarnCount} warn
                              </Badge>
                            )}
                            {catFailCount > 0 && (
                              <Badge className="bg-red-500/15 text-red-400 border-0 text-xs px-1.5">
                                {catFailCount} fail
                              </Badge>
                            )}
                          </div>
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </button>
                  {isExpanded && (
                    <CardContent className="px-4 pb-4 pt-0 space-y-2">
                      {checks.map((check) => {
                        const StatusIcon = STATUS_CONFIG[check.status].icon
                        return (
                          <div
                            key={check.id}
                            className={`rounded-lg border p-3 ${STATUS_CONFIG[check.status].borderColor} ${STATUS_CONFIG[check.status].bgColor}`}
                          >
                            <div className="flex items-start gap-3">
                              <StatusIcon className={`h-4 w-4 mt-0.5 shrink-0 ${STATUS_CONFIG[check.status].color}`} />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <p className="text-sm font-medium text-foreground">{check.label}</p>
                                  <Badge className={`${STATUS_CONFIG[check.status].bgColor} ${STATUS_CONFIG[check.status].color} border-0 text-[10px] px-1.5`}>
                                    {STATUS_CONFIG[check.status].label}
                                  </Badge>
                                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-muted-foreground">
                                    {check.checkType === "runtime" ? "Runtime" : "Static"}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mb-1">{check.description}</p>
                                <p className="text-xs text-foreground/80 font-mono leading-relaxed">{check.detail}</p>
                                {check.recommendation && (
                                  <div className="mt-2 flex items-start gap-1.5 text-xs text-amber-400">
                                    <Zap className="h-3 w-3 mt-0.5 shrink-0" />
                                    <span>{check.recommendation}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </CardContent>
                  )}
                </Card>
              )
            })}
          </div>

          {/* Security Architecture Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Lock className="h-4 w-4 text-accent" />
                Security Architecture
              </CardTitle>
              <CardDescription>
                Multi-layered defence protecting all form submissions and email delivery
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="responsive-grid-2">
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-foreground">Request Pipeline (per form submission)</h4>
                  <div className="space-y-1">
                    {[
                      { step: "1", label: "Origin validation", detail: "securityCheck() verifies request source" },
                      { step: "2", label: "Rate limiting", detail: "IP-based request throttling per form type" },
                      { step: "3", label: "Honeypot check", detail: "Hidden field traps reject bot submissions" },
                      { step: "4", label: "Input sanitization", detail: "XSS stripping, length limits, format cleaning" },
                      { step: "5", label: "Zod validation", detail: "Server-side schema enforcement" },
                      { step: "6", label: "Business rules", detail: "Domain-specific validation logic" },
                      { step: "7", label: "Email delivery", detail: "Resend API with delivery logging" },
                    ].map((item) => (
                      <div key={item.step} className="flex items-start gap-2 text-xs">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-accent/10 text-accent font-bold shrink-0 text-[10px]">
                          {item.step}
                        </span>
                        <div>
                          <span className="font-medium text-foreground">{item.label}</span>
                          <span className="text-muted-foreground"> -- {item.detail}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-foreground">Protection Coverage</h4>
                  <div className="space-y-2">
                    {[
                      { form: "Service Request", layers: ["Origin", "Rate Limit", "Honeypot", "Sanitize", "Zod", "Business Rules"] },
                      { form: "Contact Form", layers: ["Origin", "Rate Limit", "Honeypot", "Sanitize", "Zod"] },
                      { form: "Quotation Form", layers: ["Origin", "Rate Limit", "Honeypot", "Sanitize", "Zod"] },
                    ].map((item) => (
                      <div key={item.form} className="rounded-lg border border-border p-2.5">
                        <p className="text-xs font-medium text-foreground mb-1.5">{item.form}</p>
                        <div className="flex flex-wrap gap-1">
                          {item.layers.map((layer) => (
                            <Badge key={layer} variant="outline" className="text-[10px] px-1.5 py-0">
                              {layer}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Strapi Readiness */}
          <Card className="border-accent/20">
            <CardContent className="p-4 flex items-start gap-3">
              <Zap className="h-4 w-4 text-accent mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Strapi Backend Ready</p>
                <p className="text-xs text-muted-foreground">
                  When the Strapi backend is connected, security audit results will be persisted to a <code className="text-accent">security-audit-log</code> collection type, enabling historical trend tracking, scheduled automated audits, and alert notifications when checks fail.
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
