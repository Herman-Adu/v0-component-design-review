import { Navbar } from "@/components/molecules/navbar"
import { ElectricCurrent } from "@/components/animations/electric-current"
import { Zap, Home, Building2, Factory, ShieldCheck, Clock, Award, Phone, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <>
    <Navbar />
    <main className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <ElectricCurrent className="absolute top-20 left-0 w-full h-48" />
          <ElectricCurrent className="absolute bottom-40 left-0 w-full h-48 rotate-180" />
        </div>
        <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 text-accent text-sm font-medium mb-6">
              <Zap className="w-4 h-4" fill="currentColor" />
              Trusted Electrical Professionals
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance leading-tight">
              Powering Homes & Businesses with Excellence
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Professional electrical services you can trust. From residential repairs to commercial installations, we deliver safe, reliable, and efficient solutions.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/services" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors"
              >
                <Zap className="w-4 h-4" />
                Our Services
              </Link>
              <Link 
                href="/quotation" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border border-border text-foreground rounded-lg font-medium hover:bg-muted transition-colors"
              >
                Get a Free Quote
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="bg-card border-y border-border">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">What We Do</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Comprehensive electrical solutions for every sector
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
            <div className="p-6 rounded-xl bg-background border border-border hover:border-accent/50 transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <Home className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Residential</h3>
              <p className="text-sm text-muted-foreground">
                Home rewiring, panel upgrades, lighting, and smart home installations.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-background border border-border hover:border-accent/50 transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <Building2 className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Commercial</h3>
              <p className="text-sm text-muted-foreground">
                Office fit-outs, energy audits, lighting retrofits, and data cabling.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-background border border-border hover:border-accent/50 transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <Factory className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Industrial</h3>
              <p className="text-sm text-muted-foreground">
                3-phase power, motor controls, PLC systems, and preventive maintenance.
              </p>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link 
              href="/services" 
              className="inline-flex items-center gap-2 text-accent hover:text-accent/80 font-medium transition-colors"
            >
              View All Services
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-3 text-center">
          <div className="p-6">
            <Clock className="w-10 h-10 text-accent mx-auto mb-4" />
            <div className="text-3xl font-bold text-foreground mb-2">24/7</div>
            <p className="text-sm text-muted-foreground">Emergency Service</p>
          </div>
          <div className="p-6">
            <ShieldCheck className="w-10 h-10 text-accent mx-auto mb-4" />
            <div className="text-3xl font-bold text-foreground mb-2">100%</div>
            <p className="text-sm text-muted-foreground">Satisfaction Guaranteed</p>
          </div>
          <div className="p-6">
            <Award className="w-10 h-10 text-accent mx-auto mb-4" />
            <div className="text-3xl font-bold text-foreground mb-2">15+ Years</div>
            <p className="text-sm text-muted-foreground">Industry Experience</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-accent/5 border-t border-border">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-muted-foreground mb-8">
              Whether you need a simple repair or a complete electrical installation, our team is ready to help.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/services#request-service" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors"
              >
                <Zap className="w-4 h-4" />
                Request Service
              </Link>
              <Link 
                href="/contact" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border border-border text-foreground rounded-lg font-medium hover:bg-muted transition-colors"
              >
                <Phone className="w-4 h-4" />
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
    </>
  )
}
