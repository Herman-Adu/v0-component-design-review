"use client"

export const socialPosts = [
  {
    id: "email-integration-linkedin",
    title: "Email Integration with Resend & React Email",
    excerpt: "How we built professional email templates for our electrical service platform",
    platform: "LinkedIn" as const,
    level: "intermediate" as const,
    content: `Just integrated Resend + React Email into our electrical service platform! 🔌⚡

Here's what we built:
✅ Customer confirmation emails (friendly, reassuring)
✅ Business notification emails (detailed request info)
✅ Emergency service alerts (red danger theme, urgent)

All with beautiful, responsive templates that work across all email clients.

Key learnings:
• React Email components vs pure HTML (we chose HTML for reliability)
• Server actions for email sending (never client-side)
• Template testing with preview pages before sending
• Separation of concerns: templates, services, validation

The satisfaction of seeing professionally branded emails hit inboxes? Priceless.

#WebDevelopment #EmailTemplates #NextJS #Resend #ReactEmail`,
    hashtags: ["#WebDevelopment", "#EmailTemplates", "#NextJS", "#Resend", "#ReactEmail"],
  },
  {
    id: "atomic-design-twitter",
    title: "Atomic Design in Practice",
    excerpt: "Building reusable components from atoms to organisms",
    platform: "Twitter/X" as const,
    level: "beginner" as const,
    content: `Just shipped our electrical service booking form! Built with atomic design, type-safe validation, and full accessibility. 

Atoms → Molecules → Organisms → Templates → Pages

The formula that scales. 🚀`,
    hashtags: ["#ReactJS", "#NextJS", "#WebDev", "#AtomicDesign", "#TypeScript"],
  },
  {
    id: "debugging-react-twitter",
    title: "Debugging React Version Conflicts",
    excerpt: "How we solved React Email version mismatch errors",
    platform: "Twitter/X" as const,
    level: "advanced" as const,
    content: `Spent 2 hours debugging "Cannot read properties of undefined" in React Email.

The issue? React version mismatch between @react-email/components (19.3.0) and our project (19.2.1).

The solution? Ditched React Email components entirely. Built HTML templates instead.

Sometimes the best solution is the simpler one. 🧠`,
    hashtags: ["#React", "#Debugging", "#WebDev", "#LessonsLearned"],
  },
  {
    id: "server-actions-linkedin",
    title: "Server Actions > REST APIs",
    excerpt: "Why we chose Next.js Server Actions for our form handling",
    platform: "LinkedIn" as const,
    level: "intermediate" as const,
    content: `Hot take: Server Actions in Next.js 16 are better than traditional REST APIs for most use cases.

Here's why we switched:

✅ Type Safety End-to-End
• Shared Zod schemas between client & server
• No API route boilerplate
• TypeScript inference just works

✅ Automatic Serialization
• No manual JSON.stringify/parse
• FormData handling built-in
• File uploads simplified

✅ Simpler Code
• One function instead of route + handler + client fetch
• Colocated with components
• Less mental overhead

✅ Better DX
• Hot reload works perfectly
• Easier debugging with server-side logs
• Progressive enhancement by default

We cut our API layer code by 40% and improved type safety significantly.

What's your experience with Server Actions?

#NextJS #ServerActions #TypeScript #WebDevelopment`,
    hashtags: ["#NextJS", "#ServerActions", "#TypeScript", "#WebDevelopment"],
  },
  {
    id: "css-tokens-facebook",
    title: "Design Tokens Changed Everything",
    excerpt: "How CSS custom properties transformed our theming system",
    platform: "Facebook" as const,
    level: "beginner" as const,
    content: `🎨 Design tokens changed how we think about CSS!

Instead of hardcoding colors everywhere:
❌ background-color: #f59e0b;
❌ color: #1e293b;

We use semantic tokens:
✅ background: var(--accent);
✅ color: var(--foreground);

Benefits:
• Dark mode = swap token values
• Consistent design system
• Easy theme customization
• Better maintainability

One change in globals.css updates the entire app. That's the power of CSS custom properties!

#CSS #WebDesign #DesignSystems #DarkMode`,
    hashtags: ["#CSS", "#WebDesign", "#DesignSystems", "#DarkMode"],
  },
  {
    id: "validation-patterns-twitter",
    title: "Multi-Layer Validation Strategy",
    excerpt: "Client UX + Server Security = Bulletproof Forms",
    platform: "Twitter/X" as const,
    level: "intermediate" as const,
    content: `Client validation = UX
Server validation = Security

We implemented both with Zod:

1️⃣ Client: Instant feedback, better UX
2️⃣ Server: Cannot be bypassed, secure

Same schema, validated twice. Defense in depth. 🛡️

Never trust client-side data!`,
    hashtags: ["#WebSecurity", "#Validation", "#Zod", "#NextJS"],
  },
  {
    id: "accessibility-wins-linkedin",
    title: "Accessibility Wins: Beyond Compliance",
    excerpt: "How proper ARIA labels improved our form completion rates",
    platform: "LinkedIn" as const,
    level: "intermediate" as const,
    content: `Accessibility isn't just about compliance—it's about better UX for everyone.

After implementing proper ARIA labels, semantic HTML, and keyboard navigation:

📈 Form completion rate: +12%
📈 Error recovery rate: +23%
📈 Mobile conversion: +8%

What we did:
• aria-invalid for error states
• aria-describedby for helpful hints
• Proper focus management
• Screen reader tested every flow
• Keyboard navigation first

The kicker? These improvements helped ALL users, not just those using assistive tech.

Accessible design = better design.

#Accessibility #WebDevelopment #UX #ARIA #InclusiveDesign`,
    hashtags: ["#Accessibility", "#WebDevelopment", "#UX", "#ARIA", "#InclusiveDesign"],
  },
  {
    id: "error-boundaries-twitter",
    title: "Error Boundaries Saved Our App",
    excerpt: "Graceful degradation in production",
    platform: "Twitter/X" as const,
    level: "advanced" as const,
    content: `Production bug at 2am. One component crashes → entire app white screen. 😱

Enter: Error Boundaries.

Now when something breaks:
✅ Show fallback UI
✅ Log error details
✅ Rest of app keeps working

Graceful degradation = happy users even when things go wrong.`,
    hashtags: ["#React", "#ErrorHandling", "#ProductionReady", "#WebDev"],
  },
  {
    id: "performance-metrics-facebook",
    title: "Performance Optimization Results",
    excerpt: "How we cut bundle size by 35% and improved FCP by 40%",
    platform: "Facebook" as const,
    level: "advanced" as const,
    content: `⚡ Performance optimization results are in!

Before:
• 450KB bundle size
• 1.8s First Contentful Paint
• Lighthouse score: 78

After:
• 292KB bundle (-35%)  
• 1.1s FCP (-40%)
• Lighthouse score: 94

How we did it:
1. Server components by default
2. Code splitting with dynamic imports
3. Image optimization with Next.js Image
4. Removed unnecessary dependencies
5. Lazy loading below-the-fold content

Speed matters. Our bounce rate dropped by 18%.

#PerformanceOptimization #WebDev #NextJS #WebVitals`,
    hashtags: ["#PerformanceOptimization", "#WebDev", "#NextJS", "#WebVitals"],
  },
  {
    id: "testing-strategy-linkedin",
    title: "Testing Strategy That Actually Works",
    excerpt: "Integration tests > Unit tests for most web apps",
    platform: "LinkedIn" as const,
    level: "advanced" as const,
    content: `Controversial opinion: Skip most unit tests. Focus on integration tests instead.

Our testing pyramid (inverted):
• 70% Integration tests (Playwright)
• 20% Unit tests (Vitest) - only complex logic
• 10% E2E tests - critical user flows

Why this works:

Integration tests catch real bugs:
✅ Test actual user interactions
✅ Catch CSS/layout issues
✅ Verify accessibility
✅ Test server actions + client together

Unit tests are maintenance burden:
❌ Brittle (break on refactors)
❌ Don't catch integration bugs
❌ Give false confidence

Our bug escape rate dropped 40% after switching focus to integration tests.

Test the behavior users see, not implementation details.

#Testing #QA #Playwright #WebDevelopment #TestingStrategy`,
    hashtags: ["#Testing", "#QA", "#Playwright", "#WebDevelopment", "#TestingStrategy"],
  },
  {
    id: "deployment-journey-twitter",
    title: "From Localhost to Production",
    excerpt: "Our deployment checklist and lessons learned",
    platform: "Twitter/X" as const,
    level: "intermediate" as const,
    content: `First production deployment checklist:

✅ Environment variables secured
✅ Error logging (Sentry)  
✅ Performance monitoring
✅ Database backups automated
✅ SSL certificates
✅ CDN configured
✅ Rate limiting enabled
✅ CORS configured properly

The difference between "it works on my machine" and "it works in production" is preparation.`,
    hashtags: ["#Deployment", "#DevOps", "#Production", "#WebDev"],
  },
  {
    id: "career-growth-linkedin",
    title: "From Junior to Senior: Key Mindset Shifts",
    excerpt: "What I learned building a production app from scratch",
    platform: "LinkedIn" as const,
    level: "advanced" as const,
    content: `Building a production app from scratch taught me more than 100 tutorials.

Junior mindset:
"Make it work"

Senior mindset:
"Make it maintainable, secure, performant, and accessible"

Key shifts:

1️⃣ Security First
Not an afterthought. Input sanitization, validation, and authentication from day one.

2️⃣ Think in Systems
Not just components. How do pieces fit together? What breaks if this fails?

3️⃣ Performance Budget
Every dependency has a cost. Question every addition to bundle.

4️⃣ Accessibility Default
Not a feature. It's core product quality that helps everyone.

5️⃣ Documentation Matters
Future you (and your team) will thank present you.

6️⃣ Error Handling
Happy path is easy. Edge cases define quality.

The gap between junior and senior isn't syntax—it's judgment.

Build real projects. Ship to real users. Learn from real problems.

#CareerGrowth #SoftwareEngineering #WebDevelopment #LessonsLearned`,
    hashtags: ["#CareerGrowth", "#SoftwareEngineering", "#WebDevelopment", "#LessonsLearned"],
  },
  {
    id: "week-recap-facebook",
    title: "Week in Review: Building Content Library",
    excerpt: "Comprehensive documentation from ideation to production",
    platform: "Facebook" as const,
    level: "beginner" as const,
    content: `📚 This week's achievement: Complete content library for our electrical service platform!

What we built:
• 20 comprehensive articles (beginner → advanced)
• 12 social media posts ready to share
• 8 interactive tutorials with challenges
• 4 case studies showing real transformations

Topics covered:
✅ Atomic design implementation
✅ Email integration with Resend
✅ Server vs client components
✅ Security hardening
✅ Performance optimization
✅ Accessibility best practices
✅ Testing strategies
✅ Deployment checklist

All content is in Markdown—ready to post on LinkedIn, Medium, Dev.to, or your blog!

This is what "building in public" looks like. Documenting the journey creates value for everyone.

#BuildInPublic #WebDevelopment #ContentCreation #Learning`,
    hashtags: ["#BuildInPublic", "#WebDevelopment", "#ContentCreation", "#Learning"],
  },
  {
    id: "debugging-thread-twitter",
    title: "Debugging React Hydration Errors: A Thread",
    excerpt: "Step-by-step guide to solving the most frustrating React error",
    platform: "Twitter/X" as const,
    level: "advanced" as const,
    content: `🧵 Debugging React Hydration Errors: A Thread

"Hydration failed because the initial UI does not match what was rendered on the server"

The most frustrating error in React. Here's how to solve it:

1/ What is hydration?
Server renders HTML → Browser receives it → React "hydrates" it (attaches event handlers)

If the HTML doesn't match what React expects, you get a hydration error.

2/ Common Causes:
• Rendering different content on server vs client
• Using browser-only APIs during SSR
• Date/time rendering (different timezones)
• Third-party scripts modifying DOM
• Nesting HTML incorrectly (like <Html> inside <html>)

3/ How to Debug:
✅ Check browser console for mismatch details
✅ Look for conditional rendering based on \`typeof window\`
✅ Search for useEffect that modifies state immediately
✅ Check for Date.now() or Math.random() in render

4/ The Fix:
Use useEffect for browser-only code:

\`\`\`tsx
function Component() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) return null // or skeleton
  
  return <ClientOnlyComponent />
}
\`\`\`

5/ Prevention:
• Use suppressHydrationWarning sparingly
• Test in production build (not just dev)
• Use server components by default
• Keep client components small

6/ Real Example:
Our email preview page failed because React Email's <Html> component rendered inside our app's <html> tag.

Solution: Render email to HTML string, display in iframe.

Remember: Server and client must produce identical HTML. Any difference = hydration error.

Have you fought hydration errors? Reply with your war stories! 👇`,
    hashtags: ["#React", "#NextJS", "#Debugging", "#WebDev"],
  },
  {
    id: "week1-recap-linkedin",
    title: "Week 1: Foundation & Planning",
    excerpt: "Initial vision, tech stack decisions, and atomic design setup",
    platform: "LinkedIn" as const,
    level: "beginner" as const,
    content: `📆 Week 1 Recap: Building an Electrical Service Platform

This week we laid the foundation for a production-ready service booking app.

🎯 What We Built:
• Project planning and architecture decisions
• Atomic design component structure
• Tech stack selection (Next.js 16, TypeScript, Tailwind v4)
• Initial component library (atoms & molecules)

💡 Key Decisions:
• Server Actions over REST APIs (simpler, type-safe)
• Design tokens from day one (easy dark mode later)
• Separation of concerns (actions, validation, templates)
• Multi-step form with React Hook Form

📚 Lessons Learned:
• An hour of planning saves days of refactoring
• Start with atoms, build up gradually
• TypeScript strict mode catches bugs early
• Document decisions as you make them

Next week: Building the form UI and validation layer!

#WebDevelopment #NextJS #AtomicDesign #LearningInPublic`,
    hashtags: ["#WebDevelopment", "#NextJS", "#AtomicDesign", "#LearningInPublic"],
  },
  {
    id: "week2-recap-linkedin",
    title: "Week 2: Form UI & State Management",
    excerpt: "Multi-step form components and Zustand state management",
    platform: "LinkedIn" as const,
    level: "intermediate" as const,
    content: `📆 Week 2 Recap: Form UI & State Management

Built out the core user experience this week.

🎯 What We Shipped:
• 3-step form (personal info, service details, review)
• Zustand store for form state persistence
• React Hook Form integration with Zod validation
• Custom form components (inputs, radio groups, checkboxes)
• Animated step indicator with light bulb icons

💡 Technical Highlights:
• Validation on blur (not on change) for better UX
• Error messages with proper ARIA labels
• LocalStorage persistence (form survives page refresh)
• Responsive design (mobile-first approach)

📚 Lessons Learned:
• State management should match your complexity
• Separate display logic from business logic
• Test forms with keyboard-only navigation
• Loading states matter for perceived performance

Next week: Server actions and email integration!

#React #StateManagement #UXDesign #Forms`,
    hashtags: ["#React", "#StateManagement", "#UXDesign", "#Forms"],
  },
  {
    id: "carousel-error-handling",
    title: "Error Handling Best Practices (Carousel Post)",
    excerpt: "Visual guide to error boundaries, loading states, and retry logic",
    platform: "LinkedIn" as const,
    level: "intermediate" as const,
    content: `📊 Error Handling Best Practices

Slide 1: The Problem
🔴 Without proper error handling:
• White screen of death
• No user feedback
• Lost user data
• Poor experience

Slide 2: Error Boundaries
🛡️ Catch rendering errors:
• Wrap components in boundaries
• Show fallback UI
• Log errors to monitoring
• Provide "Try again" button

Slide 3: Loading States
⏳ Show progress:
• Skeleton loaders
• Progress indicators
• Disabled buttons during submit
• Clear "Loading..." text

Slide 4: Toast Notifications
📢 User feedback:
• Success: Green toast
• Error: Red toast with retry
• Info: Blue toast
• Duration: 3-5 seconds

Slide 5: Retry Logic
🔄 Network failures:
• Retry failed requests
• Exponential backoff
• Max retry limit
• User-triggered retry button

Slide 6: Optimistic Updates
⚡ Instant feedback:
• Update UI immediately
• Send request to server
• Rollback on failure
• Show error toast

Slide 7: Graceful Degradation
✅ App keeps working:
• One component fails ≠ entire app fails
• Cached data shown during errors
• Offline functionality where possible
• Clear error messages

Slide 8: The Result
🎉 Better UX:
• +12% form completion
• +23% error recovery
• -40% support tickets
• Happy users even when things go wrong

#ErrorHandling #WebDevelopment #UX #BestPractices`,
    hashtags: ["#ErrorHandling", "#WebDevelopment", "#UX", "#BestPractices"],
  },
  {
    id: "video-script-testing",
    title: "Testing Strategy (60-Second Video Script)",
    excerpt: "Quick guide to integration testing with Playwright",
    platform: "Twitter/X" as const,
    level: "advanced" as const,
    content: `🎬 60-Second Testing Strategy (Video Script)

[0-10s] Opening
"Want to write tests that actually catch bugs? Here's our testing pyramid."

[Visual: Inverted pyramid]
70% Integration Tests
20% Unit Tests
10% E2E Tests

[10-25s] Integration Tests
"We focus on integration tests with Playwright."

[Show code]
\`\`\`tsx
test('user can submit service request', async ({ page }) => {
  await page.goto('/form')
  await page.fill('[name="email"]', 'test@example.com')
  await page.click('button:text("Next")')
  await page.click('button:text("Submit")')
  await expect(page.locator('.success-message')).toBeVisible()
})
\`\`\`

[25-40s] Why Integration > Unit
"Integration tests catch REAL bugs:"
✅ User interactions
✅ API integration
✅ CSS/layout issues
✅ Accessibility problems

"Unit tests break on refactors and give false confidence."

[40-55s] The Results
"Since switching focus:
• Bug escape rate: -40%
• Test maintenance: -50%
• Coverage: +30%
• Confidence: 📈"

[55-60s] Closing
"Test the behavior users see, not implementation details."

[Call to action]
"Follow for more testing tips!"

#Testing #Playwright #WebDev #QA`,
    hashtags: ["#Testing", "#Playwright", "#WebDev", "#QA"],
  },
  {
    id: "performance-tips-thread",
    title: "Performance Optimization Tips: A Thread",
    excerpt: "10 ways we improved our app's performance",
    platform: "Twitter/X" as const,
    level: "advanced" as const,
    content: `🧵 10 Performance Optimizations That Matter

We cut our bundle by 35% and improved FCP by 40%. Here's how:

1/ Server Components by Default
• 90% of our components don't need client JS
• Only use "use client" when necessary
• Reduced initial bundle from 450KB → 292KB

2/ Dynamic Imports
\`\`\`tsx
const HeavyComponent = dynamic(() => import('./heavy'))
\`\`\`
• Load on demand, not upfront
• Especially for modals, charts, editors

3/ Image Optimization
• Use Next.js Image component
• Automatic WebP/AVIF conversion
• Lazy loading below fold
• Proper sizing (no massive images scaled down)

4/ Code Splitting by Route
• Next.js does this automatically
• But watch for shared dependencies
• Use webpack-bundle-analyzer to check

5/ Remove Unused Dependencies
• That chart library you tried once? Remove it.
• Check with \`npx depcheck\`
• Every KB counts

6/ Minimize Client State
• Don't sync server data to Zustand unnecessarily
• Use SWR or React Query for server state
• Zustand only for UI state

7/ Memoization (When Needed)
\`\`\`tsx
const expensiveValue = useMemo(() => 
  heavyCalculation(data), 
  [data]
)
\`\`\`
• Don't memoize everything
• Profile first, optimize what matters

8/ Debounce Expensive Operations
\`\`\`tsx
const debouncedSearch = useDebouncedCallback(
  (query) => search(query),
  300
)
\`\`\`

9/ Virtualize Long Lists
• Don't render 1000 DOM nodes
• Use react-window or similar
• Massive perf improvement

10/ Monitor Real User Metrics
• Use Vercel Analytics or similar
• Watch Core Web Vitals
• Fix what actually impacts users

Result: Lighthouse score 78 → 94

Remember: Measure before optimizing. Profile to find bottlenecks. User-perceived performance > synthetic benchmarks.

What's your #1 performance tip? 👇`,
    hashtags: ["#Performance", "#WebDev", "#Optimization", "#NextJS"],
  },
  {
    id: "senior-dev-mindset-facebook",
    title: "Junior vs Senior Developer Mindset",
    excerpt: "The mental shifts that define experience",
    platform: "Facebook" as const,
    level: "advanced" as const,
    content: `🧠 Junior vs Senior Developer: It's Not About Code

The gap between junior and senior devs isn't syntax—it's mindset.

Junior thinks: "Make it work"
Senior thinks: "Make it maintainable"

Here are the key mental shifts:

1️⃣ Problem Solving
Junior: "How do I implement this?"
Senior: "Should we implement this? What are the alternatives?"

2️⃣ Code Quality
Junior: "Does it work?"
Senior: "Can someone else maintain it in 6 months?"

3️⃣ Testing
Junior: "It works on my machine"
Senior: "It works in production under load with bad data"

4️⃣ Security
Junior: Afterthought
Senior: Built-in from day one

5️⃣ Performance
Junior: "Premature optimization is evil"
Senior: "Performance budget from the start"

6️⃣ Error Handling
Junior: Happy path only
Senior: "What happens when this fails?"

7️⃣ Documentation
Junior: "The code is self-documenting"
Senior: "Future me needs context"

8️⃣ Technical Debt
Junior: "I'll fix it later"
Senior: "Later never comes. Fix it now or don't add it."

9️⃣ Communication
Junior: Asks for solutions
Senior: Explains tradeoffs to stakeholders

🔟 Learning
Junior: Learns syntax
Senior: Learns system design, tradeoffs, and business context

The transition happens through:
• Building real products
• Fixing your own bugs
• Maintaining your own code
• Working with real users
• Seeing your decisions play out

You can't shortcut experience, but you can accelerate it by:
• Building in public
• Shipping to real users
• Learning from mistakes
• Reading others' code
• Asking "why" not just "how"

What mindset shift made the biggest difference for you?

#SoftwareDevelopment #CareerGrowth #Coding #TechCareer`,
    hashtags: ["#SoftwareDevelopment", "#CareerGrowth", "#Coding", "#TechCareer"],
  },
  {
    id: "css-variables-tips",
    title: "CSS Variables That Changed Our Workflow",
    excerpt: "How design tokens transformed our theming",
    platform: "Twitter/X" as const,
    level: "beginner" as const,
    content: `CSS Custom Properties (variables) changed our entire workflow. 

Here's what we learned:

Before:
• 47 instances of #f59e0b (brand color)
• 2 hours to change brand color
• Dark mode? "Someday"
• Inconsistent design

After:
• --color-accent defined once
• 1 minute to change brand color
• Dark mode in 15 minutes
• Perfect consistency

The Pattern:
\`\`\`css
@theme inline {
  --color-background: #0a0a0a;
  --color-foreground: #fafafa;
  --color-accent: #f59e0b;
}

/* Dark mode = swap values */
@media (prefers-color-scheme: dark) {
  @theme inline {
    --color-background: #0a0a0a;
    --color-foreground: #fafafa;
  }
}
\`\`\`

Use semantic names:
• --background (not --white)
• --foreground (not --text-color)
• --accent (not --orange)

Why? Change values without changing code.

Tailwind CSS v4 supports this natively. Game changer.

Design tokens aren't premature optimization. They're the foundation.

#CSS #DesignSystems #WebDev`,
    hashtags: ["#CSS", "#DesignSystems", "#WebDev"],
  },
  {
    id: "week3-recap-linkedin",
    title: "Week 3: Security & Validation",
    excerpt: "Server-side validation, input sanitization, and security hardening",
    platform: "LinkedIn" as const,
    level: "intermediate" as const,
    content: `📆 Week 3 Recap: Security & Validation

Security isn't optional. This week we hardened our app.

🎯 What We Implemented:
• Multi-layer validation (client + server)
• Input sanitization (XSS prevention)
• Server actions with error handling
• Email injection prevention
• Rate limiting basics
• Environment variable security

🔒 Security Checklist:
✅ Client validation (UX)
✅ Server validation (Security)
✅ Input sanitization
✅ SQL injection prevention
✅ HTTPS only
✅ Secrets in environment variables
✅ CORS configured

📚 Lessons Learned:
• Defense in depth: multiple layers
• Never trust user input
• Validate everything server-side
• Log security events for monitoring

Next week: Email integration with Resend!

#Security #WebDevelopment #InputValidation #BestPractices`,
    hashtags: ["#Security", "#WebDevelopment", "#InputValidation", "#BestPractices"],
  },
]
