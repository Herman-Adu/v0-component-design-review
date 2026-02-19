"use client"

import { CodeBlock } from "@/components/atoms/code-block"
import { Callout } from "@/components/atoms/callout"
import { Spoiler } from "@/components/atoms/spoiler"
import { DocPage, DocSectionHeader } from "@/components/molecules/doc-page"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Database, Layers, Link2, Server, BookOpen, ArrowRight, GitBranch } from "lucide-react"
import Link from "next/link"
import { STATS } from "@/data/doc-manifest"

const SECTIONS = [
  { id: "overview", title: "Architecture Overview" },
  { id: "reusable-components", title: "Reusable Components" },
  { id: "collection-schemas", title: "Collection Schemas" },
  { id: "relationships", title: "Data Relationships" },
  { id: "implementation", title: "Implementation Guide" },
  { id: "environment", title: "Environment Config" },
]

const collectionCards = [
  { icon: Server, title: "Service Requests", desc: "Electrical service bookings", detail: "Personal info, service details, property information, scheduling preferences. Status tracking and technician assignment." },
  { icon: Link2, title: "Contact Inquiries", desc: "General contact submissions", detail: "Contact info, inquiry type, reference linking to existing requests, message details with priority handling." },
  { icon: Layers, title: "Quotation Requests", desc: "Project quotation submissions", detail: "Project type and scope, site details, budget and timeline, compliance requirements, commercial terms." },
]

export default function BackendArchitecturePage() {
  return (
    <DocPage
      title="Form Collection Types"
      description="Strapi CMS schemas for form submissions mirroring the frontend atomic design. Copy-paste ready schemas for Service Requests, Contact Forms, and Quotations."
      icon={Database}
      badges={[
        <Badge key="strapi" variant="outline">Strapi 5</Badge>,
        <Badge key="cols" variant="outline">3 Form Collections</Badge>,
        <Badge key="comps" variant="outline">8 Shared Components</Badge>,
        <Badge key="db" variant="outline">PostgreSQL</Badge>,
      ]}
      tags={["strapi", "collections", "forms", "schemas"]}
      meta={[
        { label: "Audience", value: "Developer / Architect" },
        { label: "Last Updated", value: "2026-02-10" },
      ]}
      sections={SECTIONS}
    >
      {/* Architecture Overview */}
      <DocSectionHeader id="overview">Architecture Overview</DocSectionHeader>

      <Callout type="info" title="Atomic Design Mapping">
        The backend mirrors the frontend atomic design structure: Atoms become field configurations,
        Molecules become Strapi Components, and Organisms become Collection Types. This creates a
        1:1 mapping between frontend forms and backend data models.
      </Callout>

      <div className="rounded-lg border border-accent/30 bg-accent/5 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-accent shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Looking for content schemas?</p>
              <p className="text-sm text-muted-foreground">
                Article, Tutorial, and Case Study collection types are documented separately with full
                field mapping from the frontend TypeScript interfaces.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/documentation/cms-reference/content-collections"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium shrink-0 hover:bg-accent/90 transition-colors"
          >
            Content Collections
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="responsive-grid-3">
        {collectionCards.map((c) => (
          <Card key={c.title}>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <c.icon className="h-5 w-5 text-accent" />
                <CardTitle className="text-lg">{c.title}</CardTitle>
              </div>
              <CardDescription>{c.desc}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{c.detail}</CardContent>
          </Card>
        ))}
      </div>

      {/* Reusable Components */}
      <DocSectionHeader id="reusable-components">Reusable Strapi Components</DocSectionHeader>

      <p className="text-foreground leading-relaxed">
        These components are shared across multiple collection types, ensuring consistency
        and reducing duplication. Create these first before building collection types.
      </p>

      <Tabs defaultValue="contact" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="contact">Contact Info</TabsTrigger>
          <TabsTrigger value="address">Address</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="service">Service</TabsTrigger>
        </TabsList>

        <TabsContent value="contact" className="space-y-4">
          <Spoiler title="Contact Information Component" defaultOpen>
            <CodeBlock
              title="components/shared/contact-information.json"
              language="json"
              code={`{
  "collectionName": "components_shared_contact_information",
  "info": {
    "displayName": "Contact Information",
    "icon": "user",
    "description": "Reusable contact details component"
  },
  "options": {},
  "attributes": {
    "firstName": { "type": "string", "required": true, "minLength": 2, "maxLength": 50 },
    "lastName": { "type": "string", "required": true, "minLength": 2, "maxLength": 50 },
    "email": { "type": "email", "required": true },
    "phone": { "type": "string", "required": true, "regex": "^(?:(?:\\\\+44)|(?:0))(?:\\\\s?\\\\d){9,10}$" },
    "company": { "type": "string", "required": false, "maxLength": 100 }
  }
}`}
            />
          </Spoiler>
        </TabsContent>

        <TabsContent value="address" className="space-y-4">
          <Spoiler title="UK Address Component" defaultOpen>
            <CodeBlock
              title="components/shared/uk-address.json"
              language="json"
              code={`{
  "collectionName": "components_shared_uk_address",
  "info": {
    "displayName": "UK Address",
    "icon": "map-pin",
    "description": "UK address with postcode validation"
  },
  "options": {},
  "attributes": {
    "addressLine1": { "type": "string", "required": true, "maxLength": 100 },
    "addressLine2": { "type": "string", "required": false, "maxLength": 100 },
    "city": { "type": "string", "required": true, "maxLength": 50 },
    "county": { "type": "string", "required": false, "maxLength": 50 },
    "postcode": { "type": "string", "required": true, "regex": "^[A-Z]{1,2}\\\\d[A-Z\\\\d]? ?\\\\d[A-Z]{2}$" },
    "accessNotes": { "type": "text", "required": false, "maxLength": 500 }
  }
}`}
            />
          </Spoiler>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Spoiler title="Schedule Preferences Component" defaultOpen>
            <CodeBlock
              title="components/shared/schedule-preferences.json"
              language="json"
              code={`{
  "collectionName": "components_shared_schedule_preferences",
  "info": {
    "displayName": "Schedule Preferences",
    "icon": "calendar",
    "description": "Appointment scheduling preferences"
  },
  "options": {},
  "attributes": {
    "preferredDate": { "type": "date", "required": true },
    "preferredTimeSlot": {
      "type": "enumeration",
      "enum": ["morning-early", "morning-late", "afternoon-early", "afternoon-late", "evening"],
      "required": true
    },
    "alternativeDate": { "type": "date", "required": false },
    "flexibleScheduling": { "type": "boolean", "default": false }
  }
}`}
            />
          </Spoiler>
        </TabsContent>

        <TabsContent value="service" className="space-y-4">
          <Spoiler title="Service Details Component" defaultOpen>
            <CodeBlock
              title="components/service/service-details.json"
              language="json"
              code={`{
  "collectionName": "components_service_details",
  "info": {
    "displayName": "Service Details",
    "icon": "lightning-bolt",
    "description": "Electrical service type and urgency"
  },
  "options": {},
  "attributes": {
    "serviceType": {
      "type": "enumeration",
      "enum": ["electrical-repair", "new-installation", "rewiring", "inspection", "emergency", "ev-charger", "lighting", "fuse-board", "other"],
      "required": true
    },
    "urgency": { "type": "enumeration", "enum": ["routine", "urgent", "emergency"], "default": "routine", "required": true },
    "description": { "type": "text", "required": true, "minLength": 20, "maxLength": 2000 }
  }
}`}
            />
          </Spoiler>
        </TabsContent>
      </Tabs>

      <div className="space-y-4 mt-6">
        <h3 className="text-xl font-semibold text-foreground">Additional Reusable Components</h3>

        <Spoiler title="Inquiry Type Component">
          <CodeBlock
            title="components/contact/inquiry-type.json"
            language="json"
            code={`{
  "collectionName": "components_contact_inquiry_type",
  "info": { "displayName": "Inquiry Type", "icon": "question-mark", "description": "Contact inquiry classification" },
  "options": {},
  "attributes": {
    "inquiryType": { "type": "enumeration", "enum": ["general-inquiry", "quote-request", "support", "complaint", "partnership", "other"], "required": true },
    "sector": { "type": "enumeration", "enum": ["residential", "commercial", "industrial"], "required": true },
    "priority": { "type": "enumeration", "enum": ["low", "normal", "high", "urgent"], "default": "normal" }
  }
}`}
          />
        </Spoiler>

        <Spoiler title="Project Scope Component">
          <CodeBlock
            title="components/quotation/project-scope.json"
            language="json"
            code={`{
  "collectionName": "components_quotation_project_scope",
  "info": { "displayName": "Project Scope", "icon": "layers", "description": "Project scope and requirements" },
  "options": {},
  "attributes": {
    "projectDescription": { "type": "text", "required": true, "minLength": 50, "maxLength": 5000 },
    "estimatedSize": { "type": "enumeration", "enum": ["small", "medium", "large", "enterprise"], "required": true },
    "services": { "type": "json", "required": true },
    "hasDrawings": { "type": "boolean", "default": false },
    "needsDesign": { "type": "boolean", "default": false }
  }
}`}
          />
        </Spoiler>

        <Spoiler title="Budget Timeline Component">
          <CodeBlock
            title="components/quotation/budget-timeline.json"
            language="json"
            code={`{
  "collectionName": "components_quotation_budget_timeline",
  "info": { "displayName": "Budget & Timeline", "icon": "currency-pound", "description": "Budget range and project timeline" },
  "options": {},
  "attributes": {
    "budgetRange": { "type": "enumeration", "enum": ["under-1000", "1000-5000", "5000-10000", "10000-25000", "25000-50000", "50000-plus", "to-be-discussed"], "required": true },
    "timeline": { "type": "enumeration", "enum": ["asap", "within-1-month", "1-3-months", "3-6-months", "6-plus-months", "flexible"], "required": true },
    "preferredStartDate": { "type": "date", "required": false },
    "flexibleOnBudget": { "type": "boolean", "default": false },
    "flexibleOnTimeline": { "type": "boolean", "default": true }
  }
}`}
          />
        </Spoiler>
      </div>

      {/* Collection Type Schemas */}
      <DocSectionHeader id="collection-schemas">Collection Type Schemas</DocSectionHeader>

      <p className="text-foreground leading-relaxed">
        Complete collection type schemas ready to copy into your Strapi project.
        Each schema uses the reusable components defined above.
      </p>

      <Tabs defaultValue="service" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="service">Service Request</TabsTrigger>
          <TabsTrigger value="contact">Contact Inquiry</TabsTrigger>
          <TabsTrigger value="quotation">Quotation</TabsTrigger>
        </TabsList>

        <TabsContent value="service" className="space-y-4">
          <Callout type="info" title="Service Request Collection">
            Maps to the 5-step service request form. Includes status workflow
            and technician assignment for operational management.
          </Callout>
          <Spoiler title="Service Request Schema" defaultOpen>
            <CodeBlock
              title="api/service-request/content-types/service-request/schema.json"
              language="json"
              code={`{
  "kind": "collectionType",
  "collectionName": "service_requests",
  "info": { "singularName": "service-request", "pluralName": "service-requests", "displayName": "Service Request", "description": "Electrical service booking requests" },
  "options": { "draftAndPublish": false },
  "pluginOptions": {},
  "attributes": {
    "referenceId": { "type": "string", "required": true, "unique": true, "regex": "^SR-[A-Z0-9]+-[A-Z0-9]+$" },
    "contactInfo": { "type": "component", "repeatable": false, "component": "shared.contact-information", "required": true },
    "serviceDetails": { "type": "component", "repeatable": false, "component": "service.service-details", "required": true },
    "propertyAddress": { "type": "component", "repeatable": false, "component": "shared.uk-address", "required": true },
    "propertyType": { "type": "enumeration", "enum": ["residential", "commercial", "industrial"], "required": true },
    "schedulePreferences": { "type": "component", "repeatable": false, "component": "shared.schedule-preferences", "required": true },
    "status": { "type": "enumeration", "enum": ["pending", "confirmed", "scheduled", "in-progress", "completed", "cancelled"], "default": "pending" },
    "assignedTechnician": { "type": "relation", "relation": "manyToOne", "target": "plugin::users-permissions.user" },
    "internalNotes": { "type": "richtext", "private": true },
    "completedAt": { "type": "datetime" }
  }
}`}
            />
          </Spoiler>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <Callout type="info" title="Contact Inquiry Collection">
            Maps to the 5-step contact form with reference linking.
            Enables follow-up inquiries to be linked to existing service requests.
          </Callout>
          <Spoiler title="Contact Inquiry Schema" defaultOpen>
            <CodeBlock
              title="api/contact-inquiry/content-types/contact-inquiry/schema.json"
              language="json"
              code={`{
  "kind": "collectionType",
  "collectionName": "contact_inquiries",
  "info": { "singularName": "contact-inquiry", "pluralName": "contact-inquiries", "displayName": "Contact Inquiry", "description": "General contact form submissions" },
  "options": { "draftAndPublish": false },
  "pluginOptions": {},
  "attributes": {
    "referenceId": { "type": "string", "required": true, "unique": true, "regex": "^CR-[A-Z0-9]+-[A-Z0-9]+$" },
    "contactInfo": { "type": "component", "repeatable": false, "component": "shared.contact-information", "required": true },
    "inquiryType": { "type": "component", "repeatable": false, "component": "contact.inquiry-type", "required": true },
    "linkedServiceRequest": { "type": "relation", "relation": "manyToOne", "target": "api::service-request.service-request" },
    "linkedQuotation": { "type": "relation", "relation": "manyToOne", "target": "api::quotation-request.quotation-request" },
    "referenceDescription": { "type": "text", "maxLength": 500 },
    "subject": { "type": "string", "required": true, "minLength": 5, "maxLength": 200 },
    "message": { "type": "text", "required": true, "minLength": 20, "maxLength": 5000 },
    "preferredContactMethod": { "type": "enumeration", "enum": ["email", "phone", "either"], "default": "email" },
    "bestTimeToContact": { "type": "enumeration", "enum": ["morning", "afternoon", "evening", "anytime"], "default": "anytime" },
    "newsletterOptIn": { "type": "boolean", "default": false },
    "status": { "type": "enumeration", "enum": ["new", "read", "replied", "resolved", "spam"], "default": "new" },
    "assignedTo": { "type": "relation", "relation": "manyToOne", "target": "plugin::users-permissions.user" },
    "internalNotes": { "type": "richtext", "private": true }
  }
}`}
            />
          </Spoiler>
        </TabsContent>

        <TabsContent value="quotation" className="space-y-4">
          <Callout type="info" title="Quotation Request Collection">
            Maps to the 7-step quotation form. Comprehensive project scoping
            with compliance requirements and commercial terms.
          </Callout>
          <Spoiler title="Quotation Request Schema" defaultOpen>
            <CodeBlock
              title="api/quotation-request/content-types/quotation-request/schema.json"
              language="json"
              code={`{
  "kind": "collectionType",
  "collectionName": "quotation_requests",
  "info": { "singularName": "quotation-request", "pluralName": "quotation-requests", "displayName": "Quotation Request", "description": "Project quotation requests" },
  "options": { "draftAndPublish": false },
  "pluginOptions": {},
  "attributes": {
    "referenceId": { "type": "string", "required": true, "unique": true, "regex": "^QR-[A-Z0-9]+-[A-Z0-9]+$" },
    "contact": { "type": "component", "repeatable": false, "component": "shared.contact-information", "required": true },
    "projectType": { "type": "component", "repeatable": false, "component": "quotation.project-type", "required": true },
    "projectScope": { "type": "component", "repeatable": false, "component": "quotation.project-scope", "required": true },
    "siteAddress": { "type": "component", "repeatable": false, "component": "shared.uk-address", "required": true },
    "hasExistingElectrical": { "type": "boolean", "default": true },
    "requiresAsbestosSurvey": { "type": "boolean", "default": false },
    "budgetTimeline": { "type": "component", "repeatable": false, "component": "quotation.budget-timeline", "required": true },
    "complianceRequirements": { "type": "json" },
    "specialRequirements": { "type": "text", "maxLength": 2000 },
    "preferredContactMethod": { "type": "enumeration", "enum": ["email", "phone", "either"], "default": "email" },
    "howDidYouHear": { "type": "enumeration", "enum": ["search-engine", "social-media", "referral", "previous-customer", "advertising", "other"] },
    "marketingConsent": { "type": "boolean", "default": false },
    "termsAccepted": { "type": "boolean", "required": true },
    "status": { "type": "enumeration", "enum": ["received", "reviewing", "site-visit-scheduled", "quote-prepared", "quote-sent", "accepted", "rejected", "expired"], "default": "received" },
    "quotedAmount": { "type": "decimal", "private": true },
    "quoteSentAt": { "type": "datetime" },
    "validUntil": { "type": "date" },
    "assignedTo": { "type": "relation", "relation": "manyToOne", "target": "plugin::users-permissions.user" },
    "internalNotes": { "type": "richtext", "private": true }
  }
}`}
            />
          </Spoiler>

          <Spoiler title="Project Type Component">
            <CodeBlock
              title="components/quotation/project-type.json"
              language="json"
              code={`{
  "collectionName": "components_quotation_project_type",
  "info": { "displayName": "Project Type", "icon": "folder", "description": "Project category and type classification" },
  "options": {},
  "attributes": {
    "projectCategory": { "type": "enumeration", "enum": ["new-build", "renovation", "extension", "fit-out", "maintenance-contract", "emergency-works"], "required": true },
    "projectType": { "type": "enumeration", "enum": ["full-electrical-installation", "partial-rewire", "consumer-unit-upgrade", "lighting-design", "power-distribution", "ev-charging", "solar-pv", "emergency-lighting", "fire-alarm", "data-cabling", "other"], "required": true },
    "propertyType": { "type": "enumeration", "enum": ["residential-house", "residential-flat", "hmo", "office", "retail", "warehouse", "industrial", "healthcare", "education", "hospitality", "other"], "required": true }
  }
}`}
            />
          </Spoiler>
        </TabsContent>
      </Tabs>

      {/* Data Relationships */}
      <DocSectionHeader id="relationships">Data Relationships</DocSectionHeader>

      <p className="text-foreground leading-relaxed">
        The schema design enables powerful relationships between entities, allowing
        follow-up inquiries, linked quotations, and complete customer journey tracking.
      </p>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-semibold text-foreground mb-4">Relationship Map</h3>
        <CodeBlock
          title="Entity Relationships"
          language="text"
          code={`+---------------------+
|   Customer Contact  |
+----------+----------+
           |
           v
+---------------------+     +---------------------+
|  Service Request    |---->|  Contact Inquiry    |
|  (SR-*)             |     |  (CR-*)             |
+----------+----------+     +----------+----------+
           |                           |
           |                           |
           v                           v
+---------------------+     +---------------------+
|  Assigned Tech      |     |  Linked Reference   |
|  (User)             |     |  (SR/QR)            |
+---------------------+     +---------------------+

+---------------------+
|  Quotation Request  |
|  (QR-*)             |
+----------+----------+
           |
           v
+---------------------+
|  Quote Lifecycle    |
|  (status workflow)  |
+---------------------+`}
        />
      </div>

      <Callout type="success" title="Reference Linking Benefits">
        <ul className="list-disc list-inside space-y-1">
          <li>Track follow-up inquiries to original service requests</li>
          <li>Convert quotation requests to service bookings</li>
          <li>Build complete customer communication history</li>
          <li>Enable CRM-style customer journey tracking</li>
        </ul>
      </Callout>

      {/* Implementation Guide */}
      <DocSectionHeader id="implementation">Implementation Guide</DocSectionHeader>

      <div className="space-y-4">
        {[
          { step: 1, title: "Create Strapi Project", content: <CodeBlock language="bash" code={`npx create-strapi-app@latest backend --quickstart\ncd backend\nnpm run develop`} /> },
          { step: 2, title: "Create Components First", content: <p className="text-sm text-muted-foreground">In Strapi Admin: Content-Type Builder &rarr; Create new component. Create all reusable components before collection types.</p> },
          { step: 3, title: "Create Collection Types", content: <p className="text-sm text-muted-foreground">Content-Type Builder &rarr; Create new collection type. Add components and fields matching the schemas above.</p> },
          { step: 4, title: "Configure Permissions", content: <p className="text-sm text-muted-foreground">{'Settings -> Roles -> Public: Enable only "create" action for form submissions. Keep find/update/delete for authenticated admin roles only.'}</p> },
          { step: 5, title: "Add Lifecycle Hooks", content: (
            <CodeBlock
              title="api/service-request/content-types/service-request/lifecycles.js"
              language="javascript"
              code={`module.exports = {
  async afterCreate(event) {
    const { result } = event
    // Send notification email
    await strapi.plugins['email'].services.email.send({
      to: process.env.ADMIN_EMAIL,
      subject: \`New Service Request - \${result.referenceId}\`,
      text: \`New request from \${result.contactInfo.firstName}\`
    })
  }
}`}
            />
          )},
        ].map((item) => (
          <div key={item.step} className="flex items-start gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground text-sm font-semibold">
              {item.step}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-foreground mb-2">{item.title}</h4>
              {item.content}
            </div>
          </div>
        ))}
      </div>

      {/* Environment Configuration */}
      <DocSectionHeader id="environment">Environment Configuration</DocSectionHeader>

      <CodeBlock
        title="backend/.env"
        language="bash"
        code={`# Database (PostgreSQL recommended for production)
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=electrical_services
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=your_secure_password
DATABASE_SSL=false

# Security
JWT_SECRET=your-jwt-secret-min-32-chars
ADMIN_JWT_SECRET=your-admin-jwt-secret-min-32-chars
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=your-api-token-salt

# Email (for lifecycle hooks)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USERNAME=your_smtp_user
SMTP_PASSWORD=your_smtp_password
ADMIN_EMAIL=admin@example.com

# Server
HOST=0.0.0.0
PORT=1337
NODE_ENV=production`}
      />

      {/* Related Documentation */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2">Related Documentation</h2>
        <div className="responsive-grid-3">
          {[
            { href: "/dashboard/documentation/cms-reference/content-collections", icon: BookOpen, title: "Content Collections", desc: "Article, Tutorial, and Case Study schemas with complete field mapping from frontend data structures." },
    { href: "/dashboard/documentation/cms-reference/shared-components", icon: Layers, title: "Shared Components", desc: `${STATS.backend.sharedComponents.total} reusable Strapi components covering both form and content systems with copy-paste JSON schemas.` },
    { href: "/dashboard/documentation/cms-reference/relationships", icon: GitBranch, title: "Relationships", desc: "Entity relationship diagrams, data flow architecture, and frontend-to-backend mapping reference." },
          ].map((link) => (
            <Link key={link.title} href={link.href} className="group">
              <Card className="h-full transition-colors hover:border-accent/50">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <link.icon className="h-5 w-5 text-accent" />
                    <CardTitle className="text-base group-hover:text-accent transition-colors">{link.title}</CardTitle>
                  </div>
                  <CardDescription>{link.desc}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </DocPage>
  )
}
