import type {
  CaseStudy,
  CaseStudyContentDocument,
} from "@/lib/strapi/dashboard/content-library/case-studies/case-study-content-builder";

export const mockCaseStudies: CaseStudy[] = [
  {
    id: "1",
    slug: "test-case-study-security",
    title: "Security Audit Case Study",
    excerpt: "Real-world security audit and remediation case study.",
    category: "security",
    level: "intermediate",
    readTime: "10 min",
    publishedAt: "2024-02-01",
    tags: ["security", "case-study", "audit"],
    blocks: [],
  },
  {
    id: "2",
    slug: "test-case-study-performance",
    title: "Performance Improvement Case Study",
    excerpt: "How we improved performance by 300% in a real application.",
    category: "performance",
    level: "advanced",
    readTime: "14 min",
    publishedAt: "2024-02-05",
    tags: ["performance", "case-study", "optimization"],
    blocks: [],
  },
  {
    id: "3",
    slug: "test-case-study-architecture",
    title: "System Architecture Redesign",
    excerpt: "Complete architecture redesign for scalability.",
    category: "architecture",
    level: "beginner",
    readTime: "7 min",
    publishedAt: "2024-02-10",
    tags: ["architecture", "case-study", "design"],
    blocks: [],
  },
];

export const mockCaseStudyContent: CaseStudyContentDocument = {
  meta: {
    slug: "test-case-study-security",
    title: "Security Audit Case Study",
    excerpt: "Real-world security audit and remediation case study.",
    level: "intermediate",
    category: "security",
    readTime: "10 min",
    publishedAt: "2024-02-01",
    tags: ["security", "case-study", "audit"],
  },
  layout: "content-with-toc",
  toc: [
    { id: "problem", title: "The Problem", level: 1 },
    { id: "solution", title: "Our Solution", level: 2 },
    { id: "results", title: "Results", level: 2 },
  ],
  blocks: [
    {
      type: "atom.paragraph",
      atomicLevel: "atom",
      props: {
        text: "Problem statement and context",
      },
    },
    {
      type: "molecule.sectionHeader",
      atomicLevel: "molecule",
      props: {
        number: "01",
        title: "Our Solution",
        id: "solution",
      },
    },
    {
      type: "atom.paragraph",
      atomicLevel: "atom",
      props: {
        text: "Solution details and implementation",
      },
    },
    {
      type: "molecule.sectionHeader",
      atomicLevel: "molecule",
      props: {
        number: "02",
        title: "Results",
        id: "results",
      },
    },
    {
      type: "atom.paragraph",
      atomicLevel: "atom",
      props: {
        text: "Measurable results and outcomes",
      },
    },
  ],
};
