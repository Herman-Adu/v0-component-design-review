import { listTemplateSubjects } from "@/lib/strapi/global/email-config/ab-subject-variant/ab-subject-variant-repository"
import { ABSubjectLinesClient } from "./_components/ab-subject-lines-client"

export default async function ABSubjectLinesPage() {
  const initialTemplates = await listTemplateSubjects().catch(() => [])

  return <ABSubjectLinesClient initialTemplates={initialTemplates} />
}
