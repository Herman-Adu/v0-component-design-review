import {
  BookOpen,
  Circle,
  FileText,
  GraduationCap,
  Library,
  Lightbulb,
  Layers,
  Globe,
  ShieldCheck,
  TrendingUp,
  Zap,
  TestTube,
  Rocket,
} from "lucide-react";

import type { ContentRouteManifest } from "@/lib/strapi/dashboard/content-library/content-route-manifest";
import type { NavItem, NavSection } from "./types";

// ---------------------------------------------------------------------------
// Category configuration for article grouping
// ---------------------------------------------------------------------------

const categoryConfig: Record<string, { label: string; icon: React.ElementType }> = {
  rendering: { label: "Rendering Strategies", icon: Globe },
  architecture: { label: "Architecture", icon: Layers },
  forms: { label: "Forms & Validation", icon: FileText },
  security: { label: "Security", icon: ShieldCheck },
  "best-practices": { label: "Best Practices", icon: Lightbulb },
  performance: { label: "Performance", icon: Zap },
  business: { label: "Business & Strategy", icon: TrendingUp },
  testing: { label: "Testing", icon: TestTube },
  devops: { label: "DevOps & CI/CD", icon: Rocket },
  refactoring: { label: "Refactoring", icon: Layers },
  infrastructure: { label: "Infrastructure", icon: Rocket },
  cms: { label: "CMS & Content", icon: FileText },
  "getting-started": { label: "Getting Started", icon: GraduationCap },
  "state-management": { label: "State Management", icon: Zap },
  components: { label: "Components", icon: Layers },
  email: { label: "Email Systems", icon: FileText },
};

function groupByCategory(
  entries: ContentRouteManifest["articles"],
  listPath: string,
): NavItem[] {
  const byCategory: Record<string, NavItem[]> = {};
  for (const entry of entries) {
    if (!categoryConfig[entry.category]) continue;
    if (!byCategory[entry.category]) byCategory[entry.category] = [];
    byCategory[entry.category].push({
      href: entry.path,
      label: entry.title,
      icon: Circle,
    });
  }
  return Object.entries(byCategory).map(([category, items]) => {
    const config = categoryConfig[category] ?? { label: category, icon: Circle };
    return {
      href: listPath,
      label: config.label,
      icon: config.icon,
      children: items,
    };
  });
}

// ---------------------------------------------------------------------------
// Learning Hub nav builder — pure transform from ContentRouteManifest.
// Called server-side in dashboard/layout.tsx; result passed as prop.
// ---------------------------------------------------------------------------

export function buildLearningHubSection(manifest: ContentRouteManifest): NavSection {
  const articleChildren = groupByCategory(
    manifest.articles,
    "/dashboard/content-library/articles",
  );
  const caseStudyChildren = groupByCategory(
    manifest.caseStudies,
    "/dashboard/content-library/case-studies",
  );
  const tutorialChildren = groupByCategory(
    manifest.tutorials,
    "/dashboard/content-library/tutorials",
  );
  const guideChildren: NavItem[] = manifest.guides.map((g) => ({
    href: g.path,
    label: g.title,
    icon: Circle,
  }));

  return {
    title: "Learning Hub",
    icon: Lightbulb,
    items: [
      { href: "/dashboard/content-library", label: "Overview", icon: Library },
      {
        href: "/dashboard/content-library/articles",
        label: "Articles & Insights",
        icon: FileText,
        children: [
          { href: "/dashboard/content-library/articles", label: "All Articles", icon: Library },
          ...articleChildren,
        ],
      },
      {
        href: "/dashboard/content-library/case-studies",
        label: "Case Studies",
        icon: TrendingUp,
        children: [
          { href: "/dashboard/content-library/case-studies", label: "All Case Studies", icon: Library },
          ...caseStudyChildren,
        ],
      },
      {
        href: "/dashboard/content-library/tutorials",
        label: "Tutorials",
        icon: GraduationCap,
        children: [
          { href: "/dashboard/content-library/tutorials", label: "All Tutorials", icon: Library },
          ...tutorialChildren,
        ],
      },
      {
        href: "/dashboard/content-library/guides",
        label: "Ops Guides",
        icon: BookOpen,
        children: [
          { href: "/dashboard/content-library/guides", label: "All Guides", icon: Library },
          ...guideChildren,
        ],
      },
    ],
  };
}
