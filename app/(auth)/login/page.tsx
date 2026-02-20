import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

/**
 * Login Page Placeholder
 * Future implementation - authentication system not yet built
 */
export default function LoginPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Authentication system coming soon
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          This page is a placeholder for future authentication implementation.
        </p>
      </CardContent>
    </Card>
  )
}
