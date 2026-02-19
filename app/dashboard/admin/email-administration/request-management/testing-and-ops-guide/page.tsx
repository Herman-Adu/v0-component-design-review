"use client"

import React from "react"

import Link from "next/link"
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardCheck,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Eye,
  MousePointerClick,
  PanelRightOpen,
  MessageSquare,
  Activity,
  StickyNote,
  Users,
  ArrowRightLeft,
  Smartphone,
  BookOpen,
  Briefcase,
  Mail,
  FileText,
  Wrench,
  AlertTriangle,
  BarChart3,
  Clock,
} from "lucide-react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

// ---------------------------------------------------------------------------
// Seed data reference
// ---------------------------------------------------------------------------
const SEED_JOBS = [
  { id: "CR-1001", type: "Contact", client: "Sarah Thompson", status: "In Progress", priority: "Normal", assignee: "Sarah M." },
  { id: "CR-1002", type: "Contact", client: "Mike Johnson", status: "New", priority: "Low", assignee: "--" },
  { id: "CR-1003", type: "Contact", client: "Lisa Chen", status: "Acknowledged", priority: "Normal", assignee: "James K." },
  { id: "CR-1004", type: "Contact", client: "David Patel", status: "Resolved", priority: "Normal", assignee: "Sarah M." },
  { id: "CR-1005", type: "Contact", client: "Emma Williams", status: "New", priority: "Normal", assignee: "--" },
  { id: "QR-2001", type: "Quotation", client: "Robert Brown", status: "Quoted", priority: "High", assignee: "James K." },
  { id: "QR-2002", type: "Quotation", client: "Jennifer Lee", status: "In Progress", priority: "Normal", assignee: "Sarah M." },
  { id: "QR-2003", type: "Quotation", client: "Thomas Wilson", status: "New", priority: "Urgent", assignee: "--" },
  { id: "QR-2004", type: "Quotation", client: "Amanda Garcia", status: "Awaiting Client", priority: "Normal", assignee: "James K." },
  { id: "QR-2005", type: "Quotation", client: "Chris Taylor", status: "Acknowledged", priority: "High", assignee: "--" },
  { id: "SR-3001", type: "Service", client: "Karen White", status: "In Progress", priority: "Urgent", assignee: "Sarah M." },
  { id: "SR-3002", type: "Service", client: "Peter Anderson", status: "Awaiting Client", priority: "High", assignee: "James K." },
  { id: "SR-3003", type: "Service", client: "Nicole Martin", status: "New", priority: "Normal", assignee: "--" },
  { id: "SR-3004", type: "Service", client: "James Roberts", status: "Acknowledged", priority: "Normal", assignee: "Sarah M." },
  { id: "SR-3005", type: "Service", client: "Michelle Clark", status: "Closed", priority: "Low", assignee: "James K." },
]

// ---------------------------------------------------------------------------
// Test sections
// ---------------------------------------------------------------------------
interface TestCase {
  id: number
  test: string
  steps: string
  expected: string
}

interface TestSection {
  id: string
  title: string
  icon: React.ElementType
  tests: TestCase[]
}

const TEST_SECTIONS: TestSection[] = [
  {
    id: "page-load",
    title: "Page Load & Stats",
    icon: BarChart3,
    tests: [
      { id: 1, test: "Stats cards render", steps: "Navigate to /dashboard/admin/email-administration/request-management/email-dashboard", expected: "6 stat cards: Total Active, Needs Action, Unassigned, Urgent/High, In Progress, Resolved" },
      { id: 2, test: "Stats accuracy", steps: "Compare card values to seed data", expected: "Total Active = 15, Needs Action = new + awaiting_client count, Unassigned = no-assignee count" },
      { id: 3, test: "Accent highlighting", steps: "Check Unassigned and Urgent/High cards", expected: "Cards with values > 0 have accent-coloured borders" },
    ],
  },
  {
    id: "tabs",
    title: "Tab Filtering",
    icon: SlidersHorizontal,
    tests: [
      { id: 4, test: "All Requests tab", steps: "Click 'All Requests' tab", expected: "Shows all 15 jobs, badge shows '15'" },
      { id: 5, test: "Contact tab", steps: "Click 'Contact' tab", expected: "Shows 5 Contact jobs (CR-*), badge shows '5'" },
      { id: 6, test: "Quotation tab", steps: "Click 'Quotation' tab", expected: "Shows 5 Quotation jobs (QR-*), badge shows '5'" },
      { id: 7, test: "Service tab", steps: "Click 'Service' tab", expected: "Shows 5 Service jobs (SR-*), badge shows '5'" },
      { id: 8, test: "Tab + filter combo", steps: "Click 'Contact' tab then filter Status to 'New'", expected: "Shows only Contact jobs with status 'New'" },
    ],
  },
  {
    id: "search",
    title: "Search (Global Filter)",
    icon: Search,
    tests: [
      { id: 9, test: "Search by request ID", steps: "Type 'QR-2001' in search", expected: "Only Robert Brown's quotation job" },
      { id: 10, test: "Search by client name", steps: "Type 'Sarah' in search", expected: "Shows Sarah Thompson's contact job" },
      { id: 11, test: "Search by email", steps: "Type 'robert' in search", expected: "Matches Robert Brown's job via email" },
      { id: 12, test: "Search by subject", steps: "Type 'termite' in search", expected: "Shows jobs with 'termite' in subject" },
      { id: 13, test: "Clear search", steps: "Search, then click 'Clear'", expected: "Search clears, all rows reappear" },
    ],
  },
  {
    id: "filters",
    title: "Column Filtering",
    icon: SlidersHorizontal,
    tests: [
      { id: 14, test: "Status filter", steps: "Select 'In Progress' from Status dropdown", expected: "Only In Progress jobs shown" },
      { id: 15, test: "Priority filter", steps: "Select 'Urgent' from Priority dropdown", expected: "Only urgent jobs shown" },
      { id: 16, test: "Combined filters", steps: "Status=New + search 'quotation'", expected: "Narrows to new quotation jobs" },
      { id: 17, test: "Clear all filters", steps: "Click 'Clear' with filters active", expected: "All filters reset, full dataset shown" },
    ],
  },
  {
    id: "sorting",
    title: "Sorting",
    icon: ArrowUpDown,
    tests: [
      { id: 18, test: "Sort by Request ID", steps: "Click 'Request ID' header", expected: "Sorts alphabetically. Click again to reverse" },
      { id: 19, test: "Sort by Client", steps: "Click 'Client' header", expected: "Sorts by client name" },
      { id: 20, test: "Sort by Age", steps: "Click 'Age' header", expected: "Sorts by creation date" },
    ],
  },
  {
    id: "columns",
    title: "Column Visibility",
    icon: Eye,
    tests: [
      { id: 21, test: "Open column toggle", steps: "Click 'Columns' button", expected: "Dropdown with checkboxes for each column" },
      { id: 22, test: "Hide a column", steps: "Uncheck 'priority'", expected: "Priority column disappears" },
      { id: 23, test: "Show column again", steps: "Re-check 'priority'", expected: "Priority column reappears" },
    ],
  },
  {
    id: "row-actions",
    title: "Row Actions (Dropdown)",
    icon: MousePointerClick,
    tests: [
      { id: 24, test: "Open actions menu", steps: "Click '...' on any row", expected: "Shows: View Details, Copy ID, Acknowledge, Start Work, Send Reply, Assign, Close" },
      { id: 25, test: "View Details", steps: "Click 'View Details'", expected: "Detail sheet slides in from right" },
      { id: 26, test: "Copy Request ID", steps: "Click 'Copy Request ID'", expected: "ID copied to clipboard" },
      { id: 27, test: "Acknowledge", steps: "On 'New' job, click 'Acknowledge'", expected: "Status changes to 'Acknowledged'. Activity log records it" },
      { id: 28, test: "Start Work", steps: "Click 'Start Work'", expected: "Status changes to 'In Progress'" },
      { id: 29, test: "Assign Sarah M.", steps: "Click on unassigned job", expected: "Assignee becomes 'Sarah M.'" },
      { id: 30, test: "Assign James K.", steps: "Click 'Assign James K.'", expected: "Assignee becomes 'James K.'" },
      { id: 31, test: "Close job", steps: "Click 'Close'", expected: "Status changes to 'Closed'" },
      { id: 32, test: "Send Reply shortcut", steps: "Click 'Send Reply'", expected: "Sheet opens with Correspondence tab and reply composer" },
    ],
  },
  {
    id: "row-click",
    title: "Row Click Behaviour",
    icon: PanelRightOpen,
    tests: [
      { id: 33, test: "Click row opens sheet", steps: "Click anywhere on row (not checkbox/dropdown)", expected: "Detail sheet slides in" },
      { id: 34, test: "Checkbox does NOT open sheet", steps: "Click row checkbox", expected: "Row selected, sheet stays closed" },
      { id: 35, test: "Dropdown does NOT open sheet", steps: "Click '...' button", expected: "Menu opens, sheet stays closed" },
    ],
  },
  {
    id: "sheet-header",
    title: "Sheet -- Header & Client Info",
    icon: PanelRightOpen,
    tests: [
      { id: 36, test: "Job header", steps: "Open any job detail sheet", expected: "Request ID (mono, accent), status badge, priority dot" },
      { id: 37, test: "Subject line", steps: "Check title area", expected: "Full subject in bold" },
      { id: 38, test: "Client info bar", steps: "Check below header", expected: "Name, email, phone, form type, age" },
      { id: 39, test: "Tags display", steps: "Open job with tags", expected: "Tags as outline badges, +N overflow if > 3" },
    ],
  },
  {
    id: "quick-actions",
    title: "Sheet -- Quick Actions",
    icon: SlidersHorizontal,
    tests: [
      { id: 40, test: "Change status", steps: "Use Status dropdown in sheet", expected: "Badge updates. Persists after close/reopen" },
      { id: 41, test: "Change priority", steps: "Use Priority dropdown", expected: "Priority updates, table row reflects" },
      { id: 42, test: "Change assignee", steps: "Use Assignee dropdown", expected: "Assignee updates, includes 'Unassigned'" },
      { id: 43, test: "Unassign a job", steps: "Set assignee to 'Unassigned'", expected: "Assignee clears. Stat count increases" },
      { id: 44, test: "Activity logging", steps: "After any action, check Activity tab", expected: "New entry at top of timeline" },
    ],
  },
  {
    id: "correspondence",
    title: "Correspondence & Reply",
    icon: MessageSquare,
    tests: [
      { id: 45, test: "View existing emails", steps: "Open job with seed correspondence", expected: "Inbound left-aligned (blue), outbound right-aligned (accent)" },
      { id: 46, test: "Email details", steps: "Check each entry", expected: "Direction, from/to, subject, body, timestamp" },
      { id: 47, test: "Reply composer visible", steps: "Scroll to bottom of Correspondence tab", expected: "Subject (pre-filled RE:), body textarea, Send Reply button" },
      { id: 48, test: "Send a reply", steps: "Type message, click 'Send Reply'", expected: "Sending state, new outbound entry appears, body clears" },
      { id: 49, test: "Reply validation", steps: "Click 'Send Reply' with empty body", expected: "Button disabled when body is empty" },
      { id: 50, test: "Reply in activity", steps: "After send, check Activity tab", expected: "New 'Reply sent to [email]' entry" },
      { id: 51, test: "Reply persists", steps: "Close sheet, reopen same job", expected: "Reply still in correspondence thread" },
      { id: 52, test: "Multiple replies", steps: "Send 2-3 replies to same job", expected: "All appear chronologically with timestamps" },
    ],
  },
  {
    id: "activity",
    title: "Activity Timeline",
    icon: Activity,
    tests: [
      { id: 53, test: "View timeline", steps: "Click Activity tab", expected: "Vertical timeline with connected line, icons per type" },
      { id: 54, test: "Entry types", steps: "Review entries", expected: "Different icons: status, email_sent, received, note, assigned, priority, created" },
      { id: 55, test: "New first", steps: "Perform action, check Activity", expected: "New entry at top" },
      { id: 56, test: "Count badge", steps: "Check tab label", expected: "'Activity (N)' with correct count" },
    ],
  },
  {
    id: "notes",
    title: "Internal Notes",
    icon: StickyNote,
    tests: [
      { id: 57, test: "View existing notes", steps: "Open job with seed notes (CR-1001)", expected: "Amber-tinted cards with author and timestamp" },
      { id: 58, test: "Add a note", steps: "Type in textarea, click 'Save Note'", expected: "Note appears, textarea clears" },
      { id: 59, test: "Note validation", steps: "Click 'Save Note' empty", expected: "Button disabled" },
      { id: 60, test: "Note persists", steps: "Close and reopen job", expected: "Note still there" },
      { id: 61, test: "Note in activity", steps: "After adding, check Activity", expected: "'Internal note added' entry" },
      { id: 62, test: "Count badge", steps: "Check tab label", expected: "'Notes (N)' with correct count" },
    ],
  },
  {
    id: "bulk",
    title: "Bulk Actions",
    icon: Users,
    tests: [
      { id: 63, test: "Select single row", steps: "Click one checkbox", expected: "Row highlights, '1 selected' in toolbar" },
      { id: 64, test: "Select multiple", steps: "Click 3 checkboxes", expected: "'3 selected' in toolbar" },
      { id: 65, test: "Select all on page", steps: "Click header checkbox", expected: "All visible rows selected" },
      { id: 66, test: "Bulk Acknowledge", steps: "Select 2+ New jobs, dropdown: 'Mark Acknowledged'", expected: "All change to Acknowledged" },
      { id: 67, test: "Bulk In Progress", steps: "Select, dropdown: 'Mark In Progress'", expected: "All change to In Progress" },
      { id: 68, test: "Bulk Resolved", steps: "Select, dropdown: 'Mark Resolved'", expected: "All change to Resolved" },
      { id: 69, test: "Bulk Assign Sarah", steps: "Select, 'Assign Sarah M.'", expected: "All assigned to Sarah M." },
      { id: 70, test: "Bulk Assign James", steps: "Select, 'Assign James K.'", expected: "All assigned to James K." },
      { id: 71, test: "Bulk Archive", steps: "Select, 'Archive Selected'", expected: "Jobs disappear, selection resets" },
      { id: 72, test: "Verify after bulk", steps: "Open affected job", expected: "Sheet reflects update, activity logged" },
    ],
  },
  {
    id: "pagination",
    title: "Pagination",
    icon: ArrowRightLeft,
    tests: [
      { id: 73, test: "Default page size", steps: "Check table on first load", expected: "10 rows, 'Page 1 of 2'" },
      { id: 74, test: "Change page size", steps: "Dropdown: select '5'", expected: "5 rows, page count recalculates" },
      { id: 75, test: "Next page", steps: "Click right arrow", expected: "Next page shows" },
      { id: 76, test: "Previous page", steps: "Click left arrow", expected: "Previous page shows" },
      { id: 77, test: "First/Last page", steps: "Click double-arrow buttons", expected: "Jumps to boundary" },
      { id: 78, test: "Disabled at boundary", steps: "On first page check prev; on last check next", expected: "Buttons disabled at boundaries" },
    ],
  },
  {
    id: "responsive",
    title: "Responsiveness",
    icon: Smartphone,
    tests: [
      { id: 79, test: "Desktop (1200px+)", steps: "Full desktop width", expected: "All columns, sheet ~50% width" },
      { id: 80, test: "Tablet (768px)", steps: "Resize to tablet", expected: "Priority filter hides, columns readable" },
      { id: 81, test: "Mobile (375px)", steps: "Resize to mobile", expected: "Toolbar stacks, table scrolls, sheet full-width" },
    ],
  },
]

// ---------------------------------------------------------------------------
// Workflow data
// ---------------------------------------------------------------------------
const STATUS_PIPELINE = [
  { status: "New", meaning: "Just arrived. Nobody has looked at it yet", who: "Admin team", colour: "bg-blue-500/20 text-blue-400" },
  { status: "Acknowledged", meaning: "Admin confirmed receipt to customer", who: "Admin team", colour: "bg-cyan-500/20 text-cyan-400" },
  { status: "In Progress", meaning: "Actively being worked on", who: "Admin team", colour: "bg-amber-500/20 text-amber-400" },
  { status: "Awaiting Client", meaning: "Waiting for customer response", who: "Customer", colour: "bg-purple-500/20 text-purple-400" },
  { status: "Quoted", meaning: "Formal quotation sent", who: "Customer", colour: "bg-emerald-500/20 text-emerald-400" },
  { status: "Resolved", meaning: "Work complete, customer satisfied", who: "Admin (to close)", colour: "bg-green-500/20 text-green-400" },
  { status: "Closed", meaning: "Fully closed and archived", who: "Nobody", colour: "bg-muted text-muted-foreground" },
]

const PRIORITY_SLA = [
  { priority: "Urgent", sla: "Same business day", examples: "Active termite infestation, rat sighting in food area, safety hazard", colour: "bg-red-500/20 text-red-400" },
  { priority: "High", sla: "Within 4 hours", examples: "Commercial client quote, repeat customer issue, large job enquiry", colour: "bg-orange-500/20 text-orange-400" },
  { priority: "Normal", sla: "Within 24 hours", examples: "Standard residential enquiry, general quotation, non-urgent service", colour: "bg-blue-500/20 text-blue-400" },
  { priority: "Low", sla: "Within 48 hours", examples: "Information request, general feedback, non-time-sensitive", colour: "bg-muted text-muted-foreground" },
]

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function TestingGuidePage() {
  const [completedTests, setCompletedTests] = useState<Set<number>>(new Set())

  const toggleTest = (testId: number) => {
    setCompletedTests((prev) => {
      const next = new Set(prev)
      if (next.has(testId)) {
        next.delete(testId)
      } else {
        next.add(testId)
      }
      return next
    })
  }

  const totalTests = TEST_SECTIONS.reduce((sum, s) => sum + s.tests.length, 0)
  const completedCount = completedTests.size
  const progressPercent = totalTests > 0 ? Math.round((completedCount / totalTests) * 100) : 0

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/admin/email-administration/request-management/email-dashboard">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <ArrowLeft className="h-4 w-4" />
              Back to Job Tracker
            </Button>
          </Link>
        </div>
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <ClipboardCheck className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground text-balance">Testing & Operations Guide</h1>
              <p className="text-sm text-muted-foreground">Request Management Hub -- complete testing checklist and business workflow</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <Card className="border-border bg-card">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Test Progress</span>
            <span className="text-sm text-muted-foreground">
              {completedCount} / {totalTests} tests passed ({progressPercent}%)
            </span>
          </div>
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {progressPercent === 100 && (
            <p className="text-sm text-green-400 mt-2 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> All tests passing
            </p>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="testing" className="space-y-6">
        <TabsList className="bg-muted/50 h-auto flex-wrap">
          <TabsTrigger value="seed-data" className="gap-2">
            <FileText className="h-4 w-4" />
            Seed Data
          </TabsTrigger>
          <TabsTrigger value="testing" className="gap-2">
            <ClipboardCheck className="h-4 w-4" />
            <span>Testing</span>
            <Badge variant="secondary" className="ml-1 text-[10px]">{totalTests}</Badge>
          </TabsTrigger>
          <TabsTrigger value="workflow" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Workflow Guide
          </TabsTrigger>
        </TabsList>

        {/* ---- SEED DATA TAB ---- */}
        <TabsContent value="seed-data" className="space-y-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Pre-Loaded Test Data</CardTitle>
              <CardDescription>15 seed jobs across 3 form types. Loaded automatically on first visit.</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="w-full">
                <div className="min-w-[700px]">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left">
                        <th className="py-2 pr-4 font-medium text-muted-foreground">Request ID</th>
                        <th className="py-2 pr-4 font-medium text-muted-foreground">Type</th>
                        <th className="py-2 pr-4 font-medium text-muted-foreground">Client</th>
                        <th className="py-2 pr-4 font-medium text-muted-foreground">Status</th>
                        <th className="py-2 pr-4 font-medium text-muted-foreground">Priority</th>
                        <th className="py-2 font-medium text-muted-foreground">Assignee</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SEED_JOBS.map((job) => (
                        <tr key={job.id} className="border-b border-border/50">
                          <td className="py-2 pr-4 font-mono text-accent text-xs">{job.id}</td>
                          <td className="py-2 pr-4">
                            <Badge variant="outline" className={
                              job.type === "Contact" ? "border-blue-500/30 text-blue-400 bg-transparent" :
                              job.type === "Quotation" ? "border-emerald-500/30 text-emerald-400 bg-transparent" :
                              "border-amber-500/30 text-amber-400 bg-transparent"
                            }>{job.type}</Badge>
                          </td>
                          <td className="py-2 pr-4 text-foreground">{job.client}</td>
                          <td className="py-2 pr-4">
                            <Badge variant="secondary" className="text-[10px]">{job.status}</Badge>
                          </td>
                          <td className="py-2 pr-4">
                            <span className={
                              job.priority === "Urgent" ? "text-red-400" :
                              job.priority === "High" ? "text-orange-400" :
                              job.priority === "Low" ? "text-muted-foreground" : "text-foreground"
                            }>{job.priority}</span>
                          </td>
                          <td className="py-2 text-muted-foreground">{job.assignee}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </ScrollArea>
              <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-border">
                <div className="text-sm"><span className="text-muted-foreground">Correspondence entries:</span> <span className="font-medium text-foreground">20</span></div>
                <div className="text-sm"><span className="text-muted-foreground">Activity entries:</span> <span className="font-medium text-foreground">26</span></div>
                <div className="text-sm"><span className="text-muted-foreground">Internal notes:</span> <span className="font-medium text-foreground">4</span></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ---- TESTING TAB ---- */}
        <TabsContent value="testing" className="space-y-4">
          {TEST_SECTIONS.map((section) => {
            const sectionCompleted = section.tests.filter((t) => completedTests.has(t.id)).length
            const allDone = sectionCompleted === section.tests.length
            return (
              <Card key={section.id} className={`border-border bg-card ${allDone ? "border-green-500/30" : ""}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <section.icon className={`h-4 w-4 ${allDone ? "text-green-400" : "text-muted-foreground"}`} />
                      <CardTitle className="text-base text-foreground">{section.title}</CardTitle>
                    </div>
                    <Badge variant={allDone ? "default" : "secondary"} className={allDone ? "bg-green-500/20 text-green-400 border-0" : ""}>
                      {sectionCompleted}/{section.tests.length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-1">
                    {section.tests.map((test) => {
                      const done = completedTests.has(test.id)
                      return (
                        <div
                          key={test.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => toggleTest(test.id)}
                          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleTest(test.id) } }}
                          className={`flex items-start gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${
                            done ? "bg-green-500/5" : "hover:bg-muted/30"
                          }`}
                        >
                          <div className={`mt-0.5 h-4 w-4 shrink-0 rounded border flex items-center justify-center transition-colors ${
                            done ? "bg-green-500/20 border-green-500/50" : "border-border"
                          }`}>
                            {done && <CheckCircle2 className="h-3 w-3 text-green-400" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-baseline gap-2">
                              <span className="text-[10px] text-muted-foreground font-mono">#{test.id}</span>
                              <span className={`text-sm font-medium ${done ? "text-green-400 line-through" : "text-foreground"}`}>
                                {test.test}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{test.steps}</p>
                            <p className="text-xs text-accent/80 mt-0.5">{test.expected}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>

        {/* ---- WORKFLOW GUIDE TAB ---- */}
        <TabsContent value="workflow" className="space-y-6">
          {/* Status Pipeline */}
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center gap-2.5">
                <Briefcase className="h-4 w-4 text-accent" />
                <CardTitle className="text-foreground">Request Lifecycle</CardTitle>
              </div>
              <CardDescription>Every customer request follows this pipeline from submission to closure.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-2 mb-6">
                {STATUS_PIPELINE.map((s, i) => (
                  <div key={s.status} className="flex items-center gap-2">
                    <Badge className={`${s.colour} border-0`}>{s.status}</Badge>
                    {i < STATUS_PIPELINE.length - 1 && <span className="text-muted-foreground">{">"}</span>}
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {STATUS_PIPELINE.map((s) => (
                  <div key={s.status} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/20">
                    <Badge className={`${s.colour} border-0 shrink-0 min-w-[120px] justify-center`}>{s.status}</Badge>
                    <div className="min-w-0">
                      <p className="text-sm text-foreground">{s.meaning}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Next action: {s.who}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Daily Triage */}
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-accent" />
                <CardTitle className="text-foreground">Daily Triage Workflow</CardTitle>
              </div>
              <CardDescription>Process all new requests within 2 hours of the business day starting.</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3 text-sm text-foreground">
                <li className="flex gap-3"><span className="shrink-0 h-6 w-6 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-bold">1</span><span>Open <Link href="/dashboard/admin/email-administration/request-management/email-dashboard" className="text-accent hover:underline">Request Management</Link> and check the <strong>Needs Action</strong> stat card</span></li>
                <li className="flex gap-3"><span className="shrink-0 h-6 w-6 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-bold">2</span><span>Filter by <strong>Status: New</strong> to see only unprocessed requests</span></li>
                <li className="flex gap-3"><span className="shrink-0 h-6 w-6 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-bold">3</span><span>Click each row to open the detail sheet. Read the initial correspondence</span></li>
                <li className="flex gap-3"><span className="shrink-0 h-6 w-6 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-bold">4</span><span>Set <strong>priority</strong> (Urgent/High/Normal/Low) and <strong>assign</strong> to a team member</span></li>
                <li className="flex gap-3"><span className="shrink-0 h-6 w-6 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-bold">5</span><span>Change status to <strong>Acknowledged</strong></span></li>
                <li className="flex gap-3"><span className="shrink-0 h-6 w-6 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-bold">6</span><span>Send an acknowledgement reply in the Correspondence tab confirming receipt</span></li>
                <li className="flex gap-3"><span className="shrink-0 h-6 w-6 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-bold">7</span><span>Add internal notes if needed. After all requests triaged, <strong>Unassigned stat should be 0</strong></span></li>
              </ol>
            </CardContent>
          </Card>

          {/* Processing by Type */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-blue-500/20 bg-card">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-400" />
                  <CardTitle className="text-sm text-foreground">Contact Requests (CR-*)</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-2">
                <p>General enquiries from the contact form.</p>
                <ol className="space-y-1 list-decimal list-inside">
                  <li>Read initial message</li>
                  <li>If answerable: reply and set <strong className="text-foreground">Awaiting Client</strong> or <strong className="text-foreground">Resolved</strong></li>
                  <li>If escalation needed: add note, reassign, keep <strong className="text-foreground">In Progress</strong></li>
                  <li>When resolved: <strong className="text-foreground">Resolved</strong> then <strong className="text-foreground">Closed</strong> after a few days</li>
                </ol>
              </CardContent>
            </Card>
            <Card className="border-emerald-500/20 bg-card">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-emerald-400" />
                  <CardTitle className="text-sm text-foreground">Quotation Requests (QR-*)</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-2">
                <p>Formal quotes need preparation and sending.</p>
                <ol className="space-y-1 list-decimal list-inside">
                  <li>Set to <strong className="text-foreground">In Progress</strong>, prepare quote</li>
                  <li>Send quote via reply composer with pricing and scope</li>
                  <li>Set to <strong className="text-foreground">Quoted</strong>, add note with value</li>
                  <li>If accepted: <strong className="text-foreground">In Progress</strong> then <strong className="text-foreground">Resolved</strong></li>
                  <li>If declined/14 days silence: <strong className="text-foreground">Closed</strong></li>
                </ol>
              </CardContent>
            </Card>
            <Card className="border-amber-500/20 bg-card">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-amber-400" />
                  <CardTitle className="text-sm text-foreground">Service Requests (SR-*)</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-2">
                <p>Specific pest control or maintenance work.</p>
                <ol className="space-y-1 list-decimal list-inside">
                  <li>Set priority by pest type (termites = Urgent)</li>
                  <li>Set to <strong className="text-foreground">In Progress</strong>, reply with inspection date</li>
                  <li>Set to <strong className="text-foreground">Awaiting Client</strong> until confirmed</li>
                  <li>Add note with scheduled date and technician</li>
                  <li>After service: follow-up email, then <strong className="text-foreground">Resolved</strong></li>
                </ol>
              </CardContent>
            </Card>
          </div>

          {/* Priority SLAs */}
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="h-4 w-4 text-accent" />
                <CardTitle className="text-foreground">Priority & Response SLAs</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {PRIORITY_SLA.map((p) => (
                  <div key={p.priority} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/20">
                    <Badge className={`${p.colour} border-0 shrink-0 min-w-[80px] justify-center`}>{p.priority}</Badge>
                    <div className="min-w-0">
                      <p className="text-sm text-foreground font-medium">{p.sla}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{p.examples}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Best Practices */}
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center gap-2.5">
                <BookOpen className="h-4 w-4 text-accent" />
                <CardTitle className="text-foreground">Best Practices</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div>
                <h4 className="font-medium text-foreground mb-1">Correspondence</h4>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Always send replies through the system so the thread stays complete</li>
                  <li>{"The subject 'RE: [original]' is pre-filled -- don't change it to maintain threading"}</li>
                  <li>When sending important info (quotes, schedules), also add an internal note summarising key details</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-1">Internal Notes</h4>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Record customer sentiment, internal decisions, scheduling details</li>
                  <li>Add follow-up reminders (e.g., "Check back in 7 days if no response")</li>
                  <li>Document escalation records and manager approvals</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-1">Bulk Operations</h4>
                <ul className="space-y-1 list-disc list-inside">
                  <li><strong className="text-foreground">End-of-day:</strong> Filter Resolved, select all, bulk Close</li>
                  <li><strong className="text-foreground">Morning batch:</strong> Filter New, select all, bulk Acknowledge, then individually reply</li>
                  <li><strong className="text-foreground">Reassignment:</strong> Search by assignee name, select, bulk reassign</li>
                  <li><strong className="text-foreground">Archive:</strong> Filter Closed, sort by Age (oldest), select stale jobs, Archive</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
