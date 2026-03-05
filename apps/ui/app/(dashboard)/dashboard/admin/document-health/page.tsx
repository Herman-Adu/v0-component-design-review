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
import type { LucideIcon } from "lucide-react";
import { getDocumentHealth } from "@/lib/strapi/dashboard/management/document-health/document-health";
import type { DocumentHealthVM } from "@/lib/strapi/dashboard/management/document-health/document-health";
import documentAdminData from "@/data/strapi-mock/dashboard/admin/document-health/document-health-overview.json";

function resolveIcon(name: string): LucideIcon {
  const icon = (Icons as Record<string, unknown>)[name];
  return typeof icon === "function" ? (icon as LucideIcon) : Icons.FileCheck;
}

const COLOR_CLASSES: Record<string, string> = {
  emerald: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  violet: "bg-violet-500/15 text-violet-400 border-violet-500/30",
  amber: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  blue: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  red: "bg-red-500/15 text-red-400 border-red-500/30",
  green: "bg-green-500/15 text-green-400 border-green-500/30",
  indigo: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
  orange: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  pink: "bg-pink-500/15 text-pink-400 border-pink-500/30",
  slate: "bg-slate-500/15 text-slate-400 border-slate-500/30",
};

function buildFallbackVM(): DocumentHealthVM {
  const raw = documentAdminData as {
    header: { icon: string; title: string; description: string };
    sections: Array<{
      id: string;
      icon: string;
      title: string;
      description: string;
      href: string;
      role: string;
      pages: number;
      color: string;
    }>;
    highlights: Array<{ id: string; icon: string; title: string; description: string }>;
    quickLinks: Array<{ id: string; icon: string; title: string; description: string; href: string }>;
  };
  return {
    header: { iconName: raw.header.icon, title: raw.header.title, description: raw.header.description },
    pageSections: raw.sections.map((s) => ({
      id: s.id,
      iconName: s.icon,
      title: s.title,
      description: s.description,
      href: s.href,
      role: s.role,
      pages: s.pages,
      color: s.color,
    })),
    highlights: raw.highlights.map((h) => ({
      id: h.id,
      iconName: h.icon,
      title: h.title,
      description: h.description,
    })),
    quickLinks: raw.quickLinks.map((l) => ({
      id: l.id,
      iconName: l.icon,
      title: l.title,
      description: l.description,
      href: l.href,
    })),
  };
}

export default async function DocumentHealthOverviewPage() {
  const vm = (await getDocumentHealth()) ?? buildFallbackVM();
  const { header, pageSections, highlights, quickLinks } = vm;

  const HeaderIcon = resolveIcon(header.iconName);

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
            {pageSections.reduce((sum, s) => sum + s.pages, 0)} Pages
          </Badge>
          <Badge variant="outline">{pageSections.length} Sections</Badge>
          <Badge className="bg-green-500/20 text-green-400 border-0">
            All Systems Active
          </Badge>
        </div>
      </div>

      {/* Section Cards */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Sections</h2>
        <div className="responsive-grid-2">
          {pageSections.map((section) => {
            const SectionIcon = resolveIcon(section.iconName);
            const colorClass = COLOR_CLASSES[section.color] ?? COLOR_CLASSES.slate;
            return (
              <Card key={section.id} className="border-border/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex items-center justify-center w-9 h-9 rounded-md border ${colorClass}`}
                    >
                      <SectionIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{section.title}</CardTitle>
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
                  <p className="text-[10px] text-muted-foreground mt-3">{section.role}</p>
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
        <h2 className="text-xl font-semibold text-foreground mb-4">Key Capabilities</h2>
        <div className="responsive-grid-6">
          {highlights.map((item) => {
            const HighlightIcon = resolveIcon(item.iconName);
            return (
              <Card key={item.id} className="border-border/50">
                <CardContent className="flex gap-4 p-5">
                  <div className="flex items-center justify-center w-9 h-9 rounded-md bg-muted shrink-0">
                    <HighlightIcon className="h-4 w-4 text-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.title}</p>
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
          <h2 className="text-xl font-semibold text-foreground mb-4">Quick Links</h2>
          <div className="responsive-grid-2">
            {quickLinks.map((link) => {
              const LinkIcon = resolveIcon(link.iconName);
              return (
                <Link key={link.id} href={link.href}>
                  <Card className="border-border/50 hover:border-accent/50 transition-colors">
                    <CardContent className="flex items-center gap-4 p-5">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 shrink-0">
                        <LinkIcon className="h-5 w-5 text-accent" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{link.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{link.description}</p>
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
