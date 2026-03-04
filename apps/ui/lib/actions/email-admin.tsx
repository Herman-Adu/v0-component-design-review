"use server"

import { Resend } from "resend"
import { logDelivery } from "@/lib/email/services/delivery-log"
import type { EnvVarStatus, ResendHealth, EmailHealthReport, TestSendResult } from "./action.types"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Masks a non-secret value -- shows partial content for identification */
function maskValue(value: string | undefined): string {
  if (!value) return ""
  if (value.includes("@")) {
    // Email: show first 2 chars + domain (e.g. no****@example.com)
    const [local, domain] = value.split("@")
    return local.slice(0, 2) + "****@" + domain
  }
  if (value.length <= 6) return value.slice(0, 1) + "****"
  return value.slice(0, 3) + "****" + value.slice(-2)
}

/** Masks a secret value -- shows minimal info, never enough to reconstruct */
function maskSecret(value: string | undefined): string {
  if (!value) return ""
  // Only reveal first 3 characters (the prefix, e.g. "re_") and total length
  const prefix = value.slice(0, 3)
  return `${prefix}${"*".repeat(Math.min(value.length - 3, 20))}`
}

// ---------------------------------------------------------------------------
// Health check action
// ---------------------------------------------------------------------------

export async function getEmailHealthReport(): Promise<EmailHealthReport> {
  const envVarDefs: { key: string; label: string; description: string; required: boolean; secret: boolean; fallback?: string }[] = [
    {
      key: "RESEND_API_KEY",
      label: "Resend API Key",
      description: "Required for all email delivery. Obtain from resend.com/api-keys",
      required: true,
      secret: true,
    },
    {
      key: "EMAIL_FROM",
      label: "Default From Address",
      description: "Default sender address for service request emails",
      required: true,
      secret: false,
      fallback: "noreply@electricalservices.com",
    },
    {
      key: "BUSINESS_EMAIL",
      label: "Business Notification Email",
      description: "Receives all internal business notification emails",
      required: true,
      secret: false,
      fallback: "admin@electricalservices.com",
    },
    {
      key: "EMAIL_CONTACT_FROM",
      label: "Contact Form From Address",
      description: "Sender address for contact form emails. Falls back to EMAIL_FROM",
      required: false,
      secret: false,
      fallback: "EMAIL_FROM",
    },
    {
      key: "EMAIL_QUOTATION_FROM",
      label: "Quotation Form From Address",
      description: "Sender address for quotation form emails. Falls back to EMAIL_FROM",
      required: false,
      secret: false,
      fallback: "EMAIL_FROM",
    },
  ]

  const envVars: EnvVarStatus[] = envVarDefs.map((def) => {
    const value = process.env[def.key]
    return {
      key: def.key,
      label: def.label,
      description: def.description,
      isSet: !!value && value.length > 0,
      preview: def.secret ? maskSecret(value) : maskValue(value),
      required: def.required,
      secret: def.secret,
      fallback: def.fallback,
    }
  })

  // Test Resend connectivity
  let resend: ResendHealth = { connected: false }

  const apiKey = process.env.RESEND_API_KEY
  if (apiKey) {
    try {
      const client = new Resend(apiKey)
      // List domains to verify the API key works
      const { data, error } = await client.domains.list()
      if (error) {
        resend = {
          connected: false,
          error: error.message || "API key validation failed",
        }
      } else {
        const verifiedDomain = data?.data?.find((d: { status: string }) => d.status === "verified")
        resend = {
          connected: true,
          domainVerified: !!verifiedDomain,
        }
      }
    } catch (err) {
      resend = {
        connected: false,
        error: err instanceof Error ? err.message : "Connection failed",
      }
    }
  } else {
    resend = {
      connected: false,
      error: "RESEND_API_KEY not set",
    }
  }

  return {
    envVars,
    resend,
    timestamp: new Date().toISOString(),
  }
}

// ---------------------------------------------------------------------------
// Test send action
// ---------------------------------------------------------------------------

export async function sendTestEmail(to: string): Promise<TestSendResult> {
  if (!to || !to.includes("@")) {
    return { success: false, error: "Please enter a valid email address" }
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return { success: false, error: "RESEND_API_KEY is not configured" }
  }

  try {
    const client = new Resend(apiKey)
    const fromAddress = process.env.EMAIL_FROM || "noreply@electricalservices.com"

    const { data, error } = await client.emails.send({
      from: fromAddress,
      to,
      subject: "Electrical Services -- Test Email",
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin: 0; padding: 40px; background-color: #f6f9fc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" style="width: 100%; max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    <tr>
      <td style="padding: 32px 40px; background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); text-align: center;">
        <h1 style="margin: 0; color: #f59e0b; font-size: 22px; font-weight: 700;">Electrical Services</h1>
        <p style="margin: 6px 0 0; color: #d4d4d8; font-size: 13px;">Email System Test</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 32px 40px;">
        <h2 style="margin: 0 0 16px; color: #1a1a1a; font-size: 18px;">Test Email Successful</h2>
        <p style="margin: 0 0 16px; color: #4b5563; font-size: 14px; line-height: 1.6;">
          This email confirms your Resend integration is working correctly. All 6 email templates can now be delivered.
        </p>
        <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 24px 0;">
          <tr>
            <td style="padding: 12px 16px; background-color: #f0fdf4; border-left: 4px solid #22c55e; border-radius: 6px;">
              <p style="margin: 0; color: #15803d; font-size: 14px; font-weight: 600;">All Systems Operational</p>
              <p style="margin: 4px 0 0; color: #166534; font-size: 12px;">Sent at: ${new Date().toLocaleString("en-GB", { dateStyle: "full", timeStyle: "medium" })}</p>
            </td>
          </tr>
        </table>
        <p style="margin: 0; color: #6b7280; font-size: 13px;">
          From: <code style="background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 12px;">${fromAddress}</code><br>
          To: <code style="background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 12px;">${to}</code>
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center;">
        <p style="margin: 0; color: #9ca3af; font-size: 11px;">Electrical Services Email System -- Test Email</p>
      </td>
    </tr>
  </table>
</body>
</html>`,
    })

    if (error) {
      await logDelivery({
        category: "service",
        recipientType: "business",
        templateName: "Test Email",
        from: fromAddress,
        to,
        subject: "Electrical Services -- Test Email",
        status: "failed",
        error: error.message || "Send failed",
      })
      return { success: false, error: error.message || "Send failed" }
    }

    await logDelivery({
      category: "service",
      recipientType: "business",
      templateName: "Test Email",
      from: fromAddress,
      to,
      subject: "Electrical Services -- Test Email",
      status: "sent",
      resendId: data?.id,
    })

    return { success: true, messageId: data?.id || "unknown" }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unexpected error during send",
    }
  }
}
