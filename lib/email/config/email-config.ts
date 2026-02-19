/**
 * Email Configuration Module
 *
 * Centralised brand, colour, SLA, and template configuration for all
 * transactional email templates (service-request, quotation, contact,
 * continuation).  Every email template imports from this single source
 * of truth so that brand changes propagate automatically.
 *
 * Phase 3 (Strapi): This file will be replaced by a CMS-driven config
 * fetched at build / runtime from the `email-configuration` single-type.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type UrgencyLevel = "routine" | "urgent" | "emergency"

interface UrgencyColorSet {
  headerGradient: { start: string; end: string }
  badgeBg: string
  badgeText: string
  cardBg: string
  cardBorder: string
}

// ---------------------------------------------------------------------------
// Company Details
// ---------------------------------------------------------------------------

export const COMPANY = {
  name: "Herman Electrical Services",
  tagline: "Professional Electrical Solutions You Can Trust",
  legalName: "Herman Electrical Services Ltd",
  address: {
    line1: "123 High Street",
    city: "London",
    postcode: "E1 6AN",
    full: "123 High Street, London, E1 6AN",
  },
  phone: {
    primary: "+44 20 7946 0958",
    local: "020 7946 0958",
  },
  email: {
    support: "support@hermanelectrical.co.uk",
    info: "info@hermanelectrical.co.uk",
    noreply: "noreply@hermanelectrical.co.uk",
  },
  website: "https://hermanelectrical.co.uk",
} as const

// ---------------------------------------------------------------------------
// Brand Colors
// ---------------------------------------------------------------------------

export const BRAND_COLORS = {
  // Primary palette
  primary: "#f59e0b",
  primaryLight: "#fcd34d",
  primaryDark: "#d97706",

  // Header gradient
  headerGradient: {
    start: "#18181b",
    end: "#27272a",
  },

  // Backgrounds
  bgBody: "#f4f4f5",
  bgBodyAlt: "#f9fafb",
  bgCard: "#ffffff",
  bgCardMuted: "#f9fafb",
  bgCardMutedAlt: "#fafafa",

  // Text
  textWhite: "#ffffff",
  textDark: "#18181b",
  textMuted: "#52525b",
  textLight: "#71717a",
  textLighter: "#a1a1aa",

  // Borders
  borderDefault: "#e4e4e7",
  borderLight: "#f4f4f5",

  // Info / accent blues (used in business notification templates)
  infoBlueBg: "#eff6ff",
  infoBlue: "#3b82f6",
  infoBlueText: "#1e40af",
  infoBlueDark: "#1e3a5f",
} as const

// ---------------------------------------------------------------------------
// Urgency Color Sets
// ---------------------------------------------------------------------------

export const URGENCY_COLORS: Record<UrgencyLevel, UrgencyColorSet> = {
  routine: {
    headerGradient: { start: "#18181b", end: "#27272a" },
    badgeBg: "#dcfce7",
    badgeText: "#166534",
    cardBg: "#f9fafb",
    cardBorder: "#e4e4e7",
  },
  urgent: {
    headerGradient: { start: "#78350f", end: "#92400e" },
    badgeBg: "#fef3c7",
    badgeText: "#b45309",
    cardBg: "#fffbeb",
    cardBorder: "#fcd34d",
  },
  emergency: {
    headerGradient: { start: "#7f1d1d", end: "#991b1b" },
    badgeBg: "#fee2e2",
    badgeText: "#dc2626",
    cardBg: "#fef2f2",
    cardBorder: "#fca5a5",
  },
}

// ---------------------------------------------------------------------------
// SLA Configuration
// ---------------------------------------------------------------------------

export const SLA = {
  service: {
    routine: {
      time: "24 hours",
      description:
        "Our team will review your request and contact you within 24 hours to confirm your appointment",
      businessAction:
        "Review request and contact customer within 24 hours",
    },
    urgent: {
      time: "4 hours",
      description:
        "Your request has been marked as urgent. Our team will prioritise this and contact you within 4 hours",
      businessAction:
        "Prioritise and contact customer within 4 hours",
    },
    emergency: {
      time: "1 hour",
      description:
        "Our emergency response team has been notified and will contact you within 1 hour",
      businessAction:
        "EMERGENCY: Contact customer immediately, within 1 hour maximum",
    },
  },
  contact: {
    response: "24 hours",
    description:
      "Our team will review your inquiry and respond within 24 hours",
    businessAction:
      "Please respond to this inquiry within 24 hours",
  },
  quotation: {
    response: "48 hours",
    description:
      "You will receive a detailed quotation within 48 hours of our initial assessment",
    businessAction:
      "Review this quotation request and respond within 48 hours",
  },
} as const

// ---------------------------------------------------------------------------
// Template Metadata
// ---------------------------------------------------------------------------

export const TEMPLATE_CONFIG = {
  serviceCustomer: {
    subject: (requestId: string) =>
      `Service Request Confirmation - ${requestId}`,
    fromName: COMPANY.name,
    replyTo: COMPANY.email.support,
  },
  serviceBusiness: {
    subject: (requestId: string, urgency: string) =>
      urgency === "emergency"
        ? `EMERGENCY Service Request - ${requestId}`
        : urgency === "urgent"
          ? `URGENT Service Request - ${requestId}`
          : `New Service Request - ${requestId}`,
    fromName: "Website Notifications",
    replyTo: COMPANY.email.info,
  },
  contactCustomer: {
    subject: (referenceId: string) =>
      `We've received your message - ${referenceId}`,
    fromName: COMPANY.name,
    replyTo: COMPANY.email.support,
  },
  contactBusiness: {
    subject: (referenceId: string, priority: string) =>
      priority === "urgent"
        ? `URGENT Contact Inquiry - ${referenceId}`
        : `New Contact Inquiry - ${referenceId}`,
    fromName: "Website Notifications",
    replyTo: COMPANY.email.info,
  },
  quotationCustomer: {
    subject: (requestId: string) =>
      `Quotation Request Received - ${requestId}`,
    fromName: COMPANY.name,
    replyTo: COMPANY.email.support,
  },
  quotationBusiness: {
    subject: (requestId: string, isUrgent: boolean) =>
      isUrgent
        ? `URGENT Quotation Request - ${requestId}`
        : `New Quotation Request - ${requestId}`,
    fromName: "Website Notifications",
    replyTo: COMPANY.email.info,
  },
} as const

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

/**
 * Returns a CSS linear-gradient string for the email header based on urgency.
 */
export function getHeaderGradient(urgency: UrgencyLevel): string {
  const colors = URGENCY_COLORS[urgency].headerGradient
  return `linear-gradient(135deg, ${colors.start} 0%, ${colors.end} 100%)`
}

/**
 * Returns the default (routine) header gradient.
 */
export function getDefaultHeaderGradient(): string {
  return `linear-gradient(135deg, ${BRAND_COLORS.headerGradient.start} 0%, ${BRAND_COLORS.headerGradient.end} 100%)`
}

/**
 * Returns an inline CSS string for an urgency badge.
 */
export function getUrgencyBadgeStyle(urgency: UrgencyLevel): string {
  const colors = URGENCY_COLORS[urgency]
  return `display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 700; background-color: ${colors.badgeBg}; color: ${colors.badgeText};`
}

/**
 * Returns an inline CSS string for an urgency card container.
 */
export function getUrgencyCardStyle(urgency: UrgencyLevel): string {
  const colors = URGENCY_COLORS[urgency]
  const borderWidth = urgency === "routine" ? "1px" : "2px"
  return `background-color: ${colors.cardBg}; border: ${borderWidth} solid ${colors.cardBorder};`
}

/**
 * Returns the contact info HTML block used across customer-facing templates.
 */
export function getContactInfoHtml(): string {
  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 16px 0;">
      <tr>
        <td style="padding: 6px 0; color: ${BRAND_COLORS.textLight}; font-size: 14px;">
          Phone: <strong style="color: ${BRAND_COLORS.textDark};">${COMPANY.phone.local}</strong>
        </td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: ${BRAND_COLORS.textLight}; font-size: 14px;">
          Email: <strong style="color: ${BRAND_COLORS.textDark};">${COMPANY.email.support}</strong>
        </td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: ${BRAND_COLORS.textLight}; font-size: 14px;">
          Website: <strong style="color: ${BRAND_COLORS.textDark};">${COMPANY.website}</strong>
        </td>
      </tr>
    </table>`
}

/**
 * Returns the email footer HTML for customer or business recipients.
 */
export function getFooterHtml(recipient: "customer" | "business"): string {
  const year = new Date().getFullYear()

  if (recipient === "business") {
    return `
      <td style="background-color: ${BRAND_COLORS.headerGradient.start}; padding: 24px 40px; text-align: center;">
        <p style="margin: 0; color: ${BRAND_COLORS.textLighter}; font-size: 12px;">
          This is an automated notification from your website.
        </p>
        <p style="margin: 8px 0 0; color: ${BRAND_COLORS.textLighter}; font-size: 11px;">
          &copy; ${year} ${COMPANY.legalName}
        </p>
      </td>`
  }

  return `
    <td style="background-color: ${BRAND_COLORS.headerGradient.start}; padding: 32px 40px; text-align: center;">
      <p style="margin: 0 0 8px; color: ${BRAND_COLORS.primaryLight}; font-size: 14px; font-weight: 600;">
        ${COMPANY.name}
      </p>
      <p style="margin: 0 0 4px; color: ${BRAND_COLORS.textLighter}; font-size: 12px;">
        ${COMPANY.address.full}
      </p>
      <p style="margin: 0 0 16px; color: ${BRAND_COLORS.textLighter}; font-size: 12px;">
        ${COMPANY.phone.local} | ${COMPANY.email.support}
      </p>
      <p style="margin: 0; color: ${BRAND_COLORS.textLighter}; font-size: 11px;">
        &copy; ${year} ${COMPANY.legalName}. All rights reserved.
      </p>
      <p style="margin: 8px 0 0; color: ${BRAND_COLORS.textLighter}; font-size: 11px;">
        This email was sent in response to your request. Please do not reply directly to this email.
      </p>
    </td>`
}
