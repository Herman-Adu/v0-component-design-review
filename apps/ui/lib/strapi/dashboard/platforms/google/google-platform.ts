/**
 * Google Platform — Public Facade
 *
 * Thin re-export of the repository and view model types.
 * Consumers import from this file only.
 */
export { getGooglePlatform } from "./google-platform-repository";
export type {
  GooglePlatformVM,
  GoogleEcosystemPhaseVM,
  GoogleToolVM,
} from "./google-platform-view-models";
