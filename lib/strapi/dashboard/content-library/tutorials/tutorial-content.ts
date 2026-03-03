/**
 * Tutorial Content API
 *
 * Public facade for tutorial content access.
 * Functions and aggregate type from builder; schema types from schema (SSOT).
 */

// Functions and aggregate list-item type (computed with id)
export {
  getTutorialList,
  getTutorialContentDocument,
  getAllTutorialContentSlugs,
  type Tutorial,
} from "./tutorial-content-builder";

// Schema types — imported directly from schema (not via builder)
export type {
  TutorialLevel,
  TutorialCategory,
  TutorialContentBlock,
  TutorialContentMeta,
  TutorialContentDocument,
} from "./tutorial-schema";
