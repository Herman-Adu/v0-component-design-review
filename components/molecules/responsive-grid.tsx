import { cn } from '@/lib/utils'

type GridColumns = 2 | 3 | 4 | 5 | 6

interface ResponsiveGridProps<T> {
  /** Number of columns on desktop */
  columns: GridColumns
  /** Data array to render */
  items: T[]
  /** Render function for each item */
  renderItem: (item: T, index: number) => React.ReactNode
  /** Optional custom className */
  className?: string
  /** Optional gap size override */
  gap?: 'sm' | 'md' | 'lg'
}

const gridClassMap: Record<GridColumns, string> = {
  2: 'responsive-grid-2',
  3: 'responsive-grid-3',
  4: 'responsive-grid-4',
  5: 'responsive-grid-5',
  6: 'responsive-grid-6',
}

const gapClassMap = {
  sm: 'gap-3',
  md: 'gap-4',
  lg: 'gap-6',
}

/**
 * ResponsiveGrid - Reusable grid component with automatic responsive breakpoints
 * 
 * Uses semantic grid utilities from globals.css for consistent responsive behavior:
 * - Mobile: Single column stack
 * - Tablet: Optimized 2-column or featured layouts (2,1 / 2,1,2,1 patterns)
 * - Desktop: Full column count specified
 * 
 * @example
 * ```tsx
 * <ResponsiveGrid
 *   columns={3}
 *   items={metrics}
 *   renderItem={(metric) => (
 *     <Card>
 *       <CardHeader>
 *         <CardTitle>{metric.title}</CardTitle>
 *       </CardHeader>
 *     </Card>
 *   )}
 * />
 * ```
 */
export function ResponsiveGrid<T>({
  columns,
  items,
  renderItem,
  className,
  gap,
}: ResponsiveGridProps<T>) {
  const gridClass = gridClassMap[columns]
  const gapClass = gap ? gapClassMap[gap] : undefined

  return (
    <div className={cn(gridClass, gapClass, className)}>
      {items.map((item, index) => (
        <div key={index}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  )
}
