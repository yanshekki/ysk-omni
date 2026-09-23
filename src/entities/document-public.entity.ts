export interface DocumentPublicEntity {
  id: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  checksumSha256: string;
  createdAt: Date;
}
