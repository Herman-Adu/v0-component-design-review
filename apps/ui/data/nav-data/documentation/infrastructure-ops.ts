import {
  AlertCircle,
  Code,
  Cog,
  Home,
  Rocket,
  Settings,
  TestTube,
} from "lucide-react";

import type { NavSection } from "../types";

export const infrastructureOpsSection: NavSection = {
  title: "Infrastructure & Ops",
  icon: Cog,
  items: [
    { href: "/dashboard/documentation/infrastructure-ops/overview", label: "Overview", icon: Home },
    { href: "/dashboard/documentation/infrastructure-ops/getting-started", label: "Getting Started", icon: Rocket },
    { href: "/dashboard/documentation/infrastructure-ops/api-and-graphql", label: "API & GraphQL", icon: Code },
    { href: "/dashboard/documentation/infrastructure-ops/cms-operations", label: "CMS Operations", icon: Settings },
    { href: "/dashboard/documentation/infrastructure-ops/deployment-pipelines", label: "Deployment Pipelines", icon: Rocket },
    { href: "/dashboard/documentation/infrastructure-ops/testing-strategy", label: "Testing Strategy", icon: TestTube },
    { href: "/dashboard/documentation/infrastructure-ops/troubleshooting", label: "Troubleshooting", icon: AlertCircle },
  ],
};
