import { Badge } from "@/components/ui/badge"
import { IconContainer } from "@/components/atoms/icon-container"
import { SectionHeading } from "@/components/atoms/section-heading"
import type { LucideIcon } from "lucide-react"

interface PlatformHeaderBadge {
  label: string
  colorClass?: string
  variant?: "default" | "outline"
}

interface PlatformHeaderProps {
  name: string
  tagline: string
  icon: LucideIcon
  accentColorClass: string
  badges?: PlatformHeaderBadge[]
  className?: string
}

/**
 * Page header with platform icon, title, tagline, and badges.
 * Extracted from 57 pages across digital marketing, email admin, and documentation.
 *
 * Usage:
 *   <PlatformHeader
 *     name="LinkedIn Marketing"
 *     tagline="Professional B2B presence and thought leadership"
 *     icon={Share2}
 *     accentColorClass="bg-sky-500/10 text-sky-500"
 *     badges={[
 *       { label: "5 Tools", variant: "outline" },
 *       { label: "B2B Focus", colorClass: "bg-sky-500/20 text-sky-400" },
 *     ]}
 *   />
 */
export function PlatformHeader({
  name,
  tagline,
  icon,
  accentColorClass,
  badges,
  className,
}: PlatformHeaderProps) {
  return (
    <div className={className}>
      <div className="flex items-center gap-3 mb-2">
        <IconContainer icon={icon} colorClass={accentColorClass} size="lg" withBorder />
        <SectionHeading title={name} description={tagline} level="h1" />
      </div>
      {badges && badges.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {badges.map((badge) => (
            <Badge
              key={badge.label}
              variant={badge.variant === "outline" ? "outline" : "default"}
              className={badge.colorClass ? `${badge.colorClass} border-0` : undefined}
            >
              {badge.label}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
