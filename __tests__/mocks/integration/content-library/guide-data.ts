import type { Guide } from "@/lib/strapi/dashboard/content-library/guides/guide-content-builder";
import type { GuideContentDocument } from "@/lib/strapi/dashboard/content-library/guides/guide-schema";

export const mockGuides: Guide[] = [
  {
    id: "1",
    slug: "test-guide-security",
    title: "Security Best Practices Guide",
    excerpt: "Complete guide to implementing security best practices.",
    category: "security",
    level: "intermediate",
    readTime: "9 min",
    publishedAt: "2024-04-01",
    tags: ["guide", "security", "practices"],
    blocks: [],
  },
  {
    id: "2",
    slug: "test-guide-devops",
    title: "DevOps Essentials",
    excerpt: "Essential DevOps practices and tools guide.",
    category: "devops",
    level: "intermediate",
    readTime: "10 min",
    publishedAt: "2024-04-05",
    tags: ["guide", "devops", "tools"],
    blocks: [],
  },
  {
    id: "3",
    slug: "test-guide-testing",
    title: "Testing Guide",
    excerpt: "Comprehensive testing strategy and implementation guide.",
    category: "testing",
    level: "advanced",
    readTime: "13 min",
    publishedAt: "2024-04-10",
    tags: ["guide", "testing", "strategy"],
    blocks: [],
  },
];

export const mockGuideContent: GuideContentDocument = {
  meta: {
    slug: "test-guide-security",
    title: "Security Best Practices Guide",
    excerpt: "Complete guide to implementing security best practices.",
    level: "intermediate",
    category: "security",
    readTime: "9 min",
    publishedAt: "2024-04-01",
    tags: ["guide", "security", "practices"],
  },
  layout: "content-with-toc",
  toc: [
    { id: "overview", title: "Overview", level: 1 },
    { id: "fundamentals", title: "Fundamentals", level: 2 },
    { id: "implementation", title: "Implementation", level: 2 },
    { id: "best-practices", title: "Best Practices", level: 2 },
  ],
  blocks: [
    {
      type: "molecule.sectionHeader",
      atomicLevel: "molecule",
      props: {
        number: "01",
        title: "Overview",
        id: "overview",
      },
    },
    {
      type: "atom.paragraph",
      atomicLevel: "atom",
      props: {
        text: "Overview content",
      },
    },
    {
      type: "molecule.sectionHeader",
      atomicLevel: "molecule",
      props: {
        number: "02",
        title: "Fundamentals",
        id: "fundamentals",
      },
    },
    {
      type: "atom.paragraph",
      atomicLevel: "atom",
      props: {
        text: "Fundamental concepts",
      },
    },
    {
      type: "molecule.sectionHeader",
      atomicLevel: "molecule",
      props: {
        number: "03",
        title: "Implementation",
        id: "implementation",
      },
    },
    {
      type: "atom.paragraph",
      atomicLevel: "atom",
      props: {
        text: "Implementation details",
      },
    },
    {
      type: "molecule.sectionHeader",
      atomicLevel: "molecule",
      props: {
        number: "04",
        title: "Best Practices",
        id: "best-practices",
      },
    },
    {
      type: "atom.paragraph",
      atomicLevel: "atom",
      props: {
        text: "Best practices and tips",
      },
    },
  ],
};
