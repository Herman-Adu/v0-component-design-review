"use client"

import { CodeBlock } from "@/components/atoms/code-block"
import { Callout } from "@/components/atoms/callout"
import { Spoiler } from "@/components/atoms/spoiler"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code } from "lucide-react"
import { DocPage, DocSectionHeader } from "@/components/molecules/doc-page"

// ─── Data ───────────────────────────────────────────────────────────
const endpoints = [
  { method: "GET", path: "/api/service-requests", description: "List all service requests" },
  { method: "GET", path: "/api/service-requests/:id", description: "Get single service request" },
  { method: "POST", path: "/api/service-requests", description: "Create service request" },
  { method: "PUT", path: "/api/service-requests/:id", description: "Update service request" },
  { method: "DELETE", path: "/api/service-requests/:id", description: "Delete service request" },
  { method: "GET", path: "/api/contact-inquiries", description: "List all contact inquiries" },
  { method: "POST", path: "/api/contact-inquiries", description: "Create contact inquiry" },
  { method: "GET", path: "/api/quotation-requests", description: "List all quotations" },
  { method: "POST", path: "/api/quotation-requests", description: "Create quotation request" },
  { method: "GET", path: "/api/site-settings", description: "Get site settings (single type)" },
  { method: "GET", path: "/api/global-seo", description: "Get global SEO config" },
  { method: "GET", path: "/api/company-info", description: "Get company information" },
]

const METHOD_COLORS: Record<string, string> = {
  GET: "bg-green-500/20 text-green-400",
  POST: "bg-blue-500/20 text-blue-400",
  PUT: "bg-amber-500/20 text-amber-400",
  DELETE: "bg-red-500/20 text-red-400",
}

const sections = [
  { id: "api-endpoints-overview", title: "API Endpoints Overview" },
  { id: "rest-api-usage", title: "REST API Usage" },
  { id: "graphql-api", title: "GraphQL API" },
  { id: "authentication-security", title: "Authentication & Security" },
  { id: "error-handling", title: "Error Handling" },
  { id: "rate-limiting", title: "Rate Limiting" },
]

// ─── Code Snippets ──────────────────────────────────────────────────
const FETCH_CODE = `import { ServiceRequest } from '@/types/strapi';

const STRAPI_URL = process.env.STRAPI_URL;
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

// Fetch all service requests with pagination
export async function getServiceRequests(page = 1, pageSize = 25) {
  const response = await fetch(
    \`\${STRAPI_URL}/api/service-requests?\` + new URLSearchParams({
      'pagination[page]': String(page),
      'pagination[pageSize]': String(pageSize),
      'populate': '*',
      'sort': 'createdAt:desc'
    }),
    {
      headers: {
        'Authorization': \`Bearer \${STRAPI_TOKEN}\`,
        'Content-Type': 'application/json'
      },
      next: { 
        tags: ['service-requests'],
        revalidate: 60 // Revalidate every minute
      }
    }
  );

  if (!response.ok) {
    throw new Error(\`Failed to fetch: \${response.statusText}\`);
  }

  const data = await response.json();
  return {
    items: data.data as ServiceRequest[],
    pagination: data.meta.pagination
  };
}

// Fetch single service request by ID
export async function getServiceRequestById(id: string) {
  const response = await fetch(
    \`\${STRAPI_URL}/api/service-requests/\${id}?populate=deep\`,
    {
      headers: {
        'Authorization': \`Bearer \${STRAPI_TOKEN}\`
      },
      next: { tags: [\`service-request-\${id}\`] }
    }
  );

  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(\`Failed to fetch: \${response.statusText}\`);
  }

  const data = await response.json();
  return data.data as ServiceRequest;
}

// Fetch by reference ID
export async function getServiceRequestByRef(referenceId: string) {
  const response = await fetch(
    \`\${STRAPI_URL}/api/service-requests?\` + new URLSearchParams({
      'filters[referenceId][$eq]': referenceId,
      'populate': '*'
    }),
    {
      headers: { 'Authorization': \`Bearer \${STRAPI_TOKEN}\` }
    }
  );

  const data = await response.json();
  return data.data[0] as ServiceRequest | undefined;
}`

const CREATE_CODE = `import { ServiceRequestInput } from '@/types/strapi';

// Create a new service request
export async function createServiceRequest(input: ServiceRequestInput) {
  // Generate reference ID
  const referenceId = generateReferenceId('SR');
  
  const response = await fetch(
    \`\${STRAPI_URL}/api/service-requests\`,
    {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${STRAPI_TOKEN}\`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: {
          referenceId,
          contactInfo: input.contactInfo,
          serviceDetails: input.serviceDetails,
          propertyAddress: input.propertyAddress,
          propertyType: input.propertyType,
          schedulePreferences: input.schedulePreferences,
          status: 'pending'
        }
      })
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to create service request');
  }

  // Revalidate cache
  revalidateTag('service-requests');

  const data = await response.json();
  return data.data;
}

// Helper to generate reference IDs
function generateReferenceId(prefix: string): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return \`\${prefix}-\${timestamp}-\${random}\`;
}

// Server Action wrapper for form submission
'use server'
export async function submitServiceRequest(formData: FormData) {
  try {
    const input = parseFormData(formData);
    const validated = serviceRequestSchema.parse(input);
    const result = await createServiceRequest(validated);
    
    return { 
      success: true, 
      referenceId: result.referenceId,
      message: 'Service request submitted successfully'
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.flatten() };
    }
    return { success: false, message: 'Failed to submit request' };
  }
}`

const FILTERS_CODE = `// Filter operators available in Strapi
const filterExamples = {
  // Exact match
  'filters[status][$eq]': 'pending',
  
  // Not equal
  'filters[status][$ne]': 'cancelled',
  
  // Less than / Greater than
  'filters[createdAt][$lt]': '2026-01-01',
  'filters[createdAt][$gt]': '2025-01-01',
  
  // Contains (case-insensitive)
  'filters[contactInfo][email][$containsi]': 'gmail',
  
  // In array
  'filters[status][$in][0]': 'pending',
  'filters[status][$in][1]': 'confirmed',
  
  // Null checks
  'filters[assignedTechnician][$null]': 'true',
  'filters[completedAt][$notNull]': 'true',
  
  // Nested component filters
  'filters[contactInfo][company][$notNull]': 'true',
  
  // Relation filters
  'filters[assignedTechnician][id][$eq]': '5',
};

// Complex query example
export async function getFilteredServiceRequests(filters: {
  status?: string[];
  propertyType?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}) {
  const params = new URLSearchParams();
  
  if (filters.status?.length) {
    filters.status.forEach((s, i) => {
      params.append(\`filters[status][\$in][\${i}]\`, s);
    });
  }
  
  if (filters.propertyType) {
    params.append('filters[propertyType][$eq]', filters.propertyType);
  }
  
  if (filters.dateFrom) {
    params.append('filters[createdAt][$gte]', filters.dateFrom);
  }
  if (filters.dateTo) {
    params.append('filters[createdAt][$lte]', filters.dateTo);
  }
  
  if (filters.search) {
    params.append('filters[$or][0][referenceId][$containsi]', filters.search);
    params.append('filters[$or][1][contactInfo][email][$containsi]', filters.search);
    params.append('filters[$or][2][contactInfo][lastName][$containsi]', filters.search);
  }
  
  params.append('sort', 'createdAt:desc');
  params.append('pagination[page]', '1');
  params.append('pagination[pageSize]', '25');
  params.append('populate', '*');
  
  return fetch(\`\${STRAPI_URL}/api/service-requests?\${params}\`, {
    headers: { 'Authorization': \`Bearer \${STRAPI_TOKEN}\` }
  });
}`

const POPULATE_CODE = `// Population controls which related data is returned

// Basic population - all top-level relations
'populate=*'

// Specific field population
'populate[contactInfo]=*'
'populate[serviceDetails]=*'

// Nested population (components within components)
'populate[serviceDetails][populate][selectedServices]=*'

// Deep population (use with caution - can be slow)
'populate=deep'

// Selective deep population
'populate[0]=contactInfo'
'populate[1]=serviceDetails.selectedServices'
'populate[2]=propertyAddress'

// Example: Efficient population for list view
export async function getServiceRequestsForList() {
  const params = new URLSearchParams({
    'populate[contactInfo][fields][0]': 'firstName',
    'populate[contactInfo][fields][1]': 'lastName',
    'populate[contactInfo][fields][2]': 'email',
    'populate[serviceDetails][fields][0]': 'urgencyLevel',
    'fields[0]': 'referenceId',
    'fields[1]': 'status',
    'fields[2]': 'createdAt',
    'fields[3]': 'propertyType',
    'pagination[pageSize]': '50',
    'sort': 'createdAt:desc'
  });
  
  return fetch(\`\${STRAPI_URL}/api/service-requests?\${params}\`, {
    headers: { 'Authorization': \`Bearer \${STRAPI_TOKEN}\` },
    next: { tags: ['service-requests-list'] }
  });
}

// Example: Full population for detail view
export async function getServiceRequestDetail(id: string) {
  return fetch(
    \`\${STRAPI_URL}/api/service-requests/\${id}?populate=deep\`,
    {
      headers: { 'Authorization': \`Bearer \${STRAPI_TOKEN}\` },
      next: { tags: [\`service-request-\${id}\`] }
    }
  );
}`

const GRAPHQL_QUERY_CODE = `# List service requests with filtering
query GetServiceRequests($status: String, $page: Int) {
  serviceRequests(
    filters: { status: { eq: $status } }
    pagination: { page: $page, pageSize: 25 }
    sort: "createdAt:desc"
  ) {
    data {
      id
      attributes {
        referenceId
        status
        propertyType
        createdAt
        contactInfo {
          firstName
          lastName
          email
          phone
        }
        serviceDetails {
          urgencyLevel
          description
          selectedServices {
            name
            category
          }
        }
      }
    }
    meta {
      pagination {
        total
        page
        pageSize
        pageCount
      }
    }
  }
}

# Get single service request with deep relations
query GetServiceRequest($id: ID!) {
  serviceRequest(id: $id) {
    data {
      id
      attributes {
        referenceId
        status
        propertyType
        contactInfo { firstName lastName email phone company }
        serviceDetails {
          urgencyLevel
          description
          preferredDate
          selectedServices { name category estimatedDuration }
        }
        propertyAddress { addressLine1 addressLine2 city postcode }
        schedulePreferences { preferredTimeSlot flexibility }
        createdAt
        updatedAt
      }
    }
  }
}`

const GRAPHQL_CLIENT_CODE = `// GraphQL client for Strapi
const GRAPHQL_URL = \`\${process.env.STRAPI_URL}/graphql\`;

async function graphqlFetch<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${process.env.STRAPI_TOKEN}\`
    },
    body: JSON.stringify({ query, variables }),
  });

  const { data, errors } = await response.json();

  if (errors) {
    throw new Error(errors[0].message);
  }

  return data as T;
}

// Usage in Server Component
export async function getServiceRequests(status?: string, page = 1) {
  return graphqlFetch<{ serviceRequests: ServiceRequestsResponse }>(
    GET_SERVICE_REQUESTS,
    { status, page }
  );
}`

const AUTH_CODE = `// Authentication patterns for Strapi API

// 1. API Token Authentication (recommended for server-to-server)
const headers = {
  'Authorization': \`Bearer \${process.env.STRAPI_TOKEN}\`,
  'Content-Type': 'application/json'
};

// 2. JWT Authentication (for user-specific operations)
async function loginUser(email: string, password: string) {
  const response = await fetch(\`\${STRAPI_URL}/api/auth/local\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: email, password })
  });

  const data = await response.json();
  return { jwt: data.jwt, user: data.user };
}

// 3. Public API Token (read-only, for client-side)
// Create in Strapi Admin > Settings > API Tokens
// Set permissions to read-only on specific content types

// 4. Custom middleware for rate limiting
// config/middlewares.ts
export default [
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      origin: [process.env.FRONTEND_URL],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      headers: ['Content-Type', 'Authorization'],
    }
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];`

const ERROR_HANDLING_CODE = `// Centralised API error handling

interface StrapiError {
  status: number;
  name: string;
  message: string;
  details?: Record<string, unknown>;
}

interface ApiResponse<T> {
  data: T | null;
  error: StrapiError | null;
}

// Type-safe API wrapper
async function apiCall<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': \`Bearer \${process.env.STRAPI_TOKEN}\`,
        'Content-Type': 'application/json',
        ...options?.headers,
      }
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      return {
        data: null,
        error: {
          status: response.status,
          name: errorBody.error?.name || 'UnknownError',
          message: errorBody.error?.message || response.statusText,
          details: errorBody.error?.details
        }
      };
    }

    const data = await response.json();
    return { data: data.data, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        status: 500,
        name: 'NetworkError',
        message: error instanceof Error ? error.message : 'Network error',
      }
    };
  }
}

// Usage
const { data, error } = await apiCall<ServiceRequest[]>(
  \`\${STRAPI_URL}/api/service-requests?populate=*\`
);

if (error) {
  switch (error.status) {
    case 401: redirect('/login');
    case 403: throw new Error('Insufficient permissions');
    case 404: notFound();
    case 429: throw new Error('Rate limit exceeded');
    default: throw new Error(error.message);
  }
}`

const RATE_LIMIT_CODE = `// Rate limiting configuration for Strapi

// 1. Built-in rate limiting via middleware
// config/middlewares.ts
export default [
  // ... other middlewares
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
      },
      // Rate limiting
      rateLimiter: {
        enabled: true,
        // Max requests per window
        max: 100,
        // Window duration in ms (15 minutes)
        window: 15 * 60 * 1000,
        // Delay after reaching threshold
        delayAfter: 80,
        // Delay increment in ms
        timeWait: 1000,
      }
    }
  }
];

// 2. Custom rate limiting in API routes (Next.js)
import { NextResponse } from 'next/server';

const rateLimit = new Map<string, { count: number; resetTime: number }>();

export function rateLimitMiddleware(
  request: Request,
  limit = 30,
  windowMs = 60000
) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  const record = rateLimit.get(ip);

  if (!record || now > record.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + windowMs });
    return null; // Allowed
  }

  if (record.count >= limit) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((record.resetTime - now) / 1000)),
          'X-RateLimit-Limit': String(limit),
          'X-RateLimit-Remaining': '0',
        }
      }
    );
  }

  record.count++;
  return null; // Allowed
}`

// ─── Component ──────────────────────────────────────────────────────
export default function APIDocumentationPage() {
  return (
    <DocPage
      title="API & GraphQL"
      description="Complete API documentation for REST endpoints and GraphQL queries. Includes authentication patterns, error handling, and custom controller examples."
      icon={Code}
      badges={[
        { label: "REST API", className: "bg-green-500/15 text-green-400 border-green-500/30" },
        { label: "GraphQL", className: "bg-purple-500/15 text-purple-400 border-purple-500/30" },
        { label: "JWT Auth", className: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
        { label: "Rate Limiting", className: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
      ]}
      meta={[
        { label: "Audience", value: "DevOps / Developer" },
        { label: "Last Updated", value: "2026-02-10" },
      ]}
      sections={sections}
    >
      {/* API Endpoints Overview */}
      <section className="space-y-6">
        <DocSectionHeader id="api-endpoints-overview">API Endpoints Overview</DocSectionHeader>

        <Callout type="info" title="Base URL Configuration">
          All API endpoints use the base URL configured in your environment. For development, this
          is typically http://localhost:1337. For production, use your deployed Strapi URL.
        </Callout>

        <div className="border border-border rounded-lg overflow-hidden">
          <div className="bg-muted/50 px-4 py-2 border-b border-border">
            <p className="text-sm font-medium text-foreground">Available Endpoints</p>
          </div>
          <div className="divide-y divide-border">
            {endpoints.map((endpoint, index) => (
              <div key={index} className="flex items-center gap-4 px-4 py-3">
                <Badge className={METHOD_COLORS[endpoint.method] ?? ""}>
                  {endpoint.method}
                </Badge>
                <code className="text-sm font-mono text-foreground">{endpoint.path}</code>
                <span className="text-sm text-muted-foreground ml-auto">{endpoint.description}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REST API Usage */}
      <section className="space-y-6">
        <DocSectionHeader id="rest-api-usage">REST API Usage</DocSectionHeader>

        <Tabs defaultValue="fetch" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="fetch">Fetching Data</TabsTrigger>
            <TabsTrigger value="create">Creating Data</TabsTrigger>
            <TabsTrigger value="filters">Filters & Sort</TabsTrigger>
            <TabsTrigger value="populate">Population</TabsTrigger>
          </TabsList>

          <TabsContent value="fetch" className="space-y-4">
            <Spoiler title="Fetch Service Requests" defaultOpen>
              <CodeBlock title="lib/api/service-requests.ts" language="typescript" code={FETCH_CODE} />
            </Spoiler>
          </TabsContent>

          <TabsContent value="create" className="space-y-4">
            <Spoiler title="Create Service Request" defaultOpen>
              <CodeBlock title="lib/api/service-requests.ts" language="typescript" code={CREATE_CODE} />
            </Spoiler>
          </TabsContent>

          <TabsContent value="filters" className="space-y-4">
            <Spoiler title="Filtering & Sorting" defaultOpen>
              <CodeBlock title="lib/api/filters.ts" language="typescript" code={FILTERS_CODE} />
            </Spoiler>
          </TabsContent>

          <TabsContent value="populate" className="space-y-4">
            <Spoiler title="Population Strategies" defaultOpen>
              <CodeBlock title="lib/api/population.ts" language="typescript" code={POPULATE_CODE} />
            </Spoiler>
          </TabsContent>
        </Tabs>
      </section>

      {/* GraphQL API */}
      <section className="space-y-6">
        <DocSectionHeader id="graphql-api">GraphQL API</DocSectionHeader>

        <Callout type="info" title="Enable GraphQL Plugin">
          GraphQL is available via the @strapi/plugin-graphql package. Install it and restart Strapi
          to access the GraphQL playground at /graphql.
        </Callout>

        <Spoiler title="GraphQL Queries" defaultOpen>
          <CodeBlock title="GraphQL Examples" language="graphql" code={GRAPHQL_QUERY_CODE} />
        </Spoiler>

        <Spoiler title="GraphQL Client Setup">
          <CodeBlock title="lib/api/graphql-client.ts" language="typescript" code={GRAPHQL_CLIENT_CODE} />
        </Spoiler>
      </section>

      {/* Authentication & Security */}
      <section className="space-y-6">
        <DocSectionHeader id="authentication-security">{"Authentication & Security"}</DocSectionHeader>

        <Callout type="warning" title="Token Security">
          Never expose your full-access API token to the client. Use server-side API routes or Server
          Components to make authenticated requests. Create separate read-only tokens for any
          client-side data fetching.
        </Callout>

        <Spoiler title="Authentication Patterns" defaultOpen>
          <CodeBlock title="lib/api/auth.ts" language="typescript" code={AUTH_CODE} />
        </Spoiler>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-green-500/20">
            <CardHeader>
              <CardTitle className="text-base text-green-400">API Token (Server-to-Server)</CardTitle>
              <CardDescription>Use for Next.js Server Components and API routes. Full or read-only access controlled via Strapi Admin.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-base text-blue-400">JWT Authentication (User Sessions)</CardTitle>
              <CardDescription>Use for user-specific operations like profile updates. Token issued on login, stored in httpOnly cookie.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Error Handling */}
      <section className="space-y-6">
        <DocSectionHeader id="error-handling">Error Handling</DocSectionHeader>

        <Spoiler title="Centralised Error Handler" defaultOpen>
          <CodeBlock title="lib/api/error-handler.ts" language="typescript" code={ERROR_HANDLING_CODE} />
        </Spoiler>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { code: "400", label: "Bad Request", desc: "Invalid input or validation error", color: "amber" },
            { code: "401", label: "Unauthorized", desc: "Missing or invalid authentication", color: "red" },
            { code: "403", label: "Forbidden", desc: "Insufficient permissions for resource", color: "red" },
            { code: "404", label: "Not Found", desc: "Resource does not exist", color: "blue" },
            { code: "429", label: "Rate Limited", desc: "Too many requests, retry later", color: "purple" },
            { code: "500", label: "Server Error", desc: "Internal Strapi error", color: "red" },
          ].map((e) => (
            <Card key={e.code} className={`border-${e.color}-500/20`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg text-${e.color}-400`}>{e.code}</CardTitle>
                <CardDescription className="font-medium">{e.label}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{e.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Rate Limiting */}
      <section className="space-y-6">
        <DocSectionHeader id="rate-limiting">Rate Limiting</DocSectionHeader>

        <Spoiler title="Rate Limit Configuration" defaultOpen>
          <CodeBlock title="config/middlewares.ts + API route" language="typescript" code={RATE_LIMIT_CODE} />
        </Spoiler>

        <Callout type="warning" title="Production Defaults">
          Strapi default rate limiting is 100 requests per 15-minute window per IP. Adjust these
          values based on your expected traffic patterns. The Next.js middleware layer adds a second
          rate limit for the frontend API routes.
        </Callout>
      </section>
    </DocPage>
  )
}
