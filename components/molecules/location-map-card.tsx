/**
 * MOLECULE: LocationMapCard
 * 
 * Displays office location with embedded map and contact details
 */

"use client"

import { MapPin, Phone, Mail, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LocationMapCardProps {
  address?: {
    line1: string
    line2?: string
    city: string
    county?: string
    postcode: string
    country: string
  }
  phone?: string
  email?: string
  mapEmbedUrl?: string
}

const defaultAddress = {
  line1: "123 Electrical House",
  line2: "Technology Park",
  city: "London",
  county: "Greater London",
  postcode: "EC1A 1BB",
  country: "United Kingdom",
}

const defaultMapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2482.4052837899345!2d-0.09684168422946!3d51.51851327963568!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761b4c8f9b3d17%3A0x5f9f9f7c7c7c7c7c!2sLondon%2C%20UK!5e0!3m2!1sen!2suk!4v1234567890"

export function LocationMapCard({
  address = defaultAddress,
  phone = "020 7123 4567",
  email = "info@electricalservices.co.uk",
  mapEmbedUrl = defaultMapUrl,
}: LocationMapCardProps) {
  const fullAddress = [
    address.line1,
    address.line2,
    address.city,
    address.county,
    address.postcode,
    address.country,
  ].filter(Boolean).join(", ")

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`

  return (
    <div className="rounded-xl bg-card/80 backdrop-blur-sm border border-border/50 overflow-hidden">
      {/* Map */}
      <div className="relative h-48 bg-muted">
        <iframe
          src={mapEmbedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Office Location"
          className="absolute inset-0"
        />
        {/* Overlay for styling */}
        <div className="absolute inset-0 pointer-events-none border-b border-border/50" />
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-accent" />
          <h3 className="font-semibold text-foreground">Our Location</h3>
        </div>

        {/* Address */}
        <div className="space-y-1">
          <p className="text-sm text-foreground">{address.line1}</p>
          {address.line2 && <p className="text-sm text-foreground">{address.line2}</p>}
          <p className="text-sm text-muted-foreground">
            {address.city}, {address.county && `${address.county}, `}{address.postcode}
          </p>
          <p className="text-sm text-muted-foreground">{address.country}</p>
        </div>

        {/* Contact Details */}
        <div className="space-y-2 pt-2 border-t border-border/50">
          <a 
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
          >
            <Phone className="h-4 w-4" />
            {phone}
          </a>
          <a 
            href={`mailto:${email}`}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
          >
            <Mail className="h-4 w-4" />
            {email}
          </a>
        </div>

        {/* Get Directions Button */}
        <Button
          variant="outline"
          size="sm"
          className="w-full bg-transparent"
          asChild
        >
          <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-2" />
            Get Directions
          </a>
        </Button>
      </div>
    </div>
  )
}
