"use client"

import {
  TableOfContents,
  SectionHeader,
  InfoBox,
  KeyTakeaway,
  StatsTable,
  NumberedList,
  ProcessFlow,
  FeatureGrid,
  ComparisonCards,
} from "@/components/molecules/article-components"
import { CodeBlock } from "@/components/atoms/code-block"
import { CodeExplanation } from "@/components/atoms/code-explanation"

const tocItems = [
  { id: "testing-philosophy", title: "Testing Philosophy" },
  { id: "unit-testing", title: "Unit Testing with Vitest" },
  { id: "component-testing", title: "Component Testing" },
  { id: "integration-testing", title: "Integration Testing" },
  { id: "e2e-testing", title: "E2E Testing with Playwright" },
  { id: "ci-integration", title: "CI/CD Integration" },
]

export function TestingStrategyContent() {
  return (
    <div className="flex gap-8">
      <div className="flex-1 min-w-0 space-y-8">
        <section>
          <SectionHeader number="01" title="Testing Philosophy" id="testing-philosophy" />
          <p className="text-muted-foreground leading-relaxed mt-4">
            The testing pyramid guides where to invest effort: many fast unit tests at the base,
            fewer integration tests in the middle, and a small number of critical-path E2E tests
            at the top. Each layer catches different classes of bugs.
          </p>
        </section>

        <ProcessFlow
          title="The Testing Pyramid"
          steps={[
            { title: "Unit Tests (70%)", description: "Fast, isolated, test pure logic. Run in milliseconds." },
            { title: "Component Tests (20%)", description: "Render React components, test user interactions." },
            { title: "Integration Tests (7%)", description: "Test API routes, form submissions, data flows." },
            { title: "E2E Tests (3%)", description: "Full browser automation of critical user journeys." },
          ]}
        />

        <StatsTable
          title="Coverage Targets"
          rows={[
            { label: "Unit Test Coverage", value: "> 80% of lib/ and utils/" },
            { label: "Component Coverage", value: "> 60% of atoms and molecules" },
            { label: "Integration Coverage", value: "All server actions and API routes" },
            { label: "E2E Coverage", value: "3-5 critical user journeys" },
            { label: "CI Gate", value: "Fail build if coverage drops below threshold" },
          ]}
        />

        <section>
          <SectionHeader number="02" title="Unit Testing with Vitest" id="unit-testing" />
          <p className="text-muted-foreground leading-relaxed mt-4">
            Vitest is the test runner: fast, ESM-native, compatible with the Jest API,
            and integrated with Vite for instant HMR during test development.
          </p>
        </section>

        <CodeBlock
          language="typescript"
          title="vitest.config.ts"
          code={`import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      thresholds: { lines: 80, branches: 75, functions: 80 },
    },
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./") },
  },
})`}
        />

        <CodeBlock
          language="typescript"
          title="lib/security/__tests__/sanitize.test.ts"
          code={`import { describe, it, expect } from "vitest"
import { sanitizeInput } from "../sanitize"

describe("sanitizeInput", () => {
  it("strips HTML tags from strings", () => {
    const input = '<script>alert("xss")</script>Hello'
    expect(sanitizeInput(input)).toBe("Hello")
  })

  it("recursively sanitizes object properties", () => {
    const input = {
      name: '<img onerror="hack()" />John',
      email: "john@example.com",
    }
    const result = sanitizeInput(input)
    expect(result.name).toBe("John")
    expect(result.email).toBe("john@example.com")
  })

  it("passes through numbers and booleans unchanged", () => {
    expect(sanitizeInput(42)).toBe(42)
    expect(sanitizeInput(true)).toBe(true)
  })
})`}
        />

        <CodeExplanation
          title="Unit Test Pattern"
          code={`describe("moduleName", () => {
  it("does X when given Y", () => {
    // Arrange
    const input = createTestInput()
    // Act
    const result = functionUnderTest(input)
    // Assert
    expect(result).toEqual(expected)
  })
})`}
          explanations={[
            { lines: "1", label: "Group by module or function" },
            { lines: "2", label: "Describe behavior, not implementation" },
            { lines: "3-4", label: "Arrange: set up test data" },
            { lines: "5-6", label: "Act: call the function" },
            { lines: "7-8", label: "Assert: verify the result" },
          ]}
        />

        <section>
          <SectionHeader number="03" title="Component Testing" id="component-testing" />
          <p className="text-muted-foreground leading-relaxed mt-4">
            Component tests render React components in a simulated DOM and verify
            user-visible behavior: what renders, what happens on click, what
            accessibility attributes are present.
          </p>
        </section>

        <InfoBox type="tip" title="Test User Behavior, Not Implementation">
          Query by role, label, or text -- not by CSS class or test ID. If a user
          cannot find the element, your test should not either.
        </InfoBox>

        <CodeBlock
          language="typescript"
          title="components/atoms/__tests__/callout.test.tsx"
          code={`import { render, screen } from "@testing-library/react"
import { Callout } from "../callout"

describe("Callout", () => {
  it("renders title and children", () => {
    render(
      <Callout type="warning" title="Heads up">
        Important message
      </Callout>
    )
    expect(screen.getByText("Heads up")).toBeInTheDocument()
    expect(screen.getByText("Important message")).toBeInTheDocument()
  })

  it("applies correct role for accessibility", () => {
    render(<Callout type="danger" title="Error">Content</Callout>)
    expect(screen.getByRole("alert")).toBeInTheDocument()
  })
})`}
        />

        <section>
          <SectionHeader number="04" title="Integration Testing" id="integration-testing" />
          <p className="text-muted-foreground leading-relaxed mt-4">
            Integration tests verify that multiple modules work together correctly:
            server actions process form data, validation rejects bad input, and
            the full request-response cycle produces expected results.
          </p>
        </section>

        <NumberedList
          title="What to Integration Test"
          items={[
            "Every server action: valid input produces success, invalid input returns structured errors",
            "Rate limiting: verify requests are blocked after exceeding limits",
            "CSRF validation: requests without valid tokens are rejected",
            "Form submission flows: data passes through sanitization -> validation -> action",
            "API route handlers: correct HTTP status codes and response shapes",
          ]}
        />

        <section>
          <SectionHeader number="05" title="E2E Testing with Playwright" id="e2e-testing" />
          <p className="text-muted-foreground leading-relaxed mt-4">
            End-to-end tests automate a real browser to test critical user journeys.
            Keep E2E tests focused on the 3-5 most important flows -- they are slow
            and expensive to maintain.
          </p>
        </section>

        <FeatureGrid
          title="Critical Path Tests"
          features={[
            { title: "Contact Form", description: "Fill form, submit, verify success message and rate limiting" },
            { title: "Quotation Form", description: "Multi-step form completion with file upload" },
            { title: "Navigation", description: "Dashboard navigation, responsive sidebar, breadcrumbs" },
            { title: "Content Library", description: "Browse articles, filter tutorials, open case studies" },
          ]}
        />

        <CodeBlock
          language="typescript"
          title="tests/e2e/contact-form.spec.ts"
          code={`import { test, expect } from "@playwright/test"

test.describe("Contact Form", () => {
  test("submits successfully with valid data", async ({ page }) => {
    await page.goto("/contact")

    await page.getByLabel("Full Name").fill("Jane Smith")
    await page.getByLabel("Email").fill("jane@example.com")
    await page.getByLabel("Phone").fill("07700 900000")
    await page.getByLabel("Message").fill("Test enquiry")

    await page.getByRole("button", { name: "Send" }).click()

    await expect(
      page.getByText("Message sent successfully")
    ).toBeVisible({ timeout: 5000 })
  })

  test("shows validation errors for empty fields", async ({ page }) => {
    await page.goto("/contact")
    await page.getByRole("button", { name: "Send" }).click()

    await expect(page.getByText("Name is required")).toBeVisible()
    await expect(page.getByText("Email is required")).toBeVisible()
  })
})`}
        />

        <section>
          <SectionHeader number="06" title="CI/CD Integration" id="ci-integration" />
          <p className="text-muted-foreground leading-relaxed mt-4">
            Tests run automatically on every pull request. The CI pipeline runs unit and
            component tests first (fast feedback), then integration tests, and finally
            E2E tests against a preview deployment.
          </p>
        </section>

        <ProcessFlow
          title="CI Pipeline Stages"
          steps={[
            { title: "Lint + Type Check", description: "ESLint + tsc --noEmit (< 30s)" },
            { title: "Unit + Component", description: "Vitest with coverage report (< 60s)" },
            { title: "Integration", description: "Server action tests with test database (< 120s)" },
            { title: "E2E", description: "Playwright against preview deployment (< 300s)" },
            { title: "Coverage Gate", description: "Fail if coverage below thresholds" },
          ]}
        />

        <CodeBlock
          language="yaml"
          title=".github/workflows/test.yml"
          code={`name: Test Suite
on: [pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm tsc --noEmit
      - run: pnpm vitest run --coverage
      - run: pnpm playwright install --with-deps
      - run: pnpm playwright test`}
        />

        <KeyTakeaway
          title="Testing Strategy Essentials"
          points={[
            "Follow the testing pyramid: many unit tests, fewer integration, minimal E2E",
            "Test user behavior, not implementation details",
            "Every server action needs both happy-path and error-path tests",
            "E2E tests cover only critical user journeys (3-5 max)",
            "CI gates prevent merging code that drops coverage below thresholds",
            "Monthly review: remove flaky tests, add tests for recent bugs",
          ]}
        />
      </div>

      <TableOfContents items={tocItems} />
    </div>
  )
}
