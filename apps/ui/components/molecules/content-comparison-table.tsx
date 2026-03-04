import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface ContentComparisonRow {
  content_type: string
  reach: "Low" | "Medium" | "High" | "Very High"
  engagement: "Low" | "Medium" | "High" | "Very High"
  effort: "Low" | "Medium" | "High"
  notes: string
}

interface ContentComparisonTableProps {
  rows: ContentComparisonRow[]
  className?: string
}

const levelColors = {
  Low: "bg-red-500/20 text-red-400",
  Medium: "bg-amber-500/20 text-amber-400",
  High: "bg-green-500/20 text-green-400",
  "Very High": "bg-emerald-500/20 text-emerald-400",
}

/**
 * Content comparison table showing reach, engagement, and effort per content type.
 * Extracted from 4 analytics sub-pages.
 *
 * Usage:
 *   <ContentComparisonTable rows={contentComparison} />
 */
export function ContentComparisonTable({ rows, className }: ContentComparisonTableProps) {
  return (
    <Card className={cn("border-border/50", className)}>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 text-muted-foreground font-medium">Content Type</th>
                <th className="text-center p-3 text-muted-foreground font-medium">Reach</th>
                <th className="text-center p-3 text-muted-foreground font-medium">Engagement</th>
                <th className="text-center p-3 text-muted-foreground font-medium">Effort</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.content_type} className="border-b border-border/50 last:border-0">
                  <td className="p-3 font-medium text-foreground">{row.content_type}</td>
                  <td className="p-3 text-center">
                    <Badge className={cn("border-0 text-[10px]", levelColors[row.reach])}>
                      {row.reach}
                    </Badge>
                  </td>
                  <td className="p-3 text-center">
                    <Badge className={cn("border-0 text-[10px]", levelColors[row.engagement])}>
                      {row.engagement}
                    </Badge>
                  </td>
                  <td className="p-3 text-center">
                    <Badge className={cn("border-0 text-[10px]", levelColors[row.effort])}>
                      {row.effort}
                    </Badge>
                  </td>
                  <td className="p-3 text-muted-foreground">{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
