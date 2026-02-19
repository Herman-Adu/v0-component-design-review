"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Settings,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Send,
  Shield,
  Globe,
  Key,
  Mail,
  Building2,
  ArrowRight,
  Loader2,
  Copy,
  ExternalLink,
  Clock,
  Server,
  Zap,
} from "lucide-react"
import { getEmailHealthReport, sendTestEmail } from "@/lib/actions/email-admin"
import type { EmailHealthReport, TestSendResult } from "@/lib/actions/action.types"
import AttachmentConfigSection from "@/components/admin/attachment-config-section"

// ---------------------------------------------------------------------------
// Status indicator component
// ---------------------------------------------------------------------------
function StatusDot({ status }: { status: "ok" | "warn" | "error" }) {
  const colors = {
    ok: "bg-green-500",
    warn: "bg-amber-500",
    error: "bg-red-500",
  }
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${colors[status]}`} />
      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${colors[status]}`} />
    </span>
  )
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
export default function SendConfigurationPage() {
  const [report, setReport] = useState<EmailHealthReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [testEmail, setTestEmail] = useState("")
  const [testResult, setTestResult] = useState<TestSendResult | null>(null)
  const [sending, setSending] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const fetchReport = useCallback(async () => {
    try {
      const data = await getEmailHealthReport()
      setReport(data)
    } catch {
      // Health check failed silently
    }
  }, [])

  useEffect(() => {
    setLoading(true)
    fetchReport().finally(() => setLoading(false))
  }, [fetchReport])

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchReport()
    setRefreshing(false)
  }

  const handleTestSend = async () => {
    if (!testEmail) return
    setSending(true)
    setTestResult(null)
    try {
      const result = await sendTestEmail(testEmail)
      setTestResult(result)
    } catch {
      setTestResult({ success: false, error: "Unexpected error" })
    }
    setSending(false)
  }

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  // Computed values from report
  const requiredVars = report?.envVars.filter((v) => v.required) || []
  const optionalVars = report?.envVars.filter((v) => !v.required) || []
  const requiredSet = requiredVars.filter((v) => v.isSet).length
  const totalRequired = requiredVars.length
  const allRequiredSet = requiredSet === totalRequired
  const overallStatus = !report
    ? "loading"
    : report.resend.connected && allRequiredSet
      ? "healthy"
      : allRequiredSet
        ? "degraded"
        : "critical"

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
          <p className="text-sm text-muted-foreground">Checking email system health...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 border border-accent/20">
              <Settings className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Send Configuration</h1>
              <p className="text-muted-foreground">
                Manage Resend integration, from-addresses, and delivery settings
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge
              className={`border-0 ${
                overallStatus === "healthy"
                  ? "bg-green-500/20 text-green-400"
                  : overallStatus === "degraded"
                    ? "bg-amber-500/20 text-amber-400"
                    : "bg-red-500/20 text-red-400"
              }`}
            >
              {overallStatus === "healthy" ? "All Systems Healthy" : overallStatus === "degraded" ? "Partially Configured" : "Configuration Required"}
            </Badge>
            <Badge variant="outline">Resend API</Badge>
            <Badge variant="outline">{report?.envVars.length || 0} Environment Variables</Badge>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing} className="bg-transparent">
          <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Overall Health Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Resend Connection */}
        <Card className={`border-${report?.resend.connected ? "green" : "red"}-500/30`}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Resend API</span>
              </div>
              <StatusDot status={report?.resend.connected ? "ok" : "error"} />
            </div>
            <p className="text-2xl font-bold text-foreground mb-1">
              {report?.resend.connected ? "Connected" : "Disconnected"}
            </p>
            <p className="text-xs text-muted-foreground">
              {report?.resend.connected
                ? report.resend.domainVerified
                  ? "Domain verified -- production ready"
                  : "Connected -- domain verification pending"
                : report?.resend.error || "API key not configured"}
            </p>
          </CardContent>
        </Card>

        {/* Env Vars */}
        <Card className={`border-${allRequiredSet ? "green" : "amber"}-500/30`}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Environment Variables</span>
              </div>
              <StatusDot status={allRequiredSet ? "ok" : "warn"} />
            </div>
            <p className="text-2xl font-bold text-foreground mb-1">
              {requiredSet}/{totalRequired} Required
            </p>
            <p className="text-xs text-muted-foreground">
              {allRequiredSet
                ? `All required vars set. ${optionalVars.filter((v) => v.isSet).length}/${optionalVars.length} optional configured`
                : `${totalRequired - requiredSet} required variable(s) missing`}
            </p>
          </CardContent>
        </Card>

        {/* Templates */}
        <Card className="border-green-500/30">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Templates</span>
              </div>
              <StatusDot status="ok" />
            </div>
            <p className="text-2xl font-bold text-foreground mb-1">6 Active</p>
            <p className="text-xs text-muted-foreground">
              3 form types x 2 templates (customer + business)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Environment Variables Detail */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-accent" />
              <div>
                <CardTitle className="text-lg">Environment Variables</CardTitle>
                <CardDescription>Required and optional variables for email delivery</CardDescription>
              </div>
            </div>
            <Button variant="outline" size="sm" asChild className="bg-transparent">
              <Link href="https://resend.com/api-keys" target="_blank" rel="noopener noreferrer">
                Resend Dashboard
                <ExternalLink className="ml-2 h-3 w-3" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Required Variables */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Zap className="h-3.5 w-3.5 text-red-400" />
              Required
            </h3>
            <div className="space-y-2">
              {requiredVars.map((v) => (
                <div
                  key={v.key}
                  className={`flex items-center gap-4 p-4 rounded-lg border ${
                    v.isSet ? "border-green-500/20 bg-green-500/5" : "border-red-500/20 bg-red-500/5"
                  }`}
                >
                  <div className="shrink-0">
                    {v.isSet ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono font-semibold text-foreground">{v.key}</code>
                      <button
                        type="button"
                        onClick={() => handleCopy(v.key, v.key)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        title="Copy variable name"
                      >
                        {copied === v.key ? (
                          <CheckCircle2 className="h-3 w-3 text-green-400" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{v.description}</p>
                  </div>
                  <div className="text-right shrink-0 flex items-center gap-2">
                    {v.secret && v.isSet && (
                      <span title="Secret -- value hidden"><Shield className="h-3.5 w-3.5 text-amber-400" /></span>
                    )}
                    {v.isSet ? (
                      <code className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                        {v.secret ? `${v.preview.slice(0, 3)}${"*".repeat(16)}` : v.preview}
                      </code>
                    ) : (
                      <Badge className="bg-red-500/20 text-red-400 border-0 text-xs">Missing</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Optional Variables */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Settings className="h-3.5 w-3.5 text-muted-foreground" />
              Optional Overrides
            </h3>
            <div className="space-y-2">
              {optionalVars.map((v) => (
                <div
                  key={v.key}
                  className={`flex items-center gap-4 p-4 rounded-lg border ${
                    v.isSet ? "border-green-500/20 bg-green-500/5" : "border-border bg-muted/30"
                  }`}
                >
                  <div className="shrink-0">
                    {v.isSet ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono font-semibold text-foreground">{v.key}</code>
                      <button
                        type="button"
                        onClick={() => handleCopy(v.key, v.key)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        title="Copy variable name"
                      >
                        {copied === v.key ? (
                          <CheckCircle2 className="h-3 w-3 text-green-400" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {v.description}
                      {!v.isSet && v.fallback && (
                        <span className="text-muted-foreground/70"> -- Falls back to <code className="font-mono text-xs">{v.fallback}</code></span>
                      )}
                    </p>
                  </div>
                  <div className="text-right shrink-0 flex items-center gap-2">
                    {v.secret && v.isSet && (
                      <span title="Secret -- value hidden"><Shield className="h-3.5 w-3.5 text-amber-400" /></span>
                    )}
                    {v.isSet ? (
                      <code className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                        {v.secret ? `${v.preview.slice(0, 3)}${"*".repeat(16)}` : v.preview}
                      </code>
                    ) : (
                      <Badge variant="outline" className="text-xs">Using Fallback</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* From-Address Routing */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Server className="h-5 w-5 text-accent" />
            <div>
              <CardTitle className="text-lg">From-Address Routing</CardTitle>
              <CardDescription>How sender addresses are resolved per template type</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                type: "Service Request",
                envVar: "EMAIL_FROM",
                icon: Send,
                fallback: "noreply@electricalservices.com",
                description: "Customer confirmations and business notifications for service requests",
              },
              {
                type: "Contact Inquiry",
                envVar: "EMAIL_CONTACT_FROM",
                icon: Mail,
                fallback: "EMAIL_FROM",
                description: "Contact form confirmations and inquiry notifications",
              },
              {
                type: "Quotation Request",
                envVar: "EMAIL_QUOTATION_FROM",
                icon: Building2,
                fallback: "EMAIL_FROM",
                description: "Quotation request confirmations and business alerts",
              },
            ].map((route) => {
              const envVar = report?.envVars.find((v) => v.key === route.envVar)
              const isSet = envVar?.isSet || false
              return (
                <div key={route.type} className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card">
                  <div className="flex items-center justify-center w-9 h-9 rounded-md bg-accent/10 shrink-0">
                    <route.icon className="h-4 w-4 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{route.type}</p>
                    <p className="text-xs text-muted-foreground">{route.description}</p>
                  </div>
                  <div className="text-right shrink-0 space-y-1">
                    <code className="text-xs font-mono text-foreground">{route.envVar}</code>
                    <p className="text-[10px] text-muted-foreground">
                      {isSet ? (
                        <span className="text-green-400">Configured</span>
                      ) : (
                        <span>Falls back to <code className="font-mono">{route.fallback}</code></span>
                      )}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Test Send */}
      <Card className="border-accent/30">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Send className="h-5 w-5 text-accent" />
            <div>
              <CardTitle className="text-lg">Test Email Delivery</CardTitle>
              <CardDescription>Send a test email to verify end-to-end delivery is working</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <Label htmlFor="test-email" className="sr-only">Test email address</Label>
              <Input
                id="test-email"
                type="email"
                placeholder="admin@yourcompany.com"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleTestSend()}
                disabled={sending || !report?.resend.connected}
              />
            </div>
            <Button
              onClick={handleTestSend}
              disabled={sending || !testEmail || !report?.resend.connected}
            >
              {sending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Test
                </>
              )}
            </Button>
          </div>

          {!report?.resend.connected && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
              <p className="text-xs text-amber-400">
                Resend is not connected. Configure RESEND_API_KEY to enable test sends.
              </p>
            </div>
          )}

          {testResult && (
            <div
              className={`flex items-start gap-3 p-4 rounded-lg border ${
                testResult.success
                  ? "border-green-500/20 bg-green-500/5"
                  : "border-red-500/20 bg-red-500/5"
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              )}
              <div>
                <p className={`text-sm font-medium ${testResult.success ? "text-green-400" : "text-red-400"}`}>
                  {testResult.success ? "Test email sent successfully" : "Failed to send test email"}
                </p>
                {testResult.success && testResult.messageId && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Message ID: <code className="font-mono">{testResult.messageId}</code>
                  </p>
                )}
                {testResult.error && (
                  <p className="text-xs text-red-400/80 mt-1">{testResult.error}</p>
                )}
              </div>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Sends a branded test email using your configured from-address. Check your inbox and spam folder.
          </p>
        </CardContent>
      </Card>

      {/* Attachment Configuration */}
      <AttachmentConfigSection />

      {/* Service Architecture */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-accent" />
            <div>
              <CardTitle className="text-lg">Email Service Architecture</CardTitle>
              <CardDescription>How emails flow from form submission to delivery</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { step: "1", label: "Form Submission", detail: "User submits a service, contact, or quotation form", icon: Building2 },
              { step: "2", label: "Server Action", detail: "Validates data, generates request ID, triggers email service", icon: Server },
              { step: "3", label: "Template Render", detail: "HTML generated from template + centralised brand config", icon: Mail },
              { step: "4", label: "Resend Delivery", detail: "Emails sent via Resend API to customer + business", icon: Send },
            ].map((s) => (
              <div key={s.step} className="relative flex flex-col items-center text-center p-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/10 border border-accent/20 mb-3">
                  <span className="text-sm font-bold text-accent">{s.step}</span>
                </div>
                <p className="text-sm font-medium text-foreground mb-1">{s.label}</p>
                <p className="text-xs text-muted-foreground">{s.detail}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" size="sm" asChild className="bg-transparent">
          <Link href="/dashboard/admin/email-administration/configuration/email-preview">
            <Mail className="mr-2 h-4 w-4" />
            Email Preview
            <ArrowRight className="ml-2 h-3 w-3" />
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild className="bg-transparent">
          <Link href="/dashboard/admin/email-administration/configuration/template-and-brand">
            <Settings className="mr-2 h-4 w-4" />
            Template Management
            <ArrowRight className="ml-2 h-3 w-3" />
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild className="bg-transparent">
          <Link href="/dashboard/admin/email-administration/infrastructure">
            <ArrowRight className="mr-2 h-4 w-4" />
            Infrastructure
          </Link>
        </Button>
      </div>

      {/* Last checked */}
      {report && (
        <p className="text-xs text-muted-foreground text-right">
          Last checked: {new Date(report.timestamp).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" })}
        </p>
      )}
    </div>
  )
}
