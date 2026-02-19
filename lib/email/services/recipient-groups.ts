"use server"

/**
 * Recipient Groups Store
 *
 * Defines groups of internal staff who receive business notification
 * emails per template type. Allows granular control over who gets
 * notified for service requests vs contact vs quotation emails,
 * with special handling for emergency/urgent dispatches.
 *
 * Strapi-ready: migrate to a "recipient-group" collection type
 * with a many-to-many relation to a "staff-member" collection.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface StaffMember {
  id: string
  name: string
  email: string
  role: string
  isActive: boolean
}

export interface RecipientGroup {
  id: string
  name: string
  description: string
  templateTypes: ("service" | "contact" | "quotation")[]
  urgencyFilter: "all" | "emergency-only" | "urgent-and-emergency" | "routine-only"
  members: StaffMember[]
  isActive: boolean
  createdAt: string
}

export interface GroupStats {
  totalGroups: number
  activeGroups: number
  totalMembers: number
  uniqueMembers: number
  coverageByType: Record<string, number>
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function genId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

// ---------------------------------------------------------------------------
// In-memory store
// ---------------------------------------------------------------------------

const groups: RecipientGroup[] = [
  {
    id: genId("rg"),
    name: "Emergency Response Team",
    description: "Receives all emergency and urgent service requests for immediate dispatch",
    templateTypes: ["service"],
    urgencyFilter: "urgent-and-emergency",
    isActive: true,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    members: [
      { id: genId("sm"), name: "James Mitchell", email: "james@electricalservices.com", role: "Lead Electrician", isActive: true },
      { id: genId("sm"), name: "Sarah Thompson", email: "sarah@electricalservices.com", role: "Emergency Coordinator", isActive: true },
      { id: genId("sm"), name: "David Chen", email: "david@electricalservices.com", role: "Senior Technician", isActive: true },
    ],
  },
  {
    id: genId("rg"),
    name: "Quotation Team",
    description: "Handles all incoming quotation requests and prepares estimates",
    templateTypes: ["quotation"],
    urgencyFilter: "all",
    isActive: true,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    members: [
      { id: genId("sm"), name: "Emma Williams", email: "emma@electricalservices.com", role: "Estimator", isActive: true },
      { id: genId("sm"), name: "Michael Brown", email: "michael@electricalservices.com", role: "Senior Estimator", isActive: true },
    ],
  },
  {
    id: genId("rg"),
    name: "Customer Relations",
    description: "Receives all contact form inquiries and general customer communications",
    templateTypes: ["contact"],
    urgencyFilter: "all",
    isActive: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    members: [
      { id: genId("sm"), name: "Lisa Park", email: "lisa@electricalservices.com", role: "Customer Relations Manager", isActive: true },
      { id: genId("sm"), name: "Tom Wilson", email: "tom@electricalservices.com", role: "Support Agent", isActive: true },
    ],
  },
  {
    id: genId("rg"),
    name: "Management Oversight",
    description: "Business owners receive copies of all notifications for oversight",
    templateTypes: ["service", "contact", "quotation"],
    urgencyFilter: "all",
    isActive: true,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    members: [
      { id: genId("sm"), name: "Robert Taylor", email: "robert@electricalservices.com", role: "Managing Director", isActive: true },
    ],
  },
]

// ---------------------------------------------------------------------------
// Server Actions
// ---------------------------------------------------------------------------

export async function getAllGroups(): Promise<RecipientGroup[]> {
  return groups.map((g) => ({ ...g, members: [...g.members] }))
}

export async function getGroupStats(): Promise<GroupStats> {
  const activeGroups = groups.filter((g) => g.isActive).length
  const allMembers = groups.flatMap((g) => g.members.filter((m) => m.isActive))
  const uniqueEmails = new Set(allMembers.map((m) => m.email))

  const coverageByType: Record<string, number> = {}
  for (const type of ["service", "contact", "quotation"]) {
    coverageByType[type] = groups.filter(
      (g) => g.isActive && g.templateTypes.includes(type as "service" | "contact" | "quotation")
    ).length
  }

  return {
    totalGroups: groups.length,
    activeGroups,
    totalMembers: allMembers.length,
    uniqueMembers: uniqueEmails.size,
    coverageByType,
  }
}

export async function createGroup(input: {
  name: string
  description: string
  templateTypes: ("service" | "contact" | "quotation")[]
  urgencyFilter: RecipientGroup["urgencyFilter"]
}): Promise<{ success: boolean; group?: RecipientGroup; error?: string }> {
  if (!input.name.trim()) return { success: false, error: "Group name is required" }
  if (input.templateTypes.length === 0) return { success: false, error: "At least one template type is required" }

  const group: RecipientGroup = {
    id: genId("rg"),
    name: input.name.trim(),
    description: input.description.trim(),
    templateTypes: input.templateTypes,
    urgencyFilter: input.urgencyFilter,
    members: [],
    isActive: true,
    createdAt: new Date().toISOString(),
  }
  groups.push(group)
  return { success: true, group }
}

export async function addMember(
  groupId: string,
  member: { name: string; email: string; role: string }
): Promise<{ success: boolean; error?: string }> {
  const group = groups.find((g) => g.id === groupId)
  if (!group) return { success: false, error: "Group not found" }
  if (!member.email.trim()) return { success: false, error: "Email is required" }
  if (group.members.some((m) => m.email === member.email.trim())) {
    return { success: false, error: "Member already in group" }
  }

  group.members.push({
    id: genId("sm"),
    name: member.name.trim(),
    email: member.email.trim().toLowerCase(),
    role: member.role.trim(),
    isActive: true,
  })
  return { success: true }
}

export async function removeMember(
  groupId: string,
  memberId: string
): Promise<{ success: boolean; error?: string }> {
  const group = groups.find((g) => g.id === groupId)
  if (!group) return { success: false, error: "Group not found" }
  group.members = group.members.filter((m) => m.id !== memberId)
  return { success: true }
}

export async function toggleGroup(
  groupId: string
): Promise<{ success: boolean; isActive?: boolean; error?: string }> {
  const group = groups.find((g) => g.id === groupId)
  if (!group) return { success: false, error: "Group not found" }
  group.isActive = !group.isActive
  return { success: true, isActive: group.isActive }
}

export async function deleteGroup(
  groupId: string
): Promise<{ success: boolean; error?: string }> {
  const idx = groups.findIndex((g) => g.id === groupId)
  if (idx === -1) return { success: false, error: "Group not found" }
  groups.splice(idx, 1)
  return { success: true }
}

/**
 * Resolve recipients for a given template type and urgency.
 * Called at send-time by email services to get the CC/BCC list.
 */
export async function resolveRecipients(
  templateType: "service" | "contact" | "quotation",
  urgency: "routine" | "urgent" | "emergency" = "routine"
): Promise<string[]> {
  const matching = groups.filter((g) => {
    if (!g.isActive) return false
    if (!g.templateTypes.includes(templateType)) return false

    switch (g.urgencyFilter) {
      case "all":
        return true
      case "emergency-only":
        return urgency === "emergency"
      case "urgent-and-emergency":
        return urgency === "urgent" || urgency === "emergency"
      case "routine-only":
        return urgency === "routine"
      default:
        return true
    }
  })

  const emails = new Set<string>()
  for (const g of matching) {
    for (const m of g.members) {
      if (m.isActive) emails.add(m.email)
    }
  }
  return Array.from(emails)
}
