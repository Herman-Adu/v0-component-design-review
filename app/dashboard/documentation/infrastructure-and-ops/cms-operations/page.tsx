"use client"

import { CodeBlock } from "@/components/atoms/code-block"
import { Callout } from "@/components/atoms/callout"
import { Spoiler } from "@/components/atoms/spoiler"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Server, Database, Shield, Activity, Cloud, HardDrive, RefreshCw } from "lucide-react"
import { DocPage, DocSectionHeader } from "@/components/molecules/doc-page"

const SECTIONS = [
  { id: "deployment-options", title: "Deployment Options" },
  { id: "docker-deployment", title: "Docker Deployment" },
  { id: "backup-recovery", title: "Backup & Recovery" },
  { id: "performance-tuning", title: "Performance Tuning" },
  { id: "monitoring", title: "Monitoring & Alerting" },
]

export default function OperationsPage() {
  return (
    <DocPage
      title="Operations"
      description="Deployment guides, backup strategies, performance tuning, and monitoring setup for production Strapi environments."
      icon={Settings}
      badges={[{ label: "DevOps", className: "bg-orange-500/20 text-orange-400 border-0" }]}
      tags={["Docker", "PostgreSQL", "Monitoring", "Backups"]}
      meta={[
        { label: "Audience", value: "DevOps / Backend Engineers" },
        { label: "Last Updated", value: "2026-02-10" },
      ]}
      sections={SECTIONS}
    >
      {/* Deployment Options */}
      <section className="space-y-6">
        <DocSectionHeader id="deployment-options">Deployment Options</DocSectionHeader>

        <div className="responsive-grid-3">
          <Card>
            <CardHeader>
              <Cloud className="h-8 w-8 text-accent mb-2" />
              <CardTitle>Platform as a Service</CardTitle>
              <CardDescription>Easiest deployment option</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="space-y-1">
                <li>Railway, Render, Heroku</li>
                <li>Automatic scaling</li>
                <li>Managed databases</li>
                <li>$10-50/month typical</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Server className="h-8 w-8 text-accent mb-2" />
              <CardTitle>Docker / VPS</CardTitle>
              <CardDescription>More control, lower cost</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="space-y-1">
                <li>DigitalOcean, Hetzner, AWS</li>
                <li>Full server access</li>
                <li>Custom configuration</li>
                <li>$5-20/month typical</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <HardDrive className="h-8 w-8 text-accent mb-2" />
              <CardTitle>Strapi Cloud</CardTitle>
              <CardDescription>Official managed hosting</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="space-y-1">
                <li>One-click deployment</li>
                <li>Automatic updates</li>
                <li>Built-in backups</li>
                <li>$29/month starting</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Docker Deployment */}
      <section className="space-y-6">
        <DocSectionHeader id="docker-deployment">Docker Deployment</DocSectionHeader>

        <Tabs defaultValue="dockerfile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dockerfile">Dockerfile</TabsTrigger>
            <TabsTrigger value="compose">Docker Compose</TabsTrigger>
            <TabsTrigger value="nginx">Nginx Config</TabsTrigger>
          </TabsList>

          <TabsContent value="dockerfile" className="space-y-4">
            <Spoiler title="Production Dockerfile" defaultOpen>
              <CodeBlock
                title="Dockerfile"
                language="dockerfile"
                code={`# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/config ./config
COPY --from=builder /app/src ./src

# Create non-root user
RUN addgroup -g 1001 -S strapi && \\
    adduser -S strapi -u 1001 -G strapi && \\
    chown -R strapi:strapi /app

USER strapi

# Expose port
EXPOSE 1337

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \\
  CMD wget --no-verbose --tries=1 --spider http://localhost:1337/_health || exit 1

# Start Strapi
ENV NODE_ENV=production
CMD ["npm", "start"]`}
              />
            </Spoiler>
          </TabsContent>

          <TabsContent value="compose" className="space-y-4">
            <Spoiler title="Docker Compose" defaultOpen>
              <CodeBlock
                title="docker-compose.yml"
                language="yaml"
                code={`version: '3.8'

services:
  strapi:
    build: .
    container_name: strapi
    restart: unless-stopped
    environment:
      NODE_ENV: production
      DATABASE_CLIENT: postgres
      DATABASE_HOST: postgres
      DATABASE_PORT: 5432
      DATABASE_NAME: \${DATABASE_NAME}
      DATABASE_USERNAME: \${DATABASE_USERNAME}
      DATABASE_PASSWORD: \${DATABASE_PASSWORD}
      APP_KEYS: \${APP_KEYS}
      API_TOKEN_SALT: \${API_TOKEN_SALT}
      ADMIN_JWT_SECRET: \${ADMIN_JWT_SECRET}
      JWT_SECRET: \${JWT_SECRET}
    ports:
      - "1337:1337"
    volumes:
      - strapi-uploads:/app/public/uploads
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - strapi-network

  postgres:
    image: postgres:16-alpine
    container_name: strapi-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: \${DATABASE_NAME}
      POSTGRES_USER: \${DATABASE_USERNAME}
      POSTGRES_PASSWORD: \${DATABASE_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U \${DATABASE_USERNAME} -d \${DATABASE_NAME}"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - strapi-network

volumes:
  strapi-uploads:
  postgres-data:

networks:
  strapi-network:
    driver: bridge`}
              />
            </Spoiler>
          </TabsContent>

          <TabsContent value="nginx" className="space-y-4">
            <Spoiler title="Nginx Reverse Proxy" defaultOpen>
              <CodeBlock
                title="nginx.conf"
                language="nginx"
                code={`upstream strapi {
    server 127.0.0.1:1337;
    keepalive 64;
}

server {
    listen 80;
    server_name api.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_types text/plain text/css application/json application/javascript;

    # Max upload size
    client_max_body_size 100M;

    location / {
        proxy_pass http://strapi;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 600s;
    }

    # Cache static assets
    location /uploads/ {
        proxy_pass http://strapi;
        proxy_cache_valid 200 30d;
        add_header Cache-Control "public, max-age=2592000";
    }
}`}
              />
            </Spoiler>
          </TabsContent>
        </Tabs>
      </section>

      {/* Backup & Recovery */}
      <section className="space-y-6">
        <DocSectionHeader id="backup-recovery">{"Backup & Recovery"}</DocSectionHeader>

        <Callout type="warning" title="Backup Strategy">
          Always backup both your database AND the uploads folder. Database-only backups will lose
          all media files.
        </Callout>

        <Tabs defaultValue="backup" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="backup">Backup Scripts</TabsTrigger>
            <TabsTrigger value="restore">Restore Process</TabsTrigger>
          </TabsList>

          <TabsContent value="backup" className="space-y-4">
            <Spoiler title="Automated Backup Script" defaultOpen>
              <CodeBlock
                title="scripts/backup.sh"
                language="bash"
                code={`#!/bin/bash
# Strapi Backup Script
# Run via cron: 0 2 * * * /path/to/backup.sh

set -e

# Configuration
BACKUP_DIR="/backups/strapi"
RETENTION_DAYS=30
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_NAME="strapi_db"
DB_USER="strapi_user"
UPLOADS_DIR="/app/public/uploads"

# Create backup directory
mkdir -p "$BACKUP_DIR/$TIMESTAMP"

echo "Starting backup at $(date)"

# Backup PostgreSQL database
echo "Backing up database..."
PGPASSWORD=$DB_PASSWORD pg_dump -h localhost -U $DB_USER -d $DB_NAME \\
  --format=custom \\
  --compress=9 \\
  -f "$BACKUP_DIR/$TIMESTAMP/database.dump"

# Backup uploads folder
echo "Backing up uploads..."
tar -czf "$BACKUP_DIR/$TIMESTAMP/uploads.tar.gz" -C "$(dirname $UPLOADS_DIR)" uploads

# Create manifest
echo "Creating manifest..."
cat > "$BACKUP_DIR/$TIMESTAMP/manifest.json" << EOF
{
  "timestamp": "$TIMESTAMP",
  "database": "database.dump",
  "uploads": "uploads.tar.gz",
  "strapi_version": "$(cat package.json | jq -r '.dependencies.strapi')"
}
EOF

# Create combined archive
echo "Creating final archive..."
tar -czf "$BACKUP_DIR/strapi_backup_$TIMESTAMP.tar.gz" -C "$BACKUP_DIR" "$TIMESTAMP"
rm -rf "$BACKUP_DIR/$TIMESTAMP"

# Remove old backups
echo "Cleaning old backups..."
find "$BACKUP_DIR" -name "strapi_backup_*.tar.gz" -mtime +$RETENTION_DAYS -delete

echo "Backup completed: strapi_backup_$TIMESTAMP.tar.gz"

# Optional: Upload to S3
# aws s3 cp "$BACKUP_DIR/strapi_backup_$TIMESTAMP.tar.gz" s3://your-bucket/backups/`}
              />
            </Spoiler>
          </TabsContent>

          <TabsContent value="restore" className="space-y-4">
            <Spoiler title="Restore Script" defaultOpen>
              <CodeBlock
                title="scripts/restore.sh"
                language="bash"
                code={`#!/bin/bash
# Strapi Restore Script

set -e

if [ -z "$1" ]; then
  echo "Usage: ./restore.sh <backup_file.tar.gz>"
  exit 1
fi

BACKUP_FILE=$1
RESTORE_DIR="/tmp/strapi_restore"
DB_NAME="strapi_db"
DB_USER="strapi_user"
UPLOADS_DIR="/app/public/uploads"

echo "Starting restore from $BACKUP_FILE"

# Extract backup
mkdir -p "$RESTORE_DIR"
tar -xzf "$BACKUP_FILE" -C "$RESTORE_DIR"
TIMESTAMP=$(ls "$RESTORE_DIR")

# Stop Strapi (if running)
echo "Stopping Strapi..."
docker-compose stop strapi || true

# Restore database
echo "Restoring database..."
PGPASSWORD=$DB_PASSWORD pg_restore -h localhost -U $DB_USER -d $DB_NAME \\
  --clean --if-exists \\
  "$RESTORE_DIR/$TIMESTAMP/database.dump"

# Restore uploads
echo "Restoring uploads..."
rm -rf "$UPLOADS_DIR"
tar -xzf "$RESTORE_DIR/$TIMESTAMP/uploads.tar.gz" -C "$(dirname $UPLOADS_DIR)"

# Cleanup
rm -rf "$RESTORE_DIR"

# Restart Strapi
echo "Starting Strapi..."
docker-compose start strapi

echo "Restore completed successfully"`}
              />
            </Spoiler>
          </TabsContent>
        </Tabs>
      </section>

      {/* Performance Tuning */}
      <section className="space-y-6">
        <DocSectionHeader id="performance-tuning">Performance Tuning</DocSectionHeader>

        <div className="responsive-grid-2">
          <Card>
            <CardHeader>
              <Database className="h-6 w-6 text-accent mb-2" />
              <CardTitle className="text-lg">Database Optimization</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p><strong>Connection pooling:</strong> Set pool min/max in database config</p>
              <p><strong>Indexes:</strong> Add indexes on frequently queried fields</p>
              <p><strong>Query optimization:</strong> Use selective population</p>
              <p><strong>Vacuum:</strong> Schedule regular PostgreSQL vacuum</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <RefreshCw className="h-6 w-6 text-accent mb-2" />
              <CardTitle className="text-lg">Caching Strategy</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p><strong>Redis:</strong> Use Redis for API response caching</p>
              <p><strong>CDN:</strong> Cache uploads via Cloudflare or AWS CloudFront</p>
              <p><strong>REST cache:</strong> Enable Strapi REST cache plugin</p>
              <p><strong>ETags:</strong> Leverage browser caching with ETags</p>
            </CardContent>
          </Card>
        </div>

        <Spoiler title="Redis Caching Configuration">
          <CodeBlock
            title="config/plugins.ts"
            language="typescript"
            code={`export default ({ env }) => ({
  'rest-cache': {
    enabled: true,
    config: {
      provider: {
        name: 'redis',
        options: {
          host: env('REDIS_HOST', 'localhost'),
          port: env.int('REDIS_PORT', 6379),
          password: env('REDIS_PASSWORD', ''),
          db: env.int('REDIS_DB', 0),
        },
      },
      strategy: {
        contentTypes: [
          // Cache these content types
          'api::service-request.service-request',
          'api::site-settings.site-settings',
          'api::global-seo.global-seo',
        ],
        // Cache for 5 minutes
        maxAge: 300000,
        // Clear cache on content update
        hitpass: false,
      },
    },
  },
});`}
          />
        </Spoiler>
      </section>

      {/* Monitoring */}
      <section className="space-y-6">
        <DocSectionHeader id="monitoring">{"Monitoring & Alerting"}</DocSectionHeader>

        <Callout type="info" title="Health Endpoint">
          Strapi provides a built-in health endpoint at /_health that returns 204 when
          healthy. Use this for load balancer health checks.
        </Callout>

        <Spoiler title="Custom Health Check Endpoint" defaultOpen>
          <CodeBlock
            title="src/api/health/routes/health.ts"
            language="typescript"
            code={`// Extended health check with database connectivity
export default {
  routes: [
    {
      method: 'GET',
      path: '/health/detailed',
      handler: 'health.check',
      config: {
        auth: false,
        policies: [],
      },
    },
  ],
};

// src/api/health/controllers/health.ts
export default {
  async check(ctx) {
    const startTime = Date.now();
    
    try {
      // Check database connectivity
      await strapi.db.connection.raw('SELECT 1');
      
      // Check disk space for uploads
      const uploadPath = strapi.dirs.static.public + '/uploads';
      
      const healthData = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        responseTime: Date.now() - startTime,
        database: 'connected',
        version: strapi.config.get('info.strapi'),
      };
      
      ctx.status = 200;
      ctx.body = healthData;
    } catch (error) {
      ctx.status = 503;
      ctx.body = {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  },
};`}
          />
        </Spoiler>

        <div className="responsive-grid-2">
          <Card>
            <CardHeader>
              <Activity className="h-6 w-6 text-accent mb-2" />
              <CardTitle className="text-lg">Recommended Monitoring</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="space-y-1">
                <li>Uptime: Pingdom, UptimeRobot, Better Uptime</li>
                <li>APM: New Relic, Datadog, Sentry</li>
                <li>Logs: Papertrail, Logtail, ELK Stack</li>
                <li>Metrics: Prometheus + Grafana</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-6 w-6 text-accent mb-2" />
              <CardTitle className="text-lg">Alert Thresholds</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="space-y-1">
                <li>{"Response time: Alert if > 2s average"}</li>
                <li>{"Error rate: Alert if > 1% of requests"}</li>
                <li>{"CPU: Alert if > 80% sustained"}</li>
                <li>{"Memory: Alert if > 85% usage"}</li>
                <li>{"Disk: Alert if > 90% full"}</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
    </DocPage>
  )
}
