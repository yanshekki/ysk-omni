import { describe, expect, it } from 'vitest';
import { EncryptionService } from '../../src/services/encryption.service';

describe('EncryptionService', () => {
  const service = new EncryptionService();

  it('round-trips UTF-8 strings', () => {
    const plain = 'user: hello 你好 🔐';
    const enc = service.encrypt(plain);
    expect(enc.ciphertext.equals(Buffer.from(plain))).toBe(false);
    expect(service.decryptToString(enc)).toBe(plain);
  });

  it('round-trips binary buffers', () => {
    const plain = Buffer.from([0, 1, 2, 255, 10]);
    const enc = service.encrypt(plain);
    expect(service.decrypt(enc).equals(plain)).toBe(true);
  });

  it('produces different ciphertext for same plaintext (random IV)', () => {
    const a = service.encrypt('same');
    const b = service.encrypt('same');
    expect(a.ciphertext.equals(b.ciphertext)).toBe(false);
    expect(a.iv.equals(b.iv)).toBe(false);
  });

  it('fails decryption with tampered tag', () => {
    const enc = service.encrypt('secret');
    enc.tag[0] = enc.tag[0]! ^ 0xff;
    expect(() => service.decrypt(enc)).toThrow();
  });
});
