import { ExceptionFactory } from '../../../exceptions/exception.factory';
import type {
  ImageEditRequest,
  ImageGenRequest,
  MediaArtifact,
  MediaProvider,
} from './media-provider.interface';

async function postJson(url: string, body: unknown): Promise<unknown> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) {
    throw ExceptionFactory.mediaGenerationFailed(
      `image worker HTTP ${res.status}: ${text.slice(0, 200)}`,
    );
  }
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { b64_json: Buffer.from(text).toString('base64') };
  }
}

function artifactsFromBody(body: unknown): MediaArtifact[] {
  const rec = body && typeof body === 'object' ? (body as Record<string, unknown>) : {};
  const data = Array.isArray(rec.data) ? rec.data : [rec];
  const out: MediaArtifact[] = [];
  for (const item of data) {
    if (!item || typeof item !== 'object') continue;
    const row = item as { b64_json?: string; image?: string };
    const b64 = row.b64_json || row.image;
    if (!b64) continue;
    out.push({
      bytes: Buffer.from(b64, 'base64'),
      mime: 'image/png',
      originalName: 'image.png',
      source: { provider: 'http-worker', rawMeta: {} },
    });
  }
  return out;
}

export class HttpWorkerMediaProvider implements MediaProvider {
  readonly id = 'http-worker';

  constructor(private readonly baseUrl: string) {}

  async generateImage(req: ImageGenRequest): Promise<MediaArtifact[]> {
    const body = await postJson(this.baseUrl.replace(/\/$/, '') + '/v1/images/generations', {
      prompt: req.prompt,
      n: req.n ?? 1,
      size: req.size,
    });
    const arts = artifactsFromBody(body);
    if (!arts.length) {
      throw ExceptionFactory.mediaGenerationFailed('image worker returned no image');
    }
    return arts;
  }

  async editImage(req: ImageEditRequest): Promise<MediaArtifact[]> {
    const body = await postJson(this.baseUrl.replace(/\/$/, '') + '/v1/images/edits', {
      prompt: req.prompt,
      image: req.imageBytes.toString('base64'),
    });
    const arts = artifactsFromBody(body);
    if (!arts.length) {
      throw ExceptionFactory.mediaGenerationFailed('image worker returned no image');
    }
    return arts;
  }
}
