import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import * as Icons from "lucide-react";
import digitalMarketingData from "@/data/strapi-mock/dashboard/digital-marketing-overview.json";
import type {
  DigitalMarketingOverviewContent,
  DashboardIconName,
} from "@/types/dashboard";

const dmContent = digitalMarketingData as DigitalMarketingOverviewContent;

// Icon mapping
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

// Platform color mapping
const getPlatformColors = (color: "blue" | "sky" | "neutral" | "indigo") => {
  const colors = {
    blue: {
      badge: "bg-blue-500/10 text-blue-400",
      hover: "hover:border-blue-500/50 hover:bg-blue-500/5",
      icon: "text-blue-500",
    },
    sky: {
      badge: "bg-sky-500/10 text-sky-400",
      hover: "hover:border-sky-500/50 hover:bg-sky-500/5",
      icon: "text-sky-500",
    },
    neutral: {
      badge: "bg-neutral-500/10 text-neutral-400",
      hover: "hover:border-neutral-500/50 hover:bg-neutral-500/5",
      icon: "text-neutral-400",
    },
    indigo: {
      badge: "bg-indigo-500/10 text-indigo-400",
      hover: "hover:border-indigo-500/50 hover:bg-indigo-500/5",
      icon: "text-indigo-500",
    },
  };
  return colors[color];
};

// Badge variant mapping
const getBadgeVariant = (
  variant: "default" | "outline" | "success" | "warning",
) => {
  if (variant === "success") return "bg-green-500/20 text-green-400 border-0";
  return variant;
};

export default function DigitalMarketingOverviewPage() {
  const { header, authNotice, quickStats, quickLinks, platforms } = dmContent;
  const HeaderIcon = getIcon(header.icon);
  const AuthIcon = getIcon(authNotice.icon);

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-accent/10">
            <HeaderIcon className="h-6 w-6 text-accent" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">{header.title}</h1>
        </div>
        <p className="text-lg text-muted-foreground text-balance max-w-3xl">
          {header.description}
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          {header.badges.map((badge, idx) => (
            <Badge
              key={idx}
              variant={badge.variant === "outline" ? "outline" : undefined}
              className={
                badge.variant === "success"
                  ? getBadgeVariant("success")
                  : undefined
              }
            >
              {badge.text}
            </Badge>
          ))}
        </div>
      </div>

      {/* Auth Notice */}
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-6">
        <div className="flex items-start gap-4">
          <AuthIcon className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-foreground mb-1">
              {authNotice.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {authNotice.description}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((stat) => (
          <div
            key={stat.id}
            className="rounded-lg border border-border bg-card p-5"
          >
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-3xl font-bold text-foreground mt-1">
              {stat.value}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.description}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Quick Links</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {quickLinks.map((link) => {
            const LinkIcon = getIcon(link.icon);
            return (
              <Link key={link.id} href={link.href} className="group">
                <div className="rounded-lg border border-border bg-card p-5 transition-colors hover:border-accent/50 h-full">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                      <LinkIcon className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1 group-hover:text-accent transition-colors">
                        {link.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {link.description}
                      </p>
                    </div>
                    <Icons.ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Platform Cards */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Platforms</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {platforms.map((platform) => {
            const PlatformIcon = getIcon(platform.icon);
            const colors = getPlatformColors(platform.badgeColor);

            return (
              <Link key={platform.id} href={platform.href} className="group">
                <div
                  className={`rounded-lg border border-border bg-card p-6 transition-colors ${colors.hover} h-full`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-lg ${colors.badge}`}
                      >
                        <PlatformIcon className={`h-6 w-6 ${colors.icon}`} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors">
                          {platform.title}
                        </h3>
                        <span
                          className={`text-xs px-2 py-1 rounded-md font-medium ${colors.badge}`}
                        >
                          {platform.badge}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        platform.status === "Active"
                          ? "bg-green-500/10 text-green-500 border-green-500/20"
                          : ""
                      }
                    >
                      {platform.status}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    {platform.description}
                  </p>

                  {platform.pages.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Available Pages
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {platform.pages.map((page, idx) => {
                          const PageIcon = getIcon(page.icon);
                          return (
                            <div
                              key={idx}
                              className="flex items-center gap-2 text-xs text-muted-foreground"
                            >
                              <PageIcon className="h-3 w-3" />
                              <span>{page.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
