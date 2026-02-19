# Request Management Hub -- Testing & Operations Guide

> **Page URL**: `/dashboard/admin/email-jobs`
> **Navigation**: Sidebar > Email Management > Request Management

---

## Part 1: Pre-Loaded Test Data

The system ships with **15 seed jobs** across 3 form types, **20 correspondence entries**, **26 activity timeline entries**, and **4 internal notes**. This data is populated automatically on first load -- no setup required.

| Request ID | Type | Client | Status | Priority | Assignee |
|-----------|------|--------|--------|----------|----------|
| CR-1001 | Contact | Sarah Thompson | In Progress | Normal | Sarah M. |
| CR-1002 | Contact | Mike Johnson | New | Low | -- |
| CR-1003 | Contact | Lisa Chen | Acknowledged | Normal | James K. |
| CR-1004 | Contact | David Patel | Resolved | Normal | Sarah M. |
| CR-1005 | Contact | Emma Williams | New | Normal | -- |
| QR-2001 | Quotation | Robert Brown | Quoted | High | James K. |
| QR-2002 | Quotation | Jennifer Lee | In Progress | Normal | Sarah M. |
| QR-2003 | Quotation | Thomas Wilson | New | Urgent | -- |
| QR-2004 | Quotation | Amanda Garcia | Awaiting Client | Normal | James K. |
| QR-2005 | Quotation | Chris Taylor | Acknowledged | High | -- |
| SR-3001 | Service | Karen White | In Progress | Urgent | Sarah M. |
| SR-3002 | Service | Peter Anderson | Awaiting Client | High | James K. |
| SR-3003 | Service | Nicole Martin | New | Normal | -- |
| SR-3004 | Service | James Roberts | Acknowledged | Normal | Sarah M. |
| SR-3005 | Service | Michelle Clark | Closed | Low | James K. |

---

## Part 2: Functional Testing Checklist

### 2.1 Page Load & Stats Dashboard

| # | Test | Steps | Expected Result |
|---|------|-------|-----------------|
| 1 | Stats cards render | Navigate to `/dashboard/admin/email-jobs` | 6 stat cards appear: Total Active, Needs Action, Unassigned, Urgent/High, In Progress, Resolved |
| 2 | Stats accuracy | Compare card values to seed data above | Total Active = 15, Needs Action = count of "new" + "awaiting_client", Unassigned = count of jobs with no assignee |
| 3 | Accent highlighting | Look at Unassigned and Urgent/High cards | Cards with values > 0 should have accent-coloured borders and text |

### 2.2 Tab Filtering

| # | Test | Steps | Expected Result |
|---|------|-------|-----------------|
| 4 | All Requests tab | Click "All Requests" tab | Shows all 15 jobs, badge shows "15" |
| 5 | Contact tab | Click "Contact" tab | Shows only 5 Contact jobs (CR-*), badge shows "5" |
| 6 | Quotation tab | Click "Quotation" tab | Shows only 5 Quotation jobs (QR-*), badge shows "5" |
| 7 | Service tab | Click "Service" tab | Shows only 5 Service jobs (SR-*), badge shows "5" |
| 8 | Tab + filter combo | Click "Contact" tab then set Status filter to "New" | Shows only Contact jobs with status "New" |

### 2.3 Search (Global Filter)

| # | Test | Steps | Expected Result |
|---|------|-------|-----------------|
| 9 | Search by request ID | Type `QR-2001` in search box | Only shows Robert Brown's quotation job |
| 10 | Search by client name | Type `Sarah` in search box | Shows Sarah Thompson's contact job |
| 11 | Search by email | Type `robert` in search box | Shows Robert Brown's job (matches email) |
| 12 | Search by subject | Type `termite` in search box | Shows jobs with "termite" in the subject |
| 13 | Clear search | Type a search term, then click "Clear" button | Search clears, all rows reappear |

### 2.4 Column Filtering

| # | Test | Steps | Expected Result |
|---|------|-------|-----------------|
| 14 | Status filter | Select "In Progress" from Status dropdown | Only jobs with "In Progress" status shown |
| 15 | Priority filter | Select "Urgent" from Priority dropdown (desktop only) | Only urgent priority jobs shown |
| 16 | Combined filters | Set Status to "New" and search for "quotation" | Narrows to new quotation jobs only |
| 17 | Clear all filters | Click "Clear" button when filters are active | All filters reset, full dataset shown |

### 2.5 Sorting

| # | Test | Steps | Expected Result |
|---|------|-------|-----------------|
| 18 | Sort by Request ID | Click "Request ID" column header | Rows sort alphabetically by ID. Click again to reverse |
| 19 | Sort by Client | Click "Client" column header | Rows sort alphabetically by client name |
| 20 | Sort by Age | Click "Age" column header | Rows sort by creation date (newest/oldest) |

### 2.6 Column Visibility

| # | Test | Steps | Expected Result |
|---|------|-------|-----------------|
| 21 | Open column toggle | Click the "Columns" button in toolbar | Dropdown shows checkboxes for each hideable column |
| 22 | Hide a column | Uncheck "priority" | Priority column disappears from table |
| 23 | Show column again | Re-check "priority" | Priority column reappears |

### 2.7 Row Actions (Per-Row Dropdown)

| # | Test | Steps | Expected Result |
|---|------|-------|-----------------|
| 24 | Open actions menu | Click the "..." button on any row | Dropdown shows: View Details, Copy Request ID, Acknowledge, Start Work, Send Reply, Assign Sarah M., Assign James K., Close |
| 25 | View Details | Click "View Details" in dropdown | Detail sheet slides in from the right with full job info |
| 26 | Copy Request ID | Click "Copy Request ID" in dropdown | Request ID copied to clipboard (paste to verify) |
| 27 | Acknowledge | On a "New" job, click "Acknowledge" | Status badge changes to "Acknowledged". Stats update. Open sheet to verify activity log shows the change |
| 28 | Start Work | Click "Start Work" in dropdown | Status changes to "In Progress" |
| 29 | Assign Sarah M. | Click "Assign Sarah M." on an unassigned job | Assignee column changes to "Sarah M.". Unassigned stat decreases |
| 30 | Assign James K. | Click "Assign James K." | Assignee column changes to "James K." |
| 31 | Close job | Click "Close" in dropdown | Status changes to "Closed" |
| 32 | Send Reply shortcut | Click "Send Reply" in dropdown | Detail sheet opens with Correspondence tab visible and reply composer ready |

### 2.8 Row Click -> Detail Sheet

| # | Test | Steps | Expected Result |
|---|------|-------|-----------------|
| 33 | Click row to open sheet | Click anywhere on a row (not on checkbox or dropdown) | Detail sheet slides in from the right |
| 34 | Click checkbox does NOT open sheet | Click the checkbox on a row | Row gets selected, sheet does NOT open |
| 35 | Click dropdown does NOT open sheet | Click the "..." button | Dropdown opens, sheet does NOT open |

### 2.9 Detail Sheet -- Header & Client Info

| # | Test | Steps | Expected Result |
|---|------|-------|-----------------|
| 36 | Job header | Open any job's detail sheet | Shows: Request ID (monospace, accent colour), Status badge with icon, Priority dot with label |
| 37 | Subject line | Check the title area | Full subject text displayed in bold |
| 38 | Client info bar | Check below the header | Shows: client name, email, phone (if available), form type, creation age |
| 39 | Tags display | Open a job that has tags | Tags show as small outline badges. If more than 3, shows "+N" overflow |

### 2.10 Detail Sheet -- Quick Actions Bar

| # | Test | Steps | Expected Result |
|---|------|-------|-----------------|
| 40 | Change status via dropdown | Open sheet, use the Status dropdown | Status badge updates immediately. Close and reopen sheet to verify persistence |
| 41 | Change priority via dropdown | Use the Priority dropdown in the sheet | Priority updates. Table row reflects the change when sheet closes |
| 42 | Change assignee via dropdown | Use the Assignee dropdown | Assignee updates. Includes "Unassigned" option |
| 43 | Unassign a job | Set assignee to "Unassigned" | Assignee clears. Unassigned stat count increases |
| 44 | Verify activity logging | After any quick action, click "Activity" tab | New activity entry appears at the top of the timeline showing the change |

### 2.11 Detail Sheet -- Correspondence Tab

| # | Test | Steps | Expected Result |
|---|------|-------|-----------------|
| 45 | View existing emails | Open any job with seed correspondence | Email thread displayed chronologically. Inbound (received) messages left-aligned with blue arrow. Outbound (sent) messages right-aligned with accent arrow |
| 46 | Email details | Check each correspondence entry | Shows: direction indicator, from/to address, subject line, body text, relative timestamp |
| 47 | Reply composer visible | Scroll to bottom of correspondence tab | Subject field (pre-filled with "RE: [original subject]"), body textarea, "Replying to [email]" label, Send Reply button |
| 48 | Send a reply | Type a message in the body textarea and click "Send Reply" | Button shows "Sending..." during submission. After completion: new outbound entry appears in the thread above, body textarea clears, subject remains |
| 49 | Reply validation | Try clicking "Send Reply" with empty body | Button is disabled when body is empty |
| 50 | Verify reply in activity | After sending reply, click "Activity" tab | New "Reply sent to [email]" entry appears at the top |
| 51 | Verify reply persists | Close sheet, reopen the same job | The reply you just sent is still in the correspondence thread |
| 52 | Multiple replies | Send 2-3 replies to the same job | All replies appear in chronological order with correct timestamps |

### 2.12 Detail Sheet -- Activity Tab

| # | Test | Steps | Expected Result |
|---|------|-------|-----------------|
| 53 | View activity timeline | Click "Activity" tab | Vertical timeline with connected line. Each entry has: icon (varies by type), description, user, formatted timestamp |
| 54 | Activity entry types | Review the timeline entries | Different icons for: status_change (refresh), email_sent (send), email_received (mail), note_added (sticky note), assigned (user+), priority_change (alert), created (dot) |
| 55 | New activities appear first | Perform an action (change status), then check Activity tab | The new activity entry appears at the top of the timeline |
| 56 | Activity count badge | Check the tab label | Shows "Activity (N)" with the correct count |

### 2.13 Detail Sheet -- Notes Tab

| # | Test | Steps | Expected Result |
|---|------|-------|-----------------|
| 57 | View existing notes | Open a job that has seed notes (e.g., CR-1001) | Internal notes displayed in amber-tinted cards with author name and timestamp |
| 58 | Add a new note | Type in the note textarea and click "Save Note" | Note appears in the list above. Textarea clears |
| 59 | Note validation | Try clicking "Save Note" with empty textarea | Button is disabled when content is empty |
| 60 | Note persists | Close sheet, reopen the same job, go to Notes tab | The note you added is still there |
| 61 | Verify note in activity | After adding a note, check Activity tab | New "Internal note added" entry appears |
| 62 | Notes count badge | Check the tab label | Shows "Notes (N)" with the correct count |

### 2.14 Bulk Actions

| # | Test | Steps | Expected Result |
|---|------|-------|-----------------|
| 63 | Select single row | Click the checkbox on one row | Row highlights. Selection count shows "1 selected" in toolbar |
| 64 | Select multiple rows | Click checkboxes on 3 rows | "3 selected" appears in toolbar |
| 65 | Select all on page | Click the header checkbox | All visible rows on current page selected |
| 66 | Bulk Acknowledge | Select 2+ "New" jobs, click "N selected" dropdown, click "Mark Acknowledged" | All selected jobs change to "Acknowledged". Stats update |
| 67 | Bulk In Progress | Select jobs, use dropdown to "Mark In Progress" | All selected jobs change to "In Progress" |
| 68 | Bulk Resolved | Select jobs, use dropdown to "Mark Resolved" | All selected jobs change to "Resolved" |
| 69 | Bulk Assign Sarah | Select jobs, click "Assign Sarah M." | All selected jobs now assigned to Sarah M. |
| 70 | Bulk Assign James | Select jobs, click "Assign James K." | All selected jobs now assigned to James K. |
| 71 | Bulk Archive | Select jobs, click "Archive Selected" (red) | Selected jobs disappear from the table. Selection resets |
| 72 | Verify after bulk | After any bulk action, open one of the affected jobs | The sheet reflects the updated status/assignee and the activity log shows the change |

### 2.15 Pagination

| # | Test | Steps | Expected Result |
|---|------|-------|-----------------|
| 73 | Default page size | Observe the table on first load | Shows 10 rows per page. "Page 1 of 2" displayed |
| 74 | Change page size | Use the page size dropdown, select "5" | Table shows 5 rows. Page count recalculates |
| 75 | Next page | Click the right arrow button | Shows next page of results |
| 76 | Previous page | Click the left arrow button | Returns to previous page |
| 77 | First/Last page | Click double-arrow buttons | Jumps to first or last page |
| 78 | Disabled buttons | On first page, check first/prev buttons. On last page, check next/last buttons | Buttons are visually disabled and non-clickable when at boundary |

### 2.16 Responsiveness

| # | Test | Steps | Expected Result |
|---|------|-------|-----------------|
| 79 | Desktop (1200px+) | View at full desktop width | All columns visible, sheet takes ~50% width |
| 80 | Tablet (768px) | Resize to tablet width | Priority filter hides, "Columns" text hides (icon only), columns still readable |
| 81 | Mobile (375px) | Resize to mobile width | Toolbar stacks vertically, table scrolls horizontally, sheet goes full-width |

---

## Part 3: Business Operations Workflow Guide

This section describes the recommended workflow for business admin users to process customer requests from initial submission through to resolution.

### 3.1 The Request Lifecycle

Every customer request follows this pipeline:

```
[Customer submits form] -> NEW -> ACKNOWLEDGED -> IN PROGRESS -> AWAITING CLIENT / QUOTED -> RESOLVED -> CLOSED
```

| Status | Meaning | Who acts next? | Colour |
|--------|---------|----------------|--------|
| **New** | Just arrived from the website. Nobody has looked at it yet | Admin team | Blue |
| **Acknowledged** | Admin has seen it and confirmed receipt to the customer | Admin team | Cyan |
| **In Progress** | Actively being worked on (inspection scheduled, quote being prepared, etc.) | Admin team | Amber |
| **Awaiting Client** | Ball is in the customer's court (waiting for info, confirmation, payment) | Customer | Purple |
| **Quoted** | A formal quotation has been sent to the customer | Customer | Emerald |
| **Resolved** | Work is complete, customer is satisfied | Admin (to close) | Green |
| **Closed** | Job is fully closed and archived | Nobody | Grey |

### 3.2 Daily Triage Workflow (Start of Day)

**Goal**: Process all new requests within 2 hours of the business day starting.

1. **Open Request Management** (`/dashboard/admin/email-jobs`)
2. **Check the "Needs Action" stat card** -- this shows how many jobs need your attention right now
3. **Click the "New" status in the Status filter dropdown** to see only new requests
4. **For each new request**:
   - Click the row to open the detail sheet
   - Read the initial correspondence to understand what the customer needs
   - **Set the priority**: Urgent (same-day response needed), High (respond within 4 hours), Normal (respond within 24 hours), Low (batch process end of week)
   - **Assign to a team member** using the Assignee dropdown
   - **Change status to "Acknowledged"**
   - **Send an acknowledgement reply**: In the Correspondence tab, type a reply confirming receipt and setting expectations for next contact. Click "Send Reply"
   - **Add an internal note** if needed (e.g., "Customer sounds upset, handle with care" or "Need to check stock for this product")
5. After triaging all new requests, check the **"Unassigned" stat** -- it should be 0

### 3.3 Processing a Contact Request (CR-*)

Contact requests are general enquiries from the website contact form.

1. Open the job from the table
2. Read the initial message in the Correspondence tab
3. Determine if you can answer directly or need to escalate
4. **If you can answer**: Compose a reply in the reply composer, send it, then change status to **Awaiting Client** (if you asked a question) or **Resolved** (if you provided the answer)
5. **If you need to escalate**: Add an internal note explaining who should handle this, reassign to the appropriate person, keep status as "In Progress"
6. **When resolved**: Change status to "Resolved". After a few days with no further contact, change to "Closed"

### 3.4 Processing a Quotation Request (QR-*)

Quotation requests need a formal quote to be prepared and sent.

1. Open the job, read the initial request details
2. Change status to **In Progress**
3. Prepare the quotation externally (or using your quoting system)
4. Once ready, use the reply composer to send the quotation details to the customer. Include pricing, scope of work, and validity period
5. Change status to **Quoted**
6. Add an internal note with the quote value and any special terms
7. **If the customer accepts**: Change to "In Progress" (for the actual work) then "Resolved" when complete
8. **If the customer declines or doesn't respond after 14 days**: Change to "Closed" and add a note

### 3.5 Processing a Service Request (SR-*)

Service requests are for specific pest control or maintenance work.

1. Open the job, review the service type and urgency requested
2. Set priority based on pest type (termites/rats = Urgent, general enquiry = Normal)
3. Change status to **In Progress**
4. Send a reply with the proposed inspection date/time
5. Change status to **Awaiting Client** until they confirm the appointment
6. Once confirmed, add a note with the scheduled date and technician assigned
7. After the service visit, send a follow-up email with findings and any recommendations
8. Change status to **Resolved**
9. After final payment or sign-off, change to **Closed**

### 3.6 Managing Ongoing Correspondence

Every email sent through the reply composer is recorded in the job's Correspondence tab. This creates a full audit trail.

**Best practices**:
- Always send replies through the system (not from your personal email) so the thread stays complete
- Use the subject line "RE: [original subject]" (pre-filled automatically) to maintain threading
- When sending important information (quotes, schedules, agreements), also add an internal note summarising the key details
- When the customer replies externally, you can add their response as a note for now (until inbound email integration is added)

### 3.7 Using Internal Notes Effectively

Notes are visible only to admin staff -- never sent to the customer.

**Use notes for**:
- Customer sentiment ("Very happy with the quote", "Complained about wait time")
- Internal decisions ("Discounted 10% per manager approval")
- Scheduling details ("Inspection booked 15 Feb, Technician: Dave")
- Escalation records ("Referred to senior tech due to complexity")
- Follow-up reminders ("Check back in 7 days if no response")

### 3.8 Bulk Operations for Efficiency

When managing many requests at once:

| Scenario | Steps |
|----------|-------|
| **End-of-day cleanup** | Filter by "Resolved", select all, bulk change to "Closed" |
| **Reassign workload** | Filter by assignee (search their name), select relevant jobs, bulk reassign to another team member |
| **Morning batch acknowledge** | Filter by "New", select all, bulk change to "Acknowledged". Then individually open each to send personalised replies |
| **Archive old jobs** | Filter by "Closed", sort by Age (oldest first), select stale jobs, "Archive Selected" |

### 3.9 Priority Management

| Priority | Response SLA | Examples |
|----------|-------------|----------|
| **Urgent** | Same business day | Active termite infestation, rat sighting in food area, safety hazard |
| **High** | Within 4 hours | Commercial client quote request, repeat customer issue, large job enquiry |
| **Normal** | Within 24 hours | Standard residential enquiry, general information request, routine service |
| **Low** | Within 3 business days | Price comparison enquiry, future planning question, feedback/testimonial |

### 3.10 Monitoring & KPIs

Use the stats dashboard at the top of the page to monitor:

| Metric | Target | Action if exceeded |
|--------|--------|--------------------|
| **New requests** | 0 by end of day | Triage immediately |
| **Unassigned** | 0 at all times | Assign during morning triage |
| **Awaiting Client** count | Monitor for staleness | Follow up if no response in 7 days |
| **Urgent/High** count | 0 by end of day | Prioritise these above all other work |
| **Average age** | Below 5 days | Review any jobs older than 7 days for closure |

---

## Part 4: Known Limitations & Future Enhancements

| Current Behaviour | Future Enhancement |
|-------------------|--------------------|
| Reply composer records email in the correspondence thread but does not actually send via Resend API | Wire to the existing email service for real delivery |
| Inbound customer replies are not automatically captured | Add inbound webhook from Resend to auto-create correspondence entries |
| Seed data resets on server restart (in-memory store) | Migrate to database (Supabase/Neon) for persistent storage |
| Assignees are hardcoded to "Sarah M." and "James K." | Pull from an admin users table |
| No email notification when a new request arrives | Add real-time notification via the existing email notification system |
| No file attachments on correspondence | Integrate with the attachment config system (already built) |
| No due dates or SLA countdown timers | Add SLA tracking based on priority-to-response-time mapping |
