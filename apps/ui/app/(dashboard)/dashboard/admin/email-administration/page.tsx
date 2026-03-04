import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import * as Icons from "lucide-react";
import emailAdminData from "@/data/strapi-mock/dashboard/email-administration-overview.json";
import type {
  EmailAdministrationOverviewContent,
  DashboardIconName,
} from "@/types/dashboard";

const emailAdminContent = emailAdminData as EmailAdministrationOverviewContent;

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

const getSectionColors = (
  color: "emerald" | "violet" | "amber" | "blue" | "red",
) => {
  const colors = {
    emerald: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    violet: "bg-violet-500/15 text-violet-400 border-violet-500/30",
    amber: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    blue: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    red: "bg-red-500/15 text-red-400 border-red-500/30",
  };
  return colors[color];
};

export default function EmailAdministrationOverviewPage() {
  const { header, sections, highlights, quickLinks } = emailAdminContent;

  const HeaderIcon = getIcon(header.icon);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 border border-accent/20">
            <HeaderIcon className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
              {header.title}
            </h1>
            <p className="text-muted-foreground">{header.description}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline">
            {sections.reduce((sum, s) => sum + s.pages, 0)} Pages
          </Badge>
          <Badge variant="outline">{sections.length} Sections</Badge>
          <Badge className="bg-green-500/20 text-green-400 border-0">
            All Systems Active
          </Badge>
        </div>
      </div>

      {/* Section Cards */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Sections</h2>
        <div className="responsive-grid-3">
          {sections.map((section) => {
            const SectionIcon = getIcon(section.icon);
            return (
              <Card key={section.id} className="border-border/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex items-center justify-center w-9 h-9 rounded-md border ${getSectionColors(section.color)}`}
                    >
                      <SectionIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <CardTitle className="text-base">
                        {section.title}
                      </CardTitle>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {section.pages} pages
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {section.description}
                  </CardDescription>
                  <p className="text-[10px] text-muted-foreground mt-3">
                    {section.role}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 bg-transparent w-full"
                    asChild
                  >
                    <Link href={section.href}>
                      Open {section.title}
                      <Icons.ArrowRight className="ml-2 h-3 w-3" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Highlights */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Key Capabilities
        </h2>
        <div className="responsive-grid-3">
          {highlights.map((item) => {
            const HighlightIcon = getIcon(item.icon);
            return (
              <Card key={item.id} className="border-border/50">
                <CardContent className="flex gap-4 p-5">
                  <div className="flex items-center justify-center w-9 h-9 rounded-md bg-muted shrink-0">
                    <HighlightIcon className="h-4 w-4 text-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Links */}
      {quickLinks.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Quick Links
          </h2>
          <div className="responsive-grid-1">
            {quickLinks.map((link) => {
              const LinkIcon = getIcon(link.icon);
              return (
                <Link key={link.id} href={link.href}>
                  <Card className="border-border/50 hover:border-accent/50 transition-colors">
                    <CardContent className="flex items-center gap-4 p-5">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 shrink-0">
                        <LinkIcon className="h-5 w-5 text-accent" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {link.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {link.description}
                        </p>
                      </div>
                      <Icons.ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
