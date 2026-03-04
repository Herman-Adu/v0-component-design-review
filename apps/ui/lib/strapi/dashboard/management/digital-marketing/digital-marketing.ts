/**
 * Digital Marketing — Public Facade
 *
 * Thin re-export of the repository and view model types.
 * Consumers import from this file only.
 */
export { getDigitalMarketing } from "./digital-marketing-repository";
export type {
  DigitalMarketingVM,
  DigitalMarketingPlatformVM,
  DigitalMarketingStatVM,
  DigitalMarketingQuickLinkVM,
  DigitalMarketingPageItemVM,
  DigitalMarketingNoticeVM,
} from "./digital-marketing-view-models";
