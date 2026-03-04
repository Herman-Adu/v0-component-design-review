"use client";

import {
  TableOfContents,
  SectionHeader,
  StepFlow,
  InfoBox,
  KeyTakeaway,
  StatsTable,
  NumberedList,
  ProcessFlow,
  FeatureGrid,
} from "@/components/molecules/article-components";
import { CodeBlock } from "@/components/atoms/code-block";
import { CodeExplanation } from "@/components/atoms/code-explanation";

const tocItems = [
  { id: "overview", title: "What Is Strapi", level: 2 },
  { id: "installation", title: "Installing Strapi", level: 2 },
  { id: "admin", title: "Admin Setup", level: 2 },
  { id: "collection", title: "Creating a Collection Type", level: 2 },
  { id: "entries", title: "Creating Entries", level: 2 },
  { id: "api", title: "Testing the API", level: 2 },
  { id: "takeaways", title: "Key Takeaways", level: 2 },
];

export function YourFirstStrapiCollectionContent() {
  return (
    <div className="flex gap-8">
      <div className="flex-1 min-w-0 space-y-8">
        {/* Overview */}
        <section>
          <SectionHeader number="01" title="What Is Strapi" id="overview" />
          <p className="text-muted-foreground leading-relaxed mt-4">
            Strapi is an open-source headless CMS that gives you a full admin
            panel and REST and GraphQL APIs out of the box. You define your
            content structure, and Strapi generates the database tables, admin
            UI, and API endpoints automatically.
          </p>
        </section>

        <h4 className="font-semibold text-foreground">What Strapi Gives You</h4>

        <FeatureGrid
          features={[
            {
              title: "Admin Panel",
              description:
                "Visual interface for creating and managing content without code",
            },
            {
              title: "REST and GraphQL APIs",
              description:
                "Auto-generated endpoints for every content type you create",
            },
            {
              title: "Role-Based Access",
              description:
                "Control who can create, read, update, and delete content",
            },
            {
              title: "Media Library",
              description: "Built-in file uploads with image optimization",
            },
          ]}
        />

        <InfoBox type="info" title="Headless CMS">
          A headless CMS provides content management without a built-in
          frontend. You fetch content via API and render it in any framework --
          Next.js, React, Vue, or mobile apps.
        </InfoBox>

        {/* Installation */}
        <section>
          <SectionHeader
            number="02"
            title="Installing Strapi"
            id="installation"
          />
          <p className="text-muted-foreground leading-relaxed mt-4">
            Strapi provides a CLI that scaffolds a complete project. The
            Quickstart option uses SQLite which requires zero configuration --
            perfect for learning.
          </p>
        </section>

        <CodeBlock
          language="bash"
          title="Create Strapi Project"
          code={`npx create-strapi-app@latest my-cms

# When prompted:
#   Installation type: Quickstart (uses SQLite)
#   This installs dependencies and starts Strapi

# Admin panel will be available at:
# http://localhost:1337/admin`}
        />

        <StepFlow
          title="Installation Steps"
          steps={[
            {
              number: 1,
              title: "Run the CLI",
              description:
                "npx create-strapi-app creates a new project with all dependencies",
            },
            {
              number: 2,
              title: "Choose Quickstart",
              description:
                "SQLite is bundled -- no database setup required for development",
            },
            {
              number: 3,
              title: "Wait for install",
              description:
                "Strapi installs, builds the admin panel, and starts the server",
            },
          ]}
        />

        <InfoBox type="tip" title="Production Database">
          Quickstart uses SQLite which is great for development. For production,
          configure PostgreSQL or MySQL in the config/database.js file.
        </InfoBox>

        {/* Admin Setup */}
        <section>
          <SectionHeader number="03" title="Admin Setup" id="admin" />
          <p className="text-muted-foreground leading-relaxed mt-4">
            When you first open the admin panel, you will create a super admin
            account. This account has full access to all content and settings.
          </p>
        </section>

        <NumberedList
          items={[
            "Open http://localhost:1337/admin in your browser",
            "Fill in the registration form with your name, email, and a strong password",
            "Click 'Let's start' to enter the admin panel",
            "You now have full access to the Content-Type Builder and Content Manager",
          ]}
        />

        {/* Collection Type */}
        <section>
          <SectionHeader
            number="04"
            title="Creating a Collection Type"
            id="collection"
          />
          <p className="text-muted-foreground leading-relaxed mt-4">
            Collection Types are for content you will have multiple entries of
            -- like blog posts, products, or contact requests. Each collection
            type gets its own API endpoint.
          </p>
        </section>

        <StepFlow
          title="Create the Collection"
          steps={[
            {
              number: 1,
              title: "Open Content-Type Builder",
              description:
                "Click Content-Type Builder in the left sidebar of the admin panel",
            },
            {
              number: 2,
              title: "Create new collection type",
              description:
                "Set display name to 'Contact Request' -- the API ID auto-generates",
            },
            {
              number: 3,
              title: "Add fields",
              description:
                "Add Text (firstName, lastName), Email (email), Long Text (message), and Enumeration (status)",
            },
            {
              number: 4,
              title: "Save",
              description:
                "Click Save. Strapi restarts and creates the database table and API endpoints",
            },
          ]}
        />

        <StatsTable
          headers={["Field", "Type", "Required", "Purpose"]}
          rows={[
            ["firstName", "Text (Short)", "Yes", "Contact's first name"],
            ["lastName", "Text (Short)", "Yes", "Contact's last name"],
            ["email", "Email", "Yes", "Contact's email address"],
            ["message", "Text (Long)", "Yes", "The message content"],
            [
              "status",
              "Enumeration",
              "No",
              "Workflow state: pending, reviewed, resolved",
            ],
          ]}
        />

        <CodeExplanation
          summary="Strapi generates database schema and API endpoints automatically from your field definitions."
          terms={[
            {
              term: "Collection Type",
              description:
                "A content type with multiple entries, like a database table. Each entry is a row.",
            },
            {
              term: "Enumeration field",
              description:
                "A field restricted to predefined values. Perfect for status workflows.",
            },
            {
              term: "API ID",
              description:
                "Auto-generated from the display name. Used in the REST API URL path.",
            },
          ]}
        />

        {/* Creating Entries */}
        <section>
          <SectionHeader number="05" title="Creating Entries" id="entries" />
          <p className="text-muted-foreground leading-relaxed mt-4">
            With your collection type defined, you can now create content
            entries through the admin panel. Entries start as drafts and must be
            published to appear in the API.
          </p>
        </section>

        <NumberedList
          items={[
            "Go to Content Manager in the left sidebar",
            "Click 'Contact Request' to see the empty collection",
            "Click 'Create new entry' and fill in the fields",
            "Click 'Save' to create a draft",
            "Click 'Publish' to make it available via the API",
          ]}
        />

        <InfoBox type="tip" title="Draft and Publish">
          Strapi supports a draft/publish workflow by default. Draft entries are
          only visible in the admin panel. Published entries appear in API
          responses. This is useful for content review processes.
        </InfoBox>

        {/* Testing API */}
        <section>
          <SectionHeader number="06" title="Testing the API" id="api" />
          <p className="text-muted-foreground leading-relaxed mt-4">
            Strapi auto-generates REST endpoints for every collection type. By
            default, all endpoints are private. You need to enable public access
            for the actions you want.
          </p>
        </section>

        <ProcessFlow
          title="API Access Setup"
          steps={[
            "Go to Settings in the admin sidebar",
            "Click Users and Permissions then Roles",
            "Click the Public role",
            "Under Contact-request, enable 'find' and 'findOne'",
            "Save and test with curl or your browser",
          ]}
        />

        <CodeBlock
          language="bash"
          title="Test the REST API"
          code={`# Fetch all contact requests
curl http://localhost:1337/api/contact-requests

# Response:
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "message": "I'd like to learn more about your services",
        "status": "pending"
      }
    }
  ],
  "meta": {
    "pagination": { "page": 1, "pageSize": 25, "total": 1 }
  }
}`}
        />

        <InfoBox type="warning" title="Security">
          Only enable public access for read operations (find, findOne) that
          should be publicly accessible. Keep create, update, and delete behind
          authentication.
        </InfoBox>

        {/* Takeaways */}
        <section>
          <SectionHeader number="07" title="Key Takeaways" id="takeaways" />
        </section>

        <KeyTakeaway>
          You have set up Strapi, created a Contact Request collection type with
          five fields, added content entries through the admin panel, and tested
          the auto-generated REST API. Strapi handles database schema, admin UI,
          and API generation so you can focus on your frontend. For production,
          swap SQLite for PostgreSQL and configure proper role-based
          permissions.
        </KeyTakeaway>
      </div>

      <aside className="hidden xl:block w-64 shrink-0">
        <div className="sticky top-8">
          <TableOfContents items={tocItems} />
        </div>
      </aside>
    </div>
  );
}
