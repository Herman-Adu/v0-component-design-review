"use server";

import { revalidateTag } from "next/cache";
import { z } from "zod";

/**
 * Company Settings — Strapi Write Actions
 *
 * PUT /api/company-setting (Strapi 5 Single Type)
 * Requires Full-access API token (STRAPI_API_TOKEN).
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

const UpdateCompanySettingsSchema = z.object({
  businessName: z.string().min(1).optional(),
  businessAddress: z.string().min(1).optional(),
  businessPhone: z.string().nullable().optional(),
  businessEmail: z.string().email().optional(),
  logoUrl: z.string().nullable().optional(),
  brandPrimaryColor: z.string().nullable().optional(),
  brandSecondaryColor: z.string().nullable().optional(),
  brandAccentColor: z.string().nullable().optional(),
  website: z.string().nullable().optional(),
  registrationNumber: z.string().nullable().optional(),
  vatNumber: z.string().nullable().optional(),
});

export type UpdateCompanySettingsInput = z.infer<typeof UpdateCompanySettingsSchema>;

export async function saveCompanySettings(
  input: UpdateCompanySettingsInput,
): Promise<{ success: boolean; error?: string }> {
  const STRAPI_URL = process.env.STRAPI_URL;
  const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

  if (!STRAPI_URL || !STRAPI_API_TOKEN) {
    return { success: false, error: "Strapi is not configured" };
  }

  const parsed = UpdateCompanySettingsSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().formErrors.join(", ") || "Invalid input" };
  }

  try {
    const res = await fetch(`${STRAPI_URL}/api/company-setting`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({ data: parsed.data }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("[company-settings-actions] PUT failed:", res.status, text);
      return { success: false, error: `Strapi returned ${res.status}` };
    }

    revalidateTag("company-setting", {});
    return { success: true };
  } catch (err) {
    console.error("[company-settings-actions] PUT error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

/**
 * Upload a logo file to the Strapi media library.
 * Returns the public URL of the uploaded file.
 */
export async function uploadLogo(
  formData: FormData,
): Promise<{ success: boolean; url?: string; error?: string }> {
  const STRAPI_URL = process.env.STRAPI_URL;
  const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

  if (!STRAPI_URL || !STRAPI_API_TOKEN) {
    return { success: false, error: "Strapi is not configured" };
  }

  try {
    const res = await fetch(`${STRAPI_URL}/api/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("[company-settings-actions] Upload failed:", res.status, text);
      return { success: false, error: `Upload returned ${res.status}` };
    }

    const json = await res.json();
    // Strapi upload returns an array: [{ url, ... }]
    const uploadedFile = Array.isArray(json) ? json[0] : json;
    const url: string = uploadedFile?.url;

    if (!url) {
      return { success: false, error: "No URL returned from upload" };
    }

    // If Strapi returns a relative URL, prefix with STRAPI_URL
    const fullUrl = url.startsWith("http") ? url : `${STRAPI_URL}${url}`;
    return { success: true, url: fullUrl };
  } catch (err) {
    console.error("[company-settings-actions] Upload error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
