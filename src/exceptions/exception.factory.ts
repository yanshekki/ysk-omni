import { ErrorCodes } from './error-codes';
import { HttpException } from './http.exception';

export const ExceptionFactory = {
  unauthorized(message = 'Invalid or missing API key'): HttpException {
    return new HttpException(401, message, ErrorCodes.UNAUTHORIZED);
  },

  forbidden(message = 'Forbidden'): HttpException {
    return new HttpException(403, message, ErrorCodes.FORBIDDEN);
  },

  notFound(resource = 'Resource'): HttpException {
    return new HttpException(404, `${resource} not found`, ErrorCodes.NOT_FOUND);
  },

  validation(message: string, details?: unknown): HttpException {
    return new HttpException(400, message, ErrorCodes.VALIDATION_ERROR, details);
  },

  rateLimited(message = 'Rate limit exceeded'): HttpException {
    return new HttpException(429, message, ErrorCodes.RATE_LIMITED);
  },

  concurrencyLimit(message = 'Too many concurrent engine jobs'): HttpException {
    return new HttpException(429, message, ErrorCodes.CONCURRENCY_LIMIT);
  },

  engineError(message: string, details?: unknown): HttpException {
    return new HttpException(502, message, ErrorCodes.ENGINE_ERROR, details);
  },

  engineTimeout(message = 'The local engine timed out'): HttpException {
    return new HttpException(504, message, ErrorCodes.ENGINE_TIMEOUT);
  },

  engineNotAvailable(message = 'The local engine is not available'): HttpException {
    return new HttpException(503, message, ErrorCodes.ENGINE_NOT_AVAILABLE);
  },

  engineUnconfigured(
    message = 'Text runtime is not attached',
    details?: unknown,
  ): HttpException {
    return new HttpException(501, message, ErrorCodes.ENGINE_UNCONFIGURED, details);
  },

  invalidCwd(message = 'Working directory is not allowed'): HttpException {
    return new HttpException(400, message, ErrorCodes.INVALID_CWD);
  },

  documentTooLarge(maxBytes: number): HttpException {
    return new HttpException(
      413,
      `Document exceeds maximum size of ${maxBytes} bytes`,
      ErrorCodes.DOCUMENT_TOO_LARGE,
    );
  },

  documentTypeNotAllowed(message = 'Document type is not allowed'): HttpException {
    return new HttpException(415, message, ErrorCodes.DOCUMENT_TYPE_NOT_ALLOWED);
  },

  internal(message = 'Internal server error', details?: unknown): HttpException {
    return new HttpException(500, message, ErrorCodes.INTERNAL_ERROR, details);
  },

  serviceUnavailable(message = 'Service unavailable'): HttpException {
    return new HttpException(503, message, ErrorCodes.SERVICE_UNAVAILABLE);
  },

  queueFull(message = 'Chat queue is full'): HttpException {
    return new HttpException(429, message, ErrorCodes.QUEUE_FULL);
  },

  queueUnavailable(message = 'Chat queue is paused or draining'): HttpException {
    return new HttpException(503, message, ErrorCodes.QUEUE_PAUSED);
  },

  queueTimeout(message = 'Timed out waiting in chat queue'): HttpException {
    return new HttpException(504, message, ErrorCodes.QUEUE_TIMEOUT);
  },

  queueCancelled(message = 'Chat job was cancelled'): HttpException {
    return new HttpException(409, message, ErrorCodes.QUEUE_CANCELLED);
  },

  mediaNotSupported(
    message = 'Media API is disabled',
    details?: unknown,
  ): HttpException {
    return new HttpException(
      501,
      message,
      ErrorCodes.MEDIA_NOT_SUPPORTED,
      details,
    );
  },

  mediaProviderUnavailable(
    message = 'Media provider is not available',
    details?: unknown,
  ): HttpException {
    return new HttpException(
      503,
      message,
      ErrorCodes.MEDIA_PROVIDER_UNAVAILABLE,
      details,
    );
  },

  mediaGenerationFailed(
    message = 'Media generation failed',
    details?: unknown,
  ): HttpException {
    return new HttpException(
      502,
      message,
      ErrorCodes.MEDIA_GENERATION_FAILED,
      details,
    );
  },

  mediaForbidden(
    message = 'Media generation is not allowed for this API key',
    details?: unknown,
  ): HttpException {
    return new HttpException(403, message, ErrorCodes.MEDIA_FORBIDDEN, details);
  },

  modelNotAllowed(model?: string | null): HttpException {
    const id = (model || '').trim();
    return new HttpException(
      403,
      id
        ? `Model "${id}" is not allowed for this API key`
        : 'Model is not allowed for this API key',
      ErrorCodes.MODEL_NOT_ALLOWED,
      { reason: 'model_not_allowed', model: id || null },
    );
  },

  /**
   * Admin API feature flag is off.
   * `feature` is a stable id for Admin i18n (imagesApi, videoApi, audioApi, tools, …).
   */
  featureDisabled(
    feature: string,
    message?: string,
  ): HttpException {
    return new HttpException(
      501,
      message || `Feature is disabled: ${feature}`,
      ErrorCodes.FEATURE_DISABLED,
      { feature },
    );
  },
};
