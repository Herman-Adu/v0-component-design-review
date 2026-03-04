# Batch C + Global Infrastructure — Architecture Overview

## System Architecture

### Data Flow: From Strapi to UI

```
┌─────────────────────────────────────────────────────────────────┐
│                         STRAPI (CMS)                             │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Collections:                                              │  │
│  │  - Articles (with categories, relations)                 │  │
│  │  - Case Studies (with client data, testimonials)         │  │
│  │  - Guides (with sections, prerequisites)                 │  │
│  │  - Tutorials (with steps, resources)                     │  │
│  │                                                           │  │
│  │ Single Types:                                             │  │
│  │  - GlobalSettings (branding, templates, SEO, etc)        │  │
│  │  - EmailAdminConfig (SLA, A/B testing, urgency rules)   │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                  Mock JSON (Development)                         │
│  /data/strapi-mock/                                              │
│  ├── global/settings.json                                        │
│  ├── email-administration/configuration.json                    │
│  ├── dashboard/articles/[category]/[slug].json                  │
│  ├── dashboard/case-studies/[category]/[slug].json              │
│  ├── dashboard/guides/[category]/[slug].json                    │
│  └── dashboard/tutorials/[category]/[slug].json                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   TypeScript Types Layer                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ types/global-settings.ts                                │   │
│  │  - GlobalSettings (interface)                           │   │
│  │  - BrandingConfig, EmailTemplateConfig, SEOConfig      │   │
│  │  - ContactFormConfig, SocialLinksConfig                │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ types/dashboard.ts                                      │   │
│  │  - ArticleDetailContent, CaseStudyDetailContent        │   │
│  │  - GuideDetailContent, TutorialDetailContent           │   │
│  │  - RelatedContent (for relations)                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ types/email-admin.ts                                    │   │
│  │  - EmailAdminConfig, SLASettings, SubjectLineConfig    │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ types/table.ts (NEW)                                    │   │
│  │  - DataTableProps<T> (generic)                          │   │
│  │  - ColumnDef<T>, FilterState, SortingState             │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      Adapter Layer                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Page Components (import JSON + assert type)              │  │
│  │                                                          │  │
│  │ import articleData from "@/data/strapi-mock/..."         │  │
│  │ import type { ArticleDetailContent } from "@/types"     │  │
│  │                                                          │  │
│  │ const article = articleData as ArticleDetailContent     │  │
│  │                                                          │  │
│  │ export default function Page({ params }) {              │  │
│  │   // Validate params against metadata                   │  │
│  │   // Destructure article data                           │  │
│  │   return <ArticleDetail article={article} />            │  │
│  │ }                                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Component Layer                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Article / Case Study / Guide / Tutorial Detail Pages   │   │
│  │ - ArticleDetail (render article.title, article.content) │   │
│  │ - CaseStudyDetail (render challenge, solution, results) │   │
│  │ - GuideDetail (render sections, prerequisites)         │   │
│  │ - TutorialDetail (render steps, tools, resources)       │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Generic Data Table Component (NEW)                      │   │
│  │ - DataTable<T> (accepts any data + column defs)        │   │
│  │ - Used by: Email Jobs, Analytics, Financial Dashboard  │   │
│  │ - Features: Sorting, Filtering, Pagination, Selection  │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Global Components (using GlobalSettings)                │   │
│  │ - Footer (uses settings.socialLinks)                    │   │
│  │ - EmailTemplateCard (uses settings.emailTemplates)      │   │
│  │ - BrandingSection (uses settings.branding)              │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                       UI Rendered                                │
│  - Detail pages with related content links                       │
│  - Data tables with filtering/sorting/pagination                │
│  - Consistent branding across all pages                          │
│  - Dynamic email templates based on global settings              │
└─────────────────────────────────────────────────────────────────┘
```

---

## File Structure

### Before (Current)

```
components/
  admin/
    jobs/
      jobs-data-table.tsx      ← Email-specific, 700 lines

data/strapi-mock/
  email-administration/
    overview.json              ← Email dashboard overview
    configuration/             ← Scattered config files
      template-and-brand.json
      ab-subject-lines.json
      email-preview.json
    infrastructure/
      send-configuration.json

app/(dashboard)/dashboard/
  admin/
    email-administration/
      configuration/           ← Multiple pages, hardcoded data
      infrastructure/
      request-management/
```

### After (Proposed)

```
components/
  ui/
    generic-data-table.tsx     ← Reusable for all data types

  admin/
    email/
      email-jobs-table.tsx     ← Email-specific wrapper
    analytics/
      analytics-table.tsx      ← Analytics wrapper (future)
    financial/
      financial-table.tsx      ← Financial wrapper (future)

  global/
    footer.tsx                 ← Uses global settings
    newsletter-signup.tsx
    brand-section.tsx

data/
  strapi-mock/
    global/
      settings.json            ← Single source of truth

    email-administration/
      configuration.json       ← References global settings
      overview.json

    dashboard/
      articles/
        [category]/
          [slug].json          ← Detail pages (Batch C)
      case-studies/
        [category]/
          [slug].json
      guides/
        [category]/
          [slug].json
      tutorials/
        [category]/
          [slug].json

types/
  global-settings.ts           ← GlobalSettings interface
  dashboard.ts                 ← Detail page types
  email-admin.ts               ← Email config types
  table.ts                     ← DataTable<T> types (new)

lib/
  table-columns/
    factories.ts               ← Column definition factories
    email-jobs.ts              ← Email table columns
    analytics.ts               ← Analytics columns (future)
    financial.ts               ← Financial columns (future)
```

---

## Type Inheritance & Relations

### Global Settings Type

```typescript
GlobalSettings
├── BrandingConfig
│   └── Used by: Footer, Navigation, Email templates
├── EmailTemplateConfig[]
│   └── Used by: Email configuration page, Contact handler, Email dashboard
├── SEOConfig
│   └── Used by: Metadata generation, Open Graph tags
├── ContactFormConfig
│   └── Used by: Contact form handler, Validation
├── SocialLinksConfig
│   └── Used by: Footer, Social sharing
└── AnalyticsConfig
    └── Used by: Tracking scripts, Privacy settings (future)
```

### Article Detail Content Type

```typescript
ArticleDetailContent
├── article.title            → <h1/>
├── article.author           → <Author/>
├── article.date             → <PublishedDate/>
├── article.readTime         → <ReadingTime/>
├── article.category         → <Breadcrumb/>
├── article.excerpt          → <meta name="description"/>
├── article.content          → <ArticleBody/> (markdown)
├── article.tags             → <TagList/>
└── article.relatedArticles[] → <RelatedArticles/>
    ├── slug                  → Dynamic link
    ├── title
    └── category
```

### Data Table Type (Generic)

```typescript
DataTableProps<T>
├── data: T[]                 → Rows to display
├── columns: ColumnDef<T>[]   → Column definitions
├── enableSelection?: boolean → Checkbox column
├── enableFiltering?: boolean → Search box
├── enableSorting?: boolean   → Header sort icons
├── pageSize?: number         → Items per page
└── onSelectionChange?: (rows: T[]) => void  → Selection handler
```

---

## Batch C Page Implementation Pattern

### Step 1: Create Mock Data

```
data/strapi-mock/dashboard/articles/
  ├── metadata.json            ← Category → slug[] mapping
  ├── technology/
  │   ├── intro-to-react.json
  │   ├── advanced-typescript.json
  │   └── ...
  └── business/
      ├── digital-transformation.json
      └── ...
```

### Step 2: Create TypeScript Types

```typescript
// types/dashboard.ts
export interface ArticleDetailContent {
  article: {
    slug: string;
    title: string;
    category: string;
    author: string;
    date: string;
    readTime: number;
    excerpt: string;
    content: string;
    tags: string[];
    relatedArticles: RelatedContent[];
  };
}

export interface RelatedContent {
  slug: string;
  title: string;
  category: string;
}
```

### Step 3: Implement Page Component

```typescript
// app/(dashboard)/dashboard/content-library/articles/[category]/[slug]/page.tsx

import { notFound } from "next/navigation"
import metadata from "@/data/strapi-mock/dashboard/articles/metadata.json"
import articleData from "@/data/strapi-mock/dashboard/articles/[DYNAMIC]/[SLUG].json"
import type { ArticleDetailContent } from "@/types/dashboard"
import { ArticleDetail } from "@/components/content-library/article-detail"

interface Params {
  category: string
  slug: string
}

export async function generateStaticParams(): Promise<Params[]> {
  // Get all [category]/[slug] combinations
  return Object.entries(metadata.categories).flatMap(([category, data]) =>
    data.slugs.map(slug => ({ category, slug }))
  )
}

export default function ArticleDetailPage({
  params: { category, slug },
}: {
  params: Params
}) {
  // Validate category/slug exists
  if (!validateCategorySlug(metadata, category, slug)) {
    notFound()
  }

  const article = articleData as ArticleDetailContent

  return <ArticleDetail article={article} />
}
```

### Step 4: Validate Relations

```typescript
// lib/validation/relations.ts

export function validateCategorySlug(
  metadata: ArticleMetadata,
  category: string,
  slug: string,
): boolean {
  const cat = metadata.categories[category];
  return cat ? cat.slugs.includes(slug) : false;
}

export function validateRelatedContent(
  related: RelatedContent[],
  metadata: ArticleMetadata,
): RelatedContent[] {
  return related.filter((item) =>
    validateCategorySlug(metadata, item.category, item.slug),
  );
}
```

---

## Global Settings Usage Examples

### 1. Email Configuration Page

```typescript
import globalSettings from "@/data/strapi-mock/global/settings.json"
import type { GlobalSettings } from "@/types/global-settings"

const settings = globalSettings as GlobalSettings

export default function EmailConfigPage() {
  return (
    <div>
      {/* Display email templates from global settings */}
      {settings.emailTemplates.map(template => (
        <div key={template.id}>
          <h3>{template.name}</h3>
          <p>From: {template.fromEmail}</p>
          <p>Subject: {template.subject}</p>
        </div>
      ))}

      {/* Display branding settings */}
      <section>
        <h2>Branding</h2>
        <img src={settings.branding.companyLogo} />
        <p>{settings.branding.companyName}</p>
      </section>
    </div>
  )
}
```

### 2. Contact Form Handler

```typescript
import globalSettings from "@/data/strapi-mock/global/settings.json";
import type { GlobalSettings } from "@/types/global-settings";

const settings = globalSettings as GlobalSettings;

export async function submitContactForm(data: ContactData) {
  const config = settings.contactForm;
  const template = settings.emailTemplates.find(
    (t) => t.slug === "contact-confirmation",
  );

  // Send confirmation to user
  await sendEmail({
    to: data.email,
    from: settings.branding.supportEmail,
    subject: template?.subject || "We received your message",
    html: template?.template || "",
  });

  // Send notification to support team
  await sendEmail({
    to: config.recipients,
    from: settings.branding.supportEmail,
    subject: `New contact form submission from ${data.name}`,
    html: `<p>${data.message}</p>`,
  });

  return { success: true, message: config.successMessage };
}
```

### 3. Footer Component

```typescript
import globalSettings from "@/data/strapi-mock/global/settings.json"
import type { GlobalSettings } from "@/types/global-settings"

const settings = globalSettings as GlobalSettings

export function Footer() {
  return (
    <footer>
      <div>
        <img src={settings.branding.companyLogo} />
        <p>{settings.branding.supportEmail}</p>
      </div>

      <div className="flex gap-4">
        {settings.socialLinks.facebook && (
          <a href={settings.socialLinks.facebook}>Facebook</a>
        )}
        {settings.socialLinks.twitter && (
          <a href={settings.socialLinks.twitter}>Twitter</a>
        )}
        {settings.socialLinks.linkedin && (
          <a href={settings.socialLinks.linkedin}>LinkedIn</a>
        )}
      </div>

      <div>
        <h3>Legal</h3>
        <a href={`/${settings.legalPages.privacyPolicy.slug}`}>Privacy</a>
        <a href={`/${settings.legalPages.termsOfService.slug}`}>Terms</a>
      </div>
    </footer>
  )
}
```

### 4. Dynamic SEO Metadata

```typescript
import globalSettings from "@/data/strapi-mock/global/settings.json";
import type { GlobalSettings, Metadata } from "@/types";

const settings = globalSettings as GlobalSettings;

export const metadata: Metadata = {
  title: settings.seoDefaults.siteTitle,
  description: settings.seoDefaults.siteDescription,
  keywords: settings.seoDefaults.defaultMetaKeywords,
  openGraph: {
    title: settings.seoDefaults.siteTitle,
    description: settings.seoDefaults.siteDescription,
    images: [settings.seoDefaults.openGraphImage],
  },
  twitter: {
    creator: settings.seoDefaults.twitterHandle,
    card: "summary_large_image",
  },
};
```

---

## Data Table Reusability Examples

### Email Jobs Table

```typescript
// components/admin/email/email-jobs-table.tsx
import { DataTable } from "@/components/ui/generic-data-table"
import { createEmailJobColumns } from "@/lib/table-columns/email-jobs"
import type { Job } from "@/lib/email/services/job-management.types"

export function EmailJobsTable({
  data,
  onStatusChange,
  onAssign,
}: EmailJobsTableProps) {
  const columns = createEmailJobColumns({ onStatusChange, onAssign })

  return (
    <DataTable<Job>
      data={data}
      columns={columns}
      enableSelection
      enableFiltering
      enableSorting
      pageSize={10}
    />
  )
}
```

### Analytics Table (Future)

```typescript
// components/admin/analytics/analytics-table.tsx
import { DataTable } from "@/components/ui/generic-data-table"
import { createAnalyticsColumns } from "@/lib/table-columns/analytics"
import type { AnalyticsRow } from "@/types/analytics"

export function AnalyticsDataTable({ data, dateRange }: AnalyticsTableProps) {
  const columns = createAnalyticsColumns({ dateRange })

  return (
    <DataTable<AnalyticsRow>
      data={data}
      columns={columns}
      enableSorting
      enableFiltering
      pageSize={25}
    />
  )
}
```

### Financial Dashboard Table (Future)

```typescript
// components/admin/financial/financial-table.tsx
import { DataTable } from "@/components/ui/generic-data-table"
import { createFinancialColumns } from "@/lib/table-columns/financial"
import type { TransactionRow } from "@/types/financial"

export function FinancialDataTable({
  data,
  currency,
}: FinancialTableProps) {
  const columns = createFinancialColumns({ currency })

  return (
    <DataTable<TransactionRow>
      data={data}
      columns={columns}
      enableSorting
      enableFiltering
      pageSize={50}
    />
  )
}
```

---

## Validation Checklist

### TypeScript Validation

- [ ] All types properly imported
- [ ] No `any` types used
- [ ] Generic `<T>` properly constrained
- [ ] Interface extensions correct
- [ ] Union types correctly defined

### Build Validation

- [ ] `pnpm exec tsc --noEmit` returns 0 errors
- [ ] `pnpm run build` generates 160/160 pages
- [ ] No TypeScript errors in build output
- [ ] Static params generation complete

### Runtime Validation

- [ ] Mock files load without errors
- [ ] Type assertions succeed
- [ ] Relations resolve correctly
- [ ] Navigation between detail pages works
- [ ] Metadata generation succeeds

---

**Next:** Start implementation with Batch C Phase 1 (Create mock files)
