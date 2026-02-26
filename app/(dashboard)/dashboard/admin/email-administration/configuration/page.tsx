import type { Features, Highlights } from "@/types/strapi-mock";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Mail,
  MailCheck,
  Eye,
  Send,
  Users,
  Clock,
  ArrowRight,
  Palette,
  FileText,
  Zap,
  Shield,
  Split,
  UsersRound,
  Timer,
  Moon,
  Paperclip,
  AlertTriangle,
  Building2,
  Settings,
} from "lucide-react";
import featuresData from "@/data/strapi-mock/email-administration/configuration/features.json";
import emailTypesData from "@/data/strapi-mock/email-administration/configuration/email-types.json";
import configHighlightsData from "@/data/strapi-mock/email-administration/configuration/config-highlights.json";

const iconMap = {
  Palette,
  Eye,
  Split,
  UsersRound,
  Timer,
  Send,
  Users,
  FileText,
  Building2,
  AlertTriangle,
  Moon,
  Paperclip,
};

export default function EmailConfigurationPage() {
  const features = featuresData.features || [];

  const emailTypes = emailTypesData.emailTypes || [];

  const configHighlights = configHighlightsData.configHighlights || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 border border-accent/20">
            <Mail className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
              Email Configuration
            </h1>
            <p className="text-muted-foreground">
              Brand identity, templates, scheduling, and engagement settings
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline">Business Administrator</Badge>
          <Badge variant="outline">Project Lead</Badge>
          <Badge className="bg-green-500/20 text-green-400 border-0">
            6 Templates
          </Badge>
          <Badge className="bg-green-500/20 text-green-400 border-0">
            3 Form Types
          </Badge>
          <Badge className="bg-accent/20 text-accent border-0">
            Urgency System Live
          </Badge>
        </div>
      </div>

      {/* Role Description */}
      <Card className="border-accent/20 bg-accent/5">
        <CardContent className="flex gap-4 p-5">
          <div className="flex items-center justify-center w-9 h-9 rounded-md bg-accent/10 shrink-0">
            <Users className="h-4 w-4 text-accent" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              Who is this for?
            </p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              This section is designed for{" "}
              <strong className="text-foreground">
                Business Administrators
              </strong>{" "}
              and <strong className="text-foreground">Project Leads</strong> who
              make decisions about how emails look and behave -- brand colors,
              template content, subject lines, recipient routing, and
              scheduling. For client request handling, see{" "}
              <Link
                href="/dashboard/admin/email-administration/request-management"
                className="text-accent hover:underline"
              >
                Request Management
              </Link>
              . For API health and security monitoring, see{" "}
              <Link
                href="/dashboard/admin/email-administration/infrastructure"
                className="text-accent hover:underline"
              >
                Infrastructure
              </Link>
              .
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="responsive-grid-3">
        {features.map((item) => (
          <Card key={item.title} className="border-accent/30">
            <CardContent className="p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent/10 shrink-0">
                  {(() => {
                    const Icon = iconMap[item.icon as keyof typeof iconMap];
                    return Icon ? (
                      <Icon className="h-4 w-4 text-accent" />
                    ) : null;
                  })()}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground text-sm truncate">
                    {item.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {item.role}
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="shrink-0 h-8 w-8 p-0"
                asChild
              >
                <Link href={item.href}>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Email Types */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Email Types
        </h2>
        <div className="responsive-grid-3">
          {emailTypes.map((email) => (
            <Card key={email.type} className="border-border/50">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-9 h-9 rounded-md bg-accent/10">
                      {(() => {
                        const Icon =
                          iconMap[email.icon as keyof typeof iconMap];
                        return Icon ? (
                          <Icon className="h-4 w-4 text-accent" />
                        ) : null;
                      })()}
                    </div>
                    <p className="font-medium text-foreground text-sm">
                      {email.type}
                    </p>
                  </div>
                  {email.urgency && (
                    <Badge className="bg-amber-500/15 text-amber-400 border-0 text-[10px]">
                      Urgency
                    </Badge>
                  )}
                </div>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 shrink-0" />
                    <span>Trigger: {email.trigger}</span>
                  </div>
                  <div className="space-y-1 pl-5">
                    {email.templates.map((t) => (
                      <div key={t} className="flex items-center gap-2">
                        <MailCheck className="h-3 w-3 text-accent shrink-0" />
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Feature Cards */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Pages</h2>
        <div className="responsive-grid-2">
          {features.map((feature) => (
            <Card key={feature.title} className="border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-9 h-9 rounded-md bg-muted">
                      {(() => {
                        const Icon =
                          iconMap[feature.icon as keyof typeof iconMap];
                        return Icon ? (
                          <Icon className="h-4 w-4 text-foreground" />
                        ) : null;
                      })()}
                    </div>
                    <div>
                      <CardTitle className="text-base">
                        {feature.title}
                      </CardTitle>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {feature.role}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 border-0 text-xs">
                    Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 bg-transparent"
                  asChild
                >
                  <Link href={feature.href}>
                    Open
                    <ArrowRight className="ml-2 h-3 w-3" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Architecture */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Architecture
        </h2>
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="responsive-grid-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Shield className="h-4 w-4 text-accent" />
                  Config Layer
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Centralised brand config at{" "}
                  <code className="font-mono text-accent">
                    lib/email/config/email-config.ts
                  </code>{" "}
                  -- single source of truth for company details, brand colors,
                  urgency color schemes, SLA times, and template metadata.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <FileText className="h-4 w-4 text-accent" />
                  Template Layer
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  6 HTML templates in{" "}
                  <code className="font-mono text-accent">
                    lib/email/templates/
                  </code>{" "}
                  -- all import from the config. Zero hardcoded brand values. 3
                  urgency levels with distinct visual treatments.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Zap className="h-4 w-4 text-accent" />
                  Service Layer
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  3 email services in{" "}
                  <code className="font-mono text-accent">
                    lib/email/services/
                  </code>{" "}
                  handle rendering and delivery via Resend API. Server actions
                  provide render-for-preview and send capabilities.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Config Highlights */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Configuration Highlights
        </h2>
        <div className="responsive-grid-2">
          {configHighlights.map((item) => (
            <Card key={item.title} className="border-border/50">
              <CardContent className="flex gap-4 p-5">
                <div className="flex items-center justify-center w-9 h-9 rounded-md bg-green-500/10 shrink-0">
                  {(() => {
                    const Icon = iconMap[item.icon as keyof typeof iconMap];
                    return Icon ? (
                      <Icon className="h-4 w-4 text-green-400" />
                    ) : null;
                  })()}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Strapi Readiness */}
      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardContent className="flex gap-4 p-5">
          <div className="flex items-center justify-center w-9 h-9 rounded-md bg-blue-500/10 shrink-0">
            <Settings className="h-4 w-4 text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              Strapi Backend Ready
            </p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              The email config layer is designed to map directly to a Strapi{" "}
              <code className="font-mono text-blue-400">
                email-configuration
              </code>{" "}
              single type. When connected, the Template & Brand page will
              read/write from the CMS instead of the local config file.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

