import { listTemplateSubjects } from "@/lib/strapi/global/email-config/ab-subject-variant/ab-subject-variant-repository"
import { listEmailTemplates } from "@/lib/strapi/global/email-config/email-template/email-template-repository"
import { ABSubjectLinesClient } from "./_components/ab-subject-lines-client"

export default async function ABSubjectLinesPage() {
  const [initialTemplates, emailTemplates] = await Promise.all([
    listTemplateSubjects().catch(() => []),
    listEmailTemplates().catch(() => []),
  ])

  return <ABSubjectLinesClient initialTemplates={initialTemplates} emailTemplates={emailTemplates} />
}
