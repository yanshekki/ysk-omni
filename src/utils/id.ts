import { randomBytes, randomUUID } from 'node:crypto';

export { createApiKeySecret, apiKeyPrefix } from './api-key-crypto';

export function createId(): string {
  return randomUUID();
}

export function createRequestId(): string {
  return `req_${randomBytes(12).toString('hex')}`;
}

export function createChatCompletionId(): string {
  return `chatcmpl_${randomBytes(12).toString('hex')}`;
}

export function createMessageId(): string {
  return `msg_${randomBytes(12).toString('hex')}`;
}

export function createResponseId(): string {
  return `resp_${randomBytes(12).toString('hex')}`;
}
