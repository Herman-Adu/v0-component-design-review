/**
 * Documentation System Helpers
 *
 * **Architecture Decision:**
 * Category-specific logic (colors, labels) that varies between documentation and content-library
 * should remain in their respective domains. This follows Domain-Driven Design principles.
 *
 * **Single Responsibility:**
 * - View model retrieval with category dispatch (documentation-specific)
 * - Category styling (documentation categories only)
 * - Audience styling (shared pattern, but kept here for documentation context)
 *
 * **Future Refactor Note:**
 * Content-library will have its own category helpers following the same pattern.
 * Truly shared utilities (date formatting, etc.) should go in shared/utils.
 */

import type { DocumentationCategory } from "@/lib/content-library/url-policy";
import { getStrategicOverviewRecordBySlug } from "./strategic-overview/strategic-overview-repository";
import {
  toStrategicOverviewDetailViewModel,
  type StrategicOverviewDetailViewModel,
} from "./strategic-overview/strategic-overview-view-models";
import { getCmsReferenceRecordBySlug } from "./cms-reference/cms-reference-repository";
import {
  toCmsReferenceDetailViewModel,
  type CmsReferenceDetailViewModel,
} from "./cms-reference/cms-reference-view-models";
import { getAppReferenceRecordBySlug } from "./app-reference/app-reference-repository";
import {
  toAppReferenceDetailViewModel,
  type AppReferenceDetailViewModel,
} from "./app-reference/app-reference-view-models";
import { getInfrastructureOpsRecordBySlug } from "./infrastructure-ops/infrastructure-ops-repository";
import {
  toInfrastructureOpsDetailViewModel,
  type InfrastructureOpsDetailViewModel,
} from "./infrastructure-ops/infrastructure-ops-view-models";

/**
 * Union type of all documentation detail view models
 * Preserves type safety while allowing polymorphic handling
 */
export type DocumentationDetailViewModel =
  | StrategicOverviewDetailViewModel
  | CmsReferenceDetailViewModel
  | AppReferenceDetailViewModel
  | InfrastructureOpsDetailViewModel;

/**
 * Get documentation view model by category and slug
 *
 * **Single Responsibility:** Category dispatch and view model transformation
 * **Type Safety:** Returns union type preserving specific block types per category
 * **Open/Closed:** Add new categories by extending switch statement
 *
 * @param category - Documentation category
 * @param slug - Document slug
 * @returns Category-specific detail view model or null if not found
 *
 * @example
 * ```typescript
 * const viewModel = getDocumentationViewModel("app-reference", "component-system");
 * if (!viewModel) notFound();
 * // viewModel is properly typed as AppReferenceDetailViewModel
 * ```
 */
export function getDocumentationViewModel(
  category: string,
  slug: string,
): DocumentationDetailViewModel | null {
  switch (category) {
    case "strategic-overview": {
      const record = getStrategicOverviewRecordBySlug(slug);
      if (!record) return null;
      return toStrategicOverviewDetailViewModel(record.document);
    }
    case "cms-reference": {
      const record = getCmsReferenceRecordBySlug(slug);
      if (!record) return null;
      return toCmsReferenceDetailViewModel(record.document);
    }
    case "app-reference": {
      const record = getAppReferenceRecordBySlug(slug);
      if (!record) return null;
      return toAppReferenceDetailViewModel(record.document);
    }
    case "infrastructure-ops": {
      const record = getInfrastructureOpsRecordBySlug(slug);
      if (!record) return null;
      return toInfrastructureOpsDetailViewModel(record.document);
    }
    default:
      return null;
  }
}

/**
 * Get Tailwind CSS classes for documentation category badges
 *
 * **Single Responsibility:** Category-to-color mapping
 * **Consistency:** Ensures uniform category styling across all pages
 *
 * @param category - Documentation category string
 * @returns Tailwind CSS class string for badge styling
 *
 * @example
 * ```tsx
 * <span className={`px-3 py-1 rounded-full ${getCategoryColor(category)}`}>
 *   {getCategoryLabel(category)}
 * </span>
 * ```
 */
export function getCategoryColor(category: string): string {
  switch (category) {
    case "strategic-overview":
      return "bg-accent/10 text-accent border-accent/20";
    case "cms-reference":
      return "bg-orange-500/10 text-orange-500 border-orange-500/20";
    case "app-reference":
      return "bg-indigo-500/10 text-indigo-500 border-indigo-500/20";
    case "infrastructure-ops":
      return "bg-teal-500/10 text-teal-500 border-teal-500/20";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}

/**
 * Get Tailwind CSS classes for audience role badges
 *
 * **Single Responsibility:** Audience-to-color mapping
 * **Consistency:** Ensures uniform audience styling across all pages
 *
 * @param audience - Audience role string (e.g., "CTO / Project Lead", "Frontend Developer")
 * @returns Tailwind CSS class string for badge styling
 *
 * @example
 * ```tsx
 * <span className={`px-3 py-1 rounded-full ${getAudienceColor(viewModel.audience)}`}>
 *   <Users className="inline h-3 w-3 mr-1" />
 *   {viewModel.audience}
 * </span>
 * ```
 */
export function getAudienceColor(audience: string): string {
  if (audience.includes("CTO") || audience.includes("Project Lead")) {
    return "bg-purple-500/10 text-purple-500 border-purple-500/20";
  }
  if (
    audience.includes("Developer") ||
    audience.includes("Architect") ||
    audience.includes("Engineer")
  ) {
    return "bg-blue-500/10 text-blue-500 border-blue-500/20";
  }
  if (audience.includes("DevOps") || audience.includes("Infrastructure")) {
    return "bg-green-500/10 text-green-500 border-green-500/20";
  }
  if (audience.includes("Designer")) {
    return "bg-pink-500/10 text-pink-500 border-pink-500/20";
  }
  if (audience.includes("QA")) {
    return "bg-orange-500/10 text-orange-500 border-orange-500/20";
  }
  return "bg-muted text-muted-foreground border-border";
}

/**
 * Get human-readable label for documentation category
 *
 * **Single Responsibility:** Category slug to display label transformation
 * **Consistency:** Ensures uniform category labels across all pages
 *
 * @param category - Documentation category slug (kebab-case)
 * @returns Human-readable category label (Title Case)
 *
 * @example
 * ```tsx
 * <h2>{getCategoryLabel("infrastructure-ops")}</h2>
 * // Renders: "Infrastructure & Ops"
 * ```
 */
export function getCategoryLabel(category: string): string {
  switch (category) {
    case "strategic-overview":
      return "Strategic Overview";
    case "cms-reference":
      return "CMS Reference";
    case "app-reference":
      return "App Reference";
    case "infrastructure-ops":
      return "Infrastructure & Ops";
    default:
      return category;
  }
}

/**
 * Validate if category is a valid documentation category
 *
 * **Type Guard:** Ensures type safety for DocumentationCategory
 *
 * @param category - Category string to validate
 * @returns True if valid documentation category
 */
export function isValidDocumentationCategory(
  category: string,
): category is DocumentationCategory {
  return (
    category === "strategic-overview" ||
    category === "cms-reference" ||
    category === "app-reference" ||
    category === "infrastructure-ops"
  );
}
