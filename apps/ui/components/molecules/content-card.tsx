"use client"

import { Copy, Check } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"

interface ContentCardProps {
  title: string
  description: string
  content: string
  tags: string[]
  level: "beginner" | "intermediate" | "advanced"
  type: "article" | "post" | "tutorial"
}

export function ContentCard({ title, description, content, tags, level, type }: ContentCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const levelColors = {
    beginner: "bg-green-500/10 text-green-500 border-green-500/30",
    intermediate: "bg-blue-500/10 text-blue-500 border-blue-500/30",
    advanced: "bg-purple-500/10 text-purple-500 border-purple-500/30",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border border-border bg-card p-6 hover:border-accent/50 transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <button
          onClick={handleCopy}
          className="ml-4 p-2 rounded-lg border border-border hover:bg-accent/10 transition-colors"
          title="Copy to clipboard"
        >
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`px-2 py-1 text-xs font-medium rounded-md border ${levelColors[level]}`}>
          {level.charAt(0).toUpperCase() + level.slice(1)}
        </span>
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 text-xs font-medium rounded-md bg-muted text-muted-foreground border border-border"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="prose prose-sm dark:prose-invert max-w-none">
        <p className="text-sm text-foreground whitespace-pre-wrap">{content.substring(0, 200)}...</p>
      </div>
    </motion.div>
  )
}
