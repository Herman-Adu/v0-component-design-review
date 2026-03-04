import { Card, CardContent } from "@/components/ui/card"
import { ChecklistRow } from "@/components/atoms/checklist-row"

interface StrategyPhaseCardProps {
  title: string
  description: string
  items: string[]
  accentColorClass?: string
  className?: string
}

/**
 * Strategy phase card showing phase title, description, and checklist items.
 * Extracted from 15 strategy-flow sections across platform pages.
 *
 * Usage:
 *   <StrategyPhaseCard
 *     title="Establish Authority"
 *     description="Build credibility with a polished profile"
 *     items={["Company Page", "Article Publisher"]}
 *     accentColorClass="text-sky-500"
 *   />
 */
export function StrategyPhaseCard({
  title,
  description,
  items,
  accentColorClass = "text-green-500",
  className,
}: StrategyPhaseCardProps) {
  return (
    <Card className={className ?? "border-border/50"}>
      <CardContent className="p-5">
        <p className="text-lg font-semibold text-foreground mb-1">{title}</p>
        <p className="text-xs text-muted-foreground mb-3">{description}</p>
        <div className="space-y-2">
          {items.map((item) => (
            <ChecklistRow key={item} text={item} accentColorClass={accentColorClass} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
