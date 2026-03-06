"use server";

import { revalidateTag } from "next/cache";
import { z } from "zod";

/**
 * Email Template — Strapi Write Actions
 *
 * PUT   /api/email-templates/:docId  → updateEmailTemplate
 * POST  /api/email-templates         → createEmailTemplate
 * DELETE /api/email-templates/:docId → deleteEmailTemplate
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

const UpdateTemplateSchema = z.object({
  templateLabel: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
  fromName: z.string().nullable().optional(),
  fromEmail: z.string().email().nullable().optional(),
  replyTo: z.string().email().nullable().optional(),
});

const CreateTemplateSchema = z.object({
  templateKey: z.string().min(1),
  templateLabel: z.string().min(1),
  category: z.enum(["service", "contact", "quotation"]),
  recipientType: z.enum(["customer", "business"]),
  description: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
  fromName: z.string().nullable().optional(),
  fromEmail: z.string().email().nullable().optional(),
  replyTo: z.string().email().nullable().optional(),
});

export type UpdateEmailTemplateInput = z.infer<typeof UpdateTemplateSchema>;
export type CreateEmailTemplateInput = z.infer<typeof CreateTemplateSchema>;

function strapiHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
  };
}

export async function updateEmailTemplate(
  documentId: string,
  input: UpdateEmailTemplateInput,
): Promise<{ success: boolean; error?: string }> {
  const STRAPI_URL = process.env.STRAPI_URL;
  if (!STRAPI_URL || !process.env.STRAPI_API_TOKEN) {
    return { success: false, error: "Strapi is not configured" };
  }

  const parsed = UpdateTemplateSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.flatten().formErrors.join(", ") || "Invalid input",
    };
  }

  try {
    const res = await fetch(`${STRAPI_URL}/api/email-templates/${documentId}`, {
      method: "PUT",
      headers: strapiHeaders(),
      body: JSON.stringify({ data: parsed.data }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("[email-template-actions] PUT failed:", res.status, text);
      return { success: false, error: `Strapi returned ${res.status}` };
    }

    revalidateTag("email-templates", {});
    return { success: true };
  } catch (err) {
    console.error("[email-template-actions] PUT error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export async function createEmailTemplate(
  input: CreateEmailTemplateInput,
): Promise<{ success: boolean; documentId?: string; error?: string }> {
  const STRAPI_URL = process.env.STRAPI_URL;
  if (!STRAPI_URL || !process.env.STRAPI_API_TOKEN) {
    return { success: false, error: "Strapi is not configured" };
  }

  const parsed = CreateTemplateSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.flatten().formErrors.join(", ") || "Invalid input",
    };
  }

  try {
    const res = await fetch(`${STRAPI_URL}/api/email-templates`, {
      method: "POST",
      headers: strapiHeaders(),
      body: JSON.stringify({ data: parsed.data }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("[email-template-actions] POST failed:", res.status, text);
      return { success: false, error: `Strapi returned ${res.status}` };
    }

    const json = (await res.json()) as { data: { documentId: string } };
    revalidateTag("email-templates", {});
    return { success: true, documentId: json.data?.documentId };
  } catch (err) {
    console.error("[email-template-actions] POST error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export async function deleteEmailTemplate(
  documentId: string,
): Promise<{ success: boolean; error?: string }> {
  const STRAPI_URL = process.env.STRAPI_URL;
  if (!STRAPI_URL || !process.env.STRAPI_API_TOKEN) {
    return { success: false, error: "Strapi is not configured" };
  }

  try {
    const res = await fetch(`${STRAPI_URL}/api/email-templates/${documentId}`, {
      method: "DELETE",
      headers: strapiHeaders(),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("[email-template-actions] DELETE failed:", res.status, text);
      return { success: false, error: `Strapi returned ${res.status}` };
    }

    revalidateTag("email-templates", {});
    return { success: true };
  } catch (err) {
    console.error("[email-template-actions] DELETE error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
