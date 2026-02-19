"use client"

import { FlaskConical, Layers, Boxes, Globe, Terminal, Lightbulb } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DocPage, DocSectionHeader } from "@/components/molecules/doc-page"
import { Spoiler } from "@/components/atoms/spoiler"
import { CodeBlock } from "@/components/atoms/code-block"
import { Callout } from "@/components/atoms/callout"

const SECTIONS = [
  { id: "testing-pyramid", title: "Testing Pyramid" },
  { id: "unit-testing", title: "Unit Testing with Vitest" },
  { id: "integration-testing", title: "Integration Testing" },
  { id: "e2e-testing", title: "E2E Testing with Playwright" },
  { id: "scripts", title: "Package.json Scripts" },
  { id: "best-practices", title: "Best Practices" },
]

export default function TestingPage() {
  return (
    <DocPage
      title="Testing Strategy"
      description="Comprehensive testing approach for the multi-step form following the atomic design architecture."
      icon={FlaskConical}
      badges={[{ label: "QA", className: "bg-green-500/20 text-green-400 border-0" }]}
      tags={["Vitest", "Playwright", "Testing Library", "CI/CD"]}
      meta={[
        { label: "Audience", value: "QA / Developers" },
        { label: "Last Updated", value: "2026-02-10" },
      ]}
      sections={SECTIONS}
    >
      {/* Testing Pyramid */}
      <section className="space-y-6">
        <DocSectionHeader id="testing-pyramid">Testing Pyramid</DocSectionHeader>
        <p className="text-muted-foreground">
          Following the atomic design architecture, test each layer independently and then integration between layers.
        </p>
        <div className="grid gap-4">
          {[
            { icon: Layers, title: "Unit Tests (Atoms & Molecules)", desc: "Test individual components in isolation with various props and states" },
            { icon: Boxes, title: "Integration Tests (Organisms)", desc: "Test how components work together, form validation, and state management" },
            { icon: Globe, title: "End-to-End Tests", desc: "Test complete user flows from start to finish including API integration" },
          ].map((item) => (
            <Card key={item.title}>
              <CardHeader className="flex-row items-center gap-3 space-y-0">
                <item.icon className="h-6 w-6 text-accent shrink-0" />
                <CardTitle className="text-base">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{item.desc}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Unit Testing */}
      <section className="space-y-6">
        <DocSectionHeader id="unit-testing">Unit Testing with Vitest</DocSectionHeader>

        <Spoiler title="Setup Vitest">
          <CodeBlock language="bash" code={`npm install -D vitest @testing-library/react @testing-library/jest-dom
npm install -D @testing-library/user-event jsdom`} />
          <CodeBlock language="typescript" code={`// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setup.ts',
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './') },
  },
})`} />
        </Spoiler>

        <Spoiler title="Test FormInput Atom">
          <CodeBlock language="typescript" code={`// __tests__/components/atoms/form-input.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormInput } from '@/components/atoms/form-input'

describe('FormInput', () => {
  it('renders with label', () => {
    render(<FormInput label="Email" value="" onChange={() => {}} />)
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })

  it('shows error message when provided', () => {
    render(
      <FormInput label="Email" value="" onChange={() => {}}
        error="Email is required" />
    )
    expect(screen.getByText('Email is required')).toBeInTheDocument()
  })

  it('calls onChange when user types', async () => {
    const handleChange = vi.fn()
    render(<FormInput label="Email" value="" onChange={handleChange} />)
    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com')
    expect(handleChange).toHaveBeenCalled()
  })
})`} />
        </Spoiler>

        <Spoiler title="Test Step Indicator Molecule">
          <CodeBlock language="typescript" code={`// __tests__/components/molecules/step-indicator.test.tsx
import { render, screen } from '@testing-library/react'
import { StepIndicator } from '@/components/molecules/step-indicator'

describe('StepIndicator', () => {
  const steps = [
    { number: 1, title: 'Personal Info', subtitle: 'Contact details' },
    { number: 2, title: 'Service Details', subtitle: 'What you need' },
  ]

  it('renders all steps', () => {
    render(<StepIndicator steps={steps} currentStep={1} completedSteps={[]} />)
    expect(screen.getByText('Personal Info')).toBeInTheDocument()
    expect(screen.getByText('Service Details')).toBeInTheDocument()
  })

  it('shows active state for current step', () => {
    render(<StepIndicator steps={steps} currentStep={1} completedSteps={[]} />)
    const activeStep = screen.getByText('Personal Info').closest('div')
    expect(activeStep).toHaveClass('text-foreground')
  })
})`} />
        </Spoiler>
      </section>

      {/* Integration Testing */}
      <section className="space-y-6">
        <DocSectionHeader id="integration-testing">Integration Testing</DocSectionHeader>

        <Spoiler title="Test Form Step Navigation">
          <CodeBlock language="typescript" code={`// __tests__/components/organisms/multi-step-form.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MultiStepFormContainer } from '@/components/organisms/multi-step-form-container'

describe('MultiStepFormContainer', () => {
  it('starts on first step', () => {
    render(<MultiStepFormContainer />)
    expect(screen.getByText('Personal Info')).toBeInTheDocument()
  })

  it('validates and moves to next step', async () => {
    render(<MultiStepFormContainer />)
    await userEvent.type(screen.getByLabelText('First Name'), 'John')
    await userEvent.type(screen.getByLabelText('Last Name'), 'Doe')
    await userEvent.type(screen.getByLabelText('Email'), 'john@example.com')
    await userEvent.type(screen.getByLabelText('Phone'), '07700900000')
    await userEvent.click(screen.getByText('Continue'))
    expect(screen.getByText('Service Details')).toBeInTheDocument()
  })

  it('persists data when navigating back', async () => {
    render(<MultiStepFormContainer />)
    await userEvent.type(screen.getByLabelText('First Name'), 'John')
    await userEvent.click(screen.getByText('Continue'))
    await userEvent.click(screen.getByText('Back'))
    expect(screen.getByLabelText('First Name')).toHaveValue('John')
  })
})`} />
        </Spoiler>

        <Spoiler title="Test Zustand Store">
          <CodeBlock language="typescript" code={`// __tests__/lib/store/use-form-store.test.ts
import { renderHook, act } from '@testing-library/react'
import { useFormStore } from '@/lib/store/use-form-store'

describe('useFormStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useFormStore())
    act(() => { result.current.resetForm() })
  })

  it('updates personal info', () => {
    const { result } = renderHook(() => useFormStore())
    act(() => {
      result.current.updatePersonalInfo({
        firstName: 'John', lastName: 'Doe',
        email: 'john@example.com', phone: '07700900000'
      })
    })
    expect(result.current.personalInfo.firstName).toBe('John')
  })

  it('moves to next step', () => {
    const { result } = renderHook(() => useFormStore())
    expect(result.current.currentStep).toBe(1)
    act(() => { result.current.nextStep() })
    expect(result.current.currentStep).toBe(2)
  })
})`} />
        </Spoiler>
      </section>

      {/* E2E Testing */}
      <section className="space-y-6">
        <DocSectionHeader id="e2e-testing">E2E Testing with Playwright</DocSectionHeader>

        <Spoiler title="Setup Playwright">
          <CodeBlock language="bash" code={`npm install -D @playwright/test
npx playwright install`} />
          <CodeBlock language="typescript" code={`// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})`} />
        </Spoiler>

        <Spoiler title="Complete Form Submission Flow">
          <CodeBlock language="typescript" code={`// e2e/form-submission.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Electrical Service Request Form', () => {
  test('completes full form submission', async ({ page }) => {
    await page.goto('/')

    // Step 1: Personal Info
    await page.fill('[name="firstName"]', 'John')
    await page.fill('[name="lastName"]', 'Doe')
    await page.fill('[name="email"]', 'john.doe@example.com')
    await page.fill('[name="phone"]', '07700900000')
    await page.click('text=Continue')

    // Step 2: Service Details
    await expect(page.locator('text=Service Details')).toBeVisible()
    await page.selectOption('[name="serviceType"]', 'installation')
    await page.fill('[name="description"]', 'Need new outlets')
    await page.click('text=Continue')

    // Step 3-5: Continue through to submit
    // ...fill remaining steps...
    await page.click('text=Submit Request')
    await expect(page.locator('text=Request submitted successfully')).toBeVisible()
  })

  test('shows validation errors', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Continue')
    await expect(page.locator('text=First name is required')).toBeVisible()
  })
})`} />
        </Spoiler>
      </section>

      {/* Scripts */}
      <section className="space-y-6">
        <DocSectionHeader id="scripts">Package.json Scripts</DocSectionHeader>
        <CodeBlock language="json" code={`{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug"
  }
}`} />
      </section>

      {/* Best Practices */}
      <section className="space-y-6">
        <DocSectionHeader id="best-practices">Best Practices</DocSectionHeader>
        <div className="space-y-3">
          <Callout type="info" title="Test User Behavior, Not Implementation">
            Focus on what users see and do, not internal state or implementation details.
          </Callout>
          <Callout type="info" title="Mock External Dependencies">
            Mock API calls, localStorage, and other external services to keep tests fast and reliable.
          </Callout>
          <Callout type="info" title="Test Accessibility">
            {"Use testing-library's accessibility queries (getByRole, getByLabelText) to ensure your app is accessible."}
          </Callout>
          <Callout type="info" title="Run Tests in CI/CD">
            Automate testing in your deployment pipeline to catch issues before production.
          </Callout>
        </div>
      </section>
    </DocPage>
  )
}
