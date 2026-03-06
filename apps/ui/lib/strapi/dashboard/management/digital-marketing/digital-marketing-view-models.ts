import type { DigitalMarketingDocument } from "./digital-marketing-schema";

/**
 * Digital Marketing View Models
 *
 * Transforms the validated Strapi document into UI-ready view models.
 * Icon fields remain as strings — the page resolves them to LucideIcon.
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

export interface DigitalMarketingStatVM {
  id: string;
  label: string;
  value: string;
  description: string;
}

export interface DigitalMarketingQuickLinkVM {
  id: string;
  iconName: string;
  title: string;
  description: string;
  href: string;
}

export interface DigitalMarketingPageItemVM {
  label: string;
  iconName: string;
}

export interface DigitalMarketingPlatformVM {
  id: string;
  iconName: string;
  title: string;
  description: string;
  href: string;
  status: string;
  badge: string;
  badgeColor: string;
  iconColor: string;
  pageItems: DigitalMarketingPageItemVM[];
}

export interface DigitalMarketingNoticeVM {
  type: "warning" | "info" | "success" | "error";
  title: string;
  description: string;
}

export interface DigitalMarketingVM {
  header: { iconName: string; title: string; description: string } | null;
  notice: DigitalMarketingNoticeVM | null;
  quickStats: DigitalMarketingStatVM[];
  quickLinks: DigitalMarketingQuickLinkVM[];
  platforms: DigitalMarketingPlatformVM[];
}

export function toDigitalMarketingVM(doc: DigitalMarketingDocument): DigitalMarketingVM {
  return {
    header: doc.header ? { iconName: doc.header.icon, title: doc.header.title, description: doc.header.description } : null,
    notice: doc.notice
      ? { type: doc.notice.noticeType, title: doc.notice.title, description: doc.notice.description }
      : null,
    quickStats: doc.quickStats.map((s) => ({
      id: s.statId,
      label: s.label,
      value: s.value ?? "—",
      description: s.description ?? "",
    })),
    quickLinks: doc.quickLinks.map((l) => ({
      id: l.linkId,
      iconName: l.icon,
      title: l.title,
      description: l.description,
      href: l.href,
    })),
    platforms: doc.platforms.map((p) => ({
      id: p.platformId,
      iconName: p.icon,
      title: p.title,
      description: p.description,
      href: p.href,
      status: p.status,
      badge: p.badge ?? "",
      badgeColor: p.badgeColor ?? "slate",
      iconColor: p.iconColor ?? "slate",
      pageItems: p.pageItems.map((pi) => ({ label: pi.itemLabel, iconName: pi.icon })),
    })),
  };
}
