import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IconContainer } from "@/components/atoms/icon-container"
import type { LucideIcon } from "lucide-react"

interface BackNavigationCardProps {
  label: string
  description: string
  href: string
  icon: LucideIcon
  accentColorClass?: string
  className?: string
}

/**
 * Navigation card linking back to parent section.
 * Extracted from 29 sub-pages across digital marketing platform pages.
 *
 * Usage:
 *   <BackNavigationCard
 *     label="Back to Digital Marketing"
 *     description="Explore other platforms and tools."
 *     href="/dashboard/admin/digital-marketing"
 *     icon={Megaphone}
 *     accentColorClass="bg-accent/10 text-accent"
 *   />
 */
export function BackNavigationCard({
  label,
  description,
  href,
  icon,
  accentColorClass = "bg-accent/10 text-accent",
  className,
}: BackNavigationCardProps) {
  return (
    <Card className={className ?? "border-border/50"}>
      <CardContent className="flex items-center justify-between p-5 gap-4">
        <div className="flex items-center gap-4">
          <IconContainer icon={icon} colorClass={accentColorClass} size="lg" />
          <div>
            <p className="text-sm font-medium text-foreground">{label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="bg-transparent" asChild>
          <Link href={href}>
            Overview <ArrowRight className="ml-2 h-3 w-3" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
