import type { InfrastructureOpsDocument } from "@/lib/strapi/dashboard/documentation/infrastructure-ops/infrastructure-ops-schema";

export const mockInfrastructureOpsDocuments: InfrastructureOpsDocument[] = [
  {
    meta: {
      slug: "deployment-pipeline",
      title: "Deployment Pipeline & CI/CD",
      excerpt:
        "Complete reference for the CI/CD pipeline using GitHub Actions. Includes build, test, and deployment stages. Covers environment promotion and rollback procedures.",
      category: "infrastructure-ops",
      audience: "DevOps Engineer",
      publishedAt: "2026-01-16",
      lastUpdated: "2026-02-28",
      tags: ["ci-cd", "deployment", "github-actions", "automation"],
    },
    seo: {
      metaTitle: "CI/CD Deployment Pipeline & GitHub Actions Guide",
      metaDescription:
        "Complete guide to setting up, monitoring, and maintaining the continuous integration and deployment pipeline.",
    },
    toc: [
      { id: "overview", title: "Pipeline Overview", level: 2 },
      { id: "stages", title: "Pipeline Stages", level: 2 },
      { id: "environment-promotion", title: "Environment Promotion", level: 2 },
      { id: "rollback", title: "Rollback Procedures", level: 2 },
    ],
    blocks: [
      {
        type: "block.sectionHeader",
        id: "overview",
        title: "Pipeline Overview",
        number: "01",
      },
      {
        type: "block.paragraph",
        content:
          "Our CI/CD pipeline is fully automated using GitHub Actions. Every push triggers tests, builds, and deploys to appropriate environments based on branch.",
      },
      {
        type: "block.featureGrid",
        title: "Pipeline Capabilities",
        features: [
          {
            icon: "CheckCircle",
            title: "Automated Testing",
            description: "Unit, integration, and e2e tests run on every commit",
          },
          {
            icon: "Package",
            title: "Docker Builds",
            description: "Containerized applications with registry push",
          },
          {
            icon: "Rocket",
            title: "Auto Deployment",
            description: "Push to staging or production based on branch",
          },
        ],
      },
      {
        type: "block.sectionHeader",
        id: "stages",
        title: "Pipeline Stages",
        number: "02",
      },
      {
        type: "block.statsTable",
        title: "Stage Timeline",
        stats: [
          {
            label: "Unit Tests",
            value: "2-3 min",
            change: "Fast",
            changeType: "positive",
          },
          {
            label: "Build",
            value: "5-7 min",
            change: "Optimized",
            changeType: "positive",
          },
          {
            label: "Deploy to Staging",
            value: "3-5 min",
            change: "Blue-green",
            changeType: "positive",
          },
        ],
      },
      {
        type: "block.sectionHeader",
        id: "environment-promotion",
        title: "Environment Promotion",
        number: "03",
      },
      {
        type: "block.codeBlock",
        language: "yaml",
        code: "push:\n  branches:\n    - develop -> Deploy to Staging\n    - main -> Deploy to Production\n    - hotfix/* -> Deploy to Staging then Production",
        title: "Branch Promotion Rules",
      },
    ],
  },
  {
    meta: {
      slug: "monitoring-alerting",
      title: "Monitoring, Logging & Alerting",
      excerpt:
        "Setup and configuration of monitoring stack including metrics, logs, and alerting. Covers NewRelic, DataDog integration points, and on-call procedures.",
      category: "infrastructure-ops",
      audience: "DevOps Engineer",
      publishedAt: "2026-01-30",
      lastUpdated: "2026-02-26",
      tags: ["monitoring", "logging", "observability", "alerting"],
    },
    seo: {
      metaTitle: "Monitoring & Observability Stack Reference",
      metaDescription:
        "Guide to implementing monitoring, logging, and alerting for infrastructure and application health.",
    },
    toc: [
      { id: "observability", title: "Observability Stack", level: 2 },
      { id: "metrics", title: "Metrics Collection", level: 2 },
      { id: "alerting", title: "Alert Configuration", level: 2 },
    ],
    blocks: [
      {
        type: "block.sectionHeader",
        id: "observability",
        title: "Observability Stack",
        number: "01",
      },
      {
        type: "block.paragraph",
        content:
          "We use a comprehensive observability stack combining application metrics, infrastructure logs, and distributed tracing.",
      },
      {
        type: "block.list",
        ordered: false,
        items: [
          "NewRelic APM for application performance monitoring",
          "CloudWatch for infrastructure and system logs",
          "Custom dashboards for real-time visibility",
          "Distributed tracing for request flows",
        ],
      },
      {
        type: "block.sectionHeader",
        id: "metrics",
        title: "Metrics Collection",
        number: "02",
      },
      {
        type: "block.callout",
        calloutType: "info",
        title: "Key Metrics to Monitor",
        content:
          "Response time, error rate, throughput, CPU usage, memory utilization, database query time, and cache hit rates.",
      },
      {
        type: "block.codeBlock",
        language: "typescript",
        code: "import { newrelic } from 'newrelic';\n\nnewrelic.recordCustomEvent('UserAction', {\n  action: 'document-view',\n  category: slug,\n  userId: user.id,\n});",
        title: "Custom Metrics Example",
      },
    ],
  },
  {
    meta: {
      slug: "database-operations",
      title: "Database Management & Operations",
      excerpt:
        "Database administration, backup strategies, migration procedures, and performance tuning. Covers PostgreSQL configuration and disaster recovery.",
      category: "infrastructure-ops",
      audience: "DevOps Engineer",
      publishedAt: "2026-02-12",
      lastUpdated: "2026-02-27",
      tags: ["database", "postgresql", "operations", "backup"],
    },
    seo: {
      metaTitle: "Database Operations & Administration Guide",
      metaDescription:
        "Complete guide to managing PostgreSQL databases, backups, migrations, and performance optimization.",
    },
    blocks: [
      {
        type: "block.sectionHeader",
        id: "administration",
        title: "Database Administration",
        number: "01",
      },
      {
        type: "block.paragraph",
        content:
          "PostgreSQL administration requires careful attention to performance, security, and data integrity. Regular maintenance is essential.",
      },
      {
        type: "block.callout",
        calloutType: "warning",
        title: "Backup Strategy",
        content:
          "Daily backups are stored in S3 with 30-day retention. Test restore procedures monthly.",
      },
      {
        type: "block.list",
        ordered: true,
        items: [
          "Regular VACUUM and ANALYZE operations",
          "Index maintenance and optimization",
          "Query performance monitoring and tuning",
          "Connection pooling configuration",
        ],
      },
    ],
  },
];

export const mockInfrastructureOpsDocument: InfrastructureOpsDocument =
  mockInfrastructureOpsDocuments[0];
