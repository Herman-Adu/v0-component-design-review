/**
 * Facebook Platform — Public Facade
 *
 * Thin re-export of the repository and view model types.
 * Consumers import from this file only.
 */
export { getFacebookPlatform } from "./facebook-platform-repository";
export type {
  FacebookPlatformVM,
  FacebookEcosystemPhaseVM,
  FacebookToolVM,
} from "./facebook-platform-view-models";
