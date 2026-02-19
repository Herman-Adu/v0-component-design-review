import React from "react"

// Rendering Strategies
export { SSGArticleContent } from "./ssg-article"
export { SSRArticleContent } from "./ssr-article"
export { ISRArticleContent } from "./isr-article"
export { PPRArticleContent } from "./ppr-article"

// Architecture
export { AtomicDesignArticle } from "./atomic-design-article"
export { PlanningArticle } from "./planning-article"

// Forms & Validation
export { MultiStepFormArticle } from "./multi-step-form-article"
export { ZodValidationArticle } from "./zod-validation-article"
export { ZustandArticle } from "./zustand-article"

// Security & Backend
export { SecurityArticle } from "./security-article"
export { ServerActionsArticle } from "./server-actions-article"
export { EmailArticle } from "./email-article"

// Best Practices
export { RefactoringArticle } from "./refactoring-article"
export { DocumentationArticle } from "./documentation-article"

// Map slugs to their rich content components
export const richArticleComponents: Record<string, React.ComponentType> = {
  // Rendering Strategies
  "static-site-generation-ssg": require("./ssg-article").SSGArticleContent,
  "server-side-rendering-ssr": require("./ssr-article").SSRArticleContent,
  "incremental-static-regeneration-isr": require("./isr-article").ISRArticleContent,
  "partial-prerendering-ppr": require("./ppr-article").PPRArticleContent,
  // Architecture
  "atomic-design-principles": require("./atomic-design-article").AtomicDesignArticle,
  "planning-full-stack-application": require("./planning-article").PlanningArticle,
  // Forms & Validation
  "multi-step-form-architecture": require("./multi-step-form-article").MultiStepFormArticle,
  "typescript-zod-validation": require("./zod-validation-article").ZodValidationArticle,
  "zustand-form-state-management": require("./zustand-article").ZustandArticle,
  // Security & Backend
  "security-architecture-deep-dive": require("./security-article").SecurityArticle,
  "server-actions-deep-dive": require("./server-actions-article").ServerActionsArticle,
  "email-system-architecture": require("./email-article").EmailArticle,
  // Best Practices
  "refactoring-for-maintainability": require("./refactoring-article").RefactoringArticle,
  "documentation-as-architecture": require("./documentation-article").DocumentationArticle,
}
