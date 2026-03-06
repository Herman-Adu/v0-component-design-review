"use server";

import { revalidateTag } from "next/cache";
import { z } from "zod";

/**
 * Scheduled Email — Strapi Write Actions
 *
 * POST /api/scheduled-emails            → enqueueEmail (called at send-time by cron/send path)
 * PUT  /api/scheduled-emails/:docId     → updateEmailStatus (cancel, retry, mark sent/failed)
 * DELETE /api/scheduled-emails/:docId   → deleteScheduledEmail (used by clearProcessedEmails)
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

const EnqueueEmailSchema = z.object({
  templateKey: z.string().min(1),
  to: z.string().email(),
  subject: z.string().min(1),
  htmlContent: z.string().nullable().optional(),
  scheduledFor: z.string().nullable().optional(),
  metadata: z.record(z.unknown()).nullable().optional(),
});

export type EnqueueEmailInput = z.infer<typeof EnqueueEmailSchema>;

function strapiHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
  };
}

/**
 * Add a new email to the Strapi queue (status=queued).
 * Called by the send path when scheduling is enabled and category is not immediate.
 */
export async function enqueueEmail(
  input: EnqueueEmailInput,
): Promise<{ success: boolean; documentId?: string; error?: string }> {
  const STRAPI_URL = process.env.STRAPI_URL;
  if (!STRAPI_URL || !process.env.STRAPI_API_TOKEN) {
    return { success: false, error: "Strapi is not configured" };
  }

  const parsed = EnqueueEmailSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.flatten().formErrors.join(", ") || "Invalid input",
    };
  }

  try {
    const res = await fetch(`${STRAPI_URL}/api/scheduled-emails`, {
      method: "POST",
      headers: strapiHeaders(),
      body: JSON.stringify({ data: { ...parsed.data, status: "queued" } }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("[scheduled-email-actions] POST failed:", res.status, text);
      return { success: false, error: `Strapi returned ${res.status}` };
    }

    const json = (await res.json()) as { data: { documentId: string } };
    revalidateTag("scheduled-emails", {});
    return { success: true, documentId: json.data?.documentId };
  } catch (err) {
    console.error("[scheduled-email-actions] POST error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

/** Cancel a queued or scheduled email. */
export async function cancelScheduledEmail(
  documentId: string,
): Promise<{ success: boolean; error?: string }> {
  const STRAPI_URL = process.env.STRAPI_URL;
  if (!STRAPI_URL || !process.env.STRAPI_API_TOKEN) {
    return { success: false, error: "Strapi is not configured" };
  }

  try {
    const res = await fetch(
      `${STRAPI_URL}/api/scheduled-emails/${documentId}`,
      {
        method: "PUT",
        headers: strapiHeaders(),
        body: JSON.stringify({ data: { status: "cancelled" } }),
      },
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("[scheduled-email-actions] cancel PUT failed:", res.status, text);
      return { success: false, error: `Strapi returned ${res.status}` };
    }

    revalidateTag("scheduled-emails", {});
    return { success: true };
  } catch (err) {
    console.error("[scheduled-email-actions] cancel error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

/** Re-queue a failed email for retry. */
export async function retryScheduledEmail(
  documentId: string,
): Promise<{ success: boolean; error?: string }> {
  const STRAPI_URL = process.env.STRAPI_URL;
  if (!STRAPI_URL || !process.env.STRAPI_API_TOKEN) {
    return { success: false, error: "Strapi is not configured" };
  }

  try {
    const res = await fetch(
      `${STRAPI_URL}/api/scheduled-emails/${documentId}`,
      {
        method: "PUT",
        headers: strapiHeaders(),
        body: JSON.stringify({
          data: { status: "queued", error: null, processedAt: null },
        }),
      },
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("[scheduled-email-actions] retry PUT failed:", res.status, text);
      return { success: false, error: `Strapi returned ${res.status}` };
    }

    revalidateTag("scheduled-emails", {});
    return { success: true };
  } catch (err) {
    console.error("[scheduled-email-actions] retry error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

/**
 * Mark a scheduled email as sent or failed. Called by the cron route after processing.
 */
export async function markEmailProcessed(
  documentId: string,
  outcome: "sent" | "failed",
  error?: string,
): Promise<{ success: boolean; error?: string }> {
  const STRAPI_URL = process.env.STRAPI_URL;
  if (!STRAPI_URL || !process.env.STRAPI_API_TOKEN) {
    return { success: false, error: "Strapi is not configured" };
  }

  const data: Record<string, unknown> = {
    status: outcome,
    processedAt: new Date().toISOString(),
  };
  if (outcome === "failed" && error) data.error = error;

  try {
    const res = await fetch(
      `${STRAPI_URL}/api/scheduled-emails/${documentId}`,
      {
        method: "PUT",
        headers: strapiHeaders(),
        body: JSON.stringify({ data }),
      },
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("[scheduled-email-actions] markProcessed PUT failed:", res.status, text);
      return { success: false, error: `Strapi returned ${res.status}` };
    }

    revalidateTag("scheduled-emails", {});
    return { success: true };
  } catch (err) {
    console.error("[scheduled-email-actions] markProcessed error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

/**
 * Delete all sent/failed/cancelled emails from the queue.
 * documentIds must be the processedDocumentIds passed from the page (avoids re-fetching).
 */
export async function clearProcessedEmails(
  documentIds: string[],
): Promise<{ success: boolean; cleared: number; error?: string }> {
  const STRAPI_URL = process.env.STRAPI_URL;
  if (!STRAPI_URL || !process.env.STRAPI_API_TOKEN) {
    return { success: false, cleared: 0, error: "Strapi is not configured" };
  }

  if (documentIds.length === 0) {
    return { success: true, cleared: 0 };
  }

  try {
    const results = await Promise.allSettled(
      documentIds.map((docId) =>
        fetch(`${STRAPI_URL}/api/scheduled-emails/${docId}`, {
          method: "DELETE",
          headers: strapiHeaders(),
        }),
      ),
    );

    const cleared = results.filter(
      (r) => r.status === "fulfilled" && r.value.ok,
    ).length;

    revalidateTag("scheduled-emails", {});
    return { success: true, cleared };
  } catch (err) {
    console.error("[scheduled-email-actions] clearProcessed error:", err);
    return {
      success: false,
      cleared: 0,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
