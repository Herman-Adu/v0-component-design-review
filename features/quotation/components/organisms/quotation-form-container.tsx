/**
 * ORGANISM: QuotationFormContainer
 * 
 * Main container for the quotation request multi-step form.
 * Manages step navigation and form submission.
 */

"use client"

import { useState } from "react"
import { useQuotationStore } from "../../hooks/use-quotation-store"
import { submitQuotationRequest } from "../../api/quotation-request"
import { MultiStepFormWrapper } from "@/components/organisms/multi-step-form-wrapper"
import { ContactInfoStep } from "@/components/organisms/shared-steps/contact-info-step"
import { AddressInfoStep } from "@/components/organisms/shared-steps/address-info-step"
import { ProjectTypeStep } from "./quotation-steps/project-type-step"
import { ProjectScopeStep } from "./quotation-steps/project-scope-step"
import { BudgetTimelineStep } from "./quotation-steps/budget-timeline-step"
import { AdditionalRequirementsStep } from "./quotation-steps/additional-requirements-step"
import { QuotationReviewStep } from "./quotation-steps/quotation-review-step"
import { QuotationSuccessMessage } from "../molecules/quotation-success-message"
import type { FormStepConfig } from "@/lib/forms/types"

const QUOTATION_STEPS: FormStepConfig[] = [
  { id: "contact", title: "Contact" },
  { id: "project-type", title: "Project Type" },
  { id: "scope", title: "Scope" },
  { id: "site", title: "Site" },
  { id: "budget", title: "Budget" },
  { id: "additional", title: "Additional" },
  { id: "review", title: "Review" },
]

export function QuotationFormContainer() {
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [successData, setSuccessData] = useState<{ requestId: string } | null>(null)
  
  const {
    currentStep,
    contact,
    projectType,
    scope,
    site,
    budget,
    additional,
    isSubmitting,
    updateContact,
    updateProjectType,
    updateScope,
    updateSite,
    updateBudget,
    updateAdditional,
    nextStep,
    previousStep,
    goToStep,
    setSubmitting,
    resetForm,
    getCompleteFormData,
  } = useQuotationStore()

  const handleSubmit = async () => {
    setSubmitError(null)
    setSubmitting(true)

    try {
      const formData = getCompleteFormData()
      const result = await submitQuotationRequest(formData)

      if (result.success) {
        setSuccessData(result.data)
        resetForm()
      } else {
        setSubmitError(result.error)
      }
    } catch (error) {
      setSubmitError("An unexpected error occurred. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleStartNew = () => {
    setSuccessData(null)
    resetForm()
  }

  // Show success message if submitted
  if (successData) {
    return (
      <QuotationSuccessMessage
        requestId={successData.requestId}
        onStartNew={handleStartNew}
      />
    )
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <ContactInfoStep
            defaultValues={contact}
            onSubmit={(data) => {
              updateContact(data)
              nextStep()
            }}
            isFirstStep={true}
            showCompany={true}
            title="Contact Information"
            description="Please provide your contact details so we can reach you about your quotation."
          />
        )
      case 1:
        return (
          <ProjectTypeStep
            defaultValues={projectType}
            onSubmit={(data) => {
              updateProjectType(data)
              nextStep()
            }}
            onPrevious={previousStep}
          />
        )
      case 2:
        return (
          <ProjectScopeStep
            defaultValues={scope}
            onSubmit={(data) => {
              updateScope(data)
              nextStep()
            }}
            onPrevious={previousStep}
          />
        )
      case 3:
        return (
          <AddressInfoStep
            defaultValues={{
              addressLine1: site.addressLine1,
              addressLine2: site.addressLine2,
              city: site.city,
              county: site.county,
              postcode: site.postcode,
            }}
            onSubmit={(data) => {
              updateSite(data)
              nextStep()
            }}
            onPrevious={previousStep}
            title="Site Address"
            description="Where is the project located?"
          />
        )
      case 4:
        return (
          <BudgetTimelineStep
            defaultValues={budget}
            onSubmit={(data) => {
              updateBudget(data)
              nextStep()
            }}
            onPrevious={previousStep}
          />
        )
      case 5:
        return (
          <AdditionalRequirementsStep
            defaultValues={additional}
            onSubmit={(data) => {
              updateAdditional(data)
              nextStep()
            }}
            onPrevious={previousStep}
            isLastStep={false}
          />
        )
      case 6:
        return (
          <QuotationReviewStep
            formData={getCompleteFormData()}
            onSubmit={handleSubmit}
            onPrevious={previousStep}
            onEdit={goToStep}
            isSubmitting={isSubmitting}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <MultiStepFormWrapper
        title="Request a Quotation"
        description="Complete the form below to receive a detailed quotation for your project. We handle residential, commercial, and industrial electrical work."
        steps={QUOTATION_STEPS}
        currentStep={currentStep}
        onStepClick={(stepIndex) => {
          if (stepIndex <= currentStep) {
            goToStep(stepIndex)
          }
        }}
      >
        {renderStep()}
      </MultiStepFormWrapper>

      {submitError && (
        <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
          <p className="text-sm font-medium text-destructive">Submission Error</p>
          <p className="text-sm text-destructive/80 mt-1">{submitError}</p>
        </div>
      )}
    </div>
  )
}
