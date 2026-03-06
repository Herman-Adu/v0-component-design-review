"use server";

import { revalidateTag } from "next/cache";
import { z } from "zod";

/**
 * Recipient Group — Strapi Write Actions
 *
 * POST   /api/recipient-groups/:docId  → createRecipientGroup
 * PUT    /api/recipient-groups/:docId  → updateRecipientGroup
 * DELETE /api/recipient-groups/:docId  → deleteRecipientGroup
 *
 * Members are a repeatable `emailStaff` component — managed by passing
 * the full members array on each PUT (Strapi 5 component semantics).
 * addGroupMember / removeGroupMember fetch current state, diff, then PUT.
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

const EmailStaffInputSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  role: z.string().min(1),
  isActive: z.boolean().default(true),
});

const CreateGroupSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  templateTypes: z.array(z.enum(["service", "contact", "quotation"])).min(1),
  urgencyFilter: z
    .enum(["all", "emergency-only", "urgent-and-emergency", "routine-only"])
    .default("all"),
});

export type EmailStaffInput = z.infer<typeof EmailStaffInputSchema>;
export type CreateRecipientGroupInput = z.infer<typeof CreateGroupSchema>;

function strapiHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
  };
}

export async function createRecipientGroup(
  input: CreateRecipientGroupInput,
): Promise<{ success: boolean; documentId?: string; error?: string }> {
  const STRAPI_URL = process.env.STRAPI_URL;
  if (!STRAPI_URL || !process.env.STRAPI_API_TOKEN) {
    return { success: false, error: "Strapi is not configured" };
  }

  const parsed = CreateGroupSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.flatten().formErrors.join(", ") || "Invalid input",
    };
  }

  try {
    const res = await fetch(`${STRAPI_URL}/api/recipient-groups`, {
      method: "POST",
      headers: strapiHeaders(),
      body: JSON.stringify({
        data: { ...parsed.data, isActive: true, members: [] },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("[recipient-group-actions] POST failed:", res.status, text);
      return { success: false, error: `Strapi returned ${res.status}` };
    }

    const json = (await res.json()) as { data: { documentId: string } };
    revalidateTag("recipient-groups", {});
    return { success: true, documentId: json.data?.documentId };
  } catch (err) {
    console.error("[recipient-group-actions] POST error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export async function toggleRecipientGroup(
  documentId: string,
  isActive: boolean,
): Promise<{ success: boolean; error?: string }> {
  const STRAPI_URL = process.env.STRAPI_URL;
  if (!STRAPI_URL || !process.env.STRAPI_API_TOKEN) {
    return { success: false, error: "Strapi is not configured" };
  }

  try {
    const res = await fetch(
      `${STRAPI_URL}/api/recipient-groups/${documentId}`,
      {
        method: "PUT",
        headers: strapiHeaders(),
        body: JSON.stringify({ data: { isActive } }),
      },
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("[recipient-group-actions] toggle PUT failed:", res.status, text);
      return { success: false, error: `Strapi returned ${res.status}` };
    }

    revalidateTag("recipient-groups", {});
    return { success: true };
  } catch (err) {
    console.error("[recipient-group-actions] toggle PUT error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export async function deleteRecipientGroup(
  documentId: string,
): Promise<{ success: boolean; error?: string }> {
  const STRAPI_URL = process.env.STRAPI_URL;
  if (!STRAPI_URL || !process.env.STRAPI_API_TOKEN) {
    return { success: false, error: "Strapi is not configured" };
  }

  try {
    const res = await fetch(
      `${STRAPI_URL}/api/recipient-groups/${documentId}`,
      { method: "DELETE", headers: strapiHeaders() },
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("[recipient-group-actions] DELETE failed:", res.status, text);
      return { success: false, error: `Strapi returned ${res.status}` };
    }

    revalidateTag("recipient-groups", {});
    return { success: true };
  } catch (err) {
    console.error("[recipient-group-actions] DELETE error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

/**
 * Add a member to a recipient group.
 *
 * Strapi 5 repeatable components require the full component array on PUT.
 * The caller passes the current members array + the new member to append,
 * avoiding a round-trip read inside the action.
 */
export async function addGroupMember(
  documentId: string,
  currentMembers: EmailStaffInput[],
  newMember: EmailStaffInput,
): Promise<{ success: boolean; error?: string }> {
  const STRAPI_URL = process.env.STRAPI_URL;
  if (!STRAPI_URL || !process.env.STRAPI_API_TOKEN) {
    return { success: false, error: "Strapi is not configured" };
  }

  const memberParsed = EmailStaffInputSchema.safeParse(newMember);
  if (!memberParsed.success) {
    return { success: false, error: "Invalid member data" };
  }

  // Deduplicate by email
  if (currentMembers.some((m) => m.email === memberParsed.data.email)) {
    return { success: false, error: "Member already in group" };
  }

  const updatedMembers = [...currentMembers, memberParsed.data];

  try {
    const res = await fetch(
      `${STRAPI_URL}/api/recipient-groups/${documentId}`,
      {
        method: "PUT",
        headers: strapiHeaders(),
        body: JSON.stringify({ data: { members: updatedMembers } }),
      },
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("[recipient-group-actions] addMember PUT failed:", res.status, text);
      return { success: false, error: `Strapi returned ${res.status}` };
    }

    revalidateTag("recipient-groups", {});
    return { success: true };
  } catch (err) {
    console.error("[recipient-group-actions] addMember error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

/**
 * Remove a member from a recipient group by their component id.
 *
 * The caller passes the current members array; the action filters and PUTs.
 */
export async function removeGroupMember(
  documentId: string,
  currentMembers: EmailStaffInput[],
  memberEmail: string,
): Promise<{ success: boolean; error?: string }> {
  const STRAPI_URL = process.env.STRAPI_URL;
  if (!STRAPI_URL || !process.env.STRAPI_API_TOKEN) {
    return { success: false, error: "Strapi is not configured" };
  }

  const updatedMembers = currentMembers.filter((m) => m.email !== memberEmail);

  try {
    const res = await fetch(
      `${STRAPI_URL}/api/recipient-groups/${documentId}`,
      {
        method: "PUT",
        headers: strapiHeaders(),
        body: JSON.stringify({ data: { members: updatedMembers } }),
      },
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("[recipient-group-actions] removeMember PUT failed:", res.status, text);
      return { success: false, error: `Strapi returned ${res.status}` };
    }

    revalidateTag("recipient-groups", {});
    return { success: true };
  } catch (err) {
    console.error("[recipient-group-actions] removeMember error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

/**
 * Resolve unique active staff email addresses for a template type + urgency.
 * Server action wrapper around the repository function — called by the client
 * page to test recipient resolution without a full page reload.
 */
export async function resolveRecipientsAction(
  templateType: "service" | "contact" | "quotation",
  urgency: "routine" | "urgent" | "emergency",
): Promise<{ success: boolean; emails: string[]; error?: string }> {
  try {
    const { resolveRecipients } = await import("./recipient-group-repository");
    const emails = await resolveRecipients(templateType, urgency);
    return { success: true, emails };
  } catch (err) {
    console.error("[recipient-group-actions] resolveRecipients error:", err);
    return {
      success: false,
      emails: [],
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
