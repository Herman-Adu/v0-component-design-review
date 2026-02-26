import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, Tag, Users, BookOpen } from "lucide-react";
import { guides, type Guide } from "@/data/content-library/guides";

function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}

export async function generateStaticParams() {
  return guides.map((g) => ({
    category: g.category,
    slug: g.slug,
  }));
}

function getLevelColor(level: Guide["level"]) {
  switch (level) {
    case "intermediate":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    case "advanced":
      return "bg-red-500/10 text-red-500 border-red-500/20";
  }
}

function getCategoryColor(category: Guide["category"]) {
  switch (category) {
    case "security":
      return "bg-red-500/10 text-red-500";
    case "devops":
      return "bg-blue-500/10 text-blue-500";
    case "testing":
      return "bg-orange-500/10 text-orange-500";
  }
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  return (
    <div className="space-y-8">
      {/* Back Link */}
      <Link
        href="/dashboard/content-library/guides"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Guides
      </Link>

      {/* Header */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full border ${getLevelColor(guide.level)}`}
          >
            {guide.level.charAt(0).toUpperCase() + guide.level.slice(1)}
          </span>
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(guide.category)}`}
          >
            {guide.category.charAt(0).toUpperCase() + guide.category.slice(1)}
          </span>
        </div>

        <h1 className="text-4xl font-bold text-foreground text-balance">
          {guide.title}
        </h1>
        <p className="text-xl text-muted-foreground text-pretty">
          {guide.description}
        </p>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {guide.duration}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Updated{" "}
            {new Date(guide.lastUpdated).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {guide.audience.join(", ")}
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            {guide.sections.length} sections
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {guide.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-muted rounded-md text-muted-foreground"
            >
              <Tag className="h-3 w-3" />
              {tag}
            </span>
          ))}
        </div>
      </header>

      {/* Prerequisites */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-accent" />
          Prerequisites
        </h3>
        <ul className="space-y-2">
          {guide.prerequisites.map((prereq, idx) => (
            <li
              key={idx}
              className="text-sm text-muted-foreground flex items-start gap-2"
            >
              <span className="text-muted-foreground">-</span>
              {prereq}
            </li>
          ))}
        </ul>
      </div>

      {/* Guide Sections */}
      <div className="border-t border-border pt-8 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Guide Sections</h2>
        {guide.sections.map((section, idx) => (
          <div
            key={section.id}
            className="bg-card border border-border rounded-lg p-6"
          >
            <h3 className="font-semibold text-foreground">
              {String(idx + 1).padStart(2, "0")}. {section.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              {section.summary}
            </p>
          </div>
        ))}
      </div>

      {/* Footer Navigation */}
      <footer className="border-t border-border pt-8">
        <Link
          href="/dashboard/content-library/guides"
          className="inline-flex items-center gap-2 text-accent hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          View all guides
        </Link>
      </footer>
    </div>
  );
}
