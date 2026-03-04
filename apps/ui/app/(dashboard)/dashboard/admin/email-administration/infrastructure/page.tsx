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
  HardDrive,
  Send,
  Activity,
  History,
  ShieldCheck,
  ArrowRight,
  Server,
  Key,
  AlertTriangle,
  GitBranch,
  Shield,
  Users,
} from "lucide-react";
import featuresData from "@/data/strapi-mock/email-administration/infrastructure/features.json";
import systemChecksData from "@/data/strapi-mock/email-administration/infrastructure/system-checks.json";

const iconMap = {
  Send,
  Activity,
  History,
  ShieldCheck,
  Server,
  Key,
  AlertTriangle,
  GitBranch,
  Shield,
};

export default function EmailInfrastructureOverviewPage() {
  const features = featuresData.features || [];
  const systemChecks = systemChecksData.systemChecks || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 border border-accent/20">
            <HardDrive className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
              Email Infrastructure
            </h1>
            <p className="text-muted-foreground">
              API health, delivery monitoring, security, and versioning
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline">Web Administrator</Badge>
          <Badge variant="outline">DevOps</Badge>
          <Badge variant="outline">CTO</Badge>
          <Badge className="bg-green-500/20 text-green-400 border-0">
            Send Config Active
          </Badge>
          <Badge className="bg-green-500/20 text-green-400 border-0">
            Delivery Logs Active
          </Badge>
          <Badge className="bg-green-500/20 text-green-400 border-0">
            Versioning Active
          </Badge>
          <Badge className="bg-green-500/20 text-green-400 border-0">
            Security Audit Active
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
              <strong className="text-foreground">Web Administrators</strong>,{" "}
              <strong className="text-foreground">DevOps Engineers</strong>, and
              the <strong className="text-foreground">CTO</strong>. It provides
              technical monitoring and operational tools for the email delivery
              pipeline -- API health, delivery success rates, security audits,
              and configuration versioning. Business users should use the Email
              Configuration section for brand and template settings.
            </p>
          </div>
        </CardContent>
      </Card>

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

      {/* System Architecture */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">
          System Components
        </h2>
        <div className="responsive-grid-3">
          {systemChecks.map((check) => (
            <Card key={check.title} className="border-border/50">
              <CardContent className="flex gap-4 p-5">
                <div className="flex items-center justify-center w-9 h-9 rounded-md bg-muted shrink-0">
                  {(() => {
                    const Icon = iconMap[check.icon as keyof typeof iconMap];
                    return Icon ? (
                      <Icon className="h-4 w-4 text-foreground" />
                    ) : null;
                  })()}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {check.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {check.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Architecture Flow */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Delivery Pipeline</CardTitle>
          <CardDescription>
            End-to-end email flow from form submission to inbox
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 flex-wrap text-xs">
            {[
              { label: "Form Submit", sub: "Client action" },
              { label: "Server Action", sub: "Validation + CSRF" },
              { label: "Email Service", sub: "Template render" },
              { label: "Resend API", sub: "Delivery" },
              { label: "Delivery Log", sub: "Status tracking" },
            ].map((step, i) => (
              <div key={step.label} className="flex items-center gap-3">
                <div className="rounded-lg border border-border bg-muted/50 px-3 py-2 text-center">
                  <p className="font-medium text-foreground">{step.label}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {step.sub}
                  </p>
                </div>
                {i < 4 && (
                  <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Strapi Readiness */}
      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardContent className="flex gap-4 p-5">
          <div className="flex items-center justify-center w-9 h-9 rounded-md bg-blue-500/10 shrink-0">
            <Server className="h-4 w-4 text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              Strapi Backend Ready
            </p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Delivery logs and version history are designed to integrate with
              Strapi collections. When the CMS backend is connected, these pages
              will read from live data instead of the in-memory store.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
