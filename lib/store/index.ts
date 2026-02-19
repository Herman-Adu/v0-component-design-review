/**
 * Store Module Exports
 * 
 * Centralized exports for all Zustand stores and utilities.
 */

// Store factory
export {
  createFormStore,
  type BaseFormState,
  type BaseFormActions,
  type FormStore,
  type CreateFormStoreOptions,
} from "./create-form-store"

// Individual stores
export { useFormStore } from "@/features/service-request"
export { useContactStore } from "@/features/contact"
export { useQuotationStore } from "@/features/quotation"
