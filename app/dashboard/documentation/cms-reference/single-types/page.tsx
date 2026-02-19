"use client"

import { DocPage, DocSectionHeader } from "@/components/molecules/doc-page"
import { CodeBlock } from "@/components/atoms/code-block"
import { Callout } from "@/components/atoms/callout"
import { Spoiler } from "@/components/atoms/spoiler"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Box, Settings, Globe, Building, Navigation } from "lucide-react"

const SECTIONS = [
  { id: "overview", title: "Single Types Overview" },
  { id: "schemas", title: "Single Type Schemas" },
  { id: "fetching", title: "Fetching Single Types" },
  { id: "best-practices", title: "Best Practices" },
]

const singleTypes = [
  { icon: Settings, title: "Site Settings", description: "Global site configuration", detail: "Site name, tagline, logo, favicon, maintenance mode, analytics IDs, and feature flags." },
  { icon: Globe, title: "Global SEO", description: "Default SEO configuration", detail: "Default meta title template, description, OG images, robots config, and structured data defaults." },
  { icon: Building, title: "Company Info", description: "Business details", detail: "Company name, address, contact details, VAT number, registration info, and social media links." },
  { icon: Navigation, title: "Navigation Config", description: "Menu structure", detail: "Main navigation items, footer links, mega menu configuration, and mobile menu structure." },
]

export default function SingleTypesPage() {
  return (
    <DocPage
      icon={Box}
      title="Single Types"
      description="Single Types store unique, non-repeatable content like site settings, global SEO configuration, and company information. Unlike Collection Types, each Single Type has only one entry."
      badges={["Strapi 5", "4 Single Types", "Global Configuration", "SEO Settings"]}
      meta={[
        { label: "Audience", value: "Developer / Architect" },
        { label: "Last Updated", value: "2026-02-10" },
      ]}
      sections={SECTIONS}
    >
      {/* Overview */}
      <DocSectionHeader id="overview">Single Types Overview</DocSectionHeader>

      <Callout type="info" title="When to Use Single Types">
        Use Single Types for content that exists only once in your application: site settings,
        homepage content, about page content, global SEO defaults, or company profile. If you need
        multiple entries, use a Collection Type instead.
      </Callout>

      <div className="responsive-grid-2 mt-6">
        {singleTypes.map((st) => {
          const Icon = st.icon
          return (
            <Card key={st.title}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-accent" />
                  <CardTitle className="text-lg">{st.title}</CardTitle>
                </div>
                <CardDescription>{st.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{st.detail}</CardContent>
            </Card>
          )
        })}
      </div>

      {/* Schemas */}
      <DocSectionHeader id="schemas">Single Type Schemas</DocSectionHeader>

      <Tabs defaultValue="site-settings" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="site-settings">Site Settings</TabsTrigger>
          <TabsTrigger value="global-seo">Global SEO</TabsTrigger>
          <TabsTrigger value="company-info">Company Info</TabsTrigger>
          <TabsTrigger value="navigation">Navigation</TabsTrigger>
        </TabsList>

        <TabsContent value="site-settings" className="space-y-4">
          <Callout type="info" title="Site Settings Single Type">
            Central configuration for your entire site. Access this via the Strapi admin panel to
            toggle features, update branding, or enable maintenance mode without code changes.
          </Callout>
          <Spoiler title="Site Settings Schema" defaultOpen>
            <CodeBlock
              title="api/site-settings/content-types/site-settings/schema.json"
              language="json"
              code={`{
  "kind": "singleType",
  "collectionName": "site_settings",
  "info": {
    "singularName": "site-settings",
    "pluralName": "site-settings",
    "displayName": "Site Settings",
    "description": "Global site configuration"
  },
  "options": { "draftAndPublish": false },
  "attributes": {
    "siteName": { "type": "string", "required": true, "default": "AduDev Electrical Services" },
    "tagline": { "type": "string", "maxLength": 160 },
    "logo": { "type": "media", "allowedTypes": ["images"], "multiple": false },
    "favicon": { "type": "media", "allowedTypes": ["images"], "multiple": false },
    "primaryColor": { "type": "string", "regex": "^#[0-9A-Fa-f]{6}$", "default": "#F59E0B" },
    "maintenanceMode": { "type": "boolean", "default": false },
    "maintenanceMessage": { "type": "text", "maxLength": 500 },
    "googleAnalyticsId": { "type": "string" },
    "googleTagManagerId": { "type": "string" },
    "features": {
      "type": "json",
      "default": { "enableBlog": true, "enableChat": false, "enableBooking": true, "enableQuotation": true }
    }
  }
}`}
            />
          </Spoiler>
        </TabsContent>

        <TabsContent value="global-seo" className="space-y-4">
          <Callout type="info" title="Global SEO Single Type">
            Default SEO settings applied site-wide. Individual pages can override these values.
            Essential for consistent search engine optimization across your site.
          </Callout>
          <Spoiler title="Global SEO Schema" defaultOpen>
            <CodeBlock
              title="api/global-seo/content-types/global-seo/schema.json"
              language="json"
              code={`{
  "kind": "singleType",
  "collectionName": "global_seo",
  "info": {
    "singularName": "global-seo",
    "pluralName": "global-seo",
    "displayName": "Global SEO",
    "description": "Default SEO configuration"
  },
  "options": { "draftAndPublish": false },
  "attributes": {
    "metaTitleTemplate": { "type": "string", "default": "%s | AduDev Electrical Services", "maxLength": 70 },
    "defaultMetaDescription": { "type": "text", "maxLength": 160, "required": true },
    "defaultOgImage": { "type": "media", "allowedTypes": ["images"], "multiple": false },
    "twitterHandle": { "type": "string" },
    "robotsDefaults": {
      "type": "json",
      "default": { "index": true, "follow": true, "noarchive": false, "nosnippet": false }
    },
    "structuredData": { "type": "component", "repeatable": false, "component": "seo.organization-schema" },
    "canonicalUrlBase": { "type": "string", "regex": "^https?://[^\\\\s]+$" },
    "hreflangDefaults": {
      "type": "json",
      "default": { "defaultLocale": "en-GB", "supportedLocales": ["en-GB"] }
    }
  }
}`}
            />
          </Spoiler>
          <Spoiler title="Organization Schema Component">
            <CodeBlock
              title="components/seo/organization-schema.json"
              language="json"
              code={`{
  "collectionName": "components_seo_organization_schema",
  "info": { "displayName": "Organization Schema", "icon": "search", "description": "Structured data for organization" },
  "attributes": {
    "type": { "type": "enumeration", "enum": ["Organization", "LocalBusiness", "ElectricalContractor"], "default": "ElectricalContractor" },
    "name": { "type": "string", "required": true },
    "description": { "type": "text" },
    "url": { "type": "string" },
    "logo": { "type": "string" },
    "priceRange": { "type": "string", "default": "££" },
    "areaServed": { "type": "json", "default": ["London", "Greater London", "South East England"] }
  }
}`}
            />
          </Spoiler>
        </TabsContent>

        <TabsContent value="company-info" className="space-y-4">
          <Callout type="info" title="Company Info Single Type">
            Business details used across the site: footer, contact pages, invoices, and legal
            documents. Update once, reflect everywhere.
          </Callout>
          <Spoiler title="Company Info Schema" defaultOpen>
            <CodeBlock
              title="api/company-info/content-types/company-info/schema.json"
              language="json"
              code={`{
  "kind": "singleType",
  "collectionName": "company_info",
  "info": {
    "singularName": "company-info",
    "pluralName": "company-info",
    "displayName": "Company Info",
    "description": "Business details and contact information"
  },
  "options": { "draftAndPublish": false },
  "attributes": {
    "companyName": { "type": "string", "required": true, "default": "AduDev Electrical Services Ltd" },
    "legalName": { "type": "string" },
    "registrationNumber": { "type": "string" },
    "vatNumber": { "type": "string", "regex": "^GB[0-9]{9}$" },
    "address": { "type": "component", "repeatable": false, "component": "shared.uk-address", "required": true },
    "primaryEmail": { "type": "email", "required": true },
    "primaryPhone": { "type": "string", "required": true, "regex": "^(?:(?:\\\\+44)|(?:0))(?:\\\\s?\\\\d){9,10}$" },
    "emergencyPhone": { "type": "string" },
    "businessHours": {
      "type": "json",
      "default": {
        "monday": "08:00-18:00", "tuesday": "08:00-18:00", "wednesday": "08:00-18:00",
        "thursday": "08:00-18:00", "friday": "08:00-18:00", "saturday": "09:00-14:00", "sunday": "Closed"
      }
    },
    "socialLinks": { "type": "component", "repeatable": false, "component": "shared.social-links" },
    "accreditations": {
      "type": "json",
      "default": ["NICEIC Approved Contractor", "Part P Registered", "Trust a Trader Verified"]
    }
  }
}`}
            />
          </Spoiler>
          <Spoiler title="Social Links Component">
            <CodeBlock
              title="components/shared/social-links.json"
              language="json"
              code={`{
  "collectionName": "components_shared_social_links",
  "info": { "displayName": "Social Links", "icon": "link", "description": "Social media profile URLs" },
  "attributes": {
    "facebook": { "type": "string", "regex": "^https?://(?:www\\\\.)?facebook\\\\.com/.*$" },
    "twitter": { "type": "string", "regex": "^https?://(?:www\\\\.)?(?:twitter|x)\\\\.com/.*$" },
    "instagram": { "type": "string", "regex": "^https?://(?:www\\\\.)?instagram\\\\.com/.*$" },
    "linkedin": { "type": "string", "regex": "^https?://(?:www\\\\.)?linkedin\\\\.com/.*$" },
    "youtube": { "type": "string", "regex": "^https?://(?:www\\\\.)?youtube\\\\.com/.*$" }
  }
}`}
            />
          </Spoiler>
        </TabsContent>

        <TabsContent value="navigation" className="space-y-4">
          <Callout type="info" title="Navigation Config Single Type">
            Configure your site navigation without code changes. Supports main menu, footer links,
            mega menu items, and mobile navigation structure.
          </Callout>
          <Spoiler title="Navigation Config Schema" defaultOpen>
            <CodeBlock
              title="api/navigation-config/content-types/navigation-config/schema.json"
              language="json"
              code={`{
  "kind": "singleType",
  "collectionName": "navigation_config",
  "info": {
    "singularName": "navigation-config",
    "pluralName": "navigation-config",
    "displayName": "Navigation Config",
    "description": "Site navigation configuration"
  },
  "options": { "draftAndPublish": true },
  "attributes": {
    "mainNavigation": { "type": "component", "repeatable": true, "component": "navigation.nav-item" },
    "footerNavigation": { "type": "component", "repeatable": true, "component": "navigation.footer-column" },
    "megaMenu": { "type": "component", "repeatable": true, "component": "navigation.mega-menu-section" },
    "ctaButton": { "type": "component", "repeatable": false, "component": "navigation.cta-button" },
    "mobileMenuConfig": {
      "type": "json",
      "default": { "showSearch": true, "showCta": true, "collapsibleSections": true }
    }
  }
}`}
            />
          </Spoiler>
          <Spoiler title="Navigation Components">
            <CodeBlock
              title="components/navigation/nav-item.json + mega-menu-section.json"
              language="json"
              code={`// nav-item.json
{
  "collectionName": "components_navigation_nav_item",
  "info": { "displayName": "Nav Item", "icon": "link", "description": "Single navigation item" },
  "attributes": {
    "label": { "type": "string", "required": true, "maxLength": 50 },
    "href": { "type": "string", "required": true },
    "icon": { "type": "string" },
    "isExternal": { "type": "boolean", "default": false },
    "badge": { "type": "string", "maxLength": 20 },
    "children": { "type": "component", "repeatable": true, "component": "navigation.nav-item" }
  }
}

// mega-menu-section.json
{
  "collectionName": "components_navigation_mega_menu_section",
  "info": { "displayName": "Mega Menu Section", "icon": "grid", "description": "Mega menu column section" },
  "attributes": {
    "title": { "type": "string", "required": true },
    "description": { "type": "text", "maxLength": 200 },
    "items": { "type": "component", "repeatable": true, "component": "navigation.nav-item" },
    "featured": { "type": "component", "repeatable": false, "component": "navigation.featured-content" }
  }
}`}
            />
          </Spoiler>
        </TabsContent>
      </Tabs>

      {/* Fetching */}
      <DocSectionHeader id="fetching">Fetching Single Types</DocSectionHeader>

      <Callout type="success" title="API Endpoint Pattern">
        Single Types use a simpler endpoint pattern than Collection Types. No ID is needed since
        there is only one entry.
      </Callout>

      <Spoiler title="Frontend Fetching Example" defaultOpen>
        <CodeBlock
          title="lib/strapi.ts"
          language="typescript"
          code={`// Fetch Site Settings
export async function getSiteSettings() {
  const response = await fetch(
    \`\${process.env.STRAPI_URL}/api/site-settings?populate=*\`,
    {
      headers: { Authorization: \`Bearer \${process.env.STRAPI_TOKEN}\` },
      next: { tags: ['site-settings'] }
    }
  );
  if (!response.ok) throw new Error('Failed to fetch site settings');
  const data = await response.json();
  return data.data;
}

// Fetch Global SEO with nested population
export async function getGlobalSEO() {
  const response = await fetch(
    \`\${process.env.STRAPI_URL}/api/global-seo?populate[structuredData]=*\`,
    {
      headers: { Authorization: \`Bearer \${process.env.STRAPI_TOKEN}\` },
      next: { tags: ['global-seo'] }
    }
  );
  if (!response.ok) throw new Error('Failed to fetch global SEO');
  const data = await response.json();
  return data.data;
}

// Usage in Next.js layout
export default async function RootLayout({ children }) {
  const [settings, seo] = await Promise.all([
    getSiteSettings(),
    getGlobalSEO()
  ]);
  return (
    <html>
      <head>
        <title>{seo.metaTitleTemplate.replace('%s', settings.siteName)}</title>
        <meta name="description" content={seo.defaultMetaDescription} />
      </head>
      <body>{children}</body>
    </html>
  );
}`}
        />
      </Spoiler>

      {/* Best Practices */}
      <DocSectionHeader id="best-practices">Best Practices</DocSectionHeader>

      <div className="responsive-grid-2">
        {[
          { title: "Cache Aggressively", desc: "Single Types rarely change. Use long cache times with revalidateTag() to bust cache only when content editors publish changes." },
          { title: "Populate Selectively", desc: "Use ?populate[field]=* instead of ?populate=* to avoid fetching unnecessary nested data. Reduces payload size significantly." },
          { title: "Validate on Fetch", desc: "Always validate the response shape with Zod or similar. Strapi schema changes can break your frontend silently." },
          { title: "Use Environment Variables", desc: "Never hardcode STRAPI_URL or STRAPI_TOKEN. Use server-side env vars and never expose them to the client." },
        ].map((bp) => (
          <Card key={bp.title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{bp.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{bp.desc}</CardContent>
          </Card>
        ))}
      </div>
    </DocPage>
  )
}
