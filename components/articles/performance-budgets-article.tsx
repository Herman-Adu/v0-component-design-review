"use client"

import {
  SectionHeader,
  SubSectionHeader,
  InfoBox,
  StepFlow,
  FeatureGrid,
  ComparisonCards,
  CodeBlock,
  KeyTakeaway,
  RelatedArticles,
  TableOfContents,
  MetricsGrid,
  StatsTable,
  VerticalFlow,
  DataFlowDiagram,
  DecisionTree,
  BeforeAfterComparison,
  type TOCItem,
} from "@/components/molecules/article-components"

const tocItems: TOCItem[] = [
  { id: "why-budgets", title: "Why Performance Budgets", level: 2 },
  { id: "what-to-measure", title: "What to Measure", level: 2 },
  { id: "core-web-vitals", title: "Core Web Vitals Deep Dive", level: 2 },
  { id: "setting-targets", title: "Setting Budget Targets", level: 2 },
  { id: "measurement-tools", title: "Measurement Tools", level: 2 },
  { id: "enforcement", title: "Enforcing Budgets in CI", level: 2 },
  { id: "nextjs-optimisations", title: "Next.js Optimisations", level: 2 },
  { id: "monitoring", title: "Ongoing Monitoring", level: 2 },
  { id: "key-takeaway", title: "Key Takeaway", level: 2 },
]

export function PerformanceBudgetsArticleContent() {
  return (
    <div className="flex gap-8">
      <div className="flex-1 min-w-0">
        <InfoBox type="info">
          A performance budget is a threshold for metrics that affect user experience. Without one,
          performance degrades gradually until users leave. With one, every pull request is measured
          against a defined standard before it can ship.
        </InfoBox>

        {/* Section 1: Why Performance Budgets */}
        <SectionHeader number="01" title="Why Performance Budgets Matter" id="why-budgets" />

        <p className="text-muted-foreground mb-6 leading-relaxed">
          Performance is not a feature you add later -- it is a constraint you design around from day one.
          Studies consistently show that page load time directly impacts conversion rates, bounce rates,
          and user satisfaction. A performance budget makes this constraint explicit and measurable.
        </p>

        <MetricsGrid
          metrics={[
            { label: "1s Delay Impact", value: "-7%", change: "Conversion rate", positive: false },
            { label: "3s Load Time", value: "53%", change: "Mobile bounce rate", positive: false },
            { label: "LCP Target", value: "2.5s", change: "Google threshold", positive: true },
            { label: "Bundle Budget", value: "200KB", change: "JS first-load", positive: true },
          ]}
        />

        <p className="text-muted-foreground my-6 leading-relaxed">
          Without a budget, performance degrades through what we call "death by a thousand cuts" --
          each developer adds a small dependency, a slightly larger image, one more API call. Individually
          harmless, collectively catastrophic. A budget creates a shared constraint that forces trade-off
          conversations before code is merged.
        </p>

        <DataFlowDiagram
          title="Performance Budget Enforcement Flow"
          nodes={[
            { label: "Developer Push", description: "Code committed" },
            { label: "CI Build", description: "Next.js build runs" },
            { label: "Lighthouse CI", description: "Metrics collected" },
            { label: "Budget Check", description: "Pass/fail gate" },
            { label: "Deploy / Block", description: "Based on result" },
          ]}
        />

        {/* Section 2: What to Measure */}
        <SectionHeader number="02" title="What to Measure" id="what-to-measure" />

        <p className="text-muted-foreground mb-6 leading-relaxed">
          Not all metrics are equally important. Focus on metrics that directly correlate with user
          experience, not vanity metrics like total page weight alone. The hierarchy below shows which
          metrics matter most and why.
        </p>

        <FeatureGrid
          columns={3}
          features={[
            {
              title: "Loading Performance",
              description: "How fast content appears. Measured by LCP (Largest Contentful Paint), FCP (First Contentful Paint), and TTFB (Time to First Byte). These determine whether users perceive your site as fast.",
              items: ["LCP < 2.5s", "FCP < 1.8s", "TTFB < 800ms"],
            },
            {
              title: "Interactivity",
              description: "How responsive the page feels. Measured by INP (Interaction to Next Paint) and TBT (Total Blocking Time). These determine whether users can actually use your site without frustration.",
              items: ["INP < 200ms", "TBT < 200ms", "FID < 100ms"],
            },
            {
              title: "Visual Stability",
              description: "Whether content shifts unexpectedly. Measured by CLS (Cumulative Layout Shift). Layout shift destroys user trust -- clicking a button that moves causes accidental actions.",
              items: ["CLS < 0.1", "No unsized images", "Font swap stable"],
            },
          ]}
        />

        <InfoBox type="warning">
          Do not budget for metrics you cannot control. Third-party scripts (analytics, chat widgets,
          ad networks) can blow your budget through no fault of your own. Measure them separately
          and use loading strategies (defer, async, lazy) to minimise their impact.
        </InfoBox>

        {/* Section 3: Core Web Vitals Deep Dive */}
        <SectionHeader number="03" title="Core Web Vitals Deep Dive" id="core-web-vitals" />

        <p className="text-muted-foreground mb-6 leading-relaxed">
          Google uses three Core Web Vitals as ranking signals. Understanding what each measures
          and what causes regressions is essential for setting meaningful budgets.
        </p>

        <StatsTable
          title="Core Web Vitals Thresholds"
          headers={["Metric", "Good", "Needs Improvement", "Poor", "What It Measures"]}
          rows={[
            ["LCP", "< 2.5s", "2.5s - 4.0s", "> 4.0s", "When main content is visible"],
            ["INP", "< 200ms", "200ms - 500ms", "> 500ms", "Responsiveness to user input"],
            ["CLS", "< 0.1", "0.1 - 0.25", "> 0.25", "Visual stability during load"],
            ["FCP", "< 1.8s", "1.8s - 3.0s", "> 3.0s", "First visual content appears"],
            ["TTFB", "< 800ms", "800ms - 1.8s", "> 1.8s", "Server response time"],
            ["TBT", "< 200ms", "200ms - 600ms", "> 600ms", "Main thread blocking"],
          ]}
        />

        <SubSectionHeader title="LCP: The Most Important Metric" />

        <p className="text-muted-foreground mb-6 leading-relaxed">
          LCP measures when the largest content element (hero image, heading, video poster) becomes
          visible. It is the closest proxy to "when does the page feel loaded?" Common LCP killers
          in Next.js applications include unoptimised images, render-blocking CSS, and slow server
          responses.
        </p>

        <VerticalFlow
          title="LCP Optimisation Checklist"
          steps={[
            {
              title: "Optimise Server Response",
              description: "Use SSG/ISR for cacheable pages. Target TTFB < 200ms for static content, < 800ms for dynamic.",
            },
            {
              title: "Eliminate Render-Blocking Resources",
              description: "Inline critical CSS. Defer non-critical stylesheets. Use next/font for zero-layout-shift font loading.",
            },
            {
              title: "Optimise LCP Element",
              description: "Use next/image with priority prop for hero images. Preload LCP images. Use responsive srcSet for correct sizing.",
            },
            {
              title: "Avoid Client-Side Rendering for LCP",
              description: "If your LCP element depends on client-side data fetching, it cannot render until JS loads, parses, and executes. Use Server Components.",
            },
          ]}
        />

        {/* Section 4: Setting Budget Targets */}
        <SectionHeader number="04" title="Setting Budget Targets" id="setting-targets" />

        <p className="text-muted-foreground mb-6 leading-relaxed">
          Budget targets should be based on your current performance plus a safety margin, not
          arbitrary ideals. Measure your baseline first, then set budgets that prevent regression
          while allowing for gradual improvement.
        </p>

        <DecisionTree
          title="Budget Target Decision Framework"
          decisions={[
            { condition: "New project?", result: "Start with industry best practices (see table below)", recommended: true },
            { condition: "Existing project?", result: "Measure current baseline, set budget at baseline + 10% headroom" },
            { condition: "Marketing / Landing page?", result: "Strictest budgets: LCP < 2.0s, JS < 150KB", recommended: true },
            { condition: "App / Dashboard page?", result: "Moderate budgets: LCP < 3.0s, JS < 300KB" },
            { condition: "Documentation page?", result: "Static budgets: LCP < 1.5s, JS < 100KB" },
          ]}
        />

        <StatsTable
          title="Recommended Budget Targets by Page Type"
          headers={["Metric", "Marketing Page", "App Dashboard", "Documentation", "E-Commerce PDP"]}
          rows={[
            ["JS Bundle (first load)", "< 150KB", "< 300KB", "< 100KB", "< 200KB"],
            ["Total Page Weight", "< 1MB", "< 2MB", "< 500KB", "< 1.5MB"],
            ["LCP", "< 2.0s", "< 3.0s", "< 1.5s", "< 2.5s"],
            ["INP", "< 100ms", "< 200ms", "< 100ms", "< 150ms"],
            ["CLS", "< 0.05", "< 0.1", "< 0.05", "< 0.1"],
            ["Image Count", "< 10", "< 20", "< 5", "< 15"],
            ["Third-Party Scripts", "< 3", "< 5", "0", "< 4"],
          ]}
        />

        {/* Section 5: Measurement Tools */}
        <SectionHeader number="05" title="Measurement Tools" id="measurement-tools" />

        <ComparisonCards
          leftTitle="Lab Measurement"
          leftItems={[
            "Consistent results",
            "Part of CI/CD pipeline",
            "Catches regressions early",
            "Free (Lighthouse)",
          ]}
          leftType="positive"
          rightTitle="Field Measurement"
          rightItems={[
            "Real user experience data",
            "Diverse devices and networks",
            "Geographic variety",
            "Catches real-world issues",
          ]}
          rightType="positive"
        />

        <InfoBox type="tip">
          Use both. Lab measurement in CI to prevent regressions. Field measurement in production
          to validate that lab results match reality. If they diverge significantly, your lab setup
          does not reflect your actual user base.
        </InfoBox>

        <CodeBlock
          filename="lighthouse-ci.config.js"
          language="javascript"
          code={`// .lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000/',           // Homepage
        'http://localhost:3000/services',   // Service page
        'http://localhost:3000/dashboard',  // App dashboard
      ],
      numberOfRuns: 3, // Run 3 times, use median
      startServerCommand: 'npm run start',
      startServerReadyPattern: 'ready on',
    },
    assert: {
      assertions: {
        // Core Web Vitals
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'interactive': ['error', { maxNumericValue: 3800 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],

        // Bundle size
        'total-byte-weight': ['warning', { maxNumericValue: 1000000 }],
        'mainthread-work-breakdown': ['warning', { maxNumericValue: 4000 }],

        // Best practices
        'uses-responsive-images': 'warn',
        'uses-optimized-images': 'warn',
        'uses-text-compression': 'error',
        'render-blocking-resources': 'warn',
      },
    },
    upload: {
      target: 'temporary-public-storage', // Free, 7-day retention
    },
  },
}`}
        />

        {/* Section 6: Enforcing Budgets in CI */}
        <SectionHeader number="06" title="Enforcing Budgets in CI" id="enforcement" />

        <p className="text-muted-foreground mb-6 leading-relaxed">
          A budget that is not enforced is a suggestion. Integrate performance checks into your
          CI pipeline so that budget violations block deployment. This makes performance a first-class
          concern alongside tests and type checking.
        </p>

        <StepFlow
          steps={[
            { title: "Build", description: "Next.js production build" },
            { title: "Serve", description: "Start production server" },
            { title: "Audit", description: "Run Lighthouse CI" },
            { title: "Assert", description: "Check against budgets" },
            { title: "Report", description: "Comment on PR" },
          ]}
        />

        <CodeBlock
          filename=".github/workflows/performance.yml"
          language="yaml"
          code={`name: Performance Budget Check

on:
  pull_request:
    branches: [main]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - run: npm ci
      - run: npm run build

      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v11
        with:
          configPath: './.lighthouserc.js'
          uploadArtifacts: true
          temporaryPublicStorage: true

      - name: Budget Check Results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: lighthouse-results
          path: .lighthouseci/`}
        />

        <BeforeAfterComparison
          title="CI Integration Impact"
          before={{
            label: "Without Budget Enforcement",
            items: [
              "Bundle grows 5-10KB per sprint unnoticed",
              "LCP regresses gradually over months",
              "Performance issues found by users in production",
              "No accountability for performance impact",
              "Reactive fixes after damage is done",
            ],
          }}
          after={{
            label: "With Budget Enforcement",
            items: [
              "Every PR shows exact bundle size impact",
              "LCP regressions caught before merge",
              "Performance issues blocked at CI gate",
              "Developers consider performance during development",
              "Proactive optimisation built into workflow",
            ],
          }}
        />

        {/* Section 7: Next.js Specific Optimisations */}
        <SectionHeader number="07" title="Next.js Performance Optimisations" id="nextjs-optimisations" />

        <p className="text-muted-foreground mb-6 leading-relaxed">
          Next.js provides built-in performance features, but they require correct configuration.
          Here are the high-impact optimisations that directly affect budget metrics.
        </p>

        <FeatureGrid
          columns={2}
          features={[
            {
              title: "Image Optimisation",
              description: "next/image automatically serves WebP/AVIF, resizes per viewport, and lazy-loads below the fold. Use the priority prop on LCP images to preload them.",
              items: [
                "Use next/image for all images",
                "Set priority on hero/LCP images",
                "Provide width and height to prevent CLS",
                "Use sizes prop for responsive images",
              ],
            },
            {
              title: "Font Optimisation",
              description: "next/font eliminates layout shift from font loading by using CSS size-adjust. Fonts are self-hosted at build time, eliminating external network requests.",
              items: [
                "Use next/font/google or next/font/local",
                "Never load fonts from external CDNs",
                "Use display: swap for text visibility",
                "Subset fonts to required characters",
              ],
            },
            {
              title: "Bundle Analysis",
              description: "Use @next/bundle-analyzer to visualise what code ships to the client. Identify oversized dependencies and find tree-shaking opportunities.",
              items: [
                "Run: ANALYZE=true next build",
                "Check for duplicate dependencies",
                "Verify tree-shaking works for large libs",
                "Use dynamic imports for heavy components",
              ],
            },
            {
              title: "Rendering Strategy",
              description: "Choose the right rendering per route. SSG for static content (zero server cost), ISR for semi-dynamic (cached), SSR for personalised (fresh per request).",
              items: [
                "SSG for docs, marketing, blog",
                "ISR for product pages, listings",
                "SSR for dashboards, personalised content",
                "Client-side for real-time features only",
              ],
            },
          ]}
        />

        <CodeBlock
          filename="next.config.mjs"
          language="javascript"
          code={`// Performance-focused Next.js configuration
const nextConfig = {
  // Enable React Compiler for automatic optimisations
  reactCompiler: true,

  // Image optimisation
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },

  // Headers for caching
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },

  // Bundle analysis (enable with ANALYZE=true)
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config) => {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
      config.plugins.push(
        new BundleAnalyzerPlugin({ analyzerMode: 'static' })
      )
      return config
    },
  }),
}`}
        />

        {/* Section 8: Ongoing Monitoring */}
        <SectionHeader number="08" title="Ongoing Monitoring" id="monitoring" />

        <p className="text-muted-foreground mb-6 leading-relaxed">
          Budgets in CI catch regressions before they ship. Monitoring in production catches issues
          that lab testing misses: slow networks, old devices, geographic latency, and third-party
          script performance. Both are necessary.
        </p>

        <VerticalFlow
          title="Monitoring Implementation Stages"
          steps={[
            {
              title: "Stage 1: CI Budget Gates",
              description: "Lighthouse CI runs on every PR. Budget violations block merge. This is your first line of defence and catches 80% of regressions.",
            },
            {
              title: "Stage 2: Synthetic Monitoring",
              description: "Scheduled Lighthouse runs against production (daily or hourly). Catches regressions from config changes, CDN issues, and third-party script updates that CI cannot detect.",
            },
            {
              title: "Stage 3: Real User Monitoring (RUM)",
              description: "Collect Core Web Vitals from actual users via the web-vitals library or Vercel Analytics. Segmented by device, geography, and connection type. The ground truth.",
            },
            {
              title: "Stage 4: Alerting & Dashboards",
              description: "Set threshold alerts on field metrics. If p75 LCP exceeds 3s for 24 hours, trigger an alert. Build dashboards showing trends over time by route and device class.",
            },
          ]}
        />

        <CodeBlock
          filename="lib/analytics/web-vitals.ts"
          language="typescript"
          code={`// Report Core Web Vitals from real users
import { onCLS, onINP, onLCP, onFCP, onTTFB } from 'web-vitals'

type MetricName = 'CLS' | 'INP' | 'LCP' | 'FCP' | 'TTFB'

interface VitalMetric {
  name: MetricName
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  navigationType: string
}

function sendToAnalytics(metric: VitalMetric) {
  // Send to your analytics endpoint
  fetch('/api/vitals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: metric.name,
      value: Math.round(metric.value),
      rating: metric.rating,
      path: window.location.pathname,
      userAgent: navigator.userAgent,
      connection: (navigator as any).connection?.effectiveType,
      timestamp: Date.now(),
    }),
    // Use keepalive to ensure the request completes
    // even if the page is being unloaded
    keepalive: true,
  })
}

// Register all vital observers
export function initWebVitals() {
  onCLS((metric) => sendToAnalytics(metric as VitalMetric))
  onINP((metric) => sendToAnalytics(metric as VitalMetric))
  onLCP((metric) => sendToAnalytics(metric as VitalMetric))
  onFCP((metric) => sendToAnalytics(metric as VitalMetric))
  onTTFB((metric) => sendToAnalytics(metric as VitalMetric))
}`}
        />

        {/* Key Takeaway */}
        <SectionHeader number="09" title="Key Takeaway" id="key-takeaway" />

        <KeyTakeaway>
          Performance budgets transform performance from a vague aspiration into an engineering
          constraint with clear thresholds, automated enforcement, and measurable outcomes. Start
          with three metrics (LCP, CLS, JS bundle size), enforce them in CI, and expand from there.
          The budget itself is less important than the process it creates -- forcing developers to
          consider performance impact before code is merged, not after users complain.
        </KeyTakeaway>

        <RelatedArticles
          articles={[
            {
              title: "Choosing the Right Rendering Strategy",
              href: "/dashboard/content-library/articles/architecture/choosing-rendering-strategy-per-page",
            },
            {
              title: "CI/CD & Deployment Pipelines",
              href: "/dashboard/content-library/articles/architecture/cicd-deployment-pipelines",
            },
            {
              title: "ROI of Modern Web Architecture",
              href: "/dashboard/content-library/articles/business/roi-modern-web-architecture",
            },
          ]}
        />
      </div>

      <aside className="hidden xl:block w-64 flex-shrink-0">
        <TableOfContents items={tocItems} />
      </aside>
    </div>
  )
}
