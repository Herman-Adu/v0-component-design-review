import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IconContainer } from "@/components/atoms/icon-container"
import { StatusBadge } from "@/components/atoms/status-badge"
import type { LucideIcon } from "lucide-react"

interface ToolCardProps {
  href: string
  icon: LucideIcon
  title: string
  description: string
  role?: string
  status?: "Active" | "Beta" | "Coming Soon"
  accentColorClass?: string
  variant?: "compact" | "detailed"
  className?: string
}

/**
 * Card for a tool/feature with navigation link.
 * Extracted from 7 tool-grid sections across platform overview pages.
 * 
 * Variants:
 * - compact: Icon + title + role + arrow (used in quick-access grids)
 * - detailed: Full card with description and status badge
 *
 * Usage:
 *   <ToolCard
 *     href="/dashboard/admin/digital-marketing/linkedin/composer"
 *     icon={PenSquare}
 *     title="Post Composer"
 *     description="Professional post composer with 3,000-character support"
 *     role="Content Creator"
 *     status="Active"
 *     variant="detailed"
 *   />
 */
export function ToolCard({
  href,
  icon,
  title,
  description,
  role,
  status = "Active",
  accentColorClass = "bg-muted text-foreground",
  variant = "detailed",
  className,
}: ToolCardProps) {
  if (variant === "compact") {
    return (
      <Card className={className ?? "border-border/50"}>
        <CardContent className="p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <IconContainer icon={icon} colorClass={accentColorClass} size="md" />
            <div className="min-w-0">
              <p className="font-semibold text-foreground text-sm truncate">{title}</p>
              {role && <p className="text-[10px] text-muted-foreground truncate">{role}</p>}
            </div>
          </div>
          <Button size="sm" variant="ghost" className="shrink-0 h-8 w-8 p-0" asChild>
            <Link href={href}>
              <ArrowRight className="h-4 w-4" />
              <span className="sr-only">Open {title}</span>
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className ?? "border-border/50"}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <IconContainer icon={icon} colorClass="bg-muted text-foreground" size="md" />
            <div>
              <p className="font-semibold text-foreground text-sm">{title}</p>
              {role && <p className="text-[10px] text-muted-foreground">{role}</p>}
            </div>
          </div>
          <StatusBadge status={status} />
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">{description}</p>
        <Button variant="outline" size="sm" className="bg-transparent" asChild>
          <Link href={href}>
            Open <ArrowRight className="ml-2 h-3 w-3" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
