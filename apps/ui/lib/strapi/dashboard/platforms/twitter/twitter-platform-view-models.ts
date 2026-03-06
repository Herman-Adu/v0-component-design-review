import type { TwitterPlatformDocument } from "./twitter-platform-schema";

/**
 * Twitter Platform View Models
 *
 * Transforms the validated Strapi document into UI-ready view models.
 * Icon fields remain as strings — the page resolves them to LucideIcon.
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

export interface TwitterEcosystemPhaseVM {
  title: string;
  description: string;
  items: string[];
}

export interface TwitterToolVM {
  id: string;
  href: string;
  iconName: string;
  title: string;
  description: string;
  role: string;
  status: string;
}

export interface TwitterPlatformVM {
  header: { iconName: string; title: string; description: string } | null;
  introTitle: string;
  introText: string;
  ecosystemPhases: TwitterEcosystemPhaseVM[];
  tools: TwitterToolVM[];
}

export function toTwitterPlatformVM(doc: TwitterPlatformDocument): TwitterPlatformVM {
  return {
    header: doc.header ? { iconName: doc.header.icon, title: doc.header.title, description: doc.header.description } : null,
    introTitle: doc.introTitle ?? "Twitter/X Ecosystem",
    introText: doc.introText ?? "",
    ecosystemPhases: doc.ecosystemPhases.map((p) => ({
      title: p.title,
      description: p.description,
      items: p.items,
    })),
    tools: doc.tools.map((t) => ({
      id: t.itemId,
      href: t.href,
      iconName: t.icon,
      title: t.title,
      description: t.description,
      role: t.badge ?? "",
      status: t.status ?? "Active",
    })),
  };
}
