import Link from "next/link";
import * as Icons from "lucide-react";
import appRefData from "@/data/strapi-mock/dashboard/app-reference-overview.json";
import type {
  AppReferenceOverviewContent,
  DashboardIconName,
} from "@/types/dashboard";

const appRefContent = appRefData as AppReferenceOverviewContent;

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

const getColorClass = (color: string) => {
  const colors: Record<string, string> = {
    blue: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    emerald: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    red: "bg-red-500/15 text-red-400 border-red-500/30",
    purple: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    amber: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  };
  return colors[color] || "bg-accent/15 text-accent border-accent/30";
};

export default function AppReferencePage() {
  const { header, sections, badges } = appRefContent;
  const HeaderIcon = getIcon(header.icon);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <HeaderIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
              {header.title}
            </h1>
            <p className="text-muted-foreground text-pretty">
              {header.description}
            </p>
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          {badges.map((badge) => (
            <div
              key={badge}
              className="text-xs px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
            >
              {badge}
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {sections.map((section) => {
          const SectionIcon = getIcon(section.icon);
          return (
            <Link key={section.id} href={section.href}>
              <div
                className={`rounded-lg border p-6 hover:border-accent/50 transition-all ${getColorClass(section.color)}`}
              >
                <div className="flex items-start gap-4">
                  <SectionIcon className="h-6 w-6 shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-2">
                      {section.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {section.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {section.role}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
