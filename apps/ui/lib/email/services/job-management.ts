"use server"

// ---------------------------------------------------------------------------
// Job Management Store
// ---------------------------------------------------------------------------
// In-memory store for managing request jobs, correspondence threads, and
// activity logs. Jobs are auto-created from form submissions (contact,
// quotation, service). Each job tracks its lifecycle from initial request
// through to resolution. globalThis survives HMR.
// ---------------------------------------------------------------------------

// Types & constants are in job-management.types.ts (shared, not "use server")
import type {
  Job,
  JobStatus,
  JobPriority,
  FormType,
  Correspondence,
  CorrespondenceDirection,
  ActivityEntry,
  ActivityType,
  InternalNote,
  JobStats,
  JobQuery,
} from "./job-management.types"

// ---------------------------------------------------------------------------
// In-memory stores (globalThis to survive HMR, with deduplication)
// ---------------------------------------------------------------------------
// Uses the shared store-utils pattern: globalId() for HMR-safe unique IDs,
// createStore() for deduplication on insert and query. All future admin
// features should follow this pattern to prevent duplicate key issues.

import { globalId, createStore } from "@/lib/store-utils"

const jobStore = createStore<Job>("__job_management_jobs__")
const corrStore = createStore<Correspondence>("__job_management_correspondence__")
const actStore = createStore<ActivityEntry>("__job_management_activity__")
const noteStore = createStore<InternalNote>("__job_management_notes__")
const SEEDED_KEY = "__job_management_seeded__"

// ---------------------------------------------------------------------------
// Seed Data
// ---------------------------------------------------------------------------

function ensureSeeded(): void {
  const g = globalThis as Record<string, unknown>
  if (g[SEEDED_KEY]) return
  g[SEEDED_KEY] = true

  const jobs = jobStore.raw()
  const corr = corrStore.raw()
  const activity = actStore.raw()
  const notes = noteStore.raw()

  const now = Date.now()
  const HOUR = 3_600_000
  const DAY = 86_400_000

  const seedJobs: Job[] = [
    {
      id: "job_001", requestId: "CR-1738920001", formType: "contact", status: "new", priority: "normal",
      assignee: null, clientName: "Michael Chen", clientEmail: "michael.chen@outlook.com", clientPhone: "021 345 6789",
      subject: "General enquiry about pest control services",
      createdAt: new Date(now - 2 * HOUR).toISOString(), updatedAt: new Date(now - 2 * HOUR).toISOString(),
      tags: ["general"], archived: false,
    },
    {
      id: "job_002", requestId: "QR-1738834001", formType: "quotation", status: "acknowledged", priority: "high",
      assignee: "Sarah M.", clientName: "Lisa Thompson", clientEmail: "lisa.t@businessnz.co.nz", clientPhone: "09 456 7890",
      subject: "Quote request: Commercial kitchen pest treatment",
      createdAt: new Date(now - 1 * DAY).toISOString(), updatedAt: new Date(now - 20 * HOUR).toISOString(),
      tags: ["commercial", "kitchen", "urgent"], archived: false,
    },
    {
      id: "job_003", requestId: "SR-1738747001", formType: "service", status: "in_progress", priority: "urgent",
      assignee: "James K.", clientName: "Dave Roberts", clientEmail: "dave.r@gmail.com", clientPhone: "027 890 1234",
      subject: "Emergency: Rat infestation in ceiling",
      createdAt: new Date(now - 2 * DAY).toISOString(), updatedAt: new Date(now - 6 * HOUR).toISOString(),
      tags: ["emergency", "rats", "residential"], archived: false,
    },
    {
      id: "job_004", requestId: "CR-1738660001", formType: "contact", status: "awaiting_client", priority: "normal",
      assignee: "Sarah M.", clientName: "Rebecca Wilson", clientEmail: "rebecca.w@xtra.co.nz", clientPhone: "06 234 5678",
      subject: "Follow-up needed on ant treatment quote",
      createdAt: new Date(now - 3 * DAY).toISOString(), updatedAt: new Date(now - 1 * DAY).toISOString(),
      tags: ["ants", "residential", "follow-up"], archived: false,
    },
    {
      id: "job_005", requestId: "QR-1738573001", formType: "quotation", status: "quoted", priority: "normal",
      assignee: "James K.", clientName: "Andrew Patel", clientEmail: "a.patel@corporatenz.com", clientPhone: "04 567 8901",
      subject: "Annual pest management contract - Office building",
      createdAt: new Date(now - 4 * DAY).toISOString(), updatedAt: new Date(now - 2 * DAY).toISOString(),
      tags: ["commercial", "annual-contract", "office"], archived: false,
    },
    {
      id: "job_006", requestId: "SR-1738486001", formType: "service", status: "resolved", priority: "high",
      assignee: "Sarah M.", clientName: "Karen Hughes", clientEmail: "karen.h@gmail.com", clientPhone: "021 678 9012",
      subject: "Cockroach treatment completed - 3 month warranty",
      createdAt: new Date(now - 5 * DAY).toISOString(), updatedAt: new Date(now - 3 * DAY).toISOString(),
      tags: ["cockroaches", "residential", "warranty"], archived: false,
    },
    {
      id: "job_007", requestId: "CR-1738399001", formType: "contact", status: "closed", priority: "low",
      assignee: "James K.", clientName: "Tom Bradley", clientEmail: "tom.b@yahoo.com", clientPhone: "03 789 0123",
      subject: "Enquiry about spider proofing - no action needed",
      createdAt: new Date(now - 6 * DAY).toISOString(), updatedAt: new Date(now - 5 * DAY).toISOString(),
      tags: ["spiders", "residential", "no-action"], archived: false,
    },
    {
      id: "job_008", requestId: "QR-1738312001", formType: "quotation", status: "in_progress", priority: "high",
      assignee: "Sarah M.", clientName: "Emma Davidson", clientEmail: "emma.d@restaurantnz.co.nz", clientPhone: "09 890 1234",
      subject: "Restaurant pest management plan - Health compliance",
      createdAt: new Date(now - 7 * DAY).toISOString(), updatedAt: new Date(now - 4 * HOUR).toISOString(),
      tags: ["commercial", "restaurant", "compliance", "health"], archived: false,
    },
    {
      id: "job_009", requestId: "SR-1738225001", formType: "service", status: "new", priority: "normal",
      assignee: null, clientName: "Chris Anderson", clientEmail: "chris.a@hotmail.com", clientPhone: "027 012 3456",
      subject: "Wasp nest removal request - backyard shed",
      createdAt: new Date(now - 45 * 60_000).toISOString(), updatedAt: new Date(now - 45 * 60_000).toISOString(),
      tags: ["wasps", "residential"], archived: false,
    },
    {
      id: "job_010", requestId: "QR-1738138001", formType: "quotation", status: "awaiting_client", priority: "normal",
      assignee: "James K.", clientName: "Samantha Lee", clientEmail: "sam.lee@propertymgmt.co.nz", clientPhone: "04 123 4567",
      subject: "Multi-unit residential pest inspection quote",
      createdAt: new Date(now - 9 * DAY).toISOString(), updatedAt: new Date(now - 5 * DAY).toISOString(),
      tags: ["commercial", "inspection", "multi-unit"], archived: false,
    },
    {
      id: "job_011", requestId: "CR-1738051001", formType: "contact", status: "acknowledged", priority: "low",
      assignee: "Sarah M.", clientName: "Peter Nguyen", clientEmail: "peter.n@gmail.com", clientPhone: "021 234 5670",
      subject: "Question about eco-friendly treatment options",
      createdAt: new Date(now - 10 * DAY).toISOString(), updatedAt: new Date(now - 9 * DAY).toISOString(),
      tags: ["eco-friendly", "residential", "info"], archived: false,
    },
    {
      id: "job_012", requestId: "SR-1737964001", formType: "service", status: "resolved", priority: "urgent",
      assignee: "James K.", clientName: "Tania Cooper", clientEmail: "tania.c@schoolnz.edu.nz", clientPhone: "07 345 6780",
      subject: "Emergency school fumigation completed",
      createdAt: new Date(now - 11 * DAY).toISOString(), updatedAt: new Date(now - 8 * DAY).toISOString(),
      tags: ["emergency", "commercial", "school", "fumigation"], archived: false,
    },
    {
      id: "job_013", requestId: "QR-1737877001", formType: "quotation", status: "new", priority: "normal",
      assignee: null, clientName: "Rachel Green", clientEmail: "rachel.g@airbnb-host.co.nz", clientPhone: "06 456 7891",
      subject: "Pre-guest pest inspection for Airbnb property",
      createdAt: new Date(now - 15 * 60_000).toISOString(), updatedAt: new Date(now - 15 * 60_000).toISOString(),
      tags: ["inspection", "airbnb", "residential"], archived: false,
    },
    {
      id: "job_014", requestId: "SR-1737790001", formType: "service", status: "in_progress", priority: "high",
      assignee: "Sarah M.", clientName: "Mark Williams", clientEmail: "mark.w@warehouse.co.nz", clientPhone: "09 567 8902",
      subject: "Warehouse rodent control program - Phase 2",
      createdAt: new Date(now - 13 * DAY).toISOString(), updatedAt: new Date(now - 1 * DAY).toISOString(),
      tags: ["commercial", "warehouse", "rodents", "ongoing"], archived: false,
    },
    {
      id: "job_015", requestId: "CR-1737703001", formType: "contact", status: "closed", priority: "normal",
      assignee: "James K.", clientName: "Olivia Martinez", clientEmail: "olivia.m@outlook.com", clientPhone: "027 678 9013",
      subject: "Thank you note - excellent service",
      createdAt: new Date(now - 14 * DAY).toISOString(), updatedAt: new Date(now - 13 * DAY).toISOString(),
      tags: ["feedback", "positive", "residential"], archived: true,
    },
  ]

  // Correspondence for each job (initial + varying follow-ups)
  const seedCorrespondence: Correspondence[] = [
    // Job 001 - New contact, only initial inbound
    { id: "corr_001", jobId: "job_001", direction: "inbound", from: "michael.chen@outlook.com", to: "info@hspepperco.co.nz", subject: "General enquiry about pest control services", body: "Hi, I'd like to know more about your residential pest control services. We have a 3-bedroom house in Mt Roskill and have noticed some silverfish in the bathroom. Could you let me know what treatments you offer and approximate pricing? Thanks, Michael", timestamp: new Date(now - 2 * HOUR).toISOString(), emailType: "customer-contact" },

    // Job 002 - Acknowledged quotation
    { id: "corr_002", jobId: "job_002", direction: "inbound", from: "lisa.t@businessnz.co.nz", to: "quotes@hspepperco.co.nz", subject: "Quote request: Commercial kitchen pest treatment", body: "Hello, We urgently need a quote for pest treatment in our commercial kitchen at 45 Queen Street, Auckland CBD. We've had a health inspection flagging some concerns and need this addressed within the week. The kitchen is approximately 120sqm. Please call me to discuss. Lisa Thompson, Operations Manager", timestamp: new Date(now - 1 * DAY).toISOString(), emailType: "customer-quotation" },
    { id: "corr_003", jobId: "job_002", direction: "outbound", from: "info@hspepperco.co.nz", to: "lisa.t@businessnz.co.nz", subject: "RE: Quote request: Commercial kitchen pest treatment", body: "Hi Lisa, Thank you for reaching out. We understand the urgency with your health inspection. I've assigned Sarah from our commercial team to handle this. She will call you today to arrange an on-site assessment, likely tomorrow morning. We can typically turn around commercial kitchen treatments within 48 hours of assessment. Kind regards, H&S Pepper Co.", timestamp: new Date(now - 20 * HOUR).toISOString(), emailType: "business-response" },

    // Job 003 - In progress emergency
    { id: "corr_004", jobId: "job_003", direction: "inbound", from: "dave.r@gmail.com", to: "service@hspepperco.co.nz", subject: "Emergency: Rat infestation in ceiling", body: "URGENT - We can hear rats running in our ceiling at night and found droppings in the garage. This is getting worse. We have young children and need this sorted ASAP. Address: 22 Birch Lane, Henderson. Available any time.", timestamp: new Date(now - 2 * DAY).toISOString(), emailType: "customer-service" },
    { id: "corr_005", jobId: "job_003", direction: "outbound", from: "service@hspepperco.co.nz", to: "dave.r@gmail.com", subject: "RE: Emergency: Rat infestation in ceiling", body: "Hi Dave, This has been flagged as an emergency priority. James from our team will be at your property tomorrow at 8am for an initial assessment and baiting. Please ensure we have access to the roof cavity and garage. We'll have a treatment plan for you by end of day. Stay safe, H&S Pepper Co.", timestamp: new Date(now - 46 * HOUR).toISOString(), emailType: "business-response" },
    { id: "corr_006", jobId: "job_003", direction: "outbound", from: "service@hspepperco.co.nz", to: "dave.r@gmail.com", subject: "Update: Rat treatment - Phase 1 complete", body: "Hi Dave, James has completed the initial assessment and Phase 1 treatment. We placed 12 bait stations in the ceiling cavity and 4 in the garage. Initial findings suggest a colony entry point near the hot water cylinder. We've sealed 3 entry points and will return in 5 days for Phase 2 (monitoring and additional sealing). Please don't disturb the bait stations. Call us immediately if you notice any changes.", timestamp: new Date(now - 6 * HOUR).toISOString(), emailType: "business-update" },

    // Job 004 - Awaiting client response
    { id: "corr_007", jobId: "job_004", direction: "inbound", from: "rebecca.w@xtra.co.nz", to: "info@hspepperco.co.nz", subject: "Ant problem in kitchen", body: "Hi there, We've got ants coming into our kitchen from under the back door. They seem to be getting worse with the warmer weather. Can you help? Thanks, Rebecca", timestamp: new Date(now - 3 * DAY).toISOString(), emailType: "customer-contact" },
    { id: "corr_008", jobId: "job_004", direction: "outbound", from: "info@hspepperco.co.nz", to: "rebecca.w@xtra.co.nz", subject: "RE: Ant problem in kitchen", body: "Hi Rebecca, Thanks for getting in touch. Ant infestations are very common this time of year. We offer two treatment options:\n\n1. Standard ant treatment (interior + perimeter): $180+GST\n2. Premium ant treatment with 6-month warranty: $280+GST\n\nBoth include a thorough inspection. Could you let us know which option suits, and we'll book you in? We have availability next Tuesday or Thursday.", timestamp: new Date(now - 2.5 * DAY).toISOString(), emailType: "business-quote" },
    { id: "corr_009", jobId: "job_004", direction: "outbound", from: "info@hspepperco.co.nz", to: "rebecca.w@xtra.co.nz", subject: "Following up: Ant treatment quote", body: "Hi Rebecca, Just following up on our quote from a couple of days ago. Did you have any questions about the two treatment options? Happy to chat through them if helpful. We still have availability this week. Kind regards, Sarah - H&S Pepper Co.", timestamp: new Date(now - 1 * DAY).toISOString(), emailType: "business-followup" },

    // Job 005 - Quoted
    { id: "corr_010", jobId: "job_005", direction: "inbound", from: "a.patel@corporatenz.com", to: "quotes@hspepperco.co.nz", subject: "Annual pest management contract - Office building", body: "We are seeking quotes for an annual pest management contract for our office building at 100 Willis Street, Wellington. 8 floors, approx 4000sqm total. Quarterly inspections with on-call emergency response. Please provide a proposal and pricing. Andrew Patel, Facilities Manager", timestamp: new Date(now - 4 * DAY).toISOString(), emailType: "customer-quotation" },
    { id: "corr_011", jobId: "job_005", direction: "outbound", from: "quotes@hspepperco.co.nz", to: "a.patel@corporatenz.com", subject: "Proposal: Annual Pest Management - 100 Willis Street", body: "Dear Andrew, Please find attached our proposal for annual pest management services at 100 Willis Street.\n\nPackage Summary:\n- Quarterly comprehensive inspections (all 8 floors)\n- Monthly monitoring station checks\n- Emergency callout response within 4 hours\n- Full documentation for compliance auditing\n- Annual cost: $8,400+GST ($2,100/quarter)\n\nWe have 15 years experience with commercial office buildings. Happy to arrange a site walkthrough at your convenience. James K., Commercial Manager", timestamp: new Date(now - 2 * DAY).toISOString(), emailType: "business-proposal" },

    // Job 006 - Resolved
    { id: "corr_012", jobId: "job_006", direction: "inbound", from: "karen.h@gmail.com", to: "service@hspepperco.co.nz", subject: "Cockroach problem - bathroom and kitchen", body: "We have cockroaches appearing in our bathroom at night and recently in the kitchen too. Can you come and treat? 15 Oak Ave, Remuera.", timestamp: new Date(now - 5 * DAY).toISOString(), emailType: "customer-service" },
    { id: "corr_013", jobId: "job_006", direction: "outbound", from: "service@hspepperco.co.nz", to: "karen.h@gmail.com", subject: "Treatment complete: Cockroach treatment + 3 month warranty", body: "Hi Karen, Sarah has completed the cockroach treatment at your property today. Treatment included gel bait application in bathroom, kitchen, and laundry areas plus a full perimeter spray. Your 3-month warranty starts today. If you see any cockroach activity within this period, we'll return at no charge. Please allow 2 weeks for full effectiveness. H&S Pepper Co.", timestamp: new Date(now - 3 * DAY).toISOString(), emailType: "business-completion" },

    // Job 008 - In progress restaurant
    { id: "corr_014", jobId: "job_008", direction: "inbound", from: "emma.d@restaurantnz.co.nz", to: "quotes@hspepperco.co.nz", subject: "Restaurant pest management plan - Health compliance", body: "Hi, Our restaurant at 28 Ponsonby Rd is due for health compliance recertification next month. We need a comprehensive pest management plan documented and implemented. Can you help? We need evidence of monitoring stations, treatment records, and a signed pest management plan for the health inspector.", timestamp: new Date(now - 7 * DAY).toISOString(), emailType: "customer-quotation" },
    { id: "corr_015", jobId: "job_008", direction: "outbound", from: "quotes@hspepperco.co.nz", to: "emma.d@restaurantnz.co.nz", subject: "RE: Restaurant compliance plan", body: "Hi Emma, We specialise in restaurant compliance plans. We'll need to do an initial site assessment to create your customised plan. Sarah will visit this week to assess. The deliverables will be: documented pest management plan, monitoring station installation, initial treatment, and all compliance paperwork. We'll have everything ready well before your recertification.", timestamp: new Date(now - 6 * DAY).toISOString(), emailType: "business-response" },
    { id: "corr_016", jobId: "job_008", direction: "outbound", from: "quotes@hspepperco.co.nz", to: "emma.d@restaurantnz.co.nz", subject: "Site assessment complete + treatment plan", body: "Hi Emma, Site assessment is complete. We've identified the following areas requiring attention:\n- Kitchen: 8 monitoring stations needed\n- Storage: 4 stations + sealing of 2 entry points\n- Dining: 3 stations (preventive)\n\nTotal setup cost: $1,200+GST\nOngoing monthly monitoring: $180+GST\n\nWe can begin installation Monday. All compliance documentation will be provided digitally.", timestamp: new Date(now - 4 * HOUR).toISOString(), emailType: "business-proposal" },

    // Job 009 - New wasp request
    { id: "corr_017", jobId: "job_009", direction: "inbound", from: "chris.a@hotmail.com", to: "service@hspepperco.co.nz", subject: "Wasp nest removal request - backyard shed", body: "There's a large wasp nest on the corner of our garden shed. Getting quite aggressive when we go near. 7 Rata Street, Grey Lynn. When can someone come?", timestamp: new Date(now - 45 * 60_000).toISOString(), emailType: "customer-service" },

    // Job 014 - Ongoing warehouse program
    { id: "corr_018", jobId: "job_014", direction: "inbound", from: "mark.w@warehouse.co.nz", to: "service@hspepperco.co.nz", subject: "Warehouse rodent control program", body: "Following Phase 1, we need to continue the rodent control program in our East Tamaki warehouse (8000sqm). Phase 1 results were good but activity detected in Bay 4-6.", timestamp: new Date(now - 13 * DAY).toISOString(), emailType: "customer-service" },
    { id: "corr_019", jobId: "job_014", direction: "outbound", from: "service@hspepperco.co.nz", to: "mark.w@warehouse.co.nz", subject: "Phase 2 plan: Warehouse rodent control", body: "Hi Mark, Phase 2 will focus on Bays 4-6 with intensified baiting and additional sealing. Sarah will be on site Monday to deploy 20 additional stations in the affected bays. We'll also inspect the loading dock seals as a possible entry point.", timestamp: new Date(now - 12 * DAY).toISOString(), emailType: "business-response" },
    { id: "corr_020", jobId: "job_014", direction: "outbound", from: "service@hspepperco.co.nz", to: "mark.w@warehouse.co.nz", subject: "Phase 2 progress update", body: "Hi Mark, Good progress on Phase 2. Bait uptake in Bays 4-5 is declining which indicates population reduction. Bay 6 still showing moderate activity. We've replaced loading dock seals and added brush strips. Next check-in is Friday.", timestamp: new Date(now - 1 * DAY).toISOString(), emailType: "business-update" },
  ]

  // Activity logs
  const seedActivity: ActivityEntry[] = [
    // Job 001
    { id: "act_001", jobId: "job_001", type: "created", description: "Job created from contact form submission", user: "System", timestamp: new Date(now - 2 * HOUR).toISOString() },

    // Job 002
    { id: "act_002", jobId: "job_002", type: "created", description: "Job created from quotation form submission", user: "System", timestamp: new Date(now - 1 * DAY).toISOString() },
    { id: "act_003", jobId: "job_002", type: "assigned", description: "Assigned to Sarah M.", user: "System", timestamp: new Date(now - 23 * HOUR).toISOString(), metadata: { assignee: "Sarah M." } },
    { id: "act_004", jobId: "job_002", type: "status_change", description: "Status changed from New to Acknowledged", user: "Sarah M.", timestamp: new Date(now - 20 * HOUR).toISOString(), metadata: { from: "new", to: "acknowledged" } },
    { id: "act_005", jobId: "job_002", type: "email_sent", description: "Response email sent to client", user: "Sarah M.", timestamp: new Date(now - 20 * HOUR).toISOString() },

    // Job 003
    { id: "act_006", jobId: "job_003", type: "created", description: "Job created from service request form", user: "System", timestamp: new Date(now - 2 * DAY).toISOString() },
    { id: "act_007", jobId: "job_003", type: "priority_change", description: "Priority escalated to Urgent", user: "Sarah M.", timestamp: new Date(now - 47 * HOUR).toISOString(), metadata: { from: "high", to: "urgent" } },
    { id: "act_008", jobId: "job_003", type: "assigned", description: "Assigned to James K.", user: "Sarah M.", timestamp: new Date(now - 47 * HOUR).toISOString(), metadata: { assignee: "James K." } },
    { id: "act_009", jobId: "job_003", type: "status_change", description: "Status changed from Acknowledged to In Progress", user: "James K.", timestamp: new Date(now - 46 * HOUR).toISOString(), metadata: { from: "acknowledged", to: "in_progress" } },
    { id: "act_010", jobId: "job_003", type: "email_sent", description: "Treatment update sent to client", user: "James K.", timestamp: new Date(now - 6 * HOUR).toISOString() },
    { id: "act_011", jobId: "job_003", type: "note_added", description: "Internal note added", user: "James K.", timestamp: new Date(now - 5 * HOUR).toISOString() },

    // Job 004
    { id: "act_012", jobId: "job_004", type: "created", description: "Job created from contact form submission", user: "System", timestamp: new Date(now - 3 * DAY).toISOString() },
    { id: "act_013", jobId: "job_004", type: "assigned", description: "Assigned to Sarah M.", user: "System", timestamp: new Date(now - 3 * DAY).toISOString(), metadata: { assignee: "Sarah M." } },
    { id: "act_014", jobId: "job_004", type: "email_sent", description: "Quote options sent to client", user: "Sarah M.", timestamp: new Date(now - 2.5 * DAY).toISOString() },
    { id: "act_015", jobId: "job_004", type: "status_change", description: "Status changed to Awaiting Client", user: "Sarah M.", timestamp: new Date(now - 2.5 * DAY).toISOString(), metadata: { from: "acknowledged", to: "awaiting_client" } },
    { id: "act_016", jobId: "job_004", type: "email_sent", description: "Follow-up email sent", user: "Sarah M.", timestamp: new Date(now - 1 * DAY).toISOString() },

    // Job 005
    { id: "act_017", jobId: "job_005", type: "created", description: "Job created from quotation form submission", user: "System", timestamp: new Date(now - 4 * DAY).toISOString() },
    { id: "act_018", jobId: "job_005", type: "assigned", description: "Assigned to James K.", user: "System", timestamp: new Date(now - 4 * DAY).toISOString(), metadata: { assignee: "James K." } },
    { id: "act_019", jobId: "job_005", type: "status_change", description: "Status changed to Quoted", user: "James K.", timestamp: new Date(now - 2 * DAY).toISOString(), metadata: { from: "in_progress", to: "quoted" } },
    { id: "act_020", jobId: "job_005", type: "email_sent", description: "Proposal sent to client", user: "James K.", timestamp: new Date(now - 2 * DAY).toISOString() },

    // Job 006
    { id: "act_021", jobId: "job_006", type: "created", description: "Job created from service request form", user: "System", timestamp: new Date(now - 5 * DAY).toISOString() },
    { id: "act_022", jobId: "job_006", type: "assigned", description: "Assigned to Sarah M.", user: "System", timestamp: new Date(now - 5 * DAY).toISOString(), metadata: { assignee: "Sarah M." } },
    { id: "act_023", jobId: "job_006", type: "status_change", description: "Status changed to Resolved", user: "Sarah M.", timestamp: new Date(now - 3 * DAY).toISOString(), metadata: { from: "in_progress", to: "resolved" } },
    { id: "act_024", jobId: "job_006", type: "email_sent", description: "Completion notice with warranty sent", user: "Sarah M.", timestamp: new Date(now - 3 * DAY).toISOString() },

    // Job 009
    { id: "act_025", jobId: "job_009", type: "created", description: "Job created from service request form", user: "System", timestamp: new Date(now - 45 * 60_000).toISOString() },

    // Job 013
    { id: "act_026", jobId: "job_013", type: "created", description: "Job created from quotation form submission", user: "System", timestamp: new Date(now - 15 * 60_000).toISOString() },
  ]

  // Internal notes
  const seedNotes: InternalNote[] = [
    { id: "note_001", jobId: "job_003", content: "Roof cavity access via manhole in hallway. Hot water cylinder area is primary entry. Neighbour confirmed they also have rat activity - recommend suggesting they also get treatment. Colony is estimated at 15-20 rats based on droppings volume.", author: "James K.", timestamp: new Date(now - 5 * HOUR).toISOString() },
    { id: "note_002", jobId: "job_005", content: "Large commercial client - potential for long-term contract. Building manager Andrew is decision maker. They had issues with their previous provider (PestOff) re: response times. Emphasise our 4-hour emergency response SLA.", author: "James K.", timestamp: new Date(now - 3 * DAY).toISOString() },
    { id: "note_003", jobId: "job_008", content: "Restaurant compliance deadline is 15 March. Health inspector is John Whitfield from Auckland Council. Emma is very organised, has all access sorted. Kitchen is clean but storage area needs work. Priority should be documentation quality for the inspector.", author: "Sarah M.", timestamp: new Date(now - 5 * DAY).toISOString() },
    { id: "note_004", jobId: "job_014", content: "Bay 6 activity may be coming from neighbouring unit (Unit 7). Spoke with property manager about coordinated treatment. They will approach Unit 7 tenant. If entry is confirmed from next door, we may need to expand scope.", author: "Sarah M.", timestamp: new Date(now - 2 * DAY).toISOString() },
  ]

  jobs.push(...seedJobs)
  corr.push(...seedCorrespondence)
  activity.push(...seedActivity)
  notes.push(...seedNotes)
}

// ---------------------------------------------------------------------------
// Read: Jobs
// ---------------------------------------------------------------------------

export async function getJobs(query: JobQuery = {}): Promise<Job[]> {
  ensureSeeded()
  const store = jobStore.getAll()
  let filtered = [...store]

  if (!query.includeArchived) {
    filtered = filtered.filter((j) => !j.archived)
  }
  if (query.formType) {
    filtered = filtered.filter((j) => j.formType === query.formType)
  }
  if (query.status) {
    filtered = filtered.filter((j) => j.status === query.status)
  }
  if (query.priority) {
    filtered = filtered.filter((j) => j.priority === query.priority)
  }
  if (query.assignee) {
    filtered = filtered.filter((j) => j.assignee === query.assignee)
  }
  if (query.search) {
    const q = query.search.toLowerCase()
    filtered = filtered.filter(
      (j) =>
        j.requestId.toLowerCase().includes(q) ||
        j.clientName.toLowerCase().includes(q) ||
        j.clientEmail.toLowerCase().includes(q) ||
        j.subject.toLowerCase().includes(q) ||
        j.tags.some((t) => t.toLowerCase().includes(q)),
    )
  }

  // Sort: newest first
  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  return filtered
}

export async function getJobById(jobId: string): Promise<Job | null> {
  ensureSeeded()
  return jobStore.find((j) => j.id === jobId) ?? null
}

export async function getJobByRequestId(requestId: string): Promise<Job | null> {
  ensureSeeded()
  return jobStore.find((j) => j.requestId === requestId) ?? null
}

// ---------------------------------------------------------------------------
// Read: Correspondence, Activity, Notes
// ---------------------------------------------------------------------------

export async function getCorrespondence(jobId: string): Promise<Correspondence[]> {
  ensureSeeded()
  return corrStore
    .filter((c) => c.jobId === jobId)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
}

export async function getActivity(jobId: string): Promise<ActivityEntry[]> {
  ensureSeeded()
  return actStore
    .filter((a) => a.jobId === jobId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export async function getNotes(jobId: string): Promise<InternalNote[]> {
  ensureSeeded()
  return noteStore
    .filter((n) => n.jobId === jobId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

// ---------------------------------------------------------------------------
// Write: Update job
// ---------------------------------------------------------------------------

export async function updateJobStatus(
  jobId: string,
  newStatus: JobStatus,
  user: string,
): Promise<Job | null> {
  ensureSeeded()
  const job = jobStore.find((j) => j.id === jobId)
  if (!job) return null

  const oldStatus = job.status
  jobStore.update(jobId, (j) => { j.status = newStatus; j.updatedAt = new Date().toISOString() })

  actStore.unshift({
    id: globalId("act"),
    jobId,
    type: "status_change",
    description: `Status changed from ${formatStatus(oldStatus)} to ${formatStatus(newStatus)}`,
    user,
    timestamp: new Date().toISOString(),
    metadata: { from: oldStatus, to: newStatus },
  })

  return { ...job, status: newStatus, updatedAt: new Date().toISOString() }
}

export async function updateJobPriority(
  jobId: string,
  newPriority: JobPriority,
  user: string,
): Promise<Job | null> {
  ensureSeeded()
  const job = jobStore.find((j) => j.id === jobId)
  if (!job) return null

  const oldPriority = job.priority
  jobStore.update(jobId, (j) => { j.priority = newPriority; j.updatedAt = new Date().toISOString() })

  actStore.unshift({
    id: globalId("act"),
    jobId,
    type: "priority_change",
    description: `Priority changed from ${oldPriority} to ${newPriority}`,
    user,
    timestamp: new Date().toISOString(),
    metadata: { from: oldPriority, to: newPriority },
  })

  return { ...job, priority: newPriority, updatedAt: new Date().toISOString() }
}

export async function assignJob(
  jobId: string,
  assignee: string | null,
  user: string,
): Promise<Job | null> {
  ensureSeeded()
  const job = jobStore.find((j) => j.id === jobId)
  if (!job) return null

  jobStore.update(jobId, (j) => { j.assignee = assignee; j.updatedAt = new Date().toISOString() })

  actStore.unshift({
    id: globalId("act"),
    jobId,
    type: "assigned",
    description: assignee ? `Assigned to ${assignee}` : "Unassigned",
    user,
    timestamp: new Date().toISOString(),
    metadata: { assignee: assignee ?? "none" },
  })

  return { ...job, assignee, updatedAt: new Date().toISOString() }
}

export async function archiveJob(jobId: string): Promise<Job | null> {
  ensureSeeded()
  const job = jobStore.find((j) => j.id === jobId)
  if (!job) return null
  jobStore.update(jobId, (j) => { j.archived = true; j.updatedAt = new Date().toISOString() })
  return { ...job, archived: true, updatedAt: new Date().toISOString() }
}

// ---------------------------------------------------------------------------
// Write: Add correspondence
// ---------------------------------------------------------------------------

export async function addCorrespondence(
  jobId: string,
  data: {
    direction: CorrespondenceDirection
    from: string
    to: string
    subject: string
    body: string
    emailType: string
  },
  user: string,
): Promise<Correspondence> {
  ensureSeeded()
  const entry: Correspondence = {
    id: globalId("corr"),
    jobId,
    ...data,
    timestamp: new Date().toISOString(),
  }
  corrStore.push(entry)

  actStore.unshift({
    id: globalId("act"),
    jobId,
    type: data.direction === "outbound" ? "email_sent" : "email_received",
    description:
      data.direction === "outbound"
        ? `Reply sent to ${data.to}`
        : `Email received from ${data.from}`,
    user,
    timestamp: new Date().toISOString(),
  })

  // Update job timestamp
  jobStore.update(jobId, (j) => { j.updatedAt = new Date().toISOString() })

  return entry
}

// ---------------------------------------------------------------------------
// Write: Add note
// ---------------------------------------------------------------------------

export async function addNote(
  jobId: string,
  content: string,
  author: string,
): Promise<InternalNote> {
  ensureSeeded()
  const note: InternalNote = {
    id: globalId("note"),
    jobId,
    content,
    author,
    timestamp: new Date().toISOString(),
  }
  noteStore.unshift(note)

  actStore.unshift({
    id: globalId("act"),
    jobId,
    type: "note_added",
    description: `Internal note added by ${author}`,
    user: author,
    timestamp: new Date().toISOString(),
  })

  jobStore.update(jobId, (j) => { j.updatedAt = new Date().toISOString() })

  return note
}

// ---------------------------------------------------------------------------
// Stats
// ---------------------------------------------------------------------------

export async function getJobStats(): Promise<JobStats> {
  ensureSeeded()
  const jobs = jobStore.filter((j) => !j.archived)
  const now = Date.now()

  const stats: JobStats = {
    total: jobs.length,
    byStatus: { new: 0, acknowledged: 0, in_progress: 0, awaiting_client: 0, quoted: 0, resolved: 0, closed: 0 },
    byType: { contact: 0, quotation: 0, service: 0 },
    byPriority: { urgent: 0, high: 0, normal: 0, low: 0 },
    unassigned: 0,
    avgAge: 0,
  }

  let totalAge = 0
  for (const job of jobs) {
    stats.byStatus[job.status]++
    stats.byType[job.formType]++
    stats.byPriority[job.priority]++
    if (!job.assignee) stats.unassigned++
    totalAge += now - new Date(job.createdAt).getTime()
  }
  stats.avgAge = jobs.length > 0 ? Math.round(totalAge / jobs.length / 86_400_000) : 0

  return stats
}

// ---------------------------------------------------------------------------
// Bulk actions
// ---------------------------------------------------------------------------

export async function bulkUpdateStatus(
  jobIds: string[],
  newStatus: JobStatus,
  user: string,
): Promise<number> {
  let count = 0
  for (const id of jobIds) {
    const result = await updateJobStatus(id, newStatus, user)
    if (result) count++
  }
  return count
}

export async function bulkAssign(
  jobIds: string[],
  assignee: string | null,
  user: string,
): Promise<number> {
  let count = 0
  for (const id of jobIds) {
    const result = await assignJob(id, assignee, user)
    if (result) count++
  }
  return count
}

export async function bulkArchive(jobIds: string[]): Promise<number> {
  let count = 0
  for (const id of jobIds) {
    const result = await archiveJob(id)
    if (result) count++
  }
  return count
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatStatus(status: JobStatus): string {
  return status
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}
