import { describe, expect, it, vi, beforeEach } from 'vitest';
import { DocumentService } from '../../src/services/document.service';

describe('DocumentService context building', () => {
  const service = new DocumentService();

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns empty context for no ids', async () => {
    const result = await service.buildContextFromDocuments('key', [], 1000);
    expect(result).toEqual({ context: '', files: [] });
  });

  it('inlines text document content', async () => {
    const id = '550e8400-e29b-41d4-a716-446655440000';
    vi.spyOn(service, 'getOwned').mockResolvedValue({
      id,
      originalName: 'note.txt',
      mimeType: 'text/plain',
      sizeBytes: 12,
      checksumSha256: 'abc',
      apiKeyId: 'key',
      storageType: 'db',
      storagePath: null,
      contentCiphertext: null,
      contentIv: null,
      contentTag: null,
      createdAt: new Date(),
      deletedAt: null,
    } as never);
    vi.spyOn(service, 'readDecryptedContent').mockResolvedValue(
      Buffer.from('hello marker\n', 'utf8'),
    );

    const result = await service.buildContextFromDocuments('key', [id], 10_000);
    expect(result.context).toContain('hello marker');
    expect(result.context).toContain('note.txt');
    expect(result.files).toEqual([]);
  });

  it('describes images without binary dump', async () => {
    const id = '550e8400-e29b-41d4-a716-446655440001';
    vi.spyOn(service, 'getOwned').mockResolvedValue({
      id,
      originalName: 'pic.png',
      mimeType: 'image/png',
      sizeBytes: 99,
      checksumSha256: 'deadbeef',
      apiKeyId: 'key',
      storageType: 'db',
      storagePath: null,
      contentCiphertext: null,
      contentIv: null,
      contentTag: null,
      createdAt: new Date(),
      deletedAt: null,
    } as never);

    const result = await service.buildContextFromDocuments('key', [id], 10_000);
    expect(result.context).toContain('[image attachment');
    expect(result.context).toContain('pic.png');
    expect(result.context).not.toContain('\u0000');
  });
});
