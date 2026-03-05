import * as Icons from "lucide-react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Callout } from "@/components/atoms/callout";
import { IconContainer } from "@/components/atoms/icon-container";
import { SectionHeading } from "@/components/atoms/section-heading";
import { ToolGrid } from "@/components/organisms/tool-grid";
import { getAdminOverview } from "@/lib/strapi/dashboard/management/admin-overview/admin-overview";
import { getContentRouteManifest } from "@/lib/strapi/dashboard/content-library/content-route-manifest";
import adminOverviewData from "@/data/strapi-mock/dashboard/admin/admin-overview.json";
import type { AdminOverviewContent } from "@/types/dashboard";

// ─── Icon resolution ──────────────────────────────────────────────────────────

function resolveIcon(name: string): LucideIcon {
  return ((Icons as Record<string, unknown>)[name] as LucideIcon) ?? Icons.Code;
}

// ─── Fallback data (Strapi unavailable / CI) ──────────────────────────────────

const fallback = adminOverviewData as AdminOverviewContent;

// ─── Page (Server Component) ──────────────────────────────────────────────────

export default async function AdminOverviewPage() {
  const manifest = await getContentRouteManifest();
  const dynamicCounts = {
    contentLibrary: manifest.all.length,
    contentDetail: `${manifest.articles.length} articles, ${manifest.caseStudies.length} case studies, ${manifest.tutorials.length} tutorials`,
  };

  const vm = await getAdminOverview(dynamicCounts);

  // ─── Strapi path ────────────────────────────────────────────────────────────
  if (vm) {
    const HeaderIcon = resolveIcon(vm.header.iconName);

    return (
      <div className="space-y-12">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <IconContainer icon={HeaderIcon} colorClass="bg-accent/10 text-accent" size="lg" />
            <SectionHeading title={vm.header.title} level="h1" />
          </div>
          <p className="text-lg text-muted-foreground text-balance max-w-3xl">
            {vm.header.description}
          </p>
        </div>

        {/* Notice */}
        {vm.notice && (
          <Callout type={vm.notice.type} title={vm.notice.title}>
            {vm.notice.description}
          </Callout>
        )}

        {/* Quick Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {vm.quickStats.map((stat) => (
            <Card key={stat.id}>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className={`text-3xl font-bold mt-1 ${stat.isHighlighted ? "text-accent" : "text-foreground"}`}>
                  {stat.displayValue}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tool Sections */}
        {vm.toolSections.map((section) => {
          const SectionIcon = resolveIcon(section.iconName);
          const tools = section.tools.map((tool) => ({
            href: tool.href,
            icon: resolveIcon(tool.iconName),
            title: tool.title,
            description: tool.description,
            role: tool.role,
            status: "Active" as const,
          }));

          return (
            <section key={section.id} className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <SectionIcon className="h-5 w-5 text-accent" />
                  <h2 className="text-2xl font-bold text-foreground">{section.title}</h2>
                </div>
                <p className="text-muted-foreground">{section.description}</p>
              </div>
              <ToolGrid tools={tools} variant="detailed" columns={2} />
            </section>
          );
        })}

        {/* Upcoming Features */}
        {vm.upcomingFeatures.length > 0 && (
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">{vm.upcomingTitle}</h2>
              <p className="text-muted-foreground">{vm.upcomingDescription}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {vm.upcomingFeatures.map((feature) => {
                const FeatureIcon = resolveIcon(feature.iconName);
                return (
                  <div key={feature.id} className="rounded-lg border border-border bg-card/50 p-5 opacity-60">
                    <IconContainer icon={FeatureIcon} colorClass="bg-muted text-muted-foreground" size="md" />
                    <h3 className="font-semibold text-foreground mb-2 mt-3">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{feature.description}</p>
                    <span className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground">
                      {feature.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* CTA */}
        {vm.cta && (
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-2">{vm.cta.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{vm.cta.description}</p>
              <Link
                href={vm.cta.linkHref}
                className="inline-flex items-center gap-2 text-sm text-accent hover:underline"
              >
                {vm.cta.linkText}
                {(() => {
                  const CtaIcon = resolveIcon(vm.cta.linkIconName);
                  return <CtaIcon className="h-4 w-4" />;
                })()}
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // ─── Fallback (Strapi offline / CI) ────────────────────────────────────────

  const resolvedStats = fallback.quickStats.map((stat) => ({
    ...stat,
    displayValue: stat.source === "content-library" ? dynamicCounts.contentLibrary : (stat.value ?? "—"),
    displayDescription:
      stat.source === "content-library"
        ? dynamicCounts.contentDetail
        : (stat.description ?? ""),
  }));

  const HeaderIcon = resolveIcon(fallback.header.icon);

  return (
    <div className="space-y-12">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <IconContainer icon={HeaderIcon} colorClass="bg-accent/10 text-accent" size="lg" />
          <SectionHeading title={fallback.header.title} level="h1" />
        </div>
        <p className="text-lg text-muted-foreground text-balance max-w-3xl">
          {fallback.header.description}
        </p>
      </div>

      <Callout type="warning" title={fallback.securityNotice.title}>
        {fallback.securityNotice.description}
      </Callout>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {resolvedStats.map((stat) => (
          <Card key={stat.id}>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className={`text-3xl font-bold mt-1 ${stat.id === "content-items" ? "text-accent" : "text-foreground"}`}>
                {stat.displayValue}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{stat.displayDescription}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {fallback.sections.map((section) => {
        const SectionIcon = resolveIcon(section.icon);
        const tools = section.tools.map((tool) => ({
          href: tool.href,
          icon: resolveIcon(tool.icon),
          title: tool.title,
          description: tool.description,
          role: tool.badge,
          status: "Active" as const,
        }));

        return (
          <section key={section.id} className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <SectionIcon className="h-5 w-5 text-accent" />
                <h2 className="text-2xl font-bold text-foreground">{section.title}</h2>
              </div>
              <p className="text-muted-foreground">{section.description}</p>
            </div>
            <ToolGrid tools={tools} variant="detailed" columns={2} />
          </section>
        );
      })}

      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {fallback.upcomingFeatures.title}
          </h2>
          <p className="text-muted-foreground">{fallback.upcomingFeatures.description}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {fallback.upcomingFeatures.features.map((feature) => {
            const FeatureIcon = resolveIcon(feature.icon);
            return (
              <div key={feature.id} className="rounded-lg border border-border bg-card/50 p-5 opacity-60">
                <IconContainer icon={FeatureIcon} colorClass="bg-muted text-muted-foreground" size="md" />
                <h3 className="font-semibold text-foreground mb-2 mt-3">{feature.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{feature.description}</p>
                <span className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground">
                  {feature.status}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-foreground mb-2">{fallback.cta.title}</h3>
          <p className="text-sm text-muted-foreground mb-4">{fallback.cta.description}</p>
          <Link
            href={fallback.cta.link.href}
            className="inline-flex items-center gap-2 text-sm text-accent hover:underline"
          >
            {fallback.cta.link.text}
            {(() => {
              const CtaIcon = resolveIcon(fallback.cta.link.icon);
              return <CtaIcon className="h-4 w-4" />;
            })()}
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
