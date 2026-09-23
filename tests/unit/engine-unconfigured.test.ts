import { describe, expect, it } from 'vitest';
import { grokCliService } from '../../src/services/grok-cli.service';
import { grokToolsMediaProvider } from '../../src/services/media/providers/grok-tools.provider';
import { HttpException } from '../../src/exceptions/http.exception';

describe('engine_unconfigured after Grok spawn removal', () => {
  it('chat runOnce throws 501 engine_unconfigured', async () => {
    await expect(
      grokCliService.runOnce({
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

  it('image generate throws 501 engine_unconfigured', async () => {
    try {
      await grokToolsMediaProvider.generateImage({
        prompt: 'cat',
        apiKeyId: 'k',
      } as never);
      expect.fail('expected engine_unconfigured');
    } catch (err) {
      expect(err).toBeInstanceOf(HttpException);
      expect((err as HttpException).statusCode).toBe(501);
      expect((err as HttpException).code).toBe('engine_unconfigured');
    }
  });
});
