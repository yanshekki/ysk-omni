import type {
  ImageEditRequest,
  ImageGenRequest,
  MediaArtifact,
  MediaProvider,
} from './media-provider.interface';

/**
 * Deterministic 1×1 PNG for tests (no Grok CLI).
 * Enable with MEDIA_PROVIDER=mock or setMediaProviderForTests.
 */
const PNG_1X1 = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
);

export class MockMediaProvider implements MediaProvider {
  readonly id = 'mock';

  async generateImage(req: ImageGenRequest): Promise<MediaArtifact[]> {
    const n = Math.min(Math.max(req.n ?? 1, 1), 4);
    return Array.from({ length: n }, (_, i) => ({
      bytes: PNG_1X1,
      mime: 'image/png',
      originalName: `mock-${i + 1}.png`,
      width: 1,
      height: 1,
      source: {
        provider: 'mock',
        rawMeta: { prompt: req.prompt, size: req.size },
      },
    }));
  }

  async editImage(req: ImageEditRequest): Promise<MediaArtifact[]> {
    const arts = await this.generateImage(req);
    return arts.map((a, i) => ({
      ...a,
      originalName: `mock-edit-${i + 1}.png`,
      source: {
        provider: 'mock',
        rawMeta: {
          prompt: req.prompt,
          edit: true,
          inputBytes: req.imageBytes.length,
        },
      },
    }));
  }
}

export const mockMediaProvider = new MockMediaProvider();
