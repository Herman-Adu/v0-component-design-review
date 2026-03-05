"use server"

import { generateCustomerConfirmationEmail } from "@/features/service-request/api/templates/customer-confirmation-html"
import { generateBusinessNotificationEmail } from "@/features/service-request/api/templates/business-notification-html"
import { generateContactCustomerEmail } from "@/features/contact/api/templates/contact-customer-html"
import { generateContactBusinessEmail } from "@/features/contact/api/templates/contact-business-html"
import { generateQuotationCustomerEmail } from "@/features/quotation/api/templates/quotation-customer-html"
import { generateQuotationBusinessEmail } from "@/features/quotation/api/templates/quotation-business-html"
import type { EmailTemplate } from "./action.types"
import { buildEmailConfig } from "@/lib/email/config/email-config-builder"

export async function renderEmailPreview(
  template: EmailTemplate | "customer" | "business",
  urgency: "routine" | "urgent" | "emergency" = "routine",
): Promise<{ html: string; error?: string }> {
  try {
    // Backwards compatibility: map old template names
    const resolvedTemplate: EmailTemplate =
      template === "customer" ? "service-customer" :
      template === "business" ? "service-business" :
      template

    const html = await generateTemplateHtml(resolvedTemplate, urgency)
    return { html }
  } catch (error) {
    console.error("[email] Error rendering template:", error)
    return {
      html: "",
      error: error instanceof Error ? error.message : "Unknown error rendering email",
    }
  }
}

async function generateTemplateHtml(
  template: EmailTemplate,
  urgency: "routine" | "urgent" | "emergency",
): Promise<string> {
  const config = await buildEmailConfig()
  const now = new Date()
  const futureDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
  const altDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()

  switch (template) {
    case "service-customer":
      return generateCustomerConfirmationEmail({
        customerName: "John Smith",
        requestId: "SR-2024-0847",
        serviceType: "Electrical Installation",
        urgency,
        preferredDate: futureDate,
        preferredTimeSlot: "Morning (9am - 12pm)",
        address: "42 Electric Avenue",
        city: "London",
        postcode: "SW11 5NT",
        config,
      })

    case "service-business":
      return generateBusinessNotificationEmail({
        requestId: "SR-2024-0847",
        customerName: "John Smith",
        customerEmail: "john.smith@example.com",
        customerPhone: "07123 456 789",
        serviceType: "Electrical Installation",
        urgency,
        description:
          urgency === "emergency"
            ? "No power in the building - complete electrical failure. Need immediate assistance!"
            : urgency === "urgent"
              ? "Intermittent power outages in multiple rooms. Happening more frequently, need attention soon."
              : "Need to install additional power outlets in the living room and update the circuit breaker panel.",
        preferredDate: futureDate,
        preferredTimeSlot: "Morning (9am - 12pm)",
        alternativeDate: altDate,
        address: "42 Electric Avenue",
        city: "London",
        county: "Greater London",
        postcode: "SW11 5NT",
        propertyType: "Residential - Detached House",
        accessInstructions: "Please use the side gate to access the property. Ring the doorbell twice.",
        flexibleScheduling: true,
        submittedAt: now.toISOString(),
        config,
      })

    case "contact-customer":
      return generateContactCustomerEmail({
        customerName: "Sarah Johnson",
        referenceId: "CQ-2024-0312",
        subject: "Question about commercial electrical upgrades",
        inquiryType: "general-inquiry",
        config,
      })

    case "contact-business":
      return generateContactBusinessEmail({
        referenceId: "CQ-2024-0312",
        customerName: "Sarah Johnson",
        customerEmail: "sarah.johnson@techcorp.com",
        customerPhone: "07890 123 456",
        company: "TechCorp Ltd",
        inquiryType: "general-inquiry",
        sector: "commercial",
        priority: "normal",
        hasExistingReference: false,
        subject: "Question about commercial electrical upgrades",
        message: "We are looking to upgrade the electrical systems in our office building. We need modern LED lighting throughout, additional power circuits for server rooms, and EV charging points in the car park. Could you provide a consultation?",
        preferredContactMethod: "email",
        bestTimeToContact: "afternoon",
        newsletterOptIn: true,
        config,
      })

    case "quotation-customer":
      return generateQuotationCustomerEmail({
        customerName: "David Williams",
        company: "Williams Construction",
        requestId: "QR-2024-0156",
        projectCategory: "commercial",
        projectType: "full-rewire",
        budgetRange: "50k-100k",
        timeline: "3-6-months",
        config,
      })

    case "quotation-business":
      return generateQuotationBusinessEmail({
        requestId: "QR-2024-0156",
        submittedAt: now.toISOString(),
        formData: {
          contact: {
            fullName: "David Williams",
            email: "d.williams@williamsconstruction.co.uk",
            phone: "0161 456 7890",
            company: "Williams Construction",
          },
          projectType: {
            projectCategory: "commercial",
            projectType: "office-fit-out",
            propertyType: "warehouse",
          },
          scope: {
            projectDescription: "Complete electrical rewiring of a 3-storey office building including new consumer units, fire alarm integration, emergency lighting, and Cat6 data cabling throughout. Building will remain partially occupied during works.",
            estimatedSize: "very-large",
            services: ["electrical-installation", "data-cabling", "fire-alarm", "emergency-lighting", "testing-certification"],
            hasDrawings: true,
            needsDesign: false,
          },
          site: {
            addressLine1: "15 Innovation Park, Business Quarter",
            city: "Manchester",
            county: "Greater Manchester",
            postcode: "M1 4BT",
            siteAccessNotes: "Loading bay access only before 7am. Main entrance available 8am-6pm.",
            hasExistingElectrical: true,
            requiresAsbestosSurvey: false,
          },
          budget: {
            budgetRange: "50k-100k",
            timeline: "3-6-months",
            preferredStartDate: futureDate,
            flexibleOnBudget: false,
            flexibleOnTimeline: true,
          },
          additional: {
            complianceRequirements: ["bs7671", "fire-regulations", "health-safety"],
            specialRequirements: "Building will remain partially occupied during works. Need to schedule noisy work outside business hours.",
            preferredContactMethod: "phone",
            howDidYouHear: "referral",
            marketingConsent: true,
            termsAccepted: true,
          },
        },
        config,
      })

    default:
      throw new Error(`Unknown template: ${template}`)
  }
}
