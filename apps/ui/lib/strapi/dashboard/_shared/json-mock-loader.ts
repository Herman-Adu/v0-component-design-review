import "server-only";
import { readdirSync, readFileSync, statSync } from "fs";
import { join } from "path";

/**
 * JSON Mock Loader
 *
 * Server-only utility for loading mock JSON files when Strapi is unavailable.
 * Used by all content builders as a fallback — keeps pages rendering on Vercel
 * and in any environment where STRAPI_URL is not configured.
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

/**
 * Recursively collect all .json files from a directory.
 * Skips list/overview/pages index files (they are not content documents).
 */
function collectJsonFiles(dir: string): string[] {
  const results: string[] = [];
  try {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        results.push(...collectJsonFiles(fullPath));
      } else if (
        entry.endsWith(".json") &&
        !entry.endsWith("-list.json") &&
        !entry.endsWith("-overview.json") &&
        !entry.endsWith("-pages.json")
      ) {
        results.push(fullPath);
      }
    }
  } catch {
    // Directory not found or unreadable — return empty
  }
  return results;
}

/**
 * Load and parse all content JSON files from a mock directory.
 * Returns the raw parsed objects (not yet validated — caller validates with Zod).
 */
export function loadJsonMockFiles(mockDir: string): unknown[] {
  const files = collectJsonFiles(mockDir);
  const results: unknown[] = [];
  for (const file of files) {
    try {
      const raw = readFileSync(file, "utf-8");
      results.push(JSON.parse(raw));
    } catch {
      console.warn(`[json-mock-loader] Failed to parse ${file}`);
    }
  }
  return results;
}

/**
 * Resolve the absolute path to a mock data directory.
 * process.cwd() in Next.js is the apps/ui root.
 */
export function mockDataPath(...segments: string[]): string {
  return join(process.cwd(), "data", "strapi-mock", ...segments);
}
