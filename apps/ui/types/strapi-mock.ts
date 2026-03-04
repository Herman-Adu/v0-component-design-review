/**
 * Strapi Mock Types - Main Entry Point
 * Exports all type definitions in one place
 */

export * from './strapi-mock-blocks';
export * from './strapi-mock-complete';

// Re-export commonly used types for convenience
export type { ContentDocument, DocumentMeta, DocumentSEO } from './strapi-mock-complete';
export type { Block } from './strapi-mock-blocks';
