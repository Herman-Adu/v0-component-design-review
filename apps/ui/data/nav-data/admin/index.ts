import {
  Briefcase,
  FlaskConical,
  HardDrive,
  HeartPulse,
  Mail,
  Megaphone,
  Palette,
  Rocket,
  Search,
  Share2,
  ShieldCheck,
  Globe,
  TrendingUp,
} from "lucide-react";

import type { NavSection } from "../types";
import { dmGoogleItems, dmLinkedInItems, dmTwitterItems, dmFacebookItems } from "./digital-marketing";
import { docAdminHealth, docAdminQualityEngineering } from "./document-health";
import { emailAdminRequestManagement, emailAdminConfiguration, emailAdminInfrastructure } from "./email-management";

const DM = "/dashboard/admin/digital-marketing";
const DA = "/dashboard/admin/document-health";
const EA = "/dashboard/admin/email-management";

export const adminSection: NavSection = {
  title: "Admin",
  icon: ShieldCheck,
  items: [
    { href: "/dashboard/admin", label: "Overview", icon: ShieldCheck },
    {
      href: DM,
      label: "Digital Marketing",
      icon: Megaphone,
      children: [
        { href: DM, label: "Overview", icon: Megaphone },
        { href: `${DM}/getting-started`, label: "Getting Started", icon: Rocket },
        { href: `${DM}/content-strategy`, label: "Content Strategy", icon: TrendingUp },
        { href: `${DM}/google`, label: "Google", icon: Search, children: dmGoogleItems },
        { href: `${DM}/linkedin`, label: "LinkedIn", icon: Share2, children: dmLinkedInItems },
        { href: `${DM}/twitter`, label: "Twitter/X", icon: Globe, children: dmTwitterItems },
        { href: `${DM}/facebook`, label: "Facebook", icon: Globe, children: dmFacebookItems },
      ],
    },
    {
      href: DA,
      label: "Document Health",
      icon: HeartPulse,
      children: [
        { href: DA, label: "Overview", icon: HeartPulse },
        { href: `${DA}/getting-started`, label: "Getting Started", icon: Rocket },
        {
          href: `${DA}/documentation-health`,
          label: "Documentation Health",
          icon: HeartPulse,
          children: docAdminHealth,
        },
        {
          href: `${DA}/quality-engineering`,
          label: "Quality Engineering",
          icon: FlaskConical,
          children: docAdminQualityEngineering,
        },
      ],
    },
    {
      href: EA,
      label: "Email Management",
      icon: Mail,
      children: [
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
    },
  ],
};
