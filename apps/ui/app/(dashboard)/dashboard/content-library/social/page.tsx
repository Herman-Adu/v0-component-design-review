"use client";

import { useState } from "react";
import { Copy, CheckCircle2 } from "lucide-react";
import { socialPosts } from "./data"; // Assuming hashtags are imported from a separate data file
import socialListData from "@/data/strapi-mock/dashboard/content-library/social-list.json";
import type { SocialListContent } from "@/types/dashboard";

// Type the imported JSON
const typedSocialListData = socialListData as SocialListContent;

export default function SocialMediaPage() {
  const [filter, setFilter] = useState<
    "all" | "beginner" | "intermediate" | "advanced"
  >("all");
  const [platform, setPlatform] = useState<
    "all" | "LinkedIn" | "Twitter/X" | "Facebook"
  >("all");
  const [copied, setCopied] = useState<string | null>(null);

  const filteredPosts = socialPosts.filter((post) => {
    const levelMatch = filter === "all" || post.level === filter;
    const platformMatch = platform === "all" || post.platform === platform;
    return levelMatch && platformMatch;
  });

  const copyToClipboard = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Social Media Posts
        </h1>
        <p className="text-xl text-muted-foreground">
          Ready-to-post content for LinkedIn, Twitter/X, and Facebook. Copy,
          customize, and share your learnings.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Experience Level
          </label>
          <div className="flex gap-2">
            {["all", "beginner", "intermediate", "advanced"].map((level) => (
              <button
                key={level}
                onClick={() => setFilter(level as typeof filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === level
                    ? "bg-accent text-accent-foreground"
                    : "bg-card text-muted-foreground hover:bg-muted"
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Platform
          </label>
          <div className="flex gap-2">
            {["all", "LinkedIn", "Twitter/X", "Facebook"].map((p) => (
              <button
                key={p}
                onClick={() => setPlatform(p as typeof platform)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  platform === p
                    ? "bg-accent text-accent-foreground"
                    : "bg-card text-muted-foreground hover:bg-muted"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid gap-6">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-card border border-border rounded-lg p-6 space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-accent/10 text-accent text-xs font-medium rounded">
                    {post.platform}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      post.level === "beginner"
                        ? "bg-green-500/10 text-green-500"
                        : post.level === "intermediate"
                          ? "bg-yellow-500/10 text-yellow-500"
                          : "bg-red-500/10 text-red-500"
                    }`}
                  >
                    {post.level.charAt(0).toUpperCase() + post.level.slice(1)}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {post.excerpt}
                </p>
              </div>
              <button
                onClick={() =>
                  copyToClipboard(
                    post.content + "\n\n" + post.hashtags.join(" "),
                    post.id,
                  )
                }
                className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
              >
                {copied === post.id ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-sm font-medium">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span className="text-sm font-medium">Copy Post</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-background/50 border border-border rounded-lg p-4">
              <pre className="text-sm text-foreground whitespace-pre-wrap font-sans">
                {post.content}
              </pre>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm text-accent font-medium">
                  {post.hashtags.join(" ")}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
