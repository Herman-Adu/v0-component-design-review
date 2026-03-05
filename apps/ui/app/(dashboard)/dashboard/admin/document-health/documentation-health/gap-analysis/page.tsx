import { getContentRouteManifest } from "@/lib/strapi/dashboard/content-library/content-route-manifest";
import { GapAnalysisClient } from "./_components/gap-analysis-client";

export default async function GapAnalysisPage() {
  const manifest = await getContentRouteManifest();
  return <GapAnalysisClient manifest={manifest} />;
}
