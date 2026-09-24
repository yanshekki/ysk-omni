import { describe, expect, it } from 'vitest';
import { engineSlotService } from '../../src/services/engine-slot.service';
import { stubMediaProvider } from '../../src/services/media/providers/stub.provider';
import { HttpException } from '../../src/exceptions/http.exception';

describe('engine_unconfigured when no text runtime is attached', () => {
  it('chat runOnce throws 501 engine_unconfigured', async () => {
    await expect(
      engineSlotService.runOnce({
        prompt: 'hi',
        model: 'echo',
        cwd: process.cwd(),
        stream: false,
      }),
    ).rejects.toMatchObject({
      statusCode: 501,
      code: 'engine_unconfigured',
    });
  });

  it('image generate throws 503 when no media worker is configured', async () => {
    try {
      await stubMediaProvider.generateImage({
        prompt: 'cat',
        apiKeyId: 'k',
      } as never);
      expect.fail('expected media_provider_unavailable');
    } catch (err) {
      expect(err).toBeInstanceOf(HttpException);
      expect((err as HttpException).statusCode).toBe(503);
      expect((err as HttpException).code).toBe('media_provider_unavailable');
    }
  });
});
