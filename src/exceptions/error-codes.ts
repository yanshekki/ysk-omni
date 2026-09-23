export const ErrorCodes = {
  UNAUTHORIZED: 'unauthorized',
  FORBIDDEN: 'forbidden',
  NOT_FOUND: 'not_found',
  VALIDATION_ERROR: 'validation_error',
  RATE_LIMITED: 'rate_limit_exceeded',
  CONCURRENCY_LIMIT: 'concurrency_limit_exceeded',
  INTERNAL_ERROR: 'internal_error',
  GROK_ERROR: 'grok_error',
  GROK_TIMEOUT: 'grok_timeout',
  GROK_NOT_AVAILABLE: 'grok_not_available',
  DOCUMENT_TOO_LARGE: 'document_too_large',
  DOCUMENT_TYPE_NOT_ALLOWED: 'document_type_not_allowed',
  INVALID_CWD: 'invalid_cwd',
  SERVICE_UNAVAILABLE: 'service_unavailable',
  QUEUE_FULL: 'queue_full',
  QUEUE_PAUSED: 'queue_draining',
  QUEUE_TIMEOUT: 'queue_wait_timeout',
  QUEUE_CANCELLED: 'queue_cancelled',
  MEDIA_NOT_SUPPORTED: 'media_not_supported',
  MEDIA_PROVIDER_UNAVAILABLE: 'media_provider_unavailable',
  MEDIA_GENERATION_FAILED: 'media_generation_failed',
  MEDIA_FORBIDDEN: 'media_forbidden',
  /** API feature flag off — details.feature e.g. imagesApi | videoApi | tools */
  FEATURE_DISABLED: 'feature_disabled',
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];
