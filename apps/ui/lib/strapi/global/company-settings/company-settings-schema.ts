import { z } from "zod";

/**
 * Company Settings Schema
 *
 * Validates the company-setting Single Type response from Strapi.
 * Single Type — endpoint: GET /api/company-setting (flat object, no data[])
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

export const CompanySettingsDocumentSchema = z.object({
  businessName: z.string().min(1),
  businessAddress: z.string().min(1),
  businessPhone: z.string().optional().nullable(),
  businessEmail: z.string().email(),
  logoUrl: z.string().optional().nullable(),
  brandPrimaryColor: z.string().optional().nullable(),
  brandSecondaryColor: z.string().optional().nullable(),
  brandAccentColor: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  registrationNumber: z.string().optional().nullable(),
  vatNumber: z.string().optional().nullable(),
});

export type CompanySettingsDocument = z.infer<typeof CompanySettingsDocumentSchema>;
