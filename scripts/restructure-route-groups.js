#!/usr/bin/env node

/**
 * Route Group Restructuring Script
 * 
 * This script reorganizes the Next.js App Router structure into route groups:
 * - (marketing): Public pages
 * - (dashboard): Authenticated dashboard pages  
 * - (auth): Authentication pages (skeleton for future implementation)
 * 
 * Run: node scripts/restructure-route-groups.js
 */

const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, '..', 'app');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function createDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    log(`✓ Created directory: ${dirPath}`, 'green');
  }
}

function moveDirectory(src, dest) {
  if (!fs.existsSync(src)) {
    log(`✗ Source not found: ${src}`, 'red');
    return false;
  }
  
  if (fs.existsSync(dest)) {
    log(`✗ Destination already exists: ${dest}`, 'red');
    return false;
  }
  
  fs.renameSync(src, dest);
  log(`✓ Moved: ${src} → ${dest}`, 'green');
  return true;
}

function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
  log(`✓ Created: ${filePath}`, 'green');
}

log('\n🚀 Starting Route Group Restructure...\n', 'blue');

// Step 1: Create (marketing) route group
log('Step 1: Creating (marketing) route group...', 'yellow');
const marketingDir = path.join(appDir, '(marketing)');
createDir(marketingDir);

// Move homepage to marketing
const homePage = path.join(appDir, 'page.tsx');
const marketingHome = path.join(marketingDir, 'page.tsx');
if (fs.existsSync(homePage)) {
  fs.renameSync(homePage, marketingHome);
  log(`✓ Moved homepage to (marketing)`, 'green');
}

// Create marketing layout
const marketingLayout = `import type React from "react"

/**
 * Marketing Layout
 * Used for public-facing pages (homepage, services, contact, etc.)
 */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Marketing pages use root layout's Navbar */}
      {children}
    </>
  )
}
`;
writeFile(path.join(marketingDir, 'layout.tsx'), marketingLayout);

// Create marketing loading state
const marketingLoading = `export default function MarketingLoading() {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="h-12 bg-muted animate-pulse rounded" />
        <div className="h-6 bg-muted animate-pulse rounded w-2/3" />
        <div className="h-64 bg-muted animate-pulse rounded" />
      </div>
    </div>
  )
}
`;
writeFile(path.join(marketingDir, 'loading.tsx'), marketingLoading);

// Step 2: Create (dashboard) route group
log('\nStep 2: Creating (dashboard) route group...', 'yellow');
const dashboardGroupDir = path.join(appDir, '(dashboard)');
createDir(dashboardGroupDir);

// Move dashboard folder into (dashboard) route group
const oldDashboard = path.join(appDir, 'dashboard');
const newDashboard = path.join(dashboardGroupDir, 'dashboard');
if (moveDirectory(oldDashboard, newDashboard)) {
  log(`✓ Moved entire dashboard folder structure`, 'green');
}

// Create dashboard route group layout (wraps the existing dashboard layout)
const dashboardGroupLayout = `import type React from "react"

/**
 * Dashboard Route Group Layout
 * This wraps all dashboard routes (/dashboard/*)
 * The actual dashboard layout with sidebar is at /dashboard/layout.tsx
 */
export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
`;
writeFile(path.join(dashboardGroupDir, 'layout.tsx'), dashboardGroupLayout);

// Create dashboard loading state
const dashboardLoading = `import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="flex h-full">
      <div className="flex-1 p-6 space-y-6">
        <Skeleton className="h-12 w-full" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  )
}
`;
writeFile(path.join(dashboardGroupDir, 'loading.tsx'), dashboardLoading);

// Create dashboard error boundary
const dashboardError = `'use client'

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
`;
writeFile(path.join(dashboardGroupDir, 'error.tsx'), dashboardError);

// Step 3: Create (auth) route group skeleton
log('\nStep 3: Creating (auth) route group skeleton...', 'yellow');
const authDir = path.join(appDir, '(auth)');
createDir(authDir);

// Create auth layout
const authLayout = `import type React from "react"

/**
 * Auth Layout
 * Centered layout for authentication pages (login, register, reset-password)
 * Future implementation - pages not yet created
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
`;
writeFile(path.join(authDir, 'layout.tsx'), authLayout);

// Create auth loading state
const authLoading = `export default function AuthLoading() {
  return (
    <div className="w-full space-y-4">
      <div className="h-8 bg-muted animate-pulse rounded w-48 mx-auto" />
      <div className="h-48 bg-muted animate-pulse rounded" />
    </div>
  )
}
`;
writeFile(path.join(authDir, 'loading.tsx'), authLoading);

// Create placeholder login page
const loginDir = path.join(authDir, 'login');
createDir(loginDir);
const loginPage = `import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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
`;
writeFile(path.join(loginDir, 'page.tsx'), loginPage);

// Create README documenting the structure
const readmeContent = `# Route Group Structure

This project uses Next.js App Router route groups for clean architectural separation.

## Route Groups

### (marketing)
- **Purpose**: Public-facing marketing pages
- **Layout**: Simple layout with navbar and footer
- **Pages**: Homepage, services, contact, quotations
- **URL**: Routes appear at root level (e.g., \`/\`, \`/services\`)

### (dashboard)
- **Purpose**: Authenticated dashboard application
- **Layout**: Dashboard layout with sidebar navigation
- **Pages**: Admin panels, content library, documentation
- **URL**: Routes appear under \`/dashboard/*\`
- **Features**: Loading states, error boundaries

### (auth)
- **Purpose**: Authentication pages (future implementation)
- **Layout**: Centered auth layout
- **Pages**: Login, register, password reset (placeholders)
- **URL**: Routes appear at root level (e.g., \`/login\`)
- **Status**: Skeleton ready for implementation

## Benefits

1. **Layout Isolation**: Each route group has its own layout
2. **Clean URLs**: Route groups don't appear in URLs
3. **Better Organization**: Clear separation between public, authenticated, and auth pages
4. **Scalability**: Easy to add new sections with different layouts
5. **Error Boundaries**: Granular error handling per section

## File Structure

\`\`\`
app/
├── layout.tsx                 # Root layout (applies to all)
├── globals.css               # Global styles
│
├── (marketing)/              # Public pages
│   ├── layout.tsx           # Marketing layout
│   ├── loading.tsx          # Loading UI
│   └── page.tsx             # Homepage
│
├── (dashboard)/             # Dashboard pages
│   ├── layout.tsx          # Dashboard group layout
│   ├── loading.tsx         # Loading UI
│   ├── error.tsx           # Error boundary
│   └── dashboard/          # Actual dashboard routes
│       ├── layout.tsx      # Dashboard layout with sidebar
│       └── [all pages]     # 98+ dashboard pages
│
└── (auth)/                 # Auth pages (future)
    ├── layout.tsx         # Auth layout
    ├── loading.tsx        # Loading UI
    └── login/
        └── page.tsx       # Placeholder
\`\`\`

## Next Steps

1. Add more marketing pages to \`(marketing)/\`
2. Implement authentication in \`(auth)/\`
3. Continue building dashboard features in \`(dashboard)/dashboard/\`
`;
writeFile(path.join(appDir, 'ROUTE_GROUPS.md'), readmeContent);

log('\n✅ Route Group Restructure Complete!\n', 'green');
log('Summary:', 'blue');
log('  ✓ (marketing) route group created with homepage', 'green');
log('  ✓ (dashboard) route group created with all dashboard pages', 'green');
log('  ✓ (auth) route group created with skeleton for future auth', 'green');
log('  ✓ Loading and error boundaries added', 'green');
log('  ✓ Documentation created: app/ROUTE_GROUPS.md\n', 'green');
log('Next: Test the application and verify all routes work correctly\n', 'yellow');
