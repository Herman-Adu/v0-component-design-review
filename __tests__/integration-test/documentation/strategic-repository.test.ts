import { describe, it, expect, beforeAll } from "vitest";
import repository from "@/lib/strapi/documentation/strategic/strategic-repository";
import {
  toStrategicArticleListItemViewModel,
  toStrategicArticleDetailViewModel,
  getCategoryLabel,
} from "@/lib/strapi/documentation/strategic/strategic-view-models";

/**
 * Integration Tests for Strategic Documentation
 *
 * Tests the full data flow:
 * - Content Builder loads + validates JSON
 * - Repository provides correct queries
 * - View Models transform correctly
 *
 * Location: __tests__/integration-test/documentation/
 * Parallel to: __tests__/integration-test/content-library/
 */

describe("Strategic Documentation Integration Tests", () => {
  describe("End-to-End Data Flow", () => {
    it("should load articles from JSON at module init", async () => {
      const articles = await repository.listAll();
      expect(articles.length).toBeGreaterThanOrEqual(5);
    });

    it("should retrieve specific article by slug and transform to view model", async () => {
      // Test full flow: JSON → Content Builder → Repository → Article Object
      const article = await repository.getBySlug(
        "system-vision-and-principles",
      );
      expect(article).toBeDefined();

      // Transform to view model
      const vm = toStrategicArticleListItemViewModel(article!);
      expect(vm.slug).toBe("system-vision-and-principles");
      expect(vm.title).toBeDefined();
      expect(vm.readTime).toBeDefined();
    });

    it("should list articles and convert all to view models", async () => {
      const articles = await repository.listAll();
      const viewModels = articles.map(toStrategicArticleListItemViewModel);

      expect(viewModels.length).toBeGreaterThanOrEqual(5);
      expect(viewModels[0].slug).toBeDefined();
      expect(viewModels[0].readTime).toMatch(/min read|<1 min/);
    });

    it("should filter by category and maintain data integrity", async () => {
      const visionArticles = await repository.listByCategory("vision");

      for (const article of visionArticles) {
        expect(article.meta.category).toBe("vision");
        expect(article.meta.slug).toBeDefined();
        expect(article.blocks.length).toBeGreaterThan(0);
      }
    });

    it("should search articles and return relevant results", async () => {
      const results = await repository.search("architecture");
      expect(results.length).toBeGreaterThan(0);

      // Verify all results are valid articles
      for (const article of results) {
        expect(article.meta.slug).toBeDefined();
        expect(article.meta.title).toBeDefined();
      }
    });

    it("should generate static params for routes", async () => {
      const slugs = await repository.getAllSlugs();
      expect(slugs.length).toBeGreaterThanOrEqual(5);

      // Verify slugs match actual articles
      for (const slug of slugs) {
        const article = await repository.getBySlug(slug);
        expect(article).toBeDefined();
      }
    });
  });

  describe("Data Consistency Across Layers", () => {
    it("should maintain consistency: JSON → Content Builder → Repository", async () => {
      const articles = await repository.listAll();
      const allSlugs = await repository.getAllSlugs();

      // Every article should have a slug in the slug list
      for (const article of articles) {
        expect(allSlugs).toContain(article.meta.slug);
      }
    });

    it("should transform view models without losing data", async () => {
      const article = await repository.getBySlug(
        "6-layer-architecture-pattern",
      );
      const detailVm = toStrategicArticleDetailViewModel(article!);

      // Original data preserved
      expect(detailVm.meta).toEqual(article!.meta);
      expect(detailVm.blocks).toEqual(article!.blocks);

      // Computed properties added
      expect(detailVm.wordCount).toBeGreaterThan(0);
      expect(detailVm.readTime).toBeDefined();
      expect(detailVm.formattedDate).toBeDefined();
    });

    it("should handle filtering and transformation together", async () => {
      const intermediateArticles = await repository.listByLevel("intermediate");
      const viewModels = intermediateArticles.map(
        toStrategicArticleListItemViewModel,
      );

      for (const vm of viewModels) {
        expect(vm.level).toBe("intermediate");
        expect(vm.category).toBeDefined();
      }
    });
  });

  describe("SEO & Metadata Integration", () => {
    it("should provide complete SEO metadata for all articles", async () => {
      const articles = await repository.listAll();

      for (const article of articles) {
        // SEO metadata complete
        expect(article.seo.metaTitle).toBeTruthy();
        expect(article.seo.metaDescription).toBeTruthy();
        expect(article.seo.keywords).toBeTruthy();
        expect(article.seo.canonicalUrl).toContain("documentation");

        // Route info consistent
        expect(article.route.params.domain).toBe("strategic");
        expect(article.route.params.slug).toBe(article.meta.slug);
      }
    });

    it("should have access controls set correctly", async () => {
      const articles = await repository.listAll();

      for (const article of articles) {
        // All strategic articles should be public
        expect(article.access.visibleToPublic).toBe(true);
        expect(article.access.requiresAuth).toBe(false);
      }
    });
  });

  describe("Table of Contents Integrity", () => {
    it("should have valid TOC entries matching headings", async () => {
      const article = await repository.getBySlug(
        "rendering-strategies-ssg-ssr-isr-ppr",
      );

      // Should have TOC
      expect(article!.toc.length).toBeGreaterThan(0);

      // Check TOC structure
      for (const entry of article!.toc) {
        expect(entry.level).toBeGreaterThanOrEqual(1);
        expect(entry.level).toBeLessThanOrEqual(6);
        expect(entry.title).toBeTruthy();
        expect(entry.anchor).toBeTruthy();
      }
    });

    it("should have heading blocks with matching anchors", async () => {
      const article = await repository.getBySlug(
        "type-safety-first-contracts-validation",
      );

      const headingBlocks = article!.blocks.filter((b) => b.type === "heading");
      expect(headingBlocks.length).toBeGreaterThan(0);

      for (const heading of headingBlocks) {
        if (heading.type === "heading" && heading.anchorId) {
          // Should have corresponding TOC entry
          const tocEntry = article!.toc.find(
            (t) => t.anchor === heading.anchorId,
          );
          expect(tocEntry).toBeDefined();
        }
      }
    });
  });

  describe("Block Integrity", () => {
    it("should have valid blocks with required fields", async () => {
      const article = await repository.getBySlug(
        "system-vision-and-principles",
      );

      for (const block of article!.blocks) {
        // Every block must have a type
        expect(block).toHaveProperty("type");

        // Type-specific validations
        if (block.type === "text") {
          expect(block.content).toBeTruthy();
        } else if (block.type === "heading") {
          expect(block.level).toBeGreaterThanOrEqual(1);
          expect(block.content).toBeTruthy();
        } else if (block.type === "code") {
          expect(block.language).toBeTruthy();
          expect(block.content).toBeTruthy();
        } else if (block.type === "list") {
          expect(Array.isArray(block.items)).toBe(true);
          expect(block.items.length).toBeGreaterThan(0);
        }
      }
    });

    it("should have meaningful content in all blocks", async () => {
      const articles = await repository.listAll();

      for (const article of articles) {
        for (const block of article.blocks) {
          if (block.type === "text") {
            expect(block.content.length).toBeGreaterThan(1);
          } else if (block.type === "heading") {
            expect(block.content.length).toBeGreaterThan(1);
          }
        }
      }
    });
  });

  describe("Category Labeling", () => {
    it("should format category labels correctly", () => {
      expect(getCategoryLabel("vision")).toBe("Vision");
      expect(getCategoryLabel("patterns")).toBe("Patterns");
      expect(getCategoryLabel("roadmap")).toBe("Roadmap");
    });

    it("should label all articles with valid categories", async () => {
      const articles = await repository.listAll();

      for (const article of articles) {
        const label = getCategoryLabel(article.meta.category);
        expect(label.length).toBeGreaterThan(0);
      }
    });
  });

  describe("Query Performance & Accuracy", () => {
    it("should return accurate counts for filters", async () => {
      const all = await repository.listAll();
      const visions = await repository.listByCategory("vision");
      const beginners = await repository.listByLevel("beginner");

      // Filtered results should be less than or equal to total
      expect(visions.length).toBeLessThanOrEqual(all.length);
      expect(beginners.length).toBeLessThanOrEqual(all.length);
    });

    it("should not have duplicate articles in results", async () => {
      const all = await repository.listAll();
      const slugs = all.map((a) => a.meta.slug);

      expect(new Set(slugs).size).toBe(slugs.length);
    });

    it("should search accurately with case-insensitive matching", async () => {
      const upperResults = await repository.search("VISION");
      const lowerResults = await repository.search("vision");

      expect(upperResults.length).toBe(lowerResults.length);
    });
  });
});
