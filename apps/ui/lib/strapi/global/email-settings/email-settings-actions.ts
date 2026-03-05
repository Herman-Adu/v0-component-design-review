"use server";

import { revalidateTag } from "next/cache";
import { z } from "zod";

/**
 * Email Settings — Strapi Write Actions
 *
 * PUT /api/email-setting (Strapi 5 Single Type)
 * Requires Full-access API token (STRAPI_API_TOKEN).
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

const UpdateEmailSettingsSchema = z.object({
  fromEmail: z.string().email().optional(),
  contactFromEmail: z.string().email().nullable().optional(),
  quotationFromEmail: z.string().email().nullable().optional(),
  replyToEmail: z.string().email().nullable().optional(),
  slaResponseHours: z.number().int().positive().optional(),
  slaUrgentHours: z.number().int().positive().optional(),
  footerDisclaimer: z.string().nullable().optional(),
  emailSignatureTemplate: z.string().nullable().optional(),
  urgencyColorsJson: z.string().nullable().optional(),
  slaJson: z.string().nullable().optional(),
});

export type UpdateEmailSettingsInput = z.infer<typeof UpdateEmailSettingsSchema>;

export async function saveEmailSettings(
  input: UpdateEmailSettingsInput,
): Promise<{ success: boolean; error?: string }> {
  const STRAPI_URL = process.env.STRAPI_URL;
  const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

  if (!STRAPI_URL || !STRAPI_API_TOKEN) {
    return { success: false, error: "Strapi is not configured" };
  }

  const parsed = UpdateEmailSettingsSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().formErrors.join(", ") || "Invalid input" };
  }

  try {
    const res = await fetch(`${STRAPI_URL}/api/email-setting`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({ data: parsed.data }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("[email-settings-actions] PUT failed:", res.status, text);
      return { success: false, error: `Strapi returned ${res.status}` };
    }

    revalidateTag("email-setting", {});
    return { success: true };
  } catch (err) {
    console.error("[email-settings-actions] PUT error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
