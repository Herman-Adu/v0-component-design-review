import { getSchedulerConfig } from "@/lib/strapi/global/email-config/scheduler-config/scheduler-config-repository"
import { listScheduledEmails, getQueueStats } from "@/lib/strapi/global/email-config/scheduled-email/scheduled-email-repository"
import { EmailSchedulingClient } from "./_components/email-scheduling-client"

export default async function EmailSchedulingPage() {
  const [initialConfig, initialEmails, initialStats] = await Promise.all([
    getSchedulerConfig().catch(() => null),
    listScheduledEmails().catch(() => []),
    getQueueStats().catch(() => ({ queued: 0, scheduled: 0, sent: 0, failed: 0, cancelled: 0, total: 0 })),
  ])

  return (
    <EmailSchedulingClient
      initialConfig={initialConfig}
      initialEmails={initialEmails}
      initialStats={initialStats}
    />
  )
}
