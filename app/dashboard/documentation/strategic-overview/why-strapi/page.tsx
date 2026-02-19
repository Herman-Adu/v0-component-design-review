"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Callout } from "@/components/atoms/callout"
import {
  TrendingUp,
  DollarSign,
  Clock,
  Shield,
  Users,
  Zap,
  Scale,
  CheckCircle,
  ArrowRight,
  Building,
  Globe,
  Lock,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const benefits = [
  {
    icon: DollarSign,
    title: "60% Cost Reduction",
    description:
      "Compared to custom CMS development, Strapi reduces backend development costs by eliminating the need to build content management from scratch.",
    metric: "60%",
    metricLabel: "Lower dev costs",
  },
  {
    icon: Clock,
    title: "3x Faster Development",
    description:
      "Pre-built admin panel, API generation, and plugin ecosystem accelerate time-to-market for content-driven applications.",
    metric: "3x",
    metricLabel: "Faster delivery",
  },
  {
    icon: Users,
    title: "Non-Technical Content Management",
    description:
      "Business teams can update content without developer involvement, reducing bottlenecks and enabling rapid content iteration.",
    metric: "Self-serve",
    metricLabel: "Content updates",
  },
  {
    icon: Scale,
    title: "Enterprise Scalability",
    description:
      "Handles millions of API requests with proper infrastructure. Horizontal scaling, caching, and CDN integration supported.",
    metric: "10M+",
    metricLabel: "API calls/month",
  },
]

const comparisonData = [
  {
    feature: "Content Management UI",
    strapi: "Included (customizable)",
    custom: "Build from scratch",
    saas: "Limited customization",
  },
  {
    feature: "API Generation",
    strapi: "Automatic REST & GraphQL",
    custom: "Manual development",
    saas: "Proprietary APIs",
  },
  {
    feature: "Data Ownership",
    strapi: "Full ownership (self-hosted)",
    custom: "Full ownership",
    saas: "Vendor controlled",
  },
  {
    feature: "Vendor Lock-in",
    strapi: "None (open source)",
    custom: "None",
    saas: "High",
  },
  {
    feature: "Initial Setup Time",
    strapi: "Hours to days",
    custom: "Weeks to months",
    saas: "Minutes to hours",
  },
  {
    feature: "Ongoing Costs",
    strapi: "Hosting only (~$20-100/mo)",
    custom: "High maintenance",
    saas: "$300-2000+/mo",
  },
  {
    feature: "Customization",
    strapi: "Unlimited (open source)",
    custom: "Unlimited",
    saas: "Limited",
  },
]

const securityFeatures = [
  { title: "Role-Based Access Control", description: "Granular permissions for users and API tokens" },
  { title: "GDPR Compliance Ready", description: "Data export, deletion, and consent management" },
  { title: "API Rate Limiting", description: "Protect against abuse and DDoS attacks" },
  { title: "Audit Logging", description: "Track all content changes and user actions" },
  { title: "SSO Integration", description: "Enterprise SSO with SAML and OAuth support" },
  { title: "Database Encryption", description: "At-rest encryption for sensitive data" },
]

export default function CTOOverviewPage() {
  return (
    <div className="space-y-12">
      {/* Page Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge className="bg-purple-500/20 text-purple-400">For Decision Makers</Badge>
        </div>
        <div className="flex items-center gap-3">
          <TrendingUp className="h-10 w-10 text-accent" />
          <h1 className="text-4xl font-bold text-foreground">Why Strapi?</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl">
          A business case for Strapi as your headless CMS. ROI analysis, comparison with
          alternatives, and enterprise considerations for technical leadership.
        </p>
      </div>

      {/* Key Benefits */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-foreground border-b border-border pb-2">
          Business Impact
        </h2>

        <div className="responsive-grid-2">
          {benefits.map((benefit) => {
            const Icon = benefit.icon
            return (
              <Card key={benefit.title}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="p-2 rounded-lg bg-accent/20">
                      <Icon className="h-6 w-6 text-accent" />
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-accent">{benefit.metric}</p>
                      <p className="text-xs text-muted-foreground">{benefit.metricLabel}</p>
                    </div>
                  </div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* ROI Calculator Concept */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-foreground border-b border-border pb-2">
          ROI Analysis
        </h2>

        <Card className="border-accent/50">
          <CardHeader>
            <CardTitle>Total Cost of Ownership Comparison</CardTitle>
            <CardDescription>Estimated costs over 3 years for a mid-size project</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="responsive-grid-3">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <h3 className="font-semibold text-foreground">Strapi (Self-Hosted)</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Initial Development</span>
                    <span className="text-foreground">$15,000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Hosting (3 years)</span>
                    <span className="text-foreground">$3,600</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Maintenance</span>
                    <span className="text-foreground">$6,000</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between font-semibold">
                    <span className="text-foreground">Total</span>
                    <span className="text-green-500">$24,600</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-amber-500" />
                  <h3 className="font-semibold text-foreground">Custom Backend</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Initial Development</span>
                    <span className="text-foreground">$60,000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Hosting (3 years)</span>
                    <span className="text-foreground">$5,400</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Maintenance</span>
                    <span className="text-foreground">$24,000</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between font-semibold">
                    <span className="text-foreground">Total</span>
                    <span className="text-amber-500">$89,400</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <h3 className="font-semibold text-foreground">SaaS CMS</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Initial Development</span>
                    <span className="text-foreground">$10,000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subscription (3 years)</span>
                    <span className="text-foreground">$36,000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Integration Costs</span>
                    <span className="text-foreground">$12,000</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between font-semibold">
                    <span className="text-foreground">Total</span>
                    <span className="text-red-500">$58,000</span>
                  </div>
                </div>
              </div>
            </div>

            <Callout type="success" title="3-Year Savings with Strapi" className="mt-6">
              Compared to custom development: <strong>$64,800 saved (72%)</strong>. Compared to SaaS
              solutions: <strong>$33,400 saved (57%)</strong> with full data ownership and no vendor
              lock-in.
            </Callout>
          </CardContent>
        </Card>
      </section>

      {/* Comparison Table */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-foreground border-b border-border pb-2">
          Solution Comparison
        </h2>

        <div className="border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left px-4 py-3 font-semibold text-foreground">Feature</th>
                  <th className="text-left px-4 py-3 font-semibold text-accent">Strapi</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                    Custom Build
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                    SaaS CMS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {comparisonData.map((row) => (
                  <tr key={row.feature}>
                    <td className="px-4 py-3 text-foreground font-medium">{row.feature}</td>
                    <td className="px-4 py-3 text-accent">{row.strapi}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.custom}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.saas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Security & Compliance */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-foreground border-b border-border pb-2">
          Enterprise Security & Compliance
        </h2>

        <div className="responsive-grid-2">
          {securityFeatures.map((feature) => (
            <Card key={feature.title}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  <CardTitle className="text-base">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-green-500/30 bg-green-500/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Lock className="h-8 w-8 text-green-500 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Data Sovereignty</h3>
                <p className="text-muted-foreground">
                  Self-hosted Strapi gives you complete control over where your data resides. Host
                  in your preferred region to meet GDPR, CCPA, or industry-specific compliance
                  requirements. No third-party access to your content or customer data.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Use Cases */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-foreground border-b border-border pb-2">
          Ideal Use Cases
        </h2>

        <div className="responsive-grid-3">
          <Card>
            <CardHeader>
              <Globe className="h-8 w-8 text-accent mb-2" />
              <CardTitle>Marketing Websites</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  Fast content updates without developers
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  SEO-optimized structured content
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  Multi-language support
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Building className="h-8 w-8 text-accent mb-2" />
              <CardTitle>Service Businesses</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  Form submission management
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  Customer inquiry tracking
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  Quote and booking workflows
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-8 w-8 text-accent mb-2" />
              <CardTitle>Mobile & Web Apps</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  REST and GraphQL APIs
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  Real-time webhooks
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  Media management & optimization
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Next Steps */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-foreground border-b border-border pb-2">
          Ready to Get Started?
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-accent/50">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-foreground mb-2">For Technical Teams</h3>
              <p className="text-muted-foreground mb-4">
                Dive into implementation details with our comprehensive technical documentation.
              </p>
              <Button asChild>
                <Link href="/dashboard/documentation/cms-reference/getting-started">
                  Getting Started Guide
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-foreground mb-2">Need Consultation?</h3>
              <p className="text-muted-foreground mb-4">
                Discuss your specific requirements and get a tailored implementation plan.
              </p>
              <Button variant="outline" asChild>
                <Link href="/contact">
                  Contact Us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
