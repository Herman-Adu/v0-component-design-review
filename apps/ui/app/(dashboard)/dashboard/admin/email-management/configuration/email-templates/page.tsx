import { listEmailTemplates } from "@/lib/strapi/global/email-config/email-template/email-template-repository";
import { EmailTemplatesClient } from "./_components/email-templates-client";

export default async function EmailTemplatesPage() {
  const initialTemplates = await listEmailTemplates().catch(() => []);
  return <EmailTemplatesClient initialTemplates={initialTemplates} />;
}
