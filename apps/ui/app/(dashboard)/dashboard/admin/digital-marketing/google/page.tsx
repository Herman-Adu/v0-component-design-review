import ecosystemData from "@/data/strapi-mock/platforms/google-ecosystem.json";
import toolsData from "@/data/strapi-mock/platforms/google-tools.json";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search,
  ArrowRight,
  Building2,
  Tag,
  DollarSign,
  LineChart,
  PenSquare,
  Megaphone,
  CheckCircle2,
  Users,
} from "lucide-react";

const G = "/dashboard/admin/digital-marketing/google";

const tools = toolsData.tools || [];

const ecosystem = ecosystemData.ecosystem || [];

const iconMap = {
  Search,
  Building2,
  Tag,
  DollarSign,
  LineChart,
  PenSquare,
};

export default function GoogleOverviewPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <Search className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
              Google Marketing
            </h1>
            <p className="text-muted-foreground">
              Full-stack Google presence management for electrical services
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline">6 Tools</Badge>
          <Badge className="bg-blue-500/20 text-blue-400 border-0">
            Search & Discovery
          </Badge>
          <Badge className="bg-green-500/20 text-green-400 border-0">
            All Active
          </Badge>
        </div>
      </div>

      {/* Who is this for */}
      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardContent className="flex gap-4 p-5">
          <div className="flex items-center justify-center w-9 h-9 rounded-md bg-blue-500/10 shrink-0">
            <Users className="h-4 w-4 text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              Google Ecosystem
            </p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              This section covers the full Google marketing stack: from
              establishing your Business Profile and optimising for search, to
              running ads, tracking conversions, and composing Google Business
              posts. Each tool is designed specifically for electrical service
              businesses.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Attract / Convert / Measure */}
      <div className="responsive-grid-3">
        {ecosystem.map((phase) => (
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
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-500 shrink-0" />
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
            <Card key={tool.href} className="border-blue-500/30">
              <CardContent className="p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-500/10 shrink-0">
                    {Icon ? <Icon className="h-4 w-4 text-blue-500" /> : null}
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

      {/* Tool Detail Cards */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Pages</h2>
        <div className="responsive-grid-2">
          {tools.map((tool) => {
            const Icon = iconMap[tool.icon as keyof typeof iconMap];
            return (
              <Card key={tool.href} className="border-border/50">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-9 h-9 rounded-md bg-muted">
                        {Icon ? (
                          <Icon className="h-4 w-4 text-foreground" />
                        ) : null}
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
                      Open
                      <ArrowRight className="ml-2 h-3 w-3" />
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
              <Megaphone className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Back to Digital Marketing
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Return to the main overview to explore other platforms.
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
              Overview
              <ArrowRight className="ml-2 h-3 w-3" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
