"use server"

import { headers } from "next/headers"
import { completeQuotationSchema, type CompleteQuotationInput } from "../schemas/quotation-schemas"
import { sanitizeInput } from "@/lib/sanitize/input-sanitizer"
import { sendQuotationRequestEmails } from "./quotation-email-service"
import { rateLimiters, getClientIdentifier } from "@/lib/security/rate-limiter"
import { securityCheck } from "@/lib/security/csrf"
import type { ActionResult } from "@/lib/actions/action.types"

export async function submitQuotationRequest(formData: unknown): Promise<ActionResult<{ requestId: string }>> {
  try {
    // Security checks
    const security = await securityCheck({ validateOriginHeader: true })
    if (!security.valid) {
      return {
        success: false,
        error: security.error || "Security validation failed.",
      }
    }

    // Rate limiting
    const headersList = await headers()
    const clientId = getClientIdentifier(headersList)
    const rateLimitResult = rateLimiters.quotationRequest.check(clientId)
    
    if (!rateLimitResult.allowed) {
      return {
        success: false,
        error: "Too many requests. Please wait a few minutes before trying again.",
      }
    }

    // Honeypot check
    if (formData && typeof formData === "object" && "website" in formData) {
      const hp = (formData as Record<string, unknown>).website
      if (hp && typeof hp === "string" && hp.length > 0) {
        return { success: true, data: { requestId: `QR-${Date.now()}-BLOCKED` } }
      }
    }

    const sanitizedData = sanitizeQuotationFormData(formData)

    const validationResult = completeQuotationSchema.safeParse(sanitizedData)

    if (!validationResult.success) {
      const fieldErrors: Record<string, string[]> = {}
      validationResult.error.issues.forEach((issue) => {
        const path = issue.path.join(".")
        if (!fieldErrors[path]) {
          fieldErrors[path] = []
        }
        fieldErrors[path].push(issue.message)
      })

      return {
        success: false,
        error: "Validation failed: " + validationResult.error.issues.map(i => `${i.path.join(".")}: ${i.message}`).join(", "),
        fieldErrors,
      }
    }

    const uuid = crypto.randomUUID().split("-")[0].toUpperCase()
    const timestamp = Date.now().toString(36).toUpperCase()
    const requestId = `QR-${timestamp}-${uuid}`

    const emailResults = await sendQuotationRequestEmails({
      formData: validationResult.data,
      requestId,
    })



    return {
      success: true,
      data: { requestId },
    }
  } catch (error) {
    console.error("[action] Quotation action error:", error)
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    }
  }
}

function sanitizeQuotationFormData(data: unknown): unknown {
  if (!data || typeof data !== "object") {
    return data
  }

  const formData = data as Record<string, any>

  return {
    contact: {
      fullName: sanitizeInput.text(formData.contact?.fullName || ""),
      email: sanitizeInput.email(formData.contact?.email || ""),
      phone: sanitizeInput.phone(formData.contact?.phone || ""),
      company: formData.contact?.company ? sanitizeInput.text(formData.contact.company) : undefined,
    },
    projectType: {
      projectCategory: formData.projectType?.projectCategory || "",
      projectType: formData.projectType?.projectType || "",
      propertyType: formData.projectType?.propertyType || "",
    },
    scope: {
      projectDescription: sanitizeInput.text(formData.scope?.projectDescription || ""),
      estimatedSize: formData.scope?.estimatedSize || "",
      services: Array.isArray(formData.scope?.services) ? formData.scope.services : [],
      hasDrawings: Boolean(formData.scope?.hasDrawings),
      needsDesign: Boolean(formData.scope?.needsDesign),
    },
    site: {
      addressLine1: sanitizeInput.address(formData.site?.addressLine1 || ""),
      addressLine2: formData.site?.addressLine2 ? sanitizeInput.address(formData.site.addressLine2) : undefined,
      city: sanitizeInput.text(formData.site?.city || ""),
      county: formData.site?.county ? sanitizeInput.text(formData.site.county) : undefined,
      postcode: sanitizeInput.postcode(formData.site?.postcode || ""),
      siteAccessNotes: formData.site?.siteAccessNotes ? sanitizeInput.text(formData.site.siteAccessNotes) : undefined,
      hasExistingElectrical: Boolean(formData.site?.hasExistingElectrical ?? true),
      requiresAsbestosSurvey: Boolean(formData.site?.requiresAsbestosSurvey),
    },
    budget: {
      budgetRange: formData.budget?.budgetRange || "",
      timeline: formData.budget?.timeline || "",
      preferredStartDate: formData.budget?.preferredStartDate || undefined,
      flexibleOnBudget: Boolean(formData.budget?.flexibleOnBudget),
      flexibleOnTimeline: Boolean(formData.budget?.flexibleOnTimeline ?? true),
    },
    additional: {
      complianceRequirements: Array.isArray(formData.additional?.complianceRequirements) 
        ? formData.additional.complianceRequirements 
        : [],
      specialRequirements: formData.additional?.specialRequirements 
        ? sanitizeInput.text(formData.additional.specialRequirements) 
        : undefined,
      preferredContactMethod: formData.additional?.preferredContactMethod || "",
      howDidYouHear: formData.additional?.howDidYouHear || undefined,
      marketingConsent: Boolean(formData.additional?.marketingConsent),
      termsAccepted: Boolean(formData.additional?.termsAccepted),
    },
  }
}
