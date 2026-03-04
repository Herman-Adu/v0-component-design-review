"use client";

import {
  TableOfContents,
  SectionHeader,
  InfoBox,
  KeyTakeaway,
  StatsTable,
  NumberedList,
  ProcessFlow,
  FeatureGrid,
  ComparisonCards,
} from "@/components/molecules/article-components";
import { CodeBlock } from "@/components/atoms/code-block";

const tocItems = [
  { id: "deployment-options", title: "Deployment Options", level: 2 },
  { id: "docker-deployment", title: "Docker Deployment", level: 2 },
  { id: "backup-recovery", title: "Backup & Recovery", level: 2 },
  { id: "performance-tuning", title: "Performance Tuning", level: 2 },
  { id: "monitoring", title: "Monitoring & Alerting", level: 2 },
];

export function DeploymentGuideContent() {
  return (
    <div className="flex gap-8">
      <div className="flex-1 min-w-0 space-y-8">
        <section>
          <SectionHeader
            number="01"
            title="Deployment Options"
            id="deployment-options"
          />
          <p className="text-muted-foreground leading-relaxed mt-4">
            Three deployment paths are available, each with different trade-offs
            for control, cost, and operational complexity. Choose based on your
            team size and scaling needs.
          </p>
        </section>

        <ComparisonCards
          leftTitle="PaaS (Vercel + Strapi Cloud)"
          leftItems={[
            "Setup: Minutes",
            "Scaling: Automatic",
            "Control: Limited",
            "Cost at scale: Higher",
            "Best for: Small teams, MVPs",
          ]}
          leftType="positive"
          rightTitle="Docker / VPS"
          rightItems={[
            "Setup: Hours",
            "Scaling: Manual / orchestrated",
            "Control: Full",
            "Cost at scale: Lower",
            "Best for: Production, multi-site",
          ]}
          rightType="positive"
        />

        <section>
          <SectionHeader
            number="02"
            title="Docker Deployment"
            id="docker-deployment"
          />
          <p className="text-muted-foreground leading-relaxed mt-4">
            Docker provides a reproducible, portable deployment that works
            identically across development, staging, and production
            environments.
          </p>
        </section>

        <CodeBlock
          language="dockerfile"
          title="Dockerfile"
          code={`FROM node:20-alpine AS base
WORKDIR /app

# Dependencies
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# Build
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# Production
FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]`}
        />

        <CodeBlock
          language="yaml"
          title="docker-compose.yml"
          code={`services:
  app:
    build: .
    ports: ["3000:3000"]
    environment:
      - DATABASE_URL=postgres://user:pass@db:5432/app
      - STRAPI_URL=http://strapi:1337
    depends_on: [db, strapi]

  strapi:
    image: strapi/strapi:latest
    ports: ["1337:1337"]
    environment:
      - DATABASE_HOST=db
    depends_on: [db]

  db:
    image: postgres:16-alpine
    volumes: ["pgdata:/var/lib/postgresql/data"]
    environment:
      - POSTGRES_DB=app
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass

  nginx:
    image: nginx:alpine
    ports: ["80:80", "443:443"]
    volumes: ["./nginx.conf:/etc/nginx/nginx.conf"]
    depends_on: [app]

volumes:
  pgdata:`}
        />

        <InfoBox type="tip" title="SSL with Certbot">
          Use Certbot with the Nginx container for automatic SSL certificate
          provisioning and renewal. Add a certbot service to docker-compose and
          mount the certificates volume into the nginx container.
        </InfoBox>

        <section>
          <SectionHeader
            number="03"
            title="Backup & Recovery"
            id="backup-recovery"
          />
          <p className="text-muted-foreground leading-relaxed mt-4">
            Automated backups are non-negotiable for production. The strategy
            covers database snapshots, media uploads, and configuration -- with
            tested restore procedures.
          </p>
        </section>

        <ProcessFlow
          title="Backup Strategy"
          steps={[
            {
              title: "Database Dump",
              description: "pg_dump with compression, daily at 02:00 UTC",
            },
            {
              title: "Media Sync",
              description: "rsync uploads directory to off-site storage",
            },
            {
              title: "Config Archive",
              description:
                "Environment files and docker-compose versioned in git",
            },
            {
              title: "Retention",
              description: "7 daily, 4 weekly, 3 monthly backups retained",
            },
            {
              title: "Test Restore",
              description: "Monthly automated restore test to staging",
            },
          ]}
        />

        <CodeBlock
          language="bash"
          title="scripts/backup.sh"
          code={`#!/bin/bash
set -euo pipefail

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/$TIMESTAMP"
mkdir -p "$BACKUP_DIR"

# Database
docker exec db pg_dump -U user -Fc app > "$BACKUP_DIR/db.dump"

# Media uploads
rsync -az strapi:/app/public/uploads/ "$BACKUP_DIR/uploads/"

# Compress and encrypt
tar czf "$BACKUP_DIR.tar.gz" "$BACKUP_DIR"
gpg --encrypt --recipient ops@company.com "$BACKUP_DIR.tar.gz"

# Upload to S3
aws s3 cp "$BACKUP_DIR.tar.gz.gpg" s3://backups/

# Cleanup old backups (keep 7 daily)
find /backups -maxdepth 1 -mtime +7 -delete

echo "Backup complete: $TIMESTAMP"`}
        />

        <section>
          <SectionHeader
            number="04"
            title="Performance Tuning"
            id="performance-tuning"
          />
          <p className="text-muted-foreground leading-relaxed mt-4">
            Production performance requires tuning at multiple levels: database
            queries, caching strategy, CDN configuration, and application-level
            optimizations.
          </p>
        </section>

        <StatsTable
          title="Performance Targets"
          headers={["Metric", "Target"]}
          rows={[
            ["TTFB (Time to First Byte)", "< 200ms"],
            ["LCP (Largest Contentful Paint)", "< 2.5s"],
            ["CLS (Cumulative Layout Shift)", "< 0.1"],
            ["API Response Time (p95)", "< 500ms"],
            ["Database Query Time (p95)", "< 50ms"],
          ]}
        />

        <NumberedList
          title="Optimization Checklist"
          items={[
            "Enable PostgreSQL connection pooling (PgBouncer or built-in)",
            "Add database indexes for all filtered/sorted columns",
            "Configure Redis for session storage and API response caching",
            "Set up CDN (Cloudflare/CloudFront) for static assets and media",
            "Enable Next.js ISR for content pages with appropriate revalidation windows",
            "Compress images on upload with sharp (WebP/AVIF output)",
          ]}
        />

        <section>
          <SectionHeader
            number="05"
            title="Monitoring & Alerting"
            id="monitoring"
          />
          <p className="text-muted-foreground leading-relaxed mt-4">
            Monitoring provides visibility into application health, performance
            degradation, and security incidents. Alert thresholds trigger
            notifications before users are affected.
          </p>
          <h4 className="font-semibold text-foreground mb-4">
            Monitoring Stack
          </h4>
        </section>

        <FeatureGrid
          features={[
            {
              title: "Health Checks",
              description:
                "/api/health endpoint returning service status, DB connectivity, and uptime",
            },
            {
              title: "APM (Application)",
              description:
                "Vercel Analytics or Datadog for request tracing and error tracking",
            },
            {
              title: "Infrastructure",
              description:
                "Container metrics (CPU, memory, disk) via Prometheus + Grafana",
            },
            {
              title: "Log Aggregation",
              description:
                "Structured JSON logs shipped to centralized logging (ELK/Loki)",
            },
            {
              title: "Uptime Monitoring",
              description:
                "External pings every 60s with SMS/Slack alerting on failure",
            },
            {
              title: "Security Alerts",
              description:
                "Rate limit breaches, failed auth attempts, unusual traffic patterns",
            },
          ]}
        />

        <KeyTakeaway
          title="Deployment Essentials"
          points={[
            "Docker provides reproducible deployments across all environments",
            "Automated backups with tested restore procedures are non-negotiable",
            "Performance targets should be measurable and monitored continuously",
            "Alert thresholds should trigger BEFORE users notice degradation",
            "Monthly restore tests ensure backups actually work when needed",
          ]}
        />
      </div>

      <TableOfContents items={tocItems} />
    </div>
  );
}
