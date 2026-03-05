import { getCompanySettings } from "@/lib/strapi/global/company-settings/company-settings"
import { getEmailSettings } from "@/lib/strapi/global/email-settings/email-settings"
import { TemplateBrandForm } from "./_components/template-brand-form"

export default async function TemplateBrandPage() {
  const [initialCompany, initialEmailSettings] = await Promise.all([
    getCompanySettings().catch(() => null),
    getEmailSettings().catch(() => null),
  ])

  return (
    <TemplateBrandForm
      initialCompany={initialCompany}
      initialEmailSettings={initialEmailSettings}
    />
  )
}
