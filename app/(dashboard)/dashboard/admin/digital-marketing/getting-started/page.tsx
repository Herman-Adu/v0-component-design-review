import quickChecklistData from "@/data/strapi-mock/digital-marketing/getting-started/quick-checklist.json";
import journeysData from "@/data/strapi-mock/digital-marketing/getting-started/journeys.json";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Megaphone,
  Rocket,
  ArrowRight,
  Users,
  Search,
  Share2,
  Globe,
  TrendingUp,
  CheckCircle2,
  Shield,
  Briefcase,
  Palette,
} from "lucide-react";

const DM = "/dashboard/admin/digital-marketing";

const iconMap = {
  Rocket,
  Search,
  Users,
  Share2,
};

export default function DigitalMarketingGettingStartedPage() {
  const journeys = journeysData.journeys || [];

  const quickChecklist = quickChecklistData.quickChecklist || [];

  const platformOverview = [
    {
      name: "Google",
      icon: Search,
      status: "Active",
      tools: 7,
      href: `${DM}/google`,
    },
    {
      name: "LinkedIn",
      icon: Share2,
      status: "Coming Soon",
      tools: 0,
      href: `${DM}/linkedin`,
    },
    {
      name: "Twitter/X",
      icon: Globe,
      status: "Coming Soon",
      tools: 0,
      href: `${DM}/twitter`,
    },
    {
      name: "Facebook",
      icon: Users,
      status: "Coming Soon",
      tools: 0,
      href: `${DM}/facebook`,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 border border-accent/20">
            <Rocket className="h-5 w-5 text-accent" />
          </div>
          <div>
            <Badge className="bg-green-500/20 text-green-400 border-0 mb-2">
              Start Here
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
              Getting Started
            </h1>
            <p className="text-muted-foreground">
              Choose your role-based journey through Digital Marketing
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline">3 Journeys</Badge>
          <Badge variant="outline">4 Platforms</Badge>
          <Badge variant="outline">Role-Based</Badge>
        </div>
      </div>

      {/* How to use */}
      <Card className="border-accent/20 bg-accent/5">
        <CardContent className="flex gap-4 p-5">
          <div className="flex items-center justify-center w-9 h-9 rounded-md bg-accent/10 shrink-0">
            <Users className="h-4 w-4 text-accent" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              How to use this guide
            </p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Digital Marketing is organised by platform (Google, LinkedIn,
              Twitter/X, Facebook) with each platform having its own set of
              tools. Find your role below and follow the recommended page order.
              Google is fully built out; other platforms will be added
              progressively.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Platform Status */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {platformOverview.map((platform) => {
          const Icon = platform.icon;
          return (
            <Link
              key={platform.name}
              href={platform.href}
              className="group rounded-lg border border-border bg-card p-4 hover:border-accent/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors" />
                <Badge
                  variant={platform.status === "Active" ? "default" : "outline"}
                  className={
                    platform.status === "Active"
                      ? "bg-green-500/20 text-green-400 border-0 text-[10px]"
                      : "text-[10px]"
                  }
                >
                  {platform.status}
                </Badge>
              </div>
              <p className="font-medium text-foreground text-sm">
                {platform.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {platform.tools > 0
                  ? `${platform.tools} tools available`
                  : "In development"}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Journey Cards */}
      <div className="space-y-6">
        {journeys.map((journey) => (
          <Card key={journey.title} className="border-border/50">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-lg border ${journey.color}`}
                >
                  {(() => {
                    const Icon = iconMap[journey.icon as keyof typeof iconMap];
                    return Icon ? <Icon className="h-5 w-5" /> : null;
                  })()}
                </div>
                <div>
                  <CardTitle className="text-lg">{journey.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {journey.description}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {journey.steps.map((step, i) => (
                  <Link
                    key={step.title}
                    href={step.href}
                    className="flex items-center gap-4 rounded-lg border border-border/50 p-4 hover:bg-muted/50 transition-colors group"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium text-foreground shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">
                        {step.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {step.desc}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors shrink-0" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Setup Checklist */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-accent" />
            Quick Setup Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {quickChecklist.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex items-center justify-center w-5 h-5 rounded-full border border-border text-[10px] font-medium text-muted-foreground shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <p className="text-sm text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Back to Overview */}
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
                Return to the main overview to explore all platforms.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="bg-transparent"
            asChild
          >
            <Link href={DM}>
              Overview
              <ArrowRight className="ml-2 h-3 w-3" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
