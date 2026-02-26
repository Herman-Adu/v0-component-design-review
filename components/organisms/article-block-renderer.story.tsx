import React from "react";

import { ContentBlockRenderer } from "@/components/organisms/content-block-renderer";
import { sampleArticleBlocks } from "@/components/organisms/article-block-renderer.samples";

export function ContentBlockRendererStory() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">
          Content Block Renderer
        </h2>
        <p className="text-muted-foreground">
          This story renders a complete sample of supported content blocks.
        </p>
      </header>
      <ContentBlockRenderer blocks={sampleArticleBlocks} />
    </section>
  );
}
