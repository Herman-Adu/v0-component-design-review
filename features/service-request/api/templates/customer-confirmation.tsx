import { Body, Container, Head, Heading, Html, Preview, Section, Text, Hr } from "@react-email/components"

interface CustomerConfirmationEmailProps {
  customerName: string
  requestId: string
  serviceType: string
  urgency: "routine" | "urgent" | "emergency"
  preferredDate: string
  preferredTimeSlot: string
  submittedAt: string
}

export const CustomerConfirmationEmail = ({
  customerName = "John Doe",
  requestId = "SR-12345",
  serviceType = "Electrical Installation",
  urgency = "routine",
  preferredDate = "2024-01-15",
  preferredTimeSlot = "morning",
  submittedAt = new Date().toISOString(),
}: CustomerConfirmationEmailProps) => {
  const isEmergency = urgency === "emergency"

  return (
    <Html>
      <Head />
      <Preview>
        Service Request Confirmed - {requestId}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={headerTitle}>Request Confirmed</Heading>
            <Text style={headerSubtitle}>Reference: {requestId}</Text>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading style={greeting}>Hello {customerName},</Heading>
            <Text style={paragraph}>
              Thank you for your service request. We have received your inquiry and a member of our team
              will be in touch shortly.
            </Text>

            {/* Request Summary */}
            <Section style={sectionBox}>
              <Heading style={sectionHeading}>Request Summary</Heading>
              <table style={infoTable}>
                <tr>
                  <td style={infoLabel}>Reference:</td>
                  <td style={infoValue}>{requestId}</td>
                </tr>
                <tr>
                  <td style={infoLabel}>Service:</td>
                  <td style={infoValue}>{serviceType}</td>
                </tr>
                <tr>
                  <td style={infoLabel}>Priority:</td>
                  <td style={infoValue}>
                    <span style={isEmergency ? priorityBadgeEmergency : priorityBadgeNormal}>
                      {urgency.toUpperCase()}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style={infoLabel}>Preferred Date:</td>
                  <td style={infoValue}>{new Date(preferredDate).toLocaleDateString()}</td>
                </tr>
                <tr>
                  <td style={infoLabel}>Time Slot:</td>
                  <td style={infoValue}>{preferredTimeSlot}</td>
                </tr>
              </table>
            </Section>

            {/* What Happens Next */}
            <Section style={nextStepsBox}>
              <Heading style={nextStepsHeading}>What Happens Next?</Heading>
              <ol style={stepsList}>
                <li style={stepItem}>
                  {isEmergency
                    ? "Our emergency team will contact you within 30 minutes."
                    : "A team member will review your request within 2-4 hours."}
                </li>
                <li style={stepItem}>We will confirm your appointment date and time.</li>
                <li style={stepItem}>You will receive a final confirmation with engineer details.</li>
              </ol>
            </Section>

            <Hr style={divider} />

            <Text style={paragraph}>
              If you need to make changes to your request or have urgent concerns, please do not hesitate
              to contact us.
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>Electrical Services</Text>
            <Text style={footerText}>Submitted: {new Date(submittedAt).toLocaleString()}</Text>
            <Text style={footerDisclaimer}>
              This is an automated confirmation. Please do not reply to this email.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default CustomerConfirmationEmail

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0",
  marginBottom: "64px",
  maxWidth: "600px",
}

const header = {
  padding: "32px 40px",
  backgroundColor: "#1a1a1a",
  textAlign: "center" as const,
}

const headerTitle = {
  color: "#ffffff",
  fontSize: "28px",
  fontWeight: "bold" as const,
  margin: "0 0 8px",
}

const headerSubtitle = {
  color: "#fbbf24",
  fontSize: "16px",
  margin: "0",
}

const content = {
  padding: "40px",
}

const greeting = {
  color: "#1a1a1a",
  fontSize: "22px",
  fontWeight: "bold" as const,
  margin: "0 0 16px",
}

const paragraph = {
  color: "#4b5563",
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "0 0 24px",
}

const sectionBox = {
  backgroundColor: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  padding: "24px",
  margin: "0 0 24px",
}

const sectionHeading = {
  color: "#1a1a1a",
  fontSize: "18px",
  fontWeight: "bold" as const,
  margin: "0 0 16px",
}

const infoTable = {
  width: "100%",
  borderCollapse: "collapse" as const,
}

const infoLabel = {
  color: "#6b7280",
  fontSize: "14px",
  padding: "8px 0",
  fontWeight: "600" as const,
  width: "35%",
}

const infoValue = {
  color: "#1a1a1a",
  fontSize: "14px",
  padding: "8px 0",
}

const priorityBadgeNormal = {
  backgroundColor: "#dbeafe",
  color: "#1e40af",
  padding: "4px 12px",
  borderRadius: "12px",
  fontSize: "12px",
  fontWeight: "600" as const,
  display: "inline-block",
}

const priorityBadgeEmergency = {
  backgroundColor: "#fee2e2",
  color: "#dc2626",
  padding: "4px 12px",
  borderRadius: "12px",
  fontSize: "12px",
  fontWeight: "600" as const,
  display: "inline-block",
}

const nextStepsBox = {
  backgroundColor: "#eff6ff",
  border: "2px solid #3b82f6",
  borderRadius: "8px",
  padding: "24px",
  margin: "0 0 24px",
}

const nextStepsHeading = {
  color: "#1e40af",
  fontSize: "18px",
  fontWeight: "bold" as const,
  margin: "0 0 16px",
}

const stepsList = {
  margin: "0",
  paddingLeft: "24px",
}

const stepItem = {
  color: "#1e3a8a",
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "8px 0",
  fontWeight: "500" as const,
}

const divider = {
  borderColor: "#e5e7eb",
  margin: "32px 0",
}

const footer = {
  padding: "32px 40px",
  backgroundColor: "#f9fafb",
  borderTop: "1px solid #e5e7eb",
  textAlign: "center" as const,
}

const footerText = {
  color: "#6b7280",
  fontSize: "12px",
  margin: "4px 0",
}

const footerDisclaimer = {
  color: "#9ca3af",
  fontSize: "11px",
  margin: "12px 0 0",
  fontStyle: "italic" as const,
}
