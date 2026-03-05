import { getContentRouteManifest } from "@/lib/strapi/dashboard/content-library/content-route-manifest";
import { DocumentationHealthClient } from "./_components/documentation-health-client";

export default async function DocumentationHealthPage() {
  const manifest = await getContentRouteManifest();
  return <DocumentationHealthClient manifest={manifest} />;
}
