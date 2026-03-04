import type React from "react"

/**
 * Marketing Layout
 * Used for public-facing pages (homepage, services, contact, etc.)
 */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Marketing pages use root layout's Navbar */}
      {children}
    </>
  )
}
