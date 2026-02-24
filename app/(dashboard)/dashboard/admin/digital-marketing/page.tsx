import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Megaphone,
  Search,
  Share2,
  Globe,
  Users,
  ArrowRight,
  Rocket,
  TrendingUp,
  Building2,
  Tag,
  DollarSign,
  LineChart,
  PenSquare,
  Lock,
} from "lucide-react";

const DM = "/dashboard/admin/digital-marketing";

const platformCards = [
  {
    href: `${DM}/google`,
    icon: Search,
    title: "Google",
    description:
      "Business Profile, SEO, Tag Manager, Ads & Campaigns, Analytics, and Content Composer. Full ecosystem management.",
    status: "Active",
    badge: "7 Tools",
    badgeColor: "bg-blue-500/10 text-blue-400",
    hoverColor: "hover:border-blue-500/50 hover:bg-blue-500/5",
    iconColor: "text-blue-500",
    pages: [
      { label: "Business Profile & FAQs", icon: Building2 },
      { label: "SEO & Site Optimization", icon: Search },
      { label: "Tag Manager", icon: Tag },
      { label: "Ads & Campaigns", icon: DollarSign },
      { label: "Analytics & Reporting", icon: LineChart },
      { label: "Content Composer", icon: PenSquare },
    ],
  },
  {
    href: `${DM}/linkedin`,
    icon: Share2,
    title: "LinkedIn",
    description:
      "Company page management, professional post composer, article publishing, and B2B engagement strategy.",
    status: "Coming Soon",
    badge: "B2B Focus",
    badgeColor: "bg-sky-500/10 text-sky-400",
    hoverColor: "hover:border-sky-500/50 hover:bg-sky-500/5",
    iconColor: "text-sky-500",
    pages: [],
  },
  {
    href: `${DM}/twitter`,
    icon: Globe,
    title: "Twitter/X",
    description:
      "Tweet composer with character limits, thread builder, hashtag strategy, and real-time engagement tracking.",
    status: "Coming Soon",
    badge: "Quick Updates",
    badgeColor: "bg-neutral-500/10 text-neutral-400",
    hoverColor: "hover:border-neutral-500/50 hover:bg-neutral-500/5",
    iconColor: "text-neutral-400",
    pages: [],
  },
  {
    href: `${DM}/facebook`,
    icon: Users,
    title: "Facebook",
    description:
      "Business page management, post composer, event creation, community engagement, and Messenger configuration.",
    status: "Coming Soon",
    badge: "Community",
    badgeColor: "bg-indigo-500/10 text-indigo-400",
    hoverColor: "hover:border-indigo-500/50 hover:bg-indigo-500/5",
    iconColor: "text-indigo-500",
    pages: [],
  },
];

const quickLinks = [
  {
    href: `${DM}/getting-started`,
    icon: Rocket,
    title: "Getting Started",
    description:
      "Role-based onboarding guide for the Digital Marketing section",
  },
  {
    href: `${DM}/content-strategy`,
    icon: TrendingUp,
    title: "Content Strategy",
    description:
      "Editorial calendar, distribution channels, and content pipeline",
  },
];

export default function DigitalMarketingOverviewPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-accent/10">
            <Megaphone className="h-6 w-6 text-accent" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">
            Digital Marketing
          </h1>
        </div>
        <p className="text-lg text-muted-foreground text-balance max-w-3xl">
          Centralized platform marketing for your electrical services business.
          Manage your presence on Google, LinkedIn, Twitter/X, and Facebook with
          professional tools for content creation, SEO, advertising, and
          analytics.
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline">4 Platforms</Badge>
          <Badge variant="outline">13 Pages</Badge>
          <Badge className="bg-green-500/20 text-green-400 border-0">
            Google Active
          </Badge>
        </div>
      </div>

      {/* Auth Notice */}
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-6">
        <div className="flex items-start gap-4">
          <Lock className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-foreground mb-1">
              Authentication Required
            </h3>
            <p className="text-sm text-muted-foreground">
              In production, Digital Marketing tools require authentication.
              Role-based access control will restrict platform management based
              on user permissions. Currently in development mode for
              demonstration.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Platforms</p>
          <p className="text-3xl font-bold text-accent mt-1">4</p>
          <p className="text-xs text-muted-foreground mt-1">
            Google, LinkedIn, Twitter/X, Facebook
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Google Tools</p>
          <p className="text-3xl font-bold text-blue-500 mt-1">7</p>
          <p className="text-xs text-muted-foreground mt-1">
            Full ecosystem management
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Content Composers</p>
          <p className="text-3xl font-bold text-foreground mt-1">1</p>
          <p className="text-xs text-muted-foreground mt-1">
            Google active, 3 planned
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Total Pages</p>
          <p className="text-3xl font-bold text-foreground mt-1">13</p>
          <p className="text-xs text-muted-foreground mt-1">
            Across all subsections
          </p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-2">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-center gap-4 rounded-lg border border-border bg-card p-6 hover:border-accent/50 hover:bg-accent/5 transition-all"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 shrink-0">
                <Icon className="h-5 w-5 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground group-hover:text-accent transition-colors">
                  {link.title}
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {link.description}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors shrink-0" />
            </Link>
          );
        })}
      </div>

      {/* Platform Cards */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-6">
          Platform Marketing
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {platformCards.map((platform) => {
            const Icon = platform.icon;
            return (
              <Link
                key={platform.href}
                href={platform.href}
                className={`group rounded-lg border border-border bg-card p-6 transition-all ${platform.hoverColor}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <Icon className={`h-8 w-8 ${platform.iconColor}`} />
                  <div className="flex gap-2">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${platform.badgeColor}`}
                    >
                      {platform.badge}
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        platform.status === "Active"
                          ? "bg-green-500/10 text-green-500"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {platform.status}
                    </span>
                  </div>
                </div>
                <h3
                  className={`text-xl font-semibold text-foreground mb-2 transition-colors group-hover:${platform.iconColor}`}
                >
                  {platform.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {platform.description}
                </p>
                {platform.pages.length > 0 && (
                  <div className="space-y-1.5 pt-3 border-t border-border/50">
                    {platform.pages.map((page) => {
                      const PageIcon = page.icon;
                      return (
                        <div
                          key={page.label}
                          className="flex items-center gap-2 text-xs text-muted-foreground"
                        >
                          <PageIcon className="h-3 w-3 shrink-0" />
                          <span>{page.label}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
