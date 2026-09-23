import type { GrokJsonResult } from '../interfaces/grok-json-result.interface';
import type { GrokResponseMeta } from '../interfaces/grok-response-meta.interface';
import type { MapCompletionOptions } from '../interfaces/map-completion-options.interface';
import type { OpenAiChatCompletion } from '../interfaces/open-ai-chat-completion.interface';
import type { OpenAiChatCompletionChunk } from '../interfaces/open-ai-chat-completion-chunk.interface';
import type { OpenAiModel } from '../interfaces/open-ai-model.interface';
import type { OpenAiModelList } from '../interfaces/open-ai-model-list.interface';
import { createChatCompletionId } from './id';

export function mapGrokToChatCompletion(
  model: string,
  result: GrokJsonResult,
  options: MapCompletionOptions = {},
): OpenAiChatCompletion {
  const completionId = options.completionId ?? createChatCompletionId();
  const includeReasoning = options.includeReasoning !== false;
  const reasoning =
    includeReasoning && options.reasoningContent
      ? options.reasoningContent
      : null;

  const toolCalls = options.toolCalls?.length ? options.toolCalls : undefined;
  const message: OpenAiChatCompletion['choices'][0]['message'] = {
    role: 'assistant',
    content: toolCalls?.length && !(result.text ?? '').trim() ? null : (result.text ?? ''),
  };

  if (includeReasoning && reasoning) {
    message.reasoning_content = reasoning;
    message.thought = reasoning; // Grok alias
  } else if (includeReasoning) {
    message.reasoning_content = null;
    message.thought = null;
  }
  if (toolCalls?.length) {
    message.tool_calls = toolCalls;
  }

  let finishReason = mapStopReason(result.stopReason ?? options.grok?.stopReason);
  if (toolCalls?.length && !(result.text ?? '').trim()) {
    finishReason = 'tool_calls';
  }

  const usage = options.usage || {
    prompt_tokens: 0,
    completion_tokens: 0,
    total_tokens: 0,
  };

  const response: OpenAiChatCompletion = {
    id: completionId,
    object: 'chat.completion',
    created: Math.floor(Date.now() / 1000),
    model,
    choices: [
      {
        index: 0,
        message,
        finish_reason: finishReason,
        logprobs: null,
      },
    ],
    usage,
  };

  const grok = buildGrokMeta(result, options.grok);
  if (grok) {
    response.grok = grok;
  }

  return response;
}

export function mapTextDeltaChunk(
  model: string,
  content: string,
  completionId: string,
  created: number,
): OpenAiChatCompletionChunk {
  return {
    id: completionId,
    object: 'chat.completion.chunk',
    created,
    model,
    choices: [
      {
        index: 0,
        delta: { content },
        finish_reason: null,
      },
    ],
  };
}

/**
 * DeepSeek-compatible reasoning stream chunk.
 * Also sets Grok alias `thought` to the same string.
 */
export function mapReasoningDeltaChunk(
  model: string,
  reasoningContent: string,
  completionId: string,
  created: number,
  includeGrokAlias = true,
): OpenAiChatCompletionChunk {
  const delta: OpenAiChatCompletionChunk['choices'][0]['delta'] = {
    reasoning_content: reasoningContent,
  };
  if (includeGrokAlias) {
    delta.thought = reasoningContent;
  }
  return {
    id: completionId,
    object: 'chat.completion.chunk',
    created,
    model,
    choices: [
      {
        index: 0,
        delta,
        finish_reason: null,
      },
    ],
  };
}

export function mapRoleChunk(
  model: string,
  completionId: string,
  created: number,
): OpenAiChatCompletionChunk {
  return {
    id: completionId,
    object: 'chat.completion.chunk',
    created,
    model,
    choices: [
      {
        index: 0,
        delta: { role: 'assistant', content: '' },
        finish_reason: null,
      },
    ],
  };
}

export function mapFinishChunk(
  model: string,
  completionId: string,
  created: number,
  stopReason?: string,
  grok?: GrokResponseMeta,
): OpenAiChatCompletionChunk {
  const fr =
    stopReason === 'tool_calls'
      ? ('tool_calls' as const)
      : mapStopReason(stopReason);
  const chunk: OpenAiChatCompletionChunk = {
    id: completionId,
    object: 'chat.completion.chunk',
    created,
    model,
    choices: [
      {
        index: 0,
        delta: {},
        finish_reason: fr,
      },
    ],
  };
  if (
    grok &&
    (grok.sessionId || grok.stopReason || grok.requestId || grok.numTurns || grok.cost)
  ) {
    chunk.grok = grok;
  }
  return chunk;
}

export function mapModelsList(models: string[]): OpenAiModelList {
  const data: OpenAiModel[] = models.map((id) => ({
    id,
    object: 'model',
    created: Math.floor(Date.now() / 1000),
    owned_by: 'xai',
  }));
  return { object: 'list', data };
}

function mapStopReason(
  stopReason?: string,
): 'stop' | 'length' | 'content_filter' | 'tool_calls' {
  if (!stopReason) return 'stop';
  const lower = stopReason.toLowerCase();
  if (lower.includes('tool')) return 'tool_calls';
  if (lower.includes('length') || lower.includes('max')) return 'length';
  if (lower.includes('filter') || lower.includes('content')) return 'content_filter';
  return 'stop';
}

function buildGrokMeta(
  result: GrokJsonResult,
  extra?: GrokResponseMeta,
): GrokResponseMeta | undefined {
  const meta: GrokResponseMeta = {
    sessionId: extra?.sessionId ?? result.sessionId,
    stopReason: extra?.stopReason ?? result.stopReason,
    requestId: extra?.requestId ?? result.requestId,
    numTurns: extra?.numTurns,
    cost: extra?.cost,
  };
  if (
    !meta.sessionId &&
    !meta.stopReason &&
    !meta.requestId &&
    meta.numTurns == null &&
    !meta.cost
  ) {
    return undefined;
  }
  return meta;
}

/** @deprecated Import from `utils/message-content` */
export { messagesToPrompt } from './message-content';
