import { Card, CardContent } from "@/components/ui/card"
import { IconContainer } from "@/components/atoms/icon-container"
import type { LucideIcon } from "lucide-react"

interface WhyPlatformCardProps {
  title: string
  description: string
  icon: LucideIcon
  accentColorClass: string
  className?: string
}

/**
 * Highlighted card explaining why a platform matters for the business.
 * Extracted from 13 platform overview pages.
 *
 * Usage:
 *   <WhyPlatformCard
 *     title="Why LinkedIn for Electrical Services?"
 *     description="LinkedIn is the primary platform for reaching commercial clients..."
 *     icon={Share2}
 *     accentColorClass="sky"
 *   />
 *
 * Note: accentColorClass should be the color name (e.g. "sky", "blue", "amber").
 * The component builds the full Tailwind classes from the color name.
 */
export function WhyPlatformCard({
  title,
  description,
  icon,
  accentColorClass,
  className,
}: WhyPlatformCardProps) {
  const borderClass = `border-${accentColorClass}-500/20`
  const bgClass = `bg-${accentColorClass}-500/5`
  const iconBgClass = `bg-${accentColorClass}-500/10`
  const iconTextClass = `text-${accentColorClass}-400`

  return (
    <Card className={className ?? `${borderClass} ${bgClass}`}>
      <CardContent className="flex gap-4 p-5">
        <IconContainer
          icon={icon}
          colorClass={`${iconBgClass} ${iconTextClass}`}
          size="md"
        />
        <div>
          <p className="text-sm font-medium text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
