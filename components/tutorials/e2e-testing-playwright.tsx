"use client"

import {
  TableOfContents,
  StepFlow,
  VerticalFlow,
  CodeBlock as ArticleCodeBlock,
  InfoBox,
  StatsTable,
  FileTree,
  FeatureGrid,
  DecisionTree,
  KeyTakeaway,
  NumberedList,
  ProcessFlow,
  DataFlowDiagram,
} from "@/components/molecules/article-components"
import { Shield, Bug, Play, Terminal, CheckCircle, Eye, Zap, Settings } from "lucide-react"

const tocItems = [
  { id: "why-e2e", label: "Why E2E Testing" },
  { id: "playwright-setup", label: "Playwright Setup" },
  { id: "first-test", label: "Your First Test" },
  { id: "selectors", label: "Selectors & Locators" },
  { id: "testing-patterns", label: "Testing Patterns" },
  { id: "server-components", label: "Server Components" },
  { id: "forms-interactions", label: "Forms & Interactions" },
  { id: "ci-integration", label: "CI Integration" },
  { id: "debugging", label: "Debugging Tests" },
]

export function E2ETestingPlaywrightContent() {
  return (
    <div className="flex gap-8">
      <div className="flex-1 min-w-0 space-y-8">

        {/* Section 1: Why E2E */}
        <section id="why-e2e">
          <h2 className="text-2xl font-bold text-foreground mb-4">Why E2E Testing</h2>
          <p className="text-muted-foreground mb-4">
            Unit tests verify functions. Integration tests verify modules. E2E tests verify
            what the user actually experiences -- clicking buttons, filling forms, navigating pages.
          </p>

          <StatsTable
            headers={["Test Type", "Speed", "Confidence", "Maintenance"]}
            rows={[
              ["Unit", "Fast (ms)", "Low (isolated)", "Easy"],
              ["Integration", "Medium (100ms)", "Medium", "Medium"],
              ["E2E", "Slow (seconds)", "Highest (real browser)", "Higher"],
            ]}
          />

          <FeatureGrid
            columns={3}
            features={[
              { icon: <Eye className="h-5 w-5" />, title: "Real Browser", description: "Tests run in Chromium, Firefox, or WebKit -- exactly like users" },
              { icon: <Zap className="h-5 w-5" />, title: "Auto-Wait", description: "Playwright auto-waits for elements, no manual sleep() calls" },
              { icon: <Bug className="h-5 w-5" />, title: "Trace Viewer", description: "Visual timeline of every action, screenshot, and network request" },
            ]}
          />
        </section>

        {/* Section 2: Setup */}
        <section id="playwright-setup">
          <h2 className="text-2xl font-bold text-foreground mb-4">Playwright Setup</h2>

          <StepFlow
            steps={[
              { title: "Install Playwright", description: "npm init playwright@latest -- choose TypeScript, add to tests/ folder" },
              { title: "Configure for Next.js", description: "Set webServer option in playwright.config.ts to start your dev server" },
              { title: "Install browsers", description: "npx playwright install -- downloads Chromium, Firefox, WebKit" },
              { title: "Run first test", description: "npx playwright test -- executes all *.spec.ts files" },
            ]}
          />

          <ArticleCodeBlock
            language="typescript"
            title="playwright.config.ts"
            code={`import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'mobile', use: { ...devices['iPhone 14'] } },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})`}
          />

          <FileTree
            title="Test Structure"
            items={[
              { name: "tests/", type: "folder", children: [
                { name: "home.spec.ts", type: "file", highlight: true },
                { name: "auth.spec.ts", type: "file" },
                { name: "forms.spec.ts", type: "file" },
                { name: "navigation.spec.ts", type: "file" },
                { name: "fixtures/", type: "folder", children: [
                  { name: "auth.ts", type: "file" },
                  { name: "test-data.ts", type: "file" },
                ]},
              ]},
              { name: "playwright.config.ts", type: "file", highlight: true },
            ]}
          />
        </section>

        {/* Section 3: First Test */}
        <section id="first-test">
          <h2 className="text-2xl font-bold text-foreground mb-4">Your First Test</h2>

          <ArticleCodeBlock
            language="typescript"
            title="tests/home.spec.ts"
            code={`import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should display the main heading', async ({ page }) => {
    await page.goto('/')

    // Playwright auto-waits for the element to appear
    await expect(page.getByRole('heading', { level: 1 }))
      .toBeVisible()
  })

  test('should navigate to dashboard on CTA click', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('link', { name: /get started/i }).click()

    // Assert URL changed
    await expect(page).toHaveURL(/dashboard/)
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Mobile menu should be visible
    await expect(page.getByRole('button', { name: /menu/i }))
      .toBeVisible()
  })
})`}
          />

          <InfoBox title="Auto-waiting is your friend">
            Playwright automatically waits for elements to be actionable before interacting
            with them. No need for explicit waits, timeouts, or sleep calls. If an element
            takes time to render (e.g. after a fetch), Playwright waits up to 30 seconds by default.
          </InfoBox>
        </section>

        {/* Section 4: Selectors */}
        <section id="selectors">
          <h2 className="text-2xl font-bold text-foreground mb-4">Selectors & Locators</h2>

          <StatsTable
            headers={["Locator", "Example", "Resilience"]}
            rows={[
              ["getByRole", "getByRole('button', { name: 'Submit' })", "Best -- accessible and semantic"],
              ["getByText", "getByText('Welcome back')", "Good -- visible text"],
              ["getByLabel", "getByLabel('Email address')", "Good -- form labels"],
              ["getByTestId", "getByTestId('submit-btn')", "OK -- explicit but brittle"],
              ["CSS selector", "page.locator('.btn-primary')", "Avoid -- breaks on refactor"],
            ]}
          />

          <DecisionTree
            title="Which Locator Should I Use?"
            decisions={[
              { condition: "Interactive element (button, link, input)?", result: "getByRole -- most resilient, accessibility-aligned", recommended: true },
              { condition: "Form field with a label?", result: "getByLabel -- matches the label text users see" },
              { condition: "Static text content?", result: "getByText -- matches visible content" },
              { condition: "No accessible name available?", result: "getByTestId -- add data-testid as last resort" },
            ]}
          />

          <InfoBox type="warning" title="Never use CSS class selectors in tests">
            CSS classes change during refactors and styling updates. Tests using
            .btn-primary or .nav-link will break silently. Always prefer role-based
            or text-based locators.
          </InfoBox>
        </section>

        {/* Section 5: Testing Patterns */}
        <section id="testing-patterns">
          <h2 className="text-2xl font-bold text-foreground mb-4">Testing Patterns</h2>

          <NumberedList
            title="Essential Patterns for Next.js"
            items={[
              { title: "Page Object Model", description: "Encapsulate page interactions in classes. DashboardPage.navigate(), DashboardPage.getMetric('revenue')." },
              { title: "Fixtures", description: "Use Playwright fixtures for shared setup: authenticated user, seeded database, specific viewport." },
              { title: "API Mocking", description: "Use page.route() to intercept and mock API calls. Test error states without hitting real endpoints." },
              { title: "Visual Regression", description: "Use expect(page).toHaveScreenshot() to catch unintended visual changes." },
            ]}
          />

          <ArticleCodeBlock
            language="typescript"
            title="API Mocking Example"
            code={`test('should show error state when API fails', async ({ page }) => {
  // Intercept the API call and return an error
  await page.route('/api/dashboard/stats', route =>
    route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Internal server error' }),
    })
  )

  await page.goto('/dashboard')

  // Assert error UI is shown
  await expect(page.getByText(/something went wrong/i))
    .toBeVisible()
})`}
          />
        </section>

        {/* Section 6: Server Components */}
        <section id="server-components">
          <h2 className="text-2xl font-bold text-foreground mb-4">Testing Server Components</h2>
          <p className="text-muted-foreground mb-4">
            E2E tests are ideal for Server Components because they test the rendered output
            in a real browser -- no need to mock the server runtime.
          </p>

          <VerticalFlow
            title="Server Component Testing Strategy"
            steps={[
              { title: "Test the rendered output", description: "Navigate to the page and assert visible content. Server Components render before the page loads.", icon: <Eye className="h-4 w-4" /> },
              { title: "Test data freshness", description: "Verify that server-fetched data appears correctly. Check timestamps, counts, dynamic values.", icon: <CheckCircle className="h-4 w-4" /> },
              { title: "Test streaming behaviour", description: "For Suspense boundaries, assert loading states appear then resolve to content.", icon: <Play className="h-4 w-4" /> },
            ]}
          />

          <InfoBox title="E2E is the natural testing layer for RSC">
            Server Components cannot be unit tested with React Testing Library (they run
            on the server). E2E testing with Playwright gives you the highest confidence
            that your Server Components render correctly.
          </InfoBox>
        </section>

        {/* Section 7: Forms & Interactions */}
        <section id="forms-interactions">
          <h2 className="text-2xl font-bold text-foreground mb-4">Forms & Interactions</h2>

          <ArticleCodeBlock
            language="typescript"
            title="Form Submission Test"
            code={`test('should submit contact form successfully', async ({ page }) => {
  await page.goto('/contact')

  // Fill form fields
  await page.getByLabel('Name').fill('Jane Developer')
  await page.getByLabel('Email').fill('jane@example.com')
  await page.getByLabel('Message').fill('Hello, I have a question.')

  // Submit
  await page.getByRole('button', { name: /send/i }).click()

  // Assert success state
  await expect(page.getByText(/message sent/i)).toBeVisible()

  // Assert form was cleared
  await expect(page.getByLabel('Name')).toHaveValue('')
})

test('should show validation errors', async ({ page }) => {
  await page.goto('/contact')

  // Submit empty form
  await page.getByRole('button', { name: /send/i }).click()

  // Assert validation messages
  await expect(page.getByText(/name is required/i)).toBeVisible()
  await expect(page.getByText(/email is required/i)).toBeVisible()
})`}
          />

          <ProcessFlow
            title="Form Test Flow"
            steps={[
              { label: "Navigate", sublabel: "goto page", color: "blue" },
              { label: "Fill Fields", sublabel: "getByLabel", color: "blue" },
              { label: "Submit", sublabel: "click button", color: "yellow" },
              { label: "Assert", sublabel: "check result", color: "green" },
            ]}
          />
        </section>

        {/* Section 8: CI Integration */}
        <section id="ci-integration">
          <h2 className="text-2xl font-bold text-foreground mb-4">CI Integration</h2>

          <ArticleCodeBlock
            language="yaml"
            title=".github/workflows/e2e.yml"
            code={`name: E2E Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7`}
          />

          <DataFlowDiagram
            title="CI Pipeline"
            nodes={[
              { label: "Push/PR", icon: <Terminal className="h-4 w-4" /> },
              { label: "Install", icon: <Settings className="h-4 w-4" /> },
              { label: "Run Tests", icon: <Play className="h-4 w-4" /> },
              { label: "Report", icon: <CheckCircle className="h-4 w-4" /> },
            ]}
          />
        </section>

        {/* Section 9: Debugging */}
        <section id="debugging">
          <h2 className="text-2xl font-bold text-foreground mb-4">Debugging Tests</h2>

          <NumberedList
            title="Debugging Toolkit"
            items={[
              { title: "UI Mode", description: "npx playwright test --ui -- visual test runner with step-through debugging" },
              { title: "Trace Viewer", description: "npx playwright show-trace trace.zip -- timeline of every action with screenshots" },
              { title: "Headed Mode", description: "npx playwright test --headed -- watch the browser as tests run" },
              { title: "Debug Mode", description: "npx playwright test --debug -- pauses at each step, opens inspector" },
            ]}
          />

          <KeyTakeaway>
            Playwright gives you the highest confidence testing for Next.js apps.
            Use role-based locators for resilient tests, auto-waiting instead of
            manual sleeps, and the Trace Viewer for debugging failures. In CI,
            always upload the HTML report as an artifact.
          </KeyTakeaway>
        </section>

      </div>

      {/* Right sidebar TOC */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-8">
          <TableOfContents items={tocItems} />
        </div>
      </aside>
    </div>
  )
}
