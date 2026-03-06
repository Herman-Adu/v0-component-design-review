import type { AdminOverviewDocument } from "./admin-overview-schema";

/**
 * Admin Overview View Models
 *
 * Transforms the validated Strapi document into UI-ready view models.
 * Icon fields remain as strings — the page resolves them to LucideIcon.
 * Dynamic stats (source='content-library') accept an optional count override.
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

export interface AdminOverviewStatVM {
  id: string;
  label: string;
  displayValue: string | number;
  description: string;
  isHighlighted: boolean;
}

export interface AdminOverviewToolVM {
  href: string;
  iconName: string;
  title: string;
  description: string;
  role: string;
}

export interface AdminOverviewSectionVM {
  id: string;
  iconName: string;
  title: string;
  description: string;
  tools: AdminOverviewToolVM[];
}

export interface AdminOverviewUpcomingVM {
  id: string;
  iconName: string;
  title: string;
  description: string;
  status: string;
}

export interface AdminOverviewCtaVM {
  title: string;
  description: string;
  linkText: string;
  linkHref: string;
  linkIconName: string;
}

export interface AdminOverviewVM {
  header: { iconName: string; title: string; description: string };
  notice: { type: "warning" | "info" | "success" | "error"; title: string; description: string } | null;
  quickStats: AdminOverviewStatVM[];
  toolSections: AdminOverviewSectionVM[];
  upcomingTitle: string;
  upcomingDescription: string;
  upcomingFeatures: AdminOverviewUpcomingVM[];
  cta: AdminOverviewCtaVM | null;
}

export function toAdminOverviewVM(
  doc: AdminOverviewDocument,
  dynamicCounts?: { contentLibrary: number; contentDetail?: string },
): AdminOverviewVM {
  const quickStats: AdminOverviewStatVM[] = doc.quickStats.map((stat) => {
    const isDynamic = stat.source === "content-library" && dynamicCounts;
    return {
      id: stat.statId,
      label: stat.label,
      displayValue: isDynamic ? dynamicCounts.contentLibrary : (stat.value ?? "—"),
      description: isDynamic && dynamicCounts.contentDetail
        ? dynamicCounts.contentDetail
        : (stat.description ?? ""),
      isHighlighted: stat.statId === "content-items",
    };
  });

  const toolSections: AdminOverviewSectionVM[] = doc.toolSections.map((section) => ({
    id: section.sectionId,
    iconName: section.icon,
    title: section.title,
    description: section.description,
    tools: section.tools.map((tool) => ({
      href: tool.href,
      iconName: tool.icon,
      title: tool.title,
      description: tool.description,
      role: tool.badge ?? "",
    })),
  }));

  const upcomingFeatures: AdminOverviewUpcomingVM[] = doc.upcomingFeatures.map((f) => ({
    id: f.featureId,
    iconName: f.icon,
    title: f.title,
    description: f.description,
    status: f.status ?? "Coming Soon",
  }));

  return {
    header: {
      iconName: doc.header?.icon ?? "",
      title: doc.header?.title ?? "",
      description: doc.header?.description ?? "",
    },
    notice: doc.notice
      ? {
          type: doc.notice.noticeType,
          title: doc.notice.title,
          description: doc.notice.description,
        }
      : null,
    quickStats,
    toolSections,
    upcomingTitle: doc.upcomingTitle ?? "Upcoming Features",
    upcomingDescription: doc.upcomingDescription ?? "",
    upcomingFeatures,
    cta: doc.cta
      ? {
          title: doc.cta.title,
          description: doc.cta.description,
          linkText: doc.cta.linkText,
          linkHref: doc.cta.linkHref,
          linkIconName: doc.cta.linkIcon ?? "ArrowRight",
        }
      : null,
  };
}
