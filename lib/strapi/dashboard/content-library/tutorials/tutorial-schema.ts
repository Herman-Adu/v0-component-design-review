import { z } from "zod";

const TUTORIAL_LEVELS = ["beginner", "intermediate", "advanced"] as const;
const TUTORIAL_CATEGORIES = [
  "components",
  "forms",
  "security",
  "state-management",
  "performance",
  "getting-started",
  "cms",
  "testing",
  "devops",
  "email",
] as const;

const tutorialStepSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  code: z.string().optional(),
  hint: z.string().optional(),
  solution: z.string().optional(),
  explanation: z.string().optional(),
});

export const tutorialContentDocumentSchema = z.object({
  meta: z.object({
    slug: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
    level: z.enum(TUTORIAL_LEVELS),
    category: z.enum(TUTORIAL_CATEGORIES),
    duration: z.string().min(1),
    publishedAt: z.string().min(1),
    tags: z.array(z.string()).min(1),
    prerequisites: z.array(z.string()).min(1),
    learningOutcomes: z.array(z.string()).min(1),
  }),
  steps: z.array(tutorialStepSchema).min(1),
});
