import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Database,
  Rocket,
  FileText,
  BookOpen,
  FileCode,
  LayoutGrid,
  Share2,
  ArrowRight,
  Users,
  Layers,
  Code,
} from "lucide-react"

export default function CmsReferencePage() {
  const features = [
    {
      title: "Getting Started",
      description:
        "Step-by-step Strapi installation with PostgreSQL, creating your first content types, and connecting to the Next.js frontend. Full developer onboarding guide.",
      icon: Rocket,
      href: "/dashboard/documentation/cms-reference/getting-started",
      role: "Developer",
      roleColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      iconColor: "bg-emerald-500/10 text-emerald-400",
    },
    {
      title: "Form Collections",
      description:
        "Strapi schema definitions for Service Requests, Contact Forms, and Quotation submissions. Copy-paste schemas with full field mappings to TypeScript interfaces.",
      icon: FileText,
      href: "/dashboard/documentation/cms-reference/form-collections",
      role: "Developer",
      roleColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      iconColor: "bg-emerald-500/10 text-emerald-400",
    },
    {
      title: "Content Collections",
      description:
        "Schemas for Articles, Tutorials, and Case Studies with rich text fields, media relations, category taxonomies, and SEO metadata. Full TypeScript interface mappings.",
      icon: BookOpen,
      href: "/dashboard/documentation/cms-reference/content-collections",
      role: "Developer",
      roleColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      iconColor: "bg-blue-500/10 text-blue-400",
    },
    {
      title: "Single Types",
      description:
        "Site-wide settings, SEO configuration, company information, and global content stored as Strapi Single Types. Schema definitions with default values.",
      icon: FileCode,
      href: "/dashboard/documentation/cms-reference/single-types",
      role: "Developer",
      roleColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      iconColor: "bg-amber-500/10 text-amber-400",
    },
    {
      title: "Shared Components",
      description:
        "Reusable Strapi components: Contact Info, UK Address, SEO Metadata, Social Links, and more. Compose these into any collection type or single type.",
      icon: LayoutGrid,
      href: "/dashboard/documentation/cms-reference/shared-components",
      role: "Developer",
      roleColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      iconColor: "bg-purple-500/10 text-purple-400",
    },
    {
      title: "Relationships",
      description:
        "Entity relationship diagrams, component composition patterns, and foreign key mappings across all content types. Architecture-level view of the data model.",
      icon: Share2,
      href: "/dashboard/documentation/cms-reference/relationships",
      role: "Architect",
      roleColor: "bg-blue-500/15 text-blue-400 border-blue-500/30",
      iconColor: "bg-cyan-500/10 text-cyan-400",
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Database className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">CMS Reference</h1>
            <p className="text-muted-foreground text-pretty">
              Strapi CMS schema definitions, content models, and data architecture for developers.
            </p>
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          <Badge className="text-xs bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20">Developer</Badge>
          <Badge className="text-xs bg-blue-500/15 text-blue-400 border-blue-500/30 hover:bg-blue-500/20">Architect</Badge>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-emerald-500/20">
          <CardHeader className="pb-2">
            <CardDescription>Content Types</CardDescription>
            <CardTitle className="text-2xl">6</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Form + content collections and single types</p>
          </CardContent>
        </Card>
        <Card className="border-blue-500/20">
          <CardHeader className="pb-2">
            <CardDescription>Shared Components</CardDescription>
            <CardTitle className="text-2xl">8+</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Reusable Strapi components across types</p>
          </CardContent>
        </Card>
        <Card className="border-amber-500/20">
          <CardHeader className="pb-2">
            <CardDescription>Reference Pages</CardDescription>
            <CardTitle className="text-2xl">6</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Complete schema and relationship docs</p>
          </CardContent>
        </Card>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <Link key={feature.href} href={feature.href}>
              <Card className="h-full transition-colors hover:border-primary/30 hover:bg-muted/30">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-md ${feature.iconColor}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <Badge className={`text-xs ${feature.roleColor}`}>{feature.role}</Badge>
                  </div>
                  <CardTitle className="text-base">{feature.title}</CardTitle>
                  <CardDescription className="text-sm text-pretty">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Architecture callout */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Layers className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Data Architecture</CardTitle>
          </div>
          <CardDescription className="text-pretty">
            All schemas follow a consistent pattern: Strapi content types map 1:1 to TypeScript interfaces
            on the frontend. Shared components are composed into collection types to enforce data consistency.
            The Relationships page provides the full entity-relationship diagram.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Link href="/dashboard/documentation/cms-reference/relationships">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Code className="h-4 w-4" />
              View Relationships
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
          <Link href="/dashboard/documentation/cms-reference/getting-started">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Users className="h-4 w-4" />
              Developer Onboarding
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
