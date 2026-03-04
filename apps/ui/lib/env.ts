/**
 * Environment Variable Validation
 * 
 * Validates required environment variables at runtime.
 * Import this in server-side code to ensure env vars are properly configured.
 */

import { z } from "zod"

/**
 * Server-side environment variables schema
 * These are only available on the server
 */
const serverEnvSchema = z.object({
  // Strapi CMS
  STRAPI_URL: z.string().url().optional(),
  STRAPI_API_TOKEN: z.string().min(1).optional(),

  // Email Configuration (Required for email functionality)
  RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is required for email functionality"),
  
  // Email Addresses (Optional with defaults)
  EMAIL_FROM: z.string().email().optional().default("noreply@electricalservices.com"),
  EMAIL_CONTACT_FROM: z.string().email().optional(),
  EMAIL_QUOTATION_FROM: z.string().email().optional(),
  BUSINESS_EMAIL: z.string().email().optional().default("admin@electricalservices.com"),
  
  // Node Environment
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
})

/**
 * Client-side environment variables schema
 * These are exposed to the browser (NEXT_PUBLIC_ prefix)
 */
const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
})

/**
 * Validate and get server environment variables
 * Call this at the top of server-side files that need env vars
 */
export function getServerEnv() {
  const parsed = serverEnvSchema.safeParse(process.env)
  
  if (!parsed.success) {
    console.error("[env] Invalid server environment variables:", parsed.error.flatten().fieldErrors)
    throw new Error("Invalid server environment configuration")
  }
  
  return parsed.data
}

/**
 * Validate and get client environment variables
 */
export function getClientEnv() {
  const parsed = clientEnvSchema.safeParse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  })
  
  if (!parsed.success) {
    console.error("[env] Invalid client environment variables:", parsed.error.flatten().fieldErrors)
    throw new Error("Invalid client environment configuration")
  }
  
  return parsed.data
}

/**
 * Check if email service is configured
 * Returns true if RESEND_API_KEY is set
 */
export function isEmailConfigured(): boolean {
  return !!process.env.RESEND_API_KEY
}

/**
 * Get email configuration with validation
 */
export function getEmailConfig() {
  const env = getServerEnv()
  
  return {
    apiKey: env.RESEND_API_KEY,
    fromEmail: env.EMAIL_FROM,
    contactFromEmail: env.EMAIL_CONTACT_FROM || env.EMAIL_FROM,
    quotationFromEmail: env.EMAIL_QUOTATION_FROM || env.EMAIL_FROM,
    businessEmail: env.BUSINESS_EMAIL,
  }
}

// Type exports for use in other files
export type ServerEnv = z.infer<typeof serverEnvSchema>
export type ClientEnv = z.infer<typeof clientEnvSchema>
