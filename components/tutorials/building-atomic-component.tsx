"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  SectionHeader,
  KeyTakeaway,
  InfoBox,
  StatsTable,
  NumberedList,
  ProcessFlow,
  FeatureGrid,
} from "@/components/molecules/article-components"
import { CodeBlock } from "@/components/atoms/code-block"
import { CodeExplanation } from "@/components/atoms/code-explanation"

export function BuildingAtomicComponentContent() {
  return (
    <div className="space-y-8">
      {/* Introduction */}
      <section>
        <SectionHeader number="01" title="Building Your First Atomic Component" id="overview" />
        <p className="text-muted-foreground leading-relaxed mt-4">
          Atomic components are the smallest, most reusable building blocks in your design system.
          In this tutorial, you will build a fully accessible FormInput component that follows
          atomic design principles -- starting from interface design through to accessibility implementation.
        </p>
      </section>

      {/* What You'll Build */}
      <FeatureGrid
        title="What You Will Build"
        features={[
          { title: "TypeScript Interface", description: "Extend HTML input attributes for full type safety" },
          { title: "Accessible Input", description: "ARIA labels, error states, and screen reader support" },
          { title: "Error Handling", description: "Visual and accessible error message display" },
          { title: "Reusable API", description: "Props spreading for maximum flexibility" },
        ]}
      />

      {/* Step 1 */}
      <section>
        <SectionHeader number="02" title="Step 1: Understanding the Requirements" id="step-1" />
        <p className="text-muted-foreground leading-relaxed mt-4 mb-4">
          A FormInput atom needs to accept a label, name, error message, and all standard input props
          while maintaining accessibility.
        </p>
        <CodeBlock
          language="typescript"
          title="Challenge: Design the component API"
          code={`// Create a FormInput component that:
// 1. Accepts label, name, error props
// 2. Extends standard HTML input attributes
// 3. Shows error message when provided
// 4. Has accessible ARIA labels
// 5. Uses proper TypeScript types`}
        />
        <CodeExplanation
          terms={[
            { term: "Extends HTML attributes", description: "By extending React.InputHTMLAttributes, your component inherits all native input props (onChange, value, placeholder, etc.) without manually typing each one." },
            { term: "ARIA labels", description: "Accessible Rich Internet Applications attributes that help screen readers understand the purpose and state of form elements." },
            { term: "Error props", description: "A dedicated error prop lets the component visually and semantically indicate validation failures." },
          ]}
          summary="The key principle: an atomic component should be self-contained, fully typed, and accessible by default."
        />
      </section>

      {/* Step 2 */}
      <section>
        <SectionHeader number="03" title="Step 2: Defining the Interface" id="step-2" />
        <p className="text-muted-foreground leading-relaxed mt-4 mb-4">
          Start by defining a TypeScript interface that extends HTML input attributes.
        </p>
        <CodeBlock
          language="typescript"
          title="Solution: FormInput interface"
          code={`interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  name: string
  error?: string
}`}
        />
        <CodeExplanation
          terms={[
            { term: "extends React.InputHTMLAttributes<HTMLInputElement>", description: "This gives your component all standard input props (onChange, value, type, placeholder, disabled, etc.) automatically." },
            { term: "label: string", description: "Required label text. Making it required enforces accessibility -- every input must have a visible label." },
            { term: "error?: string", description: "Optional error message. The ? makes it optional so the component works in both valid and invalid states." },
          ]}
          summary="Extending native HTML attributes is the foundation of reusable atomic components -- you get full type safety with minimal code."
        />
      </section>

      {/* Step 3 */}
      <section>
        <SectionHeader number="04" title="Step 3: Building the Component" id="step-3" />
        <p className="text-muted-foreground leading-relaxed mt-4 mb-4">
          Now implement the component with proper accessibility attributes.
        </p>
        <CodeBlock
          language="typescript"
          title="Solution: Complete FormInput component"
          code={`export function FormInput({ 
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
        className={\`w-full px-4 py-2 rounded-lg border \${
          error ? 'border-red-500' : 'border-border'
        }\`}
        {...props}
      />
      {error && (
        <p 
          id={\`\${name}-error\`} 
          className="text-sm text-red-500" 
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  )
}`}
        />
        <CodeExplanation
          terms={[
            { term: "htmlFor={name}", description: "Links the label to the input by matching the input's id. Clicking the label focuses the input -- essential for accessibility." },
            { term: "aria-invalid={!!error}", description: "Tells screen readers the input is in an error state. The !! converts the error string to a boolean." },
            { term: "aria-describedby", description: "Points screen readers to the error message element so they read it when the input is focused." },
            { term: "role=\"alert\"", description: "Makes the error message a live region -- screen readers announce it immediately when it appears." },
            { term: "{...props}", description: "Props spreading passes all remaining HTML attributes to the input." },
          ]}
          summary="The aria-invalid and aria-describedby attributes create a semantic connection between the input and its error message, making the form fully navigable by screen readers."
        />
      </section>

      {/* Best Practices */}
      <InfoBox type="tip" title="Atomic Component Patterns">
        <ul className="list-disc list-inside space-y-1">
          <li>Always extend native HTML attributes for full type safety</li>
          <li>Make accessibility props required (labels) not optional</li>
          <li>Use aria-invalid and aria-describedby for error states</li>
          <li>Spread remaining props to maintain native functionality</li>
          <li>{"Use role='alert' for dynamic error messages"}</li>
        </ul>
      </InfoBox>

      {/* Process Summary */}
      <ProcessFlow
        title="Component Building Process"
        steps={[
          "Define the TypeScript interface extending native attributes",
          "Destructure custom props, spread the rest",
          "Add semantic HTML (label + htmlFor)",
          "Wire up ARIA attributes for accessibility",
          "Add conditional error display with role='alert'",
        ]}
      />

      <KeyTakeaway>
        An atomic component should be indistinguishable from a native HTML element in terms of API surface, but with added accessibility, styling, and type safety baked in.
      </KeyTakeaway>
    </div>
  )
}
