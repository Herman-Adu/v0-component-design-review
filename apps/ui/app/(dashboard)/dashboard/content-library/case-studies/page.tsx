import Link from "next/link";
import { ArrowRight, TrendingUp, Calendar } from "lucide-react";
import { type CaseStudyCategory } from "@/lib/strapi/dashboard/content-library/case-studies/case-study-content";
import { listCaseStudies } from "@/lib/strapi/dashboard/content-library/case-studies/case-study-repository";
import { pageLogger } from "@/lib/utils/arch-logger";

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

export default async function CaseStudiesPage() {
  pageLogger.render("/dashboard/content-library/case-studies");

  const caseStudies = await listCaseStudies();
  pageLogger.dataFetch(
    "/dashboard/content-library/case-studies",
    "case-studies",
    caseStudies.length,
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
            <div
              key={cat}
              className={`border rounded-lg p-4 text-center ${getCategoryColor(cat).replace("text-", "border-").replace("/10", "/20")}`}
            >
              <p
                className={`text-2xl font-bold ${getCategoryColor(cat).split(" ")[1]}`}
              >
                {count}
              </p>
              <p className="text-sm text-muted-foreground capitalize">
                {cat === "cms" ? "CMS" : cat}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6">
        {caseStudies.map((caseStudy) => (
          <Link
            key={caseStudy.id}
            href={`/dashboard/content-library/case-studies/${caseStudy.category}/${caseStudy.slug}`}
            className="group bg-card border border-border rounded-lg p-6 hover:border-accent/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 text-xs font-medium rounded ${getCategoryColor(caseStudy.category)}`}
                  >
                    {caseStudy.category === "cms"
                      ? "CMS"
                      : caseStudy.category.charAt(0).toUpperCase() +
                        caseStudy.category.slice(1)}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <TrendingUp className="h-6 w-6 text-green-500 shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-accent transition-colors mb-2">
                      {caseStudy.title}
                    </h3>
                    <p className="text-sm text-muted-foreground text-pretty">
                      {caseStudy.excerpt}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {new Date(caseStudy.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors shrink-0 mt-2" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
