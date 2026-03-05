"use client"

import React from "react"

import { useState, useCallback, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Building2,
  Palette,
  Clock,
  FileText,
  Save,
  RotateCcw,
  Info,
  Database,
  Mail,
  Eye,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Settings2,
  Moon,
} from "lucide-react"
import Link from "next/link"
import {
  COMPANY,
  BRAND_COLORS,
  URGENCY_COLORS,
  SLA,
  TEMPLATE_CONFIG,
} from "@/lib/email/config/email-config"
import DarkModeTab from "@/components/admin/dark-mode-tab"

// ---------------------------------------------------------------------------
// Types for editable state
// ---------------------------------------------------------------------------
interface CompanyState {
  name: string
  tagline: string
  legalName: string
  addressLine1: string
  city: string
  postcode: string
  phonePrimary: string
  phoneLocal: string
  emailSupport: string
  emailInfo: string
  emailNoreply: string
  website: string
}

interface ColorsState {
  primary: string
  primaryLight: string
  primaryDark: string
  headerGradientStart: string
  headerGradientEnd: string
  bgBody: string
  bgCard: string
  textDark: string
  textMuted: string
  textLight: string
}

interface UrgencyColorsState {
  routine: { gradientStart: string; gradientEnd: string; badgeBg: string; badgeText: string }
  urgent: { gradientStart: string; gradientEnd: string; badgeBg: string; badgeText: string }
  emergency: { gradientStart: string; gradientEnd: string; badgeBg: string; badgeText: string }
}

interface SLAState {
  serviceRoutine: string
  serviceUrgent: string
  serviceEmergency: string
  contactResponse: string
  quotationResponse: string
}

// ---------------------------------------------------------------------------
// Defaults from config
// ---------------------------------------------------------------------------
const defaultCompany: CompanyState = {
  name: COMPANY.name,
  tagline: COMPANY.tagline,
  legalName: COMPANY.legalName,
  addressLine1: COMPANY.address.line1,
  city: COMPANY.address.city,
  postcode: COMPANY.address.postcode,
  phonePrimary: COMPANY.phone.primary,
  phoneLocal: COMPANY.phone.local,
  emailSupport: COMPANY.email.support,
  emailInfo: COMPANY.email.info,
  emailNoreply: COMPANY.email.noreply,
  website: COMPANY.website,
}

const defaultColors: ColorsState = {
  primary: BRAND_COLORS.primary,
  primaryLight: BRAND_COLORS.primaryLight,
  primaryDark: BRAND_COLORS.primaryDark,
  headerGradientStart: BRAND_COLORS.headerGradient.start,
  headerGradientEnd: BRAND_COLORS.headerGradient.end,
  bgBody: BRAND_COLORS.bgBody,
  bgCard: BRAND_COLORS.bgCard,
  textDark: BRAND_COLORS.textDark,
  textMuted: BRAND_COLORS.textMuted,
  textLight: BRAND_COLORS.textLight,
}

const defaultUrgencyColors: UrgencyColorsState = {
  routine: {
    gradientStart: URGENCY_COLORS.routine.headerGradient.start,
    gradientEnd: URGENCY_COLORS.routine.headerGradient.end,
    badgeBg: URGENCY_COLORS.routine.badgeBg,
    badgeText: URGENCY_COLORS.routine.badgeText,
  },
  urgent: {
    gradientStart: URGENCY_COLORS.urgent.headerGradient.start,
    gradientEnd: URGENCY_COLORS.urgent.headerGradient.end,
    badgeBg: URGENCY_COLORS.urgent.badgeBg,
    badgeText: URGENCY_COLORS.urgent.badgeText,
  },
  emergency: {
    gradientStart: URGENCY_COLORS.emergency.headerGradient.start,
    gradientEnd: URGENCY_COLORS.emergency.headerGradient.end,
    badgeBg: URGENCY_COLORS.emergency.badgeBg,
    badgeText: URGENCY_COLORS.emergency.badgeText,
  },
}

const defaultSLA: SLAState = {
  serviceRoutine: SLA.service.routine.time,
  serviceUrgent: SLA.service.urgent.time,
  serviceEmergency: SLA.service.emergency.time,
  contactResponse: SLA.contact.response,
  quotationResponse: SLA.quotation.response,
}

// ---------------------------------------------------------------------------
// Color picker popover component
// ---------------------------------------------------------------------------

const HEX_REGEX = /^#([0-9A-Fa-f]{3}){1,2}$/

function normalizeHex(value: string): string {
  let hex = value.startsWith("#") ? value : `#${value}`
  hex = hex.replace(/[^#0-9A-Fa-f]/g, "")
  if (hex.length > 7) hex = hex.slice(0, 7)
  return hex
}

function ColorSwatch({ color, label, name, onChange }: { color: string; label: string; name: string; onChange: (name: string, value: string) => void }) {
  const [open, setOpen] = useState(false)
  const [hexInput, setHexInput] = useState(color)
  const nativeRef = useRef<HTMLInputElement>(null)
  const isValid = HEX_REGEX.test(hexInput)

  // Sync external changes
  useEffect(() => {
    setHexInput(color)
  }, [color])

  const handleNativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setHexInput(val)
    onChange(name, val)
  }

  const handleHexType = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = normalizeHex(e.target.value)
    setHexInput(raw)
    if (HEX_REGEX.test(raw)) {
      onChange(name, raw)
    }
  }

  const handleHexBlur = () => {
    if (!HEX_REGEX.test(hexInput)) {
      setHexInput(color)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-2.5 rounded-lg border border-border px-2.5 py-1.5 hover:bg-muted/50 transition-colors cursor-pointer w-full text-left group"
            aria-label={`Pick ${label} color, currently ${color}`}
          >
            <div
              className="w-8 h-8 rounded-md border border-border/60 shadow-sm shrink-0 transition-transform group-hover:scale-105"
              style={{ backgroundColor: color }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{label}</p>
              <p className="text-[11px] font-mono text-muted-foreground">{color.toUpperCase()}</p>
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0" align="start" sideOffset={8}>
          <div className="p-4 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">{label}</p>
              <div
                className="w-6 h-6 rounded-md border border-border shadow-sm"
                style={{ backgroundColor: isValid ? hexInput : color }}
              />
            </div>

            {/* Native color picker -- large and prominent */}
            <div className="relative">
              <input
                ref={nativeRef}
                type="color"
                value={isValid ? hexInput : color}
                onChange={handleNativeChange}
                className="w-full h-32 rounded-lg cursor-pointer border border-border"
                style={{ padding: 0 }}
                title="Click to pick a color"
              />
            </div>

            {/* Hex text input with validation */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Hex Value</Label>
              <div className="relative">
                <Input
                  value={hexInput}
                  onChange={handleHexType}
                  onBlur={handleHexBlur}
                  className={`h-8 text-xs font-mono pr-8 ${!isValid ? "border-red-500/50 focus-visible:ring-red-500/30" : ""}`}
                  placeholder="#000000"
                  maxLength={7}
                  spellCheck={false}
                  autoComplete="off"
                />
                {isValid ? (
                  <CheckCircle2 className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-green-500" />
                ) : (
                  <AlertTriangle className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-red-500" />
                )}
              </div>
              {!isValid && (
                <p className="text-[10px] text-red-400">Enter a valid hex color (e.g. #f59e0b)</p>
              )}
            </div>

            {/* Quick preset swatches */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Quick Presets</Label>
              <div className="flex flex-wrap gap-1.5">
                {["#f59e0b", "#d97706", "#1a1a1a", "#2d2d2d", "#dc2626", "#991b1b", "#1e40af", "#15803d", "#7c3aed", "#ffffff", "#f9fafb", "#111827"].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setHexInput(preset)
                      onChange(name, preset)
                    }}
                    className={`w-6 h-6 rounded-md border transition-all hover:scale-110 ${preset === color ? "border-accent ring-1 ring-accent" : "border-border/60"}`}
                    style={{ backgroundColor: preset }}
                    title={preset}
                    aria-label={`Set color to ${preset}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Template info cards
// ---------------------------------------------------------------------------
const templatesList = [
  {
    id: "service-customer",
    label: "Service Request - Customer Confirmation",
    subject: TEMPLATE_CONFIG.serviceCustomer.subject("SR-XXXX"),
    fromName: TEMPLATE_CONFIG.serviceCustomer.fromName,
    replyTo: TEMPLATE_CONFIG.serviceCustomer.replyTo,
    urgency: true,
  },
  {
    id: "service-business",
    label: "Service Request - Business Notification",
    subject: TEMPLATE_CONFIG.serviceBusiness.subject("SR-XXXX", "routine"),
    fromName: TEMPLATE_CONFIG.serviceBusiness.fromName,
    replyTo: TEMPLATE_CONFIG.serviceBusiness.replyTo,
    urgency: true,
  },
  {
    id: "contact-customer",
    label: "Contact Inquiry - Customer Confirmation",
    subject: TEMPLATE_CONFIG.contactCustomer.subject("CQ-XXXX"),
    fromName: TEMPLATE_CONFIG.contactCustomer.fromName,
    replyTo: TEMPLATE_CONFIG.contactCustomer.replyTo,
    urgency: false,
  },
  {
    id: "contact-business",
    label: "Contact Inquiry - Business Notification",
    subject: TEMPLATE_CONFIG.contactBusiness.subject("CQ-XXXX", "normal"),
    fromName: TEMPLATE_CONFIG.contactBusiness.fromName,
    replyTo: TEMPLATE_CONFIG.contactBusiness.replyTo,
    urgency: false,
  },
  {
    id: "quotation-customer",
    label: "Quotation Request - Customer Confirmation",
    subject: TEMPLATE_CONFIG.quotationCustomer.subject("QR-XXXX"),
    fromName: TEMPLATE_CONFIG.quotationCustomer.fromName,
    replyTo: TEMPLATE_CONFIG.quotationCustomer.replyTo,
    urgency: false,
  },
  {
    id: "quotation-business",
    label: "Quotation Request - Business Notification",
    subject: TEMPLATE_CONFIG.quotationBusiness.subject("QR-XXXX", false),
    fromName: TEMPLATE_CONFIG.quotationBusiness.fromName,
    replyTo: TEMPLATE_CONFIG.quotationBusiness.replyTo,
    urgency: false,
  },
]

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
export default function EmailTemplateManagementPage() {
  const [company, setCompany] = useState<CompanyState>(defaultCompany)
  const [colors, setColors] = useState<ColorsState>(defaultColors)
  const [urgencyColors, setUrgencyColors] = useState<UrgencyColorsState>(defaultUrgencyColors)
  const [slaValues, setSlaValues] = useState<SLAState>(defaultSLA)
  const [hasChanges, setHasChanges] = useState(false)

  const updateCompany = (field: keyof CompanyState, value: string) => {
    setCompany((prev) => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const updateColor = (name: string, value: string) => {
    setColors((prev) => ({ ...prev, [name]: value }))
    setHasChanges(true)
  }

  const updateUrgencyColor = (level: keyof UrgencyColorsState, field: string, value: string) => {
    setUrgencyColors((prev) => ({
      ...prev,
      [level]: { ...prev[level], [field]: value },
    }))
    setHasChanges(true)
  }

  const updateSLA = (field: keyof SLAState, value: string) => {
    setSlaValues((prev) => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const resetAll = () => {
    setCompany(defaultCompany)
    setColors(defaultColors)
    setUrgencyColors(defaultUrgencyColors)
    setSlaValues(defaultSLA)
    setHasChanges(false)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 border border-accent/20">
              <Settings2 className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Template Management</h1>
              <p className="text-muted-foreground">Configure brand details, colors, and SLA settings used across all email templates</p>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Badge variant="outline">6 Templates</Badge>
            <Badge className="bg-accent/20 text-accent border-0">Config-Driven</Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border-0">Strapi-Ready</Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="bg-transparent" asChild>
            <Link href="/dashboard/admin/email-management/configuration/email-preview">
              <Eye className="mr-2 h-4 w-4" />
              Preview Templates
            </Link>
          </Button>
        </div>
      </div>

      {/* Strapi Integration Banner */}
      <Card className="border-blue-500/30 bg-blue-500/5">
        <CardContent className="flex items-start gap-4 p-5">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/10 shrink-0">
            <Database className="h-5 w-5 text-blue-400" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-foreground text-sm">Strapi Backend Integration</p>
            <p className="text-sm text-muted-foreground mt-1">
              These settings currently read from the local config file (<code className="text-xs font-mono text-accent">lib/email/config/email-config.ts</code>).
              When your Strapi backend is connected, this page will read and write to the <code className="text-xs font-mono text-accent">email-configuration</code> single-type,
              allowing admins to update brand details without code changes.
            </p>
          </div>
          <Badge variant="outline" className="shrink-0 text-blue-400 border-blue-400/30">Phase 3</Badge>
        </CardContent>
      </Card>

      {/* Unsaved Changes Banner */}
      {hasChanges && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
              <div>
                <p className="font-medium text-foreground text-sm">Unsaved Changes</p>
                <p className="text-xs text-muted-foreground">Changes are previewed locally. Connect Strapi to persist changes to the database.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="bg-transparent" onClick={resetAll}>
                <RotateCcw className="mr-2 h-3 w-3" />
                Reset
              </Button>
              <Button size="sm" disabled title="Connect Strapi to enable saving">
                <Save className="mr-2 h-3 w-3" />
                Save to Strapi
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Tabs */}
      <Tabs defaultValue="company" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="company" className="gap-2">
            <Building2 className="h-4 w-4" />
            Company Details
          </TabsTrigger>
          <TabsTrigger value="colors" className="gap-2">
            <Palette className="h-4 w-4" />
            Brand Colors
          </TabsTrigger>
          <TabsTrigger value="sla" className="gap-2">
            <Clock className="h-4 w-4" />
            SLA & Response Times
          </TabsTrigger>
          <TabsTrigger value="templates" className="gap-2">
            <FileText className="h-4 w-4" />
            Template Config
          </TabsTrigger>
          <TabsTrigger value="darkmode" className="gap-2">
            <Moon className="h-4 w-4" />
            Dark Mode
          </TabsTrigger>
        </TabsList>

        {/* ---- Company Details Tab ---- */}
        <TabsContent value="company" className="space-y-6">
          <div className="responsive-grid-2">
            {/* Business Identity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Business Identity</CardTitle>
                <CardDescription>Company name and branding shown in email headers and footers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input id="company-name" value={company.name} onChange={(e) => updateCompany("name", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-tagline">Tagline</Label>
                  <Input id="company-tagline" value={company.tagline} onChange={(e) => updateCompany("tagline", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-legal">Legal Name</Label>
                  <Input id="company-legal" value={company.legalName} onChange={(e) => updateCompany("legalName", e.target.value)} />
                  <p className="text-xs text-muted-foreground">Used in email footer copyright notices</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-website">Website</Label>
                  <Input id="company-website" value={company.website} onChange={(e) => updateCompany("website", e.target.value)} />
                </div>
              </CardContent>
            </Card>

            {/* Address */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Business Address</CardTitle>
                <CardDescription>Address shown in email footers for legal compliance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address-line1">Address Line 1</Label>
                  <Input id="address-line1" value={company.addressLine1} onChange={(e) => updateCompany("addressLine1", e.target.value)} />
                </div>
                <div className="responsive-grid-2">
                  <div className="space-y-2">
                    <Label htmlFor="address-city">City</Label>
                    <Input id="address-city" value={company.city} onChange={(e) => updateCompany("city", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address-postcode">Postcode</Label>
                    <Input id="address-postcode" value={company.postcode} onChange={(e) => updateCompany("postcode", e.target.value)} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Phone Numbers */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Phone Numbers</CardTitle>
                <CardDescription>Contact numbers included in email content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone-primary">Primary (Freephone)</Label>
                  <Input id="phone-primary" value={company.phonePrimary} onChange={(e) => updateCompany("phonePrimary", e.target.value)} />
                  <p className="text-xs text-muted-foreground">Used in service confirmation emails</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone-local">Local Number</Label>
                  <Input id="phone-local" value={company.phoneLocal} onChange={(e) => updateCompany("phoneLocal", e.target.value)} />
                  <p className="text-xs text-muted-foreground">Used in contact inquiry emails</p>
                </div>
              </CardContent>
            </Card>

            {/* Email Addresses */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Email Addresses</CardTitle>
                <CardDescription>Reply-to and from addresses for email delivery</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-support">Support Email</Label>
                  <Input id="email-support" type="email" value={company.emailSupport} onChange={(e) => updateCompany("emailSupport", e.target.value)} />
                  <p className="text-xs text-muted-foreground">Reply-to for customer confirmations</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-info">Info Email</Label>
                  <Input id="email-info" type="email" value={company.emailInfo} onChange={(e) => updateCompany("emailInfo", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-noreply">No-Reply Email</Label>
                  <Input id="email-noreply" type="email" value={company.emailNoreply} onChange={(e) => updateCompany("emailNoreply", e.target.value)} />
                  <p className="text-xs text-muted-foreground">Reply-to for internal business notifications</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Live Preview */}
          <Card className="border-accent/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-accent" />
                <CardTitle className="text-base">Live Header Preview</CardTitle>
              </div>
              <CardDescription>How the email header will appear with current settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="rounded-lg overflow-hidden max-w-lg mx-auto shadow-lg"
                style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}
              >
                <div
                  style={{
                    background: `linear-gradient(135deg, ${colors.headerGradientStart} 0%, ${colors.headerGradientEnd} 100%)`,
                    padding: "32px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      display: "inline-block",
                      background: colors.primary,
                      width: "48px",
                      height: "48px",
                      borderRadius: "10px",
                      lineHeight: "48px",
                      fontSize: "24px",
                      marginBottom: "12px",
                    }}
                  >
                    {"⚡"}
                  </div>
                  <h2 style={{ margin: 0, color: "#ffffff", fontSize: "22px", fontWeight: 700 }}>
                    {company.name}
                  </h2>
                  <p style={{ margin: "6px 0 0", color: colors.primaryLight, fontSize: "13px" }}>
                    {company.tagline}
                  </p>
                </div>
                <div style={{ padding: "20px", backgroundColor: "#ffffff" }}>
                  <p style={{ margin: 0, color: colors.textMuted, fontSize: "14px", lineHeight: 1.6 }}>
                    Dear Customer, thank you for contacting {company.name}...
                  </p>
                </div>
                <div
                  style={{
                    padding: "16px 20px",
                    backgroundColor: "#f9fafb",
                    borderTop: "1px solid #e5e7eb",
                    textAlign: "center",
                  }}
                >
                  <p style={{ margin: 0, color: "#6b7280", fontSize: "11px" }}>
                    {company.legalName} | {company.addressLine1}, {company.city} {company.postcode}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ---- Brand Colors Tab ---- */}
        <TabsContent value="colors" className="space-y-6">
          <div className="responsive-grid-2">
            {/* Core Brand Colors */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Core Brand Colors</CardTitle>
                <CardDescription>Primary brand colors used for accents, buttons, and highlights</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <ColorSwatch color={colors.primary} label="Primary" name="primary" onChange={updateColor} />
                <ColorSwatch color={colors.primaryLight} label="Primary Light" name="primaryLight" onChange={updateColor} />
                <ColorSwatch color={colors.primaryDark} label="Primary Dark" name="primaryDark" onChange={updateColor} />
              </CardContent>
            </Card>

            {/* Header Colors */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Email Header</CardTitle>
                <CardDescription>Gradient colors used in the email header banner</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <ColorSwatch color={colors.headerGradientStart} label="Gradient Start" name="headerGradientStart" onChange={updateColor} />
                <ColorSwatch color={colors.headerGradientEnd} label="Gradient End" name="headerGradientEnd" onChange={updateColor} />
                <div className="mt-4">
                  <p className="text-xs text-muted-foreground mb-2">Preview:</p>
                  <div
                    className="h-12 rounded-lg"
                    style={{
                      background: `linear-gradient(135deg, ${colors.headerGradientStart} 0%, ${colors.headerGradientEnd} 100%)`,
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Background Colors */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Background Colors</CardTitle>
                <CardDescription>Page and card background colors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <ColorSwatch color={colors.bgBody} label="Body Background" name="bgBody" onChange={updateColor} />
                <ColorSwatch color={colors.bgCard} label="Card Background" name="bgCard" onChange={updateColor} />
              </CardContent>
            </Card>

            {/* Text Colors */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Text Colors</CardTitle>
                <CardDescription>Text hierarchy colors for headings, body, and labels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <ColorSwatch color={colors.textDark} label="Headings" name="textDark" onChange={updateColor} />
                <ColorSwatch color={colors.textMuted} label="Body Text" name="textMuted" onChange={updateColor} />
                <ColorSwatch color={colors.textLight} label="Labels" name="textLight" onChange={updateColor} />
              </CardContent>
            </Card>
          </div>

          {/* Urgency Color Schemes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Urgency Color Schemes</CardTitle>
              <CardDescription>Service request templates use urgency-specific color treatments for headers, badges, and alert banners</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="responsive-grid-3">
                {(["routine", "urgent", "emergency"] as const).map((level) => (
                  <div key={level} className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: urgencyColors[level].badgeText }}
                      />
                      <h4 className="font-medium text-foreground text-sm capitalize">{level}</h4>
                    </div>
                    <div className="space-y-3">
                      <ColorSwatch
                        color={urgencyColors[level].gradientStart}
                        label="Header Start"
                        name="gradientStart"
                        onChange={(_, val) => updateUrgencyColor(level, "gradientStart", val)}
                      />
                      <ColorSwatch
                        color={urgencyColors[level].gradientEnd}
                        label="Header End"
                        name="gradientEnd"
                        onChange={(_, val) => updateUrgencyColor(level, "gradientEnd", val)}
                      />
                      <ColorSwatch
                        color={urgencyColors[level].badgeBg}
                        label="Badge Background"
                        name="badgeBg"
                        onChange={(_, val) => updateUrgencyColor(level, "badgeBg", val)}
                      />
                      <ColorSwatch
                        color={urgencyColors[level].badgeText}
                        label="Badge Text"
                        name="badgeText"
                        onChange={(_, val) => updateUrgencyColor(level, "badgeText", val)}
                      />
                    </div>
                    {/* Mini preview */}
                    <div className="rounded-lg overflow-hidden border border-border">
                      <div
                        className="h-8"
                        style={{
                          background: `linear-gradient(135deg, ${urgencyColors[level].gradientStart} 0%, ${urgencyColors[level].gradientEnd} 100%)`,
                        }}
                      />
                      <div className="p-3 flex justify-center">
                        <span
                          style={{
                            display: "inline-block",
                            backgroundColor: urgencyColors[level].badgeBg,
                            color: urgencyColors[level].badgeText,
                            padding: "3px 10px",
                            borderRadius: "12px",
                            fontSize: "11px",
                            fontWeight: 600,
                          }}
                        >
                          {level.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ---- SLA & Response Times Tab ---- */}
        <TabsContent value="sla" className="space-y-6">
          <div className="responsive-grid-2">
            {/* Service Request SLAs */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Service Request SLAs</CardTitle>
                <CardDescription>Response time promises shown in service request emails, per urgency level</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    Routine Response Time
                  </Label>
                  <Input value={slaValues.serviceRoutine} onChange={(e) => updateSLA("serviceRoutine", e.target.value)} placeholder="e.g. 2-4 hours" />
                  <p className="text-xs text-muted-foreground">Shown as: "We'll review your request within {slaValues.serviceRoutine}"</p>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    Urgent Response Time
                  </Label>
                  <Input value={slaValues.serviceUrgent} onChange={(e) => updateSLA("serviceUrgent", e.target.value)} placeholder="e.g. 2 hours" />
                  <p className="text-xs text-muted-foreground">Shown as: "Our team will prioritise this and contact you within {slaValues.serviceUrgent}"</p>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    Emergency Response Time
                  </Label>
                  <Input value={slaValues.serviceEmergency} onChange={(e) => updateSLA("serviceEmergency", e.target.value)} placeholder="e.g. 30 minutes" />
                  <p className="text-xs text-muted-foreground">Shown as: "Our emergency team will call you within {slaValues.serviceEmergency}"</p>
                </div>
              </CardContent>
            </Card>

            {/* Other Form SLAs */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Contact & Quotation SLAs</CardTitle>
                <CardDescription>Response time promises for contact inquiries and quotation requests</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Mail className="h-3 w-3 text-muted-foreground" />
                    Contact Inquiry Response
                  </Label>
                  <Input value={slaValues.contactResponse} onChange={(e) => updateSLA("contactResponse", e.target.value)} placeholder="e.g. 24-48 hours" />
                  <p className="text-xs text-muted-foreground">Shown to customers and as internal reminder for business notifications</p>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <FileText className="h-3 w-3 text-muted-foreground" />
                    Quotation Response
                  </Label>
                  <Input value={slaValues.quotationResponse} onChange={(e) => updateSLA("quotationResponse", e.target.value)} placeholder="e.g. 2-5 business days" />
                  <p className="text-xs text-muted-foreground">Time promised to deliver a detailed quotation to the customer</p>
                </div>
              </CardContent>
            </Card>

            {/* SLA Summary */}
            <Card className="lg:col-span-2 border-accent/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-accent" />
                  <CardTitle className="text-base">How SLAs Are Used</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="responsive-grid-3">
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground text-sm">Customer Emails</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Response times are shown in the "What Happens Next?" section to set clear expectations for when the customer will be contacted.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground text-sm">Business Notifications</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Used in the "Next Steps" action items and response reminders to ensure your team responds within the promised timeframe.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground text-sm">Emergency Banners</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Emergency SLA appears prominently in alert banners at the top of both customer and business emails for immediate visibility.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ---- Template Config Tab ---- */}
        <TabsContent value="templates" className="space-y-6">
          <div className="grid gap-4">
            {templatesList.map((tmpl) => (
              <Card key={tmpl.id}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-accent" />
                        <h3 className="font-medium text-foreground text-sm">{tmpl.label}</h3>
                        {tmpl.urgency && (
                          <Badge variant="outline" className="text-xs">Urgency Variants</Badge>
                        )}
                      </div>
                      <div className="responsive-grid-3 text-xs">
                        <div>
                          <span className="text-muted-foreground">Subject Line:</span>
                          <p className="font-mono text-foreground mt-0.5">{tmpl.subject}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">From Name:</span>
                          <p className="text-foreground mt-0.5">{tmpl.fromName}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Reply-To:</span>
                          <p className="font-mono text-foreground mt-0.5">{tmpl.replyTo}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-xs text-green-500 font-medium">Active</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Links */}
          <Card>
            <CardContent className="flex items-center justify-between p-5">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10">
                  <Eye className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">Preview All Templates</p>
                  <p className="text-xs text-muted-foreground">See how each template renders with sample data across urgency levels</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="bg-transparent" asChild>
                <Link href="/dashboard/admin/email-management/configuration/email-preview">
                  Open Preview
                  <ArrowRight className="ml-2 h-3 w-3" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Config Source Info */}
          <Card className="border-border/50">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="space-y-2 text-xs text-muted-foreground">
                  <p className="font-medium text-foreground text-sm">Configuration Source</p>
                  <p className="leading-relaxed">
                    All template settings are driven by <code className="font-mono text-accent">lib/email/config/email-config.ts</code>.
                    This includes company details, brand colors, urgency schemes, SLA response times, subject line patterns, from-names, and reply-to addresses.
                    When Strapi is connected, this config will be fetched from the <code className="font-mono text-accent">email-configuration</code> single-type via API.
                  </p>
                  <p className="leading-relaxed">
                    Template HTML generators in <code className="font-mono text-accent">lib/email/templates/</code> import from this config
                    rather than hardcoding any brand values, making it easy to update everything from a single location.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ---- Dark Mode Tab ---- */}
        <TabsContent value="darkmode">
          <DarkModeTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
