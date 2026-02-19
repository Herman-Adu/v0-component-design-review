/**
 * MOLECULAR COMPONENT: FormNavigation
 *
 * Navigation buttons for moving between form steps.
 * Combines button atoms with conditional logic.
 */

"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FormNavigationProps {
  currentStep: number
  totalSteps: number
  onPrevious?: () => void
  onNext?: () => void
  onSubmit?: () => void
  isNextDisabled?: boolean
  isSubmitting?: boolean
  className?: string
}

export function FormNavigation({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSubmit,
  isNextDisabled,
  isSubmitting,
  className,
}: FormNavigationProps) {
  const isFirstStep = currentStep === 1
  const isLastStep = currentStep === totalSteps

  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      {/* Previous Button */}
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstStep || isSubmitting}
        className={cn(
          "transition-all duration-200",
          "hover:shadow-[0_0_15px_oklch(0.745_0.153_72.338_/_0.15)]",
          isFirstStep && "invisible",
        )}
      >
        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Previous
      </Button>

      {/* Step Counter */}
      <div className="text-sm text-muted-foreground">
        Step {currentStep} of {totalSteps}
      </div>

      {/* Next/Submit Button */}
      {isLastStep ? (
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className={cn(
            "relative overflow-hidden",
            "shadow-[0_0_20px_oklch(0.745_0.153_72.338_/_0.3)]",
            "hover:shadow-[0_0_25px_oklch(0.745_0.153_72.338_/_0.5)]",
            "transition-all duration-300",
          )}
        >
          {!isSubmitting && (
            <motion.div
              className="absolute inset-0 rounded-lg"
              style={{
                background: "linear-gradient(90deg, transparent, oklch(0.745 0.153 72.338 / 0.3), transparent)",
                backgroundSize: "200% 100%",
              }}
              animate={{
                backgroundPosition: ["0% 0%", "200% 0%"],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />
          )}

          <span className="relative z-10">
            {isSubmitting ? (
              <>
                <motion.div
                  className="mr-2 h-4 w-4 rounded-full border-2 border-current border-t-transparent inline-block"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />
                Submitting...
              </>
            ) : (
              <>
                Submit Request
                <svg className="ml-2 h-4 w-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </>
            )}
          </span>
        </Button>
      ) : (
        <Button
          type="button"
          onClick={onNext}
          disabled={isNextDisabled || isSubmitting}
          className={cn(
            "relative",
            "hover:shadow-[0_0_20px_oklch(0.745_0.153_72.338_/_0.25)]",
            "transition-all duration-300",
          )}
        >
          Next
          <motion.svg
            className="ml-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            whileHover={{ x: 3 }}
            transition={{ duration: 0.2 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </motion.svg>
        </Button>
      )}
    </div>
  )
}
