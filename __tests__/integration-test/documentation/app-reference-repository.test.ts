import { describe, it, expect, vi } from "vitest";
import { BLOCK_TYPE_ALIASES } from "@/lib/strapi/dashboard/_shared/block-schema";
import {
  mockAppReferenceDocuments,
  mockAppReferenceDocument,
} from "../../mocks/integration/documentation/app-reference-data";

// Mock the content builder layer
vi.mock(
  "@/lib/strapi/dashboard/documentation/app-reference/app-reference-content-builder",
  () => ({
    getAppReferenceList: vi.fn(() => mockAppReferenceDocuments),
    getAppReferenceDocument: vi.fn((slug: string) => {
      return (
        mockAppReferenceDocuments.find((d) => d.meta.slug === slug) ?? null
      );
    }),
    getAllAppReferenceSlugs: vi.fn(() =>
      mockAppReferenceDocuments.map((d) => d.meta.slug),
    ),
    getAppReferenceByAudience: vi.fn((audience: string) =>
      mockAppReferenceDocuments.filter((d) => d.meta.audience === audience),
    ),
  }),
);

import {
  listAppReference,
  listAppReferenceSlugs,
  getAppReferenceRecordBySlug,
  listAppReferenceByAudience,
} from "@/lib/strapi/dashboard/documentation/app-reference/app-reference-repository";

describe("App Reference Repository", () => {
  describe("listAppReference", () => {
    it("returns an array of app reference documents", () => {
      const documents = listAppReference();
      expect(Array.isArray(documents)).toBe(true);
      expect(documents.length).toBe(3); // Known mock data count
    });

    it("returns documents with required metadata fields", () => {
      const documents = listAppReference();
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
      const documents = listAppReference();
      const doc = documents[0];

      expect(doc).toHaveProperty("blocks");
      expect(Array.isArray(doc.blocks)).toBe(true);
      expect(doc.blocks.length).toBeGreaterThan(0);
    });

    it("returns documents with unique slugs", () => {
      const documents = listAppReference();
      const slugs = documents.map((d) => d.meta.slug);
      const uniqueSlugs = new Set(slugs);
      expect(uniqueSlugs.size).toBe(slugs.length);
    });
  });

  describe("listAppReferenceSlugs", () => {
    it("returns array of slug strings", () => {
      const slugs = listAppReferenceSlugs();
      expect(Array.isArray(slugs)).toBe(true);
      expect(slugs.length).toBe(3);
      expect(typeof slugs[0]).toBe("string");
    });

    it("slugs match documents list count", () => {
      const documents = listAppReference();
      const slugs = listAppReferenceSlugs();
      expect(slugs.length).toBe(documents.length);
    });
  });

  describe("getAppReferenceRecordBySlug", () => {
    it("returns document record for valid slug", () => {
      const record = getAppReferenceRecordBySlug("component-architecture");

      expect(record).not.toBeNull();
      expect(record?.document.meta.slug).toBe("component-architecture");
      expect(record?.content).toBeDefined();
      expect(record?.content.blocks).toBeDefined();
    });

    it("returns null for non-existent slug", () => {
      const record = getAppReferenceRecordBySlug("nonexistent-slug-123");
      expect(record).toBeNull();
    });

    it("content document has required structure", () => {
      const slugs = listAppReferenceSlugs();
      const record = getAppReferenceRecordBySlug(slugs[0]);

      expect(record).not.toBeNull();
      expect(record?.content.meta).toBeDefined();
      expect(record?.content.blocks).toBeDefined();
      expect(record?.content.meta.category).toBe("app-reference");
    });

    it("blocks have correct structure with type discriminator", () => {
      const record = getAppReferenceRecordBySlug("component-architecture");
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

  describe("listAppReferenceByAudience", () => {
    it("filters documents by Frontend Developer audience", () => {
      const filtered = listAppReferenceByAudience("Frontend Developer");

      expect(filtered.length).toBeGreaterThan(0);
      expect(
        filtered.every((d) => d.meta.audience === "Frontend Developer"),
      ).toBe(true);
    });

    it("returns empty array for non-existent audience", () => {
      const filtered = listAppReferenceByAudience("NonExistent Audience");
      expect(Array.isArray(filtered)).toBe(true);
      expect(filtered.length).toBe(0);
    });
  });

  describe("Content Validation - Behavior Tests", () => {
    it("all documents have valid ISO date format", () => {
      const documents = listAppReference();
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
      const documents = listAppReference();
      documents.forEach((doc) => {
        expect(doc.meta.excerpt.length).toBeGreaterThan(20);
      });
    });

    it("all documents have at least one tag", () => {
      const documents = listAppReference();
      documents.forEach((doc) => {
        expect(Array.isArray(doc.meta.tags)).toBe(true);
        expect(doc.meta.tags.length).toBeGreaterThan(0);
      });
    });

    it("all documents have category set to app-reference", () => {
      const documents = listAppReference();
      documents.forEach((doc) => {
        expect(doc.meta.category).toBe("app-reference");
      });
    });

    it("document blocks are non-empty and valid", () => {
      const documents = listAppReference();
      documents.forEach((doc) => {
        expect(doc.blocks.length).toBeGreaterThan(0);
        doc.blocks.forEach((block) => {
          expect(block).toHaveProperty("type");
          expect(BLOCK_TYPE_ALIASES as readonly string[]).toContain(block.type);
        });
      });
    });

    it("SEO metadata is present and valid", () => {
      const documents = listAppReference();
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
      const documents = listAppReference();
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
