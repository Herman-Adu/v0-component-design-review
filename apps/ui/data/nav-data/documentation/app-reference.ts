import {
  Code,
  FolderCog,
  Home,
  Layers,
  LayoutGrid,
  Mail,
  Rocket,
  Shield,
  Zap,
} from "lucide-react";

import type { NavSection } from "../types";

export const appReferenceSection: NavSection = {
  title: "App Reference",
  icon: FolderCog,
  items: [
    { href: "/dashboard/documentation/app-reference/overview", label: "Overview", icon: Home },
    { href: "/dashboard/documentation/app-reference/getting-started", label: "Getting Started", icon: Rocket },
    { href: "/dashboard/documentation/app-reference/component-system", label: "Component System", icon: LayoutGrid },
    { href: "/dashboard/documentation/app-reference/hydration-and-guards", label: "Hydration & Guards", icon: Shield },
    { href: "/dashboard/documentation/app-reference/server-vs-client", label: "Server vs Client", icon: Layers },
    { href: "/dashboard/documentation/app-reference/server-actions-and-api", label: "Server Actions & API", icon: Code },
    { href: "/dashboard/documentation/app-reference/email-system", label: "Email System", icon: Mail },
    { href: "/dashboard/documentation/app-reference/security-architecture", label: "Security Architecture", icon: Shield },
    { href: "/dashboard/documentation/app-reference/performance-and-caching", label: "Performance & Caching", icon: Zap },
  ],
};
