"use server"

/**
 * Continuation Email Send Service
 *
 * Server action that generates a branded continuation email using the
 * continuation template, sends it via Resend, logs delivery via
 * delivery-log, and records correspondence + activity in job-management.
 *
 * Pattern follows the existing email-service.ts approach.
 */

import { Resend } from "resend"
import {
  generateContinuationEmail,
  generateContinuationEmailPlainText,
  type ContentSection,
} from "../templates/continuation-email-html"
import { COMPANY } from "../config/email-config"
import type { UrgencyLevel } from "../config/email-config"
import { logDelivery } from "./delivery-log"
import { addCorrespondence } from "./job-management"
import type { FormType, JobPriority } from "./job-management.types"
import type {
  SendContinuationEmailParams,
  SendContinuationEmailResult,
} from "./continuation-email-service.types"

// ---------------------------------------------------------------------------
// Resend client (same pattern as email-service.ts)
// ---------------------------------------------------------------------------

function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY environment variable is not set")
  }
  return new Resend(process.env.RESEND_API_KEY)
}

// ---------------------------------------------------------------------------
// Map form type to email category for delivery log
// ---------------------------------------------------------------------------

function getCategoryFromFormType(formType: FormType): "service" | "contact" | "quotation" {
  return formType
}

// ---------------------------------------------------------------------------
// Main send function
// ---------------------------------------------------------------------------

export async function sendContinuationEmail(
  params: SendContinuationEmailParams
): Promise<SendContinuationEmailResult> {
  const {
    jobId,
    requestId,
    formType,
    clientName,
    clientEmail,
    subject,
    priority,
    urgency,
    greeting,
    sections,
    signOff,
    includeContactInfo,
    senderName = "Admin",
  } = params

  const emailSubject = subject.startsWith("RE:") ? subject : `RE: ${subject}`
  const fromAddress = process.env.EMAIL_FROM || "noreply@electricalservices.com"

  // Generate branded HTML + plain text
  const htmlContent = generateContinuationEmail({
    formType,
    requestId,
    clientName,
    subject: emailSubject,
    priority,
    urgency,
    greeting,
    sections,
    signOff,
    includeContactInfo,
  })

  const textContent = generateContinuationEmailPlainText({
    formType,
    requestId,
    clientName,
    subject: emailSubject,
    sections,
    greeting,
    signOff,
    includeContactInfo,
  })

  // Build a readable body summary for the correspondence log
  const bodySummary = sections
    .map((s) => `[${s.label}]\n${s.content}`)
    .join("\n\n")

  try {
    if (!process.env.RESEND_API_KEY) {
      console.error("[email] RESEND_API_KEY is not set -- recording correspondence without sending")

      // Still record the correspondence so the admin sees it in the thread
      await addCorrespondence(jobId, {
        direction: "outbound",
        from: fromAddress,
        to: clientEmail,
        subject: emailSubject,
        body: bodySummary,
        emailType: "continuation",
      }, senderName)

      return {
        success: false,
        error: "Email service not configured. Correspondence recorded but email not sent. Please add RESEND_API_KEY.",
        htmlContent,
      }
    }

    const resend = getResendClient()

    const { data, error } = await resend.emails.send({
      from: `${COMPANY.name} <${fromAddress}>`,
      to: clientEmail,
      subject: emailSubject,
      html: htmlContent,
      text: textContent,
      replyTo: COMPANY.email.support,
    })
    if (error) {
      console.error("[email] Continuation email error:", error)

      // Log failed delivery
      await logDelivery({
        category: getCategoryFromFormType(formType),
        recipientType: "customer",
        templateName: "Continuation Email",
        from: fromAddress,
        to: clientEmail,
        subject: emailSubject,
        status: "failed",
        error: error.message || "Failed to send continuation email",
        metadata: {
          requestId,
          customerName: clientName,
        },
      })

      // Still record in correspondence so thread is complete
      await addCorrespondence(jobId, {
        direction: "outbound",
        from: fromAddress,
        to: clientEmail,
        subject: emailSubject,
        body: `[SEND FAILED] ${bodySummary}`,
        emailType: "continuation",
      }, senderName)

      return {
        success: false,
        error: error.message || "Failed to send continuation email",
        htmlContent,
      }
    }

    // Log successful delivery
    await logDelivery({
      category: getCategoryFromFormType(formType),
      recipientType: "customer",
      templateName: "Continuation Email",
      from: fromAddress,
      to: clientEmail,
      subject: emailSubject,
      status: "sent",
      resendId: data?.id,
      metadata: {
        requestId,
        customerName: clientName,
      },
    })

    // Record in correspondence thread (also creates activity entry automatically)
    await addCorrespondence(jobId, {
      direction: "outbound",
      from: fromAddress,
      to: clientEmail,
      subject: emailSubject,
      body: bodySummary,
      emailType: "continuation",
    }, senderName)

    return {
      success: true,
      messageId: data?.id || "unknown",
      htmlContent,
    }
  } catch (error) {
    console.error("[email] Continuation email exception:", error)

    await logDelivery({
      category: getCategoryFromFormType(formType),
      recipientType: "customer",
      templateName: "Continuation Email",
      from: fromAddress,
      to: clientEmail,
      subject: emailSubject,
      status: "failed",
      error: error instanceof Error ? error.message : "Unknown error",
      metadata: {
        requestId,
        customerName: clientName,
      },
    })

    // Record failed attempt in correspondence
    await addCorrespondence(jobId, {
      direction: "outbound",
      from: fromAddress,
      to: clientEmail,
      subject: emailSubject,
      body: `[SEND FAILED] ${bodySummary}`,
      emailType: "continuation",
    }, senderName)

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error sending continuation email",
      htmlContent,
    }
  }
}

// ---------------------------------------------------------------------------
// Preview-only function (generates HTML without sending)
// ---------------------------------------------------------------------------

export async function previewContinuationEmail(
  params: Omit<SendContinuationEmailParams, "jobId" | "senderName">
): Promise<string> {
  return generateContinuationEmail({
    formType: params.formType,
    requestId: params.requestId,
    clientName: params.clientName,
    subject: params.subject.startsWith("RE:") ? params.subject : `RE: ${params.subject}`,
    priority: params.priority,
    urgency: params.urgency,
    greeting: params.greeting,
    sections: params.sections,
    signOff: params.signOff,
    includeContactInfo: params.includeContactInfo,
  })
}
