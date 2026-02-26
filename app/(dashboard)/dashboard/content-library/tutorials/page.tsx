"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, ArrowRight, Filter, BookOpen } from "lucide-react";
import {
  tutorials,
  type TutorialLevel,
  type TutorialCategory,
} from "@/data/content-library/tutorials";
import tutorialsListData from "@/data/strapi-mock/dashboard/content-library/tutorials-list.json";
import type { TutorialsListContent } from "@/types/dashboard";

// Type the imported JSON
const typedTutorialsListData = tutorialsListData as TutorialsListContent;

function getLevelColor(level: TutorialLevel) {
  switch (level) {
    case "beginner":
      return "bg-green-500/10 text-green-500 border-green-500/20";
    case "intermediate":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    case "advanced":
      return "bg-red-500/10 text-red-500 border-red-500/20";
  }
}

function getCategoryColor(category: TutorialCategory) {
  switch (category) {
    case "components":
      return "bg-blue-500/10 text-blue-500";
    case "forms":
      return "bg-purple-500/10 text-purple-500";
    case "security":
      return "bg-red-500/10 text-red-500";
    case "state-management":
      return "bg-green-500/10 text-green-500";
    case "performance":
      return "bg-accent/10 text-accent";
    case "getting-started":
      return "bg-teal-500/10 text-teal-500";
    case "cms":
      return "bg-emerald-500/10 text-emerald-500";
    case "testing":
      return "bg-orange-500/10 text-orange-500";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export default function TutorialsPage() {
  const [levelFilter, setLevelFilter] = useState<TutorialLevel | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<
    TutorialCategory | "all"
  >("all");

  const filteredTutorials = tutorials.filter((tutorial) => {
    const levelMatch = levelFilter === "all" || tutorial.level === levelFilter;
    const categoryMatch =
      categoryFilter === "all" || tutorial.category === categoryFilter;
    return levelMatch && categoryMatch;
  });

  const beginnerTutorials = filteredTutorials.filter(
    (t) => t.level === "beginner",
  );
  const intermediateTutorials = filteredTutorials.filter(
    (t) => t.level === "intermediate",
  );
  const advancedTutorials = filteredTutorials.filter(
    (t) => t.level === "advanced",
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-4">Tutorials</h1>
        <p className="text-lg text-muted-foreground text-balance">
          Hands-on, step-by-step guides covering Next.js, Strapi CMS, testing,
          and integrations. Each tutorial includes challenges with hidden
          solutions to test your understanding. Progress from beginner to
          advanced at your own pace.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-green-500">
            {tutorials.filter((t) => t.level === "beginner").length}
          </p>
          <p className="text-sm text-muted-foreground">Beginner</p>
        </div>
        <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-yellow-500">
            {tutorials.filter((t) => t.level === "intermediate").length}
          </p>
          <p className="text-sm text-muted-foreground">Intermediate</p>
        </div>
        <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-red-500">
            {tutorials.filter((t) => t.level === "advanced").length}
          </p>
          <p className="text-sm text-muted-foreground">Advanced</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 p-4 bg-card/50 border border-border rounded-lg">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">Level:</span>
          {(["all", "beginner", "intermediate", "advanced"] as const).map(
            (level) => (
              <button
                key={level}
                onClick={() => setLevelFilter(level)}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                  levelFilter === level
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {level === "all"
                  ? "All"
                  : level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ),
          )}
        </div>
        <div className="h-4 w-px bg-border hidden sm:block" />
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">Category:</span>
          {(
            [
              "all",
              "getting-started",
              "components",
              "forms",
              "security",
              "state-management",
              "performance",
              "cms",
              "testing",
            ] as const
          ).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                categoryFilter === cat
                  ? "bg-accent text-accent-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat === "all"
                ? "All"
                : cat
                    .replace("-", " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      {beginnerTutorials.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500" />
            Beginner Tutorials
          </h2>
          <p className="text-muted-foreground">
            Start here to learn the fundamentals step by step.
          </p>
          <div className="grid gap-4">
            {beginnerTutorials.map((tutorial) => (
              <Link
                key={tutorial.id}
                href={`/dashboard/content-library/tutorials/${tutorial.slug}`}
                className="group bg-card border border-border rounded-lg p-6 hover:border-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded ${getCategoryColor(tutorial.category)}`}
                      >
                        {tutorial.category.replace("-", " ")}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
                      {tutorial.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {tutorial.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {tutorial.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        {tutorial.steps.length} steps
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {intermediateTutorials.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            Intermediate Tutorials
          </h2>
          <p className="text-muted-foreground">
            Build on your foundations with more complex patterns.
          </p>
          <div className="grid gap-4">
            {intermediateTutorials.map((tutorial) => (
              <Link
                key={tutorial.id}
                href={`/dashboard/content-library/tutorials/${tutorial.slug}`}
                className="group bg-card border border-border rounded-lg p-6 hover:border-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded ${getCategoryColor(tutorial.category)}`}
                      >
                        {tutorial.category.replace("-", " ")}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
                      {tutorial.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {tutorial.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {tutorial.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        {tutorial.steps.length} steps
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {advancedTutorials.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            Advanced Tutorials
          </h2>
          <p className="text-muted-foreground">
            Master complex patterns used in production applications.
          </p>
          <div className="grid gap-4">
            {advancedTutorials.map((tutorial) => (
              <Link
                key={tutorial.id}
                href={`/dashboard/content-library/tutorials/${tutorial.slug}`}
                className="group bg-card border border-border rounded-lg p-6 hover:border-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded ${getCategoryColor(tutorial.category)}`}
                      >
                        {tutorial.category.replace("-", " ")}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
                      {tutorial.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {tutorial.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {tutorial.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        {tutorial.steps.length} steps
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {filteredTutorials.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No tutorials match your filters.
          </p>
        </div>
      )}
    </div>
  );
}
