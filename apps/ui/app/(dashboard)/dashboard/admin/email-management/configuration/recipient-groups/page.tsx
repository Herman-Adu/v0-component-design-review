import { listRecipientGroups } from "@/lib/strapi/global/email-config/recipient-group/recipient-group-repository"
import { RecipientGroupsClient } from "./_components/recipient-groups-client"

export default async function RecipientGroupsPage() {
  const initialGroups = await listRecipientGroups().catch(() => [])

  return <RecipientGroupsClient initialGroups={initialGroups} />
}
