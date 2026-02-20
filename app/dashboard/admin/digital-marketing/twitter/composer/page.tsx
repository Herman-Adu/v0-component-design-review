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
  AlertTriangle,
  Lightbulb,
  Hash,
  Type,
  AtSign,
} from "lucide-react"

const TW = "/dashboard/admin/digital-marketing/twitter"
const MAX_CHARS = 280

const tweetTypes = [
  { value: "tip", label: "Safety Tip", description: "Quick electrical safety advice" },
  { value: "project", label: "Project Update", description: "Before/after or completion post" },
  { value: "promo", label: "Promotion", description: "Service offer or seasonal campaign" },
  { value: "engagement", label: "Engagement", description: "Question, poll prompt, or community interaction" },
]

const templates = [
  {
    title: "Safety Tip",
    type: "tip",
    content: `Flickering lights? Don't ignore them.

Common causes:
- Loose connections
- Overloaded circuit
- Faulty switch

If it persists, call a qualified electrician. It could be a fire risk.

#ElectricalSafety #Electrician`,
  },
  {
    title: "Project Completion",
    type: "project",
    content: `Just finished a full rewire on a 1930s property in [Location].

3 days. Zero disruption to the tenants. NICEIC certified.

Another safe home.

#Rewire #NICEIC #Electrician`,
  },
  {
    title: "Emergency Availability",
    type: "promo",
    content: `Power out? We're available 24/7 for emergency callouts across [Area].

Fast response. Fair pricing. Fully certified.

Call us: [Number]

#EmergencyElectrician #24Hour`,
  },
]

export default function TweetComposerPage() {
  const [tweetType, setTweetType] = useState("tip")
  const [content, setContent] = useState("")
  const [copied, setCopied] = useState(false)

  const charCount = content.length
  const charPercent = Math.min((charCount / MAX_CHARS) * 100, 100)
  const isOverLimit = charCount > MAX_CHARS
  const remaining = MAX_CHARS - charCount
  const hashtagCount = (content.match(/#\w+/g) || []).length
  const mentionCount = (content.match(/@\w+/g) || []).length

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* clipboard unavailable */ }
  }

  const loadTemplate = (tmpl: (typeof templates)[number]) => {
    setTweetType(tmpl.type)
    setContent(tmpl.content)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <PenSquare className="h-5 w-5 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
              Tweet Composer
            </h1>
            <p className="text-muted-foreground">
              Compose tweets with real-time character count, preview, and copy-to-clipboard
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline">Content Creator</Badge>
          <Badge className="bg-emerald-500/20 text-emerald-400 border-0">280 Characters</Badge>
        </div>
      </div>

      {/* Composer + Preview */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Composer */}
        <div className="space-y-6">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Compose Tweet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Type selector */}
              <div className="space-y-2">
                <Label className="text-sm">Tweet Type</Label>
                <div className="flex flex-wrap gap-2">
                  {tweetTypes.map((tt) => (
                    <button
                      key={tt.value}
                      onClick={() => setTweetType(tt.value)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        tweetType === tt.value
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-muted text-muted-foreground border border-transparent hover:bg-muted/80"
                      }`}
                    >
                      {tt.label}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {tweetTypes.find((t) => t.value === tweetType)?.description}
                </p>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Content</Label>
                  <span className={`text-xs font-mono ${isOverLimit ? "text-red-400" : remaining <= 20 ? "text-amber-400" : "text-muted-foreground"}`}>
                    {remaining} remaining
                  </span>
                </div>
                <Textarea
                  placeholder="What's happening?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                  className="resize-none font-mono text-sm"
                />
                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full transition-all ${isOverLimit ? "bg-red-500" : charPercent > 90 ? "bg-amber-500" : "bg-emerald-500"}`}
                    style={{ width: `${charPercent}%` }}
                  />
                </div>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Hash className="h-3 w-3" />{hashtagCount} hashtag{hashtagCount !== 1 ? "s" : ""}</span>
                  <span className="flex items-center gap-1"><AtSign className="h-3 w-3" />{mentionCount} mention{mentionCount !== 1 ? "s" : ""}</span>
                  <span className="flex items-center gap-1"><Type className="h-3 w-3" />{charCount} chars</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button onClick={handleCopy} disabled={!content} className="gap-2">
                  {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied" : "Copy Tweet"}
                </Button>
                <Button variant="outline" onClick={() => { setContent(""); setTweetType("tip") }} className="bg-transparent">
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <Card className="border-emerald-500/20">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="h-4 w-4 text-emerald-500" />
                Tweet Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="rounded-lg border border-border bg-card p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Globe className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="text-sm font-bold text-foreground">Electrical Services</p>
                      <span className="text-xs text-muted-foreground">@YourHandle</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Just now</p>
                  </div>
                </div>
                <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed min-h-[60px]">
                  {content || <span className="text-muted-foreground italic">Your tweet will appear here...</span>}
                </div>
                {/* Image placeholder */}
                <div className="w-full aspect-video rounded-md bg-muted/50 border border-dashed border-border flex items-center justify-center">
                  <div className="text-center">
                    <Image className="h-6 w-6 text-muted-foreground mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">1200 x 675px</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs text-muted-foreground">
                  <span>Reply</span><span>Repost</span><span>Like</span><span>Bookmark</span><span>Share</span>
                </div>
              </div>

              {isOverLimit && (
                <div className="flex items-center gap-2 mt-3 text-red-400 text-xs">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>Tweet exceeds 280 character limit by {charCount - MAX_CHARS} characters</span>
                </div>
              )}
              {hashtagCount > 2 && (
                <div className="flex items-center gap-2 mt-2 text-amber-400 text-xs">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>Twitter recommends 1-2 hashtags per tweet. You have {hashtagCount}.</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Tweet Best Practices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  "Keep tweets under 240 chars for retweet room",
                  "Use 1-2 hashtags max -- more reduces engagement",
                  "Add an image -- tweets with images get 150% more retweets",
                  "Front-load the key message -- feeds move fast",
                  "Use line breaks for readability on mobile",
                ].map((tip) => (
                  <div key={tip} className="flex items-start gap-2.5">
                    <Lightbulb className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
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
        <h2 className="text-xl font-semibold text-foreground mb-4">Tweet Templates</h2>
        <div className="responsive-grid-3">
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
                <p className="text-[10px] text-muted-foreground mb-2">{tmpl.content.length} / 280 chars</p>
                <Button variant="outline" size="sm" className="bg-transparent w-full" onClick={() => loadTemplate(tmpl)}>
                  Use Template
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Nav */}
      <Card className="border-border/50">
        <CardContent className="flex items-center justify-between p-5 gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500/10 shrink-0">
              <Globe className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Back to Twitter/X Marketing</p>
              <p className="text-xs text-muted-foreground mt-0.5">Explore other Twitter tools.</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="bg-transparent" asChild>
            <Link href={TW}>Overview <ArrowRight className="ml-2 h-3 w-3" /></Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
