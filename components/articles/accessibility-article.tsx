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
  ProcessFlow,
  ArticleIcons,
  type TOCItem,
} from "@/components/molecules/article-components"

const tocItems: TOCItem[] = [
  { id: "business-case", title: "The Business Case", level: 2 },
  { id: "semantic-html", title: "Semantic HTML Foundation", level: 2 },
  { id: "focus-management", title: "Focus Management", level: 2 },
  { id: "aria-implementation", title: "ARIA Implementation", level: 2 },
  { id: "color-contrast", title: "Color & Contrast", level: 2 },
  { id: "testing-approach", title: "Testing Approach", level: 2 },
  { id: "key-takeaway", title: "Key Takeaway", level: 2 },
]

export function AccessibilityArticleContent() {
  return (
    <div className="flex gap-8">
      <div className="flex-1 min-w-0">
        <InfoBox type="important">
          Accessibility is not optional - it is a legal requirement in many jurisdictions and a business 
          imperative. Building accessible applications from the start is significantly cheaper than 
          retrofitting accessibility later.
        </InfoBox>

        <SectionHeader number="01" title="The Business Case" id="business-case" />

        <p className="text-muted-foreground mb-6">
          Before diving into implementation, it is important to understand why accessibility matters 
          beyond compliance. The numbers make a compelling case for investment.
        </p>

        <MetricsGrid
          metrics={[
            { label: "Global Population", value: "15%", change: "Has some form of disability", positive: true },
            { label: "SEO Improvement", value: "50%", change: "Better search performance", positive: true },
            { label: "Market Reach", value: "1B+", change: "Potential users globally", positive: true },
            { label: "Legal Risk", value: "High", change: "Non-compliance penalties", positive: false },
          ]}
        />

        <FeatureGrid
          columns={2}
          features={[
            {
              icon: <ArticleIcons.Shield className="h-5 w-5" />,
              title: "UK Equality Act",
              description: "Requires reasonable adjustments for disabled users accessing services",
            },
            {
              icon: <ArticleIcons.Shield className="h-5 w-5" />,
              title: "Americans with Disabilities Act",
              description: "Applies to websites of public accommodations in the US",
            },
            {
              icon: <ArticleIcons.Shield className="h-5 w-5" />,
              title: "European Accessibility Act",
              description: "EU-wide requirements coming into full effect in 2025",
            },
            {
              icon: <ArticleIcons.Check className="h-5 w-5" />,
              title: "WCAG 2.1 AA",
              description: "The international standard referenced by most regulations",
            },
          ]}
        />

        <SectionHeader number="02" title="Semantic HTML Foundation" id="semantic-html" />

        <p className="text-muted-foreground mb-4">
          The foundation of accessible web applications is semantic HTML. Using the correct 
          elements provides built-in accessibility features that ARIA cannot replicate.
        </p>

        <ComparisonCards
          idealTitle="Best Practice"
          notIdealTitle="Anti-Pattern"
          idealFor={[
            "Using semantic elements (nav, main, article)",
            "Native button and link elements",
            "Proper heading levels (h1-h6)",
            "Form elements with associated labels",
          ]}
          notIdealFor={[
            "Using div for everything",
            "Click handlers on non-interactive elements",
            "No heading hierarchy",
            "Buttons made from spans or divs",
          ]}
        />

        <CodeBlock
          filename="Bad vs Good: Interactive Elements"
          code={`// BAD - Inaccessible
<div onClick={handleSubmit} className="btn">Submit</div>

// GOOD - Accessible
<button type="submit" onClick={handleSubmit}>
  Submit Form
</button>

// BAD - No label association
<span>Email</span>
<input type="email" />

// GOOD - Properly labeled
<label htmlFor="email">Email address</label>
<input 
  id="email"
  type="email"
  aria-describedby="email-hint"
/>
<span id="email-hint" className="text-sm text-muted">
  We will never share your email
</span>`}
        />

        <InfoBox type="tip" title="The First Rule of ARIA">
          Do not use ARIA if you can use a native HTML element that provides the same functionality. 
          Native elements have built-in keyboard handling, focus management, and screen reader support.
        </InfoBox>

        <SectionHeader number="03" title="Focus Management" id="focus-management" />

        <p className="text-muted-foreground mb-4">
          Keyboard users navigate with Tab, Shift+Tab, and arrow keys. Proper focus management 
          ensures they can access all interactive content in a logical order.
        </p>

        <ProcessFlow
          title="Focus Management Checklist"
          steps={[
            { label: "Visible Focus", sublabel: "All interactive elements must have visible focus indicators" },
            { label: "Logical Order", sublabel: "Tab order should follow visual reading order" },
            { label: "Focus Trapping", sublabel: "Modals should trap focus until dismissed" },
            { label: "Focus Restoration", sublabel: "Return focus to trigger element when closing modals" },
          ]}
        />

        <CodeBlock
          filename="components/modal.tsx"
          code={`import { useEffect, useRef } from "react"

export function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (isOpen) {
      // Store the element that triggered the modal
      triggerRef.current = document.activeElement as HTMLElement
      
      // Focus the modal container
      modalRef.current?.focus()
    } else if (triggerRef.current) {
      // Restore focus when modal closes
      triggerRef.current.focus()
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      tabIndex={-1}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="bg-card p-6 rounded-lg max-w-md">
        {children}
      </div>
    </div>
  )
}`}
        />

        <SectionHeader number="04" title="ARIA Implementation" id="aria-implementation" />

        <p className="text-muted-foreground mb-4">
          When native HTML semantics are insufficient, ARIA (Accessible Rich Internet Applications) 
          attributes provide additional context to assistive technologies.
        </p>

        <StatsTable
          title="Essential ARIA Attributes"
          headers={["Attribute", "Purpose", "Example Use"]}
          rows={[
            ["aria-label", "Provides accessible name when text is not visible", "Icon-only buttons"],
            ["aria-describedby", "Associates element with descriptive text", "Form field hints"],
            ["aria-expanded", "Indicates if collapsible content is open", "Accordion, dropdown"],
            ["aria-live", "Announces dynamic content changes", "Toast notifications"],
            ["aria-invalid", "Indicates validation state", "Form fields with errors"],
            ["aria-hidden", "Hides decorative content from screen readers", "Decorative icons"],
          ]}
        />

        <CodeBlock
          filename="components/form-field.tsx"
          code={`interface FormFieldProps {
  id: string
  label: string
  error?: string
  hint?: string
}

export function FormField({ id, label, error, hint, ...props }: FormFieldProps) {
  const errorId = \`\${id}-error\`
  const hintId = \`\${id}-hint\`
  
  // Build aria-describedby from available descriptions
  const describedBy = [
    hint && hintId,
    error && errorId,
  ].filter(Boolean).join(" ")

  return (
    <div>
      <label htmlFor={id} className="font-medium">
        {label}
      </label>
      
      {hint && (
        <p id={hintId} className="text-sm text-muted-foreground">
          {hint}
        </p>
      )}
      
      <input
        id={id}
        aria-describedby={describedBy || undefined}
        aria-invalid={!!error}
        className={error ? "border-red-500" : ""}
        {...props}
      />
      
      {error && (
        <p id={errorId} role="alert" className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  )
}`}
        />

        <SectionHeader number="05" title="Color & Contrast" id="color-contrast" />

        <p className="text-muted-foreground mb-4">
          Color contrast affects users with low vision, color blindness, and those in bright 
          environments. WCAG requires minimum contrast ratios between text and background.
        </p>

        <StatsTable
          title="WCAG Contrast Requirements"
          headers={["Element Type", "AA Standard", "AAA Standard"]}
          rows={[
            ["Normal text (< 18px)", "4.5:1 minimum", "7:1 minimum"],
            ["Large text (18px+ or 14px bold)", "3:1 minimum", "4.5:1 minimum"],
            ["UI components & graphics", "3:1 minimum", "Not specified"],
            ["Focus indicators", "3:1 minimum", "Not specified"],
          ]}
        />

        <InfoBox type="warning" title="Do Not Rely on Color Alone">
          Never use color as the only way to convey information. Always provide an additional 
          indicator such as text, an icon, or a pattern. This helps users with color blindness 
          and ensures information is preserved when printed in grayscale.
        </InfoBox>

        <CodeBlock
          filename="Accessible Status Indicators"
          code={`// BAD - Color only
<span className={status === "error" ? "text-red-500" : "text-green-500"}>
  {status}
</span>

// GOOD - Color + Icon + Text
<span className={status === "error" ? "text-red-500" : "text-green-500"}>
  {status === "error" ? (
    <>
      <XCircle className="inline h-4 w-4 mr-1" aria-hidden="true" />
      Error: {message}
    </>
  ) : (
    <>
      <CheckCircle className="inline h-4 w-4 mr-1" aria-hidden="true" />
      Success: {message}
    </>
  )}
</span>`}
        />

        <SectionHeader number="06" title="Testing Approach" id="testing-approach" />

        <p className="text-muted-foreground mb-4">
          A comprehensive accessibility testing strategy combines automated tools with manual 
          testing and real user feedback.
        </p>

        <ProcessFlow
          title="Accessibility Testing Layers"
          steps={[
            { label: "Automated", sublabel: "axe-core, Lighthouse, ESLint a11y plugin - catches ~30% of issues" },
            { label: "Manual", sublabel: "Keyboard-only navigation, zoom to 200%, high contrast mode" },
            { label: "Screen Reader", sublabel: "Test with VoiceOver (Mac), NVDA (Windows), TalkBack (Android)" },
            { label: "User Testing", sublabel: "Include disabled users in usability testing sessions" },
          ]}
        />

        <CodeBlock
          filename="Automated Testing Setup"
          code={`// Install axe-core for testing
// npm install -D @axe-core/react

// Add to your test setup or dev mode
import React from "react"
import ReactDOM from "react-dom"

if (process.env.NODE_ENV === "development") {
  import("@axe-core/react").then((axe) => {
    axe.default(React, ReactDOM, 1000)
  })
}

// In Playwright E2E tests
import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

test("page should be accessible", async ({ page }) => {
  await page.goto("/contact")
  
  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze()
  
  expect(accessibilityScanResults.violations).toEqual([])
})`}
        />

        <SectionHeader number="07" title="Key Takeaway" id="key-takeaway" />
        <KeyTakeaway>
          Build accessibility in from the start - retrofitting is expensive and incomplete. Use 
          semantic HTML as your foundation, add ARIA only when necessary, ensure proper focus 
          management, and test with real assistive technologies.
        </KeyTakeaway>

        <RelatedArticles
          articles={[
            {
              href: "/dashboard/content-library/articles/security-architecture-deep-dive",
              title: "Security Architecture Deep Dive",
              level: "advanced",
            },
            {
              href: "/dashboard/content-library/articles/multi-step-form-architecture",
              title: "Multi-Step Form Architecture",
              level: "intermediate",
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
