import { describe, expect, it } from 'vitest';
import {
  mapFinishChunk,
  mapGrokToChatCompletion,
  mapModelsList,
  mapReasoningDeltaChunk,
  mapRoleChunk,
  mapTextDeltaChunk,
  messagesToPrompt,
} from '../../src/utils/openai-mapper';

describe('openai-mapper', () => {
  it('messagesToPrompt uses single message content', () => {
    expect(messagesToPrompt([{ role: 'user', content: 'hi' }])).toBe('hi');
  });

  it('messagesToPrompt joins multi-turn messages', () => {
    expect(
      messagesToPrompt([
        { role: 'system', content: 'be brief' },
        { role: 'user', content: 'hi' },
      ]),
    ).toBe('system: be brief\nuser: hi');
  });

  it('maps grok json to OpenAI chat completion with reasoning', () => {
    const res = mapGrokToChatCompletion(
      'grok-4.5',
      { text: 'pong', stopReason: 'EndTurn', sessionId: 'sess-1' },
      {
        completionId: 'chatcmpl_test',
        reasoningContent: 'thinking...',
        includeReasoning: true,
      },
    );
    expect(res.object).toBe('chat.completion');
    expect(res.model).toBe('grok-4.5');
    expect(res.choices[0]?.message.content).toBe('pong');
    expect(res.choices[0]?.message.reasoning_content).toBe('thinking...');
    expect(res.choices[0]?.message.thought).toBe('thinking...');
    expect(res.choices[0]?.finish_reason).toBe('stop');
    expect(res.id).toBe('chatcmpl_test');
    expect(res.grok?.sessionId).toBe('sess-1');
    expect(res.grok?.stopReason).toBe('EndTurn');
  });

  it('omits reasoning when includeReasoning is false', () => {
    const res = mapGrokToChatCompletion(
      'grok-4.5',
      { text: 'pong' },
      {
        completionId: 'chatcmpl_test',
        reasoningContent: 'secret thought',
        includeReasoning: false,
      },
    );
    expect(res.choices[0]?.message.content).toBe('pong');
    expect(res.choices[0]?.message.reasoning_content).toBeUndefined();
    expect(res.choices[0]?.message.thought).toBeUndefined();
  });

  it('maps streaming chunks including reasoning', () => {
    const role = mapRoleChunk('m', 'id', 1);
    const reasoning = mapReasoningDeltaChunk('m', 'hmm', 'id', 1);
    const delta = mapTextDeltaChunk('m', 'he', 'id', 1);
    const end = mapFinishChunk('m', 'id', 1, 'EndTurn', {
      sessionId: 's1',
      stopReason: 'EndTurn',
    });
    expect(role.choices[0]?.delta.role).toBe('assistant');
    expect(reasoning.choices[0]?.delta.reasoning_content).toBe('hmm');
    expect(reasoning.choices[0]?.delta.thought).toBe('hmm');
    expect(delta.choices[0]?.delta.content).toBe('he');
    expect(end.choices[0]?.finish_reason).toBe('stop');
    expect(end.grok?.sessionId).toBe('s1');
  });

  it('maps model list', () => {
    const list = mapModelsList(['a', 'b']);
    expect(list.object).toBe('list');
    expect(list.data).toHaveLength(2);
    expect(list.data[0]?.owned_by).toBe('xai');
  });
});
