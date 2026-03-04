import { Body, Container, Head, Heading, Html, Preview, Section, Text, Hr } from "@react-email/components"

interface BusinessNotificationEmailProps {
  requestId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  serviceType: string
  urgency: "routine" | "urgent" | "emergency"
  description: string
  preferredDate: string
  preferredTimeSlot: string
  alternativeDate?: string
  address: string
  city: string
  county?: string
  postcode: string
  propertyType: string
  accessInstructions?: string
  flexibleScheduling: boolean
  submittedAt: string
}

export const BusinessNotificationEmail = ({
  requestId = "SR-12345",
  customerName = "John Doe",
  customerEmail = "john@example.com",
  customerPhone = "07123456789",
  serviceType = "Electrical Installation",
  urgency = "routine",
  description = "Need electrical work done",
  preferredDate = "2024-01-15",
  preferredTimeSlot = "morning",
  alternativeDate,
  address = "123 Main St",
  city = "London",
  county = "Greater London",
  postcode = "SW1A 1AA",
  propertyType = "residential",
  accessInstructions,
  flexibleScheduling = false,
  submittedAt = new Date().toISOString(),
}: BusinessNotificationEmailProps) => {
  const isEmergency = urgency === "emergency"

  return (
    <Html>
      <Head />
      <Preview>
        New {isEmergency ? "EMERGENCY" : ""} Service Request - {requestId}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={isEmergency ? headerEmergency : header}>
            <Heading style={headerTitle}>
              {isEmergency ? "🚨 EMERGENCY SERVICE REQUEST" : "New Service Request"}
            </Heading>
            <Text style={headerSubtitle}>Request ID: {requestId}</Text>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            {isEmergency && (
              <Section style={emergencyAlert}>
                <Heading style={emergencyHeading}>⚠️ IMMEDIATE ATTENTION REQUIRED</Heading>
                <Text style={emergencyText}>
                  This is an emergency service request. Customer expects contact within 30 minutes.
                </Text>
                <Text style={emergencyTime}>Submitted: {new Date(submittedAt).toLocaleString()}</Text>
              </Section>
            )}

            {/* Customer Information */}
            <Section style={sectionBox}>
              <Heading style={sectionHeading}>👤 Customer Information</Heading>
              <table style={infoTable}>
                <tr>
                  <td style={infoLabel}>Name:</td>
                  <td style={infoValue}>{customerName}</td>
                </tr>
                <tr>
                  <td style={infoLabel}>Email:</td>
                  <td style={infoValue}>
                    <a href={`mailto:${customerEmail}`} style={link}>
                      {customerEmail}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style={infoLabel}>Phone:</td>
                  <td style={infoValue}>
                    <a href={`tel:${customerPhone}`} style={link}>
                      {customerPhone}
                    </a>
                  </td>
                </tr>
              </table>
            </Section>

            {/* Service Details */}
            <Section style={sectionBox}>
              <Heading style={sectionHeading}>🔧 Service Details</Heading>
              <table style={infoTable}>
                <tr>
                  <td style={infoLabel}>Service Type:</td>
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
                  <td style={infoLabel} valign="top">
                    Description:
                  </td>
                  <td style={infoValue}>{description}</td>
                </tr>
              </table>
            </Section>

            {/* Property Information */}
            <Section style={sectionBox}>
              <Heading style={sectionHeading}>🏠 Property Information</Heading>
              <table style={infoTable}>
                <tr>
                  <td style={infoLabel}>Address:</td>
                  <td style={infoValue}>{address}</td>
                </tr>
                <tr>
                  <td style={infoLabel}>City:</td>
                  <td style={infoValue}>{city}</td>
                </tr>
                {county && (
                  <tr>
                    <td style={infoLabel}>County:</td>
                    <td style={infoValue}>{county}</td>
                  </tr>
                )}
                <tr>
                  <td style={infoLabel}>Postcode:</td>
                  <td style={infoValue}>{postcode}</td>
                </tr>
                <tr>
                  <td style={infoLabel}>Property Type:</td>
                  <td style={infoValue}>{propertyType}</td>
                </tr>
                {accessInstructions && (
                  <tr>
                    <td style={infoLabel} valign="top">
                      Access Instructions:
                    </td>
                    <td style={infoValue}>{accessInstructions}</td>
                  </tr>
                )}
              </table>
            </Section>

            {/* Schedule Preferences */}
            <Section style={sectionBox}>
              <Heading style={sectionHeading}>📅 Schedule Preferences</Heading>
              <table style={infoTable}>
                <tr>
                  <td style={infoLabel}>Preferred Date:</td>
                  <td style={infoValue}>{new Date(preferredDate).toLocaleDateString()}</td>
                </tr>
                <tr>
                  <td style={infoLabel}>Preferred Time:</td>
                  <td style={infoValue}>{preferredTimeSlot}</td>
                </tr>
                {alternativeDate && (
                  <tr>
                    <td style={infoLabel}>Alternative Date:</td>
                    <td style={infoValue}>{new Date(alternativeDate).toLocaleDateString()}</td>
                  </tr>
                )}
                <tr>
                  <td style={infoLabel}>Flexible Scheduling:</td>
                  <td style={infoValue}>{flexibleScheduling ? "Yes" : "No"}</td>
                </tr>
              </table>
            </Section>

            <Hr style={divider} />

            {/* Action Items */}
            <Section style={actionBox}>
              <Heading style={actionHeading}>📋 Next Steps</Heading>
              <ol style={actionList}>
                <li style={actionItem}>
                  {isEmergency ? "Call customer immediately (within 30 minutes)" : "Contact customer within 2-4 hours"}
                </li>
                <li style={actionItem}>Confirm appointment date and time</li>
                <li style={actionItem}>Assign electrician to the job</li>
                <li style={actionItem}>Send appointment confirmation to customer</li>
                <li style={actionItem}>Update CRM system with request details</li>
              </ol>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>Electrical Services Business System</Text>
            <Text style={footerText}>Submitted: {new Date(submittedAt).toLocaleString()}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default BusinessNotificationEmail

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
  maxWidth: "680px",
}

const header = {
  padding: "32px 40px",
  backgroundColor: "#1a1a1a",
  textAlign: "center" as const,
}

const headerEmergency = {
  padding: "32px 40px",
  backgroundColor: "#dc2626",
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

const emergencyAlert = {
  backgroundColor: "#fee2e2",
  border: "3px solid #dc2626",
  borderRadius: "8px",
  padding: "24px",
  margin: "0 0 32px",
  textAlign: "center" as const,
}

const emergencyHeading = {
  color: "#dc2626",
  fontSize: "24px",
  fontWeight: "bold" as const,
  margin: "0 0 12px",
}

const emergencyText = {
  color: "#991b1b",
  fontSize: "16px",
  fontWeight: "600" as const,
  margin: "0 0 8px",
}

const emergencyTime = {
  color: "#7f1d1d",
  fontSize: "14px",
  margin: "0",
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

const link = {
  color: "#2563eb",
  textDecoration: "underline",
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

const divider = {
  borderColor: "#e5e7eb",
  margin: "32px 0",
}

const actionBox = {
  backgroundColor: "#eff6ff",
  border: "2px solid #3b82f6",
  borderRadius: "8px",
  padding: "24px",
}

const actionHeading = {
  color: "#1e40af",
  fontSize: "18px",
  fontWeight: "bold" as const,
  margin: "0 0 16px",
}

const actionList = {
  margin: "0",
  paddingLeft: "24px",
}

const actionItem = {
  color: "#1e3a8a",
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "8px 0",
  fontWeight: "500" as const,
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
