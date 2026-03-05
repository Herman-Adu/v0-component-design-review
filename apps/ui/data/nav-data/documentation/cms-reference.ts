import {
  BookOpen,
  Database,
  FileCode,
  FileText,
  Home,
  Layers,
  Link2,
  Rocket,
} from "lucide-react";

import type { NavSection } from "../types";

export const cmsReferenceSection: NavSection = {
  title: "CMS Reference",
  icon: Database,
  items: [
    { href: "/dashboard/documentation/cms-reference/overview", label: "Overview", icon: Home },
    { href: "/dashboard/documentation/cms-reference/getting-started", label: "Getting Started", icon: Rocket },
    { href: "/dashboard/documentation/cms-reference/form-collections", label: "Form Collections", icon: FileText },
    { href: "/dashboard/documentation/cms-reference/content-collections", label: "Content Collections", icon: BookOpen },
    { href: "/dashboard/documentation/cms-reference/single-types", label: "Single Types", icon: FileCode },
    { href: "/dashboard/documentation/cms-reference/shared-components", label: "Shared Components", icon: Layers },
    { href: "/dashboard/documentation/cms-reference/relationships", label: "Relationships", icon: Link2 },
  ],
};
