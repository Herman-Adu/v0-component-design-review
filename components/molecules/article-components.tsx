"use client"

import React from "react"

import { Check, X, Info, AlertTriangle, Lightbulb, Zap, ArrowRight, ArrowDown, Folder, File, ChevronRight, Star, TrendingUp, Shield, Code, Database, Layers, GitBranch, Clock, Users, Target, CheckCircle2, XCircle, Minus, User, Wrench, Calendar, FileText, Navigation, BarChart, Settings, LayoutGrid } from "lucide-react"
import type { ReactNode } from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { guardArrayProp, PropGuardDiagnostic } from "@/lib/utils/prop-guard"

// ============================================
// TABLE OF CONTENTS (Sticky Right Sidebar)
// ============================================

export interface TOCItem {
  id: string
  title: string
  level: number
}

export function TableOfContents({ items }: { items: TOCItem[] }) {
  const [activeId, setActiveId] = useState<string>("")
  const guardedItems = guardArrayProp(items, "TableOfContents", "items")

  useEffect(() => {
    if (!guardedItems) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: "-20% 0% -35% 0%", threshold: 0 }
    )

    guardedItems.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [guardedItems])

  if (!guardedItems) return <PropGuardDiagnostic componentName="TableOfContents" propName="items" received={items === undefined ? "undefined" : "null"} />

  return (
    <nav className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
      <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
        <span className="w-1 h-4 bg-accent rounded-full" />
        On This Page
      </h4>
      <ul className="space-y-1 text-sm border-l border-border">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" })
              }}
              className={`block py-1.5 transition-all border-l-2 -ml-[2px] ${
                item.level === 2 ? "pl-4" : "pl-8"
              } ${
                activeId === item.id
                  ? "border-accent text-accent font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/50"
              }`}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

// ============================================
// SECTION HEADERS
// ============================================

export function SectionHeader({ number, title, id }: { number: string | number; title: string; id?: string }) {
  return (
    <h2 id={id} className="text-2xl font-bold text-foreground mt-12 mb-6 flex items-baseline gap-3 scroll-mt-24">
      <span className="text-accent font-mono">{number}</span>
      {title}
    </h2>
  )
}

export function SubSectionHeader({ title, id }: { title: string; id?: string }) {
  return (
    <h3 id={id} className="text-xl font-semibold text-foreground mt-8 mb-4 scroll-mt-24">
      {title}
    </h3>
  )
}

// ============================================
// INFO BOXES / CALLOUTS
// ============================================

export function InfoBox({
  children,
  type = "info",
  title,
}: {
  children: ReactNode
  type?: "info" | "warning" | "tip" | "important" | "danger"
  title?: string
}) {
  const styles = {
    info: {
      bg: "bg-accent/10 border-accent/30",
      icon: <Info className="h-5 w-5 text-accent flex-shrink-0" />,
      defaultTitle: "Info",
    },
    warning: {
      bg: "bg-yellow-500/10 border-yellow-500/30",
      icon: <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0" />,
      defaultTitle: "Warning",
    },
    tip: {
      bg: "bg-green-500/10 border-green-500/30",
      icon: <Lightbulb className="h-5 w-5 text-green-500 flex-shrink-0" />,
      defaultTitle: "Pro Tip",
    },
    important: {
      bg: "bg-red-500/10 border-red-500/30",
      icon: <Zap className="h-5 w-5 text-red-500 flex-shrink-0" />,
      defaultTitle: "Important",
    },
    danger: {
      bg: "bg-red-500/10 border-red-500/30",
      icon: <Zap className="h-5 w-5 text-red-500 flex-shrink-0" />,
      defaultTitle: "Danger",
    },
  }

  const style = styles[type] ?? styles.info

  return (
    <div className={`${style.bg} border rounded-lg p-4 my-6`}>
      {title && (
        <div className="flex items-center gap-2 mb-2">
          {style.icon}
          <span className="font-semibold text-foreground text-sm">{title}</span>
        </div>
      )}
      <div className={`text-sm text-foreground/90 leading-relaxed ${!title ? "flex gap-3" : "pl-7"}`}>
        {!title && style.icon}
        <div>{children}</div>
      </div>
    </div>
  )
}

// ============================================
// STEP FLOW DIAGRAM (Horizontal)
// ============================================

export function StepFlow({ steps, title }: { steps: { number?: number | string; title?: string; label?: string; description: string }[]; title?: string }) {
  const guardedSteps = guardArrayProp(steps, "StepFlow", "steps")
  if (!guardedSteps) return <PropGuardDiagnostic componentName="StepFlow" propName="steps" received={steps === undefined ? "undefined" : "null"} />

  // Normalise: accept "label" as alias for "title"
  const normalizedSteps = guardedSteps.map(step => ({
    ...step,
    title: step.title || step.label || "Step",
  }))

  return (
    <div className="bg-card border border-border rounded-lg p-6 my-6">
      {title && <h4 className="font-semibold text-foreground mb-4">{title}</h4>}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {normalizedSteps.map((step, index) => (
          <div key={`step-${index}-${step.number ?? index}`} className="text-center relative">
            <div className="text-2xl font-bold text-accent mb-2">{step.number ?? index + 1}</div>
            <div className="font-semibold text-foreground text-sm mb-1">{step.title}</div>
            <div className="text-xs text-muted-foreground">{step.description}</div>
            {index < normalizedSteps.length - 1 && (
              <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 h-4 w-4 text-muted-foreground hidden md:block" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================
// VERTICAL PROCESS FLOW
// ============================================

export function VerticalFlow({ 
  steps, 
  title 
}: { 
  steps: { title?: string; label?: string; description: string; icon?: ReactNode; color?: string }[]
  title?: string 
}) {
  const guardedSteps = guardArrayProp(steps, "VerticalFlow", "steps")
  if (!guardedSteps) return <PropGuardDiagnostic componentName="VerticalFlow" propName="steps" received={steps === undefined ? "undefined" : "null"} />

  // Normalise: accept "label" as alias for "title"
  const normalizedSteps = guardedSteps.map(step => ({
    ...step,
    title: step.title || step.label || "Step",
  }))

  return (
    <div className="bg-card border border-border rounded-lg p-6 my-6">
      {title && <h4 className="font-semibold text-foreground mb-6">{title}</h4>}
      <div className="relative">
        {normalizedSteps.map((step, index) => (
          <div key={index} className="flex gap-4 pb-6 last:pb-0">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center text-accent">
                {step.icon || <span className="font-bold text-sm">{index + 1}</span>}
              </div>
              {index < normalizedSteps.length - 1 && (
                <div className="w-0.5 flex-1 bg-accent/30 mt-2" />
              )}
            </div>
            <div className="flex-1 pt-1">
              <h5 className="font-semibold text-foreground mb-1">{step.title}</h5>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================
// COMPARISON CARDS (Ideal For / Not Ideal For)
// ============================================

export function ComparisonCards({
  idealFor,
  notIdealFor,
  idealTitle = "Ideal For",
  notIdealTitle = "Not Ideal For",
  // Alternative prop pattern for flexibility
  leftTitle,
  leftItems,
  rightTitle,
  rightItems,
  leftType = "positive",
  rightType = "negative",
}: {
  idealFor?: string[]
  notIdealFor?: string[]
  idealTitle?: string
  notIdealTitle?: string
  leftTitle?: string
  leftItems?: string[]
  rightTitle?: string
  rightItems?: string[]
  leftType?: "positive" | "negative"
  rightType?: "positive" | "negative"
}) {
  // Support both prop patterns
  const leftData = leftItems || idealFor || []
  const rightData = rightItems || notIdealFor || []
  const leftLabel = leftTitle || idealTitle
  const rightLabel = rightTitle || notIdealTitle
  const leftIsPositive = leftType === "positive"
  const rightIsPositive = rightType === "positive"

  return (
    <div className="grid md:grid-cols-2 gap-4 my-6">
      <div className={`bg-card border rounded-lg p-5 ${leftIsPositive ? "border-green-500/30" : "border-red-500/30"}`}>
        <h4 className={`font-semibold mb-4 ${leftIsPositive ? "text-green-500" : "text-red-500"}`}>{leftLabel}</h4>
        <ul className="space-y-2">
          {leftData.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              {leftIsPositive ? (
                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              ) : (
                <X className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
              )}
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className={`bg-card border rounded-lg p-5 ${rightIsPositive ? "border-green-500/30" : "border-red-500/30"}`}>
        <h4 className={`font-semibold mb-4 ${rightIsPositive ? "text-green-500" : "text-red-500"}`}>{rightLabel}</h4>
        <ul className="space-y-2">
          {rightData.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              {rightIsPositive ? (
                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              ) : (
                <X className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
              )}
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// ============================================
// BEFORE/AFTER COMPARISON
// ============================================

export function BeforeAfterComparison({
  title,
  before,
  after,
  beforeTitle,
  beforeCode,
  afterTitle,
  afterCode,
  beforeItems,
  afterItems,
  improvements,
}: {
  title?: string
  before?: { title?: string; label?: string; items?: string[]; code?: string }
  after?: { title?: string; label?: string; items?: string[]; code?: string }
  beforeTitle?: string
  beforeCode?: string
  afterTitle?: string
  afterCode?: string
  beforeItems?: string[]
  afterItems?: string[]
  improvements?: { metric: string; before: string; after: string }[]
}) {
  // Support code comparison pattern - check both top-level props and nested before/after.code
  const resolvedBeforeCode = beforeCode || before?.code
  const resolvedAfterCode = afterCode || after?.code
  const resolvedBeforeTitle = beforeTitle || before?.title
  const resolvedAfterTitle = afterTitle || after?.title

  if (resolvedBeforeCode || resolvedAfterCode) {
    return (
      <div className="my-6 space-y-4">
        {title && <h4 className="font-semibold text-foreground">{title}</h4>}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-card border border-red-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <XCircle className="h-5 w-5 text-red-500" />
              <h4 className="text-red-400 font-semibold text-sm">{resolvedBeforeTitle || "Before"}</h4>
            </div>
            <pre className="text-xs text-muted-foreground overflow-x-auto bg-background/50 p-3 rounded"><code>{resolvedBeforeCode}</code></pre>
          </div>
          <div className="bg-card border border-green-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <h4 className="text-green-400 font-semibold text-sm">{resolvedAfterTitle || "After"}</h4>
            </div>
            <pre className="text-xs text-muted-foreground overflow-x-auto bg-background/50 p-3 rounded"><code>{resolvedAfterCode}</code></pre>
          </div>
        </div>
        {improvements && improvements.length > 0 && (
          <div className="bg-card border border-border rounded-lg p-4">
            <h4 className="font-semibold text-foreground mb-3 text-sm">Improvements</h4>
            <div className="space-y-2">
              {improvements.map((item, i) => (
                <div key={i} className="grid grid-cols-3 gap-4 text-sm">
                  <span className="text-muted-foreground">{item.metric}</span>
                  <span className="text-red-400">{item.before}</span>
                  <span className="text-green-400">{item.after}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Original items-based pattern - support both nested before.items and flat beforeItems/afterItems props
  const resolvedBeforeItems = beforeItems || (Array.isArray(before?.items) ? before.items : [])
  const resolvedAfterItems = afterItems || (Array.isArray(after?.items) ? after.items : [])
  const beforeData = { title: beforeTitle || before?.title || before?.label || "Before", items: resolvedBeforeItems }
  const afterData = { title: afterTitle || after?.title || after?.label || "After", items: resolvedAfterItems }

  // If no items to show (e.g., only code was provided but code path didn't match), render nothing
  if (resolvedBeforeItems.length === 0 && resolvedAfterItems.length === 0) {
    return null
  }

  return (
    <div className="my-6 space-y-4">
      {title && <h4 className="font-semibold text-foreground">{title}</h4>}
      <div className="grid md:grid-cols-2 gap-4">
      <div className="bg-card border border-red-500/20 rounded-lg p-5">
        <div className="flex items-center gap-2 mb-4">
          <XCircle className="h-5 w-5 text-red-500" />
          <h4 className="text-red-400 font-semibold">{beforeData.title || "Before"}</h4>
        </div>
        <ul className="space-y-2">
          {beforeData.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <Minus className="h-4 w-4 text-red-500/50 mt-0.5 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-card border border-green-500/20 rounded-lg p-5">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <h4 className="text-green-400 font-semibold">{afterData.title || "After"}</h4>
        </div>
        <ul className="space-y-2">
          {afterData.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      </div>
    </div>
  )
}

// ============================================
// CODE BLOCK WITH COPY
// ============================================

export function CodeBlock({
  code,
  language = "typescript",
  filename,
  title,
  highlightLines,
}: {
  code: string
  language?: string
  filename?: string
  title?: string
  highlightLines?: number[]
}) {
  const [copied, setCopied] = useState(false)
  const label = filename || title

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="my-6 rounded-lg overflow-hidden border border-border">
      {label && (
        <div className="bg-muted/50 px-4 py-2 border-b border-border flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-mono">{label}</span>
          <button
            onClick={copyToClipboard}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}
      <pre className="bg-muted/30 p-4 overflow-x-auto">
        <code className="text-sm font-mono text-foreground/90">{code}</code>
      </pre>
    </div>
  )
}

// ============================================
// FILE TREE DIAGRAM
// ============================================

interface FileTreeItem {
  name: string
  type: "folder" | "file"
  children?: FileTreeItem[]
  highlight?: boolean
  indent?: number
  description?: string
}

export function FileTree({ items, title }: { items: FileTreeItem[]; title?: string }) {
  const guardedItems = guardArrayProp(items, "FileTree", "items")
  if (!guardedItems) return <PropGuardDiagnostic componentName="FileTree" propName="items" received={items === undefined ? "undefined" : "null"} />
  const renderItem = (item: FileTreeItem, depth: number = 0, path: string = "") => {
    const effectiveDepth = item.indent ?? depth
    const uniquePath = path ? `${path}/${item.name}` : item.name
    return (
      <div key={uniquePath} style={{ paddingLeft: `${effectiveDepth * 16}px` }}>
        <div className={`flex items-center gap-2 py-1 ${item.highlight ? "text-accent font-medium" : "text-muted-foreground"}`}>
          {item.type === "folder" ? (
            <Folder className="h-4 w-4 text-accent" />
          ) : (
            <File className="h-4 w-4" />
          )}
          <span className="text-sm font-mono">{item.name}</span>
          {item.description && (
            <span className="text-xs text-muted-foreground/60 ml-1">{"// "}{item.description}</span>
          )}
        </div>
        {item.children?.map((child) => renderItem(child, depth + 1, uniquePath))}
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 my-6">
      {title && <h4 className="font-semibold text-foreground mb-4">{title}</h4>}
      <div className="font-mono">{guardedItems.map((item, index) => renderItem(item, 0, `root-${index}`))}</div>
    </div>
  )
}

// ============================================
// ARCHITECTURE DIAGRAM (Layers)
// ============================================

export function ArchitectureDiagram({
  layers,
  title,
}: {
  layers: { name?: string; label?: string; items: string[]; color?: string }[]
  title?: string
}) {
  const guardedLayers = guardArrayProp(layers, "ArchitectureDiagram", "layers")
  if (!guardedLayers) return <PropGuardDiagnostic componentName="ArchitectureDiagram" propName="layers" received={layers === undefined ? "undefined" : "null"} />
  // Normalise: accept "label" as alias for "name", default color to accent
  const normalizedLayers = guardedLayers.map(layer => ({
    ...layer,
    name: layer.name || layer.label || "Layer",
    color: layer.color || "#6366f1",
  }))
  return (
    <div className="bg-card border border-border rounded-lg p-6 my-6">
      {title && <h4 className="font-semibold text-foreground mb-6 text-center">{title}</h4>}
      <div className="space-y-3">
        {normalizedLayers.map((layer, index) => (
          <div key={layer.name}>
            <div
              className="rounded-lg p-4 text-center"
              style={{ backgroundColor: `${layer.color}15`, borderColor: `${layer.color}40`, borderWidth: "1px" }}
            >
              <div className="font-semibold mb-2" style={{ color: layer.color }}>
                {layer.name}
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {layer.items.map((item) => (
                  <span
                    key={item}
                    className="text-xs px-2 py-1 rounded-full bg-background/50 text-muted-foreground"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
            {index < normalizedLayers.length - 1 && (
              <div className="flex justify-center py-2">
                <ArrowDown className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================
// FEATURE GRID
// ============================================

export function FeatureGrid({
  features,
  columns = 3,
}: {
  features: { icon?: ReactNode; title: string; description: string; items?: string[] }[]
  columns?: 2 | 3 | 4
}) {
  const guardedFeatures = guardArrayProp(features, "FeatureGrid", "features")
  if (!guardedFeatures) return <PropGuardDiagnostic componentName="FeatureGrid" propName="features" received={features === undefined ? "undefined" : "null"} />
  const colClass = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  }

  return (
    <div className={`grid ${colClass[columns]} gap-4 my-6`}>
      {guardedFeatures.map((feature, index) => (
        <div key={index} className="bg-card border border-border rounded-lg p-4">
          {feature.icon && <div className="text-accent mb-3">{feature.icon}</div>}
          <h4 className="font-semibold text-foreground mb-2">{feature.title}</h4>
          <p className="text-sm text-muted-foreground">{feature.description}</p>
          {feature.items && feature.items.length > 0 && (
            <ul className="mt-2 space-y-1">
              {feature.items.map((item, i) => (
                <li key={i} className="text-xs text-muted-foreground/80 flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-accent/50 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  )
}

// ============================================
// METRICS CARD
// ============================================

export function MetricsGrid({
  metrics,
}: {
  metrics: { label: string; value: string; change?: string; positive?: boolean; description?: string }[]
}) {
  const guardedMetrics = guardArrayProp(metrics, "MetricsGrid", "metrics")
  if (!guardedMetrics) return <PropGuardDiagnostic componentName="MetricsGrid" propName="metrics" received={metrics === undefined ? "undefined" : "null"} />
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
      {guardedMetrics.map((metric, index) => (
        <div key={index} className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-accent mb-1">{metric.value}</div>
          <div className="text-sm text-muted-foreground mb-1">{metric.label}</div>
          {metric.description && (
            <div className="text-xs text-muted-foreground/70 mt-1">{metric.description}</div>
          )}
          {metric.change && (
            <div className={`text-xs ${metric.positive ? "text-green-500" : "text-red-500"}`}>
              {metric.positive ? "+" : ""}{metric.change}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ============================================
// DATA FLOW DIAGRAM
// ============================================

export function DataFlowDiagram({
  nodes,
  title,
}: {
  nodes: { id?: string; label: string; description?: string; icon?: ReactNode; items?: string[] }[]
  title?: string
  connections?: string[]
  flow?: "horizontal" | "vertical"
}) {
  const guardedNodes = guardArrayProp(nodes, "DataFlowDiagram", "nodes")
  if (!guardedNodes) return <PropGuardDiagnostic componentName="DataFlowDiagram" propName="nodes" received={nodes === undefined ? "undefined" : "null"} />
  return (
    <div className="bg-card border border-border rounded-lg p-6 my-6">
      {title && <h4 className="font-semibold text-foreground mb-6 text-center">{title}</h4>}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {guardedNodes.map((node, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="bg-accent/10 border border-accent/30 rounded-lg px-4 py-3 text-center min-w-[120px]">
              {node.icon && <div className="text-accent mb-1 flex justify-center">{node.icon}</div>}
              <div className="font-medium text-foreground text-sm">{node.label}</div>
              {node.description && (
                <div className="text-xs text-muted-foreground mt-1">{node.description}</div>
              )}
            </div>
            {index < guardedNodes.length - 1 && (
              <ChevronRight className="h-5 w-5 text-accent flex-shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================
// DECISION TREE / WHEN TO USE
// ============================================

export function DecisionTree({
  title,
  decisions,
}: {
  title?: string
  decisions: { condition: string; result: string; recommended?: boolean }[]
}) {
  const guardedDecisions = guardArrayProp(decisions, "DecisionTree", "decisions")
  if (!guardedDecisions) return <PropGuardDiagnostic componentName="DecisionTree" propName="decisions" received={decisions === undefined ? "undefined" : "null"} />
  return (
    <div className="bg-card border border-border rounded-lg p-6 my-6">
      {title && <h4 className="font-semibold text-foreground mb-4">{title}</h4>}
      <div className="space-y-3">
        {guardedDecisions.map((decision, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 p-3 rounded-lg ${
              decision.recommended ? "bg-accent/10 border border-accent/30" : "bg-muted/30"
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {decision.recommended ? (
                <Star className="h-4 w-4 text-accent" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1">
              <span className="text-sm text-muted-foreground">{decision.condition}</span>
              <span className="text-sm text-foreground font-medium"> → {decision.result}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================
// KEY TAKEAWAY BOX
// ============================================

export function KeyTakeaway({ children, title, points }: { children?: ReactNode; title?: string; points?: string[] }) {
  return (
    <div className="bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/30 rounded-lg p-6 my-8">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-accent/20 rounded-lg">
          <Target className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-2">{title || "Key Takeaway"}</h4>
          {children && <div className="text-sm text-muted-foreground leading-relaxed">{children}</div>}
          {points && points.length > 0 && (
            <ul className="text-sm text-muted-foreground leading-relaxed space-y-2 mt-2">
              {points.map((point, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================
// RELATED ARTICLES
// ============================================

export function RelatedArticles({
  articles,
}: {
  articles: { title: string; href?: string; slug?: string; level?: string }[]
}) {
  const guardedArticles = guardArrayProp(articles, "RelatedArticles", "articles")
  if (!guardedArticles) return <PropGuardDiagnostic componentName="RelatedArticles" propName="articles" received={articles === undefined ? "undefined" : "null"} />
  return (
    <div className="bg-card border border-border rounded-lg p-6 my-8">
      <h4 className="font-semibold text-foreground mb-4">Continue Learning</h4>
      <div className="grid gap-3">
        {guardedArticles.map((article, index) => (
          <Link
            key={index}
            href={article.href || (article.slug ? `/dashboard/content-library/articles/${article.slug}` : "#")}
            className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group"
          >
            <span className="text-sm text-foreground group-hover:text-accent transition-colors">
              {article.title}
            </span>
            <div className="flex items-center gap-2">
              {article.level && (
                <span className="text-xs text-muted-foreground capitalize">{article.level}</span>
              )}
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

// ============================================
// STATS TABLE
// ============================================

export function StatsTable({
  headers,
  rows,
  title,
}: {
  headers: string[]
  rows: string[][]
  title?: string
}) {
  const guardedHeaders = guardArrayProp(headers, "StatsTable", "headers")
  const guardedRows = guardArrayProp(rows, "StatsTable", "rows")
  if (!guardedHeaders) return <PropGuardDiagnostic componentName="StatsTable" propName="headers" received={headers === undefined ? "undefined" : "null"} />
  if (!guardedRows) return <PropGuardDiagnostic componentName="StatsTable" propName="rows" received={rows === undefined ? "undefined" : "null"} />
  return (
    <div className="my-6">
      {title && <h4 className="font-semibold text-foreground mb-4">{title}</h4>}
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              {guardedHeaders.map((header, i) => (
                <th key={i} className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {guardedRows.map((row, i) => (
              <tr key={i} className="bg-card">
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-3 text-sm text-muted-foreground">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ============================================
// NUMBERED LIST
// ============================================

type NumberedListItem = string | { title: string; description?: string }

export function NumberedList({
  items,
  title,
}: {
  items: NumberedListItem[]
  title?: string
}) {
  const guardedItems = guardArrayProp(items, "NumberedList", "items")
  if (!guardedItems) return <PropGuardDiagnostic componentName="NumberedList" propName="items" received={items === undefined ? "undefined" : "null"} />

  // Normalise: accept plain strings or {title, description} objects
  const normalizedItems = guardedItems.map((item) => {
    if (typeof item === "string") return { title: item, description: undefined }
    return item
  })

  return (
    <div className="my-6">
      {title && <h4 className="font-semibold text-foreground mb-4">{title}</h4>}
      <ol className="space-y-4">
        {normalizedItems.map((item, index) => (
          <li key={index} className="flex gap-4">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 text-accent font-bold flex items-center justify-center text-sm">
              {index + 1}
            </span>
            <div className="flex-1 pt-1">
              <span className="font-medium text-foreground">{item.title}</span>
              {item.description && <p className="text-muted-foreground text-sm mt-1">{item.description}</p>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

// ============================================
// PROCESS FLOW (Horizontal timeline with arrows)
// ============================================

type ProcessFlowStep = string | { label?: string; title?: string; sublabel?: string; description?: string; color?: string }

export function ProcessFlow({
  steps,
  title,
}: {
  steps: ProcessFlowStep[]
  title?: string
}) {
  const guardedSteps = guardArrayProp(steps, "ProcessFlow", "steps")
  if (!guardedSteps) return <PropGuardDiagnostic componentName="ProcessFlow" propName="steps" received={steps === undefined ? "undefined" : "null"} />

  // Normalise: accept plain strings, {label, sublabel, color}, or {title, description}
  const normalizedSteps = guardedSteps.map((step) => {
    if (typeof step === "string") return { label: step, sublabel: undefined, color: undefined }
    return {
      label: step.label || step.title || "Step",
      sublabel: step.sublabel || step.description,
      color: step.color,
    }
  })

  return (
    <div className="my-8">
      {title && <h4 className="font-semibold text-foreground mb-4">{title}</h4>}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between gap-2 overflow-x-auto">
          {normalizedSteps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div
                className={`px-4 py-3 rounded-lg text-center min-w-[120px] ${
                  step.color === "green"
                    ? "bg-green-500/20 border border-green-500/30"
                    : step.color === "yellow"
                      ? "bg-yellow-500/20 border border-yellow-500/30"
                      : step.color === "blue"
                        ? "bg-blue-500/20 border border-blue-500/30"
                        : "bg-accent/20 border border-accent/30"
                }`}
              >
                <div className="font-medium text-foreground text-sm">{step.label}</div>
                {step.sublabel && <div className="text-xs text-muted-foreground mt-1">{step.sublabel}</div>}
              </div>
              {index < normalizedSteps.length - 1 && (
                <ArrowRight className="w-5 h-5 text-muted-foreground mx-2 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================
// SIDE BY SIDE COMPARISON (Build Time vs Request Time)
// ============================================

export function SideBySideComparison({
  leftTitle,
  rightTitle,
  leftItems,
  rightItems,
}: {
  leftTitle: string
  rightTitle: string
  leftItems: { label: string; type: "static" | "dynamic" | "placeholder" }[]
  rightItems: { label: string; type: "static" | "dynamic" | "streamed" }[]
}) {
  const getItemStyle = (type: string) => {
    switch (type) {
      case "static":
        return "bg-green-500/20 border-green-500/30 text-green-400"
      case "dynamic":
      case "streamed":
        return "bg-blue-500/20 border-blue-500/30 text-blue-400"
      case "placeholder":
        return "bg-yellow-500/20 border-yellow-500/30 text-yellow-400"
      default:
        return "bg-muted border-border text-muted-foreground"
    }
  }

  return (
    <div className="my-8">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-accent mb-4">{leftTitle}</h4>
            <div className="space-y-2">
              {leftItems.map((item, index) => (
                <div key={index} className={`px-4 py-2 rounded border ${getItemStyle(item.type)}`}>
                  {item.label}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-accent mb-4">{rightTitle}</h4>
            <div className="space-y-2">
              {rightItems.map((item, index) => (
                <div key={index} className={`px-4 py-2 rounded border ${getItemStyle(item.type)}`}>
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-6 mt-6 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-500/50" />
            <span className="text-xs text-muted-foreground">Static (Instant)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-yellow-500/50" />
            <span className="text-xs text-muted-foreground">Placeholder</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-500/50" />
            <span className="text-xs text-muted-foreground">Dynamic (Streamed)</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// ICON EXPORTS FOR ARTICLES
// ============================================

export const ArticleIcons = {
  Code,
  Database,
  Layers,
  GitBranch,
  Shield,
  Clock,
  Users,
  User,
  Target,
  TrendingUp,
  Zap,
  Check,
  CheckCircle: CheckCircle2,
  X,
  Info,
  AlertTriangle,
  Lightbulb,
  Star,
  Folder,
  File,
  FileText,
  Tool: Wrench,
  Calendar,
  Navigation,
  BarChart,
  Settings,
  Layout: LayoutGrid,
}

// ============================================
// ALIASES FOR BACKWARD COMPATIBILITY
// ============================================

// FileTreeDiagram wraps FileTree for naming consistency
export function FileTreeDiagram({ items, files, title }: { items?: FileTreeItem[]; files?: FileTreeItem[]; title?: string }) {
  const treeItems = items || files || []
  return <FileTree items={treeItems} title={title} />
}

// MetricCard component
export function MetricCard({
  title,
  value,
  description,
  trend,
  change,
  icon: Icon,
}: {
  title: string
  value: string
  description?: string
  trend?: "up" | "down" | "neutral"
  change?: string
  icon?: React.ComponentType<{ className?: string }>
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
          {change && <p className="text-sm text-accent font-medium mt-1">{change}</p>}
          {description && <p className="text-xs text-muted-foreground mt-2">{description}</p>}
        </div>
        {Icon && (
          <div className={`p-2 rounded-lg ${trend === "up" ? "bg-green-500/20" : trend === "down" ? "bg-red-500/20" : "bg-accent/20"}`}>
            <Icon className={`h-5 w-5 ${trend === "up" ? "text-green-400" : trend === "down" ? "text-red-400" : "text-accent"}`} />
          </div>
        )}
      </div>
      {trend && (
        <div className={`flex items-center gap-1 mt-2 text-xs ${trend === "up" ? "text-green-400" : trend === "down" ? "text-red-400" : "text-muted-foreground"}`}>
          {trend === "up" ? <TrendingUp className="h-3 w-3" /> : trend === "down" ? <TrendingUp className="h-3 w-3 rotate-180" /> : null}
          {trend === "up" ? "Improved" : trend === "down" ? "Decreased" : "Stable"}
        </div>
      )}
    </div>
  )
}
