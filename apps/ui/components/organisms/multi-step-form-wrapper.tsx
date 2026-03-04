/**
 * ORGANISM: MultiStepFormWrapper
 * 
 * A generic wrapper for multi-step forms that provides:
 * - Progress indication
 * - Step management
 * - Animation transitions
 * - Consistent styling
 * 
 * This is used by both the electrical service form and quotation form.
 */

"use client"

import type { ReactNode } from "react"
import { AnimatePresence } from "framer-motion"
import { FormProgressIndicator } from "@/components/molecules/form-progress-indicator"
import type { FormStepConfig } from "@/lib/forms/types"

interface MultiStepFormWrapperProps {
  title: string
  description: string
  steps: FormStepConfig[]
  currentStep: number
  children: ReactNode
  className?: string
  onStepClick?: (stepIndex: number) => void
}

export function MultiStepFormWrapper({
  title,
  description,
  steps,
  currentStep,
  children,
  className,
  onStepClick,
}: MultiStepFormWrapperProps) {
  return (
    <div className={className}>
      {/* Form Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          {title}
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {description}
        </p>
      </div>

      {/* Progress Indicator */}
      <FormProgressIndicator
        steps={steps}
        currentStep={currentStep}
        className="mb-8"
        onStepClick={onStepClick}
      />

      {/* Form Content */}
      <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-lg">
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
      </div>
    </div>
  )
}
