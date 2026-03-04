export type DashboardIconName =
  | "Code"
  | "Database"
  | "Rocket"
  | "Layers"
  | "Shield"
  | "ShieldCheck"
  | "BookOpen"
  | "LayoutGrid"
  | "Zap"
  | "TestTube"
  | "ArrowRight"
  | "Lock"
  | "HeartPulse"
  | "Activity"
  | "SearchCheck"
  | "Link2"
  | "ClipboardCheck"
  | "FileCheck"
  | "Wrench"
  | "Compass"
  | "FlaskConical"
  | "Target"
  | "Megaphone"
  | "MailCheck"
  | "Share2"
  | "Users"
  | "BarChart3"
  | "Settings"
  | "Search"
  | "Globe"
  | "TrendingUp"
  | "Building2"
  | "Tag"
  | "DollarSign"
  | "LineChart"
  | "PenSquare"
  | "Briefcase"
  | "Palette"
  | "HardDrive"
  | "MessageSquare"
  | "Server"
  | "Clock"
  | "Mail"
  | "AlertCircle"
  | "GraduationCap"
  | "FileText"
  | "CheckCircle2"
  | "Heart"
  | "Sparkles"
  | "TrendingUp"
  | "LinkedinIcon"
  | "TwitterIcon"
  | "FacebookIcon"
  | "InstagramIcon"
  | "Route"
  | "Cloud"
  | "Lightbulb"
  | "Gauge"
  | "Link"
  | "CheckCircle";

interface BadgeConfig {
  text: string;
  variant?: "default" | "success" | "warning" | "outline";
  color?: "blue" | "purple" | "orange" | "green";
}

interface Callout {
  type: "success" | "warning" | "info" | "error" | "tip";
  title: string;
  description: string;
}

interface NavigationCard {
  id: string;
  title: string;
  description: string;
  icon: DashboardIconName;
  badge: BadgeConfig;
  href: string;
  features: string[];
}

interface QuickStartGuide {
  id: string;
  title: string;
  description: string;
  icon: DashboardIconName;
  duration: string;
  href: string;
}

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: DashboardIconName;
}

interface Topic {
  id: string;
  title: string;
  description: string;
  icon: DashboardIconName;
  badge: string;
  href: string;
}

export interface DashboardGettingStartedContent {
  header: {
    badge: BadgeConfig;
    title: string;
    description: string;
    tags: string[];
  };
  callout: Callout;
  startingPoints: {
    title: string;
    description: string;
    cards: NavigationCard[];
  };
  quickStartGuides: {
    title: string;
    description: string;
    guides: QuickStartGuide[];
  };
  features: {
    title: string;
    items: Feature[];
  };
  topicsOverview: {
    title: string;
    description: string;
    topics: Topic[];
  };
  helpCallout: Callout;
}

// Admin Overview Types
interface QuickStat {
  id: string;
  label: string;
  value: number | string;
  description: string;
  source?: string;
}

interface AdminTool {
  id: string;
  href: string;
  icon: DashboardIconName;
  title: string;
  description: string;
  status: string;
  badge: string;
  badgeColor: "cyan" | "violet" | "accent" | "teal";
}

interface AdminSection {
  id: string;
  title: string;
  description: string;
  icon: DashboardIconName;
  tools: AdminTool[];
}

interface UpcomingFeature {
  id: string;
  icon: DashboardIconName;
  title: string;
  description: string;
  status: string;
}

export interface AdminOverviewContent {
  header: {
    icon: DashboardIconName;
    title: string;
    description: string;
  };
  securityNotice: {
    icon: DashboardIconName;
    title: string;
    description: string;
    type: "warning" | "info" | "error";
  };
  quickStats: QuickStat[];
  sections: AdminSection[];
  upcomingFeatures: {
    title: string;
    description: string;
    features: UpcomingFeature[];
  };
  cta: {
    title: string;
    description: string;
    link: {
      text: string;
      href: string;
      icon: DashboardIconName;
    };
  };
}

// Digital Marketing Overview Types
interface PlatformPage {
  label: string;
  icon: DashboardIconName;
}

interface Platform {
  id: string;
  href: string;
  icon: DashboardIconName;
  title: string;
  description: string;
  status: string;
  badge: string;
  badgeColor: "blue" | "sky" | "neutral" | "indigo";
  iconColor: "blue" | "sky" | "neutral" | "indigo";
  pages: PlatformPage[];
}

interface QuickLink {
  id: string;
  href: string;
  icon: DashboardIconName;
  title: string;
  description: string;
}

export interface DigitalMarketingOverviewContent {
  header: {
    icon: DashboardIconName;
    title: string;
    description: string;
    badges: Array<{
      text: string;
      variant: "default" | "outline" | "success" | "warning";
    }>;
  };
  authNotice: {
    icon: DashboardIconName;
    title: string;
    description: string;
    type: "warning" | "info" | "error";
  };
  quickStats: QuickStat[];
  quickLinks: QuickLink[];
  platforms: Platform[];
}

// Document Administration & Email Administration Overview Types
interface AdminSection {
  id: string;
  title: string;
  description: string;
  icon: DashboardIconName;
  href: string;
  role: string;
  pages: number;
  color: "emerald" | "violet" | "amber" | "blue" | "red";
}

interface AdminHighlight {
  id: string;
  icon: DashboardIconName;
  title: string;
  description: string;
}

interface AdminQuickLink {
  id: string;
  icon: DashboardIconName;
  title: string;
  description: string;
  href: string;
}

export interface DocumentAdministrationOverviewContent {
  header: {
    icon: DashboardIconName;
    title: string;
    description: string;
  };
  sections: AdminSection[];
  highlights: AdminHighlight[];
  quickLinks: AdminQuickLink[];
}

export interface EmailAdministrationOverviewContent {
  header: {
    icon: DashboardIconName;
    title: string;
    description: string;
  };
  sections: AdminSection[];
  highlights: AdminHighlight[];
  quickLinks: AdminQuickLink[];
}

// Content Library Overview Types
interface ContentType {
  id: string;
  title: string;
  description: string;
  icon: DashboardIconName;
  href: string;
  count: number;
}

interface Stat {
  label: string;
  value: number | string;
  icon: DashboardIconName;
}

interface AudienceSection {
  id: string;
  title: string;
  description: string;
  icon: DashboardIconName;
  audience: string;
  cta: string;
}

export interface ContentLibraryOverviewContent {
  header: {
    icon: DashboardIconName;
    title: string;
    description: string;
  };
  contentTypes: ContentType[];
  stats: Stat[];
  audienceSections: AudienceSection[];
}

// Documentation Overview Types (shared)
interface DocSection {
  id: string;
  title: string;
  description: string;
  icon: DashboardIconName;
  href: string;
  role: string;
  color: "blue" | "emerald" | "red" | "purple" | "amber";
}

interface DocumentationHeader {
  icon: DashboardIconName;
  title: string;
  description: string;
}

export interface AppReferenceOverviewContent {
  header: DocumentationHeader;
  sections: DocSection[];
  badges: string[];
}

export interface CmsReferenceOverviewContent {
  header: DocumentationHeader;
  sections: DocSection[];
  badges: string[];
}

interface InfrastructureSection extends DocSection {
  color: "emerald" | "blue" | "purple" | "amber";
}

export interface InfrastructureOpsOverviewContent {
  header: DocumentationHeader;
  sections: InfrastructureSection[];
  badges: string[];
  stats?: Stat[];
}

interface StrategicDocSection {
  id: string;
  title: string;
  description: string;
  icon: DashboardIconName;
  href: string;
  color: "blue" | "emerald" | "amber";
  pages: number;
  audience: string;
}

interface AudiencePathway {
  id: string;
  title: string;
  icon: DashboardIconName;
  description: string;
  action: string;
  href: string;
}

export interface StrategicOverviewContent {
  header: DocumentationHeader;
  sections: StrategicDocSection[];
  audiences: AudiencePathway[];
  badges: string[];
}
// Batch B List Page Types

// Content Library List Pages
interface CategoryConfig {
  id: string;
  title: string;
  color: string;
}

interface ListPageHeader {
  title: string;
  description: string;
}

export interface ArticlesListContent {
  header: ListPageHeader;
  stats: Array<{
    level: string;
    icon: DashboardIconName;
    count: number;
    color: string;
  }>;
  categories: CategoryConfig[];
}

export interface TutorialsListContent {
  header: ListPageHeader;
  stats: Array<{
    level: string;
    icon: DashboardIconName;
    count: number;
    color: string;
  }>;
  categories: CategoryConfig[];
}

export interface CaseStudiesListContent {
  header: ListPageHeader;
  stats: Array<{
    label: string;
    value: number;
    icon: DashboardIconName;
  }>;
  categories: CategoryConfig[];
}

export interface GuidesListContent {
  header: ListPageHeader;
  stats: Array<{
    label: string;
    value: number;
    icon: DashboardIconName;
  }>;
  categories: CategoryConfig[];
}

interface PlatformOption {
  id: string;
  title: string;
  icon: DashboardIconName;
  color: string;
}

export interface SocialListContent {
  header: ListPageHeader;
  stats: Array<{
    label: string;
    value: number;
    icon: DashboardIconName;
  }>;
  platforms: PlatformOption[];
}

// Documentation Sub-Page Lists
interface DocumentationPageOption {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: DashboardIconName;
  color: string;
}

export interface AppReferenceListContent {
  documentationSections: DocumentationPageOption[];
}

export interface CmsReferenceListContent {
  documentationSections: DocumentationPageOption[];
}

export interface InfrastructureOpsListContent {
  documentationSections: DocumentationPageOption[];
}

export interface StrategicOverviewListContent {
  documentationSections: DocumentationPageOption[];
}

// Digital Marketing Sub-Pages
interface DigitalMarketingSection {
  id: string;
  title: string;
  icon: DashboardIconName;
  href: string;
  color?: string;
}

export interface ContentStrategyOverviewContent {
  sections: DigitalMarketingSection[];
  description: string;
}

export interface DigitalMarketingGettingStartedContent {
  header: {
    title: string;
    description: string;
    icon: DashboardIconName;
  };
  sections: Array<{
    id: string;
    title: string;
    content: string;
    icon: DashboardIconName;
  }>;
  quickLinks: Array<{
    label: string;
    href: string;
  }>;
}

// Document Administration Sub-Pages
interface HealthSection {
  id: string;
  title: string;
  icon: DashboardIconName;
  color: string;
  href: string;
}

interface HealthHighlight {
  title: string;
  description: string;
  icon: DashboardIconName;
}

export interface DocumentationHealthOverviewContent {
  header: {
    title: string;
    description: string;
    icon: DashboardIconName;
  };
  sections: HealthSection[];
  highlights: HealthHighlight[];
}

export interface DocumentAdminGettingStartedContent {
  header: {
    title: string;
    description: string;
    icon: DashboardIconName;
  };
  sections: Array<{
    id: string;
    title: string;
    content: string;
    icon: DashboardIconName;
  }>;
  quickLinks: Array<{
    label: string;
    href: string;
  }>;
}

// Email Administration Sub-Pages
export interface EmailAdminGettingStartedContent {
  header: {
    title: string;
    description: string;
    icon: DashboardIconName;
  };
  sections: Array<{
    id: string;
    title: string;
    content: string;
    icon: DashboardIconName;
  }>;
  quickLinks: Array<{
    label: string;
    href: string;
  }>;
}
