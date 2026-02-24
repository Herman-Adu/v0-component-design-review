import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SectionHeading } from "@/components/atoms/section-heading"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface MetricDefinition {
  title: string
  description: string
  target: string
  icon: LucideIcon
  category: string
}

interface MetricsGridProps {
  title?: string
  metrics: MetricDefinition[]
  accentColorClass?: string
  columns?: 2 | 3
  className?: string
}

const categoryColors: Record<string, string> = {
  Awareness: "bg-blue-500/20 text-blue-400",
  Reach: "bg-purple-500/20 text-purple-400",
  Engagement: "bg-green-500/20 text-green-400",
  Conversion: "bg-amber-500/20 text-amber-400",
  Targeting: "bg-sky-500/20 text-sky-400",
}

/**
 * Grid of metric definition cards with category badges.
 * Extracted from 9 analytics pages (LinkedIn, Google, Facebook, Twitter analytics).
 *
 * Usage:
 *   <MetricsGrid title="Key Metrics" metrics={keyMetrics} columns={3} />
 */
export function MetricsGrid({
  title,
  metrics,
  accentColorClass,
  columns = 3,
  className,
}: MetricsGridProps) {
  const gridClass = cn(
    "grid gap-4",
    columns === 3 ? "md:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2"
  )

  return (
    <div className={className}>
      {title && <SectionHeading title={title} level="h2" className="mb-4" />}
      <div className={gridClass}>
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <Card key={metric.title} className="border-border/50">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className={cn("h-4 w-4", accentColorClass ?? "text-foreground")} />
                    <p className="font-semibold text-foreground text-sm">{metric.title}</p>
                  </div>
                  <Badge
                    className={cn(
                      "border-0 text-[10px]",
                      categoryColors[metric.category] ?? "bg-muted text-muted-foreground"
                    )}
                  >
                    {metric.category}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  {metric.description}
                </p>
                <p className="text-xs text-foreground font-medium border-t border-border pt-3">
                  Target: {metric.target}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
