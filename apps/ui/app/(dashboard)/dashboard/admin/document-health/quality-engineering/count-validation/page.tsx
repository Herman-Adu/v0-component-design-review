import { getContentRouteManifest } from "@/lib/strapi/dashboard/content-library/content-route-manifest";
import { CountValidationClient } from "./_components/count-validation-client";

export default async function CountValidationPage() {
  const manifest = await getContentRouteManifest();
  return <CountValidationClient manifest={manifest} />;
}
