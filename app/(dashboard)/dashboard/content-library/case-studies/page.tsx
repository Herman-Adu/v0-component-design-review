"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Filter, TrendingUp } from "lucide-react";
import {
  caseStudies,
  type CaseStudyCategory,
} from "@/data/content-library/case-studies";
import caseStudiesListData from "@/data/strapi-mock/dashboard/case-studies-list.json";
import type { CaseStudiesListContent } from "@/types/dashboard";

// Type the imported JSON
const typedCaseStudiesListData = caseStudiesListData as CaseStudiesListContent;

function getCategoryColor(category: CaseStudyCategory) {
  switch (category) {
    case "refactoring":
      return "bg-blue-500/10 text-blue-500";
    case "performance":
      return "bg-green-500/10 text-green-500";
    case "security":
      return "bg-red-500/10 text-red-500";
    case "architecture":
      return "bg-purple-500/10 text-purple-500";
    case "business":
      return "bg-emerald-500/10 text-emerald-500";
    case "cms":
      return "bg-orange-500/10 text-orange-500";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export default function CaseStudiesPage() {
  const [categoryFilter, setCategoryFilter] = useState<
    CaseStudyCategory | "all"
  >("all");

  const filteredCaseStudies = caseStudies.filter(
    (cs) => categoryFilter === "all" || cs.category === categoryFilter,
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Case Studies
        </h1>
        <p className="text-lg text-muted-foreground text-balance">
          Real-world before-and-after transformations with measurable results.
          Each case study includes the problem context, solution approach,
          implementation details, and quantified outcomes.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {(
          [
            "performance",
            "security",
            "architecture",
            "refactoring",
            "business",
            "cms",
          ] as const
        ).map((cat) => {
          const count = caseStudies.filter((cs) => cs.category === cat).length;
          if (count === 0) return null;
          return (
            <button
              key={cat}
              onClick={() =>
                setCategoryFilter(categoryFilter === cat ? "all" : cat)
              }
              className={`border rounded-lg p-4 text-center transition-colors ${
                categoryFilter === cat ? "ring-2 ring-accent" : ""
              } ${getCategoryColor(cat).replace("text-", "border-").replace("/10", "/20")}`}
            >
              <p
                className={`text-2xl font-bold ${getCategoryColor(cat).split(" ")[1]}`}
              >
                {count}
              </p>
              <p className="text-sm text-muted-foreground capitalize">
                {cat === "cms" ? "CMS" : cat}
              </p>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-4 p-4 bg-card/50 border border-border rounded-lg">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">Category:</span>
          {(
            [
              "all",
              "performance",
              "security",
              "architecture",
              "refactoring",
              "business",
              "cms",
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
                : cat === "cms"
                  ? "CMS"
                  : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6">
        {filteredCaseStudies.map((caseStudy) => (
          <Link
            key={caseStudy.id}
            href={`/dashboard/content-library/case-studies/${caseStudy.slug}`}
            className="group bg-card border border-border rounded-lg overflow-hidden hover:border-accent/50 transition-colors"
          >
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <span
                    className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${getCategoryColor(caseStudy.category)}`}
                  >
                    {caseStudy.category}
                  </span>
                  <h3 className="text-xl font-semibold text-foreground group-hover:text-accent transition-colors">
                    {caseStudy.title}
                  </h3>
                  <p className="text-muted-foreground">{caseStudy.subtitle}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors shrink-0 mt-1" />
              </div>

              <div className="flex flex-wrap gap-4">
                {caseStudy.results.metrics.slice(0, 3).map((metric, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-muted-foreground">
                      {metric.label}:
                    </span>
                    <span className="font-medium text-green-500">
                      {metric.improvement}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredCaseStudies.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No case studies match your filter.
          </p>
        </div>
      )}
    </div>
  );
}
