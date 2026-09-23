import { describe, expect, it } from 'vitest';
import {
  HttpException,
  toAnthropicErrorBody,
  toOpenAiErrorBody,
  toProtocolErrorBody,
} from '../../src/exceptions/http.exception';
import { ErrorCodes } from '../../src/exceptions/error-codes';

describe('protocol error bodies', () => {
  const err = new HttpException(
    401,
    'bad key',
    ErrorCodes.UNAUTHORIZED,
  );

  it('OpenAI envelope', () => {
    const body = toOpenAiErrorBody(err);
    expect(body.error.message).toBe('bad key');
    expect(body.error.code).toBe(ErrorCodes.UNAUTHORIZED);
    expect(body.error.type).toBeTruthy();
  });

  it('Anthropic envelope', () => {
    const body = toAnthropicErrorBody(err);
    expect(body.type).toBe('error');
    expect(body.error.type).toBe('authentication_error');
    expect(body.error.message).toBe('bad key');
  });

  it('picks Anthropic for /v1/messages path', () => {
    const a = toProtocolErrorBody(err, '/v1/messages');
    expect((a as { type: string }).type).toBe('error');
    const o = toProtocolErrorBody(err, '/v1/chat/completions');
    expect((o as { error: { message: string } }).error.message).toBe('bad key');
  });
});
