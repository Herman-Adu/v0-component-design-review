import { describe, it, expect, vi } from "vitest";
import { mockArticles, mockArticleContent } from "../../mocks/integration/content-library/article-data";

// Mock the content builder layer (async — mirrors real builder interface)
vi.mock(
  "@/lib/strapi/dashboard/content-library/articles/article-content-builder",
  () => ({
    getArticleList: vi.fn(() => Promise.resolve(mockArticles)),
    getArticleContentDocument: vi.fn((slug: string) =>
      Promise.resolve(
        mockArticles.find((a) => a.slug === slug) ? mockArticleContent : null,
      ),
    ),
    getAllArticleContentSlugs: vi.fn(() =>
      Promise.resolve(mockArticles.map((a) => a.slug)),
    ),
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
    it("returns an array of articles", async () => {
      const articles = await listArticles();
      expect(Array.isArray(articles)).toBe(true);
      expect(articles.length).toBe(3); // Known mock data count
    });

    it("returns articles with required fields", async () => {
      const articles = await listArticles();
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

    it("returns articles with unique slugs", async () => {
      const articles = await listArticles();
      const slugs = articles.map((a) => a.slug);
      const uniqueSlugs = new Set(slugs);
      expect(uniqueSlugs.size).toBe(slugs.length);
    });
  });

  describe("listArticleSlugs", () => {
    it("returns array of slug strings", async () => {
      const slugs = await listArticleSlugs();
      expect(Array.isArray(slugs)).toBe(true);
      expect(slugs.length).toBe(3);
      expect(typeof slugs[0]).toBe("string");
    });

    it("slugs match articles list count", async () => {
      const articles = await listArticles();
      const slugs = await listArticleSlugs();
      expect(slugs.length).toBe(articles.length);
    });
  });

  describe("getArticleRecordBySlug", () => {
    it("returns article record for valid slug", async () => {
      const record = await getArticleRecordBySlug("test-article-security");

      expect(record).not.toBeNull();
      expect(record?.article.slug).toBe("test-article-security");
      expect(record?.content).toBeDefined();
      expect(record?.content.blocks).toBeDefined();
    });

    it("returns null for non-existent slug", async () => {
      const record = await getArticleRecordBySlug("nonexistent-slug-123");
      expect(record).toBeNull();
    });

    it("content document has required structure", async () => {
      const slugs = await listArticleSlugs();
      const record = await getArticleRecordBySlug(slugs[0]);

      expect(record).not.toBeNull();
      expect(record?.content.meta).toBeDefined();
      expect(record?.content.layout).toBeDefined();
      expect(record?.content.blocks).toBeDefined();
    });
  });

  describe("getArticlesByCategory", () => {
    it("filters articles by security category", async () => {
      const filtered = await getArticlesByCategory("security");

      expect(filtered.length).toBe(2); // Mock has 2 security articles
      expect(filtered.every((a) => a.category === "security")).toBe(true);
    });

    it("filters articles by performance category", async () => {
      const filtered = await getArticlesByCategory("performance");

      expect(filtered.length).toBe(1); // Mock has 1 performance article
      expect(filtered[0].slug).toBe("test-article-performance");
    });

    it("returns empty array for non-existent category", async () => {
      const filtered = await getArticlesByCategory("nonexistent" as never);
      expect(Array.isArray(filtered)).toBe(true);
      expect(filtered.length).toBe(0);
    });
  });

  describe("getArticlesByLevel", () => {
    it("filters articles by beginner level", async () => {
      const filtered = await getArticlesByLevel("beginner");

      expect(filtered.length).toBe(1); // Mock has 1 beginner article
      expect(filtered[0].level).toBe("beginner");
    });

    it("filters articles by intermediate level", async () => {
      const filtered = await getArticlesByLevel("intermediate");

      expect(filtered.length).toBe(1); // Mock has 1 intermediate article
      expect(filtered[0].slug).toBe("test-article-security");
    });

    it("filters articles by advanced level", async () => {
      const filtered = await getArticlesByLevel("advanced");

      expect(filtered.length).toBe(1); // Mock has 1 advanced article
      expect(filtered[0].level).toBe("advanced");
    });
  });

  describe("Content Validation - Behavior Tests", () => {
    it("all articles have valid ISO date format", async () => {
      const articles = await listArticles();
      articles.forEach((article) => {
        const date = new Date(article.publishedAt);
        expect(date.toString()).not.toBe("Invalid Date");
        expect(article.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });
    });

    it("all articles have non-empty excerpts", async () => {
      const articles = await listArticles();
      articles.forEach((article) => {
        expect(article.excerpt.length).toBeGreaterThan(0);
      });
    });

    it("all articles have at least one tag", async () => {
      const articles = await listArticles();
      articles.forEach((article) => {
        expect(Array.isArray(article.tags)).toBe(true);
        expect(article.tags.length).toBeGreaterThan(0);
      });
    });

    it("article content document has required structure", async () => {
      const record = await getArticleRecordBySlug("test-article-security");

      expect(record).not.toBeNull();
      expect(record?.content).toHaveProperty("blocks");
      expect(record?.content).toHaveProperty("toc");
      expect(record?.content).toHaveProperty("layout");
      expect(record?.content).toHaveProperty("meta");
    });
  });
});
