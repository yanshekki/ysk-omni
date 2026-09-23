/**
 * Protocol-level tools + vision acceptance (mocked Grok).
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  apiFetch,
  mockGrokStream,
  startHarness,
  stopHarness,
  type Harness,
} from '../helpers/api-harness';
import { apiFeaturesService } from '../../src/services/api-features.service';

describe('v1 tools + vision protocol paths', () => {
  let h: Harness | null = null;

  beforeAll(async () => {
    h = await startHarness('tv');
    mockGrokStream('ok-with-tools');
    await apiFeaturesService.update({
      tools: true,
      vision: true,
      anthropicMessages: true,
      openaiResponses: true,
      openaiChat: true,
    });
  }, 60_000);

  afterAll(async () => {
    await stopHarness(h);
  });

  it('Chat accepts tools + image_url content', async () => {
    if (!h) return;
    const res = await apiFetch(h.baseUrl, '/v1/chat/completions', {
      method: 'POST',
      key: h.clientKey,
      body: {
        model: 'grok-4.5',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: 'what is in the image?' },
              {
                type: 'image_url',
                image_url: {
                  url: 'data:image/png;base64,iVBORw0KGgo=',
                },
              },
            ],
          },
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'lookup',
              parameters: { type: 'object' },
            },
          },
        ],
        stream: false,
      },
    });
    expect(res.status).toBe(200);
  });

  it('Anthropic messages accept tools + image + tool_result history', async () => {
    if (!h) return;
    const res = await apiFetch(h.baseUrl, '/v1/messages', {
      method: 'POST',
      key: h.clientKey,
      body: {
        model: 'grok-4.5',
        max_tokens: 64,
        tools: [
          {
            name: 'lookup',
            description: 'look',
            input_schema: { type: 'object', properties: {} },
          },
        ],
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: 'see image' },
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/png',
                  data: 'iVBORw0KGgo=',
                },
              },
            ],
          },
          {
            role: 'assistant',
            content: [
              {
                type: 'tool_use',
                id: 'toolu_x',
                name: 'lookup',
                input: {},
              },
            ],
          },
          {
            role: 'user',
            content: [
              {
                type: 'tool_result',
                tool_use_id: 'toolu_x',
                content: 'result data',
              },
            ],
          },
        ],
      },
    });
    expect(res.status).toBe(200);
    const body = res.json as { type: string; content: unknown[] };
    expect(body.type).toBe('message');
  });

  it('Responses accepts input_image', async () => {
    if (!h) return;
    const res = await apiFetch(h.baseUrl, '/v1/responses', {
      method: 'POST',
      key: h.clientKey,
      body: {
        model: 'grok-4.5',
        input: [
          {
            role: 'user',
            content: [
              { type: 'input_text', text: 'describe' },
              {
                type: 'input_image',
                image_url: 'data:image/png;base64,iVBORw0KGgo=',
              },
            ],
          },
        ],
        stream: false,
      },
    });
    expect(res.status).toBe(200);
  });

  it('vision feature gate still works', async () => {
    if (!h) return;
    await apiFeaturesService.update({ vision: false });
    const res = await apiFetch(h.baseUrl, '/v1/chat/completions', {
      method: 'POST',
      key: h.clientKey,
      body: {
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: 'x' },
              {
                type: 'image_url',
                image_url: { url: 'data:image/png;base64,xx' },
              },
            ],
          },
        ],
      },
    });
    expect(res.status).toBe(403);
    await apiFeaturesService.update({ vision: true });
  });
});
