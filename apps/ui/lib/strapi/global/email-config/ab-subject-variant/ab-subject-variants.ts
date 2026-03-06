/**
 * A/B Subject Variants — Public Facade
 *
 * Thin re-export. Consumers import from this file only.
 */
export {
  listABSubjectVariants,
  listTemplateSubjects,
  getTemplateSubjects,
} from "./ab-subject-variant-repository";
export type {
  ABSubjectVariantVM,
  TemplateSubjectsVM,
} from "./ab-subject-variant-view-models";
