import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getDigitalMarketing } from "@/lib/strapi/dashboard/management/digital-marketing/digital-marketing";
import type { DigitalMarketingVM } from "@/lib/strapi/dashboard/management/digital-marketing/digital-marketing";
import digitalMarketingData from "@/data/strapi-mock/dashboard/digital-marketing-overview.json";

function resolveIcon(name: string): LucideIcon {
  const icon = (Icons as Record<string, unknown>)[name];
  return typeof icon === "function" ? (icon as LucideIcon) : Icons.Megaphone;
}

const PLATFORM_COLORS: Record<string, { badge: string; hover: string; icon: string }> = {
  blue: { badge: "bg-blue-500/10 text-blue-400", hover: "hover:border-blue-500/50 hover:bg-blue-500/5", icon: "text-blue-500" },
  sky: { badge: "bg-sky-500/10 text-sky-400", hover: "hover:border-sky-500/50 hover:bg-sky-500/5", icon: "text-sky-500" },
  neutral: { badge: "bg-neutral-500/10 text-neutral-400", hover: "hover:border-neutral-500/50 hover:bg-neutral-500/5", icon: "text-neutral-400" },
  indigo: { badge: "bg-indigo-500/10 text-indigo-400", hover: "hover:border-indigo-500/50 hover:bg-indigo-500/5", icon: "text-indigo-500" },
  slate: { badge: "bg-slate-500/10 text-slate-400", hover: "hover:border-slate-500/50 hover:bg-slate-500/5", icon: "text-slate-400" },
};

function buildFallbackVM(): DigitalMarketingVM {
  const raw = digitalMarketingData as {
    header: { icon: string; title: string; description: string; badges: Array<{ text: string; variant: string }> };
    authNotice: { icon: string; title: string; description: string; type: string };
    quickStats: Array<{ id: string; label: string; value: number | string; description: string }>;
    quickLinks: Array<{ id: string; href: string; icon: string; title: string; description: string }>;
    platforms: Array<{ id: string; href: string; icon: string; title: string; description: string; status: string; badge: string; badgeColor: string; iconColor: string; pages: Array<{ label: string; icon: string }> }>;
  };
  return {
    header: { iconName: raw.header.icon, title: raw.header.title, description: raw.header.description },
    notice: { type: "warning", title: raw.authNotice.title, description: raw.authNotice.description },
    quickStats: raw.quickStats.map((s) => ({ id: s.id, label: s.label, value: String(s.value), description: s.description })),
    quickLinks: raw.quickLinks.map((l) => ({ id: l.id, iconName: l.icon, title: l.title, description: l.description, href: l.href })),
    platforms: raw.platforms.map((p) => ({
      id: p.id,
      iconName: p.icon,
      title: p.title,
      description: p.description,
      href: p.href,
      status: p.status,
      badge: p.badge,
      badgeColor: p.badgeColor,
      iconColor: p.iconColor,
      pageItems: p.pages.map((pi) => ({ label: pi.label, iconName: pi.icon })),
    })),
  };
}

export default async function DigitalMarketingOverviewPage() {
  const vm = (await getDigitalMarketing()) ?? buildFallbackVM();
  const { header, notice, quickStats, quickLinks, platforms } = vm;

  const HeaderIcon = resolveIcon(header.iconName);

  const totalPages = platforms.reduce((sum, p) => sum + p.pageItems.length, 0);
  const activePlatform = platforms.find((p) => p.status === "Active");

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
        <p className="text-lg text-muted-foreground text-balance max-w-3xl">{header.description}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline">{platforms.length} Platforms</Badge>
          <Badge variant="outline">{totalPages} Pages</Badge>
          {activePlatform && (
            <Badge className="bg-green-500/20 text-green-400 border-0">
              {activePlatform.title} Active
            </Badge>
          )}
        </div>
      </div>

      {/* Auth Notice */}
      {notice && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-6">
          <div className="flex items-start gap-4">
            <Icons.Lock className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground mb-1">{notice.title}</h3>
              <p className="text-sm text-muted-foreground">{notice.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((stat) => (
          <div key={stat.id} className="rounded-lg border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Quick Links</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {quickLinks.map((link) => {
            const LinkIcon = resolveIcon(link.iconName);
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
                      <p className="text-sm text-muted-foreground">{link.description}</p>
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
            const PlatformIcon = resolveIcon(platform.iconName);
            const colors = PLATFORM_COLORS[platform.badgeColor] ?? PLATFORM_COLORS.slate;
            return (
              <Link key={platform.id} href={platform.href} className="group">
                <div className={`rounded-lg border border-border bg-card p-6 transition-colors ${colors.hover} h-full`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${colors.badge}`}>
                        <PlatformIcon className={`h-6 w-6 ${colors.icon}`} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors">
                          {platform.title}
                        </h3>
                        <span className={`text-xs px-2 py-1 rounded-md font-medium ${colors.badge}`}>
                          {platform.badge}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={platform.status === "Active" ? "bg-green-500/10 text-green-500 border-green-500/20" : ""}
                    >
                      {platform.status}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">{platform.description}</p>

                  {platform.pageItems.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Available Pages
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {platform.pageItems.map((pi, idx) => {
                          const PageIcon = resolveIcon(pi.iconName);
                          return (
                            <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                              <PageIcon className="h-3 w-3" />
                              <span>{pi.label}</span>
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
