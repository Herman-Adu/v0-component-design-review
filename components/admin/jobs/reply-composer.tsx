"use client"

/**
 * Reply Composer
 *
 * Structured email reply builder for the Request Management Hub.
 * Replaces the simple textarea with a section-based composer that
 * generates branded continuation emails.
 *
 * Features:
 * - Subject line (auto-filled with RE: original subject)
 * - Dynamic content sections with label + body
 * - Quick-insert preset templates
 * - Live HTML email preview
 * - Send via Resend or preview-only mode
 */

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Send,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Zap,
  GripVertical,
  Loader2,
  CheckCircle2,
  XCircle,
  ArrowLeft,
} from "lucide-react"
import type { Job } from "@/lib/email/services/job-management.types"
import {
  SECTION_PRESETS,
  SECTION_LABEL_OPTIONS,
  type ContentSection,
} from "@/lib/email/templates/continuation-email-html"

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ReplyComposerProps {
  job: Job
  onSend: (data: {
    subject: string
    sections: ContentSection[]
    greeting?: string
    signOff?: string
    includeContactInfo: boolean
  }) => Promise<{ success: boolean; error?: string }>
  onPreview: (data: {
    subject: string
    sections: ContentSection[]
    greeting?: string
    signOff?: string
    includeContactInfo: boolean
  }) => Promise<string>
  onCancel?: () => void
  sending?: boolean
  devMode?: boolean
  devEmail?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ReplyComposer({
  job,
  onSend,
  onPreview,
  onCancel,
  sending = false,
  devMode,
  devEmail,
}: ReplyComposerProps) {
  const firstName = job.clientName.split(" ")[0]

  const [subject, setSubject] = useState(`RE: ${job.subject}`)
  const [greeting, setGreeting] = useState(`Dear ${firstName},`)
  const [signOff, setSignOff] = useState("")
  const [includeContactInfo, setIncludeContactInfo] = useState(true)
  const [sections, setSections] = useState<(ContentSection & { id: string })[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [previewHtml, setPreviewHtml] = useState("")
  const [loadingPreview, setLoadingPreview] = useState(false)
  const [showPresets, setShowPresets] = useState(false)
  const [sendResult, setSendResult] = useState<{ success: boolean; error?: string } | null>(null)

  // Filter presets for this form type
  const availablePresets = SECTION_PRESETS.filter((p) =>
    p.formTypes.includes(job.formType)
  )

  // Add a blank section
  const addSection = useCallback(() => {
    setSections((prev) => [
      ...prev,
      { id: `s_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, label: "Update", content: "" },
    ])
    setShowPreview(false)
    setSendResult(null)
  }, [])

  // Add from preset
  const addPreset = useCallback((presetId: string) => {
    const preset = SECTION_PRESETS.find((p) => p.id === presetId)
    if (!preset) return
    setSections((prev) => [
      ...prev,
      {
        id: `s_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        label: preset.sectionLabel,
        content: preset.content,
      },
    ])
    setShowPresets(false)
    setShowPreview(false)
    setSendResult(null)
  }, [])

  // Update section
  const updateSection = useCallback((id: string, field: "label" | "content", value: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    )
    setShowPreview(false)
    setSendResult(null)
  }, [])

  // Remove section
  const removeSection = useCallback((id: string) => {
    setSections((prev) => prev.filter((s) => s.id !== id))
    setShowPreview(false)
    setSendResult(null)
  }, [])

  // Move section up/down
  const moveSection = useCallback((id: string, direction: "up" | "down") => {
    setSections((prev) => {
      const idx = prev.findIndex((s) => s.id === id)
      if (idx === -1) return prev
      if (direction === "up" && idx === 0) return prev
      if (direction === "down" && idx === prev.length - 1) return prev
      const next = [...prev]
      const swapIdx = direction === "up" ? idx - 1 : idx + 1
      const temp = next[swapIdx]
      next[swapIdx] = next[idx]
      next[idx] = temp
      return next
    })
    setShowPreview(false)
  }, [])

  // Build payload
  const buildPayload = useCallback(() => ({
    subject,
    sections: sections.map(({ label, content }) => ({ label, content })),
    greeting: greeting || undefined,
    signOff: signOff || undefined,
    includeContactInfo,
  }), [subject, sections, greeting, signOff, includeContactInfo])

  // Preview
  const handlePreview = useCallback(async () => {
    if (showPreview) {
      setShowPreview(false)
      return
    }
    setLoadingPreview(true)
    try {
      const html = await onPreview(buildPayload())
      setPreviewHtml(html)
      setShowPreview(true)
    } catch {
      setPreviewHtml("<p>Failed to generate preview</p>")
      setShowPreview(true)
    } finally {
      setLoadingPreview(false)
    }
  }, [showPreview, onPreview, buildPayload])

  // Send
  const handleSend = useCallback(async () => {
    setSendResult(null)
    const result = await onSend(buildPayload())
    setSendResult(result)
    if (result.success) {
      // Reset after short delay so user sees success
      setTimeout(() => {
        setSections([])
        setShowPreview(false)
        setSendResult(null)
        onCancel?.()
      }, 2000)
    }
  }, [onSend, buildPayload, onCancel])

  const canSend = sections.length > 0 && sections.every((s) => s.content.trim().length > 0) && !sending

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          {onCancel && (
            <Button variant="ghost" size="sm" onClick={onCancel} className="h-7 w-7 p-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <h3 className="text-sm font-semibold text-foreground">Compose Reply</h3>
          <Badge variant="outline" className="text-[10px]">
            {job.formType === "contact" ? "Contact" : job.formType === "quotation" ? "Quotation" : "Service"}
          </Badge>
        </div>
        {devMode ? (
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-muted-foreground line-through">{job.clientEmail}</span>
            <span className="text-[11px] text-amber-500 font-medium">{devEmail || "no dev email set"}</span>
          </div>
        ) : (
          <p className="text-[11px] text-muted-foreground">
            to {job.clientEmail}
          </p>
        )}
      </div>
      {devMode && (
        <div className="mx-4 -mt-1 mb-0 rounded border border-amber-500/30 bg-amber-500/5 px-3 py-1.5">
          <p className="text-[10px] text-amber-500 font-medium">
            Dev Mode -- email will be sent to {devEmail || "?"} instead of {job.clientEmail}
          </p>
        </div>
      )}

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Subject */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Subject</label>
            <Input
              value={subject}
              onChange={(e) => { setSubject(e.target.value); setSendResult(null) }}
              className="h-8 text-sm"
            />
          </div>

          {/* Greeting (collapsible) */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Greeting</label>
              <Input
                value={greeting}
                onChange={(e) => setGreeting(e.target.value)}
                className="h-8 text-sm"
                placeholder={`Dear ${firstName},`}
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Sign-off (optional)</label>
              <Input
                value={signOff}
                onChange={(e) => setSignOff(e.target.value)}
                className="h-8 text-sm"
                placeholder="The Electrical Services Team"
              />
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-muted-foreground">Content Sections ({sections.length})</label>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs gap-1"
                  onClick={() => setShowPresets(!showPresets)}
                >
                  <Zap className="h-3 w-3" />
                  Presets
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs gap-1 bg-transparent"
                  onClick={addSection}
                >
                  <Plus className="h-3 w-3" />
                  Add Section
                </Button>
              </div>
            </div>

            {/* Preset grid */}
            {showPresets && (
              <div className="grid grid-cols-2 gap-1.5 mb-3 p-3 bg-muted/40 rounded-lg border border-border">
                {availablePresets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => addPreset(preset.id)}
                    className="text-left px-3 py-2 text-xs rounded-md border border-border bg-background hover:bg-accent/10 hover:border-accent/30 transition-colors cursor-pointer"
                  >
                    <span className="font-medium text-foreground">{preset.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Sections list */}
            {sections.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-border rounded-lg bg-muted/20">
                <p className="text-xs text-muted-foreground mb-2">No content sections yet</p>
                <p className="text-[11px] text-muted-foreground/70 max-w-[200px]">
                  Add sections to build your branded reply email. Each section becomes a styled card in the email.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {sections.map((section, idx) => (
                  <div
                    key={section.id}
                    className="border border-border rounded-lg bg-background overflow-hidden"
                  >
                    {/* Section header */}
                    <div className="flex items-center gap-2 px-3 py-2 bg-muted/30 border-b border-border">
                      <GripVertical className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
                      <Select
                        value={SECTION_LABEL_OPTIONS.includes(section.label) ? section.label : "Custom"}
                        onValueChange={(val) => {
                          if (val === "Custom") return
                          updateSection(section.id, "label", val)
                        }}
                      >
                        <SelectTrigger className="h-7 text-xs flex-1 border-0 bg-transparent shadow-none px-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {SECTION_LABEL_OPTIONS.map((opt) => (
                            <SelectItem key={opt} value={opt} className="text-xs">
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {/* Custom label input when "Custom" selected */}
                      {!SECTION_LABEL_OPTIONS.includes(section.label) && section.label !== "Custom" ? null : null}
                      <div className="flex gap-0.5 shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => moveSection(section.id, "up")}
                          disabled={idx === 0}
                        >
                          <ChevronUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => moveSection(section.id, "down")}
                          disabled={idx === sections.length - 1}
                        >
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                          onClick={() => removeSection(section.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    {/* Custom label input */}
                    {section.label === "Custom" && (
                      <div className="px-3 pt-2">
                        <Input
                          value=""
                          onChange={(e) => updateSection(section.id, "label", e.target.value)}
                          placeholder="Enter custom section label..."
                          className="h-7 text-xs"
                        />
                      </div>
                    )}
                    {/* Section body */}
                    <div className="p-3">
                      <Textarea
                        value={section.content}
                        onChange={(e) => updateSection(section.id, "content", e.target.value)}
                        placeholder="Enter section content..."
                        className="min-h-[80px] text-sm resize-y border-0 shadow-none p-0 focus-visible:ring-0"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Include contact info toggle */}
          <div className="flex items-center justify-between py-2 px-3 bg-muted/30 rounded-lg">
            <span className="text-xs text-muted-foreground">Include contact information</span>
            <button
              type="button"
              onClick={() => setIncludeContactInfo(!includeContactInfo)}
              className={`relative w-8 h-4.5 rounded-full transition-colors cursor-pointer ${
                includeContactInfo ? "bg-accent" : "bg-muted-foreground/30"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full bg-background transition-transform ${
                  includeContactInfo ? "translate-x-3.5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Preview */}
          {showPreview && previewHtml && (
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="px-3 py-2 bg-muted/30 border-b border-border flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Email Preview</span>
                <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => setShowPreview(false)}>
                  Close
                </Button>
              </div>
              <div className="bg-background">
                <iframe
                  srcDoc={previewHtml}
                  className="w-full border-0"
                  style={{ height: "500px" }}
                  title="Email preview"
                  sandbox=""
                />
              </div>
            </div>
          )}

          {/* Send result */}
          {sendResult && (
            <div className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm ${
              sendResult.success
                ? "bg-green-500/10 text-green-600 border border-green-500/20"
                : "bg-destructive/10 text-destructive border border-destructive/20"
            }`}>
              {sendResult.success ? (
                <CheckCircle2 className="h-4 w-4 shrink-0" />
              ) : (
                <XCircle className="h-4 w-4 shrink-0" />
              )}
              <span className="text-xs">
                {sendResult.success
                  ? "Email sent successfully and recorded in correspondence thread."
                  : `Failed to send: ${sendResult.error}`}
              </span>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Action Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/30">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-xs gap-1.5"
          onClick={handlePreview}
          disabled={sections.length === 0 || loadingPreview}
        >
          {loadingPreview ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : showPreview ? (
            <EyeOff className="h-3.5 w-3.5" />
          ) : (
            <Eye className="h-3.5 w-3.5" />
          )}
          {showPreview ? "Hide Preview" : "Preview Email"}
        </Button>
        <Button
          size="sm"
          className="h-8 text-xs gap-1.5"
          onClick={handleSend}
          disabled={!canSend}
        >
          {sending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Send className="h-3.5 w-3.5" />
          )}
          {sending ? "Sending..." : devMode ? "Send (Dev)" : "Send Email"}
        </Button>
      </div>
    </div>
  )
}
