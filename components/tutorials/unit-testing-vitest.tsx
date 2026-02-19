"use client"

import {
  TableOfContents,
  SectionHeader,
  StepFlow,
  InfoBox,
  KeyTakeaway,
  NumberedList,
  ProcessFlow,
  FeatureGrid,
  CodeBlock as ArticleCodeBlock,
} from "@/components/molecules/article-components"
import { CodeBlock } from "@/components/atoms/code-block"
import { CodeExplanation } from "@/components/atoms/code-explanation"

export function UnitTestingVitestContent() {
  return (
    <div className="space-y-8">
      <TableOfContents
        items={[
          { id: "why-test", title: "Why Write Tests?" },
          { id: "setup", title: "Setting Up Vitest" },
          { id: "first-test", title: "Your First Unit Test" },
          { id: "testing-components", title: "Testing React Components" },
          { id: "running-tests", title: "Running and Debugging Tests" },
        ]}
      />

      <SectionHeader number="1" title="Why Write Tests?" id="why-test" />

      <p className="text-muted-foreground leading-relaxed">
        Tests catch bugs before your users do. They give you confidence to refactor code, add new
        features, and ship updates without worrying about breaking existing functionality. Unit tests
        verify individual functions and components work correctly in isolation.
      </p>

      <FeatureGrid
        features={[
          {
            title: "Catch Bugs Early",
            description: "Find problems during development, not in production",
          },
          {
            title: "Refactor Safely",
            description: "Change code confidently knowing tests verify behavior",
          },
          {
            title: "Document Behavior",
            description: "Tests serve as living documentation of how code should work",
          },
          {
            title: "Faster Development",
            description: "Quick feedback loops vs manually testing in the browser",
          },
        ]}
        columns={2}
      />

      <SectionHeader number="2" title="Setting Up Vitest" id="setup" />

      <StepFlow
        steps={[
          {
            number: "1",
            title: "Install Dependencies",
            description: "Add Vitest and React Testing Library to your project",
          },
          {
            number: "2",
            title: "Configure Vitest",
            description: "Create vitest.config.ts with React and jsdom support",
          },
          {
            number: "3",
            title: "Create Setup File",
            description: "Add testing utilities that run before each test",
          },
        ]}
      />

      <CodeBlock
        code={`# Install testing dependencies
npm install -D vitest @vitejs/plugin-react jsdom
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event`}
        language="bash"
        filename="Terminal"
      />

      <CodeBlock
        code={`// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
})`}
        language="typescript"
        filename="vitest.config.ts"
      />

      <CodeExplanation
        summary="Vitest configuration explained"
        terms={[
          { term: "environment: 'jsdom'", description: "Simulates a browser environment so you can test DOM manipulation" },
          { term: "globals: true", description: "Makes describe, it, expect available without importing them" },
          { term: "setupFiles", description: "Runs this file before every test to set up common utilities" },
        ]}
      />

      <CodeBlock
        code={`// vitest.setup.ts
import '@testing-library/jest-dom'`}
        language="typescript"
        filename="vitest.setup.ts"
      />

      <InfoBox type="info" title="What does jest-dom add?">
        It adds useful matchers like <code>toBeInTheDocument()</code>, <code>toHaveTextContent()</code>,
        and <code>toBeVisible()</code> that make assertions about DOM elements more readable.
      </InfoBox>

      <SectionHeader number="3" title="Your First Unit Test" id="first-test" />

      <CodeBlock
        code={`// lib/utils.test.ts
import { describe, it, expect } from 'vitest'

function formatPrice(cents: number): string {
  return '$' + (cents / 100).toFixed(2)
}

describe('formatPrice', () => {
  it('formats cents to dollar string', () => {
    expect(formatPrice(999)).toBe('$9.99')
  })

  it('handles zero', () => {
    expect(formatPrice(0)).toBe('$0.00')
  })

  it('handles large amounts', () => {
    expect(formatPrice(100000)).toBe('$1000.00')
  })
})`}
        language="typescript"
        filename="lib/utils.test.ts"
      />

      <CodeExplanation
        summary="Test structure explained"
        terms={[
          { term: "describe", description: "Groups related tests together under a label" },
          { term: "it", description: "Defines a single test case -- should read like a sentence: 'it formats cents to dollar string'" },
          { term: "expect().toBe()", description: "Asserts that the actual value equals the expected value" },
        ]}
      />

      <ProcessFlow
        steps={[
          "Write the function",
          "Write test cases for expected behavior",
          "Run tests to verify they pass",
          "Add edge cases (zero, negatives, large values)",
        ]}
        title="Test-First Workflow"
      />

      <SectionHeader number="4" title="Testing React Components" id="testing-components" />

      <CodeBlock
        code={`// components/button.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'

function Button({ onClick, children }: { onClick?: () => void; children: React.ReactNode }) {
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

  it('is accessible by role', () => {
    render(<Button>Submit</Button>)
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()
  })
})`}
        language="typescript"
        filename="components/button.test.tsx"
      />

      <CodeExplanation
        summary="Component testing patterns explained"
        terms={[
          { term: "render()", description: "Renders the component into a virtual DOM for testing" },
          { term: "screen.getByRole()", description: "Finds elements by their accessibility role -- the recommended approach" },
          { term: "vi.fn()", description: "Creates a mock function that tracks how it was called" },
          { term: "userEvent.click()", description: "Simulates a real user click, including focus and event bubbling" },
        ]}
      />

      <InfoBox type="tip" title="Testing best practice">
        Always query by accessibility role (<code>getByRole</code>) or label (<code>getByLabelText</code>) first.
        This ensures your components are accessible AND testable. Avoid querying by test IDs unless there is no better option.
      </InfoBox>

      <SectionHeader number="5" title="Running and Debugging Tests" id="running-tests" />

      <ArticleCodeBlock
        code={`# Run tests in watch mode (reruns on file changes):
npm test

# Run tests once:
npx vitest run

# Run a specific test file:
npx vitest run components/button.test.tsx

# Run with verbose output:
npx vitest run --reporter=verbose`}
        language="bash"
        filename="Terminal"
      />

      <NumberedList
        items={[
          "Read the error message carefully -- it tells you which assertion failed and why",
          "Check the expected vs received values in the diff output",
          "Use console.log() inside tests to inspect intermediate values",
          "Run a single test with it.only() to isolate failures",
          "Check that your component renders what you think it renders with screen.debug()",
        ]}
      />

      <KeyTakeaway>
        Good tests verify behavior, not implementation. Test what the user sees and does,
        not the internal details of how your component works. If you refactor the internals
        but the behavior stays the same, your tests should still pass.
      </KeyTakeaway>
    </div>
  )
}
