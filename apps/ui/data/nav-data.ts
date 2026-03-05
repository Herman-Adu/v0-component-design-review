// Barrel re-export — implementation split across data/nav-data/ per-section files.
// Add new sections in the appropriate sub-file, not here.

export type { NavItem, NavSection } from "./nav-data/types";

export { buildLearningHubSection } from "./nav-data/learning-hub";

export { digitalMarketingSection } from "./nav-data/admin/digital-marketing";
export {
  documentAdministrationSection,
  docHealthSection,
  docQASection,
} from "./nav-data/admin/document-health";
export {
  emailAdministrationSection,
  emailManagementSection,
} from "./nav-data/admin/email-management";
export { adminSection } from "./nav-data/admin/index";

export { strategicOverviewSection } from "./nav-data/documentation/strategic-overview";
export { cmsReferenceSection } from "./nav-data/documentation/cms-reference";
export { appReferenceSection } from "./nav-data/documentation/app-reference";
export { infrastructureOpsSection } from "./nav-data/documentation/infrastructure-ops";
