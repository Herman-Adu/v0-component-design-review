"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Paperclip,
  FileText,
  ImageIcon,
  File,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Plus,
  HardDrive,
  Zap,
  Shield,
} from "lucide-react"
import {
  getAttachmentState,
  setGlobalAttachments,
  setGlobalMaxSize,
  toggleTemplateAttachments,
  updateAttachmentType,
  removeAttachmentType,
  addAttachmentType,
  type AttachmentState,
  type AttachmentType,
} from "@/lib/email/services/email-attachments"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function getMimeLabel(mime: string): string {
  const labels: Record<string, string> = {
    "application/pdf": "PDF",
    "image/jpeg": "JPEG",
    "image/png": "PNG",
    "image/webp": "WebP",
    "application/msword": "DOC",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
  }
  return labels[mime] || mime
}

function getMimeIcon(mimeTypes: string[]) {
  if (mimeTypes.every((m) => m.startsWith("image/"))) return ImageIcon
  if (mimeTypes.includes("application/pdf")) return FileText
  return File
}

// ---------------------------------------------------------------------------
// Attachment row component
// ---------------------------------------------------------------------------
function AttachmentRow({
  attachment,
  templateId,
  onUpdate,
  onRemove,
}: {
  attachment: AttachmentType
  templateId: string
  onUpdate: () => void
  onRemove: () => void
}) {
  const [editing, setEditing] = useState(false)
  const [maxSize, setMaxSize] = useState(attachment.maxSizeMb.toString())
  const Icon = getMimeIcon(attachment.mimeTypes)

  const handleSaveSize = async () => {
    const val = Number.parseFloat(maxSize)
    if (Number.isNaN(val) || val <= 0) {
      setMaxSize(attachment.maxSizeMb.toString())
      setEditing(false)
      return
    }
    await updateAttachmentType(templateId, attachment.id, { maxSizeMb: val })
    setEditing(false)
    onUpdate()
  }

  const handleToggleRequired = async () => {
    await updateAttachmentType(templateId, attachment.id, { required: !attachment.required })
    onUpdate()
  }

  const handleToggleAutoGenerate = async () => {
    await updateAttachmentType(templateId, attachment.id, { autoGenerate: !attachment.autoGenerate })
    onUpdate()
  }

  const handleRemove = async () => {
    await removeAttachmentType(templateId, attachment.id)
    onRemove()
  }

  return (
    <div className="p-4 rounded-lg border border-border bg-card space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-md bg-accent/10 shrink-0 mt-0.5">
            <Icon className="h-4 w-4 text-accent" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{attachment.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{attachment.description}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-red-400 shrink-0"
          onClick={handleRemove}
          title="Remove attachment type"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {/* Accepted formats */}
        <div>
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Formats</p>
          <div className="flex flex-wrap gap-1">
            {attachment.mimeTypes.map((mime) => (
              <Badge key={mime} variant="outline" className="text-[10px] py-0 px-1.5">
                {getMimeLabel(mime)}
              </Badge>
            ))}
          </div>
        </div>

        {/* Max size */}
        <div>
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Max Size</p>
          {editing ? (
            <div className="flex items-center gap-1.5">
              <Input
                value={maxSize}
                onChange={(e) => setMaxSize(e.target.value)}
                className="h-6 text-xs w-16 px-1.5"
                onKeyDown={(e) => e.key === "Enter" && handleSaveSize()}
                onBlur={handleSaveSize}
                autoFocus
              />
              <span className="text-xs text-muted-foreground">MB</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="text-xs text-foreground font-mono hover:text-accent transition-colors cursor-pointer"
            >
              {attachment.maxSizeMb} MB
            </button>
          )}
        </div>

        {/* Flags */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Switch
              checked={attachment.required}
              onCheckedChange={handleToggleRequired}
              className="scale-75"
              aria-label="Required attachment"
            />
            <span className="text-[10px] text-muted-foreground">Required</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Switch
              checked={attachment.autoGenerate}
              onCheckedChange={handleToggleAutoGenerate}
              className="scale-75"
              aria-label="Auto-generate"
            />
            <span className="text-[10px] text-muted-foreground">Auto</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Add new attachment form
// ---------------------------------------------------------------------------
function AddAttachmentForm({
  templateId,
  onAdded,
}: {
  templateId: string
  onAdded: () => void
}) {
  const [show, setShow] = useState(false)
  const [label, setLabel] = useState("")
  const [description, setDescription] = useState("")
  const [maxSize, setMaxSize] = useState("5")
  const [saving, setSaving] = useState(false)

  const handleSubmit = async () => {
    if (!label.trim()) return
    setSaving(true)
    await addAttachmentType(templateId, {
      label: label.trim(),
      description: description.trim() || `Custom attachment for ${label.trim()}`,
      mimeTypes: ["application/pdf"],
      maxSizeMb: Math.max(1, Number.parseFloat(maxSize) || 5),
      required: false,
      autoGenerate: false,
    })
    setLabel("")
    setDescription("")
    setMaxSize("5")
    setShow(false)
    setSaving(false)
    onAdded()
  }

  if (!show) {
    return (
      <Button variant="outline" size="sm" className="bg-transparent w-full" onClick={() => setShow(true)}>
        <Plus className="mr-2 h-3 w-3" />
        Add Attachment Type
      </Button>
    )
  }

  return (
    <div className="p-4 rounded-lg border border-dashed border-accent/30 bg-accent/5 space-y-3">
      <div className="grid gap-3 md:grid-cols-3">
        <div className="space-y-1">
          <Label className="text-xs">Label</Label>
          <Input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. Invoice PDF"
            className="h-8 text-xs"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Description</Label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description..."
            className="h-8 text-xs"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Max Size (MB)</Label>
          <Input
            value={maxSize}
            onChange={(e) => setMaxSize(e.target.value)}
            placeholder="5"
            className="h-8 text-xs"
            type="number"
            min={1}
            max={50}
          />
        </div>
      </div>
      <div className="flex items-center justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={() => setShow(false)}>
          Cancel
        </Button>
        <Button size="sm" onClick={handleSubmit} disabled={!label.trim() || saving}>
          {saving ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <Plus className="mr-2 h-3 w-3" />}
          Add
        </Button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main section component
// ---------------------------------------------------------------------------
export default function AttachmentConfigSection() {
  const [state, setState] = useState<AttachmentState | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [editingGlobalSize, setEditingGlobalSize] = useState(false)
  const [globalSizeInput, setGlobalSizeInput] = useState("")

  const fetchState = useCallback(async () => {
    const data = await getAttachmentState()
    setState(data)
    if (!selectedTemplate && data.configs.length > 0) {
      setSelectedTemplate(data.configs[0].templateId)
    }
  }, [selectedTemplate])

  useEffect(() => {
    setLoading(true)
    fetchState().finally(() => setLoading(false))
  }, [fetchState])

  const selectedConfig = state?.configs.find((c) => c.templateId === selectedTemplate)

  const handleGlobalToggle = async (enabled: boolean) => {
    const updated = await setGlobalAttachments(enabled)
    setState(updated)
  }

  const handleGlobalMaxSize = async () => {
    const val = Number.parseFloat(globalSizeInput)
    if (!Number.isNaN(val) && val > 0) {
      const updated = await setGlobalMaxSize(val)
      setState(updated)
    }
    setEditingGlobalSize(false)
  }

  const handleTemplateToggle = async (templateId: string) => {
    await toggleTemplateAttachments(templateId)
    await fetchState()
  }

  if (loading || !state) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
      </div>
    )
  }

  const enabledCount = state.configs.filter((c) => c.enabled).length
  const totalAttachmentTypes = state.configs.reduce((sum, c) => sum + c.attachments.length, 0)
  const autoGenCount = state.configs.reduce(
    (sum, c) => sum + c.attachments.filter((a) => a.autoGenerate).length,
    0
  )

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <Card className="border-accent/20">
        <CardContent className="flex items-center justify-between p-5">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 border border-accent/20">
              <Paperclip className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">Attachment Configuration</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Configure auto-attached files per template -- PDF quotes, service agreements, safety guides
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              {state.globalEnabled ? "Active" : "Disabled"}
            </span>
            <Switch
              checked={state.globalEnabled}
              onCheckedChange={handleGlobalToggle}
              aria-label="Toggle global attachments"
            />
          </div>
        </CardContent>
      </Card>

      {!state.globalEnabled && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />
            <p className="text-sm text-amber-400">
              Attachments are globally disabled. No files will be attached to outgoing emails.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Stats row */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Paperclip className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Templates</span>
            </div>
            <p className="text-xl font-bold text-foreground">{enabledCount}/{state.configs.length}</p>
            <p className="text-[10px] text-muted-foreground">with attachments enabled</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Types</span>
            </div>
            <p className="text-xl font-bold text-foreground">{totalAttachmentTypes}</p>
            <p className="text-[10px] text-muted-foreground">attachment types configured</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Auto-Gen</span>
            </div>
            <p className="text-xl font-bold text-foreground">{autoGenCount}</p>
            <p className="text-[10px] text-muted-foreground">auto-generated attachments</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <HardDrive className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Max Size</span>
            </div>
            {editingGlobalSize ? (
              <div className="flex items-center gap-1.5">
                <Input
                  value={globalSizeInput}
                  onChange={(e) => setGlobalSizeInput(e.target.value)}
                  className="h-7 text-sm w-16 px-1.5 font-bold"
                  onKeyDown={(e) => e.key === "Enter" && handleGlobalMaxSize()}
                  onBlur={handleGlobalMaxSize}
                  autoFocus
                  type="number"
                  min={1}
                  max={50}
                />
                <span className="text-sm text-muted-foreground">MB</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setGlobalSizeInput(state.globalMaxSizeMb.toString())
                  setEditingGlobalSize(true)
                }}
                className="text-xl font-bold text-foreground hover:text-accent transition-colors cursor-pointer"
              >
                {state.globalMaxSizeMb} MB
              </button>
            )}
            <p className="text-[10px] text-muted-foreground">global limit per email</p>
          </CardContent>
        </Card>
      </div>

      {/* Per-template selector */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Per-Template Attachments</CardTitle>
          <CardDescription>Select a template to configure its attachment types, file size limits, and auto-generation settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {state.configs.map((config) => {
              const attachCount = config.attachments.length
              return (
                <div
                  key={config.templateId}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedTemplate(config.templateId)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelectedTemplate(config.templateId) } }}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-colors text-left cursor-pointer ${
                    selectedTemplate === config.templateId
                      ? "border-accent/50 bg-accent/5"
                      : "border-border hover:border-border/80 hover:bg-muted/30"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${config.enabled && state.globalEnabled ? "bg-green-500" : "bg-muted-foreground/30"}`} />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{config.templateLabel}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {attachCount} type{attachCount !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={config.enabled}
                    onCheckedChange={() => handleTemplateToggle(config.templateId)}
                    disabled={!state.globalEnabled}
                    className="scale-75 shrink-0"
                    aria-label={`Toggle attachments for ${config.templateLabel}`}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Attachment types for selected template */}
      {selectedConfig && state.globalEnabled && selectedConfig.enabled && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">{selectedConfig.templateLabel}</CardTitle>
                <CardDescription>
                  {selectedConfig.attachments.length} attachment type{selectedConfig.attachments.length !== 1 ? "s" : ""} configured
                  {" "} -- max {selectedConfig.maxAttachments} per email
                </CardDescription>
              </div>
              <Badge
                className={`border-0 ${
                  selectedConfig.enabled ? "bg-green-500/20 text-green-400" : "bg-muted text-muted-foreground"
                }`}
              >
                {selectedConfig.enabled ? "Active" : "Disabled"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedConfig.attachments.length === 0 ? (
              <div className="flex items-center gap-3 p-6 rounded-lg border border-dashed border-border text-center justify-center">
                <Paperclip className="h-5 w-5 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No attachment types configured for this template</p>
              </div>
            ) : (
              selectedConfig.attachments.map((attachment) => (
                <AttachmentRow
                  key={attachment.id}
                  attachment={attachment}
                  templateId={selectedConfig.templateId}
                  onUpdate={fetchState}
                  onRemove={fetchState}
                />
              ))
            )}

            <AddAttachmentForm
              templateId={selectedConfig.templateId}
              onAdded={fetchState}
            />
          </CardContent>
        </Card>
      )}

      {/* Security note */}
      <Card className="border-border/50">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <Shield className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div className="space-y-2 text-xs text-muted-foreground">
              <p className="font-medium text-foreground text-sm">Attachment Security</p>
              <p className="leading-relaxed">
                All attachment file types are validated server-side via MIME type checking. File sizes are enforced at both the per-attachment
                and global-per-email levels. Auto-generated attachments (PDF quotes, service agreements) are created server-side and never
                pass through client-side upload pipelines.
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline" className="text-[10px]">
                  <CheckCircle2 className="mr-1 h-2.5 w-2.5 text-green-500" />
                  MIME Validation
                </Badge>
                <Badge variant="outline" className="text-[10px]">
                  <CheckCircle2 className="mr-1 h-2.5 w-2.5 text-green-500" />
                  Size Limits
                </Badge>
                <Badge variant="outline" className="text-[10px]">
                  <CheckCircle2 className="mr-1 h-2.5 w-2.5 text-green-500" />
                  Server-Side Generation
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
