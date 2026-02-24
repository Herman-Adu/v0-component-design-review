import { Card, CardContent } from "@/components/ui/card"
import { ChecklistRow } from "@/components/atoms/checklist-row"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface ChecklistCardProps {
  title: string
  items: string[]
  accentColorClass?: string
  icon?: LucideIcon
  className?: string
}

/**
 * Card containing a titled checklist of items.
 * Extracted from 20 checklist patterns across platform pages.
 *
 * Usage:
 *   <ChecklistCard
 *     title="Profile Optimisation Checklist"
 *     items={["Professional headshot", "Keyword-rich headline"]}
 *     accentColorClass="text-sky-500"
 *   />
 */
export function ChecklistCard({
  title,
  items,
  accentColorClass = "text-green-500",
  icon: Icon,
  className,
}: ChecklistCardProps) {
  return (
    <Card className={cn("border-border/50", className)}>
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-4">
          {Icon && <Icon className={cn("h-4 w-4", accentColorClass)} />}
          <p className="font-semibold text-foreground text-sm">{title}</p>
        </div>
        <div className="space-y-2">
          {items.map((item) => (
            <ChecklistRow key={item} text={item} accentColorClass={accentColorClass} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
