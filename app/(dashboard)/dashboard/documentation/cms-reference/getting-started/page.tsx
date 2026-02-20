"use client"

import { CodeBlock } from "@/components/atoms/code-block"
import { Callout } from "@/components/atoms/callout"
import { Spoiler } from "@/components/atoms/spoiler"
import { DocPage } from "@/components/molecules/doc-page"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Database,
  Terminal,
  ArrowRight,
  Folder,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const steps = [
  { number: 1, title: "Install Strapi", description: "Create a new Strapi project with PostgreSQL", time: "2 min" },
  { number: 2, title: "Configure Database", description: "Set up PostgreSQL connection", time: "1 min" },
  { number: 3, title: "Create Components", description: "Add shared components for reuse", time: "5 min" },
  { number: 4, title: "Build Collection Types", description: "Create your first collection", time: "3 min" },
  { number: 5, title: "Connect Frontend", description: "Fetch data in Next.js", time: "2 min" },
]

export default function GettingStartedPage() {
  return (
    <DocPage
      title="Getting Started"
      description="Set up Strapi CMS from scratch and connect it to your Next.js frontend. This guide takes you from zero to a working API in about 15 minutes."
      icon={Database}
      badges={[
        <Badge key="level" className="bg-green-500/20 text-green-400 border-0">Beginner Friendly</Badge>,
      ]}
      tags={["getting-started", "strapi", "setup", "beginner"]}
      meta={[
        { label: "Audience", value: "Developer / Architect" },
        { label: "Time", value: "~15 minutes" },
        { label: "Last Updated", value: "2026-02-10" },
      ]}
    >
      {/* Progress Overview */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-foreground border-b border-border pb-2">What You Will Build</h2>
        <div className="flex flex-wrap gap-4">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center gap-3">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-accent text-accent-foreground text-sm font-semibold">
                {step.number}
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">{step.title}</p>
                <p className="text-xs text-muted-foreground">{step.time}</p>
              </div>
              {index < steps.length - 1 && <ArrowRight className="h-4 w-4 text-muted-foreground ml-2" />}
            </div>
          ))}
        </div>
      </section>

      {/* Prerequisites */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-foreground border-b border-border pb-2">Prerequisites</h2>
        <div className="responsive-grid-3">
          {[
            { icon: Terminal, title: "Node.js 18+", desc: "Required for running Strapi. Check with node -v" },
            { icon: Database, title: "PostgreSQL", desc: "Recommended database. SQLite works for development." },
            { icon: Folder, title: "Code Editor", desc: "VS Code recommended with Strapi extension." },
          ].map((item) => (
            <Card key={item.title}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Step 1: Install */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-accent text-accent-foreground font-semibold">1</div>
          <h2 className="text-3xl font-bold text-foreground">Install Strapi</h2>
        </div>
        <Callout type="info" title="Quick Start">
          The fastest way to get started is using the Strapi CLI. This creates a new project with all dependencies installed.
        </Callout>
        <Spoiler title="Installation Commands" defaultOpen>
          <CodeBlock
            title="Terminal"
            language="bash"
            code={`# Create new Strapi project
npx create-strapi-app@latest my-strapi-backend

# When prompted, select:
# - Installation type: Quickstart (SQLite) or Custom (PostgreSQL)
# - Template: Empty
# - TypeScript: Yes (recommended)

# Navigate to project
cd my-strapi-backend

# Start development server
npm run develop

# Strapi admin panel will open at http://localhost:1337/admin`}
          />
        </Spoiler>
        <Callout type="success" title="First Run">
          On first run, you will be prompted to create an admin user. This is your super admin account for the Strapi admin panel.
        </Callout>
      </section>

      {/* Step 2: Configure Database */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-accent text-accent-foreground font-semibold">2</div>
          <h2 className="text-3xl font-bold text-foreground">Configure PostgreSQL</h2>
        </div>
        <p className="text-muted-foreground">For production, PostgreSQL is recommended. Here is how to configure it:</p>
        <Spoiler title="PostgreSQL Configuration" defaultOpen>
          <CodeBlock
            title="config/database.ts"
            language="typescript"
            code={`import path from 'path';

export default ({ env }) => {
  const client = env('DATABASE_CLIENT', 'postgres');

  const connections = {
    postgres: {
      connection: {
        connectionString: env('DATABASE_URL'),
        host: env('DATABASE_HOST', 'localhost'),
        port: env.int('DATABASE_PORT', 5432),
        database: env('DATABASE_NAME', 'strapi'),
        user: env('DATABASE_USERNAME', 'strapi'),
        password: env('DATABASE_PASSWORD', 'strapi'),
        ssl: env.bool('DATABASE_SSL', false) && {
          rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true),
        },
        schema: env('DATABASE_SCHEMA', 'public'),
      },
      pool: { 
        min: env.int('DATABASE_POOL_MIN', 2), 
        max: env.int('DATABASE_POOL_MAX', 10) 
      },
    },
  };

  return {
    connection: {
      client,
      ...connections[client],
      acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
    },
  };
};`}
          />
        </Spoiler>
        <Spoiler title="Environment Variables">
          <CodeBlock
            title=".env"
            language="bash"
            code={`# Database
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapi_db
DATABASE_USERNAME=strapi_user
DATABASE_PASSWORD=your_secure_password
DATABASE_SSL=false

# Server
HOST=0.0.0.0
PORT=1337

# Secrets (generate with: openssl rand -base64 32)
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=your_api_token_salt
ADMIN_JWT_SECRET=your_admin_jwt_secret
JWT_SECRET=your_jwt_secret
TRANSFER_TOKEN_SALT=your_transfer_token_salt`}
          />
        </Spoiler>
      </section>

      {/* Step 3: Create Components */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-accent text-accent-foreground font-semibold">3</div>
          <h2 className="text-3xl font-bold text-foreground">Create Shared Components</h2>
        </div>
        <p className="text-muted-foreground">Components are reusable field groups. Create them first before collection types.</p>
        <Callout type="info" title="Using the Admin Panel">
          Go to Content-Type Builder in the admin panel. Click &quot;Create new component&quot; and add fields. Alternatively, create JSON files directly in the src/components folder.
        </Callout>
        <Spoiler title="Contact Information Component" defaultOpen>
          <CodeBlock
            title="src/components/shared/contact-information.json"
            language="json"
            code={`{
  "collectionName": "components_shared_contact_information",
  "info": {
    "displayName": "Contact Information",
    "icon": "user",
    "description": "Reusable contact details"
  },
  "attributes": {
    "firstName": { "type": "string", "required": true, "minLength": 2, "maxLength": 50 },
    "lastName": { "type": "string", "required": true, "minLength": 2, "maxLength": 50 },
    "email": { "type": "email", "required": true },
    "phone": { "type": "string", "required": true },
    "company": { "type": "string", "required": false }
  }
}`}
          />
        </Spoiler>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/documentation/cms-reference/shared-components">
              View All Components
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Step 4: Create Collection */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-accent text-accent-foreground font-semibold">4</div>
          <h2 className="text-3xl font-bold text-foreground">Create Collection Type</h2>
        </div>
        <p className="text-muted-foreground">Collection Types store multiple entries (like posts, users, or service requests).</p>
        <Spoiler title="Service Request Collection" defaultOpen>
          <CodeBlock
            title="src/api/service-request/content-types/service-request/schema.json"
            language="json"
            code={`{
  "kind": "collectionType",
  "collectionName": "service_requests",
  "info": {
    "singularName": "service-request",
    "pluralName": "service-requests",
    "displayName": "Service Request"
  },
  "options": { "draftAndPublish": false },
  "attributes": {
    "referenceId": { "type": "string", "required": true, "unique": true },
    "contactInfo": {
      "type": "component",
      "repeatable": false,
      "component": "shared.contact-information",
      "required": true
    },
    "status": {
      "type": "enumeration",
      "enum": ["pending", "confirmed", "completed", "cancelled"],
      "default": "pending"
    }
  }
}`}
          />
        </Spoiler>
        <Callout type="warning" title="Restart Required">
          After creating or modifying content types via JSON files, restart the Strapi server for changes to take effect.
        </Callout>
      </section>

      {/* Step 5: Connect Frontend */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-accent text-accent-foreground font-semibold">5</div>
          <h2 className="text-3xl font-bold text-foreground">Connect to Next.js</h2>
        </div>
        <p className="text-muted-foreground">Fetch data from Strapi using Server Actions or API routes.</p>
        <Spoiler title="Fetch Service Requests" defaultOpen>
          <CodeBlock
            title="lib/strapi.ts"
            language="typescript"
            code={`const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

export async function fetchFromStrapi(endpoint: string) {
  const res = await fetch(\`\${STRAPI_URL}/api/\${endpoint}\`, {
    headers: {
      Authorization: \`Bearer \${STRAPI_TOKEN}\`,
      'Content-Type': 'application/json',
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error(\`Strapi error: \${res.status}\`);
  const data = await res.json();
  return data.data;
}`}
          />
        </Spoiler>
        <Spoiler title="Use in Server Component">
          <CodeBlock
            title="app/requests/page.tsx"
            language="tsx"
            code={`import { fetchFromStrapi } from '@/lib/strapi';

export default async function RequestsPage() {
  const requests = await fetchFromStrapi(
    'service-requests?populate=contactInfo'
  );

  return (
    <div>
      {requests.map((req) => (
        <div key={req.id}>
          <h3>{req.attributes.referenceId}</h3>
          <p>{req.attributes.contactInfo.firstName}</p>
        </div>
      ))}
    </div>
  );
}`}
          />
        </Spoiler>
        <Callout type="success" title="All Done!">
          You now have a working Strapi backend connected to Next.js. Explore the rest of the CMS Reference section for detailed schema documentation.
        </Callout>
      </section>

      {/* Next Steps */}
      <section className="space-y-4">
        <h2 className="text-3xl font-bold text-foreground border-b border-border pb-2">Next Steps</h2>
        <div className="responsive-grid-3">
          {[
    { title: "Form Collections", href: "/dashboard/documentation/cms-reference/form-collections", desc: "Service Requests, Contact, Quotations" },
    { title: "Content Collections", href: "/dashboard/documentation/cms-reference/content-collections", desc: "Articles, Tutorials, Case Studies" },
    { title: "Shared Components", href: "/dashboard/documentation/cms-reference/shared-components", desc: "All 18 reusable components" },
          ].map((link) => (
            <Card key={link.title} className="hover:border-accent/50 transition-colors">
              <Link href={link.href} className="block p-4">
                <h3 className="font-semibold text-foreground mb-1">{link.title}</h3>
                <p className="text-sm text-muted-foreground">{link.desc}</p>
              </Link>
            </Card>
          ))}
        </div>
      </section>
    </DocPage>
  )
}
