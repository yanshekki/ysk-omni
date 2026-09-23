import type { ErrorCode } from './error-codes';
import { ErrorCodes } from './error-codes';

export class HttpException extends Error {
  readonly statusCode: number;
  readonly code: ErrorCode;
  readonly details?: unknown;
  readonly type: string;

  constructor(
    statusCode: number,
    message: string,
    code: ErrorCode = ErrorCodes.INTERNAL_ERROR,
    details?: unknown,
  ) {
    super(message);
    this.name = 'HttpException';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.type = mapType(statusCode);
  }
}

function mapType(statusCode: number): string {
  if (statusCode === 401) return 'invalid_request_error';
  if (statusCode === 403) return 'invalid_request_error';
  if (statusCode === 404) return 'invalid_request_error';
  if (statusCode === 429) return 'rate_limit_error';
  if (statusCode >= 500) return 'server_error';
  return 'invalid_request_error';
}

export function toOpenAiErrorBody(err: HttpException): {
  error: {
    message: string;
    type: string;
    code: string;
    param: null;
    details?: unknown;
  };
} {
  return {
    error: {
      message: err.message,
      type: err.type,
      code: err.code,
      param: null,
      ...(err.details !== undefined ? { details: err.details } : {}),
    },
  };
}

/** Anthropic Messages API error envelope */
export function toAnthropicErrorBody(err: HttpException): {
  type: 'error';
  error: {
    type: string;
    message: string;
  };
} {
  let type = 'api_error';
  if (err.statusCode === 401) type = 'authentication_error';
  else if (err.statusCode === 403) type = 'permission_error';
  else if (err.statusCode === 404) type = 'not_found_error';
  else if (err.statusCode === 429) type = 'rate_limit_error';
  else if (err.statusCode === 400) type = 'invalid_request_error';
  return {
    type: 'error',
    error: {
      type,
      message: err.message,
    },
  };
}

/** Pick error JSON shape by request path (multi-protocol gateway). */
export function toProtocolErrorBody(
  err: HttpException,
  path: string,
): unknown {
  if (path.includes('/v1/messages')) {
    return toAnthropicErrorBody(err);
  }
  return toOpenAiErrorBody(err);
}
