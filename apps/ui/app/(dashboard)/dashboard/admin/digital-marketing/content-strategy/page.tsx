import editorialGuidelinesData from "@/data/strapi-mock/dashboard/admin/digital-marketing/content-strategy/editorial-guidelines.json";
import contentMetricsData from "@/data/strapi-mock/dashboard/admin/digital-marketing/content-strategy/content-metrics.json";
import distributionChannelsData from "@/data/strapi-mock/dashboard/admin/digital-marketing/content-strategy/distribution-channels.json";
import contentCalendarData from "@/data/strapi-mock/dashboard/admin/digital-marketing/content-strategy/content-calendar.json";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Calendar,
  Target,
  BarChart3,
  Globe,
  FileText,
  BookOpen,
  GraduationCap,
  CheckCircle2,
  Clock,
  Users,
  Lightbulb,
} from "lucide-react";

const contentCalendar = contentCalendarData.contentCalendar || [];

const distributionChannels =
  distributionChannelsData.distributionChannels || [];

const contentMetrics = contentMetricsData.contentMetrics || [];

const editorialGuidelines = editorialGuidelinesData.editorialGuidelines || [];

const iconMap = {
  Users,
  Globe,
  FileText,
  BookOpen,
};

export default function ContentStrategyPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Content Strategy
            </h1>
            <p className="text-muted-foreground">
              Content calendar, distribution strategy, and editorial planning
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="responsive-grid-4 mb-8">
        {contentMetrics.map((metric) => (
          <Card key={metric.label}>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-foreground">
                {metric.value}
              </p>
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              <p className="text-xs text-green-600 mt-1">{metric.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Calendar */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <CardTitle>8-Week Content Calendar</CardTitle>
          </div>
          <CardDescription>
            Rolling content plan aligned with learning hub structure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contentCalendar.map((phase) => (
              <div
                key={phase.week}
                className="flex items-start gap-4 p-4 rounded-lg border bg-muted/30"
              >
                <div className="min-w-[100px]">
                  <p className="font-medium text-foreground text-sm">
                    {phase.week}
                  </p>
                  <Badge
                    variant={
                      phase.status === "published"
                        ? "default"
                        : phase.status === "in-progress"
                          ? "secondary"
                          : "outline"
                    }
                    className="mt-1 text-xs"
                  >
                    {phase.status}
                  </Badge>
                </div>
                <div>
                  <p className="font-medium text-foreground">{phase.theme}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {phase.topics.map((topic) => (
                      <Badge
                        key={topic}
                        variant="outline"
                        className="text-xs font-normal"
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Distribution Strategy */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <CardTitle>Distribution Channels</CardTitle>
          </div>
          <CardDescription>
            Multi-platform content distribution targeting specific audiences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="responsive-grid-2">
            {distributionChannels.map((channel) => (
              <div
                key={channel.name}
                className="flex items-start gap-3 p-4 rounded-lg border"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted shrink-0">
                  {(() => {
                    const Icon = iconMap[channel.icon as keyof typeof iconMap];
                    return Icon ? (
                      <Icon className="h-4 w-4 text-foreground" />
                    ) : null;
                  })()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">
                      {channel.name}
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      {channel.frequency}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Audience: {channel.audience}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Content: {channel.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Editorial Guidelines */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <CardTitle>Editorial Guidelines</CardTitle>
          </div>
          <CardDescription>
            Standards every content piece must meet before publishing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="responsive-grid-2">
            {editorialGuidelines.map((guideline) => (
              <div
                key={guideline.title}
                className="flex items-start gap-3 p-4 rounded-lg bg-muted/30"
              >
                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">
                    {guideline.title}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {guideline.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Process Note */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground mb-1">
                Content Pipeline
              </p>
              <p className="text-sm text-muted-foreground">
                Content flows from the calendar through drafting, technical
                review, editorial polish, and finally multi-platform
                distribution. Each piece is tagged with audience role,
                difficulty level, and related codebase files for
                cross-referencing with the learning hub.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
