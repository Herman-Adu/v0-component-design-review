"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  PenSquare,
  ArrowRight,
  Search,
  Copy,
  CheckCircle2,
  Image,
  MousePointer,
  AlertTriangle,
  Lightbulb,
  Calendar,
  Tag,
  Megaphone,
} from "lucide-react"

const G = "/dashboard/admin/digital-marketing/google"
const MAX_CHARS = 1500

const postTypes = [
  { value: "update", label: "Update", description: "General business update or news" },
  { value: "offer", label: "Offer", description: "Special promotion or discount" },
  { value: "event", label: "Event", description: "Upcoming event or open day" },
]

const ctaOptions = [
  { value: "none", label: "No CTA" },
  { value: "book", label: "Book" },
  { value: "call", label: "Call Now" },
  { value: "learn", label: "Learn More" },
  { value: "order", label: "Order Online" },
  { value: "signup", label: "Sign Up" },
]

const imageGuidelines = [
  { spec: "Minimum size", value: "400 x 300 pixels" },
  { spec: "Recommended size", value: "1200 x 900 pixels" },
  { spec: "Aspect ratio", value: "4:3" },
  { spec: "Max file size", value: "5 MB" },
  { spec: "Formats", value: "JPG, PNG" },
]

const templates = [
  {
    title: "Emergency Service Reminder",
    postType: "update",
    content: "Need an emergency electrician? We are available 24/7 for urgent electrical issues. From power outages to exposed wiring, our fully qualified team responds fast.\n\nCall us anytime -- your safety is our priority.\n\nNICEIC registered | Fully insured | Free estimates",
    cta: "call",
  },
  {
    title: "Seasonal Offer",
    postType: "offer",
    content: "Winter electrical safety check -- book this month and receive 15% off.\n\nOur comprehensive check includes:\n- Consumer unit inspection\n- Socket and switch testing\n- Smoke alarm verification\n- Earth bonding check\n\nProtect your home this winter. Limited availability.",
    cta: "book",
  },
  {
    title: "Project Showcase",
    postType: "update",
    content: "Just completed a full house rewire in [area]. The property had original 1960s wiring -- now fitted with a modern 18th Edition consumer unit, LED lighting throughout, and USB sockets in every room.\n\nAnother home made safe and future-proof.\n\nSee our work and get a free quote for your project.",
    cta: "learn",
  },
]

export default function GoogleComposerPage() {
  const [postType, setPostType] = useState("update")
  const [content, setContent] = useState("")
  const [ctaButton, setCtaButton] = useState("none")
  const [ctaUrl, setCtaUrl] = useState("")
  const [copied, setCopied] = useState(false)

  const charCount = content.length
  const charPercent = Math.min((charCount / MAX_CHARS) * 100, 100)
  const isOverLimit = charCount > MAX_CHARS

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API not available
    }
  }

  const loadTemplate = (template: typeof templates[number]) => {
    setPostType(template.postType)
    setContent(template.content)
    setCtaButton(template.cta)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <PenSquare className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">Google Content Composer</h1>
            <p className="text-muted-foreground">Compose Google Business posts with formatting, preview, and copy-to-clipboard</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline">Content Creator</Badge>
          <Badge variant="outline">Marketing Lead</Badge>
          <Badge className="bg-blue-500/20 text-blue-400 border-0">Google Business Posts</Badge>
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
              {/* Post Type */}
              <div className="space-y-2">
                <Label className="text-sm">Post Type</Label>
                <div className="flex gap-2">
                  {postTypes.map((pt) => (
                    <button
                      key={pt.value}
                      onClick={() => setPostType(pt.value)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        postType === pt.value
                          ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
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

              {/* Content */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Content</Label>
                  <span className={`text-xs font-mono ${isOverLimit ? "text-red-400" : "text-muted-foreground"}`}>
                    {charCount} / {MAX_CHARS}
                  </span>
                </div>
                <Textarea
                  placeholder="Write your Google Business post here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={8}
                  className="resize-none"
                />
                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full transition-all ${isOverLimit ? "bg-red-500" : charPercent > 80 ? "bg-amber-500" : "bg-blue-500"}`}
                    style={{ width: `${charPercent}%` }}
                  />
                </div>
              </div>

              {/* CTA */}
              <div className="space-y-2">
                <Label className="text-sm">Call-to-Action Button</Label>
                <div className="flex flex-wrap gap-2">
                  {ctaOptions.map((cta) => (
                    <button
                      key={cta.value}
                      onClick={() => setCtaButton(cta.value)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        ctaButton === cta.value
                          ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                          : "bg-muted text-muted-foreground border border-transparent hover:bg-muted/80"
                      }`}
                    >
                      {cta.label}
                    </button>
                  ))}
                </div>
              </div>

              {ctaButton !== "none" && (
                <div className="space-y-2">
                  <Label className="text-sm">CTA Link URL</Label>
                  <Input
                    placeholder="https://yoursite.com/services"
                    value={ctaUrl}
                    onChange={(e) => setCtaUrl(e.target.value)}
                  />
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button onClick={handleCopy} disabled={!content} className="gap-2">
                  {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied" : "Copy to Clipboard"}
                </Button>
                <Button variant="outline" onClick={() => { setContent(""); setCtaButton("none"); setCtaUrl(""); }} className="bg-transparent">
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          <Card className="border-blue-500/20">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-base flex items-center gap-2">
                <Search className="h-4 w-4 text-blue-500" />
                Google Business Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              {/* Mock Google Business post */}
              <div className="rounded-lg border border-border bg-card p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Megaphone className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Electrical Services</p>
                    <p className="text-xs text-muted-foreground">Just now</p>
                  </div>
                </div>

                {postType !== "update" && (
                  <div className="flex items-center gap-2">
                    {postType === "offer" && <Tag className="h-3.5 w-3.5 text-green-500" />}
                    {postType === "event" && <Calendar className="h-3.5 w-3.5 text-blue-500" />}
                    <Badge className={postType === "offer" ? "bg-green-500/20 text-green-400 border-0 text-xs" : "bg-blue-500/20 text-blue-400 border-0 text-xs"}>
                      {postType === "offer" ? "Special Offer" : "Event"}
                    </Badge>
                  </div>
                )}

                {/* Image placeholder */}
                <div className="w-full aspect-[4/3] rounded-md bg-muted/50 border border-dashed border-border flex items-center justify-center">
                  <div className="text-center">
                    <Image className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">Image preview</p>
                    <p className="text-[10px] text-muted-foreground">1200 x 900px recommended</p>
                  </div>
                </div>

                {/* Post content */}
                <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed min-h-[60px]">
                  {content || <span className="text-muted-foreground italic">Your post content will appear here...</span>}
                </div>

                {/* CTA button */}
                {ctaButton !== "none" && (
                  <div className="pt-2 border-t border-border/50">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-500 text-white text-sm font-medium">
                      <MousePointer className="h-3.5 w-3.5" />
                      {ctaOptions.find((c) => c.value === ctaButton)?.label}
                    </div>
                  </div>
                )}
              </div>

              {isOverLimit && (
                <div className="flex items-center gap-2 mt-3 text-red-400 text-xs">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>Content exceeds 1500 character limit</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Image Guidelines */}
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Image className="h-4 w-4 text-blue-500" />
                Image Specifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1.5">
                {imageGuidelines.map((g) => (
                  <div key={g.spec} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{g.spec}</span>
                    <span className="text-foreground font-medium">{g.value}</span>
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
                  <Badge variant="outline" className="text-[10px]">{tmpl.postType}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4 mb-3">{tmpl.content}</p>
                <Button variant="outline" size="sm" className="bg-transparent w-full" onClick={() => loadTemplate(tmpl)}>
                  Use Template
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Tip */}
      <Card className="border-accent/20 bg-accent/5">
        <CardContent className="flex gap-4 p-5">
          <Lightbulb className="h-5 w-5 text-accent shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Posting Best Practices</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Post to Google Business at least once per week. Include a high-quality photo with every post -- posts with images get significantly more engagement. Use offers and events to drive urgency. Always include a CTA button linking to a relevant page on your website.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Nav */}
      <Card className="border-border/50">
        <CardContent className="flex items-center justify-between p-5 gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/10 shrink-0">
              <Search className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Back to Google Marketing</p>
              <p className="text-xs text-muted-foreground mt-0.5">Explore other Google tools.</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="bg-transparent" asChild>
            <Link href={G}>Overview <ArrowRight className="ml-2 h-3 w-3" /></Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
