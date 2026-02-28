# 🎯 CONTENT LIBRARY: DATA FLOW & SINGLE SOURCE OF TRUTH

## 📊 Complete Data Inventory

### Strapi Mock JSON (Single Source of Truth)

```
data/strapi-mock/dashboard/content-library/
│
├── articles/ (29 files)
│   ├── architecture/ (9 files)
│   ├── best-practices/ (5 files)
│   ├── forms/ (3 files)
│   ├── security/ (2 files)
│   ├── business/ (2 files)
│   ├── testing/ (1 file)
│   ├── devops/ (1 file)
│   ├── ai-tooling/ (1 file)
│   ├── rendering/ (3 files)
│   └── performance/ (2 files)
│
├── tutorials/ (15 files)
│   ├── components/ (3 files)
│   ├── forms/ (3 files)
│   ├── getting-started/ (2 files)
│   ├── security/ (2 files)
│   ├── cms/ (2 files)
│   ├── devops/ (1 file)
│   ├── testing/ (1 file)
│   └── email/ (1 file)
│
├── guides/ (3 files)
│   ├── security/ (1 file: security-architecture.json)
│   ├── devops/ (1 file: deployment-guide.json)
│   └── testing/ (1 file: testing-strategy.json)
│
└── case-studies/ (20 files)
    ├── security/ (4 files)
    ├── rendering/ (2 files)
    ├── business/ (3 files)
    ├── cms/ (1 file)
    ├── performance/ (1 file)
    ├── forms/ (2 files)
    ├── refactoring/ (3 files)
    ├── state-management/ (1 file)
    ├── email/ (1 file)
    ├── hydration/ (1 file)
    └── documentation/ (1 file)

TOTAL: 67 JSON files → 67 validated content records
```

## 🔄 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 1: DATA SOURCE (Single Source of Truth)                  │
│  [DATA] 🗄️  Strapi Mock JSON (67 files)                        │
│                                                                  │
│  Location: data/strapi-mock/dashboard/content-library/          │
│  Status: ✅ Validated with Zod schemas                          │
└───────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 2: CONTENT BUILDERS (Schema Validation)                  │
│  [DATA] 🗄️  4 Content Builders                                 │
│                                                                  │
│  Files:                                                          │
│  • article-content-builder.ts  (29 articles)                    │
│  • tutorial-content-builder.ts (15 tutorials)                   │
│  • guide-content-builder.ts    (3 guides)                       │
│  • case-study-content-builder.ts (20 case studies)              │
│                                                                  │
│  Responsibilities:                                               │
│  1. Import JSON files                                            │
│  2. Validate with Zod schemas                                    │
│  3. Build type-safe registry                                     │
│  4. Cache results                                                │
│  5. Export: getXList(), getXContentDocument(), getAllXSlugs()   │
│                                                                  │
│  Status: ✅ Fully instrumented with logging                     │
└───────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 3: REPOSITORIES (Single Access Point)                    │
│  [REPO] 📦 4 Repositories                                       │
│                                                                  │
│  Files:                                                          │
│  • article-repository.ts                                         │
│  • tutorial-repository.ts                                        │
│  • guides-repository.ts                                          │
│  • case-study-repository.ts                                      │
│                                                                  │
│  Responsibilities:                                               │
│  1. Call content builders                                        │
│  2. Provide query interface (list, getBySlug, getByCategory)    │
│  3. Return Records (entity + content document)                  │
│  4. Log all data access                                          │
│                                                                  │
│  Interface Pattern:                                              │
│  • listX(): X[]                                                  │
│  • listXSlugs(): string[]                                        │
│  • getXRecordBySlug(slug): XRecord | null                       │
│  • getXByCategory(cat): X[]                                      │
│  • getXByLevel(level): X[]                                       │
│                                                                  │
│  Status: ✅ Fully instrumented with logging                     │
└───────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 4: VIEW MODELS (DTO Transformation)                      │
│  [VIEW] 🎨 4 View Model Modules                                 │
│                                                                  │
│  Files:                                                          │
│  • article-view-models.ts                                        │
│  • tutorial-view-models.ts                                       │
│  • guide-view-models.ts                                          │
│  • case-study-view-models.ts                                     │
│                                                                  │
│  Responsibilities:                                               │
│  1. Transform domain models → UI-optimized view models          │
│  2. Add computed properties                                      │
│  3. Format dates/strings                                         │
│  4. Flatten nested structures                                    │
│                                                                  │
│  Pattern:                                                        │
│  • toXDetailViewModel(record): XDetailViewModel                 │
│  • toXListViewModel(records): XListViewModel[]                  │
│                                                                  │
│  Status: ⏳ NOT instrumented yet (Phase 2)                      │
└───────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 5: SERVER COMPONENTS (Data Orchestration)                │
│  [PAGE] 🖥️  8 Page Components (4 list + 4 detail)              │
│                                                                  │
│  List Pages:                                                     │
│  ✅ tutorials/page.tsx         (Server Component)               │
│  ✅ guides/page.tsx            (Server Component)               │
│  ⚠️  articles/page.tsx         (CLIENT - VIOLATION)             │
│  ⚠️  case-studies/page.tsx     (CLIENT - VIOLATION)             │
│                                                                  │
│  Detail Pages:                                                   │
│  ✅ articles/[category]/[slug]/page.tsx    (Server Component)   │
│  ✅ tutorials/[category]/[slug]/page.tsx   (Server Component)   │
│  ✅ guides/[category]/[slug]/page.tsx      (Server Component)   │
│  ✅ case-studies/[category]/[slug]/page.tsx (Server Component)  │
│                                                                  │
│  Responsibilities:                                               │
│  1. Call repositories (server-only)                              │
│  2. Transform to view models                                     │
│  3. Pass data to client components as props                     │
│  4. Handle static generation (generateStaticParams)             │
│                                                                  │
│  Status: ✅ 2/4 instrumented, ⚠️ 2 violations detected          │
└───────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 6: CLIENT COMPONENTS (UI Interactivity)                  │
│  [CLNT] ⚡ 2 Client Components                                  │
│                                                                  │
│  Files:                                                          │
│  ✅ tutorials/tutorials-client.tsx  (Correct pattern)           │
│  ⏳ articles/articles-client.tsx    (Needs creation)            │
│  ⏳ case-studies/case-studies-client.tsx (Needs creation)       │
│                                                                  │
│  Responsibilities:                                               │
│  1. Receive data via props ONLY (no repository calls)           │
│  2. Handle UI state (filters, sorting, search)                  │
│  3. Manage user interactions                                     │
│  4. Log hydration and interactions                              │
│                                                                  │
│  Pattern:                                                        │
│  export default function XPageClient({ items }: { items: X[] }) │
│    const [filter, setFilter] = useState(...)                    │
│    // UI logic only                                              │
│  }                                                               │
│                                                                  │
│  Status: ✅ 1/2 instrumented, ⏳ 2 need creation                │
└─────────────────────────────────────────────────────────────────┘
```

## 🏗️ Layer Responsibilities (N-Tier Architecture)

| Layer          | Files                  | Imports From               | Exports To        | Can Use State? | Runs Where |
| -------------- | ---------------------- | -------------------------- | ----------------- | -------------- | ---------- |
| **Data**       | `*-content-builder.ts` | JSON files                 | Repositories      | ❌ No          | Server     |
| **Repository** | `*-repository.ts`      | Content builders           | Pages             | ❌ No          | Server     |
| **View Model** | `*-view-models.ts`     | Repositories               | Pages             | ❌ No          | Server     |
| **Page**       | `page.tsx`             | Repositories + View Models | Client components | ❌ No          | Server     |
| **Client**     | `*-client.tsx`         | None (props only)          | User              | ✅ Yes         | Browser    |

## 🚫 Boundary Rules (Violations Logged)

### ❌ FORBIDDEN

1. **Client components importing repositories**

   ```typescript
   "use client";
   import { listArticles } from "@/lib/.../article-repository"; // ❌ VIOLATION
   ```

2. **Client components importing content builders**

   ```typescript
   "use client";
   import { getArticleList } from "@/lib/.../article-content"; // ❌ VIOLATION
   ```

3. **Pages calling content builders directly**

   ```typescript
   export default function Page() {
     const articles = getArticleList(); // ❌ Bypass repository
   }
   ```

4. **Cross-feature imports**
   ```typescript
   // In articles/
   import { getTutorialList } from "@/lib/.../tutorials/..."; // ⚠️ Coupling
   ```

### ✅ ALLOWED

1. **Pages calling repositories**

   ```typescript
   export default function Page() {
     const articles = listArticles(); // ✅ Correct
   }
   ```

2. **Repositories calling content builders**

   ```typescript
   export function listArticles() {
     return getArticleList(); // ✅ Correct layer
   }
   ```

3. **Client components receiving props**
   ```typescript
   "use client";
   export default function ArticlesClient({
     articles,
   }: {
     articles: Article[];
   }) {
     // ✅ Props only, no direct data access
   }
   ```

## 📊 Validation Status

| Check                | Status | Count | Notes            |
| -------------------- | ------ | ----- | ---------------- |
| JSON Files Exist     | ✅     | 67/67 | All present      |
| Schema Validation    | ✅     | 67/67 | 100% pass rate   |
| Content Builders     | ✅     | 4/4   | Instrumented     |
| Repositories         | ✅     | 4/4   | Instrumented     |
| View Models          | ⏳     | 0/4   | Not instrumented |
| Server Pages Correct | ⚠️     | 2/4   | 2 violations     |
| Client Components    | ⏳     | 1/2   | 1 needs creation |
| Build Success        | ✅     | Yes   | 0 errors         |
| TypeScript Clean     | ✅     | Yes   | 0 errors         |

## 🎯 Single Source of Truth Confirmation

**Question**: Is Strapi Mock JSON the only data source?  
**Answer**: ✅ **YES - CONFIRMED**

**Evidence**:

1. All 4 content builders import from `data/strapi-mock/`
2. No other JSON/data files in codebase
3. No API calls or external data fetching
4. Repository pattern enforces single access point
5. All 67 files validated with schemas
6. Build includes all 67 records (29 + 15 + 3 + 20)

**No Alternative Sources**: ✅ Confirmed  
**No Duplicate Data**: ✅ Confirmed  
**No Legacy Data**: ✅ Confirmed (old data/ files removed)

## 🔍 How to Verify

### Test Data Loading (Dev Server)

```bash
pnpm run dev
```

**Expected Console Output**:

```
[DATA] 🗄️  Loading articles from data/strapi-mock/.../articles/*.json
[DATA] 🗄️  Loaded 29 articles records from data/strapi-mock/.../articles/*.json
[DATA] 🗄️  ✓ Schema validation passed for 29 articles

[DATA] 🗄️  Loading tutorials from data/strapi-mock/.../tutorials/*.json
[DATA] 🗄️  Loaded 15 tutorials records from data/strapi-mock/.../tutorials/*.json
[DATA] 🗄️  ✓ Schema validation passed for 15 tutorials

[DATA] 🗄️  Loading guides from data/strapi-mock/.../guides/*.json
[DATA] 🗄️  Loaded 3 guides records from data/strapi-mock/.../guides/*.json
[DATA] 🗄️  ✓ Schema validation passed for 3 guides

[DATA] 🗄️  Loading case-studies from data/strapi-mock/.../case-studies/*.json
[DATA] 🗄️  Loaded 20 case-studies records from data/strapi-mock/.../case-studies/*.json
[DATA] 🗄️  ✓ Schema validation passed for 20 case-studies
```

### Test Page Navigation

Visit: `http://localhost:3000/dashboard/content-library/tutorials`

**Expected Logs**:

```
[PAGE] 🖥️  SERVER RENDER: /dashboard/content-library/tutorials
[REPO] 📦 tutorial-repository.listTutorials()
[REPO] 📦 tutorial-repository.listTutorials() → 15 records
[PAGE] 🖥️  /dashboard/content-library/tutorials fetched 15 tutorials
[CLNT] ⚡ Hydrating TutorialsPageClient
```

### Test Detail Page

Click any tutorial → Detail page

**Expected Logs**:

```
[PAGE] 🖥️  SERVER RENDER: /dashboard/content-library/tutorials/[category]/[slug]
[REPO] 📦 tutorial-repository.getTutorialRecordBySlug({ slug: "..." })
[REPO] 📦 tutorial-repository.getTutorialRecordBySlug() → 1 records
```

---

**✅ Single Source of Truth: VALIDATED**  
**✅ Block-Based Content: VALIDATED**  
**✅ Repository Pattern: ENFORCED**  
**⚠️ Boundary Violations: 2 DETECTED (articles, case-studies)**

**Next**: Fix boundary violations → Full end-to-end validation
