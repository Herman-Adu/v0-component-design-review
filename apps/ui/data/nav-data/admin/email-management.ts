import {
  Activity,
  Briefcase,
  ClipboardCheck,
  Eye,
  HardDrive,
  History,
  Inbox,
  Mail,
  Palette,
  Rocket,
  Send,
  ShieldCheck,
  Split,
  Timer,
  UsersRound,
} from "lucide-react";

import type { NavItem, NavSection } from "../types";

const EA = "/dashboard/admin/email-management";

export const emailAdminRequestManagement: NavItem[] = [
  { href: `${EA}/request-management`, label: "Overview", icon: Inbox },
  { href: `${EA}/request-management/email-dashboard`, label: "Email Dashboard", icon: Briefcase },
  { href: `${EA}/request-management/testing-and-ops-guide`, label: "Testing & Ops Guide", icon: ClipboardCheck },
];

export const emailAdminConfiguration: NavItem[] = [
  { href: `${EA}/configuration`, label: "Overview", icon: Mail },
  { href: `${EA}/configuration/template-and-brand`, label: "Template & Brand", icon: Palette },
  { href: `${EA}/configuration/email-preview`, label: "Email Preview", icon: Eye },
  { href: `${EA}/configuration/ab-subject-lines`, label: "A/B Subject Lines", icon: Split },
  { href: `${EA}/configuration/recipient-groups`, label: "Recipient Groups", icon: UsersRound },
  { href: `${EA}/configuration/email-scheduling`, label: "Email Scheduling", icon: Timer },
];

export const emailAdminInfrastructure: NavItem[] = [
  { href: `${EA}/infrastructure`, label: "Overview", icon: HardDrive },
  { href: `${EA}/infrastructure/send-configuration`, label: "Send Configuration", icon: Send },
  { href: `${EA}/infrastructure/delivery-logs`, label: "Delivery Logs", icon: Activity },
  { href: `${EA}/infrastructure/version-history`, label: "Version History", icon: History },
  { href: `${EA}/infrastructure/security-audit`, label: "Security Audit", icon: ShieldCheck },
];

export const emailAdministrationSection: NavSection = {
  title: "Email Management",
  icon: Mail,
  items: [
    { href: EA, label: "Overview", icon: Mail },
    { href: `${EA}/getting-started`, label: "Getting Started", icon: Rocket },
    {
      href: `${EA}/request-management`,
      label: "Request Management",
      icon: Briefcase,
      children: emailAdminRequestManagement,
    },
    {
      href: `${EA}/configuration`,
      label: "Configuration",
      icon: Palette,
      children: emailAdminConfiguration,
    },
    {
      href: `${EA}/infrastructure`,
      label: "Infrastructure",
      icon: HardDrive,
      children: emailAdminInfrastructure,
    },
  ],
};

// Legacy alias
export const emailManagementSection = emailAdministrationSection;
