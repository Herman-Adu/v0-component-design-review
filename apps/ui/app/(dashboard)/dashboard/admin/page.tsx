"use client";

import * as Icons from "lucide-react";
import Link from "next/link";
import { articles } from "@/data/content-library/articles";
import { caseStudies } from "@/data/content-library/case-studies";
import { tutorials } from "@/data/content-library/tutorials";
import adminOverviewData from "@/data/strapi-mock/dashboard/admin-overview.json";
import type {
  AdminOverviewContent,
  DashboardIconName,
} from "@/types/dashboard";

const adminContent = adminOverviewData as AdminOverviewContent;
const totalContent = articles.length + caseStudies.length + tutorials.length;

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
const getBadgeColor = (color: "cyan" | "violet" | "accent" | "teal") => {
  switch (color) {
    case "cyan":
      return "bg-cyan-500/10 text-cyan-500";
    case "violet":
      return "bg-violet-500/10 text-violet-500";
    case "teal":
      return "bg-teal-500/10 text-teal-400";
    case "accent":
      return "bg-accent/10 text-accent";
    default:
      return "bg-accent/10 text-accent";
  }
};

export default function AdminOverviewPage() {
  const {
    header,
    securityNotice,
    quickStats,
    sections,
    upcomingFeatures,
    cta,
  } = adminContent;
  const HeaderIcon = getIcon(header.icon);
  const SecurityIcon = getIcon(securityNotice.icon);

  // Resolve dynamic stat values
  const resolvedStats = quickStats.map((stat) => ({
    ...stat,
    displayValue: stat.source === "content-library" ? totalContent : stat.value,
    displayDescription:
      stat.source === "content-library"
        ? `${articles.length} articles, ${caseStudies.length} case studies, ${tutorials.length} tutorials`
        : stat.description,
  }));

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
      </div>

      {/* Security Notice */}
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-6">
        <div className="flex items-start gap-4">
          <SecurityIcon className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-foreground mb-1">
              {securityNotice.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {securityNotice.description}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {resolvedStats.map((stat) => (
          <div
            key={stat.id}
            className="rounded-lg border border-border bg-card p-5"
          >
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p
              className={`text-3xl font-bold mt-1 ${stat.id === "content-items" ? "text-accent" : "text-foreground"}`}
            >
              {stat.displayValue}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.displayDescription}
            </p>
          </div>
        ))}
      </div>

      {/* Admin Sections */}
      {sections.map((section) => {
        const SectionIcon = getIcon(section.icon);
        return (
          <section key={section.id} className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <SectionIcon className="h-5 w-5 text-accent" />
                <h2 className="text-2xl font-bold text-foreground">
                  {section.title}
                </h2>
              </div>
              <p className="text-muted-foreground">{section.description}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {section.tools.map((tool) => {
                const ToolIcon = getIcon(tool.icon);
                return (
                  <Link key={tool.id} href={tool.href} className="group">
                    <div className="rounded-lg border border-border bg-card p-5 transition-colors hover:border-accent/50 h-full">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                          <ToolIcon className="h-5 w-5 text-accent" />
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-md font-medium ${getBadgeColor(tool.badgeColor)}`}
                        >
                          {tool.badge}
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                        {tool.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {tool.description}
                      </p>
                      <p className="text-xs text-accent mt-3">{tool.status}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* Upcoming Features */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {upcomingFeatures.title}
          </h2>
          <p className="text-muted-foreground">
            {upcomingFeatures.description}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {upcomingFeatures.features.map((feature) => {
            const FeatureIcon = getIcon(feature.icon);
            return (
              <div
                key={feature.id}
                className="rounded-lg border border-border bg-card/50 p-5 opacity-60"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted mb-3">
                  <FeatureIcon className="h-5 w-5 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {feature.description}
                </p>
                <span className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground">
                  {feature.status}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground mb-2">{cta.title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{cta.description}</p>
        <Link
          href={cta.link.href}
          className="inline-flex items-center gap-2 text-sm text-accent hover:underline"
        >
          {cta.link.text}
          {(() => {
            const CtaIcon = getIcon(cta.link.icon);
            return <CtaIcon className="h-4 w-4" />;
          })()}
        </Link>
      </div>
    </div>
  );
}
