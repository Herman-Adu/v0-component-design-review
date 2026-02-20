import type React from "react"
import { Navbar } from "@/components/molecules/navbar"

/**
 * Marketing Layout -- Server Component
 *
 * Used for public-facing pages: homepage, services, contact, quotation.
 * Uses container-constrained Navbar (not fullWidth) for centered content.
 * 
 * Route Group: (marketing) - doesn't affect URL structure
 * URLs stay clean: /services, /contact, etc. (not /(marketing)/services)
 */
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}
