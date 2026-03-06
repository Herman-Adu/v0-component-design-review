import type { DocumentHealthDocument } from "./document-health-schema";

/**
 * Document Health View Models
 *
 * Transforms the validated Strapi document into UI-ready view models.
 * Icon fields remain as strings — the page resolves them to LucideIcon.
 * Color values map directly to Tailwind color tokens.
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

export interface DocumentHealthPageSectionVM {
  id: string;
  iconName: string;
  title: string;
  description: string;
  href: string;
  role: string;
  pages: number;
  color: string;
}

export interface DocumentHealthHighlightVM {
  id: string;
  iconName: string;
  title: string;
  description: string;
}

export interface DocumentHealthQuickLinkVM {
  id: string;
  iconName: string;
  title: string;
  description: string;
  href: string;
}

export interface DocumentHealthVM {
  header: { iconName: string; title: string; description: string };
  pageSections: DocumentHealthPageSectionVM[];
  highlights: DocumentHealthHighlightVM[];
  quickLinks: DocumentHealthQuickLinkVM[];
}

export function toDocumentHealthVM(doc: DocumentHealthDocument): DocumentHealthVM {
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
