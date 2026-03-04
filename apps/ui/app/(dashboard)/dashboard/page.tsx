import { Callout } from "@/components/atoms/callout";
import * as Icons from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { STATS } from "@/data/doc-manifest";
import dashboardGettingStartedData from "@/data/strapi-mock/dashboard/dashboard-getting-started.json";
import type {
  DashboardGettingStartedContent,
  DashboardIconName,
} from "@/types/dashboard";

const dashboardContent =
  dashboardGettingStartedData as DashboardGettingStartedContent;

// Icon mapping helper
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

// Badge color mapping
const getBadgeColor = (color?: string) => {
  switch (color) {
    case "blue":
      return "bg-blue-500/20 text-blue-400 border-0";
    case "purple":
      return "bg-purple-500/20 text-purple-400 border-0";
    case "orange":
      return "bg-orange-500/20 text-orange-400 border-0";
    case "green":
      return "bg-green-500/20 text-green-400 border-0";
    default:
      return "bg-accent/20 text-accent border-0";
  }
};

const getBadgeIconColor = (color?: string) => {
  switch (color) {
    case "blue":
      return "bg-blue-500/10 text-blue-500";
    case "purple":
      return "bg-purple-500/10 text-purple-500";
    case "orange":
      return "bg-orange-500/10 text-orange-500";
    case "green":
      return "bg-green-500/10 text-green-500";
    default:
      return "bg-accent/10 text-accent";
  }
};

export default function GettingStartedPage() {
  const { header, callout, startingPoints } = dashboardContent;

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Badge
            className={getBadgeColor(
              header.badge.variant === "success" ? "green" : undefined,
            )}
          >
            {header.badge.text}
          </Badge>
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4">
          {header.title}
        </h1>
        <p className="text-xl text-muted-foreground text-pretty">
          {header.description}
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          {header.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <Callout type={callout.type} title={callout.title}>
        {callout.description}
      </Callout>

      {/* Choose Your Starting Point */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-foreground border-b border-border pb-2">
          {startingPoints.title}
        </h2>
        <p className="text-muted-foreground">{startingPoints.description}</p>

        <div className="grid gap-4 md:grid-cols-3">
          {startingPoints.cards.map((card) => {
            const Icon = getIcon(card.icon);
            return (
              <Link key={card.id} href={card.href} className="group">
                <Card className="h-full transition-colors hover:border-accent/50">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${getBadgeIconColor(card.badge.color)}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <Badge className={getBadgeColor(card.badge.color)}>
                        {card.badge.text}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg group-hover:text-accent transition-colors">
                      {card.title}
                    </CardTitle>
                    <CardDescription className="text-pretty">
                      {card.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {card.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="text-accent">{">"}</span> {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Quick Start Guides */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-foreground border-b border-border pb-2">
          {dashboardContent.quickStartGuides.title}
        </h2>
        <p className="text-muted-foreground">
          {dashboardContent.quickStartGuides.description}
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {dashboardContent.quickStartGuides.guides.map((guide) => {
            const Icon = getIcon(guide.icon);
            return (
              <Link key={guide.id} href={guide.href} className="group">
                <Card className="h-full transition-colors hover:border-accent/50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                          <Icon className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <CardTitle className="text-base group-hover:text-accent transition-colors">
                            {guide.title}
                          </CardTitle>
                          <p className="text-xs text-muted-foreground">
                            {guide.duration}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {guide.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Features */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-foreground border-b border-border pb-2">
          {dashboardContent.features.title}
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dashboardContent.features.items.map((feature) => {
            const Icon = getIcon(feature.icon);
            return (
              <div
                key={feature.id}
                className="bg-card border border-border rounded-lg p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                    <Icon className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Documentation Topics Overview */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-foreground border-b border-border pb-2">
          {dashboardContent.topicsOverview.title}
        </h2>
        <p className="text-muted-foreground">
          {dashboardContent.topicsOverview.description}
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dashboardContent.topicsOverview.topics.map((topic) => {
            const Icon = getIcon(topic.icon);
            return (
              <Link key={topic.id} href={topic.href} className="group">
                <div className="bg-card border border-border rounded-lg p-4 h-full transition-colors hover:border-accent/50">
                  <div className="flex items-start justify-between mb-2">
                    <Icon className="h-4 w-4 text-accent" />
                    <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      {topic.badge}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors mb-1">
                    {topic.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {topic.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <Callout
        type={dashboardContent.helpCallout.type}
        title={dashboardContent.helpCallout.title}
      >
        {dashboardContent.helpCallout.description}
      </Callout>
    </div>
  );
}
