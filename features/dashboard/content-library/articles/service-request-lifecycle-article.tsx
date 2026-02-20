"use client";

import {
  SectionHeader,
  SubSectionHeader,
  InfoBox,
  StepFlow,
  FeatureGrid,
  KeyTakeaway,
  RelatedArticles,
  TableOfContents,
  MetricsGrid,
  StatsTable,
  VerticalFlow,
  DataFlowDiagram,
  type TOCItem,
  ArticleIcons,
} from "@/components/molecules/article-components";

const tocItems: TOCItem[] = [
  { id: "overview", title: "Overview", level: 2 },
  { id: "lifecycle-stages", title: "The 6 Lifecycle Stages", level: 2 },
  { id: "stage-1-submission", title: "Stage 1: Submission", level: 3 },
  { id: "stage-2-validation", title: "Stage 2: Validation", level: 3 },
  { id: "stage-3-confirmation", title: "Stage 3: Confirmation", level: 3 },
  { id: "stage-4-assignment", title: "Stage 4: Assignment", level: 3 },
  { id: "stage-5-completion", title: "Stage 5: Completion", level: 3 },
  { id: "stage-6-followup", title: "Stage 6: Follow-Up", level: 3 },
  { id: "data-flow", title: "How Data Flows Through the System", level: 2 },
  { id: "status-tracking", title: "Status Tracking", level: 2 },
  { id: "email-notifications", title: "Email Notifications", level: 2 },
  { id: "metrics", title: "Key Performance Metrics", level: 2 },
  { id: "common-issues", title: "Common Issues & Solutions", level: 2 },
  { id: "takeaway", title: "Key Takeaway", level: 2 },
];

export function ServiceRequestLifecycleArticleContent() {
  return (
    <div className="flex gap-8">
      <div className="flex-1 min-w-0 space-y-8">
        {/* ---------- Section 1: Overview ---------- */}
        <SectionHeader id="overview" number={1} title="Overview" />

        <p className="text-muted-foreground leading-relaxed">
          Every service request follows the same predictable path from the
          moment a customer submits the form to the final follow-up.
          Understanding this lifecycle helps business administrators track jobs,
          identify bottlenecks, and improve response times -- without needing to
          understand any code.
        </p>

        <InfoBox type="info" title="Who Is This For?">
          <ul className="list-disc pl-4 space-y-1">
            <li>Business administrators who manage service request queues</li>
            <li>Project leads who oversee electrician job assignments</li>
            <li>Operations managers tracking response times and SLAs</li>
            <li>
              Anyone who needs to understand the system without technical jargon
            </li>
          </ul>
        </InfoBox>

        <MetricsGrid
          metrics={[
            {
              label: "Lifecycle Stages",
              value: "6",
              description: "From submission to follow-up",
            },
            {
              label: "Avg. Response Time",
              value: "<24h",
              description: "First response target",
            },
            {
              label: "Email Notifications",
              value: "4",
              description: "Sent during the lifecycle",
            },
            {
              label: "Status Values",
              value: "7",
              description: "Tracking request progress",
            },
          ]}
        />

        {/* ---------- Section 2: Lifecycle Stages ---------- */}
        <SectionHeader
          id="lifecycle-stages"
          number={2}
          title="The 6 Lifecycle Stages"
        />

        <p className="text-muted-foreground leading-relaxed">
          A service request passes through six stages. Each stage has a clear
          purpose, a responsible party, and triggers the next stage
          automatically or via admin action.
        </p>

        <StepFlow
          steps={[
            {
              label: "Submission",
              description: "Customer fills out the online form",
            },
            {
              label: "Validation",
              description: "System checks data completeness",
            },
            {
              label: "Confirmation",
              description: "Customer receives email confirmation",
            },
            {
              label: "Assignment",
              description: "Admin assigns to an electrician",
            },
            {
              label: "Completion",
              description: "Electrician marks job as done",
            },
            {
              label: "Follow-Up",
              description: "System sends satisfaction survey",
            },
          ]}
        />

        <SubSectionHeader
          id="stage-1-submission"
          title="Stage 1: Customer Submission"
        />

        <p className="text-muted-foreground leading-relaxed">
          The customer visits the service request page and fills out a
          multi-step form. The form collects contact details, service type,
          preferred date and time, and a description of the work needed. The
          form is split into steps to avoid overwhelming the customer with too
          many fields at once.
        </p>

        <FeatureGrid
          features={[
            {
              icon: <ArticleIcons.User className="h-5 w-5" />,
              title: "Contact Details",
              description:
                "Name, email, phone number. Used for all communication.",
            },
            {
              icon: <ArticleIcons.Tool className="h-5 w-5" />,
              title: "Service Type",
              description:
                "Installation, repair, inspection, emergency. Determines pricing and urgency.",
            },
            {
              icon: <ArticleIcons.Calendar className="h-5 w-5" />,
              title: "Scheduling",
              description: "Preferred date, time window, and property address.",
            },
            {
              icon: <ArticleIcons.FileText className="h-5 w-5" />,
              title: "Description",
              description:
                "Free text explaining what needs doing. Helps the electrician prepare.",
            },
          ]}
        />

        <SubSectionHeader
          id="stage-2-validation"
          title="Stage 2: System Validation"
        />

        <p className="text-muted-foreground leading-relaxed">
          The moment the customer clicks Submit, the system validates all
          fields. This happens on both the customer{"'"}s browser (for instant
          feedback) and on the server (for security). If validation fails, the
          customer sees clear error messages and can correct their input without
          losing any data.
        </p>

        <InfoBox type="important" title="Why Two Layers of Validation?">
          <ul className="list-disc pl-4 space-y-1">
            <li>
              Browser validation: Instant feedback, catches typos and missing
              fields immediately
            </li>
            <li>
              Server validation: Security layer that cannot be bypassed,
              prevents malicious input
            </li>
            <li>
              {
                "Both use the same rules (Zod schemas) so they always agree on what's valid"
              }
            </li>
          </ul>
        </InfoBox>

        <SubSectionHeader
          id="stage-3-confirmation"
          title="Stage 3: Confirmation"
        />

        <p className="text-muted-foreground leading-relaxed">
          After successful validation, the system saves the request to the
          database and assigns a unique reference number (e.g. SR-2026-0042).
          Two things happen simultaneously: the customer sees a success screen
          with their reference number, and the system sends a confirmation
          email.
        </p>

        <VerticalFlow
          title="What Happens After Submit"
          steps={[
            {
              label: "Database Save",
              description:
                "Request saved with status 'new' and reference number generated",
            },
            {
              label: "Success Screen",
              description:
                "Customer sees confirmation with reference number to keep",
            },
            {
              label: "Email Sent",
              description:
                "Confirmation email with request details and reference number",
            },
            {
              label: "Admin Queue",
              description:
                "Request appears in the admin dashboard ready for assignment",
            },
          ]}
        />

        <SubSectionHeader
          id="stage-4-assignment"
          title="Stage 4: Admin Assignment"
        />

        <p className="text-muted-foreground leading-relaxed">
          A business administrator reviews the request in the admin dashboard
          and assigns it to an available electrician based on skill set,
          location, and schedule. The admin can add internal notes, adjust the
          priority, and set an estimated completion date. Once assigned, the
          electrician receives a notification.
        </p>

        <FeatureGrid
          features={[
            {
              icon: <ArticleIcons.CheckCircle className="h-5 w-5" />,
              title: "Skill Matching",
              description:
                "Emergency requests go to certified emergency electricians.",
            },
            {
              icon: <ArticleIcons.Navigation className="h-5 w-5" />,
              title: "Location Routing",
              description:
                "Assign to nearest available electrician to minimise travel time.",
            },
            {
              icon: <ArticleIcons.Clock className="h-5 w-5" />,
              title: "Schedule Check",
              description: "View electrician availability before assigning.",
            },
            {
              icon: <ArticleIcons.Star className="h-5 w-5" />,
              title: "Priority Setting",
              description: "Emergency, urgent, standard, or low priority.",
            },
          ]}
        />

        <SubSectionHeader
          id="stage-5-completion"
          title="Stage 5: Job Completion"
        />

        <p className="text-muted-foreground leading-relaxed">
          When the electrician finishes the work, they update the job status to{" "}
          {'"'}completed{'"'} through their interface. This triggers the system
          to update the database, send a completion notification to the
          customer, and generate an invoice if applicable.
        </p>

        <SubSectionHeader id="stage-6-followup" title="Stage 6: Follow-Up" />

        <p className="text-muted-foreground leading-relaxed">
          48 hours after job completion, the system automatically sends a
          satisfaction survey to the customer. Responses are tracked in the
          admin dashboard and contribute to the company{"'"}s quality metrics.
          If the customer reports an issue, the request is automatically flagged
          for review.
        </p>

        {/* ---------- Section 3: Data Flow ---------- */}
        <SectionHeader
          id="data-flow"
          number={3}
          title="How Data Flows Through the System"
        />

        <p className="text-muted-foreground leading-relaxed">
          This diagram shows how information moves from the customer through the
          system to the electrician and back.
        </p>

        <DataFlowDiagram
          nodes={[
            { label: "Customer Form", description: "Multi-step input" },
            { label: "Validation", description: "Browser + Server" },
            { label: "Database", description: "Persistent storage" },
            { label: "Admin Dashboard", description: "Review & assign" },
            { label: "Electrician", description: "Job execution" },
            { label: "Email System", description: "Notifications" },
          ]}
        />

        <InfoBox type="tip" title="Reading the Data Flow">
          <ul className="list-disc pl-4 space-y-1">
            <li>
              Left to right: The primary flow from customer submission to job
              completion
            </li>
            <li>
              {
                "The Email System connects to multiple stages (confirmation, assignment, completion, follow-up)"
              }
            </li>
            <li>
              The Database is the central store -- every stage reads from and
              writes to it
            </li>
            <li>
              The Admin Dashboard is the control point where human decisions
              happen
            </li>
          </ul>
        </InfoBox>

        {/* ---------- Section 4: Status Tracking ---------- */}
        <SectionHeader
          id="status-tracking"
          number={4}
          title="Status Tracking"
        />

        <p className="text-muted-foreground leading-relaxed">
          Every request has a status value that tells you exactly where it is in
          the lifecycle. Here are all 7 possible statuses and what they mean.
        </p>

        <StatsTable
          headers={["Status", "Meaning", "Who Changes It", "Next Status"]}
          rows={[
            [
              "New",
              "Just submitted, waiting for review",
              "System (automatic)",
              "Under Review",
            ],
            [
              "Under Review",
              "Admin is reviewing the request",
              "Admin (manual)",
              "Assigned",
            ],
            [
              "Assigned",
              "Electrician has been assigned",
              "Admin (manual)",
              "In Progress",
            ],
            [
              "In Progress",
              "Electrician is working on the job",
              "Electrician",
              "Completed",
            ],
            ["Completed", "Work is finished", "Electrician", "Closed"],
            [
              "Closed",
              "Follow-up complete, request archived",
              "System (automatic)",
              "N/A",
            ],
            [
              "On Hold",
              "Waiting on customer or parts",
              "Admin (manual)",
              "In Progress",
            ],
          ]}
        />

        {/* ---------- Section 5: Email Notifications ---------- */}
        <SectionHeader
          id="email-notifications"
          number={5}
          title="Email Notifications"
        />

        <p className="text-muted-foreground leading-relaxed">
          The system sends 4 automated emails during the lifecycle. Each email
          uses a branded template and includes the reference number for easy
          tracking.
        </p>

        <StatsTable
          headers={["Email", "Trigger", "Recipient", "Contains"]}
          rows={[
            [
              "Confirmation",
              "Successful submission",
              "Customer",
              "Reference number, service details, expected timeline",
            ],
            [
              "Assignment",
              "Admin assigns electrician",
              "Customer + Electrician",
              "Electrician name, scheduled date, contact info",
            ],
            [
              "Completion",
              "Job marked complete",
              "Customer",
              "Work summary, invoice (if applicable), feedback link",
            ],
            [
              "Survey",
              "48 hours after completion",
              "Customer",
              "Satisfaction rating, comment box, issue flag option",
            ],
          ]}
        />

        <InfoBox type="warning" title="Email Delivery">
          <ul className="list-disc pl-4 space-y-1">
            <li>
              {
                "Emails are sent via Resend (transactional email service) for reliable delivery"
              }
            </li>
            <li>
              If an email fails to send, the system retries up to 3 times with
              exponential backoff
            </li>
            <li>
              Failed emails are logged but never block the request from
              progressing
            </li>
            <li>
              Check the Email Infrastructure section of the admin dashboard for
              delivery reports
            </li>
          </ul>
        </InfoBox>

        {/* ---------- Section 6: Key Performance Metrics ---------- */}
        <SectionHeader
          id="metrics"
          number={6}
          title="Key Performance Metrics"
        />

        <p className="text-muted-foreground leading-relaxed">
          Track these metrics in the admin dashboard to measure operational
          health and identify bottlenecks.
        </p>

        <MetricsGrid
          metrics={[
            {
              label: "Time to First Response",
              value: "<24h",
              description: "Target: respond within 24 hours of submission",
            },
            {
              label: "Assignment Rate",
              value: ">95%",
              description: "Percentage of requests assigned within 48 hours",
            },
            {
              label: "Completion Rate",
              value: ">90%",
              description: "Percentage of assigned jobs completed as scheduled",
            },
            {
              label: "Customer Satisfaction",
              value: ">4.5/5",
              description: "Average survey rating from follow-up emails",
            },
          ]}
        />

        <FeatureGrid
          features={[
            {
              icon: <ArticleIcons.BarChart className="h-5 w-5" />,
              title: "Volume Trends",
              description:
                "Track requests per week/month. Identify seasonal patterns. Plan staffing.",
            },
            {
              icon: <ArticleIcons.Clock className="h-5 w-5" />,
              title: "Response Time",
              description:
                "Measure time from submission to first admin action. SLA compliance.",
            },
            {
              icon: <ArticleIcons.AlertTriangle className="h-5 w-5" />,
              title: "Bottleneck Detection",
              description:
                "Identify stages where requests sit longest. Optimise assignment process.",
            },
            {
              icon: <ArticleIcons.Star className="h-5 w-5" />,
              title: "Quality Score",
              description:
                "Aggregate satisfaction ratings. Flag electricians below threshold.",
            },
          ]}
        />

        {/* ---------- Section 7: Common Issues ---------- */}
        <SectionHeader
          id="common-issues"
          number={7}
          title="Common Issues & Solutions"
        />

        <p className="text-muted-foreground leading-relaxed">
          Problems that business administrators encounter most frequently, and
          how to resolve them.
        </p>

        <StatsTable
          headers={["Issue", "Likely Cause", "Solution"]}
          rows={[
            [
              "Customer didn't receive confirmation email",
              "Email in spam folder or invalid address",
              "Check email logs in admin. Resend manually if address is valid.",
            ],
            [
              "Request stuck in 'New' for over 24 hours",
              "No admin has reviewed it yet",
              "Check admin queue. Set up alerts for unreviewed requests.",
            ],
            [
              "Electrician says they weren't notified",
              "Email delivery failure or wrong contact info",
              "Check email logs. Verify electrician's contact details in system.",
            ],
            [
              "Customer submitted duplicate requests",
              "Form didn't show success confirmation fast enough",
              "Merge duplicates in admin. The system prevents exact duplicates.",
            ],
            [
              "Survey response flagged an issue",
              "Customer unhappy with completed work",
              "Review the flag in admin. Contact customer. Schedule follow-up visit.",
            ],
          ]}
        />

        <InfoBox type="tip" title="Escalation Path">
          <ul className="list-disc pl-4 space-y-1">
            <li>
              {
                "Unresolved issues after 48 hours: Escalate to operations manager"
              }
            </li>
            <li>
              {
                "Customer complaints about quality: Route to senior electrician for review"
              }
            </li>
            <li>
              {
                "System errors (emails not sending, form not loading): Contact technical support"
              }
            </li>
          </ul>
        </InfoBox>

        {/* ---------- Key Takeaway ---------- */}
        <div id="takeaway">
          <KeyTakeaway
            points={[
              "Every service request follows 6 predictable stages from submission to follow-up",
              "Status tracking tells you exactly where each request is at any moment",
              "4 automated emails keep customers informed without manual effort",
              "Key metrics (response time, assignment rate, satisfaction) measure operational health",
              "The admin dashboard is your control centre -- use it to assign, track, and resolve",
              "Most common issues are email-related and can be resolved by checking delivery logs",
            ]}
          />
        </div>

        <RelatedArticles
          articles={[
            {
              title: "Multi-Step Form: From Prototype to Production",
              href: "/dashboard/content-library/articles/architecture/multi-step-form-architecture",
            },
            {
              title: "Building Email Templates with React Email",
              href: "/dashboard/content-library/articles/architecture/email-system-architecture",
            },
            {
              title: "Planning a Full-Stack Application: Week Zero",
              href: "/dashboard/content-library/articles/architecture/planning-full-stack-application",
            },
          ]}
        />
      </div>

      {/* Sticky TOC sidebar */}
      <aside className="hidden xl:block w-64 flex-shrink-0">
        <TableOfContents items={tocItems} />
      </aside>
    </div>
  );
}
