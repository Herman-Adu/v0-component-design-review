"use client"

import {
  SectionHeader,
  InfoBox,
  FeatureGrid,
  ComparisonCards,
  CodeBlock,
  KeyTakeaway,
  RelatedArticles,
  TableOfContents,
  MetricsGrid,
  StatsTable,
  ArchitectureDiagram,
  ProcessFlow,
  ArticleIcons,
  type TOCItem,
} from "@/components/molecules/article-components"

const tocItems: TOCItem[] = [
  { id: "testing-pyramid", title: "The Testing Pyramid", level: 2 },
  { id: "unit-testing", title: "Unit Testing with Vitest", level: 2 },
  { id: "integration-testing", title: "Integration Testing with RTL", level: 2 },
  { id: "e2e-testing", title: "E2E Testing with Playwright", level: 2 },
  { id: "coverage-targets", title: "Coverage Targets", level: 2 },
  { id: "testing-philosophy", title: "Testing Philosophy", level: 2 },
  { id: "key-takeaway", title: "Key Takeaway", level: 2 },
]

export function TestingArticleContent() {
  return (
    <div className="flex gap-8">
      <div className="flex-1 min-w-0">
        <InfoBox type="important">
          A robust testing strategy is non-negotiable for production applications. Tests are not 
          about proving your code works - they are about enabling confident changes and catching 
          regressions before users do.
        </InfoBox>

        <SectionHeader number="01" title="The Testing Pyramid" id="testing-pyramid" />

        <p className="text-muted-foreground mb-6">
          The testing pyramid guides investment in different test types. More tests at the base 
          (fast, isolated) and fewer at the top (slow, integrated) provides the best balance of 
          confidence and maintenance cost.
        </p>

        <ArchitectureDiagram
          title="Testing Pyramid Structure"
          layers={[
            { name: "E2E Tests (10%)", items: ["Critical user journeys", "Cross-browser", "Real environment"], color: "#ef4444" },
            { name: "Integration Tests (20%)", items: ["Component interactions", "API handlers", "Database operations"], color: "#f59e0b" },
            { name: "Unit Tests (70%)", items: ["Pure functions", "Utilities", "Business logic", "Fast & isolated"], color: "#22c55e" },
          ]}
        />

        <MetricsGrid
          metrics={[
            { label: "Unit Tests", value: "70%", change: "Fast, < 1ms each", positive: true },
            { label: "Integration", value: "20%", change: "Medium, < 100ms each", positive: true },
            { label: "E2E Tests", value: "10%", change: "Slow, < 10s each", positive: true },
            { label: "Total Coverage", value: "80%+", change: "Meaningful coverage", positive: true },
          ]}
        />

        <SectionHeader number="02" title="Unit Testing with Vitest" id="unit-testing" />

        <p className="text-muted-foreground mb-4">
          Unit tests verify individual functions and modules in isolation. They should be fast 
          enough to run on every file save and provide immediate feedback during development.
        </p>

        <FeatureGrid
          columns={2}
          features={[
            {
              icon: <ArticleIcons.Code className="h-5 w-5" />,
              title: "Pure Functions",
              description: "Validation logic, formatters, calculators, transformers",
            },
            {
              icon: <ArticleIcons.Database className="h-5 w-5" />,
              title: "Business Logic",
              description: "Domain rules, state machines, data transformations",
            },
            {
              icon: <ArticleIcons.Shield className="h-5 w-5" />,
              title: "Utility Functions",
              description: "String manipulation, date handling, type guards",
            },
            {
              icon: <ArticleIcons.Layers className="h-5 w-5" />,
              title: "Custom Hooks",
              description: "State logic, side effects, data fetching hooks",
            },
          ]}
        />

        <CodeBlock
          filename="lib/validation.test.ts"
          code={`import { describe, it, expect } from "vitest"
import { validateEmail, sanitizeInput, validatePhoneUK } from "./validation"

describe("validateEmail", () => {
  it("accepts valid email addresses", () => {
    expect(validateEmail("user@example.com")).toBe(true)
    expect(validateEmail("name+tag@domain.co.uk")).toBe(true)
    expect(validateEmail("test.email@subdomain.example.org")).toBe(true)
  })

  it("rejects invalid email addresses", () => {
    expect(validateEmail("invalid")).toBe(false)
    expect(validateEmail("@nodomain.com")).toBe(false)
    expect(validateEmail("spaces in@email.com")).toBe(false)
    expect(validateEmail("")).toBe(false)
  })
})

describe("sanitizeInput", () => {
  it("escapes HTML entities to prevent XSS", () => {
    expect(sanitizeInput('<script>alert("xss")</script>'))
      .toBe('&lt;script&gt;alert("xss")&lt;/script&gt;')
  })

  it("preserves safe content", () => {
    expect(sanitizeInput("Hello, World!")).toBe("Hello, World!")
    expect(sanitizeInput("Price: £100")).toBe("Price: £100")
  })
})

describe("validatePhoneUK", () => {
  it("accepts valid UK phone numbers", () => {
    expect(validatePhoneUK("07700 900000")).toBe(true)
    expect(validatePhoneUK("+44 7700 900000")).toBe(true)
    expect(validatePhoneUK("020 7946 0958")).toBe(true)
  })

  it("rejects invalid formats", () => {
    expect(validatePhoneUK("123")).toBe(false)
    expect(validatePhoneUK("not-a-phone")).toBe(false)
  })
})`}
        />

        <InfoBox type="tip" title="Testing Boundaries">
          Focus unit tests on logic, not implementation details. If refactoring forces you to 
          change tests that did not change behavior, your tests are too tightly coupled.
        </InfoBox>

        <SectionHeader number="03" title="Integration Testing with RTL" id="integration-testing" />

        <p className="text-muted-foreground mb-4">
          Integration tests verify that components work together correctly. React Testing Library 
          encourages testing from the user perspective rather than implementation details.
        </p>

        <ComparisonCards
          idealTitle="Behavior Testing (RTL)"
          notIdealTitle="Implementation Testing"
          idealFor={[
            "Testing what users see and do",
            "Query by role, label, text",
            "Verify outcomes not mechanics",
            "Survives refactoring",
          ]}
          notIdealFor={[
            "Testing internal state directly",
            "Checking prop values passed",
            "Verifying function calls count",
            "Brittle to refactoring",
          ]}
        />

        <CodeBlock
          filename="components/contact-form.test.tsx"
          code={`import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import { ContactForm } from "./contact-form"

describe("ContactForm", () => {
  it("submits valid form data", async () => {
    const onSubmit = vi.fn()
    render(<ContactForm onSubmit={onSubmit} />)

    // Fill out the form using accessible queries
    await userEvent.type(
      screen.getByLabelText(/email/i),
      "test@example.com"
    )
    await userEvent.type(
      screen.getByLabelText(/message/i),
      "Hello, I have a question about your services."
    )

    // Submit the form
    await userEvent.click(
      screen.getByRole("button", { name: /submit/i })
    )

    // Verify the outcome
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        email: "test@example.com",
        message: "Hello, I have a question about your services.",
      })
    })
  })

  it("displays validation errors for invalid input", async () => {
    render(<ContactForm onSubmit={vi.fn()} />)

    // Submit without filling required fields
    await userEvent.click(
      screen.getByRole("button", { name: /submit/i })
    )

    // Check for error messages
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument()
    expect(await screen.findByText(/message is required/i)).toBeInTheDocument()
  })

  it("disables submit button while submitting", async () => {
    const slowSubmit = vi.fn(() => new Promise((r) => setTimeout(r, 100)))
    render(<ContactForm onSubmit={slowSubmit} />)

    await userEvent.type(screen.getByLabelText(/email/i), "test@example.com")
    await userEvent.type(screen.getByLabelText(/message/i), "Test message")
    await userEvent.click(screen.getByRole("button", { name: /submit/i }))

    // Button should be disabled during submission
    expect(screen.getByRole("button", { name: /submitting/i })).toBeDisabled()
  })
})`}
        />

        <SectionHeader number="04" title="E2E Testing with Playwright" id="e2e-testing" />

        <p className="text-muted-foreground mb-4">
          End-to-end tests verify complete user journeys through the application. They run against 
          a real browser and catch issues that unit and integration tests miss.
        </p>

        <ProcessFlow
          title="What to E2E Test"
          steps={[
            { label: "Critical Paths", sublabel: "Registration, checkout, core workflows" },
            { label: "Cross-Browser", sublabel: "Chrome, Firefox, Safari, mobile" },
            { label: "Happy Paths", sublabel: "Primary success scenarios" },
            { label: "Error Recovery", sublabel: "Network failures, edge cases", color: "yellow" },
          ]}
        />

        <CodeBlock
          filename="e2e/contact-flow.spec.ts"
          code={`import { test, expect } from "@playwright/test"

test.describe("Contact Form Flow", () => {
  test("completes multi-step contact submission", async ({ page }) => {
    // Navigate to contact page
    await page.goto("/contact")
    
    // Step 1: Select contact type
    await page.getByRole("button", { name: /general enquiry/i }).click()
    await page.getByRole("button", { name: /next/i }).click()
    
    // Step 2: Fill contact information
    await page.getByLabel(/first name/i).fill("John")
    await page.getByLabel(/last name/i).fill("Doe")
    await page.getByLabel(/email/i).fill("john@example.com")
    await page.getByLabel(/phone/i).fill("07700 900000")
    await page.getByRole("button", { name: /next/i }).click()
    
    // Step 3: Enter message
    await page.getByLabel(/message/i).fill(
      "I would like to learn more about your services."
    )
    await page.getByRole("button", { name: /next/i }).click()
    
    // Step 4: Review and submit
    await expect(page.getByText("John Doe")).toBeVisible()
    await expect(page.getByText("john@example.com")).toBeVisible()
    await page.getByRole("button", { name: /submit/i }).click()
    
    // Verify success state
    await expect(
      page.getByRole("heading", { name: /thank you/i })
    ).toBeVisible()
  })

  test("handles validation errors gracefully", async ({ page }) => {
    await page.goto("/contact")
    
    // Try to proceed without selecting contact type
    await page.getByRole("button", { name: /next/i }).click()
    
    // Should show validation error
    await expect(
      page.getByText(/please select a contact type/i)
    ).toBeVisible()
  })

  test("preserves form state on navigation", async ({ page }) => {
    await page.goto("/contact")
    
    // Fill some data
    await page.getByRole("button", { name: /general enquiry/i }).click()
    await page.getByRole("button", { name: /next/i }).click()
    await page.getByLabel(/first name/i).fill("John")
    
    // Navigate back
    await page.getByRole("button", { name: /back/i }).click()
    await page.getByRole("button", { name: /next/i }).click()
    
    // Data should be preserved
    await expect(page.getByLabel(/first name/i)).toHaveValue("John")
  })
})`}
        />

        <SectionHeader number="05" title="Coverage Targets" id="coverage-targets" />

        <p className="text-muted-foreground mb-4">
          Coverage metrics guide testing investment but are not goals in themselves. 
          High coverage with poor test quality is worse than moderate coverage with meaningful tests.
        </p>

        <StatsTable
          title="Recommended Coverage Targets"
          headers={["Area", "Target", "Priority", "Notes"]}
          rows={[
            ["Utility Functions", "95%+", "Critical", "Pure functions should be fully tested"],
            ["Business Logic", "90%+", "Critical", "Domain rules must be verified"],
            ["Components", "80%+", "High", "Focus on behavior, not snapshots"],
            ["Pages/Routes", "70%+", "Medium", "Covered largely by integration tests"],
            ["E2E Critical Paths", "100%", "Critical", "All revenue-generating flows"],
          ]}
        />

        <InfoBox type="warning" title="Coverage Pitfalls">
          Do not chase 100% coverage for its own sake. Some code (error boundaries, third-party 
          integrations) may be better tested manually. Focus coverage efforts where bugs are 
          most costly.
        </InfoBox>

        <SectionHeader number="06" title="Testing Philosophy" id="testing-philosophy" />

        <FeatureGrid
          columns={2}
          features={[
            {
              icon: <ArticleIcons.Users className="h-5 w-5" />,
              title: "Test Behavior, Not Implementation",
              description: "Tests should survive refactoring if behavior stays the same",
            },
            {
              icon: <ArticleIcons.Zap className="h-5 w-5" />,
              title: "Fast Feedback Loops",
              description: "Tests run frequently are tests that catch bugs early",
            },
            {
              icon: <ArticleIcons.Shield className="h-5 w-5" />,
              title: "Test at the Right Level",
              description: "Unit for logic, integration for composition, E2E for journeys",
            },
            {
              icon: <ArticleIcons.Target className="h-5 w-5" />,
              title: "Meaningful Assertions",
              description: "Each test should verify something a user would care about",
            },
          ]}
        />

        <SectionHeader number="07" title="Key Takeaway" id="key-takeaway" />
        <KeyTakeaway>
          Test behavior, not implementation. Focus on what users experience, not internal details. 
          A well-structured testing pyramid with meaningful assertions at each level enables confident 
          changes and catches regressions before they reach production.
        </KeyTakeaway>

        <RelatedArticles
          articles={[
            {
              href: "/dashboard/content-library/articles/cicd-deployment-pipelines",
              title: "CI/CD Deployment Pipelines",
              level: "advanced",
            },
            {
              href: "/dashboard/content-library/articles/security-architecture-deep-dive",
              title: "Security Architecture Deep Dive",
              level: "advanced",
            },
          ]}
        />
      </div>

      <aside className="hidden lg:block w-64 shrink-0">
        <TableOfContents items={tocItems} />
      </aside>
    </div>
  )
}
