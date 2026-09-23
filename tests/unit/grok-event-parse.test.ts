import { describe, expect, it } from 'vitest';
import {
  parseGrokToolCallEvent,
  parseGrokUsage,
} from '../../src/utils/grok-event-parse';

describe('grok-event-parse', () => {
  it('parses usage camelCase and snake_case', () => {
    expect(
      parseGrokUsage({ input_tokens: 1, output_tokens: 2 })?.total_tokens,
    ).toBe(3);
    expect(
      parseGrokUsage({ inputTokens: 4, outputTokens: 5 })?.total_tokens,
    ).toBe(9);
  });

  it('includes cache buckets in total_tokens', () => {
    const u = parseGrokUsage({
      input_tokens: 10,
      cache_read_input_tokens: 40,
      cache_creation_input_tokens: 5,
      output_tokens: 3,
    });
    expect(u?.total_tokens).toBe(58);
    expect(u?.cache_creation_input_tokens).toBe(5);
  });

  it('maps ACP tool_call toolName/rawInput/toolCallId', () => {
    const calls = parseGrokToolCallEvent({
      type: 'tool_call',
      toolCallId: 'call_1',
      toolName: 'read_file',
      rawInput: { path: 'src/main.rs' },
    });
    expect(calls[0]?.id).toBe('call_1');
    expect(calls[0]?.function.name).toBe('read_file');
    expect(JSON.parse(calls[0]!.function.arguments)).toEqual({
      path: 'src/main.rs',
    });
  });

  it('ignores tool_call_update', () => {
    expect(
      parseGrokToolCallEvent({
        type: 'tool_call_update',
        toolCallId: 'call_1',
        toolName: 'read_file',
        rawInput: { path: 'x' },
      }),
    ).toEqual([]);
  });

  it('parses multiple tool event shapes', () => {
    const a = parseGrokToolCallEvent({
      type: 'tool_use',
      name: 'search',
      input: { q: 'x' },
      id: 'id1',
    });
    expect(a[0]?.function.name).toBe('search');

    const b = parseGrokToolCallEvent({
      type: 'tool_call',
      data: {
        function: { name: 'fn', arguments: '{"a":1}' },
        id: 'id2',
      },
    });
    expect(b[0]?.function.name).toBe('fn');

    const c = parseGrokToolCallEvent({
      type: 'end',
      tool_calls: [
        {
          id: 'id3',
          function: { name: 'batch', arguments: '{}' },
        },
      ],
    });
    expect(c[0]?.function.name).toBe('batch');
  });
});
