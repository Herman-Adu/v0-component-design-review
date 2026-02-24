import { Card, CardContent } from "@/components/ui/card"
import { SpecRow } from "@/components/atoms/spec-row"
import { cn } from "@/lib/utils"

interface Spec {
  spec: string
  value: string
}

interface PlatformSpecsCardProps {
  title?: string
  specs: Spec[]
  className?: string
}

/**
 * Card showing platform specifications as label-value pairs.
 * Extracted from 5 platform overview pages (LinkedIn, Google, Facebook, Twitter + content-strategy).
 *
 * Usage:
 *   <PlatformSpecsCard
 *     title="LinkedIn Platform Specifications"
 *     specs={[
 *       { spec: "Post character limit", value: "3,000 characters" },
 *       { spec: "Best posting times", value: "Tuesday-Thursday, 8-10am" },
 *     ]}
 *   />
 */
export function PlatformSpecsCard({ title, specs, className }: PlatformSpecsCardProps) {
  return (
    <Card className={cn("border-border/50", className)}>
      <CardContent className="p-5">
        {title && (
          <h3 className="text-sm font-semibold text-foreground mb-3">{title}</h3>
        )}
        <div className="space-y-2">
          {specs.map((item) => (
            <SpecRow key={item.spec} spec={item.spec} value={item.value} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
