import type { DocumentStorageType } from './document-storage-type.type';

export type { DocumentStorageType } from './document-storage-type.type';
export type { DocumentPublicEntity } from './document-public.entity';

export interface DocumentEntity {
  id: string;
  apiKeyId: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  storageType: DocumentStorageType;
  storagePath: string | null;
  checksumSha256: string;
  createdAt: Date;
  deletedAt: Date | null;
}
