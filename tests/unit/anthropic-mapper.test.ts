import { describe, expect, it } from 'vitest';
import {
  anthropicMessageToOpenAiMessages,
  anthropicToChatDto,
  anthropicToolsToOpenAi,
  chatCompletionToAnthropicMessage,
  mapAnthropicStopReason,
} from '../../src/utils/anthropic-mapper';
import { anthropicMessagesSchema } from '../../src/dto/anthropic-messages.dto';

describe('anthropic-mapper', () => {
  it('maps system + messages to chat DTO', () => {
    const dto = anthropicToChatDto({
      model: 'grok-4.5',
      max_tokens: 100,
      system: 'You are helpful',
      messages: [{ role: 'user', content: 'hi' }],
      stream: false,
      include_reasoning: false,
    });
    expect(dto.model).toBe('grok-4.5');
    expect(dto.messages[0]?.role).toBe('system');
    expect(dto.messages[1]?.content).toBe('hi');
    expect(dto.max_tokens).toBe(100);
  });

  it('maps tool_use + tool_result multi-turn', () => {
    const msgs = anthropicMessageToOpenAiMessages({
      role: 'assistant',
      content: [
        { type: 'text', text: 'calling' },
        {
          type: 'tool_use',
          id: 'toolu_1',
          name: 'get_weather',
          input: { city: 'HK' },
        },
      ],
    });
    expect(msgs[0]?.role).toBe('assistant');
    expect(
      (msgs[0] as { tool_calls?: unknown[] }).tool_calls?.length,
    ).toBe(1);

    const results = anthropicMessageToOpenAiMessages({
      role: 'user',
      content: [
        {
          type: 'tool_result',
          tool_use_id: 'toolu_1',
          content: '28C',
        },
      ],
    });
    expect(results.some((m) => m.role === 'tool')).toBe(true);
  });

  it('maps image blocks to OpenAI image_url parts', () => {
    const msgs = anthropicMessageToOpenAiMessages({
      role: 'user',
      content: [
        { type: 'text', text: 'what is this?' },
        {
          type: 'image',
          source: {
            type: 'base64',
            media_type: 'image/png',
            data: 'aaa',
          },
        },
      ],
    });
    const content = msgs[0]?.content;
    expect(Array.isArray(content)).toBe(true);
    expect(
      (content as Array<Record<string, unknown>>).some(
        (p) => p.type === 'image_url',
      ),
    ).toBe(true);
  });

  it('maps Anthropic tools to OpenAI function tools', () => {
    const tools = anthropicToolsToOpenAi([
      {
        name: 'get_weather',
        description: 'weather',
        input_schema: { type: 'object', properties: { city: { type: 'string' } } },
      },
    ]);
    expect(tools?.[0]).toMatchObject({
      type: 'function',
      function: { name: 'get_weather' },
    });
  });

  it('accepts tool_use in Zod schema (no longer rejected)', () => {
    const parsed = anthropicMessagesSchema.parse({
      model: 'grok-4.5',
      max_tokens: 32,
      messages: [
        {
          role: 'user',
          content: [{ type: 'text', text: 'hi' }],
        },
        {
          role: 'assistant',
          content: [
            {
              type: 'tool_use',
              id: 't1',
              name: 'fn',
              input: {},
            },
          ],
        },
      ],
      tools: [{ name: 'fn', input_schema: { type: 'object' } }],
    });
    expect(Array.isArray(parsed.messages[1]?.content)).toBe(true);
  });

  it('maps completion tool_calls to Anthropic tool_use blocks', () => {
    const msg = chatCompletionToAnthropicMessage({
      id: 'chatcmpl_x',
      object: 'chat.completion',
      created: 1,
      model: 'grok-4.5',
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: null,
            tool_calls: [
              {
                id: 'call_1',
                type: 'function',
                function: {
                  name: 'get_weather',
                  arguments: '{"city":"HK"}',
                },
              },
            ],
          },
          finish_reason: 'tool_calls',
          logprobs: null,
        },
      ],
      usage: { prompt_tokens: 1, completion_tokens: 2, total_tokens: 3 },
    });
    expect(msg.stop_reason).toBe('tool_use');
    expect(msg.content.some((b) => b.type === 'tool_use')).toBe(true);
  });

  it('maps completion to Anthropic text message envelope', () => {
    const msg = chatCompletionToAnthropicMessage({
      id: 'chatcmpl_x',
      object: 'chat.completion',
      created: 1,
      model: 'grok-4.5',
      choices: [
        {
          index: 0,
          message: { role: 'assistant', content: 'pong' },
          finish_reason: 'stop',
          logprobs: null,
        },
      ],
      usage: { prompt_tokens: 1, completion_tokens: 2, total_tokens: 3 },
    });
    expect(msg.type).toBe('message');
    expect(msg.role).toBe('assistant');
    const text = msg.content.find((b) => b.type === 'text');
    expect(text && text.type === 'text' ? text.text : '').toBe('pong');
    expect(msg.stop_reason).toBe('end_turn');
  });

  it('maps stop reasons', () => {
    expect(mapAnthropicStopReason('max_tokens')).toBe('max_tokens');
    expect(mapAnthropicStopReason('content_filter')).toBe('refusal');
    expect(mapAnthropicStopReason('tool_calls')).toBe('tool_use');
    expect(mapAnthropicStopReason(undefined)).toBe('end_turn');
  });
});
