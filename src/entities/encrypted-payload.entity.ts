export interface EncryptedPayload {
  ciphertext: Buffer;
  iv: Buffer;
  tag: Buffer;
}
