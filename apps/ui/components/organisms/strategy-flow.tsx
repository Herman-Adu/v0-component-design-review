import { StrategyPhaseCard } from "@/components/molecules/strategy-phase-card"
import { SectionHeading } from "@/components/atoms/section-heading"
import { cn } from "@/lib/utils"

interface StrategyPhase {
  title: string
  description: string
  items: string[]
}

interface StrategyFlowProps {
  title?: string
  phases: StrategyPhase[]
  accentColorClass?: string
  className?: string
}

/**
 * Row of strategy phase cards showing a multi-step process flow.
 * Extracted from 15 pages across all platform overviews.
 *
 * Usage:
 *   <StrategyFlow
 *     phases={strategy}
 *     accentColorClass="text-sky-500"
 *   />
 */
export function StrategyFlow({
  title,
  phases,
  accentColorClass,
  className,
}: StrategyFlowProps) {
  return (
    <div className={className}>
      {title && <SectionHeading title={title} level="h2" className="mb-4" />}
      <div className="responsive-grid-3">
        {phases.map((phase) => (
          <StrategyPhaseCard
            key={phase.title}
            {...phase}
            accentColorClass={accentColorClass}
          />
        ))}
      </div>
    </div>
  )
}
