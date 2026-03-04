"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Moon,
  Sun,
  Copy,
  RotateCcw,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Eye,
} from "lucide-react"
import {
  getDarkModeState,
  setGlobalDarkMode,
  toggleTemplateDarkMode,
  updateDarkModeScheme,
  resetDarkModeScheme,
  applySchemeToAll,
  generateDarkModeCss,
  type DarkModeState,
  type DarkModeColorScheme,
} from "@/lib/email/services/dark-mode-templates"

// ---------------------------------------------------------------------------
// Color field metadata
// ---------------------------------------------------------------------------
const COLOR_FIELDS: { key: keyof DarkModeColorScheme; label: string; group: string }[] = [
  { key: "bgBody", label: "Body Background", group: "Backgrounds" },
  { key: "bgCard", label: "Card Background", group: "Backgrounds" },
  { key: "bgFooter", label: "Footer Background", group: "Backgrounds" },
  { key: "headerGradientStart", label: "Header Gradient Start", group: "Header" },
  { key: "headerGradientEnd", label: "Header Gradient End", group: "Header" },
  { key: "textPrimary", label: "Primary Text", group: "Text" },
  { key: "textSecondary", label: "Secondary Text", group: "Text" },
  { key: "textMuted", label: "Muted Text", group: "Text" },
  { key: "accentColor", label: "Accent / Brand", group: "Accents" },
  { key: "accentColorLight", label: "Accent Light", group: "Accents" },
  { key: "linkColor", label: "Link Color", group: "Accents" },
  { key: "borderColor", label: "Border Color", group: "Borders" },
]

const GROUPS = ["Backgrounds", "Header", "Text", "Accents", "Borders"] as const

// ---------------------------------------------------------------------------
// Inline color swatch (simpler than template page -- no popover needed)
// ---------------------------------------------------------------------------
function DarkColorSwatch({
  color,
  label,
  fieldKey,
  onChange,
}: {
  color: string
  label: string
  fieldKey: string
  onChange: (key: string, value: string) => void
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div
          className="w-8 h-8 rounded-md border border-border/60 shadow-sm"
          style={{ backgroundColor: color }}
        />
        <input
          type="color"
          value={color}
          onChange={(e) => onChange(fieldKey, e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          title={`Pick ${label} color`}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-foreground">{label}</p>
        <p className="text-[11px] font-mono text-muted-foreground">{color.toUpperCase()}</p>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function DarkModeTab() {
  const [state, setState] = useState<DarkModeState | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [cssPreview, setCssPreview] = useState<string>("")
  const [showCss, setShowCss] = useState(false)
  const [copied, setCopied] = useState(false)
  const [applying, setApplying] = useState(false)

  const fetchState = useCallback(async () => {
    const data = await getDarkModeState()
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
    const updated = await setGlobalDarkMode(enabled)
    setState(updated)
  }

  const handleTemplateToggle = async (templateId: string) => {
    await toggleTemplateDarkMode(templateId)
    await fetchState()
  }

  const handleColorChange = async (key: string, value: string) => {
    if (!selectedTemplate) return
    await updateDarkModeScheme(selectedTemplate, { [key]: value })
    await fetchState()
  }

  const handleReset = async () => {
    if (!selectedTemplate) return
    await resetDarkModeScheme(selectedTemplate)
    await fetchState()
  }

  const handleApplyToAll = async () => {
    if (!selectedTemplate) return
    setApplying(true)
    const updated = await applySchemeToAll(selectedTemplate)
    setState(updated)
    setApplying(false)
  }

  const handlePreviewCss = async () => {
    if (!selectedTemplate) return
    const css = await generateDarkModeCss(selectedTemplate)
    setCssPreview(css)
    setShowCss(true)
  }

  const handleCopyCss = () => {
    navigator.clipboard.writeText(cssPreview)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading || !state) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Global Toggle */}
      <Card className="border-accent/20">
        <CardContent className="flex items-center justify-between p-5">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 border border-accent/20">
              <Moon className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">Global Dark Mode</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {state.globalEnabled
                  ? "Dark mode CSS will be injected into all enabled templates"
                  : "Dark mode is disabled globally -- no CSS will be injected"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Sun className="h-4 w-4 text-muted-foreground" />
            <Switch
              checked={state.globalEnabled}
              onCheckedChange={handleGlobalToggle}
              aria-label="Toggle global dark mode"
            />
            <Moon className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      {!state.globalEnabled && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />
            <p className="text-sm text-amber-400">
              Dark mode is globally disabled. Enable it above to configure per-template schemes.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Per-template toggles */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Per-Template Dark Mode</CardTitle>
          <CardDescription>
            Enable or disable dark mode individually for each email template
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {state.configs.map((config) => (
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
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      config.enabled && state.globalEnabled ? "bg-green-500" : "bg-muted-foreground/30"
                    }`}
                  />
                  <span className="text-sm text-foreground">{config.templateLabel}</span>
                </div>
                <Switch
                  checked={config.enabled}
                  onCheckedChange={() => handleTemplateToggle(config.templateId)}
                  disabled={!state.globalEnabled}
                  aria-label={`Toggle dark mode for ${config.templateLabel}`}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Color scheme editor for selected template */}
      {selectedConfig && state.globalEnabled && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">
                  Dark Mode Colors: {selectedConfig.templateLabel}
                </CardTitle>
                <CardDescription>
                  Configure the dark mode color scheme for this template
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent"
                  onClick={handleReset}
                >
                  <RotateCcw className="mr-2 h-3 w-3" />
                  Reset
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent"
                  onClick={handleApplyToAll}
                  disabled={applying}
                >
                  {applying ? (
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  ) : (
                    <Copy className="mr-2 h-3 w-3" />
                  )}
                  Apply to All
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 lg:grid-cols-2">
              {GROUPS.map((group) => {
                const fields = COLOR_FIELDS.filter((f) => f.group === group)
                return (
                  <div key={group} className="space-y-3">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {group}
                    </h4>
                    <div className="space-y-3">
                      {fields.map((field) => (
                        <DarkColorSwatch
                          key={field.key}
                          color={selectedConfig.scheme[field.key]}
                          label={field.label}
                          fieldKey={field.key}
                          onChange={handleColorChange}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Live dark mode preview */}
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-3">
                <Eye className="h-4 w-4 text-accent" />
                <p className="text-sm font-medium text-foreground">Dark Mode Preview</p>
              </div>
              <div
                className="rounded-lg overflow-hidden border border-border shadow-lg max-w-lg mx-auto"
                style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}
              >
                {/* Header */}
                <div
                  style={{
                    background: `linear-gradient(135deg, ${selectedConfig.scheme.headerGradientStart} 0%, ${selectedConfig.scheme.headerGradientEnd} 100%)`,
                    padding: "24px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      display: "inline-block",
                      background: selectedConfig.scheme.accentColor,
                      width: "40px",
                      height: "40px",
                      borderRadius: "8px",
                      lineHeight: "40px",
                      fontSize: "20px",
                      marginBottom: "8px",
                    }}
                  >
                    {"⚡"}
                  </div>
                  <h2 style={{ margin: 0, color: selectedConfig.scheme.textPrimary, fontSize: "18px", fontWeight: 700 }}>
                    Electrical Services
                  </h2>
                  <p style={{ margin: "4px 0 0", color: selectedConfig.scheme.accentColorLight, fontSize: "12px" }}>
                    Professional & Reliable
                  </p>
                </div>
                {/* Body */}
                <div style={{ padding: "20px", backgroundColor: selectedConfig.scheme.bgCard }}>
                  <p style={{ margin: "0 0 12px", color: selectedConfig.scheme.textPrimary, fontSize: "14px", fontWeight: 600 }}>
                    Dear Customer,
                  </p>
                  <p style={{ margin: 0, color: selectedConfig.scheme.textSecondary, fontSize: "13px", lineHeight: 1.6 }}>
                    Thank you for contacting us. This is how your email template will appear in dark mode on supported clients.
                  </p>
                  <div style={{ margin: "16px 0", padding: "12px", backgroundColor: selectedConfig.scheme.bgBody, borderRadius: "8px", border: `1px solid ${selectedConfig.scheme.borderColor}` }}>
                    <p style={{ margin: 0, color: selectedConfig.scheme.textMuted, fontSize: "12px" }}>
                      Reference: <span style={{ color: selectedConfig.scheme.accentColor, fontWeight: 600 }}>SR-0001</span>
                    </p>
                  </div>
                  <a style={{ color: selectedConfig.scheme.linkColor, fontSize: "13px", textDecoration: "underline" }} href="#preview">
                    View your request online
                  </a>
                </div>
                {/* Footer */}
                <div
                  style={{
                    padding: "16px 20px",
                    backgroundColor: selectedConfig.scheme.bgFooter,
                    borderTop: `1px solid ${selectedConfig.scheme.borderColor}`,
                    textAlign: "center",
                  }}
                >
                  <p style={{ margin: 0, color: selectedConfig.scheme.textMuted, fontSize: "11px" }}>
                    Electrical Services Ltd | 123 Electrical House, London EC1A 1BB
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generated CSS preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Code2 className="h-5 w-5 text-accent" />
              <div>
                <CardTitle className="text-base">Generated CSS</CardTitle>
                <CardDescription>
                  The <code className="text-xs font-mono text-accent">@media (prefers-color-scheme: dark)</code> block auto-injected into template HTML
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent"
                onClick={handlePreviewCss}
                disabled={!selectedTemplate}
              >
                <Code2 className="mr-2 h-3 w-3" />
                Generate
              </Button>
              {showCss && cssPreview && (
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent"
                  onClick={handleCopyCss}
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="mr-2 h-3 w-3 text-green-400" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-3 w-3" />
                      Copy CSS
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        {showCss && (
          <CardContent>
            {cssPreview ? (
              <pre className="p-4 rounded-lg bg-muted/50 border border-border text-xs font-mono text-foreground overflow-x-auto leading-relaxed">
                {cssPreview}
              </pre>
            ) : (
              <div className="flex items-center gap-2 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
                <p className="text-xs text-amber-400">
                  No CSS generated. Dark mode may be disabled globally or for this template.
                </p>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Info card */}
      <Card className="border-border/50">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <Badge className="bg-accent/20 text-accent border-0 shrink-0 mt-0.5">Info</Badge>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p className="leading-relaxed">
                Dark mode CSS is injected as a <code className="font-mono text-accent">{"<style>"}</code> block inside each email template during rendering.
                Email clients that support <code className="font-mono text-accent">prefers-color-scheme</code> (Apple Mail, Outlook.com, Hey, etc.)
                will automatically apply these styles. Other clients gracefully fall back to the light theme.
              </p>
              <p className="leading-relaxed">
                Use "Apply to All" to quickly propagate a colour scheme across all 6 templates,
                then fine-tune individual templates that need different treatments (e.g., emergency service request templates
                may keep their red header gradients).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
