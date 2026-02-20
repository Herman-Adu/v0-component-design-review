'use client'

import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
      <AlertCircle className="h-12 w-12 text-destructive mb-4" />
      <h2 className="text-xl font-semibold text-foreground mb-2">
        Dashboard Error
      </h2>
      <p className="text-sm text-muted-foreground mb-6 text-center max-w-md">
        Something went wrong in the dashboard. Please try again.
      </p>
      <Button onClick={reset}>Try Again</Button>
    </div>
  )
}
