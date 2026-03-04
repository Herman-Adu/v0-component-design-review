/**
 * Document Health — Public Facade
 *
 * Thin re-export of the repository and view model types.
 * Consumers import from this file only.
 */
export { getDocumentHealth } from "./document-health-repository";
export type {
  DocumentHealthVM,
  DocumentHealthPageSectionVM,
  DocumentHealthHighlightVM,
  DocumentHealthQuickLinkVM,
} from "./document-health-view-models";
