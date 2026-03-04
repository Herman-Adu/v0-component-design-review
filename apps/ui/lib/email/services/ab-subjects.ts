"use server"

/**
 * A/B Subject Line Store
 *
 * Stores multiple subject line patterns per template. Each variant has a
 * weight (0-100) controlling selection probability. The resolver picks
 * a variant at send-time using weighted random selection.
 *
 * Strapi-ready: migrate to an "ab-subject-variant" collection type
 * with a relation to the email-configuration template entries.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SubjectVariant {
  id: string
  pattern: string
  weight: number
  sends: number
  description?: string
}

export interface TemplateSubjects {
  templateKey: string
  templateLabel: string
  category: "service" | "contact" | "quotation"
  recipientType: "customer" | "business"
  variants: SubjectVariant[]
  isActive: boolean
}

export interface ABStats {
  totalTemplates: number
  activeTemplates: number
  totalVariants: number
  avgVariantsPerTemplate: number
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function genId(): string {
  return `sv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

// ---------------------------------------------------------------------------
// In-memory store -- seeded with defaults matching email-config.tsx
// ---------------------------------------------------------------------------

const store: TemplateSubjects[] = [
  {
    templateKey: "serviceCustomer",
    templateLabel: "Service Customer Confirmation",
    category: "service",
    recipientType: "customer",
    isActive: true,
    variants: [
      { id: genId(), pattern: "Service Request Confirmation - {requestId}", weight: 50, sends: 142, description: "Standard confirmation" },
      { id: genId(), pattern: "We've received your request - {requestId}", weight: 30, sends: 87, description: "Friendlier tone" },
      { id: genId(), pattern: "Your service request {requestId} is confirmed", weight: 20, sends: 56, description: "Direct confirmation" },
    ],
  },
  {
    templateKey: "serviceBusiness",
    templateLabel: "Service Business Notification",
    category: "service",
    recipientType: "business",
    isActive: false,
    variants: [
      { id: genId(), pattern: "New Service Request - {requestId}", weight: 100, sends: 285, description: "Standard notification" },
    ],
  },
  {
    templateKey: "contactCustomer",
    templateLabel: "Contact Customer Confirmation",
    category: "contact",
    recipientType: "customer",
    isActive: true,
    variants: [
      { id: genId(), pattern: "Contact Inquiry Received - {referenceId}", weight: 50, sends: 64, description: "Standard receipt" },
      { id: genId(), pattern: "Thanks for reaching out - {referenceId}", weight: 50, sends: 58, description: "Warmer tone" },
    ],
  },
  {
    templateKey: "contactBusiness",
    templateLabel: "Contact Business Notification",
    category: "contact",
    recipientType: "business",
    isActive: false,
    variants: [
      { id: genId(), pattern: "New Contact Inquiry - {referenceId}", weight: 100, sends: 122 },
    ],
  },
  {
    templateKey: "quotationCustomer",
    templateLabel: "Quotation Customer Confirmation",
    category: "quotation",
    recipientType: "customer",
    isActive: true,
    variants: [
      { id: genId(), pattern: "Quotation Request Received - {requestId}", weight: 40, sends: 38, description: "Standard receipt" },
      { id: genId(), pattern: "Your free quote request {requestId} is being processed", weight: 35, sends: 34, description: "Value-focused" },
      { id: genId(), pattern: "We're preparing your quotation - {requestId}", weight: 25, sends: 22, description: "Active process" },
    ],
  },
  {
    templateKey: "quotationBusiness",
    templateLabel: "Quotation Business Notification",
    category: "quotation",
    recipientType: "business",
    isActive: false,
    variants: [
      { id: genId(), pattern: "New Quotation Request - {requestId}", weight: 100, sends: 94 },
    ],
  },
]

// ---------------------------------------------------------------------------
// Server Actions
// ---------------------------------------------------------------------------

export async function getAllTemplateSubjects(): Promise<TemplateSubjects[]> {
  return store.map((t) => ({ ...t, variants: [...t.variants] }))
}

export async function getTemplateSubjects(templateKey: string): Promise<TemplateSubjects | null> {
  const t = store.find((s) => s.templateKey === templateKey)
  return t ? { ...t, variants: [...t.variants] } : null
}

export async function getABStats(): Promise<ABStats> {
  const totalTemplates = store.length
  const activeTemplates = store.filter((t) => t.isActive).length
  const totalVariants = store.reduce((sum, t) => sum + t.variants.length, 0)
  return {
    totalTemplates,
    activeTemplates,
    totalVariants,
    avgVariantsPerTemplate: totalTemplates > 0 ? Math.round((totalVariants / totalTemplates) * 10) / 10 : 0,
  }
}

export async function addVariant(
  templateKey: string,
  pattern: string,
  weight: number,
  description?: string
): Promise<{ success: boolean; variant?: SubjectVariant; error?: string }> {
  const tmpl = store.find((s) => s.templateKey === templateKey)
  if (!tmpl) return { success: false, error: "Template not found" }
  if (tmpl.variants.length >= 5) return { success: false, error: "Maximum 5 variants per template" }
  if (!pattern.trim()) return { success: false, error: "Pattern cannot be empty" }

  const variant: SubjectVariant = {
    id: genId(),
    pattern: pattern.trim(),
    weight: Math.max(0, Math.min(100, weight)),
    sends: 0,
    description: description?.trim() || undefined,
  }
  tmpl.variants.push(variant)
  return { success: true, variant }
}

export async function updateVariant(
  templateKey: string,
  variantId: string,
  updates: { pattern?: string; weight?: number; description?: string }
): Promise<{ success: boolean; error?: string }> {
  const tmpl = store.find((s) => s.templateKey === templateKey)
  if (!tmpl) return { success: false, error: "Template not found" }
  const variant = tmpl.variants.find((v) => v.id === variantId)
  if (!variant) return { success: false, error: "Variant not found" }

  if (updates.pattern !== undefined) variant.pattern = updates.pattern.trim()
  if (updates.weight !== undefined) variant.weight = Math.max(0, Math.min(100, updates.weight))
  if (updates.description !== undefined) variant.description = updates.description.trim() || undefined

  return { success: true }
}

export async function removeVariant(
  templateKey: string,
  variantId: string
): Promise<{ success: boolean; error?: string }> {
  const tmpl = store.find((s) => s.templateKey === templateKey)
  if (!tmpl) return { success: false, error: "Template not found" }
  if (tmpl.variants.length <= 1) return { success: false, error: "Must have at least 1 variant" }
  tmpl.variants = tmpl.variants.filter((v) => v.id !== variantId)
  return { success: true }
}

export async function toggleABActive(
  templateKey: string
): Promise<{ success: boolean; isActive?: boolean; error?: string }> {
  const tmpl = store.find((s) => s.templateKey === templateKey)
  if (!tmpl) return { success: false, error: "Template not found" }
  tmpl.isActive = !tmpl.isActive
  return { success: true, isActive: tmpl.isActive }
}

/**
 * Resolve a subject line for a template using weighted random selection.
 * This would be called at send-time by the email services.
 */
export async function resolveSubject(
  templateKey: string,
  variables: Record<string, string>
): Promise<{ subject: string; variantId: string }> {
  const tmpl = store.find((s) => s.templateKey === templateKey)
  if (!tmpl || !tmpl.isActive || tmpl.variants.length === 0) {
    // Fallback -- return first variant pattern or empty
    const fallback = tmpl?.variants[0]
    return {
      subject: fallback ? replaceVars(fallback.pattern, variables) : "",
      variantId: fallback?.id || "",
    }
  }

  // Weighted random
  const totalWeight = tmpl.variants.reduce((sum, v) => sum + v.weight, 0)
  let rand = Math.random() * totalWeight
  let selected = tmpl.variants[0]

  for (const v of tmpl.variants) {
    rand -= v.weight
    if (rand <= 0) {
      selected = v
      break
    }
  }

  selected.sends++

  return {
    subject: replaceVars(selected.pattern, variables),
    variantId: selected.id,
  }
}

function replaceVars(pattern: string, vars: Record<string, string>): string {
  let result = pattern
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, "g"), value)
  }
  return result
}
