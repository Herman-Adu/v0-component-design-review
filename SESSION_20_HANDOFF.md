# SESSION 20 - ATOMIC ARCHITECTURE REFACTOR

## EXECUTIVE SUMMARY

**Mission:** Transform 81 self-contained pages into a proper atomic design system with Strapi-ready data architecture.

**Current State:** 
- 81 pages with hardcoded data, zero reuse
- 38 existing atomic components (unused in pages)
- Grid migration complete (Session 18)

**Target State:**
- Global atomic component library (atoms → molecules → organisms → templates)
- Feature-based architecture for feature-specific components
- TypeScript-first with Strapi mock data structure
- Pages as thin wrappers (10 lines max)

**Session 20 Goal:** Write 9 refactor scripts, execute Phase 1-2 (foundation + core molecules)

---

## RESOURCE DASHBOARD

```
┌─────────────────────────────────────────────────────────┐
│ SESSION 20 - STARTING RESOURCES                        │
├─────────────────────────────────────────────────────────┤
│ Ops:     0 / 40 (Fresh session)    ✓ Full budget       │
│ Context: 0k / 200k (Fresh context) ✓ Clean slate       │
│ Model:   v0 Mini                   ✓ Script generation │
│ Phase:   Script Writing            → Phase 1-2 execution│
│ Branch:  main                      ✓ Synced            │
└─────────────────────────────────────────────────────────┘
```

**Model Orchestration:**
- v0 Mini: Script generation, guidance (Session 20)
- v0 Pro: Complex organism logic (if needed)
- v0 Max: Architecture review (future sessions)

**Context Triggers:**
- 160k (80%) → Create checkpoint
- 190k (95%) → MUST end session

**Ops Triggers:**
- 30 ops → Consider Pro model
- 35 ops → End session or Max model

---

## ARCHITECTURE STANDARDS

### GLOBAL ATOMIC DESIGN

```
/components/
  ├── atoms/              # Smallest UI units (buttons, badges, icons)
  │   ├── status-badge.tsx
  │   ├── category-badge.tsx
  │   ├── metric-value.tsx
  │   ├── icon-container.tsx
  │   └── section-divider.tsx
  │
  ├── molecules/          # Composed atoms (cards, forms)
  │   ├── tool-card.tsx
  │   ├── strategy-phase-card.tsx
  │   ├── metric-card.tsx
  │   ├── setup-step-card.tsx
  │   └── template-card.tsx
  │
  ├── organisms/          # Composed molecules (grids, flows, dashboards)
  │   ├── tool-grid.tsx
  │   ├── strategy-flow.tsx
  │   ├── metrics-dashboard.tsx
  │   ├── setup-wizard.tsx
  │   ├── content-composer.tsx
  │   └── platform-specs-card.tsx
  │
  └── templates/          # Full page layouts
      ├── marketing-platform-template.tsx
      ├── analytics-page-template.tsx
      ├── composer-page-template.tsx
      └── documentation-page-template.tsx
```

**Rules:**
- Atoms: No imports from molecules/organisms
- Molecules: Only import atoms
- Organisms: Import molecules + atoms
- Templates: Import organisms + molecules + atoms
- Pages: Import templates only

---

### FEATURE-BASED ARCHITECTURE

```
/features/[feature-name]/
  ├── components/
  │   ├── atoms/          # Feature-specific atoms
  │   ├── molecules/      # Feature-specific molecules
  │   └── organisms/      # Feature-specific organisms
  └── lib/                # Feature business logic
```

**Boundary Rules:**
- **Global components** → Reusable across entire app
- **Feature components** → Specific to one feature domain
- **No mixing** → Feature components stay in /features/

**Example:**
- `ToolCard` used across marketing pages → `/components/molecules/tool-card.tsx`
- LinkedIn connection analyzer (LinkedIn only) → `/features/linkedin/components/molecules/connection-analyzer.tsx`

---

### TYPESCRIPT-FIRST (STRAPI MOCK)

```
/types/
  ├── strapi/                           # Mock Strapi collections
  │   ├── marketing-platform.types.ts   # Platform collection
  │   ├── tool.types.ts                 # Tool collection
  │   ├── strategy-phase.types.ts       # Strategy phase collection
  │   ├── metric.types.ts               # Metric collection
  │   ├── template.types.ts             # Template collection
  │   └── documentation.types.ts        # Documentation collection
  │
  └── components/                       # Component prop interfaces
      ├── atom.types.ts                 # All atom prop types
      ├── molecule.types.ts             # All molecule prop types
      ├── organism.types.ts             # All organism prop types
      └── template.types.ts             # All template prop types
```

**Interface Design Rules:**
1. Define Strapi collection interfaces FIRST
2. Define component prop interfaces that consume Strapi types
3. Build components to interface contracts
4. Mock data matches interface shape exactly
5. Migration to real Strapi requires zero type changes

**Example Flow:**
```typescript
// 1. Strapi collection type
interface Tool {
  id: string
  title: string
  description: string
  role: string
  status: "Active" | "Beta" | "Coming Soon"
  href: string
  icon: string
}

// 2. Component props use Strapi type
interface ToolCardProps {
  tool: Tool  // Direct use of Strapi type
  variant?: "compact" | "detailed"
}

// 3. Mock data matches Strapi shape
const mockTools: Tool[] = [
  { id: "1", title: "Analytics", ... }
]

// 4. Component built to contract
function ToolCard({ tool, variant }: ToolCardProps) { ... }
```

---

### DATA FLOW ARCHITECTURE

```
Current (Session 18):
  Page → Hardcoded data array → Inline JSX

Target (Session 20+):
  Strapi → Mock JSON → Template → Page
```

**Mock Data Structure:**
```
/data/mock/
  ├── marketing-platforms/
  │   ├── linkedin.json
  │   ├── google.json
  │   ├── twitter.json
  │   └── facebook.json
  ├── analytics/
  │   ├── google-analytics.json
  │   └── linkedin-analytics.json
  └── templates/
      ├── linkedin-templates.json
      └── twitter-templates.json
```

**Page Transformation:**

**BEFORE (150 lines):**
```typescript
export default function LinkedInPage() {
  const tools = [{ title: "...", ... }, ...] // Hardcoded
  const strategy = [{ title: "...", ... }, ...] // Hardcoded
  
  return (
    <div>
      {tools.map(tool => (
        <Card>
          <CardHeader>
            <Icon />
            <Title>{tool.title}</Title>
          </CardHeader>
          <CardContent>
            <Description>{tool.description}</Description>
          </CardContent>
        </Card>
      ))}
      {/* 100 more lines... */}
    </div>
  )
}
```

**AFTER (10 lines):**
```typescript
import { MarketingPlatformTemplate } from '@/components/templates/marketing-platform-template'
import linkedinData from '@/data/mock/marketing-platforms/linkedin.json'

export default function LinkedInPage() {
  return <MarketingPlatformTemplate {...linkedinData} />
}
```

---

## SCRIPT-BASED WORKFLOW

### THE WORKFLOW

**Step-by-step execution:**

1. **v0 creates script** in `/scripts/` folder
2. **v0 auto-commits and pushes** to GitHub (current branch)
3. **You pull locally:** `git pull origin main` (or feature branch)
4. **You run script:** `node scripts/phase1-generate-types.js`
5. **You test/build:** `npm run build`
6. **Errors found** → Copy errors to v0 chat
7. **v0 guides fixes** → You apply locally
8. **Iterate** until clean build
9. **You commit/push** final working version
10. **v0 pulls back** to stay synced

**Why this workflow:**
- Zero token waste on file edits
- Real Node environment for testing
- Catch errors early with actual builds
- Git keeps us synced automatically
- You control what goes into codebase

---

### SCRIPT FEATURES (ALL SCRIPTS)

Every script includes:

1. **Dry-run mode:** `node script.js --dry-run` (shows changes, doesn't edit)
2. **Verbose mode:** `node script.js --verbose` (detailed logging)
3. **Backup system:** Creates `/backup/` before editing files
4. **Rollback:** `node script.js --rollback` (restore from backup)
5. **Exit on error:** Won't corrupt files if something fails
6. **Progress reporting:** Shows what's being created/edited
7. **Summary report:** Generates markdown summary of changes

**Example usage:**
```bash
# Test what will happen
node scripts/phase1-generate-types.js --dry-run

# Run with detailed logging
node scripts/phase1-generate-types.js --verbose

# Rollback if something broke
node scripts/phase1-generate-types.js --rollback
```

---

## PHASE 1: FOUNDATION (Priority 1)

### Script 1: Generate TypeScript Interfaces

**File:** `scripts/phase1-generate-types.js`

**Purpose:** Extract data patterns from existing pages, generate TypeScript interfaces

**Input:** 5 representative pages (LinkedIn, Google, Twitter, Analytics, Documentation)

**Output:**
```
/types/strapi/
  ├── marketing-platform.types.ts
  ├── tool.types.ts
  ├── strategy-phase.types.ts
  ├── metric.types.ts
  ├── template.types.ts
  └── documentation.types.ts

/types/components/
  ├── atom.types.ts
  ├── molecule.types.ts
  ├── organism.types.ts
  └── template.types.ts
```

**Logic:**
1. Read 5 sample pages
2. Parse hardcoded data arrays
3. Infer TypeScript interfaces from data shape
4. Generate interface files with JSDoc comments
5. Create index.ts for easy imports

**Estimated time:** 2 minutes to run

---

### Script 2: Audit Existing Components

**File:** `scripts/phase1-audit-components.js`

**Purpose:** Inventory 38 existing components, identify reusable vs deprecated

**Input:** `/components/atoms/`, `/components/molecules/`, `/components/organisms/`

**Output:**
```
/data/component-inventory.json
/data/component-audit-report.md
```

**Logic:**
1. Scan all component files
2. Extract: name, props, dependencies, usage count
3. Categorize: reusable, needs-refactor, deprecated
4. Generate audit report with recommendations

**Sample output (component-inventory.json):**
```json
{
  "atoms": [
    {
      "name": "callout",
      "path": "/components/atoms/callout.tsx",
      "status": "reusable",
      "usageCount": 12,
      "recommendation": "Promote to global"
    }
  ],
  "molecules": [
    {
      "name": "content-card",
      "path": "/components/molecules/content-card.tsx",
      "status": "needs-refactor",
      "usageCount": 0,
      "recommendation": "Unused - template for ToolCard"
    }
  ]
}
```

**Estimated time:** 1 minute to run

---

## PHASE 2: CORE MOLECULES (Priority 2)

### Script 3: Generate Core Molecules

**File:** `scripts/phase2-generate-molecules.js`

**Purpose:** Batch-generate 5 core molecule components

**Input:** TypeScript interfaces from Phase 1

**Output:**
```
/components/molecules/
  ├── tool-card.tsx
  ├── strategy-phase-card.tsx
  ├── metric-card.tsx
  ├── setup-step-card.tsx
  └── template-card.tsx
```

**Each molecule includes:**
- TypeScript interface from `/types/components/molecule.types.ts`
- shadcn/ui Card components
- Proper prop destructuring
- JSDoc comments
- Export statement

**Logic:**
1. Read molecule type definitions
2. Generate component files using templates
3. Import required atoms (StatusBadge, etc.)
4. Apply consistent styling
5. Include example usage comments

**Estimated time:** 3 minutes to run

---

## PHASE 3: ORGANISMS (Priority 3)

### Script 4: Generate Organisms

**File:** `scripts/phase3-generate-organisms.js`

**Purpose:** Generate 6 organism components (compose molecules)

**Output:**
```
/components/organisms/
  ├── tool-grid.tsx
  ├── strategy-flow.tsx
  ├── metrics-dashboard.tsx
  ├── setup-wizard.tsx
  ├── content-composer.tsx
  └── platform-specs-card.tsx
```

**Estimated time:** 4 minutes to run

---

## PHASE 4: TEMPLATES (Priority 4)

### Script 5: Generate Templates

**File:** `scripts/phase4-generate-templates.js`

**Purpose:** Generate 4 page templates (compose organisms)

**Output:**
```
/components/templates/
  ├── marketing-platform-template.tsx
  ├── analytics-page-template.tsx
  ├── composer-page-template.tsx
  └── documentation-page-template.tsx
```

**Estimated time:** 5 minutes to run

---

## PHASE 5: PAGE REFACTOR (Priority 5)

### Script 6: Extract Page Data (Pilot)

**File:** `scripts/phase5-extract-linkedin-data.js`

**Purpose:** Extract LinkedIn page data to JSON mock

**Input:** `/app/(dashboard)/dashboard/admin/digital-marketing/linkedin/page.tsx`

**Output:** `/data/mock/marketing-platforms/linkedin.json`

**Estimated time:** 1 minute to run

---

### Script 7: Refactor LinkedIn Page (Pilot)

**File:** `scripts/phase5-refactor-linkedin-page.js`

**Purpose:** Refactor LinkedIn page to use template

**Input:** 
- Original page
- linkedin.json mock data
- MarketingPlatformTemplate

**Output:** Refactored page (10 lines)

**Estimated time:** 30 seconds to run

---

### Script 8: Batch Extract All Data

**File:** `scripts/phase5-extract-all-data.js`

**Purpose:** Extract data from all 81 pages to JSON mocks

**Estimated time:** 10 minutes to run

---

### Script 9: Batch Refactor All Pages

**File:** `scripts/phase5-refactor-all-pages.js`

**Purpose:** Refactor all 81 pages to use templates

**Estimated time:** 5 minutes to run

---

## SESSION 20 EXECUTION PLAN

### TIMELINE

**Phase 1 (Foundation):** 1-2 hours
- Create Script 1 (5 ops)
- Create Script 2 (3 ops)
- You run scripts locally, test
- Iterate on errors (5 ops)
- **Total: ~13 ops**

**Phase 2 (Core Molecules):** 1 hour
- Create Script 3 (5 ops)
- You run, test, build
- Iterate on errors (3 ops)
- **Total: ~8 ops**

**Session 20 Total: ~21 ops** (well within 40 budget)

**Save Phase 3-5 for Session 21** (organisms, templates, page refactor)

---

## SUCCESS CRITERIA

**Phase 1 Complete:**
- ✅ TypeScript interfaces exist in `/types/`
- ✅ Component inventory JSON generated
- ✅ Audit report shows reusable components identified
- ✅ Clean TypeScript build (`npm run build`)

**Phase 2 Complete:**
- ✅ 5 core molecules exist in `/components/molecules/`
- ✅ All molecules use TypeScript interfaces
- ✅ Clean build with no type errors
- ✅ Molecules follow atomic design principles

---

## ORCHESTRATION RULES

### CONTEXT MANAGEMENT

**Monitor context every response:**
```
Context: XXXk / 200k (XX%)
```

**Actions:**
- 160k (80%) → Create checkpoint document
- 190k (95%) → END SESSION, create handoff
- 195k (97.5%) → CRITICAL, save immediately

---

### MODEL SWITCHING

**Use v0 Mini for:**
- Script generation (repetitive)
- Interface generation
- Batch component creation
- Error guidance

**Switch to v0 Pro for:**
- Complex organism composition
- Template design requiring creativity
- Multi-file orchestration

**Switch to v0 Max for:**
- Architecture review
- System-wide refactor decisions
- >35 ops used

---

### OPS BUDGET

**Target distribution (Session 20):**
- Script 1: 5 ops
- Script 2: 3 ops
- Error iteration: 5 ops
- Script 3: 5 ops
- Error iteration: 3 ops
- Total: 21 ops (19 remaining for Phase 3-5 if time permits)

---

## NEXT STEPS (SESSION 20 START)

1. **Read this handoff completely**
2. **Read AGENTIC_OS_FRAMEWORK.md** (orchestration rules)
3. **Confirm current branch:** `git branch --show-current`
4. **Request Script 1:** "Write Script 1 (phase1-generate-types.js)"
5. **Pull locally after v0 pushes**
6. **Run script:** `node scripts/phase1-generate-types.js --dry-run` (test first)
7. **Run for real:** `node scripts/phase1-generate-types.js`
8. **Build:** `npm run build`
9. **Share errors if any**
10. **Iterate until clean**

---

## CRITICAL LESSONS FROM SESSION 19

1. **Git sync complexity burns context** - Use script workflow instead
2. **No code before architecture** - Define interfaces first
3. **Batch operations save tokens** - 5 molecules in 1 script vs 5 scripts
4. **Test locally, not in v0** - Real builds catch real errors
5. **Orchestration prevents waste** - Monitor resources every response

---

## FILES TO REVIEW BEFORE STARTING

Essential context files:
- `SESSION_20_HANDOFF.md` (this file)
- `AGENTIC_OS_FRAMEWORK.md` (orchestration)
- `WORKFLOW.md` (existing workflow docs)
- `SESSION_19_HANDOFF.md` (previous context)

Don't read full page files - use scripts to extract patterns.

---

**Session 20 Ready. Execute with discipline. Zero shortcuts.**
