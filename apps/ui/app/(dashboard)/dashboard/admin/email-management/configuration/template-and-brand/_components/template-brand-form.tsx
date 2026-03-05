"use client"

import React, { useState, useCallback, useRef, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ColorPicker } from "@/components/ui/color-picker"
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
  Loader2,
  Upload,
  ImageIcon,
} from "lucide-react"

// ---------------------------------------------------------------------------
// Domain preset palettes
// ---------------------------------------------------------------------------
const BRAND_PRESETS = ["#f59e0b", "#d97706", "#1e40af", "#15803d", "#7c3aed", "#dc2626", "#1a1a1a", "#374151", "#6b7280", "#ffffff"]
const GRADIENT_PRESETS = ["#f59e0b", "#d97706", "#b45309", "#92400e", "#1e40af", "#1d4ed8", "#15803d", "#166534", "#7c3aed", "#6d28d9"]
const BG_PRESETS = ["#ffffff", "#f9fafb", "#f3f4f6", "#e5e7eb", "#1a1a1a", "#111827", "#1f2937", "#374151"]
const TEXT_PRESETS = ["#1a1a1a", "#374151", "#6b7280", "#9ca3af", "#ffffff", "#f9fafb", "#111827", "#030712"]
const URGENCY_ROUTINE_PRESETS = ["#1e40af", "#2563eb", "#3b82f6", "#dbeafe", "#eff6ff", "#ffffff", "#1d4ed8", "#93c5fd"]
const URGENCY_URGENT_PRESETS = ["#d97706", "#f59e0b", "#fbbf24", "#fffbeb", "#fef3c7", "#ffffff", "#b45309", "#fde68a"]
const URGENCY_EMERGENCY_PRESETS = ["#dc2626", "#ef4444", "#f87171", "#fee2e2", "#fef2f2", "#ffffff", "#991b1b", "#fca5a5"]
import Link from "next/link"
import {
  COMPANY,
  BRAND_COLORS,
  URGENCY_COLORS,
  SLA,
  TEMPLATE_CONFIG,
} from "@/lib/email/config/email-config"
import DarkModeTab from "@/components/admin/dark-mode-tab"
import { useToast } from "@/components/ui/use-toast"
import type { CompanySettingsVM } from "@/lib/strapi/global/company-settings/company-settings"
import type { EmailSettingsVM } from "@/lib/strapi/global/email-settings/email-settings"
import {
  saveCompanySettings,
  uploadLogo,
} from "@/lib/strapi/global/company-settings/company-settings-actions"
import { saveEmailSettings } from "@/lib/strapi/global/email-settings/email-settings-actions"

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface Props {
  initialCompany: CompanySettingsVM | null
  initialEmailSettings: EmailSettingsVM | null
}

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
  logoUrl: string | null
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
// Helpers to build initial state from Strapi or static defaults
// ---------------------------------------------------------------------------
function buildInitialCompany(
  cs: CompanySettingsVM | null,
  es: EmailSettingsVM | null,
): CompanyState {
  return {
    name: cs?.businessName ?? COMPANY.name,
    tagline: COMPANY.tagline,
    legalName: cs?.businessName ?? COMPANY.legalName,
    // Strapi stores address as single text field — put it all in addressLine1
    addressLine1: cs?.businessAddress ?? COMPANY.address.line1,
    city: cs ? "" : COMPANY.address.city,
    postcode: cs ? "" : COMPANY.address.postcode,
    phonePrimary: cs?.businessPhone ?? COMPANY.phone.primary,
    phoneLocal: COMPANY.phone.local,
    emailSupport: cs?.businessEmail ?? COMPANY.email.support,
    emailInfo: COMPANY.email.info,
    emailNoreply: es?.fromEmail ?? COMPANY.email.noreply,
    website: cs?.website ?? COMPANY.website,
    logoUrl: cs?.logoUrl ?? null,
  }
}

function buildInitialSla(es: EmailSettingsVM | null): SLAState {
  const defaults: SLAState = {
    serviceRoutine: SLA.service.routine.time,
    serviceUrgent: SLA.service.urgent.time,
    serviceEmergency: SLA.service.emergency.time,
    contactResponse: SLA.contact.response,
    quotationResponse: SLA.quotation.response,
  }

  if (!es?.slaJson) return defaults

  try {
    const parsed = JSON.parse(es.slaJson) as Partial<SLAState>
    return { ...defaults, ...parsed }
  } catch {
    return defaults
  }
}

function buildInitialUrgencyColors(es: EmailSettingsVM | null): UrgencyColorsState {
  const defaults: UrgencyColorsState = {
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

  if (!es?.urgencyColorsJson) return defaults

  try {
    const parsed = JSON.parse(es.urgencyColorsJson) as Partial<UrgencyColorsState>
    return {
      routine: { ...defaults.routine, ...parsed.routine },
      urgent: { ...defaults.urgent, ...parsed.urgent },
      emergency: { ...defaults.emergency, ...parsed.emergency },
    }
  } catch {
    return defaults
  }
}

function buildInitialColors(cs: CompanySettingsVM | null): ColorsState {
  return {
    primary: cs?.brandPrimaryColor ?? BRAND_COLORS.primary,
    primaryLight: BRAND_COLORS.primaryLight,
    primaryDark: BRAND_COLORS.primaryDark,
    headerGradientStart: cs?.brandSecondaryColor ?? BRAND_COLORS.headerGradient.start,
    headerGradientEnd: BRAND_COLORS.headerGradient.end,
    bgBody: BRAND_COLORS.bgBody,
    bgCard: BRAND_COLORS.bgCard,
    textDark: BRAND_COLORS.textDark,
    textMuted: BRAND_COLORS.textMuted,
    textLight: BRAND_COLORS.textLight,
  }
}

// ---------------------------------------------------------------------------
// Template info cards — built inside component so fromName/replyTo reflect live state
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
export function TemplateBrandForm({ initialCompany, initialEmailSettings }: Props) {
  const { toast } = useToast()

  const [company, setCompany] = useState<CompanyState>(() =>
    buildInitialCompany(initialCompany, initialEmailSettings),
  )
  const [colors, setColors] = useState<ColorsState>(() => buildInitialColors(initialCompany))
  const [urgencyColors, setUrgencyColors] = useState<UrgencyColorsState>(() =>
    buildInitialUrgencyColors(initialEmailSettings),
  )
  const [slaValues, setSlaValues] = useState<SLAState>(() =>
    buildInitialSla(initialEmailSettings),
  )
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const logoInputRef = useRef<HTMLInputElement>(null)

  const updateCompany = useCallback((field: keyof CompanyState, value: string | null) => {
    setCompany((prev) => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }, [])

  const updateColor = useCallback((name: string, value: string) => {
    setColors((prev) => ({ ...prev, [name]: value }))
    setHasChanges(true)
  }, [])

  const updateUrgencyColor = useCallback(
    (level: keyof UrgencyColorsState, field: string, value: string) => {
      setUrgencyColors((prev) => ({
        ...prev,
        [level]: { ...prev[level], [field]: value },
      }))
      setHasChanges(true)
    },
    [],
  )

  // Template Config cards — fromName/replyTo reflect live company state
  const templatesList = useMemo(() => [
    {
      id: "service-customer",
      label: "Service Request - Customer Confirmation",
      subject: TEMPLATE_CONFIG.serviceCustomer.subject("SR-XXXX"),
      fromName: company.name,
      replyTo: company.emailSupport,
      urgency: true,
    },
    {
      id: "service-business",
      label: "Service Request - Business Notification",
      subject: TEMPLATE_CONFIG.serviceBusiness.subject("SR-XXXX", "routine"),
      fromName: `${company.name} System`,
      replyTo: company.emailNoreply,
      urgency: true,
    },
    {
      id: "contact-customer",
      label: "Contact Inquiry - Customer Confirmation",
      subject: TEMPLATE_CONFIG.contactCustomer.subject("CQ-XXXX"),
      fromName: company.name,
      replyTo: company.emailSupport,
      urgency: false,
    },
    {
      id: "contact-business",
      label: "Contact Inquiry - Business Notification",
      subject: TEMPLATE_CONFIG.contactBusiness.subject("CQ-XXXX", "normal"),
      fromName: `${company.name} System`,
      replyTo: company.emailNoreply,
      urgency: false,
    },
    {
      id: "quotation-customer",
      label: "Quotation Request - Customer Confirmation",
      subject: TEMPLATE_CONFIG.quotationCustomer.subject("QR-XXXX"),
      fromName: company.name,
      replyTo: company.emailSupport,
      urgency: false,
    },
    {
      id: "quotation-business",
      label: "Quotation Request - Business Notification",
      subject: TEMPLATE_CONFIG.quotationBusiness.subject("QR-XXXX", false),
      fromName: `${company.name} System`,
      replyTo: company.emailNoreply,
      urgency: false,
    },
  ], [company.name, company.emailSupport, company.emailNoreply])

  const updateSLA = useCallback((field: keyof SLAState, value: string) => {
    setSlaValues((prev) => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }, [])

  const resetAll = () => {
    setCompany(buildInitialCompany(initialCompany, initialEmailSettings))
    setColors(buildInitialColors(initialCompany))
    setUrgencyColors(buildInitialUrgencyColors(initialEmailSettings))
    setSlaValues(buildInitialSla(initialEmailSettings))
    setHasChanges(false)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const businessAddress = [company.addressLine1, company.city, company.postcode]
        .filter(Boolean)
        .join(", ")

      const [companyResult, emailResult] = await Promise.all([
        saveCompanySettings({
          businessName: company.name,
          businessAddress: businessAddress || company.addressLine1,
          businessPhone: company.phonePrimary || null,
          businessEmail: company.emailSupport,
          logoUrl: company.logoUrl,
          brandPrimaryColor: colors.primary,
          brandSecondaryColor: colors.headerGradientStart,
          website: company.website || null,
        }),
        saveEmailSettings({
          fromEmail: company.emailNoreply,
          replyToEmail: company.emailSupport || null,
          urgencyColorsJson: JSON.stringify(urgencyColors),
          slaJson: JSON.stringify(slaValues),
        }),
      ])

      if (companyResult.success && emailResult.success) {
        toast({
          title: "Settings saved",
          description: "Company and email settings saved to Strapi successfully.",
        })
        setHasChanges(false)
      } else {
        const errorMsg = companyResult.error ?? emailResult.error ?? "Unknown error"
        toast({
          title: "Save failed",
          description: errorMsg,
          variant: "destructive",
        })
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("files", file)

      const result = await uploadLogo(formData)
      if (result.success && result.url) {
        updateCompany("logoUrl", result.url)
        toast({
          title: "Logo uploaded",
          description: "Logo uploaded to Strapi media library. Click Save to persist.",
        })
      } else {
        toast({
          title: "Upload failed",
          description: result.error ?? "Could not upload logo",
          variant: "destructive",
        })
      }
    } finally {
      setIsUploading(false)
      e.target.value = ""
    }
  }

  // Compute initials for logo fallback
  const logoInitials = company.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()

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
              <p className="text-muted-foreground">
                Configure brand details, colors, and SLA settings used across all email templates
              </p>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Badge variant="outline">6 Templates</Badge>
            <Badge className="bg-accent/20 text-accent border-0">Config-Driven</Badge>
            <Badge className="bg-green-500/20 text-green-400 border-0">Strapi Connected</Badge>
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

      {/* Strapi Integration Banner — connected state */}
      <Card className="border-green-500/30 bg-green-500/5">
        <CardContent className="flex items-start gap-4 p-5">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-500/10 shrink-0">
            <Database className="h-5 w-5 text-green-400" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-foreground text-sm">Strapi Backend Connected</p>
            <p className="text-sm text-muted-foreground mt-1">
              Company and email settings are loaded from Strapi and saved back on each change.
              Brand colors, urgency schemes, and SLA text are managed locally — Strapi collection types for
              those fields are planned for Phase 6.
            </p>
          </div>
          <Badge variant="outline" className="shrink-0 text-green-400 border-green-400/30">
            Live
          </Badge>
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
                <p className="text-xs text-muted-foreground">
                  Company name, address, phone, email, logo, and brand colors will be saved to Strapi.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent"
                onClick={resetAll}
                disabled={isSaving}
              >
                <RotateCcw className="mr-2 h-3 w-3" />
                Reset
              </Button>
              <Button size="sm" onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                ) : (
                  <Save className="mr-2 h-3 w-3" />
                )}
                {isSaving ? "Saving..." : "Save to Strapi"}
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
            {/* Logo */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Company Logo</CardTitle>
                <CardDescription>Shown in email headers. Upload to Strapi media library or enter a URL.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Logo preview */}
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-xl border border-border flex items-center justify-center overflow-hidden shrink-0"
                    style={{
                      background: company.logoUrl ? "transparent" : colors.primary,
                    }}
                  >
                    {company.logoUrl ? (
                      <img
                        src={company.logoUrl}
                        alt={company.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-white text-xl font-bold">{logoInitials}</span>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="text-xs text-muted-foreground">
                      {company.logoUrl ? "Logo loaded from Strapi" : "Using initials — upload a logo to replace"}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="bg-transparent text-xs"
                        onClick={() => logoInputRef.current?.click()}
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
                        ) : (
                          <Upload className="mr-1.5 h-3 w-3" />
                        )}
                        {isUploading ? "Uploading..." : "Upload Logo"}
                      </Button>
                      {company.logoUrl && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="bg-transparent text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
                          onClick={() => updateCompany("logoUrl", null)}
                        >
                          <ImageIcon className="mr-1.5 h-3 w-3" />
                          Use Initials
                        </Button>
                      )}
                    </div>
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoUpload}
                    />
                  </div>
                </div>
                {/* Manual URL input */}
                <div className="space-y-2">
                  <Label htmlFor="logo-url" className="text-xs">Logo URL (optional override)</Label>
                  <Input
                    id="logo-url"
                    value={company.logoUrl ?? ""}
                    onChange={(e) => updateCompany("logoUrl", e.target.value || null)}
                    placeholder="https://example.com/logo.png"
                    className="text-xs"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Business Identity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Business Identity</CardTitle>
                <CardDescription>Company name and branding shown in email headers and footers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input
                    id="company-name"
                    value={company.name}
                    onChange={(e) => updateCompany("name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-tagline">Tagline</Label>
                  <Input
                    id="company-tagline"
                    value={company.tagline}
                    onChange={(e) => updateCompany("tagline", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-legal">Legal Name</Label>
                  <Input
                    id="company-legal"
                    value={company.legalName}
                    onChange={(e) => updateCompany("legalName", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Used in email footer copyright notices</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-website">Website</Label>
                  <Input
                    id="company-website"
                    value={company.website}
                    onChange={(e) => updateCompany("website", e.target.value)}
                  />
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
                  <Input
                    id="address-line1"
                    value={company.addressLine1}
                    onChange={(e) => updateCompany("addressLine1", e.target.value)}
                  />
                </div>
                <div className="responsive-grid-2">
                  <div className="space-y-2">
                    <Label htmlFor="address-city">City</Label>
                    <Input
                      id="address-city"
                      value={company.city}
                      onChange={(e) => updateCompany("city", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address-postcode">Postcode</Label>
                    <Input
                      id="address-postcode"
                      value={company.postcode}
                      onChange={(e) => updateCompany("postcode", e.target.value)}
                    />
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
                  <Input
                    id="phone-primary"
                    value={company.phonePrimary}
                    onChange={(e) => updateCompany("phonePrimary", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Used in service confirmation emails</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone-local">Local Number</Label>
                  <Input
                    id="phone-local"
                    value={company.phoneLocal}
                    onChange={(e) => updateCompany("phoneLocal", e.target.value)}
                  />
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
                  <Input
                    id="email-support"
                    type="email"
                    value={company.emailSupport}
                    onChange={(e) => updateCompany("emailSupport", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Reply-to for customer confirmations → saved to Strapi as <code className="font-mono text-accent">replyToEmail</code></p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-info">Info Email</Label>
                  <Input
                    id="email-info"
                    type="email"
                    value={company.emailInfo}
                    onChange={(e) => updateCompany("emailInfo", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-noreply">No-Reply / From Email</Label>
                  <Input
                    id="email-noreply"
                    type="email"
                    value={company.emailNoreply}
                    onChange={(e) => updateCompany("emailNoreply", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">From address for all outgoing emails → saved to Strapi as <code className="font-mono text-accent">fromEmail</code></p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Live Header Preview — responsive */}
          <Card className="border-accent/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-accent" />
                <CardTitle className="text-base">Live Header Preview</CardTitle>
              </div>
              <CardDescription>
                How the email header will appear — horizontal on desktop/tablet, stacked on mobile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="rounded-lg overflow-hidden max-w-lg mx-auto shadow-lg"
                style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}
              >
                {/* Header — flex row on sm+, column on mobile */}
                <div
                  className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5"
                  style={{
                    background: `linear-gradient(135deg, ${colors.headerGradientStart} 0%, ${colors.headerGradientEnd} 100%)`,
                    padding: "24px 32px",
                  }}
                >
                  {/* Logo */}
                  <div className="shrink-0">
                    {company.logoUrl ? (
                      <img
                        src={company.logoUrl}
                        alt={company.name}
                        style={{
                          height: "56px",
                          width: "auto",
                          maxWidth: "160px",
                          objectFit: "contain",
                          display: "block",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: colors.primary,
                          width: "56px",
                          height: "56px",
                          borderRadius: "12px",
                          fontSize: "22px",
                          fontWeight: 700,
                          color: "#ffffff",
                        }}
                      >
                        {logoInitials}
                      </div>
                    )}
                  </div>
                  {/* Text */}
                  <div className="text-center sm:text-left">
                    <h2 style={{ margin: 0, color: "#ffffff", fontSize: "22px", fontWeight: 700 }}>
                      {company.name}
                    </h2>
                    <p style={{ margin: "4px 0 0", color: colors.primaryLight, fontSize: "13px" }}>
                      {company.tagline}
                    </p>
                  </div>
                </div>
                {/* Body preview */}
                <div style={{ padding: "20px", backgroundColor: "#ffffff" }}>
                  <p style={{ margin: 0, color: colors.textMuted, fontSize: "14px", lineHeight: 1.6 }}>
                    Dear Customer, thank you for contacting {company.name}...
                  </p>
                </div>
                {/* Footer preview */}
                <div
                  style={{
                    padding: "16px 20px",
                    backgroundColor: "#f9fafb",
                    borderTop: "1px solid #e5e7eb",
                    textAlign: "center",
                  }}
                >
                  <p style={{ margin: 0, color: "#6b7280", fontSize: "11px" }}>
                    {company.legalName} | {[company.addressLine1, company.city, company.postcode].filter(Boolean).join(", ")}
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
                <CardDescription>
                  Primary brand colors used for accents, buttons, and highlights
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <ColorPicker value={colors.primary} label="Primary" presets={BRAND_PRESETS} onChange={(v) => updateColor("primary", v)} />
                <ColorPicker value={colors.primaryLight} label="Primary Light" presets={BRAND_PRESETS} onChange={(v) => updateColor("primaryLight", v)} />
                <ColorPicker value={colors.primaryDark} label="Primary Dark" presets={BRAND_PRESETS} onChange={(v) => updateColor("primaryDark", v)} />
              </CardContent>
            </Card>

            {/* Header Colors */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Email Header</CardTitle>
                <CardDescription>Gradient colors used in the email header banner</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <ColorPicker value={colors.headerGradientStart} label="Gradient Start" presets={GRADIENT_PRESETS} onChange={(v) => updateColor("headerGradientStart", v)} />
                <ColorPicker value={colors.headerGradientEnd} label="Gradient End" presets={GRADIENT_PRESETS} onChange={(v) => updateColor("headerGradientEnd", v)} />
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
                <ColorPicker value={colors.bgBody} label="Body Background" presets={BG_PRESETS} onChange={(v) => updateColor("bgBody", v)} />
                <ColorPicker value={colors.bgCard} label="Card Background" presets={BG_PRESETS} onChange={(v) => updateColor("bgCard", v)} />
              </CardContent>
            </Card>

            {/* Text Colors */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Text Colors</CardTitle>
                <CardDescription>Text hierarchy colors for headings, body, and labels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <ColorPicker value={colors.textDark} label="Headings" presets={TEXT_PRESETS} onChange={(v) => updateColor("textDark", v)} />
                <ColorPicker value={colors.textMuted} label="Body Text" presets={TEXT_PRESETS} onChange={(v) => updateColor("textMuted", v)} />
                <ColorPicker value={colors.textLight} label="Labels" presets={TEXT_PRESETS} onChange={(v) => updateColor("textLight", v)} />
              </CardContent>
            </Card>
          </div>

          {/* Urgency Color Schemes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Urgency Color Schemes</CardTitle>
              <CardDescription>
                Service request templates use urgency-specific color treatments for headers, badges, and
                alert banners
              </CardDescription>
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
                      {(() => {
                        const presets = level === "routine" ? URGENCY_ROUTINE_PRESETS : level === "urgent" ? URGENCY_URGENT_PRESETS : URGENCY_EMERGENCY_PRESETS
                        return (
                          <>
                            <ColorPicker value={urgencyColors[level].gradientStart} label="Header Start" presets={presets} onChange={(v) => updateUrgencyColor(level, "gradientStart", v)} />
                            <ColorPicker value={urgencyColors[level].gradientEnd} label="Header End" presets={presets} onChange={(v) => updateUrgencyColor(level, "gradientEnd", v)} />
                            <ColorPicker value={urgencyColors[level].badgeBg} label="Badge Background" presets={presets} onChange={(v) => updateUrgencyColor(level, "badgeBg", v)} />
                            <ColorPicker value={urgencyColors[level].badgeText} label="Badge Text" presets={TEXT_PRESETS} onChange={(v) => updateUrgencyColor(level, "badgeText", v)} />
                          </>
                        )
                      })()}
                    </div>
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
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Service Request SLAs</CardTitle>
                <CardDescription>
                  Response time promises shown in service request emails, per urgency level
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    Routine Response Time
                  </Label>
                  <Input
                    value={slaValues.serviceRoutine}
                    onChange={(e) => updateSLA("serviceRoutine", e.target.value)}
                    placeholder="e.g. 2-4 hours"
                  />
                  <p className="text-xs text-muted-foreground">
                    Shown as: &ldquo;We&apos;ll review your request within {slaValues.serviceRoutine}&rdquo;
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    Urgent Response Time
                  </Label>
                  <Input
                    value={slaValues.serviceUrgent}
                    onChange={(e) => updateSLA("serviceUrgent", e.target.value)}
                    placeholder="e.g. 2 hours"
                  />
                  <p className="text-xs text-muted-foreground">
                    Shown as: &ldquo;Our team will prioritise this and contact you within{" "}
                    {slaValues.serviceUrgent}&rdquo;
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    Emergency Response Time
                  </Label>
                  <Input
                    value={slaValues.serviceEmergency}
                    onChange={(e) => updateSLA("serviceEmergency", e.target.value)}
                    placeholder="e.g. 30 minutes"
                  />
                  <p className="text-xs text-muted-foreground">
                    Shown as: &ldquo;Our emergency team will call you within {slaValues.serviceEmergency}
                    &rdquo;
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Contact & Quotation SLAs</CardTitle>
                <CardDescription>
                  Response time promises for contact inquiries and quotation requests
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Mail className="h-3 w-3 text-muted-foreground" />
                    Contact Inquiry Response
                  </Label>
                  <Input
                    value={slaValues.contactResponse}
                    onChange={(e) => updateSLA("contactResponse", e.target.value)}
                    placeholder="e.g. 24-48 hours"
                  />
                  <p className="text-xs text-muted-foreground">
                    Shown to customers and as internal reminder for business notifications
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <FileText className="h-3 w-3 text-muted-foreground" />
                    Quotation Response
                  </Label>
                  <Input
                    value={slaValues.quotationResponse}
                    onChange={(e) => updateSLA("quotationResponse", e.target.value)}
                    placeholder="e.g. 2-5 business days"
                  />
                  <p className="text-xs text-muted-foreground">
                    Time promised to deliver a detailed quotation to the customer
                  </p>
                </div>
              </CardContent>
            </Card>

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
                      Response times are shown in the &ldquo;What Happens Next?&rdquo; section to set clear
                      expectations for when the customer will be contacted.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground text-sm">Business Notifications</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Used in the &ldquo;Next Steps&rdquo; action items and response reminders to ensure your
                      team responds within the promised timeframe.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground text-sm">Emergency Banners</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Emergency SLA appears prominently in alert banners at the top of both customer and
                      business emails for immediate visibility.
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
                          <Badge variant="outline" className="text-xs">
                            Urgency Variants
                          </Badge>
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

          <Card>
            <CardContent className="flex items-center justify-between p-5">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10">
                  <Eye className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">Preview All Templates</p>
                  <p className="text-xs text-muted-foreground">
                    See how each template renders with sample data across urgency levels
                  </p>
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

          <Card className="border-border/50">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="space-y-2 text-xs text-muted-foreground">
                  <p className="font-medium text-foreground text-sm">Configuration Source</p>
                  <p className="leading-relaxed">
                    Company name, address, contact details, brand colors, and email addresses are saved
                    to Strapi and loaded on each page render. Urgency colour schemes and SLA text are still
                    sourced from{" "}
                    <code className="font-mono text-accent">lib/email/config/email-config.ts</code> — Strapi
                    collection types for those are planned for Phase 6.
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
