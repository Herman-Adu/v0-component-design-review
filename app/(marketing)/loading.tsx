import { Skeleton } from "@/components/ui/skeleton"

/**
 * Marketing Loading UI
 * 
 * Displayed during route transitions within (marketing) group
 * Simple loading state for public pages
 */
export default function MarketingLoading() {
  return (
    <main className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <Skeleton className="h-12 w-96 mx-auto" />
            <Skeleton className="h-6 w-full max-w-2xl mx-auto" />
            <Skeleton className="h-6 w-full max-w-xl mx-auto" />
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
