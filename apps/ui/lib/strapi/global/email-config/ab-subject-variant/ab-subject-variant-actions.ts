"use server";

import { revalidateTag } from "next/cache";
import { z } from "zod";

/**
 * A/B Subject Variant — Strapi Write Actions
 *
 * POST  /api/ab-subject-variants          → createABVariant
 * PUT   /api/ab-subject-variants/:docId   → updateABVariant
 * DELETE /api/ab-subject-variants/:docId  → deleteABVariant
 * PUT (multi) per template key            → setTemplateAbEnabled
 * PUT sends increment                     → incrementVariantSends
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

const CreateVariantSchema = z.object({
  templateKey: z.string().min(1),
  templateLabel: z.string().min(1),
  pattern: z.string().min(1),
  description: z.string().nullable().optional(),
  weight: z.number().int().min(0).max(100),
  abEnabled: z.boolean().default(false),
});

const UpdateVariantSchema = z.object({
  pattern: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  weight: z.number().int().min(0).max(100).optional(),
  isActive: z.boolean().optional(),
  abEnabled: z.boolean().optional(),
  sends: z.number().int().min(0).optional(),
});

export type CreateABVariantInput = z.infer<typeof CreateVariantSchema>;
export type UpdateABVariantInput = z.infer<typeof UpdateVariantSchema>;

function strapiHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
  };
}

export async function createABVariant(
  input: CreateABVariantInput,
): Promise<{ success: boolean; documentId?: string; error?: string }> {
  const STRAPI_URL = process.env.STRAPI_URL;
  if (!STRAPI_URL || !process.env.STRAPI_API_TOKEN) {
    return { success: false, error: "Strapi is not configured" };
  }

  const parsed = CreateVariantSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.flatten().formErrors.join(", ") || "Invalid input",
    };
  }

  try {
    const res = await fetch(`${STRAPI_URL}/api/ab-subject-variants`, {
      method: "POST",
      headers: strapiHeaders(),
      body: JSON.stringify({ data: { ...parsed.data, sends: 0, isActive: true } }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("[ab-variant-actions] POST failed:", res.status, text);
      return { success: false, error: `Strapi returned ${res.status}` };
    }

    const json = (await res.json()) as { data: { documentId: string } };
    revalidateTag("ab-subject-variants", {});
    return { success: true, documentId: json.data?.documentId };
  } catch (err) {
    console.error("[ab-variant-actions] POST error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export async function updateABVariant(
  documentId: string,
  input: UpdateABVariantInput,
): Promise<{ success: boolean; error?: string }> {
  const STRAPI_URL = process.env.STRAPI_URL;
  if (!STRAPI_URL || !process.env.STRAPI_API_TOKEN) {
    return { success: false, error: "Strapi is not configured" };
  }

  const parsed = UpdateVariantSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.flatten().formErrors.join(", ") || "Invalid input",
    };
  }

  try {
    const res = await fetch(
      `${STRAPI_URL}/api/ab-subject-variants/${documentId}`,
      {
        method: "PUT",
        headers: strapiHeaders(),
        body: JSON.stringify({ data: parsed.data }),
      },
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("[ab-variant-actions] PUT failed:", res.status, text);
      return { success: false, error: `Strapi returned ${res.status}` };
    }

    revalidateTag("ab-subject-variants", {});
    return { success: true };
  } catch (err) {
    console.error("[ab-variant-actions] PUT error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export async function deleteABVariant(
  documentId: string,
): Promise<{ success: boolean; error?: string }> {
  const STRAPI_URL = process.env.STRAPI_URL;
  if (!STRAPI_URL || !process.env.STRAPI_API_TOKEN) {
    return { success: false, error: "Strapi is not configured" };
  }

  try {
    const res = await fetch(
      `${STRAPI_URL}/api/ab-subject-variants/${documentId}`,
      { method: "DELETE", headers: strapiHeaders() },
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("[ab-variant-actions] DELETE failed:", res.status, text);
      return { success: false, error: `Strapi returned ${res.status}` };
    }

    revalidateTag("ab-subject-variants", {});
    return { success: true };
  } catch (err) {
    console.error("[ab-variant-actions] DELETE error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

/**
 * Set abEnabled flag on all variants belonging to a template.
 * documentIds must be all variants for the target templateKey.
 */
export async function setTemplateAbEnabled(
  documentIds: string[],
  abEnabled: boolean,
): Promise<{ success: boolean; error?: string }> {
  const STRAPI_URL = process.env.STRAPI_URL;
  if (!STRAPI_URL || !process.env.STRAPI_API_TOKEN) {
    return { success: false, error: "Strapi is not configured" };
  }

  try {
    await Promise.all(
      documentIds.map((docId) =>
        fetch(`${STRAPI_URL}/api/ab-subject-variants/${docId}`, {
          method: "PUT",
          headers: strapiHeaders(),
          body: JSON.stringify({ data: { abEnabled } }),
        }),
      ),
    );

    revalidateTag("ab-subject-variants", {});
    return { success: true };
  } catch (err) {
    console.error("[ab-variant-actions] setTemplateAbEnabled error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

/**
 * Increment the sends counter for a variant at send-time.
 * Called by resolveSubject() after a variant is selected.
 */
export async function incrementVariantSends(
  documentId: string,
  currentSends: number,
): Promise<{ success: boolean; error?: string }> {
  const STRAPI_URL = process.env.STRAPI_URL;
  if (!STRAPI_URL || !process.env.STRAPI_API_TOKEN) {
    return { success: false, error: "Strapi is not configured" };
  }

  try {
    const res = await fetch(
      `${STRAPI_URL}/api/ab-subject-variants/${documentId}`,
      {
        method: "PUT",
        headers: strapiHeaders(),
        body: JSON.stringify({ data: { sends: currentSends + 1 } }),
      },
    );

    if (!res.ok) {
      console.error("[ab-variant-actions] incrementSends failed:", res.status);
      return { success: false, error: `Strapi returned ${res.status}` };
    }

    revalidateTag("ab-subject-variants", {});
    return { success: true };
  } catch (err) {
    console.error("[ab-variant-actions] incrementSends error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
