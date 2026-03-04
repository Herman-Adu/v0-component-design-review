"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      // Replace with your error reporting service
    }
  }, [error])

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-6 px-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-7 w-7 text-destructive" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Dashboard Error</h2>
        <p className="max-w-md text-sm text-muted-foreground">
          Something went wrong loading this page. Try again or navigate to a different section.
        </p>
        {error.digest && (
          <p className="font-mono text-xs text-muted-foreground/60">
            Error ID: {error.digest}
          </p>
        )}
      </div>
      <div className="flex gap-3">
        <Button onClick={reset} size="sm">
          Try Again
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard">Dashboard Home</Link>
        </Button>
      </div>
    </div>
  )
}
