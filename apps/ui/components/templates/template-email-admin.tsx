"use client"

import type React from "react"
import type { EmailConfigItem } from "@/types/strapi/email-admin.types"

interface TemplateEmailAdminProps {
  title: string
  description?: string
  configItems: EmailConfigItem[]
  children?: React.ReactNode
}

export function TemplateEmailAdmin({
  title,
  description,
  configItems,
  children,
}: TemplateEmailAdminProps) {
  return (
    <div className="w-full bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-2 border-b border-border pb-8">
            <h1 className="text-3xl font-bold text-foreground">{title}</h1>
            {description && <p className="text-muted-foreground">{description}</p>}
          </div>

          {/* Config Items Grid */}
          {configItems && configItems.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {configItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  className="rounded-lg border border-border bg-card p-6 hover:border-accent/50 transition-all group"
                >
                  <p className="text-sm text-muted-foreground group-hover:text-accent transition-colors">
                    {item.category}
                  </p>
                  <h3 className="font-semibold text-foreground mt-2 group-hover:text-accent transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
                </a>
              ))}
            </div>
          )}

          {/* Main Content */}
          {children && <div className="space-y-8">{children}</div>}
        </div>
      </div>
    </div>
  )
}
