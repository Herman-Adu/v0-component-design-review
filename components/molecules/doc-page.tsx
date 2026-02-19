"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import type { LucideIcon } from "lucide-react"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DocSection {
  id: string
  title: string
  level?: 1 | 2
}

export interface DocBadge {
  label: string
  variant?: "default" | "outline" | "destructive"
  className?: string
}

// A badge item can be a DocBadge object, a plain string, or a pre-rendered JSX element
export type DocBadgeItem = DocBadge | string | React.ReactNode

export interface DocPageProps {
  /** Page title displayed as h1 */
  title: string
  /** Subtitle / description paragraph */
  description: string
  /** Icon displayed next to the title */
  icon?: LucideIcon
  /** Category badges shown above the title */
  badges?: DocBadgeItem[]
  /** Audience badges (secondary row) */
  audienceBadges?: DocBadge[]
  /** Tag badges shown below the description */
  tags?: string[]
  /** Metadata bar items: audience, difficulty, last updated, etc. */
  meta?: { label: string; value: string }[]
  /** Section headings for the auto-generated TOC sidebar */
  sections?: DocSection[]
  /** Page content */
  children: React.ReactNode
}

// ---------------------------------------------------------------------------
// TOC Sidebar (auto-highlights on scroll)
// ---------------------------------------------------------------------------

function DocTOC({ sections }: { sections: DocSection[] }) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "")

  useEffect(() => {
    // Track which section ids are currently visible
    const visibleIds = new Set<string>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visibleIds.add(entry.target.id)
          } else {
            visibleIds.delete(entry.target.id)
          }
        }
        // Pick the first visible section in document order (sections array order)
        const firstVisible = sections.find((s) => visibleIds.has(s.id))
        if (firstVisible) {
          setActiveId(firstVisible.id)
        }
      },
      { rootMargin: "-80px 0px -40% 0px", threshold: 0.1 },
    )

    for (const section of sections) {
      const el = document.getElementById(section.id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [sections])

  return (
    <nav 
      className="toc-display sticky top-24 w-dynamic-toc shrink-0 self-start transition-sidebar" 
      aria-label="Table of contents"
      role="navigation"
    >
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        On this page
      </h3>
      <ul className="space-y-1 text-sm">
        {sections.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className={`block py-1 transition-colors ${
                (s.level ?? 1) === 2 ? "pl-4" : "pl-0"
              } ${
                activeId === s.id
                  ? "text-accent font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {s.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

// ---------------------------------------------------------------------------
// DocPage Wrapper
// ---------------------------------------------------------------------------

function renderBadgeItem(item: DocBadgeItem, index: number) {
  // Pre-rendered JSX element (React element)
  if (React.isValidElement(item)) return <React.Fragment key={index}>{item}</React.Fragment>
  // Plain string
  if (typeof item === "string") return <Badge key={item} variant="outline">{item}</Badge>
  // DocBadge object
  const b = item as DocBadge
  return (
    <Badge key={b.label} variant={b.variant ?? "default"} className={b.className}>
      {b.label}
    </Badge>
  )
}

export function DocPage({
  title,
  description,
  icon: Icon,
  badges,
  audienceBadges,
  tags,
  meta,
  sections,
  children,
}: DocPageProps) {
  return (
    <div className="w-full flex gap-dynamic transition-layout doc-content">
      {/* Main content */}
      <div className="w-dynamic-content flex-1 min-w-0 space-y-10 overflow-x-hidden">
        {/* Header */}
        <header className="space-y-4">
          {badges && badges.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              {badges.map((item, i) => renderBadgeItem(item, i))}
            </div>
          )}
          {audienceBadges && audienceBadges.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              {audienceBadges.map((b) => (
                <Badge key={b.label} variant={b.variant ?? "default"} className={b.className}>
                  {b.label}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 mb-4">
            {Icon && <Icon className="h-10 w-10 text-accent" />}
            <h1 className="text-4xl font-bold text-foreground text-balance">{title}</h1>
          </div>

          <p className="text-xl text-muted-foreground text-pretty">{description}</p>

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {tags.map((tag) => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>
          )}

          {meta && meta.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-border text-sm text-muted-foreground">
              {meta.map((m) => (
                <span key={m.label}>
                  <span className="font-medium text-foreground">{m.label}:</span>{" "}
                  {m.value}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Content */}
        {children}
      </div>

      {/* TOC sidebar */}
      {sections && sections.length > 0 && <DocTOC sections={sections} />}
    </div>
  )
}

// ---------------------------------------------------------------------------
// DocSection heading helper -- renders h2 with an anchor id
// ---------------------------------------------------------------------------

export function DocSectionHeader({
  id,
  children,
}: {
  id: string
  children: React.ReactNode
}) {
  return (
    <h2
      id={id}
      className="text-3xl font-bold text-foreground border-b border-border pb-2 scroll-mt-24"
    >
      {children}
    </h2>
  )
}

export default DocPage
