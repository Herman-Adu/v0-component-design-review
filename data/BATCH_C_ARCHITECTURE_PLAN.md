# BATCH C: Complex Dynamic Pages + Global Infrastructure

**Date:** 2026-02-25  
**Status:** Planning Complete - Ready for Implementation  
**Owner:** Senior Architecture Discipline

---

## Part 1: Batch C — Complex Dynamic Pages

### Overview

**Scope:** 4 content library detail page groups with dynamic routes  
**Risk Level:** HIGH (Relations validation, SEO, complex data structures)  
**Estimated Time:** 8-12 hours  
**Pattern Foundation:** Extends Batch A/B adapter pattern with relation resolution

### Pages to Migrate

#### 1. Articles Detail Pages

**Route:** `/dashboard/content-library/articles/[category]/[slug]/page.tsx`

**Data Structure:**

```json
{
  "article": {
    "slug": "string",
    "title": "string",
    "category": "string",
    "author": "string",
    "date": "ISO-8601",
    "readTime": "number (minutes)",
    "excerpt": "string",
    "content": "markdown",
    "tags": ["string"],
    "relatedArticles": [
      {
        "slug": "string",
        "title": "string",
        "category": "string"
      }
    ]
  }
}
```

**Type Definition Location:** `types/dashboard.ts` → `ArticleDetailContent`

**Mock Files Required:**

- `data/strapi-mock/dashboard/articles/[category]/[slug].json` (templates for each category)
- `data/strapi-mock/dashboard/articles-metadata.json` (category->slug mapping)

---

#### 2. Case Studies Detail Pages

**Route:** `/dashboard/content-library/case-studies/[category]/[slug]/page.tsx`

**Data Structure:**

```json
{
  "caseStudy": {
    "slug": "string",
    "title": "string",
    "category": "string",
    "client": "string",
    "industry": "string",
    "challenge": "string",
    "solution": "string",
    "results": {
      "metric": "string",
      "value": "string",
      "icon": "DashboardIconName"
    },
    "testimonial": {
      "quote": "string",
      "author": "string",
      "role": "string"
    },
    "tags": ["string"],
    "relatedCaseStudies": [
      {
        "slug": "string",
        "title": "string",
        "category": "string"
      }
    ]
  }
}
```

**Type Definition Location:** `types/dashboard.ts` → `CaseStudyDetailContent`

**Mock Files Required:**

- `data/strapi-mock/dashboard/case-studies/[category]/[slug].json`
- `data/strapi-mock/dashboard/case-studies-metadata.json`

---

#### 3. Guides Detail Pages

**Route:** `/dashboard/content-library/guides/[category]/[slug]/page.tsx`

**Data Structure:**

```json
{
  "guide": {
    "slug": "string",
    "title": "string",
    "category": "string",
    "difficulty": "beginner|intermediate|advanced",
    "duration": "string (e.g., '30 minutes')",
    "sections": [
      {
        "title": "string",
        "content": "markdown",
        "subsections": [
          {
            "title": "string",
            "content": "markdown"
          }
        ]
      }
    ],
    "prerequisites": ["string"],
    "keyTakeaways": ["string"],
    "relatedGuides": [
      {
        "slug": "string",
        "title": "string",
        "category": "string"
      }
    ]
  }
}
```

**Type Definition Location:** `types/dashboard.ts` → `GuideDetailContent`

**Mock Files Required:**

- `data/strapi-mock/dashboard/guides/[category]/[slug].json`
- `data/strapi-mock/dashboard/guides-metadata.json`

---

#### 4. Tutorials Detail Pages

**Route:** `/dashboard/content-library/tutorials/[category]/[slug]/page.tsx`

**Data Structure:**

```json
{
  "tutorial": {
    "slug": "string",
    "title": "string",
    "category": "string",
    "level": "beginner|intermediate|advanced",
    "duration": "number (minutes)",
    "steps": [
      {
        "number": "number",
        "title": "string",
        "description": "string",
        "code": "string (optional)",
        "notes": ["string"]
      }
    ],
    "tools": ["string"],
    "outcomes": ["string"],
    "downloadResources": [
      {
        "name": "string",
        "url": "string"
      }
    ],
    "relatedTutorials": [
      {
        "slug": "string",
        "title": "string",
        "category": "string"
      }
    ]
  }
}
```

**Type Definition Location:** `types/dashboard.ts` → `TutorialDetailContent`

**Mock Files Required:**

- `data/strapi-mock/dashboard/tutorials/[category]/[slug].json`
- `data/strapi-mock/dashboard/tutorials-metadata.json`

---

### Implementation Pattern for Batch C

#### Step 1: Create Metadata and Detail Mock Files

For each content type, create:

1. **Metadata file** (maps category + slugs)
   - Location: `data/strapi-mock/dashboard/{type}-metadata.json`
   - Structure: `{ categories: { [category]: { slugs: [slug1, slug2...] } } }`

2. **Detail files** (one per [category]/[slug] combination)
   - Location: `data/strapi-mock/dashboard/{type}/[category]/[slug].json`
   - Structure: Full content object with relations

#### Step 2: Extend Types

**File:** `types/dashboard.ts`

Add interfaces for each detail page:

```typescript
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

// Similar for CaseStudyDetailContent, GuideDetailContent, TutorialDetailContent
```

#### Step 3: Update Page Components

**Pattern for `[category]/[slug]/page.tsx`:**

```typescript
import type { PageProps } from "@/types/next"
import { notFound } from "next/navigation"
import articleData from "@/data/strapi-mock/dashboard/articles/[DYNAMIC]/[SLUG].json"
import type { ArticleDetailContent } from "@/types/dashboard"

interface ArticleDetailPageProps extends PageProps {
  params: {
    category: string
    slug: string
  }
}

export default function ArticleDetailPage({
  params,
}: ArticleDetailPageProps) {
  // Validate category/slug exists in metadata
  // If not found, call notFound()

  const article = articleData as ArticleDetailContent

  return (
    <article className="container mx-auto py-8">
      <h1>{article.article.title}</h1>
      {/* Render article content */}
    </article>
  )
}

export async function generateStaticParams() {
  // Return all [category]/[slug] combinations from metadata
  return []
}
```

#### Step 4: Validate Relations

Implement validation helpers:

```typescript
// lib/validation/relations.ts

export function validateCategorySlug(
  metadata: CategorySlugMetadata,
  category: string,
  slug: string,
): boolean {
  const categoryData = metadata.categories[category];
  if (!categoryData) return false;
  return categoryData.slugs.includes(slug);
}

export function getRelatedContent(
  related: RelatedContent[],
  metadata: CategorySlugMetadata,
): RelatedContent[] {
  return related.filter((item) =>
    validateCategorySlug(metadata, item.category, item.slug),
  );
}
```

#### Step 5: Build & Validate

- Generate static params for all category/slug combinations
- Validate 0 TypeScript errors
- Validate all 160 pages build successfully
- Smoke test detail page navigation

---

## Part 2: Global Data Table Architecture

### Current State

- **Location:** `components/admin/jobs/jobs-data-table.tsx`
- **Status:** Email-specific implementation (700 lines)
- **Problem:** Hardcoded for Job type, not reusable for other domains

### Future Vision

- **Globally Accessible:** Works for any data type (jobs, users, analytics, finances, etc.)
- **Generic:** `<DataTable<T> data={rows} columns={cols} />`
- **Extensible:** Supports filtering, sorting, pagination, selection, actions
- **Type-Safe:** Full TypeScript generics with column type inference

### Architecture Plan

#### 1. Extract Generic DataTable Component

**Location:** `components/ui/generic-data-table.tsx`

**Responsibilities:**

- Render table structure (thead, tbody, tfooter)
- Handle sorting, filtering, pagination, selection
- Use TanStack Table (react-table) for logic
- Zero UI opinions (extensible via column defs)

**API:**

```typescript
interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  enableSelection?: boolean;
  enableFiltering?: boolean;
  enableSorting?: boolean;
  pageSize?: number;
  onSelectionChange?: (rows: T[]) => void;
}

export function DataTable<T>({ data, columns, ...props }: DataTableProps<T>) {
  // Generic implementation
}
```

#### 2. Create Domain-Specific Wrappers

**For Email Jobs:** `components/admin/email/email-jobs-table.tsx`

```typescript
export function EmailJobsTable({ data, onStatusChange, onAssign }: EmailJobsTableProps) {
  const columns = createEmailJobColumns({ onStatusChange, onAssign })
  return <DataTable data={data} columns={columns} enableSelection enableFiltering />
}
```

**For Analytics:** `components/admin/analytics/analytics-data-table.tsx`

```typescript
export function AnalyticsDataTable({ data, onRowClick }: AnalyticsTableProps) {
  const columns = createAnalyticsColumns({ onRowClick })
  return <DataTable data={data} columns={columns} />
}
```

**For Financial Dashboard:** `components/admin/financial/financial-table.tsx`

```typescript
export function FinancialDataTable({ data, currencies }: FinancialTableProps) {
  const columns = createFinancialColumns({ currencies })
  return <DataTable data={data} columns={columns} enableSorting />
}
```

#### 3. Column Definition Factory Pattern

**Location:** `lib/table-columns/factories.ts`

```typescript
// Jobs columns factory
export function createEmailJobColumns(handlers: EmailJobColumnHandlers): ColumnDef<Job>[] {
  return [
    {
      id: "select",
      header: ({ table }) => <Checkbox {...} />,
      cell: ({ row }) => <Checkbox {...} />,
    },
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <span>{row.original.id}</span>,
    },
    // ... more columns
  ]
}

// Analytics columns factory
export function createAnalyticsColumns(handlers: AnalyticsColumnHandlers): ColumnDef<AnalyticsRow>[] {
  return [
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => formatDate(row.original.date),
    },
    // ... more columns
  ]
}
```

---

## Part 3: Global Configuration & Settings Data Model

### Problem Statement

- Email configuration scattered across multiple files
- No single source of truth for templates, branding, SEO
- Duplicated settings for email, contact forms, landing pages
- No unified approach to managing global app settings

### Solution: Global Settings Entity

**Strapi Entity Model:**

```typescript
// types/global-settings.ts

export interface GlobalSettings {
  id: string;
  branding: BrandingConfig;
  emailTemplates: EmailTemplateConfig[];
  seoDefaults: SEOConfig;
  contactForm: ContactFormConfig;
  templates: EmailTemplate[];
  socialLinks: SocialLinksConfig;
  analyticsTracking: AnalyticsConfig;
  legalPages: LegalPagesConfig;
  createdAt: string;
  updatedAt: string;
}

export interface BrandingConfig {
  companyName: string;
  companyLogo: string;
  colorPrimary: string;
  colorSecondary: string;
  fontFamily: string;
  supportEmail: string;
  supportPhone: string;
}

export interface EmailTemplateConfig {
  id: string;
  name: string;
  slug: string;
  subject: string;
  fromName: string;
  fromEmail: string;
  replyTo: string;
  template: string; // HTML template
  variables: string[]; // Template variables: [name, email, etc]
}

export interface SEOConfig {
  siteTitle: string;
  siteDescription: string;
  defaultMetaImage: string;
  defaultMetaKeywords: string[];
  twitterHandle: string;
  linkedinPage: string;
  openGraphImage: string;
}

export interface ContactFormConfig {
  enabled: boolean;
  successMessage: string;
  errorMessage: string;
  recipients: string[];
  redirectUrl: string;
  webhookUrl: string; // For integrations
}

export interface SocialLinksConfig {
  facebook: string;
  twitter: string;
  linkedin: string;
  instagram: string;
  github: string;
  youtube: string;
}

export interface AnalyticsConfig {
  googleAnalyticsId: string;
  hotjarId: string;
  mixpanelToken: string;
  enabled: boolean;
}

export interface LegalPagesConfig {
  privacyPolicy: {
    slug: string;
    lastUpdated: string;
  };
  termsOfService: {
    slug: string;
    lastUpdated: string;
  };
  cookiePolicy: {
    slug: string;
    lastUpdated: string;
  };
}
```

### Implementation Structure

#### 1. Mock Data File

**Location:** `data/strapi-mock/global/settings.json`

```json
{
  "id": "global-settings-1",
  "branding": {
    "companyName": "ACME Corp",
    "companyLogo": "/images/logo.svg",
    "colorPrimary": "#3B82F6",
    "colorSecondary": "#10B981",
    "fontFamily": "Inter, sans-serif",
    "supportEmail": "support@acme.com",
    "supportPhone": "+1-800-ACME-NOW"
  },
  "emailTemplates": [
    {
      "id": "welcome-email",
      "name": "Welcome Email",
      "slug": "welcome",
      "subject": "Welcome to {{company}}!",
      "fromName": "ACME Support",
      "fromEmail": "support@acme.com",
      "replyTo": "support@acme.com",
      "template": "<h1>Welcome {{firstName}}!</h1>...",
      "variables": ["firstName", "lastName", "email", "company"]
    },
    {
      "id": "password-reset",
      "name": "Password Reset",
      "slug": "password-reset",
      "subject": "Reset Your Password",
      "fromName": "ACME Security",
      "fromEmail": "security@acme.com",
      "replyTo": "security@acme.com",
      "template": "<h1>Password Reset Request</h1>...",
      "variables": ["resetLink", "expiresIn"]
    },
    {
      "id": "contact-form-confirmation",
      "name": "Contact Form Confirmation",
      "slug": "contact-confirmation",
      "subject": "We received your message",
      "fromName": "ACME Support",
      "fromEmail": "support@acme.com",
      "replyTo": "support@acme.com",
      "template": "<h1>Thank you for contacting us!</h1>...",
      "variables": ["firstName", "ticketNumber"]
    }
  ],
  "seoDefaults": {
    "siteTitle": "ACME Corp — Digital Solutions",
    "siteDescription": "Enterprise-grade digital solutions for modern businesses",
    "defaultMetaImage": "/og-image.png",
    "defaultMetaKeywords": ["digital", "solutions", "enterprise"],
    "twitterHandle": "@acmecorp",
    "linkedinPage": "company/acme-corp",
    "openGraphImage": "/og-image.png"
  },
  "contactForm": {
    "enabled": true,
    "successMessage": "Thank you for your message. We'll be in touch soon!",
    "errorMessage": "There was an error. Please try again.",
    "recipients": ["sales@acme.com", "support@acme.com"],
    "redirectUrl": "/contact/thank-you",
    "webhookUrl": "https://api.acme.com/webhooks/contact-form"
  },
  "socialLinks": {
    "facebook": "https://facebook.com/acmecorp",
    "twitter": "https://twitter.com/acmecorp",
    "linkedin": "https://linkedin.com/company/acme-corp",
    "instagram": "https://instagram.com/acmecorp",
    "github": "https://github.com/acmecorp",
    "youtube": "https://youtube.com/@acmecorp"
  },
  "analyticsTracking": {
    "googleAnalyticsId": "GA-123456789",
    "hotjarId": "HJ-123456",
    "mixpanelToken": "MP-abc123xyz",
    "enabled": true
  },
  "legalPages": {
    "privacyPolicy": {
      "slug": "privacy-policy",
      "lastUpdated": "2025-01-15T00:00:00Z"
    },
    "termsOfService": {
      "slug": "terms-of-service",
      "lastUpdated": "2025-01-10T00:00:00Z"
    },
    "cookiePolicy": {
      "slug": "cookie-policy",
      "lastUpdated": "2025-01-20T00:00:00Z"
    }
  },
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-02-25T00:00:00Z"
}
```

#### 2. Usage Patterns

**In Email Configuration Pages:**

```typescript
// app/(dashboard)/dashboard/admin/email-administration/configuration/page.tsx

import globalSettings from "@/data/strapi-mock/global/settings.json"
import type { GlobalSettings } from "@/types/global-settings"

const settings = globalSettings as GlobalSettings

export default function EmailConfigurationPage() {
  return (
    <div>
      {/* Use settings.emailTemplates for email config */}
      {settings.emailTemplates.map(template => (
        <EmailTemplateCard key={template.id} template={template} />
      ))}

      {/* Use settings.branding for brand settings */}
      <BrandingSection branding={settings.branding} />
    </div>
  )
}
```

**In Contact Form Handler:**

```typescript
// lib/email/send-contact-form.ts

import globalSettings from "@/data/strapi-mock/global/settings.json";
import type { GlobalSettings } from "@/types/global-settings";

const settings = globalSettings as GlobalSettings;

export async function sendContactFormEmail(formData: ContactFormData) {
  const config = settings.contactForm;
  const template = settings.emailTemplates.find(
    (t) => t.slug === "contact-confirmation",
  );

  // Use config.recipients, config.successMessage
  // Use template for email content

  return await sendEmail({
    to: formData.email,
    from: settings.branding.supportEmail,
    template: template?.template || "",
    subject: template?.subject || "",
  });
}
```

**In SEO Head Tags:**

```typescript
// app/layout.tsx or metadata generation

import globalSettings from "@/data/strapi-mock/global/settings.json";
import type { GlobalSettings } from "@/types/global-settings";

const settings = globalSettings as GlobalSettings;

export const metadata: Metadata = {
  title: settings.seoDefaults.siteTitle,
  description: settings.seoDefaults.siteDescription,
  openGraph: {
    image: settings.seoDefaults.openGraphImage,
  },
  twitter: {
    creator: settings.seoDefaults.twitterHandle,
  },
};
```

**In Footer/Social Links:**

```typescript
// components/footer.tsx

import globalSettings from "@/data/strapi-mock/global/settings.json"

const settings = globalSettings as GlobalSettings

export function Footer() {
  return (
    <footer>
      <div className="flex gap-4">
        {settings.socialLinks.facebook && (
          <a href={settings.socialLinks.facebook}>Facebook</a>
        )}
        {settings.socialLinks.twitter && (
          <a href={settings.socialLinks.twitter}>Twitter</a>
        )}
        {/* ... */}
      </div>
    </footer>
  )
}
```

---

## Part 4: Email Configuration Data Refactoring

### Current Structure Problem

```
data/strapi-mock/email-administration/
├── configuration/          # Multiple config files
├── infrastructure/         # API keys, send config
├── request-management/     # Job queue data
└── overview/              # Email dashboard overview
```

### Proposed Structure (Single Source of Truth)

```
data/strapi-mock/
├── global/
│   ├── settings.json                      # ← ALL global config (email templates, branding, SEO, etc)
│   └── email-configuration.json           # ← Email-specific settings (templates, SLA, urgency rules)
│
├── email-administration/
│   ├── overview.json                      # ← Dashboard overview (stats, quick links)
│   ├── request-management/
│   │   └── jobs.json                      # ← Job data for data table
│   └── infrastructure/
│       ├── send-configuration.json        # ← API keys, from-addresses (references global.settings)
│       └── webhook-config.json            # ← Webhook URLs (references global.settings)
```

### Email-Specific Configuration Type

**Location:** `types/email-admin.ts`

```typescript
export interface EmailAdminConfig {
  id: string;
  // Template Settings
  templates: {
    count: number;
    categories: Array<{
      name: string;
      description: string;
      icon: DashboardIconName;
      templates: Array<{
        id: string;
        name: string;
        slug: string;
      }>;
    }>;
  };

  // Brand & Visual Settings
  branding: {
    companyName: string;
    logoUrl: string;
    primaryColor: string;
    secondaryColor: string;
    footerText: string;
  };

  // SLA & Urgency Rules
  slaSettings: {
    urgent: { maxResponseTime: number }; // minutes
    high: { maxResponseTime: number };
    normal: { maxResponseTime: number };
    low: { maxResponseTime: number };
  };

  // Subject Line A/B Testing
  subjectLines: {
    variants: Array<{
      id: string;
      template: string;
      weight: number;
    }>;
  };

  // API & Infrastructure (references global settings)
  apiConfiguration: {
    sendgridApiKey: string; // or reference to global.settings
    fromAddresses: string[];
    replyToEmail: string;
  };
}
```

### Integration Points

#### 1. Email Template Management

**File:** `app/(dashboard)/dashboard/admin/email-administration/configuration/template-management/page.tsx`

```typescript
import globalSettings from "@/data/strapi-mock/global/settings.json";
import emailConfig from "@/data/strapi-mock/email-administration/configuration.json";
import type { GlobalSettings } from "@/types/global-settings";
import type { EmailAdminConfig } from "@/types/email-admin";

const settings = globalSettings as GlobalSettings;
const config = emailConfig as EmailAdminConfig;

// Use settings.emailTemplates for all template data
// Use config.templates for email-specific template categories
```

#### 2. Send Configuration Page

**File:** `app/(dashboard)/dashboard/admin/email-administration/infrastructure/send-configuration/page.tsx`

```typescript
import globalSettings from "@/data/strapi-mock/global/settings.json";

const settings = globalSettings as GlobalSettings;

// Use settings.branding for company details
// Use settings.emailTemplates[x].fromEmail for sender addresses
// Single source of truth for all email configuration
```

#### 3. A/B Testing Configuration

**File:** `app/(dashboard)/dashboard/admin/email-administration/configuration/ab-testing/page.tsx`

```typescript
import emailConfig from "@/data/strapi-mock/email-administration/configuration.json";
import type { EmailAdminConfig } from "@/types/email-admin";

const config = emailConfig as EmailAdminConfig;

// Use config.subjectLines for A/B variants
// Update weights and variants
```

---

## Part 5: Implementation Timeline

### Phase 1: Global Data Table (Week 1)

- [ ] Extract generic `DataTable<T>` component
- [ ] Create email jobs wrapper component
- [ ] Add generic filtering, sorting, pagination
- [ ] Update email dashboard to use new table
- [ ] Validate zero regressions

### Phase 2: Global Settings Entity (Week 2)

- [ ] Create `types/global-settings.ts` with all interfaces
- [ ] Create `data/strapi-mock/global/settings.json`
- [ ] Update email configuration pages to use global settings
- [ ] Update contact form handler
- [ ] Update footer/social links components

### Phase 3: Email Configuration Refactoring (Week 2-3)

- [ ] Create `types/email-admin.ts`
- [ ] Create `data/strapi-mock/email-administration/configuration.json`
- [ ] Refactor email admin pages to reference global settings
- [ ] Move all hardcoded config to Strapi structure
- [ ] Validate email configuration pages work with new structure

### Phase 4: Analytics & Financial Dashboard Templates (Week 4)

- [ ] Create analytics data table column factories
- [ ] Create financial data table column factories
- [ ] Define analytics data types
- [ ] Define financial data types
- [ ] Prepare for Phase 10 (Analytics/Financial dashboards)

---

## Part 6: Registry Updates

### PHASE9_CONTENT_REGISTRY.json Extensions

**New Entries for Batch C:**

```json
[
  {
    "path": "/dashboard/content-library/articles/[category]/[slug]",
    "family": "content-library",
    "strapiType": "single",
    "entity": "ArticleDetail",
    "dataSource": "data/strapi-mock/dashboard/articles/[category]/[slug].json",
    "type": "types/dashboard.ts#ArticleDetailContent",
    "blocks": ["ArticleHeader", "ArticleContent", "RelatedArticles"],
    "status": "planned",
    "phase": "Batch C"
  },
  {
    "path": "/dashboard/content-library/case-studies/[category]/[slug]",
    "family": "content-library",
    "strapiType": "single",
    "entity": "CaseStudyDetail",
    "dataSource": "data/strapi-mock/dashboard/case-studies/[category]/[slug].json",
    "type": "types/dashboard.ts#CaseStudyDetailContent",
    "blocks": [
      "CaseStudyHeader",
      "CaseStudyContent",
      "Testimonial",
      "RelatedCaseStudies"
    ],
    "status": "planned",
    "phase": "Batch C"
  },
  {
    "path": "/dashboard/content-library/guides/[category]/[slug]",
    "family": "content-library",
    "strapiType": "single",
    "entity": "GuideDetail",
    "dataSource": "data/strapi-mock/dashboard/guides/[category]/[slug].json",
    "type": "types/dashboard.ts#GuideDetailContent",
    "blocks": ["GuideHeader", "GuideSection", "Prerequisites", "Takeaways"],
    "status": "planned",
    "phase": "Batch C"
  },
  {
    "path": "/dashboard/content-library/tutorials/[category]/[slug]",
    "family": "content-library",
    "strapiType": "single",
    "entity": "TutorialDetail",
    "dataSource": "data/strapi-mock/dashboard/tutorials/[category]/[slug].json",
    "type": "types/dashboard.ts#TutorialDetailContent",
    "blocks": ["TutorialHeader", "TutorialStep", "CodeBlock", "Resources"],
    "status": "planned",
    "phase": "Batch C"
  }
]
```

**New Entries for Global Infrastructure:**

```json
[
  {
    "path": "global",
    "family": "system",
    "strapiType": "single",
    "entity": "GlobalSettings",
    "dataSource": "data/strapi-mock/global/settings.json",
    "type": "types/global-settings.ts#GlobalSettings",
    "blocks": [
      "BrandingConfig",
      "EmailTemplateConfig",
      "SEOConfig",
      "ContactFormConfig"
    ],
    "status": "planned",
    "phase": "Infrastructure"
  },
  {
    "path": "components/ui/generic-data-table",
    "family": "system",
    "strapiType": "component",
    "entity": "DataTable",
    "dataSource": "N/A (component logic)",
    "type": "types/table.ts#DataTableProps",
    "blocks": ["TanStackTable", "Filtering", "Sorting", "Pagination"],
    "status": "planned",
    "phase": "Infrastructure"
  }
]
```

---

## Success Criteria

### Batch C Completion

- ✅ All 4 content detail page groups migrated
- ✅ Dynamic routes validated with proper relations
- ✅ 160/160 pages build successfully
- ✅ TypeScript: 0 errors
- ✅ SEO metadata auto-generated from Strapi data

### Global Infrastructure Completion

- ✅ Generic DataTable<T> component in production
- ✅ Global settings entity tested in 5+ pages
- ✅ Email config refactored to use global settings
- ✅ Single source of truth for branding, templates, SEO
- ✅ Ready for Analytics & Financial dashboards

### Type Safety

- ✅ Complete type coverage for all detail pages
- ✅ Relation types validated at compile time
- ✅ No `any` types in new code
- ✅ Strict mode enabled throughout

---

## Risks & Mitigations

### Risk: Dynamic route generation complexity

**Mitigation:** Start with articles (simplest), validate pattern before guides/tutorials

### Risk: Circular dependencies in global settings

**Mitigation:** Make global settings import-safe, no circular references

### Risk: Email template variables clash with global settings

**Mitigation:** Namespace variables clearly (global.x vs email.y)

### Risk: Breaking changes when refactoring email config

**Mitigation:** Create new files first, migrate gradually, keep old files as fallback

---

## Next Steps

1. **Review Plan:** Stakeholder feedback on architecture
2. **Prepare Implementation:** Set up Batch C branch
3. **Execute Phase 1:** Create Batch C mock files (2-3 hours)
4. **Execute Phase 2:** Extend types and update pages (2-3 hours)
5. **Validate:** Build + TypeScript + regression testing (1 hour)
6. **Document:** Update PHASE9_GENERATION_NOTES.md

---

**Status:** ✅ Planning Complete  
**Ready for:** Implementation (Batch C + Infrastructure)  
**Owner:** Senior Architecture Discipline  
**Date:** 2026-02-25
