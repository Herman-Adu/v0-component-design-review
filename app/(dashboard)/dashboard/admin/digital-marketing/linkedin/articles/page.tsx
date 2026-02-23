import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  FileText,
  ArrowRight,
  Share2,
  CheckCircle2,
  Lightbulb,
  BookOpen,
  Target,
  Clock,
  Image,
  Type,
} from "lucide-react"

const LI = "/dashboard/admin/digital-marketing/linkedin"

const articleTypes = [
  {
    title: "Project Case Study",
    audience: "Commercial clients, property managers",
    length: "1,200-1,800 words",
    structure: "Problem > Approach > Solution > Results",
    description: "Showcase a completed project in detail. Builds credibility by demonstrating expertise, problem-solving, and measurable outcomes.",
  },
  {
    title: "Technical How-To",
    audience: "Other trades, facility managers, architects",
    length: "800-1,200 words",
    structure: "Introduction > Steps > Key Considerations > Summary",
    description: "Share technical expertise on a topic your audience cares about. Positions you as a subject matter expert.",
  },
  {
    title: "Industry Insight",
    audience: "Decision-makers, building owners, compliance officers",
    length: "600-1,000 words",
    structure: "Trend/Regulation > Impact > Action Steps > Conclusion",
    description: "Comment on regulations, industry trends, or safety standards. Demonstrates you stay current and think strategically.",
  },
  {
    title: "Behind the Business",
    audience: "Potential employees, clients who value culture",
    length: "600-800 words",
    structure: "Story > Values > Team > Future Vision",
    description: "Share your company culture, team achievements, or business milestones. Humanises your brand and attracts talent.",
  },
]

const caseStudyTemplate = {
  title: "[Project Type] at [Location]: A Complete [Service] Case Study",
  sections: [
    { heading: "The Challenge", content: "Describe the client's problem, the property context, and any constraints (age of building, live environment, timeline)." },
    { heading: "Our Approach", content: "Explain your assessment process, the solution you proposed, and why you chose that approach. Mention relevant standards (BS 7671, 18th Edition)." },
    { heading: "The Work", content: "Detail the key deliverables: what was installed, replaced, or upgraded. Include technical specifics that demonstrate expertise." },
    { heading: "The Results", content: "Quantify outcomes where possible: energy savings, compliance achieved, safety improvements, client satisfaction." },
    { heading: "Key Takeaways", content: "3-4 bullet points that the reader can apply to their own situation. End with a soft CTA." },
  ],
}

const repurposeGuide = [
  {
    source: "Learning Hub Articles",
    how: "Adapt technical articles for a LinkedIn audience. Shorten, add a personal perspective, and include a company CTA.",
  },
  {
    source: "Case Studies",
    how: "Expand case study summaries into full narratives. Add context, challenges faced, and lessons learned.",
  },
  {
    source: "Social Media Posts",
    how: "A high-performing post can become an article. Expand the core idea with detail, examples, and data.",
  },
  {
    source: "Customer Testimonials",
    how: "Build a case study article around a strong testimonial. Add the backstory and technical details.",
  },
]

const seoTips = [
  "Include your target keyword in the article title",
  "Use descriptive headings with H2 tags (LinkedIn supports basic formatting)",
  "Add a cover image -- articles with images get 94% more views",
  "Cover image recommended size: 744 x 400 pixels",
  "Include 3-5 relevant tags when publishing",
  "End with a clear call-to-action and your contact details",
  "Publish on Tuesday, Wednesday, or Thursday mornings for maximum reach",
  "Share the article as a post with a compelling excerpt to drive reads",
]

export default function LinkedInArticlesPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20">
            <FileText className="h-5 w-5 text-sky-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
              Article Publisher
            </h1>
            <p className="text-muted-foreground">
              Long-form thought leadership templates for LinkedIn's publishing platform
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline">Content Creator</Badge>
          <Badge variant="outline">Business Owner</Badge>
          <Badge className="bg-sky-500/20 text-sky-400 border-0">LinkedIn Articles</Badge>
        </div>
      </div>

      {/* Why Articles */}
      <Card className="border-sky-500/20 bg-sky-500/5">
        <CardContent className="flex gap-4 p-5">
          <BookOpen className="h-5 w-5 text-sky-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Why Publish LinkedIn Articles?</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              LinkedIn articles live permanently on your profile, are indexed by Google, and establish you as a thought leader. Unlike posts that disappear from feeds in 48 hours, articles continue generating views for months. They're ideal for in-depth case studies, technical guidance, and industry commentary.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Article Types */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Article Types</h2>
        <div className="responsive-grid-2">
          {articleTypes.map((type) => (
            <Card key={type.title} className="border-border/50">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-foreground text-sm">{type.title}</p>
                  <Badge variant="outline" className="text-[10px]">{type.length}</Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{type.description}</p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs">
                    <Target className="h-3 w-3 text-sky-500" />
                    <span className="text-muted-foreground"><span className="text-foreground font-medium">Audience:</span> {type.audience}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Type className="h-3 w-3 text-sky-500" />
                    <span className="text-muted-foreground"><span className="text-foreground font-medium">Structure:</span> {type.structure}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Case Study Template */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4 text-sky-500" />
            Case Study Article Template
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-2">
            <span className="text-foreground font-medium">Suggested title format: </span>
            {caseStudyTemplate.title}
          </p>
          <div className="space-y-4 mt-4">
            {caseStudyTemplate.sections.map((section, i) => (
              <div key={section.heading} className="flex gap-4">
                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-sky-500/10 text-sky-400 text-xs font-bold shrink-0">
                  {i + 1}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{section.heading}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{section.content}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content Repurposing */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Content Repurposing Guide</h2>
        <p className="text-sm text-muted-foreground mb-4">
          You already have content in your Learning Hub and social media tools. Here is how to repurpose it for LinkedIn articles.
        </p>
        <div className="responsive-grid-2">
          {repurposeGuide.map((item) => (
            <Card key={item.source} className="border-border/50">
              <CardContent className="p-5">
                <p className="font-semibold text-foreground text-sm mb-1">{item.source}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.how}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* SEO & Publishing Tips */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-sky-500" />
            Publishing Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2.5">
            {seoTips.map((tip) => (
              <div key={tip} className="flex items-start gap-2.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-sky-500 shrink-0 mt-0.5" />
                <span className="text-xs text-muted-foreground leading-relaxed">{tip}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Image Specs */}
      <Card className="border-border/50">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Image className="h-4 w-4 text-sky-500" />
            <h3 className="text-sm font-semibold text-foreground">Article Image Specifications</h3>
          </div>
          <div className="space-y-2">
            {[
              { spec: "Cover image", value: "744 x 400 pixels" },
              { spec: "In-article images", value: "Max 700px wide, auto-scaled" },
              { spec: "Formats", value: "JPG, PNG, GIF" },
              { spec: "Max images per article", value: "No strict limit (keep reasonable)" },
            ].map((item) => (
              <div key={item.spec} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{item.spec}</span>
                <span className="text-foreground font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Publishing Cadence */}
      <Card className="border-accent/20 bg-accent/5">
        <CardContent className="flex gap-4 p-5">
          <Clock className="h-5 w-5 text-accent shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Recommended Publishing Cadence</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Publish 1-2 articles per month. Quality matters far more than quantity for long-form content. One well-researched case study with project photos will outperform four rushed opinion pieces. Tie your article schedule to your project completion calendar -- every finished project is a potential article.
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
