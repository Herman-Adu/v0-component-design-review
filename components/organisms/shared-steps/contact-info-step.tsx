/**
 * SHARED STEP: ContactInfoStep
 *
 * A reusable contact information step used by multiple forms.
 * Collects name, email, phone, and optionally company name.
 * @module contact-info-step
 */

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User } from "lucide-react";
import { FormInput } from "@/components/atoms/form-input";
import { FormStepContainer } from "@/components/molecules/form-step-container";

const ukPhoneRegex = /^(?:(?:\+44\s?|0)(?:7\d{3}|\d{3,4}))\s?\d{3}\s?\d{3,4}$/;

const contactInfoSchema = z.object({
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().regex(ukPhoneRegex, "Please enter a valid UK phone number"),
  company: z.string().max(100, "Company name is too long").optional(),
});

export type ContactInfoInput = z.infer<typeof contactInfoSchema>;

interface ContactInfoStepProps {
  defaultValues?: Partial<ContactInfoInput>;
  onSubmit: (data: ContactInfoInput) => void;
  onPrevious?: () => void;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  title?: string;
  description?: string;
  showCompany?: boolean;
}

export function ContactInfoStep({
  defaultValues,
  onSubmit,
  onPrevious,
  isFirstStep = true,
  isLastStep = false,
  title = "Contact Information",
  description = "Please provide your contact details",
  showCompany = true,
}: ContactInfoStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ContactInfoInput>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues,
    mode: "onChange",
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormStepContainer
        title={title}
        description={description}
        icon={<User className="h-5 w-5" />}
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
        onPrevious={onPrevious}
        isValid={isValid}
      >
        <div className="grid gap-6">
          <FormInput
            label="Full Name"
            placeholder="John Smith"
            error={errors.fullName?.message}
            required
            {...register("fullName")}
          />

          <FormInput
            label="Email Address"
            type="email"
            placeholder="john.smith@example.com"
            error={errors.email?.message}
            required
            {...register("email")}
          />

          <FormInput
            label="Phone Number"
            type="tel"
            placeholder="07700 900000"
            error={errors.phone?.message}
            required
            {...register("phone")}
          />

          {showCompany && (
            <FormInput
              label="Company Name"
              placeholder="Your Company Ltd (Optional)"
              error={errors.company?.message}
              {...register("company")}
            />
          )}
        </div>
      </FormStepContainer>
    </form>
  );
}
