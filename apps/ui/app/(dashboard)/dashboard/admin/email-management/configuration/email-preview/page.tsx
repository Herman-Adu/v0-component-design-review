import { listEmailTemplates } from "@/lib/strapi/global/email-config/email-template/email-template-repository"
import { EmailPreviewClient } from "./_components/email-preview-client"

export default async function EmailPreviewPage() {
  const initialTemplates = await listEmailTemplates().catch(() => [])
  return <EmailPreviewClient initialTemplates={initialTemplates} />
}
