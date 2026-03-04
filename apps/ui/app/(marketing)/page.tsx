import { Navbar } from "@/components/molecules/navbar";
import { ElectricCurrent } from "@/components/animations/electric-current";
import marketingHomeData from "@/data/strapi-mock/marketing/marketing-home.json";
import type {
  MarketingHomeContent,
  MarketingIconName,
} from "@/types/marketing";
import {
  Zap,
  Home,
  Building2,
  Factory,
  ShieldCheck,
  Clock,
  Award,
  Phone,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const marketingHome = marketingHomeData as MarketingHomeContent;
const { hero, servicesOverview, trustIndicators, cta } = marketingHome;

const iconMap = {
  Zap,
  Home,
  Building2,
  Factory,
  ShieldCheck,
  Clock,
  Award,
  Phone,
  ArrowRight,
} as const;

type IconName = keyof typeof iconMap;

const getIcon = (name?: MarketingIconName) =>
  name ? iconMap[name as IconName] : undefined;

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
                {(() => {
                  const BadgeIcon = getIcon(hero.badge.icon);
                  return BadgeIcon ? (
                    <BadgeIcon className="w-4 h-4" fill="currentColor" />
                  ) : null;
                })()}
                {hero.badge.text}
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance leading-tight">
                {hero.title}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                {hero.description}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href={hero.primaryCta.href}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors"
                >
                  {(() => {
                    const CtaIcon = getIcon(hero.primaryCta.icon);
                    return CtaIcon ? <CtaIcon className="w-4 h-4" /> : null;
                  })()}
                  {hero.primaryCta.label}
                </Link>
                <Link
                  href={hero.secondaryCta.href}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border border-border text-foreground rounded-lg font-medium hover:bg-muted transition-colors"
                >
                  {hero.secondaryCta.label}
                  {(() => {
                    const CtaIcon = getIcon(hero.secondaryCta.icon);
                    return CtaIcon ? <CtaIcon className="w-4 h-4" /> : null;
                  })()}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Services Overview */}
        <section className="bg-card border-y border-border">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                {servicesOverview.title}
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                {servicesOverview.description}
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
              {servicesOverview.items.map((item) => {
                const ItemIcon = getIcon(item.icon);
                return (
                  <div
                    key={item.title}
                    className="p-6 rounded-xl bg-background border border-border hover:border-accent/50 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                      {ItemIcon ? (
                        <ItemIcon className="w-6 h-6 text-accent" />
                      ) : null}
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="text-center mt-8">
              <Link
                href={servicesOverview.cta.href}
                className="inline-flex items-center gap-2 text-accent hover:text-accent/80 font-medium transition-colors"
              >
                {servicesOverview.cta.label}
                {(() => {
                  const CtaIcon = getIcon(servicesOverview.cta.icon);
                  return CtaIcon ? <CtaIcon className="w-4 h-4" /> : null;
                })()}
              </Link>
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-3 text-center">
            {trustIndicators.items.map((item) => {
              const ItemIcon = getIcon(item.icon);
              return (
                <div key={item.label} className="p-6">
                  {ItemIcon ? (
                    <ItemIcon className="w-10 h-10 text-accent mx-auto mb-4" />
                  ) : null}
                  <div className="text-3xl font-bold text-foreground mb-2">
                    {item.value}
                  </div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-accent/5 border-t border-border">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                {cta.title}
              </h2>
              <p className="text-muted-foreground mb-8">{cta.description}</p>
              <div className="flex flex-wrap justify-center gap-4">
                {cta.actions.map((action) => {
                  const ActionIcon = getIcon(action.icon);
                  const isPrimary = action.variant === "primary";
                  return (
                    <Link
                      key={action.label}
                      href={action.href}
                      className={
                        isPrimary
                          ? "inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors"
                          : "inline-flex items-center gap-2 px-6 py-3 bg-transparent border border-border text-foreground rounded-lg font-medium hover:bg-muted transition-colors"
                      }
                    >
                      {ActionIcon ? <ActionIcon className="w-4 h-4" /> : null}
                      {action.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
