import type { EmailManagementDocument } from "./email-management-schema";

/**
 * Email Management View Models
 *
 * Transforms the validated Strapi document into UI-ready view models.
 * Icon fields remain as strings — the page resolves them to LucideIcon.
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

export interface EmailManagementPageSectionVM {
  id: string;
  iconName: string;
  title: string;
  description: string;
  href: string;
  role: string;
  pages: number;
  color: string;
}

export interface EmailManagementHighlightVM {
  id: string;
  iconName: string;
  title: string;
  description: string;
}

export interface EmailManagementQuickLinkVM {
  id: string;
  iconName: string;
  title: string;
  description: string;
  href: string;
}

export interface EmailManagementVM {
  header: { iconName: string; title: string; description: string };
  pageSections: EmailManagementPageSectionVM[];
  highlights: EmailManagementHighlightVM[];
  quickLinks: EmailManagementQuickLinkVM[];
}

export function toEmailManagementVM(doc: EmailManagementDocument): EmailManagementVM {
  return {
    header: {
      iconName: doc.header?.icon ?? "",
      title: doc.header?.title ?? "",
      description: doc.header?.description ?? "",
    },
    pageSections: doc.pageSections.map((s) => ({
      id: s.sectionId,
      iconName: s.icon,
      title: s.title,
      description: s.description,
      href: s.href,
      role: s.role ?? "",
      pages: s.pages ?? 0,
      color: s.color,
    })),
    highlights: doc.highlights.map((h) => ({
      id: h.itemId,
      iconName: h.icon,
      title: h.title,
      description: h.description,
    })),
    quickLinks: doc.quickLinks.map((l) => ({
      id: l.linkId,
      iconName: l.icon,
      title: l.title,
      description: l.description,
      href: l.href,
    })),
  };
}
