import { describe, expect, it } from 'vitest';
import { inlineRemoteImageUrls } from '../../src/utils/vision-remote';

const PNG_1X1 = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
);

describe('inlineRemoteImageUrls', () => {
  it('inlines https image_url into a data URL', async () => {
    const fetchImpl = async () => ({
      ok: true,
      status: 200,
      headers: { get: (n: string) => (n === 'content-type' ? 'image/png' : null) },
      arrayBuffer: async () => PNG_1X1.buffer.slice(
        PNG_1X1.byteOffset,
        PNG_1X1.byteOffset + PNG_1X1.byteLength,
      ),
    });
    const out = await inlineRemoteImageUrls(
      [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'see' },
            {
              type: 'image_url',
              image_url: { url: 'https://example.com/a.png' },
            },
          ],
        },
      ],
      { fetchImpl },
    );
    const img = (out[0]!.content as Array<Record<string, unknown>>)[1] as {
      image_url?: { url?: string };
    };
    expect(img.image_url?.url?.startsWith('data:image/png;base64,')).toBe(true);
  });

  it('falls back to text when fetch fails', async () => {
    const fetchImpl = async () => {
      throw new Error('timeout');
    };
    const out = await inlineRemoteImageUrls(
      [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: 'https://example.com/gone.png' },
            },
          ],
        },
      ],
      { fetchImpl },
    );
    const part = (out[0]!.content as Array<Record<string, unknown>>)[0];
    expect(part).toEqual({
      type: 'text',
      text: '[image: https://example.com/gone.png]',
    });
  });

  it('rejects non-image payloads', async () => {
    const fetchImpl = async () => ({
      ok: true,
      status: 200,
      headers: { get: () => 'text/html' },
      arrayBuffer: async () => Buffer.from('<html></html>'),
    });
    const out = await inlineRemoteImageUrls(
      [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: 'https://example.com/page' },
            },
          ],
        },
      ],
      { fetchImpl },
    );
    const part = (out[0]!.content as Array<Record<string, unknown>>)[0];
    expect((part as { type?: string }).type).toBe('text');
  });

  it('does not fetch loopback, metadata, or file URLs', async () => {
    let fetched = 0;
    const fetchImpl = async () => {
      fetched += 1;
      return {
        ok: true,
        status: 200,
        headers: { get: () => 'image/png' },
        arrayBuffer: async () => PNG_1X1,
      };
    };
    const blocked = [
      'http://127.0.0.1/secret.png',
      'http://169.254.169.254/latest/meta-data',
      'http://[::1]/a.png',
      'file:///etc/passwd',
      'http://localhost/x.png',
    ];
    for (const url of blocked) {
      fetched = 0;
      const out = await inlineRemoteImageUrls(
        [{ role: 'user', content: [{ type: 'image_url', image_url: { url } }] }],
        { fetchImpl },
      );
      expect(fetched).toBe(0);
      const part = (out[0]!.content as Array<Record<string, unknown>>)[0];
      expect(part).toMatchObject({ type: 'image_url' });
    }
  });
});
