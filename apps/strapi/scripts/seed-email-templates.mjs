/**
 * Seed script for email-template collection type.
 * Run inside container — secrets loaded from /app/.env.
 *
 * Usage (from host):
 *   docker cp apps/strapi/scripts/seed-email-templates.mjs v0_strapi:/app/scripts/seed-email-templates.mjs
 *   docker exec v0_strapi sh -c 'export $(grep -v "^#" /app/.env | grep -v "^$" | xargs) && STRAPI_URL=http://127.0.0.1:1337 STRAPI_API_TOKEN=$SEED_TOKEN node /app/scripts/seed-email-templates.mjs'
 */

const BASE = process.env.STRAPI_URL ?? 'http://127.0.0.1:1337';
const TOKEN = process.env.STRAPI_API_TOKEN;

if (!TOKEN) {
  console.error('ERROR: STRAPI_API_TOKEN is not set');
  process.exit(1);
}

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${TOKEN}`,
};

async function api(method, path, body) {
  const url = `${BASE}/api${path}`;
  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify({ data: body }) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`${method} ${path} → ${res.status}: ${JSON.stringify(json)}`);
  }
  return json;
}

const emailTemplates = [
  {
    templateKey: 'serviceCustomer',
    templateLabel: 'Service Customer Confirmation',
    category: 'service',
    recipientType: 'customer',
    description: 'Sent to the customer immediately after a service request is submitted. Confirms receipt and provides a reference ID.',
    isActive: true,
    fromName: null,
    fromEmail: null,
    replyTo: null,
  },
  {
    templateKey: 'serviceBusiness',
    templateLabel: 'Service Business Notification',
    category: 'service',
    recipientType: 'business',
    description: 'Sent to the internal team when a new service request arrives. Includes full form data and urgency classification.',
    isActive: true,
    fromName: null,
    fromEmail: null,
    replyTo: null,
  },
  {
    templateKey: 'contactCustomer',
    templateLabel: 'Contact Customer Confirmation',
    category: 'contact',
    recipientType: 'customer',
    description: 'Sent to the customer after a contact form submission. Acknowledges the inquiry and sets expectations for response time.',
    isActive: true,
    fromName: null,
    fromEmail: null,
    replyTo: null,
  },
  {
    templateKey: 'contactBusiness',
    templateLabel: 'Contact Business Notification',
    category: 'contact',
    recipientType: 'business',
    description: 'Sent to the internal team when a contact form is submitted. Routes to the customer relations group.',
    isActive: true,
    fromName: null,
    fromEmail: null,
    replyTo: null,
  },
  {
    templateKey: 'quotationCustomer',
    templateLabel: 'Quotation Customer Confirmation',
    category: 'quotation',
    recipientType: 'customer',
    description: 'Sent to the customer after a quotation request. Confirms receipt and advises on expected turnaround.',
    isActive: true,
    fromName: null,
    fromEmail: null,
    replyTo: null,
  },
  {
    templateKey: 'quotationBusiness',
    templateLabel: 'Quotation Business Notification',
    category: 'quotation',
    recipientType: 'business',
    description: 'Sent to the estimations team when a quotation request is received. Triggers the preparation workflow.',
    isActive: true,
    fromName: null,
    fromEmail: null,
    replyTo: null,
  },
];

async function main() {
  console.log(`Seeding email-templates against ${BASE}`);
  for (const tmpl of emailTemplates) {
    await api('POST', '/email-templates', tmpl);
    process.stdout.write(`  ✓ ${tmpl.templateKey}\n`);
  }
  console.log(`\n✅ ${emailTemplates.length} email-templates seeded.\n`);
}

main().catch((err) => {
  console.error('\n❌ Seed failed:', err.message);
  process.exit(1);
});
