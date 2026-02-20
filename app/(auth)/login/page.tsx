import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Zap, ArrowLeft } from "lucide-react"

/**
 * Login Page Placeholder
 * 
 * Auth architecture is ready. When implementing authentication:
 * - Add NextAuth, Clerk, or Supabase Auth
 * - This layout provides centered card-based UI
 * - Route group isolates auth flow from dashboard/marketing
 */
export default function LoginPage() {
  return (
    <Card className="border-border/50">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
          <Zap className="w-6 h-6 text-accent" />
        </div>
        <CardTitle className="text-2xl">Authentication Ready</CardTitle>
        <CardDescription>
          Auth route group is configured and ready for implementation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 rounded-lg bg-muted/50 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground mb-2">Implementation Options:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>NextAuth.js (OAuth, credentials, magic links)</li>
            <li>Clerk (hosted auth, beautiful UI)</li>
            <li>Supabase Auth (row-level security)</li>
            <li>Custom auth (session management, JWT)</li>
          </ul>
        </div>
        <Link href="/">
          <Button variant="outline" className="w-full">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
