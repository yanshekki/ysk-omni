import type {
  GrokToolCall,
  GrokUsage,
} from '../interfaces/grok-collected-output.interface';
import type { GrokResponseMeta } from '../interfaces/grok-response-meta.interface';
import { createId } from './id';

/** Parse usage object from Grok end event. */
export function parseGrokUsage(raw: unknown): GrokUsage | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const u = raw as Record<string, unknown>;
  const out: GrokUsage = {};
  if (typeof u.input_tokens === 'number') out.input_tokens = u.input_tokens;
  if (typeof u.output_tokens === 'number') out.output_tokens = u.output_tokens;
  if (typeof u.total_tokens === 'number') out.total_tokens = u.total_tokens;
  if (typeof u.reasoning_tokens === 'number') {
    out.reasoning_tokens = u.reasoning_tokens;
  }
  if (typeof u.cache_read_input_tokens === 'number') {
    out.cache_read_input_tokens = u.cache_read_input_tokens;
  }
  if (typeof u.cache_creation_input_tokens === 'number') {
    out.cache_creation_input_tokens = u.cache_creation_input_tokens;
  }
  if (typeof u.inputTokens === 'number') out.input_tokens = u.inputTokens;
  if (typeof u.outputTokens === 'number') out.output_tokens = u.outputTokens;
  if (typeof u.totalTokens === 'number') out.total_tokens = u.totalTokens;
  if (typeof u.cacheReadInputTokens === 'number') {
    out.cache_read_input_tokens = u.cacheReadInputTokens;
  }
  if (typeof u.cacheCreationInputTokens === 'number') {
    out.cache_creation_input_tokens = u.cacheCreationInputTokens;
  }
  if (typeof u.usage_is_incomplete === 'boolean') {
    out.usage_is_incomplete = u.usage_is_incomplete;
  }
  if (typeof u.cost_is_partial === 'boolean') {
    out.cost_is_partial = u.cost_is_partial;
  }
  if (typeof u.total_cost_usd === 'number') {
    out.total_cost_usd = u.total_cost_usd;
  }
  if (typeof u.total_cost_usd_ticks === 'number') {
    out.total_cost_usd_ticks = u.total_cost_usd_ticks;
  }
  if (
    out.input_tokens == null &&
    out.output_tokens == null &&
    out.total_tokens == null &&
    out.cache_read_input_tokens == null &&
    out.cache_creation_input_tokens == null
  ) {
    return undefined;
  }
  if (out.total_tokens == null) {
    out.total_tokens =
      (out.input_tokens || 0) +
      (out.cache_read_input_tokens || 0) +
      (out.cache_creation_input_tokens || 0) +
      (out.output_tokens || 0);
  }
  return out;
}

function newToolCallId(): string {
  return `call_${createId().replace(/-/g, '').slice(0, 24)}`;
}

/**
 * Extract OpenAI-style tool_calls from Grok stream events.
 * Handles multiple event shapes (tool_call, tool_use, function_call, batches).
 */
export function parseGrokToolCallEvent(event: {
  type?: string;
  data?: unknown;
  [k: string]: unknown;
}): GrokToolCall[] {
  const t = String(event.type || '').toLowerCase();
  const out: GrokToolCall[] = [];
  if (
    t === 'tool_call_update' ||
    t === 'usage' ||
    t === 'plan' ||
    t === 'available_commands' ||
    t === 'thought' ||
    t === 'text'
  ) {
    return out;
  }

  const push = (name: string, args: unknown, id?: string) => {
    if (!name) return;
    out.push({
      id: id || newToolCallId(),
      type: 'function',
      function: {
        name,
        arguments:
          typeof args === 'string' ? args : JSON.stringify(args ?? {}),
      },
    });
  };

  const fromObj = (d: Record<string, unknown>) => {
    const fn =
      d.function && typeof d.function === 'object'
        ? (d.function as { name?: string; arguments?: unknown })
        : undefined;
    const name = String(
      d.name ||
        d.tool ||
        d.toolName ||
        d.tool_name ||
        fn?.name ||
        '',
    );
    const args =
      d.arguments ??
      d.rawInput ??
      d.input ??
      d.parameters ??
      d.args ??
      fn?.arguments;
    const id =
      (typeof d.id === 'string' && d.id) ||
      (typeof d.toolCallId === 'string' && d.toolCallId) ||
      undefined;
    push(name, args, id);
  };

  if (
    t === 'tool_call' ||
    t === 'tool' ||
    t === 'function_call' ||
    t === 'tool_use' ||
    t === 'tool_request' ||
    t === 'invoke_tool'
  ) {
    const d =
      event.data && typeof event.data === 'object'
        ? (event.data as Record<string, unknown>)
        : (event as Record<string, unknown>);
    fromObj(d);
  }

  // Nested data.tool_calls
  const dataObj =
    event.data && typeof event.data === 'object'
      ? (event.data as Record<string, unknown>)
      : null;
  if (dataObj && Array.isArray(dataObj.tool_calls)) {
    for (const tc of dataObj.tool_calls) {
      if (tc && typeof tc === 'object') fromObj(tc as Record<string, unknown>);
    }
  }

  if (Array.isArray(event.tool_calls)) {
    for (const tc of event.tool_calls) {
      if (tc && typeof tc === 'object') fromObj(tc as Record<string, unknown>);
    }
  }

  // end event sometimes embeds tool_calls
  if (t === 'end' && Array.isArray(event.tool_calls)) {
    for (const tc of event.tool_calls) {
      if (tc && typeof tc === 'object') fromObj(tc as Record<string, unknown>);
    }
  }

  return out;
}

export function usageToOpenAi(u?: GrokUsage): {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  prompt_tokens_details?: {
    cached_tokens?: number;
    cache_creation_tokens?: number;
  };
} {
  const cached = u?.cache_read_input_tokens;
  const created = u?.cache_creation_input_tokens;
  const prompt =
    (u?.input_tokens ?? 0) + (cached ?? 0) + (created ?? 0);
  const completion = u?.output_tokens ?? 0;
  const details =
    cached != null || created != null
      ? {
          ...(cached != null ? { cached_tokens: cached } : {}),
          ...(created != null ? { cache_creation_tokens: created } : {}),
        }
      : undefined;
  return {
    prompt_tokens: prompt,
    completion_tokens: completion,
    total_tokens: u?.total_tokens ?? prompt + completion,
    ...(details && Object.keys(details).length
      ? { prompt_tokens_details: details }
      : {}),
  };
}

export function grokUsageToMetaCost(
  u?: GrokUsage,
): GrokResponseMeta['cost'] | undefined {
  if (!u) return undefined;
  if (
    u.total_cost_usd == null &&
    u.total_cost_usd_ticks == null &&
    u.cost_is_partial == null &&
    u.usage_is_incomplete == null
  ) {
    return undefined;
  }
  return {
    total_cost_usd: u.total_cost_usd,
    total_cost_usd_ticks: u.total_cost_usd_ticks,
    cost_is_partial: u.cost_is_partial,
    usage_is_incomplete: u.usage_is_incomplete,
  };
}
