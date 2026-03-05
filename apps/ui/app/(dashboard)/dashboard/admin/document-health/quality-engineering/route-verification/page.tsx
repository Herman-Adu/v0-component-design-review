import { getContentRouteManifest } from "@/lib/strapi/dashboard/content-library/content-route-manifest";
import { RouteVerificationClient } from "./_components/route-verification-client";

export default async function RouteVerificationPage() {
  const manifest = await getContentRouteManifest();
  return <RouteVerificationClient manifest={manifest} />;
}
