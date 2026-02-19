"use client"

import Link from "next/link"
import { Clock, ArrowRight, Shield, Rocket, TestTube, BookOpen, Users } from "lucide-react"
import { guides, type GuideCategory } from "@/data/content-library/guides"

const categoryConfig: Record<GuideCategory, { icon: typeof Shield; color: string; label: string }> = {
  security: { icon: Shield, color: "bg-red-500/10 text-red-500", label: "Security" },
  devops: { icon: Rocket, color: "bg-blue-500/10 text-blue-500", label: "DevOps" },
  testing: { icon: TestTube, color: "bg-orange-500/10 text-orange-500", label: "Testing" },
}

function getLevelColor(level: string) {
  switch (level) {
    case "intermediate":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    case "advanced":
      return "bg-red-500/10 text-red-500 border-red-500/20"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export default function GuidesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-4">Ops Guides</h1>
        <p className="text-lg text-muted-foreground text-balance">
          In-depth operational guides covering security architecture, deployment strategies,
          and testing methodology. These are the highest-value references for production
          systems -- promoted from operational docs to structured, validated content.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {(["security", "devops", "testing"] as const).map((cat) => {
          const config = categoryConfig[cat]
          const Icon = config.icon
          const count = guides.filter((g) => g.category === cat).length
          return (
            <div key={cat} className={`${config.color} border border-current/20 rounded-lg p-4 text-center`}>
              <Icon className="h-6 w-6 mx-auto mb-2" />
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-sm opacity-80">{config.label}</p>
            </div>
          )
        })}
      </div>

      <div className="grid gap-6">
        {guides.map((guide) => {
          const config = categoryConfig[guide.category]
          const Icon = config.icon
          return (
            <Link
              key={guide.id}
              href={`/dashboard/content-library/guides/${guide.slug}`}
              className="group bg-card border border-border rounded-lg p-6 hover:border-accent/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${config.color}`}>
                      {config.label}
                    </span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getLevelColor(guide.level)}`}>
                      {guide.level.charAt(0).toUpperCase() + guide.level.slice(1)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Icon className="h-6 w-6 text-muted-foreground group-hover:text-accent transition-colors shrink-0" />
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-accent transition-colors">
                      {guide.title}
                    </h3>
                  </div>

                  <p className="text-sm text-muted-foreground text-pretty">{guide.description}</p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {guide.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      {guide.sections.length} sections
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {guide.audience[0]}
                    </span>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors shrink-0 mt-2" />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
