import { getContentRouteManifest } from "@/lib/strapi/dashboard/content-library/content-route-manifest";
import { FixActionsClient } from "./_components/fix-actions-client";

export default async function FixActionsPage() {
  const manifest = await getContentRouteManifest();
  return <FixActionsClient manifest={manifest} />;
}
