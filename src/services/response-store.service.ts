import { prisma } from '../config/database';
import { encryptionService } from './encryption.service';
import { toBytes } from '../utils/prisma-bytes';
import { ExceptionFactory } from '../exceptions/exception.factory';
import { toPersistentApiKeyId } from '../utils/api-key-id';

export class ResponseStoreService {
  async save(input: {
    id: string;
    apiKeyId: string;
    model?: string | null;
    body: unknown;
    previousId?: string | null;
  }): Promise<void> {
    const owner = await toPersistentApiKeyId(input.apiKeyId);
    const enc = encryptionService.encrypt(JSON.stringify(input.body));
    await prisma.storedResponse.upsert({
      where: { id: input.id },
      create: {
        id: input.id,
        apiKeyId: owner,
        model: input.model ?? null,
        status: 'completed',
        bodyCiphertext: toBytes(enc.ciphertext),
        bodyIv: toBytes(enc.iv),
        bodyTag: toBytes(enc.tag),
        previousId: input.previousId ?? null,
      },
      update: {
        model: input.model ?? null,
        bodyCiphertext: toBytes(enc.ciphertext),
        bodyIv: toBytes(enc.iv),
        bodyTag: toBytes(enc.tag),
        previousId: input.previousId ?? null,
        deletedAt: null,
      },
    });
  }

  async get(id: string, apiKeyId: string): Promise<unknown> {
    const owner = await toPersistentApiKeyId(apiKeyId);
    const row = await prisma.storedResponse.findFirst({
      where: { id, apiKeyId: owner, deletedAt: null },
    });
    if (!row) throw ExceptionFactory.notFound('Response');
    const json = encryptionService.decryptToString({
      ciphertext: Buffer.from(row.bodyCiphertext),
      iv: Buffer.from(row.bodyIv),
      tag: Buffer.from(row.bodyTag),
    });
    return JSON.parse(json) as unknown;
  }

  async softDelete(id: string, apiKeyId: string): Promise<void> {
    const owner = await toPersistentApiKeyId(apiKeyId);
    const r = await prisma.storedResponse.updateMany({
      where: { id, apiKeyId: owner, deletedAt: null },
      data: { deletedAt: new Date() },
    });
    if (r.count === 0) throw ExceptionFactory.notFound('Response');
  }

  async getPreviousOutputText(
    previousId: string,
    apiKeyId: string,
  ): Promise<string | null> {
    try {
      const body = (await this.get(previousId, apiKeyId)) as {
        output?: Array<{
          content?: Array<{ type?: string; text?: string }>;
        }>;
      };
      const texts: string[] = [];
      for (const item of body.output || []) {
        for (const c of item.content || []) {
          if (c.type === 'output_text' && c.text) texts.push(c.text);
        }
      }
      return texts.join('\n') || null;
    } catch {
      return null;
    }
  }
}

export const responseStoreService = new ResponseStoreService();
