import { describe, it, expect, vi } from "vitest";
import { mockTutorials, mockTutorialContent } from "../../mocks/integration/content-library/tutorial-data";

// Mock the content builder layer
vi.mock(
  "@/lib/strapi/dashboard/content-library/tutorials/tutorial-content-builder",
  () => ({
    getTutorialList: vi.fn(() => mockTutorials),
    getTutorialContentDocument: vi.fn((slug: string) => {
      const tutorial = mockTutorials.find((t) => t.slug === slug);
      return tutorial ? mockTutorialContent : null;
    }),
  }),
);

import {
  listTutorials,
  listTutorialSlugs,
  getTutorialRecordBySlug,
  getTutorialsByCategory,
  getTutorialsByLevel,
} from "@/lib/strapi/dashboard/content-library/tutorials/tutorial-repository";

describe("Tutorial Repository", () => {
  describe("listTutorials", () => {
    it("returns an array of tutorials", () => {
      const tutorials = listTutorials();
      expect(Array.isArray(tutorials)).toBe(true);
      expect(tutorials.length).toBe(3); // Known mock data count
    });

    it("returns tutorials with required fields", () => {
      const tutorials = listTutorials();
      const tutorial = tutorials[0];

      expect(tutorial).toHaveProperty("id");
      expect(tutorial).toHaveProperty("slug");
      expect(tutorial).toHaveProperty("title");
      expect(tutorial).toHaveProperty("excerpt");
      expect(tutorial).toHaveProperty("level");
      expect(tutorial).toHaveProperty("category");
      expect(tutorial).toHaveProperty("readTime");
      expect(tutorial).toHaveProperty("publishedAt");
      expect(tutorial).toHaveProperty("tags");
    });

    it("returns tutorials with unique slugs", () => {
      const tutorials = listTutorials();
      const slugs = tutorials.map((t) => t.slug);
      const uniqueSlugs = new Set(slugs);
      expect(uniqueSlugs.size).toBe(slugs.length);
    });
  });

  describe("listTutorialSlugs", () => {
    it("returns array of slug strings", () => {
      const slugs = listTutorialSlugs();
      expect(Array.isArray(slugs)).toBe(true);
      expect(slugs.length).toBe(3);
      expect(typeof slugs[0]).toBe("string");
    });

    it("slugs match tutorials list count", () => {
      const tutorials = listTutorials();
      const slugs = listTutorialSlugs();
      expect(slugs.length).toBe(tutorials.length);
    });
  });

  describe("getTutorialRecordBySlug", () => {
    it("returns tutorial record for valid slug", () => {
      const record = getTutorialRecordBySlug("test-tutorial-getting-started");

      expect(record).not.toBeNull();
      expect(record?.tutorial.slug).toBe("test-tutorial-getting-started");
      expect(record?.content).toBeDefined();
      expect(record?.content.blocks).toBeDefined();
    });

    it("returns null for non-existent slug", () => {
      const record = getTutorialRecordBySlug("nonexistent-slug-123");
      expect(record).toBeNull();
    });

    it("content document has required structure", () => {
      const slugs = listTutorialSlugs();
      const record = getTutorialRecordBySlug(slugs[0]);

      expect(record).not.toBeNull();
      expect(record?.content.meta).toBeDefined();
      expect(record?.content.layout).toBeDefined();
      expect(record?.content.blocks).toBeDefined();
    });
  });

  describe("getTutorialsByCategory", () => {
    it("filters tutorials by getting-started category", () => {
      const filtered = getTutorialsByCategory("getting-started");

      expect(filtered.length).toBe(1); // Mock has 1 getting-started tutorial
      expect(filtered.every((t) => t.category === "getting-started")).toBe(true);
    });

    it("filters tutorials by forms category", () => {
      const filtered = getTutorialsByCategory("forms");

      expect(filtered.length).toBe(1); // Mock has 1 forms tutorial
      expect(filtered[0].slug).toBe("test-tutorial-forms");
    });

    it("returns empty array for non-existent category", () => {
      const filtered = getTutorialsByCategory("nonexistent" as never);
      expect(Array.isArray(filtered)).toBe(true);
      expect(filtered.length).toBe(0);
    });
  });

  describe("getTutorialsByLevel", () => {
    it("filters tutorials by beginner level", () => {
      const filtered = getTutorialsByLevel("beginner");

      expect(filtered.length).toBe(1); // Mock has 1 beginner tutorial
      expect(filtered[0].level).toBe("beginner");
    });

    it("filters tutorials by intermediate level", () => {
      const filtered = getTutorialsByLevel("intermediate");

      expect(filtered.length).toBe(1); // Mock has 1 intermediate tutorial
      expect(filtered[0].slug).toBe("test-tutorial-forms");
    });

    it("filters tutorials by advanced level", () => {
      const filtered = getTutorialsByLevel("advanced");

      expect(filtered.length).toBe(1); // Mock has 1 advanced tutorial
      expect(filtered[0].level).toBe("advanced");
    });
  });

  describe("Content Validation - Behavior Tests", () => {
    it("all tutorials have valid ISO date format", () => {
      const tutorials = listTutorials();
      tutorials.forEach((t) => {
        const date = new Date(t.publishedAt);
        expect(date.toString()).not.toBe("Invalid Date");
        expect(t.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });
    });

    it("all tutorials have non-empty excerpts", () => {
      const tutorials = listTutorials();
      tutorials.forEach((t) => {
        expect(t.excerpt.length).toBeGreaterThan(0);
      });
    });

    it("all tutorials have at least one tag", () => {
      const tutorials = listTutorials();
      tutorials.forEach((t) => {
        expect(Array.isArray(t.tags)).toBe(true);
        expect(t.tags.length).toBeGreaterThan(0);
      });
    });

    it("tutorial content document has required structure", () => {
      const record = getTutorialRecordBySlug("test-tutorial-getting-started");

      expect(record).not.toBeNull();
      expect(record?.content).toHaveProperty("blocks");
      expect(record?.content).toHaveProperty("toc");
      expect(record?.content).toHaveProperty("layout");
      expect(record?.content).toHaveProperty("meta");
    });
  });
});
