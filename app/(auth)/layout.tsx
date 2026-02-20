import type React from "react"

/**
 * Auth Layout -- Server Component
 *
 * Used for authentication pages: login, register, reset-password, etc.
 * Provides centered, card-based layout without navbar.
 *
 * Route Group: (auth) - isolates auth flow from main app
 * Ready for future auth implementation (NextAuth, Clerk, Supabase Auth, etc.)
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
