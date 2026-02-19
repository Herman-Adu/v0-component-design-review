"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  FileText,
  ArrowRight,
  Globe,
  Copy,
  CheckCircle2,
  Plus,
  Trash2,
  AlertTriangle,
  Lightbulb,
} from "lucide-react"

const TW = "/dashboard/admin/digital-marketing/twitter"
const MAX_CHARS = 280

const threadTemplates = [
  {
    title: "Educational Thread",
    tweets: [
      "Why your fuse board might be a fire risk (thread)\n\nIf your consumer unit is more than 15 years old, it might not meet current safety standards. Here's what you need to know:",
      "1/ Old fuse boards often use rewirable fuses instead of MCBs. These don't trip automatically -- they can overheat and cause fires.",
      "2/ Modern boards use RCDs (Residual Current Devices) that detect earth faults in milliseconds. Most old boards don't have these.",
      "3/ Since the 18th Edition (2018), new installations must include surge protection. Lightning strikes and power surges can destroy electronics.",
      "4/ A consumer unit upgrade typically takes half a day and costs [price range]. It's one of the highest-impact safety improvements you can make.\n\nDM me for a free assessment.",
    ],
  },
  {
    title: "Project Showcase",
    tweets: [
      "Just completed a full commercial rewire for a [type] in [location]. Here's what went into it (thread):",
      "1/ The challenge: [describe scope]. Original wiring was [age] years old with [issue]. Full rewire was the only safe option.",
      "2/ We installed: [key deliverables]. All circuits now RCD protected with RCBO configuration.",
      "3/ Testing complete: insulation resistance, loop impedance, RCD trip times all within spec. NICEIC certificate issued.",
      "4/ Client feedback: [quote]. Another safe property, another satisfied client.\n\nNeed commercial electrical work? Get in touch.",
    ],
  },
]

export default function ThreadBuilderPage() {
  const [tweets, setTweets] = useState<string[]>([""])
  const [copiedAll, setCopiedAll] = useState(false)

  const addTweet = () => setTweets([...tweets, ""])
  const removeTweet = (idx: number) => setTweets(tweets.filter((_, i) => i !== idx))
  const updateTweet = (idx: number, val: string) => {
    const updated = [...tweets]
    updated[idx] = val
    setTweets(updated)
  }

  const loadTemplate = (tmpl: (typeof threadTemplates)[number]) => {
    setTweets([...tmpl.tweets])
  }

  const handleCopyAll = async () => {
    const full = tweets.map((t, i) => `[${i + 1}/${tweets.length}]\n${t}`).join("\n\n---\n\n")
    try {
      await navigator.clipboard.writeText(full)
      setCopiedAll(true)
      setTimeout(() => setCopiedAll(false), 2000)
    } catch { /* clipboard unavailable */ }
  }

  const totalChars = tweets.reduce((sum, t) => sum + t.length, 0)
  const overLimitTweets = tweets.filter((t) => t.length > MAX_CHARS)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <FileText className="h-5 w-5 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
              Thread Builder
            </h1>
            <p className="text-muted-foreground">
              Build multi-tweet threads with per-tweet character tracking and full thread preview
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline">Content Creator</Badge>
          <Badge className="bg-emerald-500/20 text-emerald-400 border-0">{tweets.length} Tweet{tweets.length !== 1 ? "s" : ""}</Badge>
          {overLimitTweets.length > 0 && (
            <Badge className="bg-red-500/20 text-red-400 border-0">{overLimitTweets.length} Over Limit</Badge>
          )}
        </div>
      </div>

      {/* Builder + Preview */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Builder */}
        <div className="space-y-4">
          {tweets.map((tweet, idx) => {
            const count = tweet.length
            const over = count > MAX_CHARS
            return (
              <Card key={idx} className={`border-border/50 ${over ? "border-red-500/30" : ""}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">Tweet {idx + 1} of {tweets.length}</CardTitle>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-mono ${over ? "text-red-400" : "text-muted-foreground"}`}>
                        {count}/{MAX_CHARS}
                      </span>
                      {tweets.length > 1 && (
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => removeTweet(idx)}>
                          <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder={idx === 0 ? "Start your thread with a hook..." : `Tweet ${idx + 1}...`}
                    value={tweet}
                    onChange={(e) => updateTweet(idx, e.target.value)}
                    rows={4}
                    className="resize-none font-mono text-sm"
                  />
                  <div className="w-full bg-muted rounded-full h-1 overflow-hidden mt-2">
                    <div
                      className={`h-full transition-all ${over ? "bg-red-500" : count > MAX_CHARS * 0.9 ? "bg-amber-500" : "bg-emerald-500"}`}
                      style={{ width: `${Math.min((count / MAX_CHARS) * 100, 100)}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            )
          })}

          <div className="flex gap-3">
            <Button variant="outline" onClick={addTweet} className="bg-transparent gap-2">
              <Plus className="h-4 w-4" /> Add Tweet
            </Button>
            <Button onClick={handleCopyAll} disabled={totalChars === 0} className="gap-2">
              {copiedAll ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copiedAll ? "Copied Thread" : "Copy All"}
            </Button>
            <Button variant="outline" onClick={() => setTweets([""])} className="bg-transparent">Clear</Button>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <Card className="border-emerald-500/20">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="h-4 w-4 text-emerald-500" />
                Thread Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              {tweets.map((tweet, idx) => (
                <div key={idx} className="relative">
                  {idx < tweets.length - 1 && (
                    <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-emerald-500/20" />
                  )}
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-emerald-500">{idx + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-sm font-bold text-foreground">Electrical Services</span>
                        <span className="text-xs text-muted-foreground">@YourHandle</span>
                      </div>
                      <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed min-h-[24px]">
                        {tweet || <span className="text-muted-foreground italic">Tweet {idx + 1}...</span>}
                      </p>
                      {tweet.length > MAX_CHARS && (
                        <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Over by {tweet.length - MAX_CHARS} chars
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Thread Best Practices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  "Open with a hook that makes people want to read on",
                  "Keep threads to 5-10 tweets for optimal engagement",
                  "Number your tweets (1/, 2/, 3/) for clarity",
                  "End with a clear call-to-action",
                  "Add (thread) to the first tweet so people know to expect more",
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
        <h2 className="text-xl font-semibold text-foreground mb-4">Thread Templates</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {threadTemplates.map((tmpl) => (
            <Card key={tmpl.title} className="border-border/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{tmpl.title}</CardTitle>
                  <Badge variant="outline" className="text-[10px]">{tmpl.tweets.length} tweets</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-3">
                  {tmpl.tweets.slice(0, 3).map((t, i) => (
                    <p key={i} className="text-xs text-muted-foreground font-mono line-clamp-1">
                      {i + 1}/ {t}
                    </p>
                  ))}
                  {tmpl.tweets.length > 3 && (
                    <p className="text-xs text-muted-foreground">+{tmpl.tweets.length - 3} more tweets</p>
                  )}
                </div>
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
