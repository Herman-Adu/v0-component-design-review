export type TutorialLevel = "beginner" | "intermediate" | "advanced"
export type TutorialCategory = "components" | "forms" | "security" | "state-management" | "performance" | "getting-started" | "cms" | "testing" | "devops" | "email"

export interface TutorialStep {
  title: string
  content: string
  code?: string
  hint?: string
  solution?: string
  explanation?: string
}

export interface Tutorial {
  id: string
  slug: string
  title: string
  description: string
  level: TutorialLevel
  category: TutorialCategory
  duration: string
  publishedAt: string
  tags: string[]
  prerequisites: string[]
  learningOutcomes: string[]
  steps: TutorialStep[]
}

export const tutorials: Tutorial[] = [
  {
    id: "1",
    slug: "building-atomic-component",
    title: "Building Your First Atomic Component",
    description: "Learn to create reusable input components following atomic design principles",
    level: "beginner",
    category: "components",
    duration: "20 min",
    publishedAt: "2024-01-15",
    tags: ["atomic-design", "components", "typescript", "accessibility"],
    prerequisites: ["Basic React knowledge", "TypeScript fundamentals"],
    learningOutcomes: [
      "Create atomic components with proper TypeScript types",
      "Implement accessibility features (ARIA labels)",
      "Build reusable component interfaces",
    ],
    steps: [
      {
        title: "Understanding the Requirements",
        content: "A FormInput atom needs to accept a label, name, error message, and all standard input props while maintaining accessibility.",
        code: `// Create a FormInput component that:
// 1. Accepts label, name, error props
// 2. Extends standard HTML input attributes
// 3. Shows error message when provided
// 4. Has accessible ARIA labels
// 5. Uses proper TypeScript types`,
        hint: "Think about the interface first. What props does a reusable input need?",
      },
      {
        title: "Defining the Interface",
        content: "Start by defining a TypeScript interface that extends HTML input attributes.",
        solution: `interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  name: string
  error?: string
}`,
        explanation: "Extending React.InputHTMLAttributes gives us all standard input props (onChange, value, etc.) without manually typing them.",
      },
      {
        title: "Building the Component",
        content: "Now implement the component with proper accessibility attributes.",
        solution: `export function FormInput({ 
  label, 
  name, 
  error, 
  className = '',
  ...props 
}: FormInputProps) {
  return (
    <div className="space-y-2">
      <label 
        htmlFor={name} 
        className="block text-sm font-medium"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        aria-invalid={!!error}
        aria-describedby={error ? \`\${name}-error\` : undefined}
        className={\`w-full px-4 py-2 rounded-lg border \${error ? 'border-red-500' : 'border-border'}\`}
        {...props}
      />
      {error && (
        <p id={\`\${name}-error\`} className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}`,
        explanation: "The aria-invalid and aria-describedby attributes help screen readers understand error states. Props spreading allows consumers to pass any HTML input attribute.",
      },
    ],
  },
  {
    id: "2",
    slug: "server-side-validation",
    title: "Server-Side Validation with Server Actions",
    description: "Implement bulletproof validation using Next.js Server Actions and Zod",
    level: "intermediate",
    category: "security",
    duration: "30 min",
    publishedAt: "2024-02-01",
    tags: ["server-actions", "zod", "validation", "security"],
    prerequisites: ["Basic Next.js App Router", "Understanding of Zod schemas"],
    learningOutcomes: [
      "Create secure server actions",
      "Implement multi-layer validation",
      "Build type-safe error responses",
    ],
    steps: [
      {
        title: "Understanding the Pattern",
        content: "Server actions must validate all incoming data. Never trust client-side validation alone.",
        code: `// Create a server action that:
// 1. Uses "use server" directive
// 2. Validates with Zod schema
// 3. Sanitizes string inputs
// 4. Returns ActionResult<T> type
// 5. Handles validation errors gracefully`,
        hint: "Server actions receive FormData or plain objects and return serializable data.",
      },
      {
        title: "Defining the Schema",
        content: "Create a Zod schema that defines your validation rules.",
        solution: `const ContactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(1000),
})`,
      },
      {
        title: "Creating the Action Result Type",
        content: "Define a discriminated union for type-safe results.",
        solution: `type ActionResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }`,
        explanation: "This pattern allows TypeScript to narrow the type based on the success property.",
      },
      {
        title: "Implementing the Server Action",
        content: "Build the complete server action with validation and error handling.",
        solution: `"use server"

export async function submitContact(
  formData: unknown
): Promise<ActionResult<{ id: string }>> {
  // Validate
  const result = ContactSchema.safeParse(formData)
  
  if (!result.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: result.error.flatten().fieldErrors
    }
  }
  
  // Process validated data
  const id = await saveContact(result.data)
  
  return { success: true, data: { id } }
}`,
      },
    ],
  },
  {
    id: "3",
    slug: "zustand-form-store",
    title: "Building a Form Store with Zustand",
    description: "Create persistent form state with Zustand for multi-step forms",
    level: "intermediate",
    category: "state-management",
    duration: "25 min",
    publishedAt: "2024-02-15",
    tags: ["zustand", "state-management", "forms", "persistence"],
    prerequisites: ["React hooks", "TypeScript generics"],
    learningOutcomes: [
      "Create typed Zustand stores",
      "Implement the persist middleware",
      "Build form navigation logic",
    ],
    steps: [
      {
        title: "Understanding the Requirements",
        content: "A multi-step form store needs: current step tracking, form data storage, navigation methods, and persistence.",
        code: `// Create a store that:
// 1. Tracks current step
// 2. Stores form data
// 3. Provides navigation (next, prev, goTo)
// 4. Persists to localStorage
// 5. Has reset functionality`,
      },
      {
        title: "Defining the Store Interface",
        content: "Start with the TypeScript interface for your store.",
        solution: `interface ContactFormState {
  currentStep: number
  formData: {
    name: string
    email: string
    message: string
  }
  
  // Actions
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: number) => void
  updateField: <K extends keyof ContactFormState['formData']>(
    field: K,
    value: ContactFormState['formData'][K]
  ) => void
  reset: () => void
}`,
      },
      {
        title: "Creating the Store",
        content: "Implement the store with persist middleware.",
        solution: `import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const initialState = {
  currentStep: 1,
  formData: { name: '', email: '', message: '' }
}

export const useContactStore = create<ContactFormState>()(
  persist(
    (set) => ({
      ...initialState,
      
      nextStep: () => set((state) => ({
        currentStep: Math.min(state.currentStep + 1, 5)
      })),
      
      prevStep: () => set((state) => ({
        currentStep: Math.max(state.currentStep - 1, 1)
      })),
      
      goToStep: (step) => set({ currentStep: step }),
      
      updateField: (field, value) => set((state) => ({
        formData: { ...state.formData, [field]: value }
      })),
      
      reset: () => set(initialState)
    }),
    { name: 'contact-form' }
  )
)`,
        explanation: "The persist middleware automatically saves to localStorage and rehydrates on mount.",
      },
    ],
  },
  {
    id: "4",
    slug: "rate-limiting-implementation",
    title: "Implementing Rate Limiting for Server Actions",
    description: "Protect your server actions from abuse with in-memory rate limiting",
    level: "advanced",
    category: "security",
    duration: "35 min",
    publishedAt: "2024-03-01",
    tags: ["rate-limiting", "security", "server-actions", "protection"],
    prerequisites: ["Server Actions", "Map data structure", "IP identification"],
    learningOutcomes: [
      "Build a sliding window rate limiter",
      "Extract client identifiers",
      "Integrate rate limiting with server actions",
    ],
    steps: [
      {
        title: "Understanding Rate Limiting",
        content: "Rate limiting prevents abuse by restricting how many requests a client can make in a time window.",
        code: `// Build a rate limiter that:
// 1. Uses sliding window algorithm
// 2. Configurable max requests and window
// 3. Identifies clients by IP
// 4. Returns remaining requests
// 5. Auto-cleans expired entries`,
      },
      {
        title: "Creating the Rate Limiter Class",
        content: "Implement the core rate limiting logic.",
        solution: `interface RateLimitEntry {
  count: number
  resetTime: number
}

export function createRateLimiter(maxRequests: number, windowMs: number) {
  const requests = new Map<string, RateLimitEntry>()
  
  return {
    check(identifier: string): { allowed: boolean; remaining: number } {
      const now = Date.now()
      const entry = requests.get(identifier)
      
      // Clean expired entry
      if (entry && now > entry.resetTime) {
        requests.delete(identifier)
      }
      
      const current = requests.get(identifier)
      
      if (!current) {
        requests.set(identifier, { count: 1, resetTime: now + windowMs })
        return { allowed: true, remaining: maxRequests - 1 }
      }
      
      if (current.count >= maxRequests) {
        return { allowed: false, remaining: 0 }
      }
      
      current.count++
      return { allowed: true, remaining: maxRequests - current.count }
    }
  }
}`,
      },
      {
        title: "Extracting Client Identifier",
        content: "Get the client IP from request headers.",
        solution: `import { headers } from 'next/headers'

export async function getClientIdentifier(): Promise<string> {
  const headersList = await headers()
  
  return (
    headersList.get('x-forwarded-for')?.split(',')[0] ||
    headersList.get('x-real-ip') ||
    'unknown'
  )
}`,
      },
      {
        title: "Integrating with Server Actions",
        content: "Add rate limiting to your server action pipeline.",
        solution: `const rateLimiter = createRateLimiter(5, 15 * 60 * 1000)

export async function submitForm(data: unknown) {
  const clientId = await getClientIdentifier()
  const { allowed, remaining } = rateLimiter.check(clientId)
  
  if (!allowed) {
    return {
      success: false,
      error: 'Too many requests. Please try again later.'
    }
  }
  
  // Continue with validation and processing
}`,
      },
    ],
  },
  // BEGINNER TUTORIALS - Getting Started
  {
    id: "5",
    slug: "your-first-nextjs-app",
    title: "Your First Next.js 16 Application",
    description: "Build a complete contact form application from scratch using Next.js 16 App Router",
    level: "beginner",
    category: "getting-started",
    duration: "45 min",
    publishedAt: "2026-02-05",
    tags: ["nextjs", "app-router", "beginner", "setup"],
    prerequisites: ["Basic JavaScript knowledge", "Node.js installed", "Code editor"],
    learningOutcomes: [
      "Create a new Next.js 16 project",
      "Understand the App Router file structure",
      "Build your first page and layout",
      "Add basic styling with Tailwind CSS",
    ],
    steps: [
      {
        title: "Creating Your Project",
        content: "Start by creating a new Next.js 16 project using the create-next-app CLI.",
        code: `# Open your terminal and run:
npx create-next-app@latest my-first-app

# When prompted, select:
# - TypeScript: Yes
# - ESLint: Yes
# - Tailwind CSS: Yes
# - src/ directory: No
# - App Router: Yes
# - Import alias: @/*`,
        hint: "Make sure you have Node.js 18+ installed. Check with: node --version",
      },
      {
        title: "Understanding the File Structure",
        content: "Next.js App Router uses a file-based routing system. Let's explore what was created.",
        solution: `my-first-app/
├── app/
│   ├── layout.tsx      # Root layout (wraps all pages)
│   ├── page.tsx        # Homepage (/)
│   └── globals.css     # Global styles
├── public/             # Static files (images, etc.)
├── next.config.mjs     # Next.js configuration
├── tailwind.config.ts  # Tailwind configuration
└── package.json        # Dependencies`,
        explanation: "The app/ folder is where all your pages live. Each folder becomes a URL route, and page.tsx is what gets rendered.",
      },
      {
        title: "Building Your First Page",
        content: "Replace the default homepage with a simple contact page.",
        solution: `// app/page.tsx
export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Contact Us
        </h1>
        <form className="space-y-4">
          <div>
            <label 
              htmlFor="name" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your name"
            />
          </div>
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="you@example.com"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Send Message
          </button>
        </form>
      </div>
    </main>
  )
}`,
        explanation: "This creates a styled contact form using Tailwind CSS classes. The form doesn't submit yet - we'll add that functionality next.",
      },
      {
        title: "Running Your Application",
        content: "Start the development server and see your app in action.",
        code: `# In your terminal, run:
npm run dev

# Then open your browser to:
# http://localhost:3000`,
        hint: "The development server supports hot reload - changes you make will appear instantly without refreshing.",
      },
      {
        title: "Adding a Server Action",
        content: "Create a server action to handle form submissions securely.",
        solution: `// app/actions.ts
"use server"

export async function submitContact(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  
  // Validate
  if (!name || !email) {
    return { success: false, error: "All fields are required" }
  }
  
  // In production, you'd save to a database here
  console.log("Contact submission:", { name, email })
  
  return { success: true, message: "Thanks for contacting us!" }
}`,
        explanation: "Server Actions run on the server, keeping your data handling secure. The 'use server' directive marks this as server-only code.",
      },
    ],
  },
  {
    id: "6",
    slug: "your-first-strapi-collection",
    title: "Your First Strapi Collection Type",
    description: "Set up Strapi CMS and create your first collection type for managing content",
    level: "beginner",
    category: "cms",
    duration: "40 min",
    publishedAt: "2026-02-05",
    tags: ["strapi", "cms", "headless", "beginner"],
    prerequisites: ["Node.js 18+", "Basic understanding of REST APIs", "Code editor"],
    learningOutcomes: [
      "Install and configure Strapi",
      "Create a collection type",
      "Add fields and configure the content type",
      "Create content entries via the admin panel",
    ],
    steps: [
      {
        title: "Installing Strapi",
        content: "Create a new Strapi project using the CLI installer.",
        code: `# Create a new Strapi project
npx create-strapi-app@latest my-cms

# When prompted:
# - Installation type: Quickstart (SQLite)
# - or Custom if you want PostgreSQL

# This will install and start Strapi
# Admin panel: http://localhost:1337/admin`,
        hint: "Quickstart uses SQLite which is perfect for development. For production, you'll want PostgreSQL or MySQL.",
      },
      {
        title: "Creating an Admin Account",
        content: "When Strapi starts, you'll be prompted to create your first admin user.",
        solution: `# Visit http://localhost:1337/admin
# You'll see a registration form:

First name: [Your name]
Last name: [Your name]
Email: admin@example.com
Password: [Strong password]

# Click "Let's start" to enter the admin panel`,
        explanation: "This creates a super admin account. In production, you'd want to set up proper roles and permissions for your team.",
      },
      {
        title: "Creating Your First Collection Type",
        content: "Collection Types are for content you'll have multiple entries of, like blog posts or products.",
        solution: `# In the Strapi admin:

1. Go to Content-Type Builder (left sidebar)
2. Click "Create new collection type"
3. Set the display name: "Contact Request"
4. API ID will auto-generate: "contact-request"
5. Click "Continue"

# Now add fields:

1. Click "Add another field"
2. Select "Text" and name it "firstName"
3. Go to Advanced Settings and check "Required"
4. Save

5. Add another "Text" field named "lastName" as Required
6. Add "Email" field named "email" as Required
7. Add "Text (Long text)" named "message" as Required
8. Add "Enumeration" named "status" with values: pending, reviewed, resolved

9. Click "Save" (top right)`,
        explanation: "Strapi will create the database tables and API endpoints automatically. You now have REST and GraphQL APIs ready to use.",
      },
      {
        title: "Creating Your First Entry",
        content: "Add content via the admin panel.",
        solution: `# In the Strapi admin:

1. Go to Content Manager (left sidebar)
2. Click "Contact Request"
3. Click "Create new entry"
4. Fill in the fields:
   - firstName: John
   - lastName: Doe
   - email: john@example.com
   - message: I'd like to learn more about your services
   - status: pending
5. Click "Save"
6. Click "Publish" to make it available via API`,
        hint: "Draft entries won't appear in the API until published. This is useful for review workflows.",
      },
      {
        title: "Testing Your API",
        content: "Strapi automatically creates REST endpoints for your collection types.",
        code: `# First, enable public access:
# Settings → Users & Permissions → Roles → Public
# Under "Contact-request", check "find" and "findOne"
# Save

# Now test the API:
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
        "message": "I'd like to learn more...",
        "status": "pending"
      }
    }
  ]
}`,
        explanation: "By default, all endpoints are private. You need to explicitly enable access for public or authenticated roles.",
      },
    ],
  },
  {
    id: "7",
    slug: "writing-your-first-tests",
    title: "Writing Your First Tests with Vitest",
    description: "Learn test-driven development basics by writing unit tests for a React component",
    level: "beginner",
    category: "testing",
    duration: "35 min",
    publishedAt: "2026-02-05",
    tags: ["testing", "vitest", "react-testing-library", "tdd"],
    prerequisites: ["Basic React knowledge", "A Next.js project"],
    learningOutcomes: [
      "Set up Vitest and React Testing Library",
      "Write your first unit test",
      "Test component behavior and user interactions",
      "Run tests and interpret results",
    ],
    steps: [
      {
        title: "Installing Testing Dependencies",
        content: "Add Vitest and React Testing Library to your project.",
        code: `# Install testing dependencies
npm install -D vitest @vitejs/plugin-react jsdom
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event

# Create vitest.config.ts in your project root`,
        hint: "Vitest is a fast, Vite-powered test runner that works great with modern React projects.",
      },
      {
        title: "Configuring Vitest",
        content: "Create the configuration file for Vitest.",
        solution: `// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
})`,
      },
      {
        title: "Creating the Setup File",
        content: "Set up testing utilities that run before each test.",
        solution: `// vitest.setup.ts
import '@testing-library/jest-dom'`,
        explanation: "This import adds useful matchers like toBeInTheDocument() and toHaveTextContent().",
      },
      {
        title: "Writing Your First Test",
        content: "Create a test file for a simple Button component.",
        solution: `// components/button.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'

// The component we're testing
function Button({ onClick, children }) {
  return (
    <button onClick={onClick} className="px-4 py-2 bg-blue-600 text-white rounded">
      {children}
    </button>
  )
}

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })
  
  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    await userEvent.click(screen.getByRole('button'))
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})`,
        explanation: "We use vi.fn() to create a mock function, then verify it was called after clicking the button.",
      },
      {
        title: "Running Your Tests",
        content: "Add a test script and run your tests.",
        code: `# Add to package.json scripts:
"scripts": {
  "test": "vitest",
  "test:run": "vitest run"
}

# Run tests in watch mode:
npm test

# Run tests once:
npm run test:run

# Expected output:
# ✓ components/button.test.tsx (2)
#   ✓ Button (2)
#     ✓ renders with correct text
#     ✓ calls onClick when clicked`,
        hint: "Watch mode reruns tests automatically when you change files - great for TDD!",
      },
    ],
  },
  {
    id: "8",
    slug: "connecting-nextjs-to-strapi",
    title: "Connecting Next.js to Strapi API",
    description: "Fetch and display Strapi content in your Next.js application",
    level: "intermediate",
    category: "cms",
    duration: "30 min",
    publishedAt: "2026-02-05",
    tags: ["nextjs", "strapi", "api", "data-fetching"],
    prerequisites: ["Completed 'Your First Next.js App'", "Completed 'Your First Strapi Collection'"],
    learningOutcomes: [
      "Set up environment variables for API connection",
      "Create a typed API client",
      "Fetch data in Server Components",
      "Handle loading and error states",
    ],
    steps: [
      {
        title: "Setting Up Environment Variables",
        content: "Configure your Next.js app to connect to Strapi.",
        code: `# Create .env.local in your Next.js project root
STRAPI_URL=http://localhost:1337
STRAPI_TOKEN=your-api-token-here

# Generate an API token in Strapi:
# Settings → API Tokens → Create new API Token
# Name: Next.js Frontend
# Token type: Full access (or custom)
# Copy the token to your .env.local`,
        hint: "Never commit API tokens to git. Add .env.local to your .gitignore file.",
      },
      {
        title: "Creating a Type-Safe API Client",
        content: "Build a reusable client for fetching Strapi data.",
        solution: `// lib/strapi.ts
interface StrapiResponse<T> {
  data: T
  meta: {
    pagination?: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

interface ContactRequest {
  id: number
  attributes: {
    firstName: string
    lastName: string
    email: string
    message: string
    status: 'pending' | 'reviewed' | 'resolved'
    createdAt: string
  }
}

export async function getContactRequests(): Promise<ContactRequest[]> {
  const response = await fetch(
    \`\${process.env.STRAPI_URL}/api/contact-requests\`,
    {
      headers: {
        Authorization: \`Bearer \${process.env.STRAPI_TOKEN}\`,
      },
      next: { revalidate: 60 }, // Cache for 60 seconds
    }
  )
  
  if (!response.ok) {
    throw new Error('Failed to fetch contact requests')
  }
  
  const json: StrapiResponse<ContactRequest[]> = await response.json()
  return json.data
}`,
        explanation: "We use TypeScript interfaces to ensure type safety. The next.revalidate option enables ISR caching.",
      },
      {
        title: "Displaying Data in a Server Component",
        content: "Fetch and render Strapi data in a Next.js page.",
        solution: `// app/contacts/page.tsx
import { getContactRequests } from '@/lib/strapi'

export default async function ContactsPage() {
  const contacts = await getContactRequests()
  
  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Contact Requests</h1>
      
      <div className="space-y-4">
        {contacts.map((contact) => (
          <div 
            key={contact.id}
            className="p-4 border rounded-lg bg-white shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-semibold">
                  {contact.attributes.firstName} {contact.attributes.lastName}
                </h2>
                <p className="text-sm text-gray-600">
                  {contact.attributes.email}
                </p>
              </div>
              <span className={\`px-2 py-1 text-xs rounded-full \${
                contact.attributes.status === 'resolved' 
                  ? 'bg-green-100 text-green-800'
                  : contact.attributes.status === 'reviewed'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
              }\`}>
                {contact.attributes.status}
              </span>
            </div>
            <p className="mt-2 text-gray-700">
              {contact.attributes.message}
            </p>
          </div>
        ))}
      </div>
    </main>
  )
}`,
        explanation: "Server Components can directly await async functions. No useEffect or useState needed!",
      },
      {
        title: "Adding Error Handling",
        content: "Handle API errors gracefully with error boundaries.",
        solution: `// app/contacts/error.tsx
"use client"

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div className="max-w-4xl mx-auto p-8 text-center">
      <h2 className="text-xl font-semibold text-red-600 mb-4">
        Something went wrong!
      </h2>
      <p className="text-gray-600 mb-4">{error.message}</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Try again
      </button>
    </div>
  )
}`,
      },
    ],
  },
  {
    id: "9",
    slug: "understanding-react-hydration",
    title: "Understanding React Hydration: Your First SSR Debug",
    description: "Learn what the Virtual DOM is, how server-side rendering works, why hydration errors happen, and how to read and fix them confidently",
    level: "beginner",
    category: "getting-started",
    duration: "25 min",
    publishedAt: "2026-02-05",
    tags: ["react", "hydration", "ssr", "debugging", "next.js"],
    prerequisites: ["Basic React knowledge (components, props, state)", "Understanding of HTML and JavaScript"],
    learningOutcomes: [
      "Understand what the Virtual DOM is and why React uses it",
      "Explain the difference between server-side and client-side rendering",
      "Understand what hydration is and why it can fail",
      "Read and interpret hydration error messages",
      "Apply basic fixes for common hydration mismatches",
    ],
    steps: [
      {
        title: "What is the Virtual DOM?",
        content: "Before understanding hydration, you need to understand the Virtual DOM. When you build a website with plain HTML, the browser creates a tree structure called the DOM (Document Object Model) - think of it like a family tree where each HTML element is a node. Changing any node directly is slow because the browser has to recalculate layouts and repaint the screen. React solves this by keeping its own lightweight copy of the DOM in memory - this is the Virtual DOM. When your component's state changes, React first updates this lightweight copy, then compares it with the previous version to find what actually changed (a process called 'reconciliation'), and only updates the real DOM for those specific changes. This is why React apps feel fast - instead of rebuilding the entire page, React surgically updates just the parts that changed.",
        code: `// When you write JSX like this:
function Welcome() {
  return <h1 className="title">Hello World</h1>
}

// React creates a Virtual DOM object like this:
{
  type: 'h1',
  props: {
    className: 'title',
    children: 'Hello World'
  }
}

// This lightweight object is MUCH faster to compare
// than manipulating the actual browser DOM`,
        hint: "Think of the Virtual DOM as a blueprint. It is cheaper to compare two blueprints than to demolish and rebuild walls.",
      },
      {
        title: "Server-Side Rendering Explained",
        content: "In a traditional React app (called a Single Page Application or SPA), the server sends an empty HTML shell and a large JavaScript file. The browser downloads the JavaScript, executes it, and React builds the entire page from scratch. The user sees a blank screen until all of this completes. Server-Side Rendering (SSR) takes a different approach: the server runs your React components, generates the actual HTML, and sends that complete HTML to the browser. The user sees content immediately - no waiting for JavaScript to download and execute. This is faster for the user and better for search engines (SEO) because they can read the content directly. Next.js uses SSR by default for all pages.",
        code: `// SPA (Client-Side Only) - What the browser receives:
<html>
  <body>
    <div id="root"></div>           <!-- Empty! -->
    <script src="bundle.js"></script> <!-- Everything here -->
  </body>
</html>
// User sees blank screen until bundle.js downloads and executes

// SSR (Server-Side Rendering) - What the browser receives:
<html>
  <body>
    <div id="root">
      <h1>Welcome to Our App</h1>  <!-- Real content! -->
      <nav>...</nav>                 <!-- Already visible -->
      <main>...</main>               <!-- User sees this immediately -->
    </div>
    <script src="bundle.js"></script> <!-- Still needed for interactivity -->
  </body>
</html>
// User sees content immediately, then JS adds interactivity`,
        hint: "SSR is like sending a fully assembled piece of furniture. SPA is like sending flat-pack with instructions - it takes time before you can use it.",
      },
      {
        title: "What is Hydration?",
        content: "Here is the key insight: SSR sends complete HTML, but that HTML is static - buttons do not respond to clicks, forms cannot submit, dropdowns will not open. The JavaScript still needs to run to make things interactive. Hydration is the process where React 'wakes up' the server-rendered HTML by attaching event listeners and connecting it to React's state management system. During hydration, React walks through the server-rendered HTML and matches it against what the client-side React would render. If they match, React simply attaches the interactivity. If they do not match, React logs a hydration error because it cannot safely merge two different versions of the UI.",
        code: `// Server generates this HTML and sends it to the browser:
<button class="btn">Click me (0 times)</button>

// Then React hydration runs on the client:
// Step 1: React renders the component in memory (Virtual DOM)
// Step 2: React compares its Virtual DOM to the actual HTML
// Step 3: If they match, React attaches the onClick handler
// Step 4: The button is now interactive!

// But if the server HTML said "Click me (0 times)"
// and the client React renders "Click me (1 time)"...
// MISMATCH! React cannot safely attach interactivity
// because the HTML it expects does not match what exists`,
        explanation: "Think of hydration like a hand fitting into a glove. The glove (server HTML) must match the hand (client React). If the glove has 4 fingers and the hand has 5, it will not work.",
      },
      {
        title: "Why Hydration Errors Happen",
        content: "Hydration errors occur when the HTML generated on the server is different from what React would generate on the client. The most common causes are: (1) Using browser-only APIs like window, localStorage, or Date.now() - these do not exist on the server. (2) Random values like Math.random() or crypto.randomUUID() that produce different results each time. (3) Date/time formatting that differs based on the server's timezone vs the user's timezone. (4) Conditional rendering based on client state - for example, showing different content based on screen size before React has a chance to measure the screen. (5) Third-party libraries that generate random IDs internally (this is what happened with our Radix UI sidebar).",
        code: `// COMMON MISTAKE 1: Browser-only APIs
function UserGreeting() {
  // window does not exist on the server!
  const name = window.localStorage.getItem('name')
  return <p>Hello, {name}</p>
  // Server renders: <p>Hello, </p>  (null)
  // Client renders: <p>Hello, John</p>
  // HYDRATION MISMATCH!
}

// COMMON MISTAKE 2: Random values
function UniqueId() {
  const id = Math.random().toString(36)
  return <div id={id}>Content</div>
  // Server renders: <div id="abc123">
  // Client renders: <div id="xyz789">
  // HYDRATION MISMATCH!
}

// COMMON MISTAKE 3: Time-dependent rendering
function Clock() {
  return <span>{new Date().toLocaleTimeString()}</span>
  // Server renders at 10:00:01 AM
  // Client hydrates at 10:00:02 AM
  // HYDRATION MISMATCH!
}`,
        hint: "Ask yourself: will this code produce the exact same output on the server and in the browser? If not, you have a hydration risk.",
      },
      {
        title: "Reading a Hydration Error Message",
        content: "Next.js hydration errors might look intimidating, but they follow a pattern. The error message tells you: (1) what React expected (the server-rendered version), (2) what it found (the client version), and (3) which component caused the issue. The key information is usually the attribute or content that differs. In our real-world example, we saw: aria-controls='radix-:R_259knelb_:' on the client vs aria-controls='radix-:R_8l6itplb_:' on the server. This told us that a Radix UI component was generating different random IDs on server vs client.",
        code: `// A typical hydration error in the console:
// "A tree hydrated but some attributes of the server
//  rendered HTML didn't match the client properties."
//
// + (client) aria-controls="radix-:R_259knelb_:"
// - (server) aria-controls="radix-:R_8l6itplb_:"
//
// The + line shows what the CLIENT rendered
// The - line shows what the SERVER rendered
// They are different random IDs = MISMATCH

// HOW TO READ IT:
// 1. Look at the + and - lines to see what differs
// 2. Check the component stack to find WHERE it happens
// 3. Think about WHY it would differ (random IDs, browser APIs, etc.)`,
        explanation: "The plus (+) and minus (-) lines in the error work like a code diff: minus is what the server produced, plus is what the client expected. Focus on what is different between them.",
      },
      {
        title: "Basic Fixes for Hydration Mismatches",
        content: "The simplest fix is to delay rendering of client-dependent content until after hydration completes. This means showing a neutral placeholder during server rendering, then swapping in the real content once React is running in the browser. The useState + useEffect pattern is the beginner-friendly approach: start with a safe default value, then update it in useEffect (which only runs in the browser). For components that are entirely client-dependent, you can use Next.js dynamic imports with ssr: false to skip server rendering altogether.",
        solution: `// FIX 1: useState + useEffect for simple cases
"use client"
import { useState, useEffect } from 'react'

function UserGreeting() {
  // Start with a safe value that works on both server and client
  const [name, setName] = useState<string | null>(null)

  // useEffect only runs in the browser, after hydration
  useEffect(() => {
    setName(localStorage.getItem('name'))
  }, [])

  // Server renders: "Welcome!" (safe default)
  // Client renders: "Welcome!" (same! no mismatch)
  // After hydration: "Welcome, John!" (safely updated)
  return <p>{name ? \`Welcome, \${name}!\` : 'Welcome!'}</p>
}

// FIX 2: Skip SSR entirely for complex client-only components
import dynamic from 'next/dynamic'

const ClientOnlyChart = dynamic(
  () => import('./Chart'),
  { ssr: false }  // This component will not render on the server
)

// FIX 3: Check for browser environment
function SafeComponent() {
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <div className="h-10 bg-muted animate-pulse rounded" />
  }

  return <ComplexInteractiveWidget />
}`,
        explanation: "These fixes ensure server and client produce identical HTML during the critical hydration phase. The real content appears a fraction of a second later, after React has safely attached.",
      },
    ],
  },
  {
    id: "10",
    slug: "building-hydration-safe-sidebar",
    title: "Building a Hydration-Safe Sidebar with Radix UI",
    description: "Implement a production-grade hydration guard pattern using useSyncExternalStore, skeleton components, and the guard pattern to eliminate Radix UI hydration mismatches permanently",
    level: "intermediate",
    category: "components",
    duration: "35 min",
    publishedAt: "2026-02-05",
    tags: ["hydration", "radix-ui", "sidebar", "useSyncExternalStore", "skeleton"],
    prerequisites: [
      "Completed 'Understanding React Hydration' tutorial or equivalent knowledge",
      "Familiarity with React hooks (useState, useEffect)",
      "Basic understanding of Next.js App Router and Server Components",
    ],
    learningOutcomes: [
      "Understand why Radix UI components are especially prone to hydration mismatches",
      "Implement useSyncExternalStore for hydration detection without double-renders",
      "Build a static skeleton component that produces identical output on server and client",
      "Apply the guard pattern to protect an entire component subtree from hydration issues",
      "Remove fragile useEffect-based hydration workarounds in favour of architectural solutions",
    ],
    steps: [
      {
        title: "Understanding the Radix ID Problem",
        content: "Radix UI is a popular library of accessible, unstyled UI primitives - components like Collapsible, Accordion, Dialog, and Dropdown that handle all the complex accessibility and keyboard interaction logic for you. Internally, Radix uses React's useId() hook (or its own ID generation) to create unique IDs for ARIA attributes like aria-controls. These IDs connect trigger elements to their content panels for screen readers. The problem: useId() generates IDs based on the component's position in the React tree, and this position can differ between server and client when conditional rendering is involved. In a sidebar with many nested Collapsible components, each one generates an ID. If even one component's open/closed state differs between server and client, the entire tree of IDs shifts.",
        code: `// What Radix generates internally for each Collapsible:
<button
  type="button"
  aria-controls="radix-:R_259knelb_:"  // Generated ID
  aria-expanded={false}
>
  Toggle Section
</button>
<div id="radix-:R_259knelb_:">         // Must match!
  Hidden content here
</div>

// With 20 collapsible sections in a sidebar,
// that is 20 pairs of IDs that must match perfectly
// between server and client.

// If the component tree differs even slightly:
// Server: aria-controls="radix-:R_8l6itplb_:"
// Client: aria-controls="radix-:R_259knelb_:"
// MISMATCH on every single collapsible!`,
        hint: "ARIA attributes like aria-controls create invisible links between elements for screen readers. When IDs mismatch, accessibility breaks silently.",
      },
      {
        title: "Why useEffect Band-Aids Fail",
        content: "The first instinct when facing hydration issues is to use a common pattern: initialise state to a safe value (false), render that during SSR, then update it in a useEffect after hydration. This is the approach we initially tried for our sidebar - start all sections as closed, then open the active ones after hydration. The problem is threefold: (1) It causes a visible flash where sections collapse then expand. (2) The Radix Collapsible component still generates its internal IDs during SSR, and those IDs change when the component re-renders with a different open state. (3) Every time you add a new section or nested item, you introduce another potential mismatch point. This approach treats each symptom individually instead of solving the root cause.",
        code: `// THE FRAGILE APPROACH (what we tried first):
function NavSection({ section, pathname }) {
  const isActive = pathname.startsWith(section.href)
  
  // Start closed on server to avoid mismatch
  const [isOpen, setIsOpen] = useState(false)
  
  // Open after hydration if section is active
  useEffect(() => {
    if (isActive) {
      setIsOpen(true)
    }
  }, [isActive])
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger>
        {section.label}
      </CollapsibleTrigger>
      <CollapsibleContent>
        {section.children.map(child => (
          // Each child might ALSO be collapsible...
          // More Radix IDs, more mismatch potential
          <NestedCollapsible key={child.href} item={child} />
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}

// PROBLEMS:
// 1. Visual flash: sections close then open
// 2. Radix still generates IDs during SSR
// 3. Every new section = new mismatch risk
// 4. Must remember to add useEffect to EVERY component`,
        explanation: "This pattern is like putting a plaster on each crack in a wall. It works temporarily, but the foundation is unstable and new cracks appear with every change.",
      },
      {
        title: "The useSyncExternalStore Solution",
        content: "React 18 introduced useSyncExternalStore - a hook designed for subscribing to external data sources that works correctly with server-side rendering. Unlike useState + useEffect, it provides a getServerSnapshot parameter that explicitly tells React what value to use during SSR. This means no double-render, no flash, and no timing issues. For hydration detection, we use it to create a clean signal: the server always returns false (not hydrated), and the client returns true (hydrated) after the initial render. The key advantage over useState + useEffect is that useSyncExternalStore is synchronous on the client - it does not wait for a re-render to update.",
        solution: `// hooks/use-hydration.ts
"use client"

import { useSyncExternalStore } from "react"

// A no-op subscribe function. Hydration status never changes
// after the initial client render, so there is nothing to
// subscribe to. React requires a subscribe function but we
// return a no-op unsubscribe.
const emptySubscribe = () => () => {}

/**
 * Returns true once the component has hydrated on the client.
 * Returns false during SSR and during the initial hydration pass.
 *
 * Uses useSyncExternalStore which is React's official solution
 * for values that differ between server and client:
 * - getSnapshot (2nd arg): called on the client, returns true
 * - getServerSnapshot (3rd arg): called during SSR, returns false
 *
 * Unlike useState + useEffect, this does NOT cause a double-render.
 * The value transitions from false to true in a single synchronous pass.
 */
export function useHydration(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,   // Client snapshot: always true
    () => false    // Server snapshot: always false
  )
}

// WHY THIS IS BETTER THAN useState + useEffect:
// 
// useState approach:
//   Server: false -> Client render 1: false -> useEffect: true -> Re-render
//   (Two renders, visible flash)
//
// useSyncExternalStore approach:
//   Server: false -> Client: true (single synchronous pass)
//   (One render, no flash)`,
        explanation: "useSyncExternalStore is specifically designed for this kind of server/client value split. React's documentation recommends it as the correct primitive for hydration-aware values.",
      },
      {
        title: "Building a Static Skeleton",
        content: "The hydration guard needs something to show while the real component waits to mount. A skeleton component must produce identical HTML on both server and client - which means no Radix primitives, no random IDs, no client-dependent logic. It should visually resemble the real sidebar closely enough that the transition is imperceptible. We use plain HTML elements (div, nav, span) with Tailwind CSS classes and a subtle pulse animation to indicate loading. The skeleton does not need to be interactive - it only exists for the fraction of a second between the initial page load and hydration completing.",
        solution: `// components/molecules/sidebar-skeleton.tsx

// IMPORTANT: No "use client" directive needed.
// This component must work identically on server and client.
// No Radix components. No hooks. No random values. Pure HTML + CSS.

export function SidebarSkeleton() {
  return (
    <div className="flex h-full w-[var(--sidebar-width)] flex-col border-r border-border bg-sidebar">
      {/* Header skeleton */}
      <div className="p-4 border-b border-border">
        <div className="h-5 w-32 bg-muted rounded animate-pulse" />
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        {/* Section labels - these are static and predictable */}
        {["MANAGEMENT", "BACKEND & CMS", "FRONTEND & INTEGRATION", "LEARN & GROW"].map(
          (label) => (
            <div key={label} className="mb-4">
              <div className="px-3 py-2">
                <span className="text-xs font-semibold text-muted-foreground tracking-wider">
                  {label}
                </span>
              </div>
              {/* Menu item placeholders */}
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={\`\${label}-\${i}\`}
                  className="flex items-center gap-3 px-3 py-2 rounded-md"
                >
                  <div className="h-4 w-4 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                </div>
              ))}
            </div>
          )
        )}
      </nav>

      {/* Footer skeleton */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
          <div className="h-4 w-20 bg-muted rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}

// KEY PRINCIPLES:
// 1. No "use client" - works as server component too
// 2. No Radix/Collapsible - zero generated IDs
// 3. No hooks - no state, no effects, no context
// 4. Deterministic keys using string templates, not random
// 5. Visual similarity to real sidebar for smooth transition`,
        explanation: "The skeleton is a disposable stand-in. It exists for approximately 50-100ms on fast connections - just long enough to prevent the hydration mismatch, but short enough that users barely notice the swap.",
      },
      {
        title: "Applying the Guard Pattern",
        content: "Now we combine both pieces - the hydration hook and the skeleton - into the guard pattern. The guard is a conditional render at the top of the sidebar component: if hydration has not completed, return the skeleton; otherwise, return the real interactive sidebar. This is architecturally powerful because it solves the problem at the root: no Radix components exist during SSR at all. No IDs are generated. No aria-controls attributes are created. The server HTML only contains the skeleton's static markup. After hydration, the real sidebar mounts fresh with all its Radix components, and since it is a client-only mount (not a hydration), there is nothing to mismatch against. A bonus benefit: since the real sidebar only mounts after hydration, useState can safely initialise with the correct values from pathname - no need for useEffect-based state syncing.",
        solution: `// components/molecules/docs-sidebar.tsx
"use client"

import { useHydration } from "@/hooks/use-hydration"
import { SidebarSkeleton } from "@/components/molecules/sidebar-skeleton"

export function DocsSidebar() {
  const hydrated = useHydration()
  const pathname = usePathname()

  // GUARD: During SSR and before hydration, render skeleton.
  // This prevents ALL Radix hydration mismatches because no
  // Collapsible components exist during server rendering.
  if (!hydrated) {
    return <SidebarSkeleton />
  }

  // AFTER HYDRATION: Safe to render the real sidebar.
  // All Radix components mount fresh (not hydrating), so
  // there is nothing for IDs to mismatch against.
  return (
    <Sidebar>
      <SidebarContent>
        {sections.map(section => (
          <NavCollapsible key={section.title} section={section} />
        ))}
      </SidebarContent>
    </Sidebar>
  )
}

// Inside child components, we can now safely initialise state:
function NavCollapsible({ section }) {
  const pathname = usePathname()
  const hasActiveItem = section.items.some(
    item => pathname.startsWith(item.href)
  )

  // SAFE! This component only mounts after hydration,
  // so pathname is already available and correct.
  const [isOpen, setIsOpen] = useState(hasActiveItem)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      {/* ... */}
    </Collapsible>
  )
}

// BEFORE (fragile):
// const [isOpen, setIsOpen] = useState(false)
// useEffect(() => { if (isActive) setIsOpen(true) }, [isActive])
//
// AFTER (robust):
// const [isOpen, setIsOpen] = useState(isActive)
// No useEffect needed!`,
        explanation: "The guard pattern is a single point of protection. Instead of adding workarounds to every child component, one guard at the top protects the entire subtree. This scales to any number of nested components.",
      },
      {
        title: "Making the Hook Reusable Across Your App",
        content: "The useHydration hook is not specific to sidebars. Any component that uses browser-dependent libraries (Radix, Headless UI, chart libraries) or browser APIs (matchMedia for responsive layouts, IntersectionObserver for lazy loading) can benefit from this pattern. You can create a generic HydrationGuard wrapper component that accepts a skeleton prop and children, making it reusable across your entire application. This protects you as you scale - every new interactive component you add is automatically safe.",
        solution: `// A reusable HydrationGuard wrapper component
"use client"

import { useHydration } from "@/hooks/use-hydration"
import { type ReactNode } from "react"

interface HydrationGuardProps {
  children: ReactNode
  fallback?: ReactNode
}

export function HydrationGuard({ children, fallback }: HydrationGuardProps) {
  const hydrated = useHydration()

  if (!hydrated) {
    // Return fallback skeleton, or nothing if none provided
    return fallback ?? null
  }

  return children
}

// USAGE EXAMPLES:

// Protecting a sidebar
<HydrationGuard fallback={<SidebarSkeleton />}>
  <DocsSidebar />
</HydrationGuard>

// Protecting a chart that uses browser APIs
<HydrationGuard fallback={<ChartSkeleton />}>
  <RevenueChart data={data} />
</HydrationGuard>

// Protecting a media query dependent component
<HydrationGuard fallback={<div className="h-12" />}>
  <ResponsiveNavigation />
</HydrationGuard>

// Protecting multiple components at once
<HydrationGuard fallback={<DashboardSkeleton />}>
  <InteractiveDashboard />
</HydrationGuard>`,
        explanation: "By extracting the pattern into a reusable component, every developer on the team can protect their components without needing to understand the internals of useSyncExternalStore or hydration mechanics.",
      },
    ],
  },
  // BATCH 1 - Generated from Content Pipeline Gap Analysis (A5 + A8 findings)
  {
    id: "11",
    slug: "error-boundaries-and-loading-states",
    title: "Adding Error Boundaries and Loading States to Next.js",
    description: "Learn how to implement error.tsx and loading.tsx conventions in Next.js to create resilient applications that handle failures gracefully and show meaningful loading indicators.",
    level: "beginner",
    category: "getting-started",
    duration: "30 min",
    publishedAt: "2026-02-09",
    tags: ["error-boundaries", "loading-states", "next.js", "react", "error-handling", "ux", "resilience"],
    prerequisites: ["Basic Next.js App Router knowledge", "Understanding of React components"],
    learningOutcomes: [
      "Create error.tsx files that catch and display errors gracefully",
      "Build loading.tsx files that show meaningful loading indicators",
      "Understand the Next.js file convention hierarchy (layout > loading > error > page)",
      "Implement error recovery with retry mechanisms",
      "Add route-level and segment-level error boundaries",
    ],
    steps: [
      {
        title: "Understanding the Problem",
        content: "Without error boundaries, a single failing component crashes the entire page -- users see a white screen with no way to recover. Without loading states, route transitions appear frozen. Code Review #1 found that our entire application had zero error.tsx files and zero loading.tsx files. Every route was unprotected.",
        code: `// What happens WITHOUT error boundaries:
// 1. A component throws an error
// 2. React's default error handling kicks in
// 3. The ENTIRE page goes white
// 4. User sees nothing -- no message, no recovery option
// 5. They have to manually refresh the browser

// What happens WITHOUT loading states:
// 1. User clicks a navigation link
// 2. Nothing visible happens for 1-3 seconds
// 3. User thinks the click didn't register
// 4. They click again, maybe multiple times
// 5. Page suddenly appears all at once

// Goal: Make both failure and loading feel intentional`,
        hint: "Think of error boundaries as try/catch for your UI, and loading states as visual feedback that something is happening.",
      },
      {
        title: "Creating Your First error.tsx",
        content: "Next.js uses a file convention: any file named error.tsx in a route segment automatically becomes the error boundary for that segment. It must be a client component (errors are caught on the client) and receives two props: error (the Error object) and reset (a function to retry rendering).",
        solution: `// app/dashboard/error.tsx
"use client"

// error.tsx MUST be a client component
// It receives the error and a reset function

interface ErrorBoundaryProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function DashboardError({ error, reset }: ErrorBoundaryProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
      <div className="rounded-full bg-destructive/10 p-4">
        <svg className="h-8 w-8 text-destructive" /* alert icon */ />
      </div>
      
      <h2 className="text-xl font-semibold">Something went wrong</h2>
      
      <p className="text-muted-foreground text-center max-w-md">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      
      {/* The reset function re-renders the segment */}
      <button
        onClick={reset}
        className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
      >
        Try Again
      </button>
      
      {/* Optional: Show error digest for support tickets */}
      {error.digest && (
        <p className="text-xs text-muted-foreground">
          Error ID: {error.digest}
        </p>
      )}
    </div>
  )
}`,
        explanation: "The error.tsx file wraps its route segment in a React Error Boundary. When any component in that segment throws, this component renders instead of a white screen. The reset() function attempts to re-render the segment, which is useful for transient errors like network failures.",
      },
      {
        title: "Creating Your First loading.tsx",
        content: "The loading.tsx convention works with React Suspense. When a route segment is loading (fetching data, importing components), Next.js automatically shows this component. It wraps the page in a Suspense boundary, so the loading state appears instantly while the page content streams in.",
        solution: `// app/dashboard/loading.tsx

// loading.tsx does NOT need "use client" -- it can be a server component
// It should be lightweight and render immediately

export default function DashboardLoading() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
      {/* Skeleton loading pattern */}
      <div className="w-full max-w-4xl space-y-6 p-6">
        {/* Header skeleton */}
        <div className="space-y-2">
          <div className="h-8 w-48 animate-pulse rounded bg-muted" />
          <div className="h-4 w-96 animate-pulse rounded bg-muted" />
        </div>
        
        {/* Content grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
        
        {/* Table skeleton */}
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded bg-muted" />
          ))}
        </div>
      </div>
    </div>
  )
}

// KEY PRINCIPLES:
// 1. Match the layout of the real page (same grid, same spacing)
// 2. Use animate-pulse for subtle loading indication
// 3. Keep it lightweight -- no data fetching, no heavy components
// 4. Use deterministic keys (index is fine here since list is static)`,
        explanation: "Skeleton loading states are preferred over spinners because they give users a preview of the page structure. This reduces perceived loading time and prevents layout shift when the real content arrives.",
      },
      {
        title: "The File Convention Hierarchy",
        content: "Next.js processes these files in a specific order. Understanding the hierarchy helps you decide where to place error and loading boundaries. The layout wraps everything. Inside the layout, loading.tsx creates a Suspense boundary. Inside that, error.tsx creates an Error Boundary. Finally, the page renders inside both.",
        solution: `// The rendering hierarchy for a route segment:

// app/dashboard/layout.tsx    <-- Wraps everything
//   app/dashboard/loading.tsx <-- Suspense boundary (shows during load)
//     app/dashboard/error.tsx <-- Error boundary (catches failures)
//       app/dashboard/page.tsx <-- The actual page content

// This means:
// 1. layout.tsx errors are NOT caught by error.tsx in the same segment
//    (you need a parent error.tsx or the root global-error.tsx)
// 2. loading.tsx shows BEFORE page.tsx mounts
// 3. error.tsx catches errors FROM page.tsx and its children

// PRACTICAL STRATEGY:
// Place error.tsx at these levels:

// app/error.tsx              -- Root fallback (catches everything)
// app/dashboard/error.tsx    -- Dashboard-wide errors
// app/dashboard/admin/error.tsx -- Admin-specific errors

// Place loading.tsx at:
// app/dashboard/loading.tsx  -- Dashboard navigation transitions
// app/dashboard/admin/document-administration/loading.tsx -- Document administration loading`,
        explanation: "You don't need error.tsx and loading.tsx in every single route segment. Place them at meaningful boundaries: root level for the global fallback, section level for section-specific handling, and leaf level only for routes with unique loading or error patterns.",
      },
      {
        title: "Advanced: Error Recovery Strategies",
        content: "The basic reset() function retries the render, but for production applications you need smarter recovery. Common patterns include: retry with exponential backoff for API failures, redirect to a safe page after persistent errors, and logging errors to a monitoring service.",
        solution: `// app/dashboard/error.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()
  const [retryCount, setRetryCount] = useState(0)
  const maxRetries = 3

  // Log error to monitoring (production)
  useEffect(() => {
    console.error("[Dashboard Error]", {
      message: error.message,
      digest: error.digest,
      retryCount,
    })
    // In production: send to Sentry, LogRocket, etc.
  }, [error, retryCount])

  function handleRetry() {
    if (retryCount < maxRetries) {
      setRetryCount((c) => c + 1)
      reset()
    }
  }

  const canRetry = retryCount < maxRetries

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
      <h2 className="text-xl font-semibold">Something went wrong</h2>
      <p className="text-muted-foreground">{error.message}</p>

      <div className="flex gap-3">
        {canRetry ? (
          <button onClick={handleRetry} className="btn-primary">
            Try Again ({maxRetries - retryCount} attempts left)
          </button>
        ) : (
          <p className="text-sm text-muted-foreground">
            Maximum retries reached.
          </p>
        )}

        <button
          onClick={() => router.push("/dashboard")}
          className="btn-secondary"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  )
}`,
        explanation: "Limiting retries prevents infinite loops. After the maximum, offer navigation to a known-good page. Always log errors -- in development to the console, in production to your monitoring service.",
      },
      {
        title: "Adding a Global Error Boundary",
        content: "The root global-error.tsx is a special file that catches errors from the root layout itself. Unlike regular error.tsx files, it replaces the ENTIRE page including the html and body tags, so it must render these elements. This is your last line of defence.",
        solution: `// app/global-error.tsx
"use client"

// global-error.tsx replaces the entire HTML document
// It MUST render <html> and <body> tags

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center space-y-4 p-8">
          <h1 className="text-2xl font-bold">Application Error</h1>
          <p className="text-muted-foreground">
            A critical error occurred. Please refresh the page.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={reset}
              className="rounded bg-primary px-4 py-2 text-primary-foreground"
            >
              Try Again
            </button>
            <a
              href="/"
              className="rounded bg-secondary px-4 py-2 text-secondary-foreground"
            >
              Go Home
            </a>
          </div>
        </div>
      </body>
    </html>
  )
}

// PLACEMENT STRATEGY CHECKLIST:
// [x] app/global-error.tsx    -- Root layout failures
// [x] app/error.tsx           -- App-wide fallback
// [x] app/dashboard/error.tsx -- Dashboard section
// [ ] Individual pages        -- Only if they need custom handling`,
        explanation: "global-error.tsx is the nuclear option -- it catches errors that even the root layout's error boundary cannot. Use it as a minimal, self-contained page with no external dependencies (no shared layouts, no providers, no context).",
      },
    ],
  },
  // BATCH 2 - Zero Coverage Audiences (DevOps 14%)
  {
    id: "12",
    slug: "deploying-nextjs-to-vercel",
    title: "Deploying Next.js to Vercel: Environment Variables and Checks",
    description: "A step-by-step guide to deploying a Next.js application to Vercel with proper environment variable management, preview deployments, and production checks.",
    level: "beginner",
    category: "devops",
    duration: "25 min",
    publishedAt: "2026-02-09",
    tags: ["deployment", "vercel", "environment-variables", "ci-cd", "devops", "next.js", "preview-deployments"],
    prerequisites: ["A Next.js project with a Git repository", "A Vercel account (free tier works)"],
    learningOutcomes: [
      "Connect a Git repository to Vercel for automatic deployments",
      "Configure environment variables across development, preview, and production",
      "Understand the deployment pipeline: push > build > deploy > verify",
      "Set up preview deployments for pull request review",
      "Add deployment checks to prevent broken releases",
    ],
    steps: [
      {
        title: "Connecting Your Repository",
        content: "Vercel deploys directly from your Git repository. Every push to the main branch triggers a production deployment, and every pull request gets its own preview deployment with a unique URL.",
        code: `// Step 1: Go to vercel.com/new
// Step 2: Import your Git repository (GitHub, GitLab, or Bitbucket)
// Step 3: Vercel auto-detects Next.js and configures build settings

// Default build settings (auto-detected):
// Framework Preset: Next.js
// Build Command: next build
// Output Directory: .next
// Install Command: npm install (or pnpm/yarn based on lockfile)

// After import, Vercel triggers your first deployment automatically.
// You'll get a production URL: your-project.vercel.app`,
        hint: "Vercel reads your lockfile to determine the package manager. Make sure package-lock.json, pnpm-lock.yaml, or yarn.lock is committed to your repository.",
      },
      {
        title: "Environment Variables: The Three Scopes",
        content: "Vercel has three environment scopes: Production (live site), Preview (PR deployments), and Development (local via vercel env pull). Each scope can have different values for the same variable. This is critical -- your production database URL should never be used in preview deployments.",
        solution: `// Environment variable configuration in Vercel Dashboard:
// Settings > Environment Variables

// Example configuration for a typical Next.js app:

// DATABASE_URL
//   Production:  postgresql://prod-db.example.com:5432/myapp
//   Preview:     postgresql://staging-db.example.com:5432/myapp_staging
//   Development: postgresql://localhost:5432/myapp_dev

// NEXT_PUBLIC_SITE_URL
//   Production:  https://www.yoursite.com
//   Preview:     (auto) https://your-project-git-branch.vercel.app
//   Development: http://localhost:3000

// EMAIL_API_KEY
//   Production:  re_live_xxxxxxxxxxxx
//   Preview:     re_test_xxxxxxxxxxxx  (test key -- no real emails sent)
//   Development: re_test_xxxxxxxxxxxx

// IMPORTANT RULES:
// 1. Variables prefixed with NEXT_PUBLIC_ are exposed to the browser
//    NEVER put secrets in NEXT_PUBLIC_ variables
//
// 2. Server-only variables (no prefix) are only available in:
//    - Server Components
//    - Route Handlers
//    - Server Actions
//    - Middleware
//
// 3. Use different values per scope to prevent:
//    - Preview deploys writing to production database
//    - Test emails going to real customers
//    - Development using production API quotas`,
        explanation: "The three-scope model prevents the most common deployment disaster: a preview deployment accidentally modifying production data. Always use test/staging credentials for Preview and Development scopes.",
      },
      {
        title: "Pulling Environment Variables Locally",
        content: "Instead of manually copying environment variables to a .env.local file, Vercel CLI can pull them directly from your project settings. This ensures your local development environment always matches what's configured in the dashboard.",
        solution: `// Install Vercel CLI globally
// npm i -g vercel

// Link your local project to your Vercel project
// vercel link

// Pull environment variables for development scope
// vercel env pull .env.local

// This creates/overwrites .env.local with all Development-scope variables:
// DATABASE_URL=postgresql://localhost:5432/myapp_dev
// EMAIL_API_KEY=re_test_xxxxxxxxxxxx
// NEXT_PUBLIC_SITE_URL=http://localhost:3000

// IMPORTANT: .env.local is in .gitignore by default (Next.js convention)
// NEVER commit .env.local to your repository

// To verify your environment is correct:
// app/api/health/route.ts
import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    environment: process.env.VERCEL_ENV ?? "development",
    hasDatabase: !!process.env.DATABASE_URL,
    hasEmailKey: !!process.env.EMAIL_API_KEY,
    // Never log actual secret values -- only check existence
  })
}`,
        explanation: "The health check endpoint is a deployment verification pattern. It confirms that required environment variables are set without exposing their values. Add checks for every critical variable your app needs.",
      },
      {
        title: "Preview Deployments and Branch Protection",
        content: "Every pull request automatically gets a preview deployment. This is your first line of defence against broken releases -- review the preview URL before merging. You can also add comments on the preview deployment directly in the Vercel dashboard.",
        solution: `// Preview deployment workflow:

// 1. Create a feature branch
//    git checkout -b feature/new-service-form

// 2. Make changes and push
//    git add . && git commit -m "Add new service form"
//    git push origin feature/new-service-form

// 3. Create a pull request on GitHub
//    Vercel automatically:
//    - Detects the new PR
//    - Builds using Preview environment variables
//    - Deploys to a unique URL
//    - Posts the preview URL as a PR comment

// 4. Review the preview deployment
//    - Click the Vercel bot's link in the PR
//    - Test the changes on the live preview
//    - Check the build logs for warnings

// 5. Merge the PR
//    - Vercel automatically deploys to production
//    - The preview deployment is archived

// Recommended GitHub branch protection rules:
// Settings > Branches > Branch protection rules > main
// [x] Require a pull request before merging
// [x] Require status checks to pass (select "Vercel" check)
// [x] Require branches to be up to date before merging`,
        explanation: "Preview deployments are the single most valuable deployment feature. They let non-developers (designers, project managers, clients) review changes on a real URL before anything touches production.",
      },
      {
        title: "Build Checks and Deployment Protection",
        content: "Add checks that run during the build to catch problems before they reach production. Next.js build already catches TypeScript errors and ESLint violations, but you can add custom checks for environment variables, API connectivity, and data integrity.",
        solution: `// next.config.mjs -- Enable strict checks during build

/** @type {import('next').NextConfig} */
const nextConfig = {
  // TypeScript errors will FAIL the build (not just warn)
  typescript: {
    ignoreBuildErrors: false,  // NEVER set this to true in production
  },
  
  // ESLint errors will FAIL the build
  eslint: {
    ignoreDuringBuilds: false, // NEVER set this to true in production
  },
}

export default nextConfig

// Custom build-time environment validation
// lib/env.ts
function validateEnv() {
  const required = [
    "DATABASE_URL",
    "EMAIL_API_KEY",
  ]
  
  const missing = required.filter((key) => !process.env[key])
  
  if (missing.length > 0) {
    throw new Error(
      "Missing required environment variables: " + missing.join(", ")
    )
  }
}

// Call during build (e.g., in a server component or API route)
// This ensures the build fails if variables are missing
validateEnv()

// Vercel deployment protection (Dashboard):
// Settings > Deployment Protection
// [x] Vercel Authentication -- require login to view preview deployments
// [x] Protection Bypass for Automation -- allow CI/CD tools to access`,
        explanation: "The principle is simple: fail fast. If the build succeeds, you have confidence that TypeScript compiles, ESLint passes, and all required environment variables are set. This eliminates the most common class of deployment failures.",
      },
    ],
  },
  // BATCH 3 - Category Holes (forms: 0 tutorials)
  {
    id: "13",
    slug: "building-multi-step-forms-with-server-actions",
    title: "Building Multi-Step Forms with Server Actions",
    description: "Build a multi-step service request form using React Server Actions, Zod validation, and progressive enhancement. No client-side form libraries needed.",
    level: "intermediate",
    category: "forms",
    duration: "40 min",
    publishedAt: "2026-02-09",
    tags: ["forms", "server-actions", "zod", "validation", "progressive-enhancement", "next.js"],
    prerequisites: ["Basic Next.js App Router knowledge", "Understanding of HTML forms", "Familiarity with TypeScript"],
    learningOutcomes: [
      "Build a multi-step form using native HTML form elements and Server Actions",
      "Validate each step with Zod schemas before allowing progression",
      "Persist form state across steps without client-side state management libraries",
      "Handle errors gracefully with inline validation messages",
      "Implement progressive enhancement so forms work without JavaScript",
    ],
    steps: [
      {
        title: "Defining the Form Schema with Zod",
        content: "Start by defining what data each step collects. Zod schemas serve double duty: they validate on the server (security) and generate TypeScript types (developer experience). We split the schema into per-step schemas and a combined schema.",
        solution: `// lib/validations/service-request.ts
import { z } from "zod"

// Step 1: Contact Information
export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
})

// Step 2: Service Details
export const serviceSchema = z.object({
  serviceType: z.enum(
    ["emergency", "installation", "maintenance", "inspection"],
    { required_error: "Please select a service type" }
  ),
  description: z.string().min(20, "Please describe the issue in at least 20 characters"),
  urgency: z.enum(["low", "medium", "high", "critical"]),
})

// Step 3: Scheduling
export const scheduleSchema = z.object({
  preferredDate: z.string().min(1, "Please select a preferred date"),
  preferredTime: z.enum(["morning", "afternoon", "evening"]),
  address: z.string().min(10, "Please provide your full address"),
  accessNotes: z.string().optional(),
})

// Combined schema for final submission
export const serviceRequestSchema = contactSchema
  .merge(serviceSchema)
  .merge(scheduleSchema)

// Infer TypeScript types from schemas
export type ContactData = z.infer<typeof contactSchema>
export type ServiceData = z.infer<typeof serviceSchema>
export type ScheduleData = z.infer<typeof scheduleSchema>
export type ServiceRequest = z.infer<typeof serviceRequestSchema>`,
        explanation: "Splitting the schema per step means you can validate each step independently. The combined schema validates the complete submission. Zod's .merge() combines them without duplication.",
      },
      {
        title: "Creating the Server Actions",
        content: "Each step has its own server action that validates the step data and returns either success (proceed to next step) or errors (show validation messages). The final step validates everything and submits to the database.",
        solution: `// app/service-request/actions.ts
"use server"

import { contactSchema, serviceSchema, scheduleSchema, serviceRequestSchema } from "@/lib/validations/service-request"

type StepResult = {
  success: boolean
  errors?: Record<string, string[]>
  data?: Record<string, unknown>
}

export async function validateContactStep(formData: FormData): Promise<StepResult> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
  }
  
  const result = contactSchema.safeParse(raw)
  
  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }
  
  return { success: true, data: result.data }
}

export async function validateServiceStep(formData: FormData): Promise<StepResult> {
  const raw = {
    serviceType: formData.get("serviceType"),
    description: formData.get("description"),
    urgency: formData.get("urgency"),
  }
  
  const result = serviceSchema.safeParse(raw)
  
  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }
  
  return { success: true, data: result.data }
}

export async function submitServiceRequest(formData: FormData): Promise<StepResult> {
  // Validate ALL fields together for the final submission
  const raw = Object.fromEntries(formData.entries())
  const result = serviceRequestSchema.safeParse(raw)
  
  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }
  
  // All validation passed -- save to database
  // await db.serviceRequests.create({ data: result.data })
  
  return { success: true }
}`,
        explanation: "Each action validates only its own step's fields. The final submission re-validates everything as a safety net. This pattern means even if a user manipulates the client-side step progression, the server catches invalid data.",
      },
      {
        title: "Building the Multi-Step Form Component",
        content: "The form component tracks the current step and accumulated data. Each step is a separate sub-component that renders its own fields. Hidden inputs carry forward data from previous steps so the final form submission has everything.",
        solution: `// app/service-request/form.tsx
"use client"

import { useState, useActionState } from "react"
import { validateContactStep, validateServiceStep, submitServiceRequest } from "./actions"

type FormData = Record<string, string>

export function ServiceRequestForm() {
  const [step, setStep] = useState(1)
  const [savedData, setSavedData] = useState<FormData>({})
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  async function handleStepSubmit(formData: globalThis.FormData) {
    let result

    if (step === 1) {
      result = await validateContactStep(formData)
    } else if (step === 2) {
      result = await validateServiceStep(formData)
    } else {
      result = await submitServiceRequest(formData)
    }

    if (!result.success) {
      setErrors(result.errors ?? {})
      return
    }

    // Save this step's data and advance
    const stepData = Object.fromEntries(formData.entries()) as FormData
    setSavedData((prev) => ({ ...prev, ...stepData }))
    setErrors({})

    if (step < 3) {
      setStep((s) => s + 1)
    } else {
      // Success! Redirect or show confirmation
    }
  }

  return (
    <form action={handleStepSubmit} className="space-y-6">
      {/* Carry forward data from previous steps as hidden inputs */}
      {Object.entries(savedData).map(([key, value]) => (
        <input key={key} type="hidden" name={key} value={value} />
      ))}

      {/* Step indicator */}
      <div className="flex gap-2">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={\`h-2 flex-1 rounded \${
              s <= step ? "bg-primary" : "bg-muted"
            }\`}
          />
        ))}
      </div>

      {/* Render current step */}
      {step === 1 && <ContactFields errors={errors} defaults={savedData} />}
      {step === 2 && <ServiceFields errors={errors} defaults={savedData} />}
      {step === 3 && <ScheduleFields errors={errors} defaults={savedData} />}

      {/* Navigation */}
      <div className="flex justify-between">
        {step > 1 && (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="btn-secondary"
          >
            Back
          </button>
        )}
        <button type="submit" className="btn-primary ml-auto">
          {step === 3 ? "Submit Request" : "Continue"}
        </button>
      </div>
    </form>
  )
}

// Example field component with error display
function ContactFields({
  errors,
  defaults,
}: {
  errors: Record<string, string[]>
  defaults: FormData
}) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Full Name
        </label>
        <input
          id="name"
          name="name"
          defaultValue={defaults.name}
          className="mt-1 w-full rounded border p-2"
          required
        />
        {errors.name && (
          <p className="mt-1 text-sm text-destructive">{errors.name[0]}</p>
        )}
      </div>
      {/* ... email and phone fields follow same pattern */}
    </div>
  )
}`,
        explanation: "Hidden inputs carry forward validated data from previous steps. When the user clicks 'Back', the component re-renders with their previous values preserved via the defaults prop. The final submission includes all fields from all steps.",
      },
      {
        title: "Error Handling and Field-Level Validation Messages",
        content: "Good form UX shows errors exactly where they occur -- next to the field that has the problem, not in a generic error banner. Zod's flatten() method gives us field-level error arrays that map directly to form fields.",
        code: `// The error display pattern:

// 1. Server action returns field-level errors:
// { errors: { email: ["Please enter a valid email address"] } }

// 2. Component renders error below the field:
{errors.email && (
  <p role="alert" className="mt-1 text-sm text-destructive">
    {errors.email[0]}
  </p>
)}

// 3. Accessibility: use role="alert" so screen readers announce errors
// 4. Only show the first error per field (avoid overwhelming the user)
// 5. Clear errors when the user starts typing (optional UX improvement)

// Bonus: Add aria-invalid to the input when it has errors
<input
  name="email"
  aria-invalid={!!errors.email}
  aria-describedby={errors.email ? "email-error" : undefined}
  className={cn(
    "rounded border p-2",
    errors.email && "border-destructive"
  )}
/>`,
        hint: "Always validate on the server, even if you add client-side validation later. Client-side validation is a UX convenience; server-side validation is a security requirement.",
      },
    ],
  },
  // BATCH 5 - GAP-003: Building Email Templates with React Email
  {
    id: "14",
    slug: "building-email-templates-react-email",
    title: "Building Email Templates with React Email",
    description: "Build production email templates using React Email and Resend. Learn the styling constraints, component model, preview workflow, and integration with Next.js server actions.",
    level: "intermediate",
    category: "email",
    duration: "35 min",
    publishedAt: "2026-02-09",
    tags: ["email", "react-email", "resend", "server-actions", "templates", "next.js"],
    prerequisites: ["Basic React knowledge", "Understanding of server actions", "Resend account (free tier)"],
    learningOutcomes: [
      "Build email templates using React Email components",
      "Understand email styling constraints (why CSS-in-JS doesn't work)",
      "Preview templates locally using React Email's dev server",
      "Send emails from server actions using Resend",
      "Handle delivery failures and retries",
    ],
    steps: [
      {
        title: "Understanding Email HTML Constraints",
        content: "Email clients (Gmail, Outlook, Apple Mail) use rendering engines from 2004. Modern CSS features like flexbox, grid, CSS variables, and media queries are partially or completely unsupported. React Email abstracts this away by providing components that output email-safe HTML.",
        code: `// What works in web browsers but BREAKS in email clients:
// - Flexbox and Grid layouts
// - CSS variables (--custom-properties)
// - External stylesheets
// - JavaScript (completely stripped)
// - SVGs (inconsistent support)
// - Web fonts (fallback only)

// What React Email provides instead:
// <Section> -- table-based layout rows
// <Row> and <Column> -- table cells for grid-like layouts
// <Text> -- paragraphs with inline styles
// <Button> -- VML-backed buttons (works in Outlook)
// <Img> -- images with proper alt text handling
// <Hr> -- horizontal rules
// <Link> -- anchor tags with tracking support
// <Preview> -- preview text (shows in inbox before opening)`,
        hint: "Think of email HTML as building websites in 2005 -- tables for layout, inline styles for everything, and test in every client.",
      },
      {
        title: "Creating Your First Template",
        content: "React Email templates are React components that return email-safe JSX. They live in a dedicated directory and export a default component. Each template receives props for dynamic content.",
        solution: `// lib/email/templates/service-request-confirmation.tsx
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components"

interface ServiceRequestEmailProps {
  customerName: string
  serviceType: string
  requestId: string
  preferredDate: string
}

export default function ServiceRequestConfirmation({
  customerName,
  serviceType,
  requestId,
  preferredDate,
}: ServiceRequestEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Your {serviceType} request #{requestId} has been received
      </Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          {/* Header */}
          <Section style={headerStyle}>
            <Img
              src="https://yoursite.com/logo.png"
              width={150}
              height={40}
              alt="Company Logo"
            />
          </Section>

          {/* Main content */}
          <Section style={contentStyle}>
            <Heading style={headingStyle}>
              Request Received
            </Heading>
            <Text style={textStyle}>
              Hi {customerName},
            </Text>
            <Text style={textStyle}>
              We have received your {serviceType} service request.
              Your reference number is <strong>#{requestId}</strong>.
            </Text>
            <Text style={textStyle}>
              Preferred date: {preferredDate}
            </Text>
            <Text style={textStyle}>
              We will review your request and get back to you within
              24 hours with a quotation.
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footerStyle}>
            <Text style={footerTextStyle}>
              Questions? Reply to this email or call us at 0800 123 456
            </Text>
            <Link href="https://yoursite.com" style={linkStyle}>
              Visit our website
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// ALL styles must be inline objects -- no external CSS
const bodyStyle = {
  backgroundColor: "#f6f9fc",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
}

const containerStyle = {
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: "#ffffff",
}

const headerStyle = { padding: "24px", textAlign: "center" as const }
const contentStyle = { padding: "24px" }
const headingStyle = { fontSize: "24px", lineHeight: "1.3", color: "#1a1a1a" }
const textStyle = { fontSize: "16px", lineHeight: "1.6", color: "#374151" }
const footerStyle = { padding: "24px", backgroundColor: "#f9fafb" }
const footerTextStyle = { fontSize: "14px", color: "#6b7280" }
const linkStyle = { color: "#2563eb", textDecoration: "underline" }`,
        explanation: "Every style is an inline object, not a className. The containerStyle uses maxWidth 600px because most email clients render at this width. The Preview component sets the text visible in the inbox before the email is opened -- this is prime marketing real estate.",
      },
      {
        title: "Previewing Templates Locally",
        content: "React Email includes a dev server that renders your templates in the browser with hot reload. This is dramatically faster than sending test emails to check every change.",
        solution: `// package.json -- add the preview script
// "scripts": {
//   "email:dev": "email dev -d lib/email/templates"
// }

// Run: npm run email:dev
// Opens http://localhost:3000 with a template browser

// You can also render templates to HTML strings for debugging:
import { render } from "@react-email/render"
import ServiceRequestConfirmation from "./templates/service-request-confirmation"

// Render to HTML string (useful for debugging)
const html = await render(
  <ServiceRequestConfirmation
    customerName="John Smith"
    serviceType="Emergency Repair"
    requestId="SR-2026-0042"
    preferredDate="15 February 2026"
  />
)

// Render to plain text (for email clients that don't support HTML)
const text = await render(
  <ServiceRequestConfirmation
    customerName="John Smith"
    serviceType="Emergency Repair"
    requestId="SR-2026-0042"
    preferredDate="15 February 2026"
  />,
  { plainText: true }
)`,
        explanation: "Always generate both HTML and plain text versions. Some corporate email clients strip HTML entirely, and the plain text version is used by screen readers and accessibility tools.",
      },
      {
        title: "Sending Emails with Resend",
        content: "Resend is the delivery service that actually sends your React Email templates. It integrates directly with React Email -- you pass the component as the react prop and Resend handles rendering and delivery.",
        solution: `// lib/email/send.ts
import { Resend } from "resend"
import ServiceRequestConfirmation from "./templates/service-request-confirmation"

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendConfirmationParams {
  to: string
  customerName: string
  serviceType: string
  requestId: string
  preferredDate: string
}

export async function sendServiceRequestConfirmation({
  to,
  customerName,
  serviceType,
  requestId,
  preferredDate,
}: SendConfirmationParams) {
  const { data, error } = await resend.emails.send({
    from: "Service Requests <noreply@yoursite.com>",
    to: [to],
    subject: \`Service Request #\${requestId} Received\`,
    react: ServiceRequestConfirmation({
      customerName,
      serviceType,
      requestId,
      preferredDate,
    }),
  })

  if (error) {
    console.error("Email delivery failed:", error)
    throw new Error(\`Failed to send email: \${error.message}\`)
  }

  return data
}

// Using in a server action:
// app/service-request/actions.ts
"use server"

import { sendServiceRequestConfirmation } from "@/lib/email/send"

export async function submitServiceRequest(formData: FormData) {
  // ... validate and save to database ...

  // Send confirmation email (non-blocking)
  try {
    await sendServiceRequestConfirmation({
      to: formData.get("email") as string,
      customerName: formData.get("name") as string,
      serviceType: formData.get("serviceType") as string,
      requestId: generatedId,
      preferredDate: formData.get("preferredDate") as string,
    })
  } catch (emailError) {
    // Log but don't fail the request -- email is secondary
    console.error("Confirmation email failed:", emailError)
  }

  return { success: true, requestId: generatedId }
}`,
        explanation: "Email sending is wrapped in a try/catch that logs but doesn't throw. A failed email should never prevent a successful form submission. The user's request is saved to the database regardless -- the email is a nice-to-have notification, not a critical path.",
      },
      {
        title: "Handling Delivery Failures",
        content: "Emails fail for many reasons: invalid addresses, full inboxes, spam filters, DNS issues. A production email system needs retry logic and delivery status tracking.",
        code: `// Production email sending with retry logic
export async function sendWithRetry(
  sendFn: () => Promise<{ id: string }>,
  maxRetries = 3
): Promise<{ id: string } | null> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await sendFn()
      return result
    } catch (error) {
      const isLastAttempt = attempt === maxRetries
      
      if (isLastAttempt) {
        console.error("Email permanently failed after retries:", error)
        // In production: log to error tracking (Sentry, etc.)
        return null
      }
      
      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.pow(2, attempt - 1) * 1000
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }
  return null
}

// Usage:
const result = await sendWithRetry(() =>
  sendServiceRequestConfirmation({
    to: customerEmail,
    customerName: "John",
    serviceType: "Installation",
    requestId: "SR-001",
    preferredDate: "2026-02-15",
  })
)

// Common failure categories:
// - 400 errors: Bad request (invalid email format) -- don't retry
// - 429 errors: Rate limited -- retry with longer backoff
// - 500 errors: Server error -- retry with standard backoff
// - Network errors: Timeout/DNS -- retry with standard backoff`,
        hint: "Only retry on transient errors (500s, timeouts, rate limits). Never retry on permanent errors (invalid email address, authentication failure). Resend's error response includes a statusCode you can use to distinguish.",
      },
    ],
  },
  // BATCH 6 - GAP-009: E2E Testing with Playwright
  {
    id: "15",
    slug: "e2e-testing-playwright-nextjs",
    title: "E2E Testing with Playwright for Next.js",
    description: "Set up Playwright for end-to-end testing of a Next.js application. Write resilient tests for server components, client interactions, form submissions, and navigation flows.",
    level: "intermediate",
    category: "testing",
    duration: "40 min",
    publishedAt: "2026-02-09",
    tags: ["testing", "playwright", "e2e", "next.js", "ci-cd", "qa"],
    prerequisites: ["Basic Next.js knowledge", "Understanding of testing concepts", "Node.js installed"],
    learningOutcomes: [
      "Install and configure Playwright for a Next.js project",
      "Write E2E tests for server-rendered pages and client interactions",
      "Test multi-step form flows with proper assertions",
      "Use resilient selectors that survive refactoring",
      "Run tests in CI/CD pipelines with proper configuration",
    ],
    steps: [
      {
        title: "Setting Up Playwright",
        content: "Playwright installs its own browser binaries (Chromium, Firefox, WebKit) so tests run consistently across environments. The setup creates a configuration file and an example test.",
        solution: `// Install Playwright
// npx playwright install --with-deps
// npm init playwright@latest

// playwright.config.ts
import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,    // Fail if test.only in CI
  retries: process.env.CI ? 2 : 0, // Retry flaky tests in CI
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ["html"],                       // Visual report
    ["list"],                       // Terminal output
  ],

  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",        // Capture trace on failure
    screenshot: "only-on-failure",  // Screenshot on failure
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] },  // Test mobile layout
    },
  ],

  // Start Next.js dev server before tests
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})`,
        explanation: "The webServer config automatically starts your Next.js dev server before tests run. In CI, it starts fresh; locally, it reuses an existing server if one is running. The mobile-chrome project ensures your app works on mobile viewports.",
      },
      {
        title: "Writing Your First Page Test",
        content: "Start with simple page load tests that verify server-rendered content. These catch broken routes, missing data, and rendering errors.",
        solution: `// e2e/homepage.spec.ts
import { test, expect } from "@playwright/test"

test.describe("Homepage", () => {
  test("renders the hero section", async ({ page }) => {
    await page.goto("/")

    // Check page title (from Next.js metadata)
    await expect(page).toHaveTitle(/Electrical Services/)

    // Check hero heading is visible
    const heading = page.getByRole("heading", { level: 1 })
    await expect(heading).toBeVisible()
    await expect(heading).toContainText("Electrical")

    // Check CTA button exists and links correctly
    const ctaButton = page.getByRole("link", { name: /get a quote/i })
    await expect(ctaButton).toBeVisible()
    await expect(ctaButton).toHaveAttribute("href", "/service-request")
  })

  test("navigation links work", async ({ page }) => {
    await page.goto("/")

    // Click Services link
    await page.getByRole("link", { name: /services/i }).click()

    // Verify navigation occurred
    await expect(page).toHaveURL(/\\/services/)
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Services")
  })

  test("page loads within performance budget", async ({ page }) => {
    const start = Date.now()
    await page.goto("/", { waitUntil: "domcontentloaded" })
    const loadTime = Date.now() - start

    // Page should load within 3 seconds
    expect(loadTime).toBeLessThan(3000)
  })
})`,
        explanation: "Use getByRole selectors (not CSS selectors or test IDs) as your primary strategy. Role-based selectors survive CSS refactoring, component restructuring, and class name changes. They also verify accessibility -- if getByRole can't find an element, it probably has an accessibility issue.",
      },
      {
        title: "Testing Multi-Step Form Flows",
        content: "Multi-step forms are where E2E tests provide the most value. They test the full user journey: fill fields, validate, navigate between steps, submit, and verify the success state.",
        solution: `// e2e/service-request.spec.ts
import { test, expect } from "@playwright/test"

test.describe("Service Request Form", () => {
  test("completes full submission flow", async ({ page }) => {
    await page.goto("/service-request")

    // Step 1: Contact Information
    await page.getByLabel("Full Name").fill("John Smith")
    await page.getByLabel("Email").fill("john@example.com")
    await page.getByLabel("Phone").fill("0800123456")
    await page.getByRole("button", { name: /continue/i }).click()

    // Verify we moved to step 2
    await expect(page.getByText("Service Details")).toBeVisible()

    // Step 2: Service Details
    await page.getByLabel("Service Type").selectOption("installation")
    await page.getByLabel("Description").fill(
      "Need a new consumer unit installed in the garage"
    )
    await page.getByLabel("Urgency").selectOption("medium")
    await page.getByRole("button", { name: /continue/i }).click()

    // Step 3: Scheduling
    await page.getByLabel("Preferred Date").fill("2026-03-15")
    await page.getByLabel("Preferred Time").selectOption("morning")
    await page.getByLabel("Address").fill("42 Electric Avenue, London, EC1A 1BB")
    await page.getByRole("button", { name: /submit/i }).click()

    // Verify success state
    await expect(page.getByText(/request.*received/i)).toBeVisible()
    await expect(page.getByText(/reference number/i)).toBeVisible()
  })

  test("shows validation errors on empty submission", async ({ page }) => {
    await page.goto("/service-request")

    // Try to proceed without filling anything
    await page.getByRole("button", { name: /continue/i }).click()

    // Verify error messages appear
    await expect(page.getByText(/name.*required/i)).toBeVisible()
    await expect(page.getByText(/email.*valid/i)).toBeVisible()
  })

  test("preserves data when navigating back", async ({ page }) => {
    await page.goto("/service-request")

    // Fill step 1
    await page.getByLabel("Full Name").fill("Jane Doe")
    await page.getByLabel("Email").fill("jane@example.com")
    await page.getByLabel("Phone").fill("0800999888")
    await page.getByRole("button", { name: /continue/i }).click()

    // Go back to step 1
    await page.getByRole("button", { name: /back/i }).click()

    // Verify data is preserved
    await expect(page.getByLabel("Full Name")).toHaveValue("Jane Doe")
    await expect(page.getByLabel("Email")).toHaveValue("jane@example.com")
  })
})`,
        explanation: "The three tests cover the critical form paths: happy path (full completion), validation (error handling), and state preservation (back navigation). These three tests alone catch 80% of form regression bugs.",
      },
      {
        title: "Running Tests in CI/CD",
        content: "Playwright tests should run on every pull request as a quality gate. The CI configuration needs to install browsers, start the dev server, run tests, and upload failure artifacts.",
        code: `# .github/workflows/e2e.yml
name: E2E Tests

on:
  pull_request:
    branches: [main]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium

      - name: Build Next.js
        run: npm run build

      - name: Run E2E tests
        run: npx playwright test
        env:
          CI: true

      - name: Upload test results
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7

# Key CI decisions:
# - Only install chromium (not all 3 browsers) to save time
# - Build first, then test against production build
# - Upload HTML report on failure for debugging
# - 2 retries in CI to handle transient failures`,
        hint: "Run tests against the production build (npm run build + npm start) in CI, not the dev server. This catches issues that only appear in production mode (missing environment variables, build-time errors, optimisation bugs).",
      },
    ],
  },
]

export function getTutorialBySlug(slug: string): Tutorial | undefined {
  return tutorials.find((t) => t.slug === slug)
}

export function getTutorialsByLevel(level: TutorialLevel): Tutorial[] {
  return tutorials.filter((t) => t.level === level)
}

export function getTutorialsByCategory(category: TutorialCategory): Tutorial[] {
  return tutorials.filter((t) => t.category === category)
}

export function getAllTutorialSlugs(): string[] {
  return tutorials.map((t) => t.slug)
}
