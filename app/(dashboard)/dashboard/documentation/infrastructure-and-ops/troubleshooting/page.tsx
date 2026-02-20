"use client"

import { DocPage, DocSectionHeader } from "@/components/molecules/doc-page"
import { CodeBlock } from "@/components/atoms/code-block"
import { Callout } from "@/components/atoms/callout"
import { Spoiler } from "@/components/atoms/spoiler"
import { AlertCircle } from "lucide-react"

const sections = [
  { id: "form-validation", title: "Form & Validation Issues" },
  { id: "animation-visual", title: "Animation & Visual Issues" },
  { id: "api-backend", title: "API & Backend Integration" },
  { id: "build-deployment", title: "Build & Deployment Issues" },
  { id: "performance", title: "Performance Issues" },
  { id: "getting-help", title: "Getting More Help" },
]

export default function TroubleshootingPage() {
  return (
    <DocPage
      title="Troubleshooting"
      description="Common issues and solutions for the multi-step form, animations, API integration, builds, and performance."
      icon={AlertCircle}
      badges={[{ label: "Support", variant: "outline" as const }]}
      tags={["debugging", "FAQ", "common-issues", "solutions"]}
      meta={[
        { label: "Audience", value: "All Roles" },
        { label: "Last Updated", value: "2026-02-10" },
      ]}
      sections={sections}
    >
      {/* Form & Validation Issues */}
      <section className="space-y-4">
        <DocSectionHeader id="form-validation">Form & Validation Issues</DocSectionHeader>

        <Spoiler title="Form validation not working">
          <p className="text-sm text-muted-foreground mb-2">
            <strong>Symptoms:</strong> Form submits without validation or shows no error messages
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
            <li>Check that Zod schemas are properly imported in form steps</li>
            <li>Verify zodResolver is passed to useForm hook</li>
            <li>Ensure error messages are rendered in form components</li>
            <li>Check browser console for validation errors</li>
          </ul>
          <CodeBlock
            title="Correct implementation"
            language="typescript"
            code={`const form = useForm({
  resolver: zodResolver(personalInfoSchema),
  mode: 'onSubmit',
  reValidateMode: 'onChange'
})`}
          />
        </Spoiler>

        <Spoiler title="Form data not persisting on refresh">
          <p className="text-sm text-muted-foreground mb-2">
            <strong>Symptoms:</strong> Data is lost when page refreshes
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
            <li>Verify Zustand persist middleware is configured</li>
            <li>Check localStorage in browser DevTools</li>
            <li>{"Ensure storage key matches: 'form-storage'"}</li>
            <li>Clear localStorage if corrupted and try again</li>
          </ul>
          <CodeBlock
            title="Clear corrupted storage"
            language="javascript"
            code={`localStorage.removeItem('form-storage')
// Then refresh the page`}
          />
        </Spoiler>

        <Spoiler title="Step navigation stuck or not working">
          <p className="text-sm text-muted-foreground mb-2">
            <strong>Symptoms:</strong> {"Can't move between steps or buttons don't respond"}
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
            <li>Check that currentStep state is updating in Zustand store</li>
            <li>Verify nextStep/prevStep functions are being called</li>
            <li>Ensure validation passes before moving to next step</li>
            <li>Check browser console for errors</li>
          </ul>
        </Spoiler>
      </section>

      {/* Animation & Visual Issues */}
      <section className="space-y-4">
        <DocSectionHeader id="animation-visual">Animation & Visual Issues</DocSectionHeader>

        <Spoiler title="Light bulb animations not showing">
          <p className="text-sm text-muted-foreground mb-2">
            <strong>Symptoms:</strong> {"Light bulbs don't glow or animate"}
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
            <li>Check that Framer Motion is installed: npm install framer-motion</li>
            <li>Verify motion components are imported from framer-motion</li>
            <li>Check if prefers-reduced-motion is enabled in OS settings</li>
            <li>Inspect element to see if animation classes are applied</li>
          </ul>
        </Spoiler>

        <Spoiler title="Electric glow effects not visible">
          <p className="text-sm text-muted-foreground mb-2">
            <strong>Symptoms:</strong> No glow effects on inputs or buttons
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
            <li>Check that globals.css is imported in layout.tsx</li>
            <li>Verify electric-glow classes are defined in CSS</li>
            <li>{"Ensure CSS custom properties are set in :root"}</li>
            <li>Check if dark mode is affecting visibility</li>
          </ul>
        </Spoiler>

        <Spoiler title="Theme toggle not working">
          <p className="text-sm text-muted-foreground mb-2">
            <strong>Symptoms:</strong> {"Clicking theme toggle doesn't change theme"}
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
            <li>Verify ThemeProvider wraps the app in layout.tsx</li>
            <li>{"Check that 'use client' directive is present in ThemeProvider"}</li>
            <li>Ensure useTheme hook is called inside ThemeProvider</li>
            <li>{"Check localStorage for 'theme' key"}</li>
          </ul>
        </Spoiler>
      </section>

      {/* API & Backend Integration */}
      <section className="space-y-4">
        <DocSectionHeader id="api-backend">API & Backend Integration</DocSectionHeader>

        <Spoiler title="Form submission fails with CORS error">
          <p className="text-sm text-muted-foreground mb-2">
            <strong>Error:</strong> {"Access to fetch at 'Strapi URL' has been blocked by CORS policy"}
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
            <li>Configure CORS in Strapi: config/middlewares.js</li>
            <li>Add your frontend URL to allowed origins</li>
            <li>{"Ensure credentials: 'include' if using cookies"}</li>
          </ul>
          <CodeBlock
            title="backend/config/middlewares.js"
            language="javascript"
            code={`module.exports = [
  {
    name: 'strapi::cors',
    config: {
      origin: ['http://localhost:3000', 'https://your-domain.com'],
      credentials: true,
    },
  },
]`}
          />
        </Spoiler>

        <Spoiler title="401 Unauthorized error on submission">
          <p className="text-sm text-muted-foreground mb-2">
            <strong>Error:</strong> Request returns 401 Unauthorized
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
            <li>Check STRAPI_API_TOKEN is set in environment variables</li>
            <li>Verify token is valid in Strapi admin panel</li>
            <li>Ensure Authorization header is correctly formatted</li>
            <li>Check Strapi permissions for public role</li>
          </ul>
        </Spoiler>

        <Spoiler title="Submission succeeds but data not in Strapi">
          <p className="text-sm text-muted-foreground mb-2">
            <strong>Symptoms:</strong> API returns 200 but no data appears in Strapi
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
            <li>Check data structure matches Strapi schema</li>
            <li>Verify component names are correct (contact.contact-information)</li>
            <li>Ensure required fields are provided</li>
            <li>Check Strapi logs for validation errors</li>
          </ul>
        </Spoiler>
      </section>

      {/* Build & Deployment Issues */}
      <section className="space-y-4">
        <DocSectionHeader id="build-deployment">Build & Deployment Issues</DocSectionHeader>

        <Spoiler title="Build fails with TypeScript errors">
          <p className="text-sm text-muted-foreground mb-2">
            <strong>Error:</strong> Type errors during npm run build
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
            <li>Run npm run type-check locally to see all errors</li>
            <li>Check that all imports have correct types</li>
            <li>Verify Zod schemas match TypeScript interfaces</li>
            <li>Ensure @types packages are installed</li>
          </ul>
        </Spoiler>

        <Spoiler title="Environment variables not working in production">
          <p className="text-sm text-muted-foreground mb-2">
            <strong>Symptoms:</strong> App works locally but breaks in production
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
            <li>Add all environment variables in Vercel dashboard</li>
            <li>Redeploy after adding new environment variables</li>
            <li>Use NEXT_PUBLIC_ prefix for client-side variables</li>
            <li>Never expose API tokens with NEXT_PUBLIC_ prefix</li>
          </ul>
        </Spoiler>

        <Spoiler title="Page styles look broken in production">
          <p className="text-sm text-muted-foreground mb-2">
            <strong>Symptoms:</strong> Styles work in dev but not production
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
            <li>Check that globals.css is imported in layout.tsx</li>
            <li>Verify Tailwind content paths include all component files</li>
            <li>Run npm run build locally to test production build</li>
            <li>Clear browser cache and hard refresh</li>
          </ul>
        </Spoiler>
      </section>

      {/* Performance Issues */}
      <section className="space-y-4">
        <DocSectionHeader id="performance">Performance Issues</DocSectionHeader>

        <Spoiler title="Slow page load or animations laggy">
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
            <li>Use React DevTools Profiler to identify slow components</li>
            <li>Implement code splitting with dynamic imports</li>
            <li>Reduce animation complexity or duration</li>
            <li>{"Use production build for testing (npm run build && npm start)"}</li>
            <li>Check network tab for slow API requests</li>
          </ul>
        </Spoiler>

        <Spoiler title="High memory usage or browser crashes">
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
            <li>Check for memory leaks in useEffect hooks</li>
            <li>Ensure all intervals/timeouts are cleaned up</li>
            <li>Remove unused animations or reduce particle counts</li>
            <li>Use React.memo for expensive components</li>
          </ul>
        </Spoiler>
      </section>

      {/* Getting More Help */}
      <section className="space-y-4">
        <DocSectionHeader id="getting-help">Getting More Help</DocSectionHeader>

        <Callout type="info" title="Debugging Tools">
          Use your browser DevTools (F12) to inspect the Console, Network, and React component trees.
          These are the fastest way to diagnose most issues.
        </Callout>

        <div className="responsive-grid-2">
          <div className="border border-border rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-foreground">Check Browser Console</h3>
            <p className="text-sm text-muted-foreground">Press F12 to open DevTools and check Console tab for errors</p>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-foreground">Network Tab</h3>
            <p className="text-sm text-muted-foreground">Check Network tab to see API requests and responses</p>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-foreground">React DevTools</h3>
            <p className="text-sm text-muted-foreground">Install React DevTools extension to inspect component state</p>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-foreground">Community Support</h3>
            <p className="text-sm text-muted-foreground">Search or ask questions on Stack Overflow, GitHub Discussions</p>
          </div>
        </div>
      </section>
    </DocPage>
  )
}
