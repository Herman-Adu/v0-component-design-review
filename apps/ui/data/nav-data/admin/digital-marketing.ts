import {
  Building2,
  DollarSign,
  FileText,
  Globe,
  LineChart,
  Megaphone,
  PenSquare,
  Rocket,
  Search,
  Share2,
  Tag,
  TrendingUp,
  UsersRound,
} from "lucide-react";

import type { NavItem, NavSection } from "../types";

const DM = "/dashboard/admin/digital-marketing";

export const dmGoogleItems: NavItem[] = [
  { href: `${DM}/google`, label: "Overview", icon: Search },
  { href: `${DM}/google/business-profile`, label: "Business Profile & FAQs", icon: Building2 },
  { href: `${DM}/google/seo`, label: "SEO & Site Optimization", icon: Search },
  { href: `${DM}/google/tag-manager`, label: "Tag Manager", icon: Tag },
  { href: `${DM}/google/ads-campaigns`, label: "Ads & Campaigns", icon: DollarSign },
  { href: `${DM}/google/analytics`, label: "Analytics & Reporting", icon: LineChart },
  { href: `${DM}/google/composer`, label: "Content Composer", icon: PenSquare },
];

export const dmLinkedInItems: NavItem[] = [
  { href: `${DM}/linkedin`, label: "Overview", icon: Share2 },
  { href: `${DM}/linkedin/company-page`, label: "Company Page", icon: Building2 },
  { href: `${DM}/linkedin/composer`, label: "Post Composer", icon: PenSquare },
  { href: `${DM}/linkedin/articles`, label: "Article Publisher", icon: FileText },
  { href: `${DM}/linkedin/connection-strategy`, label: "Connection Strategy", icon: UsersRound },
  { href: `${DM}/linkedin/analytics`, label: "Analytics", icon: LineChart },
];

export const dmTwitterItems: NavItem[] = [
  { href: `${DM}/twitter`, label: "Overview", icon: Globe },
  { href: `${DM}/twitter/composer`, label: "Tweet Composer", icon: PenSquare },
  { href: `${DM}/twitter/threads`, label: "Thread Builder", icon: FileText },
  { href: `${DM}/twitter/hashtag-strategy`, label: "Hashtag Strategy", icon: Tag },
  { href: `${DM}/twitter/engagement`, label: "Engagement Playbook", icon: UsersRound },
  { href: `${DM}/twitter/analytics`, label: "Analytics", icon: LineChart },
];

export const dmFacebookItems: NavItem[] = [
  { href: `${DM}/facebook`, label: "Overview", icon: Globe },
  { href: `${DM}/facebook/page-management`, label: "Page Management", icon: Building2 },
  { href: `${DM}/facebook/composer`, label: "Post Composer", icon: PenSquare },
  { href: `${DM}/facebook/events`, label: "Events & Promotions", icon: Megaphone },
  { href: `${DM}/facebook/messenger`, label: "Messenger Templates", icon: FileText },
  { href: `${DM}/facebook/analytics`, label: "Analytics", icon: LineChart },
];

export const digitalMarketingSection: NavSection = {
  title: "Digital Marketing",
  icon: Megaphone,
  items: [
    { href: DM, label: "Overview", icon: Megaphone },
    { href: `${DM}/getting-started`, label: "Getting Started", icon: Rocket },
    { href: `${DM}/content-strategy`, label: "Content Strategy", icon: TrendingUp },
    { href: `${DM}/google`, label: "Google", icon: Search, children: dmGoogleItems },
    { href: `${DM}/linkedin`, label: "LinkedIn", icon: Share2, children: dmLinkedInItems },
    { href: `${DM}/twitter`, label: "Twitter/X", icon: Globe, children: dmTwitterItems },
    { href: `${DM}/facebook`, label: "Facebook", icon: Globe, children: dmFacebookItems },
  ],
};
