import { z } from "zod"

export const emailConfigSchema = z.object({
  resendApiKey: z.string().min(1, "Resend API key is required"),
  emailFrom: z.string().email("Invalid sender email address"),
  businessEmail: z.string().email("Invalid business email address"),
})

export const emailMetadataSchema = z.object({
  requestId: z.string(),
  customerEmail: z.string().email(),
  urgency: z.enum(["routine", "urgent", "emergency"]),
  sentAt: z.string().datetime(),
})

export type EmailConfig = z.infer<typeof emailConfigSchema>
export type EmailMetadata = z.infer<typeof emailMetadataSchema>
