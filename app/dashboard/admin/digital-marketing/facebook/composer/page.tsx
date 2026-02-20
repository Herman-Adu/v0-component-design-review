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
  Globe,
  Copy,
  CheckCircle2,
  Image,
  Lightbulb,
  Type,
  AlertTriangle,
  ThumbsUp,
  MessageSquare,
  Share2,
} from "lucide-react"

const FB = "/dashboard/admin/digital-marketing/facebook"
const RECOMMENDED_MAX = 250

const postTypes = [
  { value: "update", label: "Status Update", description: "General business update or tip" },
  { value: "project", label: "Project Showcase", description: "Before/after or completed work" },
  { value: "offer", label: "Offer / Promotion", description: "Service deal or seasonal campaign" },
  { value: "community", label: "Community Post", description: "Local engagement, question, or poll" },
]

const templates = [
  {
    title: "Project Before/After",
    type: "project",
    content: `Another job well done!\n\nWe've just completed a [service type] for a lovely family in [Location].\n\nThe problem: [Brief description]\nOur solution: [What we did]\nThe result: [Outcome]\n\nAll work NICEIC certified and guaranteed.\n\nNeed an electrician? Send us a message or call [number] for a free quote.`,
  },
  {
    title: "Seasonal Safety Tip",
    type: "update",
    content: `Winter safety reminder for homeowners:\n\nWith the darker evenings, now is a good time to check:\n\n- Outdoor lighting is working and weatherproof\n- Extension leads aren't overloaded with heaters\n- Smoke alarms have fresh batteries\n- Your consumer unit hasn't tripped recently\n\nIf anything looks or feels wrong, don't ignore it. Call a qualified electrician.\n\nWe're here to help - message us anytime.`,
  },
  {
    title: "Special Offer",
    type: "offer",
    content: `SPRING OFFER\n\nBook an EICR (Electrical Installation Condition Report) this month and receive 10% off.\n\nAn EICR checks the safety of your home's electrics and is recommended every 10 years (or 5 for rented properties).\n\nWhat's included:\n- Full inspection of your electrical installation\n- Written report with any findings\n- Certificate for your records\n\nLimited availability -- message us to book.\n\n[Phone number] | [Website]`,
  },
]

export default function FacebookComposerPage() {
  const [postType, setPostType] = useState("update")
  const [content, setContent] = useState("")
  const [copied, setCopied] = useState(false)

  const charCount = content.length
  const isLong = charCount > RECOMMENDED_MAX
  const lineCount = content.split("\n").length

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* clipboard unavailable */ }
  }

  const loadTemplate = (tmpl: (typeof templates)[number]) => {
    setPostType(tmpl.type)
    setContent(tmpl.content)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
            <PenSquare className="h-5 w-5 text-indigo-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
              Facebook Post Composer
            </h1>
            <p className="text-muted-foreground">
              Compose Facebook posts with preview, templates, and copy-to-clipboard
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline">Content Creator</Badge>
          <Badge className="bg-indigo-500/20 text-indigo-400 border-0">{'< 250 chars recommended'}</Badge>
        </div>
      </div>

      {/* Composer + Preview */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Composer */}
        <div className="space-y-6">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Compose Post</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm">Post Type</Label>
                <div className="flex flex-wrap gap-2">
                  {postTypes.map((pt) => (
                    <button
                      key={pt.value}
                      onClick={() => setPostType(pt.value)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        postType === pt.value
                          ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                          : "bg-muted text-muted-foreground border border-transparent hover:bg-muted/80"
                      }`}
                    >
                      {pt.label}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {postTypes.find((p) => p.value === postType)?.description}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Content</Label>
                  <span className={`text-xs font-mono ${isLong ? "text-amber-400" : "text-muted-foreground"}`}>
                    {charCount} chars {isLong ? "(long)" : ""}
                  </span>
                </div>
                <Textarea
                  placeholder="Write your Facebook post here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={10}
                  className="resize-none font-mono text-sm"
                />
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Type className="h-3 w-3" />{lineCount} line{lineCount !== 1 ? "s" : ""}</span>
                  <span className="flex items-center gap-1"><Type className="h-3 w-3" />{charCount} chars</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button onClick={handleCopy} disabled={!content} className="gap-2">
                  {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied" : "Copy Post"}
                </Button>
                <Button variant="outline" onClick={() => { setContent(""); setPostType("update") }} className="bg-transparent">Clear</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <Card className="border-indigo-500/20">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="h-4 w-4 text-indigo-500" />
                Facebook Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="rounded-lg border border-border bg-card p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                    <Globe className="h-5 w-5 text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Electrical Services</p>
                    <p className="text-xs text-muted-foreground">Just now</p>
                  </div>
                </div>
                <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed min-h-[60px]">
                  {content || <span className="text-muted-foreground italic">Your post will appear here...</span>}
                </div>
                <div className="w-full aspect-[1.91/1] rounded-md bg-muted/50 border border-dashed border-border flex items-center justify-center">
                  <div className="text-center">
                    <Image className="h-6 w-6 text-muted-foreground mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">1200 x 630px</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> Like</span>
                  <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> Comment</span>
                  <span className="flex items-center gap-1"><Share2 className="h-3 w-3" /> Share</span>
                </div>
              </div>

              {isLong && (
                <div className="flex items-center gap-2 mt-3 text-amber-400 text-xs">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>Facebook truncates posts over ~250 characters behind a "See More" link. Front-load your key message.</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Facebook Post Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  "Keep under 250 characters for full visibility (no 'See More')",
                  "Always include an image -- posts with photos get 2.3x more engagement",
                  "Ask a question to boost comments and algorithm visibility",
                  "Post natively -- avoid link-only posts where possible",
                  "Tag location for local reach boost",
                ].map((tip) => (
                  <div key={tip} className="flex items-start gap-2.5">
                    <Lightbulb className="h-3.5 w-3.5 text-indigo-500 shrink-0 mt-0.5" />
                    <span className="text-xs text-muted-foreground leading-relaxed">{tip}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Templates */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Post Templates</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {templates.map((tmpl) => (
            <Card key={tmpl.title} className="border-border/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{tmpl.title}</CardTitle>
                  <Badge variant="outline" className="text-[10px]">{tmpl.type}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4 mb-3 font-mono">{tmpl.content}</p>
                <Button variant="outline" size="sm" className="bg-transparent w-full" onClick={() => loadTemplate(tmpl)}>Use Template</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Nav */}
      <Card className="border-border/50">
        <CardContent className="flex items-center justify-between p-5 gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-500/10 shrink-0">
              <Globe className="h-5 w-5 text-indigo-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Back to Facebook Marketing</p>
              <p className="text-xs text-muted-foreground mt-0.5">Explore other Facebook tools.</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="bg-transparent" asChild>
            <Link href={FB}>Overview <ArrowRight className="ml-2 h-3 w-3" /></Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
