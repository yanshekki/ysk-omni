import { describe, expect, it } from 'vitest';
import { ExceptionFactory } from '../../src/exceptions/exception.factory';
import { toOpenAiErrorBody } from '../../src/exceptions/http.exception';

describe('ExceptionFactory', () => {
  it('builds unauthorized OpenAI-shaped errors', () => {
    const err = ExceptionFactory.unauthorized();
    expect(err.statusCode).toBe(401);
    const body = toOpenAiErrorBody(err);
    expect(body.error.code).toBe('unauthorized');
    expect(body.error.type).toBe('invalid_request_error');
  });

  it('maps rate limit type', () => {
    const err = ExceptionFactory.rateLimited();
    expect(err.statusCode).toBe(429);
    expect(toOpenAiErrorBody(err).error.type).toBe('rate_limit_error');
  });
});
