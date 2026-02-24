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
import {
  Mail,
  Briefcase,
  Palette,
  HardDrive,
  ArrowRight,
  Users,
  Shield,
  Clock,
  MessageSquare,
  Server,
  Rocket,
} from "lucide-react";
import sectionsData from "@/data/strapi-mock/email-administration/overview/sections.json";
import highlightsData from "@/data/strapi-mock/email-administration/overview/highlights.json";

const EA = "/dashboard/admin/email-administration";

const iconMap = {
  Briefcase,
  Palette,
  HardDrive,
  MessageSquare,
  Shield,
  Clock,
  Server,
  Users,
};

export default function EmailAdministrationOverviewPage() {
  const sections = sectionsData.sections || [];

  const highlights = highlightsData.highlights || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 border border-accent/20">
            <Mail className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
              Email Administration
            </h1>
            <p className="text-muted-foreground">
              Unified hub for request handling, email configuration, and
              infrastructure
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline">14 Pages</Badge>
          <Badge variant="outline">3 Sections</Badge>
          <Badge className="bg-green-500/20 text-green-400 border-0">
            All Systems Active
          </Badge>
          <Badge className="bg-blue-500/20 text-blue-400 border-0">
            Strapi-Ready
          </Badge>
        </div>
      </div>

      {/* What is Email Administration */}
      <Card className="border-accent/20 bg-accent/5">
        <CardContent className="flex gap-4 p-5">
          <div className="flex items-center justify-center w-9 h-9 rounded-md bg-accent/10 shrink-0">
            <Mail className="h-4 w-4 text-accent" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              What is Email Administration?
            </p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Email Administration consolidates all email operations into three
              domains:{" "}
              <strong className="text-foreground">Request Management</strong>{" "}
              for day-to-day job tracking and correspondence,{" "}
              <strong className="text-foreground">Configuration</strong> for
              brand identity, templates, and scheduling, and{" "}
              <strong className="text-foreground">Infrastructure</strong> for
              technical health, security, and delivery monitoring. Each section
              is organized by role so you can go directly to the tools you need.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Section Cards */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Sections</h2>
        <div className="responsive-grid-3">
          {sections.map((section) => (
            <Card key={section.title} className="border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex items-center justify-center w-9 h-9 rounded-md border ${section.color}`}
                  >
                    {(() => {
                      const Icon =
                        iconMap[section.icon as keyof typeof iconMap];
                      return Icon ? <Icon className="h-4 w-4" /> : null;
                    })()}
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
                <p className="text-[10px] text-muted-foreground mt-3">
                  {section.role}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 bg-transparent w-full"
                  asChild
                >
                  <Link href={section.href}>
                    Open {section.title}
                    <ArrowRight className="ml-2 h-3 w-3" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Highlights */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Key Capabilities
        </h2>
        <div className="responsive-grid-3">
          {highlights.map((item) => (
            <Card key={item.title} className="border-border/50">
              <CardContent className="flex gap-4 p-5">
                <div className="flex items-center justify-center w-9 h-9 rounded-md bg-muted shrink-0">
                  {(() => {
                    const Icon = iconMap[item.icon as keyof typeof iconMap];
                    return Icon ? (
                      <Icon className="h-4 w-4 text-foreground" />
                    ) : null;
                  })()}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Start */}
      <Card className="border-border/50">
        <CardContent className="flex items-center justify-between p-5 gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 shrink-0">
              <Rocket className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">New here?</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Start with the Getting Started guide for a walkthrough of all
                three sections and role-based entry points.
              </p>
            </div>
          </div>
          <Button size="sm" asChild>
            <Link href={`${EA}/getting-started`}>
              Getting Started
              <ArrowRight className="ml-2 h-3 w-3" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
