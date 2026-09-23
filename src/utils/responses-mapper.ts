import type { CreateChatCompletionDto } from '../dto/chat.dto';
import type { CreateResponseDto } from '../dto/responses.dto';
import type { OpenAiChatCompletion } from '../interfaces/open-ai-chat-completion.interface';
import type { OpenAiResponse } from '../interfaces/open-ai-response.interface';
import { createResponseId, createId } from './id';

export function responsesDtoToChatDto(dto: CreateResponseDto): CreateChatCompletionDto {
  return {
    model: dto.model,
    messages: dto.messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
    stream: Boolean(dto.stream),
    temperature: dto.temperature,
    max_tokens: dto.max_output_tokens,
    include_reasoning: dto.include_reasoning !== false,
    tools: dto.tools as CreateChatCompletionDto['tools'],
    reasoning_effort: dto.reasoning_effort,
  };
}

export function chatCompletionToResponse(
  completion: OpenAiChatCompletion,
  opts?: { responseId?: string },
): OpenAiResponse {
  const text = completion.choices?.[0]?.message?.content ?? '';
  const responseId = opts?.responseId || createResponseId();
  const msgId = `msg_${createId().replace(/-/g, '').slice(0, 24)}`;
  const created = completion.created || Math.floor(Date.now() / 1000);

  return {
    id: responseId,
    object: 'response',
    created_at: created,
    status: 'completed',
    error: null,
    incomplete_details: null,
    model: completion.model,
    output: [
      {
        type: 'message',
        id: msgId,
        status: 'completed',
        role: 'assistant',
        content: [
          {
            type: 'output_text',
            text: text || '',
            annotations: [],
          },
        ],
      },
    ],
    usage: {
      input_tokens: completion.usage?.prompt_tokens ?? 0,
      output_tokens: completion.usage?.completion_tokens ?? 0,
      total_tokens: completion.usage?.total_tokens ?? 0,
    },
  };
}
