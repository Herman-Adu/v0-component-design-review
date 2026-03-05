import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Globe,
  ArrowRight,
  PenSquare,
  FileText,
  LineChart,
  Megaphone,
  CheckCircle2,
  UsersRound,
  Tag,
} from "lucide-react";

const TW = "/dashboard/admin/digital-marketing/twitter";

import toolsData from "@/data/strapi-mock/dashboard/admin/digital-marketing/platforms/twitter-tools.json";
const tools = toolsData.tools || [];

import strategyData from "@/data/strapi-mock/dashboard/admin/digital-marketing/platforms/twitter-strategy.json";
const strategy = strategyData.strategy || [];

// Icon mapping for tools
const iconMap = {
  Globe,
  ArrowRight,
  PenSquare,
  FileText,
  LineChart,
  Megaphone,
  CheckCircle2,
  UsersRound,
  Tag,
};

export default function TwitterOverviewPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <Globe className="h-5 w-5 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
              Twitter/X Marketing
            </h1>
            <p className="text-muted-foreground">
              Real-time engagement and brand visibility for electrical services
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline">5 Tools</Badge>
          <Badge className="bg-emerald-500/20 text-emerald-400 border-0">
            Real-Time
          </Badge>
          <Badge className="bg-green-500/20 text-green-400 border-0">
            All Active
          </Badge>
        </div>
      </div>

      {/* Why Twitter */}
      <Card className="border-emerald-500/20 bg-emerald-500/5">
        <CardContent className="flex gap-4 p-5">
          <div className="flex items-center justify-center w-9 h-9 rounded-md bg-emerald-500/10 shrink-0">
            <Globe className="h-4 w-4 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              Why Twitter/X for Electrical Services?
            </p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Twitter/X is the fastest channel for real-time engagement with
              local homeowners, property managers, and other tradespeople. It
              excels at quick safety tips, project updates, emergency service
              announcements, and community engagement. The short-form format
              forces concise, punchy messaging that builds brand personality and
              local recognition.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Strategy Flow */}
      <div className="responsive-grid-3">
        {strategy.map((phase) => (
          <Card key={phase.title} className="border-border/50">
            <CardContent className="p-5">
              <p className="text-lg font-semibold text-foreground mb-1">
                {phase.title}
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                {phase.description}
              </p>
              <div className="space-y-2">
                {phase.items.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-sm text-foreground"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Access */}
      <div className="responsive-grid-3">
        {tools.map((tool) => {
          const Icon = iconMap[tool.icon as keyof typeof iconMap];
          return (
            <Card key={tool.href} className="border-emerald-500/30">
              <CardContent className="p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-500/10 shrink-0">
                    {Icon && <Icon className="h-4 w-4 text-emerald-500" />}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground text-sm truncate">
                      {tool.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {tool.role}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="shrink-0 h-8 w-8 p-0"
                  asChild
                >
                  <Link href={tool.href}>
                    <ArrowRight className="h-4 w-4" />
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
            const Icon = iconMap[tool.icon as keyof typeof iconMap];
            return (
              <Card key={tool.href} className="border-border/50">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-9 h-9 rounded-md bg-muted">
                        {Icon && <Icon className="h-4 w-4 text-foreground" />}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">
                          {tool.title}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {tool.role}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-0 text-xs">
                      {tool.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {tool.description}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-transparent"
                    asChild
                  >
                    <Link href={tool.href}>
                      Open <ArrowRight className="ml-2 h-3 w-3" />
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
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Twitter/X Platform Specifications
          </h3>
          <div className="space-y-2">
            {[
              { spec: "Tweet character limit", value: "280 characters" },
              {
                spec: "Thread length",
                value: "Up to 25 tweets (recommended: 5-10)",
              },
              { spec: "Image size", value: "1200 x 675 pixels (16:9 ratio)" },
              { spec: "Video length", value: "Up to 2 min 20 sec" },
              { spec: "Hashtags per tweet", value: "1-2 recommended" },
              {
                spec: "Best posting times",
                value: "Mon-Fri, 8-10am and 12-1pm",
              },
              { spec: "Optimal frequency", value: "3-5 tweets per day" },
            ].map((item) => (
              <div
                key={item.spec}
                className="flex items-center justify-between text-xs"
              >
                <span className="text-muted-foreground">{item.spec}</span>
                <span className="text-foreground font-medium">
                  {item.value}
                </span>
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
              <Megaphone className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Back to Digital Marketing
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Explore other platforms and tools.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="bg-transparent"
            asChild
          >
            <Link href="/dashboard/admin/digital-marketing">
              Overview <ArrowRight className="ml-2 h-3 w-3" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
