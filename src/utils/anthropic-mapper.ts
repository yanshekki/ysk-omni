import type { CreateChatCompletionDto } from '../dto/chat.dto';
import type { AnthropicMessagesDto } from '../dto/anthropic-messages.dto';
import type {
  AnthropicContentBlock,
  AnthropicMessage,
} from '../interfaces/anthropic-message.interface';
import type { OpenAiChatCompletion } from '../interfaces/open-ai-chat-completion.interface';
import { createMessageId } from './id';

/** Convert Anthropic tools[] to OpenAI function tools format when needed. */
export function anthropicToolsToOpenAi(
  tools: unknown[] | undefined,
): CreateChatCompletionDto['tools'] {
  if (!tools?.length) return undefined;
  return tools.map((t) => {
    if (!t || typeof t !== 'object') return t;
    const o = t as Record<string, unknown>;
    // Already OpenAI-shaped
    if (o.type === 'function' && o.function) return t;
    // Anthropic: { name, description, input_schema }
    if (typeof o.name === 'string') {
      return {
        type: 'function',
        function: {
          name: o.name,
          description: o.description,
          parameters: o.input_schema ?? o.parameters ?? { type: 'object' },
        },
      };
    }
    return t;
  }) as CreateChatCompletionDto['tools'];
}

/**
 * Convert Anthropic image source → OpenAI image_url part.
 */
function anthropicImageToOpenAiPart(
  block: Record<string, unknown>,
): Record<string, unknown> | null {
  const source = block.source as Record<string, unknown> | undefined;
  if (!source || typeof source !== 'object') {
    if (typeof block.url === 'string') {
      return { type: 'image_url', image_url: { url: block.url } };
    }
    return null;
  }
  if (source.type === 'url' && typeof source.url === 'string') {
    return { type: 'image_url', image_url: { url: source.url } };
  }
  if (source.type === 'base64' && typeof source.data === 'string') {
    const media =
      typeof source.media_type === 'string' ? source.media_type : 'image/png';
    const dataUrl = source.data.startsWith('data:')
      ? source.data
      : `data:${media};base64,${source.data}`;
    return { type: 'image_url', image_url: { url: dataUrl } };
  }
  return null;
}

/**
 * Expand one Anthropic message into one or more OpenAI chat messages
 * (handles tool_use → tool_calls, tool_result → tool role, images → parts).
 */
export function anthropicMessageToOpenAiMessages(m: {
  role: string;
  content: string | Array<Record<string, unknown>>;
}): CreateChatCompletionDto['messages'] {
  if (typeof m.content === 'string') {
    return [{ role: m.role, content: m.content }];
  }
  if (!Array.isArray(m.content)) {
    return [{ role: m.role, content: String(m.content ?? '') }];
  }

  const out: CreateChatCompletionDto['messages'] = [];
  const textParts: string[] = [];
  const contentParts: Array<Record<string, unknown>> = [];
  const toolCalls: Array<{
    id: string;
    type: 'function';
    function: { name: string; arguments: string };
  }> = [];

  for (const block of m.content) {
    if (!block || typeof block !== 'object') continue;
    const b = block as Record<string, unknown>;
    const type = String(b.type || '');

    if (type === 'text' && typeof b.text === 'string') {
      textParts.push(b.text);
      contentParts.push({ type: 'text', text: b.text });
      continue;
    }
    if (type === 'image' || type === 'image_url') {
      const part =
        type === 'image_url' && b.image_url
          ? { type: 'image_url', image_url: b.image_url }
          : anthropicImageToOpenAiPart(b);
      if (part) contentParts.push(part);
      continue;
    }
    if (type === 'tool_use') {
      const id = String(b.id || `toolu_${Math.random().toString(36).slice(2, 12)}`);
      const name = String(b.name || 'tool');
      const input = b.input ?? {};
      toolCalls.push({
        id,
        type: 'function',
        function: {
          name,
          arguments:
            typeof input === 'string' ? input : JSON.stringify(input ?? {}),
        },
      });
      // Also keep a text trail for Grok prompt context
      textParts.push(
        `[tool_use name=${name} id=${id}] ${typeof input === 'string' ? input : JSON.stringify(input)}`,
      );
      continue;
    }
    if (type === 'tool_result') {
      const toolCallId = String(b.tool_use_id || b.tool_call_id || '');
      let resultText = '';
      if (typeof b.content === 'string') resultText = b.content;
      else if (Array.isArray(b.content)) {
        resultText = b.content
          .map((c) => {
            if (c && typeof c === 'object' && 'text' in c) {
              return String((c as { text: unknown }).text ?? '');
            }
            return '';
          })
          .filter(Boolean)
          .join('\n');
      } else if (b.content != null) {
        resultText = JSON.stringify(b.content);
      }
      out.push({
        role: 'tool',
        content: resultText || '(empty tool result)',
        // carried for mappers; OpenAI clients use tool_call_id
        ...(toolCallId
          ? ({ tool_call_id: toolCallId } as { tool_call_id: string })
          : {}),
      } as CreateChatCompletionDto['messages'][number]);
      continue;
    }
    // unknown block: try text field
    if (typeof b.text === 'string') textParts.push(b.text);
  }

  if (toolCalls.length && m.role === 'assistant') {
    out.unshift({
      role: 'assistant',
      content: textParts.join('\n') || null,
      tool_calls: toolCalls,
    } as CreateChatCompletionDto['messages'][number]);
    return out;
  }

  const hasImages = contentParts.some((p) => p.type === 'image_url');
  if (hasImages) {
    // Ensure text parts included
    const parts =
      contentParts.length > 0
        ? contentParts
        : textParts.map((t) => ({ type: 'text', text: t }));
    out.unshift({
      role: m.role,
      content: parts as CreateChatCompletionDto['messages'][number]['content'],
    });
    return out;
  }

  if (textParts.length || out.length === 0) {
    out.unshift({
      role: m.role,
      content: textParts.join('\n'),
    });
  }
  return out;
}

export function anthropicToChatDto(
  dto: AnthropicMessagesDto,
): CreateChatCompletionDto {
  const messages: CreateChatCompletionDto['messages'] = [];
  if (dto.system?.trim()) {
    messages.push({ role: 'system', content: dto.system });
  }
  for (const m of dto.messages) {
    messages.push(
      ...anthropicMessageToOpenAiMessages({
        role: m.role,
        content: m.content as string | Array<Record<string, unknown>>,
      }),
    );
  }

  return {
    model: dto.model,
    messages,
    stream: Boolean(dto.stream),
    temperature: dto.temperature,
    max_tokens: dto.max_tokens,
    top_p: dto.top_p,
    include_reasoning: Boolean(dto.include_reasoning),
    tools: anthropicToolsToOpenAi(dto.tools),
    tool_choice: dto.tool_choice,
    reasoning_effort:
      dto.thinking?.type === 'enabled' ? 'high' : undefined,
  };
}

export function chatCompletionToAnthropicMessage(
  completion: OpenAiChatCompletion,
  opts?: { messageId?: string },
): AnthropicMessage {
  const choice = completion.choices?.[0];
  const text = choice?.message?.content ?? '';
  const finish = choice?.finish_reason;
  const toolCalls = choice?.message?.tool_calls;

  let stopReason: string = 'end_turn';
  if (finish === 'length') stopReason = 'max_tokens';
  if (finish === 'content_filter') stopReason = 'refusal';
  if (finish === 'tool_calls' || (toolCalls?.length && !String(text || '').trim())) {
    stopReason = 'tool_use';
  }

  const content: AnthropicContentBlock[] = [];
  if (text && String(text).trim()) {
    content.push({ type: 'text', text: String(text) });
  }
  if (toolCalls?.length) {
    for (const tc of toolCalls) {
      let input: Record<string, unknown> = {};
      try {
        input = JSON.parse(tc.function.arguments || '{}') as Record<
          string,
          unknown
        >;
      } catch {
        input = { raw: tc.function.arguments };
      }
      content.push({
        type: 'tool_use',
        id: tc.id,
        name: tc.function.name,
        input,
      });
    }
  }
  if (!content.length) {
    content.push({ type: 'text', text: '' });
  }

  return {
    id: opts?.messageId || createMessageId(),
    type: 'message',
    role: 'assistant',
    model: completion.model,
    content,
    stop_reason: stopReason,
    stop_sequence: null,
    usage: {
      input_tokens: completion.usage?.prompt_tokens ?? 0,
      output_tokens: completion.usage?.completion_tokens ?? 0,
    },
  };
}

export function mapAnthropicStopReason(stopReason?: string): string {
  if (!stopReason) return 'end_turn';
  const lower = stopReason.toLowerCase();
  if (lower.includes('tool')) return 'tool_use';
  if (lower.includes('length') || lower.includes('max')) return 'max_tokens';
  if (lower.includes('filter')) return 'refusal';
  return 'end_turn';
}
