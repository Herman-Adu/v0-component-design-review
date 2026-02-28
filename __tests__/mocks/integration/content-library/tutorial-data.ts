import type {
  Tutorial,
  TutorialContentDocument,
} from "@/lib/strapi/dashboard/content-library/tutorials/tutorial-content-builder";

export const mockTutorials: Tutorial[] = [
  {
    id: "1",
    slug: "test-tutorial-getting-started",
    title: "Getting Started Guide",
    excerpt:
      "Begin your journey with our comprehensive getting started tutorial.",
    category: "getting-started",
    level: "beginner",
    readTime: "5 min",
    publishedAt: "2024-03-01",
    tags: ["tutorial", "getting-started", "beginner"],
    blocks: [],
  },
  {
    id: "2",
    slug: "test-tutorial-forms",
    title: "Building Forms Tutorial",
    excerpt: "Master form creation and validation in modern applications.",
    category: "forms",
    level: "intermediate",
    readTime: "9 min",
    publishedAt: "2024-03-05",
    tags: ["tutorial", "forms", "validation"],
    blocks: [],
  },
  {
    id: "3",
    slug: "test-tutorial-testing",
    title: "Testing Strategies",
    excerpt: "Advanced testing strategies and best practices.",
    category: "testing",
    level: "advanced",
    readTime: "11 min",
    publishedAt: "2024-03-10",
    tags: ["tutorial", "testing", "strategies"],
    blocks: [],
  },
];

export const mockTutorialContent: TutorialContentDocument = {
  meta: {
    slug: "test-tutorial-getting-started",
    title: "Getting Started Guide",
    excerpt:
      "Begin your journey with our comprehensive getting started tutorial.",
    level: "beginner",
    category: "getting-started",
    readTime: "5 min",
    publishedAt: "2024-03-01",
    tags: ["tutorial", "getting-started", "beginner"],
  },
  layout: "content-with-toc",
  toc: [
    { id: "setup", title: "Setup", level: 1 },
    { id: "basics", title: "Basics", level: 2 },
    { id: "advanced", title: "Advanced", level: 2 },
  ],
  blocks: [
    {
      type: "molecule.sectionHeader",
      atomicLevel: "molecule",
      props: {
        number: "01",
        title: "Setup",
        id: "setup",
      },
    },
    {
      type: "atom.paragraph",
      atomicLevel: "atom",
      props: {
        text: "Setup instructions",
      },
    },
    {
      type: "molecule.sectionHeader",
      atomicLevel: "molecule",
      props: {
        number: "02",
        title: "Basics",
        id: "basics",
      },
    },
    {
      type: "atom.paragraph",
      atomicLevel: "atom",
      props: {
        text: "Basic concepts",
      },
    },
    {
      type: "molecule.sectionHeader",
      atomicLevel: "molecule",
      props: {
        number: "03",
        title: "Advanced",
        id: "advanced",
      },
    },
    {
      type: "atom.paragraph",
      atomicLevel: "atom",
      props: {
        text: "Advanced topics",
      },
    },
  ],
};
