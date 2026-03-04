import { Card, CardContent } from "@/components/ui/card"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface ReportingCadenceCardProps {
  frequency: string
  metrics: string[]
  action: string
  accentColorClass?: string
  className?: string
}

/**
 * Reporting cadence card showing frequency, metrics to track, and recommended action.
 * Extracted from 8 analytics/reporting sections.
 *
 * Usage:
 *   <ReportingCadenceCard
 *     frequency="Weekly"
 *     metrics={["Post impressions", "Engagement rate", "New followers"]}
 *     action="Identify top-performing content of the week."
 *   />
 */
export function ReportingCadenceCard({
  frequency,
  metrics,
  action,
  accentColorClass = "text-sky-500",
  className,
}: ReportingCadenceCardProps) {
  return (
    <Card className={cn("border-border/50", className)}>
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Clock className={cn("h-4 w-4", accentColorClass)} />
          <p className="font-semibold text-foreground text-sm">{frequency}</p>
        </div>
        <div className="space-y-1 mb-3">
          {metrics.map((metric) => (
            <p key={metric} className="text-xs text-muted-foreground">
              {metric}
            </p>
          ))}
        </div>
        <p className="text-xs text-foreground font-medium border-t border-border pt-3">
          {action}
        </p>
      </CardContent>
    </Card>
  )
}
