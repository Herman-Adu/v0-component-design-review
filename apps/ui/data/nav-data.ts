import React from "react";
import {
  BookOpen,
  Code,
  Database,
  Plug,
  Zap,
  TestTube,
  Rocket,
  AlertCircle,
  Home,
  FileCheck,
  Layers,
  Mail,
  Globe,
  FileCode,
  LayoutGrid,
  FileText,
  Share2,
  GraduationCap,
  TrendingUp,
  Library,
  ShieldCheck,
  MailCheck,
  Shield,
  Circle,
  Settings,
  Lightbulb,
  Activity,
  HeartPulse,
  Link2,
  SearchCheck,
  Wrench,
  Box,
  Server,
  GitBranch,
  Compass,
  Palette,
  Send,
  History,
  Split,
  Clock,
  Briefcase,
  ClipboardCheck,
  Inbox,
  UsersRound,
  Timer,
  Eye,
  HardDrive,
  FlaskConical,
  BarChart3,
  FolderCog,
  Cog,
  Megaphone,
  Search,
  Tag,
  DollarSign,
  Building2,
  PenSquare,
  LineChart,
} from "lucide-react";

import type { ContentRouteManifest } from "@/lib/strapi/dashboard/content-library/content-route-manifest";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  children?: NavItem[];
}

export interface NavSection {
  title: string;
  icon: React.ElementType;
  items: NavItem[];
}

// ---------------------------------------------------------------------------
// Category configuration for article grouping
// ---------------------------------------------------------------------------

const categoryConfig: Record<
  string,
  { label: string; icon: React.ElementType }
> = {
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

// ---------------------------------------------------------------------------
// Learning Hub nav builder — pure transform from ContentRouteManifest
// Called server-side in dashboard/layout.tsx; result passed as prop.
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Section definitions
// ---------------------------------------------------------------------------

// adminSection is defined after all sub-section items below (forward reference guard)

// ---------------------------------------------------------------------------
// Digital Marketing -- Platform Marketing & Content Distribution
// ---------------------------------------------------------------------------
// Consolidates content tools, social media, and per-platform marketing.
// Google subsection built out first; LinkedIn, Twitter/X, Facebook stubs.

const DM = "/dashboard/admin/digital-marketing";

const dmGoogleItems: NavItem[] = [
  { href: `${DM}/google`, label: "Overview", icon: Search },
  {
    href: `${DM}/google/business-profile`,
    label: "Business Profile & FAQs",
    icon: Building2,
  },
  { href: `${DM}/google/seo`, label: "SEO & Site Optimization", icon: Search },
  { href: `${DM}/google/tag-manager`, label: "Tag Manager", icon: Tag },
  {
    href: `${DM}/google/ads-campaigns`,
    label: "Ads & Campaigns",
    icon: DollarSign,
  },
  {
    href: `${DM}/google/analytics`,
    label: "Analytics & Reporting",
    icon: LineChart,
  },
  { href: `${DM}/google/composer`, label: "Content Composer", icon: PenSquare },
];

const dmLinkedInItems: NavItem[] = [
  { href: `${DM}/linkedin`, label: "Overview", icon: Share2 },
  {
    href: `${DM}/linkedin/company-page`,
    label: "Company Page",
    icon: Building2,
  },
  { href: `${DM}/linkedin/composer`, label: "Post Composer", icon: PenSquare },
  {
    href: `${DM}/linkedin/articles`,
    label: "Article Publisher",
    icon: FileText,
  },
  {
    href: `${DM}/linkedin/connection-strategy`,
    label: "Connection Strategy",
    icon: UsersRound,
  },
  { href: `${DM}/linkedin/analytics`, label: "Analytics", icon: LineChart },
];

const dmTwitterItems: NavItem[] = [
  { href: `${DM}/twitter`, label: "Overview", icon: Globe },
  { href: `${DM}/twitter/composer`, label: "Tweet Composer", icon: PenSquare },
  { href: `${DM}/twitter/threads`, label: "Thread Builder", icon: FileText },
  {
    href: `${DM}/twitter/hashtag-strategy`,
    label: "Hashtag Strategy",
    icon: Tag,
  },
  {
    href: `${DM}/twitter/engagement`,
    label: "Engagement Playbook",
    icon: UsersRound,
  },
  { href: `${DM}/twitter/analytics`, label: "Analytics", icon: LineChart },
];

const dmFacebookItems: NavItem[] = [
  { href: `${DM}/facebook`, label: "Overview", icon: Globe },
  {
    href: `${DM}/facebook/page-management`,
    label: "Page Management",
    icon: Building2,
  },
  { href: `${DM}/facebook/composer`, label: "Post Composer", icon: PenSquare },
  {
    href: `${DM}/facebook/events`,
    label: "Events & Promotions",
    icon: Megaphone,
  },
  {
    href: `${DM}/facebook/messenger`,
    label: "Messenger Templates",
    icon: FileText,
  },
  { href: `${DM}/facebook/analytics`, label: "Analytics", icon: LineChart },
];

export const digitalMarketingSection: NavSection = {
  title: "Digital Marketing",
  icon: Megaphone,
  items: [
    { href: DM, label: "Overview", icon: Megaphone },
    { href: `${DM}/getting-started`, label: "Getting Started", icon: Rocket },
    {
      href: `${DM}/content-strategy`,
      label: "Content Strategy",
      icon: TrendingUp,
    },
    {
      href: `${DM}/google`,
      label: "Google",
      icon: Search,
      children: dmGoogleItems,
    },
    {
      href: `${DM}/linkedin`,
      label: "LinkedIn",
      icon: Share2,
      children: dmLinkedInItems,
    },
    {
      href: `${DM}/twitter`,
      label: "Twitter/X",
      icon: Globe,
      children: dmTwitterItems,
    },
    {
      href: `${DM}/facebook`,
      label: "Facebook",
      icon: Globe,
      children: dmFacebookItems,
    },
  ],
};

// ---------------------------------------------------------------------------
// Document Administration -- Unified Documentation Oversight
// ---------------------------------------------------------------------------
// Combines strategic documentation health (coverage, planning, gap analysis)
// with automated QA tools (validation, route checks, pattern compliance).
// Nested URL structure mirrors Email Administration pattern.
// Roles: Project Lead, CTO, Web Administrator, DevOps.

const DA = "/dashboard/admin/document-health";

// Documentation Health subsection items
const docAdminHealth: NavItem[] = [
  { href: `${DA}/documentation-health`, label: "Overview", icon: HeartPulse },
  {
    href: `${DA}/documentation-health/gap-analysis`,
    label: "Gap Discovery Engine",
    icon: Compass,
  },
];

// Quality Engineering subsection items
const docAdminQualityEngineering: NavItem[] = [
  { href: `${DA}/quality-engineering`, label: "Overview", icon: FlaskConical },
  {
    href: `${DA}/quality-engineering/count-validation`,
    label: "Count Validation",
    icon: SearchCheck,
  },
  {
    href: `${DA}/quality-engineering/route-verification`,
    label: "Route Verification",
    icon: Link2,
  },
  {
    href: `${DA}/quality-engineering/toc-integrity`,
    label: "TOC Integrity",
    icon: ClipboardCheck,
  },
  {
    href: `${DA}/quality-engineering/pattern-compliance`,
    label: "Pattern Compliance",
    icon: FileCheck,
  },
  {
    href: `${DA}/quality-engineering/fix-actions`,
    label: "Fix Actions",
    icon: Wrench,
  },
];

export const documentAdministrationSection: NavSection = {
  title: "Document Health",
  icon: HeartPulse,
  items: [
    { href: DA, label: "Overview", icon: HeartPulse },
    { href: `${DA}/getting-started`, label: "Getting Started", icon: Rocket },
    {
      href: `${DA}/documentation-health`,
      label: "Documentation Health",
      icon: HeartPulse,
      children: docAdminHealth,
    },
    {
      href: `${DA}/quality-engineering`,
      label: "Quality Engineering",
      icon: FlaskConical,
      children: docAdminQualityEngineering,
    },
  ],
};

// Legacy aliases for backward compatibility
export const docHealthSection = documentAdministrationSection;
export const docQASection = documentAdministrationSection;

// ---------------------------------------------------------------------------
// Email Administration -- Consolidated All Email Operations
// ---------------------------------------------------------------------------
// Unified section: request handling, brand configuration, and infrastructure.
// Nested URL structure mirrors documentation pattern.
// Roles: Business Administrator, Office Staff, Project Lead, DevOps.

const EA = "/dashboard/admin/email-management";

// Request Management subsection items
const emailAdminRequestManagement: NavItem[] = [
  { href: `${EA}/request-management`, label: "Overview", icon: Inbox },
  {
    href: `${EA}/request-management/email-dashboard`,
    label: "Email Dashboard",
    icon: Briefcase,
  },
  {
    href: `${EA}/request-management/testing-and-ops-guide`,
    label: "Testing & Ops Guide",
    icon: ClipboardCheck,
  },
];

// Configuration subsection items
const emailAdminConfiguration: NavItem[] = [
  { href: `${EA}/configuration`, label: "Overview", icon: Mail },
  {
    href: `${EA}/configuration/template-and-brand`,
    label: "Template & Brand",
    icon: Palette,
  },
  {
    href: `${EA}/configuration/email-preview`,
    label: "Email Preview",
    icon: Eye,
  },
  {
    href: `${EA}/configuration/ab-subject-lines`,
    label: "A/B Subject Lines",
    icon: Split,
  },
  {
    href: `${EA}/configuration/recipient-groups`,
    label: "Recipient Groups",
    icon: UsersRound,
  },
  {
    href: `${EA}/configuration/email-scheduling`,
    label: "Email Scheduling",
    icon: Timer,
  },
];

// Infrastructure subsection items
const emailAdminInfrastructure: NavItem[] = [
  { href: `${EA}/infrastructure`, label: "Overview", icon: HardDrive },
  {
    href: `${EA}/infrastructure/send-configuration`,
    label: "Send Configuration",
    icon: Send,
  },
  {
    href: `${EA}/infrastructure/delivery-logs`,
    label: "Delivery Logs",
    icon: Activity,
  },
  {
    href: `${EA}/infrastructure/version-history`,
    label: "Version History",
    icon: History,
  },
  {
    href: `${EA}/infrastructure/security-audit`,
    label: "Security Audit",
    icon: ShieldCheck,
  },
];

export const emailAdministrationSection: NavSection = {
  title: "Email Management",
  icon: Mail,
  items: [
    { href: EA, label: "Overview", icon: Mail },
    { href: `${EA}/getting-started`, label: "Getting Started", icon: Rocket },
    {
      href: `${EA}/request-management`,
      label: "Request Management",
      icon: Briefcase,
      children: emailAdminRequestManagement,
    },
    {
      href: `${EA}/configuration`,
      label: "Configuration",
      icon: Palette,
      children: emailAdminConfiguration,
    },
    {
      href: `${EA}/infrastructure`,
      label: "Infrastructure",
      icon: HardDrive,
      children: emailAdminInfrastructure,
    },
  ],
};

// Legacy aliases
export const emailManagementSection = emailAdministrationSection;

// ---------------------------------------------------------------------------
// Admin — top-level section nesting Digital Marketing, Document Health,
// and Email Management as children. Defined here (after all sub-section
// consts) to avoid forward reference errors.
// ---------------------------------------------------------------------------

export const adminSection: NavSection = {
  title: "Admin",
  icon: ShieldCheck,
  items: [
    { href: "/dashboard/admin", label: "Overview", icon: ShieldCheck },
    {
      href: DM,
      label: "Digital Marketing",
      icon: Megaphone,
      children: [
        { href: DM, label: "Overview", icon: Megaphone },
        { href: `${DM}/getting-started`, label: "Getting Started", icon: Rocket },
        { href: `${DM}/content-strategy`, label: "Content Strategy", icon: TrendingUp },
        { href: `${DM}/google`, label: "Google", icon: Search, children: dmGoogleItems },
        { href: `${DM}/linkedin`, label: "LinkedIn", icon: Share2, children: dmLinkedInItems },
        { href: `${DM}/twitter`, label: "Twitter/X", icon: Globe, children: dmTwitterItems },
        { href: `${DM}/facebook`, label: "Facebook", icon: Globe, children: dmFacebookItems },
      ],
    },
    {
      href: DA,
      label: "Document Health",
      icon: HeartPulse,
      children: [
        { href: DA, label: "Overview", icon: HeartPulse },
        { href: `${DA}/getting-started`, label: "Getting Started", icon: Rocket },
        {
          href: `${DA}/documentation-health`,
          label: "Documentation Health",
          icon: HeartPulse,
          children: docAdminHealth,
        },
        {
          href: `${DA}/quality-engineering`,
          label: "Quality Engineering",
          icon: FlaskConical,
          children: docAdminQualityEngineering,
        },
      ],
    },
    {
      href: EA,
      label: "Email Management",
      icon: Mail,
      children: [
        { href: EA, label: "Overview", icon: Mail },
        { href: `${EA}/getting-started`, label: "Getting Started", icon: Rocket },
        {
          href: `${EA}/request-management`,
          label: "Request Management",
          icon: Briefcase,
          children: emailAdminRequestManagement,
        },
        {
          href: `${EA}/configuration`,
          label: "Configuration",
          icon: Palette,
          children: emailAdminConfiguration,
        },
        {
          href: `${EA}/infrastructure`,
          label: "Infrastructure",
          icon: HardDrive,
          children: emailAdminInfrastructure,
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Strategic Overview -- CTO / Project Lead / Business
// ---------------------------------------------------------------------------
// Everything a non-developer decision-maker needs: ROI, project health,
// architectural overview, code review findings.

export const strategicOverviewSection: NavSection = {
  title: "Strategic Overview",
  icon: BarChart3,
  items: [
    {
      href: "/dashboard/documentation/strategic-overview/overview",
      label: "Overview",
      icon: Home,
    },
    {
      href: "/dashboard/documentation/strategic-overview/system-vision",
      label: "System Vision",
      icon: Database,
    },
    {
      href: "/dashboard/documentation/strategic-overview/why-strapi",
      label: "Why Strapi (CTO)",
      icon: TrendingUp,
    },
    {
      href: "/dashboard/documentation/strategic-overview/getting-started-overview",
      label: "Getting Started",
      icon: Rocket,
    },
    {
      href: "/dashboard/documentation/strategic-overview/app-overview",
      label: "App Overview",
      icon: LayoutGrid,
    },
    {
      href: "/dashboard/documentation/strategic-overview/code-review-log",
      label: "Code Review Log",
      icon: FileCheck,
    },
  ],
};

// ---------------------------------------------------------------------------
// CMS Reference -- Developer / Architect
// ---------------------------------------------------------------------------
// Everything needed to work with Strapi: schemas, content models,
// relationships, onboarding. Pure backend development reference.

export const cmsReferenceSection: NavSection = {
  title: "CMS Reference",
  icon: Database,
  items: [
    {
      href: "/dashboard/documentation/cms-reference/overview",
      label: "Overview",
      icon: Home,
    },
    {
      href: "/dashboard/documentation/cms-reference/getting-started",
      label: "Getting Started",
      icon: Rocket,
    },
    {
      href: "/dashboard/documentation/cms-reference/form-collections",
      label: "Form Collections",
      icon: FileText,
    },
    {
      href: "/dashboard/documentation/cms-reference/content-collections",
      label: "Content Collections",
      icon: BookOpen,
    },
    {
      href: "/dashboard/documentation/cms-reference/single-types",
      label: "Single Types",
      icon: FileCode,
    },
    {
      href: "/dashboard/documentation/cms-reference/shared-components",
      label: "Shared Components",
      icon: Layers,
    },
    {
      href: "/dashboard/documentation/cms-reference/relationships",
      label: "Relationships",
      icon: Link2,
    },
  ],
};

// ---------------------------------------------------------------------------
// App Reference -- Developer / Architect
// ---------------------------------------------------------------------------
// Everything needed to work with the Next.js frontend: architecture, patterns,
// integration, security implementation. Pure frontend development reference.

export const appReferenceSection: NavSection = {
  title: "App Reference",
  icon: FolderCog,
  items: [
    {
      href: "/dashboard/documentation/app-reference/overview",
      label: "Overview",
      icon: Home,
    },
    {
      href: "/dashboard/documentation/app-reference/getting-started",
      label: "Getting Started",
      icon: Rocket,
    },
    {
      href: "/dashboard/documentation/app-reference/component-system",
      label: "Component System",
      icon: LayoutGrid,
    },
    {
      href: "/dashboard/documentation/app-reference/hydration-and-guards",
      label: "Hydration & Guards",
      icon: Shield,
    },
    {
      href: "/dashboard/documentation/app-reference/server-vs-client",
      label: "Server vs Client",
      icon: Layers,
    },
    {
      href: "/dashboard/documentation/app-reference/server-actions-and-api",
      label: "Server Actions & API",
      icon: Code,
    },
    {
      href: "/dashboard/documentation/app-reference/email-system",
      label: "Email System",
      icon: Mail,
    },
    {
      href: "/dashboard/documentation/app-reference/security-architecture",
      label: "Security Architecture",
      icon: Shield,
    },
    {
      href: "/dashboard/documentation/app-reference/performance-and-caching",
      label: "Performance & Caching",
      icon: Zap,
    },
  ],
};

// ---------------------------------------------------------------------------
// Infrastructure & Ops -- DevOps / WebAdmin / QA
// ---------------------------------------------------------------------------
// Deploy, monitor, test, and troubleshoot. No code schemas, no architecture
// theory -- just operational tooling.

export const infrastructureOpsSection: NavSection = {
  title: "Infrastructure & Ops",
  icon: Cog,
  items: [
    {
      href: "/dashboard/documentation/infrastructure-ops/overview",
      label: "Overview",
      icon: Home,
    },
    {
      href: "/dashboard/documentation/infrastructure-ops/getting-started",
      label: "Getting Started",
      icon: Rocket,
    },
    {
      href: "/dashboard/documentation/infrastructure-ops/api-and-graphql",
      label: "API & GraphQL",
      icon: Code,
    },
    {
      href: "/dashboard/documentation/infrastructure-ops/cms-operations",
      label: "CMS Operations",
      icon: Settings,
    },
    {
      href: "/dashboard/documentation/infrastructure-ops/deployment-pipelines",
      label: "Deployment Pipelines",
      icon: Rocket,
    },
    {
      href: "/dashboard/documentation/infrastructure-ops/testing-strategy",
      label: "Testing Strategy",
      icon: TestTube,
    },
    {
      href: "/dashboard/documentation/infrastructure-ops/troubleshooting",
      label: "Troubleshooting",
      icon: AlertCircle,
    },
  ],
};

