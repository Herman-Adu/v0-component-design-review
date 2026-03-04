import { describe, it, expect, vi } from "vitest";
import { BLOCK_TYPE_ALIASES } from "@/lib/strapi/dashboard/_shared/block-schema";
import {
  mockStrategicDocuments,
  mockStrategicDocument,
} from "../../mocks/integration/documentation/strategic-overview-data";

// Mock the content builder layer
vi.mock(
  "@/lib/strapi/dashboard/documentation/strategic-overview/strategic-overview-content-builder",
  () => ({
    getStrategicOverviewList: vi.fn(() => mockStrategicDocuments),
    getStrategicOverviewDocument: vi.fn((slug: string) => {
      return mockStrategicDocuments.find((d) => d.meta.slug === slug) ?? null;
    }),
    getAllStrategicOverviewSlugs: vi.fn(() =>
      mockStrategicDocuments.map((d) => d.meta.slug),
    ),
    getStrategicOverviewByAudience: vi.fn((audience: string) =>
      mockStrategicDocuments.filter((d) => d.meta.audience === audience),
    ),
  }),
);

import {
  listStrategicOverview,
  listStrategicOverviewSlugs,
  getStrategicOverviewRecordBySlug,
  listStrategicOverviewByAudience,
} from "@/lib/strapi/dashboard/documentation/strategic-overview/strategic-overview-repository";

describe("Strategic Overview Repository", () => {
  describe("listStrategicOverview", () => {
    it("returns an array of strategic overview documents", () => {
      const documents = listStrategicOverview();
      expect(Array.isArray(documents)).toBe(true);
      expect(documents.length).toBe(3); // Known mock data count
    });

    it("returns documents with required metadata fields", () => {
      const documents = listStrategicOverview();
      const doc = documents[0];

      expect(doc).toHaveProperty("meta");
      expect(doc.meta).toHaveProperty("slug");
      expect(doc.meta).toHaveProperty("title");
      expect(doc.meta).toHaveProperty("excerpt");
      expect(doc.meta).toHaveProperty("category");
      expect(doc.meta).toHaveProperty("audience");
      expect(doc.meta).toHaveProperty("publishedAt");
      expect(doc.meta).toHaveProperty("lastUpdated");
      expect(doc.meta).toHaveProperty("tags");
    });

    it("returns documents with blocks array", () => {
      const documents = listStrategicOverview();
      const doc = documents[0];

      expect(doc).toHaveProperty("blocks");
      expect(Array.isArray(doc.blocks)).toBe(true);
      expect(doc.blocks.length).toBeGreaterThan(0);
    });

    it("returns documents with unique slugs", () => {
      const documents = listStrategicOverview();
      const slugs = documents.map((d) => d.meta.slug);
      const uniqueSlugs = new Set(slugs);
      expect(uniqueSlugs.size).toBe(slugs.length);
    });
  });

  describe("listStrategicOverviewSlugs", () => {
    it("returns array of slug strings", () => {
      const slugs = listStrategicOverviewSlugs();
      expect(Array.isArray(slugs)).toBe(true);
      expect(slugs.length).toBe(3);
      expect(typeof slugs[0]).toBe("string");
    });

    it("slugs match documents list count", () => {
      const documents = listStrategicOverview();
      const slugs = listStrategicOverviewSlugs();
      expect(slugs.length).toBe(documents.length);
    });
  });

  describe("getStrategicOverviewRecordBySlug", () => {
    it("returns document record for valid slug", () => {
      const record = getStrategicOverviewRecordBySlug("system-vision");

      expect(record).not.toBeNull();
      expect(record?.document.meta.slug).toBe("system-vision");
      expect(record?.content).toBeDefined();
      expect(record?.content.blocks).toBeDefined();
    });

    it("returns null for non-existent slug", () => {
      const record = getStrategicOverviewRecordBySlug("nonexistent-slug-123");
      expect(record).toBeNull();
    });

    it("content document has required structure", () => {
      const slugs = listStrategicOverviewSlugs();
      const record = getStrategicOverviewRecordBySlug(slugs[0]);

      expect(record).not.toBeNull();
      expect(record?.content.meta).toBeDefined();
      expect(record?.content.blocks).toBeDefined();
      expect(record?.content.meta.category).toBe("strategic-overview");
    });

    it("blocks have correct structure with type discriminator", () => {
      const record = getStrategicOverviewRecordBySlug("system-vision");
      expect(record).not.toBeNull();

      const blocks = record!.content.blocks;
      expect(blocks.length).toBeGreaterThan(0);

      // Each block must have a type field
      blocks.forEach((block) => {
        expect(block).toHaveProperty("type");
        expect(typeof block.type).toBe("string");
        expect(BLOCK_TYPE_ALIASES as readonly string[]).toContain(block.type); // All blocks use registered type
      });
    });
  });

  describe("listStrategicOverviewByAudience", () => {
    it("filters documents by CTO audience", () => {
      const filtered = listStrategicOverviewByAudience("CTO / Project Lead");

      expect(filtered.length).toBeGreaterThan(0);
      expect(
        filtered.every((d) => d.meta.audience === "CTO / Project Lead"),
      ).toBe(true);
    });

    it("filters documents by Developer audience", () => {
      const filtered = listStrategicOverviewByAudience("Developer / Architect");

      expect(filtered.length).toBeGreaterThan(0);
      expect(
        filtered.every((d) => d.meta.audience === "Developer / Architect"),
      ).toBe(true);
    });

    it("returns empty array for non-existent audience", () => {
      const filtered = listStrategicOverviewByAudience("NonExistent Audience");
      expect(Array.isArray(filtered)).toBe(true);
      expect(filtered.length).toBe(0);
    });
  });

  describe("Content Validation - Behavior Tests", () => {
    it("all documents have valid ISO date format", () => {
      const documents = listStrategicOverview();
      documents.forEach((doc) => {
        expect(() => new Date(doc.meta.publishedAt)).not.toThrow();
        expect(() => new Date(doc.meta.lastUpdated)).not.toThrow();
        expect(new Date(doc.meta.publishedAt).toString()).not.toBe(
          "Invalid Date",
        );
        expect(new Date(doc.meta.lastUpdated).toString()).not.toBe(
          "Invalid Date",
        );
      });
    });

    it("all documents have non-empty excerpts", () => {
      const documents = listStrategicOverview();
      documents.forEach((doc) => {
        expect(doc.meta.excerpt.length).toBeGreaterThan(20);
      });
    });

    it("all documents have at least one tag", () => {
      const documents = listStrategicOverview();
      documents.forEach((doc) => {
        expect(Array.isArray(doc.meta.tags)).toBe(true);
        expect(doc.meta.tags.length).toBeGreaterThan(0);
      });
    });

    it("all documents have category set to strategic-overview", () => {
      const documents = listStrategicOverview();
      documents.forEach((doc) => {
        expect(doc.meta.category).toBe("strategic-overview");
      });
    });

    it("document blocks are non-empty and valid", () => {
      const documents = listStrategicOverview();
      documents.forEach((doc) => {
        expect(doc.blocks.length).toBeGreaterThan(0);
        doc.blocks.forEach((block) => {
          expect(block).toHaveProperty("type");
          expect(BLOCK_TYPE_ALIASES as readonly string[]).toContain(block.type);
        });
      });
    });

    it("SEO metadata is present and valid", () => {
      const documents = listStrategicOverview();
      documents.forEach((doc) => {
        if (doc.seo) {
          // If SEO exists, validate structure
          expect(doc.seo).toHaveProperty("metaTitle");
          if (doc.seo.metaTitle) {
            expect(doc.seo.metaTitle.length).toBeGreaterThan(5);
          }
        }
      });
    });
  });

  describe("TOC (Table of Contents) Validation", () => {
    it("documents with TOC have valid structure", () => {
      const documents = listStrategicOverview();
      documents.forEach((doc) => {
        if (doc.toc) {
          expect(Array.isArray(doc.toc)).toBe(true);
          doc.toc.forEach((item) => {
            expect(item).toHaveProperty("id");
            expect(item).toHaveProperty("title");
            expect(item).toHaveProperty("level");
            expect(item.level).toBeGreaterThanOrEqual(1);
            expect(item.level).toBeLessThanOrEqual(6);
          });
        }
      });
    });
  });
});
