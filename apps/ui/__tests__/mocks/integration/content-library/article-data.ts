import type { Article } from "@/lib/strapi/dashboard/content-library/articles/article-content-builder";
import type { ArticleContentDocument } from "@/lib/strapi/dashboard/content-library/articles/article-schema";

export const mockArticles: Article[] = [
  {
    id: "1",
    slug: "test-article-security",
    title: "Security Best Practices",
    excerpt: "Learn essential security practices for web applications.",
    category: "security",
    level: "intermediate",
    readTime: "8 min",
    publishedAt: "2024-01-15",
    tags: ["security", "best-practices", "web"],
    blocks: [],
  },
  {
    id: "2",
    slug: "test-article-performance",
    title: "Performance Optimization Guide",
    excerpt: "Comprehensive guide to optimizing application performance.",
    category: "performance",
    level: "advanced",
    readTime: "12 min",
    publishedAt: "2024-01-20",
    tags: ["performance", "optimization", "tuning"],
    blocks: [],
  },
  {
    id: "3",
    slug: "test-article-security-2",
    title: "Advanced Security Techniques",
    excerpt: "Deep dive into advanced security techniques and patterns.",
    category: "security",
    level: "beginner",
    readTime: "6 min",
    publishedAt: "2024-01-25",
    tags: ["security", "advanced", "techniques"],
    blocks: [],
  },
];

export const mockArticleContent: ArticleContentDocument = {
  meta: {
    slug: "test-article-security",
    title: "Security Best Practices",
    excerpt: "Learn essential security practices for web applications.",
    level: "intermediate",
    category: "security",
    readTime: "8 min",
    publishedAt: "2024-01-15",
    tags: ["security", "best-practices", "web"],
  },
  layout: "content-with-toc",
  toc: [
    { id: "intro", title: "Introduction", level: 1 },
    { id: "section1", title: "Main Section", level: 2 },
  ],
  blocks: [
    {
      type: "atom.paragraph",
      atomicLevel: "atom",
      props: {
        text: "Introduction paragraph",
      },
    },
    {
      type: "molecule.sectionHeader",
      atomicLevel: "molecule",
      props: {
        number: "01",
        title: "Main Section",
        id: "section1",
      },
    },
    {
      type: "atom.paragraph",
      atomicLevel: "atom",
      props: {
        text: "Content for main section",
      },
    },
  ],
};
