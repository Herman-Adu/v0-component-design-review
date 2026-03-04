/**
 * Centralized Error Handling
 * 
 * Provides consistent error handling across the application.
 * Sanitizes error messages for client-side display while logging
 * detailed errors server-side.
 */

import { ERROR_MESSAGES } from "@/lib/constants"

/**
 * Application error types
 */
export type ErrorType = 
  | "VALIDATION_ERROR"
  | "RATE_LIMIT_ERROR"
  | "NETWORK_ERROR"
  | "EMAIL_ERROR"
  | "NOT_FOUND"
  | "UNAUTHORIZED"
  | "INTERNAL_ERROR"

/**
 * Structured application error
 */
export class AppError extends Error {
  public readonly type: ErrorType
  public readonly statusCode: number
  public readonly isOperational: boolean

  constructor(
    message: string,
    type: ErrorType = "INTERNAL_ERROR",
    statusCode = 500,
    isOperational = true
  ) {
    super(message)
    this.type = type
    this.statusCode = statusCode
    this.isOperational = isOperational
    Object.setPrototypeOf(this, AppError.prototype)
  }
}

/**
 * Create common error types
 */
export const createError = {
  validation: (message?: string) => 
    new AppError(message || ERROR_MESSAGES.VALIDATION_FAILED, "VALIDATION_ERROR", 400),
  
  rateLimit: (message?: string) => 
    new AppError(message || ERROR_MESSAGES.RATE_LIMITED, "RATE_LIMIT_ERROR", 429),
  
  network: (message?: string) => 
    new AppError(message || ERROR_MESSAGES.NETWORK_ERROR, "NETWORK_ERROR", 503),
  
  email: (message?: string) => 
    new AppError(message || ERROR_MESSAGES.EMAIL_FAILED, "EMAIL_ERROR", 500),
  
  notFound: (message?: string) => 
    new AppError(message || ERROR_MESSAGES.NOT_FOUND, "NOT_FOUND", 404),
  
  unauthorized: (message?: string) => 
    new AppError(message || ERROR_MESSAGES.UNAUTHORIZED, "UNAUTHORIZED", 401),
  
  internal: (message?: string) => 
    new AppError(message || ERROR_MESSAGES.GENERIC, "INTERNAL_ERROR", 500),
}

/**
 * Get a safe, client-friendly error message
 * Logs the actual error details server-side
 */
export function getSafeErrorMessage(error: unknown): string {
  // Log full error details server-side
  if (process.env.NODE_ENV === "development") {
    console.error("[Error Details]:", error)
  }

  // Return safe message for known errors
  if (error instanceof AppError) {
    return error.message
  }

  // For Zod validation errors
  if (error && typeof error === "object" && "issues" in error) {
    return ERROR_MESSAGES.VALIDATION_FAILED
  }

  // For network/fetch errors
  if (error instanceof TypeError && error.message.includes("fetch")) {
    return ERROR_MESSAGES.NETWORK_ERROR
  }

  // Default to generic message for unknown errors
  return ERROR_MESSAGES.GENERIC
}

/**
 * Handle error in server action and return standardized response
 */
export function handleServerActionError(error: unknown): {
  success: false
  error: string
} {
  const message = getSafeErrorMessage(error)
  
  // Log error for monitoring (in production, send to error tracking service)
  console.error("[error-handler] Server action error:", {
    message,
    timestamp: new Date().toISOString(),
    error: error instanceof Error ? error.stack : String(error),
  })

  return {
    success: false,
    error: message,
  }
}

/**
 * Check if error is operational (expected) vs programmer error
 */
export function isOperationalError(error: unknown): boolean {
  if (error instanceof AppError) {
    return error.isOperational
  }
  return false
}
