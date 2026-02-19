import { Metadata } from "next"
import { Navbar } from "@/components/molecules/navbar"
import { MultiStepFormContainer } from "@/features/service-request"
import { ElectricCurrent } from "@/components/animations/electric-current"
import { Zap, Home, Building2, Factory, AlertTriangle, ShieldCheck, Clock, Award, Wrench, Lightbulb, Cable, Gauge } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Our Services | Electrical Services",
  description: "Professional electrical services for residential, commercial, and industrial properties. Licensed electricians, 24/7 emergency service, and quality workmanship guaranteed.",
}

const services = [
  {
    icon: Home,
    title: "Residential",
    description: "Complete home electrical solutions including rewiring, panel upgrades, lighting, and smart home installations.",
    features: ["Full house rewiring", "Panel upgrades", "Lighting design", "EV charger installation"],
  },
  {
    icon: Building2,
    title: "Commercial",
    description: "Comprehensive electrical services for offices, retail spaces, and commercial buildings.",
    features: ["Office fit-outs", "Energy audits", "Lighting retrofits", "Data cabling"],
  },
  {
    icon: Factory,
    title: "Industrial",
    description: "Heavy-duty electrical work for manufacturing facilities, warehouses, and industrial sites.",
    features: ["3-phase power", "Motor controls", "PLC systems", "Preventive maintenance"],
  },
  {
    icon: AlertTriangle,
    title: "Emergency",
    description: "24/7 emergency electrical services for urgent repairs and safety concerns.",
    features: ["Power outages", "Electrical faults", "Safety hazards", "Same-day response"],
  },
]

const specializations = [
  { icon: Lightbulb, label: "LED Lighting" },
  { icon: Cable, label: "Rewiring" },
  { icon: Gauge, label: "Panel Upgrades" },
  { icon: Zap, label: "EV Chargers" },
  { icon: Wrench, label: "Repairs" },
  { icon: ShieldCheck, label: "Safety Inspections" },
]

const certifications = [
  { title: "NICEIC Approved", description: "Fully certified and regularly assessed contractor" },
  { title: "Part P Certified", description: "Compliant with Building Regulations" },
  { title: "18th Edition", description: "BS 7671 Wiring Regulations qualified" },
  { title: "Fully Insured", description: "Comprehensive public liability coverage" },
]

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-card to-background border-b border-border overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <ElectricCurrent className="absolute top-10 left-0 w-full h-32" />
          </div>
          <div className="container mx-auto px-4 py-16 md:py-20 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 text-accent text-sm font-medium mb-6">
                <Zap className="w-4 h-4" />
                Professional Electrical Services
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
                Expert Electrical Solutions for Every Need
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                From residential repairs to large-scale industrial installations, our certified electricians deliver safe, reliable, and efficient electrical services.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a 
                  href="#request-service" 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors"
                >
                  <Zap className="w-4 h-4" />
                  Request Service
                </a>
                <Link 
                  href="/quotation" 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border border-border text-foreground rounded-lg font-medium hover:bg-muted transition-colors"
                >
                  Get a Quote
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We provide a comprehensive range of electrical services tailored to meet your specific requirements.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
            {services.map((service) => (
              <div
                key={service.title}
                className="group p-6 rounded-xl bg-card border border-border hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5"
              >
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <service.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="text-xs text-muted-foreground flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Specializations */}
        <section className="bg-muted/30 border-y border-border">
          <div className="container mx-auto px-4 py-12">
            <div className="flex flex-wrap justify-center gap-6 md:gap-12">
              {specializations.map((spec) => (
                <div key={spec.label} className="flex items-center gap-2 text-muted-foreground">
                  <spec.icon className="w-5 h-5 text-accent" />
                  <span className="text-sm font-medium">{spec.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Service Request Form */}
        <section id="request-service" className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <ElectricCurrent className="absolute top-20 left-0 w-full h-48" />
            <ElectricCurrent className="absolute bottom-20 left-0 w-full h-48 rotate-180" />
          </div>
          <div className="container mx-auto px-4 py-16 relative z-10">
            <div className="mx-auto max-w-4xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-2 text-balance">
                  Electrical Service Request
                </h2>
                <p className="text-muted-foreground">
                  Complete the form below to schedule your electrical service
                </p>
              </div>
              <MultiStepFormContainer />
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="bg-card border-y border-border">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose Us</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We are committed to delivering exceptional electrical services with safety, quality, and customer satisfaction at the forefront.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
              {certifications.map((cert) => (
                <div key={cert.title} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{cert.title}</h3>
                  <p className="text-sm text-muted-foreground">{cert.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-3 text-center">
            <div className="p-6 rounded-xl bg-card border border-border">
              <Clock className="w-8 h-8 text-accent mx-auto mb-4" />
              <div className="text-3xl font-bold text-foreground mb-2">24/7</div>
              <p className="text-sm text-muted-foreground">Emergency Service Available</p>
            </div>
            <div className="p-6 rounded-xl bg-card border border-border">
              <ShieldCheck className="w-8 h-8 text-accent mx-auto mb-4" />
              <div className="text-3xl font-bold text-foreground mb-2">100%</div>
              <p className="text-sm text-muted-foreground">Satisfaction Guaranteed</p>
            </div>
            <div className="p-6 rounded-xl bg-card border border-border">
              <Award className="w-8 h-8 text-accent mx-auto mb-4" />
              <div className="text-3xl font-bold text-foreground mb-2">15+</div>
              <p className="text-sm text-muted-foreground">Years of Experience</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-accent/5 border-t border-border">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Need a Detailed Quote?
              </h2>
              <p className="text-muted-foreground mb-6">
                For larger projects or custom requirements, request a comprehensive quotation from our team.
              </p>
              <Link 
                href="/quotation" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors"
              >
                Request Quotation
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
