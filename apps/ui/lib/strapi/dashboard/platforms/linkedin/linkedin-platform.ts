/**
 * LinkedIn Platform — Public Facade
 *
 * Thin re-export of the repository and view model types.
 * Consumers import from this file only.
 */
export { getLinkedInPlatform } from "./linkedin-platform-repository";
export type {
  LinkedInPlatformVM,
  LinkedInEcosystemPhaseVM,
  LinkedInToolVM,
} from "./linkedin-platform-view-models";
