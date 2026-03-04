# v0 Rules: Content Module
**Last modified:** Session 47 (2026-02-10) -- Added Guides content type to file locations table. Updated load-when trigger.
**Load when:** Creating articles, case studies, tutorials, guides, or content components

---

## Content Quality Standard (ZERO TOLERANCE)

All new articles, tutorials, and case studies MUST:
1. Have a dedicated component file using the shared component library from `components/molecules/article-components.tsx`
2. Use standard layout: content left (`flex-1 min-w-0`), TableOfContents right (`aside hidden xl:block w-64`)
3. ALWAYS include: TableOfContents, SectionHeader, InfoBox, CodeBlock, KeyTakeaway, RelatedArticles
4. Use diagrams/flows where applicable: StepFlow, VerticalFlow, DataFlowDiagram, ArchitectureDiagram, ProcessFlow, DecisionTree
5. Use data visualisation where applicable: MetricsGrid, StatsTable, ComparisonCards, BeforeAfterComparison, FeatureGrid
6. Use structural components where applicable: FileTree, NumberedList, SubSectionHeader
7. NEVER store long content as flat text -- data entries hold metadata + brief excerpt only
8. Register in the slug page's richContentMap
9. Set `hasRichContent: true` in the data entry

## Component File Locations

| Content Type | Component Dir | Slug Page | Props |
|-------------|--------------|-----------|-------|
| Articles | `components/articles/` | `articles/[slug]/page.tsx` | None (self-contained) |
| Case Studies | `components/case-studies/` | `case-studies/[slug]/page.tsx` | `{ caseStudy: CaseStudy }` |
| Tutorials | `components/tutorials/` | `tutorials/[slug]/page.tsx` | None (self-contained) |
| Guides | `components/guides/` | `guides/[slug]/page.tsx` | None (self-contained) |

## Defensive Props Standard (PREVENTS CRASHES)

ALL shared components accepting array props MUST:
1. Use `guardArrayProp` + `PropGuardDiagnostic` from `@/lib/utils/prop-guard`
2. Guard EVERY array prop BEFORE `.map()`: `const guarded = guardArrayProp(prop, "Name", "prop")`
3. Return `<PropGuardDiagnostic />` if null (dev: yellow card, prod: graceful null)
4. NEVER call `.map()` on an unguarded prop

## Exports Manifest -- SINGLE SOURCE OF TRUTH
**Last verified:** Session 28 (grep against article-components.tsx line numbers)
**Rule:** If it's NOT on this list, it DOES NOT EXIST. No exceptions. Never invent component names.

### article-components.tsx (23 exports):
```
TableOfContents({ items: {id,title}[] })
SectionHeader({ number: string, title: string, id?: string })
SubSectionHeader({ title: string, id?: string })
InfoBox({ children: ReactNode, type?: "info"|"warning"|"tip"|"important", title?: string })
StepFlow({ steps: {number,title,description}[], title?: string })
VerticalFlow({ steps: {title,description,icon?}[], title?: string })
ComparisonCards({ items: {title,description,status}[], columns?: number })
BeforeAfterComparison({ before: {title,code}, after: {title,code} })
CodeBlock({ code: string, language?: string, filename?: string, title?: string })
FileTree({ items: FileTreeItem[], title?: string })
ArchitectureDiagram({ layers: {label,items:string[]}[] })
FeatureGrid({ features: {icon?,title,description}[], columns?: number })
MetricsGrid({ metrics: {label,value,description?,trend?}[] })
DataFlowDiagram({ nodes: {id,label,description?}[], connections?: string[] })
DecisionTree({ decisions: {condition,result,recommended?}[] })
KeyTakeaway({ children: ReactNode })
RelatedArticles({ articles: {title,slug,description?}[] })
StatsTable({ headers: string[], rows: string[][] })
NumberedList({ items: string[] })
ProcessFlow({ steps: string[], title?: string })
SideBySideComparison({ left: {title,items:string[]}, right: {title,items:string[]} })
FileTreeDiagram({ items?: FileTreeItem[], files?: FileTreeItem[], title?: string })
MetricCard({ label: string, value: string, description?: string, icon?: ReactNode })
```

### Atom Components:
```
CodeExplanation({ terms: {term,description}[], summary: string })  -- from @/components/atoms/code-explanation
CodeBlock (atoms) -- from @/components/atoms/code-block (different from article-components CodeBlock)
Spoiler({ title: string, children: ReactNode }) -- from @/components/atoms/spoiler
```

### Hallucination Registry (NEVER use these names):
| Hallucinated Name | Correct Replacement |
|---|---|
| BestPracticeCard | InfoBox type="tip" |
| WarningCallout | InfoBox type="warning" |
| InfoCallout | InfoBox type="info" |
| SectionAnchor | SectionHeader |
| explanations={} on CodeExplanation | terms={} |
| KeyTakeaway title="" takeaway="" | KeyTakeaway with children only |
| DecisionTree nodes={} | DecisionTree decisions={} |
| ComparisonTable | StatsTable (same props: headers, rows) |
| WarningBox | InfoBox type="warning" |

## Active Patterns (use these)
- `decisions={[{condition, result, recommended}]}` for DecisionTree
- `guardArrayProp()` before every `.map()` call
- richContentMap pattern for slug pages

## Deprecated Patterns (NEVER use)
- `nodes={[{question, options}]}` on DecisionTree -- WRONG prop name and shape
- Flat text content in data arrays -- always use rich components
- Direct `.map()` without guard -- crashes on undefined
