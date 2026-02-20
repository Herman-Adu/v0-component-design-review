import type { Metadata } from "next"
import { CodeReviewClientPage } from "./client-page"

export const metadata: Metadata = {
  title: "Code Review Log | Dashboard",
  description: "Production code review findings, refactoring guide, and improvement tracking.",
}

export default function CodeReviewPage() {
  return <CodeReviewClientPage />
}
