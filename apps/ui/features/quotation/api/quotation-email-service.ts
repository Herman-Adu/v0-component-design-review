"use server"

import { Resend } from "resend"
import { generateQuotationCustomerEmail } from "./templates/quotation-customer-html"
import { generateQuotationBusinessEmail } from "./templates/quotation-business-html"
import type { CompleteQuotationInput } from "../schemas/quotation-schemas"
import { logDelivery } from "@/lib/email/services/delivery-log"

function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY environment variable is not set")
  }
  return new Resend(process.env.RESEND_API_KEY)
}

export type EmailResult = { success: true; messageId: string } | { success: false; error: string }

interface SendEmailsParams {
  formData: CompleteQuotationInput
  requestId: string
}

export async function sendQuotationRequestEmails({ formData, requestId }: SendEmailsParams): Promise<{
  customerEmail: EmailResult
  businessEmail: EmailResult
}> {
  const submittedAt = new Date().toISOString()

  // Send customer confirmation email
  const customerEmailResult = await sendQuotationCustomerEmail({
    to: formData.contact.email,
    customerName: formData.contact.fullName,
    company: formData.contact.company,
    requestId,
    projectCategory: formData.projectType.projectCategory,
    projectType: formData.projectType.projectType,
    budgetRange: formData.budget.budgetRange,
    timeline: formData.budget.timeline,
  })

  // Send business notification email
  const businessEmailResult = await sendQuotationBusinessEmail({
    requestId,
    submittedAt,
    formData,
  })

  return {
    customerEmail: customerEmailResult,
    businessEmail: businessEmailResult,
  }
}

async function sendQuotationCustomerEmail(props: {
  to: string
  customerName: string
  company?: string
  requestId: string
  projectCategory: string
  projectType: string
  budgetRange: string
  timeline: string
}): Promise<EmailResult> {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error("[email] RESEND_API_KEY is not set")
      return {
        success: false,
        error: "Email service not configured. Please add RESEND_API_KEY environment variable.",
      }
    }

    const resend = getResendClient()
    
    const htmlContent = generateQuotationCustomerEmail(props)

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_QUOTATION_FROM || process.env.EMAIL_FROM || "noreply@electricalservices.com",
      to: props.to,
      subject: `Quotation Request Received - ${props.requestId}`,
      html: htmlContent,
    })

    const quotFrom = process.env.EMAIL_QUOTATION_FROM || process.env.EMAIL_FROM || "noreply@electricalservices.com"
    const quotSubject = `Quotation Request Received - ${props.requestId}`

    if (error) {
      console.error("[email] Customer email error:", error)
      await logDelivery({
        category: "quotation",
        recipientType: "customer",
        templateName: "Quotation Customer Confirmation",
        from: quotFrom,
        to: props.to,
        subject: quotSubject,
        status: "failed",
        error: error.message || "Failed to send customer email",
        metadata: { requestId: props.requestId, customerName: props.customerName },
      })
      return {
        success: false,
        error: error.message || "Failed to send customer email",
      }
    }

    await logDelivery({
      category: "quotation",
      recipientType: "customer",
      templateName: "Quotation Customer Confirmation",
      from: quotFrom,
      to: props.to,
      subject: quotSubject,
      status: "sent",
      resendId: data?.id,
      metadata: { requestId: props.requestId, customerName: props.customerName },
    })

    return {
      success: true,
      messageId: data?.id || "unknown",
    }
  } catch (error) {
    console.error("[email] Customer email exception:", error)
    await logDelivery({
      category: "quotation",
      recipientType: "customer",
      templateName: "Quotation Customer Confirmation",
      from: process.env.EMAIL_QUOTATION_FROM || process.env.EMAIL_FROM || "noreply@electricalservices.com",
      to: props.to,
      subject: `Quotation Request - ${props.requestId}`,
      status: "failed",
      error: error instanceof Error ? error.message : "Unknown error",
      metadata: { requestId: props.requestId, customerName: props.customerName },
    })
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error sending customer email",
    }
  }
}

async function sendQuotationBusinessEmail(props: {
  requestId: string
  submittedAt: string
  formData: CompleteQuotationInput
}): Promise<EmailResult> {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error("[email] RESEND_API_KEY is not set")
      return {
        success: false,
        error: "Email service not configured",
      }
    }

    const resend = getResendClient()
    
    const htmlContent = generateQuotationBusinessEmail(props)

    const isUrgent = props.formData.budget.timeline === "urgent"

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_QUOTATION_FROM || process.env.EMAIL_FROM || "noreply@electricalservices.com",
      to: process.env.BUSINESS_EMAIL || "admin@electricalservices.com",
      subject: isUrgent
        ? `URGENT QUOTATION REQUEST - ${props.requestId}`
        : `New Quotation Request - ${props.requestId}`,
      html: htmlContent,
    })

    const bizTo = process.env.BUSINESS_EMAIL || "admin@electricalservices.com"
    const bizFrom = process.env.EMAIL_QUOTATION_FROM || process.env.EMAIL_FROM || "noreply@electricalservices.com"
    const bizSubject = isUrgent ? `URGENT QUOTATION REQUEST - ${props.requestId}` : `New Quotation Request - ${props.requestId}`

    if (error) {
      console.error("[email] Business email error:", error)
      await logDelivery({
        category: "quotation",
        recipientType: "business",
        templateName: "Quotation Business Notification",
        from: bizFrom,
        to: bizTo,
        subject: bizSubject,
        status: "failed",
        error: error.message || "Failed to send business email",
        metadata: { requestId: props.requestId, customerName: props.formData.contact.fullName },
      })
      return {
        success: false,
        error: error.message || "Failed to send business email",
      }
    }

    await logDelivery({
      category: "quotation",
      recipientType: "business",
      templateName: "Quotation Business Notification",
      from: bizFrom,
      to: bizTo,
      subject: bizSubject,
      status: "sent",
      resendId: data?.id,
      metadata: { requestId: props.requestId, customerName: props.formData.contact.fullName },
    })

    return {
      success: true,
      messageId: data?.id || "unknown",
    }
  } catch (error) {
    console.error("[email] Business email exception:", error)
    await logDelivery({
      category: "quotation",
      recipientType: "business",
      templateName: "Quotation Business Notification",
      from: process.env.EMAIL_QUOTATION_FROM || process.env.EMAIL_FROM || "noreply@electricalservices.com",
      to: process.env.BUSINESS_EMAIL || "admin@electricalservices.com",
      subject: `Quotation Request - ${props.requestId}`,
      status: "failed",
      error: error instanceof Error ? error.message : "Unknown error",
      metadata: { requestId: props.requestId, customerName: props.formData.contact.fullName },
    })
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error sending business email",
    }
  }
}
