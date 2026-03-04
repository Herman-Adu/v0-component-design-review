"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  PenSquare,
  ArrowRight,
  Share2,
  Copy,
  CheckCircle2,
  Image,
  AlertTriangle,
  Lightbulb,
  Hash,
  Smile,
  Type,
} from "lucide-react"

const LI = "/dashboard/admin/digital-marketing/linkedin"
const MAX_CHARS = 3000

const formatTypes = [
  { value: "standard", label: "Standard Post", description: "Regular text post with optional image" },
  { value: "listicle", label: "Listicle", description: "Numbered or bulleted list format" },
  { value: "story", label: "Story/Hook", description: "Opening hook to stop the scroll" },
  { value: "carousel", label: "Carousel Intro", description: "Text intro for a document/carousel post" },
]

const hashtagSuggestions = [
  { category: "Industry", tags: ["#ElectricalContractor", "#Electrician", "#NICEIC", "#18thEdition", "#ElectricalSafety"] },
  { category: "Services", tags: ["#EVCharger", "#Rewiring", "#LEDLighting", "#EICR", "#ConsumerUnit"] },
  { category: "Business", tags: ["#SmallBusiness", "#TradesBusiness", "#Construction", "#PropertyManagement"] },
  { category: "Local", tags: ["#[YourTown]Electrician", "#[YourCounty]", "#LocalBusiness", "#SupportLocal"] },
]

const templates = [
  {
    title: "Project Completion",
    format: "standard",
    content: `Just completed a [project type] in [location].

The challenge:
[Brief description of the problem or scope]

What we delivered:
- [Key deliverable 1]
- [Key deliverable 2]
- [Key deliverable 3]

The result: [Outcome -- safety improvement, energy saving, compliance achieved]

Another satisfied client. If you need [service type], get in touch for a free quote.

#ElectricalContractor #NICEIC #[Location]`,
  },
  {
    title: "Electrical Safety Tip",
    format: "story",
    content: `Stop. Check your consumer unit right now.

If it has a wooden back board, rewirable fuses, or brown/black Bakelite switches -- it could be 30+ years old and potentially dangerous.

Here's what a modern 18th Edition consumer unit gives you:

1. RCD protection on every circuit
2. Dual RCD or RCBO configuration
3. Surge protection (now required)
4. Clear circuit labelling
5. Metal enclosure (fire safety)

A consumer unit upgrade typically takes 4-6 hours and makes your entire home safer.

Don't wait for a fault to find out your protection is outdated.

DM me for a free assessment.

#ElectricalSafety #ConsumerUnit #18thEdition #Electrician`,
  },
  {
    title: "Team / Behind the Scenes",
    format: "standard",
    content: `Behind every great project is a great team.

This week our team:
- Completed [X] installations
- Passed [X] inspections first time
- Responded to [X] emergency callouts

Proud of the dedication and workmanship from every member of the team.

We're currently recruiting for [role]. If you know someone who'd be a great fit, send them our way.

#TeamWork #Electrician #Hiring #TradesBusiness`,
  },
]

export default function LinkedInComposerPage() {
  const [format, setFormat] = useState("standard")
  const [content, setContent] = useState("")
  const [copied, setCopied] = useState(false)

  const charCount = content.length
  const charPercent = Math.min((charCount / MAX_CHARS) * 100, 100)
  const isOverLimit = charCount > MAX_CHARS
  const hashtagCount = (content.match(/#\w+/g) || []).length
  const lineCount = content.split("\n").length

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API not available
    }
  }

  const loadTemplate = (template: (typeof templates)[number]) => {
    setFormat(template.format)
    setContent(template.content)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20">
            <PenSquare className="h-5 w-5 text-sky-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
              LinkedIn Post Composer
            </h1>
            <p className="text-muted-foreground">
              Compose professional LinkedIn posts with formatting, hashtags, preview, and copy-to-clipboard
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline">Content Creator</Badge>
          <Badge variant="outline">Marketing Lead</Badge>
          <Badge className="bg-sky-500/20 text-sky-400 border-0">3,000 Characters</Badge>
        </div>
      </div>

      {/* Composer + Preview Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Composer Panel */}
        <div className="space-y-6">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Compose Post</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Format Type */}
              <div className="space-y-2">
                <Label className="text-sm">Post Format</Label>
                <div className="flex flex-wrap gap-2">
                  {formatTypes.map((ft) => (
                    <button
                      key={ft.value}
                      onClick={() => setFormat(ft.value)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        format === ft.value
                          ? "bg-sky-500/20 text-sky-400 border border-sky-500/30"
                          : "bg-muted text-muted-foreground border border-transparent hover:bg-muted/80"
                      }`}
                    >
                      {ft.label}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatTypes.find((f) => f.value === format)?.description}
                </p>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Content</Label>
                  <span className={`text-xs font-mono ${isOverLimit ? "text-red-400" : "text-muted-foreground"}`}>
                    {charCount} / {MAX_CHARS}
                  </span>
                </div>
                <Textarea
                  placeholder="Write your LinkedIn post here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={12}
                  className="resize-none font-mono text-sm"
                />
                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full transition-all ${isOverLimit ? "bg-red-500" : charPercent > 80 ? "bg-amber-500" : "bg-sky-500"}`}
                    style={{ width: `${charPercent}%` }}
                  />
                </div>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Hash className="h-3 w-3" />
                    {hashtagCount} hashtag{hashtagCount !== 1 ? "s" : ""}
                  </span>
                  <span className="flex items-center gap-1">
                    <Type className="h-3 w-3" />
                    {lineCount} line{lineCount !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button onClick={handleCopy} disabled={!content} className="gap-2">
                  {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied" : "Copy to Clipboard"}
                </Button>
                <Button variant="outline" onClick={() => { setContent(""); setFormat("standard") }} className="bg-transparent">
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          <Card className="border-sky-500/20">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-base flex items-center gap-2">
                <Share2 className="h-4 w-4 text-sky-500" />
                LinkedIn Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              {/* Mock LinkedIn Post */}
              <div className="rounded-lg border border-border bg-card p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-sky-500/20 flex items-center justify-center">
                    <Smile className="h-6 w-6 text-sky-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Your Name</p>
                    <p className="text-xs text-muted-foreground">Director at Electrical Services | NICEIC Registered</p>
                    <p className="text-xs text-muted-foreground">Just now</p>
                  </div>
                </div>

                {/* Post content */}
                <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed min-h-[80px]">
                  {content || <span className="text-muted-foreground italic">Your post content will appear here...</span>}
                </div>

                {/* Image placeholder */}
                <div className="w-full aspect-[1.91/1] rounded-md bg-muted/50 border border-dashed border-border flex items-center justify-center">
                  <div className="text-center">
                    <Image className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">Image preview</p>
                    <p className="text-[10px] text-muted-foreground">1200 x 627px recommended</p>
                  </div>
                </div>

                {/* Engagement bar */}
                <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs text-muted-foreground">
                  <span>Like</span>
                  <span>Comment</span>
                  <span>Repost</span>
                  <span>Send</span>
                </div>
              </div>

              {isOverLimit && (
                <div className="flex items-center gap-2 mt-3 text-red-400 text-xs">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>Content exceeds 3,000 character limit</span>
                </div>
              )}

              {hashtagCount > 5 && (
                <div className="flex items-center gap-2 mt-2 text-amber-400 text-xs">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>LinkedIn recommends 3-5 hashtags per post. You have {hashtagCount}.</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Formatting Tips */}
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Formatting Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { tip: "Use line breaks generously -- dense text gets skipped", icon: Type },
                  { tip: "Open with a hook that stops the scroll (question, bold statement, stat)", icon: Lightbulb },
                  { tip: "Place hashtags at the end, not inline", icon: Hash },
                  { tip: "Keep paragraphs to 1-2 lines on mobile", icon: PenSquare },
                  { tip: "Add an image -- posts with images get 2x engagement", icon: Image },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.tip} className="flex items-start gap-2.5">
                      <Icon className="h-3.5 w-3.5 text-sky-500 shrink-0 mt-0.5" />
                      <span className="text-xs text-muted-foreground leading-relaxed">{item.tip}</span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Hashtag Suggestions */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Hashtag Library</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {hashtagSuggestions.map((group) => (
            <Card key={group.category} className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{group.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {group.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs font-mono cursor-pointer hover:bg-sky-500/10 hover:text-sky-400 hover:border-sky-500/30 transition-colors">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Templates */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Post Templates</h2>
        <div className="responsive-grid-3">
          {templates.map((tmpl) => (
            <Card key={tmpl.title} className="border-border/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{tmpl.title}</CardTitle>
                  <Badge variant="outline" className="text-[10px]">{tmpl.format}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4 mb-3 font-mono">{tmpl.content}</p>
                <Button variant="outline" size="sm" className="bg-transparent w-full" onClick={() => loadTemplate(tmpl)}>
                  Use Template
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Best Practices */}
      <Card className="border-accent/20 bg-accent/5">
        <CardContent className="flex gap-4 p-5">
          <Lightbulb className="h-5 w-5 text-accent shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">LinkedIn Algorithm Tips</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              LinkedIn rewards posts that generate early engagement. Post when your audience is active (Tue-Thu, 8-10am), respond to every comment within the first hour, and avoid external links in the post body (put them in the first comment instead). Text-only and image posts consistently outperform link posts in reach.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Nav */}
      <Card className="border-border/50">
        <CardContent className="flex items-center justify-between p-5 gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-sky-500/10 shrink-0">
              <Share2 className="h-5 w-5 text-sky-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Back to LinkedIn Marketing</p>
              <p className="text-xs text-muted-foreground mt-0.5">Explore other LinkedIn tools.</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="bg-transparent" asChild>
            <Link href={LI}>Overview <ArrowRight className="ml-2 h-3 w-3" /></Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
