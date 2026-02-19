import { Metadata } from "next"
import { Navbar } from "@/components/molecules/navbar"
import { QuotationFormContainer } from "@/features/quotation"

export const metadata: Metadata = {
  title: "Request a Quotation | Electrical Services",
  description: "Get a detailed quotation for your residential, commercial, or industrial electrical project. Our expert team will review your requirements and provide a comprehensive quote.",
}

export default function QuotationPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Header Section */}
        <section className="bg-gradient-to-b from-card to-background border-b border-border">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Request a Quotation
              </h1>
              <p className="text-lg text-muted-foreground">
                Tell us about your project and receive a detailed, no-obligation quote from our experienced team.
              </p>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <QuotationFormContainer />
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="border-t border-border bg-muted/30">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-3 text-center">
              <div>
                <div className="text-3xl font-bold text-accent mb-2">15+</div>
                <p className="text-sm text-muted-foreground">Years of Experience</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent mb-2">500+</div>
                <p className="text-sm text-muted-foreground">Projects Completed</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent mb-2">100%</div>
                <p className="text-sm text-muted-foreground">Certified Electricians</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2">How long does it take to receive a quotation?</h3>
                <p className="text-muted-foreground text-sm">
                  We typically respond within 2-5 business days with a detailed quotation. Urgent projects may receive faster responses.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Is the quotation free?</h3>
                <p className="text-muted-foreground text-sm">
                  Yes, all quotations are completely free and come with no obligation. Complex projects may require a site visit.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">What information do you need from me?</h3>
                <p className="text-muted-foreground text-sm">
                  The more detail you can provide about your project, the more accurate our quotation will be. Include scope, timeline, and any specific requirements.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Do you handle all types of electrical work?</h3>
                <p className="text-muted-foreground text-sm">
                  Yes, we handle residential, commercial, and industrial projects of all sizes, from simple installations to complete electrical systems.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
