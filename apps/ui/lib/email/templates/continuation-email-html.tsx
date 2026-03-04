/**
 * Continuation Email Template
 *
 * Branded HTML email for all follow-up correspondence sent from the
 * Request Management Hub. Matches the visual style of the original
 * confirmation emails (header gradient, card blocks, footer) while
 * rendering dynamic content sections added by the admin.
 *
 * Supports all 3 form types (contact, quotation, service) and all
 * urgency levels (routine, urgent, emergency).
 */

import {
  COMPANY,
  BRAND_COLORS,
  URGENCY_COLORS,
  getHeaderGradient,
  getDefaultHeaderGradient,
  getFooterHtml,
  getContactInfoHtml,
  type UrgencyLevel,
} from "@/lib/email/config/email-config";
import type {
  FormType,
  JobPriority,
} from "@/lib/email/services/job-management.types";

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface ContentSection {
  label: string;
  content: string;
}

export interface ContinuationEmailProps {
  formType: FormType;
  requestId: string;
  clientName: string;
  subject: string;
  priority?: JobPriority;
  urgency?: UrgencyLevel;
  greeting?: string;
  sections: ContentSection[];
  signOff?: string;
  includeContactInfo?: boolean;
}

// ---------------------------------------------------------------------------
// Preset section templates (used by the reply composer UI)
// ---------------------------------------------------------------------------

export const SECTION_PRESETS: {
  id: string;
  label: string;
  sectionLabel: string;
  content: string;
  formTypes: FormType[];
}[] = [
  {
    id: "acknowledgement",
    label: "Acknowledgement",
    sectionLabel: "Update",
    content:
      "We have received your request and are currently reviewing the details. A member of our team will be in touch shortly with next steps.",
    formTypes: ["contact", "quotation", "service"],
  },
  {
    id: "additional-info",
    label: "Request More Info",
    sectionLabel: "Additional Information Required",
    content:
      "To process your request efficiently, we require the following additional information:\n\n- \n- \n\nPlease reply to this email or call us at your convenience.",
    formTypes: ["contact", "quotation", "service"],
  },
  {
    id: "scheduling",
    label: "Schedule Visit",
    sectionLabel: "Scheduling Your Appointment",
    content:
      "We would like to schedule a visit to assess and carry out the required work. Our available times are:\n\n- \n- \n\nPlease let us know which time suits you best, or suggest an alternative.",
    formTypes: ["service"],
  },
  {
    id: "quote-provided",
    label: "Quote Provided",
    sectionLabel: "Your Quotation",
    content:
      "Based on our assessment, please find below the quotation for the requested work:\n\nScope of Work:\n\nEstimated Cost: $\nValidity: 30 days from the date of this email\n\nThis quotation includes all labour and materials unless otherwise stated. Please confirm your acceptance by replying to this email.",
    formTypes: ["quotation", "service"],
  },
  {
    id: "job-complete",
    label: "Job Complete",
    sectionLabel: "Service Completed",
    content:
      "We are pleased to confirm that the requested work has been completed successfully.\n\nWork Summary:\n\nAll work has been carried out to the highest standard. A detailed invoice will follow separately. If you have any questions or concerns about the work, please do not hesitate to contact us.",
    formTypes: ["service"],
  },
  {
    id: "follow-up",
    label: "General Follow-up",
    sectionLabel: "Follow-up",
    content:
      "Thank you for your patience. We wanted to provide you with an update regarding your request.\n\n",
    formTypes: ["contact", "quotation", "service"],
  },
  {
    id: "next-steps",
    label: "Next Steps",
    sectionLabel: "Next Steps",
    content:
      "Here is what will happen next:\n\n1. \n2. \n3. \n\nWe will keep you informed of progress throughout.",
    formTypes: ["contact", "quotation", "service"],
  },
  {
    id: "safety-notice",
    label: "Safety Notice",
    sectionLabel: "Important Safety Information",
    content:
      "For your safety, please note the following ahead of our visit:\n\n- Ensure the area around the work site is clear and accessible\n- Keep children and pets away from the work area\n- Our technician will carry identification and PPE\n\nIf you have any specific safety concerns, please let us know in advance.",
    formTypes: ["service"],
  },
  {
    id: "payment-details",
    label: "Payment Details",
    sectionLabel: "Payment Information",
    content:
      "Please find below the payment details for the completed work:\n\nAmount Due: $\nPayment Reference: \n\nPayment Methods:\n- Bank Transfer\n- Credit/Debit Card (by phone)\n\nPayment is due within 14 days of the invoice date. Please use the reference number above when making payment.",
    formTypes: ["quotation", "service"],
  },
];

// ---------------------------------------------------------------------------
// Section label options (for the dropdown in the composer)
// ---------------------------------------------------------------------------

export const SECTION_LABEL_OPTIONS: string[] = [
  "Update",
  "Additional Information Required",
  "Scheduling Your Appointment",
  "Your Quotation",
  "Service Completed",
  "Follow-up",
  "Next Steps",
  "Important Safety Information",
  "Payment Information",
  "Site Assessment",
  "Materials & Equipment",
  "Warranty Information",
  "Terms & Conditions",
  "Custom",
];

// ---------------------------------------------------------------------------
// Helper: map priority to urgency for header gradient
// ---------------------------------------------------------------------------

function getUrgencyFromPriority(
  priority?: JobPriority,
  urgency?: UrgencyLevel,
): UrgencyLevel {
  if (urgency) return urgency;
  if (!priority) return "routine";
  switch (priority) {
    case "urgent":
      return "urgent";
    case "high":
      return "routine";
    default:
      return "routine";
  }
}

// ---------------------------------------------------------------------------
// Helper: form type display labels & badge colours
// ---------------------------------------------------------------------------

const FORM_TYPE_CONFIG: Record<
  FormType,
  { label: string; badgeBg: string; badgeText: string }
> = {
  contact: {
    label: "Contact Inquiry",
    badgeBg: "#dbeafe",
    badgeText: "#1e40af",
  },
  quotation: {
    label: "Quotation Request",
    badgeBg: "#fef3c7",
    badgeText: "#b45309",
  },
  service: {
    label: "Service Request",
    badgeBg: "#d1fae5",
    badgeText: "#065f46",
  },
};

// ---------------------------------------------------------------------------
// Main template generator
// ---------------------------------------------------------------------------

export function generateContinuationEmail(
  props: ContinuationEmailProps,
): string {
  const {
    formType,
    requestId,
    clientName,
    subject,
    priority,
    urgency,
    greeting,
    sections,
    signOff,
    includeContactInfo = true,
  } = props;

  const resolvedUrgency = getUrgencyFromPriority(priority, urgency);
  const isEmergency = resolvedUrgency === "emergency";
  const isUrgent = resolvedUrgency === "urgent";
  const urgencyColors = URGENCY_COLORS[resolvedUrgency];
  const formConfig = FORM_TYPE_CONFIG[formType];

  const headerGradient =
    resolvedUrgency === "routine"
      ? getDefaultHeaderGradient()
      : getHeaderGradient(resolvedUrgency);

  const firstName = clientName.split(" ")[0];
  const greetingText = greeting || `Dear ${firstName},`;
  const signOffText = signOff || `The ${COMPANY.name} Team`;

  // Indicate that work has started
  const workStarted = true;

  // Build the content section blocks
  const sectionBlocks = sections
    .map((section) => {
      const cardBg = urgencyColors.cardBg || BRAND_COLORS.bgCardMuted;
      const cardBorder = urgencyColors.cardBorder || BRAND_COLORS.borderDefault;
      const borderWidth = resolvedUrgency === "routine" ? "1px" : "2px";

      // Convert newlines to <br> for proper HTML rendering
      const htmlContent = section.content
        .split("\n")
        .map((line) => line.trim())
        .join("<br>");

      return `
              <!-- Section: ${section.label} -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 20px;">
                <tr>
                  <td style="background-color: ${cardBg}; border: ${borderWidth} solid ${cardBorder}; border-radius: 8px; overflow: hidden;">
                    <!-- Section Header -->
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding: 14px 20px; background-color: ${isEmergency ? "#fecaca" : isUrgent ? "#fde68a" : BRAND_COLORS.borderDefault}; border-bottom: ${borderWidth} solid ${cardBorder};">
                          <h3 style="margin: 0; color: ${isEmergency ? "#991b1b" : isUrgent ? "#78350f" : BRAND_COLORS.textDark}; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                            ${section.label}
                          </h3>
                        </td>
                      </tr>
                    </table>
                    <!-- Section Content -->
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding: 20px;">
                          <p style="margin: 0; color: ${BRAND_COLORS.textMuted}; font-size: 14px; line-height: 1.7;">
                            ${htmlContent}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>`;
    })
    .join("\n");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RE: ${subject} - ${requestId}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: ${BRAND_COLORS.bgBody};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: ${BRAND_COLORS.bgBody};">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: ${BRAND_COLORS.bgCard}; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 32px; background: ${headerGradient}; border-radius: 12px 12px 0 0;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <!-- Logo -->
                    <div style="display: inline-block; background: ${isEmergency ? "#dc2626" : BRAND_COLORS.primary}; width: 56px; height: 56px; border-radius: 12px; text-align: center; line-height: 56px; font-size: 28px; margin-bottom: 16px;">
                      &#9889;
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <h1 style="margin: 0; color: ${BRAND_COLORS.textWhite}; font-size: 22px; font-weight: 700;">${COMPANY.name}</h1>
                    <p style="margin: 6px 0 0; color: ${BRAND_COLORS.primaryLight}; font-size: 13px;">${COMPANY.tagline}</p>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 16px;">
                    <!-- Reference badge + type badge -->
                    <table role="presentation" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding-right: 8px;">
                          <span style="display: inline-block; background-color: rgba(255,255,255,0.15); color: ${BRAND_COLORS.textWhite}; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">
                            RE: ${requestId}
                          </span>
                        </td>
                        <td>
                          <span style="display: inline-block; background-color: ${formConfig.badgeBg}; color: ${formConfig.badgeText}; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">
                            ${formConfig.label}
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          ${
            isEmergency
              ? `
          <!-- Emergency Banner -->
          <tr>
            <td style="padding: 0 40px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top: 24px;">
                <tr>
                  <td style="background-color: #fee2e2; border-left: 4px solid #dc2626; padding: 16px 20px; border-radius: 8px;">
                    <p style="margin: 0; color: #dc2626; font-size: 14px; font-weight: 700;">URGENT PRIORITY CORRESPONDENCE</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          `
              : isUrgent
                ? `
          <!-- Urgent Banner -->
          <tr>
            <td style="padding: 0 40px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top: 24px;">
                <tr>
                  <td style="background-color: #fffbeb; border-left: 4px solid #d97706; padding: 16px 20px; border-radius: 8px;">
                    <p style="margin: 0; color: #b45309; font-size: 14px; font-weight: 700;">HIGH PRIORITY CORRESPONDENCE</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          `
                : ""
          }

          <!-- Body Content -->
          <tr>
            <td style="padding: 32px 40px 16px;">
              <!-- Greeting -->
              <p style="margin: 0 0 20px; color: ${BRAND_COLORS.textDark}; font-size: 16px; line-height: 1.6;">
                ${greetingText}
              </p>

              <p style="margin: 0 0 24px; color: ${BRAND_COLORS.textMuted}; font-size: 15px; line-height: 1.6;">
                Thank you for your continued communication regarding your ${formConfig.label.toLowerCase()} (ref: <strong>${requestId}</strong>). Please find the latest information below.
              </p>

              <!-- Dynamic Content Sections -->
${sectionBlocks}
            </td>
          </tr>

          <!-- Sign-off & Contact -->
          <tr>
            <td style="padding: 0 40px 32px;">
              <hr style="border: none; border-top: 1px solid ${BRAND_COLORS.borderDefault}; margin: 8px 0 24px;">

              ${
                includeContactInfo
                  ? `
              <p style="margin: 0 0 16px; color: ${BRAND_COLORS.textMuted}; font-size: 14px; line-height: 1.6;">
                If you have any questions or need further assistance, please do not hesitate to contact us:
              </p>
              ${getContactInfoHtml()}
              <br>
              `
                  : ""
              }

              <p style="margin: 0; color: ${BRAND_COLORS.textMuted}; font-size: 15px; line-height: 1.6;">
                Kind regards,<br>
                <strong style="color: ${BRAND_COLORS.textDark};">${signOffText}</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            ${getFooterHtml("customer")}
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();
}

// ---------------------------------------------------------------------------
// Plain text version (for accessibility / fallback)
// ---------------------------------------------------------------------------

export function generateContinuationEmailPlainText(
  props: ContinuationEmailProps,
): string {
  const {
    requestId,
    clientName,
    subject,
    sections,
    greeting,
    signOff,
    includeContactInfo = true,
  } = props;

  const firstName = clientName.split(" ")[0];
  const greetingText = greeting || `Dear ${firstName},`;
  const signOffText = signOff || `The ${COMPANY.name} Team`;

  const sectionText = sections
    .map((s) => `--- ${s.label.toUpperCase()} ---\n\n${s.content}`)
    .join("\n\n");

  return [
    `RE: ${subject} (${requestId})`,
    "",
    greetingText,
    "",
    `Thank you for your continued communication regarding your request (ref: ${requestId}).`,
    "",
    sectionText,
    "",
    "---",
    "",
    includeContactInfo
      ? `Contact us:\nPhone: ${COMPANY.phone.primary}\nEmail: ${COMPANY.email.support}\nWebsite: ${COMPANY.website}\n`
      : "",
    `Kind regards,`,
    signOffText,
    "",
    `${COMPANY.legalName} | ${COMPANY.address.full}`,
  ]
    .filter(Boolean)
    .join("\n");
}
