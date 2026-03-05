import { getContentRouteManifest } from "@/lib/strapi/dashboard/content-library/content-route-manifest";
import { PatternComplianceClient } from "./_components/pattern-compliance-client";

export default async function PatternCompliancePage() {
  const manifest = await getContentRouteManifest();
  return <PatternComplianceClient manifest={manifest} />;
}
