import { StrategicDocumentation } from "./strategic-schema";

/**
 * View Models for Strategic Documentation
 *
 * View Models transform domain articles into UI-specific shapes.
 * They add computed properties (formatted dates, read time, etc.)
 * and prepare data for presentation to React components.
 */

/**
 * Article List View Model
 * Used in list pages to show article previews
 */
export interface StrategicArticleListItemViewModel {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  readTime: string;
  formattedDate: string;
  tags: string[];
}

/**
 * Transform article to list view model
 */
export function toStrategicArticleListItemViewModel(
  article: StrategicDocumentation,
): StrategicArticleListItemViewModel {
  return {
    slug: article.meta.slug,
    title: article.meta.title,
    excerpt: article.meta.excerpt,
    category: article.meta.category,
    level: article.meta.level,
    readTime: computeReadTime(article),
    formattedDate: formatDate(new Date(article.meta.publishedAt)),
    tags: article.meta.tags || [],
  };
}

/**
 * Article Detail View Model
 * Used in detail pages to show full article content
 */
export interface StrategicArticleDetailViewModel extends StrategicDocumentation {
  readTime: string;
  formattedDate: string;
  wordCount: number;
  hasTableOfContents: boolean;
}

/**
 * Transform article to detail view model
 */
export function toStrategicArticleDetailViewModel(
  article: StrategicDocumentation,
): StrategicArticleDetailViewModel {
  const wordCount = computeWordCount(article);
  const readTime = computeReadTime(article);

  return {
    ...article,
    readTime,
    formattedDate: formatDate(new Date(article.meta.publishedAt)),
    wordCount,
    hasTableOfContents: article.toc.length > 0,
  };
}

/**
 * Compute read time in minutes
 * Based on average reading speed of 200 words per minute
 */
function computeReadTime(article: StrategicDocumentation): string {
  const wordCount = computeWordCount(article);
  const minutesPerWord = 200;
  const minutes = Math.ceil(wordCount / minutesPerWord);

  if (minutes < 1) return "<1 min read";
  if (minutes === 1) return "1 min read";
  return `${minutes} min read`;
}

/**
 * Count total words in article
 */
function computeWordCount(article: StrategicDocumentation): number {
  let totalWords = 0;

  // Count words in meta
  totalWords += countWords(article.meta.title);
  totalWords += countWords(article.meta.excerpt);

  // Count words in blocks
  for (const block of article.blocks) {
    if (block.type === "text") {
      totalWords += countWords(block.content);
    } else if (block.type === "heading") {
      totalWords += countWords(block.content);
    } else if (block.type === "code") {
      totalWords += countWords(block.content);
    } else if (block.type === "quote") {
      totalWords += countWords(block.content);
    } else if (block.type === "list") {
      for (const item of block.items) {
        if (typeof item === "string") {
          totalWords += countWords(item);
        } else {
          totalWords += countWords(item.title);
          if (item.description) {
            totalWords += countWords(item.description);
          }
        }
      }
    } else if (block.type === "callout" || block.type === "alert") {
      totalWords += countWords(block.title);
      totalWords += countWords(block.content);
    }
  }

  return totalWords;
}

/**
 * Count words in a string
 */
function countWords(text: string): number {
  return text.trim().split(/\s+/).length;
}

/**
 * Format date for display
 * Example: "February 28, 2026"
 */
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/**
 * Get category label (human-readable)
 */
export function getCategoryLabel(
  category: StrategicDocumentation["meta"]["category"],
): string {
  const labels: Record<string, string> = {
    vision: "Vision",
    decisions: "Decisions",
    patterns: "Patterns",
    roadmap: "Roadmap",
    phases: "Phases",
  };
  return labels[category] || category;
}

/**
 * Get level label with emoji
 */
export function getLevelLabel(
  level: StrategicDocumentation["meta"]["level"],
): string {
  const labels: Record<string, string> = {
    beginner: "🟢 Beginner",
    intermediate: "🟡 Intermediate",
    advanced: "🔴 Advanced",
  };
  return labels[level] || level;
}
