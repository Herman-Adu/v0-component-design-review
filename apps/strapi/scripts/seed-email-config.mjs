/**
 * Seed script for email config collection types.
 * Run inside container — secrets loaded from /app/.env.
 *
 * Usage (from host):
 *   docker cp apps/strapi/scripts/seed-email-config.mjs v0_strapi:/app/scripts/seed-email-config.mjs
 *   docker exec v0_strapi sh -c 'export $(grep -v "^#" /app/.env | grep -v "^$" | xargs) && STRAPI_URL=http://127.0.0.1:1337 STRAPI_API_TOKEN=$SEED_TOKEN node /app/scripts/seed-email-config.mjs'
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

// ── 1. scheduler-config (Single Type — PUT) ────────────────────────────────

async function seedSchedulerConfig() {
  console.log('\n[1/4] Seeding scheduler-config...');
  await api('PUT', '/scheduler-config', {
    isEnabled: true,
    batchSize: 10,
    batchIntervalMinutes: 15,
    timezone: 'Europe/London',
    immediateCategories: ['service'],
    businessHoursJson: '[{"dayOfWeek":0,"dayName":"Sunday","startHour":0,"endHour":0,"isEnabled":false},{"dayOfWeek":1,"dayName":"Monday","startHour":8,"endHour":18,"isEnabled":true},{"dayOfWeek":2,"dayName":"Tuesday","startHour":8,"endHour":18,"isEnabled":true},{"dayOfWeek":3,"dayName":"Wednesday","startHour":8,"endHour":18,"isEnabled":true},{"dayOfWeek":4,"dayName":"Thursday","startHour":8,"endHour":18,"isEnabled":true},{"dayOfWeek":5,"dayName":"Friday","startHour":8,"endHour":17,"isEnabled":true},{"dayOfWeek":6,"dayName":"Saturday","startHour":9,"endHour":13,"isEnabled":true}]',
  });
  console.log('  ✓ scheduler-config saved');
}

// ── 2. ab-subject-variants (Collection Type — POST x11) ────────────────────

const abSubjectVariants = [
  { templateKey: 'serviceCustomer', templateLabel: 'Service Customer Confirmation', pattern: 'Service Request Confirmation - {requestId}', description: 'Standard confirmation', weight: 50, sends: 142, isActive: true, abEnabled: true },
  { templateKey: 'serviceCustomer', templateLabel: 'Service Customer Confirmation', pattern: "We've received your request - {requestId}", description: 'Friendlier tone', weight: 30, sends: 87, isActive: true, abEnabled: true },
  { templateKey: 'serviceCustomer', templateLabel: 'Service Customer Confirmation', pattern: 'Your service request {requestId} is confirmed', description: 'Direct confirmation', weight: 20, sends: 56, isActive: true, abEnabled: true },
  { templateKey: 'serviceBusiness', templateLabel: 'Service Business Notification', pattern: 'New Service Request - {requestId}', description: 'Standard notification', weight: 100, sends: 285, isActive: true, abEnabled: false },
  { templateKey: 'contactCustomer', templateLabel: 'Contact Customer Confirmation', pattern: 'Contact Inquiry Received - {referenceId}', description: 'Standard receipt', weight: 50, sends: 64, isActive: true, abEnabled: true },
  { templateKey: 'contactCustomer', templateLabel: 'Contact Customer Confirmation', pattern: 'Thanks for reaching out - {referenceId}', description: 'Warmer tone', weight: 50, sends: 58, isActive: true, abEnabled: true },
  { templateKey: 'contactBusiness', templateLabel: 'Contact Business Notification', pattern: 'New Contact Inquiry - {referenceId}', description: null, weight: 100, sends: 122, isActive: true, abEnabled: false },
  { templateKey: 'quotationCustomer', templateLabel: 'Quotation Customer Confirmation', pattern: 'Quotation Request Received - {requestId}', description: 'Standard receipt', weight: 40, sends: 38, isActive: true, abEnabled: true },
  { templateKey: 'quotationCustomer', templateLabel: 'Quotation Customer Confirmation', pattern: 'Your free quote request {requestId} is being processed', description: 'Value-focused', weight: 35, sends: 34, isActive: true, abEnabled: true },
  { templateKey: 'quotationCustomer', templateLabel: 'Quotation Customer Confirmation', pattern: "We're preparing your quotation - {requestId}", description: 'Active process', weight: 25, sends: 22, isActive: true, abEnabled: true },
  { templateKey: 'quotationBusiness', templateLabel: 'Quotation Business Notification', pattern: 'New Quotation Request - {requestId}', description: null, weight: 100, sends: 94, isActive: true, abEnabled: false },
];

async function seedABSubjectVariants() {
  console.log('\n[2/4] Seeding ab-subject-variants...');
  for (const variant of abSubjectVariants) {
    await api('POST', '/ab-subject-variants', variant);
    process.stdout.write('  .');
  }
  console.log(`\n  ✓ ${abSubjectVariants.length} ab-subject-variants created`);
}

// ── 3. recipient-groups (Collection Type — POST x4) ────────────────────────

const recipientGroups = [
  {
    name: 'Emergency Response Team',
    description: 'Receives all emergency and urgent service requests for immediate dispatch',
    templateTypes: ['service'],
    urgencyFilter: 'urgent-and-emergency',
    isActive: true,
    members: [
      { name: 'James Mitchell', email: 'james@electricalservices.com', role: 'Lead Electrician', isActive: true },
      { name: 'Sarah Thompson', email: 'sarah@electricalservices.com', role: 'Emergency Coordinator', isActive: true },
      { name: 'David Chen', email: 'david@electricalservices.com', role: 'Senior Technician', isActive: true },
    ],
  },
  {
    name: 'Quotation Team',
    description: 'Handles all incoming quotation requests and prepares estimates',
    templateTypes: ['quotation'],
    urgencyFilter: 'all',
    isActive: true,
    members: [
      { name: 'Emma Williams', email: 'emma@electricalservices.com', role: 'Estimator', isActive: true },
      { name: 'Michael Brown', email: 'michael@electricalservices.com', role: 'Senior Estimator', isActive: true },
    ],
  },
  {
    name: 'Customer Relations',
    description: 'Receives all contact form inquiries and general customer communications',
    templateTypes: ['contact'],
    urgencyFilter: 'all',
    isActive: true,
    members: [
      { name: 'Lisa Park', email: 'lisa@electricalservices.com', role: 'Customer Relations Manager', isActive: true },
      { name: 'Tom Wilson', email: 'tom@electricalservices.com', role: 'Support Agent', isActive: true },
    ],
  },
  {
    name: 'Management Oversight',
    description: 'Business owners receive copies of all notifications for oversight',
    templateTypes: ['service', 'contact', 'quotation'],
    urgencyFilter: 'all',
    isActive: true,
    members: [
      { name: 'Robert Taylor', email: 'robert@electricalservices.com', role: 'Managing Director', isActive: true },
    ],
  },
];

async function seedRecipientGroups() {
  console.log('\n[3/4] Seeding recipient-groups...');
  for (const group of recipientGroups) {
    await api('POST', '/recipient-groups', group);
    process.stdout.write('  .');
  }
  console.log(`\n  ✓ ${recipientGroups.length} recipient-groups created`);
}

// ── 4. scheduled-emails (Collection Type — POST x5) ────────────────────────

const scheduledEmails = [
  {
    templateKey: 'contactCustomer',
    to: 'john@example.com',
    subject: 'Contact Inquiry Received - CR-2024-001',
    htmlContent: null,
    status: 'sent',
    scheduledFor: '2024-01-15T10:00:00.000Z',
    processedAt: '2024-01-15T10:00:05.000Z',
    error: null,
    metadata: { requestId: 'CR-2024-001', urgency: 'routine' },
  },
  {
    templateKey: 'quotationBusiness',
    to: 'admin@electricalservices.com',
    subject: 'New Quotation Request - QR-2024-015',
    htmlContent: null,
    status: 'sent',
    scheduledFor: '2024-01-15T11:00:00.000Z',
    processedAt: '2024-01-15T11:00:03.000Z',
    error: null,
    metadata: { requestId: 'QR-2024-015', urgency: 'routine' },
  },
  {
    templateKey: 'contactBusiness',
    to: 'admin@electricalservices.com',
    subject: 'New Contact Inquiry - CR-2024-002',
    htmlContent: null,
    status: 'queued',
    scheduledFor: null,
    processedAt: null,
    error: null,
    metadata: { requestId: 'CR-2024-002', urgency: 'routine' },
  },
  {
    templateKey: 'quotationCustomer',
    to: 'sarah@example.com',
    subject: 'Quotation Request Received - QR-2024-016',
    htmlContent: null,
    status: 'scheduled',
    scheduledFor: '2024-01-16T08:00:00.000Z',
    processedAt: null,
    error: null,
    metadata: { requestId: 'QR-2024-016', urgency: 'routine' },
  },
  {
    templateKey: 'contactCustomer',
    to: 'mike@example.com',
    subject: 'Contact Inquiry Received - CR-2024-003',
    htmlContent: null,
    status: 'failed',
    scheduledFor: '2024-01-15T14:00:00.000Z',
    processedAt: '2024-01-15T14:00:30.000Z',
    error: 'Resend API timeout after 30s',
    metadata: { requestId: 'CR-2024-003', urgency: 'routine' },
  },
];

async function seedScheduledEmails() {
  console.log('\n[4/4] Seeding scheduled-emails...');
  for (const email of scheduledEmails) {
    await api('POST', '/scheduled-emails', email);
    process.stdout.write('  .');
  }
  console.log(`\n  ✓ ${scheduledEmails.length} scheduled-emails created`);
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log(`Seeding against ${BASE}`);
  try {
    await seedSchedulerConfig();
    await seedABSubjectVariants();
    await seedRecipientGroups();
    await seedScheduledEmails();
    console.log('\n✅ All seed data created successfully.\n');
  } catch (err) {
    console.error('\n❌ Seed failed:', err.message);
    process.exit(1);
  }
}

main();
