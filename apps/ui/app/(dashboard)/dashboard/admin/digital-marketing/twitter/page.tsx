import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getTwitterPlatform } from "@/lib/strapi/dashboard/platforms/twitter/twitter-platform";
import type { TwitterPlatformVM } from "@/lib/strapi/dashboard/platforms/twitter/twitter-platform";

function resolveIcon(name: string): LucideIcon {
  const icon = (Icons as Record<string, unknown>)[name];
  return typeof icon === "function" ? (icon as LucideIcon) : Icons.Globe;
}

function buildFallbackVM(): TwitterPlatformVM {
  return {
    header: { iconName: "Globe", title: "Twitter/X Marketing", description: "Real-time engagement and brand visibility for electrical services" },
    introTitle: "Twitter/X Ecosystem",
    introText: "Build your Twitter/X presence with targeted content and community engagement. From profile setup and tweet composition to trending insights and analytics, each tool helps you establish authority and reach potential clients in your local area.",
    ecosystemPhases: [
      { title: "Establish Presence", description: "Consistent, professional tweets with targeted hashtags", items: ["Profile Setup", "Tweet Composer"] },
      { title: "Build Community", description: "Foster relationships and participate in relevant conversations", items: ["Community Engagement", "Trending Insights"] },
      { title: "Amplify Reach", description: "Maximize visibility and engagement through data-driven strategies", items: ["Trending Insights", "Analytics Dashboard"] },
    ],
    tools: [
      { id: "profile-setup", href: "/dashboard/admin/digital-marketing/twitter/profile-setup", iconName: "Building2", title: "Profile Setup", description: "Professional bio templates, header design guidelines, link optimization, and verification strategies.", role: "Business Owner / Marketing Lead", status: "Active" },
      { id: "tweet-composer", href: "/dashboard/admin/digital-marketing/twitter/tweet-composer", iconName: "PenSquare", title: "Tweet Composer", description: "Character-optimized templates, hashtag strategies, emoji usage, and thread formatting.", role: "Content Creator / Marketing Lead", status: "Active" },
      { id: "community-engagement", href: "/dashboard/admin/digital-marketing/twitter/community-engagement", iconName: "Megaphone", title: "Community Engagement", description: "Reply templates, retweet strategies, mentions management, and conversation starters.", role: "Community Manager / Marketing Lead", status: "Active" },
      { id: "trending-insights", href: "/dashboard/admin/digital-marketing/twitter/trending-insights", iconName: "FileText", title: "Trending Insights", description: "Trend monitoring, viral potential assessment, timing optimization, and audience insights.", role: "Marketing Lead / Content Creator", status: "Active" },
      { id: "analytics", href: "/dashboard/admin/digital-marketing/twitter/analytics", iconName: "LineChart", title: "Analytics Dashboard", description: "Tweet performance, follower growth, engagement rates, and audience demographics.", role: "All Roles", status: "Active" },
    ],
  };
}

export default async function TwitterOverviewPage() {
  const vm = (await getTwitterPlatform()) ?? buildFallbackVM();
  const { introTitle, introText, ecosystemPhases, tools } = vm;
  const header = vm.header ?? { iconName: "Globe", title: "Twitter/X Marketing", description: "" };

  const HeaderIcon = resolveIcon(header.iconName);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <HeaderIcon className="h-5 w-5 text-emerald-500" />
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
          <Badge className="bg-emerald-500/20 text-emerald-400 border-0">Real-Time</Badge>
          <Badge className="bg-green-500/20 text-green-400 border-0">All Active</Badge>
        </div>
      </div>

      {/* Intro */}
      <Card className="border-emerald-500/20 bg-emerald-500/5">
        <CardContent className="flex gap-4 p-5">
          <div className="flex items-center justify-center w-9 h-9 rounded-md bg-emerald-500/10 shrink-0">
            <Icons.Globe className="h-4 w-4 text-emerald-400" />
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
                      <Icons.CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
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
            <Card key={tool.href} className="border-emerald-500/30">
              <CardContent className="p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-500/10 shrink-0">
                    <Icon className="h-4 w-4 text-emerald-500" />
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
          <h3 className="text-sm font-semibold text-foreground mb-3">Twitter/X Platform Specifications</h3>
          <div className="space-y-2">
            {[
              { spec: "Tweet character limit", value: "280 characters" },
              { spec: "Thread length", value: "Up to 25 tweets (recommended: 5-10)" },
              { spec: "Image size", value: "1200 x 675 pixels (16:9 ratio)" },
              { spec: "Video length", value: "Up to 2 min 20 sec" },
              { spec: "Hashtags per tweet", value: "1-2 recommended" },
              { spec: "Best posting times", value: "Mon-Fri, 8-10am and 12-1pm" },
              { spec: "Optimal frequency", value: "3-5 tweets per day" },
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
