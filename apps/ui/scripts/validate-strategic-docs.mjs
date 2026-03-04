import * as fs from "node:fs";
import * as path from "node:path";
import { z } from "zod";

const DOCS_DIR = path.join(process.cwd(), "data", "documentation-strategic");

const TextBlockSchema = z.object({
  type: z.literal("text"),
  content: z.string().min(1),
});

const HeadingBlockSchema = z.object({
  type: z.literal("heading"),
  level: z.number().min(1).max(6),
  content: z.string().min(1),
  anchorId: z.string().optional(),
});

const CodeBlockSchema = z.object({
  type: z.literal("code"),
  language: z.string(),
  content: z.string().min(1),
});

const ListBlockSchema = z.object({
  type: z.literal("list"),
  ordered: z.boolean(),
  items: z.array(
    z.union([
      z.string(),
      z.object({
        title: z.string(),
        description: z.string().optional(),
      }),
    ]),
  ),
});

const TableBlockSchema = z.object({
  type: z.literal("table"),
  headers: z.array(z.string()),
  rows: z.array(z.array(z.string())),
});

const CalloutBlockSchema = z.object({
  type: z.literal("callout"),
  type_name: z.enum([
    "info",
    "warning",
    "success",
    "error",
    "diagram-reference",
  ]),
  title: z.string(),
  content: z.string(),
});

const AlertBlockSchema = z.object({
  type: z.literal("alert"),
  type_name: z.enum(["info", "warning", "success", "error"]),
  title: z.string(),
  content: z.string(),
});

const QuoteBlockSchema = z.object({
  type: z.literal("quote"),
  content: z.string(),
  author: z.string().optional(),
});

const BlockSchema = z.discriminatedUnion("type", [
  TextBlockSchema,
  HeadingBlockSchema,
  CodeBlockSchema,
  ListBlockSchema,
  TableBlockSchema,
  CalloutBlockSchema,
  AlertBlockSchema,
  QuoteBlockSchema,
]);

const TOCEntrySchema = z.object({
  level: z.number().min(1).max(6),
  title: z.string(),
  anchor: z.string(),
});

const MetaSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  excerpt: z.string().min(1),
  category: z.enum(["vision", "decisions", "patterns", "roadmap", "phases"]),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  publishedAt: z.string().datetime(),
  tags: z.array(z.string()).optional(),
});

const SEOSchema = z.object({
  metaTitle: z.string().min(1),
  metaDescription: z.string().min(1),
  keywords: z.string().min(1),
  canonicalUrl: z
    .string()
    .min(1)
    .refine((value) => value.startsWith("/") || /^https?:\/\//.test(value), {
      message:
        "canonicalUrl must be root-relative (/...) or absolute (http/https)",
    }),
  robots: z.string().optional(),
  preventIndexing: z.boolean().optional(),
});

const RouteSchema = z.object({
  pattern: z.string(),
  params: z.object({
    domain: z.literal("strategic"),
    slug: z.string(),
  }),
});

const AccessSchema = z.object({
  requiresAuth: z.boolean(),
  visibleToPublic: z.boolean(),
});

const StrategicDocumentationSchema = z.object({
  meta: MetaSchema,
  seo: SEOSchema,
  route: RouteSchema,
  access: AccessSchema,
  toc: z.array(TOCEntrySchema),
  blocks: z.array(BlockSchema),
});

async function validateStrategicDocs() {
  const results = [];

  if (!fs.existsSync(DOCS_DIR)) {
    console.error(`❌ Docs directory not found: ${DOCS_DIR}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(DOCS_DIR)
    .filter((file) => file.endsWith(".json"));

  console.log(
    `\n📚 Validating Strategic Documentation (${files.length} files)\n`,
  );
  console.log("═".repeat(60));

  let passCount = 0;
  let failCount = 0;

  for (const file of files) {
    const filePath = path.join(DOCS_DIR, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");

    try {
      const data = JSON.parse(fileContent);
      const result = StrategicDocumentationSchema.safeParse(data);

      if (result.success) {
        console.log(`✅ ${file}`);
        results.push({ file, valid: true });
        passCount++;
      } else {
        console.log(`❌ ${file}`);
        const errors = result.error.issues.map((issue) => {
          const issuePath = issue.path.join(".");
          return `   └─ ${issuePath || "root"}: ${issue.message}`;
        });
        console.log(errors.join("\n"));
        results.push({ file, valid: false, errors });
        failCount++;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.log(`❌ ${file} (JSON Parse Error)`);
      console.log(`   └─ ${message}`);
      results.push({ file, valid: false, errors: [message] });
      failCount++;
    }
  }

  console.log("═".repeat(60));
  console.log("\n📊 Validation Results:");
  console.log(`   ✅ Passed: ${passCount}/${files.length}`);
  console.log(`   ❌ Failed: ${failCount}/${files.length}`);

  if (failCount === 0) {
    console.log(`\n🎉 All ${files.length} articles validated successfully!`);
    console.log("\n✅ GATE 1 (Schema Validation) — PASS\n");
  } else {
    console.log(
      `\n❌ ${failCount} article(s) failed validation. Please fix errors above.`,
    );
    console.log("\n❌ GATE 1 (Schema Validation) — FAIL\n");
    process.exit(1);
  }

  return results;
}

validateStrategicDocs().catch((error) => {
  console.error(error);
  process.exit(1);
});
