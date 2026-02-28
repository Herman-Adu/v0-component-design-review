import { describe, it, expect, vi } from "vitest";
import {
  mockCaseStudies,
  mockCaseStudyContent,
} from "../../mocks/integration/content-library/case-study-data";

// Mock the content builder layer
vi.mock(
  "@/lib/strapi/dashboard/content-library/case-studies/case-study-content",
  () => ({
    getCaseStudyList: vi.fn(() => mockCaseStudies),
    getCaseStudyContentDocument: vi.fn((slug: string) => {
      const caseStudy = mockCaseStudies.find((cs) => cs.slug === slug);
      return caseStudy ? mockCaseStudyContent : null;
    }),
  }),
);

import {
  listCaseStudies,
  listCaseStudySlugs,
  getCaseStudyRecordBySlug,
  getCaseStudiesByCategory,
  getCaseStudiesByLevel,
} from "@/lib/strapi/dashboard/content-library/case-studies/case-study-repository";

describe("Case Study Repository", () => {
  describe("listCaseStudies", () => {
    it("returns an array of case studies", () => {
      const caseStudies = listCaseStudies();
      expect(Array.isArray(caseStudies)).toBe(true);
      expect(caseStudies.length).toBe(3); // Known mock data count
    });

    it("returns case studies with required fields", () => {
      const caseStudies = listCaseStudies();
      const caseStudy = caseStudies[0];

      expect(caseStudy).toHaveProperty("id");
      expect(caseStudy).toHaveProperty("slug");
      expect(caseStudy).toHaveProperty("title");
      expect(caseStudy).toHaveProperty("excerpt");
      expect(caseStudy).toHaveProperty("level");
      expect(caseStudy).toHaveProperty("category");
      expect(caseStudy).toHaveProperty("readTime");
      expect(caseStudy).toHaveProperty("publishedAt");
      expect(caseStudy).toHaveProperty("tags");
    });

    it("returns case studies with unique slugs", () => {
      const caseStudies = listCaseStudies();
      const slugs = caseStudies.map((cs) => cs.slug);
      const uniqueSlugs = new Set(slugs);
      expect(uniqueSlugs.size).toBe(slugs.length);
    });
  });

  describe("listCaseStudySlugs", () => {
    it("returns array of slug strings", () => {
      const slugs = listCaseStudySlugs();
      expect(Array.isArray(slugs)).toBe(true);
      expect(slugs.length).toBe(3);
      expect(typeof slugs[0]).toBe("string");
    });

    it("slugs match case studies list count", () => {
      const caseStudies = listCaseStudies();
      const slugs = listCaseStudySlugs();
      expect(slugs.length).toBe(caseStudies.length);
    });
  });

  describe("getCaseStudyRecordBySlug", () => {
    it("returns case study record for valid slug", () => {
      const record = getCaseStudyRecordBySlug("test-case-study-security");

      expect(record).not.toBeNull();
      expect(record?.caseStudy.slug).toBe("test-case-study-security");
      expect(record?.content).toBeDefined();
      expect(record?.content.blocks).toBeDefined();
    });

    it("returns null for non-existent slug", () => {
      const record = getCaseStudyRecordBySlug("nonexistent-slug-123");
      expect(record).toBeNull();
    });

    it("content document has required structure", () => {
      const slugs = listCaseStudySlugs();
      const record = getCaseStudyRecordBySlug(slugs[0]);

      expect(record).not.toBeNull();
      expect(record?.content.meta).toBeDefined();
      expect(record?.content.layout).toBeDefined();
      expect(record?.content.blocks).toBeDefined();
    });
  });

  describe("getCaseStudiesByCategory", () => {
    it("filters case studies by security category", () => {
      const filtered = getCaseStudiesByCategory("security");

      expect(filtered.length).toBe(1); // Mock has 1 security case study
      expect(filtered.every((cs) => cs.category === "security")).toBe(true);
    });

    it("filters case studies by performance category", () => {
      const filtered = getCaseStudiesByCategory("performance");

      expect(filtered.length).toBe(1); // Mock has 1 performance case study
      expect(filtered[0].slug).toBe("test-case-study-performance");
    });

    it("returns empty array for non-existent category", () => {
      const filtered = getCaseStudiesByCategory("nonexistent" as any);
      expect(Array.isArray(filtered)).toBe(true);
      expect(filtered.length).toBe(0);
    });
  });

  describe("getCaseStudiesByLevel", () => {
    it("filters case studies by beginner level", () => {
      const filtered = getCaseStudiesByLevel("beginner");

      expect(filtered.length).toBe(1); // Mock has 1 beginner case study
      expect(filtered[0].level).toBe("beginner");
    });

    it("filters case studies by intermediate level", () => {
      const filtered = getCaseStudiesByLevel("intermediate");

      expect(filtered.length).toBe(1); // Mock has 1 intermediate case study
      expect(filtered[0].slug).toBe("test-case-study-security");
    });

    it("filters case studies by advanced level", () => {
      const filtered = getCaseStudiesByLevel("advanced");

      expect(filtered.length).toBe(1); // Mock has 1 advanced case study
      expect(filtered[0].level).toBe("advanced");
    });
  });

  describe("Content Validation - Behavior Tests", () => {
    it("all case studies have valid ISO date format", () => {
      const caseStudies = listCaseStudies();
      caseStudies.forEach((cs) => {
        const date = new Date(cs.publishedAt);
        expect(date.toString()).not.toBe("Invalid Date");
        expect(cs.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });
    });

    it("all case studies have non-empty excerpts", () => {
      const caseStudies = listCaseStudies();
      caseStudies.forEach((cs) => {
        expect(cs.excerpt.length).toBeGreaterThan(0);
      });
    });

    it("all case studies have at least one tag", () => {
      const caseStudies = listCaseStudies();
      caseStudies.forEach((cs) => {
        expect(Array.isArray(cs.tags)).toBe(true);
        expect(cs.tags.length).toBeGreaterThan(0);
      });
    });

    it("case study content document has required structure", () => {
      const record = getCaseStudyRecordBySlug("test-case-study-security");

      expect(record).not.toBeNull();
      expect(record?.content).toHaveProperty("blocks");
      expect(record?.content).toHaveProperty("toc");
      expect(record?.content).toHaveProperty("layout");
      expect(record?.content).toHaveProperty("meta");
    });
  });
});
