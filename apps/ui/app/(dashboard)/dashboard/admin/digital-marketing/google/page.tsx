import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getGooglePlatform } from "@/lib/strapi/dashboard/platforms/google/google-platform";
import type { GooglePlatformVM } from "@/lib/strapi/dashboard/platforms/google/google-platform";
import ecosystemData from "@/data/strapi-mock/dashboard/admin/digital-marketing/platforms/google-ecosystem.json";
import toolsData from "@/data/strapi-mock/dashboard/admin/digital-marketing/platforms/google-tools.json";

function resolveIcon(name: string): LucideIcon {
  const icon = (Icons as Record<string, unknown>)[name];
  return typeof icon === "function" ? (icon as LucideIcon) : Icons.Search;
}

function buildFallbackVM(): GooglePlatformVM {
  return {
    header: { iconName: "Search", title: "Google Marketing", description: "Full-stack Google presence management for electrical services" },
    introTitle: "Google Ecosystem",
    introText: "This section covers the full Google marketing stack: from establishing your Business Profile and optimising for search, to running ads, tracking conversions, and composing Google Business posts. Each tool is designed specifically for electrical service businesses.",
    ecosystemPhases: (ecosystemData.ecosystem || []).map((p) => ({
      title: p.title,
      description: p.description,
      items: p.items,
    })),
    tools: (toolsData.tools || []).map((t, idx) => ({
      id: String(idx),
      href: t.href,
      iconName: t.icon,
      title: t.title,
      description: t.description,
      role: t.role,
      status: t.status,
    })),
  };
}

export default async function GoogleOverviewPage() {
  const vm = (await getGooglePlatform()) ?? buildFallbackVM();
  const { header, introTitle, introText, ecosystemPhases, tools } = vm;

  const HeaderIcon = resolveIcon(header.iconName);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <HeaderIcon className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
              {header.title}
            </h1>
            <p className="text-muted-foreground">{header.description}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline">{tools.length} Tools</Badge>
          <Badge className="bg-blue-500/20 text-blue-400 border-0">Search & Discovery</Badge>
          <Badge className="bg-green-500/20 text-green-400 border-0">All Active</Badge>
        </div>
      </div>

      {/* Intro */}
      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardContent className="flex gap-4 p-5">
          <div className="flex items-center justify-center w-9 h-9 rounded-md bg-blue-500/10 shrink-0">
            <Icons.Users className="h-4 w-4 text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{introTitle}</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{introText}</p>
          </div>
        </CardContent>
      </Card>

      {/* Ecosystem phases */}
      {ecosystemPhases.length > 0 && (
        <div className="responsive-grid-3">
          {ecosystemPhases.map((phase) => (
            <Card key={phase.title} className="border-border/50">
              <CardContent className="p-5">
                <p className="text-lg font-semibold text-foreground mb-1">{phase.title}</p>
                <p className="text-xs text-muted-foreground mb-3">{phase.description}</p>
                <div className="space-y-2">
                  {phase.items.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-foreground">
                      <Icons.CheckCircle2 className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quick Access */}
      <div className="responsive-grid-3">
        {tools.map((tool) => {
          const Icon = resolveIcon(tool.iconName);
          return (
            <Card key={tool.href} className="border-blue-500/30">
              <CardContent className="p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-500/10 shrink-0">
                    <Icon className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground text-sm truncate">{tool.title}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{tool.role}</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="shrink-0 h-8 w-8 p-0" asChild>
                  <Link href={tool.href}>
                    <Icons.ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tool Detail Cards */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Pages</h2>
        <div className="responsive-grid-2">
          {tools.map((tool) => {
            const Icon = resolveIcon(tool.iconName);
            return (
              <Card key={tool.href} className="border-border/50">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-9 h-9 rounded-md bg-muted">
                        <Icon className="h-4 w-4 text-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">{tool.title}</p>
                        <p className="text-[10px] text-muted-foreground">{tool.role}</p>
                      </div>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-0 text-xs">
                      {tool.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {tool.description}
                  </p>
                  <Button variant="outline" size="sm" className="bg-transparent" asChild>
                    <Link href={tool.href}>
                      Open
                      <Icons.ArrowRight className="ml-2 h-3 w-3" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Back to DM */}
      <Card className="border-border/50">
        <CardContent className="flex items-center justify-between p-5 gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 shrink-0">
              <Icons.Megaphone className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Back to Digital Marketing</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Return to the main overview to explore other platforms.
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="bg-transparent" asChild>
            <Link href="/dashboard/admin/digital-marketing">
              Overview
              <Icons.ArrowRight className="ml-2 h-3 w-3" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
