"use server"

/**
 * Template Versioning Store
 *
 * Tracks every config change with timestamps, author, change description,
 * and a snapshot of the changed values. Supports rollback to any prior version.
 *
 * In-memory store for now. Strapi-ready: migrate to a "template-version"
 * collection type with relations to the email-configuration single type.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ConfigChange {
  field: string
  oldValue: string
  newValue: string
}

export interface TemplateVersion {
  id: string
  version: number
  timestamp: string
  author: string
  section: "company" | "brand" | "sla" | "template" | "urgency" | "all"
  description: string
  changes: ConfigChange[]
  snapshot: Record<string, unknown>
}

export interface VersionListResult {
  versions: TemplateVersion[]
  total: number
  page: number
  pageSize: number
}

// ---------------------------------------------------------------------------
// In-memory store (module-level singleton)
// ---------------------------------------------------------------------------

const versions: TemplateVersion[] = []
let nextVersion = 1

function generateId(): string {
  return `tv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

// Seed with an initial "baseline" version so the page is never empty
function ensureBaseline() {
  if (versions.length > 0) return
  versions.push({
    id: generateId(),
    version: nextVersion++,
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    author: "System",
    section: "all",
    description: "Initial configuration baseline -- all defaults loaded",
    changes: [],
    snapshot: { note: "Initial state -- factory defaults" },
  })
  versions.push({
    id: generateId(),
    version: nextVersion++,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    author: "Admin",
    section: "brand",
    description: "Updated primary brand color from blue to amber",
    changes: [
      { field: "BRAND_COLORS.primary", oldValue: "#3b82f6", newValue: "#f59e0b" },
      { field: "BRAND_COLORS.primaryLight", oldValue: "#60a5fa", newValue: "#fbbf24" },
      { field: "BRAND_COLORS.primaryDark", oldValue: "#2563eb", newValue: "#d97706" },
    ],
    snapshot: { primary: "#f59e0b", primaryLight: "#fbbf24", primaryDark: "#d97706" },
  })
  versions.push({
    id: generateId(),
    version: nextVersion++,
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    author: "Admin",
    section: "sla",
    description: "Tightened emergency SLA from 1 hour to 30 minutes",
    changes: [
      { field: "SLA.service.emergency.time", oldValue: "1 hour", newValue: "30 minutes" },
      { field: "SLA.service.emergency.description", oldValue: "Our emergency team will call you within 1 hour", newValue: "Our emergency team will call you within 30 minutes" },
    ],
    snapshot: { emergencyTime: "30 minutes" },
  })
  versions.push({
    id: generateId(),
    version: nextVersion++,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    author: "Admin",
    section: "company",
    description: "Updated company phone number",
    changes: [
      { field: "COMPANY.phone.primary", oldValue: "0800 111 2222", newValue: "0800 123 4567" },
    ],
    snapshot: { phonePrimary: "0800 123 4567" },
  })
}

// ---------------------------------------------------------------------------
// Server Actions
// ---------------------------------------------------------------------------

export async function getVersions(
  page = 1,
  pageSize = 20,
  section?: string
): Promise<VersionListResult> {
  ensureBaseline()

  let filtered = [...versions]
  if (section && section !== "all") {
    filtered = filtered.filter((v) => v.section === section)
  }

  // Sort newest first
  filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  const total = filtered.length
  const start = (page - 1) * pageSize
  const paged = filtered.slice(start, start + pageSize)

  return { versions: paged, total, page, pageSize }
}

export async function getVersionById(id: string): Promise<TemplateVersion | null> {
  ensureBaseline()
  return versions.find((v) => v.id === id) || null
}

export async function createVersion(input: {
  author: string
  section: TemplateVersion["section"]
  description: string
  changes: ConfigChange[]
  snapshot: Record<string, unknown>
}): Promise<TemplateVersion> {
  ensureBaseline()

  const version: TemplateVersion = {
    id: generateId(),
    version: nextVersion++,
    timestamp: new Date().toISOString(),
    author: input.author,
    section: input.section,
    description: input.description,
    changes: input.changes,
    snapshot: input.snapshot,
  }

  versions.push(version)
  return version
}

export async function rollbackToVersion(id: string): Promise<{
  success: boolean
  rolledBackTo: number
  newVersion: TemplateVersion | null
  error?: string
}> {
  ensureBaseline()

  const target = versions.find((v) => v.id === id)
  if (!target) {
    return { success: false, rolledBackTo: 0, newVersion: null, error: "Version not found" }
  }

  // Create a new version that represents the rollback
  const rollbackVersion: TemplateVersion = {
    id: generateId(),
    version: nextVersion++,
    timestamp: new Date().toISOString(),
    author: "Admin (Rollback)",
    section: target.section,
    description: `Rolled back to v${target.version}: "${target.description}"`,
    changes: target.changes.map((c) => ({
      field: c.field,
      oldValue: c.newValue,
      newValue: c.oldValue,
    })),
    snapshot: target.snapshot,
  }

  versions.push(rollbackVersion)

  return {
    success: true,
    rolledBackTo: target.version,
    newVersion: rollbackVersion,
  }
}

export async function getVersionStats(): Promise<{
  totalVersions: number
  latestVersion: number
  lastModified: string
  changesBySection: Record<string, number>
}> {
  ensureBaseline()

  const changesBySection: Record<string, number> = {}
  for (const v of versions) {
    changesBySection[v.section] = (changesBySection[v.section] || 0) + 1
  }

  const sorted = [...versions].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  return {
    totalVersions: versions.length,
    latestVersion: nextVersion - 1,
    lastModified: sorted[0]?.timestamp || new Date().toISOString(),
    changesBySection,
  }
}
