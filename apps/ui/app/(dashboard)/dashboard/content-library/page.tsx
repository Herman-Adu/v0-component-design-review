import * as Icons from "lucide-react";
import Link from "next/link";
import contentLibraryData from "@/data/strapi-mock/dashboard/content-library/content-library-overview.json";
import type {
  ContentLibraryOverviewContent,
  DashboardIconName,
} from "@/types/dashboard";

const contentData = contentLibraryData as ContentLibraryOverviewContent;

const iconMap: Record<
  DashboardIconName,
  React.ComponentType<{ className?: string }>
> = {
  Code: Icons.Code,
  Database: Icons.Database,
  Rocket: Icons.Rocket,
  Layers: Icons.Layers,
  Shield: Icons.Shield,
  ShieldCheck: Icons.ShieldCheck,
  BookOpen: Icons.BookOpen,
  LayoutGrid: Icons.LayoutGrid,
  Zap: Icons.Zap,
  TestTube: Icons.TestTube,
  ArrowRight: Icons.ArrowRight,
  Lock: Icons.Lock,
  HeartPulse: Icons.HeartPulse,
  Activity: Icons.Activity,
  SearchCheck: Icons.SearchCheck,
  Link2: Icons.Link2,
  ClipboardCheck: Icons.ClipboardCheck,
  FileCheck: Icons.FileCheck,
  Wrench: Icons.Wrench,
  Compass: Icons.Compass,
  FlaskConical: Icons.FlaskConical,
  Target: Icons.Target,
  Megaphone: Icons.Megaphone,
  MailCheck: Icons.MailCheck,
  Share2: Icons.Share2,
  Users: Icons.Users,
  BarChart3: Icons.BarChart3,
  Settings: Icons.Settings,
  Search: Icons.Search,
  Globe: Icons.Globe,
  TrendingUp: Icons.TrendingUp,
  Building2: Icons.Building2,
  Tag: Icons.Tag,
  DollarSign: Icons.DollarSign,
  LineChart: Icons.LineChart,
  PenSquare: Icons.PenSquare,
  Briefcase: Icons.Briefcase,
  Palette: Icons.Palette,
  HardDrive: Icons.HardDrive,
  MessageSquare: Icons.MessageSquare,
  Server: Icons.Server,
  Clock: Icons.Clock,
  Mail: Icons.Mail,
  AlertCircle: Icons.AlertCircle,
  GraduationCap: Icons.GraduationCap,
  FileText: Icons.FileText,
  CheckCircle2: Icons.CheckCircle2,
  Heart: Icons.Heart,
  Sparkles: Icons.Sparkles,
  LinkedinIcon: Icons.Linkedin,
  TwitterIcon: Icons.Twitter,
  FacebookIcon: Icons.Facebook,
  InstagramIcon: Icons.Instagram,
  Route: Icons.Route,
  Cloud: Icons.Cloud,
  Lightbulb: Icons.Lightbulb,
  Gauge: Icons.Gauge,
  Link: Icons.Link,
  CheckCircle: Icons.CheckCircle,
};

const getIcon = (iconName: DashboardIconName) =>
  iconMap[iconName] || Icons.Code;

export default function ContentOverviewPage() {
  const { header, contentTypes, stats, audienceSections } = contentData;
  const HeaderIcon = getIcon(header.icon);

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          {header.title}
        </h1>
        <p className="text-lg text-muted-foreground text-balance">
          {header.description}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const StatIcon = getIcon(stat.icon);
          return (
            <div
              key={stat.label}
              className="rounded-lg border border-border bg-card p-4 text-center"
            >
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Content Type Cards */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        {contentTypes.map((contentType) => {
          const ContentIcon = getIcon(contentType.icon);
          return (
            <Link
              key={contentType.id}
              href={contentType.href}
              className="group rounded-lg border border-border bg-card p-6 hover:border-accent/50 hover:bg-accent/5 transition-all"
            >
              <ContentIcon className="h-8 w-8 text-accent mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                {contentType.title}
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                {contentType.description}
              </p>
              <span className="flex items-center gap-1 text-sm text-accent font-medium">
                {contentType.count} {contentType.title}{" "}
                <Icons.ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          );
        })}
      </div>

      {/* Audience Sections */}
      <div className="grid gap-6 md:grid-cols-3">
        {audienceSections.map((section) => {
          const SectionIcon = getIcon(section.icon);
          return (
            <div
              key={section.id}
              className="rounded-lg border border-border bg-card p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <SectionIcon className="h-6 w-6 text-accent" />
                <h3 className="text-xl font-semibold text-foreground">
                  {section.title}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {section.description}
              </p>
              <button className="text-sm font-medium text-accent hover:text-accent/80 transition-colors">
                {section.cta} →
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
