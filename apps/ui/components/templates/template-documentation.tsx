"use client"

import type React from "react"
import type { DocumentationSection } from "@/types/strapi/documentation.types"

interface TemplateDocumentationProps {
  title: string
  breadcrumbs?: Array<{ label: string; href: string }>
  sections: DocumentationSection[]
  tableOfContents?: boolean
  children?: React.ReactNode
}

export function TemplateDocumentation({
  title,
  breadcrumbs,
  sections,
  tableOfContents = true,
  children,
}: TemplateDocumentationProps) {
  return (
    <div className="w-full bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="flex items-center gap-2 mb-8 text-sm text-muted-foreground">
            {breadcrumbs.map((crumb, idx) => (
              <div key={crumb.href} className="flex items-center gap-2">
                <a href={crumb.href} className="hover:text-foreground transition-colors">
                  {crumb.label}
                </a>
                {idx < breadcrumbs.length - 1 && <span>/</span>}
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* TOC */}
          {tableOfContents && sections.length > 0 && (
            <aside className="lg:col-span-1">
              <nav className="sticky top-4 rounded-lg border border-border bg-card p-4 space-y-2">
                <h3 className="font-semibold text-sm text-foreground mb-4">On this page</h3>
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </aside>
          )}

          {/* Main Content */}
          <main className="lg:col-span-3">
            <article className="prose prose-sm dark:prose-invert max-w-none">
              <h1 className="text-4xl font-bold text-foreground mb-8">{title}</h1>
              {children}
            </article>
          </main>
        </div>
      </div>
    </div>
  )
}
