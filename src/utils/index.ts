/** Shared utilities barrel. Prefer direct imports when a single helper is needed. */

export { asyncHandler } from './async-handler';
export {
  createId,
  createRequestId,
  createChatCompletionId,
  createMessageId,
  createResponseId,
  createApiKeySecret,
  apiKeyPrefix,
} from './id';
export {
  hashApiKey,
  hashApiKeySha256,
  scryptHash,
  verifyApiKey,
} from './api-key-crypto';
export { normalizeApiKeyRole, normalizeApiKeyMode } from './role-normalize';
export {
  isSyntheticApiKeyId,
  toAuditApiKeyId,
  toPersistentApiKeyId,
} from './api-key-id';
export {
  flattenMessageContent,
  messageHasImageParts,
  messagesToPrompt,
} from './message-content';
export {
  readIdempotencyKey,
  scopedIdempotencyKey,
  readIdempotencyKeyScoped,
} from './request-meta';
export { logger } from './logger';
export {
  mapGrokToChatCompletion,
  mapTextDeltaChunk,
  mapReasoningDeltaChunk,
  mapRoleChunk,
  mapFinishChunk,
  mapModelsList,
} from './openai-mapper';
export {
  initSse,
  writeSseData,
  writeSseDone,
  writeSseEvent,
} from './stream';
export {
  anthropicToChatDto,
  chatCompletionToAnthropicMessage,
  mapAnthropicStopReason,
} from './anthropic-mapper';
export {
  responsesDtoToChatDto,
  chatCompletionToResponse,
} from './responses-mapper';
