import type { MaterializedDocument } from './materialized-document.interface';

/** Prompt context + optional on-disk materializations for attachments. */
export interface DocumentContextResult {
  context: string;
  files: MaterializedDocument[];
}
