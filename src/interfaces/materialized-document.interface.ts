/** Decrypted document written into the workspace for tools. */
export interface MaterializedDocument {
  id: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  /** Absolute path written under the request workspace (sandbox / cwd). */
  path: string;
}
