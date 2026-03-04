import React from "react";

import { ContentBlockRenderer } from "@/components/organisms/content-block-renderer";
import { sampleArticleBlocks } from "@/components/organisms/article-block-renderer.samples";

export default function ContentBlockRendererHarnessPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Content Block Renderer Harness
        </h1>
        <p className="text-muted-foreground">
          This page renders a complete sample set of content blocks to validate
          layout, composition, and prop normalization.
        </p>
      </header>

      <ContentBlockRenderer blocks={sampleArticleBlocks} />
    </div>
  );
}
