import { describe, expect, it } from 'vitest';
import {
  chatCompletionToResponse,
  responsesDtoToChatDto,
} from '../../src/utils/responses-mapper';

describe('responses-mapper', () => {
  it('maps CreateResponseDto-like to chat DTO', () => {
    const dto = responsesDtoToChatDto({
      model: 'grok-4.5',
      messages: [{ role: 'user', content: 'hi' }],
      stream: false,
      include_reasoning: true,
      max_output_tokens: 50,
      temperature: 0.5,
    });
    expect(dto.messages[0]?.content).toBe('hi');
    expect(dto.max_tokens).toBe(50);
    expect(dto.temperature).toBe(0.5);
  });

  it('maps chat completion to Responses object', () => {
    const r = chatCompletionToResponse(
      {
        id: 'chatcmpl_1',
        object: 'chat.completion',
        created: 100,
        model: 'grok-4.5',
        choices: [
          {
            index: 0,
            message: { role: 'assistant', content: 'ok' },
            finish_reason: 'stop',
            logprobs: null,
          },
        ],
        usage: { prompt_tokens: 2, completion_tokens: 3, total_tokens: 5 },
      },
      { responseId: 'resp_test' },
    );
    expect(r.id).toBe('resp_test');
    expect(r.object).toBe('response');
    expect(r.status).toBe('completed');
    expect(r.output[0]?.content[0]?.text).toBe('ok');
    expect(r.usage.total_tokens).toBe(5);
  });
});
