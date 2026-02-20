/**
 * Generic Form Store Factory
 *
 * Creates typed Zustand stores for multi-step forms with:
 * - Step navigation
 * - Data persistence to localStorage
 * - Submission state management
 * - Type-safe updates
 *
 * This reduces duplication across form stores while maintaining
 * full type safety and customization options.
 */

import { create, type StateCreator } from "zustand";
import { persist, type PersistOptions } from "zustand/middleware";

export interface BaseFormState<
  TData extends Record<string, Record<string, unknown>>,
> {
  /** Current step index */
  currentStep: number;
  /** Form data */
  data: TData;
  /** Whether form is being submitted */
  isSubmitting: boolean;
  /** Whether form has been submitted successfully */
  isComplete: boolean;
  /** Submission error message */
  submissionError: string | null;
  /** Reference ID after successful submission */
  referenceId: string | null;
}

export interface BaseFormActions<
  TData extends Record<string, Record<string, unknown>>,
> {
  /** Update a specific section of form data */
  updateData: <K extends keyof TData>(key: K, value: Partial<TData[K]>) => void;
  /** Navigate to next step */
  nextStep: () => void;
  /** Navigate to previous step */
  prevStep: () => void;
  /** Navigate to specific step */
  goToStep: (step: number) => void;
  /** Set submission state */
  setSubmitting: (isSubmitting: boolean) => void;
  /** Set completion state */
  setComplete: (isComplete: boolean, referenceId?: string) => void;
  /** Set submission error */
  setSubmissionError: (error: string | null) => void;
  /** Reset form to initial state */
  resetForm: () => void;
  /** Get complete form data */
  getFormData: () => TData;
}

export type FormStore<TData extends Record<string, Record<string, unknown>>> =
  BaseFormState<TData> & BaseFormActions<TData>;

export interface CreateFormStoreOptions<
  TData extends Record<string, Record<string, unknown>>,
> {
  /** Initial form data */
  initialData: TData;
  /** Minimum step (usually 0 or 1) */
  minStep: number;
  /** Maximum step */
  maxStep: number;
  /** localStorage key for persistence */
  storageKey: string;
  /** Fields to persist (defaults to all) */
  persistFields?: (keyof BaseFormState<TData>)[];
}

/**
 * Creates a typed Zustand store for multi-step forms
 *
 * @example
 * ```ts
 * const useMyFormStore = createFormStore({
 *   initialData: { contact: {}, details: {} },
 *   minStep: 1,
 *   maxStep: 5,
 *   storageKey: "my-form-storage",
 * })
 * ```
 */
export function createFormStore<
  TData extends Record<string, Record<string, unknown>>,
>(options: CreateFormStoreOptions<TData>) {
  const { initialData, minStep, maxStep, storageKey, persistFields } = options;

  const initialState: BaseFormState<TData> = {
    currentStep: minStep,
    data: initialData,
    isSubmitting: false,
    isComplete: false,
    submissionError: null,
    referenceId: null,
  };

  const storeCreator: StateCreator<FormStore<TData>> = (set, get) => ({
    ...initialState,

    updateData: (key, value) =>
      set((state) => ({
        data: {
          ...state.data,
          [key]: { ...state.data[key], ...value },
        },
      })),

    nextStep: () =>
      set((state) => ({
        currentStep: Math.min(state.currentStep + 1, maxStep),
      })),

    prevStep: () =>
      set((state) => ({
        currentStep: Math.max(state.currentStep - 1, minStep),
      })),

    goToStep: (step) =>
      set({
        currentStep: Math.max(minStep, Math.min(step, maxStep)),
      }),

    setSubmitting: (isSubmitting) => set({ isSubmitting }),

    setComplete: (isComplete, referenceId) =>
      set({
        isComplete,
        referenceId: referenceId ?? null,
      }),

    setSubmissionError: (error) => set({ submissionError: error }),

    resetForm: () => set(initialState),

    getFormData: () => get().data,
  });

  // Configure persistence
  const persistOptions: PersistOptions<
    FormStore<TData>,
    Partial<FormStore<TData>>
  > = {
    name: storageKey,
    partialize: (state) => {
      if (persistFields) {
        const persisted: Partial<FormStore<TData>> = {};
        for (const field of persistFields) {
          (persisted as Record<string, unknown>)[field as string] =
            state[field];
        }
        return persisted;
      }
      // Default: persist data and currentStep
      return {
        currentStep: state.currentStep,
        data: state.data,
      } as Partial<FormStore<TData>>;
    },
  };

  return create<FormStore<TData>>()(persist(storeCreator, persistOptions));
}
