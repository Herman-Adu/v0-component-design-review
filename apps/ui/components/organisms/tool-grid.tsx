import { ToolCard } from "@/components/molecules/tool-card"
import { SectionHeading } from "@/components/atoms/section-heading"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface ToolItem {
  href: string
  icon: LucideIcon
  title: string
  description: string
  role?: string
  status?: "Active" | "Beta" | "Coming Soon"
}

interface ToolGridProps {
  title?: string
  tools: ToolItem[]
  accentColorClass?: string
  variant?: "compact" | "detailed"
  columns?: 2 | 3
  className?: string
}

/**
 * Grid of ToolCards with optional section heading.
 * Extracted from 7 platform overview pages (LinkedIn, Google, Facebook, Twitter, Admin).
 *
 * Usage:
 *   <ToolGrid
 *     title="Pages"
 *     tools={tools}
 *     accentColorClass="bg-sky-500/10 text-sky-500"
 *     variant="detailed"
 *     columns={2}
 *   />
 */
export function ToolGrid({
  title,
  tools,
  accentColorClass,
  variant = "detailed",
  columns = 2,
  className,
}: ToolGridProps) {
  const gridClass = variant === "compact"
    ? "grid gap-3 grid-cols-2 lg:grid-cols-3"
    : cn(
        "grid gap-4",
        columns === 3 ? "md:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2"
      )

  return (
    <div className={className}>
      {title && <SectionHeading title={title} level="h2" className="mb-4" />}
      <div className={gridClass}>
        {tools.map((tool) => (
          <ToolCard
            key={tool.href}
            {...tool}
            accentColorClass={accentColorClass}
            variant={variant}
          />
        ))}
      </div>
    </div>
  )
}
