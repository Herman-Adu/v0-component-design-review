import { describe, it, expect, vi } from "vitest";
import {
  mockGuides,
  mockGuideContent,
} from "../../mocks/integration/content-library/guide-data";

// Mock the content builder layer (async — mirrors real builder interface)
vi.mock("@/lib/strapi/dashboard/content-library/guides/guide-content-builder", () => ({
  getGuideList: vi.fn(() => Promise.resolve(mockGuides)),
  getGuideContentDocument: vi.fn((slug: string) => {
    const guide = mockGuides.find((g) => g.slug === slug);
    return Promise.resolve(guide ? mockGuideContent : null);
  }),
  getAllGuideContentSlugs: vi.fn(() =>
    Promise.resolve(mockGuides.map((g) => g.slug)),
  ),
}));

import {
  listGuides,
  listGuideSlugs,
  getGuideRecordBySlug,
  getGuidesByCategory,
  getGuidesByLevel,
} from "@/lib/strapi/dashboard/content-library/guides/guide-repository";

describe("Guide Repository", () => {
  describe("listGuides", () => {
    it("returns an array of guides", async () => {
      const guides = await listGuides();
      expect(Array.isArray(guides)).toBe(true);
      expect(guides.length).toBe(3); // Known mock data count
    });

    it("returns guides with required fields", async () => {
      const guides = await listGuides();
      const guide = guides[0];

      expect(guide).toHaveProperty("id");
      expect(guide).toHaveProperty("slug");
      expect(guide).toHaveProperty("title");
      expect(guide).toHaveProperty("excerpt");
      expect(guide).toHaveProperty("level");
      expect(guide).toHaveProperty("category");
      expect(guide).toHaveProperty("readTime");
      expect(guide).toHaveProperty("publishedAt");
      expect(guide).toHaveProperty("tags");
    });

    it("returns guides with unique slugs", async () => {
      const guides = await listGuides();
      const slugs = guides.map((g) => g.slug);
      const uniqueSlugs = new Set(slugs);
      expect(uniqueSlugs.size).toBe(slugs.length);
    });
  });

  describe("listGuideSlugs", () => {
    it("returns array of slug strings", async () => {
      const slugs = await listGuideSlugs();
      expect(Array.isArray(slugs)).toBe(true);
      expect(slugs.length).toBe(3);
      expect(typeof slugs[0]).toBe("string");
    });

    it("slugs match guides list count", async () => {
      const guides = await listGuides();
      const slugs = await listGuideSlugs();
      expect(slugs.length).toBe(guides.length);
    });
  });

  describe("getGuideRecordBySlug", () => {
    it("returns guide record for valid slug", async () => {
      const record = await getGuideRecordBySlug("test-guide-security");

      expect(record).not.toBeNull();
      expect(record?.guide.slug).toBe("test-guide-security");
      expect(record?.content).toBeDefined();
      expect(record?.content.blocks).toBeDefined();
    });

    it("returns null for non-existent slug", async () => {
      const record = await getGuideRecordBySlug("nonexistent-slug-123");
      expect(record).toBeNull();
    });

    it("content document has required structure", async () => {
      const slugs = await listGuideSlugs();
      const record = await getGuideRecordBySlug(slugs[0]);

      expect(record).not.toBeNull();
      expect(record?.content.meta).toBeDefined();
      expect(record?.content.layout).toBeDefined();
      expect(record?.content.blocks).toBeDefined();
    });
  });

  describe("getGuidesByCategory", () => {
    it("filters guides by security category", async () => {
      const filtered = await getGuidesByCategory("security");

      expect(filtered.length).toBe(1); // Mock has 1 security guide
      expect(filtered.every((g) => g.category === "security")).toBe(true);
    });

    it("filters guides by devops category", async () => {
      const filtered = await getGuidesByCategory("devops");

      expect(filtered.length).toBe(1); // Mock has 1 devops guide
      expect(filtered[0].slug).toBe("test-guide-devops");
    });

    it("returns empty array for non-existent category", async () => {
      const filtered = await getGuidesByCategory("nonexistent" as never);
      expect(Array.isArray(filtered)).toBe(true);
      expect(filtered.length).toBe(0);
    });
  });

  describe("getGuidesByLevel", () => {
    it("filters guides by intermediate level", async () => {
      const filtered = await getGuidesByLevel("intermediate");

      expect(filtered.length).toBe(2); // Mock has 2 intermediate guides
      expect(filtered.every((g) => g.level === "intermediate")).toBe(true);
    });

    it("filters guides by advanced level", async () => {
      const filtered = await getGuidesByLevel("advanced");

      expect(filtered.length).toBe(1); // Mock has 1 advanced guide
      expect(filtered[0].level).toBe("advanced");
    });
  });

  describe("Content Validation - Behavior Tests", () => {
    it("all guides have valid ISO date format", async () => {
      const guides = await listGuides();
      guides.forEach((g) => {
        const date = new Date(g.publishedAt);
        expect(date.toString()).not.toBe("Invalid Date");
        expect(g.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });
    });

    it("all guides have non-empty excerpts", async () => {
      const guides = await listGuides();
      guides.forEach((g) => {
        expect(g.excerpt.length).toBeGreaterThan(0);
      });
    });

    it("all guides have at least one tag", async () => {
      const guides = await listGuides();
      guides.forEach((g) => {
        expect(Array.isArray(g.tags)).toBe(true);
        expect(g.tags.length).toBeGreaterThan(0);
      });
    });

    it("guide content document has required structure", async () => {
      const record = await getGuideRecordBySlug("test-guide-security");

      expect(record).not.toBeNull();
      expect(record?.content).toHaveProperty("blocks");
      expect(record?.content).toHaveProperty("toc");
      expect(record?.content).toHaveProperty("layout");
      expect(record?.content).toHaveProperty("meta");
    });
  });
});
