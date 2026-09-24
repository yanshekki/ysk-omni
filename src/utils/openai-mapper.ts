import type { EngineJsonResult } from '../interfaces/engine-json-result.interface';
import type { EngineResponseMeta } from '../interfaces/engine-response-meta.interface';
import type { MapCompletionOptions } from '../interfaces/map-completion-options.interface';
import type { OpenAiChatCompletion } from '../interfaces/open-ai-chat-completion.interface';
import type { OpenAiChatCompletionChunk } from '../interfaces/open-ai-chat-completion-chunk.interface';
import type { OpenAiModel } from '../interfaces/open-ai-model.interface';
import type { OpenAiModelList } from '../interfaces/open-ai-model-list.interface';
import { createChatCompletionId } from './id';

export function mapEngineToChatCompletion(
  model: string,
  result: EngineJsonResult,
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
    message.thought = reasoning; // legacy alias
  } else if (includeReasoning) {
    message.reasoning_content = null;
    message.thought = null;
  }
  if (toolCalls?.length) {
    message.tool_calls = toolCalls;
  }

  let finishReason = mapStopReason(result.stopReason ?? options.omni?.stopReason);
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

  const meta = buildEngineMeta(result, options.omni);
  if (meta) {
    response.omni = meta;
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
 * Also sets legacy alias `thought` to the same string.
 */
export function mapReasoningDeltaChunk(
  model: string,
  reasoningContent: string,
  completionId: string,
  created: number,
  includeThoughtAlias = true,
): OpenAiChatCompletionChunk {
  const delta: OpenAiChatCompletionChunk['choices'][0]['delta'] = {
    reasoning_content: reasoningContent,
  };
  if (includeThoughtAlias) {
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
  omni?: EngineResponseMeta,
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
    omni &&
    (omni.sessionId || omni.stopReason || omni.requestId || omni.numTurns || omni.cost)
  ) {
    chunk.omni = omni;
  }
  return chunk;
}

export function mapModelsList(models: string[]): OpenAiModelList {
  const data: OpenAiModel[] = models.map((id) => ({
    id,
    object: 'model',
    created: Math.floor(Date.now() / 1000),
    owned_by: 'ysk-omni',
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

function buildEngineMeta(
  result: EngineJsonResult,
  extra?: EngineResponseMeta,
): EngineResponseMeta | undefined {
  const meta: EngineResponseMeta = {
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
