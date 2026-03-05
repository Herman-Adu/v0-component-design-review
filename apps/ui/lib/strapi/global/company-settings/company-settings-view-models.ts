import type { CompanySettingsDocument } from "./company-settings-schema";

/**
 * Company Settings View Models
 *
 * Transforms the validated Strapi document into a UI-ready view model.
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

export interface CompanySettingsVM {
  businessName: string;
  businessAddress: string;
  businessPhone: string | null;
  businessEmail: string;
  logoUrl: string | null;
  brandPrimaryColor: string | null;
  brandSecondaryColor: string | null;
  brandAccentColor: string | null;
  website: string | null;
  registrationNumber: string | null;
  vatNumber: string | null;
}

export function toCompanySettingsVM(doc: CompanySettingsDocument): CompanySettingsVM {
  return {
    businessName: doc.businessName,
    businessAddress: doc.businessAddress,
    businessPhone: doc.businessPhone ?? null,
    businessEmail: doc.businessEmail,
    logoUrl: doc.logoUrl ?? null,
    brandPrimaryColor: doc.brandPrimaryColor ?? null,
    brandSecondaryColor: doc.brandSecondaryColor ?? null,
    brandAccentColor: doc.brandAccentColor ?? null,
    website: doc.website ?? null,
    registrationNumber: doc.registrationNumber ?? null,
    vatNumber: doc.vatNumber ?? null,
  };
}
