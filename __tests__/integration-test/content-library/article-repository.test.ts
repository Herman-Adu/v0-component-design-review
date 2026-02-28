import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockArticles, mockArticleContent } from "../../mocks/integration/content-library/article-data";

// Mock the content builder layer
vi.mock(
  "@/lib/strapi/dashboard/content-library/articles/article-content",
  () => ({
    getArticleList: vi.fn(() => mockArticles),
    getArticleContentDocument: vi.fn((slug: string) => {
      const article = mockArticles.find((a) => a.slug === slug);
      return article ? mockArticleContent : null;
    }),
  }),
);

import {
  listArticles,
  listArticleSlugs,
  getArticleRecordBySlug,
  getArticlesByCategory,
  getArticlesByLevel,
} from "@/lib/strapi/dashboard/content-library/articles/article-repository";

describe("Article Repository", () => {
  describe("listArticles", () => {
    it("returns an array of articles", () => {
      const articles = listArticles();
      expect(Array.isArray(articles)).toBe(true);
      expect(articles.length).toBe(3); // Known mock data count
    });

    it("returns articles with required fields", () => {
      const articles = listArticles();
      const article = articles[0];

      expect(article).toHaveProperty("id");
      expect(article).toHaveProperty("slug");
      expect(article).toHaveProperty("title");
      expect(article).toHaveProperty("excerpt");
      expect(article).toHaveProperty("level");
      expect(article).toHaveProperty("category");
      expect(article).toHaveProperty("readTime");
      expect(article).toHaveProperty("publishedAt");
      expect(article).toHaveProperty("tags");
    });

    it("returns articles with unique slugs", () => {
      const articles = listArticles();
      const slugs = articles.map((a) => a.slug);
      const uniqueSlugs = new Set(slugs);
      expect(uniqueSlugs.size).toBe(slugs.length);
    });
  });

  describe("listArticleSlugs", () => {
    it("returns array of slug strings", () => {
      const slugs = listArticleSlugs();
      expect(Array.isArray(slugs)).toBe(true);
      expect(slugs.length).toBe(3);
      expect(typeof slugs[0]).toBe("string");
    });

    it("slugs match articles list count", () => {
      const articles = listArticles();
      const slugs = listArticleSlugs();
      expect(slugs.length).toBe(articles.length);
    });
  });

  describe("getArticleRecordBySlug", () => {
    it("returns article record for valid slug", () => {
      const record = getArticleRecordBySlug("test-article-security");

      expect(record).not.toBeNull();
      expect(record?.article.slug).toBe("test-article-security");
      expect(record?.content).toBeDefined();
      expect(record?.content.blocks).toBeDefined();
    });

    it("returns null for non-existent slug", () => {
      const record = getArticleRecordBySlug("nonexistent-slug-123");
      expect(record).toBeNull();
    });

    it("content document has required structure", () => {
      const slugs = listArticleSlugs();
      const record = getArticleRecordBySlug(slugs[0]);

      expect(record).not.toBeNull();
      expect(record?.content.meta).toBeDefined();
      expect(record?.content.layout).toBeDefined();
      expect(record?.content.blocks).toBeDefined();
    });
  });

  describe("getArticlesByCategory", () => {
    it("filters articles by security category", () => {
      const filtered = getArticlesByCategory("security");

      expect(filtered.length).toBe(2); // Mock has 2 security articles
      expect(filtered.every((a) => a.category === "security")).toBe(true);
    });

    it("filters articles by performance category", () => {
      const filtered = getArticlesByCategory("performance");

      expect(filtered.length).toBe(1); // Mock has 1 performance article
      expect(filtered[0].slug).toBe("test-article-performance");
    });

    it("returns empty array for non-existent category", () => {
      const filtered = getArticlesByCategory("nonexistent" as any);
      expect(Array.isArray(filtered)).toBe(true);
      expect(filtered.length).toBe(0);
    });
  });

  describe("getArticlesByLevel", () => {
    it("filters articles by beginner level", () => {
      const filtered = getArticlesByLevel("beginner");

      expect(filtered.length).toBe(1); // Mock has 1 beginner article
      expect(filtered[0].level).toBe("beginner");
    });

    it("filters articles by intermediate level", () => {
      const filtered = getArticlesByLevel("intermediate");

      expect(filtered.length).toBe(1); // Mock has 1 intermediate article
      expect(filtered[0].slug).toBe("test-article-security");
    });

    it("filters articles by advanced level", () => {
      const filtered = getArticlesByLevel("advanced");

      expect(filtered.length).toBe(1); // Mock has 1 advanced article
      expect(filtered[0].level).toBe("advanced");
    });
  });

  describe("Content Validation - Behavior Tests", () => {
    it("all articles have valid ISO date format", () => {
      const articles = listArticles();
      articles.forEach((article) => {
        const date = new Date(article.publishedAt);
        expect(date.toString()).not.toBe("Invalid Date");
        expect(article.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });
    });

    it("all articles have non-empty excerpts", () => {
      const articles = listArticles();
      articles.forEach((article) => {
        expect(article.excerpt.length).toBeGreaterThan(0);
      });
    });

    it("all articles have at least one tag", () => {
      const articles = listArticles();
      articles.forEach((article) => {
        expect(Array.isArray(article.tags)).toBe(true);
        expect(article.tags.length).toBeGreaterThan(0);
      });
    });

    it("article content document has required structure", () => {
      const record = getArticleRecordBySlug("test-article-security");

      expect(record).not.toBeNull();
      expect(record?.content).toHaveProperty("blocks");
      expect(record?.content).toHaveProperty("toc");
      expect(record?.content).toHaveProperty("layout");
      expect(record?.content).toHaveProperty("meta");
    });
  });
});
