"use server"

/**
 * Dark Mode Template Service
 *
 * Manages dark mode color overrides for email templates.
 * Each template type can have its own dark mode color scheme
 * which gets injected as @media (prefers-color-scheme: dark)
 * CSS blocks into the email HTML.
 *
 * Strapi-ready: Will map to dark-mode-config component type
 * on the email-configuration single-type.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface DarkModeColorScheme {
  bgBody: string
  bgCard: string
  bgFooter: string
  textPrimary: string
  textSecondary: string
  textMuted: string
  borderColor: string
  headerGradientStart: string
  headerGradientEnd: string
  accentColor: string
  accentColorLight: string
  linkColor: string
}

export interface DarkModeConfig {
  templateId: string
  templateLabel: string
  enabled: boolean
  scheme: DarkModeColorScheme
  lastUpdated: string
}

export interface DarkModeState {
  globalEnabled: boolean
  configs: DarkModeConfig[]
}

// ---------------------------------------------------------------------------
// Default dark mode colour scheme
// ---------------------------------------------------------------------------
const DEFAULT_DARK_SCHEME: DarkModeColorScheme = {
  bgBody: "#1a1a2e",
  bgCard: "#16213e",
  bgFooter: "#0f0f23",
  textPrimary: "#e2e8f0",
  textSecondary: "#94a3b8",
  textMuted: "#64748b",
  borderColor: "#334155",
  headerGradientStart: "#0f172a",
  headerGradientEnd: "#1e293b",
  accentColor: "#f59e0b",
  accentColorLight: "#fbbf24",
  linkColor: "#60a5fa",
}

// ---------------------------------------------------------------------------
// In-memory store (seeded with defaults for all 6 templates)
// ---------------------------------------------------------------------------
const TEMPLATE_ENTRIES: { id: string; label: string }[] = [
  { id: "service-customer", label: "Service Request -- Customer" },
  { id: "service-business", label: "Service Request -- Business" },
  { id: "contact-customer", label: "Contact Inquiry -- Customer" },
  { id: "contact-business", label: "Contact Inquiry -- Business" },
  { id: "quotation-customer", label: "Quotation Request -- Customer" },
  { id: "quotation-business", label: "Quotation Request -- Business" },
]

const state: DarkModeState = {
  globalEnabled: true,
  configs: TEMPLATE_ENTRIES.map((t) => ({
    templateId: t.id,
    templateLabel: t.label,
    enabled: true,
    scheme: { ...DEFAULT_DARK_SCHEME },
    lastUpdated: new Date().toISOString(),
  })),
}

// ---------------------------------------------------------------------------
// Read actions
// ---------------------------------------------------------------------------
export async function getDarkModeState(): Promise<DarkModeState> {
  return structuredClone(state)
}

export async function getDarkModeConfig(templateId: string): Promise<DarkModeConfig | null> {
  const config = state.configs.find((c) => c.templateId === templateId)
  return config ? structuredClone(config) : null
}

// ---------------------------------------------------------------------------
// Write actions
// ---------------------------------------------------------------------------
export async function setGlobalDarkMode(enabled: boolean): Promise<DarkModeState> {
  state.globalEnabled = enabled
  return structuredClone(state)
}

export async function toggleTemplateDarkMode(templateId: string): Promise<DarkModeConfig | null> {
  const config = state.configs.find((c) => c.templateId === templateId)
  if (!config) return null
  config.enabled = !config.enabled
  config.lastUpdated = new Date().toISOString()
  return structuredClone(config)
}

export async function updateDarkModeScheme(
  templateId: string,
  updates: Partial<DarkModeColorScheme>
): Promise<DarkModeConfig | null> {
  const config = state.configs.find((c) => c.templateId === templateId)
  if (!config) return null
  config.scheme = { ...config.scheme, ...updates }
  config.lastUpdated = new Date().toISOString()
  return structuredClone(config)
}

export async function resetDarkModeScheme(templateId: string): Promise<DarkModeConfig | null> {
  const config = state.configs.find((c) => c.templateId === templateId)
  if (!config) return null
  config.scheme = { ...DEFAULT_DARK_SCHEME }
  config.lastUpdated = new Date().toISOString()
  return structuredClone(config)
}

export async function applySchemeToAll(sourceTemplateId: string): Promise<DarkModeState> {
  const source = state.configs.find((c) => c.templateId === sourceTemplateId)
  if (!source) return structuredClone(state)
  for (const config of state.configs) {
    if (config.templateId !== sourceTemplateId) {
      config.scheme = { ...source.scheme }
      config.lastUpdated = new Date().toISOString()
    }
  }
  return structuredClone(state)
}

// ---------------------------------------------------------------------------
// CSS generation -- produces the @media block for injection
// ---------------------------------------------------------------------------
export async function generateDarkModeCss(templateId: string): Promise<string> {
  const config = state.configs.find((c) => c.templateId === templateId)
  if (!config || !config.enabled || !state.globalEnabled) return ""

  const s = config.scheme
  return `@media (prefers-color-scheme: dark) {
  body, .email-body { background-color: ${s.bgBody} !important; }
  .email-card, .email-content { background-color: ${s.bgCard} !important; }
  .email-footer { background-color: ${s.bgFooter} !important; }
  .email-header { background: linear-gradient(135deg, ${s.headerGradientStart} 0%, ${s.headerGradientEnd} 100%) !important; }
  h1, h2, h3, .text-primary { color: ${s.textPrimary} !important; }
  p, td, .text-secondary { color: ${s.textSecondary} !important; }
  .text-muted, .text-light { color: ${s.textMuted} !important; }
  .email-border, hr, .divider { border-color: ${s.borderColor} !important; }
  .accent, .brand-accent { color: ${s.accentColor} !important; }
  .accent-light { color: ${s.accentColorLight} !important; }
  a, .email-link { color: ${s.linkColor} !important; }
}`
}

export async function getDefaultDarkScheme(): Promise<DarkModeColorScheme> {
  return { ...DEFAULT_DARK_SCHEME }
}
