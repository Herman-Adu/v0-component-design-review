import { Metadata } from "next";
import { Navbar } from "@/components/molecules/navbar";
import { QuotationFormContainer } from "@/features/quotation";
import quotationData from "@/data/strapi-mock/marketing/quotation.json";
import type { MarketingQuotationContent } from "@/types/marketing";

export const metadata: Metadata = {
  title: "Request a Quotation | Electrical Services",
  description:
    "Get a detailed quotation for your residential, commercial, or industrial electrical project. Our expert team will review your requirements and provide a comprehensive quote.",
};

const quotationContent = quotationData as MarketingQuotationContent;
const { header, trustIndicators, faq } = quotationContent;

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
                {header.title}
              </h1>
              <p className="text-lg text-muted-foreground">
                {header.description}
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
              {trustIndicators.map((item) => (
                <div key={item.label}>
                  <div className="text-3xl font-bold text-accent mb-2">
                    {item.value}
                  </div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">
              {faq.title}
            </h2>
            <div className="space-y-6">
              {faq.items.map((item) => (
                <div key={item.question}>
                  <h3 className="font-semibold text-foreground mb-2">
                    {item.question}
                  </h3>
                  <p className="text-muted-foreground text-sm">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
