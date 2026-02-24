# Phase 1: Component Audit Report

Generated: 2026-02-24T11:08:11.896Z

## Summary

| Metric | Count |
|--------|-------|
| Total pages | 100 |
| Total components | 101 |
| Feature files | 108 |
| Pages with hardcoded data | 78 |
| Total hardcoded arrays | 229 |
| Total data items | 0 |
| Average page line count | 356 |
| Client components | 63 |
| Server components | 38 |

## Component Breakdown by Atomic Level

| Level | Count |
|-------|-------|
| other | 99 |
| layout | 1 |
| page | 1 |

## Pages by Section

| Section | Count |
|---------|-------|
| dashboard/documentation | 29 |
| admin/digital-marketing | 28 |
| admin/email-administration | 16 |
| admin/document-administration | 10 |
| dashboard/content-library | 10 |
| other/other | 2 |
| auth/auth | 1 |
| marketing/landing | 1 |
| public/contact | 1 |
| public/quotation | 1 |
| public/services | 1 |

## Platform Pages

| Platform | Pages |
|----------|-------|


## Repeating UI Patterns (Extraction Candidates)

These patterns appear multiple times across pages and are strong candidates for shared components:

| Pattern | Occurrences | Target Component |
|---------|-------------|------------------|
| platform-header | 57 | molecules/PlatformHeader |
| responsive-grid-3 | 52 | utility class (keep) |
| responsive-grid-2 | 42 | utility class (keep) |
| back-navigation | 29 | molecules/BackNavigationCard |
| checklist | 20 | organisms/ChecklistCard |
| tip-callout | 16 | atoms/TipCallout |
| strategy-flow | 15 | organisms/StrategyFlow |
| why-platform-card | 13 | molecules/WhyPlatformCard |
| metrics-grid | 9 | organisms/MetricsGrid |
| reporting-cadence | 8 | molecules/ReportingCadenceCard |
| tool-grid | 7 | organisms/ToolGrid |
| platform-specs | 5 | organisms/PlatformSpecsCard |
| content-comparison-table | 4 | molecules/ContentComparisonTable |

## Largest Pages (Refactoring Priority)

These pages have the most code and should be refactored first:

| Page | Lines | Hardcoded Arrays |
|------|-------|------------------|
| app\(dashboard)\dashboard\admin\document-administration\documentation-health\gap-analysis\page.tsx | 1273 | 10 |
| app\(dashboard)\dashboard\documentation\app-reference\security-architecture\page.tsx | 988 | 2 |
| app\(dashboard)\dashboard\admin\email-administration\configuration\template-and-brand\page.tsx | 965 | 1 |
| app\(dashboard)\dashboard\documentation\app-reference\component-system\page.tsx | 843 | 10 |
| app\(dashboard)\dashboard\documentation\strategic-overview\code-review-log\client-page.tsx | 820 | 1 |
| app\(dashboard)\dashboard\documentation\infrastructure-and-ops\api-and-graphql\page.tsx | 773 | 2 |
| app\(dashboard)\dashboard\admin\document-administration\documentation-health\page.tsx | 748 | 4 |
| app\(dashboard)\dashboard\documentation\cms-reference\relationships\page.tsx | 697 | 6 |
| app\(dashboard)\dashboard\admin\email-administration\request-management\testing-and-ops-guide\page.tsx | 673 | 4 |
| app\(dashboard)\dashboard\documentation\app-reference\server-actions-and-api\page.tsx | 656 | 1 |

## Existing Components Inventory

### Atoms (0)



### Molecules (0)



### Organisms (0)



### UI Primitives (0)



## Pages with Hardcoded Data

These pages contain inline data arrays that should be extracted to mock data files:

### app\(dashboard)\dashboard\admin\document-administration\documentation-health\gap-analysis\page.tsx
- Arrays: `gaps` (0 items), `allContent` (0 items), `allArticleCategories` (0 items), `tutorialRelevantCats` (0 items), `csRelevantCats` (0 items), `routeTopics` (0 items), `componentAreas` (0 items), `allArticleCats` (0 items), `allTutCats` (0 items), `allContent` (0 items)
- UI Patterns: platform-header, metrics-grid, tip-callout, responsive-grid-2, responsive-grid-3
- Platform: n/a
- Lines: 1273

### app\(dashboard)\dashboard\documentation\app-reference\security-architecture\page.tsx
- Arrays: `SECTIONS` (0 items), `securityHeaders` (0 items)
- UI Patterns: why-platform-card, checklist, responsive-grid-2, responsive-grid-3
- Platform: n/a
- Lines: 988

### app\(dashboard)\dashboard\admin\email-administration\configuration\template-and-brand\page.tsx
- Arrays: `templatesList` (0 items)
- UI Patterns: platform-header, responsive-grid-2, responsive-grid-3
- Platform: n/a
- Lines: 965

### app\(dashboard)\dashboard\documentation\app-reference\component-system\page.tsx
- Arrays: `atoms` (0 items), `molecules` (0 items), `organisms` (0 items), `contactSteps` (0 items), `sharedSteps` (0 items), `animations` (0 items), `articleSubComponents` (0 items), `hooks` (0 items), `SECTIONS` (0 items), `tocItems` (0 items)
- UI Patterns: platform-header, why-platform-card, responsive-grid-3
- Platform: n/a
- Lines: 843

### app\(dashboard)\dashboard\documentation\strategic-overview\code-review-log\client-page.tsx
- Arrays: `errors` (0 items)
- UI Patterns: checklist, responsive-grid-2
- Platform: n/a
- Lines: 820

### app\(dashboard)\dashboard\documentation\infrastructure-and-ops\api-and-graphql\page.tsx
- Arrays: `endpoints` (0 items), `sections` (0 items)
- UI Patterns: responsive-grid-2
- Platform: n/a
- Lines: 773

### app\(dashboard)\dashboard\admin\document-administration\documentation-health\page.tsx
- Arrays: `healthChecks` (0 items), `documentationSections` (0 items), `codebaseCoverage` (0 items), `changelog` (0 items)
- UI Patterns: platform-header, why-platform-card, strategy-flow, responsive-grid-2, responsive-grid-3
- Platform: n/a
- Lines: 748

### app\(dashboard)\dashboard\documentation\cms-reference\relationships\page.tsx
- Arrays: `SECTIONS` (0 items), `entityRelationships` (0 items), `dataFlowStages` (0 items), `frontendToBackend` (0 items), `atomicMapping` (0 items), `componentReuse` (0 items)
- UI Patterns: responsive-grid-2, responsive-grid-3
- Platform: n/a
- Lines: 697

### app\(dashboard)\dashboard\admin\email-administration\request-management\testing-and-ops-guide\page.tsx
- Arrays: `SEED_JOBS` (0 items), `TEST_SECTIONS` (0 items), `STATUS_PIPELINE` (0 items), `PRIORITY_SLA` (0 items)
- UI Patterns: back-navigation, checklist, responsive-grid-3
- Platform: n/a
- Lines: 673

### app\(dashboard)\dashboard\documentation\app-reference\server-actions-and-api\page.tsx
- Arrays: `SECTIONS` (0 items)
- UI Patterns: responsive-grid-3
- Platform: n/a
- Lines: 656

### app\(dashboard)\dashboard\admin\document-administration\quality-engineering\pattern-compliance\page.tsx
- Arrays: `results` (0 items), `requiredArticleFields` (0 items), `requiredCsFields` (0 items), `requiredTutFields` (0 items), `results` (0 items), `results` (0 items), `validArticleCategories` (0 items), `validLevels` (0 items), `validCsCategories` (0 items), `validTutCategories` (0 items), `results` (0 items), `allIds` (0 items), `allSlugs` (0 items)
- UI Patterns: platform-header, responsive-grid-2, responsive-grid-3
- Platform: n/a
- Lines: 613

### app\(dashboard)\dashboard\documentation\app-reference\email-system\page.tsx
- Arrays: `SECTIONS` (0 items)
- UI Patterns: responsive-grid-3
- Platform: n/a
- Lines: 597

### app\(dashboard)\dashboard\documentation\infrastructure-and-ops\cms-operations\page.tsx
- Arrays: `SECTIONS` (0 items)
- UI Patterns: strategy-flow, responsive-grid-2, responsive-grid-3
- Platform: n/a
- Lines: 589

### app\(dashboard)\dashboard\documentation\cms-reference\content-collections\page.tsx
- Arrays: `SECTIONS` (0 items), `contentOverview` (0 items), `articleFields` (0 items), `tutorialFields` (0 items), `caseStudyFields` (0 items), `dependencyOrder` (0 items), `relatedDocs` (0 items)
- UI Patterns: metrics-grid, responsive-grid-3
- Platform: n/a
- Lines: 583

### app\(dashboard)\dashboard\admin\document-administration\quality-engineering\fix-actions\page.tsx
- Arrays: `fixes` (0 items)
- UI Patterns: platform-header, tool-grid, responsive-grid-2
- Platform: n/a
- Lines: 578

### app\(dashboard)\dashboard\documentation\cms-reference\form-collections\page.tsx
- Arrays: `SECTIONS` (0 items), `collectionCards` (0 items)
- UI Patterns: responsive-grid-3
- Platform: n/a
- Lines: 570

### app\(dashboard)\dashboard\documentation\app-reference\hydration-and-guards\page.tsx
- Arrays: `SECTIONS` (0 items), `failedApproaches` (0 items), `beforeItems` (0 items), `afterItems` (0 items), `guardDecisionTable` (0 items)
- UI Patterns: why-platform-card, responsive-grid-3
- Platform: n/a
- Lines: 549

### app\(dashboard)\dashboard\admin\document-administration\quality-engineering\count-validation\page.tsx
- Arrays: `results` (0 items), `articleCategories` (0 items), `csCategories` (0 items), `categories` (0 items)
- UI Patterns: platform-header, responsive-grid-2
- Platform: n/a
- Lines: 521

### app\(dashboard)\dashboard\documentation\strategic-overview\app-overview\page.tsx
- Arrays: `stats` (0 items), `audienceCards` (0 items), `sectionCards` (0 items), `architectureLayers` (0 items), `progressItems` (0 items)
- UI Patterns: platform-header, strategy-flow, checklist, responsive-grid-2, responsive-grid-3
- Platform: n/a
- Lines: 515

### app\(dashboard)\dashboard\documentation\strategic-overview\why-strapi\page.tsx
- Arrays: `benefits` (0 items), `comparisonData` (0 items), `securityFeatures` (0 items)
- UI Patterns: platform-header, why-platform-card, responsive-grid-2, responsive-grid-3
- Platform: n/a
- Lines: 454

### app\(dashboard)\dashboard\admin\document-administration\quality-engineering\route-verification\page.tsx
- Arrays: `knownStaticRoutes` (0 items), `sidebarNavHrefs` (0 items), `results` (0 items), `categories` (0 items)
- UI Patterns: platform-header, why-platform-card, responsive-grid-2
- Platform: n/a
- Lines: 453

### app\(dashboard)\dashboard\documentation\app-reference\performance-and-caching\page.tsx
- Arrays: `SECTIONS` (0 items)
- UI Patterns: none detected
- Platform: n/a
- Lines: 448

### app\(dashboard)\dashboard\documentation\cms-reference\shared-components\page.tsx
- Arrays: `SECTIONS` (0 items), `formComponents` (0 items), `contentComponents` (0 items)
- UI Patterns: metrics-grid, responsive-grid-2
- Platform: n/a
- Lines: 440

### app\(dashboard)\dashboard\admin\document-administration\quality-engineering\toc-integrity\page.tsx
- Arrays: `tocComponentRegistry` (0 items), `results` (0 items), `tocRules` (0 items), `categories` (0 items), `tableOfContents` (0 items)
- UI Patterns: platform-header, strategy-flow, responsive-grid-2, responsive-grid-3
- Platform: n/a
- Lines: 418

### app\(dashboard)\dashboard\admin\digital-marketing\linkedin\composer\page.tsx
- Arrays: `formatTypes` (0 items), `hashtagSuggestions` (0 items), `templates` (0 items)
- UI Patterns: platform-header, back-navigation, tip-callout, responsive-grid-3
- Platform: n/a
- Lines: 400

### app\(dashboard)\dashboard\documentation\infrastructure-and-ops\getting-started\page.tsx
- Arrays: `steps` (0 items), `SECTIONS` (0 items)
- UI Patterns: strategy-flow, responsive-grid-3
- Platform: n/a
- Lines: 393

### app\(dashboard)\dashboard\documentation\cms-reference\single-types\page.tsx
- Arrays: `SECTIONS` (0 items), `singleTypes` (0 items)
- UI Patterns: responsive-grid-2
- Platform: n/a
- Lines: 384

### app\(dashboard)\dashboard\admin\digital-marketing\google\composer\page.tsx
- Arrays: `postTypes` (0 items), `ctaOptions` (0 items), `imageGuidelines` (0 items), `templates` (0 items)
- UI Patterns: platform-header, platform-specs, back-navigation, tip-callout
- Platform: n/a
- Lines: 364

### app\(dashboard)\dashboard\documentation\cms-reference\getting-started\page.tsx
- Arrays: `steps` (0 items)
- UI Patterns: platform-header, responsive-grid-3
- Platform: n/a
- Lines: 356

### app\(dashboard)\dashboard\documentation\app-reference\server-vs-client\page.tsx
- Arrays: `SECTIONS` (0 items)
- UI Patterns: checklist, responsive-grid-2
- Platform: n/a
- Lines: 333

### app\(dashboard)\dashboard\admin\digital-marketing\getting-started\page.tsx
- Arrays: `journeys` (0 items), `platformOverview` (0 items), `quickChecklist` (0 items)
- UI Patterns: platform-header, back-navigation, checklist
- Platform: n/a
- Lines: 329

### app\(dashboard)\dashboard\admin\email-administration\configuration\page.tsx
- Arrays: `features` (0 items), `emailTypes` (0 items), `configHighlights` (0 items)
- UI Patterns: platform-header, responsive-grid-2, responsive-grid-3
- Platform: n/a
- Lines: 326

### app\(dashboard)\dashboard\admin\digital-marketing\twitter\composer\page.tsx
- Arrays: `tweetTypes` (0 items), `templates` (0 items)
- UI Patterns: platform-header, back-navigation, responsive-grid-3
- Platform: n/a
- Lines: 317

### app\(dashboard)\dashboard\admin\digital-marketing\linkedin\connection-strategy\page.tsx
- Arrays: `targetProfiles` (0 items), `connectionTemplates` (0 items), `engagementRules` (0 items), `weeklyPlan` (0 items)
- UI Patterns: platform-header, back-navigation, content-comparison-table, tip-callout, responsive-grid-3
- Platform: n/a
- Lines: 316

### app\(dashboard)\dashboard\admin\page.tsx
- Arrays: `docSystemTools` (0 items), `contentTools` (0 items), `upcomingFeatures` (0 items)
- UI Patterns: tool-grid
- Platform: n/a
- Lines: 309

### app\(dashboard)\dashboard\documentation\infrastructure-and-ops\testing-strategy\page.tsx
- Arrays: `SECTIONS` (0 items), `steps` (0 items)
- UI Patterns: none detected
- Platform: n/a
- Lines: 306

### app\(dashboard)\dashboard\admin\digital-marketing\google\analytics\page.tsx
- Arrays: `setupSteps` (0 items), `keyMetrics` (0 items), `conversionGoals` (0 items), `reportTemplates` (0 items), `attributionModels` (0 items)
- UI Patterns: platform-header, back-navigation, metrics-grid, tip-callout, responsive-grid-2
- Platform: n/a
- Lines: 292

### app\(dashboard)\dashboard\admin\digital-marketing\google\page.tsx
- Arrays: `tools` (0 items), `ecosystem` (0 items)
- UI Patterns: platform-header, strategy-flow, tool-grid, back-navigation, checklist, responsive-grid-2, responsive-grid-3
- Platform: n/a
- Lines: 288

### app\(dashboard)\dashboard\admin\digital-marketing\google\tag-manager\page.tsx
- Arrays: `setupSteps` (0 items), `standardEvents` (0 items), `conversionSetup` (0 items), `triggerRules` (0 items)
- UI Patterns: platform-header, back-navigation, responsive-grid-2
- Platform: n/a
- Lines: 282

### app\(dashboard)\dashboard\admin\digital-marketing\linkedin\analytics\page.tsx
- Arrays: `keyMetrics` (0 items), `reportingCadence` (0 items), `contentComparison` (0 items), `dashboardChecklist` (0 items)
- UI Patterns: platform-header, strategy-flow, back-navigation, metrics-grid, reporting-cadence, content-comparison-table, checklist, tip-callout, responsive-grid-3
- Platform: n/a
- Lines: 281

### app\(dashboard)\dashboard\admin\digital-marketing\linkedin\articles\page.tsx
- Arrays: `articleTypes` (0 items), `repurposeGuide` (0 items), `seoTips` (0 items)
- UI Patterns: platform-header, why-platform-card, platform-specs, back-navigation, tip-callout, responsive-grid-2
- Platform: n/a
- Lines: 281

### app\(dashboard)\dashboard\documentation\infrastructure-and-ops\troubleshooting\page.tsx
- Arrays: `sections` (0 items)
- UI Patterns: responsive-grid-2
- Platform: n/a
- Lines: 278

### app\(dashboard)\dashboard\content-library\articles\[category]\[slug]\page.tsx
- Arrays: `elements` (0 items)
- UI Patterns: none detected
- Platform: n/a
- Lines: 276

### app\(dashboard)\dashboard\documentation\infrastructure-and-ops\deployment\page.tsx
- Arrays: `SECTIONS` (0 items)
- UI Patterns: checklist, responsive-grid-2
- Platform: n/a
- Lines: 275

### app\(dashboard)\dashboard\admin\digital-marketing\twitter\threads\page.tsx
- Arrays: `threadTemplates` (0 items), `updated` (0 items)
- UI Patterns: platform-header, why-platform-card, back-navigation
- Platform: n/a
- Lines: 273

### app\(dashboard)\dashboard\admin\digital-marketing\facebook\composer\page.tsx
- Arrays: `postTypes` (0 items), `templates` (0 items)
- UI Patterns: platform-header, back-navigation, responsive-grid-3
- Platform: n/a
- Lines: 270

### app\(dashboard)\dashboard\admin\digital-marketing\google\ads-campaigns\page.tsx
- Arrays: `campaignTypes` (0 items), `adGroupStructure` (0 items), `negativeKeywords` (0 items), `landingPageChecklist` (0 items)
- UI Patterns: platform-header, back-navigation, checklist, tip-callout, responsive-grid-3
- Platform: n/a
- Lines: 269

### app\(dashboard)\dashboard\admin\digital-marketing\linkedin\company-page\page.tsx
- Arrays: `profileChecklist` (0 items), `brandingGuidelines` (0 items), `teamShowcase` (0 items)
- UI Patterns: platform-header, why-platform-card, back-navigation, checklist, responsive-grid-3
- Platform: n/a
- Lines: 268

### app\(dashboard)\dashboard\admin\digital-marketing\page.tsx
- Arrays: `platformCards` (0 items), `quickLinks` (0 items)
- UI Patterns: platform-header
- Platform: n/a
- Lines: 267

### app\(dashboard)\dashboard\admin\email-administration\configuration\email-preview\page.tsx
- Arrays: `TEMPLATE_GROUPS` (0 items), `URGENCY_LEVELS` (0 items)
- UI Patterns: platform-header, responsive-grid-3
- Platform: n/a
- Lines: 259

### app\(dashboard)\dashboard\admin\digital-marketing\google\seo\page.tsx
- Arrays: `onPageChecklist` (0 items), `structuredDataSchemas` (0 items), `coreWebVitals` (0 items), `keywordStrategy` (0 items)
- UI Patterns: platform-header, strategy-flow, back-navigation, metrics-grid, checklist, tip-callout, responsive-grid-3
- Platform: n/a
- Lines: 256

### app\(dashboard)\dashboard\admin\digital-marketing\google\business-profile\page.tsx
- Arrays: `profileChecklist` (0 items), `faqPairs` (0 items), `reviewTemplates` (0 items), `localSeoSignals` (0 items)
- UI Patterns: platform-header, back-navigation, reporting-cadence, checklist, responsive-grid-2, responsive-grid-3
- Platform: n/a
- Lines: 253

### app\(dashboard)\dashboard\admin\digital-marketing\linkedin\page.tsx
- Arrays: `tools` (0 items), `strategy` (0 items)
- UI Patterns: platform-header, why-platform-card, strategy-flow, tool-grid, platform-specs, back-navigation, responsive-grid-3
- Platform: n/a
- Lines: 251

### app\(dashboard)\dashboard\admin\digital-marketing\twitter\page.tsx
- Arrays: `tools` (0 items), `strategy` (0 items)
- UI Patterns: platform-header, why-platform-card, strategy-flow, tool-grid, platform-specs, back-navigation, reporting-cadence, responsive-grid-3
- Platform: n/a
- Lines: 247

### app\(dashboard)\dashboard\admin\digital-marketing\facebook\page.tsx
- Arrays: `tools` (0 items), `strategy` (0 items)
- UI Patterns: platform-header, why-platform-card, strategy-flow, tool-grid, platform-specs, back-navigation, reporting-cadence, responsive-grid-2, responsive-grid-3
- Platform: n/a
- Lines: 246

### app\(dashboard)\dashboard\admin\digital-marketing\twitter\engagement\page.tsx
- Arrays: `dailyRoutine` (0 items), `replyTemplates` (0 items), `engagementTactics` (0 items), `accountsToFollow` (0 items)
- UI Patterns: platform-header, back-navigation, tip-callout, responsive-grid-3
- Platform: n/a
- Lines: 244

### app\services\page.tsx
- Arrays: `services` (0 items), `specializations` (0 items), `certifications` (0 items)
- UI Patterns: none detected
- Platform: n/a
- Lines: 231

### app\(dashboard)\dashboard\admin\email-administration\infrastructure\page.tsx
- Arrays: `features` (0 items), `systemChecks` (0 items)
- UI Patterns: platform-header, responsive-grid-2, responsive-grid-3
- Platform: n/a
- Lines: 228

### app\(dashboard)\dashboard\admin\document-administration\page.tsx
- Arrays: `sections` (0 items), `highlights` (0 items)
- UI Patterns: platform-header, responsive-grid-2, responsive-grid-3
- Platform: n/a
- Lines: 226

### app\(dashboard)\dashboard\admin\digital-marketing\twitter\hashtag-strategy\page.tsx
- Arrays: `hashtagCategories` (0 items), `rules` (0 items), `combos` (0 items)
- UI Patterns: platform-header, strategy-flow, back-navigation, tip-callout, responsive-grid-3
- Platform: n/a
- Lines: 223

### app\(dashboard)\dashboard\admin\digital-marketing\facebook\analytics\page.tsx
- Arrays: `keyMetrics` (0 items), `contentPerformance` (0 items), `reportingSchedule` (0 items), `setupChecklist` (0 items)
- UI Patterns: platform-header, back-navigation, metrics-grid, reporting-cadence, content-comparison-table, checklist, tip-callout, responsive-grid-3
- Platform: n/a
- Lines: 222

### app\(dashboard)\dashboard\admin\digital-marketing\twitter\analytics\page.tsx
- Arrays: `keyMetrics` (0 items), `contentPerformance` (0 items), `reportingSchedule` (0 items), `setupChecklist` (0 items)
- UI Patterns: platform-header, back-navigation, metrics-grid, reporting-cadence, content-comparison-table, checklist, tip-callout, responsive-grid-3
- Platform: n/a
- Lines: 219

### app\(dashboard)\dashboard\admin\digital-marketing\facebook\messenger\page.tsx
- Arrays: `autoReplies` (0 items), `quickReplies` (0 items), `messengerBestPractices` (0 items)
- UI Patterns: platform-header, back-navigation, tip-callout, responsive-grid-2
- Platform: n/a
- Lines: 217

### app\(dashboard)\dashboard\documentation\app-reference\getting-started\page.tsx
- Arrays: `journeys` (0 items)
- UI Patterns: platform-header, strategy-flow, responsive-grid-2, responsive-grid-3
- Platform: n/a
- Lines: 213

### app\(dashboard)\dashboard\admin\digital-marketing\facebook\events\page.tsx
- Arrays: `eventTypes` (0 items), `eventChecklist` (0 items), `promotionTemplates` (0 items)
- UI Patterns: platform-header, back-navigation, checklist, tip-callout, responsive-grid-2, responsive-grid-3
- Platform: n/a
- Lines: 207

### app\(dashboard)\dashboard\admin\email-administration\page.tsx
- Arrays: `sections` (0 items), `highlights` (0 items)
- UI Patterns: platform-header, responsive-grid-3
- Platform: n/a
- Lines: 201

### app\(dashboard)\dashboard\documentation\strategic-overview\overview\page.tsx
- Arrays: `sections` (0 items), `audiences` (0 items)
- UI Patterns: strategy-flow, responsive-grid-3
- Platform: n/a
- Lines: 194

### app\(dashboard)\dashboard\documentation\cms-reference\overview\page.tsx
- Arrays: `features` (0 items)
- UI Patterns: responsive-grid-2, responsive-grid-3
- Platform: n/a
- Lines: 190

### app\(dashboard)\dashboard\admin\email-administration\getting-started\page.tsx
- Arrays: `journeys` (0 items), `quickChecklist` (0 items)
- UI Patterns: platform-header, back-navigation, checklist
- Platform: n/a
- Lines: 189

### app\(dashboard)\dashboard\documentation\strategic-overview\getting-started\page.tsx
- Arrays: `sectionStarts` (0 items), `quickLinks` (0 items)
- UI Patterns: responsive-grid-2
- Platform: n/a
- Lines: 189

### app\(dashboard)\dashboard\admin\digital-marketing\content-strategy\page.tsx
- Arrays: `contentCalendar` (0 items), `distributionChannels` (0 items), `contentMetrics` (0 items), `editorialGuidelines` (0 items)
- UI Patterns: platform-header, metrics-grid, reporting-cadence, responsive-grid-2
- Platform: n/a
- Lines: 188

### app\(dashboard)\dashboard\documentation\app-reference\overview\page.tsx
- Arrays: `features` (0 items)
- UI Patterns: responsive-grid-2, responsive-grid-3
- Platform: n/a
- Lines: 188

### app\(dashboard)\dashboard\admin\email-administration\request-management\page.tsx
- Arrays: `features` (0 items), `capabilities` (0 items)
- UI Patterns: platform-header, responsive-grid-2, responsive-grid-3
- Platform: n/a
- Lines: 187

### app\(dashboard)\dashboard\admin\digital-marketing\facebook\page-management\page.tsx
- Arrays: `setupChecklist` (0 items), `reviewTemplates` (0 items), `optimisationTips` (0 items)
- UI Patterns: platform-header, back-navigation, checklist, tip-callout
- Platform: n/a
- Lines: 181

### app\(dashboard)\dashboard\admin\document-administration\getting-started\page.tsx
- Arrays: `journeys` (0 items), `quickChecklist` (0 items)
- UI Patterns: platform-header, back-navigation, checklist
- Platform: n/a
- Lines: 181

### app\(dashboard)\dashboard\documentation\infrastructure-and-ops\overview\page.tsx
- Arrays: `features` (0 items)
- UI Patterns: strategy-flow, responsive-grid-2, responsive-grid-3
- Platform: n/a
- Lines: 180

### app\(dashboard)\dashboard\admin\document-administration\quality-engineering\page.tsx
- Arrays: `qaTools` (0 items)
- UI Patterns: platform-header, tool-grid, responsive-grid-3
- Platform: n/a
- Lines: 165

### app\contact\page.tsx
- Arrays: `trustIndicators` (0 items)
- UI Patterns: none detected
- Platform: n/a
- Lines: 152

## Recommended Phase 2 Actions

1. **Extract shared components** from the top repeating patterns above
2. **Create mock data files** for each platform (LinkedIn, Google, Facebook, Twitter)
3. **Refactor largest pages first** - they yield the most line reduction
4. **Start with marketing platform template** - covers the most pages with one component
5. **Build from atoms up** - StatusBadge, IconContainer, SectionHeading first

## Files for Reference

- Machine-readable audit: `data/phase1-component-audit.json`
- Type definitions: `types/strapi/*.types.ts`
- Component prop types: `types/components/*.types.ts`
