import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getLinkedInPlatform } from "@/lib/strapi/dashboard/platforms/linkedin/linkedin-platform";
import type { LinkedInPlatformVM } from "@/lib/strapi/dashboard/platforms/linkedin/linkedin-platform";

function resolveIcon(name: string): LucideIcon {
  const icon = (Icons as Record<string, unknown>)[name];
  return typeof icon === "function" ? (icon as LucideIcon) : Icons.Share2;
}

function buildFallbackVM(): LinkedInPlatformVM {
  return {
    header: { iconName: "Share2", title: "LinkedIn Marketing", description: "Professional B2B presence and thought leadership for electrical services" },
    introTitle: "LinkedIn Ecosystem",
    introText: "Build your professional presence on LinkedIn. From profile optimisation and thought leadership content to targeted connection growth and lead generation, each tool is designed for B2B visibility in the trades and construction sector.",
    ecosystemPhases: [
      { title: "Build Credibility", description: "Build credibility with a polished profile and thought leadership", items: ["Profile Optimization", "Content Strategy"] },
      { title: "Grow Network", description: "Expand your professional network with targeted outreach and engagement", items: ["Connection Growth", "Content Strategy"] },
      { title: "Generate Leads", description: "Convert connections into qualified business leads", items: ["Lead Generation", "Analytics Dashboard"] },
    ],
    tools: [
      { id: "profile-optimization", href: "/dashboard/admin/digital-marketing/linkedin/profile-optimization", iconName: "Building2", title: "Profile Optimization", description: "Professional headline templates, summary writing guide, skills showcase, and recommendations strategy.", role: "Business Owner / Marketing Lead", status: "Active" },
      { id: "content-strategy", href: "/dashboard/admin/digital-marketing/linkedin/content-strategy", iconName: "PenSquare", title: "Content Strategy", description: "Post templates, industry insights, thought leadership tips, and engagement best practices.", role: "Content Creator / Marketing Lead", status: "Active" },
      { id: "connection-growth", href: "/dashboard/admin/digital-marketing/linkedin/connection-growth", iconName: "Megaphone", title: "Connection Growth", description: "Targeting strategies, outreach templates, connection request guides, and relationship management.", role: "Business Development", status: "Active" },
      { id: "lead-generation", href: "/dashboard/admin/digital-marketing/linkedin/lead-generation", iconName: "FileText", title: "Lead Generation", description: "InMail templates, sponsored content guidelines, lead magnet strategies, and conversion tips.", role: "Sales / Business Development", status: "Active" },
      { id: "analytics", href: "/dashboard/admin/digital-marketing/linkedin/analytics", iconName: "LineChart", title: "Analytics Dashboard", description: "Profile views, engagement metrics, follower trends, and performance analytics.", role: "All Roles", status: "Active" },
    ],
  };
}

export default async function LinkedInOverviewPage() {
  const vm = (await getLinkedInPlatform()) ?? buildFallbackVM();
  const { introTitle, introText, ecosystemPhases, tools } = vm;
  const header = vm.header ?? { iconName: "Share2", title: "LinkedIn Marketing", description: "" };

  const HeaderIcon = resolveIcon(header.iconName);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20">
            <HeaderIcon className="h-5 w-5 text-sky-500" />
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
          <Badge className="bg-sky-500/20 text-sky-400 border-0">B2B Focus</Badge>
          <Badge className="bg-green-500/20 text-green-400 border-0">All Active</Badge>
        </div>
      </div>

      {/* Intro */}
      <Card className="border-sky-500/20 bg-sky-500/5">
        <CardContent className="flex gap-4 p-5">
          <div className="flex items-center justify-center w-9 h-9 rounded-md bg-sky-500/10 shrink-0">
            <Icons.Share2 className="h-4 w-4 text-sky-400" />
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
                      <Icons.CheckCircle2 className="h-3.5 w-3.5 text-sky-500 shrink-0" />
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
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => {
          const Icon = resolveIcon(tool.iconName);
          return (
            <Card key={tool.href} className="border-sky-500/30">
              <CardContent className="p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-sky-500/10 shrink-0">
                    <Icon className="h-4 w-4 text-sky-500" />
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

      {/* Detail Cards */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Pages</h2>
        <div className="grid gap-4 md:grid-cols-2">
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
                    <Badge className="bg-green-500/20 text-green-400 border-0 text-xs">{tool.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{tool.description}</p>
                  <Button variant="outline" size="sm" className="bg-transparent" asChild>
                    <Link href={tool.href}>
                      Open <Icons.ArrowRight className="ml-2 h-3 w-3" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Platform Specs */}
      <Card className="border-border/50">
        <CardContent className="p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">LinkedIn Platform Specifications</h3>
          <div className="space-y-2">
            {[
              { spec: "Post character limit", value: "3,000 characters" },
              { spec: "Article length", value: "Unlimited (1,500-2,000 words recommended)" },
              { spec: "Image size (posts)", value: "1200 x 627 pixels (1.91:1 ratio)" },
              { spec: "Image size (articles)", value: "744 x 400 pixels" },
              { spec: "Video length", value: "Up to 10 minutes" },
              { spec: "Best posting times", value: "Tuesday-Thursday, 8-10am" },
              { spec: "Hashtag limit", value: "3-5 per post (recommended)" },
            ].map((item) => (
              <div key={item.spec} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{item.spec}</span>
                <span className="text-foreground font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Back */}
      <Card className="border-border/50">
        <CardContent className="flex items-center justify-between p-5 gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 shrink-0">
              <Icons.Megaphone className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Back to Digital Marketing</p>
              <p className="text-xs text-muted-foreground mt-0.5">Explore other platforms and tools.</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="bg-transparent" asChild>
            <Link href="/dashboard/admin/digital-marketing">
              Overview <Icons.ArrowRight className="ml-2 h-3 w-3" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
