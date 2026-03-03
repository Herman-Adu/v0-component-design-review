/**
 * Case Study Content API
 *
 * Public facade for case study content access.
 * Functions and aggregate type from builder; schema types from schema (SSOT).
 */

// Functions and aggregate list-item type (computed with id)
export {
  getCaseStudyList,
  getCaseStudyContentDocument,
  getAllCaseStudyContentSlugs,
  type CaseStudy,
} from "./case-study-content-builder";

// Schema types — imported directly from schema (not via builder)
export type {
  CaseStudyLevel,
  CaseStudyCategory,
  CaseStudyContentBlock,
  CaseStudyContentMeta,
  CaseStudyContentDocument,
} from "./case-study-schema";
