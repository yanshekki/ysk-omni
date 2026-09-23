import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';
import { env } from '../config/env';
import type { EncryptedPayload } from '../entities/encrypted-payload.entity';
import { ExceptionFactory } from '../exceptions/exception.factory';

const ALGO = 'aes-256-gcm';
const IV_LENGTH = 12;

export class EncryptionService {
  encrypt(plaintext: string | Buffer): EncryptedPayload {
    const data = typeof plaintext === 'string' ? Buffer.from(plaintext, 'utf8') : plaintext;
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv(ALGO, env.encryptionKey, iv);
    const ciphertext = Buffer.concat([cipher.update(data), cipher.final()]);
    const tag = cipher.getAuthTag();
    return { ciphertext, iv, tag };
  }

  decrypt(payload: EncryptedPayload): Buffer {
    try {
      const decipher = createDecipheriv(ALGO, env.encryptionKey, payload.iv);
      decipher.setAuthTag(payload.tag);
      return Buffer.concat([decipher.update(payload.ciphertext), decipher.final()]);
    } catch {
      throw ExceptionFactory.internal('Failed to decrypt data');
    }
  }

  decryptToString(payload: EncryptedPayload): string {
    return this.decrypt(payload).toString('utf8');
  }
}

export const encryptionService = new EncryptionService();
